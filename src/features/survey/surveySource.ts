// Invitation source ("nguồn mời"). Each inviting party shares its own link or QR
// code, for example /survey?entry=qr&src=vcci-hcm. The code is remembered in this
// browser for 30 days and sent with the survey submission; the most recently opened
// source link wins. Opening the link alone records nothing on the server.
//
// A link opens one quarter's survey directly: ?q=2026Q3. Links without q (all those
// shared before links had a quarter, made for the 2026Q4 campaign) open 2026Q4.
export const SOURCE_LINK_DEFAULT_VERSION = '2026Q4'

// An invitation link: it carries a source code or a quarter. Links shared without
// entry=qr (for example copied from the address bar, which drops it) still count.
export function isInvitationLink(): boolean {
  if (typeof window === 'undefined') return false
  const params = new URLSearchParams(window.location.search)
  return Boolean(params.get('src')?.trim() || params.get('q')?.trim())
}

// Quarter an invitation link asks for, or null for the list of quarters.
export function readEntryQuarterFromUrl(): string | null {
  if (typeof window === 'undefined') return null
  const value = new URLSearchParams(window.location.search).get('q')
  if (value === null) return SOURCE_LINK_DEFAULT_VERSION
  const version = value.trim().toUpperCase()
  return /^\d{4}Q[1-4]$/.test(version) ? version : null
}

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
