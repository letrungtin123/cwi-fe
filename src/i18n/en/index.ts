import { landingEn } from './landing'
import { legalEn } from './legal'
import { questionsEn } from './questions'
import { surveyEn } from './survey'

export const en: Record<string, string> = { ...questionsEn, ...landingEn, ...surveyEn, ...legalEn }
