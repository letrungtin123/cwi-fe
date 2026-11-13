import { useEffect, useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from 'react'
import { getLang, t, tx } from '@/i18n'
import { cn } from '@/lib/cn'
import { type FigmaAssetKey } from './figmaAssets'
import leftPanelBackground from '@/assets/figma/left-panel-bg.webp'
import { useCarouselPause } from './useCarouselPause'
import {
  associationLogos,
  advisors,
  knowledgePartnerLogos,
  mediaPartnerLogos,
  operationalPartnerLogos,
  organizerLogos,
  reportStats,
  roundtableStats,
} from './landingData'
import { aboutCwiCards, HERO_CAROUSEL_INTERVAL_MS, type HeroCarouselCopyText, type HeroCarouselSlide, heroCarouselSlides, legalLinks, openQuarterlyReport, SHOW_HERO_LOGO_STRIP, visibleAdvisors } from './landingContent'
import { AboutCwiCard, AboutCwiTitle, AnimatedReportValue, AssetImage, HeroLogoStrip, RedButton, SpotlightEditorial, SpotlightInfo } from './landingShared'

// The landing page laid out for phones and tablets (windows narrower than LANDING_MOBILE_QUERY).

function MobileStats() {
  return (
    <div className="mobile-stats-list" aria-label={t('Thông số nghiên cứu')}>
      {reportStats.map((stat, index) => (
        <div className="mobile-stat-row" data-reveal key={stat.value}>
          <AssetImage alt="" aria-hidden="true" asset={stat.icon} className="mobile-stat-icon" />
          <div>
            <strong><AnimatedReportValue delay={index * 90} value={t(stat.value)} /></strong>
            <span>{t(stat.label)}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
function MobileSectionTitle({ children }: { children: ReactNode }) {
  return (
    <div className="mobile-section-title" data-reveal>
      <span aria-hidden="true" className="mobile-section-title-line" />
      <strong>{children}</strong>
      <span aria-hidden="true" className="mobile-section-title-line is-right" />
    </div>
  )
}

function MobileAdvisorCard({ advisor, isActive }: { advisor: (typeof advisors)[number]; isActive: boolean }) {
  return (
    <article className={cn('mobile-advisor-card', isActive && 'is-active', advisor.name === 'PHẠM THỊ MỸ LỆ' && 'is-primary-advisor', (advisor.name === 'TRƯƠNG CHÍ DŨNG' || advisor.name === 'PHẠM TIẾN KHA' || advisor.name === 'ĐINH KIM NHUNG' || advisor.name === 'TRẦN QUỐC KHÁNH') && 'is-featured-advisor', advisor.name === 'TRẦN QUỐC KHÁNH' && 'is-tran-quoc-khanh')}>
      <AssetImage alt="" aria-hidden="true" asset={advisor.image} className="mobile-advisor-image" />
      <div className="mobile-advisor-blue" />
      <div className="mobile-advisor-copy">
        <em>{t(advisor.title)}</em>
        <span>{t(advisor.field)}</span>
        <strong>{t(advisor.name)}</strong>
      </div>
    </article>
  )
}

function MobileAdvisorCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)
  const progressStyle = {
    '--mobile-carousel-progress': ((activeIndex + 1) / visibleAdvisors.length) * 100 + '%',
  } as CSSProperties

  useEffect(() => {
    const node = scrollRef.current
    if (!node) return

    let frame = 0
    const syncActive = () => {
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(() => {
        const card = node.querySelector<HTMLElement>('.mobile-advisor-card')
        if (!card) return

        const gap = 16
        const step = card.offsetWidth + gap
        setActiveIndex(Math.min(visibleAdvisors.length - 1, Math.max(0, Math.round(node.scrollLeft / step))))
      })
    }

    syncActive()
    node.addEventListener('scroll', syncActive, { passive: true })

    return () => {
      window.cancelAnimationFrame(frame)
      node.removeEventListener('scroll', syncActive)
    }
  }, [])

  return (
    <div className="mobile-advisor-carousel" data-reveal>
      <div className="mobile-advisor-scroll" aria-label={t('Ban tổ chức')} ref={scrollRef}>
        {visibleAdvisors.map((advisor, index) => (
          <MobileAdvisorCard advisor={advisor} isActive={activeIndex === index} key={advisor.name + '-' + index} />
        ))}
      </div>
      <div className="mobile-carousel-meta" aria-live="polite">
        <span>{String(activeIndex + 1).padStart(2, '0')} / {String(visibleAdvisors.length).padStart(2, '0')}</span>
        <i style={progressStyle} />
      </div>
    </div>
  )
}
type MobileLogoRailVariant = 'organizer' | 'static' | 'marquee' | 'marqueeReverse'

function MobileLogoRail({
  logos,
  variant = "marquee",
}: {
  logos: Array<{ asset: FigmaAssetKey; alt: string }>
  variant?: MobileLogoRailVariant
}) {
  const railRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = railRef.current
    const shouldAnimate = variant === "marquee" || variant === "marqueeReverse"
    if (!node || !shouldAnimate || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let frame = 0
    let last = performance.now()
    let interactionTimeout = 0
    let isInteracting = false

    const pause = () => {
      isInteracting = true
      window.clearTimeout(interactionTimeout)
      interactionTimeout = window.setTimeout(() => {
        isInteracting = false
        last = performance.now()
      }, 900)
    }

    const resume = () => {
      window.clearTimeout(interactionTimeout)
      isInteracting = false
      last = performance.now()
    }

    const tick = (now: number) => {
      const elapsed = Math.min(now - last, 64)
      last = now

      if (!isInteracting) {
        const loopWidth = node.scrollWidth / 2
        if (loopWidth > node.clientWidth) {
          node.scrollLeft += elapsed * 0.06
          if (node.scrollLeft >= loopWidth) node.scrollLeft -= loopWidth
        }
      }

      frame = window.requestAnimationFrame(tick)
    }

    node.addEventListener("pointerdown", pause, { passive: true })
    node.addEventListener("pointerup", resume, { passive: true })
    node.addEventListener("pointercancel", resume, { passive: true })
    node.addEventListener("wheel", pause, { passive: true })
    frame = window.requestAnimationFrame(tick)

    return () => {
      window.cancelAnimationFrame(frame)
      window.clearTimeout(interactionTimeout)
      node.removeEventListener("pointerdown", pause)
      node.removeEventListener("pointerup", resume)
      node.removeEventListener("pointercancel", resume)
      node.removeEventListener("wheel", pause)
    }
  }, [logos.length, variant])

  const isMarquee = variant === "marquee" || variant === "marqueeReverse"

  return (
    <div ref={railRef} className={cn("mobile-logo-rail", "is-" + variant)}>
      <div className="mobile-logo-track">
        {logos.map((logo) => (
          <div className="mobile-logo-item" key={logo.asset + "-" + logo.alt}>
            <AssetImage alt={t(logo.alt)} asset={logo.asset} className="mobile-logo-image" />
          </div>
        ))}
        {isMarquee && logos.map((logo) => (
          <div aria-hidden="true" className="mobile-logo-item" key={logo.asset + "-" + logo.alt + "-duplicate"}>
            <AssetImage alt="" asset={logo.asset} className="mobile-logo-image" />
          </div>
        ))}
      </div>
    </div>
  )
}

function MobileHeroCarouselBackground({ activeIndex }: { activeIndex: number }) {
  return (
    <div aria-hidden="true" className="mobile-hero-carousel-background">
      {heroCarouselSlides.map((slide, index) => (
        <img
          alt=""
          className={cn('mobile-hero-carousel-image', index === activeIndex && 'is-active')}
          draggable={false}
          key={slide.mobileImage ?? slide.image}
          loading={index === 0 ? 'eager' : 'lazy'}
          src={slide.mobileImage ?? slide.image}
        />
      ))}
    </div>
  )
}

function MobileHeroCarouselContent({ copy, showIntro }: { copy?: HeroCarouselCopyText; showIntro?: boolean }) {
  if (showIntro) {
    return (
      <>
        <p className="mobile-eyebrow">{t('LA BÀN ĐỊNH HƯỚNG NĂNG LỰC VẬN HÀNH CỦA TỔ CHỨC')}</p>
        <h1 id="mobile-hero-title">
          <span><span>{t('Hệ cộng lực mạnh')}</span></span>
          <span className="mobile-heading-cluster"><span><em>{tx('slogan', 'Doanh nghiệp')}</em> {tx('slogan', 'vươn tầm')}</span></span>
        </h1>
        <p className="mobile-hero-copy">{t('Tham gia khảo sát của CEO Workforce Index để đối chuẩn Hệ cộng lực (con người - AI - tự động hoá - hệ sinh thái) của doanh nghiệp bạn với thị trường, hiểu nguyên nhân và nhận khuyến nghị hành động.')}</p>
      </>
    )
  }

  if (!copy) return <h1 className="sr-only" id="mobile-hero-title">CEO Workforce Index</h1>

  return (
    <>
      {copy.eyebrow ? <p className="mobile-carousel-eyebrow">{t(copy.eyebrow)}</p> : null}
      <h1 className={cn('mobile-carousel-heading', `is-${copy.variant}`)} id="mobile-hero-title">
        {copy.heading.map((line, lineIndex) => (
          <span className={cn('mobile-carousel-heading-line', line.compact && 'is-compact')} key={lineIndex}>
            {line.segments.map((segment, segmentIndex) => segment.accent
              ? <em key={`${lineIndex}-${segmentIndex}`}>{t(segment.text)}</em>
              : <span key={`${lineIndex}-${segmentIndex}`}>{t(segment.text)}</span>)}
          </span>
        ))}
      </h1>
      <div className="mobile-carousel-description">
        {copy.description.map((paragraph) => <p key={paragraph}>{t(paragraph)}</p>)}
      </div>
    </>
  )
}

function MobileHeroCarouselButton({ onOpenReportPdf, onOpenWebinarModal, slide }: { onOpenReportPdf: () => void; onOpenWebinarModal: () => void; slide: HeroCarouselSlide }) {
  const className = 'figma-button-red mobile-hero-button mobile-carousel-action'
  const content = (
    <>
      <span>{t(slide.ctaLabel)}</span>
      <AssetImage alt="" aria-hidden="true" asset="arrow1" className="mobile-button-arrow h-[15px] w-[17px]" loading="eager" />
    </>
  )

  if (slide.href) {
    return <a className={className} href={slide.href} rel="noopener noreferrer" target="_blank">{content}</a>
  }

  if (slide.opensReportPdf) {
    return <button className={className} data-action="open-report-pdf" onClick={onOpenReportPdf} type="button">{content}</button>
  }

  if (slide.opensWebinarModal) {
    return <button className={className} data-action="open-webinar-info" onClick={onOpenWebinarModal} type="button">{content}</button>
  }

  if (slide.action) {
    return <RedButton action={slide.action} className="mobile-hero-button mobile-carousel-action">{content}</RedButton>
  }

  return <button className={className} type="button">{content}</button>
}

function MobileHeroCarouselProgress({ activeIndex, onSelect }: { activeIndex: number; onSelect: (index: number) => void }) {
  return (
    <div aria-label={t('Điều hướng slide')} className="mobile-hero-carousel-progress" role="group">
      {heroCarouselSlides.map((slide, index) => (
        <button
          aria-current={index === activeIndex ? 'true' : undefined}
          aria-label={t('Xem slide {n}', { n: index + 1 })}
          className={cn('mobile-hero-carousel-progress-item', index === activeIndex && 'is-active')}
          key={slide.image}
          onClick={() => onSelect(index)}
          type="button"
        />
      ))}
    </div>
  )
}

function MobileHeroCarousel({ isWebinarOpen, onOpenWebinar }: { isWebinarOpen: boolean; onOpenWebinar: () => void }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [carouselCycle, setCarouselCycle] = useState(0)
  const { paused, pauseHandlers } = useCarouselPause()
  const swipeStartRef = useRef<{ x: number; y: number; pointerId: number } | null>(null)
  const activeSlide = heroCarouselSlides[activeIndex]
  const restartCarouselCycle = () => setCarouselCycle((currentCycle) => currentCycle + 1)

  const showPreviousSlide = () => {
    setActiveIndex((currentIndex) => (currentIndex - 1 + heroCarouselSlides.length) % heroCarouselSlides.length)
    restartCarouselCycle()
  }

  const showNextSlide = () => {
    setActiveIndex((currentIndex) => (currentIndex + 1) % heroCarouselSlides.length)
    restartCarouselCycle()
  }

  const selectSlide = (index: number) => {
    setActiveIndex(index)
    restartCarouselCycle()
  }

  const handlePointerDown = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === 'mouse') return
    swipeStartRef.current = { x: event.clientX, y: event.clientY, pointerId: event.pointerId }
  }

  const handlePointerUp = (event: PointerEvent<HTMLElement>) => {
    const swipeStart = swipeStartRef.current
    swipeStartRef.current = null

    if (!swipeStart || swipeStart.pointerId !== event.pointerId) return

    const horizontalDistance = event.clientX - swipeStart.x
    const verticalDistance = event.clientY - swipeStart.y
    const minimumSwipeDistance = 48

    if (Math.abs(horizontalDistance) < minimumSwipeDistance || Math.abs(horizontalDistance) <= Math.abs(verticalDistance)) return

    if (horizontalDistance < 0) showNextSlide()
    else showPreviousSlide()
  }

  useEffect(() => {
    if (isWebinarOpen || paused) return

    const intervalId = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % heroCarouselSlides.length)
    }, HERO_CAROUSEL_INTERVAL_MS)

    return () => window.clearInterval(intervalId)
  }, [carouselCycle, isWebinarOpen, paused])

  return (
    <section
      className="mobile-hero"
      data-mobile-target="#top"
      aria-labelledby="mobile-hero-title"
      onPointerCancel={() => { swipeStartRef.current = null }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      {...pauseHandlers}
    >
      <MobileHeroCarouselBackground activeIndex={activeIndex} />
      <div className="mobile-hero-gradient" />
      <AssetImage alt="" aria-hidden="true" asset="group9301" className="mobile-spark mobile-spark-1" loading="eager" />
      <AssetImage alt="" aria-hidden="true" asset="group9303" className="mobile-spark mobile-spark-2" loading="eager" />
      <div className={cn('mobile-hero-content', !activeSlide.showIntro && 'is-carousel-slide')} data-reveal key={activeSlide.image}>
        <MobileHeroCarouselContent copy={activeSlide.copy} showIntro={activeSlide.showIntro} />
        <MobileHeroCarouselButton onOpenReportPdf={openQuarterlyReport} onOpenWebinarModal={onOpenWebinar} slide={activeSlide} />
        {SHOW_HERO_LOGO_STRIP && <HeroLogoStrip className="mobile-hero-logo-strip" />}
      </div>
      <MobileHeroCarouselProgress activeIndex={activeIndex} onSelect={selectSlide} />
    </section>
  )
}

export function MobileLandingPage({
  isWebinarOpen,
  onOpenRoundtable,
  onOpenWebinar,
}: {
  isWebinarOpen: boolean
  onOpenRoundtable: () => void
  onOpenWebinar: () => void
}) {
  // Same reordering as the desktop Roundtable title: "CEO Roundtable" in English.
  const ceoWordmarkFirst = getLang() === 'en'
  const mobileCeoWordmark = <AssetImage alt="CEO" asset="textCeo" className="mobile-text-ceo" loading="eager" />

  return (
    <main className="mobile-landing">
      <MobileHeroCarousel isWebinarOpen={isWebinarOpen} onOpenWebinar={onOpenWebinar} />

      <section className="mobile-section mobile-report-section" data-mobile-target="#report" aria-labelledby="mobile-report-title">
        <div className="spotlight-grid spotlight-grid-mobile" data-reveal>
          <SpotlightEditorial mobile />
          <SpotlightInfo />
        </div>
        <MobileStats />
      </section>
      <section className="mobile-roundtable" data-mobile-target="#roundtable" aria-labelledby="mobile-roundtable-title">
        <AssetImage alt="" aria-hidden="true" asset="bgCircleCeo" className="mobile-roundtable-bg" />
        <div className="mobile-roundtable-content" data-reveal>
          <h2 id="mobile-roundtable-title">
            {ceoWordmarkFirst && mobileCeoWordmark}
            <span>{t('Bàn tròn')}</span>
            {!ceoWordmarkFirst && mobileCeoWordmark}
          </h2>
          <p className="mobile-roundtable-subtitle">{t('Khai mở góc nhìn - Kiến tạo giá trị')}</p>
          <p>{t('Không "thuyết trình". Tranh luận để tìm kiếm những sự thật ngầm hiểu đắt giá nhất. Tham gia Bàn tròn CEO định kỳ dành riêng cho thành viên CWI.')}</p>
          <div className="mobile-roundtable-stats">
            {roundtableStats.map((stat) => (
              <div key={stat.value}>
                <AssetImage alt="" aria-hidden="true" asset={stat.icon} />
                <strong>{t(stat.value)}</strong>
                <span>{t(stat.label)}</span>
              </div>
            ))}
          </div>
          <RedButton action="roundtable" className="mobile-roundtable-button" onClick={onOpenRoundtable}>{t('Đăng kí tham gia')}</RedButton>
        </div>
        <div className="mobile-roundtable-photo-frame" data-reveal>
          <AssetImage alt="Roundtable session" asset="image124" className="mobile-roundtable-photo" />
        </div>
      </section>

      <section className="mobile-section mobile-advisors-section about-cwi-mobile-section" data-mobile-target="#about-cwi" aria-labelledby="mobile-advisors-title">
        <div className="about-cwi-mobile-intro" data-reveal>
          <AboutCwiTitle className="about-cwi-mobile-title" id="mobile-advisors-title" />
          <img alt={t('Cuộc họp lãnh đạo doanh nghiệp')} className="about-cwi-mobile-image" draggable={false} loading="lazy" src={leftPanelBackground} />
        </div>
        <div className="about-cwi-mobile-cards" data-reveal>
          {aboutCwiCards.map((card) => <AboutCwiCard card={card} key={card.title} />)}
        </div>
        <MobileSectionTitle>{t('Ban tổ chức')}</MobileSectionTitle>
        <MobileAdvisorCarousel />
      </section>
      <section className="mobile-section mobile-partners-section" aria-labelledby="mobile-partners-title">
        <h2 id="mobile-partners-title" className="sr-only">{t('Đối tác')}</h2>
        <MobileSectionTitle>{t('Đơn vị bảo trợ')}</MobileSectionTitle>
        <MobileLogoRail logos={associationLogos} variant="static" />
        <MobileSectionTitle>{t('Đối tác tri thức')}</MobileSectionTitle>
        <MobileLogoRail logos={knowledgePartnerLogos} variant="static" />
        <MobileSectionTitle>{t('Đối tác truyền thông')}</MobileSectionTitle>
        <MobileLogoRail logos={mediaPartnerLogos} variant="static" />
        <MobileSectionTitle>{t('Đối tác vận hành')}</MobileSectionTitle>
        <MobileLogoRail logos={operationalPartnerLogos} variant="static" />
        <MobileSectionTitle>{t('Đơn vị tổ chức')}</MobileSectionTitle>
        <MobileLogoRail logos={organizerLogos} variant="static" />
      </section>

      <section className="mobile-final-cta" data-reveal>
        <h2>{t('Hệ cộng lực mạnh')}<br /><em>{tx('slogan', 'Doanh nghiệp')}</em> {tx('slogan', 'vươn tầm')}</h2>
        <RedButton action="survey" className="mobile-hero-button">
          <span>{t('Thực hiện khảo sát')}</span>
          <AssetImage alt="" aria-hidden="true" asset="arrow1" className="mobile-button-arrow h-[15px] w-[17px]" loading="eager" />
        </RedButton>
      </section>

      <footer className="mobile-footer" data-mobile-target="#footer">
        <AssetImage alt="" aria-hidden="true" asset="image131" className="mobile-footer-pattern" />
        <AssetImage alt="CEO Workforce Index" asset="footerLogo" className="mobile-footer-logo" />
        <nav aria-label={t('Thông tin pháp lý')} className="mobile-footer-legal">
          {legalLinks.map((link) => (
            <a href={link.href} key={link.href}>{t(link.label)}</a>
          ))}
        </nav>
        <p className="mobile-footer-contact"><strong>{t('LIÊN HỆ:')}</strong> contact@ceo-workforce-index.com</p>
        <p className="mobile-footer-address">{t('Địa chỉ: 11 Huỳnh Đình Hai, Phường Bình Thạnh, TP.HCM')}</p>
        <p className="mobile-copyright">{t('Bản quyền 2026 Toàn bộ quyền sở hữu trí tuệ thuộc về SKALE')}</p>
      </footer>
    </main>
  )
}
