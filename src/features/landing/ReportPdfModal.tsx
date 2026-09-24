import { X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import reportPdf from '@/assets/figma/pdfbaocao/pdf-bao-cao-quy-3.pdf'
import './reportPdfModal.css'

type ReportPdfModalProps = {
  onClose: () => void
  open: boolean
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

function MobileReportPdfViewer() {
  const pagesRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  useEffect(() => {
    let cancelled = false
    let destroyLoadingTask: (() => Promise<void>) | undefined

    const render = async () => {
      const pagesContainer = pagesRef.current
      if (!pagesContainer) return

      pagesContainer.replaceChildren()
      setStatus('loading')

      try {
        const [pdfjs, workerModule] = await Promise.all([
          import('pdfjs-dist'),
          import('pdfjs-dist/build/pdf.worker.min.mjs?url'),
        ])
        if (cancelled) return

        pdfjs.GlobalWorkerOptions.workerSrc = `${workerModule.default}?worker=1`
        const loadingTask = pdfjs.getDocument({ url: `${reportPdf}?inline=1` })
        destroyLoadingTask = () => loadingTask.destroy()
        const pdf = await loadingTask.promise

        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
          if (cancelled) return

          const page = await pdf.getPage(pageNumber)
          const pageFrame = document.createElement('article')
          const pageLabel = document.createElement('span')
          const canvas = document.createElement('canvas')
          const baseViewport = page.getViewport({ scale: 1 })
          const pageWidth = Math.max(280, pagesContainer.clientWidth - 24)
          const cssScale = pageWidth / baseViewport.width
          const pixelScale = cssScale * Math.min(window.devicePixelRatio || 1, 1.5)
          const viewport = page.getViewport({ scale: pixelScale })

          pageFrame.className = 'report-pdf-modal-page'
          pageLabel.className = 'report-pdf-modal-page-label'
          pageLabel.textContent = `Trang ${pageNumber}`
          canvas.width = Math.ceil(viewport.width)
          canvas.height = Math.ceil(viewport.height)
          canvas.style.width = `${Math.round(baseViewport.width * cssScale)}px`
          canvas.style.height = `${Math.round(baseViewport.height * cssScale)}px`
          pageFrame.append(pageLabel, canvas)
          pagesContainer.append(pageFrame)

          await page.render({ canvas, viewport }).promise
          if (pageNumber === 1 && !cancelled) setStatus('ready')
        }

        if (!cancelled) setStatus('ready')
      } catch {
        if (!cancelled) setStatus('error')
      }
    }

    void render()
    return () => {
      cancelled = true
      void destroyLoadingTask?.()
    }
  }, [])

  return (
    <div className="report-pdf-mobile-viewer">
      {status === 'loading' ? <p className="report-pdf-mobile-status" role="status">Đang tải báo cáo...</p> : null}
      {status === 'error' ? <p className="report-pdf-mobile-status is-error" role="alert">Không thể hiển thị báo cáo. Vui lòng thử lại.</p> : null}
      <div aria-busy={status === 'loading'} className="report-pdf-mobile-pages" ref={pagesRef} />
    </div>
  )
}

export function ReportPdfModal({ onClose, open }: ReportPdfModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const useMobileViewer = useMobilePdfViewer()

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
        {useMobileViewer ? <MobileReportPdfViewer /> : <iframe className="report-pdf-modal-document" src={`${reportPdf}?inline=1#view=FitH`} title="Báo cáo Quý 3/2026" />}
      </section>
    </div>,
    document.body,
  )
}
