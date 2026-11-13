import { lazy, startTransition, Suspense, useEffect, useRef, useState } from 'react'
import { LandingPage } from '@/features/landing/LandingPage'
import { clearSurveySession, hasSurveySession } from '@/features/survey/surveyPersistence'
import { useLang } from '@/i18n'

// The landing page ships in the first download; the other pages load when first opened.
const loadSurvey = () => import('@/features/survey/SurveyExperience')
const SurveyExperience = lazy(() => loadSurvey().then((module) => ({ default: module.SurveyExperience })))
const QuarterlyReportPage = lazy(() => import('@/features/landing/QuarterlyReportPage').then((module) => ({ default: module.QuarterlyReportPage })))
const PrivacyPolicyPage = lazy(() => import('@/features/landing/PrivacyPolicyPage').then((module) => ({ default: module.PrivacyPolicyPage })))
const TermsOfOperationPage = lazy(() => import('@/features/landing/TermsOfOperationPage').then((module) => ({ default: module.TermsOfOperationPage })))

type AppMode = 'landing' | 'quarterlyReport' | 'survey' | 'privacy' | 'terms'
type LandingActionEvent = CustomEvent<{ action?: string }>

function isFreshSurveyEntry() {
  if (typeof window === 'undefined') return false
  return window.location.pathname === '/survey' && new URLSearchParams(window.location.search).get('entry') === 'qr'
}

function hasPublicRegistrationRequest() {
  if (typeof window === 'undefined') return false
  const registration = new URLSearchParams(window.location.search).get('register')
  return registration === 'roundtable' || registration === 'webinar'
}

function getInitialMode(): AppMode {
  if (typeof window === 'undefined') return 'landing'
  if (window.location.pathname === '/privacy-policy') return 'privacy'
  if (window.location.pathname === '/terms-of-operation') return 'terms'
  if (/^\/bao-cao-quy(?:\/q[1-4]-\d{4})?$/.test(window.location.pathname)) return 'quarterlyReport'
  if (window.location.pathname === '/survey') return 'survey'
  if (hasPublicRegistrationRequest()) return 'landing'
  if (hasSurveySession()) return 'survey'
  return 'landing'
}

function App() {
  const [mode, setMode] = useState<AppMode>(getInitialMode)
  // Subscribing here re-renders the whole tree when the language changes.
  useLang()
  // Set when a click switches page; the new page then opens at its top once it is on screen.
  const scrollToTopAfterSwitch = useRef(false)

  useEffect(() => {
    if (!scrollToTopAfterSwitch.current) return
    scrollToTopAfterSwitch.current = false
    window.scrollTo({ top: 0 })
  }, [mode])

  // Most visitors go from the landing page to the survey: fetch it in the background once the
  // landing page is idle, so the button opens it without a wait.
  useEffect(() => {
    if (mode !== 'landing') return
    if (typeof window.requestIdleCallback !== 'function') {
      const timer = window.setTimeout(() => void loadSurvey().catch(() => undefined), 2000)
      return () => window.clearTimeout(timer)
    }
    const handle = window.requestIdleCallback(() => void loadSurvey().catch(() => undefined))
    return () => window.cancelIdleCallback(handle)
  }, [mode])

  useEffect(() => {
    const handleLandingAction = (event: Event) => {
      const action = (event as LandingActionEvent).detail?.action
      if (action !== 'survey' && action !== 'unlock-report') return

      // A landing-page survey CTA always starts a new attempt. Report access
      // keeps the existing session so the user can continue viewing it.
      if (action === 'survey') clearSurveySession()
      // A transition keeps the current page on screen until the next one has loaded.
      scrollToTopAfterSwitch.current = true
      startTransition(() => setMode('survey'))
    }

    const handlePopState = () => startTransition(() => setMode(getInitialMode()))

    window.addEventListener('cwi:landing-action', handleLandingAction)
    window.addEventListener('popstate', handlePopState)
    return () => {
      window.removeEventListener('cwi:landing-action', handleLandingAction)
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  const backHome = () => {
    clearSurveySession()
    scrollToTopAfterSwitch.current = true
    setMode('landing')
  }

  return (
    <Suspense fallback={<div aria-busy="true" style={{ minHeight: '100dvh' }} />}>
      <Page mode={mode} onBackHome={backHome} />
    </Suspense>
  )
}

function Page({ mode, onBackHome }: { mode: AppMode; onBackHome: () => void }) {
  if (mode === 'privacy') return <PrivacyPolicyPage />

  if (mode === 'terms') return <TermsOfOperationPage />

  if (mode === 'quarterlyReport') {
    const match = /^\/bao-cao-quy\/(q[1-4]-\d{4})$/.exec(window.location.pathname)
    return <QuarterlyReportPage slug={match?.[1] ?? null} />
  }

  if (mode === 'survey') return <SurveyExperience startFresh={isFreshSurveyEntry()} onBackHome={onBackHome} />

  return <LandingPage />
}

export default App
