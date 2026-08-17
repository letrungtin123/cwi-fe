import { useEffect, useRef } from 'react'
import { CircleAlert, Download, LockKeyhole, X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { getAnswerDisplay, type Answers } from './surveyScoring'
import { contactCopy, introCopy, partOneQuestions, reportParts, roundtableCopy } from './surveyData'
import { marketBenchmarkData, type MarketBenchmarkData } from './surveyReportData'
import { SurveyBrandMark, SurveyEyebrow, SurveyForwardArrow } from './SurveyChrome'

type ContactState = { email: string; name: string }
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
        <SurveyEyebrow>GIỚI THIỆU</SurveyEyebrow>
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

type ContactScreenProps = {
  consent: ConsentChoice
  contact: ContactState
  error?: string
  mode: 'part1' | 'private'
  onBack: () => void
  onConsentChange: (value: ConsentChoice) => void
  onContactChange: (next: ContactState) => void
  onSkipPrivate: () => void
  onSubmit: () => void
}

export function ContactScreen({ consent, contact, error, mode, onBack, onConsentChange, onContactChange, onSkipPrivate, onSubmit }: ContactScreenProps) {
  const isPrivate = mode === 'private'
  const isContactReady = Boolean(contact.name.trim() && contact.email.trim())

  return (
    <section className="survey-form-screen" aria-labelledby="survey-contact-title">

      <SurveyEyebrow>{isPrivate ? 'PHẦN 2 - KHẢO SÁT ĐỊNH DANH · NHẬN BÁO CÁO' : 'PHẦN 1 - KHẢO SÁT KHUYẾT DANH · NHẬN BÁO CÁO'}</SurveyEyebrow>
      <h1 id="survey-contact-title">{isPrivate ? 'Nhận Báo cáo Riêng tư' : 'Nhận Báo cáo Khuyết danh'}</h1>
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
            <input autoComplete="name" id="survey-contact-name" onChange={(event) => onContactChange({ ...contact, name: event.currentTarget.value })} placeholder="Họ và tên" required value={contact.name} />
          </label>
          <label htmlFor="survey-contact-email">
            <span>Email công ty/cá nhân *</span>
            <input autoComplete="email" id="survey-contact-email" onChange={(event) => onContactChange({ ...contact, email: event.currentTarget.value })} placeholder="name@company.com" required type="email" value={contact.email} />
          </label>
        </div>
        {isPrivate && !isContactReady ? (
          <p className="survey-contact-required" role="status"><CircleAlert aria-hidden="true" size={15} /><span>*Vui lòng nhập thông tin trước khi tiếp tục</span></p>
        ) : null}

        {isPrivate ? (
          <section className="survey-privacy-section" aria-labelledby="survey-privacy-title">
            <div className="survey-privacy-heading">
              <LockKeyhole aria-hidden="true" size={18} />
              <h2 id="survey-privacy-title">Bảo mật dữ liệu</h2>
            </div>
            <div className="survey-privacy-copy">
              {contactCopy.privacy.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
            <div aria-disabled={!isContactReady} className="survey-consent-grid" role="radiogroup" aria-label="Đồng ý xử lý dữ liệu">
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
          <button className="survey-primary-button" disabled={isPrivate && consent === 'no'} type="submit">
            {isPrivate ? 'Nhận báo cáo' : 'Nhận báo cáo Phần 1'}
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

export function LoadingScreen({ mode, step }: { mode: 'part1' | 'private'; step: number }) {
  const steps = ['Tổng hợp câu trả lời', 'Đối chiếu dữ liệu', 'Phân tích các nhóm năng lực', 'Tạo báo cáo']

  return (
    <section className="survey-loading-screen" aria-live="polite">
      <SurveyBrandMark decorative variant="trust" />
      <SurveyEyebrow>ĐANG PHÂN TÍCH</SurveyEyebrow>

      <h1>{mode === 'private' ? 'Đang tạo Báo cáo Riêng tư' : 'Đang tạo Báo cáo Khuyết danh'}</h1>
      <p>{mode === 'private' ? 'Tổng hợp kết quả PHẦN 1 - KHẢO SÁT KHUYẾT DANH và 6 câu PHẦN 2 - KHẢO SÁT ĐỊNH DANH.' : 'Tổng hợp 18 câu PHẦN 1 - KHẢO SÁT KHUYẾT DANH.'}</p>
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
      <MarketBenchmarkSection data={marketBenchmarkData} />
      <PersonalScoreSection scores={scores} />
      <DomainAnalysisSection domains={scores.domains} />

      <section className="survey-result-section">
        <ReportSectionHeading number="04" eyebrow="CÂU TRẢ LỜI" title="Câu trả lời của Anh/Chị" />
        <details className="survey-answer-disclosure">
          <summary>Xem 18 câu trả lời <span aria-hidden="true">+</span></summary>
          <div className="survey-answer-list">
            {partOneQuestions.map((question) => (
              <article key={question.n}>
                <strong>{String(question.n).padStart(2, '0')}</strong>
                <div>
                  <p>{question.q}</p>
                  <span>{getAnswerDisplay(question.n, answers, otherAnswers)}</span>
                </div>
              </article>
            ))}
          </div>
        </details>
      </section>

      {isPrivate ? <PrivateAnalysisSection answers={answers} otherAnswers={otherAnswers} /> : null}

      <section className="survey-roundtable-invitation">
        <SurveyEyebrow>CEO ROUNDTABLE</SurveyEyebrow>
        <h2>Tiếp tục cuộc đối thoại cùng nhóm CEO Đồng kiến tạo</h2>
        <p>{roundtableCopy.paragraphs[0]}</p>
        <div className="survey-round-meta">
          {roundtableCopy.meta.map((item) => <span key={item}>{item}</span>)}
        </div>
        <button className="survey-outline-button" onClick={(event) => onOpenRoundtable(event.currentTarget)} type="button">
          Đăng ký tham dự CEO Roundtable
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
        <p className="survey-report-kicker">CEO WORKFORCE INDEX · Q3/2026</p>
        <span className="survey-report-period">BÁO CÁO {isPrivate ? 'RIÊNG TƯ' : 'KHUYẾT DANH'}</span>
        <h1 id="survey-result-title">Báo cáo chẩn đoán<br />Năng lực Lãnh đạo cho Tăng trưởng</h1>
        <p>{isPrivate ? 'Báo cáo Riêng tư · Tổng hợp kết quả Phần 1 và bối cảnh doanh nghiệp từ Phần 2.' : 'Báo cáo Khuyết danh · Tổng hợp kết quả từ 18 câu hỏi đánh giá năng lực lãnh đạo.'}</p>
        <div className="survey-report-meta">
          <span>CEO Workforce Index</span>
          <span>Q3/2026</span>
          <span>{isPrivate ? 'Phần 1 + Phần 2' : 'Phần 1'}</span>
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
        <SurveyEyebrow>{eyebrow}</SurveyEyebrow>
        <h2>{title}</h2>
      </div>
    </div>
  )
}

function MarketBenchmarkSection({ data }: { data: MarketBenchmarkData }) {
  const hasLiveData = data.status === 'live'

  return (
    <section className="survey-result-section survey-market-section">
      <ReportSectionHeading number="01" eyebrow="KẾT QUẢ THỊ TRƯỜNG" title="Bối cảnh năng lực lãnh đạo Q3/2026" />
      <p className="survey-section-lede">Bối cảnh thị trường giúp đặt kết quả trong tổng thể nghiên cứu của CEO Workforce Index.</p>
      {hasLiveData ? (
        <div className="survey-market-metrics">
          {data.metrics.map((metric) => (
            <div key={metric.label}>
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
              <small>{metric.description}</small>
            </div>
          ))}
        </div>
      ) : (
        <div className="survey-market-pending" role="status">
          <strong>Đối chuẩn thị trường {data.period}</strong>
          <p>Dữ liệu đối chuẩn thị trường đang được tổng hợp trong kỳ nghiên cứu {data.period}.</p>
        </div>
      )}
    </section>
  )
}
function PersonalScoreSection({ scores }: { scores: ScoreSet }) {
  return (
    <section className="survey-result-section">
      <ReportSectionHeading number="02" eyebrow="KẾT QUẢ CỦA ANH/CHỊ" title="Tổng quan từ Phần 1" />
      <p className="survey-section-lede">Điểm được tính trực tiếp từ các câu trả lời thuộc bộ câu hỏi đánh giá năng lực lãnh đạo.</p>
      <div className="survey-score-rows">
        <ScoreRow label="Leadership Capacity" value={scores.overall} />
        <ScoreRow label="Scale Readiness" value={scores.scale} />
      </div>
    </section>
  )
}

function DomainAnalysisSection({ domains }: { domains: ScoreSet['domains'] }) {
  return (
    <section className="survey-result-section">
      <ReportSectionHeading number="03" eyebrow="5 NHÓM NĂNG LỰC" title="Hồ sơ 5 nhóm năng lực" />
      <p className="survey-section-lede">Điểm của từng nhóm được tổng hợp từ các câu hỏi trong Phần 1. Biểu đồ radar giúp nhìn nhanh hình thái tổng thể, trong khi thanh điểm cho biết giá trị cụ thể của từng nhóm năng lực.</p>
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
      <figcaption>Hình thái 5 nhóm năng lực</figcaption>
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

function PrivateAnalysisSection({ answers, otherAnswers }: { answers: Answers; otherAnswers: Answers }) {
  const items = [
    { title: 'Cơ chế ra quyết định', signal: getAnswerDisplay(19, answers, otherAnswers) },
    { title: 'Độ sẵn sàng mở rộng', signal: getAnswerDisplay(20, answers, otherAnswers) },
    { title: 'Mức phụ thuộc vào CEO', signal: getAnswerDisplay(21, answers, otherAnswers) },
    { title: 'Rào cản tăng trưởng', signal: getAnswerDisplay(22, answers, otherAnswers) },
    { title: 'Bối cảnh doanh nghiệp', signal: 'Doanh thu: ' + getAnswerDisplay(23, answers, otherAnswers) + ' · Website: ' + getAnswerDisplay(24, answers, otherAnswers) },
  ]

  return (
    <section className="survey-result-section">
      <ReportSectionHeading number="05" eyebrow="BỐI CẢNH DOANH NGHIỆP" title="Các tín hiệu từ Phần 2" />
      <p className="survey-section-lede">Tổng hợp các thông tin Anh/Chị đã cung cấp về cơ chế ra quyết định, khả năng mở rộng, mức độ phụ thuộc vào CEO và bối cảnh tăng trưởng.</p>
      <div className="survey-private-analysis-list">
        {items.map((item, index) => (
          <article key={item.title}>
            <strong>{String(index + 1).padStart(2, '0')}</strong>
            <div>
              <span>TÍN HIỆU DOANH NGHIỆP</span>
              <h3>{item.title}</h3>
              <p>{item.signal}</p>
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
  onChange: (next: ContactState) => void
  onClose: () => void
  onRegister: () => void
  open: boolean
  registered: boolean
}

export function RoundtableModal({ contact, error, onChange, onClose, onRegister, open, registered }: RoundtableModalProps) {
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
        <div className="survey-modal-head">
          <SurveyEyebrow>CEO ROUNDTABLE</SurveyEyebrow>
          <button aria-label="Đóng" onClick={onClose} ref={initialFocusRef} type="button"><X aria-hidden="true" size={19} /></button>
        </div>
        <h2 id="survey-roundtable-title">{roundtableCopy.title}</h2>
        {roundtableCopy.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        <div className="survey-round-meta">
          {roundtableCopy.meta.map((item) => <span key={item}>{item}</span>)}
        </div>
        <div className="survey-modal-body">
          <div className="survey-form-grid">
            <label htmlFor="survey-roundtable-name"><span>Họ tên *</span><input autoComplete="name" id="survey-roundtable-name" onChange={(event) => onChange({ ...contact, name: event.currentTarget.value })} value={contact.name} /></label>
            <label htmlFor="survey-roundtable-email"><span>Email công ty/cá nhân *</span><input autoComplete="email" id="survey-roundtable-email" onChange={(event) => onChange({ ...contact, email: event.currentTarget.value })} type="email" value={contact.email} /></label>
          </div>
          {error ? <p className="survey-inline-error" role="alert">{error}</p> : null}
          {registered ? <p className="survey-success-message">✓ Anh/Chị đã đăng ký tham dự CEO Roundtable thành công.</p> : null}
          <div className="survey-modal-actions">
            {registered ? (
              <button className="survey-primary-button" onClick={onClose} type="button">Đóng</button>
            ) : (
              <>
                <button className="survey-primary-button" onClick={onRegister} type="button">
                  Đăng ký tham dự
                  <SurveyForwardArrow />
                </button>
                <button className="survey-outline-button" onClick={onClose} type="button">Hủy</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
