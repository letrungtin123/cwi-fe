import { useEffect, useState } from 'react'
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

  const fallback = status === 'loading' ? 'Đang tải...' : 'Đang cập nhật'
  return [
    { label: 'Thời gian', value: event?.eventTime || fallback },
    { label: 'Địa điểm', value: event?.eventLocation || fallback },
  ]
}
