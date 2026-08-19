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
  SubmissionCompleteModal,
} from './SurveyScreens'
import './survey.css'

import { readSurveySession, writeSurveySession, type ContactState, type ConsentChoice, type ReportMode, type SurveyScreen, type SurveySession } from './surveyPersistence'

const emptyContact: ContactState = { email: '', name: '', jobTitle: '', jobTitleOther: '' }

function countAnswers(questions: SurveyQuestion[], hasAnswer: (question: SurveyQuestion) => boolean) {
  return questions.reduce((count, question) => count + (hasAnswer(question) ? 1 : 0), 0)
}

function isContactValid(contact: ContactState) {
  const title = contact.jobTitle.trim()
  if (!contact.name.trim() || !validEmail(contact.email.trim()) || !title) {
    return 'Vui lòng điền đầy đủ Họ tên, Email công ty cá nhân hợp lệ và Chức vụ.'
  }
  return ''
}

function scrollToTop() {
  const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
  window.scrollTo({ behavior, top: 0 })
}

export function SurveyExperience({ onBackHome }: { onBackHome: () => void }) {
  const [restoredSession] = useState<SurveySession | null>(() => readSurveySession())
  const [screen, setScreen] = useState<SurveyScreen>(() => restoredSession?.screen ?? 'intro')
  const [answers, setAnswers] = useState<Answers>(() => restoredSession?.answers ?? {})
  const [otherAnswers, setOtherAnswers] = useState<Answers>(() => restoredSession?.otherAnswers ?? {})
  const [activeQuestion, setActiveQuestion] = useState(() => restoredSession?.activeQuestion ?? partOneQuestions[0]?.n ?? 1)
  const [drawerOpen, setDrawerOpen] = useState(() => window.matchMedia('(min-width: 768px)').matches)
  const [questionError, setQuestionError] = useState(() => restoredSession?.questionError ?? '')
  const [missingQuestionNumbers, setMissingQuestionNumbers] = useState<number[]>(() => restoredSession?.missingQuestionNumbers ?? [])
  const [formError, setFormError] = useState(() => restoredSession?.formError ?? '')
  const [roundtableError, setRoundtableError] = useState(() => restoredSession?.roundtableError ?? '')
  const [contact, setContact] = useState<ContactState>(() => restoredSession?.contact ?? emptyContact)
  const [roundtableContact, setRoundtableContact] = useState<ContactState>(() => restoredSession?.roundtableContact ?? emptyContact)
  const [consent, setConsent] = useState<ConsentChoice>(() => restoredSession?.consent ?? '')
  const [reportMode, setReportMode] = useState<ReportMode>(() => restoredSession?.reportMode ?? 'part1')
  const [loadingStep, setLoadingStep] = useState(() => restoredSession?.loadingStep ?? 1)
  const [roundtableOpen, setRoundtableOpen] = useState(() => restoredSession?.roundtableOpen ?? false)
  const [roundtableRegistered, setRoundtableRegistered] = useState(() => restoredSession?.roundtableRegistered ?? false)
  const [submissionModalOpen, setSubmissionModalOpen] = useState(() => restoredSession?.submissionModalOpen ?? false)
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
    if (!restoredSession) return
    window.requestAnimationFrame(() => window.scrollTo({ behavior: 'auto', top: 0 }))
  }, [restoredSession])

  useEffect(() => {
    writeSurveySession({
      activeQuestion,
      answers,
      consent,
      contact,
      formError,
      loadingStep,
      missingQuestionNumbers,
      otherAnswers,
      reportMode,
      roundtableContact,
      roundtableError,
      roundtableOpen,
      roundtableRegistered,
      screen,
      submissionModalOpen,
      questionError,
      version: 1,
    })
  }, [activeQuestion, answers, consent, contact, formError, loadingStep, missingQuestionNumbers, otherAnswers, questionError, reportMode, roundtableContact, roundtableError, roundtableOpen, roundtableRegistered, screen, submissionModalOpen])

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

  const openSubmissionComplete = useCallback(() => {
    setSubmissionModalOpen(true)
    setDrawerOpen(false)
    setQuestionError('')
    setMissingQuestionNumbers([])
  }, [])

  useEffect(() => {
    if (screen !== 'loading') return

    setLoadingStep(1)
    const timers = [
      window.setTimeout(() => setLoadingStep(2), 350),
      window.setTimeout(() => setLoadingStep(3), 700),
      window.setTimeout(() => setLoadingStep(4), 1050),
      window.setTimeout(() => goToScreen('result'), 1350),
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
    setAnswers((current) => {
      const next = { ...current }
      if (value) next[question.n] = value
      else delete next[question.n]
      return next
    })
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
      setQuestionError(`Anh/Chị còn ${missing.length} câu chưa hoàn thành: ${missing.join(', ')}.`)
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
      setQuestionError(`Anh/Chị chưa hoàn thành PHẦN 2 - KHẢO SÁT ĐỊNH DANH. Vui lòng hoàn tất các câu: ${missing.join(', ')}.`)
      return
    }

    setMissingQuestionNumbers([])
    setReportMode('private')
    goToScreen('contact2')
  }


  const startReportLoading = () => {
    if (screen === 'contact1') {
      const validationError = isContactValid(contact)
      if (validationError) {
        setFormError(validationError)
        return
      }

      setReportMode('part1')
      setRoundtableContact(contact)
      setRoundtableRegistered(false)
      setRoundtableError('')
      setRoundtableOpen(true)
      return
    }

    if (!consent) {
      setFormError('Vui lòng chọn “Đồng ý” hoặc “Không đồng ý” trước khi tiếp tục.')
      return
    }

    if (consent === 'no') {
      setFormError('Vui lòng chọn “Đồng ý” để nhận Báo cáo Riêng tư.')
      return
    }

    const validationError = isContactValid(contact)
    if (validationError) {
      setFormError(validationError)
      return
    }

    setReportMode('private')
    setRoundtableContact(contact)
    setRoundtableRegistered(false)
    setRoundtableError('')
    setRoundtableOpen(true)
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
    setFormError('')
    goToScreen('contact1')
  }

  const registerRoundtable = () => {
    if (!roundtableContact.name.trim() || !validEmail(roundtableContact.email.trim())) {
      setRoundtableError('Vui lòng điền Họ tên và Email hợp lệ để đăng ký CEO Roundtable.')
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

  const continueFromRoundtable = () => {
    closeRoundtable()
    openSubmissionComplete()
  }

  const backToLanding = () => {
    setRoundtableOpen(false)
    setSubmissionModalOpen(false)
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
            endNote="Nhấn “Gửi kết quả” để nhận Báo cáo Khuyết danh Phần 1 hoặc Báo cáo toàn phần (Phần 1 + Phần 2), tùy theo phần khảo sát Anh/Chị đã hoàn thành."
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
            primaryLabel={partTwoCompleted > 0 ? '\u0047\u1eedi \u006b\u1ebft qu\u1ea3' : '\u0047\u1eedi \u006b\u1ebft qu\u1ea3 Ph\u1ea7n 1'}
            questions={partTwoQuestions}
            subtitle="Đây là phần có thông tin riêng và nhạy cảm, nếu Anh/Chị không muốn tham gia khảo sát Phần 2 này, vui lòng nhấn nút “Gửi kết quả Phần 1” bên dưới để nhận Báo cáo Khuyết danh từ Phần 1."
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

        {screen === 'loading' ? <LoadingScreen reportMode={reportMode} step={loadingStep} /> : null}

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
        onContinue={continueFromRoundtable}
        onRegister={registerRoundtable}
        onSkip={continueFromRoundtable}
        open={roundtableOpen}
        registered={roundtableRegistered}
      />

      <SubmissionCompleteModal
        onClose={() => setSubmissionModalOpen(false)}
        onHome={backToLanding}
        open={submissionModalOpen}
      />
    </main>
  )
}