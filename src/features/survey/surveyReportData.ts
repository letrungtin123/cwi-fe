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
  sourceLabel: '',
  status: 'unavailable',
  metrics: [],
}
