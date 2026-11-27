import type { SurveyQuestion } from './surveyData'
import type { Answers } from './surveyScoring'

// Follow-up question ("câu hỏi phụ") under a scale answer of 1 or 5. A quarter that has it
// (surveyEditions.ts, followUp) asks it for the first FOLLOW_UP_MAX such answers, right under
// the question, and the answer is required. Changing that answer to 2-4 removes the follow-up
// and what was typed; the slot goes to the next 1 or 5 picked on another question.
// Same text and limits as the backend (surveyQuestions.ts) and cwi-ai's 2026-q4 catalog.
export const FOLLOW_UP_QUESTION = 'Tại sao Anh/Chị chọn câu trả lời này?'
export const FOLLOW_UP_MAX = 2
export const FOLLOW_UP_ANSWER_MIN = 10
export const FOLLOW_UP_ANSWER_MAX = 1000

export type SurveyFollowUp = {
  // Most scale questions of one submission that get the follow-up.
  max: number
}

// Keyed by question number; a key means the question holds a follow-up slot, its value is
// the text typed so far ('' when nothing yet).
export type FollowUpAnswers = Answers

function asksFollowUp(value: string) {
  return value === '1' || value === '5'
}

// The follow-ups after a scale question's answer changes to value ('' = cleared).
export function followUpsAfterAnswer(current: FollowUpAnswers, followUp: SurveyFollowUp | null, question: SurveyQuestion, value: string): FollowUpAnswers {
  if (!followUp || question.type !== 'likert') return current
  const holdsSlot = question.n in current

  if (asksFollowUp(value)) {
    // 1 -> 5 keeps the follow-up and its text.
    if (holdsSlot || Object.keys(current).length >= followUp.max) return current
    return { ...current, [question.n]: '' }
  }

  if (!holdsSlot) return current
  const next = { ...current }
  delete next[question.n]
  return next
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
