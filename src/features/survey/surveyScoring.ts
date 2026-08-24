import { surveyDomains, type SurveyQuestion } from './surveyData'

export type Answers = Record<number, string>

export const OTHER_OPTION = 'Mục khác:'

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
export function hasQuestionAnswer(question: SurveyQuestion, answers: Answers, otherAnswers: Answers) {
  const answer = answers[question.n]
  if (question.type === 'text') return Boolean(answer?.trim())
  if (answer === OTHER_OPTION) return Boolean(otherAnswers[question.n]?.trim())
  return answer !== undefined && answer !== ''
}

export function getAnswerDisplay(number: number, answers: Answers, otherAnswers: Answers) {
  const value = answers[number]
  if (!value) return '—'
  if (value === OTHER_OPTION) return otherAnswers[number] || value
  return value
}

function scoreFor(questionNumbers: readonly number[], answers: Answers) {
  const values = questionNumbers
    .map((number) => Number(answers[number]))
    .filter((value) => value >= 1 && value <= 5)

  if (!values.length) return 0
  return Math.round((values.reduce((sum, value) => sum + value, 0) / values.length) * 20)
}

export function getSurveyScores(answers: Answers) {
  const domains = surveyDomains.map((domain) => ({
    name: domain.name,
    value: scoreFor(domain.questionNumbers, answers),
  }))
  const values = Array.from({ length: 16 }, (_, index) => Number(answers[index + 1])).filter((value) => value >= 1 && value <= 5)
  const overall = values.length ? Math.round((values.reduce((sum, value) => sum + value, 0) / values.length) * 20) : 0
  const scale = scoreFor([1, 4, 6, 15, 16], answers)

  return { domains, overall, scale }
}
