import { Check, ChevronRight, ExternalLink, Link2, Share2 } from 'lucide-react'
import { useEffect, useRef, useState, type RefObject } from 'react'
import { t, type Lang } from '@/i18n'
import { countNewsView, getNewsPost, NewsApiError, newsImageUrl, type NewsCard, type NewsPost } from './newsApi'
import { NewsContent } from './NewsContent'
import { NewsCardSkeleton, NewsCardView, NewsCta } from './NewsCards'
import { formatNewsDate, readingTime } from './newsFormat'
import { NewsLink } from './NewsLink'
import { newsPaths, tagSlug, useNewsNavigate } from './newsRouting'
import { shownShareButtons, type NewsShareSettings } from './newsShare'
import { NewsError, NewsNotFound } from './NewsStates'

export type ArticleHead = { description: string; image: string | null; title: string }

function FacebookIcon() {
  return <svg aria-hidden="true" height="18" viewBox="0 0 24 24" width="18"><path d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.5V4.4c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.4H8.1v3h2.5V21h2.9Z" fill="currentColor" /></svg>
}

function LinkedInIcon() {
  return <svg aria-hidden="true" height="17" viewBox="0 0 24 24" width="17"><path d="M6.9 8.8H3.6V20h3.3V8.8ZM5.2 3.5a1.9 1.9 0 1 0 0 3.8 1.9 1.9 0 0 0 0-3.8ZM20.4 13.6c0-3-1.6-5-4.4-5-1.4 0-2.4.8-2.8 1.5V8.8H10V20h3.3v-5.6c0-1.5.3-2.9 2.1-2.9 1.8 0 1.8 1.7 1.8 3V20h3.3l-.1-6.4Z" fill="currentColor" /></svg>
}

// The address to share: the post's own link (in English when read in English), without the
// ad parameters the reader arrived with.
function shareUrl(post: NewsPost, lang: Lang) {
  return `${window.location.origin}${newsPaths.post(post.slug)}${lang === 'en' ? '?lang=en' : ''}`
}

function ShareButtons({ lang, layout, post, share }: { lang: Lang; layout: 'rail' | 'row'; post: NewsPost; share: NewsShareSettings | undefined }) {
  const [copied, setCopied] = useState(false)
  const url = shareUrl(post, lang)
  const encoded = encodeURIComponent(url)
  const canShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function'
  const shown = shownShareButtons(share, canShare)

  async function copy() {
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      const field = document.createElement('textarea')
      field.value = url
      document.body.appendChild(field)
      field.select()
      document.execCommand('copy')
      field.remove()
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  // Every button switched off in the dashboard: no share block at all.
  if (!shown.length) return null

  return (
    <div className={`news-share news-share--${layout}`}>
      {layout === 'row' ? <span className="news-share-label">{t('Chia sẻ bài viết')}</span> : null}
      {shown.includes('facebook') ? <a aria-label={t('Chia sẻ lên Facebook')} className="news-share-button" href={`https://www.facebook.com/sharer/sharer.php?u=${encoded}`} rel="noopener noreferrer" target="_blank"><FacebookIcon /></a> : null}
      {shown.includes('linkedin') ? <a aria-label={t('Chia sẻ lên LinkedIn')} className="news-share-button" href={`https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`} rel="noopener noreferrer" target="_blank"><LinkedInIcon /></a> : null}
      {shown.includes('copyLink') ? (
        <button aria-label={copied ? t('Đã chép link') : t('Chép link bài viết')} className={`news-share-button${copied ? ' is-done' : ''}`} onClick={() => void copy()} type="button">
          {copied ? <Check aria-hidden="true" size={17} /> : <Link2 aria-hidden="true" size={17} />}
        </button>
      ) : null}
      {shown.includes('native') ? (
        // Phones: the system share sheet (Zalo, Messenger, mail...).
        <button aria-label={t('Chia sẻ qua ứng dụng khác')} className="news-share-button news-share-native" onClick={() => void navigator.share({ title: post.title[lang], url }).catch(() => undefined)} type="button">
          <Share2 aria-hidden="true" size={17} />
        </button>
      ) : null}
      {copied && layout === 'row' ? <span aria-live="polite" className="news-share-copied">{t('Đã chép link')}</span> : null}
    </div>
  )
}

function useReadingProgress(target: RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const element = target.current
      if (!element) return
      const rect = element.getBoundingClientRect()
      const total = rect.height - window.innerHeight * 0.6
      const read = Math.min(Math.max(-rect.top + window.innerHeight * 0.2, 0), Math.max(total, 1))
      setProgress(total > 0 ? read / total : 0)
    }
    const schedule = () => { if (!frame) frame = window.requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [target])
  return progress
}

function ArticleSkeleton() {
  return (
    <div aria-busy="true" className="news-article">
      <header className="news-article-head">
        <span className="news-skeleton news-skeleton-line is-short" />
        <span className="news-skeleton news-skeleton-title" />
        <span className="news-skeleton news-skeleton-line" />
        <span className="news-skeleton news-skeleton-line is-mid" />
      </header>
      <div className="news-article-cover news-skeleton" />
      <span className="sr-only">{t('Đang tải')}</span>
    </div>
  )
}

// /tin-tuc/<slug>: one post. The page visitors from an ad land on, so it opens fast (the
// cover loads first, videos only on click) and ends with the survey invitation.
export function NewsArticle({ lang, onHead, slug }: { lang: Lang; onHead: (head: ArticleHead | null) => void; slug: string }) {
  const navigate = useNewsNavigate()
  const [post, setPost] = useState<NewsPost | null>(null)
  const [related, setRelated] = useState<NewsCard[]>([])
  const [share, setShare] = useState<NewsShareSettings | undefined>(undefined)
  const [status, setStatus] = useState<'loading' | 'ready' | 'failed' | 'missing'>('loading')
  const [attempt, setAttempt] = useState(0)
  const articleRef = useRef<HTMLElement>(null)
  const progress = useReadingProgress(articleRef)

  useEffect(() => {
    const controller = new AbortController()
    setStatus('loading')
    setPost(null)
    getNewsPost(slug, controller.signal)
      .then((result) => {
        // An old link: show the post under its current link, keeping utm_* in the address.
        if ('redirectTo' in result) {
          navigate(newsPaths.post(result.redirectTo), { keepSearch: true, replace: true })
          return
        }
        setPost(result.post)
        setRelated(result.related)
        setShare(result.share)
        setStatus('ready')
        countNewsView(result.post.slug)
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        setStatus(error instanceof NewsApiError && error.status === 404 ? 'missing' : 'failed')
      })
    return () => controller.abort()
  }, [slug, attempt, navigate])

  useEffect(() => {
    if (!post) {
      onHead(null)
      return
    }
    onHead({
      description: post.seoDescription[lang] || post.excerpt[lang],
      image: newsImageUrl(post.coverUrl),
      title: post.seoTitle[lang] || post.title[lang],
    })
  }, [lang, onHead, post])

  if (status === 'missing') return <NewsNotFound message={t('Bài viết này không còn hoặc đã được ẩn.')} />
  if (status === 'failed') return <NewsError onRetry={() => setAttempt((value) => value + 1)} />
  if (!post) return <ArticleSkeleton />

  const cover = newsImageUrl(post.coverUrl)
  const tags = post.tags[lang]
  const hasShare = shownShareButtons(share, typeof navigator !== 'undefined' && typeof navigator.share === 'function').length > 0

  return (
    <>
      <div aria-hidden="true" className="news-progress"><span style={{ transform: `scaleX(${progress})` }} /></div>
      <article className="news-article" ref={articleRef}>
        <header className="news-article-head">
          <nav aria-label={t('Đường dẫn')} className="news-breadcrumb">
            <NewsLink to={newsPaths.home()}>{t('Tin tức')}</NewsLink>
            <ChevronRight aria-hidden="true" size={14} />
            <NewsLink to={newsPaths.category(post.category.slug)}>{post.category.name[lang]}</NewsLink>
          </nav>
          <h1>{post.title[lang]}</h1>
          <p className="news-article-lead">{post.excerpt[lang]}</p>
          <div className="news-article-byline">
            <span aria-hidden="true" className={`news-avatar${post.authorIsDefault?.[lang] ? ' is-brand' : ''}`}>
              {post.authorIsDefault?.[lang] ? <img alt="" src="/favicon.svg" /> : post.author[lang].slice(0, 1).toUpperCase()}
            </span>
            <div>
              <strong>{post.author[lang]}</strong>
              <p>
                <time dateTime={post.publishedAt}>{formatNewsDate(post.publishedAt, lang)}</time>
                <span aria-hidden="true" className="news-meta-dot" />
                <span>{readingTime(post.readingMinutes[lang])}</span>
              </p>
            </div>
          </div>
        </header>

        {cover ? (
          <figure className="news-article-cover">
            <img alt={post.coverAlt[lang] || post.title[lang]} decoding="async" fetchPriority="high" src={cover} />
          </figure>
        ) : null}

        <div className="news-article-layout">
          {/* The rail keeps its column (the text stays centred) even with every button off. */}
          {hasShare ? (
            <aside aria-label={t('Chia sẻ bài viết')} className="news-article-rail">
              <ShareButtons lang={lang} layout="rail" post={post} share={share} />
            </aside>
          ) : <div aria-hidden="true" className="news-article-rail" />}
          <div className="news-article-body">
            <NewsContent doc={post.content[lang]} />

            {post.source.name || post.source.url ? (
              <p className="news-source">
                <span>{t('Nguồn')}:</span>{' '}
                {post.source.url ? (
                  <a href={post.source.url} rel="noopener noreferrer" target="_blank">
                    {post.source.name || new URL(post.source.url).hostname}
                    <ExternalLink aria-hidden="true" size={14} />
                  </a>
                ) : <strong>{post.source.name}</strong>}
              </p>
            ) : null}

            {tags.length ? (
              <ul aria-label={t('Thẻ')} className="news-tags">
                {tags.map((tag) => <li key={tag}><NewsLink to={newsPaths.tag(tagSlug(tag))}>#{tag}</NewsLink></li>)}
              </ul>
            ) : null}

            <ShareButtons lang={lang} layout="row" post={post} share={share} />
          </div>
        </div>
      </article>

      <NewsCta compact />

      {related.length ? (
        <section aria-labelledby="news-related-title" className="news-block news-related">
          <header className="news-block-head">
            <div><h2 id="news-related-title">{t('Bài viết liên quan')}</h2></div>
          </header>
          <div className="news-grid">
            {related.map((card) => <NewsCardView card={card} key={card.slug} lang={lang} />)}
          </div>
        </section>
      ) : status === 'loading' ? (
        <div className="news-grid"><NewsCardSkeleton /><NewsCardSkeleton /><NewsCardSkeleton /></div>
      ) : null}
    </>
  )
}
