import { getLang, t, type Lang } from '@/i18n'
import type { ContactState, ConsentChoice, ReportMode } from './surveyPersistence'
import { normalizeWebsiteValue, hasQuestionAnswer, type Answers } from './surveyScoring'
import type { SurveyQuestion } from './surveyData'
import { isOtherOption, type SurveyEdition } from './surveyEditions'
import { FOLLOW_UP_ANSWER_MIN, isFollowUpAnswered, normalizeFollowUpAnswer, type FollowUpAnswers } from './surveyFollowUp'
import { readSurveySourceCode } from './surveySource'

export type SubmissionStatus = 'part1_only' | 'part2_refused_privacy' | 'full_private_report'
export type PrivacyConsent = 'yes' | 'no' | 'not_applicable'

type SurveySubmissionAnswer = {
  answer: number | string
  // Answer to the follow-up question of a scale answer of 1 or 5.
  followUpAnswer?: string
  idx: number
  otherText?: string
}

export type SurveySubmissionPayload = {
  answers: SurveySubmissionAnswer[]
  clientMeta: Record<string, unknown>
  // The language the survey was shown in; answers are Vietnamese either way.
  language: Lang
  participant: {
    companyName: string
    email: string
    fullName: string
    phone: string
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
  // Invitation source code from the survey link, remembered for 30 days.
  sourceCode?: string
  statusNote: string
  submissionStatus: SubmissionStatus
  surveyVersion: string
}

type BuildSurveySubmissionPayloadInput = {
  answers: Answers
  consent: ConsentChoice
  contact: ContactState
  // The quarter the respondent chose: its questions are checked and its version is sent.
  edition: SurveyEdition
  followUps: FollowUpAnswers
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
  if (!raw) throw new Error(t('Vui lòng nhập website công ty ở câu 24.'))

  const normalized = normalizeWebsiteValue(raw)
  if (!normalized) throw new Error(t('Website công ty ở câu 24 chưa đúng định dạng. Ví dụ: example.com hoặc https://example.com'))
  return normalized
}

function buildAnswer(question: SurveyQuestion, answers: Answers, otherAnswers: Answers, followUps: FollowUpAnswers): SurveySubmissionAnswer {
  const rawAnswer = answers[question.n]

  if (question.type === 'likert') {
    const value = Number(rawAnswer)
    if (!Number.isInteger(value) || value < 1 || value > 5) throw new Error(t('Câu {n} cần chọn điểm từ 1 đến 5.', { n: question.n }))
    // A slot only exists while the answer is 1 or 5 (surveyFollowUp.ts); the check is a guard.
    if (!(question.n in followUps) || (value !== 1 && value !== 5)) return { answer: value, idx: question.n }
    if (!isFollowUpAnswered(followUps[question.n])) {
      throw new Error(t('Câu {n} cần trả lời câu hỏi phụ, ít nhất {min} ký tự.', { min: FOLLOW_UP_ANSWER_MIN, n: question.n }))
    }
    return { answer: value, followUpAnswer: normalizeFollowUpAnswer(followUps[question.n]), idx: question.n }
  }

  if (question.type === 'mcq') {
    if (rawAnswer && isOtherOption(rawAnswer)) {
      const otherText = otherAnswers[question.n]?.trim()
      if (!otherText) throw new Error(t('Câu {n} cần nhập nội dung khác.', { n: question.n }))
      if (otherText.length < 2) throw new Error(t('Nội dung khác ở câu {n} cần ít nhất 2 ký tự.', { n: question.n }))
      return { answer: rawAnswer, idx: question.n, otherText }
    }

    if (!rawAnswer) throw new Error(t('Câu {n} chưa có câu trả lời.', { n: question.n }))
    return { answer: rawAnswer, idx: question.n }
  }

  return { answer: normalizeWebsite(rawAnswer ?? ''), idx: question.n }
}

function assertAnswered(questions: SurveyQuestion[], answers: Answers, otherAnswers: Answers, followUps: FollowUpAnswers, label: string) {
  const missing = questions.filter((question) => !hasQuestionAnswer(question, answers, otherAnswers, followUps)).map((question) => question.n)
  if (missing.length) throw new Error(t('{label} còn thiếu câu: {list}.', { label, list: missing.join(', ') }))
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
  const { partOneQuestions, partTwoQuestions } = input.edition
  // Follow-ups only exist for a quarter that asks them.
  const followUps = input.edition.followUp ? input.followUps : {}
  assertAnswered(partOneQuestions, input.answers, input.otherAnswers, followUps, t('Phần 1'))

  const status = getSubmissionStatus(input)
  const requiredQuestions = status === 'part1_only' ? partOneQuestions : [...partOneQuestions, ...partTwoQuestions]

  if (status !== 'part1_only') assertAnswered(partTwoQuestions, input.answers, input.otherAnswers, followUps, t('Phần 2'))

  const participant = {
    companyName: input.contact.companyName.trim().replace(/\s+/g, ' '),
    email: input.contact.email.trim().toLowerCase(),
    fullName: input.contact.name.trim().replace(/\s+/g, ' '),
    phone: input.contact.phone.trim(),
    position: normalizePosition(input.contact),
  }

  if (!participant.fullName || !participant.email || !participant.phone || !participant.position || !participant.companyName) {
    throw new Error(t('Vui lòng điền đầy đủ Họ tên, Email, Số điện thoại, Chức vụ và Tên công ty trước khi gửi kết quả.'))
  }

  const roundtableName = input.roundtableContact.name.trim().replace(/\s+/g, ' ') || participant.fullName
  const roundtableEmail = input.roundtableContact.email.trim().toLowerCase() || participant.email
  const roundtablePosition = normalizePosition(input.roundtableContact) || participant.position

  return {
    answers: requiredQuestions.map((question) => buildAnswer(question, input.answers, input.otherAnswers, followUps)),
    clientMeta: {
      app: 'cwi-fe-landing-page',
      language: navigator.language,
      path: window.location.pathname,
      referrer: document.referrer || null,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      userAgent: navigator.userAgent,
    },
    language: getLang(),
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
    sourceCode: readSurveySourceCode() ?? undefined,
    statusNote: statusNotes[status],
    submissionStatus: status,
    surveyVersion: input.edition.version,
  }
}
