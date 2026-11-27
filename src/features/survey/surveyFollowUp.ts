import type { SurveyQuestion } from './surveyData'
import type { Answers } from './surveyScoring'

// Follow-up question ("câu hỏi phụ") under a scale answer of 1 or 5. A quarter that has it
// (surveyEditions.ts, followUp) asks it under at most FOLLOW_UP_MAX such answers at a time,
// right under the question, and the answer is required. The scale answers of 1 or 5 are kept
// in the order they were picked and the first FOLLOW_UP_MAX of them hold the follow-up. When
// one of those changes to 2-4 its follow-up and what was typed go away, and the slot passes to
// the next answer of 1 or 5 in that order (one already picked, or the next one picked).
// Same text and limits as the backend (surveyQuestions.ts) and cwi-ai's 2026-q4 catalog.
export const FOLLOW_UP_QUESTION = 'Tại sao Anh/Chị chọn câu trả lời này?'
export const FOLLOW_UP_MAX = 2
export const FOLLOW_UP_ANSWER_MIN = 10
export const FOLLOW_UP_ANSWER_MAX = 1000

export type SurveyFollowUp = {
  // Most scale questions that hold the follow-up at the same time.
  max: number
}

// Keyed by question number; a key means the question holds a follow-up, its value is the
// text typed so far ('' when nothing yet).
export type FollowUpAnswers = Answers

export type FollowUpState = {
  answers: FollowUpAnswers
  // Scale questions answered 1 or 5, in the order they were picked.
  order: number[]
}

export const EMPTY_FOLLOW_UP_STATE: FollowUpState = { answers: {}, order: [] }

function asksFollowUp(value: string | undefined) {
  return value === '1' || value === '5'
}

// The first `max` questions of the order hold the follow-up; a question that just got one
// starts empty, the others keep their text.
function withSlots(order: number[], previous: FollowUpAnswers, followUp: SurveyFollowUp): FollowUpState {
  const answers: FollowUpAnswers = {}
  for (const n of order.slice(0, followUp.max)) answers[n] = previous[n] ?? ''
  return { answers, order }
}

// The follow-ups after a scale question's answer changes to value ('' = cleared).
export function followUpStateAfterAnswer(current: FollowUpState, followUp: SurveyFollowUp | null, question: SurveyQuestion, value: string): FollowUpState {
  if (!followUp || question.type !== 'likert') return current
  const picked = current.order.includes(question.n)

  // 1 -> 5 keeps the place in the order and the text.
  if (asksFollowUp(value) === picked) return current
  const order = picked ? current.order.filter((n) => n !== question.n) : [...current.order, question.n]
  return withSlots(order, current.answers, followUp)
}

// Drops the given questions (e.g. Part 2 cleared) and passes their slots on.
export function followUpStateWithout(current: FollowUpState, followUp: SurveyFollowUp | null, questionNumbers: readonly number[]): FollowUpState {
  if (!followUp || !current.order.some((n) => questionNumbers.includes(n))) return current
  return withSlots(current.order.filter((n) => !questionNumbers.includes(n)), current.answers, followUp)
}

// Rebuilds the state of a saved draft against its answers. A draft saved before the order was
// kept has only the texts: those questions come first, then the other answers of 1 or 5.
export function restoreFollowUpState(
  saved: { followUpAnswers?: FollowUpAnswers; followUpOrder?: number[] } | null,
  answers: Answers,
  followUp: SurveyFollowUp | null,
  scaleQuestionNumbers: readonly number[],
): FollowUpState {
  if (!followUp || !saved) return EMPTY_FOLLOW_UP_STATE
  const texts = saved.followUpAnswers ?? {}
  const picked = scaleQuestionNumbers.filter((n) => asksFollowUp(answers[n]))
  const order: number[] = []
  const add = (n: number) => {
    if (picked.includes(n) && !order.includes(n)) order.push(n)
  }
  ;(saved.followUpOrder ?? []).forEach(add)
  Object.keys(texts).map(Number).sort((a, b) => a - b).forEach(add)
  picked.forEach(add)
  return withSlots(order, texts, followUp)
}

// The text as it is sent: trimmed, runs of spaces and line breaks folded into one space
// (the backend folds them the same way before checking the length).
export function normalizeFollowUpAnswer(value: string | undefined) {
  return (value ?? '').trim().replace(/\s+/g, ' ')
}

export function isFollowUpAnswered(value: string | undefined) {
  return normalizeFollowUpAnswer(value).length >= FOLLOW_UP_ANSWER_MIN
}

// True when the question holds a follow-up that is not answered well enough yet.
export function hasPendingFollowUp(question: SurveyQuestion, followUps: FollowUpAnswers | undefined) {
  return Boolean(followUps && question.n in followUps && !isFollowUpAnswered(followUps[question.n]))
}
