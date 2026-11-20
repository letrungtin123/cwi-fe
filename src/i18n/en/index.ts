import { landingEn } from './landing'
import { legalEn } from './legal'
import { newsEn } from './news'
import { questionsEn } from './questions'
import { surveyEn } from './survey'

export const en: Record<string, string> = { ...questionsEn, ...landingEn, ...surveyEn, ...legalEn, ...newsEn }
