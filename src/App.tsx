import { useEffect, useState } from 'react'
import { LandingPage } from '@/features/landing/LandingPage'
import { PrivacyPolicyPage } from '@/features/landing/PrivacyPolicyPage'
import { SurveyExperience } from '@/features/survey/SurveyExperience'

type AppMode = 'landing' | 'survey' | 'privacy'
type LandingActionEvent = CustomEvent<{ action?: string }>

function getInitialMode(): AppMode {
  return typeof window !== 'undefined' && window.location.pathname === '/privacy-policy' ? 'privacy' : 'landing'
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

  if (mode === 'survey') {
    return (
      <SurveyExperience
        onBackHome={() => {
          setMode('landing')
          window.requestAnimationFrame(() => window.scrollTo({ top: 0 }))
        }}
      />
    )
  }

  return <LandingPage />
}

export default App