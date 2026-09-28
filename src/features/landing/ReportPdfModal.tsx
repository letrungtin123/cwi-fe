import { ChevronDown, ChevronUp, Download, Minus, Plus, RefreshCw, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { PDFDocumentProxy } from 'pdfjs-dist/types/src/pdf'
import type { QuarterlyReportPublic } from './quarterlyReportsApi'
import './reportPdfModal.css'

type ReportPdfModalProps = {
  onClose: () => void
  onRequestDownload: () => void
  open: boolean
  report: QuarterlyReportPublic
}

type ReportPdfViewerProps = {
  onPageChange: (pageNumber: number) => void
  onPageCountChange: (pageCount: number) => void
  onRetry: () => void
  pdfUrl: string
  zoom: number
}

const MIN_ZOOM = 80
const MAX_ZOOM = 140
const ZOOM_STEP = 10

type PageLayout = {
  cssHeight: number
  cssScale: number
  cssWidth: number
  pixelScale: number
}

function getPageLayout(baseViewport: { height: number; width: number }, containerWidth: number, zoom: number): PageLayout {
  const compactLayout = containerWidth <= 900
  const availableWidth = Math.max(280, containerWidth - (compactLayout ? 24 : 112))
  const fitWidth = compactLayout ? availableWidth : Math.min(1080, availableWidth)
  const cssWidth = Math.max(compactLayout ? 280 : 560, Math.round((fitWidth * zoom) / 100))
  const cssScale = cssWidth / baseViewport.width
  const pixelScale = cssScale * Math.min(window.devicePixelRatio || 1, compactLayout ? 1.25 : 1.3)

  return {
    cssHeight: Math.round(baseViewport.height * cssScale),
    cssScale,
    cssWidth,
    pixelScale,
  }
}

function ReportPdfViewer({ onPageChange, onPageCountChange, onRetry, pdfUrl, zoom }: ReportPdfViewerProps) {
  const viewerRef = useRef<HTMLDivElement>(null)
  const pagesRef = useRef<HTMLDivElement>(null)
  const pdfDocumentRef = useRef<PDFDocumentProxy | null>(null)
  const [containerWidth, setContainerWidth] = useState(0)
  const [isDocumentReady, setIsDocumentReady] = useState(false)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  useEffect(() => {
    const viewer = viewerRef.current
    if (!viewer) return

    const updateWidth = () => setContainerWidth((currentWidth) => {
      const nextWidth = Math.round(viewer.clientWidth)
      // Mobile browsers resize the scrollport when their overlay scrollbar appears.
      // A few pixels do not require rebuilding every canvas in the document.
      return !currentWidth || Math.abs(currentWidth - nextWidth) > 12 ? nextWidth : currentWidth
    })

    updateWidth()
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', updateWidth)
      return () => window.removeEventListener('resize', updateWidth)
    }

    const resizeObserver = new ResizeObserver(updateWidth)
    resizeObserver.observe(viewer)
    return () => resizeObserver.disconnect()
  }, [])

  useEffect(() => {
    let cancelled = false
    let destroyLoadingTask: (() => Promise<void>) | undefined

    const loadDocument = async () => {
      setStatus('loading')
      setIsDocumentReady(false)
      pdfDocumentRef.current = null

      try {
        // The legacy build provides compatibility shims for older mobile WebViews and Safari.
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
          url: pdfUrl,
        })
        destroyLoadingTask = () => loadingTask.destroy()
        const pdf = await loadingTask.promise
        if (cancelled) return

        pdfDocumentRef.current = pdf
        onPageCountChange(pdf.numPages)
        setIsDocumentReady(true)
      } catch {
        if (!cancelled) setStatus('error')
      }
    }

    void loadDocument()
    return () => {
      cancelled = true
      void destroyLoadingTask?.()
    }
  }, [onPageCountChange, pdfUrl])

  useEffect(() => {
    if (!containerWidth || !isDocumentReady) return

    const pdf = pdfDocumentRef.current
    if (!pdf) return

    let cancelled = false
    let renderObserver: IntersectionObserver | undefined
    let removeScrollListener: (() => void) | undefined

    const render = async () => {
      const pagesContainer = pagesRef.current
      const viewer = viewerRef.current
      if (!pagesContainer || !viewer) return

      const previousScrollTop = viewer.scrollTop
      pagesContainer.replaceChildren()

      try {
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
          const pageLayout = getPageLayout(baseViewport, containerWidth, zoom)
          const viewport = page.getViewport({ scale: pageLayout.pixelScale })
          const canvas = document.createElement('canvas')
          const pageLabel = pageFrame.querySelector<HTMLElement>('.report-pdf-modal-page-label')

          canvas.width = Math.ceil(viewport.width)
          canvas.height = Math.ceil(viewport.height)
          canvas.style.width = `${pageLayout.cssWidth}px`
          canvas.style.height = `${pageLayout.cssHeight}px`
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
                  renderObserver?.disconnect()
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

        const firstPage = await pdf.getPage(1)
        if (cancelled) return
        const firstPageLayout = getPageLayout(firstPage.getViewport({ scale: 1 }), containerWidth, zoom)

        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
          const pageFrame = document.createElement('article')
          const pageLabel = document.createElement('span')
          pageFrame.className = 'report-pdf-modal-page'
          pageFrame.dataset.pageNumber = String(pageNumber)
          pageFrame.dataset.renderState = 'pending'
          pageFrame.style.width = `${firstPageLayout.cssWidth}px`
          pageFrame.style.minHeight = `${firstPageLayout.cssHeight + 28}px`
          pageLabel.className = 'report-pdf-modal-page-label'
          pageLabel.textContent = `Trang ${pageNumber}`
          pageFrame.append(pageLabel)
          pagesContainer.append(pageFrame)
        }

        renderObserver = new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              if (entry.isIntersecting) queuePage(Number((entry.target as HTMLElement).dataset.pageNumber))
            }
          },
          { root: viewer, rootMargin: '720px 0px' },
        )
        const syncActivePage = () => {
          const viewerTop = viewer.getBoundingClientRect().top
          const pageFrames = Array.from(pagesContainer.querySelectorAll<HTMLElement>('[data-page-number]'))
          let closestPage = 1
          let closestDistance = Number.POSITIVE_INFINITY

          for (const pageFrame of pageFrames) {
            const pageRect = pageFrame.getBoundingClientRect()
            if (pageRect.bottom <= viewerTop) continue
            const distance = Math.abs(pageRect.top - viewerTop)
            if (distance < closestDistance) {
              closestDistance = distance
              closestPage = Number(pageFrame.dataset.pageNumber)
            }
          }

          onPageChange(closestPage)
        }

        pagesContainer.querySelectorAll<HTMLElement>('[data-page-number]').forEach((pageFrame) => {
          renderObserver?.observe(pageFrame)
        })
        viewer.scrollTop = previousScrollTop
        viewer.addEventListener('scroll', syncActivePage, { passive: true })
        removeScrollListener = () => viewer.removeEventListener('scroll', syncActivePage)
        window.requestAnimationFrame(syncActivePage)
        queuePage(1)
      } catch {
        if (!cancelled) setStatus('error')
      }
    }

    void render()
    return () => {
      cancelled = true
      renderObserver?.disconnect()
      removeScrollListener?.()
    }
  }, [containerWidth, isDocumentReady, onPageChange, zoom])

  return (
    <div aria-busy={status === 'loading'} className="report-pdf-viewer" ref={viewerRef}>
      {status === 'loading' ? <p className="report-pdf-status" role="status">Đang tải báo cáo...</p> : null}
      {status === 'error' ? (
        <div className="report-pdf-fallback" role="alert">
          <p>Trình đọc chưa tải được báo cáo trên thiết bị này.</p>
          <button onClick={onRetry} type="button"><RefreshCw aria-hidden="true" size={16} /> Thử lại</button>
        </div>
      ) : null}
      <div className="report-pdf-pages" ref={pagesRef} />
    </div>
  )
}

export function ReportPdfModal({ onClose, onRequestDownload, open, report }: ReportPdfModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const expandButtonRef = useRef<HTMLButtonElement>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageCount, setPageCount] = useState<number | null>(null)
  const [viewerAttempt, setViewerAttempt] = useState(0)
  const [zoom, setZoom] = useState(100)
  const [isChromeCollapsed, setIsChromeCollapsed] = useState(false)

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

  useEffect(() => {
    if (!open) return
    setCurrentPage(1)
    setPageCount(null)
    setViewerAttempt(0)
    setZoom(100)
    setIsChromeCollapsed(false)
  }, [open])

  if (!open || typeof document === 'undefined') return null

  const pageCountLabel = pageCount ? `${currentPage} / ${pageCount}` : 'Đang tải'
  const collapseChrome = () => {
    setIsChromeCollapsed(true)
    window.requestAnimationFrame(() => expandButtonRef.current?.focus())
  }

  return createPortal(
    <div className="report-pdf-modal-backdrop" role="presentation">
      <section aria-labelledby="report-pdf-modal-title" aria-modal="true" className="report-pdf-modal" data-chrome-collapsed={isChromeCollapsed} role="dialog">
        <div aria-hidden={isChromeCollapsed} className="report-pdf-reader-chrome">
          <header className="report-pdf-modal-header">
            <div className="report-pdf-modal-copy">
              <p className="report-pdf-modal-eyebrow">BẢN PDF ĐẦY ĐỦ · {pageCount ? `${pageCount} TRANG` : 'ĐANG TẢI'}</p>
              <h2 id="report-pdf-modal-title">{report.title}</h2>
              <p>{report.subtitle}</p>
            </div>
            <div className="report-pdf-modal-actions">
              <button aria-label="Tải báo cáo PDF" className="report-pdf-modal-download" onClick={onRequestDownload} type="button">
                <span>Tải báo cáo</span>
                <Download aria-hidden="true" size={18} strokeWidth={2} />
              </button>
              <button aria-label="Đóng báo cáo" className="report-pdf-modal-close" onClick={onClose} ref={closeButtonRef} type="button">
                <X aria-hidden="true" size={22} strokeWidth={2} />
              </button>
            </div>
          </header>
          <div aria-label="Điều khiển trình đọc báo cáo" className="report-pdf-modal-toolbar" role="toolbar">
            <p className="report-pdf-page-count">Trang {pageCountLabel}</p>
            <p className="report-pdf-scroll-hint">Cuộn để đọc toàn bộ báo cáo</p>
            <div className="report-pdf-toolbar-actions">
              <div className="report-pdf-zoom-controls">
                <button aria-label="Thu nhỏ báo cáo" disabled={zoom <= MIN_ZOOM} onClick={() => setZoom((currentZoom) => Math.max(MIN_ZOOM, currentZoom - ZOOM_STEP))} type="button">
                  <Minus aria-hidden="true" size={17} strokeWidth={2} />
                </button>
                <output aria-label={`Mức phóng to ${zoom}%`}>{zoom}%</output>
                <button aria-label="Phóng to báo cáo" disabled={zoom >= MAX_ZOOM} onClick={() => setZoom((currentZoom) => Math.min(MAX_ZOOM, currentZoom + ZOOM_STEP))} type="button">
                  <Plus aria-hidden="true" size={17} strokeWidth={2} />
                </button>
              </div>
              <button aria-label="Thu gọn tiêu đề báo cáo" className="report-pdf-collapse-button" onClick={collapseChrome} type="button">
                <ChevronUp aria-hidden="true" size={18} strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>
        <button aria-expanded={!isChromeCollapsed} aria-label="Hiện tiêu đề báo cáo" className="report-pdf-expand-button" onClick={() => setIsChromeCollapsed(false)} ref={expandButtonRef} type="button">
          <ChevronDown aria-hidden="true" size={19} strokeWidth={2} />
          <span>Hiện thông tin báo cáo</span>
        </button>
        <ReportPdfViewer
          key={viewerAttempt}
          onPageChange={setCurrentPage}
          onPageCountChange={setPageCount}
          onRetry={() => setViewerAttempt((attempt) => attempt + 1)}
          pdfUrl={report.pdfUrl}
          zoom={zoom}
        />
      </section>
    </div>,
    document.body,
  )
}
