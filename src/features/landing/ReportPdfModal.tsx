import { Download, ExternalLink, RefreshCw, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import reportPdf from '@/assets/figma/pdfbaocao/pdf-bao-cao-quy-3.pdf'
import './reportPdfModal.css'

type ReportPdfModalProps = {
  onClose: () => void
  open: boolean
}

type MobileReportPdfViewerProps = {
  onRetry: () => void
}

function useMobilePdfViewer() {
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.matchMedia('(max-width: 900px)').matches)

  useEffect(() => {
    const query = window.matchMedia('(max-width: 900px)')
    const sync = () => setIsMobile(query.matches)
    sync()
    query.addEventListener('change', sync)
    return () => query.removeEventListener('change', sync)
  }, [])

  return isMobile
}

function MobileReportPdfViewer({ onRetry }: MobileReportPdfViewerProps) {
  const pagesRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  useEffect(() => {
    let cancelled = false
    let destroyLoadingTask: (() => Promise<void>) | undefined
    let observer: IntersectionObserver | undefined

    const render = async () => {
      const pagesContainer = pagesRef.current
      if (!pagesContainer) return

      pagesContainer.replaceChildren()
      setStatus('loading')

      try {
        // This distribution supplies compatibility shims for older WebViews and Safari.
        const [pdfjs, workerModule] = await Promise.all([
          import('pdfjs-dist/legacy/build/pdf.mjs'),
          import('pdfjs-dist/legacy/build/pdf.worker.min.mjs?url'),
        ])
        if (cancelled) return

        pdfjs.GlobalWorkerOptions.workerSrc = workerModule.default
        const loadingTask = pdfjs.getDocument({
          disableAutoFetch: true,
          disableStream: true,
          rangeChunkSize: 256 * 1024,
          url: reportPdf,
        })
        destroyLoadingTask = () => loadingTask.destroy()
        const pdf = await loadingTask.promise
        if (cancelled) return

        const queuedPages = new Set<number>()
        const renderedPages = new Set<number>()
        const queue: number[] = []
        let rendering = false

        const renderPage = async (pageNumber: number) => {
          const pageFrame = pagesContainer.querySelector<HTMLElement>(`[data-page-number="${pageNumber}"]`)
          if (!pageFrame || cancelled || renderedPages.has(pageNumber)) return

          pageFrame.dataset.renderState = 'rendering'
          const page = await pdf.getPage(pageNumber)
          if (cancelled) return

          const baseViewport = page.getViewport({ scale: 1 })
          const pageWidth = Math.max(280, pagesContainer.clientWidth - 4)
          const cssScale = pageWidth / baseViewport.width
          const pixelScale = cssScale * Math.min(window.devicePixelRatio || 1, 1.25)
          const viewport = page.getViewport({ scale: pixelScale })
          const canvas = document.createElement('canvas')
          const pageLabel = pageFrame.querySelector<HTMLElement>('.report-pdf-modal-page-label')

          canvas.width = Math.ceil(viewport.width)
          canvas.height = Math.ceil(viewport.height)
          canvas.style.width = `${Math.round(baseViewport.width * cssScale)}px`
          canvas.style.height = `${Math.round(baseViewport.height * cssScale)}px`
          pageFrame.replaceChildren(pageLabel ?? document.createElement('span'), canvas)

          await page.render({ canvas, viewport }).promise
          if (cancelled) return

          page.cleanup()
          renderedPages.add(pageNumber)
          pageFrame.dataset.renderState = 'ready'
          if (pageNumber === 1) setStatus('ready')
        }

        const drainQueue = async () => {
          if (rendering) return
          rendering = true
          try {
            while (queue.length && !cancelled) {
              const pageNumber = queue.shift()
              if (pageNumber === undefined) continue
              try {
                await renderPage(pageNumber)
              } catch {
                const pageFrame = pagesContainer.querySelector<HTMLElement>(`[data-page-number="${pageNumber}"]`)
                if (pageFrame) pageFrame.dataset.renderState = 'error'
                if (pageNumber === 1) {
                  observer?.disconnect()
                  setStatus('error')
                  return
                }
              }
            }
          } finally {
            rendering = false
          }
        }

        const queuePage = (pageNumber: number) => {
          if (cancelled || renderedPages.has(pageNumber) || queuedPages.has(pageNumber)) return
          queuedPages.add(pageNumber)
          queue.push(pageNumber)
          void drainQueue()
        }

        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
          const pageFrame = document.createElement('article')
          const pageLabel = document.createElement('span')
          pageFrame.className = 'report-pdf-modal-page'
          pageFrame.dataset.pageNumber = String(pageNumber)
          pageFrame.dataset.renderState = 'pending'
          pageLabel.className = 'report-pdf-modal-page-label'
          pageLabel.textContent = `Trang ${pageNumber}`
          pageFrame.append(pageLabel)
          pagesContainer.append(pageFrame)
        }

        observer = new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              if (entry.isIntersecting) queuePage(Number((entry.target as HTMLElement).dataset.pageNumber))
            }
          },
          { root: pagesContainer, rootMargin: '720px 0px' },
        )
        pagesContainer.querySelectorAll<HTMLElement>('[data-page-number]').forEach((pageFrame) => observer?.observe(pageFrame))
        queuePage(1)
      } catch {
        if (!cancelled) setStatus('error')
      }
    }

    void render()
    return () => {
      cancelled = true
      observer?.disconnect()
      void destroyLoadingTask?.()
    }
  }, [])

  return (
    <div className="report-pdf-mobile-viewer">
      {status === 'loading' ? <p className="report-pdf-mobile-status" role="status">Đang tải báo cáo...</p> : null}
      {status === 'error' ? (
        <div className="report-pdf-mobile-fallback" role="alert">
          <p>Trình đọc trên thiết bị này chưa tải được báo cáo.</p>
          <div className="report-pdf-mobile-fallback-actions">
            <button onClick={onRetry} type="button"><RefreshCw aria-hidden="true" size={16} /> Thử lại</button>
            <a href={reportPdf} rel="noreferrer" target="_blank"><ExternalLink aria-hidden="true" size={16} /> Mở bằng trình đọc PDF</a>
          </div>
        </div>
      ) : null}
      <div aria-busy={status === 'loading'} className="report-pdf-mobile-pages" ref={pagesRef} />
    </div>
  )
}

export function ReportPdfModal({ onClose, open }: ReportPdfModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const useMobileViewer = useMobilePdfViewer()
  const [mobileViewerAttempt, setMobileViewerAttempt] = useState(0)

  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    const previousFocus = document.activeElement as HTMLElement | null
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      event.preventDefault()
      onClose()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', closeOnEscape)
    window.requestAnimationFrame(() => closeButtonRef.current?.focus())

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', closeOnEscape)
      window.requestAnimationFrame(() => previousFocus?.focus())
    }
  }, [onClose, open])

  if (!open || typeof document === 'undefined') return null

  return createPortal(
    <div className="report-pdf-modal-backdrop" role="presentation">
      <section aria-labelledby="report-pdf-modal-title" aria-modal="true" className="report-pdf-modal" role="dialog">
        <h2 className="sr-only" id="report-pdf-modal-title">Báo cáo Quý 3/2026</h2>
        <button aria-label="Đóng báo cáo" className="report-pdf-modal-close" onClick={onClose} ref={closeButtonRef} type="button">
          <X aria-hidden="true" size={22} strokeWidth={2} />
        </button>
        <a
          aria-label="Tải báo cáo PDF"
          className="report-pdf-modal-download"
          download="Bao-cao-CEO-Workforce-Index-Q3-2026.pdf"
          href={reportPdf}
          title="Tải báo cáo PDF"
        >
          <Download aria-hidden="true" size={20} strokeWidth={2} />
        </a>
        {useMobileViewer
          ? <MobileReportPdfViewer key={mobileViewerAttempt} onRetry={() => setMobileViewerAttempt((attempt) => attempt + 1)} />
          : <iframe className="report-pdf-modal-document" src={`${reportPdf}#view=FitH`} title="Báo cáo Quý 3/2026" />}
      </section>
    </div>,
    document.body,
  )
}
