import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, CheckCircle2, ChevronDown, CircleAlert, Download, LockKeyhole, Maximize2, Minimize2, X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { contactCopy, introCopy, jobTitleOptions, partOneQuestions, partTwoQuestions, reportParts, roundtableCopy } from './surveyData'
import { marketBenchmarkData, type MarketBenchmarkData } from './surveyReportData'
import { getAnswerDisplay, type Answers, validEmail } from './surveyScoring'
import { SurveyBrandMark, SurveyEyebrow, SurveyForwardArrow } from './SurveyChrome'
import type { ReportEmailStatus, ReportJobStatusValue } from './surveyApi'

type ContactState = { email: string; name: string; jobTitle: string; jobTitleOther: string }
type ConsentChoice = 'yes' | 'no' | ''
type ScoreSet = {
  domains: Array<{ name: string; value: number }>
  overall: number
  scale: number
}

type IntroScreenProps = {
  onStart: () => void
}

export function IntroScreen({ onStart }: IntroScreenProps) {
  return (
    <section className="survey-intro-screen">

      <div className="survey-intro-copy">
        <SurveyEyebrow>{introCopy.eyebrow}</SurveyEyebrow>
        <h1>
          <span>{introCopy.title}</span>
          <span>{introCopy.emphasis}</span>
        </h1>
        <div className="survey-intro-paragraphs">
          {introCopy.paragraphs.slice(0, 3).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
      </div>
      <div className="survey-report-box" aria-label="Các phần của báo cáo">
        {reportParts.map((part) => (
          <article key={part.kicker}>
            <small>{part.kicker}</small>
            <div>
              <strong>{part.title}</strong>
              <ul>
                {part.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
              </ul>
            </div>
          </article>
        ))}
      </div>
      <p className="survey-intro-last">{introCopy.paragraphs[3]}</p>
      <div className="survey-intro-actions">
        <button className="survey-primary-button survey-primary-button--hero" onClick={onStart} type="button">
          <span>Bắt đầu khảo sát</span>
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
        <span>{value || 'Chọn chức vụ'}</span>
        <ChevronDown aria-hidden="true" size={18} />
      </button>
      {open ? (
        <div aria-label="Chọn chức vụ" className="survey-job-title-menu" id="survey-job-title-options" role="listbox">
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
              <span>{option || 'Chọn chức vụ'}</span>
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

  if (!contact.name.trim()) requirements.push('Họ tên')
  if (!email) {
    requirements.push('Email công ty cá nhân')
  } else if (!validEmail(email)) {
    requirements.push('Email công ty cá nhân hợp lệ')
  }
  if (!contact.jobTitle.trim()) requirements.push('Chức vụ')

  return requirements.length ? `*Vui lòng bổ sung: ${requirements.join(', ')}.` : ''
}

export function ContactScreen({ consent, contact, dataCollectionConsent = false, error, mode, onBack, onConsentChange, onDataCollectionConsentChange, onContactChange, onSkipPrivate, onSubmit }: ContactScreenProps) {
  const isPrivate = mode === 'private'
  const selectedTitle = contact.jobTitle.trim()
  const isContactReady = Boolean(contact.name.trim() && validEmail(contact.email.trim()) && selectedTitle)
  const isSubmitDisabled = !isContactReady || (!isPrivate && !dataCollectionConsent) || (isPrivate && consent === 'no')
  const privacyParagraphs = isPrivate ? contactCopy.privatePrivacy : [contactCopy.anonymousPrivacy]
  const contactRequirementMessage = getContactRequirementMessage(contact)

  return (
    <section className="survey-form-screen" aria-labelledby="survey-contact-title">
      <SurveyEyebrow>{isPrivate ? '\u0050\u0048\u1ea6\u004e 2 - \u004b\u0048\u1ea2\u004f S\u00c1T \u0110\u1eca\u004e\u0048 \u0044\u0041\u004e\u0048 \u00b7 \u004e\u0068\u1ead\u006e \u0062\u00e1o c\u00e1o' : '\u0050\u0048\u1ea6\u004e 1 - \u004b\u0048\u1ea2\u004f S\u00c1T \u004b\u0048\u0055\u0059\u1ebe\u0054 \u0044\u0041\u004e\u0048 \u00b7 \u004e\u0068\u1ead\u006e \u0062\u00e1o c\u00e1o'}</SurveyEyebrow>
      <h1 id="survey-contact-title">{isPrivate ? '\u004e\u0068\u1ead\u006e B\u00e1o c\u00e1o Ri\u00eang t\u01b0' : '\u004e\u0068\u1ead\u006e B\u00e1o c\u00e1o Khuy\u1ebft danh'}</h1>
      <p className="survey-thankyou">{contactCopy.thankYou}</p>

      <form
        className="survey-contact-form"
        onSubmit={(event) => {
          event.preventDefault()
          onSubmit()
        }}
      >
        <div className="survey-form-grid">
          <label htmlFor="survey-contact-name">
            <span>Họ tên *</span>
            <input autoComplete="name" id="survey-contact-name" onChange={(event) => onContactChange({ ...contact, name: event.currentTarget.value })} placeholder="Họ và tên" value={contact.name} />
          </label>
          <label htmlFor="survey-contact-email">
            <span>Email công ty cá nhân *</span>
            <input autoComplete="email" id="survey-contact-email" onChange={(event) => onContactChange({ ...contact, email: event.currentTarget.value })} placeholder="name@company.com" inputMode="email" type="text" value={contact.email} />
          </label>
          <label htmlFor="survey-contact-title">
            <span>Chức vụ *</span>
            <JobTitleSelect
              onChange={(value) => onContactChange({ ...contact, jobTitle: value, jobTitleOther: '' })}
              value={contact.jobTitle}
            />
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
              <span className="survey-data-consent-copy">Đồng ý cho dự án CEO Workforce Index thu thập, lưu trữ, xử lý dữ liệu cá nhân và gửi báo cáo khảo sát</span>
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
              <h2 id="survey-privacy-title">THÔNG TIN BẢO MẬT</h2>
            </div>
            <div className="survey-privacy-copy">
              {privacyParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
            <div aria-disabled={!isContactReady} className="survey-consent-grid" role="radiogroup" aria-label="Đồng ý">
              <ConsentOption checked={consent === 'yes'} disabled={!isContactReady} id="survey-consent-yes" label="Đồng ý" onChange={() => onConsentChange('yes')} />
              <ConsentOption checked={consent === 'no'} disabled={!isContactReady} id="survey-consent-no" label="Không đồng ý" onChange={() => onConsentChange('no')} />
            </div>
            {consent === 'no' ? (
              <div className="survey-consent-warning" role="alert">
                <p>Để nhận được báo cáo vui lòng chọn "Đồng ý" để cấp quyền cho chúng tôi xử lý dữ liệu của Anh/Chị.</p>
                <button className="survey-text-button" onClick={onSkipPrivate} type="button">Bỏ qua Phần 2 và nhận báo cáo Phần 1</button>
              </div>
            ) : null}
          </section>
        ) : null}

        {error ? <p className="survey-inline-error" role="alert">{error}</p> : null}
        <div className="survey-form-actions">
          <button className="survey-primary-button" disabled={isSubmitDisabled} type="submit">
            {isPrivate ? '\u0047\u1eedi \u006b\u1ebft qu\u1ea3' : '\u0047\u1eedi \u006b\u1ebft qu\u1ea3 Ph\u1ea7n 1'}
            <SurveyForwardArrow />
          </button>
          <button className="survey-outline-button" onClick={onBack} type="button">Xem lại câu trả lời</button>
        </div>
      </form>
    </section>
  )
}

function ConsentOption({ checked, disabled, id, label, onChange }: { checked: boolean; disabled: boolean; id: string; label: string; onChange: () => void }) {
  return (
    <div className={cn('survey-consent-option', checked && 'is-selected', disabled && 'is-disabled')}>
      <input checked={checked} disabled={disabled} id={id} name="survey-consent" onChange={onChange} type="radio" />
      <label htmlFor={id}>
        <span className="survey-consent-radio" aria-hidden="true" />
        {label}
      </label>
    </div>
  )
}

export function LoadingScreen({ reportMode, step }: { reportMode: 'part1' | 'private'; step: number }) {
  const steps = ['Tổng hợp câu trả lời', 'Đối chiếu dữ liệu', 'Phân tích các nhóm năng lực', 'Tạo báo cáo']
  const title = reportMode === 'private' ? 'Đang tạo Báo cáo Riêng tư...' : 'Đang tạo Báo cáo Khuyết danh...'
  const description = reportMode === 'private'
    ? 'Tổng hợp kết quả PHẦN 1 - KHẢO SÁT KHUYẾT DANH và 6 câu PHẦN 2 - KHẢO SÁT ĐỊNH DANH.'
    : 'Tổng hợp 18 câu PHẦN 1 - KHẢO SÁT KHUYẾT DANH.'

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
            {item}
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
          <SurveyEyebrow>BÁO CÁO KHẢO SÁT</SurveyEyebrow>
          <h1 id="survey-report-page-title">Báo cáo của Anh/Chị</h1>
          <p>Báo cáo đã sẵn sàng. Anh/Chị có thể xem đầy đủ nội dung ngay trên trang này.</p>
        </div>
        <div aria-live="polite" className="survey-report-page-status">
          <span aria-hidden="true" className="survey-submission-delivery-dot" />
          {reportEmailLabel(emailStatus)}
        </div>
      </div>
      <div className={cn('survey-report-page-frame', isFullscreen && 'is-expanded')} ref={frameRef}>
        <div className="survey-report-page-frame-toolbar">
          <span>{isFullscreen ? 'Đang xem toàn màn hình' : 'Báo cáo khảo sát'}</span>
          <button
            aria-label={isFullscreen ? 'Thu nhỏ báo cáo' : 'Phóng to báo cáo toàn màn hình'}
            aria-pressed={isFullscreen}
            className="survey-report-page-fullscreen-button"
            onClick={() => void toggleFullscreen()}
            title={isFullscreen ? 'Thu nhỏ báo cáo' : 'Phóng to báo cáo toàn màn hình'}
            type="button"
          >
            {isFullscreen ? <Minimize2 aria-hidden="true" size={17} /> : <Maximize2 aria-hidden="true" size={17} />}
            <span>{isFullscreen ? 'Thu nhỏ' : 'Toàn màn hình'}</span>
          </button>
        </div>
        <iframe loading="eager" referrerPolicy="no-referrer" sandbox="allow-same-origin" srcDoc={previewHtml} title="Báo cáo CEO Workforce Index" />
      </div>
      <div className="survey-report-page-actions">
        <button className="survey-outline-button" onClick={onReviewAnswers} type="button">Xem khảo sát</button>
        <button className="survey-primary-button" onClick={onHome} type="button">Trang chủ</button>
      </div>
    </section>
  )
}

type ResultScreenProps = {
  answers: Answers
  mode: 'part1' | 'private'
  onBackHome: () => void
  onOpenRoundtable: (trigger: HTMLButtonElement) => void
  otherAnswers: Answers
  scores: ScoreSet
}

export function ResultScreen({ answers, mode, onBackHome, onOpenRoundtable, otherAnswers, scores }: ResultScreenProps) {
  const isPrivate = mode === 'private'

  return (
    <section className="survey-result-screen" aria-labelledby="survey-result-title">
      <ReportIdentity mode={mode} />
      {isPrivate ? (
        <>
          <PrivatePartOneSection domains={scores.domains} />
          <PrivateAnalysisSection answers={answers} otherAnswers={otherAnswers} />
        </>
      ) : (
        <>
          <MarketBenchmarkSection data={marketBenchmarkData} />
          <PersonalScoreSection answers={answers} otherAnswers={otherAnswers} scores={scores} />
          <DomainAnalysisSection domains={scores.domains} />
        </>
      )}

      <section className="survey-roundtable-invitation">
        <SurveyEyebrow>CEO Roundtable</SurveyEyebrow>
        <h2>Đăng kí tham dự CEO Roundtable</h2>
        {roundtableCopy.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        <div className="survey-round-meta">
          {roundtableCopy.meta.map((item) => <span key={item}>{item}</span>)}
        </div>
        <button className="survey-outline-button" onClick={(event) => onOpenRoundtable(event.currentTarget)} type="button">
          Đăng ký tham dự
        </button>
      </section>

      <div className="survey-result-actions">
        <button className="survey-primary-button" onClick={() => window.print()} type="button">
          <Download aria-hidden="true" size={17} />
          Tải xuống PDF
        </button>
        <button className="survey-outline-button" onClick={onBackHome} type="button">Quay về trang chủ</button>
      </div>
    </section>
  )
}

function ReportIdentity({ mode }: { mode: 'part1' | 'private' }) {
  const isPrivate = mode === 'private'

  return (
    <>
      <div className="survey-report-print-brand">
        <SurveyBrandMark variant="report" />
        <span>CEO Workforce Index · Q3 2026</span>
      </div>
      <header className="survey-result-identity">
        <SurveyBrandMark variant="report" />
        <p className="survey-report-kicker">{isPrivate ? '\u0047\u1eedi \u006b\u1ebft qu\u1ea3' : '\u0047\u1eedi \u006b\u1ebft qu\u1ea3 Ph\u1ea7n 1'}</p>
        <h1 id="survey-result-title">{isPrivate ? '\u0047\u1eedi \u006b\u1ebft qu\u1ea3' : '\u0047\u1eedi \u006b\u1ebft qu\u1ea3 Ph\u1ea7n 1'}</h1>
        <p>{isPrivate ? '\u0047\u1eedi \u006b\u1ebft qu\u1ea3' : '\u0047\u1eedi \u006b\u1ebft qu\u1ea3 Ph\u1ea7n 1'}</p>
        <div className="survey-report-meta">
          <span>{isPrivate ? '\u0047\u1eedi \u006b\u1ebft qu\u1ea3' : '\u0047\u1eedi \u006b\u1ebft qu\u1ea3 Ph\u1ea7n 1'}</span>
        </div>
      </header>
    </>
  )
}

function ReportSectionHeading({ number, eyebrow, title }: { number: string; eyebrow: string; title: string }) {
  return (
    <div className="survey-section-heading">
      <span className="survey-report-section-number">{number}</span>
      <div>
        {eyebrow ? <SurveyEyebrow>{eyebrow}</SurveyEyebrow> : null}
        <h2>{title}</h2>
      </div>
    </div>
  )
}

function MarketBenchmarkSection({ data }: { data: MarketBenchmarkData }) {
  const hasLiveData = data.status === 'live'

  return (
    <section className="survey-result-section survey-market-section">
      <ReportSectionHeading number="1." eyebrow="" title="Kết quả thị trường" />
      <p className="survey-section-lede">Kết quả thị trường được lấy từ Teaser Report để tạo bối cảnh đối chuẩn.</p>
      {hasLiveData ? (
        <>
          <p className="survey-section-lede">{data.sourceLabel}</p>
          <div className="survey-market-demo" aria-hidden="true">
            <span className="survey-market-demo-label">Demo bố cục · Dữ liệu thực tế lấy từ Teaser Report</span>
            <div className="survey-market-demo-chart"><i /><b /><em /></div>
          </div>
          <div className="survey-market-metrics">
            {data.metrics.map((metric) => (
              <div key={metric.label}>
                <span>{metric.label}</span>
                <strong>{metric.value}</strong>
                <small>{metric.description}</small>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="survey-market-pending" role="status">
          <strong>{data.sourceLabel}</strong>
          <p>Dữ liệu đối chuẩn thị trường đang được tổng hợp trong kỳ nghiên cứu {data.period}.</p>
        </div>
      )}
    </section>
  )
}
function PersonalScoreSection({ answers, otherAnswers, scores }: { answers: Answers; otherAnswers: Answers; scores: ScoreSet }) {
  return (
    <section className="survey-result-section">
      <ReportSectionHeading number="2." eyebrow="" title="Input của Anh/Chị cho 18 câu hỏi" />
      <p className="survey-section-lede">Tóm tắt các tín hiệu từ câu trả lời của Anh/Chị.</p>
      <div className="survey-score-rows">
        <ScoreRow label="Leadership Capacity" value={scores.overall} />
        <ScoreRow label="Scale Readiness" value={scores.scale} />
      </div>
      <AnswerSummary answers={answers} otherAnswers={otherAnswers} />
    </section>
  )
}

function AnswerSummary({ answers, otherAnswers }: { answers: Answers; otherAnswers: Answers }) {
  const questionNumbers = [1, 6, 10, 14, 17, 18]

  return (
    <div className="survey-answer-summary" aria-label="Tóm tắt câu trả lời">
      {questionNumbers.map((number) => (
        <article key={number}>
          <strong>Câu {number}</strong>
          <span>{getAnswerDisplay(number, answers, otherAnswers)}</span>
        </article>
      ))}
    </div>
  )
}
function DomainAnalysisSection({ domains }: { domains: ScoreSet['domains'] }) {
  return (
    <section className="survey-result-section">
      <ReportSectionHeading number="3." eyebrow="" title="Phân tích đối chuẩn" />
      <p className="survey-section-lede">Phân tích dữ liệu của Anh/Chị, đối chuẩn và xác định doanh nghiệp đang ở đâu so với bối cảnh thị trường.</p>
      <div className="survey-domain-analysis-layout">
        <DomainRadar domains={domains} />
        <DomainBars domains={domains} />
      </div>
    </section>
  )
}
function ScoreRow({ label, value }: { label: string; value: number }) {
  const safeValue = clampScore(value)
  return (
    <article className="survey-score-row">
      <div><span>{label}</span><strong>{safeValue} <small>/ 100</small></strong></div>
      <div className="survey-score-track"><i style={{ width: safeValue + '%' }} /></div>
    </article>
  )
}

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Number.isFinite(value) ? value : 0))
}

function polarPoint(cx: number, cy: number, radius: number, index: number, count: number) {
  const angle = -Math.PI / 2 + (index * Math.PI * 2) / count
  return { x: cx + Math.cos(angle) * radius, y: cy + Math.sin(angle) * radius }
}

function pointsForScale(count: number, cx: number, cy: number, radius: number, scale: number) {
  return Array.from({ length: count }, (_, index) => {
    const point = polarPoint(cx, cy, radius * scale, index, count)
    return point.x.toFixed(2) + ',' + point.y.toFixed(2)
  }).join(' ')
}

function wrapDomainLabel(name: string) {
  const words = name.split(' ')
  const lines: string[] = []
  let current = ''
  words.forEach((word) => {
    const candidate = current ? current + ' ' + word : word
    if (candidate.length > 18 && current) {
      lines.push(current)
      current = word
    } else {
      current = candidate
    }
  })
  if (current) lines.push(current)
  return lines.slice(0, 2)
}

function DomainRadar({ domains }: { domains: ScoreSet['domains'] }) {
  if (!domains.length) {
    return <p className="survey-empty-visual">Chưa có nhóm năng lực để hiển thị.</p>
  }

  const size = 320
  const center = size / 2
  const radius = 102
  const labelRadius = 140
  const count = domains.length
  const values = domains.map((domain) => clampScore(domain.value))
  const valuePoints = values.map((value, index) => {
    const point = polarPoint(center, center, radius * (value / 100), index, count)
    return point.x.toFixed(2) + ',' + point.y.toFixed(2)
  }).join(' ')

  return (
    <figure className="survey-radar-figure">
      <figcaption>5 nhóm năng lực<br /><small>Điểm từ 18 câu trả lời</small></figcaption>
      <svg
        aria-label="Biểu đồ radar 5 nhóm năng lực theo điểm số CWI"
        className="survey-radar"
        role="img"
        viewBox="0 0 320 320"
      >
        {[0.25, 0.5, 0.75, 1].map((scale) => (
          <polygon className="survey-radar-grid" key={scale} points={pointsForScale(count, center, center, radius, scale)} />
        ))}
        {domains.map((domain, index) => {
          const point = polarPoint(center, center, radius, index, count)
          return <line className="survey-radar-axis" key={domain.name} x1={center} x2={point.x} y1={center} y2={point.y} />
        })}
        <polygon className="survey-radar-area" points={valuePoints} />
        <polyline className="survey-radar-line" points={valuePoints + ' ' + valuePoints.split(' ')[0]} />
        {domains.map((domain, index) => {
          const point = polarPoint(center, center, radius * (values[index] / 100), index, count)
          return <circle className="survey-radar-point" cx={point.x} cy={point.y} key={domain.name} r="4" />
        })}
        {domains.map((domain, index) => {
          const point = polarPoint(center, center, labelRadius, index, count)
          const anchor = point.x < center - 8 ? 'end' : point.x > center + 8 ? 'start' : 'middle'
          const lines = wrapDomainLabel(domain.name)
          return (
            <text className="survey-radar-label" key={domain.name} textAnchor={anchor} x={point.x} y={point.y}>
              {lines.map((line, lineIndex) => <tspan dy={lineIndex === 0 ? 0 : 14} key={line} x={point.x}>{line}</tspan>)}
            </text>
          )
        })}
      </svg>
    </figure>
  )
}

function DomainBars({ domains }: { domains: ScoreSet['domains'] }) {
  return (
    <div className="survey-domain-bars">
      {domains.map((domain) => {
        const value = clampScore(domain.value)
        return (
          <div key={domain.name}>
            <div><strong>{domain.name}</strong><span>{value} / 100</span></div>
            <i><b style={{ width: value + '%' }} /></i>
          </div>
        )
      })}
    </div>
  )
}

function PrivatePartOneSection({ domains }: { domains: ScoreSet['domains'] }) {
  return (
    <section className="survey-result-section">
      <ReportSectionHeading number="" eyebrow="" title="Kết quả Phần 1" />
      <p className="survey-section-lede">Bao gồm Kết quả thị trường, 18 câu trả lời và phân tích đối chuẩn từ PHẦN 1 - KHẢO SÁT KHUYẾT DANH.</p>
      <div className="survey-private-chart-heading">
        <strong>5 nhóm năng lực</strong>
        <span>Tổng hợp Phần 1</span>
      </div>
      <div className="survey-domain-analysis-layout">
        <DomainRadar domains={domains} />
        <DomainBars domains={domains} />
      </div>
    </section>
  )
}

function PrivateAnalysisSection({ answers, otherAnswers }: { answers: Answers; otherAnswers: Answers }) {
  const items = [
    ['Cơ chế ra quyết định', getAnswerDisplay(19, answers, otherAnswers)],
    ['Độ sẵn sàng mở rộng', getAnswerDisplay(20, answers, otherAnswers)],
    ['Mức phụ thuộc vào CEO', getAnswerDisplay(21, answers, otherAnswers)],
    ['Rào cản tăng trưởng', getAnswerDisplay(22, answers, otherAnswers)],
    ['Bối cảnh doanh nghiệp', `Doanh thu: ${getAnswerDisplay(23, answers, otherAnswers)} · Website: ${getAnswerDisplay(24, answers, otherAnswers)}`],
  ]

  return (
    <section className="survey-result-section">
      <ReportSectionHeading number="" eyebrow="" title="5 trang phân tích riêng cho doanh nghiệp" />
      <p className="survey-section-lede">Phân tích sâu hơn từ 6 câu PHẦN 2 - KHẢO SÁT ĐỊNH DANH, kèm kiến nghị và giải pháp phù hợp với bối cảnh doanh nghiệp.</p>
      <div className="survey-market-metrics survey-private-metrics">
        <div><span>Mức sẵn sàng mở rộng</span><strong>72/100</strong><small>Chỉ số minh họa cho khả năng scale của doanh nghiệp.</small></div>
        <div><span>Rủi ro vận hành</span><strong>3</strong><small>Nhóm rủi ro ưu tiên được AI gắn cờ để xử lý sớm.</small></div>
        <div><span>Khung hành động</span><strong>90</strong><small>Lộ trình minh họa trong 90 ngày để cải thiện năng lực thực thi.</small></div>
      </div>
      <div className="survey-private-analysis-list">
        {items.map(([title, answer], index) => (
          <article key={title}>
            <strong>{String(index + 1).padStart(2, '0')}</strong>
            <div>
              <span>Trang phân tích riêng {index + 1}/5</span>
              <h3>{title}</h3>
              <p>{answer}</p>
              <p>Demo wireframe: khu vực này sẽ chứa phân tích sâu, kiến nghị và giải pháp phù hợp với doanh nghiệp/ngành nghề.</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

type RoundtableModalProps = {
  contact: ContactState
  error?: string
  isChecking?: boolean
  isRegistering?: boolean
  isSubmitting?: boolean
  onChange: (next: ContactState) => void
  onClose: () => void
  onContinue: () => void
  onRegister: () => void
  onSkip: () => void
  open: boolean
  registered: boolean
  registeredFromExisting?: boolean
}

export function RoundtableModal({ contact, error, isChecking = false, isRegistering = false, isSubmitting = false, onChange, onClose, onContinue, onRegister, onSkip, open, registered, registeredFromExisting = false }: RoundtableModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const initialFocusRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return

    const previousFocus = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.requestAnimationFrame(() => initialFocusRef.current?.focus())

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key !== 'Tab' || !modalRef.current) return
      const focusable = Array.from(modalRef.current.querySelectorAll<HTMLElement>('button, input, [href], [tabindex]:not([tabindex="-1"])'))
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

  if (!open) return null

  return (
    <div className="survey-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }} role="presentation">
      <div aria-labelledby="survey-roundtable-title" aria-modal="true" className="survey-modal" ref={modalRef} role="dialog">
        <div className="survey-modal-hero">
          <div className="survey-modal-head">
            <SurveyEyebrow>CEO ROUNDTABLE</SurveyEyebrow>
            <button aria-label="Đóng" onClick={onClose} ref={initialFocusRef} type="button"><X aria-hidden="true" size={19} /></button>
          </div>
          <h2 id="survey-roundtable-title">{roundtableCopy.title}</h2>
          {roundtableCopy.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <div className="survey-round-meta">
            {roundtableCopy.meta.map((item) => <span key={item}>{item}</span>)}
          </div>
        </div>
        <div className="survey-modal-body">
          <div className="survey-form-grid">
            <label htmlFor="survey-roundtable-name"><span>Họ tên *</span><input autoComplete="name" disabled={registered || isChecking || isRegistering || isSubmitting} id="survey-roundtable-name" onChange={(event) => onChange({ ...contact, name: event.currentTarget.value })} value={contact.name} /></label>
            <label htmlFor="survey-roundtable-email"><span>Email công ty cá nhân *</span><input autoComplete="email" disabled={registered || isChecking || isRegistering || isSubmitting} id="survey-roundtable-email" onChange={(event) => onChange({ ...contact, email: event.currentTarget.value })} inputMode="email" type="text" value={contact.email} /></label>
          </div>
          {error ? <p className="survey-inline-error" role="alert">{error}</p> : null}
          {registered ? <p className="survey-success-message">✓ {registeredFromExisting ? 'Email này đã được đăng ký tham dự CEO Roundtable.' : 'Anh/Chị đã đăng ký tham dự CEO Roundtable thành công.'}</p> : null}
          <div className="survey-modal-actions">
            {registered ? (
              <button className="survey-primary-button" disabled={isRegistering || isSubmitting} onClick={onContinue} type="button">{isSubmitting ? 'Đang gửi kết quả...' : '\u0054\u0069\u1ebfp \u0074\u1ee5c \u0067\u1eedi \u006b\u1ebft \u0071\u0075\u1ea3'}</button>
            ) : (
              <>
                <button className="survey-primary-button" disabled={isChecking || isRegistering || isSubmitting} onClick={onRegister} type="button">
                  {isChecking ? 'Đang kiểm tra...' : isRegistering ? 'Đang đăng ký...' : 'Đăng ký tham dự'}
                  {isChecking || isRegistering ? null : <SurveyForwardArrow />}
                </button>
                <button className="survey-outline-button" disabled={isRegistering || isSubmitting} onClick={onSkip} type="button">{isSubmitting ? 'Đang gửi kết quả...' : '\u0042\u1ecf \u0071\u0075\u0061 & \u0067\u1eedi \u006b\u1ebft \u0071\u0075\u1ea3'}</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const submissionCompleteCopy = {
  home: '\u0054\u0072\u0061\u006e\u0067 \u0063\u0068\u1ee7',
  eyebrow: 'KH\u1ea2O S\u00c1T \u0110\u00c3 HO\u00c0N T\u1ea4T',
  message: 'C\u1ea3m \u01a1n anh/ch\u1ecb \u0111\u00e3 ho\u00e0n th\u00e0nh kh\u1ea3o s\u00e1t. B\u00e1o c\u00e1o s\u1ebd \u0111\u01b0\u1ee3c h\u1ec7 th\u1ed1ng x\u1eed l\u00fd v\u00e0 g\u1eedi \u0111\u1ebfn email anh/ch\u1ecb.',
  title: 'C\u1ea3m \u01a1n anh/ch\u1ecb',
}

type SubmissionCompleteModalProps = {
  emailStatus: ReportEmailStatus
  error: string
  hasReportJob: boolean
  html: string
  onHome: () => void
  onRetry: () => void
  open: boolean
  pollTimedOut: boolean
  reportStatus: ReportJobStatusValue | ''
}

const reportProgressSteps = [
  { label: 'Tiếp nhận câu trả lời', statuses: ['pending', 'queued', 'queued_ai'] },
  { label: 'Phân tích dữ liệu khảo sát', statuses: ['generating', 'generating_ai'] },
  { label: 'Chuẩn bị báo cáo trực quan', statuses: ['rendering_assets', 'generating_pdf'] },
  { label: 'Hiển thị báo cáo', statuses: ['html_ready', 'completed', 'sent'] },
] as const

function reportProgressIndex(status: ReportJobStatusValue | '') {
  const index = reportProgressSteps.findIndex((step) => (step.statuses as readonly string[]).includes(status))
  if (index >= 0) return index
  return status === 'failed' ? 0 : 0
}

function reportEmailLabel(status: ReportEmailStatus) {
  if (status === 'sent') return 'Email đã được gửi'
  if (status === 'sending') return 'Đang gửi email'
  if (status === 'queued') return 'Email đang chờ gửi'
  if (status === 'failed') return 'Gửi email chưa thành công'
  if (status === 'unknown') return 'Đang xác nhận trạng thái email'
  return 'Email sẽ được gửi sau khi hoàn tất báo cáo'
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
  return value === '—' ? 'Chưa trả lời' : value
}

function ReviewAnswerSection({ answers, otherAnswers, questions, title }: { answers: Answers; otherAnswers: Answers; questions: typeof partOneQuestions; title: string }) {
  return (
    <section className="survey-review-answer-section" aria-labelledby={`survey-review-${title}`}>
      <div className="survey-review-section-heading">
        <h3 id={`survey-review-${title}`}>{title}</h3>
        <span>{questions.length} câu</span>
      </div>
      <ol className="survey-review-answer-list">
        {questions.map((question) => (
          <li key={question.n}>
            <div className="survey-review-question-label">Câu {question.n}</div>
            <p>{question.q}</p>
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

  useEffect(() => {
    if (!open) return

    const previousFocus = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.requestAnimationFrame(() => initialFocusRef.current?.focus())

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key !== 'Tab' || !modalRef.current) return

      const focusable = Array.from(modalRef.current.querySelectorAll<HTMLElement>('button, [href], [tabindex]:not([tabindex="-1"])'))
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

  if (!open) return null

  const position = contact.jobTitle === 'Khác' && contact.jobTitleOther.trim()
    ? `${contact.jobTitle} - ${contact.jobTitleOther.trim()}`
    : contact.jobTitle || 'Chưa cập nhật'
  const showPartTwoAnswers = reportMode === 'private' && !partTwoPrivacyRefused

  return (
    <div className="survey-modal-backdrop survey-review-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }} role="presentation">
      <div aria-labelledby="survey-review-title" aria-modal="true" className="survey-review-modal" ref={modalRef} role="dialog">
        <header className="survey-review-modal-header">
          <div>
            <SurveyEyebrow>XEM LẠI KHẢO SÁT</SurveyEyebrow>
            <h2 id="survey-review-title">Câu trả lời của Anh/Chị</h2>
            <p>Thông tin được hiển thị ở chế độ chỉ đọc.</p>
          </div>
          <button aria-label="Đóng cửa sổ xem lại khảo sát" className="survey-review-close" onClick={onClose} ref={initialFocusRef} type="button"><X aria-hidden="true" size={20} /></button>
        </header>
        <div className="survey-review-modal-body">
          <section className="survey-review-contact" aria-labelledby="survey-review-contact-title">
            <div className="survey-review-section-heading">
              <h3 id="survey-review-contact-title">Thông tin đã gửi</h3>
              <span>{reportMode === 'private' ? 'Báo cáo toàn phần' : 'Báo cáo Phần 1'}</span>
            </div>
            <div className="survey-review-contact-grid">
              <div><span>Họ tên</span><strong>{contact.name || 'Chưa cập nhật'}</strong></div>
              <div><span>Email</span><strong>{contact.email || 'Chưa cập nhật'}</strong></div>
              <div><span>Chức vụ</span><strong>{position}</strong></div>
              <div><span>Roundtable</span><strong>{roundtableRegistered ? 'Đã đăng ký' : 'Chưa đăng ký'}</strong></div>
            </div>
          </section>
          <ReviewAnswerSection answers={answers} otherAnswers={otherAnswers} questions={partOneQuestions} title="Phần 1 - Khảo sát khuyết danh" />
          {showPartTwoAnswers ? <ReviewAnswerSection answers={answers} otherAnswers={otherAnswers} questions={partTwoQuestions} title="Phần 2 - Khảo sát định danh" /> : null}
        </div>
        <footer className="survey-review-modal-footer">
          <button className="survey-primary-button" onClick={onClose} type="button">Đóng</button>
        </footer>
      </div>
    </div>
  )
}

export function SubmissionCompleteModal({ emailStatus, error, hasReportJob, html, onHome, onRetry, open, pollTimedOut, reportStatus }: SubmissionCompleteModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const initialFocusRef = useRef<HTMLButtonElement>(null)
  const previewHtml = useMemo(() => prepareReportPreviewHtml(html), [html])
  const activeProgressIndex = reportProgressIndex(reportStatus)

  useEffect(() => {
    if (!open) return

    const previousFocus = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.requestAnimationFrame(() => initialFocusRef.current?.focus())

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab' || !modalRef.current) return
      const focusable = Array.from(modalRef.current.querySelectorAll<HTMLElement>('button, input, [href], [tabindex]:not([tabindex="-1"])'))
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
  }, [open])

  if (!open) return null

  return (
    <div className="survey-modal-backdrop survey-submission-backdrop" role="presentation">
      <div aria-busy={hasReportJob && !html} aria-labelledby="survey-submission-title" aria-modal="true" className={cn('survey-submission-modal', html && 'has-report-preview')} ref={modalRef} role="dialog">
        <div className="survey-submission-modal-content">
          <AnimatePresence initial={false} mode="wait">
            {previewHtml ? (
              <motion.div animate={{ opacity: 1, y: 0 }} className="survey-report-preview-state" initial={{ opacity: 0, y: 10 }} key="report-preview" transition={{ duration: .28 }}>
                <div className="survey-submission-modal-top">
                  <div aria-hidden="true" className="survey-submission-modal-icon"><CheckCircle2 size={30} /></div>
                </div>
                <SurveyEyebrow>BÁO CÁO ĐÃ SẴN SÀNG</SurveyEyebrow>
                <h2 id="survey-submission-title">Báo cáo của Anh/Chị</h2>
                <p className="survey-submission-modal-lede">Báo cáo đã được tạo. Anh/Chị có thể xem ngay tại đây; bản PDF sẽ tiếp tục được hoàn thiện và gửi qua email.</p>
                <div className="survey-report-preview-frame">
                  <iframe loading="eager" referrerPolicy="no-referrer" sandbox="allow-same-origin" srcDoc={previewHtml} title="Báo cáo CEO Workforce Index" />
                </div>
                <div className="survey-submission-delivery-status" aria-live="polite">
                  <span className="survey-submission-delivery-dot" aria-hidden="true" />
                  {reportEmailLabel(emailStatus)}
                </div>
                <button className="survey-primary-button survey-submission-modal-button" onClick={onHome} ref={initialFocusRef} type="button">{submissionCompleteCopy.home}</button>
              </motion.div>
            ) : hasReportJob ? (
              <motion.div animate={{ opacity: 1, y: 0 }} className="survey-report-loading-state" initial={{ opacity: 0, y: 10 }} key="report-loading" transition={{ duration: .28 }}>
                <div className="survey-submission-modal-top">
                  <div aria-hidden="true" className="survey-report-loading-visual">
                    <motion.div className="survey-report-loading-spinner" animate={{ rotate: 360 }} transition={{ duration: 1.25, ease: 'linear', repeat: Infinity }}>
                      <span />
                    </motion.div>
                    <motion.span className="survey-report-loading-glow" animate={{ opacity: [.35, .85, .35], scale: [.92, 1.06, .92] }} transition={{ duration: 1.8, ease: 'easeInOut', repeat: Infinity }} />
                  </div>
                </div>
                <SurveyEyebrow>KHẢO SÁT ĐÃ HOÀN TẤT</SurveyEyebrow>
                <h2 id="survey-submission-title">Đang chuẩn bị báo cáo</h2>
                <p className="survey-submission-modal-lede">CWI đang phân tích câu trả lời và dựng báo cáo riêng cho Anh/Chị. Báo cáo sẽ hiển thị ngay khi sẵn sàng.</p>
                <motion.p animate={{ opacity: 1, y: 0 }} className="survey-report-loading-stage" initial={{ opacity: 0, y: 4 }} key={reportStatus || 'pending'}>
                  {reportProgressSteps[activeProgressIndex]?.label ?? 'Đang tiếp nhận câu trả lời'}
                </motion.p>
                <div aria-label="Tiến độ tạo báo cáo" className="survey-report-loading-progress" role="progressbar" aria-valuemax={100} aria-valuemin={0} aria-valuenow={(activeProgressIndex + 1) * 25}>
                  <motion.span animate={{ scaleX: (activeProgressIndex + 1) / reportProgressSteps.length }} initial={{ scaleX: .12 }} transition={{ duration: .45, ease: 'easeOut' }} />
                </div>
                <div aria-label="Tiến độ tạo báo cáo" className="survey-report-progress" role="list">
                  {reportProgressSteps.map((step, index) => {
                    const done = Boolean(previewHtml) || index < activeProgressIndex
                    const active = index === activeProgressIndex && !done
                    return (
                      <div className={cn('survey-report-progress-step', done && 'is-done', active && 'is-active')} key={step.label} role="listitem">
                        <span aria-hidden="true" className="survey-report-progress-marker">{done ? '✓' : index + 1}</span>
                        <span>{step.label}</span>
                      </div>
                    )
                  })}
                </div>
                <div className="survey-report-loading-note" aria-live="polite">
                  <motion.span animate={{ opacity: [.45, 1, .45] }} transition={{ duration: 1.4, repeat: Infinity }} />
                  {pollTimedOut ? 'Báo cáo đang được xử lý lâu hơn dự kiến.' : 'Anh/Chị có thể giữ nguyên cửa sổ này; hệ thống sẽ tự cập nhật.'}
                </div>
                {error ? <p className="survey-submission-modal-error" role="alert">{error}</p> : null}
                {pollTimedOut || error ? <button className="survey-outline-button survey-submission-modal-retry" onClick={onRetry} type="button">Kiểm tra lại</button> : null}
                <button className="survey-primary-button survey-submission-modal-button" onClick={onHome} ref={initialFocusRef} type="button">{submissionCompleteCopy.home}</button>
              </motion.div>
            ) : (
              <motion.div animate={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 10 }} key="submission-complete" transition={{ duration: .28 }}>
                <div className="survey-submission-modal-top">
                  <div aria-hidden="true" className="survey-submission-modal-icon"><CheckCircle2 size={30} /></div>
                </div>
                <SurveyEyebrow>{submissionCompleteCopy.eyebrow}</SurveyEyebrow>
                <div aria-hidden="true" className="survey-submission-modal-logo-title">
                  <SurveyBrandMark decorative variant="intro" />
                </div>
                <h2 className="survey-sr-only" id="survey-submission-title">{submissionCompleteCopy.title}</h2>
                <p>{submissionCompleteCopy.message}</p>
                <button className="survey-primary-button survey-submission-modal-button" onClick={onHome} ref={initialFocusRef} type="button">{submissionCompleteCopy.home}</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
