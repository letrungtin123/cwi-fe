import { useEffect, useRef, useState, type CSSProperties, type ImgHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { figmaAssets, type FigmaAssetKey } from './figmaAssets'
import {
  advisors,
  navItems,
  reportStats,
  roundtableStats,
} from './landingData'
import './landing.css'

type LandingAction = 'login' | 'survey' | 'unlock-report' | 'download-teaser' | 'roundtable-apply'

const navTargets = ['#top', '#report', '#report-card', '#roundtable', '#footer'] as const
const headerNavSpecs = [
  { href: navTargets[0], label: navItems[0], left: 0, width: 97 },
  { href: navTargets[1], label: navItems[1], left: 107, width: 96 },
  { href: navTargets[2], label: navItems[2], left: 213, width: 82 },
  { href: navTargets[3], label: navItems[3], left: 305, width: 108 },
  { href: navTargets[4], label: navItems[4], left: 423, width: 76 },
] as const

const FIGMA_CANVAS_WIDTH = 1440
const FIGMA_CANVAS_HEIGHT = 4742
const figmaScrollTargets: Record<(typeof navTargets)[number], number> = {
  '#top': 0,
  '#report': 874,
  '#report-card': 874,
  '#roundtable': 1817,
  '#footer': 4360,
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

function scrollToFigmaTarget(href: (typeof navTargets)[number], scale: number) {
  const targetTop = figmaScrollTargets[href] * scale
  window.history.replaceState(null, '', href)
  window.scrollTo({ behavior: 'smooth', top: Math.round(targetTop) })
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
function Header({ scale }: { scale: number }) {
  const [isHidden, setIsHidden] = useState(false)
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

  return (
    <header className={cn('figma-site-header', isHidden && 'header--hidden')}>
      <div className="absolute left-[55px] top-[15px] h-[49px] w-[1110px]">
        <AssetImage alt="CEO Workforce Index" asset="cwiLogo" className="absolute left-0 top-0 h-[49px] w-[108px]" loading="eager" />
        <nav aria-label="Main navigation" className="figma-inter absolute left-[351px] top-[17px] h-[19px] w-[499px] whitespace-nowrap text-[16px] font-normal leading-[19px] text-black">
          {headerNavSpecs.map((item) => (
            <a
              className="absolute top-0 h-[19px] cursor-pointer whitespace-nowrap leading-[19px] no-underline"
              href={item.href}
              key={item.label}
              onClick={(event) => {
                event.preventDefault()
                scrollToFigmaTarget(item.href, scale)
              }}
              style={{ left: item.left, width: item.width }}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="absolute left-[878px] top-[11px] h-[30px] w-[60px]">
          <AssetImage alt="" aria-hidden="true" asset="line38" className="figma-header-chrome-icon absolute left-[59px] top-0 h-[30px] w-[1px]" loading="eager" />
          <AssetImage alt="" aria-hidden="true" asset="iconLanguage" className="figma-header-chrome-icon absolute left-0 top-[7px] h-[18px] w-[18px]" loading="eager" />
          <span className="figma-inter absolute left-[25px] top-[6px] whitespace-nowrap text-[16px] font-medium leading-[19px] text-black underline">EN</span>
        </div>
        <RedButton action="login" className="figma-header-login-button absolute left-[954px] top-[5px] h-[41px] w-[144px] whitespace-nowrap text-[16px] font-medium">
          Đăng nhập
        </RedButton>
      </div>
    </header>
  )
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
    <section className="absolute left-0 top-0 h-[940px] w-full overflow-hidden" aria-labelledby="hero-title">
      <AssetImage alt="" aria-hidden="true" asset="image75Bg" className="figma-hero-bg absolute left-[-67px] top-0 h-[929px] w-[1574px]" loading="eager" />
      <div className="figma-hero-gradient absolute left-[-1px] top-0 h-[940px] w-[1442px]" />
      <AssetImage alt="" aria-hidden="true" asset="rectangle4329" className="absolute left-0 top-[763px] h-[156px] w-[1440px] object-cover" loading="eager" />
      <Sparkles />
      <p className="absolute left-[495px] top-[220px] w-[451px] text-center text-[16px] font-medium uppercase leading-[19px] text-[#13e6d0]">
        Nền Tảng Tri Thức dành cho Lãnh Đạo Cấp Cao
      </p>
      <h1 id="hero-title" className="absolute left-[236px] top-[254px] w-[968px] text-center text-[81px] font-medium leading-[90px] text-white">
        <span className="block">Hệ năng lực tốt hơn</span>
        <span className="block">
          <em className="figma-text-gradient font-semibold italic">Doanh nghiệp</em> mạnh hơn
        </span>
      </h1>
      <p className="figma-hero-body-copy absolute left-[448px] top-[449px] w-[543px] text-center">
        Tham gia khảo sát của CEO Workforce Index để đối chuẩn năng lực đội ngũ của doanh nghiệp bạn với hàng trăm doanh nghiệp khác
      </p>
      <RedButton action="survey" className="absolute left-[564px] top-[539px] h-[60px] w-[313px] text-[20px] font-medium">
        <span>Thực hiện khảo sát</span>
        <AssetImage alt="" aria-hidden="true" asset="arrow1" className="h-[15px] w-[17px]" loading="eager" />
      </RedButton>
    </section>
  )
}

function ReportCard() {
  return (
    <article id="report-card" className="figma-report-card absolute left-[716px] top-0 h-[613px] w-[577px]">
      <div className="absolute left-[14px] top-[14px] h-[398px] w-[550px] overflow-hidden rounded-[10px] bg-[#00132f]">
        <AssetImage alt="" aria-hidden="true" asset="bgForm" className="absolute inset-0 h-full w-full object-cover" />
        <h3 className="absolute left-[35px] top-[30px] w-[413px] text-[30px] font-medium leading-[35px] text-white">
          Mở khóa báo cáo chẩn đoán năng lực lãnh đạo
        </h3>
        <p className="absolute left-[35px] top-[106px] w-[333px] text-[16px] font-normal leading-[19px] text-white">
          Khám phá vị thế năng lực của doanh nghiệp bạn so với 100+ tổ chức khác.
        </p>
        <AssetImage alt="" aria-hidden="true" asset="group9304" className="absolute left-[291px] top-[38px] h-[242px] w-[46px]" />
        <AssetImage alt="" aria-hidden="true" asset="group9302" className="absolute left-[469px] top-[106px] h-[16px] w-[16px]" />
        <AssetImage alt="" aria-hidden="true" asset="frame619" className="absolute left-[34px] top-[353px] h-[29px] w-[23px]" />
        
      </div>
      <RedButton action="unlock-report" className="absolute left-[42px] top-[442px] h-[47px] w-[491px] text-[16px] font-normal">
        <AssetImage alt="" aria-hidden="true" asset="iconUnlock" className="h-[18px] w-[18px]" />
        <span>Mở khóa báo cáo / Làm khảo sát</span>
      </RedButton>
      <button className="figma-button-outline figma-inter absolute left-[42px] top-[504px] h-[47px] w-[495px] rounded-[40px] text-[16px]" data-action="download-teaser" onClick={() => emitLandingAction('download-teaser')} type="button">
        <AssetImage alt="" aria-hidden="true" asset="iconDownload" className="h-[16px] w-[16px]" />
        <span>Tải báo cáo teaser miễn phí</span>
      </button>
      <div className="absolute left-[51px] top-[575px] flex items-center gap-[10px] text-[14px] leading-[17px] text-[#e1242a]">
        <AssetImage alt="" aria-hidden="true" asset="frame585" className="h-[12px] w-[10px]" />
        <p>
          <strong className="font-medium">BẢO MẬT DỮ LIỆU</strong>: Vui lòng xác thực tài khoản Client để mở khóa báo cáo
        </p>
      </div>
    </article>
  )
}

function ReportChart() {
  return (
    <div className="absolute left-[49px] top-[201px] h-[478px] w-[626px]">
      <div className="absolute left-[48px] top-[33px] h-[376px] w-[553px] overflow-hidden">
        <div className="figma-chart-grid absolute inset-0" />
        <AssetImage alt="" aria-hidden="true" asset="rectangle4233" className="absolute inset-0 h-full w-full" />
        <AssetImage alt="" aria-hidden="true" asset="vector153" className="absolute left-0 top-[68px] h-[310px] w-[524px]" />
        <AssetImage alt="" aria-hidden="true" asset="vector154" className="absolute left-[1px] top-[68px] h-[310px] w-[523px]" />
        {[0, 87, 174, 262, 349, 523].map((x, index) => (
          <AssetImage alt="" aria-hidden="true" asset="ellipse2006" className="absolute h-[4px] w-[4px]" key={x} style={{ left: x - 2, top: [375.7, 279.9, 236.4, 243, 233.2, 66.8][index] }} />
        ))}
      </div>
      <p className="absolute left-0 top-0 w-[230px] text-[16px] font-normal leading-[26px] text-black">TỐC ĐỘ TĂNG TRƯỞNG</p>
      <div className="absolute left-0 top-[55px] text-[14px] font-normal leading-[26px] text-black">
        <span className="absolute left-0 top-0">100</span>
        <span className="absolute left-0 top-[87px]">75</span>
        <span className="absolute left-0 top-[174px]">50</span>
        <span className="absolute left-0 top-[262px]">25</span>
        <span className="absolute left-[10px] top-[347px]">0</span>
      </div>
      <div className="absolute left-0 top-0 text-[14px] font-normal leading-[26px] text-black">
        <span className="absolute left-[105px] top-[434px]">Q3/2025</span>
        <span className="absolute left-[197px] top-[434px]">Q4/2025</span>
        <span className="absolute left-[289px] top-[434px]">Q1/2026</span>
        <span className="absolute left-[379px] top-[434px]">Q2/2026</span>
        <span className="absolute left-[470px] top-[434px] font-medium text-[#144eaf]">Q3/2026</span>
        <span className="absolute left-[564px] top-[434px]">Q4/2026</span>
      </div>
      <div className="figma-chart-axis-x" aria-hidden="true" />
      <div className="figma-chart-axis-y" aria-hidden="true" />
      <AssetImage alt="" aria-hidden="true" asset="group9334" className="absolute left-[450px] top-[146px] h-[63.2px] w-[63.2px]" />
    </div>
  )
}

function ReportSection() {
  return (
    <section id="report" className="absolute left-0 top-[874px] h-[890px] w-full" aria-labelledby="report-title">
      <h2 id="report-title" className="absolute left-[90px] top-0 text-[35px] font-medium leading-[40px] text-black">
        Tiêu điểm quý <em className="italic text-[#3bd6c6]">3/2026</em>
      </h2>
      <p className="absolute left-[90px] top-[45px] w-[500px] text-[20px] font-normal leading-[20px] text-black">
        Nâng cao năng lực lãnh đạo để mở rộng quy mô
      </p>
      <p className="absolute left-[90px] top-[80px] w-[500px] text-[16px] font-normal leading-[20px] text-black">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      </p>
      <ReportChart />
      <ReportCard />
      <div className="absolute left-[75px] top-[715px] h-[147px] w-[1295px]">
        {[323.75, 647.5, 971.25].map((left) => (
          <div className="absolute top-[32px] h-[104px] w-px bg-[#d9d9d9]" key={left} style={{ left }} />
        ))}
        {reportStats.map((stat, index) => {
          const slots = [
            { left: 0, width: 323.75 },
            { left: 323.75, width: 323.75 },
            { left: 647.5, width: 323.75 },
            { left: 971.25, width: 323.75 },
          ]
          const slot = slots[index]

          return (
            <div className="absolute top-0 h-full text-center" key={stat.value} style={slot}>
              <AssetImage alt="" aria-hidden="true" asset={stat.icon} className="absolute left-1/2 top-[26px] h-[46px] w-[60px] -translate-x-1/2 object-contain" />
              <strong className="absolute left-0 top-[84px] w-full text-center text-[18px] font-medium leading-[22px] text-[#144eaf]">{stat.value}</strong>
              <span className="absolute left-0 top-[108px] w-full text-center text-[14px] font-normal leading-[18px] text-black">{stat.label}</span>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function RoundtableSection() {
  return (
    <section id="roundtable" className="absolute left-[40px] top-[1817px] h-[640px] w-[1360px] overflow-hidden rounded-[20px]" aria-labelledby="roundtable-title">
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

      <RedButton action="roundtable-apply" className="absolute left-[70px] top-[435px] h-[50px] w-[330px] text-[16px] font-medium">
        Đăng Ký Xét Duyệt Tham Gia
      </RedButton>

      <div className="absolute left-[594px] top-[80px] h-[480px] w-[686px] rounded-[16px] border border-white/90 p-[9px]">
        <AssetImage alt="Roundtable session" asset="image124" className="h-full w-full rounded-[8px] object-cover" />
      </div>
    </section>
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
    image: { frame: { left: -31, top: 28, width: 228, height: 328 }, objectCover: true },
    title: { text: 'Chairwoman', left: 214.44, top: 234.78, width: 138.44, translateXFull: true, alignRight: true, color: '#fff', fontSize: 12, fontWeight: 300, italic: true },
    field: { text: 'Chuyển đổi số & Đổi mới Sáng tạo', left: 214.44, top: 251.78, width: 102.01, translateXFull: true, alignRight: true, color: '#fff', fontSize: 12, fontWeight: 400 },
    name: { text: 'PHẠM THỊ MỸ LỆ', left: 214.14, top: 291.45, translateXFull: true, alignRight: true, color: '#3bd6c6', fontSize: 13, fontWeight: 500, uppercase: true, nowrap: true },
  },
  {
    advisor: advisors[1],
    left: 246.35,
    top: 49.27,
    image: { frame: { left: 0, top: 29.95, width: 232.35, height: 295.5 }, image: { left: '-35.21%', top: '-12.05%', width: '156.95%', height: '123.43%' } },
    title: { text: 'Chuyên gia', left: 217.87, top: 234.78, translateXFull: true, alignRight: true, color: '#fff', fontSize: 11, fontWeight: 300, italic: true, nowrap: true },
    field: { text: 'Truyền thông & Thương hiệu', left: 217.78, top: 252.59, width: 117.39, translateXFull: true, alignRight: true, color: '#fff', fontSize: 11, fontWeight: 400 },
    name: { text: 'TRƯƠNG CHÍ DŨNG', left: 93.1, top: 291.45, color: '#3bd6c6', fontSize: 13, fontWeight: 600, uppercase: true, nowrap: true },
  },
  {
    advisor: advisors[2],
    left: 492.7,
    top: 49.27,
    image: { frame: { left: 0, top: 0.81, width: 232.35, height: 324.65, roundedTopLeft: true }, image: { left: '-26.82%', top: 0, width: '139.72%', height: '100%' } },
    title: { text: 'Chuyên gia', left: 220.21, top: 233.16, width: 138.44, translateXFull: true, alignRight: true, color: '#fff', fontSize: 12, fontWeight: 300, italic: true },
    field: { text: 'Chiến lược & Quản trị Tổ chức', left: 220.21, top: 251.78, width: 97.96, translateXFull: true, alignRight: true, color: '#fff', fontSize: 12, fontWeight: 400 },
    name: { text: 'TRƯƠNG BÌNH NGUYÊN', left: 78.53, top: 291.45, color: '#3bd6c6', fontSize: 13, fontWeight: 600, uppercase: true, nowrap: true },
  },
  {
    advisor: advisors[3],
    left: 739.06,
    top: 49.27,
    image: { frame: { left: 0, top: 9.71, width: 232.35, height: 315.74 }, image: { left: '-36.7%', top: '-2.05%', width: '154.04%', height: '113.23%' } },
    title: { text: 'Chuyên gia', left: 216.97, top: 236.4, width: 138.44, translateXFull: true, alignRight: true, color: '#fff', fontSize: 12, fontWeight: 300, italic: true },
    field: { text: 'Quản trị Nhân sự Cao cấp', left: 216.97, top: 253.4, width: 100.39, translateXFull: true, alignRight: true, color: '#fff', fontSize: 12, fontWeight: 400 },
    name: { text: 'TRẦN MẠNH TƯỞNG', left: 86.63, top: 291.45, color: '#3bd6c6', fontSize: 13, fontWeight: 600, uppercase: true, nowrap: true },
  },
  {
    advisor: advisors[4],
    left: 985.41,
    top: 49,
    image: { frame: { left: 0, top: 0.81, width: 232.35, height: 324.65 }, image: { left: '-70.42%', top: '0.01%', width: '225.02%', height: '161.15%' } },
    title: { text: 'Chuyên gia', left: 216.16, top: 234.78, width: 138.44, translateXFull: true, alignRight: true, color: '#fff', fontSize: 12, fontWeight: 300, italic: true },
    field: { text: 'Kinh tế & Hội nhập Quốc tế', left: 216.16, top: 251.78, width: 99.58, translateXFull: true, alignRight: true, color: '#fff', fontSize: 12, fontWeight: 400 },
    name: { text: 'LÊ THỊ THÚY VÂN', left: 104.44, top: 291.45, color: '#3bd6c6', fontSize: 13, fontWeight: 600, uppercase: true, nowrap: true },
  },
  {
    advisor: advisors[5],
    left: 0,
    top: 404,
    image: { frame: { left: 0, top: 9.71, width: 202.4, height: 315.74 }, image: { left: '-23.6%', top: '2.82%', width: '147.2%', height: '94.36%' } },
    title: { text: 'Chuyên gia', left: 211.3, top: 234.78, width: 138.44, translateXFull: true, alignRight: true, color: '#fff', fontSize: 12, fontWeight: 300, italic: true },
    field: { text: 'Chuyển đổi số & Đổi mới Sáng tạo', left: 211.3, top: 251.78, width: 102.01, translateXFull: true, alignRight: true, color: '#fff', fontSize: 12, fontWeight: 400 },
    name: { text: 'PHẠM XUÂN TÙNG', left: 90.67, top: 291.45, color: '#3bd6c6', fontSize: 13, fontWeight: 500, uppercase: true, nowrap: true },
  },
  {
    advisor: advisors[6],
    left: 246.35,
    top: 404.27,
    image: { frame: { left: -51.35, top: 27.73, width: 288, height: 307 }, image: { left: '-12.88%', top: '-11.89%', width: '132.97%', height: '111.89%' } },
    title: { text: 'Chuyên gia', left: 217.87, top: 234.78, translateXFull: true, alignRight: true, color: '#fff', fontSize: 11, fontWeight: 300, italic: true, nowrap: true },
    field: { text: 'Truyền thông & Thương hiệu', left: 217.78, top: 252.59, width: 117.39, translateXFull: true, alignRight: true, color: '#fff', fontSize: 11, fontWeight: 400 },
    name: { text: 'TRẦN BẰNG VIỆT', left: 106.65, top: 291.45, color: '#3bd6c6', fontSize: 13, fontWeight: 600, uppercase: true, nowrap: true },
  },
  {
    advisor: advisors[7],
    left: 492.7,
    top: 404.27,
    image: { frame: { left: -56.71, top: 17.73, width: 315, height: 308 }, objectCover: true },
    title: { text: 'Chuyên gia', left: 220.21, top: 233.16, width: 138.44, translateXFull: true, alignRight: true, color: '#fff', fontSize: 12, fontWeight: 300, italic: true },
    field: { text: 'Chiến lược & Quản trị Tổ chức', left: 220.21, top: 251.78, width: 97.96, translateXFull: true, alignRight: true, color: '#fff', fontSize: 12, fontWeight: 400 },
    name: { text: 'TRƯƠNG BÌNH NGUYÊN', left: 221.53, top: 291.45, translateXFull: true, alignRight: true, color: '#3bd6c6', fontSize: 13, fontWeight: 600, uppercase: true, nowrap: true },
  },
  {
    advisor: advisors[8],
    left: 739.06,
    top: 404.27,
    image: { frame: { left: 0, top: 9.71, width: 232.35, height: 315.74 }, image: { left: '-36.7%', top: '-2.05%', width: '154.04%', height: '113.23%' } },
    title: { text: 'Chuyên gia', left: 216.97, top: 236.4, width: 138.44, translateXFull: true, alignRight: true, color: '#fff', fontSize: 12, fontWeight: 300, italic: true },
    field: { text: 'Quản trị Nhân sự Cao cấp', left: 216.97, top: 253.4, width: 100.39, translateXFull: true, alignRight: true, color: '#fff', fontSize: 12, fontWeight: 400 },
    name: { text: 'TRẦN MẠNH TƯỞNG', left: 218.63, top: 291.45, translateXFull: true, alignRight: true, color: '#3bd6c6', fontSize: 13, fontWeight: 600, uppercase: true, nowrap: true },
  },
  {
    advisor: advisors[9],
    left: 985.41,
    top: 404,
    image: { frame: { left: 0, top: 0.81, width: 232.35, height: 324.65 }, image: { left: '-70.42%', top: '0.01%', width: '225.02%', height: '161.15%' } },
    title: { text: 'Chuyên gia', left: 216.16, top: 234.78, width: 138.44, translateXFull: true, alignRight: true, color: '#fff', fontSize: 12, fontWeight: 300, italic: true },
    field: { text: 'Kinh tế & Hội nhập Quốc tế', left: 216.16, top: 251.78, width: 99.58, translateXFull: true, alignRight: true, color: '#fff', fontSize: 12, fontWeight: 400 },
    name: { text: 'LÊ THỊ THÚY VÂN', left: 217.44, top: 291.45, translateXFull: true, alignRight: true, color: '#3bd6c6', fontSize: 13, fontWeight: 600, uppercase: true, nowrap: true },
  },
]

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

function AdvisorImage({ advisor, spec }: { advisor: (typeof advisors)[number]; spec: AdvisorImageSpec }) {
  const imageStyle: CSSProperties = spec.image ? boxStyle(spec.image) : { inset: 0, height: '100%', width: '100%' }

  return (
    <div className={cn('absolute overflow-hidden pointer-events-none', spec.frame.roundedTopLeft && 'rounded-tl-[48.575px]')} style={boxStyle(spec.frame)}>
      <AssetImage alt="" aria-hidden="true" asset={advisor.image} className={cn('absolute', spec.objectCover && 'object-cover')} style={imageStyle} />
    </div>
  )
}

function AdvisorText({ spec }: { spec: AdvisorTextSpec }) {
  const style: CSSProperties = {
    color: spec.color,
    fontSize: `${spec.fontSize}px`,
    fontWeight: spec.fontWeight,
    left: `${spec.left}px`,
    lineHeight: 'normal',
    top: `${spec.top}px`,
    transform: spec.translateXFull ? 'translateX(-100%)' : undefined,
    width: spec.width ? `${spec.width}px` : undefined,
  }

  return (
    <p className={cn('absolute [word-break:break-word]', spec.alignRight && 'text-right', spec.italic && 'italic', spec.uppercase && 'uppercase', spec.nowrap && 'whitespace-nowrap')} style={style}>
      {spec.text}
    </p>
  )
}

function AdvisorCard({ spec }: { spec: AdvisorCardSpec }) {
  return (
    <article className="figma-advisor-card absolute" style={{ left: spec.left, top: spec.top }}>
      <AdvisorImage advisor={spec.advisor} spec={spec.image} />
      <AssetImage alt="" aria-hidden="true" asset="rectangle4372" className="absolute left-[52.62px] top-[42.91px] h-[282.547px] w-[179.729px]" />
      <AdvisorText spec={spec.title} />
      <AdvisorText spec={spec.field} />
      <AdvisorText spec={spec.name} />
    </article>
  )
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

const organizerLogoSpecs: FigmaLogoSpec[] = [
  { alt: 'Le & Associates', asset: 'logo127', height: 60, left: 0, objectCover: true, top: 0, width: 209 },
  { alt: 'Skale', asset: 'logo53Vectorized', height: 31.5, left: 261.11, top: 14.01, width: 117.409 },
  { alt: 'KingBee', asset: 'logo80', height: 35.079, left: 443.67, objectCover: true, top: 18.31, width: 150.209 },
  { alt: 'Nesso', asset: 'logoGroup204', height: 40.863, left: 661.31, top: 13.91, width: 133.383 },
]

const associationLogoSpecs: FigmaLogoSpec[] = [
  {
    alt: 'HAWEE',
    asset: 'logo82',
    crop: { height: '292.81%', left: 0, top: '-96.4%', width: '100%' },
    height: 55,
    left: 113,
    top: 0,
    width: 161.043,
  },
  {
    alt: 'VSIP',
    asset: 'logo90',
    crop: { height: '154.8%', left: '-13.29%', top: '-27.4%', width: '126.59%' },
    height: 37,
    left: 318,
    top: 9,
    width: 97,
  },
  { alt: 'VNHR', asset: 'logo126', height: 35, left: 466, objectCover: true, top: 10, width: 104.864 },
  { alt: 'VCCI', asset: 'logo92', height: 28, left: 629, objectCover: true, top: 14, width: 83 },
  { alt: 'HanoiBA', asset: 'logo86', height: 55, left: 761, objectCover: true, top: 0, width: 145 },
  {
    alt: 'SHTP',
    asset: 'logo94',
    crop: { height: '221.37%', left: 0, top: '-60.69%', width: '100%' },
    height: 48,
    left: 949,
    top: 4,
    width: 106,
  },
  {
    alt: 'THACO',
    asset: 'logo54',
    crop: { height: '239.83%', left: '-13.89%', top: '-69.92%', width: '127.78%' },
    height: 32,
    left: 0,
    top: 100,
    width: 139.636,
  },
  { alt: 'Yamaha', asset: 'logo59', height: 32, left: 208, objectCover: true, top: 101, width: 143.719 },
  { alt: 'VietinBank', asset: 'logo58', height: 51, left: 419, objectCover: true, top: 82, width: 203.282 },
  { alt: 'Eximbank', asset: 'logo57', height: 47, left: 691, objectCover: true, top: 84, width: 230.575 },
  {
    alt: 'QTSC',
    asset: 'logo63',
    crop: { height: '131.17%', left: '-2.99%', top: '-15.58%', width: '105.97%' },
    height: 67,
    left: 983,
    top: 74,
    width: 181,
  },
]

const partnerLogoSpecs: FigmaLogoSpec[] = [
  { alt: 'Borg', asset: 'borgs', height: 29.447, left: 154, objectCover: true, top: 32.1, width: 100.247 },
  { alt: 'Peter Millar', asset: 'peterMillar', height: 29.983, left: 341, objectCover: true, top: 27.23, width: 187.212 },
  { alt: 'Aviteur', asset: 'brand67', height: 84.433, left: 615, objectCover: true, top: 0, width: 129.892 },
  {
    alt: 'Belgo',
    asset: 'brand68',
    crop: { height: '135.75%', left: 0, top: '-35.26%', width: '100%' },
    height: 67.705,
    left: 831,
    top: 12.64,
    width: 91.254,
  },
  {
    alt: 'Atlantic Lighting',
    asset: 'brand65',
    crop: { height: '151.52%', left: '-24.64%', top: '-19.7%', width: '144.93%' },
    height: 79.16,
    left: 1009,
    top: 8.75,
    width: 82.758,
  },
  {
    alt: 'Alice + Olivia',
    asset: 'aliceOlivia',
    crop: { height: '385.34%', left: 0, top: '-137.93%', width: '100%' },
    height: 53.757,
    left: 30,
    top: 126.88,
    width: 207.149,
  },
  {
    alt: 'VidaXL',
    asset: 'vidaxl',
    crop: { height: '231.21%', left: '-6.9%', top: '-67.05%', width: '114.94%' },
    height: 59.667,
    left: 316,
    top: 123.62,
    width: 120.024,
  },
  { alt: 'Sally Skoufis', asset: 'sallyskoufis', height: 57.387, left: 515, objectCover: true, top: 115.2, width: 201.368 },
  { alt: 'F&C', asset: 'furnitureChoice', height: 71.005, left: 840, objectCover: true, top: 110, width: 71.005 },
  {
    alt: 'Mercury',
    asset: 'mercury',
    crop: { height: '100%', left: '-38.17%', top: 0, width: '138.17%' },
    height: 39.019,
    left: 1025,
    top: 130.77,
    width: 168.596,
  },
]

function FigmaLogoAsset({ spec }: { spec: FigmaLogoSpec }) {
  const imageStyle: CSSProperties = spec.crop ? boxStyle(spec.crop) : { inset: 0, height: '100%', width: '100%' }

  return (
    <div className="absolute overflow-hidden pointer-events-none" style={boxStyle(spec)}>
      <AssetImage alt={spec.alt} asset={spec.asset} className={cn('absolute', spec.objectCover && 'object-cover')} style={imageStyle} />
    </div>
  )
}
function AdvisorsSection() {
  return (
    <section className="absolute left-0 top-[2527px] h-[1063px] w-full" aria-labelledby="advisors-title">
      <AssetImage alt="" aria-hidden="true" asset="frame606" className="absolute left-[-162px] top-[24px] h-[728px] w-[895px] rotate-180 object-contain opacity-70" />
      <AssetImage alt="" aria-hidden="true" asset="frame605" className="absolute left-[1115px] top-[291px] h-[728px] w-[895px] rotate-180 object-contain opacity-70" />
      <h2 id="advisors-title" className="absolute left-[94px] top-0 w-[560px] text-[35px] font-medium leading-[40px] text-black">
        Thước đo sức khỏe <em className="whitespace-nowrap italic text-[#3bd6c6]">hệ năng lực</em>
        <br />
        cho Ban giám đốc
      </h2>
      <div className="absolute left-[699px] top-0 w-[566px] text-[16px] font-normal leading-[20px] text-black">
        <p>
          Gần 25 năm qua, bà Phạm Thị Mỹ Lệ cùng cộng sự đã đồng hành với hàng trăm doanh nghiệp giải quyết bài toán về con người, năng lực lãnh đạo và hiệu quả tổ chức.
        </p>
        <p className="mt-[20px]">
          Từ thực tiễn đó, bà nhận thấy lãnh đạo có nhiều dữ liệu về thị trường và khách hàng, nhưng lại thiếu thông tin để đánh giá mức độ sẵn sàng của đội ngũ thực thi chiến lược tăng trưởng.
        </p>
        <p className="mt-[20px] font-medium">CEO Workforce Index ra đời</p>
        <ul className="mt-[8px] list-disc pl-[22px]">
          <li>Một hệ tri thức và đối chuẩn năng lực điều hành tổ chức dành cho CEO.</li>
          <li>Dữ liệu được phân tích chuyên sâu bởi AI.</li>
          <li>Giúp lãnh đạo nhận diện và thu hẹp khoảng cách giữa mục tiêu tăng trưởng và năng lực thực thi của đội ngũ.</li>
        </ul>
      </div>
      <div className="absolute left-[112px] top-[334px] h-[729px] w-[1216px]">
        <FigmaSectionLabel
          className="absolute left-0 top-0 h-[19px] w-full"
          label="Hội đồng Cố vấn chuyên môn"
          leftLine={{ asset: 'line21', left: 279, width: 202 }}
          rightLine={{ asset: 'line30', left: 735, width: 202, flip: true }}
          textLeft={495}
          textWidth={226}
        />
        {advisorCardSpecs.map((spec) => (
          <AdvisorCard key={`${spec.advisor.name}-${spec.left}-${spec.top}`} spec={spec} />
        ))}
      </div>
    </section>
  )
}

function PartnersSection() {
  return (
    <section className="absolute left-0 top-[3660px] h-[677px] w-full" aria-labelledby="partners-title">
      <FigmaSectionLabel
        as="h2"
        className="absolute left-0 top-0 h-[19px] w-full"
        label="Đơn vị Đồng tổ chức"
        leftLine={{ asset: 'line24', left: 397, width: 219 }}
        rightLine={{ asset: 'line26', left: 823, width: 219, flip: true }}
        textLeft={641}
        textWidth={157}
      />
      <div className="absolute left-[310px] top-[33px] h-[60px] w-[795px]">
        {organizerLogoSpecs.map((spec) => (
          <FigmaLogoAsset key={`organizer-a-${spec.asset}`} spec={spec} />
        ))}
      </div>
      <div className="absolute left-[310px] top-[107px] h-[60px] w-[795px]">
        {organizerLogoSpecs.map((spec) => (
          <FigmaLogoAsset key={`organizer-b-${spec.asset}`} spec={spec} />
        ))}
      </div>
      <FigmaSectionLabel
        as="h3"
        className="absolute left-0 top-[217px] h-[19px] w-full"
        label="Hiệp hội"
        leftLine={{ asset: 'line27', left: 464, width: 202 }}
        rightLine={{ asset: 'line30', left: 774, width: 202, flip: true }}
        textLeft={689}
        textWidth={64}
      />
      <div className="absolute left-[136px] top-[264px] h-[141px] w-[1164px]">
        {associationLogoSpecs.map((spec) => (
          <FigmaLogoAsset key={`association-${spec.asset}`} spec={spec} />
        ))}
      </div>
      <FigmaSectionLabel
        as="h3"
        className="absolute left-0 top-[450px] h-[19px] w-full"
        label="Công ty đối tác"
        leftLine={{ asset: 'line27', left: 434, width: 202 }}
        rightLine={{ asset: 'line30', left: 804, width: 202, flip: true }}
        textLeft={659}
        textWidth={118}
      />
      <div className="absolute left-[118px] top-[494px] h-[183.284px] w-[1203.596px]">
        {partnerLogoSpecs.map((spec) => (
          <FigmaLogoAsset key={`partner-${spec.asset}`} spec={spec} />
        ))}
      </div>
    </section>
  )
}

function FooterSection() {
  return (
    <footer id="footer" className="absolute left-[99px] top-[4360px] h-[382px] w-[1451px] text-black" data-node-id="94:276">
      <div className="absolute left-[1046px] top-0 flex h-[382px] w-[405px] items-center justify-center" data-node-id="94:277">
        <div className="flex-none -scale-y-100">
          <AssetImage alt="" aria-hidden="true" asset="image131" className="h-[382px] w-[405px] object-cover" />
        </div>
      </div>

      <AssetImage alt="CEO Workforce Index" asset="footerLogo" className="absolute left-[34px] top-[120px] h-[139.302px] w-[301.024px]" data-node-id="94:285" />

      <h3 className="absolute left-[475px] top-[111.172px] h-[25px] w-[222px] text-[19px] font-semibold uppercase leading-[25px]" data-node-id="94:283">
        CHÍNH SÁCH BẢO MẬT
      </h3>
      <div className="absolute left-[475px] top-[154.172px] h-[123px] w-[339px] text-[14px] font-normal leading-[18px]" data-node-id="94:279">
        <p>
          Mọi dữ liệu doanh nghiệp nhập vào hệ thống AI đều
          <br />
          được mã hóa đầu cuối theo tiêu chuẩn bảo mật
          <br />
          quốc tế <strong className="font-medium text-[#144eaf]">ISO/IEC 27001.</strong>
        </p>
        <p style={{ marginTop: 20 }}>
          Chúng tôi cam kết không chia sẻ dữ liệu cho bên
          <br />
          thứ ba dưới bất kỳ hình thức nào.
        </p>
      </div>

      <h3 className="absolute left-[850px] top-[111.172px] h-[25px] w-[319px] text-[19px] font-semibold uppercase leading-[25px]" data-node-id="94:284">
        THÔNG TIN LIÊN HỆ ĐẶC QUYỀN
      </h3>
      <p className="absolute left-[850px] top-[151.172px] h-[27px] w-[420px] whitespace-nowrap text-[14px] font-normal leading-[26px]" data-node-id="94:280">
        <strong className="font-medium">Hotline VIP (24/7):</strong> 0909 123 456
      </p>
      <p className="absolute left-[850px] top-[178.172px] h-[26px] w-[420px] whitespace-nowrap text-[14px] font-normal leading-[26px]" data-node-id="94:281">
        <strong className="font-medium">Email Ban điều hành CWI:</strong> cwi@xyz.com
      </p>
      <p className="absolute left-[850px] top-[204.172px] h-[27px] w-[420px] whitespace-nowrap text-[14px] font-normal leading-[26px]" data-node-id="94:282">
        <strong className="font-medium">Trụ sở:</strong> 36 Mạc Đĩnh Chi, Phường Tân Định, TP. HCM
      </p>

      <p className="absolute left-[322px] top-[338px] h-[20px] w-[598px] whitespace-nowrap text-center text-[14px] font-normal leading-[20px]" data-node-id="94:278">
        Bản quyền 2026 Toàn bộ quyền sở hữu trí tuệ thuộc về các <strong className="font-medium">Đơn vị đồng tổ chức và Đối tác.</strong>
      </p>
      <AssetImage alt="" aria-hidden="true" asset="line22" className="absolute left-0 top-[51.5px] h-px w-[1240px]" data-node-id="94:316" />
    </footer>
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
    <div className="design-page-shell" style={responsiveStyle}>
      <Header scale={scale} />
      <div className="figma-canvas-stage">
        <div className="figma-canvas-scale-box">
          <main id="top" className="figma-canvas" data-figma-file="R23rMZykc70t6C3YFqXyf9" data-figma-node="96:45">
            <HeroSection />
            <div className="absolute left-0 top-[793px] h-[1358px] w-[1440px] rounded-t-[60px] bg-white" />
            <ReportSection />
            <RoundtableSection />
            <AdvisorsSection />
            <PartnersSection />
            <FooterSection />
          </main>
        </div>
      </div>
    </div>
  )
}

export default LandingPage