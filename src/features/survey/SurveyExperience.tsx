import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { t } from '@/i18n'
import type { Answers } from './surveyScoring'
import { hasQuestionAnswer, isValidWebsite, OTHER_OPTION, validEmail } from './surveyScoring'
import { partOneQuestions, partTwoQuestions, type SurveyQuestion } from './surveyData'
import { SurveyHeader } from './SurveyChrome'
import { QuestionDrawer, surveyPersistentQuestionPanelMediaQuery } from './SurveyNavigation'
import { SurveyQuestionPage } from './SurveyQuestionPage'
import {
  ContactScreen,
  IntroScreen,
  LoadingScreen,
  ReportGenerationScreen,
  ReportScreen,
  RoundtableModal,
  SurveyAnswersReviewModal,
  type RoundtableChoice,
} from './SurveyScreens'
import { createRoundtableRegistrationIdempotencyKey, createSurveySubmissionIdempotencyKey, createWebinarRegistrationIdempotencyKey, deferredResultDays, getReportHtml, getReportJobStatus, submitRoundtableRegistration, submitSurveySubmission, SurveyApiError, type ReportEmailStatus, type ReportJobStatusValue } from './surveyApi'
import { buildSurveySubmissionPayload } from './surveySubmissionPayload'
import { isValidPhone } from './phoneValidation'
import './survey.css'

import { clearSurveySession, readSurveySession, writeSurveySession, type ContactState, type ConsentChoice, type ReportMode, type SurveyScreen, type SurveySession } from './surveyPersistence'

const emptyContact: ContactState = { companyName: '', email: '', name: '', phone: '', jobTitle: '', jobTitleOther: '' }

function countAnswers(questions: SurveyQuestion[], hasAnswer: (question: SurveyQuestion) => boolean) {
  return questions.reduce((count, question) => count + (hasAnswer(question) ? 1 : 0), 0)
}

function isContactValid(contact: ContactState) {
  const title = contact.jobTitle.trim()
  if (!contact.name.trim() || !validEmail(contact.email.trim()) || !isValidPhone(contact.phone) || !title || !contact.companyName.trim()) {
    return t('Vui lòng điền đầy đủ Họ tên, Email hợp lệ, Số điện thoại, Chức vụ và Tên công ty.')
  }
  return ''
}

function normalizeContactPosition(contact: ContactState) {
  const position = contact.jobTitle === 'Khác' && contact.jobTitleOther.trim() ? contact.jobTitleOther : contact.jobTitle
  return position.trim()
}

function buildClientMeta(action: string) {
  return {
    action,
    app: 'source4',
    language: navigator.language,
    path: window.location.pathname,
    referrer: document.referrer || null,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    userAgent: navigator.userAgent,
  }
}

function scrollToTop() {
  const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
  window.scrollTo({ behavior, top: 0 })
}

const reportPollingTimeoutMs = Number(import.meta.env.VITE_CWI_REPORT_POLL_TIMEOUT_MS ?? 15 * 60 * 1000)
const reportPollingDelaysMs = [2000, 4000, 8000, 15000, 30000]

function nextReportPollingDelay(attempt: number) {
  return reportPollingDelaysMs[Math.min(attempt, reportPollingDelaysMs.length - 1)] ?? 30000
}

export function SurveyExperience({ onBackHome, startFresh = false }: { onBackHome: () => void; startFresh?: boolean }) {
  const [restoredSession] = useState<SurveySession | null>(() => {
    if (startFresh) {
      clearSurveySession()
      return null
    }
    return readSurveySession()
  })
  // An invitation/QR link (?entry=qr) starts a fresh survey once. Drop the flag from the address
  // bar right away, so a reload or a restored tab keeps the answers given so far instead of
  // wiping them again. The ?src= invitation code stays (it was saved at page load).
  useEffect(() => {
    if (!startFresh) return
    const url = new URL(window.location.href)
    if (url.searchParams.get('entry') !== 'qr') return
    url.searchParams.delete('entry')
    window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash)
  }, [startFresh])
  const [screen, setScreen] = useState<SurveyScreen>(() => restoredSession?.screen ?? 'intro')
  const [answers, setAnswers] = useState<Answers>(() => restoredSession?.answers ?? {})
  const [otherAnswers, setOtherAnswers] = useState<Answers>(() => restoredSession?.otherAnswers ?? {})
  const [activeQuestion, setActiveQuestion] = useState(() => restoredSession?.activeQuestion ?? partOneQuestions[0]?.n ?? 1)
  const [drawerOpen, setDrawerOpen] = useState(() => window.matchMedia(surveyPersistentQuestionPanelMediaQuery).matches)
  const [questionError, setQuestionError] = useState(() => restoredSession?.questionError ?? '')
  const [missingQuestionNumbers, setMissingQuestionNumbers] = useState<number[]>(() => restoredSession?.missingQuestionNumbers ?? [])
  const [formError, setFormError] = useState(() => restoredSession?.formError ?? '')
  const [roundtableError, setRoundtableError] = useState(() => restoredSession?.roundtableError ?? '')
  const [contact, setContact] = useState<ContactState>(() => restoredSession?.contact ?? emptyContact)
  const [roundtableContact, setRoundtableContact] = useState<ContactState>(() => restoredSession?.roundtableContact ?? emptyContact)
  const [consent, setConsent] = useState<ConsentChoice>(() => restoredSession?.consent ?? '')
  const [dataCollectionConsent, setDataCollectionConsent] = useState(() => restoredSession?.dataCollectionConsent ?? false)
  const [reportMode, setReportMode] = useState<ReportMode>(() => restoredSession?.reportMode ?? 'part1')
  const [loadingStep] = useState(() => restoredSession?.loadingStep ?? 1)
  const [roundtableOpen, setRoundtableOpen] = useState(() => restoredSession?.roundtableOpen ?? false)
  const [roundtableRegistered, setRoundtableRegistered] = useState(() => Boolean(restoredSession?.roundtableRegistrationId))
  const [roundtableRegistrationId, setRoundtableRegistrationId] = useState(() => restoredSession?.roundtableRegistrationId ?? '')
  const [roundtableRegisteredAt, setRoundtableRegisteredAt] = useState(() => restoredSession?.roundtableRegisteredAt ?? '')
  // Webinar fields are only carried through the saved session (no screen changes them any more).
  const [webinarError] = useState(() => restoredSession?.webinarError ?? '')
  const [webinarRegistered] = useState(() => Boolean(restoredSession?.webinarRegistrationId))
  const [webinarRegistrationId] = useState(() => restoredSession?.webinarRegistrationId ?? '')
  const [webinarRegisteredAt] = useState(() => restoredSession?.webinarRegisteredAt ?? '')
  const [surveyAnswersReviewOpen, setSurveyAnswersReviewOpen] = useState(false)
  const [partTwoPrivacyRefused, setPartTwoPrivacyRefused] = useState(() => restoredSession?.partTwoPrivacyRefused ?? false)
  const [submissionIdempotencyKey] = useState(() => restoredSession?.submissionIdempotencyKey ?? createSurveySubmissionIdempotencyKey())
  const [roundtableRegistrationIdempotencyKey] = useState(() => restoredSession?.roundtableRegistrationIdempotencyKey ?? createRoundtableRegistrationIdempotencyKey())
  const [webinarRegistrationIdempotencyKey] = useState(() => restoredSession?.webinarRegistrationIdempotencyKey ?? createWebinarRegistrationIdempotencyKey())
  const [submissionError, setSubmissionError] = useState(() => restoredSession?.submissionError ?? '')
  const [submittedSubmissionId, setSubmittedSubmissionId] = useState(() => restoredSession?.submittedSubmissionId ?? '')
  const [submittedAt, setSubmittedAt] = useState(() => restoredSession?.submittedAt ?? '')
  const [reportJobId, setReportJobId] = useState(() => restoredSession?.reportJobId ?? '')
  const [reportAccessToken, setReportAccessToken] = useState(() => restoredSession?.reportAccessToken ?? '')
  const [reportAccessTokenExpiresAt, setReportAccessTokenExpiresAt] = useState(() => restoredSession?.reportAccessTokenExpiresAt ?? '')
  const [reportStatus, setReportStatus] = useState<ReportJobStatusValue | ''>(() => (restoredSession?.reportStatus as ReportJobStatusValue | undefined) ?? '')
  const [reportEmailStatus, setReportEmailStatus] = useState<ReportEmailStatus>(() => (restoredSession?.reportEmailStatus as ReportEmailStatus | undefined) ?? 'not_sent')
  // Set while report generation is paused: the report is emailed within this many days.
  const [reportDeferredDays, setReportDeferredDays] = useState<number | null>(() => restoredSession?.reportDeferredDays ?? null)
  const [reportHtml, setReportHtml] = useState('')
  const [reportError, setReportError] = useState('')
  const [reportPollingTimedOut, setReportPollingTimedOut] = useState(false)
  const [reportPollingRetry, setReportPollingRetry] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [roundtableSubmitting, setRoundtableSubmitting] = useState(false)
  const [roundtableChoice, setRoundtableChoice] = useState<RoundtableChoice>('')
  const roundtableTriggerRef = useRef<HTMLButtonElement | null>(null)
  const reportHtmlLoadedRef = useRef(false)

  const hasAnswer = useCallback(
    (question: SurveyQuestion) => hasQuestionAnswer(question, answers, otherAnswers),
    [answers, otherAnswers],
  )

  const partOneCompleted = useMemo(() => countAnswers(partOneQuestions, hasAnswer), [hasAnswer])
  const partTwoCompleted = useMemo(() => countAnswers(partTwoQuestions, hasAnswer), [hasAnswer])
  const drawerQuestions = screen === 'part2' ? partTwoQuestions : partOneQuestions
  const canOpenDrawer = screen === 'part1' || screen === 'part2'
  const isSubmittedReview = Boolean(submittedSubmissionId)

  useEffect(() => {
    if (!restoredSession) return
    window.requestAnimationFrame(() => window.scrollTo({ behavior: 'auto', top: 0 }))
  }, [restoredSession])

  useEffect(() => {
    writeSurveySession({
      activeQuestion,
      answers,
      consent,
      dataCollectionConsent,
      contact,
      formError,
      loadingStep,
      missingQuestionNumbers,
      otherAnswers,
      partTwoPrivacyRefused,
      reportAccessToken,
      reportAccessTokenExpiresAt,
      reportDeferredDays,
      reportEmailStatus,
      reportJobId,
      reportStatus,
      reportMode,
      roundtableContact,
      roundtableError,
      roundtableOpen,
      roundtableRegistered,
      roundtableRegisteredAt,
      roundtableRegistrationId,
      roundtableRegistrationIdempotencyKey,
      webinarError,
      webinarRegistered,
      webinarRegisteredAt,
      webinarRegistrationId,
      webinarRegistrationIdempotencyKey,
      screen,
      submittedAt,
      submittedSubmissionId,
      submissionError,
      submissionIdempotencyKey,
      submissionModalOpen: false,
      questionError,
      version: 1,
    })
  }, [activeQuestion, answers, consent, contact, dataCollectionConsent, formError, loadingStep, missingQuestionNumbers, otherAnswers, partTwoPrivacyRefused, questionError, reportAccessToken, reportAccessTokenExpiresAt, reportDeferredDays, reportEmailStatus, reportJobId, reportMode, reportStatus, roundtableContact, roundtableError, roundtableOpen, roundtableRegistered, roundtableRegisteredAt, roundtableRegistrationId, roundtableRegistrationIdempotencyKey, screen, submittedAt, submittedSubmissionId, submissionError, submissionIdempotencyKey, webinarError, webinarRegistered, webinarRegisteredAt, webinarRegistrationId, webinarRegistrationIdempotencyKey])

  useEffect(() => {
    const desktopMedia = window.matchMedia(surveyPersistentQuestionPanelMediaQuery)
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
    setSubmissionError('')
    setMissingQuestionNumbers([])
    setDrawerOpen((nextScreen === 'part1' || nextScreen === 'part2') && window.matchMedia(surveyPersistentQuestionPanelMediaQuery).matches)
    window.requestAnimationFrame(scrollToTop)
  }, [])

  useEffect(() => {
    reportHtmlLoadedRef.current = false
    setReportHtml('')
    setReportError('')
    setReportPollingTimedOut(false)
  }, [reportJobId])

  useEffect(() => {
    // HTML is intentionally kept in memory only. Re-open the loading state if
    // the browser restores a report screen without its transient HTML payload.
    if (screen === 'report' && !reportHtml && reportJobId && reportAccessToken) {
      setScreen('loading')
    }
  }, [reportAccessToken, reportHtml, reportJobId, screen])

  useEffect(() => {
    if ((screen !== 'loading' && screen !== 'report') || !reportJobId || !reportAccessToken || (screen === 'report' && reportHtml)) return

    let cancelled = false
    let inFlight = false
    let timer: number | undefined
    let attempt = 0
    let startedAt = Date.now()
    let controller: AbortController | null = null
    const maxPollingMs = Number.isFinite(reportPollingTimeoutMs) && reportPollingTimeoutMs > 0 ? reportPollingTimeoutMs : 15 * 60 * 1000
    const accessTokenExpiryMs = Date.parse(reportAccessTokenExpiresAt)

    const stopWithTimeout = () => {
      if (cancelled) return
      setReportPollingTimedOut(true)
      setReportError(t('Báo cáo đang mất nhiều thời gian hơn dự kiến. Anh/Chị có thể thử kiểm tra lại sau.'))
    }

    const schedule = (delayMs: number) => {
      if (cancelled) return
      if (Date.now() - startedAt + delayMs >= maxPollingMs) {
        stopWithTimeout()
        return
      }
      timer = window.setTimeout(() => {
        timer = undefined
        void poll()
      }, delayMs)
    }

    const poll = async () => {
      if (cancelled || inFlight) return
      if (Date.now() - startedAt >= maxPollingMs) {
        stopWithTimeout()
        return
      }
      if (Number.isFinite(accessTokenExpiryMs) && Date.now() >= accessTokenExpiryMs) {
        setReportError(t('Liên kết xem báo cáo đã hết hạn. Anh/Chị vui lòng quay lại trang chủ và thực hiện lại khảo sát.'))
        return
      }
      if (document.visibilityState !== 'visible') {
        schedule(15000)
        return
      }

      inFlight = true
      controller = new AbortController()
      const currentAttempt = attempt
      attempt += 1

      try {
        const status = await getReportJobStatus(reportJobId, reportAccessToken, controller.signal)
        if (cancelled) return

        setReportStatus(status.status)
        setReportEmailStatus(status.emailStatus)
        setReportError('')

        if (status.htmlAvailable && !reportHtmlLoadedRef.current) {
          const html = await getReportHtml(reportJobId, reportAccessToken, controller.signal)
          if (cancelled) return
          reportHtmlLoadedRef.current = true
          setReportHtml(html)
          setScreen('report')
          window.requestAnimationFrame(scrollToTop)
          return
        }

        // Paused report generation: the report is emailed later, so stop polling.
        const deferredDays = deferredResultDays(status)
        setReportDeferredDays(deferredDays)
        if (deferredDays) return

        if (status.status === 'failed') {
          setReportError(t('Không thể tạo báo cáo lần này. Anh/Chị vui lòng thử lại sau.'))
          return
        }

        schedule(status.htmlAvailable ? 5000 : nextReportPollingDelay(currentAttempt))
      } catch (error) {
        if (cancelled || (error instanceof DOMException && error.name === 'AbortError')) return

        if (error instanceof SurveyApiError && [401, 403, 404].includes(error.status)) {
          setReportError(t('Liên kết xem báo cáo đã hết hạn. Anh/Chị vui lòng quay lại trang chủ và thực hiện lại khảo sát.'))
          return
        }

        if (attempt >= 3) setReportError(t('Hệ thống đang xử lý báo cáo. Màn hình sẽ tự cập nhật khi có kết quả.'))
        schedule(nextReportPollingDelay(currentAttempt))
      } finally {
        inFlight = false
        controller = null
      }
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState !== 'visible' || cancelled || inFlight) return
      if (timer !== undefined) window.clearTimeout(timer)
      timer = undefined
      void poll()
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    void poll()

    return () => {
      cancelled = true
      if (timer !== undefined) window.clearTimeout(timer)
      controller?.abort()
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [reportAccessToken, reportAccessTokenExpiresAt, reportHtml, reportJobId, reportPollingRetry, screen])


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
    if (submittedSubmissionId) return

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
  }, [submittedSubmissionId])

  const handleOtherAnswer = useCallback((question: SurveyQuestion, value: string) => {
    if (submittedSubmissionId) return

    setQuestionError('')
    setMissingQuestionNumbers([])
    setAnswers((current) => ({ ...current, [question.n]: OTHER_OPTION }))
    setOtherAnswers((current) => ({ ...current, [question.n]: value }))
  }, [submittedSubmissionId])

  const continuePartOne = () => {
    if (submittedSubmissionId) return

    const missing = partOneQuestions.filter((question) => !hasAnswer(question)).map((question) => question.n)

    if (missing.length) {
      setMissingQuestionNumbers(missing)
      setQuestionError(t('Anh/Chị còn {count} câu chưa hoàn thành: {list}.', { count: missing.length, list: missing.join(', ') }))
      return
    }

    setMissingQuestionNumbers([])
    setActiveQuestion(partTwoQuestions[0]?.n ?? 19)
    goToScreen('part2')
  }

  const continuePartTwo = () => {
    if (submittedSubmissionId) return

    const missing = partTwoQuestions.filter((question) => !hasAnswer(question)).map((question) => question.n)

    if (missing.length) {
      setMissingQuestionNumbers(missing)
      setQuestionError(t('Anh/Chị chưa hoàn thành PHẦN 2 - KHẢO SÁT ĐỊNH DANH. Vui lòng hoàn tất các câu: {list}.', { list: missing.join(', ') }))
      return
    }

    setMissingQuestionNumbers([])
    const websiteQuestion = partTwoQuestions.find((question) => question.type === 'text')
    if (websiteQuestion && !isValidWebsite(answers[websiteQuestion.n] ?? '')) {
      setMissingQuestionNumbers([websiteQuestion.n])
      setQuestionError(t('Website công ty ở câu 24 chưa đúng định dạng. Ví dụ: example.com hoặc https://example.com'))
      return
    }

    setReportMode('private')
    setPartTwoPrivacyRefused(false)
    goToScreen('contact2')
  }


  const startReportLoading = () => {
    if (submittedSubmissionId) return

    setSubmissionError('')
    if (screen === 'contact1') {
      const validationError = isContactValid(contact)
      if (validationError) {
        setFormError(validationError)
        return
      }

      if (!dataCollectionConsent) {
        setFormError(t('Vui lòng đồng ý cho dự án CEO Workforce Index xử lý dữ liệu trước khi gửi kết quả Phần 1.'))
        return
      }

      setReportMode('part1')
      setRoundtableContact(contact)
      setRoundtableRegistered(Boolean(roundtableRegistrationId))
      setRoundtableError('')
      setRoundtableChoice('')
      setRoundtableOpen(true)
      return
    }

    if (!consent) {
      setFormError(t('Vui lòng chọn “Đồng ý” hoặc “Không đồng ý” trước khi tiếp tục.'))
      return
    }

    if (consent === 'no') {
      setFormError(t('Vui lòng chọn “Đồng ý” để nhận Báo cáo Riêng tư.'))
      return
    }

    const validationError = isContactValid(contact)
    if (validationError) {
      setFormError(validationError)
      return
    }

    setReportMode('private')
    setPartTwoPrivacyRefused(false)
    setRoundtableContact(contact)
    setRoundtableRegistered(Boolean(roundtableRegistrationId))
    setRoundtableError('')
    setRoundtableChoice('')
    setSubmissionError('')
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
    setConsent('')
    setPartTwoPrivacyRefused(false)
  }
  const skipPrivateReport = () => {
    if (submittedSubmissionId) return

    const completedPartTwo = partTwoQuestions.every((question) => hasAnswer(question))
    const refusedAfterPartTwo = consent === 'no' && completedPartTwo

    setReportMode('part1')
    setPartTwoPrivacyRefused(refusedAfterPartTwo)
    if (!refusedAfterPartTwo) setConsent('')
    setFormError('')
    setSubmissionError('')
    goToScreen('contact1')
  }

  // Registers with the survey contact details; returns the new registration id
  // so the survey can be submitted in the same click.
  const registerRoundtable = async () => {
    if (roundtableSubmitting) return null
    if (isContactValid(roundtableContact)) {
      setRoundtableError(t('Vui lòng hoàn tất thông tin liên hệ trước khi đăng ký CEO Roundtable.'))
      return null
    }

    setRoundtableSubmitting(true)
    setRoundtableError('')
    setSubmissionError('')

    try {
      const result = await submitRoundtableRegistration(
        {
          clientMeta: buildClientMeta('roundtable_registration'),
          companyName: roundtableContact.companyName.trim().replace(/\s+/g, ' '),
          email: roundtableContact.email.trim().toLowerCase(),
          fullName: roundtableContact.name.trim().replace(/\s+/g, ' '),
          phone: roundtableContact.phone.trim(),
          position: normalizeContactPosition(roundtableContact) || undefined,
          surveySubmissionIdempotencyKey: submissionIdempotencyKey,
        },
        roundtableRegistrationIdempotencyKey,
      )
      setRoundtableRegistrationId(result.registrationId)
      setRoundtableRegisteredAt(result.registeredAt)
      setRoundtableRegistered(true)
      return result.registrationId
    } catch (error) {
      setRoundtableError(error instanceof Error ? error.message : t('Không thể đăng ký CEO Roundtable. Vui lòng thử lại.'))
      return null
    } finally {
      setRoundtableSubmitting(false)
    }
  }

  // An email already registered this quarter is handled by the backend: a new
  // registration request returns the existing one, so both choices just continue.
  const confirmRoundtableChoice = async () => {
    if (roundtableRegistered || roundtableChoice === 'no') {
      await continueFromRoundtable()
      return
    }
    if (roundtableChoice !== 'yes') return

    const registrationId = await registerRoundtable()
    if (registrationId) await continueFromRoundtable(registrationId)
  }

  const closeRoundtable = () => {
    setRoundtableOpen(false)
    window.requestAnimationFrame(() => roundtableTriggerRef.current?.focus())
  }

  // newRegistrationId comes from a registration made in the same click, before
  // React has applied the roundtable state updates.
  const continueFromRoundtable = async (newRegistrationId?: string) => {
    if (submitting) return
    if (submittedSubmissionId) {
      closeRoundtable()
      setDrawerOpen(false)
      setScreen('loading')
      window.requestAnimationFrame(scrollToTop)
      return
    }

    setSubmitting(true)
    setSubmissionError('')

    try {
      const payload = buildSurveySubmissionPayload({
        answers,
        consent,
        contact,
        otherAnswers,
        partTwoPrivacyRefused,
        reportMode,
        roundtableContact,
        roundtableRegistered: roundtableRegistered || Boolean(newRegistrationId),
        roundtableRegistrationId: newRegistrationId ?? roundtableRegistrationId,
      })
      const result = await submitSurveySubmission(payload, submissionIdempotencyKey)
      setSubmittedSubmissionId(result.submissionId)
      setSubmittedAt(result.submittedAt)
      setReportJobId(result.report?.jobId ?? '')
      setReportAccessToken(result.report?.accessToken ?? '')
      setReportAccessTokenExpiresAt(result.report?.accessTokenExpiresAt ?? '')
      setReportStatus(result.report?.status ?? '')
      setReportDeferredDays(deferredResultDays(result.report))
      setReportEmailStatus('not_sent')
      setReportHtml('')
      setReportError('')
      setReportPollingTimedOut(false)
      reportHtmlLoadedRef.current = false
      setScreen('loading')
      closeRoundtable()
      window.requestAnimationFrame(scrollToTop)
    } catch (error) {
      setSubmissionError(error instanceof Error ? error.message : t('Không thể gửi kết quả khảo sát. Vui lòng thử lại.'))
    } finally {
      setSubmitting(false)
    }
  }

  const backToLanding = () => {
    if (submittedSubmissionId) clearSurveySession()
    setReportHtml('')
    setRoundtableOpen(false)
    setSurveyAnswersReviewOpen(false)
    onBackHome()
  }

  const retryReportPolling = () => {
    setReportError('')
    setReportPollingTimedOut(false)
    setReportPollingRetry((value) => value + 1)
  }

  const handleHeaderBack = () => {
    if (screen === 'intro') {
      backToLanding()
      return
    }
    if (screen === 'part1') {
      if (submittedSubmissionId) {
        goToScreen('report')
      } else {
        goToScreen('intro')
      }
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
      return
    }
    if (screen === 'report') {
      backToLanding()
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
        title={screen === 'part2' ? t('Phần 2 · Khảo sát định danh') : t('Phần 1 · Khảo sát khuyết danh')}
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
            intro={t('18 câu hỏi được hiển thị liên tục trên cùng một trang để Anh/Chị có thể đọc, trả lời và xem lại nhanh.')}
            missingQuestionNumbers={missingQuestionNumbers}
            onAnswer={handleAnswer}
            onNext={isSubmittedReview ? (partTwoCompleted === partTwoQuestions.length ? reviewPartTwoAnswers : () => goToScreen('report')) : continuePartOne}
            onOtherAnswer={handleOtherAnswer}
            onPrevious={isSubmittedReview ? () => goToScreen('report') : () => goToScreen('intro')}
            otherAnswers={otherAnswers}
            part={1}
            primaryLabel={isSubmittedReview ? (partTwoCompleted === partTwoQuestions.length ? t('Xem Phần 2') : t('Về báo cáo')) : t('Tiếp theo')}
            questions={partOneQuestions}
            readOnly={isSubmittedReview}
            subtitle={t('Lựa chọn câu trả lời phù hợp:\n1 - Hoàn toàn không đồng ý, 2- Không đồng ý, 3 - Bình thường, 4 - Đồng ý, 5 - Hoàn toàn đồng ý')}
          />
        ) : null}

        {screen === 'part2' ? (
          <SurveyQuestionPage
            answers={answers}
            completedCount={partTwoCompleted}
            endNote={t('Nhấn “Gửi kết quả” để nhận Báo cáo Khuyết danh Phần 1 hoặc Báo cáo toàn phần (Phần 1 + Phần 2), tùy theo phần khảo sát Anh/Chị đã hoàn thành.')}
            error={questionError}
            intro={t('Các câu tiếp theo giúp hiểu sâu sắc về chính doanh nghiệp của Anh/Chị từ đó tăng độ chính xác khi phân tích vấn đề và khuyến nghị hành động trong Báo cáo Riêng tư.')}
            missingQuestionNumbers={missingQuestionNumbers}
            onAnswer={handleAnswer}
            onNext={isSubmittedReview ? () => goToScreen('report') : (partTwoCompleted > 0 ? continuePartTwo : skipPrivateReport)}
            onOtherAnswer={handleOtherAnswer}
            onPrevious={reviewPartOneAnswers}
            onSecondary={isSubmittedReview ? undefined : clearPartTwoAnswers}
            otherAnswers={otherAnswers}
            part={2}
            primaryLabel={isSubmittedReview ? t('Về báo cáo') : (partTwoCompleted > 0 ? t('\u0047\u1eedi \u006b\u1ebft qu\u1ea3') : t('\u0047\u1eedi \u006b\u1ebft qu\u1ea3 Ph\u1ea7n 1'))}
            questions={partTwoQuestions}
            readOnly={isSubmittedReview}
            subtitle={t('Đây là phần có thông tin riêng và nhạy cảm, nếu Anh/Chị không muốn tham gia khảo sát Phần 2 này, vui lòng nhấn nút “Gửi kết quả Phần 1” bên dưới để nhận Báo cáo Khuyết danh từ Phần 1.')}
          />
        ) : null}

        {screen === 'contact1' ? (
          <ContactScreen
            consent={consent}
            dataCollectionConsent={dataCollectionConsent}
            contact={contact}
            error={formError}
            mode="part1"
            onBack={reviewPartOneAnswers}
            onConsentChange={setConsent}
            onDataCollectionConsentChange={(value) => {
              setDataCollectionConsent(value)
              setSubmissionError('')
              setFormError('')
            }}
            onContactChange={(nextContact) => {
              setContact(nextContact)
              setSubmissionError('')
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
              setPartTwoPrivacyRefused(false)
              setSubmissionError('')
              setFormError('')
            }}
            onContactChange={(nextContact) => {
              setContact(nextContact)
              setSubmissionError('')
              setFormError('')
            }}
            onSkipPrivate={skipPrivateReport}
            onSubmit={startReportLoading}
          />
        ) : null}

        {screen === 'loading' ? (
          reportJobId && reportAccessToken ? (
            <ReportGenerationScreen
              deferredDays={reportDeferredDays}
              error={reportError}
              onHome={backToLanding}
              onRetry={retryReportPolling}
              pollTimedOut={reportPollingTimedOut}
              reportStatus={reportStatus}
            />
          ) : <LoadingScreen reportMode={reportMode} step={loadingStep} />
        ) : null}

        {screen === 'report' ? (
          <ReportScreen emailStatus={reportEmailStatus} html={reportHtml} mode={reportMode} onHome={backToLanding} onReviewAnswers={() => setSurveyAnswersReviewOpen(true)} />
        ) : null}

      </div>

      <RoundtableModal
        choice={roundtableChoice}
        error={roundtableError || submissionError}
        isRegistering={roundtableSubmitting}
        isSubmitting={submitting}
        onChoiceChange={(nextChoice) => {
          setRoundtableChoice(nextChoice)
          setSubmissionError('')
          setRoundtableError('')
        }}
        onClose={closeRoundtable}
        onConfirm={() => void confirmRoundtableChoice()}
        open={roundtableOpen}
      />

      <SurveyAnswersReviewModal
        answers={answers}
        contact={contact}
        onClose={() => setSurveyAnswersReviewOpen(false)}
        open={surveyAnswersReviewOpen}
        otherAnswers={otherAnswers}
        partTwoPrivacyRefused={partTwoPrivacyRefused}
        reportMode={reportMode}
        roundtableRegistered={roundtableRegistered}
      />
    </main>
  )
}
