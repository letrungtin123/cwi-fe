import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronDown, ChevronLeft, ChevronRight, CircleAlert, LockKeyhole, MailCheck, Maximize2, Minimize2, X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { t, tx } from '@/i18n'
import { contactCopy, introCopy, jobTitleOptions, partOneQuestions, partTwoQuestions, reportParts, roundtableCopy } from './surveyData'
import { getAnswerDisplay, type Answers, validEmail } from './surveyScoring'
import { isValidPhone } from './phoneValidation'
import { SurveyBrandMark, SurveyEyebrow, SurveyForwardArrow } from './SurveyChrome'
import type { ReportEmailStatus, ReportJobStatusValue } from './surveyApi'
import { useRoundtableEventDetails } from './useRoundtableEvent'
import reportCarouselFallback from '@/assets/figma/carousel-baocaoquy3.webp'
import roundtableCarouselFallback from '@/assets/figma/carousel-dauanbantron.webp'
import webinarCarouselFallback from '@/assets/figma/carousel-webinar.webp'
import { useDialogKeyboard } from '@/lib/useDialogKeyboard'

type ContactState = { companyName: string; email: string; name: string; phone: string; jobTitle: string; jobTitleOther: string }
type ConsentChoice = 'yes' | 'no' | ''

type IntroScreenProps = {
  onStart: () => void
}

export function IntroScreen({ onStart }: IntroScreenProps) {
  return (
    <section className="survey-intro-screen">

      <div className="survey-intro-copy">
        <SurveyEyebrow>{t(introCopy.eyebrow)}</SurveyEyebrow>
        <h1>
          <span>{t(introCopy.title)}</span>
          <span>{t(introCopy.emphasis)}</span>
        </h1>
        <div className="survey-intro-paragraphs">
          {introCopy.paragraphs.slice(0, 3).map((paragraph) => <p key={paragraph}>{t(paragraph)}</p>)}
        </div>
      </div>
      <div className="survey-report-box" aria-label={t('Các phần của báo cáo')}>
        {reportParts.map((part) => (
          <article key={part.kicker}>
            <small>{t(part.kicker)}</small>
            <div>
              <strong>{t(part.title)}</strong>
              <ul>
                {part.bullets.map((bullet) => <li key={bullet}>{t(bullet)}</li>)}
              </ul>
            </div>
          </article>
        ))}
      </div>
      <p className="survey-intro-last">{t(introCopy.paragraphs[3])}</p>
      <div className="survey-intro-actions">
        <button className="survey-primary-button survey-primary-button--hero" onClick={onStart} type="button">
          <span>{t('Bắt đầu khảo sát')}</span>
          <SurveyForwardArrow />
        </button>
      </div>
    </section>
  )
}

function JobTitleSelect({ onChange, value }: { onChange: (value: string) => void; value: string }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([])
  const options = ['', ...jobTitleOptions]
  const selectedIndex = Math.max(0, options.findIndex((option) => option === value))

  useEffect(() => {
    if (!open) return

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setOpen(false)
        triggerRef.current?.focus()
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  const focusOption = (index: number) => {
    window.requestAnimationFrame(() => optionRefs.current[index]?.focus())
  }

  const chooseOption = (option: string) => {
    onChange(option)
    setOpen(false)
    window.requestAnimationFrame(() => triggerRef.current?.focus())
  }

  const handleTriggerKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      setOpen(true)
      focusOption(selectedIndex)
    }
  }

  const handleOptionKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      focusOption((index + 1) % options.length)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      focusOption((index - 1 + options.length) % options.length)
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      chooseOption(options[index])
    }
  }

  return (
    <div className="survey-job-title-select" ref={rootRef}>
      <button
        aria-controls="survey-job-title-options"
        aria-expanded={open}
        aria-haspopup="listbox"
        className={cn('survey-job-title-trigger', !value && 'is-placeholder', open && 'is-open')}
        id="survey-contact-title"
        onClick={() => setOpen((current) => !current)}
        onKeyDown={handleTriggerKeyDown}
        ref={triggerRef}
        type="button"
      >
        <span>{value ? t(value) : t('Chọn chức vụ')}</span>
        <ChevronDown aria-hidden="true" size={18} />
      </button>
      {open ? (
        <div aria-label={t('Chọn chức vụ')} className="survey-job-title-menu" id="survey-job-title-options" role="listbox">
          {options.map((option, index) => (
            <button
              aria-selected={value === option}
              className={cn('survey-job-title-option', value === option && option && 'is-selected', !option && 'is-placeholder')}
              key={option}
              onClick={() => chooseOption(option)}
              onKeyDown={(event) => handleOptionKeyDown(event, index)}
              ref={(element) => { optionRefs.current[index] = element }}
              role="option"
              type="button"
            >
              <span>{option ? t(option) : t('Chọn chức vụ')}</span>
              {value === option ? <Check aria-hidden="true" size={16} /> : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
type ContactScreenProps = {
  consent: ConsentChoice
  dataCollectionConsent?: boolean
  contact: ContactState
  error?: string
  mode: 'part1' | 'private'
  onBack: () => void
  onConsentChange: (value: ConsentChoice) => void
  onDataCollectionConsentChange?: (value: boolean) => void
  onContactChange: (next: ContactState) => void
  onSkipPrivate: () => void
  onSubmit: () => void
}

function getContactRequirementMessage(contact: ContactState) {
  const requirements: string[] = []
  const email = contact.email.trim()

  if (!contact.name.trim()) requirements.push(t('Họ tên'))
  if (!email) {
    requirements.push('Email')
  } else if (!validEmail(email)) {
    requirements.push(t('Email hợp lệ'))
  }
  if (!contact.phone.trim()) {
    requirements.push(t('Số điện thoại'))
  } else if (!isValidPhone(contact.phone)) {
    requirements.push(t('Số điện thoại hợp lệ'))
  }
  if (!contact.jobTitle.trim()) requirements.push(t('Chức vụ'))
  if (!contact.companyName.trim()) requirements.push(t('Tên công ty'))

  return requirements.length ? t('*Vui lòng bổ sung: {list}.', { list: requirements.join(', ') }) : ''
}

export function ContactScreen({ consent, contact, dataCollectionConsent = false, error, mode, onBack, onConsentChange, onDataCollectionConsentChange, onContactChange, onSkipPrivate, onSubmit }: ContactScreenProps) {
  const isPrivate = mode === 'private'
  const selectedTitle = contact.jobTitle.trim()
  const isContactReady = Boolean(contact.name.trim() && validEmail(contact.email.trim()) && isValidPhone(contact.phone) && selectedTitle && contact.companyName.trim())
  const isSubmitDisabled = !isContactReady || (!isPrivate && !dataCollectionConsent) || (isPrivate && consent === 'no')
  const privacyParagraphs = isPrivate ? contactCopy.privatePrivacy : [contactCopy.anonymousPrivacy]
  const contactRequirementMessage = getContactRequirementMessage(contact)

  return (
    <section className="survey-form-screen" aria-labelledby="survey-contact-title">
      <SurveyEyebrow>{isPrivate ? t('\u0050\u0048\u1ea6\u004e 2 - \u004b\u0048\u1ea2\u004f S\u00c1T \u0110\u1eca\u004e\u0048 \u0044\u0041\u004e\u0048 \u00b7 \u004e\u0068\u1ead\u006e \u0062\u00e1o c\u00e1o') : t('\u0050\u0048\u1ea6\u004e 1 - \u004b\u0048\u1ea2\u004f S\u00c1T \u004b\u0048\u0055\u0059\u1ebe\u0054 \u0044\u0041\u004e\u0048 \u00b7 \u004e\u0068\u1ead\u006e \u0062\u00e1o c\u00e1o')}</SurveyEyebrow>
      <h1 id="survey-contact-title">{isPrivate ? t('\u004e\u0068\u1ead\u006e B\u00e1o c\u00e1o Ri\u00eang t\u01b0') : t('\u004e\u0068\u1ead\u006e B\u00e1o c\u00e1o Khuy\u1ebft danh')}</h1>
      <p className="survey-thankyou">{t(contactCopy.thankYou)}</p>

      <form
        className="survey-contact-form"
        onSubmit={(event) => {
          event.preventDefault()
          onSubmit()
        }}
      >
        <div className="survey-form-grid">
          <label htmlFor="survey-contact-name">
            <span>{t('Họ tên')} <b className="survey-required-mark">*</b></span>
            <input autoComplete="name" id="survey-contact-name" onChange={(event) => onContactChange({ ...contact, name: event.currentTarget.value })} placeholder={t('Họ và tên')} value={contact.name} />
          </label>
          <label htmlFor="survey-contact-email">
            <span>Email <b className="survey-required-mark">*</b></span>
            <input autoComplete="email" id="survey-contact-email" onChange={(event) => onContactChange({ ...contact, email: event.currentTarget.value })} placeholder="name@company.com" inputMode="email" type="text" value={contact.email} />
          </label>
          <label htmlFor="survey-contact-title">
            <span>{t('Chức vụ')} <b className="survey-required-mark">*</b></span>
            <JobTitleSelect
              onChange={(value) => onContactChange({ ...contact, jobTitle: value, jobTitleOther: '' })}
              value={contact.jobTitle}
            />
          </label>
          <label htmlFor="survey-contact-phone">
            <span>{t('Số điện thoại')} <b className="survey-required-mark">*</b></span>
            <input autoComplete="tel" id="survey-contact-phone" inputMode="tel" onChange={(event) => onContactChange({ ...contact, phone: event.currentTarget.value })} placeholder="+84" type="tel" value={contact.phone} />
          </label>
          <label className="survey-form-grid-wide" htmlFor="survey-contact-company">
            <span>{t('Tên công ty')} <b className="survey-required-mark">*</b></span>
            <input autoComplete="organization" id="survey-contact-company" maxLength={200} onChange={(event) => onContactChange({ ...contact, companyName: event.currentTarget.value })} placeholder={t('Tên công ty')} value={contact.companyName} />
          </label>
        </div>
        {!isPrivate ? (
          <div className={cn('survey-data-consent', dataCollectionConsent && 'is-checked')}>
            <input
              aria-required="true"
              checked={dataCollectionConsent}
              className="survey-data-consent-input"
              id="survey-data-consent"
              onChange={(event) => onDataCollectionConsentChange?.(event.currentTarget.checked)}
              type="checkbox"
            />
            <label htmlFor="survey-data-consent">
              <span aria-hidden="true" className="survey-data-consent-box">
                {dataCollectionConsent ? <Check aria-hidden="true" size={14} strokeWidth={2.5} /> : null}
              </span>
              <span className="survey-data-consent-copy">{t('Đồng ý cho dự án CEO Workforce Index thu thập, lưu trữ, xử lý dữ liệu cá nhân và gửi báo cáo khảo sát')}</span>
            </label>
          </div>
        ) : null}
        {contactRequirementMessage && !error ? (
          <p className="survey-contact-required" role="status"><CircleAlert aria-hidden="true" size={15} /><span>{contactRequirementMessage}</span></p>
        ) : null}

        {isPrivate ? (
          <section className="survey-privacy-section" aria-labelledby="survey-privacy-title">
            <div className="survey-privacy-heading">
              <LockKeyhole aria-hidden="true" size={18} />
              <h2 id="survey-privacy-title">{t('THÔNG TIN BẢO MẬT')}</h2>
            </div>
            <div className="survey-privacy-copy">
              {privacyParagraphs.map((paragraph) => <p key={paragraph}>{t(paragraph)}</p>)}
            </div>
            <div aria-disabled={!isContactReady} className="survey-consent-grid" role="radiogroup" aria-label={t('Đồng ý')}>
              <ConsentOption checked={consent === 'yes'} disabled={!isContactReady} id="survey-consent-yes" label={t('Đồng ý')} onChange={() => onConsentChange('yes')} />
              <ConsentOption checked={consent === 'no'} disabled={!isContactReady} id="survey-consent-no" label={t('Không đồng ý')} onChange={() => onConsentChange('no')} />
            </div>
            {consent === 'no' ? (
              <div className="survey-consent-warning" role="alert">
                <p>{t('Để nhận được báo cáo vui lòng chọn "Đồng ý" để cấp quyền cho chúng tôi xử lý dữ liệu của Anh/Chị.')}</p>
                <button className="survey-text-button" onClick={onSkipPrivate} type="button">{t('Bỏ qua Phần 2 và nhận báo cáo Phần 1')}</button>
              </div>
            ) : null}
          </section>
        ) : null}

        {error ? <p className="survey-inline-error" role="alert">{error}</p> : null}
        <div className="survey-form-actions">
          <button className="survey-primary-button" disabled={isSubmitDisabled} type="submit">
            {isPrivate ? t('\u0047\u1eedi \u006b\u1ebft qu\u1ea3') : t('\u0047\u1eedi \u006b\u1ebft qu\u1ea3 Ph\u1ea7n 1')}
            <SurveyForwardArrow />
          </button>
          <button className="survey-outline-button" onClick={onBack} type="button">{t('Xem lại câu trả lời')}</button>
        </div>
      </form>
    </section>
  )
}

function ConsentOption({ checked, disabled, id, label, name = 'survey-consent', onChange }: { checked: boolean; disabled: boolean; id: string; label: string; name?: string; onChange: () => void }) {
  return (
    <div className={cn('survey-consent-option', checked && 'is-selected', disabled && 'is-disabled')}>
      <input checked={checked} disabled={disabled} id={id} name={name} onChange={onChange} type="radio" />
      <label htmlFor={id}>
        <span className="survey-consent-radio" aria-hidden="true" />
        {label}
      </label>
    </div>
  )
}

export function LoadingScreen({ reportMode, step }: { reportMode: 'part1' | 'private'; step: number }) {
  const steps = ['Tổng hợp câu trả lời', 'Đối chiếu dữ liệu', 'Phân tích các nhóm năng lực', 'Tạo báo cáo']
  const title = reportMode === 'private' ? t('Đang tạo Báo cáo Riêng tư...') : t('Đang tạo Báo cáo Khuyết danh...')
  const description = reportMode === 'private'
    ? t('Tổng hợp kết quả PHẦN 1 - KHẢO SÁT KHUYẾT DANH và 6 câu PHẦN 2 - KHẢO SÁT ĐỊNH DANH.')
    : t('Tổng hợp 18 câu PHẦN 1 - KHẢO SÁT KHUYẾT DANH.')

  return (
    <section className="survey-loading-screen" aria-live="polite">
      <SurveyBrandMark decorative variant="trust" />
      <h1>{title}</h1>
      <p>{description}</p>
      <div className="survey-loading-line" aria-hidden="true"><i style={{ width: Math.min(step, 4) * 25 + '%' }} /></div>
      <div className="survey-loading-steps">
        {steps.map((item, index) => (
          <span className={cn(index + 1 <= step && 'is-done')} key={item}>
            <i>{index + 1 <= step ? '✓' : index + 1}</i>
            {t(item)}
          </span>
        ))}
      </div>
    </section>
  )
}

type ReportScreenProps = {
  emailStatus: ReportEmailStatus
  html: string
  mode: 'part1' | 'private'
  onHome: () => void
  onReviewAnswers: () => void
}

export function ReportScreen({ emailStatus, html, mode, onHome, onReviewAnswers }: ReportScreenProps) {
  const previewHtml = useMemo(() => prepareReportPreviewHtml(html), [html])
  const frameRef = useRef<HTMLDivElement>(null)
  const [nativeFullscreen, setNativeFullscreen] = useState(false)
  const [fallbackFullscreen, setFallbackFullscreen] = useState(false)

  useEffect(() => {
    const handleFullscreenChange = () => {
      setNativeFullscreen(document.fullscreenElement === frameRef.current)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  const isFullscreen = nativeFullscreen || fallbackFullscreen

  useEffect(() => {
    if (!isFullscreen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isFullscreen])

  const toggleFullscreen = async () => {
    if (nativeFullscreen) {
      await document.exitFullscreen().catch(() => undefined)
      return
    }

    if (fallbackFullscreen) {
      setFallbackFullscreen(false)
      return
    }

    try {
      if (document.fullscreenEnabled && frameRef.current) {
        await frameRef.current.requestFullscreen()
        return
      }
    } catch {
      // Some mobile browsers expose the API but reject it for embedded documents.
    }

    setFallbackFullscreen(true)
  }

  if (!previewHtml) {
    return <LoadingScreen reportMode={mode} step={4} />
  }

  return (
    <section aria-labelledby="survey-report-page-title" className="survey-report-page">
      <div className="survey-report-page-heading">
        <div>
          <SurveyEyebrow>{t('BÁO CÁO KHẢO SÁT')}</SurveyEyebrow>
          <h1 id="survey-report-page-title">{t('Báo cáo của Anh/Chị')}</h1>
          <p>{t('Báo cáo đã sẵn sàng. Anh/Chị có thể xem đầy đủ nội dung ngay trên trang này.')}</p>
        </div>
        <div aria-live="polite" className="survey-report-page-status">
          <span aria-hidden="true" className="survey-submission-delivery-dot" />
          {reportEmailLabel(emailStatus)}
        </div>
      </div>
      <div className={cn('survey-report-page-frame', isFullscreen && 'is-expanded')} ref={frameRef}>
        <div className="survey-report-page-frame-toolbar">
          <span>{isFullscreen ? t('Đang xem toàn màn hình') : t('Báo cáo khảo sát')}</span>
          <button
            aria-label={isFullscreen ? tx('reportFullscreen', 'Thu nhỏ báo cáo') : t('Phóng to báo cáo toàn màn hình')}
            aria-pressed={isFullscreen}
            className="survey-report-page-fullscreen-button"
            onClick={() => void toggleFullscreen()}
            title={isFullscreen ? tx('reportFullscreen', 'Thu nhỏ báo cáo') : t('Phóng to báo cáo toàn màn hình')}
            type="button"
          >
            {isFullscreen ? <Minimize2 aria-hidden="true" size={17} /> : <Maximize2 aria-hidden="true" size={17} />}
            <span>{isFullscreen ? t('Thu nhỏ') : t('Toàn màn hình')}</span>
          </button>
        </div>
        <iframe loading="eager" referrerPolicy="no-referrer" sandbox="allow-same-origin" srcDoc={previewHtml} title={t('Báo cáo CEO Workforce Index')} />
      </div>
      <div className="survey-report-page-actions">
        <button className="survey-outline-button" onClick={onReviewAnswers} type="button">{t('Xem khảo sát')}</button>
        <button className="survey-primary-button" onClick={onHome} type="button">{t('Trang chủ')}</button>
      </div>
    </section>
  )
}

export type RoundtableChoice = 'yes' | 'no' | ''

type RoundtableModalProps = {
  choice: RoundtableChoice
  error?: string
  isRegistering?: boolean
  isSubmitting?: boolean
  onChoiceChange: (choice: Exclude<RoundtableChoice, ''>) => void
  onClose: () => void
  onConfirm: () => void
  open: boolean
}

// The survey contact details are reused for the registration, so the modal only
// asks whether to attend. Duplicates within a quarter are resolved by the backend.
export function RoundtableModal({ choice, error, isRegistering = false, isSubmitting = false, onChoiceChange, onClose, onConfirm, open }: RoundtableModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const initialFocusRef = useRef<HTMLButtonElement>(null)
  const eventDetails = useRoundtableEventDetails(open)
  const isBusy = isRegistering || isSubmitting

  useDialogKeyboard(open, modalRef, { initialFocusRef, onEscape: onClose })

  if (!open) return null

  return (
    <div className="survey-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }} role="presentation">
      <div aria-labelledby="survey-roundtable-title" aria-modal="true" className="survey-modal" ref={modalRef} role="dialog">
        <div className="survey-modal-hero">
          <div className="survey-modal-head">
            <SurveyEyebrow>CEO ROUNDTABLE</SurveyEyebrow>
            <button aria-label={t('Đóng')} onClick={onClose} ref={initialFocusRef} type="button"><X aria-hidden="true" size={19} /></button>
          </div>
          <h2 id="survey-roundtable-title">{t(roundtableCopy.title)}</h2>
          {roundtableCopy.paragraphs.map((paragraph) => <p key={paragraph}>{t(paragraph)}</p>)}
          <ul aria-label={t('Thông tin chương trình')} className="survey-round-meta">
            {eventDetails.map((detail) => (
              <li key={detail.label}><strong>{detail.label}:</strong> {detail.value}</li>
            ))}
          </ul>
        </div>
        <div className="survey-modal-body">
          <fieldset className="survey-roundtable-choice">
            <legend>{t('Anh/Chị có muốn đăng ký tham dự CEO Roundtable không?')}</legend>
            <div className="survey-consent-grid">
              <ConsentOption checked={choice === 'yes'} disabled={isBusy} id="survey-roundtable-yes" label={tx('roundtable', 'Đồng ý')} name="survey-roundtable-choice" onChange={() => onChoiceChange('yes')} />
              <ConsentOption checked={choice === 'no'} disabled={isBusy} id="survey-roundtable-no" label={tx('roundtable', 'Không đồng ý')} name="survey-roundtable-choice" onChange={() => onChoiceChange('no')} />
            </div>
            <p className="survey-roundtable-note">{t('Đăng ký dùng Họ tên, Email, Số điện thoại, Chức vụ và Tên công ty Anh/Chị đã nhập ở bước trước.')}</p>
          </fieldset>
          {error ? <p className="survey-inline-error" role="alert">{error}</p> : null}
          <div className="survey-modal-actions">
            <button className="survey-primary-button" disabled={isBusy || !choice} onClick={onConfirm} type="button">
              {isRegistering ? t('Đang đăng ký...') : isSubmitting ? t('Đang gửi kết quả...') : t('Tiếp tục gửi kết quả')}
              {isBusy ? null : <SurveyForwardArrow />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const reportProgressSteps = [
  { label: 'Tiếp nhận câu trả lời', statuses: ['pending', 'queued', 'queued_ai'] },
  { label: 'Phân tích dữ liệu khảo sát', statuses: ['generating', 'generating_ai'] },
  { label: 'Chuẩn bị báo cáo trực quan', statuses: ['rendering_assets', 'generating_pdf'] },
  { label: 'Hiển thị báo cáo', statuses: ['html_ready', 'completed', 'sent'] },
] as const

const reportLoadingCarouselModules = import.meta.glob('../../assets/figma/carousel-result-loading/web/*.webp', {
  eager: true,
  import: 'default',
  query: '?url',
})

const reportLoadingCarouselImages = Object.entries(reportLoadingCarouselModules)
  .sort(([firstPath], [secondPath]) => firstPath.localeCompare(secondPath, undefined, { numeric: true }))
  .map(([, source]) => source as string)

const reportLoadingCarouselFallbackImages = [
  reportCarouselFallback,
  roundtableCarouselFallback,
  webinarCarouselFallback,
] as const

function reportProgressIndex(status: ReportJobStatusValue | '') {
  const index = reportProgressSteps.findIndex((step) => (step.statuses as readonly string[]).includes(status))
  if (index >= 0) return index
  return status === 'failed' ? 0 : 0
}

function reportEmailLabel(status: ReportEmailStatus) {
  if (status === 'sent') return t('Email đã được gửi')
  if (status === 'sending') return t('Đang gửi email')
  if (status === 'queued') return t('Email đang chờ gửi')
  if (status === 'failed') return t('Gửi email chưa thành công')
  if (status === 'unknown') return t('Đang xác nhận trạng thái email')
  return t('Email sẽ được gửi sau khi hoàn tất báo cáo')
}

type ReportGenerationScreenProps = {
  deferredDays: number | null
  error: string
  onHome: () => void
  onRetry: () => void
  pollTimedOut: boolean
  reportStatus: ReportJobStatusValue | ''
}

function ReportGenerationCarousel({ onHome }: { onHome: () => void }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [carouselCycle, setCarouselCycle] = useState(0)
  const lightboxDialogRef = useRef<HTMLDivElement>(null)
  const lightboxCloseRef = useRef<HTMLButtonElement>(null)
  const swipeStartRef = useRef<{ pointerId: number; x: number; y: number } | null>(null)
  const images = reportLoadingCarouselImages.length ? reportLoadingCarouselImages : reportLoadingCarouselFallbackImages
  const imageCount = images.length

  const restartCarousel = () => setCarouselCycle((currentCycle) => currentCycle + 1)
  const selectImage = (index: number) => {
    setActiveIndex((index + imageCount) % imageCount)
    restartCarousel()
  }
  const showPreviousImage = () => {
    setActiveIndex((currentIndex) => (currentIndex - 1 + imageCount) % imageCount)
    restartCarousel()
  }
  const showNextImage = () => {
    setActiveIndex((currentIndex) => (currentIndex + 1) % imageCount)
    restartCarousel()
  }

  useEffect(() => {
    if (imageCount < 2 || lightboxIndex !== null) return

    const intervalId = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % imageCount)
    }, 4400)

    return () => window.clearInterval(intervalId)
  }, [carouselCycle, imageCount, lightboxIndex])

  useDialogKeyboard(lightboxIndex !== null, lightboxDialogRef, {
    initialFocusRef: lightboxCloseRef,
    onEscape: () => setLightboxIndex(null),
    onKeyDown: (event) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        setActiveIndex((currentIndex) => (currentIndex - 1 + imageCount) % imageCount)
        setCarouselCycle((currentCycle) => currentCycle + 1)
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        setActiveIndex((currentIndex) => (currentIndex + 1) % imageCount)
        setCarouselCycle((currentCycle) => currentCycle + 1)
      }
    },
  })

  const handlePointerDown = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.pointerType === 'mouse') return
    swipeStartRef.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY }
  }

  const handlePointerUp = (event: ReactPointerEvent<HTMLElement>) => {
    const swipeStart = swipeStartRef.current
    swipeStartRef.current = null
    if (!swipeStart || swipeStart.pointerId !== event.pointerId) return

    const horizontalDistance = event.clientX - swipeStart.x
    const verticalDistance = event.clientY - swipeStart.y
    if (Math.abs(horizontalDistance) < 42 || Math.abs(horizontalDistance) <= Math.abs(verticalDistance)) return

    if (horizontalDistance < 0) showNextImage()
    else showPreviousImage()
  }

  if (!imageCount) return null

  const lightboxImage = lightboxIndex === null ? '' : images[lightboxIndex]

  return (
    <section aria-labelledby="survey-report-gallery-title" className="survey-report-generation-gallery">
      <div className="survey-report-generation-gallery-heading">
        <div>
          <SurveyEyebrow>{t('RECAP SỰ KIỆN')}</SurveyEyebrow>
          <h2 aria-label={t('Sự kiện Bàn tròn CEO Quý 3/2026 đã thu hút sự quan tâm của các báo kinh tế uy tín')} id="survey-report-gallery-title">
            <span aria-hidden="true" className="survey-report-generation-gallery-title-desktop">{t('Sự kiện Bàn tròn CEO Quý 3/2026')}<br />{t('đã thu hút sự quan tâm của các báo kinh tế uy tín')}</span>
            <span aria-hidden="true" className="survey-report-generation-gallery-title-mobile">
              <span>{t('Sự kiện Bàn tròn CEO')}</span>
              <span>{t('Quý 3/2026 đã thu hút')}</span>
              <span>{t('sự quan tâm của các báo kinh tế uy tín')}</span>
            </span>
          </h2>
          <div className="survey-report-generation-recap-actions">
            <a className="survey-primary-button survey-report-generation-recap-link" href="https://cafebiz.vn/dieu-gi-dang-can-tro-doanh-nghiep-tang-truong-176260922103948402.chn" rel="noopener noreferrer" target="_blank">{t('Xem chi tiết')}</a>
            <button className="survey-primary-button survey-report-generation-recap-link" onClick={onHome} type="button">{t('Về trang chủ')}</button>
          </div>
        </div>
        <span aria-live="polite" className="survey-report-generation-gallery-index">
          {String(activeIndex + 1).padStart(2, '0')} <i /> {String(imageCount).padStart(2, '0')}
        </span>
      </div>

      <div className="survey-report-generation-carousel-shell">
        {imageCount > 1 ? <button aria-label={t('Ảnh trước')} className="survey-report-generation-carousel-control is-previous" onClick={showPreviousImage} type="button"><ChevronLeft aria-hidden="true" size={24} /></button> : null}
        <div
          aria-label={t('Bộ sưu tập hình ảnh')}
          className="survey-report-generation-carousel-viewport"
          onPointerCancel={() => { swipeStartRef.current = null }}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
        >
          <motion.div
            animate={{ x: `-${activeIndex * 100}%` }}
            className="survey-report-generation-carousel-track"
            initial={false}
            transition={{ duration: .72, ease: [0.22, 1, 0.36, 1] }}
          >
            {images.map((image, index) => (
              <article className={cn('survey-report-generation-carousel-slide', index === activeIndex && 'is-active')} key={image}>
                <button aria-label={t('Phóng to hình ảnh {n}', { n: index + 1 })} className="survey-report-generation-carousel-image-button" onClick={() => setLightboxIndex(index)} type="button">
                  <img alt={t('CEO Workforce Index - hình ảnh {n}', { n: index + 1 })} draggable={false} loading={index === 0 ? 'eager' : 'lazy'} src={image} />
                  <span aria-hidden="true" className="survey-report-generation-carousel-image-sheen" />
                  <span className="survey-report-generation-carousel-image-caption">{t('Chạm để phóng to')}</span>
                </button>
              </article>
            ))}
          </motion.div>
        </div>
        {imageCount > 1 ? <button aria-label={t('Ảnh tiếp theo')} className="survey-report-generation-carousel-control is-next" onClick={showNextImage} type="button"><ChevronRight aria-hidden="true" size={24} /></button> : null}
      </div>

      {imageCount > 1 ? (
        <div aria-label={t('Chọn hình ảnh')} className="survey-report-generation-carousel-pagination" role="group">
          {images.map((image, index) => (
            <button aria-current={index === activeIndex ? 'true' : undefined} aria-label={t('Hiển thị hình ảnh {n}', { n: index + 1 })} className={cn(index === activeIndex && 'is-active')} key={image} onClick={() => selectImage(index)} type="button" />
          ))}
        </div>
      ) : null}

      {typeof document !== 'undefined' ? createPortal(
        <AnimatePresence>
          {lightboxIndex !== null ? (
            <motion.div animate={{ opacity: 1 }} className="survey-report-generation-lightbox" exit={{ opacity: 0 }} initial={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget) setLightboxIndex(null) }} role="presentation">
              <motion.div animate={{ opacity: 1, scale: 1, y: 0 }} aria-label={t('Hình ảnh {n} phóng to', { n: lightboxIndex + 1 })} aria-modal="true" className="survey-report-generation-lightbox-dialog" initial={{ opacity: 0, scale: .97, y: 14 }} ref={lightboxDialogRef} role="dialog" transition={{ duration: .2, ease: 'easeOut' }}>
                <img alt={t('CEO Workforce Index - hình ảnh {n}', { n: lightboxIndex + 1 })} src={lightboxImage} />
                <button aria-label={t('Đóng hình ảnh phóng to')} className="survey-report-generation-lightbox-close" onClick={() => setLightboxIndex(null)} ref={lightboxCloseRef} type="button"><X aria-hidden="true" size={22} /></button>
                {imageCount > 1 ? <button aria-label={t('Hình ảnh trước')} className="survey-report-generation-lightbox-control is-previous" onClick={showPreviousImage} type="button"><ChevronLeft aria-hidden="true" size={30} /></button> : null}
                {imageCount > 1 ? <button aria-label={t('Hình ảnh tiếp theo')} className="survey-report-generation-lightbox-control is-next" onClick={showNextImage} type="button"><ChevronRight aria-hidden="true" size={30} /></button> : null}
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>,
        document.body,
      ) : null}
    </section>
  )
}

// Report generation is paused in the dashboard: the submission is stored and the
// report is emailed later, so the page confirms that instead of showing progress.
// The Vietnamese copy writes the day count with two digits ("07 ngày"); the
// English copy uses the plain number ({count}).
function ReportDeferredScreen({ days, onHome }: { days: number; onHome: () => void }) {
  const dayParams = { count: days, days: String(days).padStart(2, '0') }
  return (
    <section aria-labelledby="survey-report-generation-title" className="survey-report-generation-page">
      <div className="survey-report-generation-layout">
        <header className="survey-report-generation-hero">
          <div className="survey-report-generation-copy">
            <SurveyEyebrow>{t('ĐÃ GHI NHẬN KẾT QUẢ')}</SurveyEyebrow>
            <h1 id="survey-report-generation-title">{t('Cảm ơn Anh/Chị đã hoàn thành khảo sát.')}</h1>
            <p>{tx(days === 1 ? 'one-day' : 'days', 'Báo cáo cá nhân sẽ được gửi đến email Anh/Chị sau {days} ngày tới.', dayParams)}</p>
          </div>
          <div aria-hidden="true" className="survey-report-generation-deferred-mark">
            <MailCheck size={56} strokeWidth={1.5} />
          </div>
        </header>

        <ReportGenerationCarousel onHome={onHome} />
      </div>
    </section>
  )
}

export function ReportGenerationScreen({ deferredDays, error, onHome, onRetry, pollTimedOut, reportStatus }: ReportGenerationScreenProps) {
  if (deferredDays) return <ReportDeferredScreen days={deferredDays} onHome={onHome} />

  const activeProgressIndex = reportProgressIndex(reportStatus)
  const activeStep = reportProgressSteps[activeProgressIndex] ?? reportProgressSteps[0]

  return (
    <section aria-busy="true" aria-labelledby="survey-report-generation-title" className="survey-report-generation-page">
      <div aria-hidden="true" className="survey-report-generation-ambient survey-report-generation-ambient--left" />
      <div aria-hidden="true" className="survey-report-generation-ambient survey-report-generation-ambient--right" />
      <div className="survey-report-generation-layout">
        <header className="survey-report-generation-hero">
          <div className="survey-report-generation-copy">
            <SurveyEyebrow>{t('KHẢO SÁT ĐÃ HOÀN TẤT')}</SurveyEyebrow>
            <h1 id="survey-report-generation-title">{t('Đang chuẩn bị báo cáo của Anh/Chị')}</h1>
            <p>{t('CWI đang phân tích câu trả lời để dựng báo cáo phù hợp với bối cảnh doanh nghiệp. Trang này sẽ tự cập nhật ngay khi báo cáo sẵn sàng.')}</p>
            <div aria-live="polite" className="survey-report-generation-stage">
              <span aria-hidden="true" className="survey-report-generation-stage-pulse" />
              {t(activeStep.label)}
            </div>
          </div>
          <div aria-hidden="true" className="survey-report-generation-loader">
            <span className="survey-report-generation-loader-ripple is-first" />
            <span className="survey-report-generation-loader-ripple is-second" />
            <span className="survey-report-generation-loader-ripple is-third" />
            <span className="survey-report-generation-loader-ripple is-fourth" />
            <span className="survey-report-generation-loader-ripple is-fifth" />
            <span className="survey-report-generation-loader-ripple is-sixth" />
            <span className="survey-report-generation-loader-ripple is-seventh" />
            <span className="survey-report-generation-loader-core"><span /></span>
          </div>

        </header>

        <section aria-label={t('Tiến độ tạo báo cáo')} className="survey-report-generation-progress">
          <div aria-label={t('Tiến độ tạo báo cáo')} className="survey-report-generation-progress-line" role="progressbar" aria-valuemax={100} aria-valuemin={0} aria-valuenow={(activeProgressIndex + 1) * 25}>
            <motion.span animate={{ scaleX: (activeProgressIndex + 1) / reportProgressSteps.length }} initial={{ scaleX: .12 }} transition={{ duration: .45, ease: 'easeOut' }} />
          </div>
          <div className="survey-report-generation-steps" role="list">
            {reportProgressSteps.map((step, index) => {
              const done = index < activeProgressIndex
              const active = index === activeProgressIndex
              return (
                <div className={cn('survey-report-generation-step', done && 'is-done', active && 'is-active')} key={step.label} role="listitem">
                  <span aria-hidden="true">{done ? <Check size={15} strokeWidth={2.8} /> : String(index + 1).padStart(2, '0')}</span>
                  <strong>{t(step.label)}</strong>
                </div>
              )
            })}
          </div>
          <div className="survey-report-generation-note" aria-live="polite">
            <span aria-hidden="true" />
            {pollTimedOut ? t('Báo cáo đang mất nhiều thời gian hơn dự kiến. Anh/Chị có thể kiểm tra lại mà không cần gửi lại khảo sát.') : t('Anh/Chị có thể giữ nguyên trang này. Hệ thống vẫn tiếp tục xử lý an toàn ở nền.')}
          </div>
          {error ? <p className="survey-report-generation-error" role="alert">{error}</p> : null}
          {pollTimedOut || error ? (
            <div className="survey-report-generation-actions">
              <button className="survey-outline-button" onClick={onRetry} type="button">{t('Kiểm tra lại')}</button>
            </div>
          ) : null}
        </section>

        <ReportGenerationCarousel onHome={onHome} />
      </div>
    </section>
  )
}

function prepareReportPreviewHtml(source: string) {
  // Keep the upstream report as the source of truth. Only remove navigation
  // furniture that is not usable inside the embedded, fullscreen preview.
  if (!source || typeof DOMParser === 'undefined') return source

  const document = new DOMParser().parseFromString(source, 'text/html')
  document.querySelectorAll('aside.report-nav').forEach((navigation) => navigation.remove())

  const previewLayoutStyle = document.createElement('style')
  previewLayoutStyle.textContent = `
    .workspace { grid-template-columns: minmax(0, 210mm); }
    .report-stage { margin: 0 auto; width: min(210mm, 100%); }
    @media (max-width: 1180px) {
      .workspace { display: block; }
      .report-stage { margin: 0 auto; width: min(210mm, 100%); }
    }
  `
  document.head.append(previewLayoutStyle)

  // The report currently emits a page id on both the section and an empty
  // anchor inside it. Keep the section id as the single valid fragment target.
  document.querySelectorAll<HTMLAnchorElement>('a[id^="page-"]').forEach((anchor) => {
    const parent = anchor.parentElement
    if (parent?.tagName === 'P' && parent.childNodes.length === 1) {
      parent.remove()
      return
    }
    anchor.remove()
  })

  return `<!doctype html>${document.documentElement.outerHTML}`
}

type SurveyAnswersReviewModalProps = {
  answers: Answers
  contact: ContactState
  onClose: () => void
  open: boolean
  otherAnswers: Answers
  partTwoPrivacyRefused: boolean
  reportMode: 'part1' | 'private'
  roundtableRegistered: boolean
}

function reviewAnswerValue(questionNumber: number, answers: Answers, otherAnswers: Answers) {
  const value = getAnswerDisplay(questionNumber, answers, otherAnswers)
  return value === '—' ? t('Chưa trả lời') : value
}

function ReviewAnswerSection({ answers, otherAnswers, questions, title }: { answers: Answers; otherAnswers: Answers; questions: typeof partOneQuestions; title: string }) {
  return (
    <section className="survey-review-answer-section" aria-labelledby={`survey-review-${title}`}>
      <div className="survey-review-section-heading">
        <h3 id={`survey-review-${title}`}>{t(title)}</h3>
        <span>{t('{count} câu', { count: questions.length })}</span>
      </div>
      <ol className="survey-review-answer-list">
        {questions.map((question) => (
          <li key={question.n}>
            <div className="survey-review-question-label">{t('Câu {n}', { n: question.n })}</div>
            <p>{t(question.q)}</p>
            <strong>{reviewAnswerValue(question.n, answers, otherAnswers)}</strong>
          </li>
        ))}
      </ol>
    </section>
  )
}

export function SurveyAnswersReviewModal({ answers, contact, onClose, open, otherAnswers, partTwoPrivacyRefused, reportMode, roundtableRegistered }: SurveyAnswersReviewModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const initialFocusRef = useRef<HTMLButtonElement>(null)

  useDialogKeyboard(open, modalRef, { initialFocusRef, onEscape: onClose })

  if (!open) return null

  const position = contact.jobTitle === 'Khác' && contact.jobTitleOther.trim()
    ? `${t(contact.jobTitle)} - ${contact.jobTitleOther.trim()}`
    : contact.jobTitle ? t(contact.jobTitle) : t('Chưa cập nhật')
  const showPartTwoAnswers = reportMode === 'private' && !partTwoPrivacyRefused

  return (
    <div className="survey-modal-backdrop survey-review-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }} role="presentation">
      <div aria-labelledby="survey-review-title" aria-modal="true" className="survey-review-modal" ref={modalRef} role="dialog">
        <header className="survey-review-modal-header">
          <div>
            <SurveyEyebrow>{t('XEM LẠI KHẢO SÁT')}</SurveyEyebrow>
            <h2 id="survey-review-title">{t('Câu trả lời của Anh/Chị')}</h2>
            <p>{t('Thông tin được hiển thị ở chế độ chỉ đọc.')}</p>
          </div>
          <button aria-label={t('Đóng cửa sổ xem lại khảo sát')} className="survey-review-close" onClick={onClose} ref={initialFocusRef} type="button"><X aria-hidden="true" size={20} /></button>
        </header>
        <div className="survey-review-modal-body">
          <section className="survey-review-contact" aria-labelledby="survey-review-contact-title">
            <div className="survey-review-section-heading">
              <h3 id="survey-review-contact-title">{t('Thông tin đã gửi')}</h3>
              <span>{reportMode === 'private' ? t('Báo cáo toàn phần') : t('Báo cáo Phần 1')}</span>
            </div>
            <div className="survey-review-contact-grid">
              <div><span>{t('Họ tên')}</span><strong>{contact.name || t('Chưa cập nhật')}</strong></div>
              <div><span>Email</span><strong>{contact.email || t('Chưa cập nhật')}</strong></div>
              <div><span>{t('Chức vụ')}</span><strong>{position}</strong></div>
              <div><span>{t('Tên công ty')}</span><strong>{contact.companyName || t('Chưa cập nhật')}</strong></div>
              <div><span>Roundtable</span><strong>{roundtableRegistered ? t('Đã đăng ký') : t('Chưa đăng ký')}</strong></div>
            </div>
          </section>
          <ReviewAnswerSection answers={answers} otherAnswers={otherAnswers} questions={partOneQuestions} title="Phần 1 - Khảo sát khuyết danh" />
          {showPartTwoAnswers ? <ReviewAnswerSection answers={answers} otherAnswers={otherAnswers} questions={partTwoQuestions} title="Phần 2 - Khảo sát định danh" /> : null}
        </div>
        <footer className="survey-review-modal-footer">
          <button className="survey-primary-button" onClick={onClose} type="button">{t('Đóng')}</button>
        </footer>
      </div>
    </div>
  )
}
