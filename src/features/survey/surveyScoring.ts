import { t } from '@/i18n'
import type { SurveyQuestion } from './surveyData'
import { isOtherOption } from './surveyEditions'
import { hasPendingFollowUp, type FollowUpAnswers } from './surveyFollowUp'

export type Answers = Record<number, string>

export function validEmail(value: string) {
  return /^\S+@\S+\.\S+$/.test(value)
}

export function normalizeWebsiteValue(value: string) {
  const raw = value.trim()
  if (!raw) return null

  const candidate = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`
  try {
    const parsed = new URL(candidate)
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null
    if (parsed.username || parsed.password) return null

    const hostname = parsed.hostname.toLowerCase()
    const labels = hostname.split('.')
    const validLabel = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i
    const validTld = /^(?:[a-z]{2,63}|xn--[a-z0-9-]{2,59})$/i
    if (labels.length < 2 || labels.some((label) => !validLabel.test(label)) || !validTld.test(labels.at(-1) ?? '')) return null

    return parsed.href
  } catch {
    return null
  }
}

export function isValidWebsite(value: string) {
  return normalizeWebsiteValue(value) !== null
}
// A scale question with a follow-up counts as answered only once the follow-up is answered too.
export function hasQuestionAnswer(question: SurveyQuestion, answers: Answers, otherAnswers: Answers, followUps?: FollowUpAnswers) {
  const answer = answers[question.n]
  if (question.type === 'text') return Boolean(answer?.trim())
  if (isOtherOption(answer)) return Boolean(otherAnswers[question.n]?.trim())
  return answer !== undefined && answer !== '' && !hasPendingFollowUp(question, followUps)
}

// Display text only: MCQ options are stored in Vietnamese and translated here;
// scores, websites and free "other" text are shown as entered.
export function getAnswerDisplay(number: number, answers: Answers, otherAnswers: Answers, questions: readonly SurveyQuestion[]) {
  const value = answers[number]
  if (!value) return '—'
  if (isOtherOption(value)) return otherAnswers[number] || t(value)
  const question = questions.find((item) => item.n === number)
  return question?.type === 'mcq' && question.options.includes(value) ? t(value) : value
}

