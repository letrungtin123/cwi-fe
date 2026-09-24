import { X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import reportPdf from '@/assets/figma/pdfbaocao/pdf-bao-cao-quy-3.pdf'
import './reportPdfModal.css'

type ReportPdfModalProps = {
  onClose: () => void
  open: boolean
}

export function ReportPdfModal({ onClose, open }: ReportPdfModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)

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
        <iframe className="report-pdf-modal-document" src={`${reportPdf}?inline=1#view=FitH`} title="Báo cáo Quý 3/2026" />
      </section>
    </div>,
    document.body,
  )
}
