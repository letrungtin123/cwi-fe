import { createContext, useContext } from 'react'

// Links of the news pages. A post's link is /tin-tuc/<slug> whatever its category, so a link
// used in an ad keeps working when the post moves to another category.
export const NEWS_BASE = '/tin-tuc'

export type NewsRoute =
  | { kind: 'home' }
  | { kind: 'category'; slug: string }
  | { kind: 'tag'; slug: string }
  | { kind: 'post'; slug: string }
  | { kind: 'notFound' }

const segment = '([a-z0-9]+(?:-[a-z0-9]+)*)'

export function isNewsPath(pathname: string) {
  return pathname === NEWS_BASE || pathname.startsWith(`${NEWS_BASE}/`)
}

export function parseNewsPath(pathname: string): NewsRoute {
  const path = pathname.replace(/\/+$/, '') || '/'
  if (path === NEWS_BASE) return { kind: 'home' }
  const category = new RegExp(`^${NEWS_BASE}/chuyen-muc/${segment}$`).exec(path)
  if (category) return { kind: 'category', slug: category[1]! }
  const tag = new RegExp(`^${NEWS_BASE}/the/${segment}$`).exec(path)
  if (tag) return { kind: 'tag', slug: tag[1]! }
  const post = new RegExp(`^${NEWS_BASE}/${segment}$`).exec(path)
  if (post && post[1] !== 'chuyen-muc' && post[1] !== 'the') return { kind: 'post', slug: post[1]! }
  return { kind: 'notFound' }
}

export const newsPaths = {
  category: (slug: string) => `${NEWS_BASE}/chuyen-muc/${slug}`,
  home: () => NEWS_BASE,
  post: (slug: string) => `${NEWS_BASE}/${slug}`,
  tag: (slug: string) => `${NEWS_BASE}/the/${slug}`,
}

// Same rule as the backend: "Lãnh đạo" -> "lanh-dao".
export function tagSlug(tag: string) {
  return tag
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
    .replace(/-+$/g, '')
}

// A ?lang= in the address bar stays on the next page; ad parameters (utm_*) belong to the page
// the visitor landed on and are not carried along.
export function withLanguage(path: string) {
  const lang = new URLSearchParams(window.location.search).get('lang')
  return lang === 'en' || lang === 'vi' ? `${path}?lang=${lang}` : path
}

type Navigate = (path: string, options?: { replace?: boolean; keepSearch?: boolean }) => void

export const NewsNavigationContext = createContext<Navigate>((path) => window.location.assign(path))

export function useNewsNavigate() {
  return useContext(NewsNavigationContext)
}
