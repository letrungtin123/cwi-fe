import { useCallback, useEffect, useState } from 'react'
import { SiteHeader } from '@/features/landing/LandingPage'
import { SiteFooter } from '@/features/landing/SiteFooter'
import { t, useLang } from '@/i18n'
import { NewsArticle, type ArticleHead } from './NewsArticle'
import { NewsHome } from './NewsHome'
import { NewsListing, type ListingHead } from './NewsListing'
import { NewsNavigationContext, newsPaths, parseNewsPath, withLanguage } from './newsRouting'
import { NewsErrorBoundary, NewsNotFound } from './NewsStates'
import './news.css'

const SITE_NAME = 'CEO Workforce Index'

type Head = { description: string; image: string | null; path: string; title: string; type: 'article' | 'website' }

function setMeta(selector: string, create: () => HTMLElement, attribute: string, value: string | null) {
  let element = document.head.querySelector<HTMLElement>(selector)
  if (value === null) {
    element?.remove()
    return
  }
  if (!element) {
    element = create()
    document.head.appendChild(element)
  }
  element.setAttribute(attribute, value)
}

function metaTag(key: 'name' | 'property', name: string) {
  return () => {
    const element = document.createElement('meta')
    element.setAttribute(key, name)
    return element
  }
}

// Keeps <title>, the description, the canonical link and the link-preview tags in step with
// the news page on screen. The server writes the same tags for the first page load (that is
// what Facebook, Zalo and search engines read); this covers moving between pages in the browser.
function applyHead(head: Head, lang: 'vi' | 'en') {
  const canonical = `${window.location.origin}${head.path}${lang === 'en' ? '?lang=en' : ''}`
  const image = head.image ? new URL(head.image, window.location.origin).toString() : `${window.location.origin}/og-image.jpg`
  document.title = head.title
  setMeta('meta[name="description"]', metaTag('name', 'description'), 'content', head.description)
  setMeta('meta[property="og:title"]', metaTag('property', 'og:title'), 'content', head.title)
  setMeta('meta[property="og:description"]', metaTag('property', 'og:description'), 'content', head.description)
  setMeta('meta[property="og:type"]', metaTag('property', 'og:type'), 'content', head.type)
  setMeta('meta[property="og:url"]', metaTag('property', 'og:url'), 'content', canonical)
  setMeta('meta[property="og:image"]', metaTag('property', 'og:image'), 'content', image)
  setMeta('link[rel="canonical"]', () => {
    const link = document.createElement('link')
    link.rel = 'canonical'
    return link
  }, 'href', canonical)
}

// /tin-tuc and everything under it. Moving between news pages changes the address without
// reloading the site; back / forward work as usual.
export function NewsPage() {
  const lang = useLang()
  const [path, setPath] = useState(() => window.location.pathname)
  const [articleHead, setArticleHead] = useState<ArticleHead | null>(null)
  const [listingHead, setListingHead] = useState<ListingHead | null>(null)
  const route = parseNewsPath(path)
  const routeSlug = 'slug' in route ? route.slug : ''

  const navigate = useCallback((to: string, options: { keepSearch?: boolean; replace?: boolean } = {}) => {
    const url = options.keepSearch ? `${to}${window.location.search}${window.location.hash}` : withLanguage(to)
    if (options.replace) window.history.replaceState(null, '', url)
    else window.history.pushState(null, '', url)
    setPath(to)
    if (!options.replace) window.scrollTo({ top: 0 })
  }, [])

  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname)
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  // The landing page's head comes back when the visitor leaves the news pages.
  useEffect(() => {
    const saved = {
      canonical: document.head.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? null,
      description: document.head.querySelector('meta[name="description"]')?.getAttribute('content') ?? null,
      image: document.head.querySelector('meta[property="og:image"]')?.getAttribute('content') ?? null,
      ogDescription: document.head.querySelector('meta[property="og:description"]')?.getAttribute('content') ?? null,
      ogTitle: document.head.querySelector('meta[property="og:title"]')?.getAttribute('content') ?? null,
      title: document.title,
      type: document.head.querySelector('meta[property="og:type"]')?.getAttribute('content') ?? null,
      url: document.head.querySelector('meta[property="og:url"]')?.getAttribute('content') ?? null,
    }
    return () => {
      document.title = saved.title
      setMeta('meta[name="description"]', metaTag('name', 'description'), 'content', saved.description)
      setMeta('meta[property="og:title"]', metaTag('property', 'og:title'), 'content', saved.ogTitle)
      setMeta('meta[property="og:description"]', metaTag('property', 'og:description'), 'content', saved.ogDescription)
      setMeta('meta[property="og:type"]', metaTag('property', 'og:type'), 'content', saved.type)
      setMeta('meta[property="og:url"]', metaTag('property', 'og:url'), 'content', saved.url)
      setMeta('meta[property="og:image"]', metaTag('property', 'og:image'), 'content', saved.image)
      setMeta('link[rel="canonical"]', () => document.createElement('link'), 'href', saved.canonical)
    }
  }, [])

  const routeKind = route.kind
  useEffect(() => {
    const homeDescription = t('Tin tức, sự kiện và góc nhìn về năng lực lãnh đạo, đội ngũ quản lý và Hệ cộng lực của doanh nghiệp Việt Nam từ CEO Workforce Index.')
    if (routeKind === 'home') {
      applyHead({ description: homeDescription, image: null, path: newsPaths.home(), title: `${t('Tin tức')} | ${SITE_NAME}`, type: 'website' }, lang)
    } else if (routeKind === 'post' && articleHead) {
      applyHead({ description: articleHead.description, image: articleHead.image, path: newsPaths.post(routeSlug), title: `${articleHead.title} | ${SITE_NAME}`, type: 'article' }, lang)
    } else if ((routeKind === 'category' || routeKind === 'tag') && listingHead) {
      const listingPath = routeKind === 'category' ? newsPaths.category(routeSlug) : newsPaths.tag(routeSlug)
      applyHead({ description: listingHead.description || homeDescription, image: null, path: listingPath, title: `${listingHead.title} | ${t('Tin tức')} ${SITE_NAME}`, type: 'website' }, lang)
    }
  }, [articleHead, lang, listingHead, routeKind, routeSlug])

  let content
  if (route.kind === 'home') content = <NewsHome lang={lang} />
  else if (route.kind === 'category' || route.kind === 'tag') content = <NewsListing key={`${route.kind}:${route.slug}`} kind={route.kind} lang={lang} onHead={setListingHead} slug={route.slug} />
  else if (route.kind === 'post') content = <NewsArticle key={route.slug} lang={lang} onHead={setArticleHead} slug={route.slug} />
  else content = <NewsNotFound message={t('Đường dẫn này không có trong mục Tin tức.')} />

  return (
    <NewsNavigationContext.Provider value={navigate}>
      <div className="news-page">
        <SiteHeader activePage="/tin-tuc" isPolicyPage />
        <main className="news-main" id="news-main"><NewsErrorBoundary resetKey={path}>{content}</NewsErrorBoundary></main>
        <SiteFooter />
      </div>
    </NewsNavigationContext.Provider>
  )
}
