import type { Answers } from './surveyScoring'
import { SURVEY_VERSIONS } from './surveyVersions'

// A draft is kept per quarter (cwi:survey-session:2026Q3, ...:2026Q4), so answers given to one
// quarter's questions are never restored onto another's. ACTIVE_KEY holds the quarter being
// worked on (a reload reopens it), or '' while the quarter list is shown. When ACTIVE_KEY does
// not exist at all the draft is one from before quarters could be chosen (key ...:2026Q4).
const SESSION_KEY_PREFIX = 'cwi:survey-session:'
const ACTIVE_KEY = 'cwi:survey-session:active'

function sessionKey(version: string) {
  return SESSION_KEY_PREFIX + version
}

export type SurveyScreen = 'intro' | 'part1' | 'part2' | 'contact1' | 'contact2' | 'loading' | 'report'
export type ReportMode = 'part1' | 'private'
export type ConsentChoice = 'yes' | 'no' | ''
export type ContactState = { companyName: string; email: string; name: string; phone: string; jobTitle: string; jobTitleOther: string }

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
  reportAccessToken?: string
  reportAccessTokenExpiresAt?: string
  reportDeferredDays?: number | null
  reportEmailStatus?: string
  reportJobId?: string
  reportStatus?: string
  reportMode: ReportMode
  roundtableContact: ContactState
  roundtableError: string
  roundtableOpen: boolean
  roundtableRegistered: boolean
  roundtableRegisteredAt: string
  roundtableRegistrationId: string
  roundtableRegistrationIdempotencyKey: string
  webinarError: string
  webinarRegistered: boolean
  webinarRegisteredAt: string
  webinarRegistrationId: string
  webinarRegistrationIdempotencyKey: string
  screen: SurveyScreen
  submittedAt: string
  submittedSubmissionId: string
  submissionError: string
  submissionIdempotencyKey: string
  submissionModalOpen: boolean
  questionError: string
  version: 1
}

function normalizeContactState(value: Partial<ContactState> | null | undefined): ContactState {
  return {
    companyName: value?.companyName ?? '',
    email: value?.email ?? '',
    name: value?.name ?? '',
    phone: value?.phone ?? '',
    jobTitle: value?.jobTitle ?? '',
    jobTitleOther: value?.jobTitleOther ?? '',
  }
}

// The quarter whose draft the survey should reopen, or null when there is none.
export function readActiveSurveyVersion(): string | null {
  if (typeof window === 'undefined') return null

  try {
    const active = window.sessionStorage.getItem(ACTIVE_KEY)
    if (active !== null) return (SURVEY_VERSIONS as readonly string[]).includes(active) && window.sessionStorage.getItem(sessionKey(active)) ? active : null
    // Drafts saved before the active marker existed.
    return [...SURVEY_VERSIONS].reverse().find((version) => window.sessionStorage.getItem(sessionKey(version))) ?? null
  } catch {
    return null
  }
}

export function writeActiveSurveyVersion(version: string) {
  if (typeof window === 'undefined') return

  try {
    window.sessionStorage.setItem(ACTIVE_KEY, version)
  } catch {
    // Storage can be unavailable in private browsing.
  }
}

// Back to the quarter list: the drafts stay (their cards then say "continue"), but a reload
// shows the list instead of reopening one of them.
export function leaveActiveSurveyVersion() {
  writeActiveSurveyVersion('')
}

// This tab has already shown the survey: a quarter is being worked on, or the respondent went
// back to the quarter list ('').
export function hasActiveSurveyMarker() {
  if (typeof window === 'undefined') return false
  try {
    return window.sessionStorage.getItem(ACTIVE_KEY) !== null
  } catch {
    return false
  }
}

export function hasSurveySession() {
  return readActiveSurveyVersion() !== null
}

// True when the quarter has a draft with at least one answer (its card then says "continue").
export function hasSurveyDraft(version: string) {
  const session = readSurveySession(version)
  return Boolean(session && Object.keys(session.answers).length && !session.submittedSubmissionId)
}

export function readSurveySession(version: string): SurveySession | null {
  if (typeof window === 'undefined') return null

  try {
    const raw = window.sessionStorage.getItem(sessionKey(version))
    if (!raw) return null

    const parsed = JSON.parse(raw) as SurveySession
    if (parsed.version !== 1 || !parsed.screen || !parsed.answers || !parsed.otherAnswers) return null
    return {
      ...parsed,
      // "result" was a screen of an older version that no longer exists.
      screen: (parsed.screen as string) === 'result' ? 'intro' : parsed.screen,
      contact: normalizeContactState(parsed.contact),
      roundtableContact: normalizeContactState(parsed.roundtableContact),
    }
  } catch {
    return null
  }
}

export function writeSurveySession(version: string, session: SurveySession) {
  if (typeof window === 'undefined') return

  try {
    window.sessionStorage.setItem(sessionKey(version), JSON.stringify(session))
  } catch {
    // Storage can be unavailable in private browsing or when quota is exhausted.
  }
}

// Without a version: every quarter's draft (a fresh start from an invitation link).
export function clearSurveySession(version?: string) {
  if (typeof window === 'undefined') return

  try {
    const versions = version ? [version] : [...SURVEY_VERSIONS]
    versions.forEach((item) => window.sessionStorage.removeItem(sessionKey(item)))
    if (!version) window.sessionStorage.removeItem(ACTIVE_KEY)
    else if (window.sessionStorage.getItem(ACTIVE_KEY) === version) window.sessionStorage.setItem(ACTIVE_KEY, '')
  } catch {
    // Ignore storage cleanup failures; navigation must still complete.
  }
}
