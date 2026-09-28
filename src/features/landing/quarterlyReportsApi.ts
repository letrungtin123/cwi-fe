const apiBaseUrl = (import.meta.env.VITE_CWI_API_BASE_URL ?? 'http://localhost:8088').replace(/\/+$/, '')

type ApiSuccess<T> = { data: T }
type ApiFailure = { error?: { code?: string; message?: string } }

export type QuarterlyReportPublic = {
  id: string
  periodQuarter: number
  periodYear: number
  slug: string
  subtitle: string
  title: string
  pdfUrl: string
}

type QuarterlyReportDownloadResponse = {
  deduplicated: boolean
  downloadUrl: string
  expiresAt: string
  requestedAt: string
}

export type QuarterlyReportDownloadPayload = {
  clientMeta: Record<string, unknown>
  email: string
  fullName: string
  phone: string
  position: string
  privacyConsent: true
}

export class QuarterlyReportApiError extends Error {
  readonly code: string
  readonly status: number

  constructor(
    status: number,
    code: string,
    message: string,
  ) {
    super(message)
    this.status = status
    this.code = code
  }
}

export function quarterlyReportApiUrl(path: string) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${apiBaseUrl.replace(/\/api$/i, '')}${normalizedPath}`
}

function publicPath(slug: string) {
  return `/api/v1/public/quarterly-reports/${encodeURIComponent(slug)}`
}

function toReport(data: Omit<QuarterlyReportPublic, 'pdfUrl'>): QuarterlyReportPublic {
  return { ...data, pdfUrl: quarterlyReportApiUrl(`${publicPath(data.slug)}/pdf`) }
}

async function parse<T>(response: Response): Promise<T> {
  const payload = (await response.json().catch(() => null)) as ApiSuccess<T> | ApiFailure | null
  if (!response.ok) {
    const error = payload && 'error' in payload ? payload.error : undefined
    throw new QuarterlyReportApiError(response.status, error?.code ?? 'request_failed', error?.message ?? 'Không thể tải báo cáo.')
  }
  if (!payload || !('data' in payload)) {
    throw new QuarterlyReportApiError(response.status, 'invalid_response', 'Phản hồi báo cáo không hợp lệ.')
  }
  return payload.data
}

export async function getActiveQuarterlyReport(signal?: AbortSignal) {
  const data = await parse<Omit<QuarterlyReportPublic, 'pdfUrl'>>(await fetch(quarterlyReportApiUrl('/api/v1/public/quarterly-reports/active'), {
    cache: 'no-store',
    headers: { accept: 'application/json' },
    signal,
  }))
  return toReport(data)
}

export async function getQuarterlyReport(slug: string, signal?: AbortSignal) {
  const data = await parse<Omit<QuarterlyReportPublic, 'pdfUrl'>>(await fetch(quarterlyReportApiUrl(publicPath(slug)), {
    cache: 'no-store',
    headers: { accept: 'application/json' },
    signal,
  }))
  return toReport(data)
}

export function createQuarterlyReportDownloadIdempotencyKey() {
  const random = crypto.randomUUID?.() ?? Array.from(crypto.getRandomValues(new Uint8Array(16)), (value) => value.toString(16).padStart(2, '0')).join('')
  return `source4-quarterly-report:${random}`
}

export async function requestQuarterlyReportDownload(slug: string, payload: QuarterlyReportDownloadPayload, idempotencyKey: string) {
  return parse<QuarterlyReportDownloadResponse>(await fetch(quarterlyReportApiUrl(`${publicPath(slug)}/downloads`), {
    body: JSON.stringify({ ...payload, idempotencyKey }),
    headers: {
      'content-type': 'application/json',
      'idempotency-key': idempotencyKey,
      'x-cwi-source': 'source4',
    },
    method: 'POST',
  }))
}
