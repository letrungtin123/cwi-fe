import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { Answers } from './surveyScoring'
import { getSurveyScores, hasQuestionAnswer, OTHER_OPTION, validEmail } from './surveyScoring'
import { partOneQuestions, partTwoQuestions, type SurveyQuestion } from './surveyData'
import { SurveyHeader } from './SurveyChrome'
import { QuestionDrawer } from './SurveyNavigation'
import { SurveyQuestionPage } from './SurveyQuestionPage'
import {
  ContactScreen,
  IntroScreen,
  LoadingScreen,
  ResultScreen,
  RoundtableModal,
} from './SurveyScreens'
import './survey.css'

type SurveyScreen = 'intro' | 'part1' | 'part2' | 'contact1' | 'contact2' | 'loading' | 'result'
type ReportMode = 'part1' | 'private'
type ContactState = { email: string; name: string }
type ConsentChoice = 'yes' | 'no' | ''

const emptyContact: ContactState = { email: '', name: '' }

function countAnswers(questions: SurveyQuestion[], hasAnswer: (question: SurveyQuestion) => boolean) {
  return questions.reduce((count, question) => count + (hasAnswer(question) ? 1 : 0), 0)
}

function isContactValid(contact: ContactState) {
  if (!contact.name.trim() || !validEmail(contact.email.trim())) return 'Vui lòng điền đầy đủ Họ tên và Email công ty cá nhân hợp lệ.'
  return ''
}

function scrollToTop() {
  const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
  window.scrollTo({ behavior, top: 0 })
}

export function SurveyExperience({ onBackHome }: { onBackHome: () => void }) {
  const [screen, setScreen] = useState<SurveyScreen>('intro')
  const [answers, setAnswers] = useState<Answers>({})
  const [otherAnswers, setOtherAnswers] = useState<Answers>({})
  const [activeQuestion, setActiveQuestion] = useState(partOneQuestions[0]?.n ?? 1)
  const [drawerOpen, setDrawerOpen] = useState(() => window.matchMedia('(min-width: 768px)').matches)
  const [questionError, setQuestionError] = useState('')
  const [missingQuestionNumbers, setMissingQuestionNumbers] = useState<number[]>([])
  const [formError, setFormError] = useState('')
  const [roundtableError, setRoundtableError] = useState('')
  const [contact, setContact] = useState<ContactState>(emptyContact)
  const [roundtableContact, setRoundtableContact] = useState<ContactState>(emptyContact)
  const [consent, setConsent] = useState<ConsentChoice>('')
  const [reportMode, setReportMode] = useState<ReportMode>('part1')
  const [loadingStep, setLoadingStep] = useState(1)
  const [roundtableOpen, setRoundtableOpen] = useState(false)
  const [roundtableRegistered, setRoundtableRegistered] = useState(false)
  const roundtableTriggerRef = useRef<HTMLButtonElement | null>(null)

  const hasAnswer = useCallback(
    (question: SurveyQuestion) => hasQuestionAnswer(question, answers, otherAnswers),
    [answers, otherAnswers],
  )

  const partOneCompleted = useMemo(() => countAnswers(partOneQuestions, hasAnswer), [hasAnswer])
  const partTwoCompleted = useMemo(() => countAnswers(partTwoQuestions, hasAnswer), [hasAnswer])
  const scores = useMemo(() => getSurveyScores(answers), [answers])
  const drawerQuestions = screen === 'part2' ? partTwoQuestions : partOneQuestions
  const canOpenDrawer = screen === 'part1' || screen === 'part2'

  useEffect(() => {
    const desktopMedia = window.matchMedia('(min-width: 768px)')
    const syncDrawerWithViewport = () => {
      if (canOpenDrawer) setDrawerOpen(desktopMedia.matches)
    }
    desktopMedia.addEventListener('change', syncDrawerWithViewport)
    return () => desktopMedia.removeEventListener('change', syncDrawerWithViewport)
  }, [canOpenDrawer])
  const goToScreen = useCallback((nextScreen: SurveyScreen) => {
    setScreen(nextScreen)
    setQuestionError('')
    setFormError('')
    setMissingQuestionNumbers([])
    setDrawerOpen((nextScreen === 'part1' || nextScreen === 'part2') && window.matchMedia('(min-width: 768px)').matches)
    window.requestAnimationFrame(scrollToTop)
  }, [])

  useEffect(() => {
    if (screen !== 'loading') return

    setLoadingStep(1)
    const timers = [
      window.setTimeout(() => setLoadingStep(2), 250),
      window.setTimeout(() => setLoadingStep(3), 500),
      window.setTimeout(() => setLoadingStep(4), 750),
      window.setTimeout(() => goToScreen('result'), 950),
    ]

    return () => timers.forEach((timer) => window.clearTimeout(timer))
  }, [goToScreen, screen])

  const navigateToQuestion = useCallback((questionNumber: number) => {
    setActiveQuestion(questionNumber)
    setQuestionError('')
    setMissingQuestionNumbers([])
    window.requestAnimationFrame(() => {
      const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
      document.getElementById('survey-q-' + questionNumber)?.scrollIntoView({ behavior, block: 'start' })
    })
  }, [])

  const reviewPartOneAnswers = useCallback(() => {
    setActiveQuestion(partOneQuestions[0]?.n ?? 1)
    goToScreen('part1')
  }, [goToScreen])

  const reviewPartTwoAnswers = useCallback(() => {
    setActiveQuestion(partTwoQuestions[0]?.n ?? 19)
    goToScreen('part2')
  }, [goToScreen])

  const handleAnswer = useCallback((question: SurveyQuestion, value: string) => {
    setQuestionError('')
    setMissingQuestionNumbers([])
    setAnswers((current) => ({ ...current, [question.n]: value }))
    if (value !== OTHER_OPTION) {
      setOtherAnswers((current) => {
        if (!(question.n in current)) return current
        const next = { ...current }
        delete next[question.n]
        return next
      })
    }
  }, [])

  const handleOtherAnswer = useCallback((question: SurveyQuestion, value: string) => {
    setQuestionError('')
    setMissingQuestionNumbers([])
    setAnswers((current) => ({ ...current, [question.n]: OTHER_OPTION }))
    setOtherAnswers((current) => ({ ...current, [question.n]: value }))
  }, [])

  const continuePartOne = () => {
    const missing = partOneQuestions.filter((question) => !hasAnswer(question)).map((question) => question.n)

    if (missing.length) {
      setMissingQuestionNumbers(missing)
      setQuestionError('Vui lòng trả lời các câu sau trước khi tiếp tục: ' + missing.map((number) => 'Câu ' + number).join(', ') + '.')
      return
    }

    setMissingQuestionNumbers([])
    setActiveQuestion(partTwoQuestions[0]?.n ?? 19)
    goToScreen('part2')
  }

  const continuePartTwo = () => {
    const missing = partTwoQuestions.filter((question) => !hasAnswer(question)).map((question) => question.n)

    if (missing.length) {
      setMissingQuestionNumbers(missing)
      setQuestionError('Vui lòng trả lời các câu sau trước khi tiếp tục: ' + missing.map((number) => 'Câu ' + number).join(', ') + '.')
      return
    }

    setMissingQuestionNumbers([])
    setReportMode('private')
    goToScreen('contact2')
  }

  const startReportLoading = () => {
    const validationError = isContactValid(contact)
    if (validationError) {
      setFormError(validationError)
      return
    }

    if (screen === 'contact2' && consent !== 'yes') {
      setFormError('Vui lòng chọn Đồng ý để nhận Báo cáo Riêng tư.')
      return
    }

    goToScreen('loading')
  }

  const clearPartTwoAnswers = () => {
    setAnswers((current) => {
      const next = { ...current }
      partTwoQuestions.forEach((question) => delete next[question.n])
      return next
    })
    setOtherAnswers((current) => {
      const next = { ...current }
      partTwoQuestions.forEach((question) => delete next[question.n])
      return next
    })
    setQuestionError('')
    setMissingQuestionNumbers([])
    setActiveQuestion(partTwoQuestions[0]?.n ?? 19)
  }
  const skipPrivateReport = () => {
    setReportMode('part1')
    setConsent('')
    goToScreen('contact1')
  }

  const registerRoundtable = () => {
    const validationError = isContactValid(roundtableContact)
    if (validationError) {
      setRoundtableError(validationError)
      return
    }

    setRoundtableError('')
    setRoundtableRegistered(true)
  }

  const openRoundtableFromResult = (trigger: HTMLButtonElement) => {
    roundtableTriggerRef.current = trigger
    setRoundtableContact(contact)
    setRoundtableRegistered(false)
    setRoundtableError('')
    setRoundtableOpen(true)
  }

  const closeRoundtable = () => {
    setRoundtableOpen(false)
    window.requestAnimationFrame(() => roundtableTriggerRef.current?.focus())
  }

  const backToLanding = () => {
    setRoundtableOpen(false)
    onBackHome()
  }

  const handleHeaderBack = () => {
    if (screen === 'intro' || screen === 'result') {
      backToLanding()
      return
    }
    if (screen === 'part1') {
      goToScreen('intro')
      return
    }
    if (screen === 'part2') {
      reviewPartOneAnswers()
      return
    }
    if (screen === 'contact1') {
      reviewPartOneAnswers()
      return
    }
    if (screen === 'contact2') {
      reviewPartTwoAnswers()
    }
  }

  return (
    <main className="survey-page">
      <SurveyHeader
        canGoBack={screen !== 'loading'}
        canOpenDrawer={canOpenDrawer}
        onBackHome={handleHeaderBack}
        onOpenDrawer={() => setDrawerOpen(true)}
      />
      <QuestionDrawer
        activeQuestion={activeQuestion}
        hasAnswer={hasAnswer}
        onClose={() => setDrawerOpen(false)}
        onJump={navigateToQuestion}
        open={drawerOpen && canOpenDrawer}
        questions={drawerQuestions}
        title={screen === 'part2' ? 'Phần 2 · Khảo sát định danh' : 'Phần 1 · Khảo sát khuyết danh'}
      />

      <div className={'survey-shell' + (canOpenDrawer ? ' survey-shell--with-question-panel' : '')}>
        {screen === 'intro' ? (
          <IntroScreen
            onStart={() => {
              setActiveQuestion(partOneQuestions[0]?.n ?? 1)
              goToScreen('part1')
            }}
          />
        ) : null}

        {screen === 'part1' ? (
          <SurveyQuestionPage
            answers={answers}
            completedCount={partOneCompleted}
            error={questionError}
            intro="18 câu hỏi được hiển thị liên tục trên cùng một trang để Anh/Chị có thể đọc, trả lời và xem lại nhanh."
            missingQuestionNumbers={missingQuestionNumbers}
            onAnswer={handleAnswer}
            onNext={continuePartOne}
            onOtherAnswer={handleOtherAnswer}
            onPrevious={() => goToScreen('intro')}
            otherAnswers={otherAnswers}
            part={1}
            primaryLabel="Tiếp theo"
            questions={partOneQuestions}
            subtitle="Hoàn thành 18 câu hỏi trước khi tiếp tục."
          />
        ) : null}

        {screen === 'part2' ? (
          <SurveyQuestionPage
            answers={answers}
            completedCount={partTwoCompleted}
            endNote="Nhấn “Xem kết quả” để nhận Báo cáo Khuyết danh Phần 1 hoặc Báo cáo toàn phần (Phần 1 + Phần 2), tùy theo phần khảo sát Anh/Chị đã hoàn thành."
            error={questionError}
            intro="Các câu tiếp theo giúp hiểu sâu sắc về chính doanh nghiệp của Anh/Chị từ đó tăng độ chính xác khi phân tích vấn đề và khuyến nghị hành động trong Báo cáo Riêng tư."
            missingQuestionNumbers={missingQuestionNumbers}
            onAnswer={handleAnswer}
            onNext={partTwoCompleted > 0 ? continuePartTwo : skipPrivateReport}
            onOtherAnswer={handleOtherAnswer}
            onPrevious={reviewPartOneAnswers}
            onSecondary={clearPartTwoAnswers}
            otherAnswers={otherAnswers}
            part={2}
            primaryLabel={partTwoCompleted > 0 ? 'Xem kết quả' : 'Xem kết quả Phần 1'}
            questions={partTwoQuestions}
            subtitle="Đây là phần có thông tin riêng và nhạy cảm, nếu Anh/Chị không muốn tham gia khảo sát Phần 2 này, vui lòng nhấn nút “Xem kết quả” bên dưới để nhận Báo cáo Khuyết danh từ Phần 1."
          />
        ) : null}

        {screen === 'contact1' ? (
          <ContactScreen
            consent={consent}
            contact={contact}
            error={formError}
            mode="part1"
            onBack={reviewPartOneAnswers}
            onConsentChange={setConsent}
            onContactChange={(nextContact) => {
              setContact(nextContact)
              setFormError('')
            }}
            onSkipPrivate={skipPrivateReport}
            onSubmit={startReportLoading}
          />
        ) : null}

        {screen === 'contact2' ? (
          <ContactScreen
            consent={consent}
            contact={contact}
            error={formError}
            mode="private"
            onBack={reviewPartTwoAnswers}
            onConsentChange={(value) => {
              setConsent(value)
              setFormError('')
            }}
            onContactChange={(nextContact) => {
              setContact(nextContact)
              setFormError('')
            }}
            onSkipPrivate={skipPrivateReport}
            onSubmit={startReportLoading}
          />
        ) : null}

        {screen === 'loading' ? <LoadingScreen step={loadingStep} /> : null}

        {screen === 'result' ? (
          <ResultScreen
            mode={reportMode}
            onBackHome={backToLanding}
            onOpenRoundtable={openRoundtableFromResult}
            scores={scores}
          />
        ) : null}
      </div>

      <RoundtableModal
        contact={roundtableContact}
        error={roundtableError}
        onChange={(nextContact) => {
          setRoundtableContact(nextContact)
          setRoundtableError('')
        }}
        onClose={closeRoundtable}
        onRegister={registerRoundtable}
        open={roundtableOpen}
        registered={roundtableRegistered}
      />
    </main>
  )
}