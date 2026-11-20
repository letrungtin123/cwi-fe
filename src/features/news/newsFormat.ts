import { t, type Lang } from '@/i18n'

export function formatNewsDate(iso: string, lang: Lang) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return lang === 'en'
    ? new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(date)
    : new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date)
}

export function readingTime(minutes: number) {
  return t('{minutes} phút đọc', { minutes: Math.max(1, minutes) })
}
