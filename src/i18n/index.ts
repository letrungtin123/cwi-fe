import { useSyncExternalStore } from 'react'
import { en } from './en'

// Vietnamese is the source language: every UI string is written in Vietnamese
// and doubles as its lookup key, so `t()` returns it unchanged for 'vi'.
// Survey question and option text must stay Vietnamese in submitted values
// because the backend and the CWI AI registry only accept that wording; only
// the displayed label goes through `t()`.
export type Lang = 'vi' | 'en'

const STORAGE_KEY = 'cwi.lang'
const listeners = new Set<() => void>()
const reportedMissing = new Set<string>()

function isLang(value: unknown): value is Lang {
  return value === 'vi' || value === 'en'
}

function readStoredLang(): Lang | null {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return isLang(stored) ? stored : null
  } catch {
    return null
  }
}

function storeLang(lang: Lang) {
  try {
    window.localStorage.setItem(STORAGE_KEY, lang)
  } catch {
    // Private mode or blocked storage: the choice lasts for this page only.
  }
}

// `?lang=en` (from a shared link or QR code) wins over the stored choice.
function detectInitialLang(): Lang {
  if (typeof window === 'undefined') return 'vi'
  const fromUrl = new URLSearchParams(window.location.search).get('lang')
  if (isLang(fromUrl)) {
    storeLang(fromUrl)
    return fromUrl
  }
  return readStoredLang() ?? 'vi'
}

let current: Lang = detectInitialLang()
if (typeof document !== 'undefined') document.documentElement.lang = current

export function getLang(): Lang {
  return current
}

export function setLang(lang: Lang) {
  if (lang === current) return
  current = lang
  storeLang(lang)
  document.documentElement.lang = lang

  // Keep a ?lang= already in the address bar in sync so reloads and copied links match.
  const url = new URL(window.location.href)
  if (url.searchParams.has('lang')) {
    url.searchParams.set('lang', lang)
    window.history.replaceState(window.history.state, '', url)
  }

  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

// Re-renders the caller when the language changes. App calls it at the root, so
// every component below re-renders and picks up the new strings.
export function useLang(): Lang {
  return useSyncExternalStore(subscribe, getLang, () => 'vi')
}

function lookup(key: string): string | undefined {
  return en[key] ?? en[key.replace(/\s+/g, ' ').trim()]
}

function interpolate(text: string, params?: Record<string, string | number>) {
  if (!params) return text
  return text.replace(/\{(\w+)\}/g, (match, name: string) => (name in params ? String(params[name]) : match))
}

/** Translates Vietnamese source text. `{name}` placeholders are filled from `params`. */
export function t(vi: string, params?: Record<string, string | number>): string {
  if (current === 'vi') return interpolate(vi, params)
  const translated = lookup(vi)
  if (translated === undefined && import.meta.env.DEV && !reportedMissing.has(vi)) {
    reportedMissing.add(vi)
    console.warn('[i18n] missing EN:', vi)
  }
  return interpolate(translated ?? vi, params)
}

/** Like `t()`, for source text that needs a different translation in one place (key `context|vi`). */
export function tx(context: string, vi: string, params?: Record<string, string | number>): string {
  if (current === 'en') {
    const translated = lookup(`${context}|${vi}`)
    if (translated !== undefined) return interpolate(translated, params)
  }
  return t(vi, params)
}

/** The code of the language a toggle switches to ("EN" while the page is Vietnamese). */
export function languageToggleCode(): string {
  return current === 'vi' ? 'EN' : 'VI'
}

export function dateLocale(): string {
  return current === 'en' ? 'en-GB' : 'vi-VN'
}
