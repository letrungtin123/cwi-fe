import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { Answers } from './surveyScoring'
import { getSurveyScores, hasQuestionAnswer, OTHER_OPTION, validEmail } from './surveyScoring'
import { partOneQuestions, partTwoQuestions, type SurveyQuestion } from './surveyData'
import { SurveyHeader, type SurveyHeaderMeta } from './SurveyChrome'
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

function getHeaderMeta(screen: SurveyScreen, resultMode: ReportMode): SurveyHeaderMeta {
  if (screen === 'part1') return { phase: 'Phần 1', state: 'Khảo sát khuyết danh' }
  if (screen === 'part2') return { phase: 'Phần 2', state: 'Khảo sát định danh' }
  if (screen === 'contact1') return { phase: 'Nhận báo cáo', state: 'Báo cáo khuyết danh' }
  if (screen === 'contact2') return { phase: 'Nhận báo cáo', state: 'Báo cáo riêng tư' }
  if (screen === 'loading') return { phase: 'Đang phân tích', state: resultMode === 'private' ? 'Phần 1 + Phần 2' : 'Phần 1' }
  if (screen === 'result') return { phase: 'Kết quả', state: resultMode === 'private' ? 'Báo cáo riêng tư' : 'Báo cáo khuyết danh' }
  return { phase: 'Khảo sát CWI', state: 'CEO Workforce Index 2026Q3' }
}

function firstUnansweredQuestion(questions: SurveyQuestion[], hasAnswer: (question: SurveyQuestion) => boolean) {
  return questions.find((question) => !hasAnswer(question))
}

function countAnswers(questions: SurveyQuestion[], hasAnswer: (question: SurveyQuestion) => boolean) {
  return questions.reduce((count, question) => count + (hasAnswer(question) ? 1 : 0), 0)
}

function isContactValid(contact: ContactState) {
  if (!contact.name.trim()) return 'Vui lòng nhập họ tên.'
  if (!contact.email.trim()) return 'Vui lòng nhập email.'
  if (!validEmail(contact.email.trim())) return 'Email chưa đúng định dạng.'
  return ''
}

function getQuestionIndex(questions: SurveyQuestion[], questionNumber: number) {
  return questions.findIndex((question) => question.n === questionNumber)
}

function scrollToTop() {
  const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
  window.scrollTo({ behavior, top: 0 })
}

export function SurveyExperience({ onBackHome }: { onBackHome: () => void }) {
  const [screen, setScreen] = useState<SurveyScreen>('intro')
  const [answers, setAnswers] = useState<Answers>({})
  const [otherAnswers, setOtherAnswers] = useState<Answers>({})
  const [activeQuestion, setActiveQuestion] = useState(partOneQuestions[0].n)
  const [questionError, setQuestionError] = useState('')
  const [formError, setFormError] = useState('')
  const [roundtableError, setRoundtableError] = useState('')
  const [contact, setContact] = useState<ContactState>(emptyContact)
  const [roundtableContact, setRoundtableContact] = useState<ContactState>(emptyContact)
  const [consent, setConsent] = useState<ConsentChoice>('')
  const [reportMode, setReportMode] = useState<ReportMode>('part1')
  const [loadingStep, setLoadingStep] = useState(1)
  const [drawerOpen, setDrawerOpen] = useState(false)
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
  const headerMeta = getHeaderMeta(screen, reportMode)

  const goToScreen = useCallback((nextScreen: SurveyScreen) => {
    setScreen(nextScreen)
    setQuestionError('')
    setFormError('')
    setDrawerOpen(false)
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

  const jumpToQuestion = useCallback((questionNumber: number) => {
    setActiveQuestion(questionNumber)
    setQuestionError('')
    window.requestAnimationFrame(scrollToTop)
  }, [])

  const reviewPartOneAnswers = useCallback(() => {
    setActiveQuestion(partOneQuestions[partOneQuestions.length - 1]?.n ?? 18)
    goToScreen('part1')
  }, [goToScreen])

  const reviewPartTwoAnswers = useCallback(() => {
    setActiveQuestion(partTwoQuestions[partTwoQuestions.length - 1]?.n ?? 24)
    goToScreen('part2')
  }, [goToScreen])


  const handleAnswer = useCallback((question: SurveyQuestion, value: string) => {
    setQuestionError('')
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
    setAnswers((current) => ({ ...current, [question.n]: OTHER_OPTION }))
    setOtherAnswers((current) => ({ ...current, [question.n]: value }))
  }, [])

  const continuePartOne = () => {
    const currentIndex = Math.max(0, getQuestionIndex(partOneQuestions, activeQuestion))
    const currentQuestion = partOneQuestions[currentIndex] ?? partOneQuestions[0]
    if (!hasAnswer(currentQuestion)) {
      setQuestionError('Vui lòng hoàn tất Câu ' + currentQuestion.n + ' trước khi tiếp tục.')
      return
    }

    if (currentIndex < partOneQuestions.length - 1) {
      jumpToQuestion(partOneQuestions[currentIndex + 1].n)
      return
    }

    const missingQuestion = firstUnansweredQuestion(partOneQuestions, hasAnswer)
    if (missingQuestion) {
      setQuestionError('Anh/Chị còn câu chưa hoàn tất trước khi chuyển sang Phần 2.')
      jumpToQuestion(missingQuestion.n)
      return
    }

    setActiveQuestion(partTwoQuestions[0]?.n ?? 19)
    goToScreen('part2')
  }

  const continuePartTwo = () => {
    const currentIndex = Math.max(0, getQuestionIndex(partTwoQuestions, activeQuestion))
    const currentQuestion = partTwoQuestions[currentIndex] ?? partTwoQuestions[0]
    if (!hasAnswer(currentQuestion)) {
      setQuestionError('Vui lòng hoàn tất Câu ' + currentQuestion.n + ' trước khi tiếp tục.')
      return
    }

    if (currentIndex < partTwoQuestions.length - 1) {
      jumpToQuestion(partTwoQuestions[currentIndex + 1].n)
      return
    }

    const missingQuestion = firstUnansweredQuestion(partTwoQuestions, hasAnswer)
    if (missingQuestion) {
      setQuestionError('Anh/Chị đã bắt đầu Phần 2. Vui lòng hoàn tất Câu ' + missingQuestion.n + ', hoặc dùng nút nhận báo cáo Phần 1.')
      jumpToQuestion(missingQuestion.n)
      return
    }

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
      const index = getQuestionIndex(partOneQuestions, activeQuestion)
      if (index > 0) jumpToQuestion(partOneQuestions[index - 1].n)
      else goToScreen('intro')
      return
    }
    if (screen === 'part2') {
      const index = getQuestionIndex(partTwoQuestions, activeQuestion)
      if (index > 0) jumpToQuestion(partTwoQuestions[index - 1].n)
      else reviewPartOneAnswers()
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
        meta={headerMeta}
        onBackHome={handleHeaderBack}
        onOpenDrawer={() => setDrawerOpen(true)}
      />
      <QuestionDrawer
        activeQuestion={activeQuestion}
        hasAnswer={hasAnswer}
        onClose={() => setDrawerOpen(false)}
        onJump={(questionNumber) => {
          setDrawerOpen(false)
          jumpToQuestion(questionNumber)
        }}
        open={drawerOpen}
        questions={drawerQuestions}
        title={screen === 'part2' ? 'Phần 2 · Khảo sát định danh' : 'Phần 1 · Khảo sát khuyết danh'}
      />

      <div className="survey-shell">
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
            activeQuestion={activeQuestion}
            answers={answers}
            completedCount={partOneCompleted}
            error={questionError}
            intro="Phần 1 được xử lý ở chế độ khuyết danh. Anh/Chị vui lòng chọn mức độ phù hợp nhất với thực trạng doanh nghiệp."
            onAnswer={handleAnswer}
            onNext={continuePartOne}
            onOpenNavigator={() => setDrawerOpen(true)}
            onOtherAnswer={handleOtherAnswer}
            onPrevious={() => {
              const index = getQuestionIndex(partOneQuestions, activeQuestion)
              if (index > 0) jumpToQuestion(partOneQuestions[index - 1].n)
              else goToScreen('intro')
            }}
            otherAnswers={otherAnswers}
            part={1}
            primaryLabel="Tiếp tục sang Phần 2"
            questions={partOneQuestions}
            subtitle="Đánh giá nền tảng năng lực quản lý, kế nhiệm, thực thi chiến lược và khả năng mở rộng."

          />
        ) : null}

        {screen === 'part2' ? (
          <SurveyQuestionPage
            activeQuestion={activeQuestion}
            answers={answers}
            completedCount={partTwoCompleted}
            error={questionError}
            intro="Phần 2 là phần định danh để tạo Báo cáo Riêng tư. Nếu không muốn cung cấp thêm dữ liệu, Anh/Chị có thể bấm xem báo cáo khi chưa chọn câu nào để nhận Báo cáo Phần 1."
            onAnswer={handleAnswer}
            onNext={continuePartTwo}
            onOpenNavigator={() => setDrawerOpen(true)}
            onOtherAnswer={handleOtherAnswer}
            onPrevious={() => {
              const index = getQuestionIndex(partTwoQuestions, activeQuestion)
              if (index > 0) jumpToQuestion(partTwoQuestions[index - 1].n)
              else {
                setActiveQuestion(partOneQuestions[partOneQuestions.length - 1]?.n ?? 18)
                goToScreen('part1')
              }
            }}
            onSecondary={skipPrivateReport}
            otherAnswers={otherAnswers}
            part={2}
            primaryLabel="Xem kết quả khảo sát"
            questions={partTwoQuestions}
            subtitle="Bổ sung bối cảnh riêng về ra quyết định, mở rộng quy mô, rủi ro vận hành và doanh thu."

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

        {screen === 'loading' ? <LoadingScreen mode={reportMode} step={loadingStep} /> : null}

        {screen === 'result' ? (
          <ResultScreen
            answers={answers}
            mode={reportMode}
            onBackHome={backToLanding}
            onOpenRoundtable={openRoundtableFromResult}
            otherAnswers={otherAnswers}
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