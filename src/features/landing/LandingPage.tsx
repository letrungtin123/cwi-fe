import { LazyMotion, domAnimation, m, type Variants } from 'framer-motion'
import { SquarePen } from 'lucide-react'
import { useEffect, useRef, useState, type CSSProperties, type ImgHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { figmaAssets, type FigmaAssetKey } from './figmaAssets'
import spotlightBackground from '@/assets/figma/bg-tieu-diem.png'
import spotlightBackground2 from '@/assets/figma/bg-tieu-diem2.png'
import spotlightLineLeft from '@/assets/figma/Line-panel-left.png'
import spotlightLineRight from '@/assets/figma/Line-panel-right.png'
import leftPanelBackground from '@/assets/figma/left-panel-bg.png'
import advisorCardIcon from '@/assets/figma/ban-co-van-chuyen-mon.png'
import coordinationCardIcon from '@/assets/figma/kha-nang-phoi-hop.png'
import decisionCardIcon from '@/assets/figma/khoang-trong-ra-quyet-dinh.png'
import directionCardIcon from '@/assets/figma/giai-phap-dinh-huong.png'
import workforceCardIcon from '@/assets/figma/he-cong-luc.png'
import {
  associationLogos,
  advisors,
  navItems,
  knowledgePartnerLogos,
  mediaPartnerLogos,
  operationalPartnerLogos,
  organizerLogos,
  reportStats,
  roundtableStats,
} from './landingData'
import './landing.css'

type LandingAction = 'login' | 'survey' | 'unlock-report' | 'download-teaser'

const navTargets = ['#top', '#report', '#report-card', '#roundtable', '#about-cwi'] as const
const legalLinks = [
  { href: "/privacy-policy", label: "Chính sách bảo mật" },
  { href: "/terms-of-operation", label: "Quy chế hoạt động" },
] as const

const headerNavSpecs = [
  { href: navTargets[0], label: navItems[0], left: 0, width: 97 },
  { href: navTargets[1], label: navItems[1], left: 107, width: 96 },
  { href: navTargets[2], label: navItems[2], left: 213, width: 82 },
  { href: navTargets[3], label: navItems[3], left: 305, width: 108 },
  { href: navTargets[4], label: navItems[4], left: 423, width: 76 },
] as const

const desktopMotionViewport = { once: true, amount: 0.16, margin: '-96px 0px -120px 0px' } as const

const desktopSectionReveal: Variants = {
  hidden: { opacity: 0, scale: 0.988, y: 54 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.82, ease: [0.22, 1, 0.36, 1] },
  },
}

const desktopHeroReveal: Variants = {
  hidden: { opacity: 0, scale: 1.012, y: 16 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.95, ease: [0.22, 1, 0.36, 1] },
  },
}
const FIGMA_CANVAS_WIDTH = 1440
const FIGMA_CANVAS_HEIGHT = 4758
const figmaScrollTargets: Record<(typeof navTargets)[number], number> = {
  '#top': 0,
  '#report': 874,
  '#report-card': 874,
  '#roundtable': 1710,
  '#about-cwi': 2420,
}

function getViewportScale() {
  if (typeof window === 'undefined') return 1

  const viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
  return Math.min(1, viewportWidth / FIGMA_CANVAS_WIDTH)
}

function useFigmaViewportScale() {
  const [scale, setScale] = useState(getViewportScale)

  useEffect(() => {
    let frame = 0
    const syncScale = () => {
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(() => setScale(getViewportScale()))
    }

    syncScale()
    window.addEventListener('resize', syncScale)
    window.addEventListener('orientationchange', syncScale)
    window.visualViewport?.addEventListener('resize', syncScale)

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('resize', syncScale)
      window.removeEventListener('orientationchange', syncScale)
      window.visualViewport?.removeEventListener('resize', syncScale)
    }
  }, [])

  return scale
}

function scrollElementToCenter(target: HTMLElement) {
  const viewportHeight = window.visualViewport?.height ?? window.innerHeight
  const rect = target.getBoundingClientRect()
  const rawTop = window.scrollY + rect.top - (viewportHeight - rect.height) / 2
  const maxTop = Math.max(0, document.documentElement.scrollHeight - viewportHeight)
  const top = Math.max(0, Math.min(maxTop, rawTop))
  window.scrollTo({ behavior: 'smooth', top: Math.round(top) })
}

function scrollToFigmaTarget(href: (typeof navTargets)[number], scale: number) {
  const target = document.querySelector<HTMLElement>(href)
  window.history.replaceState(null, '', href)

  if (target && (href === '#report' || href === '#roundtable' || href === '#about-cwi')) {
    scrollElementToCenter(target)
    return
  }

  const targetTop = figmaScrollTargets[href] * scale
  window.scrollTo({ behavior: 'smooth', top: Math.round(targetTop) })
}

function scrollToMobileTarget(href: (typeof navTargets)[number]) {
  const selector = '[data-mobile-target=' + JSON.stringify(href) + ']'
  const target = document.querySelector<HTMLElement>(selector)
  if (!target) return

  window.history.replaceState(null, '', href)

  if (href === '#report' || href === '#roundtable' || href === '#about-cwi') {
    scrollElementToCenter(target)
    return
  }

  const offset = 88
  const top = target.getBoundingClientRect().top + window.scrollY - offset
  window.scrollTo({ behavior: 'smooth', top: Math.max(0, Math.round(top)) })
}

function emitLandingAction(action: LandingAction) {
  window.dispatchEvent(new CustomEvent('cwi:landing-action', { detail: { action } }))
}

type AssetImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  asset: FigmaAssetKey
  alt: string
}

function AssetImage({ asset, alt, className, loading = 'lazy', ...props }: AssetImageProps) {
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

function RedButton({
  action,
  children,
  className,
}: {
  action: LandingAction
  children: ReactNode
  className?: string
}) {
  return (
    <button
      className={cn('figma-button-red figma-inter rounded-[53px]', className)}
      data-action={action}
      onClick={() => emitLandingAction(action)}
      type="button"
    >
      {children}
    </button>
  )
}

type SectionLabelTag = 'div' | 'h2' | 'h3'

type SectionLabelLine = {
  asset: FigmaAssetKey
  left: number
  width: number
  flip?: boolean
}

function FigmaSectionLabel({
  as,
  className,
  label,
  leftLine,
  lineTop = 9,
  rightLine,
  textLeft,
  textWidth,
}: {
  as?: SectionLabelTag
  className?: string
  label: string
  leftLine: SectionLabelLine
  lineTop?: number
  rightLine: SectionLabelLine
  textLeft: number
  textWidth: number
}) {
  const Tag = as ?? 'div'

  return (
    <Tag className={cn('figma-section-label-frame', className)}>
      <AssetImage
        alt=""
        aria-hidden="true"
        asset={leftLine.asset}
        className="absolute h-px"
        style={{ left: leftLine.left, top: lineTop, width: leftLine.width }}
      />
      <span className="figma-section-label-text" style={{ left: textLeft, width: textWidth }}>
        {label}
      </span>
      <AssetImage
        alt=""
        aria-hidden="true"
        asset={rightLine.asset}
        className={cn('absolute h-px', rightLine.flip && '-scale-y-100 rotate-180')}
        style={{ left: rightLine.left, top: lineTop, width: rightLine.width }}
      />
    </Tag>
  )
}
function Header({ scale, isPolicyPage = false }: { scale: number; isPolicyPage?: boolean }) {
  const [isHidden, setIsHidden] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const lastScrollYRef = useRef(0)
  const tickingRef = useRef(false)

  useEffect(() => {
    const hideThreshold = 92
    const topLock = 12

    const syncHeader = (scrollY: number) => {
      if (scrollY <= topLock) {
        setIsHidden(false)
        lastScrollYRef.current = scrollY
        return
      }

      const previousY = lastScrollYRef.current
      const delta = scrollY - previousY

      if (delta < 0) {
        setIsHidden(false)
      } else if (delta > 0 && scrollY > hideThreshold) {
        setIsHidden(true)
      }

      lastScrollYRef.current = scrollY
    }

    const handleScroll = () => {
      if (tickingRef.current) return

      tickingRef.current = true
      window.requestAnimationFrame(() => {
        syncHeader(window.scrollY || window.pageYOffset)
        tickingRef.current = false
      })
    }

    const handleWheel = (event: WheelEvent) => {
      if (event.target instanceof Element && event.target.closest('.about-cwi-card-viewport')) return

      const scrollY = window.scrollY || window.pageYOffset

      if (scrollY <= topLock) {
        setIsHidden(false)
        return
      }

      if (event.deltaY < 0) {
        setIsHidden(false)
      } else if (event.deltaY > 0 && scrollY > hideThreshold) {
        setIsHidden(true)
      }
    }

    lastScrollYRef.current = window.scrollY || window.pageYOffset
    syncHeader(lastScrollYRef.current)
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('wheel', handleWheel, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('wheel', handleWheel)
    }
  }, [])

  useEffect(() => {
    if (!isMenuOpen) return

    setIsHidden(false)
    const previousOverflow = document.body.style.overflow
    const menuButton = menuButtonRef.current
    document.body.style.overflow = 'hidden'
    const focusableSelector = 'button, a[href]'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false)
        return
      }

      if (event.key !== 'Tab') return
      const panel = document.getElementById('mobile-navigation-menu')
      const focusable = panel
        ? Array.from(panel.querySelectorAll<HTMLElement>(focusableSelector))
        : []
      if (focusable.length === 0) return

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

    window.requestAnimationFrame(() => document.querySelector<HTMLElement>('#mobile-navigation-menu button')?.focus())
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
      menuButton?.focus()
    }
  }, [isMenuOpen])

  const handleMobileNav = (href: (typeof navTargets)[number]) => {
    setIsMenuOpen(false)
    if (isPolicyPage) {
      window.location.assign('/' + href)
      return
    }
    window.setTimeout(() => scrollToMobileTarget(href), 120)
  }

  return (
    <>
      <header className={cn('figma-site-header', isHidden && !isMenuOpen && 'header--hidden', isMenuOpen && 'mobile-menu-is-open')}>
        <div className="absolute left-[55px] top-[15px] h-[49px] w-[1110px]">
          <AssetImage alt="CEO Workforce Index" asset="cwiLogo" className="figma-header-logo absolute left-0 top-0 h-[49px] w-[108px]" loading="eager" />
          <nav aria-label="Main navigation" className="figma-header-nav figma-inter absolute left-[351px] top-[17px] h-[19px] w-[499px] whitespace-nowrap text-[16px] font-normal leading-[19px] text-black">
            {headerNavSpecs.map((item) => (
              <a
                className="absolute top-0 h-[19px] cursor-pointer whitespace-nowrap leading-[19px] no-underline"
                href={isPolicyPage ? '/' + item.href : item.href}
                key={item.label}
                onClick={(event) => {
                  if (isPolicyPage) return
                  event.preventDefault()
                  scrollToFigmaTarget(item.href, scale)
                }}
                style={{ left: item.left, width: item.width }}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="figma-header-language absolute left-[878px] top-[11px] h-[30px] w-[60px]">
            <AssetImage alt="" aria-hidden="true" asset="line38" className="figma-header-chrome-icon absolute left-[59px] top-0 h-[30px] w-[1px]" loading="eager" />
            <AssetImage alt="" aria-hidden="true" asset="iconLanguage" className="figma-header-chrome-icon absolute left-0 top-[7px] h-[18px] w-[18px]" loading="eager" />
            <span className="figma-inter absolute left-[25px] top-[6px] whitespace-nowrap text-[16px] font-medium leading-[19px] text-black underline">EN</span>
          </div>
          <RedButton action="login" className="figma-header-login-button absolute left-[954px] top-[5px] h-[41px] w-[144px] whitespace-nowrap text-[16px] font-medium">
            Đăng nhập
          </RedButton>
          <button
            aria-controls="mobile-navigation-menu"
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? 'Đóng menu' : 'Mở menu'}
            className="mobile-menu-button"
            onClick={() => setIsMenuOpen((open) => !open)}
            ref={menuButtonRef}
            type="button"
          >
            <span />
            <span />
          </button>
        </div>
      </header>

      <div
        aria-hidden={!isMenuOpen}
        className={cn('mobile-menu-overlay', isMenuOpen && 'is-open')}
        id="mobile-navigation-menu"
        onClick={(event) => {
          if (event.target === event.currentTarget) setIsMenuOpen(false)
        }}
      >
        <div className="mobile-menu-panel" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-label="Điều hướng mobile">
          <div className="mobile-menu-topline">
            <button aria-label="Đóng menu" className="mobile-menu-close" onClick={() => setIsMenuOpen(false)} type="button">×</button>
          </div>
          <nav className="mobile-menu-nav" aria-label="Mobile navigation">
            {navItems.map((label, index) => (
              <button key={label} onClick={() => handleMobileNav(navTargets[index])} style={{ '--item-index': index } as CSSProperties} type="button">
                <span>{String(index + 1).padStart(2, '0')}</span>
                {label}
              </button>
            ))}
          </nav>
          <div className="mobile-menu-footer-row">
            <div className="mobile-menu-language">
              <AssetImage alt="" aria-hidden="true" asset="iconLanguage" />
              <span>Language: <strong>EN</strong></span>
            </div>
            <RedButton action="survey" className="mobile-menu-cta" >
              <span>Thực hiện khảo sát</span>
              <AssetImage alt="" aria-hidden="true" asset="arrow1" className="h-[15px] w-[17px]" loading="eager" />
            </RedButton>
          </div>
        </div>
      </div>
    </>
  )
}
export function SiteHeader({ isPolicyPage = false }: { isPolicyPage?: boolean }) {
  const scale = useFigmaViewportScale()
  return <Header isPolicyPage={isPolicyPage} scale={scale} />
}
function Sparkles() {
  const dots: Array<{ asset: FigmaAssetKey; x: number; y: number }> = [
    { asset: 'group9301', x: 271, y: 265 },
    { asset: 'group9301', x: 143, y: 471 },
    { asset: 'group9301', x: 351, y: 570 },
    { asset: 'group9303', x: 1098, y: 349 },
    { asset: 'group9303', x: 1185, y: 550 },
    { asset: 'group9303', x: 1295, y: 333 },
  ]

  return dots.map((dot) => (
    <AssetImage
      alt=""
      aria-hidden="true"
      asset={dot.asset}
      className="absolute h-[16px] w-[16px]"
      key={`${dot.x}-${dot.y}`}
      loading="eager"
      style={{ left: dot.x - 5, top: dot.y - 5 }}
    />
  ))
}

function HeroSection() {
  return (
    <m.section animate="show" className="absolute left-0 top-0 h-[940px] w-full overflow-hidden" initial="hidden" variants={desktopHeroReveal} aria-labelledby="hero-title">
      <AssetImage alt="" aria-hidden="true" asset="image75Bg" className="figma-hero-bg absolute left-[-67px] top-0 h-[929px] w-[1574px]" loading="eager" />
      <div className="figma-hero-gradient absolute left-[-1px] top-0 h-[940px] w-[1442px]" />
      <AssetImage alt="" aria-hidden="true" asset="rectangle4329" className="absolute left-0 top-[763px] h-[156px] w-[1440px] object-cover" loading="eager" />
      <Sparkles />
      <p className="absolute left-[440px] top-[220px] w-[560px] whitespace-nowrap text-center text-[16px] font-medium uppercase leading-[19px] text-[#13e6d0]">
        LA BÀN ĐỊNH HƯỚNG NĂNG LỰC VẬN HÀNH CỦA TỔ CHỨC
      </p>
      <h1 id="hero-title" className="absolute left-[236px] top-[254px] w-[968px] text-center text-[81px] font-medium leading-[90px] text-white">
        <span className="block">Hệ cộng lực mạnh</span>
        <span className="block">
          <em className="figma-text-gradient font-semibold italic">Doanh nghiệp</em> vươn tầm
        </span>
      </h1>
      <p className="figma-hero-body-copy absolute left-[370px] top-[449px] w-[700px] text-center">
        Tham gia khảo sát của CEO Workforce Index để đối chuẩn Hệ cộng lực (con người - AI - tự động hoá - hệ sinh thái) của doanh nghiệp bạn với thị trường, hiểu nguyên nhân và nhận khuyến nghị hành động.
      </p>
      <RedButton action="survey" className="figma-hero-survey-button absolute left-[564px] top-[539px] h-[60px] w-[313px] text-[22px] font-medium">
        <span>Thực hiện khảo sát</span>
        <AssetImage alt="" aria-hidden="true" asset="arrow1" className="h-[15px] w-[17px]" loading="eager" />
      </RedButton>
    </m.section>
  )
}

function SpotlightEditorial({ mobile = false }: { mobile?: boolean }) {
  return (
    <article className="spotlight-editorial" style={{ backgroundImage: 'url(' + spotlightBackground + ')' }}>
      <div className="spotlight-editorial-brand">
        <AssetImage alt="CEO Workforce Index" asset="cwiLogo" className="spotlight-editorial-logo" loading="eager" />
        <span aria-hidden="true" className="spotlight-editorial-divider" />
        <span>Tiêu điểm quý</span>
      </div>
      <h2 className="spotlight-editorial-title" id={mobile ? 'mobile-report-title' : 'report-title'}>
        <span>Q3/2026</span> Năng lực lãnh đạo
      </h2>
      <p className="spotlight-editorial-subtitle">Nâng cao năng lực lãnh đạo để mở rộng quy mô</p>
      <img alt="" aria-hidden="true" className="spotlight-editorial-rule" src={spotlightLineLeft} />
      <div className="spotlight-editorial-meta">
        <strong>Teaser Report</strong>
        <p>Trích lược những phát hiện cốt lõi từ khảo sát CEO toàn cầu &amp; Việt Nam</p>
      </div>
    </article>
  )
}

function SpotlightInfo({ desktop = false }: { desktop?: boolean }) {
  return (
    <article
      className="spotlight-info"
      id={desktop ? 'report-card' : undefined}
      style={{ backgroundImage: 'url(' + spotlightBackground2 + ')' }}
    >
      <div className="spotlight-info-content">
        <h3><span>Báo cáo CEO Workforce Index Q3 2026</span></h3>
        <img alt="" aria-hidden="true" className="spotlight-info-rule" src={spotlightLineRight} />
        <p>Giúp hiểu sâu, phân tích và có hành động ngay trong 90 ngày để tăng cường &quot;hệ cộng lực&quot;.</p>
        <ul>
          <li>Đối chuẩn thị trường để biết doanh nghiệp mình đang ở đâu</li>
          <li>Nhận diện những khoảng trống cần lưu ý</li>
          <li>Khuyến nghị hành động phù hợp cho doanh nghiệp</li>
        </ul>
        <p>Hoàn thành nhanh chóng trong 7 phút.</p>
      </div>
      <RedButton action="survey" className="spotlight-cta">
        <SquarePen aria-hidden="true" size={19} strokeWidth={1.8} />
        <span>Bắt đầu khảo sát</span>
      </RedButton>
    </article>
  )
}

function ReportSection() {
  return (
    <m.section
      id="report"
      className="spotlight-section absolute left-0 top-[874px] h-[563px] w-full"
      initial="hidden"
      whileInView="show"
      viewport={desktopMotionViewport}
      variants={desktopSectionReveal}
      aria-labelledby="report-title"
    >
      <div className="spotlight-grid">
        <SpotlightEditorial />
        <SpotlightInfo desktop />
      </div>
    </m.section>
  )
}function AnimatedReportValue({ value, delay }: { value: string; delay: number }) {
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

function ReportStatsSection() {
  return (
    <m.section
      className="absolute left-0 top-[1490px] h-[180px] w-full"
      initial="hidden"
      whileInView="show"
      viewport={desktopMotionViewport}
      variants={desktopSectionReveal}
      aria-label="Thông số nghiên cứu"
    >
      <div className="absolute left-[234.375px] top-0 h-[147px] w-[971.25px]">
        {[323.75, 647.5].map((left) => (
          <div className="absolute top-[32px] h-[104px] w-px bg-[#d9d9d9]" key={left} style={{ left }} />
        ))}
        {reportStats.map((stat, index) => {
          const slots = [
            { left: 0, width: 323.75 },
            { left: 323.75, width: 323.75 },
            { left: 647.5, width: 323.75 },
          ]

          return (
            <div className="absolute top-0 h-full text-center" key={stat.value} style={slots[index]}>
              <AssetImage alt="" aria-hidden="true" asset={stat.icon} className="absolute left-1/2 top-[26px] h-[46px] w-[60px] -translate-x-1/2 object-contain" />
              <strong className="absolute left-0 top-[84px] w-full text-center text-[18px] font-medium leading-[22px] text-[#144eaf]">
                <AnimatedReportValue delay={index * 90} value={stat.value} />
              </strong>
              <span className="absolute left-0 top-[108px] w-full text-center text-[14px] font-normal leading-[18px] text-black">{stat.label}</span>
            </div>
          )
        })}
      </div>
    </m.section>
  )
}
function RoundtableSection() {
  return (
    <m.section id="roundtable" className="absolute left-[40px] top-[1710px] h-[640px] w-[1360px] overflow-hidden rounded-[20px]" initial="hidden" whileInView="show" viewport={desktopMotionViewport} variants={desktopSectionReveal} aria-labelledby="roundtable-title">
      <AssetImage alt="" aria-hidden="true" asset="bgCircleCeo" className="absolute inset-0 h-full w-full object-cover" />

      <div className="absolute left-[70px] top-[94px] w-[420px] text-white">
        <h2 id="roundtable-title" className="flex h-[36px] items-start gap-[6px] text-[30px] font-medium leading-[36px]">
          <span>Bàn tròn</span>
          <AssetImage
            alt="CEO"
            asset="textCeo"
            className="mt-[-2px] h-[32.5px] w-[64px] object-contain"
            loading="eager"
          />
        </h2>
        <p className="mt-0 text-[18px] font-normal leading-[22px]">Khai mở góc nhìn - Kiến tạo giá trị</p>
        <p className="mt-[8px] w-[420px] text-[16px] font-normal leading-[20px]">
          Không &quot;thuyết trình&quot;. Tranh luận để tìm kiếm những sự thật ngầm hiểu đắt giá nhất. Tham gia Bàn tròn CEO định kỳ dành riêng cho thành viên CWI.
        </p>
      </div>

      <div className="absolute left-[70px] top-[278px] h-[116px] w-[434px] text-white">
        <div className="absolute left-[207px] top-[0px] h-[93px] w-px bg-white/35" />
        {roundtableStats.map((stat, index) => {
          const slots = [
            { left: 0, width: 177 },
            { left: 238, width: 196 },
          ]
          const slot = slots[index]

          return (
            <div className="absolute top-0 h-full text-center" key={stat.value} style={slot}>
              <AssetImage alt="" aria-hidden="true" asset={stat.icon} className="absolute left-1/2 top-0 h-[37px] w-[49px] -translate-x-1/2 object-contain" />
              <strong className="absolute left-0 top-[53px] w-full whitespace-nowrap text-[20px] font-medium leading-[24px]">{stat.value}</strong>
              <span className="absolute left-0 top-[78px] w-full text-[16px] font-normal leading-[20px]">{stat.label}</span>
            </div>
          )
        })}
      </div>


      <RedButton action="survey" className="absolute left-[70px] top-[435px] h-[50px] w-[330px] text-[16px] font-medium">
        Đăng kí tham gia
      </RedButton>
      <div className="absolute left-[594px] top-[80px] h-[480px] w-[686px] rounded-[16px] border border-white/90 p-[9px]">
        <AssetImage alt="Roundtable session" asset="image124" className="h-full w-full rounded-[8px] object-cover" />
      </div>
    </m.section>
  )
}
type AboutCwiIconName = 'advisors' | 'decision' | 'workforce' | 'coordination' | 'direction'

const aboutCwiIcons = {
  advisors: advisorCardIcon,
  decision: decisionCardIcon,
  workforce: workforceCardIcon,
  coordination: coordinationCardIcon,
  direction: directionCardIcon,
} as const

type AboutCwiCardBlock =
  | { type: 'paragraph'; text: string; muted?: boolean }
  | { type: 'bullets'; items: string[]; strong?: boolean }
  | { type: 'labels'; items: string[] }
  | { type: 'formula'; items: string[] }

type AboutCwiCardData = {
  icon: AboutCwiIconName
  title: string
  blocks: AboutCwiCardBlock[]
}

const aboutCwiCards: AboutCwiCardData[] = [
  {
    icon: 'advisors',
    title: 'Ban cố vấn chuyên môn',
    blocks: [
      {
        type: 'paragraph',
        text: 'Suốt hàng chục năm qua, các thành viên Ban Cố vấn chuyên môn của CEO Workforce Index đã đồng hành cùng hàng nghìn doanh nghiệp trong và ngoài nước giải quyết những bài toán then chốt về con người, năng lực lãnh đạo và hiệu quả tổ chức.',
      },
      {
        type: 'paragraph',
        text: 'Kinh nghiệm của Ban Cố vấn được tích lũy qua nhiều vai trò — từ điều hành doanh nghiệp, quản trị nhân lực, tư vấn tổ chức đến nghiên cứu và phát triển lãnh đạo.',
      },
    ],
  },
  {
    icon: 'decision',
    title: 'Khoảng trống ra quyết định của CEO',
    blocks: [
      {
        type: 'paragraph',
        text: 'Từ thực tiễn đó, Ban Cố vấn nhận thấy một khoảng trống quan trọng trong quá trình ra quyết định của CEO, lãnh đạo thường có nhiều dữ liệu về:',
      },
      { type: 'labels', items: ['Tài chính', 'Thị trường', 'Khách hàng'] },
      {
        type: 'paragraph',
        text: 'Nhưng lại thiếu thông tin có hệ thống để đánh giá liệu tổ chức có đủ năng lực thực thi chiến lược tăng trưởng hay không.',
      },
    ],
  },
  {
    icon: 'workforce',
    title: 'Hệ cộng lực',
    blocks: [
      {
        type: 'paragraph',
        text: 'Khoảng trống này ngày càng lớn khi năng lực tạo ra giá trị của doanh nghiệp không còn chỉ đến từ con người, một phần đến từ:',
      },
      {
        type: 'bullets',
        strong: true,
        items: ['AI, dữ liệu và tự động hóa', 'Đối tác, cộng đồng chuyên gia và các hệ sinh thái bên ngoài'],
      },
      {
        type: 'paragraph',
        text: 'Điều CEO cần quản trị không còn thuần là quy mô nhân sự, mà là chất lượng của Hệ cộng lực — toàn bộ con người, AI, công nghệ, dữ liệu và các nguồn lực được doanh nghiệp tổ chức, kết nối và vận hành để cùng tạo ra giá trị.',
      },
    ],
  },
  {
    icon: 'coordination',
    title: 'Khả năng phối hợp',
    blocks: [
      {
        type: 'paragraph',
        text: 'Điều quan trọng không nằm ở từng thành phần riêng lẻ, mà ở khả năng phối hợp giữa các thành phần đó, một doanh nghiệp có thể sở hữu:',
      },
      { type: 'formula', items: ['Nhân sự giỏi', 'Công nghệ hiện đại', 'Nguồn dữ liệu lớn'] },
      {
        type: 'paragraph',
        muted: true,
        text: 'nhưng vẫn không tạo ra kết quả nếu các nguồn lực này vận hành rời rạc hoặc không gắn với ưu tiên chiến lược.',
      },
    ],
  },
  {
    icon: 'direction',
    title: 'Giải pháp / Định hướng',
    blocks: [
      {
        type: 'paragraph',
        text: 'CEO Workforce Index ra đời từ trăn trở ấy — một la bàn tri thức và đối chuẩn về Hệ cộng lực vận hành doanh nghiệp hiệu quả dành cho CEO và lãnh đạo cấp cao.',
      },
      {
        type: 'paragraph',
        text: 'Thông qua dữ liệu được phân tích chuyên sâu với sự hỗ trợ của AI, dự án giúp lãnh đạo đo lường mức độ sẵn sàng của tổ chức, nhận diện khoảng cách giữa mục tiêu tăng trưởng và năng lực thực thi, từ đó xác định những ưu tiên cần phát triển để tổ chức tạo ra giá trị bền vững hơn.',
      },
    ],
  },
]

function AboutCwiCard({ card }: { card: AboutCwiCardData }) {
  const Icon = aboutCwiIcons[card.icon]

  return (
    <article className={cn('about-cwi-card', `about-cwi-card--${card.icon}`)}>
      <div className="about-cwi-card-header">
        <img alt="" aria-hidden="true" className="about-cwi-card-icon" draggable={false} src={Icon} />
        <h3>{card.title}</h3>
      </div>
      <div className="about-cwi-card-body">
        {card.blocks.map((block, index) => {
          if (block.type === 'paragraph') {
            return (
              <p className={cn('about-cwi-card-paragraph', block.muted && 'is-muted')} key={`paragraph-${index}`}>
                {block.text}
              </p>
            )
          }

          if (block.type === 'bullets') {
            return (
              <ul className={cn('about-cwi-card-bullets', block.strong && 'is-strong')} key={`bullets-${index}`}>
                {block.items.map((item) => <li key={item}>{item}</li>)}
              </ul>
            )
          }

          if (block.type === 'labels') {
            return (
              <ul className="about-cwi-card-labels" key={`labels-${index}`}>
                {block.items.map((item) => <li key={item}>{item}</li>)}
              </ul>
            )
          }

          return (
            <div className="about-cwi-card-formula" key={`formula-${index}`}>
              {block.items.map((item) => <span key={item}>{item}</span>)}
            </div>
          )
        })}
      </div>
    </article>
  )
}

function AboutCwiTitle({ id, className }: { id?: string; className?: string }) {
  return (
    <h2 className={cn('about-cwi-title', className)} id={id}>
      <em>CEO Workforce Index</em> là thước đo
      <br />
      Hệ cộng lực vận hành doanh nghiệp
      <br />
      hiệu quả
    </h2>
  )
}

type AdvisorTextSpec = {
  alignRight?: boolean
  color: string
  fontSize: number
  fontWeight: number
  italic?: boolean
  left: number
  nowrap?: boolean
  text: string
  top: number
  translateXFull?: boolean
  uppercase?: boolean
  width?: number
}

type AdvisorImageSpec = {
  frame: { left: number; top: number; width: number; height: number; roundedTopLeft?: boolean }
  image?: { left: number | string; top: number | string; width: number | string; height: number | string }
  objectCover?: boolean
  transform?: string
  transformOrigin?: string
}

type AdvisorCardSpec = {
  advisor: (typeof advisors)[number]
  field: AdvisorTextSpec
  image: AdvisorImageSpec
  left: number
  name: AdvisorTextSpec
  title: AdvisorTextSpec
  top: number
}

const advisorCardSpecs: AdvisorCardSpec[] = [
  {
    advisor: advisors[0],
    left: 0,
    top: 49,
    image: { frame: { left: -31, top: 8, width: 228, height: 328 }, objectCover: true, transform: 'scale(1.22)' },
    title: { text: 'Chủ tịch', left: 214.44, top: 234.78, width: 138.44, translateXFull: true, alignRight: true, color: '#fff', fontSize: 12, fontWeight: 300 },
    field: { text: 'Hội đồng Quản trị\nL&A Holdings', left: 214.44, top: 251.78, width: 102.01, translateXFull: true, alignRight: true, color: '#fff', fontSize: 12, fontWeight: 400 },
    name: { text: 'PHẠM THỊ MỸ LỆ', left: 214.14, top: 291.45, translateXFull: true, alignRight: true, color: '#3bd6c6', fontSize: 13, fontWeight: 500, uppercase: true, nowrap: true },
  },
  {
    advisor: advisors[1],
    left: 245.91,
    top: 49.27,
    image: { frame: { left: 0, top: 0.81, width: 232.35, height: 324.65, roundedTopLeft: true }, image: { left: '-35.21%', top: '-6.5%', width: '156.95%', height: '112.34%' }, transform: 'scale(1.12)' },
    title: { text: 'Giám đốc', left: 214.44, top: 234.78, width: 138.44, translateXFull: true, alignRight: true, color: '#fff', fontSize: 12, fontWeight: 300, nowrap: true },
    field: { text: 'Nghiên cứu & Phát triển\nLe & Associates', left: 214.44, top: 251.78, width: 138.44, translateXFull: true, alignRight: true, color: '#fff', fontSize: 12, fontWeight: 400 },
    name: { text: 'TRƯƠNG CHÍ DŨNG', left: 214.14, top: 291.45, translateXFull: true, alignRight: true, color: '#3bd6c6', fontSize: 13, fontWeight: 600, uppercase: true, nowrap: true },
  },
  {
    advisor: advisors[2],
    left: 491.82,
    top: 49.27,
    image: { frame: { left: 0, top: 0, width: 232.35, height: 324.65, roundedTopLeft: true }, objectCover: true },
    title: { text: 'Quyền giám đốc AI', left: 214.44, top: 252.78, width: 138.44, translateXFull: true, alignRight: true, color: '#fff', fontSize: 12, fontWeight: 300 },
    field: { text: 'Vinsmart Future', left: 214.44, top: 269.78, width: 138.44, translateXFull: true, alignRight: true, color: '#fff', fontSize: 12, fontWeight: 400 },
    name: { text: 'PHẠM TIẾN KHA', left: 214.14, top: 291.45, width: 138.44, translateXFull: true, alignRight: true, color: '#3bd6c6', fontSize: 13, fontWeight: 600, uppercase: true, nowrap: true },
  },
  {
    advisor: advisors[3],
    left: 737.73,
    top: 49.27,
    image: { frame: { left: 0, top: 7, width: 232.35, height: 324.65, roundedTopLeft: true }, objectCover: true },
    title: { text: 'Giám đốc nhân sự', left: 214.44, top: 252.78, width: 138.44, translateXFull: true, alignRight: true, color: '#fff', fontSize: 12, fontWeight: 300 },
    field: { text: 'Nafoods Group', left: 214.44, top: 269.78, width: 138.44, translateXFull: true, alignRight: true, color: '#fff', fontSize: 12, fontWeight: 400 },
    name: { text: 'ĐINH KIM NHUNG', left: 214.14, top: 291.45, width: 138.44, translateXFull: true, alignRight: true, color: '#3bd6c6', fontSize: 13, fontWeight: 600, uppercase: true, nowrap: true },
  },
  {
    advisor: advisors[4],
    left: 983.64,
    top: 49.27,
    image: { frame: { left: 0, top: -3, width: 232.35, height: 324.65, roundedTopLeft: true }, objectCover: true, transform: 'scale(1.25)', transformOrigin: 'center top' },
    title: { text: 'Nhà sáng lập', left: 214.44, top: 234.78, width: 138.44, translateXFull: true, alignRight: true, color: '#fff', fontSize: 12, fontWeight: 300 },
    field: { text: 'Giám đốc điều hành\nVIETSUCCESS', left: 214.44, top: 251.78, width: 138.44, translateXFull: true, alignRight: true, color: '#fff', fontSize: 12, fontWeight: 400 },
    name: { text: 'TRẦN QUỐC KHÁNH', left: 214.14, top: 291.45, width: 138.44, translateXFull: true, alignRight: true, color: '#3bd6c6', fontSize: 13, fontWeight: 600, uppercase: true, nowrap: true },
  },
]

const visibleAdvisors = advisors.slice(0, 5)
const visibleAdvisorCardSpecs = advisorCardSpecs.slice(0, 5)

function AdvisorImage({ advisor, spec }: { advisor: (typeof advisors)[number]; spec: AdvisorImageSpec }) {
  const imageStyle: CSSProperties = {
    ...(spec.image ? boxStyle(spec.image) : { inset: 0, height: '100%', width: '100%' }),
    ...(spec.transform ? { transform: spec.transform, transformOrigin: spec.transformOrigin ?? 'center center' } : {}),
  }

  return (
    <div className={cn('absolute overflow-hidden pointer-events-none', spec.frame.roundedTopLeft && 'rounded-tl-[48.575px]')} style={boxStyle(spec.frame)}>
      <AssetImage alt="" aria-hidden="true" asset={advisor.image} className={cn('absolute', spec.objectCover && 'object-cover')} style={imageStyle} />
    </div>
  )
}

function AdvisorText({ spec }: { spec: AdvisorTextSpec }) {
  const style: CSSProperties = {
    color: spec.color,
    fontSize: spec.fontSize + 'px',
    fontWeight: spec.fontWeight,
    left: spec.left + 'px',
    lineHeight: 'normal',
    top: spec.top + 'px',
    transform: spec.translateXFull ? 'translateX(-100%)' : undefined,
    width: spec.width ? spec.width + 'px' : undefined,
  }

  return (
    <p className={cn('absolute whitespace-pre-line [word-break:break-word]', spec.alignRight && 'text-right', spec.italic && 'italic', spec.uppercase && 'uppercase', spec.nowrap && 'whitespace-nowrap')} style={style}>
      {spec.text}
    </p>
  )
}

function AdvisorCard({ spec }: { spec: AdvisorCardSpec }) {
  return (
    <article className="figma-advisor-card absolute" style={{ left: spec.left, top: spec.top }}>
      <AdvisorImage advisor={spec.advisor} spec={spec.image} />
      <AssetImage alt="" aria-hidden="true" asset="rectangle4372" className="absolute left-[20px] top-[42.91px] h-[282.547px] w-[212.35px]" />
      <AdvisorText spec={spec.title} />
      <AdvisorText spec={spec.field} />
      <AdvisorText spec={spec.name} />
    </article>
  )
}
function toCssLength(value: number | string) {
  return typeof value === 'number' ? `${value}px` : value
}

function boxStyle(box: { left: number | string; top: number | string; width: number | string; height: number | string }): CSSProperties {
  return {
    height: toCssLength(box.height),
    left: toCssLength(box.left),
    top: toCssLength(box.top),
    width: toCssLength(box.width),
  }
}

type FigmaLogoSpec = {
  alt: string
  asset: FigmaAssetKey
  crop?: {
    height: number | string
    left: number | string
    top: number | string
    width: number | string
  }
  height: number
  left: number
  objectCover?: boolean
  top: number
  width: number
}

const associationLogoSpecs: FigmaLogoSpec[] = [
  { alt: 'VOCI', asset: 'logo92', height: 54, left: 502, top: 0, width: 160 },
]

const knowledgePartnerLogoSpecs: FigmaLogoSpec[] = [
  { alt: 'Zenger Folkman', asset: 'logoZengerFolkman', height: 60, left: 293, top: 0, width: 270 },
  { alt: 'Le & Associates', asset: 'logo127', height: 60, left: 663, top: 0, width: 209 },
]

const mediaPartnerLogoSpecs: FigmaLogoSpec[] = [
  { alt: 'Vietsuccess', asset: 'logoVietsuccess', height: 43, left: 432, top: 12, width: 300 },
]

const operationalPartnerLogoSpecs: FigmaLogoSpec[] = [
  { alt: 'KingBee', asset: 'logo80', height: 35.079, left: 390, top: 18.31, width: 150.209 },
  { alt: 'Nesso', asset: 'logoGroup204', height: 40.863, left: 630, top: 13.91, width: 133.383 },
]

const organizerLogoSpecs: FigmaLogoSpec[] = [
  { alt: 'Đơn vị tổ chức', asset: 'logo53Vectorized', height: 31.5, left: 523, top: 14.01, width: 117.409 },
]
function FigmaLogoAsset({ spec }: { spec: FigmaLogoSpec }) {
  const imageStyle: CSSProperties = spec.crop ? boxStyle(spec.crop) : { inset: 0, height: '100%', width: '100%' }

  return (
    <div className="absolute overflow-hidden pointer-events-none" style={boxStyle(spec)}>
      <AssetImage alt={spec.alt} asset={spec.asset} className={cn('absolute', spec.objectCover ? 'object-cover' : !spec.crop && 'object-contain')} style={imageStyle} />
    </div>
  )
}
function AdvisorsSection() {
  return (
    <section id="about-cwi" className="about-cwi-section absolute left-0 top-[2420px] h-[708px] w-full" aria-labelledby="advisors-title">
      <m.div className="about-cwi-layout" initial="hidden" whileInView="show" viewport={desktopMotionViewport} variants={desktopSectionReveal}>
        <div className="about-cwi-left-panel">
          <AboutCwiTitle id="advisors-title" />
          <img alt="Cuộc họp lãnh đạo doanh nghiệp" className="about-cwi-left-image" draggable={false} loading="lazy" src={leftPanelBackground} />
        </div>
        <div aria-label="Nội dung về CEO Workforce Index" className="about-cwi-card-viewport">
          <div className="about-cwi-card-stack">
            {aboutCwiCards.map((card) => <AboutCwiCard card={card} key={card.title} />)}
          </div>
        </div>
      </m.div>
    </section>
  )
}

function AdvisorPeopleSection() {
  return (
    <m.section className="about-cwi-people-section absolute left-0 top-[3198px] h-[390px] w-full" initial="hidden" whileInView="show" viewport={desktopMotionViewport} variants={desktopSectionReveal} aria-label="Ban tổ chức">
      <div className="absolute left-[112px] top-0 h-[374px] w-[1216px]">
        <FigmaSectionLabel
          as="h2"
          className="absolute left-0 top-0 h-[19px] w-full"
          label="Ban tổ chức"
          leftLine={{ asset: 'line21', left: 340, width: 202 }}
          rightLine={{ asset: 'line30', left: 674, width: 202, flip: true }}
          textLeft={495}
          textWidth={226}
        />
        {visibleAdvisorCardSpecs.map((spec) => (
          <AdvisorCard key={spec.advisor.name + '-' + spec.left + '-' + spec.top} spec={spec} />
        ))}
      </div>
    </m.section>
  )
}
function PartnersSection() {
  return (
    <m.section className="absolute left-0 top-[3620px] h-[693px] w-full" initial="hidden" whileInView="show" viewport={desktopMotionViewport} variants={desktopSectionReveal} aria-labelledby="partners-title">
      <FigmaSectionLabel
        as="h2"
        className="absolute left-0 top-0 h-[19px] w-full"
        label="Đơn vị bảo trợ"
        leftLine={{ asset: 'line27', left: 438, width: 202 }}
        rightLine={{ asset: 'line30', left: 802, width: 202, flip: true }}
        textLeft={663}
        textWidth={116}
      />
      <div className="absolute left-[136px] top-[33px] h-[60px] w-[1164px]">
        {associationLogoSpecs.map((spec) => (
          <FigmaLogoAsset key={`association-${spec.asset}`} spec={spec} />
        ))}
      </div>

      <FigmaSectionLabel
        as="h3"
        className="absolute left-0 top-[145px] h-[19px] w-full"
        label="Đối tác tri thức"
        leftLine={{ asset: 'line27', left: 425, width: 200 }}
        rightLine={{ asset: 'line30', left: 815, width: 200, flip: true }}
        textLeft={650}
        textWidth={140}
      />
      <div className="absolute left-[136px] top-[178px] h-[60px] w-[1164px]">
        {knowledgePartnerLogoSpecs.map((spec) => (
          <FigmaLogoAsset key={`knowledge-${spec.asset}`} spec={spec} />
        ))}
      </div>

      <FigmaSectionLabel
        as="h3"
        className="absolute left-0 top-[290px] h-[19px] w-full"
        label="Đối tác truyền thông"
        leftLine={{ asset: 'line27', left: 400, width: 210 }}
        rightLine={{ asset: 'line30', left: 830, width: 210, flip: true }}
        textLeft={630}
        textWidth={180}
      />
      <div className="absolute left-[136px] top-[323px] h-[60px] w-[1164px]">
        {mediaPartnerLogoSpecs.map((spec) => (
          <FigmaLogoAsset key={`media-${spec.asset}`} spec={spec} />
        ))}
      </div>

      <FigmaSectionLabel
        as="h3"
        className="absolute left-0 top-[435px] h-[19px] w-full"
        label="Đối tác vận hành"
        leftLine={{ asset: 'line27', left: 420, width: 205 }}
        rightLine={{ asset: 'line30', left: 815, width: 205, flip: true }}
        textLeft={650}
        textWidth={140}
      />
      <div className="absolute left-[136px] top-[468px] h-[60px] w-[1164px]">
        {operationalPartnerLogoSpecs.map((spec) => (
          <FigmaLogoAsset key={`operational-${spec.asset}`} spec={spec} />
        ))}
      </div>

      <FigmaSectionLabel
        as="h3"
        className="absolute left-0 top-[580px] h-[19px] w-full"
        label="Đơn vị tổ chức"
        leftLine={{ asset: 'line27', left: 438, width: 202 }}
        rightLine={{ asset: 'line30', left: 802, width: 202, flip: true }}
        textLeft={663}
        textWidth={116}
      />
      <div className="absolute left-[136px] top-[613px] h-[60px] w-[1164px]">
        {organizerLogoSpecs.map((spec) => (
          <FigmaLogoAsset key={`organizer-${spec.asset}`} spec={spec} />
        ))}
      </div>
    </m.section>
  )
}function FooterSection() {
  return (
    <m.footer id="footer" className="absolute left-[99px] top-[4376px] h-[382px] w-[1451px] text-black" initial="hidden" whileInView="show" viewport={desktopMotionViewport} variants={desktopSectionReveal} data-node-id="94:276">
      <div className="absolute left-[1046px] top-0 flex h-[382px] w-[405px] items-center justify-center" data-node-id="94:277">
        <div className="flex-none -scale-y-100">
          <AssetImage alt="" aria-hidden="true" asset="image131" className="h-[382px] w-[405px] object-cover" />
        </div>
      </div>

      <AssetImage alt="CEO Workforce Index" asset="footerLogo" className="absolute left-[252px] top-[81px] h-[139.302px] w-[301.024px]" data-node-id="94:285" />
      <span aria-hidden="true" className="absolute left-[620px] top-[67px] h-[148px] border-l border-dashed border-black/20" />

      <nav aria-label="Thông tin pháp lý" className="absolute left-[659px] top-[96px] flex flex-col items-start text-[19px] leading-[34px]">
        {legalLinks.map((link) => (
          <a className="font-semibold uppercase transition-colors hover:text-[#144eaf] focus-visible:rounded-[2px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#144eaf]" href={link.href} key={link.href}>
            {link.label}
          </a>
        ))}
        <p className="whitespace-nowrap">
          <strong className="font-semibold uppercase">LIÊN HỆ:</strong> contact@ceo-workforce-index.com
        </p>
        <p className="whitespace-nowrap">Địa chỉ: 11 Huỳnh Đình Hai, Phường Bình Thạnh, TP.HCM</p>
      </nav>

      <p className="absolute left-[322px] top-[303px] h-[20px] w-[598px] whitespace-nowrap text-center text-[14px] font-normal leading-[20px]" data-node-id="94:278">
        Bản quyền 2026 Toàn bộ quyền sở hữu trí tuệ thuộc về SKALE
      </p>
      <AssetImage alt="" aria-hidden="true" asset="line22" className="absolute left-0 top-[14px] h-px w-[1240px]" data-node-id="94:316" />
    </m.footer>
  )
}
function MobileStats() {
  return (
    <div className="mobile-stats-list" aria-label="Thông số nghiên cứu">
      {reportStats.map((stat, index) => (
        <div className="mobile-stat-row" data-reveal key={stat.value}>
          <AssetImage alt="" aria-hidden="true" asset={stat.icon} className="mobile-stat-icon" />
          <div>
            <strong><AnimatedReportValue delay={index * 90} value={stat.value} /></strong>
            <span>{stat.label}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
function MobileSectionTitle({ children }: { children: ReactNode }) {
  return (
    <div className="mobile-section-title" data-reveal>
      <AssetImage alt="" aria-hidden="true" asset="line27" className="mobile-section-title-line" />
      <strong>{children}</strong>
      <AssetImage alt="" aria-hidden="true" asset="line30" className="mobile-section-title-line is-right" />
    </div>
  )
}

function MobileAdvisorCard({ advisor, isActive }: { advisor: (typeof advisors)[number]; isActive: boolean }) {
  return (
    <article className={cn('mobile-advisor-card', isActive && 'is-active', advisor.name === 'PHẠM THỊ MỸ LỆ' && 'is-primary-advisor', (advisor.name === 'TRƯƠNG CHÍ DŨNG' || advisor.name === 'PHẠM TIẾN KHA' || advisor.name === 'ĐINH KIM NHUNG' || advisor.name === 'TRẦN QUỐC KHÁNH') && 'is-featured-advisor', advisor.name === 'TRẦN QUỐC KHÁNH' && 'is-tran-quoc-khanh')}>
      <AssetImage alt="" aria-hidden="true" asset={advisor.image} className="mobile-advisor-image" />
      <div className="mobile-advisor-blue" />
      <div className="mobile-advisor-copy">
        <em>{advisor.title}</em>
        <span>{advisor.field}</span>
        <strong>{advisor.name}</strong>
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
      <div className="mobile-advisor-scroll" aria-label="Ban tổ chức" ref={scrollRef}>
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
            <AssetImage alt={logo.alt} asset={logo.asset} className="mobile-logo-image" />
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

function MobileLandingPage() {

  return (
    <main className="mobile-landing">
      <section className="mobile-hero" data-mobile-target="#top" aria-labelledby="mobile-hero-title">
        <AssetImage alt="" aria-hidden="true" asset="image75Bg" className="mobile-hero-bg" loading="eager" />
        <div className="mobile-hero-gradient" />
        <AssetImage alt="" aria-hidden="true" asset="group9301" className="mobile-spark mobile-spark-1" loading="eager" />
        <AssetImage alt="" aria-hidden="true" asset="group9303" className="mobile-spark mobile-spark-2" loading="eager" />
        <div className="mobile-hero-content" data-reveal>
          <p className="mobile-eyebrow">LA BÀN ĐỊNH HƯỚNG NĂNG LỰC VẬN HÀNH CỦA TỔ CHỨC</p>
          <h1 id="mobile-hero-title">
            <span><span>Hệ cộng lực mạnh</span></span>
            <span className="mobile-heading-cluster"><span><em>Doanh nghiệp</em> vươn tầm</span></span>
          </h1>
          <p className="mobile-hero-copy">Tham gia khảo sát của CEO Workforce Index để đối chuẩn Hệ cộng lực (con người - AI - tự động hoá - hệ sinh thái) của doanh nghiệp bạn với thị trường, hiểu nguyên nhân và nhận khuyến nghị hành động.</p>
          <RedButton action="survey" className="mobile-hero-button">
            <span>Thực hiện khảo sát</span>
            <AssetImage alt="" aria-hidden="true" asset="arrow1" className="mobile-button-arrow h-[15px] w-[17px]" loading="eager" />
          </RedButton>
        </div>
      </section>

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
            <span>Bàn tròn</span>
            <AssetImage alt="CEO" asset="textCeo" className="mobile-text-ceo" loading="eager" />
          </h2>
          <p className="mobile-roundtable-subtitle">Khai mở góc nhìn - Kiến tạo giá trị</p>
          <p>Không &quot;thuyết trình&quot;. Tranh luận để tìm kiếm những sự thật ngầm hiểu đắt giá nhất. Tham gia Bàn tròn CEO định kỳ dành riêng cho thành viên CWI.</p>
          <div className="mobile-roundtable-stats">
            {roundtableStats.map((stat) => (
              <div key={stat.value}>
                <AssetImage alt="" aria-hidden="true" asset={stat.icon} />
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
          <RedButton action="survey" className="mobile-roundtable-button">Đăng kí tham gia</RedButton>
        </div>
        <div className="mobile-roundtable-photo-frame" data-reveal>
          <AssetImage alt="Roundtable session" asset="image124" className="mobile-roundtable-photo" />
        </div>
      </section>

      <section className="mobile-section mobile-advisors-section about-cwi-mobile-section" data-mobile-target="#about-cwi" aria-labelledby="mobile-advisors-title">
        <div className="about-cwi-mobile-intro" data-reveal>
          <AboutCwiTitle className="about-cwi-mobile-title" id="mobile-advisors-title" />
          <img alt="Cuộc họp lãnh đạo doanh nghiệp" className="about-cwi-mobile-image" draggable={false} loading="lazy" src={leftPanelBackground} />
        </div>
        <div className="about-cwi-mobile-cards" data-reveal>
          {aboutCwiCards.map((card) => <AboutCwiCard card={card} key={card.title} />)}
        </div>
        <MobileSectionTitle>Ban tổ chức</MobileSectionTitle>
        <MobileAdvisorCarousel />
      </section>
      <section className="mobile-section mobile-partners-section" aria-labelledby="mobile-partners-title">
        <h2 id="mobile-partners-title" className="sr-only">Đối tác</h2>
        <MobileSectionTitle>Đơn vị bảo trợ</MobileSectionTitle>
        <MobileLogoRail logos={associationLogos} variant="static" />
        <MobileSectionTitle>Đối tác tri thức</MobileSectionTitle>
        <MobileLogoRail logos={knowledgePartnerLogos} variant="static" />
        <MobileSectionTitle>Đối tác truyền thông</MobileSectionTitle>
        <MobileLogoRail logos={mediaPartnerLogos} variant="static" />
        <MobileSectionTitle>Đối tác vận hành</MobileSectionTitle>
        <MobileLogoRail logos={operationalPartnerLogos} variant="static" />
        <MobileSectionTitle>Đơn vị tổ chức</MobileSectionTitle>
        <MobileLogoRail logos={organizerLogos} variant="static" />
      </section>

      <section className="mobile-final-cta" data-reveal>
        <h2>Hệ cộng lực mạnh<br /><em>Doanh nghiệp</em> vươn tầm</h2>
        <RedButton action="survey" className="mobile-hero-button">
          <span>Thực hiện khảo sát</span>
          <AssetImage alt="" aria-hidden="true" asset="arrow1" className="mobile-button-arrow h-[15px] w-[17px]" loading="eager" />
        </RedButton>
      </section>

      <footer className="mobile-footer" data-mobile-target="#footer">
        <AssetImage alt="" aria-hidden="true" asset="image131" className="mobile-footer-pattern" />
        <AssetImage alt="CEO Workforce Index" asset="footerLogo" className="mobile-footer-logo" />
        <nav aria-label="Thông tin pháp lý" className="mobile-footer-legal">
          {legalLinks.map((link) => (
            <a href={link.href} key={link.href}>{link.label}</a>
          ))}
        </nav>
        <p className="mobile-footer-contact"><strong>LIÊN HỆ:</strong> contact@ceo-workforce-index.com</p>
        <p className="mobile-footer-address">Địa chỉ: 11 Huỳnh Đình Hai, Phường Bình Thạnh, TP.HCM</p>
        <p className="mobile-copyright">Bản quyền 2026 Toàn bộ quyền sở hữu trí tuệ thuộc về SKALE</p>
      </footer>
    </main>
  )
}
export function LandingPage() {
  const scale = useFigmaViewportScale()
  const responsiveStyle = {
    '--figma-scale': scale,
    '--figma-page-height': `${FIGMA_CANVAS_HEIGHT * scale}px`,
    '--figma-header-scale': scale,
  } as CSSProperties

  return (
    <LazyMotion features={domAnimation}>
      <div className="design-page-shell" style={responsiveStyle}>
        <Header scale={scale} />
        <div className="figma-canvas-stage">
          <div className="figma-canvas-scale-box">
            <main id="top" className="figma-canvas" data-figma-file="R23rMZykc70t6C3YFqXyf9" data-figma-node="96:45">
              <HeroSection />
              <div className="absolute left-0 top-[793px] h-[1578px] w-[1440px] rounded-t-[60px] bg-white" />
              <ReportSection />
              <ReportStatsSection />
              <RoundtableSection />
              <AdvisorsSection />
              <AdvisorPeopleSection />
              <PartnersSection />
              <FooterSection />
            </main>
          </div>
        </div>
        <MobileLandingPage />
      </div>
    </LazyMotion>
  )
}

export default LandingPage
