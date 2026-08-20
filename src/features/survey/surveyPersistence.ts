import type { Answers } from './surveyScoring'

export const SURVEY_SESSION_STORAGE_KEY = 'cwi:survey-session:v1'

export type SurveyScreen = 'intro' | 'part1' | 'part2' | 'contact1' | 'contact2' | 'loading' | 'result'
export type ReportMode = 'part1' | 'private'
export type ConsentChoice = 'yes' | 'no' | ''
export type ContactState = { email: string; name: string; jobTitle: string; jobTitleOther: string }

export type SurveySession = {
  activeQuestion: number
  answers: Answers
  consent: ConsentChoice
  dataCollectionConsent: boolean
  contact: ContactState
  formError: string
  loadingStep: number
  missingQuestionNumbers: number[]
  otherAnswers: Answers
  partTwoPrivacyRefused: boolean
  reportMode: ReportMode
  roundtableContact: ContactState
  roundtableError: string
  roundtableOpen: boolean
  roundtableRegistered: boolean
  roundtableRegisteredAt: string
  roundtableRegistrationId: string
  roundtableRegistrationIdempotencyKey: string
  screen: SurveyScreen
  submittedAt: string
  submittedSubmissionId: string
  submissionError: string
  submissionIdempotencyKey: string
  submissionModalOpen: boolean
  questionError: string
  version: 1
}

export function hasSurveySession() {
  if (typeof window === 'undefined') return false

  try {
    return Boolean(window.sessionStorage.getItem(SURVEY_SESSION_STORAGE_KEY))
  } catch {
    return false
  }
}

export function readSurveySession(): SurveySession | null {
  if (typeof window === 'undefined') return null

  try {
    const raw = window.sessionStorage.getItem(SURVEY_SESSION_STORAGE_KEY)
    if (!raw) return null

    const parsed = JSON.parse(raw) as SurveySession
    if (parsed.version !== 1 || !parsed.screen || !parsed.answers || !parsed.otherAnswers) return null
    return parsed
  } catch {
    return null
  }
}

export function writeSurveySession(session: SurveySession) {
  if (typeof window === 'undefined') return

  try {
    window.sessionStorage.setItem(SURVEY_SESSION_STORAGE_KEY, JSON.stringify(session))
  } catch {
    // Storage can be unavailable in private browsing or when quota is exhausted.
  }
}

export function clearSurveySession() {
  if (typeof window === 'undefined') return

  try {
    window.sessionStorage.removeItem(SURVEY_SESSION_STORAGE_KEY)
  } catch {
    // Ignore storage cleanup failures; navigation must still complete.
  }
}
