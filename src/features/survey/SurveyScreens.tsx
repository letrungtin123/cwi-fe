import { useEffect, useRef } from 'react'
import { CircleAlert, Download, LockKeyhole, X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { contactCopy, introCopy, reportParts, roundtableCopy } from './surveyData'
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
  const privacyParagraphs = isPrivate ? contactCopy.privatePrivacy : [contactCopy.anonymousPrivacy]

  return (
    <section className="survey-form-screen" aria-labelledby="survey-contact-title">
      <SurveyEyebrow>{isPrivate ? 'PHẦN 2 - KHẢO SÁT ĐỊNH DANH · Nhận báo cáo' : 'PHẦN 1 - KHẢO SÁT KHUYẾT DANH · Tải PDF'}</SurveyEyebrow>
      <h1 id="survey-contact-title">{isPrivate ? 'Nhận Báo cáo Riêng tư' : 'Tải Báo cáo Khuyết danh'}</h1>
      {isPrivate ? <p className="survey-thankyou">{contactCopy.thankYou}</p> : null}

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
            <span>Email công ty cá nhân *</span>
            <input autoComplete="email" id="survey-contact-email" onChange={(event) => onContactChange({ ...contact, email: event.currentTarget.value })} placeholder="name@company.com" required type="email" value={contact.email} />
          </label>
        </div>
        {isPrivate && !isContactReady ? (
          <p className="survey-contact-required" role="status"><CircleAlert aria-hidden="true" size={15} /><span>*Vui lòng nhập thông tin trước khi tiếp tục</span></p>
        ) : null}

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
            {isPrivate ? <ConsentOption checked={consent === 'no'} disabled={!isContactReady} id="survey-consent-no" label="Không đồng ý" onChange={() => onConsentChange('no')} /> : null}
          </div>
          {isPrivate && consent === 'no' ? (
            <div className="survey-consent-warning" role="alert">
              <p>Để nhận được báo cáo vui lòng chọn "Đồng ý" để cấp quyền cho chúng tôi xử lý dữ liệu của Anh/Chị.</p>
              <button className="survey-text-button" onClick={onSkipPrivate} type="button">Bỏ qua Phần 2 và nhận báo cáo Phần 1</button>
            </div>
          ) : null}
        </section>

        {error ? <p className="survey-inline-error" role="alert">{error}</p> : null}
        <div className="survey-form-actions">
          <button className="survey-primary-button" disabled={isPrivate && consent === 'no'} type="submit">
            {isPrivate ? 'Nhận báo cáo' : 'Tải xuống PDF'}
            <SurveyForwardArrow />
          </button>
          <button className="survey-outline-button" onClick={onBack} type="button">{isPrivate ? 'Xem lại câu trả lời' : 'Quay lại báo cáo'}</button>
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

export function LoadingScreen({ step }: { step: number }) {
  const steps = ['Tổng hợp câu trả lời', 'Đối chiếu dữ liệu', 'Phân tích các nhóm năng lực', 'Tạo báo cáo']

  return (
    <section className="survey-loading-screen" aria-live="polite">
      <SurveyBrandMark decorative variant="trust" />
      <h1>Đang tạo báo cáo...</h1>
      <p>Hệ thống đang tổng hợp câu trả lời và chuẩn bị báo cáo.</p>
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
  mode: 'part1' | 'private'
  onBackHome: () => void
  onOpenRoundtable: (trigger: HTMLButtonElement) => void
  scores: ScoreSet
}

export function ResultScreen({ mode, onBackHome, onOpenRoundtable, scores }: ResultScreenProps) {
  const isPrivate = mode === 'private'

  return (
    <section className="survey-result-screen" aria-labelledby="survey-result-title">
      <ReportIdentity mode={mode} />
      <MarketBenchmarkSection data={marketBenchmarkData} />
      <PersonalScoreSection scores={scores} />
      <DomainAnalysisSection domains={scores.domains} />

      {isPrivate ? <PrivateAnalysisSection /> : null}

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
        <p className="survey-report-kicker">{isPrivate ? 'PHẦN 2 - KHẢO SÁT ĐỊNH DANH' : 'PHẦN 1 - KHẢO SÁT KHUYẾT DANH'}</p>
        <h1 id="survey-result-title">{isPrivate ? 'Báo cáo Riêng tư' : 'Báo cáo Khuyết danh'}</h1>
        <p>{isPrivate ? 'Tổng cấu trúc: 25 trang = tối đa 20 trang kết quả Phần 1 + 5 trang phân tích sâu và khuyến nghị riêng. Wireframe dưới đây là bản demo rút gọn.' : 'Cấu trúc báo cáo đầy đủ: tối đa 20 trang tùy theo dữ liệu đầu vào. Wireframe dưới đây là bản demo rút gọn.'}</p>
        <div className="survey-report-meta">
          <span>{isPrivate ? 'Phần 1 + Phần 2' : '18 câu · Phần 1'}</span>
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
function PersonalScoreSection({ scores }: { scores: ScoreSet }) {
  return (
    <section className="survey-result-section">
      <ReportSectionHeading number="2." eyebrow="" title="Input của Anh/Chị cho 18 câu hỏi" />
      <p className="survey-section-lede">Tóm tắt các tín hiệu từ câu trả lời của Anh/Chị.</p>
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

function PrivateAnalysisSection() {
  return (
    <section className="survey-result-section">
      <div className="survey-private-analysis-list">
        <article>
          <strong>01</strong>
          <div>
            <span>5 nhóm năng lực</span>
            <h3>Tổng hợp Phần 1</h3>
          </div>
        </article>
        <article>
          <strong>02</strong>
          <div>
            <span>5 trang phân tích riêng cho doanh nghiệp</span>
            <p>Phân tích sâu hơn từ 6 câu PHẦN 2 - KHẢO SÁT ĐỊNH DANH, kèm kiến nghị và giải pháp phù hợp với bối cảnh doanh nghiệp.</p>
          </div>
        </article>
        <article>
          <strong>03</strong>
          <div>
            <span>Mức sẵn sàng mở rộng</span>
            <h3>72/100</h3>
            <p>Chỉ số minh họa cho khả năng scale của doanh nghiệp.</p>
          </div>
        </article>
        <article>
          <strong>04</strong>
          <div>
            <span>Rủi ro vận hành</span>
            <h3>3</h3>
            <p>Nhóm rủi ro ưu tiên được AI gắn cờ để xử lý sớm.</p>
          </div>
        </article>
        <article>
          <strong>05</strong>
          <div>
            <span>Khung hành động</span>
            <h3>90</h3>
            <p>Lộ trình minh họa trong 90 ngày để cải thiện năng lực thực thi.</p>
          </div>
        </article>
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
            <label htmlFor="survey-roundtable-email"><span>Email công ty cá nhân *</span><input autoComplete="email" id="survey-roundtable-email" onChange={(event) => onChange({ ...contact, email: event.currentTarget.value })} type="email" value={contact.email} /></label>
          </div>
          {error ? <p className="survey-inline-error" role="alert">{error}</p> : null}
          {registered ? <p className="survey-success-message">✓ Anh/Chị đã đăng ký tham dự CEO Roundtable thành công.</p> : null}
          <div className="survey-modal-actions">
            {registered ? (
              <button className="survey-primary-button" onClick={onClose} type="button">Tiếp tục xem báo cáo</button>
            ) : (
              <>
                <button className="survey-primary-button" onClick={onRegister} type="button">
                  Đăng ký tham dự
                  <SurveyForwardArrow />
                </button>
                <button className="survey-outline-button" onClick={onClose} type="button">Bỏ qua & xem báo cáo</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
