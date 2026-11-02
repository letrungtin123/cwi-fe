import { useEffect, useState } from 'react'
import { t } from '@/i18n'
import { getRoundtableEvent, type RoundtableEvent } from './surveyApi'

export type RoundtableEventDetail = { label: string; value: string }

// Time and location are entered by an admin on the dashboard for the
// Roundtable that is currently open for registration.
export function useRoundtableEventDetails(active: boolean): RoundtableEventDetail[] {
  const [event, setEvent] = useState<RoundtableEvent | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'failed'>('loading')

  useEffect(() => {
    if (!active) return
    const controller = new AbortController()
    setStatus('loading')
    getRoundtableEvent(controller.signal)
      .then((next) => {
        setEvent(next)
        setStatus('ready')
      })
      .catch(() => {
        if (!controller.signal.aborted) setStatus('failed')
      })
    return () => controller.abort()
  }, [active])

  // Display labels, translated at render (the hook runs during render). The
  // admin-entered time and location are shown as entered.
  const fallback = status === 'loading' ? t('Đang tải...') : t('Đang cập nhật')
  return [
    { label: t('Thời gian'), value: event?.eventTime || fallback },
    { label: t('Địa điểm'), value: event?.eventLocation || fallback },
  ]
}
