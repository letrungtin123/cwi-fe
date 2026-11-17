// Versions of the survey quarters this page has a question set for, oldest first. Kept apart
// from the question sets (surveyEditions.ts) because the landing page reads it on start-up
// to find a survey draft, without loading the survey itself.
export const SURVEY_VERSIONS = ['2026Q3', '2026Q4'] as const
