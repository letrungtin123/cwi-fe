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
    image: 'headshot139',
    name: 'TRƯƠNG BÌNH NGUYÊN',
    title: 'Chuyên gia',
    field: 'Chiến lược & Quản trị Tổ chức',
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
    image: 'headshot144',
    name: 'TRƯƠNG BÌNH NGUYÊN',
    title: 'Chuyên gia',
    field: 'Chiến lược & Quản trị Tổ chức',
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
  { asset: 'logo82', className: 'h-[55px] w-[161px]', alt: 'Association logo 1' },
  { asset: 'logo90', className: 'h-[37px] w-[97px]', alt: 'Association logo 2' },
  { asset: 'logo126', className: 'h-[35px] w-[105px]', alt: 'Association logo 3' },
  { asset: 'logo92', className: 'h-[28px] w-[83px]', alt: 'Association logo 4' },
  { asset: 'logo86', className: 'h-[55px] w-[145px]', alt: 'Association logo 5' },
  { asset: 'logo94', className: 'h-[48px] w-[106px]', alt: 'Association logo 6' },
  { asset: 'logo54', className: 'h-[32px] w-[140px]', alt: 'Association logo 7' },
  { asset: 'logo59', className: 'h-[32px] w-[144px]', alt: 'Association logo 8' },
  { asset: 'logo58', className: 'h-[51px] w-[203px]', alt: 'Association logo 9' },
  { asset: 'logo57', className: 'h-[47px] w-[231px]', alt: 'Association logo 10' },
  { asset: 'logo63', className: 'h-[67px] w-[181px]', alt: 'Association logo 11' },
]

export const partnerLogos: Array<{
  asset: FigmaAssetKey
  className: string
  alt: string
}> = [
  { asset: 'borgs', className: 'h-[30px] w-[100px]', alt: 'Borgs' },
  { asset: 'peterMillar', className: 'h-[30px] w-[187px]', alt: 'Peter Millar' },
  { asset: 'brand67', className: 'h-[84px] w-[130px]', alt: 'Partner logo 67' },
  { asset: 'brand68', className: 'h-[68px] w-[91px]', alt: 'Partner logo 68' },
  { asset: 'brand65', className: 'h-[79px] w-[83px]', alt: 'Partner logo 65' },
  { asset: 'aliceOlivia', className: 'h-[54px] w-[207px]', alt: 'Alice Olivia' },
  { asset: 'vidaxl', className: 'h-[60px] w-[120px]', alt: 'VidaXL' },
  { asset: 'sallyskoufis', className: 'h-[58px] w-[201px]', alt: 'Sally Skoufis' },
  { asset: 'furnitureChoice', className: 'h-[71px] w-[71px]', alt: 'Furniture Choice' },
  { asset: 'mercury', className: 'h-[40px] w-[169px]', alt: 'Mercury' },
]
