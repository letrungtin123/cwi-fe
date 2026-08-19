export type MarketBenchmarkStatus = 'live' | 'demo' | 'unavailable'

export type MarketMetric = {
  label: string
  value: string
  description: string
}

export type MarketBenchmarkData = {
  period: string
  sourceLabel: string
  status: MarketBenchmarkStatus
  metrics: MarketMetric[]
}

export const marketBenchmarkData: MarketBenchmarkData = {
  period: 'Q3/2026',
  sourceLabel: 'Demo bố cục · Dữ liệu thực tế lấy từ Teaser Report',
  status: 'live',
  metrics: [
    { label: 'Mẫu đối chuẩn', value: '300+', description: 'CEO tham gia dữ liệu tham chiếu mùa đầu tiên.' },
    { label: 'Top quartile', value: '78/100', description: 'Mốc năng lực lãnh đạo của nhóm dẫn đầu thị trường.' },
    { label: 'Xu hướng nổi bật', value: '61%', description: 'Doanh nghiệp xem năng lực quản lý là rào cản tăng trưởng chính.' },
  ],
}
