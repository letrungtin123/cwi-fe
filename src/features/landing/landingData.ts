import type { FigmaAssetKey } from './figmaAssets'

export const navItems = ['Trang chủ', 'Tiêu điểm', 'Báo cáo', 'Roundtable', 'Về CWI'] as const

export const reportStats: Array<{
  icon: FigmaAssetKey
  value: string
  label: string
}> = [
  {
    icon: 'iconStat2',
    value: 'HƠN 300+',
    label: 'Lãnh đạo C-LEVEL tham gia',
  },
  {
    icon: 'iconStat3',
    value: '25+ NGÀNH NGHỀ',
    label: 'Chủ lực đại diện',
  },
  {
    icon: 'iconStat1',
    value: '34 TỈNH / THÀNH PHỐ',
    label: 'Trên toàn quốc',
  },
  {
    icon: 'iconStat4',
    value: '5 NĂM',
    label: 'Dữ liệu nghiên cứu liên tục',
  },
]

export const roundtableStats: Array<{
  icon: FigmaAssetKey
  value: string
  label: string
}> = [
  {
    icon: 'iconRound1',
    value: 'QUY MÔ GIỚI HẠN',
    label: 'Tối đa 30 CEO',
  },
  {
    icon: 'iconRound2',
    value: '100% TUYỂN CHỌN',
    label: 'Bởi Ban cố vấn',
  },
]

export const advisors: Array<{
  image: FigmaAssetKey
  name: string
  title: string
  field: string
}> = [
  {
    image: 'rectangle4311',
    name: 'PHẠM THỊ MỸ LỆ',
    title: 'Chủ tịch',
    field: 'Hội đồng Quản trị\nL&A Holding',
  },
  {
    image: 'headshot138',
    name: 'TRƯƠNG CHÍ DŨNG',
    title: 'Chuyên gia',
    field: 'Truyền thông & Thương hiệu',
  },
  {
    image: 'phamTienKha',
    name: 'PHẠM TIẾN KHA',
    title: 'Giám đốc AI,',
    field: 'Vinsmart Future',
  },
  {
    image: 'dinhKimNhung',
    name: 'ĐINH KIM NHUNG',
    title: 'TGĐ ctcp đầu tư tài',
    field: 'chính HOÀNG MINH',
  },
  {
    image: 'headshot141',
    name: 'LÊ THỊ THÚY VÂN',
    title: 'Chuyên gia',
    field: 'Kinh tế & Hội nhập Quốc tế',
  },
  {
    image: 'headshot142',
    name: 'PHẠM XUÂN TÙNG',
    title: 'Chuyên gia',
    field: 'Chuyển đổi số & Đổi mới Sáng tạo',
  },
  {
    image: 'headshot143',
    name: 'TRẦN BẰNG VIỆT',
    title: 'Chuyên gia',
    field: 'Truyền thông & Thương hiệu',
  },
  {
    image: 'headshot140',
    name: 'TRẦN MẠNH TƯỞNG',
    title: 'Chuyên gia',
    field: 'Quản trị Nhân sự Cao cấp',
  },
  {
    image: 'headshot141',
    name: 'LÊ THỊ THÚY VÂN',
    title: 'Chuyên gia',
    field: 'Kinh tế & Hội nhập Quốc tế',
  },
]

export const organizerLogos: Array<{
  asset: FigmaAssetKey
  className: string
  alt: string
}> = [
  { asset: 'logo127', className: 'h-[60px] w-[209px]', alt: 'Organizer logo 1' },
  { asset: 'logo53Vectorized', className: 'h-[32px] w-[118px]', alt: 'Organizer logo 2' },
  { asset: 'logo80', className: 'h-[35px] w-[150px]', alt: 'Organizer logo 3' },
  { asset: 'logoGroup204', className: 'h-[41px] w-[134px]', alt: 'Organizer logo 4' },
]

export const associationLogos: Array<{
  asset: FigmaAssetKey
  className: string
  alt: string
}> = [
  { asset: 'logo92', className: 'h-[54px] w-[160px]', alt: 'VOCI' },
]

export const partnerLogos: Array<{
  asset: FigmaAssetKey
  className: string
  alt: string
}> = [
  { asset: 'logoVietsuccess', className: 'h-[43px] w-[300px]', alt: 'Vietsuccess' },
  { asset: 'logoZengerFolkman', className: 'h-[60px] w-[270px]', alt: 'Zenger Folkman' },
]
