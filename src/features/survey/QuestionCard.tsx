import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/cn'
import { t } from '@/i18n'
import { isValidWebsite, type Answers } from './surveyScoring'
import { isOtherOption } from './surveyEditions'
import type { SurveyQuestion } from './surveyData'
import { FOLLOW_UP_ANSWER_MAX, FOLLOW_UP_ANSWER_MIN, FOLLOW_UP_QUESTION, isFollowUpAnswered, normalizeFollowUpAnswer } from './surveyFollowUp'

type QuestionCardProps = {
  answer?: string
  error?: string
  // Text of the follow-up question under a scale answer of 1 or 5; undefined when the
  // question has no follow-up.
  followUpAnswer?: string
  isMissing?: boolean
  readOnly?: boolean
  onAnswer: (question: SurveyQuestion, value: string) => void
  onFollowUpAnswer?: (question: SurveyQuestion, value: string) => void
  onOtherAnswer: (question: SurveyQuestion, value: string) => void
  otherAnswer?: string
  part: 1 | 2
  question: SurveyQuestion
}

export function QuestionCard({ answer, error, followUpAnswer, isMissing = false, onAnswer, onFollowUpAnswer, onOtherAnswer, otherAnswer = '', part, question, readOnly = false }: QuestionCardProps) {
  const [websiteTouched, setWebsiteTouched] = useState(false)
  // The follow-up field takes the cursor when a click on 1 or 5 makes it appear, not when
  // the page opens with it already there (a restored draft or the read-only review).
  const hasFollowUp = followUpAnswer !== undefined
  const [followUpWasShown, setFollowUpWasShown] = useState(hasFollowUp)
  const [focusFollowUp, setFocusFollowUp] = useState(false)
  if (hasFollowUp !== followUpWasShown) {
    setFollowUpWasShown(hasFollowUp)
    setFocusFollowUp(hasFollowUp)
  }
  const websiteError = question.type === 'text' && websiteTouched && Boolean(answer?.trim()) && !isValidWebsite(answer ?? '')
    ? t('Website công ty chưa đúng định dạng. Ví dụ: example.com hoặc https://example.com')
    : undefined
  const fieldError = websiteError ?? error
  const describedBy = fieldError ? `survey-question-${question.n}-error` : undefined

  return (
    <article aria-readonly={readOnly} className={cn(isMissing && 'is-missing', readOnly && 'is-read-only', 'survey-question-card', `is-${question.type}`)} data-question={question.n} id={`survey-q-${question.n}`}>
      <div className="survey-question-number">{t('Câu {n}', { n: question.n })}</div>
      <h1 className="survey-question-title" id={`survey-question-${question.n}`}>{t(question.q)}</h1>
      <QuestionInput
        answer={answer}
        describedBy={describedBy}
        error={fieldError}
        onAnswer={onAnswer}
        onOtherAnswer={onOtherAnswer}
        onWebsiteBlur={() => setWebsiteTouched(true)}
        otherAnswer={otherAnswer}
        part={part}
        question={question}
        readOnly={readOnly}
      />
      {question.type === 'likert' && followUpAnswer !== undefined ? (
        <FollowUpField
          autoFocus={focusFollowUp && !readOnly}
          invalid={isMissing && !isFollowUpAnswered(followUpAnswer)}
          onChange={(value) => onFollowUpAnswer?.(question, value)}
          part={part}
          question={question}
          readOnly={readOnly}
          value={followUpAnswer}
        />
      ) : null}
    </article>
  )
}

type FollowUpFieldProps = {
  autoFocus: boolean
  invalid: boolean
  onChange: (value: string) => void
  part: 1 | 2
  question: SurveyQuestion
  readOnly: boolean
  value: string
}

function FollowUpField({ autoFocus, invalid, onChange, part, question, readOnly, value }: FollowUpFieldProps) {
  const id = `survey-p${part}-q${question.n}-follow-up`
  const hintId = `${id}-hint`
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Same as the "other" text box: the cursor moves into the field that just appeared.
  useEffect(() => {
    if (autoFocus) window.requestAnimationFrame(() => textareaRef.current?.focus())
  }, [autoFocus])

  const length = normalizeFollowUpAnswer(value).length

  return (
    <div className={cn('survey-follow-up', invalid && 'is-invalid')}>
      <label className="survey-follow-up-label" htmlFor={id}>
        <span className="survey-follow-up-eyebrow">{t('Câu hỏi phụ')}</span>
        <span className="survey-follow-up-question">{t(FOLLOW_UP_QUESTION)}</span>
      </label>
      <textarea
        aria-describedby={readOnly ? undefined : hintId}
        aria-invalid={invalid}
        aria-required="true"
        className="survey-follow-up-input"
        id={id}
        maxLength={FOLLOW_UP_ANSWER_MAX}
        onChange={(event) => onChange(event.currentTarget.value)}
        placeholder={t('Chia sẻ ngắn gọn lý do, ít nhất {min} ký tự', { min: FOLLOW_UP_ANSWER_MIN })}
        readOnly={readOnly}
        ref={textareaRef}
        rows={3}
        value={value}
      />
      {readOnly ? null : (
        <div className="survey-follow-up-foot" id={hintId}>
          {invalid ? (
            <p className="survey-field-error" role="alert">{t('Vui lòng trả lời câu hỏi phụ, ít nhất {min} ký tự.', { min: FOLLOW_UP_ANSWER_MIN })}</p>
          ) : (
            <span>{t('Bắt buộc · ít nhất {min} ký tự', { min: FOLLOW_UP_ANSWER_MIN })}</span>
          )}
          <span aria-hidden="true" className="survey-follow-up-count">{length}/{FOLLOW_UP_ANSWER_MAX}</span>
        </div>
      )}
    </div>
  )
}

type QuestionInputProps = QuestionCardProps & { describedBy?: string; onWebsiteBlur?: () => void }

function QuestionInput({ answer, describedBy, error, onAnswer, onOtherAnswer, onWebsiteBlur, otherAnswer, part, question, readOnly = false }: QuestionInputProps) {
  const otherInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (readOnly || question.type !== 'mcq' || !isOtherOption(answer)) return
    window.requestAnimationFrame(() => otherInputRef.current?.focus())
  }, [answer, question.type, readOnly])

  if (question.type === 'likert') {
    return (
      <fieldset aria-describedby={describedBy} aria-invalid={Boolean(error)} aria-label={t('Mức độ đồng ý')} className="survey-question-fieldset">
        <div className="survey-likert-grid">
          {[1, 2, 3, 4, 5].map((value) => {
            const option = String(value)
            const id = `survey-p${part}-q${question.n}-v${value}`

            return (
              <div key={id}>
                <input
                  checked={answer === option}
                  disabled={readOnly}
                  id={id}
                  name={`survey-q-${question.n}`}
                  onChange={() => onAnswer(question, option)}
                  type="radio"
                  value={option}
                />
                <label htmlFor={id}>{value}</label>
              </div>
            )
          })}
        </div>
      </fieldset>
    )
  }

  if (question.type === 'mcq') {
    return (
      <fieldset aria-describedby={describedBy} aria-invalid={Boolean(error)} className="survey-question-fieldset">
        <legend className="survey-question-hint">{question.instruction ? t(question.instruction) : t('*lựa chọn 1 đáp án phù hợp nhất')}</legend>
        <div className="survey-options">
          {question.options.map((option, index) => {
            const id = `survey-p${part}-q${question.n}-o${index}`
            const isOther = isOtherOption(option)
            const checked = answer === option

            return (
              <div className="survey-option-wrap" key={id}>
                <input
                  checked={checked}
                  disabled={readOnly}
                  id={id}
                  name={`survey-q-${question.n}`}
                  onChange={() => onAnswer(question, option)}
                  onClick={() => {
                    if (readOnly) return
                    if (part === 2 && answer === option) onAnswer(question, '')
                  }}
                  type="radio"
                  value={option}
                />
                <label htmlFor={id}>
                  <span className="survey-option-dot" aria-hidden="true" />
                  <span>{isOther ? t('Khác') : t(option)}</span>
                </label>
                {isOther ? (
                  <input
                    aria-label={t('Nội dung khác cho câu {n}', { n: question.n })}
                    aria-invalid={Boolean(checked && error)}
                    className={cn('survey-other-input', checked && 'is-visible')}
                    maxLength={500}
                    onChange={(event) => onOtherAnswer(question, event.currentTarget.value)}
                    placeholder={t('Nhập nội dung khác')}
                    readOnly={readOnly}
                    ref={otherInputRef}
                    type="text"
                    value={otherAnswer}
                  />
                ) : null}
              </div>
            )
          })}
        </div>
      </fieldset>
    )
  }

  const inputId = `survey-p${part}-q${question.n}-text`
  return (
    <div className="survey-text-question">
      <label htmlFor={inputId}>{t('Website công ty')}</label>
      <input
        aria-describedby={describedBy}
        aria-invalid={Boolean(error)}
        autoCapitalize="none"
        autoCorrect="off"
        autoComplete="url"
        className="survey-text-input"
        id={inputId}
        inputMode="url"
        onBlur={onWebsiteBlur}
        onChange={(event) => onAnswer(question, event.currentTarget.value)}
        placeholder={t('example.com hoặc https://example.com')}
        readOnly={readOnly}
        type="url"
        value={answer || ''}
      />
       {error ? <p className="survey-field-error" id={describedBy} role="alert">{error}</p> : null}
    </div>
  )
}

export type QuestionAnswers = {
  answers: Answers
  otherAnswers: Answers
}
