import { Check, CheckCircle2, ChevronDown, Download, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { jobTitleOptions } from '../survey/surveyData'
import { validEmail } from '../survey/surveyScoring'
import {
  createQuarterlyReportDownloadIdempotencyKey,
  QuarterlyReportApiError,
  quarterlyReportApiUrl,
  requestQuarterlyReportDownload,
  type QuarterlyReportPublic,
} from './quarterlyReportsApi'
import './quarterlyReportDownloadModal.css'

type Contact = {
  email: string
  fullName: string
  phone: string
  position: string
  positionOther: string
}

type PositionMenuLayout = {
  left: number
  maxHeight: number
  top: number
  width: number
}

type QuarterlyReportDownloadModalProps = {
  onClose: () => void
  open: boolean
  report: QuarterlyReportPublic
}

const emptyContact: Contact = { email: '', fullName: '', phone: '', position: '', positionOther: '' }

function normalizePosition(contact: Contact) {
  return (contact.position === 'Khác' ? contact.positionOther : contact.position).trim()
}

function buildClientMeta() {
  return {
    action: 'quarterly_report_download',
    app: 'source4',
    path: window.location.pathname,
    referrer: document.referrer || null,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  }
}

export function QuarterlyReportDownloadModal({ onClose, open, report }: QuarterlyReportDownloadModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const fullNameRef = useRef<HTMLInputElement>(null)
  const positionPickerRef = useRef<HTMLDivElement>(null)
  const positionTriggerRef = useRef<HTMLButtonElement>(null)
  const positionMenuRef = useRef<HTMLDivElement>(null)
  const submittingRef = useRef(false)
  const attemptRef = useRef<{ key: string; payload: string } | null>(null)
  const [contact, setContact] = useState<Contact>(emptyContact)
  const [consented, setConsented] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [isPositionMenuOpen, setIsPositionMenuOpen] = useState(false)
  const [positionMenuLayout, setPositionMenuLayout] = useState<PositionMenuLayout | null>(null)

  const reportPeriod = useMemo(() => `Quý ${report.periodQuarter}/${report.periodYear}`, [report.periodQuarter, report.periodYear])

  useEffect(() => {
    if (!open) return
    setContact(emptyContact)
    setConsented(false)
    setError('')
    setIsSubmitting(false)
    setIsComplete(false)
    setIsPositionMenuOpen(false)
    setPositionMenuLayout(null)
    attemptRef.current = null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.requestAnimationFrame(() => fullNameRef.current?.focus())
    return () => { document.body.style.overflow = previousOverflow }
  }, [open, report.slug])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || submittingRef.current) return
      if (isPositionMenuOpen) {
        event.preventDefault()
        setIsPositionMenuOpen(false)
        window.requestAnimationFrame(() => positionTriggerRef.current?.focus())
        return
      }
      onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isPositionMenuOpen, onClose, open])

  useEffect(() => {
    if (!open || !isPositionMenuOpen) return
    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !positionPickerRef.current?.contains(event.target) && !positionMenuRef.current?.contains(event.target)) setIsPositionMenuOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [isPositionMenuOpen, open])

  useEffect(() => {
    if (!open || !isPositionMenuOpen) return
    const updateMenuLayout = () => {
      const trigger = positionTriggerRef.current
      if (!trigger) return
      const rect = trigger.getBoundingClientRect()
      const viewportPadding = 12
      const preferredHeight = 250
      const spaceBelow = window.innerHeight - rect.bottom - viewportPadding
      const spaceAbove = rect.top - viewportPadding
      const openUpwards = spaceBelow < 180 && spaceAbove > spaceBelow
      const availableHeight = Math.max(120, Math.min(preferredHeight, openUpwards ? spaceAbove : spaceBelow))
      setPositionMenuLayout({
        left: Math.max(viewportPadding, Math.min(rect.left, window.innerWidth - rect.width - viewportPadding)),
        maxHeight: availableHeight,
        top: openUpwards ? Math.max(viewportPadding, rect.top - availableHeight - 7) : rect.bottom + 7,
        width: Math.min(rect.width, window.innerWidth - viewportPadding * 2),
      })
    }
    updateMenuLayout()
    window.addEventListener('resize', updateMenuLayout)
    window.addEventListener('scroll', updateMenuLayout, true)
    return () => {
      window.removeEventListener('resize', updateMenuLayout)
      window.removeEventListener('scroll', updateMenuLayout, true)
    }
  }, [isPositionMenuOpen, open])

  const update = (value: Partial<Contact>) => {
    setContact((current) => ({ ...current, ...value }))
    setError('')
  }

  const selectPosition = (position: string) => {
    update({ position, positionOther: '' })
    setIsPositionMenuOpen(false)
    window.requestAnimationFrame(() => positionTriggerRef.current?.focus())
  }

  const togglePositionMenu = () => {
    setIsPositionMenuOpen((current) => !current)
  }

  const submit = async () => {
    if (isSubmitting || isComplete) return
    const position = normalizePosition(contact)
    if (!contact.fullName.trim() || !validEmail(contact.email.trim()) || !contact.phone.trim() || !position || !consented) {
      setError('Vui lòng điền đủ Họ tên, Email, Số điện thoại, Chức vụ và xác nhận đồng ý.')
      return
    }

    const payload = {
      clientMeta: buildClientMeta(),
      email: contact.email.trim().toLowerCase(),
      fullName: contact.fullName.trim().replace(/\s+/g, ' '),
      phone: contact.phone.trim(),
      position,
      privacyConsent: true as const,
    }
    const serialized = JSON.stringify(payload)
    const attempt = attemptRef.current?.payload === serialized
      ? attemptRef.current
      : { key: createQuarterlyReportDownloadIdempotencyKey(), payload: serialized }
    attemptRef.current = attempt

    submittingRef.current = true
    setIsSubmitting(true)
    setError('')
    try {
      const result = await requestQuarterlyReportDownload(report.slug, payload, attempt.key)
      setIsComplete(true)
      window.setTimeout(() => window.location.assign(quarterlyReportApiUrl(result.downloadUrl)), 220)
    } catch (requestError) {
      setError(requestError instanceof QuarterlyReportApiError || requestError instanceof Error
        ? requestError.message
        : 'Không thể xử lý yêu cầu tải báo cáo. Vui lòng thử lại.')
    } finally {
      submittingRef.current = false
      setIsSubmitting(false)
    }
  }

  if (!open || typeof document === 'undefined') return null

  return createPortal(
    <div className="quarterly-download-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget && !isSubmitting) onClose() }} role="presentation">
      <section aria-labelledby="quarterly-download-title" aria-modal="true" className="quarterly-download-modal" ref={dialogRef} role="dialog">
        <button aria-label="Đóng cửa sổ tải báo cáo" className="quarterly-download-close" disabled={isSubmitting} onClick={onClose} type="button"><X aria-hidden="true" size={20} /></button>
        <header className="quarterly-download-header">
          <p>CEO WORKFORCE INDEX</p>
          <h2 id="quarterly-download-title">Tải báo cáo {reportPeriod}</h2>
          <span>Anh/Chị vui lòng cung cấp thông tin để tải bản PDF đầy đủ.</span>
        </header>
        {isComplete ? (
          <div className="quarterly-download-success" role="status">
            <CheckCircle2 aria-hidden="true" size={34} />
            <h3>Đang chuẩn bị file tải xuống</h3>
            <p>Thông tin của Anh/Chị đã được ghi nhận.</p>
          </div>
        ) : (
          <div className="quarterly-download-content">
            <div className="quarterly-download-fields">
              <label htmlFor="quarterly-download-name"><span>Họ tên <b>*</b></span><input autoComplete="name" disabled={isSubmitting} id="quarterly-download-name" onChange={(event) => update({ fullName: event.currentTarget.value })} ref={fullNameRef} value={contact.fullName} /></label>
              <label htmlFor="quarterly-download-email"><span>Email <b>*</b></span><input autoComplete="email" disabled={isSubmitting} id="quarterly-download-email" inputMode="email" onChange={(event) => update({ email: event.currentTarget.value })} type="email" value={contact.email} /></label>
              <label htmlFor="quarterly-download-phone"><span>Số điện thoại <b>*</b></span><input autoComplete="tel" disabled={isSubmitting} id="quarterly-download-phone" inputMode="tel" onChange={(event) => update({ phone: event.currentTarget.value })} value={contact.phone} /></label>
              <div className="quarterly-download-position-field"><span id="quarterly-download-position-label">Chức vụ <b>*</b></span><div className="quarterly-download-position-picker" ref={positionPickerRef}><button aria-controls="quarterly-download-position-options" aria-expanded={isPositionMenuOpen} aria-haspopup="listbox" aria-labelledby="quarterly-download-position-label" className={contact.position ? 'has-value' : ''} disabled={isSubmitting} onClick={togglePositionMenu} ref={positionTriggerRef} type="button"><span>{contact.position || 'Chọn chức vụ'}</span><ChevronDown aria-hidden="true" size={18} /></button></div></div>
              {contact.position === 'Khác' ? <label className="quarterly-download-other-position" htmlFor="quarterly-download-other-position"><span>Chức vụ cụ thể <b>*</b></span><input disabled={isSubmitting} id="quarterly-download-other-position" onChange={(event) => update({ positionOther: event.currentTarget.value })} value={contact.positionOther} /></label> : null}
            </div>
            <label className="quarterly-download-consent" htmlFor="quarterly-download-consent"><input checked={consented} disabled={isSubmitting} id="quarterly-download-consent" onChange={(event) => { setConsented(event.currentTarget.checked); setError('') }} type="checkbox" /><span>Đồng ý để Ban tổ chức CEO Workforce Index thu thập, lưu trữ và xử lý dữ liệu cá nhân nhằm gửi báo cáo khảo sát cho Anh/Chị.</span></label>
            {error ? <p className="quarterly-download-error" role="alert">{error}</p> : null}
            <div className="quarterly-download-actions"><button className="quarterly-download-secondary" disabled={isSubmitting} onClick={onClose} type="button">Quay lại</button><button className="quarterly-download-primary" disabled={isSubmitting} onClick={() => void submit()} type="button"><span>{isSubmitting ? 'Đang xử lý' : 'Tải báo cáo'}</span><Download aria-hidden="true" size={18} /></button></div>
          </div>
        )}
      </section>
      {isPositionMenuOpen && positionMenuLayout ? createPortal(
        <div aria-labelledby="quarterly-download-position-label" className="quarterly-download-position-menu" id="quarterly-download-position-options" ref={positionMenuRef} role="listbox" style={positionMenuLayout}>{jobTitleOptions.map((option) => <button aria-selected={contact.position === option} className={contact.position === option ? 'is-selected' : ''} key={option} onClick={() => selectPosition(option)} role="option" type="button"><span>{option}</span>{contact.position === option ? <Check aria-hidden="true" size={16} /> : null}</button>)}</div>,
        document.body,
      ) : null}
    </div>,
    document.body,
  )
}
