import type { SurveySubmissionPayload } from './surveySubmissionPayload'

const apiBaseUrl = (import.meta.env.VITE_CWI_API_BASE_URL ?? 'http://localhost:8088').replace(/\/+$/, '')

function positiveEnvNumber(value: string | undefined, fallback: number) {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

const submitTimeoutMs = positiveEnvNumber(import.meta.env.VITE_CWI_SUBMIT_TIMEOUT_MS, 15000)
const reportRequestTimeoutMs = positiveEnvNumber(import.meta.env.VITE_CWI_REPORT_REQUEST_TIMEOUT_MS, 15000)

export type ReportJobStatusValue = 'pending' | 'queued' | 'queued_ai' | 'generating' | 'generating_ai' | 'rendering_assets' | 'generating_pdf' | 'html_ready' | 'completed' | 'failed' | 'skipped' | 'sent'

export type ReportEmailStatus = 'not_sent' | 'queued' | 'sending' | 'sent' | 'failed' | 'unknown'

export type SurveyReportAccess = {
  accessToken: string
  accessTokenExpiresAt: string
  jobId: string
  status: ReportJobStatusValue
}

export type ReportJobStatusResult = {
  createdAt: string
  emailStatus: ReportEmailStatus
  htmlAvailable: boolean
  jobId: string
  pdfAvailable: boolean
  reportType: 'anonymous' | 'personalized'
  status: ReportJobStatusValue
  updatedAt: string
}

export type SurveySubmitResult = {
  deduplicated: boolean
  report: SurveyReportAccess | null
  submissionId: string
  submittedAt: string
}

export type RoundtableRegistrationPayload = {
  clientMeta: Record<string, unknown>
  email: string
  fullName: string
  position?: string
  surveySubmissionIdempotencyKey?: string
}

export type RoundtableRegistrationResult = {
  deduplicated: boolean
  linkedSubmissionId: string | null
  registrationId: string
  registeredAt: string
}

export type RoundtableRegistrationStatusResult = {
  registered: boolean
}

type ApiSuccess<T> = {
  data: T
}

type ApiFailure = {
  error?: {
    code?: string
    details?: unknown
    message?: string
  }
}

export class SurveyApiError extends Error {
  readonly code: string
  readonly status: number

  constructor(status: number, code: string, message: string) {
    super(message)
    this.name = 'SurveyApiError'
    this.status = status
    this.code = code
  }
}

function createClientIdempotencyKey(prefix: string) {
  if (crypto.randomUUID) return `${prefix}:${crypto.randomUUID()}`
  const random = Array.from(crypto.getRandomValues(new Uint8Array(16)), (value) => value.toString(16).padStart(2, '0')).join('')
  return `${prefix}:${Date.now()}:${random}`
}

export function createSurveySubmissionIdempotencyKey() {
  return createClientIdempotencyKey('source4')
}

export function createRoundtableRegistrationIdempotencyKey() {
  return createClientIdempotencyKey('source4-roundtable')
}

function getFriendlyError(status: number, code: string, message: string) {
  if (status === 422) return 'Một số thông tin chưa đúng định dạng. Vui lòng kiểm tra lại và gửi lại.'
  if (status === 409 && code.startsWith('roundtable')) return 'Đăng ký CEO Roundtable này đã được ghi nhận trước đó.'
  if (status === 409) return 'Kết quả này đã được ghi nhận trước đó.'
  if (status >= 500) return 'Hệ thống đang bận, vui lòng thử gửi lại sau ít phút.'
  return message || 'Không thể gửi dữ liệu lúc này.'
}

async function parseApiResponse<T>(response: Response): Promise<T> {
  const body = (await response.json().catch(() => null)) as ApiSuccess<T> | ApiFailure | null

  if (!response.ok) {
    const error = body && 'error' in body ? body.error : undefined
    const code = error?.code ?? 'request_failed'
    throw new SurveyApiError(response.status, code, getFriendlyError(response.status, code, error?.message ?? ''))
  }

  if (!body || !('data' in body)) {
    throw new SurveyApiError(response.status, 'invalid_response', 'Phản hồi từ hệ thống không hợp lệ.')
  }

  return body.data
}

function toNetworkError(error: unknown, timeoutMessage: string, networkMessage: string) {
  if (error instanceof SurveyApiError) return error
  if (error instanceof DOMException && error.name === 'AbortError') {
    return new SurveyApiError(408, 'request_timeout', timeoutMessage)
  }
  return new SurveyApiError(0, 'network_error', networkMessage)
}

export async function submitSurveySubmission(payload: SurveySubmissionPayload, idempotencyKey: string): Promise<SurveySubmitResult> {
  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), Number.isFinite(submitTimeoutMs) ? submitTimeoutMs : 15000)

  try {
    const response = await fetch(`${apiBaseUrl}/api/v1/survey-submissions`, {
      body: JSON.stringify({ ...payload, idempotencyKey }),
      headers: {
        'content-type': 'application/json',
        'idempotency-key': idempotencyKey,
        'x-cwi-source': 'source4',
      },
      method: 'POST',
      signal: controller.signal,
    })

    return await parseApiResponse<SurveySubmitResult>(response)
  } catch (error) {
    throw toNetworkError(error, 'Gửi dữ liệu quá thời gian chờ. Vui lòng thử lại.', 'Không kết nối được hệ thống lưu dữ liệu. Vui lòng kiểm tra kết nối và thử lại.')
  } finally {
    window.clearTimeout(timeoutId)
  }
}

export async function submitRoundtableRegistration(payload: RoundtableRegistrationPayload, idempotencyKey: string): Promise<RoundtableRegistrationResult> {
  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), Number.isFinite(submitTimeoutMs) ? submitTimeoutMs : 15000)

  try {
    const response = await fetch(`${apiBaseUrl}/api/v1/roundtable-registrations`, {
      body: JSON.stringify({ ...payload, idempotencyKey }),
      headers: {
        'content-type': 'application/json',
        'idempotency-key': idempotencyKey,
        'x-cwi-source': 'source4',
      },
      method: 'POST',
      signal: controller.signal,
    })

    return await parseApiResponse<RoundtableRegistrationResult>(response)
  } catch (error) {
    throw toNetworkError(error, 'Gửi đăng ký quá thời gian chờ. Vui lòng thử lại.', 'Không kết nối được hệ thống đăng ký. Vui lòng kiểm tra kết nối và thử lại.')
  } finally {
    window.clearTimeout(timeoutId)
  }
}

export async function checkRoundtableRegistration(email: string, signal?: AbortSignal): Promise<RoundtableRegistrationStatusResult> {
  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), Number.isFinite(submitTimeoutMs) ? submitTimeoutMs : 15000)
  const abortFromCaller = () => controller.abort()
  signal?.addEventListener('abort', abortFromCaller, { once: true })

  try {
    const response = await fetch(`${apiBaseUrl}/api/v1/roundtable-registrations/check`, {
      body: JSON.stringify({ email }),
      cache: 'no-store',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'x-cwi-source': 'source4',
      },
      method: 'POST',
      signal: controller.signal,
    })

    return await parseApiResponse<RoundtableRegistrationStatusResult>(response)
  } catch (error) {
    throw toNetworkError(error, 'Kiểm tra đăng ký quá thời gian chờ. Vui lòng thử lại.', 'Không thể kiểm tra đăng ký Roundtable lúc này.')
  } finally {
    signal?.removeEventListener('abort', abortFromCaller)
    window.clearTimeout(timeoutId)
  }
}

export async function getReportJobStatus(jobId: string, accessToken: string, signal?: AbortSignal): Promise<ReportJobStatusResult> {
  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), Number.isFinite(reportRequestTimeoutMs) ? reportRequestTimeoutMs : 15000)
  const abortFromCaller = () => controller.abort()
  signal?.addEventListener('abort', abortFromCaller, { once: true })

  try {
    const response = await fetch(`${apiBaseUrl}/api/v1/public/report-jobs/${encodeURIComponent(jobId)}/status`, {
      cache: 'no-store',
      headers: {
        accept: 'application/json',
        'x-cwi-report-token': accessToken,
      },
      signal: controller.signal,
    })
    return await parseApiResponse<ReportJobStatusResult>(response)
  } catch (error) {
    throw toNetworkError(error, 'Chưa thể kiểm tra trạng thái báo cáo. Vui lòng thử lại.', 'Không thể kết nối để kiểm tra báo cáo. Vui lòng thử lại.')
  } finally {
    signal?.removeEventListener('abort', abortFromCaller)
    window.clearTimeout(timeoutId)
  }
}

export async function getReportHtml(jobId: string, accessToken: string, signal?: AbortSignal): Promise<string> {
  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), Number.isFinite(reportRequestTimeoutMs) ? reportRequestTimeoutMs : 15000)
  const abortFromCaller = () => controller.abort()
  signal?.addEventListener('abort', abortFromCaller, { once: true })

  try {
    const response = await fetch(`${apiBaseUrl}/api/v1/public/report-jobs/${encodeURIComponent(jobId)}/html`, {
      cache: 'no-store',
      headers: {
        accept: 'text/html',
        'x-cwi-report-token': accessToken,
      },
      signal: controller.signal,
    })

    if (!response.ok) {
      await parseApiResponse<never>(response)
    }

    const contentLength = Number(response.headers.get('content-length') ?? 0)
    if (contentLength > 8 * 1024 * 1024) {
      throw new SurveyApiError(502, 'report_too_large', 'Báo cáo có kích thước không hợp lệ. Vui lòng thử lại sau.')
    }

    const html = await response.text()
    if (!html.trim()) throw new SurveyApiError(502, 'empty_report', 'Báo cáo chưa có nội dung. Vui lòng thử lại sau.')
    if (html.length > 8 * 1024 * 1024) {
      throw new SurveyApiError(502, 'report_too_large', 'Báo cáo có kích thước không hợp lệ. Vui lòng thử lại sau.')
    }
    return html
  } catch (error) {
    throw toNetworkError(error, 'Tải báo cáo quá thời gian chờ. Vui lòng thử lại.', 'Không thể tải nội dung báo cáo. Vui lòng thử lại.')
  } finally {
    signal?.removeEventListener('abort', abortFromCaller)
    window.clearTimeout(timeoutId)
  }
}
