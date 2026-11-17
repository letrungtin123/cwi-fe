import { useCallback, useEffect, useState } from 'react'
import { t, useLang, type Lang } from '@/i18n'
import reportQ3Image from '@/assets/figma/carousel-baocaoquy3.webp'
import { QuarterCardSection } from '@/features/survey/QuarterCardSection'
import { SurveyHeader } from '@/features/survey/SurveyChrome'
import { QuarterlyReportDownloadModal } from './QuarterlyReportDownloadModal'
import { ReportPdfModal } from './ReportPdfModal'
import { getQuarterlyReports, quarterlyReportImageUrl, toReportView, type QuarterlyReportList } from './quarterlyReportsApi'
import '@/features/survey/survey.css'
import './quarterlyReportPage.css'

type QuarterlyReportPageProps = {
  slug: string | null
}

// Card picture until the admin uploads one.
const defaultImages: Record<string, string> = { 'q3-2026': reportQ3Image }

const LIST_PATH = '/bao-cao-quy'

function slugFromPath() {
  return /^\/bao-cao-quy\/(q[1-4]-\d{4})$/.exec(window.location.pathname)?.[1] ?? null
}

function goHome() {
  window.history.pushState(null, '', '/')
  window.dispatchEvent(new PopStateEvent('popstate'))
}

// Shown when the language asked for has no PDF yet, in the language of that wish.
function missingLanguageNote(wanted: Lang) {
  return wanted === 'en'
    ? 'English version coming soon. You are reading the Vietnamese version.'
    : 'Bản tiếng Việt sắp có. Anh/Chị đang xem bản tiếng Anh.'
}

// /bao-cao-quy: the quarterly reports as cards. A card opens its report in the PDF reader at
// /bao-cao-quy/<quarter> (also the link on ads and QR codes); closing it returns to the cards.
export function QuarterlyReportPage({ slug: initialSlug }: QuarterlyReportPageProps) {
  const lang = useLang()
  const [list, setList] = useState<QuarterlyReportList | null>(null)
  const [loadError, setLoadError] = useState(false)
  const [slug, setSlug] = useState(initialSlug)
  // The PDF language picked in the reader; until then the page's language.
  const [pickedLanguage, setPickedLanguage] = useState<Lang | null>(null)
  const [downloadOpen, setDownloadOpen] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    getQuarterlyReports(controller.signal)
      .then(setList)
      .catch(() => {
        if (!controller.signal.aborted) setLoadError(true)
      })
    return () => controller.abort()
  }, [])

  // Back / forward between the cards and a report.
  useEffect(() => {
    const onPopState = () => {
      setSlug(slugFromPath())
      setPickedLanguage(null)
      setDownloadOpen(false)
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  // Keeps ?lang= (and any other query) so a shared link opens in the same language.
  const navigate = useCallback((path: string, next: string | null) => {
    window.history.pushState(null, '', path + window.location.search)
    setSlug(next)
    setPickedLanguage(null)
    setDownloadOpen(false)
  }, [])

  const card = slug && list ? list.reports.find((report) => report.slug === slug) ?? null : null
  // A link to a quarter that is hidden or unknown: show the cards with a short note.
  const unavailable = Boolean(slug && list && !card)
  const wanted = pickedLanguage ?? lang
  const view = card ? toReportView(card, wanted) : null
  const page = list?.page

  return (
    <main className="survey-page quarterly-report-list-page">
      <SurveyHeader canOpenDrawer={false} onBackHome={goHome} onOpenDrawer={() => undefined} />
      <div className="survey-shell">
        {unavailable ? <p className="quarterly-report-unavailable" role="status">{t('Báo cáo này hiện chưa mở. Anh/Chị có thể xem các báo cáo bên dưới.')}</p> : null}
        {loadError ? (
          <p className="quarterly-report-unavailable" role="alert">{t('Không thể tải báo cáo quý. Vui lòng thử lại.')}</p>
        ) : (
          <QuarterCardSection
            description={page?.description[lang] ?? ''}
            items={list ? list.reports.map((report) => ({
              buttonLabel: t('Xem báo cáo'),
              description: report.description[lang],
              id: report.slug,
              image: report.imageUrl ? quarterlyReportImageUrl(report.imageUrl) : defaultImages[report.slug],
              isCurrent: report.isCurrent,
              kicker: t('Báo cáo {label}', { label: report.label[lang] }),
              onSelect: () => navigate(`${LIST_PATH}/${report.slug}`, report.slug),
              title: report.title[lang],
            })) : null}
            kicker={page?.kicker[lang] ?? 'CEO Workforce Index'}
            loadingText={t('Đang tải báo cáo quý…')}
            title={page?.title[lang] ?? t('Báo cáo theo quý')}
          />
        )}
        {list && !list.reports.length ? <p className="quarterly-report-unavailable">{t('Chưa có báo cáo quý được công bố.')}</p> : null}
      </div>

      {card && view ? (
        <>
          <ReportPdfModal
            escapeSuspended={downloadOpen}
            languages={card.languages}
            notice={view.language === wanted ? '' : missingLanguageNote(wanted)}
            onClose={() => navigate(LIST_PATH, null)}
            onLanguageChange={setPickedLanguage}
            onRequestDownload={() => setDownloadOpen(true)}
            open
            report={view}
          />
          <QuarterlyReportDownloadModal onClose={() => setDownloadOpen(false)} open={downloadOpen} report={view} />
        </>
      ) : null}
    </main>
  )
}
