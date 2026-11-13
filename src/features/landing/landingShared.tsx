import { SquarePen } from 'lucide-react'
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { getLang, t, tx } from '@/i18n'
import { cn } from '@/lib/cn'
import { figmaAssets } from './figmaAssets'
import spotlightBackground from '@/assets/figma/bg-tieu-diem.webp'
import spotlightBackground2 from '@/assets/figma/bg-tieu-diem2.webp'
import spotlightLineLeft from '@/assets/figma/Line-panel-left.png'
import spotlightLineRight from '@/assets/figma/Line-panel-right.png'
import logoSectionCarouselCwi from '@/assets/figma/logo-section-carousel-cwi.png'
import logoSectionCarouselCwiNoLabels from '@/assets/figma/logo-section-carousel-cwi-nolabels.png'
import mobileLogoStrip from '@/assets/figma/logo-website-mobile.png'
import mobileLogoStripNoLabels from '@/assets/figma/logo-website-mobile-nolabels.png'
import { type AboutCwiCardData, aboutCwiIcons, type AssetImageProps, emitLandingAction, type HeroCarouselCopyText, heroLogoStripLabels, type LandingAction } from './landingContent'

// Components shared by the desktop layout (LandingPage.tsx) and the mobile layout
// (MobileLandingPage.tsx). Their data and helpers are in landingContent.

export function AssetImage({ asset, alt, className, loading = 'lazy', ...props }: AssetImageProps) {
  return (
    <img
      alt={alt}
      className={cn('select-none max-w-none', className)}
      draggable={false}
      loading={loading}
      src={figmaAssets[asset]}
      {...props}
    />
  )
}

export function RedButton({
  action,
  children,
  className,
  onClick,
}: {
  action: LandingAction
  children: ReactNode
  className?: string
  onClick?: () => void
}) {
  return (
    <button
      className={cn('figma-button-red figma-inter rounded-[53px]', className)}
      data-action={action}
      onClick={() => {
        if (onClick) onClick()
        else emitLandingAction(action)
      }}
      type="button"
    >
      {children}
    </button>
  )
}

export function HeroCarouselCopy({ copy }: { copy: HeroCarouselCopyText }) {
  return (
    <div className={cn('hero-carousel-copy', `hero-carousel-copy--${copy.variant}`)}>
      {copy.eyebrow && <p className="hero-carousel-eyebrow">{t(copy.eyebrow)}</p>}
      <h1 id="hero-title" className="hero-carousel-heading">
        {copy.heading.map((line, lineIndex) => (
          <span className={cn('hero-carousel-copy-line', line.compact && 'is-compact')} key={lineIndex}>
            {line.segments.map((segment, segmentIndex) => (
              <span className={cn(segment.accent && 'hero-carousel-copy-accent')} key={`${lineIndex}-${segmentIndex}`}>
                {t(segment.text)}
              </span>
            ))}
          </span>
        ))}
      </h1>
      <div className="hero-carousel-description">
        {copy.description.map((paragraph) => <p key={paragraph}>{t(paragraph)}</p>)}
      </div>
    </div>
  )
}

export function HeroLogoStrip({ className }: { className: string }) {
  if (getLang() === 'vi') {
    return (
      <picture aria-hidden="true" className={className}>
        <source media="(max-width: 1099px)" srcSet={mobileLogoStrip} />
        <img alt="" draggable={false} src={logoSectionCarouselCwi} />
      </picture>
    )
  }

  return (
    <div aria-hidden="true" className={cn(className, 'hero-logo-strip-en')}>
      <div className="hero-logo-strip-en-frame">
        <picture>
          <source media="(max-width: 1099px)" srcSet={mobileLogoStripNoLabels} />
          <img alt="" draggable={false} src={logoSectionCarouselCwiNoLabels} />
        </picture>
        {heroLogoStripLabels.map(({ label, desktop, mobile }) => (
          <span
            className="hero-logo-strip-label"
            key={label}
            style={{
              '--label-x': `${(desktop[0] / 1656) * 100}%`,
              '--label-y': `${(desktop[1] / 104) * 100}%`,
              '--label-x-mobile': `${(mobile[0] / 1080) * 100}%`,
              '--label-y-mobile': `${(mobile[1] / 1920) * 100}%`,
            } as CSSProperties}
          >
            {tx('logoStrip', label)}
          </span>
        ))}
      </div>
    </div>
  )
}

export function SpotlightEditorial({ mobile = false }: { mobile?: boolean }) {
  return (
    <article className="spotlight-editorial" style={{ backgroundImage: 'url(' + spotlightBackground + ')' }}>
      <div className="spotlight-editorial-brand">
        <AssetImage alt="CEO Workforce Index" asset="cwiLogo" className="spotlight-editorial-logo" loading="eager" />
        <span aria-hidden="true" className="spotlight-editorial-divider" />
        <span>{t('Tiêu điểm quý')}</span>
      </div>
      <h2 className="spotlight-editorial-title" id={mobile ? 'mobile-report-title' : 'report-title'}>
        <span>Q3/2026</span> {t('Năng lực lãnh đạo')}
      </h2>
      <p className="spotlight-editorial-subtitle">{t('Nâng cao năng lực lãnh đạo để mở rộng quy mô')}</p>
      <img alt="" aria-hidden="true" className="spotlight-editorial-rule" src={spotlightLineLeft} />
      <div className="spotlight-editorial-meta">
        <strong>Teaser Report</strong>
        <p>{t('Trích lược những phát hiện cốt lõi từ khảo sát CEO toàn cầu & Việt Nam')}</p>
      </div>
    </article>
  )
}

export function SpotlightInfo({ desktop = false }: { desktop?: boolean }) {
  return (
    <article
      className="spotlight-info"
      id={desktop ? 'report-card' : undefined}
      style={{ backgroundImage: 'url(' + spotlightBackground2 + ')' }}
    >
      <div className="spotlight-info-content">
        <h3><span>{t('Báo cáo CEO Workforce Index Q3 2026')}</span></h3>
        <img alt="" aria-hidden="true" className="spotlight-info-rule" src={spotlightLineRight} />
        <p>{t('Giúp hiểu sâu, phân tích và có hành động ngay trong 90 ngày để tăng cường "hệ cộng lực".')}</p>
        <ul>
          <li>{t('Đối chuẩn thị trường để biết doanh nghiệp mình đang ở đâu')}</li>
          <li>{t('Nhận diện những khoảng trống cần lưu ý')}</li>
          <li>{t('Khuyến nghị hành động phù hợp cho doanh nghiệp')}</li>
        </ul>
        <p>{t('Hoàn thành nhanh chóng trong 7 phút.')}</p>
      </div>
      <RedButton action="survey" className="spotlight-cta">
        <SquarePen aria-hidden="true" size={19} strokeWidth={1.8} />
        <span>{t('Bắt đầu khảo sát')}</span>
      </RedButton>
    </article>
  )
}export function AnimatedReportValue({ value, delay }: { value: string; delay: number }) {
  const valueRef = useRef<HTMLSpanElement>(null)
  const [started, setStarted] = useState(false)
  const [displayed, setDisplayed] = useState(0)
  const match = value.match(/\d+/)
  const target = match ? Number(match[0]) : 0
  const numberStart = match?.index ?? 0
  const prefix = match ? value.slice(0, numberStart) : value
  const suffix = match ? value.slice(numberStart + match[0].length) : ""

  useEffect(() => {
    const node = valueRef.current
    if (!node) return
    if (!("IntersectionObserver" in window)) {
      setStarted(true)
      return
    }

    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) {
        setStarted(true)
        observer.disconnect()
      }
    }, { threshold: 0.35 })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!started) return

    let frame = 0
    const startedAt = performance.now() + delay
    const tick = (now: number) => {
      if (now < startedAt) {
        frame = window.requestAnimationFrame(tick)
        return
      }

      const progress = Math.min(1, (now - startedAt) / 1000)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayed(Math.round(target * eased))
      if (progress < 1) frame = window.requestAnimationFrame(tick)
    }

    frame = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(frame)
  }, [delay, started, target])

  return <span ref={valueRef} aria-label={value}>{prefix}{displayed}{suffix}</span>
}

export function AboutCwiCard({ card }: { card: AboutCwiCardData }) {
  const Icon = aboutCwiIcons[card.icon]

  return (
    <article className={cn('about-cwi-card', `about-cwi-card--${card.icon}`)}>
      <div className="about-cwi-card-header">
        <img alt="" aria-hidden="true" className="about-cwi-card-icon" draggable={false} src={Icon} />
        <h3>{t(card.title)}</h3>
      </div>
      <div className="about-cwi-card-body">
        {card.blocks.map((block, index) => {
          if (block.type === 'paragraph') {
            return (
              <p className={cn('about-cwi-card-paragraph', block.muted && 'is-muted')} key={`paragraph-${index}`}>
                {t(block.text)}
              </p>
            )
          }

          if (block.type === 'bullets') {
            return (
              <ul className={cn('about-cwi-card-bullets', block.strong && 'is-strong')} key={`bullets-${index}`}>
                {block.items.map((item) => <li key={item}>{t(item)}</li>)}
              </ul>
            )
          }

          if (block.type === 'labels') {
            return (
              <ul className="about-cwi-card-labels" key={`labels-${index}`}>
                {block.items.map((item) => <li key={item}>{t(item)}</li>)}
              </ul>
            )
          }

          return (
            <div className="about-cwi-card-formula" key={`formula-${index}`}>
              {block.items.map((item) => <span key={item}>{t(item)}</span>)}
            </div>
          )
        })}
      </div>
    </article>
  )
}

export function AboutCwiTitle({ id, className }: { id?: string; className?: string }) {
  return (
    <h2 className={cn('about-cwi-title', className)} id={id}>
      <em>CEO Workforce Index</em> {tx('aboutCwiTitle', 'là thước đo')}
      <br />
      {tx('aboutCwiTitle', 'Hệ cộng lực vận hành doanh nghiệp')}
      <br />
      {tx('aboutCwiTitle', 'hiệu quả')}
    </h2>
  )
}
