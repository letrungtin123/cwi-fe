import { useEffect, useRef } from 'react'
import { cn } from '@/lib/cn'
import { OTHER_OPTION, type Answers } from './surveyScoring'
import type { SurveyQuestion } from './surveyData'

type QuestionCardProps = {
  answer?: string
  error?: string
  isMissing?: boolean
  onAnswer: (question: SurveyQuestion, value: string) => void
  onOtherAnswer: (question: SurveyQuestion, value: string) => void
  otherAnswer?: string
  part: 1 | 2
  question: SurveyQuestion
}

export function QuestionCard({ answer, error, isMissing = false, onAnswer, onOtherAnswer, otherAnswer = '', part, question }: QuestionCardProps) {
  const describedBy = error ? `survey-question-${question.n}-error` : undefined

  return (
    <article className={cn(isMissing && 'is-missing', 'survey-question-card', `is-${question.type}`)} data-question={question.n} id={`survey-q-${question.n}`}>
      <div className="survey-question-number">Câu {question.n}</div>
      <h1 className="survey-question-title" id={`survey-question-${question.n}`}>{question.q}</h1>
      <QuestionInput
        answer={answer}
        describedBy={describedBy}
        error={error}
        onAnswer={onAnswer}
        onOtherAnswer={onOtherAnswer}
        otherAnswer={otherAnswer}
        part={part}
        question={question}
      />
    </article>
  )
}

type QuestionInputProps = QuestionCardProps & { describedBy?: string }

function QuestionInput({ answer, describedBy, error, onAnswer, onOtherAnswer, otherAnswer, part, question }: QuestionInputProps) {
  const otherInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (question.type !== 'mcq' || answer !== OTHER_OPTION) return
    window.requestAnimationFrame(() => otherInputRef.current?.focus())
  }, [answer, question.type])

  if (question.type === 'likert') {
    return (
      <fieldset aria-describedby={describedBy} aria-invalid={Boolean(error)} className="survey-question-fieldset">
        <legend className="survey-question-hint">5 - hoàn toàn đồng ý, 1 - không đồng ý</legend>
        <div className="survey-likert-grid">
          {[1, 2, 3, 4, 5].map((value) => {
            const option = String(value)
            const id = `survey-p${part}-q${question.n}-v${value}`

            return (
              <div key={id}>
                <input
                  checked={answer === option}
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
        <legend className="survey-question-hint">{question.instruction || '*lựa chọn 1 đáp án phù hợp nhất'}</legend>
        <div className="survey-options">
          {question.options.map((option, index) => {
            const id = `survey-p${part}-q${question.n}-o${index}`
            const isOther = option === OTHER_OPTION
            const checked = answer === option

            return (
              <div className="survey-option-wrap" key={id}>
                <input
                  checked={checked}
                  id={id}
                  name={`survey-q-${question.n}`}
                  onChange={() => onAnswer(question, option)}
                  type="radio"
                  value={option}
                />
                <label htmlFor={id}>
                  <span className="survey-option-dot" aria-hidden="true" />
                  <span>{option}</span>
                </label>
                {isOther ? (
                  <input
                    aria-label={`Nội dung khác cho câu ${question.n}`}
                    aria-invalid={Boolean(checked && error)}
                    className={cn('survey-other-input', checked && 'is-visible')}
                    onChange={(event) => onOtherAnswer(question, event.currentTarget.value)}
                    placeholder="Nhập nội dung khác"
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
      <label htmlFor={inputId}>Website công ty</label>
      <input
        aria-describedby={describedBy}
        aria-invalid={Boolean(error)}
        className="survey-text-input"
        id={inputId}
        onChange={(event) => onAnswer(question, event.currentTarget.value)}
        placeholder="https://tencongty.vn"
        type="url"
        value={answer || ''}
      />
    </div>
  )
}

export type QuestionAnswers = {
  answers: Answers
  otherAnswers: Answers
}