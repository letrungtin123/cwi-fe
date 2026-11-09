// Invitation source ("nguồn mời"). Each inviting party shares its own link or QR
// code, for example /survey?entry=qr&src=vcci-hcm. The code is remembered in this
// browser for 30 days and sent with the survey submission; the most recently opened
// source link wins. Opening the link alone records nothing on the server.

const STORAGE_KEY = 'cwi:survey-source'
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000
// Same rule as the backend and the database.
const CODE_PATTERN = /^[a-z0-9](?:[a-z0-9-]{0,46}[a-z0-9])?$/

type StoredSource = { code: string; savedAt: number }

function normalizeCode(value: string | null) {
  const code = value?.trim().toLowerCase() ?? ''
  return CODE_PATTERN.test(code) ? code : null
}

export function captureSurveySourceFromUrl() {
  if (typeof window === 'undefined') return
  const code = normalizeCode(new URLSearchParams(window.location.search).get('src'))
  if (!code) return
  try {
    const stored: StoredSource = { code, savedAt: Date.now() }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stored))
  } catch {
    // Storage can be blocked (private mode); the survey works without a source.
  }
}

export function readSurveySourceCode(): string | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const stored = JSON.parse(raw) as Partial<StoredSource>
    const code = normalizeCode(typeof stored.code === 'string' ? stored.code : null)
    const age = Date.now() - (typeof stored.savedAt === 'number' ? stored.savedAt : 0)
    if (code && age >= 0 && age <= MAX_AGE_MS) return code
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Unreadable or blocked storage: submit without a source.
  }
  return null
}
