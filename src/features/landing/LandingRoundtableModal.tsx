import { AnimatePresence, m } from 'framer-motion'
import { CalendarDays, Check, CheckCircle2, ChevronDown, LoaderCircle, UsersRound, X } from 'lucide-react'
import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import { figmaAssets } from './figmaAssets'
import { roundtableCopy } from '../survey/surveyData'
import { createRoundtableRegistrationIdempotencyKey, submitRoundtableRegistration, SurveyApiError } from '../survey/surveyApi'
import { jobTitleOptions } from '../survey/surveyData'
import { validEmail } from '../survey/surveyScoring'
import type { ContactState } from '../survey/surveyPersistence'
import './roundtableModal.css'

const emptyContact: ContactState = { email: '', name: '', jobTitle: '', jobTitleOther: '' }

function getPositionIndex(position: string) {
  const index = jobTitleOptions.findIndex((option) => option === position)
  return index >= 0 ? index : 0
}

function normalizePosition(contact: ContactState) {
  const position = contact.jobTitle === 'Khác' && contact.jobTitleOther.trim() ? contact.jobTitleOther : contact.jobTitle
  return position.trim()
}

function clientMeta() {
  return {
    action: 'landing_roundtable_registration',
    app: 'source4',
    language: navigator.language,
    path: window.location.pathname,
    referrer: document.referrer || null,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    userAgent: navigator.userAgent,
  }
}

function validateContact(contact: ContactState) {
  if (!contact.name.trim()) return 'Vui lòng nhập Họ tên.'
  if (!validEmail(contact.email.trim())) return 'Vui lòng nhập Email hợp lệ.'
  if (!contact.jobTitle.trim()) return 'Vui lòng chọn Chức vụ.'
  if (contact.jobTitle === 'Khác' && !contact.jobTitleOther.trim()) return 'Vui lòng nhập Chức vụ khác.'
  return ''
}

type LandingRoundtableModalProps = {
  onClose: () => void
  open: boolean
}

export function LandingRoundtableModal({ onClose, open }: LandingRoundtableModalProps) {
  const [contact, setContact] = useState<ContactState>(emptyContact)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [positionOpen, setPositionOpen] = useState(false)
  const [positionActiveIndex, setPositionActiveIndex] = useState(0)
  const dialogRef = useRef<HTMLDivElement>(null)
  const nameInputRef = useRef<HTMLInputElement>(null)
  const positionControlRef = useRef<HTMLDivElement>(null)
  const positionButtonRef = useRef<HTMLButtonElement>(null)
  const submittingRef = useRef(false)
  const attemptRef = useRef<{ payload: string; key: string } | null>(null)

  useEffect(() => {
    if (!open) return

    setContact(emptyContact)
    setError('')
    setCompleted(false)
    setPositionOpen(false)
    setPositionActiveIndex(0)
    attemptRef.current = null
    const previousOverflow = document.body.style.overflow
    const previousFocus = document.activeElement as HTMLElement | null
    document.body.style.overflow = 'hidden'
    window.requestAnimationFrame(() => nameInputRef.current?.focus())

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        if (!submittingRef.current) onClose()
        return
      }
      if (event.key !== 'Tab' || !dialogRef.current) return
      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>('button, input, select, [href], [tabindex]:not([tabindex="-1"])'))
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
      window.requestAnimationFrame(() => previousFocus?.focus())
    }
  }, [onClose, open])

  useEffect(() => {
    if (!positionOpen) return

    const closeWhenOutside = (event: PointerEvent | FocusEvent) => {
      if (!positionControlRef.current?.contains(event.target as Node)) setPositionOpen(false)
    }

    window.addEventListener('pointerdown', closeWhenOutside)
    window.addEventListener('focusin', closeWhenOutside)
    return () => {
      window.removeEventListener('pointerdown', closeWhenOutside)
      window.removeEventListener('focusin', closeWhenOutside)
    }
  }, [positionOpen])

  const close = () => {
    if (submittingRef.current) return
    onClose()
  }

  const selectPosition = (option: string) => {
    setContact({ ...contact, jobTitle: option })
    setError('')
    setPositionOpen(false)
    window.requestAnimationFrame(() => positionButtonRef.current?.focus())
  }

  const handlePositionKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      if (!positionOpen) {
        setPositionActiveIndex(getPositionIndex(contact.jobTitle))
        setPositionOpen(true)
        return
      }
      const direction = event.key === 'ArrowDown' ? 1 : -1
      setPositionActiveIndex((current) => (current + direction + jobTitleOptions.length) % jobTitleOptions.length)
      return
    }
    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault()
      setPositionActiveIndex(event.key === 'Home' ? 0 : jobTitleOptions.length - 1)
      setPositionOpen(true)
      return
    }
    if (event.key === 'Escape') {
      if (!positionOpen) return
      event.preventDefault()
      setPositionOpen(false)
      return
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      if (positionOpen) selectPosition(jobTitleOptions[positionActiveIndex])
      else {
        setPositionActiveIndex(getPositionIndex(contact.jobTitle))
        setPositionOpen(true)
      }
    }
  }

  const submit = async () => {
    if (submitting || completed) return

    const validationError = validateContact(contact)
    if (validationError) {
      setError(validationError)
      return
    }

    const payload = {
      clientMeta: clientMeta(),
      email: contact.email.trim().toLowerCase(),
      fullName: contact.name.trim().replace(/\s+/g, ' '),
      position: normalizePosition(contact),
    }
    const serializedPayload = JSON.stringify(payload)
    const attempt = attemptRef.current?.payload === serializedPayload
      ? attemptRef.current
      : { key: createRoundtableRegistrationIdempotencyKey(), payload: serializedPayload }
    attemptRef.current = attempt

    submittingRef.current = true
    setSubmitting(true)
    setError('')
    try {
      await submitRoundtableRegistration(payload, attempt.key)
      setCompleted(true)
    } catch (submitError) {
      setError(submitError instanceof SurveyApiError || submitError instanceof Error
        ? submitError.message
        : 'Không thể gửi đăng ký. Vui lòng thử lại.')
    } finally {
      submittingRef.current = false
      setSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {open ? (
        <m.div
          animate={{ opacity: 1 }}
          className="landing-roundtable-modal-backdrop"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          onMouseDown={(event) => { if (event.target === event.currentTarget) close() }}
          role="presentation"
        >
          <m.div
            animate={{ opacity: 1, scale: 1, y: 0 }}
            aria-labelledby="landing-roundtable-title"
            aria-modal="true"
            className="landing-roundtable-modal"
            exit={{ opacity: 0, scale: 0.98, y: 18 }}
            initial={{ opacity: 0, scale: 0.98, y: 18 }}
            ref={dialogRef}
            role="dialog"
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="landing-roundtable-modal-topline" />
            <button aria-label="Đóng cửa sổ" className="landing-roundtable-modal-close" disabled={submitting} onClick={close} type="button">
              <X aria-hidden="true" size={19} />
            </button>
            {completed ? (
              <div className="landing-roundtable-modal-success">
                <div className="landing-roundtable-modal-success-icon"><CheckCircle2 aria-hidden="true" size={34} /></div>
                <p className="landing-roundtable-modal-kicker">ĐĂNG KÝ THÀNH CÔNG</p>
                <h2 id="landing-roundtable-title">Hẹn gặp Anh/Chị tại CEO Roundtable</h2>
                <p>Thông tin đăng ký của Anh/Chị đã được ghi nhận. Ban Tổ chức sẽ gửi thư xác nhận khi có đầy đủ thông tin chương trình.</p>
                <button className="landing-roundtable-modal-primary" onClick={close} type="button">Đóng</button>
              </div>
            ) : (
              <>
                <div className="landing-roundtable-modal-header">
                  <img alt="CEO Workforce Index" className="landing-roundtable-modal-logo" src={figmaAssets.footerLogo} />
                  <h2 id="landing-roundtable-title">{roundtableCopy.title}</h2>
                  <p className="landing-roundtable-modal-lead">Khai mở góc nhìn, kết nối lãnh đạo và cùng kiến tạo năng lực tăng trưởng.</p>
                </div>
                <div className="landing-roundtable-modal-details">
                  <div><CalendarDays aria-hidden="true" size={17} /><span>{roundtableCopy.meta[0]}</span></div>
                  <div><UsersRound aria-hidden="true" size={17} /><span>{roundtableCopy.meta[1]}</span></div>
                </div>
                <div className="landing-roundtable-modal-form">
                  <label htmlFor="landing-roundtable-name"><span>Họ tên <b>*</b></span><input ref={nameInputRef} autoComplete="name" id="landing-roundtable-name" onChange={(event) => { setContact({ ...contact, name: event.currentTarget.value }); setError('') }} placeholder="Nguyễn Văn An" value={contact.name} /></label>
                  <label htmlFor="landing-roundtable-email"><span>Email <b>*</b></span><input autoComplete="email" id="landing-roundtable-email" inputMode="email" onChange={(event) => { setContact({ ...contact, email: event.currentTarget.value }); setError('') }} placeholder="name@company.com" type="email" value={contact.email} /></label>
                  <div className={`landing-roundtable-modal-position-field${positionOpen ? ' is-open' : ''}`}>
                    <span id="landing-roundtable-position-label">Chức vụ <b>*</b></span>
                    <div className="landing-roundtable-modal-position-control" ref={positionControlRef}>
                      <button
                        aria-activedescendant={positionOpen ? `landing-roundtable-position-option-${positionActiveIndex}` : undefined}
                        aria-controls="landing-roundtable-position-options"
                        aria-expanded={positionOpen}
                        aria-haspopup="listbox"
                        aria-labelledby="landing-roundtable-position-label"
                        className={`landing-roundtable-modal-position-trigger${positionOpen ? ' is-open' : ''}`}
                        id="landing-roundtable-position"
                        onClick={() => {
                          setPositionActiveIndex(getPositionIndex(contact.jobTitle))
                          setPositionOpen((isOpen) => !isOpen)
                        }}
                        onKeyDown={handlePositionKeyDown}
                        ref={positionButtonRef}
                        type="button"
                      >
                        <span className={contact.jobTitle ? '' : 'is-placeholder'}>{contact.jobTitle || 'Chọn chức vụ'}</span>
                        <ChevronDown aria-hidden="true" className={`landing-roundtable-modal-position-icon${positionOpen ? ' is-open' : ''}`} size={18} />
                      </button>
                      {positionOpen ? (
                        <div aria-labelledby="landing-roundtable-position-label" className="landing-roundtable-modal-position-menu" id="landing-roundtable-position-options" role="listbox">
                          {jobTitleOptions.map((option, index) => (
                            <button
                              aria-selected={contact.jobTitle === option}
                              className={`landing-roundtable-modal-position-option${positionActiveIndex === index ? ' is-active' : ''}`}
                              id={`landing-roundtable-position-option-${index}`}
                              key={option}
                              onClick={() => selectPosition(option)}
                              onMouseEnter={() => setPositionActiveIndex(index)}
                              role="option"
                              type="button"
                            >
                              <span>{option}</span>
                              {contact.jobTitle === option ? <Check aria-hidden="true" size={16} /> : null}
                            </button>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  {contact.jobTitle === 'Khác' ? <label htmlFor="landing-roundtable-other-position"><span>Chức vụ cụ thể <b>*</b></span><input id="landing-roundtable-other-position" onChange={(event) => { setContact({ ...contact, jobTitleOther: event.currentTarget.value }); setError('') }} placeholder="Nhập chức vụ" value={contact.jobTitleOther} /></label> : null}
                </div>
                {error ? <p className="landing-roundtable-modal-error" role="alert">{error}</p> : null}
                <div className="landing-roundtable-modal-actions">
                  <button className="landing-roundtable-modal-secondary" disabled={submitting} onClick={close} type="button">Để sau</button>
                  <button className="landing-roundtable-modal-primary" disabled={submitting} onClick={submit} type="button">
                    {submitting ? <><LoaderCircle aria-hidden="true" className="landing-roundtable-modal-spinner" size={17} /> Đang gửi...</> : 'Đăng ký tham dự'}
                  </button>
                </div>
              </>
            )}
          </m.div>
        </m.div>
      ) : null}
    </AnimatePresence>
  )
}
