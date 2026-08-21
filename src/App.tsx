import { useEffect, useState } from 'react'
import { LandingPage } from '@/features/landing/LandingPage'
import { PrivacyPolicyPage } from '@/features/landing/PrivacyPolicyPage'
import { TermsOfOperationPage } from '@/features/landing/TermsOfOperationPage'
import { SurveyExperience } from '@/features/survey/SurveyExperience'
import { clearSurveySession, hasSurveySession } from '@/features/survey/surveyPersistence'

type AppMode = 'landing' | 'survey' | 'privacy' | 'terms'
type LandingActionEvent = CustomEvent<{ action?: string }>

function isFreshSurveyEntry() {
  if (typeof window === 'undefined') return false
  return window.location.pathname === '/survey' && new URLSearchParams(window.location.search).get('entry') === 'qr'
}

function getInitialMode(): AppMode {
  if (typeof window === 'undefined') return 'landing'
  if (window.location.pathname === '/privacy-policy') return 'privacy'
  if (window.location.pathname === '/terms-of-operation') return 'terms'
  if (window.location.pathname === '/survey') return 'survey'
  if (hasSurveySession()) return 'survey'
  return 'landing'
}

function App() {
  const [mode, setMode] = useState<AppMode>(getInitialMode)

  useEffect(() => {
    const handleLandingAction = (event: Event) => {
      const action = (event as LandingActionEvent).detail?.action
      if (action !== 'survey' && action !== 'unlock-report') return

      setMode('survey')
      window.requestAnimationFrame(() => window.scrollTo({ top: 0 }))
    }

    const handlePopState = () => setMode(getInitialMode())

    window.addEventListener('cwi:landing-action', handleLandingAction)
    window.addEventListener('popstate', handlePopState)
    return () => {
      window.removeEventListener('cwi:landing-action', handleLandingAction)
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  if (mode === 'privacy') {
    return (
      <PrivacyPolicyPage />
    )
  }


  if (mode === 'terms') {
    return <TermsOfOperationPage />
  }

  if (mode === 'survey') {
    return (
      <SurveyExperience
        startFresh={isFreshSurveyEntry()}
        onBackHome={() => {
          clearSurveySession()
          setMode('landing')
          window.requestAnimationFrame(() => window.scrollTo({ top: 0 }))
        }}
      />
    )
  }

  return <LandingPage />
}

export default App