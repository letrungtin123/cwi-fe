import '@fontsource/inter/vietnamese-300.css'
import '@fontsource/inter/vietnamese-300-italic.css'
import '@fontsource/inter/vietnamese-400.css'
import '@fontsource/inter/vietnamese-400-italic.css'
import '@fontsource/inter/vietnamese-500.css'
import '@fontsource/inter/vietnamese-500-italic.css'
import '@fontsource/inter/vietnamese-600.css'
import '@fontsource/inter/vietnamese-600-italic.css'
import '@fontsource/inter/vietnamese-700.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)


