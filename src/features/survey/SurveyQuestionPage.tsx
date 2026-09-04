import { AlertCircle, ArrowLeft } from 'lucide-react'
import type { Answers } from './surveyScoring'
import { QuestionCard } from './QuestionCard'
import { SurveyEyebrow, SurveyForwardArrow } from './SurveyChrome'
import type { SurveyQuestion } from './surveyData'

type SurveyQuestionPageProps = {
  answers: Answers
  completedCount: number
  endNote?: string
  error?: string
  intro: string
  missingQuestionNumbers: number[]
  onAnswer: (question: SurveyQuestion, value: string) => void
  onNext: () => void
  onOtherAnswer: (question: SurveyQuestion, value: string) => void
  onPrevious: () => void
  onSecondary?: () => void
  otherAnswers: Answers
  part: 1 | 2
  primaryLabel: string
  questions: SurveyQuestion[]
  readOnly?: boolean
  secondaryLabel?: string
  subtitle: string
}

function formatQuestionNumber(value: number) {
  return String(value).padStart(2, '0')
}

export function SurveyQuestionPage({
  answers,
  completedCount,
  endNote,
  error,
  intro,
  missingQuestionNumbers,
  onAnswer,
  onNext,
  onOtherAnswer,
  onPrevious,
  onSecondary,
  otherAnswers,
  part,
  primaryLabel,
  questions,
  readOnly = false,
  secondaryLabel = 'Xóa hết câu trả lời',
  subtitle,
}: SurveyQuestionPageProps) {
  const completionProgress = Math.round((completedCount / questions.length) * 100)
  const pageTitle = part === 1 ? 'PHẦN 1 - KHẢO SÁT KHUYẾT DANH' : 'PHẦN 2 - KHẢO SÁT ĐỊNH DANH'

  return (
    <section className="survey-question-page" aria-labelledby={'survey-question-page-' + part}>
      <div
        className="survey-question-progress"
        aria-label={'Đã hoàn tất ' + completedCount + ' trên ' + questions.length + ' câu hỏi.'}
      >
        <div className="survey-question-progress-head">
          <span>PHẦN {part} / 3</span>
          <div className="survey-question-progress-meta">
            <strong>{formatQuestionNumber(completedCount)} / {formatQuestionNumber(questions.length)}</strong>
            <small>{completedCount} câu hoàn tất</small>
          </div>
        </div>
        <div className="survey-question-progress-track" aria-hidden="true">
          <i style={{ width: completionProgress + '%' }} />
        </div>
      </div>

      <div className="survey-question-context">
        <SurveyEyebrow>{pageTitle}</SurveyEyebrow>
        <h1 className="survey-question-page-title" id={'survey-question-page-' + part}>{pageTitle}</h1>
        <p>{intro}</p>
        <span>{subtitle}</span>
      </div>

      <div className="survey-question-workspace">
        <div className="survey-question-stack">
          {questions.map((question) => {
            const isMissing = missingQuestionNumbers.includes(question.n)

            return (
              <QuestionCard
                answer={answers[question.n]}
                error={isMissing ? error : undefined}
                isMissing={isMissing}
                key={question.n}
                onAnswer={onAnswer}
                onOtherAnswer={onOtherAnswer}
                otherAnswer={otherAnswers[question.n]}
                part={part}
                question={question}
                readOnly={readOnly}
              />
            )
          })}
        </div>

        {endNote ? <p className="survey-question-end-note">{endNote}</p> : null}

        <div className="survey-question-actions">
          <button className="survey-previous-button" onClick={onPrevious} type="button">
            <ArrowLeft aria-hidden="true" size={17} />
            Quay lại
          </button>
          <div className="survey-question-action-end">
            {onSecondary && !readOnly ? <button className="survey-text-button survey-question-secondary-action" onClick={onSecondary} type="button">{secondaryLabel}</button> : null}
            <div className="survey-question-submit-group">
              {error ? (
                <div className="survey-validation-message survey-validation-message--summary" role="alert">
                  <AlertCircle aria-hidden="true" size={17} />
                  <span>{error}</span>
                </div>
              ) : null}
              <button className="survey-primary-button" onClick={onNext} type="button">
                {primaryLabel}
                <SurveyForwardArrow />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
