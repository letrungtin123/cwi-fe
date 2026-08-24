import type { ContactState, ConsentChoice, ReportMode } from './surveyPersistence'
import { normalizeWebsiteValue, OTHER_OPTION, hasQuestionAnswer, type Answers } from './surveyScoring'
import { partOneQuestions, partTwoQuestions, type SurveyQuestion } from './surveyData'

export type SubmissionStatus = 'part1_only' | 'part2_refused_privacy' | 'full_private_report'
export type PrivacyConsent = 'yes' | 'no' | 'not_applicable'

type SurveySubmissionAnswer = {
  answer: number | string
  idx: number
  otherText?: string
}

export type SurveySubmissionPayload = {
  answers: SurveySubmissionAnswer[]
  clientMeta: Record<string, unknown>
  participant: {
    email: string
    fullName: string
    position: string
  }
  privacyConsent: PrivacyConsent
  roundtableRegistration?: {
    email: string
    fullName: string
    id?: string
    position?: string
    registered: true
  }
  statusNote: string
  submissionStatus: SubmissionStatus
}

type BuildSurveySubmissionPayloadInput = {
  answers: Answers
  consent: ConsentChoice
  contact: ContactState
  otherAnswers: Answers
  partTwoPrivacyRefused: boolean
  reportMode: ReportMode
  roundtableContact: ContactState
  roundtableRegistered: boolean
  roundtableRegistrationId: string
}

const statusNotes: Record<SubmissionStatus, string> = {
  full_private_report: 'Hoàn thành Phần 1 + Phần 2, chọn "Đồng ý" bảo mật dữ liệu và gửi kết quả cả 2 phần.',
  part1_only: 'Hoàn thành Phần 1 và gửi kết quả Phần 1.',
  part2_refused_privacy: 'Hoàn thành Phần 1 + Phần 2, chọn "Không đồng ý" bảo mật dữ liệu và nhận báo cáo Phần 1.',
}

function normalizePosition(contact: ContactState) {
  const position = contact.jobTitle === 'Khác' && contact.jobTitleOther.trim() ? contact.jobTitleOther : contact.jobTitle
  return position.trim()
}

function normalizeWebsite(value: string) {
  const raw = value.trim()
  if (!raw) throw new Error('Vui lòng nhập website công ty ở câu 24.')

  const normalized = normalizeWebsiteValue(raw)
  if (!normalized) throw new Error('Website công ty ở câu 24 chưa đúng định dạng URL.')
  return normalized
}

function buildAnswer(question: SurveyQuestion, answers: Answers, otherAnswers: Answers): SurveySubmissionAnswer {
  const rawAnswer = answers[question.n]

  if (question.type === 'likert') {
    const value = Number(rawAnswer)
    if (!Number.isInteger(value) || value < 1 || value > 5) throw new Error(`Câu ${question.n} cần chọn điểm từ 1 đến 5.`)
    return { answer: value, idx: question.n }
  }

  if (question.type === 'mcq') {
    if (rawAnswer === OTHER_OPTION) {
      const otherText = otherAnswers[question.n]?.trim()
      if (!otherText) throw new Error(`Câu ${question.n} cần nhập nội dung khác.`)
      return { answer: OTHER_OPTION, idx: question.n, otherText }
    }

    if (!rawAnswer) throw new Error(`Câu ${question.n} chưa có câu trả lời.`)
    return { answer: rawAnswer, idx: question.n }
  }

  return { answer: normalizeWebsite(rawAnswer ?? ''), idx: question.n }
}

function assertAnswered(questions: SurveyQuestion[], answers: Answers, otherAnswers: Answers, label: string) {
  const missing = questions.filter((question) => !hasQuestionAnswer(question, answers, otherAnswers)).map((question) => question.n)
  if (missing.length) throw new Error(`${label} còn thiếu câu: ${missing.join(', ')}.`)
}

function getSubmissionStatus(input: Pick<BuildSurveySubmissionPayloadInput, 'consent' | 'partTwoPrivacyRefused' | 'reportMode'>): SubmissionStatus {
  if (input.partTwoPrivacyRefused) return 'part2_refused_privacy'
  if (input.reportMode === 'private' && input.consent === 'yes') return 'full_private_report'
  return 'part1_only'
}

function getPrivacyConsent(status: SubmissionStatus): PrivacyConsent {
  if (status === 'full_private_report') return 'yes'
  if (status === 'part2_refused_privacy') return 'no'
  return 'not_applicable'
}

export function buildSurveySubmissionPayload(input: BuildSurveySubmissionPayloadInput): SurveySubmissionPayload {
  assertAnswered(partOneQuestions, input.answers, input.otherAnswers, 'Phần 1')

  const status = getSubmissionStatus(input)
  const requiredQuestions = status === 'part1_only' ? partOneQuestions : [...partOneQuestions, ...partTwoQuestions]

  if (status !== 'part1_only') assertAnswered(partTwoQuestions, input.answers, input.otherAnswers, 'Phần 2')

  const participant = {
    email: input.contact.email.trim().toLowerCase(),
    fullName: input.contact.name.trim().replace(/\s+/g, ' '),
    position: normalizePosition(input.contact),
  }

  if (!participant.fullName || !participant.email || !participant.position) {
    throw new Error('Vui lòng điền đầy đủ Họ tên, Email và Chức vụ trước khi gửi kết quả.')
  }

  const roundtableName = input.roundtableContact.name.trim().replace(/\s+/g, ' ') || participant.fullName
  const roundtableEmail = input.roundtableContact.email.trim().toLowerCase() || participant.email
  const roundtablePosition = normalizePosition(input.roundtableContact) || participant.position

  return {
    answers: requiredQuestions.map((question) => buildAnswer(question, input.answers, input.otherAnswers)),
    clientMeta: {
      app: 'source4',
      language: navigator.language,
      path: window.location.pathname,
      referrer: document.referrer || null,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      userAgent: navigator.userAgent,
    },
    participant,
    privacyConsent: getPrivacyConsent(status),
    roundtableRegistration: input.roundtableRegistered
      ? {
          email: roundtableEmail,
          fullName: roundtableName,
          id: input.roundtableRegistrationId || undefined,
          position: roundtablePosition || undefined,
          registered: true,
        }
      : undefined,
    statusNote: statusNotes[status],
    submissionStatus: status,
  }
}
