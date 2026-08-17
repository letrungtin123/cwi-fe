import { useEffect, useState } from 'react'
import { LandingPage } from '@/features/landing/LandingPage'
import { SurveyExperience } from '@/features/survey/SurveyExperience'

type AppMode = 'landing' | 'survey'
type LandingActionEvent = CustomEvent<{ action?: string }>

function App() {
  const [mode, setMode] = useState<AppMode>('landing')

  useEffect(() => {
    const handleLandingAction = (event: Event) => {
      const action = (event as LandingActionEvent).detail?.action
      if (action !== 'survey' && action !== 'unlock-report') return

      setMode('survey')
      window.requestAnimationFrame(() => window.scrollTo({ top: 0 }))
    }

    window.addEventListener('cwi:landing-action', handleLandingAction)
    return () => window.removeEventListener('cwi:landing-action', handleLandingAction)
  }, [])

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