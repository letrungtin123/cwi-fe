import { ArrowLeft, FileWarning, LoaderCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { QuarterlyReportDownloadModal } from './QuarterlyReportDownloadModal'
import { ReportPdfModal } from './ReportPdfModal'
import { getActiveQuarterlyReport, getQuarterlyReport, QuarterlyReportApiError, type QuarterlyReportPublic } from './quarterlyReportsApi'
import './quarterlyReportPage.css'

type QuarterlyReportPageProps = {
  slug: string | null
}

function goHome() {
  window.history.pushState(null, '', '/')
  window.dispatchEvent(new PopStateEvent('popstate'))
}

export function QuarterlyReportPage({ slug }: QuarterlyReportPageProps) {
  const [report, setReport] = useState<QuarterlyReportPublic | null>(null)
  const [error, setError] = useState('')
  const [downloadOpen, setDownloadOpen] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    setReport(null)
    setError('')
    const load = async () => {
      try {
        setReport(slug ? await getQuarterlyReport(slug, controller.signal) : await getActiveQuarterlyReport(controller.signal))
      } catch (loadError) {
        if (controller.signal.aborted) return
        setError(loadError instanceof QuarterlyReportApiError ? loadError.message : 'Không thể tải báo cáo quý. Vui lòng thử lại.')
      }
    }
    void load()
    return () => controller.abort()
  }, [slug])

  if (error) {
    return (
      <main className="quarterly-report-page-state">
        <FileWarning aria-hidden="true" size={38} />
        <h1>Chưa thể mở báo cáo</h1>
        <p>{error}</p>
        <button onClick={goHome} type="button"><ArrowLeft aria-hidden="true" size={17} /> Về trang chủ</button>
      </main>
    )
  }

  if (!report) {
    return <main aria-live="polite" className="quarterly-report-page-state"><LoaderCircle aria-hidden="true" className="quarterly-report-page-spinner" size={34} /><p>Đang chuẩn bị báo cáo...</p></main>
  }

  return (
    <>
      <ReportPdfModal onClose={goHome} onRequestDownload={() => setDownloadOpen(true)} open report={report} />
      <QuarterlyReportDownloadModal onClose={() => setDownloadOpen(false)} open={downloadOpen} report={report} />
    </>
  )
}
