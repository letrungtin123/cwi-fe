import type { Lang } from '@/i18n'

// Without VITE_CWI_API_BASE_URL a production build calls its own origin; only the dev server
// falls back to the local backend. The production build sets it to "/api" while every path
// below already starts with /api, so a trailing /api is dropped (as surveyApi does).
const apiBaseUrl = (import.meta.env.VITE_CWI_API_BASE_URL ?? (import.meta.env.DEV ? 'http://localhost:8088' : ''))
  .replace(/\/+$/, '')
  .replace(/\/api$/i, '')

export type Bilingual<T = string> = Record<Lang, T>

export type NewsMark =
  | { type: 'bold' | 'italic' | 'strike' | 'underline' }
  | { attrs: { href: string }; type: 'link' }

export type NewsInline =
  | { marks?: NewsMark[]; text: string; type: 'text' }
  | { type: 'hardBreak' }

export type NewsListItem = { content: NewsBlock[]; type: 'listItem' }

export type NewsBlock =
  | { content?: NewsInline[]; type: 'paragraph' }
  | { attrs: { level: 2 | 3 }; content?: NewsInline[]; type: 'heading' }
  | { content: NewsListItem[]; type: 'bulletList' }
  | { attrs: { start: number }; content: NewsListItem[]; type: 'orderedList' }
  | { content: NewsBlock[]; type: 'blockquote' }
  | { type: 'horizontalRule' }
  | { attrs: { alt: string; src: string; title: string }; type: 'image' }
  | { attrs: { src: string; start: number }; type: 'youtube' }

export type NewsDoc = { content: NewsBlock[]; type: 'doc' }

export type NewsCategoryRef = { name: Bilingual; slug: string }

export type NewsCard = {
  category: NewsCategoryRef
  coverAlt: Bilingual
  coverUrl: string | null
  excerpt: Bilingual
  isPinned: boolean
  publishedAt: string
  readingMinutes: Bilingual<number>
  slug: string
  title: Bilingual
}

export type NewsHome = {
  categories: Array<{ category: NewsCategoryRef & { description: Bilingual }; posts: NewsCard[]; total: number }>
  featured: NewsCard[]
}

export type NewsListPage = {
  category?: NewsCategoryRef & { description: Bilingual }
  posts: NewsCard[]
  tag?: { label: Bilingual; slug: string }
  total: number
}

export type NewsPost = {
  author: Bilingual
  // Missing in answers cached before this field existed.
  authorIsDefault?: Bilingual<boolean>
  category: NewsCategoryRef
  content: Bilingual<NewsDoc>
  coverAlt: Bilingual
  coverUrl: string | null
  excerpt: Bilingual
  publishedAt: string
  readingMinutes: Bilingual<number>
  seoDescription: Bilingual
  seoTitle: Bilingual
  slug: string
  source: { name: string; url: string }
  tags: Bilingual<string[]>
  title: Bilingual
  updatedAt: string
}

export type NewsPostResult = { post: NewsPost; related: NewsCard[] } | { redirectTo: string }

export class NewsApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'NewsApiError'
    this.status = status
  }
}

async function getJson<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, { credentials: 'omit', headers: { accept: 'application/json' }, signal })
  const payload = (await response.json().catch(() => null)) as { data?: T; error?: { message?: string } } | null
  if (!response.ok || !payload || payload.data === undefined) throw new NewsApiError(response.status, payload?.error?.message ?? 'Không tải được tin tức.')
  return payload.data
}

export function newsImageUrl(path: string | null) {
  if (!path) return null
  return /^https?:\/\//.test(path) ? path : `${apiBaseUrl}${path}`
}

export function getNewsHome(signal?: AbortSignal) {
  return getJson<NewsHome>('/api/v1/public/news/home', signal)
}

export function getNewsCategory(slug: string, offset: number, limit: number, signal?: AbortSignal) {
  return getJson<NewsListPage>(`/api/v1/public/news/categories/${encodeURIComponent(slug)}?offset=${offset}&limit=${limit}`, signal)
}

export function getNewsTag(slug: string, offset: number, limit: number, signal?: AbortSignal) {
  return getJson<NewsListPage>(`/api/v1/public/news/tags/${encodeURIComponent(slug)}?offset=${offset}&limit=${limit}`, signal)
}

export function getNewsPost(slug: string, signal?: AbortSignal) {
  return getJson<NewsPostResult>(`/api/v1/public/news/posts/${encodeURIComponent(slug)}`, signal)
}

// Once per post and browser tab, so reloads and back/forward do not count again.
export function countNewsView(slug: string) {
  const key = `cwi.news.viewed.${slug}`
  try {
    if (window.sessionStorage.getItem(key)) return
    window.sessionStorage.setItem(key, '1')
  } catch {
    // Storage blocked: count anyway.
  }
  void fetch(`${apiBaseUrl}/api/v1/public/news/posts/${encodeURIComponent(slug)}/views`, { credentials: 'omit', keepalive: true, method: 'POST' }).catch(() => undefined)
}
