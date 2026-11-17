import { SurveyHeader } from './SurveyChrome'
import { SurveyQuarterCards } from './SurveyQuarterCards'
import './survey.css'

// First screen of /survey: the list of quarter cards. Choosing one opens that quarter's intro.
export function SurveyQuarterPicker({ onBackHome, onSelect }: { onBackHome: () => void; onSelect: (surveyVersion: string) => void }) {
  return (
    <main className="survey-page">
      <SurveyHeader canOpenDrawer={false} onBackHome={onBackHome} onOpenDrawer={() => undefined} />
      <div className="survey-shell">
        <SurveyQuarterCards onSelect={onSelect} />
      </div>
    </main>
  )
}
