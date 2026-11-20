import { ChevronRight, LoaderCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { t, type Lang } from '@/i18n'
import { getNewsCategory, getNewsTag, NewsApiError, type NewsCard, type NewsListPage } from './newsApi'
import { NewsCardSkeleton, NewsCardView, NewsCta, NewsEyebrow } from './NewsCards'
import { NewsLink } from './NewsLink'
import { newsPaths } from './newsRouting'
import { NewsError, NewsNotFound } from './NewsStates'

const PAGE_SIZE = 9

export type ListingHead = { description: string; title: string }

// /tin-tuc/chuyen-muc/<slug> and /tin-tuc/the/<slug>: every post of a category or tag, newest
// first, with "Xem thêm" for the next ones.
export function NewsListing({ kind, lang, onHead, slug }: { kind: 'category' | 'tag'; lang: Lang; onHead: (head: ListingHead | null) => void; slug: string }) {
  const [page, setPage] = useState<NewsListPage | null>(null)
  const [posts, setPosts] = useState<NewsCard[]>([])
  const [status, setStatus] = useState<'loading' | 'ready' | 'more' | 'failed' | 'missing'>('loading')
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    setStatus('loading')
    setPage(null)
    setPosts([])
    const load = kind === 'category' ? getNewsCategory : getNewsTag
    load(slug, 0, PAGE_SIZE, controller.signal)
      .then((result) => {
        setPage(result)
        setPosts(result.posts)
        setStatus('ready')
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        setStatus(error instanceof NewsApiError && error.status === 404 ? 'missing' : 'failed')
      })
    return () => controller.abort()
  }, [kind, slug, attempt])

  const title = page?.category ? page.category.name[lang] : page?.tag ? `#${page.tag.label[lang]}` : ''
  const description = page?.category?.description[lang] ?? ''

  useEffect(() => {
    onHead(page ? { description, title } : null)
  }, [description, onHead, page, title])

  async function loadMore() {
    setStatus('more')
    try {
      const load = kind === 'category' ? getNewsCategory : getNewsTag
      const next = await load(slug, posts.length, PAGE_SIZE)
      setPosts((current) => [...current, ...next.posts.filter((card) => !current.some((existing) => existing.slug === card.slug))])
      setPage(next)
      setStatus('ready')
    } catch {
      setStatus('ready')
    }
  }

  if (status === 'missing') {
    return <NewsNotFound message={kind === 'category' ? t('Chuyên mục này không còn hoặc đã được ẩn.') : t('Chưa có bài viết nào gắn thẻ này.')} />
  }

  return (
    <>
      <section aria-labelledby="news-listing-title" className="news-hero news-hero--listing">
        <div aria-hidden="true" className="news-hero-glow" />
        <div className="news-hero-copy">
          <nav aria-label={t('Đường dẫn')} className="news-breadcrumb news-breadcrumb--light">
            <NewsLink to={newsPaths.home()}>{t('Tin tức')}</NewsLink>
            <ChevronRight aria-hidden="true" size={14} />
            <span>{kind === 'category' ? t('Chuyên mục') : t('Thẻ')}</span>
          </nav>
          {page ? (
            <>
              <h1 id="news-listing-title">{title}</h1>
              {description ? <p>{description}</p> : null}
              <NewsEyebrow>{t('{count} bài viết', { count: page.total })}</NewsEyebrow>
            </>
          ) : <h1 id="news-listing-title" className="news-skeleton news-skeleton-title" aria-busy="true"><span className="sr-only">{t('Đang tải')}</span></h1>}
        </div>
      </section>

      {status === 'failed' ? <NewsError onRetry={() => setAttempt((value) => value + 1)} /> : null}

      <div className="news-grid news-grid--listing">
        {status === 'loading' ? Array.from({ length: 6 }, (_unused, index) => <NewsCardSkeleton key={index} />) : null}
        {posts.map((card, index) => <NewsCardView card={card} key={card.slug} lang={lang} priority={index < 3} showCategory={kind === 'tag'} />)}
      </div>

      {page && posts.length < page.total ? (
        <div className="news-load-more">
          <button className="news-button news-button--outline" disabled={status === 'more'} onClick={() => void loadMore()} type="button">
            {status === 'more' ? <LoaderCircle aria-hidden="true" className="news-spin" size={16} /> : null}
            <span>{status === 'more' ? t('Đang tải...') : t('Xem thêm')}</span>
          </button>
          <p>{t('Đang xem {shown}/{total} bài', { shown: posts.length, total: page.total })}</p>
        </div>
      ) : null}

      {page ? <NewsCta /> : null}
    </>
  )
}
