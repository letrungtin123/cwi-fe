import { useEffect, useRef, type RefObject } from 'react'
import { Check, Menu, X } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { SurveyQuestion } from './surveyData'

type SurveyNavigationProps = {
  activeQuestion: number
  hasAnswer?: (question: SurveyQuestion) => boolean
  onJump?: (number: number) => void
  questions: SurveyQuestion[]
  title: string
}

function formatQuestionNumber(value: number) {
  return String(value).padStart(2, '0')
}

export function MobileQuestionNav({
  activeQuestion,
  completedCount,
  onOpenNavigator,
  questions,
  title,
}: SurveyNavigationProps & { completedCount: number; onOpenNavigator: () => void }) {
  const position = Math.max(0, questions.findIndex((question) => question.n === activeQuestion)) + 1
  const progress = Math.round((completedCount / questions.length) * 100)

  return (
    <nav
      className="survey-mobile-question-nav"
      aria-label={title + '. Câu ' + position + ' trên ' + questions.length + '. Đã hoàn tất ' + completedCount + ' câu.'}
    >
      <div className="survey-mobile-question-nav-head">
        <span>{title}</span>
        <strong>{formatQuestionNumber(position)} / {formatQuestionNumber(questions.length)}</strong>
        <small>{completedCount} hoàn tất</small>
        <button aria-label="Mở danh sách câu hỏi" onClick={onOpenNavigator} type="button">
          <Menu aria-hidden="true" size={17} />
          <span>Danh sách</span>
        </button>
      </div>
      <div className="survey-mobile-question-nav-track" aria-hidden="true">
        <i style={{ width: progress + '%' }} />
      </div>
    </nav>
  )
}

export function QuestionDrawer({ activeQuestion, hasAnswer, onClose, onJump, open, questions, title }: SurveyNavigationProps & { onClose: () => void; open: boolean }) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const activeItemRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    window.requestAnimationFrame(() => activeItemRef.current?.scrollIntoView({ block: "center", behavior: "auto" }))
  }, [activeQuestion, open])

  useEffect(() => {
    if (!open) return

    const previousFocus = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.requestAnimationFrame(() => closeButtonRef.current?.focus())

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key !== 'Tab') return

      const focusable = Array.from(document.querySelectorAll<HTMLElement>('.survey-drawer button, .survey-drawer input, .survey-drawer [href], .survey-drawer [tabindex]:not([tabindex="-1"])'))
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
      window.requestAnimationFrame(() => previousFocus?.focus())
    }
  }, [onClose, open])

  if (!open) return null

  const completed = hasAnswer ? questions.reduce((count, question) => count + (hasAnswer(question) ? 1 : 0), 0) : 0

  return (
    <>
      <div aria-hidden="true" className="survey-drawer-backdrop" onClick={onClose} />
      <aside aria-labelledby="survey-drawer-title" aria-modal="true" className="survey-drawer is-open" role="dialog">
        <div className="survey-drawer-handle" aria-hidden="true" />
        <div className="survey-drawer-head">
          <div>
            <span id="survey-drawer-title">Danh sách câu hỏi</span>
            <strong>{title}</strong>
            <small>{completed}/{questions.length} đã trả lời</small>
          </div>
          <button aria-label="Đóng danh sách câu hỏi" onClick={onClose} ref={closeButtonRef} type="button">
            <X aria-hidden="true" size={19} />
          </button>
        </div>
        <QuestionList activeItemRef={activeItemRef} activeQuestion={activeQuestion} hasAnswer={hasAnswer} onJump={onJump} questions={questions} />
      </aside>
    </>
  )
}

function QuestionList({ activeItemRef, activeQuestion, hasAnswer, onJump, questions }: Omit<SurveyNavigationProps, 'title'> & { activeItemRef?: RefObject<HTMLButtonElement | null> }) {
  return (
    <div className="survey-question-list">
      {questions.map((question) => {
        const answered = hasAnswer?.(question) ?? false
        return (
          <button
            aria-current={activeQuestion === question.n ? 'step' : undefined}
            className={cn(answered && 'is-answered', activeQuestion === question.n && 'is-active')}
            key={question.n}
            ref={activeQuestion === question.n ? activeItemRef : undefined}
            onClick={() => onJump?.(question.n)}
            type="button"
          >
            <span>{formatQuestionNumber(question.n)}</span>
            <strong>{question.q}</strong>
            {answered ? <Check aria-hidden="true" size={15} /> : <i aria-hidden="true" />}
          </button>
        )
      })}
    </div>
  )
}
