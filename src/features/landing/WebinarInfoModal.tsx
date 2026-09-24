import { AnimatePresence, m } from 'framer-motion'
import { Check, ChevronDown, Clock3, Monitor, X } from 'lucide-react'
import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import { createPortal } from 'react-dom'
import { createWebinarRegistrationIdempotencyKey, submitWebinarRegistration } from '../survey/surveyApi'
import { jobTitleOptions } from '../survey/surveyData'
import { validEmail } from '../survey/surveyScoring'
import './webinarInfoModal.css'

type WebinarInfoModalProps = {
  onClose: () => void
  open: boolean
}

const webinarHighlights = [
  '“Độ lệch pha” CEO–CHRO qua dữ liệu khảo sát CWI',
  'Workforce Plus: Con người, AI, tự động hóa và hệ sinh thái',
  'Vai trò mới của CHRO trong kiến tạo và điều phối workforce',
  'Cách CEO và CHRO đi từ cùng hướng đến cùng nhịp trong thực thi',
] as const

const webinarGuests = [
  'Bà Trần Phương Nga – CEO Tập đoàn Thiên Long',
  'Bà Đinh Kim Nhung – Giám đốc Nhân sự Nafoods',
  'Bà Phạm Thị Mỹ Lệ – Trưởng Ban Quản trị CEO Workforce Index',
  'Khách mời bí mật',
] as const

type WebinarContact = {
  email: string
  jobTitle: string
  jobTitleOther: string
  name: string
}

const emptyContact: WebinarContact = { email: '', jobTitle: '', jobTitleOther: '', name: '' }

function getPositionIndex(position: string) {
  const index = jobTitleOptions.findIndex((option) => option === position)
  return index >= 0 ? index : 0
}

function normalizePosition(contact: WebinarContact) {
  return (contact.jobTitle === 'Khác' && contact.jobTitleOther.trim()
    ? contact.jobTitleOther
    : contact.jobTitle).trim()
}

export function WebinarInfoModal({ onClose, open }: WebinarInfoModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const nameInputRef = useRef<HTMLInputElement>(null)
  const positionControlRef = useRef<HTMLDivElement>(null)
  const positionButtonRef = useRef<HTMLButtonElement>(null)
  const [contact, setContact] = useState(emptyContact)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [registered, setRegistered] = useState(false)
  const [registeredFromExisting, setRegisteredFromExisting] = useState(false)
  const [idempotencyKey, setIdempotencyKey] = useState(() => createWebinarRegistrationIdempotencyKey())
  const [positionOpen, setPositionOpen] = useState(false)
  const [positionActiveIndex, setPositionActiveIndex] = useState(0)

  useEffect(() => {
    if (!open) return

    setContact(emptyContact)
    setError('')
    setIsSubmitting(false)
    setRegistered(false)
    setRegisteredFromExisting(false)
    setIdempotencyKey(createWebinarRegistrationIdempotencyKey())
    setPositionOpen(false)
    setPositionActiveIndex(0)
  }, [open])

  useEffect(() => {
    if (!open) return

    const previousFocus = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
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

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)
    window.requestAnimationFrame(() => nameInputRef.current?.focus())

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
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

  const selectPosition = (option: string) => {
    setContact((current) => ({ ...current, jobTitle: option }))
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

  const register = async () => {
    if (isSubmitting || registered) return
    if (!contact.name.trim() || !validEmail(contact.email.trim()) || !contact.jobTitle || (contact.jobTitle === 'Khác' && !contact.jobTitleOther.trim())) {
      setError('Vui lòng điền Họ tên, Email hợp lệ và Chức vụ để đăng ký Webinar.')
      return
    }

    setIsSubmitting(true)
    setError('')
    try {
      const result = await submitWebinarRegistration(
        {
          clientMeta: {
            action: 'landing_webinar_registration',
            app: 'source4',
            language: navigator.language,
            path: window.location.pathname,
            referrer: document.referrer || null,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            userAgent: navigator.userAgent,
          },
          email: contact.email.trim().toLowerCase(),
          fullName: contact.name.trim().replace(/\s+/g, ' '),
          position: normalizePosition(contact),
        },
        idempotencyKey,
      )
      setRegisteredFromExisting(result.deduplicated)
      setRegistered(true)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Không thể đăng ký Webinar. Vui lòng thử lại.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {open ? (
        <m.div
          animate={{ opacity: 1 }}
          className="webinar-info-modal-backdrop"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}
          role="presentation"
        >
          <m.section
            animate={{ opacity: 1, scale: 1, y: 0 }}
            aria-describedby="webinar-info-modal-description"
            aria-labelledby="webinar-info-modal-title"
            aria-modal="true"
            className="webinar-info-modal"
            exit={{ opacity: 0, scale: .98, y: 18 }}
            initial={{ opacity: 0, scale: .98, y: 18 }}
            ref={dialogRef}
            role="dialog"
            tabIndex={-1}
            transition={{ duration: .22, ease: [0.22, 1, 0.36, 1] }}
          >
            <div aria-hidden="true" className="webinar-info-modal-topline" />
            <button aria-label="Đóng thông tin webinar" className="webinar-info-modal-close" onClick={onClose} type="button">
              <X aria-hidden="true" size={20} strokeWidth={2} />
            </button>

            <header className="webinar-info-modal-header">
              <p>WEBINAR CEO WORKFORCE INDEX</p>
              <h2 id="webinar-info-modal-title">Webinar: Làm sao để CEO và HRD hết lệch pha và không lỗi nhịp?</h2>
            </header>

            <div className="webinar-info-modal-content" id="webinar-info-modal-description">
              <section className="webinar-info-modal-section">
                <h3>Nội dung nổi bật</h3>
                <ul className="webinar-info-modal-highlight-list">
                  {webinarHighlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
                </ul>
              </section>

              <section className="webinar-info-modal-section">
                <h3>Khách mời</h3>
                <ul className="webinar-info-modal-guest-list">
                  {webinarGuests.map((guest) => <li key={guest}>{guest}</li>)}
                </ul>
              </section>

              <div className="webinar-info-modal-meta" aria-label="Thông tin thời gian và hình thức">
                <div><Clock3 aria-hidden="true" size={19} /><span><strong>Thời gian</strong>14:00–16:00 | 22/10/2026</span></div>
                <div><Monitor aria-hidden="true" size={19} /><span><strong>Hình thức</strong>Trực tuyến qua Zoom</span></div>
              </div>

              <section aria-label="Đăng ký tham dự Webinar" className="webinar-info-modal-registration">
                <div className="webinar-info-modal-registration-copy">
                  <h3>Đăng ký tham dự</h3>
                  <p>Thông tin của Anh/Chị được dùng để xác nhận đăng ký Webinar.</p>
                </div>
                <div className="webinar-info-modal-form">
                  <label htmlFor="landing-webinar-name">
                    <span>Họ tên <b>*</b></span>
                    <input
                      autoComplete="name"
                      disabled={registered || isSubmitting}
                      id="landing-webinar-name"
                      ref={nameInputRef}
                      onChange={(event) => {
                        const name = event.currentTarget.value
                        setContact((current) => ({ ...current, name }))
                        setError('')
                      }}
                      placeholder="Nhập họ tên"
                      value={contact.name}
                    />
                  </label>
                  <label htmlFor="landing-webinar-email">
                    <span>Email công ty cá nhân <b>*</b></span>
                    <input
                      autoComplete="email"
                      disabled={registered || isSubmitting}
                      id="landing-webinar-email"
                      inputMode="email"
                      onChange={(event) => {
                        const email = event.currentTarget.value
                        setContact((current) => ({ ...current, email }))
                        setError('')
                      }}
                      placeholder="name@company.com"
                      type="email"
                      value={contact.email}
                    />
                  </label>
                  <div className={`webinar-info-modal-position-field${positionOpen ? ' is-open' : ''}`}>
                    <span id="landing-webinar-position-label">Chức vụ <b>*</b></span>
                    <div className="webinar-info-modal-position-control" ref={positionControlRef}>
                      <button
                        aria-activedescendant={positionOpen ? `landing-webinar-position-option-${positionActiveIndex}` : undefined}
                        aria-controls="landing-webinar-position-options"
                        aria-expanded={positionOpen}
                        aria-haspopup="listbox"
                        aria-labelledby="landing-webinar-position-label"
                        className={`webinar-info-modal-position-trigger${positionOpen ? ' is-open' : ''}`}
                        disabled={registered || isSubmitting}
                        id="landing-webinar-position"
                        onClick={() => {
                          setPositionActiveIndex(getPositionIndex(contact.jobTitle))
                          setPositionOpen((isOpen) => !isOpen)
                        }}
                        onKeyDown={handlePositionKeyDown}
                        ref={positionButtonRef}
                        type="button"
                      >
                        <span className={contact.jobTitle ? '' : 'is-placeholder'}>{contact.jobTitle || 'Chọn chức vụ'}</span>
                        <ChevronDown aria-hidden="true" className={`webinar-info-modal-position-icon${positionOpen ? ' is-open' : ''}`} size={18} />
                      </button>
                      {positionOpen ? (
                        <div aria-labelledby="landing-webinar-position-label" className="webinar-info-modal-position-menu" id="landing-webinar-position-options" role="listbox">
                          {jobTitleOptions.map((option, index) => (
                            <button
                              aria-selected={contact.jobTitle === option}
                              className={`webinar-info-modal-position-option${positionActiveIndex === index ? ' is-active' : ''}`}
                              id={`landing-webinar-position-option-${index}`}
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
                  {contact.jobTitle === 'Khác' ? (
                    <label htmlFor="landing-webinar-other-position">
                      <span>Chức vụ cụ thể <b>*</b></span>
                      <input
                        disabled={registered || isSubmitting}
                        id="landing-webinar-other-position"
                        onChange={(event) => {
                          const jobTitleOther = event.currentTarget.value
                          setContact((current) => ({ ...current, jobTitleOther }))
                          setError('')
                        }}
                        placeholder="Nhập chức vụ"
                        value={contact.jobTitleOther}
                      />
                    </label>
                  ) : null}
                  {error || registered ? (
                    <div aria-live="polite" className="webinar-info-modal-registration-status">
                      {error ? <p className="is-error" role="alert">{error}</p> : null}
                      {registered ? <p className="is-success">{registeredFromExisting ? 'Email này đã được đăng ký tham dự Webinar.' : 'Đăng ký Webinar của Anh/Chị đã được ghi nhận.'}</p> : null}
                    </div>
                  ) : null}
                </div>
              </section>
            </div>

            <footer className="webinar-info-modal-footer">
              <button className="webinar-info-modal-register webinar-info-modal-register--footer" disabled={registered || isSubmitting} onClick={() => { void register() }} type="button">
                {registered ? 'Đã đăng ký' : isSubmitting ? 'Đang đăng ký...' : 'Đăng ký tham dự'}
              </button>
              <button className="webinar-info-modal-dismiss" onClick={onClose} type="button">Đóng</button>
            </footer>
          </m.section>
        </m.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  )
}
