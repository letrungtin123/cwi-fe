import { Check, ChevronRight, ExternalLink, Link2 } from 'lucide-react'
import { useEffect, useRef, useState, type ReactNode, type RefObject } from 'react'
import { t, type Lang } from '@/i18n'
import { countNewsView, getNewsPost, NewsApiError, newsImageUrl, type NewsCard, type NewsPost } from './newsApi'
import { NewsContent } from './NewsContent'
import { NewsCardSkeleton, NewsCardView, NewsCta } from './NewsCards'
import { formatNewsDate, readingTime } from './newsFormat'
import { NewsLink } from './NewsLink'
import { newsPaths, tagSlug, useNewsNavigate } from './newsRouting'
import { newsPageIcons, type NewsPageIcons, type NewsSocialNetwork } from './newsShare'
import { NewsError, NewsNotFound } from './NewsStates'

export type ArticleHead = { description: string; image: string | null; title: string }

// The same icons as the dashboard settings (cwi-fe-dashboard NewsSettingsTab.tsx).
const SOCIAL_ICONS: Record<NewsSocialNetwork, ReactNode> = {
  facebook: <svg aria-hidden="true" height="18" viewBox="0 0 24 24" width="18"><path d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.5V4.4c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.4H8.1v3h2.5V21h2.9Z" fill="currentColor" /></svg>,
  linkedin: <svg aria-hidden="true" height="17" viewBox="0 0 24 24" width="17"><path d="M6.9 8.8H3.6V20h3.3V8.8ZM5.2 3.5a1.9 1.9 0 1 0 0 3.8 1.9 1.9 0 0 0 0-3.8ZM20.4 13.6c0-3-1.6-5-4.4-5-1.4 0-2.4.8-2.8 1.5V8.8H10V20h3.3v-5.6c0-1.5.3-2.9 2.1-2.9 1.8 0 1.8 1.7 1.8 3V20h3.3l-.1-6.4Z" fill="currentColor" /></svg>,
  youtube: <svg aria-hidden="true" height="18" viewBox="0 0 24 24" width="18"><path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4a2.5 2.5 0 0 0-1.8 1.8C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 0 0 1.8 1.8c1.6.4 7.8.4 7.8.4s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8ZM10 15V9l5.2 3L10 15Z" fill="currentColor" fillRule="evenodd" /></svg>,
  zalo: <svg aria-hidden="true" height="19" viewBox="0 0 24 24" width="19"><path d="M12 3C6.5 3 2 6.8 2 11.5c0 2.6 1.4 4.9 3.6 6.5L5 21l3.6-1.8c1.1.3 2.2.5 3.4.5 5.5 0 10-3.8 10-8.5S17.5 3 12 3ZM8.5 7.8h7v1.3l-4.8 5h4.8v1.3h-7v-1.3l4.8-5H8.5V7.8Z" fill="currentColor" fillRule="evenodd" /></svg>,
}

const SOCIAL_LABELS: Record<NewsSocialNetwork, string> = {
  facebook: 'Facebook của CWI',
  linkedin: 'LinkedIn của CWI',
  youtube: 'YouTube của CWI',
  zalo: 'Zalo OA của CWI',
}

// The link the copy icon copies: the post's own address (in English when read in English),
// without the ad parameters the reader arrived with.
function postLink(post: NewsPost, lang: Lang) {
  return `${window.location.origin}${newsPaths.post(post.slug)}${lang === 'en' ? '?lang=en' : ''}`
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // Older browsers, or a page without clipboard permission.
    const field = document.createElement('textarea')
    field.value = text
    field.setAttribute('readonly', '')
    field.style.position = 'fixed'
    field.style.opacity = '0'
    document.body.appendChild(field)
    field.select()
    try {
      return document.execCommand('copy')
    } catch {
      return false
    } finally {
      field.remove()
    }
  }
}

// The left column (icons only) and the row at the end of the post ("Theo dõi CWI" + the
// copy-link button with its words).
function PostIcons({ copied, icons, layout, onCopy }: { copied: boolean; icons: NewsPageIcons; layout: 'rail' | 'row'; onCopy: () => void }) {
  const social = icons.social.map(({ network, url }) => (
    <a aria-label={t(SOCIAL_LABELS[network])} className="news-share-button" data-tip={layout === 'rail' ? t(SOCIAL_LABELS[network]) : undefined} href={url} key={network} rel="noopener noreferrer" target="_blank">
      {SOCIAL_ICONS[network]}
    </a>
  ))
  const copyIcon = copied ? <Check aria-hidden="true" size={17} /> : <Link2 aria-hidden="true" size={17} />

  if (layout === 'rail') {
    return (
      <div className="news-share news-share--rail">
        {social}
        {social.length && icons.copyLink ? <span aria-hidden="true" className="news-share-divider" /> : null}
        {icons.copyLink ? (
          <button aria-label={t('Chép link bài viết')} className={`news-share-button${copied ? ' is-done' : ''}`} data-tip={t('Chép link bài viết')} onClick={onCopy} type="button">{copyIcon}</button>
        ) : null}
      </div>
    )
  }

  return (
    <div className="news-share news-share--row">
      {social.length ? (
        <div className="news-share-group">
          <span className="news-share-label">{t('Theo dõi CWI')}</span>
          {social}
        </div>
      ) : null}
      {icons.copyLink ? (
        <button className={`news-copy-link${copied ? ' is-done' : ''}`} onClick={onCopy} type="button">
          {copyIcon}
          <span>{t('Chép link bài viết')}</span>
        </button>
      ) : null}
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
  const [icons, setIcons] = useState<NewsPageIcons>({ copyLink: true, social: [] })
  // The "Đã sao chép link" popup; count restarts its animation on every click.
  const [copyNote, setCopyNote] = useState<{ count: number; ok: boolean } | null>(null)
  const copyTimer = useRef(0)
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
        setIcons(newsPageIcons(result))
        setStatus('ready')
        countNewsView(result.post.slug)
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        setStatus(error instanceof NewsApiError && error.status === 404 ? 'missing' : 'failed')
      })
    return () => controller.abort()
  }, [slug, attempt, navigate])

  useEffect(() => () => window.clearTimeout(copyTimer.current), [])

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
  const hasIcons = icons.copyLink || icons.social.length > 0
  const copied = copyNote?.ok === true

  async function copyLink() {
    if (!post) return
    const ok = await copyText(postLink(post, lang))
    setCopyNote((current) => ({ count: (current?.count ?? 0) + 1, ok }))
    window.clearTimeout(copyTimer.current)
    copyTimer.current = window.setTimeout(() => setCopyNote(null), ok ? 2200 : 4000)
  }

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
          {/* The rail keeps its column (the text stays centred) even with every icon off. */}
          {hasIcons ? (
            <aside aria-label={t('Theo dõi CWI và chia sẻ bài viết')} className="news-article-rail">
              <PostIcons copied={copied} icons={icons} layout="rail" onCopy={() => void copyLink()} />
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

            {hasIcons ? <PostIcons copied={copied} icons={icons} layout="row" onCopy={() => void copyLink()} /> : null}
          </div>
        </div>
      </article>

      <div aria-live="polite" className="news-toast-region" role="status">
        {copyNote ? (
          <span className={`news-toast${copyNote.ok ? '' : ' is-error'}`} key={copyNote.count}>
            {copyNote.ok ? <Check aria-hidden="true" size={17} /> : null}
            {copyNote.ok ? t('Đã sao chép link') : t('Không chép được link. Anh/Chị vui lòng chép trên thanh địa chỉ.')}
          </span>
        ) : null}
      </div>

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
