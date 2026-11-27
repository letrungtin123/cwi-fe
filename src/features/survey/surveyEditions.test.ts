import { afterEach, describe, expect, it } from 'vitest'
import { en } from '@/i18n/en'
import { getSurveyEdition, isOtherOption, LATEST_SURVEY_VERSION, otherOptionOf, surveyEditions, surveyQuarterLabel } from './surveyEditions'
import { clearSurveySession, hasSurveyDraft, leaveActiveSurveyVersion, readActiveSurveyVersion, readSurveySession, writeActiveSurveyVersion, writeSurveySession, type SurveySession } from './surveyPersistence'
import { buildSurveySubmissionPayload } from './surveySubmissionPayload'
import { SURVEY_VERSIONS } from './surveyVersions'

const contact = { companyName: 'CWI', email: 'an@company.com', jobTitle: 'CEO / Tổng Giám đốc', jobTitleOther: '', name: 'Nguyễn Văn An', phone: '0901234567' }

function session(answers: Record<number, string>): SurveySession {
  return {
    activeQuestion: 1, answers, consent: '', contact, dataCollectionConsent: false, formError: '', loadingStep: 1, missingQuestionNumbers: [], otherAnswers: {},
    partTwoPrivacyRefused: false, reportMode: 'part1', roundtableContact: contact, roundtableError: '', roundtableOpen: false, roundtableRegistered: false,
    roundtableRegisteredAt: '', roundtableRegistrationId: '', roundtableRegistrationIdempotencyKey: 'k1', screen: 'part1', submittedAt: '', submittedSubmissionId: '',
    submissionError: '', submissionIdempotencyKey: 'k2', submissionModalOpen: false, questionError: '', version: 1, webinarError: '', webinarRegistered: false,
    webinarRegisteredAt: '', webinarRegistrationId: '', webinarRegistrationIdempotencyKey: 'k3',
  }
}

describe('survey editions', () => {
  it('lists the same quarters as surveyVersions.ts, newest last', () => {
    expect(surveyEditions.map((edition) => edition.version)).toEqual([...SURVEY_VERSIONS])
    expect(LATEST_SURVEY_VERSION).toBe('2026Q4')
    expect(surveyQuarterLabel('2026Q3', 'vi')).toBe('Quý 3/2026')
    expect(surveyQuarterLabel('2026Q3', 'en')).toBe('Q3 2026')
  })

  it('has 18 + 6 questions in every quarter', () => {
    for (const edition of surveyEditions) {
      expect(edition.partOneQuestions.map((question) => question.n)).toEqual(Array.from({ length: 18 }, (_unused, index) => index + 1))
      expect(edition.partTwoQuestions.map((question) => question.n)).toEqual([19, 20, 21, 22, 23, 24])
    }
  })

  it('has an English text for every question and option of every quarter', () => {
    const texts = surveyEditions.flatMap((edition) =>
      [...edition.partOneQuestions, ...edition.partTwoQuestions].flatMap((question) => [question.q, ...(question.type === 'mcq' ? question.options : [])]),
    )
    expect(texts.filter((text) => !en[text])).toEqual([])
  })

  it('has its own intro, in English too, for every quarter', () => {
    expect(getSurveyEdition('2026Q3')!.introCopy.title).toBe('Năng lực Lãnh đạo')
    expect(getSurveyEdition('2026Q4')!.introCopy.title).toBe('Hệ cộng lực sẵn sàng')
    const texts = surveyEditions.flatMap(({ introCopy }) => [introCopy.eyebrow, introCopy.title, introCopy.emphasis, ...introCopy.paragraphs])
    expect(texts.filter((text) => !en[text])).toEqual([])
  })

  it('knows the "other" option of each quarter', () => {
    expect(isOtherOption('Khác.')).toBe(true)
    expect(isOtherOption('Mục khác:')).toBe(true)
    expect(isOtherOption('Thị trường')).toBe(false)
    const q3 = getSurveyEdition('2026Q3')!
    expect(otherOptionOf(q3.partOneQuestions[16]!)).toBe('Mục khác:')
    // Not offered on 2026Q3 questions 20 and 21 until cwi-ai accepts it.
    expect(otherOptionOf(q3.partTwoQuestions[1]!)).toBeNull()
    expect(otherOptionOf(q3.partTwoQuestions[2]!)).toBeNull()
  })
})

describe('submission payload', () => {
  it('sends the chosen quarter and its own "other" option', () => {
    const q3 = getSurveyEdition('2026Q3')!
    const answers: Record<number, string> = Object.fromEntries(Array.from({ length: 16 }, (_unused, index) => [index + 1, '4']))
    answers[17] = 'Mục khác:'
    answers[18] = 'Xây dựng đội ngũ kế nhiệm'
    const payload = buildSurveySubmissionPayload({
      answers, consent: '', contact, edition: q3, followUps: {}, otherAnswers: { 17: 'Thiếu dữ liệu nhân sự' }, partTwoPrivacyRefused: false, reportMode: 'part1',
      roundtableContact: contact, roundtableRegistered: false, roundtableRegistrationId: '',
    })
    expect(payload.surveyVersion).toBe('2026Q3')
    expect(payload.submissionStatus).toBe('part1_only')
    expect(payload.answers).toHaveLength(18)
    expect(payload.answers[16]).toEqual({ answer: 'Mục khác:', idx: 17, otherText: 'Thiếu dữ liệu nhân sự' })
  })
})

describe('survey drafts per quarter', () => {
  afterEach(() => clearSurveySession())

  it('keeps a separate draft for each quarter and remembers the last one', () => {
    writeSurveySession('2026Q3', session({ 1: '3' }))
    writeSurveySession('2026Q4', session({ 1: '5', 2: '4' }))
    writeActiveSurveyVersion('2026Q3')
    expect(readActiveSurveyVersion()).toBe('2026Q3')
    expect(readSurveySession('2026Q3')?.answers).toEqual({ 1: '3' })
    expect(readSurveySession('2026Q4')?.answers).toEqual({ 1: '5', 2: '4' })
    expect(hasSurveyDraft('2026Q4')).toBe(true)

    clearSurveySession('2026Q3')
    expect(readSurveySession('2026Q3')).toBeNull()
    // The other quarter's draft is kept, but a reload shows the quarter list.
    expect(readActiveSurveyVersion()).toBeNull()
    expect(hasSurveyDraft('2026Q4')).toBe(true)

    writeActiveSurveyVersion('2026Q4')
    expect(readActiveSurveyVersion()).toBe('2026Q4')
    leaveActiveSurveyVersion()
    expect(readActiveSurveyVersion()).toBeNull()
    expect(readSurveySession('2026Q4')?.answers).toEqual({ 1: '5', 2: '4' })

    clearSurveySession()
    expect(readActiveSurveyVersion()).toBeNull()
    expect(hasSurveyDraft('2026Q4')).toBe(false)
  })

  it('still finds a draft saved before quarters could be chosen', () => {
    window.sessionStorage.setItem('cwi:survey-session:2026Q4', JSON.stringify(session({ 1: '2' })))
    expect(readActiveSurveyVersion()).toBe('2026Q4')
  })
})
