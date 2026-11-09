import '@fontsource-variable/inter/standard.css'
import '@fontsource-variable/inter/standard-italic.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { captureSurveySourceFromUrl } from './features/survey/surveySource'

// Remember the invitation source of a survey link before anything else runs.
captureSurveySourceFromUrl()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)


