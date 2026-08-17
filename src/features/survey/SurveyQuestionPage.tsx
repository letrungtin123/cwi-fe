import { AlertCircle, ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { Answers } from './surveyScoring'
import { QuestionCard } from './QuestionCard'
import { MobileQuestionNav } from './SurveyNavigation'
import { SurveyEyebrow, SurveyForwardArrow } from './SurveyChrome'
import type { SurveyQuestion } from './surveyData'

type SurveyQuestionPageProps = {
  activeQuestion: number
  answers: Answers
  completedCount: number
  error?: string
  intro: string
  onAnswer: (question: SurveyQuestion, value: string) => void
  onNext: () => void
  onOpenNavigator: () => void
  onOtherAnswer: (question: SurveyQuestion, value: string) => void
  onPrevious: () => void
  onSecondary?: () => void
  otherAnswers: Answers
  part: 1 | 2
  primaryLabel: string
  questions: SurveyQuestion[]
  secondaryLabel?: string
  subtitle: string
}

function formatQuestionNumber(value: number) {
  return String(value).padStart(2, '0')
}

export function SurveyQuestionPage({
  activeQuestion,
  answers,
  completedCount,
  error,
  intro,
  onAnswer,
  onNext,
  onOpenNavigator,
  onOtherAnswer,
  onPrevious,
  onSecondary,
  otherAnswers,
  part,
  primaryLabel,
  questions,
  secondaryLabel = 'Nhận Báo cáo Phần 1',
  subtitle,
}: SurveyQuestionPageProps) {
  const currentIndex = Math.max(0, questions.findIndex((question) => question.n === activeQuestion))
  const currentQuestion = questions[currentIndex] ?? questions[0]
  const position = currentIndex + 1
  const completionProgress = Math.round((completedCount / questions.length) * 100)
  const isFirstQuestion = currentIndex === 0
  const isLastQuestion = position === questions.length

  return (
    <section className="survey-question-page" aria-labelledby={'survey-question-' + currentQuestion.n}>
      <div
        className="survey-question-progress"
        aria-label={'Câu ' + position + ' trên ' + questions.length + '. Đã hoàn tất ' + completedCount + ' câu.'}
      >
        <div className="survey-question-progress-head">
          <span>PHẦN {part} · KHẢO SÁT {part === 1 ? 'KHUYẾT DANH' : 'ĐỊNH DANH'}</span>
          <div className="survey-question-progress-meta">
            <strong>{formatQuestionNumber(position)} / {formatQuestionNumber(questions.length)}</strong>
            <small>{completedCount} câu hoàn tất</small>
          </div>
        </div>
        <div className="survey-question-progress-track" aria-hidden="true">
          <i style={{ width: completionProgress + '%' }} />
        </div>
      </div>

      <MobileQuestionNav
        activeQuestion={currentQuestion.n}
        completedCount={completedCount}
        onOpenNavigator={onOpenNavigator}
        questions={questions}
        title={'Phần ' + part}
      />

      {isFirstQuestion ? (
        <div className="survey-question-context">
          <SurveyEyebrow>{part === 1 ? 'BẮT ĐẦU PHẦN 1' : 'TIẾP TỤC PHẦN 2'}</SurveyEyebrow>
          <p>{intro}</p>
          <span>{subtitle}</span>
        </div>
      ) : null}

      <div className="survey-question-workspace">
        <QuestionCard
          answer={answers[currentQuestion.n]}
          error={error}
          onAnswer={onAnswer}
          onOtherAnswer={onOtherAnswer}
          otherAnswer={otherAnswers[currentQuestion.n]}
          part={part}
          question={currentQuestion}
        />

        {error ? (
          <div className="survey-validation-message" id={'survey-question-' + currentQuestion.n + '-error'} role="alert">
            <AlertCircle aria-hidden="true" size={17} />
            <span>{error}</span>
          </div>
        ) : null}

        <div className="survey-question-actions">
          <button className="survey-previous-button" onClick={onPrevious} type="button">
            <ArrowLeft aria-hidden="true" size={17} />
            Câu trước
          </button>
          <button className={cn("survey-primary-button", !isLastQuestion && "survey-primary-button--task")} onClick={onNext} type="button">
            {isLastQuestion ? primaryLabel : 'Câu tiếp theo'}
            <SurveyForwardArrow />
          </button>
        </div>
        {onSecondary ? <button className="survey-text-button survey-question-secondary-action" onClick={onSecondary} type="button">{secondaryLabel}</button> : null}
      </div>
    </section>
  )
}
