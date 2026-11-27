import { describe, expect, it } from 'vitest'
import { en } from '@/i18n/en'
import { getSurveyEdition } from './surveyEditions'
import { EMPTY_FOLLOW_UP_STATE, FOLLOW_UP_QUESTION, followUpStateAfterAnswer, followUpStateWithout, isFollowUpAnswered, restoreFollowUpState, type FollowUpAnswers, type FollowUpState } from './surveyFollowUp'
import { hasQuestionAnswer } from './surveyScoring'
import { buildSurveySubmissionPayload } from './surveySubmissionPayload'

const q4 = getSurveyEdition('2026Q4')!
const q3 = getSurveyEdition('2026Q3')!
const question = (n: number) => q4.partOneQuestions.find((item) => item.n === n)!

function pick(current: FollowUpState, n: number, value: string) {
  return followUpStateAfterAnswer(current, q4.followUp, question(n), value)
}

function type(current: FollowUpState, n: number, text: string): FollowUpState {
  return { ...current, answers: { ...current.answers, [n]: text } }
}

const scaleNumbers = q4.partOneQuestions.filter((item) => item.type === 'likert').map((item) => item.n)

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

    let state = pick(EMPTY_FOLLOW_UP_STATE, 3, '4')
    expect(state.answers).toEqual({})
    state = pick(state, 1, '1')
    state = pick(state, 2, '5')
    expect(state.answers).toEqual({ 1: '', 2: '' })
    // A third 1 or 5 waits without a follow-up.
    state = pick(state, 4, '1')
    expect(state.answers).toEqual({ 1: '', 2: '' })
    expect(state.order).toEqual([1, 2, 4])
  })

  it('passes a freed follow-up to the 1 or 5 already waiting, the earliest picked first', () => {
    // Questions 1 and 2 hold the follow-ups, then 5 is picked on question 3, then 1 on question 4.
    let state = type(type(pick(pick(EMPTY_FOLLOW_UP_STATE, 1, '1'), 2, '5'), 1, 'Lý do của câu một'), 2, 'Lý do của câu hai')
    state = pick(pick(state, 3, '5'), 4, '1')
    // 1 -> 5 keeps the follow-up and its text.
    state = pick(state, 1, '5')
    expect(state.answers[1]).toBe('Lý do của câu một')

    // Question 1 changes to 3: its text goes away and question 3 (picked before 4) gets the follow-up.
    state = pick(state, 1, '3')
    expect(state.answers).toEqual({ 2: 'Lý do của câu hai', 3: '' })
    // Question 2 changes too: question 4 is next.
    state = pick(state, 2, '4')
    expect(state.answers).toEqual({ 3: '', 4: '' })
    // Picking 1 again on question 1 now waits behind 3 and 4, with its old text gone.
    state = pick(state, 1, '1')
    expect(state.answers).toEqual({ 3: '', 4: '' })
    expect(state.order).toEqual([3, 4, 1])
  })

  it('ignores multiple-choice questions and quarters without follow-ups', () => {
    const mcq = q4.partOneQuestions.find((item) => item.type === 'mcq')!
    expect(followUpStateAfterAnswer(EMPTY_FOLLOW_UP_STATE, q4.followUp, mcq, '1')).toBe(EMPTY_FOLLOW_UP_STATE)
    expect(followUpStateAfterAnswer(EMPTY_FOLLOW_UP_STATE, q3.followUp, q3.partOneQuestions[0]!, '1')).toBe(EMPTY_FOLLOW_UP_STATE)
    const state = pick(pick(EMPTY_FOLLOW_UP_STATE, 1, '1'), 2, '1')
    expect(followUpStateWithout(state, q4.followUp, [19, 20])).toBe(state)
  })

  it('restores a saved draft, also one saved before the order was kept', () => {
    const answers = { 1: '3', 2: '5', 3: '1', 4: '5', 17: '1' }
    const saved = restoreFollowUpState({ followUpAnswers: { 3: 'Lý do câu ba', 4: '' }, followUpOrder: [3, 4, 2] }, answers, q4.followUp, scaleNumbers)
    expect(saved).toEqual({ answers: { 3: 'Lý do câu ba', 4: '' }, order: [3, 4, 2] })
    // Older draft: only texts; question 1 is no longer 1 or 5 and is dropped.
    const older = restoreFollowUpState({ followUpAnswers: { 1: 'cũ', 4: 'Lý do câu bốn' } }, answers, q4.followUp, scaleNumbers)
    expect(older).toEqual({ answers: { 2: '', 4: 'Lý do câu bốn' }, order: [4, 2, 3] })
    expect(restoreFollowUpState(null, answers, q4.followUp, scaleNumbers)).toEqual(EMPTY_FOLLOW_UP_STATE)
    expect(restoreFollowUpState({ followUpAnswers: { 3: 'x' } }, answers, null, scaleNumbers)).toEqual(EMPTY_FOLLOW_UP_STATE)
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
