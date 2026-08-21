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
    field: 'Hội đồng Quản trị\nL&A Holdings',
  },
  {
    image: 'headshot138',
    name: 'TRƯƠNG CHÍ DŨNG',
    title: 'Giám đốc',
    field: 'Nghiên cứu & Phát\ntriển Le & Associates',
  },
  {
    image: 'phamTienKha',
    name: 'PHẠM TIẾN KHA',
    title: 'Quyền giám đốc AI,',
    field: 'Vinsmart Future',
  },
  {
    image: 'dinhKimNhung',
    name: 'ĐINH KIM NHUNG',
    title: 'Giám đốc nhân sự',
    field: 'Nafoods Group',
  },
  {
    image: 'tranQuocKhanh',
    name: 'TRẦN QUỐC KHÁNH',
    title: 'Nhà sáng lập',
    field: 'Giám đốc điều hành\nVIETSUCCESS',
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
  { asset: 'logo53Vectorized', className: 'h-[32px] w-[118px]', alt: 'Đơn vị tổ chức' },
]

export const associationLogos: Array<{
  asset: FigmaAssetKey
  className: string
  alt: string
}> = [
  { asset: 'logo92', className: 'h-[54px] w-[160px]', alt: 'Đơn vị bảo trợ' },
]

export const knowledgePartnerLogos: Array<{
  asset: FigmaAssetKey
  className: string
  alt: string
}> = [
  { asset: 'logoZengerFolkman', className: 'h-[60px] w-[270px]', alt: 'Zenger Folkman' },
  { asset: 'logo127', className: 'h-[60px] w-[209px]', alt: 'Le & Associates' },
]

export const mediaPartnerLogos: Array<{
  asset: FigmaAssetKey
  className: string
  alt: string
}> = [
  { asset: 'logoVietsuccess', className: 'h-[43px] w-[300px]', alt: 'Vietsuccess' },
]

export const operationalPartnerLogos: Array<{
  asset: FigmaAssetKey
  className: string
  alt: string
}> = [
  { asset: 'logo80', className: 'h-[35px] w-[150px]', alt: 'KingBee' },
  { asset: 'logoGroup204', className: 'h-[41px] w-[134px]', alt: 'Nesso' },
]