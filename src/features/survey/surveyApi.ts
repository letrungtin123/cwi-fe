import type { SurveySubmissionPayload } from './surveySubmissionPayload'

const apiBaseUrl = (import.meta.env.VITE_CWI_API_BASE_URL ?? 'http://localhost:8088').replace(/\/+$/, '')
const submitTimeoutMs = Number(import.meta.env.VITE_CWI_SUBMIT_TIMEOUT_MS ?? 15000)

export type SurveySubmitResult = {
  deduplicated: boolean
  submissionId: string
  submittedAt: string
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

export function createSurveySubmissionIdempotencyKey() {
  if (crypto.randomUUID) return `source4:${crypto.randomUUID()}`
  const random = Array.from(crypto.getRandomValues(new Uint8Array(16)), (value) => value.toString(16).padStart(2, '0')).join('')
  return `source4:${Date.now()}:${random}`
}

function getFriendlyError(status: number, _code: string, message: string) {
  if (status === 422) return 'Một số câu trả lời chưa đúng định dạng. Vui lòng kiểm tra lại thông tin và gửi lại.'
  if (status === 409) return 'Kết quả này đã được ghi nhận trước đó.'
  if (status >= 500) return 'Hệ thống đang bận, vui lòng thử gửi lại sau ít phút.'
  return message || 'Không thể gửi kết quả khảo sát lúc này.'
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

    const body = (await response.json().catch(() => null)) as ApiSuccess<SurveySubmitResult> | ApiFailure | null

    if (!response.ok) {
      const error = body && 'error' in body ? body.error : undefined
      const code = error?.code ?? 'submit_failed'
      throw new SurveyApiError(response.status, code, getFriendlyError(response.status, code, error?.message ?? ''))
    }

    if (!body || !('data' in body)) {
      throw new SurveyApiError(response.status, 'invalid_response', 'Phản hồi từ hệ thống không hợp lệ.')
    }

    return body.data
  } catch (error) {
    if (error instanceof SurveyApiError) throw error
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new SurveyApiError(408, 'submit_timeout', 'Gửi kết quả quá thời gian chờ. Vui lòng thử lại.')
    }
    throw new SurveyApiError(0, 'network_error', 'Không kết nối được hệ thống lưu kết quả. Vui lòng kiểm tra kết nối và thử lại.')
  } finally {
    window.clearTimeout(timeoutId)
  }
}