import { type ImgHTMLAttributes } from 'react'
import { type FigmaAssetKey } from './figmaAssets'
import advisorCardIcon from '@/assets/figma/ban-co-van-chuyen-mon.png'
import coordinationCardIcon from '@/assets/figma/kha-nang-phoi-hop.png'
import decisionCardIcon from '@/assets/figma/khoang-trong-ra-quyet-dinh.png'
import directionCardIcon from '@/assets/figma/giai-phap-dinh-huong.png'
import workforceCardIcon from '@/assets/figma/he-cong-luc.png'
import carouselCwiBackground from '@/assets/figma/carousel-cwi.webp'
import reportCarouselBackground from '@/assets/figma/carousel-baocaoquy3.webp'
import roundtableCarouselBackground from '@/assets/figma/carousel-dauanbantron.webp'
import webinarCarouselBackground from '@/assets/figma/carousel-webinar.jpg'
import mobileReportCarouselBackground from '@/assets/figma/carousel-baocaoquy3-mobile.webp'
import mobileRoundtableCarouselBackground from '@/assets/figma/carousel-dauanbantron-mobile.webp'
import mobileHeroBackground from '@/assets/figma/bg-mobile-banner.webp'
import { WEBINAR_ENABLED } from '../survey/surveyData'
import {
  advisors,
} from './landingData'

// Landing page data, types and helpers shared by both layouts. Components live in landingShared.tsx.

export type LandingAction = 'login' | 'survey' | 'roundtable' | 'unlock-report' | 'download-teaser'
export const legalLinks = [
  { href: "/privacy-policy", label: "Chính sách bảo mật" },
  { href: "/terms-of-operation", label: "Quy chế hoạt động" },
] as const
export const HERO_CAROUSEL_INTERVAL_MS = 3000
// Partner logo strip at the bottom of the hero slider (desktop and mobile). Hidden for now; set to true to show it again.
export const SHOW_HERO_LOGO_STRIP = false

export type HeroCarouselSlide = {
  image: string
  ctaLabel: string
  action?: LandingAction
  copy?: HeroCarouselCopyText
  hidden?: boolean
  href?: string
  mobileImage?: string
  opensReportPdf?: boolean
  opensWebinarModal?: boolean
  showIntro?: boolean
}

export type HeroCarouselCopyText = {
  eyebrow?: string
  description: readonly string[]
  heading: readonly HeroCarouselHeadingLine[]
  variant: 'report' | 'roundtable' | 'webinar'
}

export type HeroCarouselHeadingLine = {
  compact?: boolean
  segments: readonly {
    accent?: boolean
    text: string
  }[]
}

export const heroCarouselSlideCatalog: readonly HeroCarouselSlide[] = [
  {
    image: carouselCwiBackground,
    ctaLabel: 'Thực hiện khảo sát',
    action: 'survey',
    mobileImage: mobileHeroBackground,
    showIntro: true,
  },
  {
    image: reportCarouselBackground,
    ctaLabel: 'Xem báo cáo',
    mobileImage: mobileReportCarouselBackground,
    opensReportPdf: true,
    copy: {
      eyebrow: 'BÁO CÁO QUÝ 3/2026',
      heading: [
        { segments: [{ text: 'Năng lực lãnh đạo' }] },
        { segments: [{ accent: true, text: 'cho tăng trưởng' }] },
      ],
      description: [
        'Dành cho CEO, đội ngũ điều hành và lãnh đạo nhân sự\nmuốn biến tham vọng tăng trưởng thành năng lực tổ chức.',
        'Trọng tâm là củng cố quản lý cấp trung, chuẩn bị\nngười kế nhiệm và làm rõ quyền ra quyết định.',
      ],
      variant: 'report',
    },
  },
  {
    image: roundtableCarouselBackground,
    ctaLabel: 'Khám phá',
    mobileImage: mobileRoundtableCarouselBackground,
    copy: {
      eyebrow: 'CEO WORKFORCE INDEX · BÀN TRÒN CEO',
      heading: [
        { segments: [{ text: 'Dấu ấn Bàn tròn CEO' }] },
        { segments: [{ accent: true, text: 'Quý 3/2026' }] },
      ],
      description: [
        'Sự kiện Bàn tròn CEO Quý 3/2026 đã thu hút sự quan tâm của các báo kinh tế uy tín.',
      ],
      variant: 'roundtable',
    },
    href: 'https://cafebiz.vn/dieu-gi-dang-can-tro-doanh-nghiep-tang-truong-176260922103948402.chn',
  },
  {
    image: webinarCarouselBackground,
    ctaLabel: 'Đăng kí ngay',
    hidden: !WEBINAR_ENABLED,
    mobileImage: webinarCarouselBackground,
    opensWebinarModal: true,
    copy: {
      heading: [
        { segments: [{ text: 'CEO & ' }, { accent: true, text: 'HRD' }] },
        { compact: true, segments: [{ text: 'Từ lệch pha đến cùng hướng, cùng nhịp' }] },
      ],
      description: [
        '14:00 – 15:30 | 22/10/2026',
        'Trực tuyến qua Zoom',
      ],
      variant: 'webinar',
    },
  },
] as const

// Hidden slides stay defined so they can be switched back on later.
export const heroCarouselSlides = heroCarouselSlideCatalog.filter((slide) => !slide.hidden)

export function emitLandingAction(action: LandingAction) {
  window.dispatchEvent(new CustomEvent('cwi:landing-action', { detail: { action } }))
}

export type AssetImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  asset: FigmaAssetKey
  alt: string
}

// The Figma strips have the Vietnamese group labels baked in. English shows label-free copies and
// sets the labels as text: x is the label centre and y its baseline, in pixels of each strip image.
export const heroLogoStripLabels = [
  { label: 'Đơn vị bảo trợ', desktop: [324.5, 30], mobile: [375.5, 533] },
  { label: 'Đơn vị tổ chức', desktop: [471, 30], mobile: [707, 533] },
  { label: 'Đơn vị đồng hành', desktop: [713, 30], mobile: [540, 815] },
  { label: 'Đối tác truyền thông', desktop: [978.5, 30], mobile: [540, 1090] },
  { label: 'Đối tác tri thức', desktop: [1252, 30], mobile: [540, 1337] },
  { label: 'Đối tác vận hành', desktop: [1554, 30], mobile: [540, 1601] },
] as const

export function openQuarterlyReport() {
  window.location.assign('/bao-cao-quy')
}
export type AboutCwiIconName = 'advisors' | 'decision' | 'workforce' | 'coordination' | 'direction'

export const aboutCwiIcons = {
  advisors: advisorCardIcon,
  decision: decisionCardIcon,
  workforce: workforceCardIcon,
  coordination: coordinationCardIcon,
  direction: directionCardIcon,
} as const

export type AboutCwiCardBlock =
  | { type: 'paragraph'; text: string; muted?: boolean }
  | { type: 'bullets'; items: string[]; strong?: boolean }
  | { type: 'labels'; items: string[] }
  | { type: 'formula'; items: string[] }

export type AboutCwiCardData = {
  icon: AboutCwiIconName
  title: string
  blocks: AboutCwiCardBlock[]
}

export const aboutCwiCards: AboutCwiCardData[] = [
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

export const visibleAdvisors = advisors.slice(0, 5)
