import { t, type Lang } from '@/i18n'

// Without VITE_CWI_API_BASE_URL a production build calls its own origin (/api); only the dev
// server falls back to the local backend.
const apiBaseUrl = (import.meta.env.VITE_CWI_API_BASE_URL ?? (import.meta.env.DEV ? 'http://localhost:8088' : '')).replace(/\/+$/, '')

type ApiSuccess<T> = { data: T }
type ApiFailure = { error?: { code?: string; message?: string } }

type Bilingual = Record<Lang, string>

// One card of /bao-cao-quy. languages: the PDFs the quarter has (vi, en).
export type QuarterlyReportCard = {
  description: Bilingual
  imageUrl: string | null
  isCurrent: boolean
  label: Bilingual
  languages: Lang[]
  periodQuarter: number
  periodYear: number
  slug: string
  title: Bilingual
}

export type QuarterlyReportList = {
  page: { description: Bilingual; kicker: Bilingual; title: Bilingual }
  reports: QuarterlyReportCard[]
}

// The report as the PDF reader and the download form show it, in one language.
export type QuarterlyReportPublic = {
  language: Lang
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
  // The PDF the person is reading; the download link sends that one.
  language: Lang
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

// The card in one language; the PDF in the language asked for, else the one the quarter has.
export function toReportView(card: QuarterlyReportCard, wanted: Lang): QuarterlyReportPublic {
  const language = card.languages.includes(wanted) ? wanted : card.languages[0] ?? wanted
  return {
    language,
    periodQuarter: card.periodQuarter,
    periodYear: card.periodYear,
    pdfUrl: quarterlyReportApiUrl(`${publicPath(card.slug)}/pdf?lang=${language}`),
    slug: card.slug,
    subtitle: card.description[language],
    title: card.title[language],
  }
}

export function quarterlyReportImageUrl(path: string) {
  return quarterlyReportApiUrl(path)
}

async function parse<T>(response: Response): Promise<T> {
  const payload = (await response.json().catch(() => null)) as ApiSuccess<T> | ApiFailure | null
  if (!response.ok) {
    const error = payload && 'error' in payload ? payload.error : undefined
    throw new QuarterlyReportApiError(response.status, error?.code ?? 'request_failed', error?.message ?? t('Không thể tải báo cáo.'))
  }
  if (!payload || !('data' in payload)) {
    throw new QuarterlyReportApiError(response.status, 'invalid_response', t('Phản hồi báo cáo không hợp lệ.'))
  }
  return payload.data
}

export async function getQuarterlyReports(signal?: AbortSignal) {
  return parse<QuarterlyReportList>(await fetch(quarterlyReportApiUrl('/api/v1/public/quarterly-reports'), {
    headers: { accept: 'application/json' },
    signal,
  }))
}

export function createQuarterlyReportDownloadIdempotencyKey() {
  const random = crypto.randomUUID?.() ?? Array.from(crypto.getRandomValues(new Uint8Array(16)), (value) => value.toString(16).padStart(2, '0')).join('')
  return `cwi-fe-landing-page-quarterly-report:${random}`
}

export async function requestQuarterlyReportDownload(slug: string, payload: QuarterlyReportDownloadPayload, idempotencyKey: string) {
  return parse<QuarterlyReportDownloadResponse>(await fetch(quarterlyReportApiUrl(`${publicPath(slug)}/downloads`), {
    body: JSON.stringify({ ...payload, idempotencyKey }),
    headers: {
      'content-type': 'application/json',
      'idempotency-key': idempotencyKey,
      'x-cwi-source': 'cwi-fe-landing-page',
    },
    method: 'POST',
  }))
}
