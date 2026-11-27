import { introCopy2026Q3, OTHER_OPTION_2026Q3, partOneQuestions2026Q3, partTwoQuestions2026Q3 } from './surveyData2026Q3'
import { introCopy, partOneQuestions, partTwoQuestions, type IntroCopy, type McqQuestion, type SurveyQuestion } from './surveyData'
import quarter3Image from '@/assets/figma/carousel-cwi.webp'
import quarter4Image from '@/assets/figma/BG-circle-ceo.webp'
import { FOLLOW_UP_MAX, type SurveyFollowUp } from './surveyFollowUp'

// Survey editions ("quý khảo sát") this page has a question set for. /survey opens on a list
// of quarter cards (title, description and image are edited in the dashboard); the chosen
// quarter's intro and questions follow, and its version goes with the submission. Same list
// as the backend's surveyEditions.ts: add a quarter in both.
export type SurveyEdition = {
  // Shown on the card until an admin uploads an image.
  defaultImage: string
  // Follow-up question under a scale answer of 1 or 5 (surveyFollowUp.ts), or null when the
  // quarter has none (cwi-ai asks nothing for 2026Q3).
  followUp: SurveyFollowUp | null
  // The quarter's intro screen, shown after its card is chosen.
  introCopy: IntroCopy
  otherOption: string
  partOneQuestions: SurveyQuestion[]
  partTwoQuestions: SurveyQuestion[]
  // Stored as survey_version, e.g. 2026Q4.
  version: string
}

export const OTHER_OPTION_2026Q4 = 'Khác.'

// Oldest first; the last one is the current quarter. Same versions as surveyVersions.ts.
export const surveyEditions: SurveyEdition[] = [
  { defaultImage: quarter3Image, followUp: null, introCopy: introCopy2026Q3, otherOption: OTHER_OPTION_2026Q3, partOneQuestions: partOneQuestions2026Q3, partTwoQuestions: partTwoQuestions2026Q3, version: '2026Q3' },
  { defaultImage: quarter4Image, followUp: { max: FOLLOW_UP_MAX }, introCopy, otherOption: OTHER_OPTION_2026Q4, partOneQuestions, partTwoQuestions, version: '2026Q4' },
]

export const LATEST_SURVEY_VERSION = surveyEditions[surveyEditions.length - 1]!.version

export function getSurveyEdition(version: string | null | undefined): SurveyEdition | null {
  return surveyEditions.find((edition) => edition.version === version) ?? null
}

// The "other" choice of every edition ("Khác." in 2026Q4, "Mục khác:" in 2026Q3).
const otherOptions = new Set(surveyEditions.map((edition) => edition.otherOption))

export function isOtherOption(value: string | undefined) {
  return value !== undefined && otherOptions.has(value)
}

export function otherOptionOf(question: SurveyQuestion) {
  return question.type === 'mcq' ? (question as McqQuestion).options.find((option) => otherOptions.has(option)) ?? null : null
}

// "Quý 3/2026"; the English page shows "Q3 2026".
export function surveyQuarterLabel(version: string, lang: 'en' | 'vi') {
  const match = /^([0-9]{4})Q([1-4])$/.exec(version)
  if (!match) return version
  return lang === 'en' ? `Q${match[2]} ${match[1]}` : `Quý ${match[2]}/${match[1]}`
}
