import { describe, expect, it } from 'vitest'
import { en } from '@/i18n/en'
import { getSurveyEdition } from './surveyEditions'
import { FOLLOW_UP_QUESTION, followUpsAfterAnswer, isFollowUpAnswered, type FollowUpAnswers } from './surveyFollowUp'
import { hasQuestionAnswer } from './surveyScoring'
import { buildSurveySubmissionPayload } from './surveySubmissionPayload'

const q4 = getSurveyEdition('2026Q4')!
const q3 = getSurveyEdition('2026Q3')!
const question = (n: number) => q4.partOneQuestions.find((item) => item.n === n)!

function pick(current: FollowUpAnswers, n: number, value: string) {
  return followUpsAfterAnswer(current, q4.followUp, question(n), value)
}

const contact = { companyName: 'CWI', email: 'an@company.com', jobTitle: 'CEO / Tổng Giám đốc', jobTitleOther: '', name: 'Nguyễn Văn An', phone: '0901234567' }

function partOnePayload(answers: Record<number, string>, followUps: FollowUpAnswers, edition = q4) {
  return buildSurveySubmissionPayload({
    answers, consent: '', contact, edition, followUps, otherAnswers: {}, partTwoPrivacyRefused: false, reportMode: 'part1',
    roundtableContact: contact, roundtableRegistered: false, roundtableRegistrationId: '',
  })
}

function q4PartOneAnswers(overrides: Record<number, string>) {
  const answers: Record<number, string> = Object.fromEntries(Array.from({ length: 16 }, (_unused, index) => [index + 1, '3']))
  answers[17] = q4.partOneQuestions[16]!.type === 'mcq' ? q4.partOneQuestions[16]!.options[0]! : ''
  answers[18] = q4.partOneQuestions[17]!.type === 'mcq' ? q4.partOneQuestions[17]!.options[0]! : ''
  return { ...answers, ...overrides }
}

describe('follow-up question slots', () => {
  it('asks only Q4, only under 1 or 5, and at most twice at a time', () => {
    expect(q4.followUp).toEqual({ max: 2 })
    expect(q3.followUp).toBeNull()

    let followUps: FollowUpAnswers = {}
    followUps = pick(followUps, 3, '4')
    expect(followUps).toEqual({})
    followUps = pick(followUps, 1, '1')
    followUps = pick(followUps, 2, '5')
    expect(followUps).toEqual({ 1: '', 2: '' })
    // A third 1 or 5 gets no follow-up.
    followUps = pick(followUps, 4, '1')
    expect(followUps).toEqual({ 1: '', 2: '' })
  })

  it('removes the follow-up and its text when the answer becomes 2-4, and gives the slot to the next 1 or 5', () => {
    let followUps: FollowUpAnswers = { 1: 'Lý do của câu một', 2: 'Lý do của câu hai' }
    // 1 -> 5 keeps the text.
    followUps = pick(followUps, 1, '5')
    expect(followUps[1]).toBe('Lý do của câu một')

    followUps = pick(followUps, 1, '3')
    expect(followUps).toEqual({ 2: 'Lý do của câu hai' })
    followUps = pick(followUps, 7, '5')
    expect(followUps).toEqual({ 2: 'Lý do của câu hai', 7: '' })
    // Picking 1 again on question 1 now finds both slots taken.
    expect(pick(followUps, 1, '1')).toEqual(followUps)
  })

  it('ignores multiple-choice questions and quarters without follow-ups', () => {
    const mcq = q4.partOneQuestions.find((item) => item.type === 'mcq')!
    expect(followUpsAfterAnswer({}, q4.followUp, mcq, '1')).toEqual({})
    expect(followUpsAfterAnswer({}, q3.followUp, q3.partOneQuestions[0]!, '1')).toEqual({})
  })

  it('needs at least 10 characters once spaces are folded', () => {
    expect(isFollowUpAnswered('   ngắn    ')).toBe(false)
    expect(isFollowUpAnswered('chín  ký  ')).toBe(false)
    expect(isFollowUpAnswered('Đủ mười ký')).toBe(true)
    expect(hasQuestionAnswer(question(1), { 1: '1' }, {}, { 1: 'ngắn' })).toBe(false)
    expect(hasQuestionAnswer(question(1), { 1: '1' }, {}, { 1: 'Đủ mười ký tự rồi' })).toBe(true)
    expect(hasQuestionAnswer(question(1), { 1: '1' }, {})).toBe(true)
  })

  it('has the follow-up texts in English', () => {
    expect(en[FOLLOW_UP_QUESTION]).toBe('Why did you choose this response?')
    expect(en['Câu hỏi phụ']).toBeTruthy()
  })
})

describe('follow-up answers in the submission', () => {
  it('sends the folded answer with its scale answer and nothing for other questions', () => {
    const payload = partOnePayload(q4PartOneAnswers({ 2: '1', 9: '5' }), { 2: '  Công nghệ   chưa giúp\nquản trị. ', 9: 'Mọi người đều dùng AI hằng ngày.' })
    expect(payload.answers.find((answer) => answer.idx === 2)).toEqual({ answer: 1, followUpAnswer: 'Công nghệ chưa giúp quản trị.', idx: 2 })
    expect(payload.answers.find((answer) => answer.idx === 9)).toEqual({ answer: 5, followUpAnswer: 'Mọi người đều dùng AI hằng ngày.', idx: 9 })
    expect(payload.answers.filter((answer) => 'followUpAnswer' in answer)).toHaveLength(2)
  })

  it('refuses to send a follow-up that is not answered yet', () => {
    expect(() => partOnePayload(q4PartOneAnswers({ 2: '1' }), { 2: 'ngắn' })).toThrow()
  })

  it('never sends follow-ups for a quarter without them', () => {
    const answers: Record<number, string> = Object.fromEntries(Array.from({ length: 16 }, (_unused, index) => [index + 1, '1']))
    answers[17] = q3.partOneQuestions[16]!.type === 'mcq' ? q3.partOneQuestions[16]!.options[0]! : ''
    answers[18] = q3.partOneQuestions[17]!.type === 'mcq' ? q3.partOneQuestions[17]!.options[0]! : ''
    const payload = partOnePayload(answers, { 1: 'Một câu trả lời đủ dài.' }, q3)
    expect(payload.answers.some((answer) => 'followUpAnswer' in answer)).toBe(false)
  })
})
