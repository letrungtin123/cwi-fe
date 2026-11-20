import { ArrowRight, Newspaper } from 'lucide-react'
import { useEffect, useState } from 'react'
import { t, type Lang } from '@/i18n'
import { getNewsHome, type NewsHome as NewsHomeData } from './newsApi'
import { NewsCardSkeleton, NewsCardView, NewsCta, NewsEyebrow } from './NewsCards'
import { NewsLink } from './NewsLink'
import { newsPaths } from './newsRouting'
import { NewsError } from './NewsStates'

function FeaturedGrid({ data, lang }: { data: NewsHomeData; lang: Lang }) {
  const [lead, ...side] = data.featured
  if (!lead) return null
  return (
    <section aria-label={t('Tin nổi bật')} className={`news-featured${side.length ? '' : ' is-single'}`}>
      <NewsCardView card={lead} lang={lang} priority variant="lead" />
      {side.length ? (
        <div className="news-featured-side">
          {side.map((card) => <NewsCardView card={card} key={card.slug} lang={lang} variant="side" />)}
        </div>
      ) : null}
    </section>
  )
}

function HomeSkeleton() {
  return (
    <>
      <div className="news-featured">
        <NewsCardSkeleton variant="lead" />
        <div className="news-featured-side">
          <NewsCardSkeleton variant="side" />
          <NewsCardSkeleton variant="side" />
        </div>
      </div>
      <div className="news-grid">
        <NewsCardSkeleton />
        <NewsCardSkeleton />
        <NewsCardSkeleton />
      </div>
    </>
  )
}

// /tin-tuc: pinned posts on top, then one block per category with its newest posts.
export function NewsHome({ lang }: { lang: Lang }) {
  const [data, setData] = useState<NewsHomeData | null>(null)
  const [failed, setFailed] = useState(false)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    setFailed(false)
    getNewsHome(controller.signal)
      .then(setData)
      .catch(() => { if (!controller.signal.aborted) setFailed(true) })
    return () => controller.abort()
  }, [attempt])

  const empty = data && !data.featured.length && !data.categories.length

  return (
    <>
      <section aria-labelledby="news-home-title" className="news-hero">
        <div aria-hidden="true" className="news-hero-glow" />
        <div className="news-hero-copy">
          <NewsEyebrow>{t('CEO WORKFORCE INDEX · TIN TỨC')}</NewsEyebrow>
          <h1 id="news-home-title">{t('Tin tức & Góc nhìn')}</h1>
          <p>{t('Cập nhật hoạt động của CEO Workforce Index, sự kiện Bàn tròn CEO và góc nhìn của chuyên gia về năng lực lãnh đạo, đội ngũ quản lý và Hệ cộng lực của doanh nghiệp Việt Nam.')}</p>
        </div>
        {data && data.categories.length > 1 ? (
          <nav aria-label={t('Chuyên mục')} className="news-chips">
            {data.categories.map((block) => (
              <NewsLink className="news-chip" key={block.category.slug} to={newsPaths.category(block.category.slug)}>
                {block.category.name[lang]}
                <span>{block.total}</span>
              </NewsLink>
            ))}
          </nav>
        ) : null}
      </section>

      {failed ? <NewsError onRetry={() => setAttempt((value) => value + 1)} /> : null}
      {!failed && !data ? <HomeSkeleton /> : null}
      {empty ? (
        <div className="news-empty">
          <span className="news-empty-icon"><Newspaper aria-hidden="true" size={28} /></span>
          <h2>{t('Tin tức đang được cập nhật')}</h2>
          <p>{t('Các bài viết đầu tiên sẽ sớm có mặt tại đây. Anh/Chị vui lòng quay lại sau.')}</p>
        </div>
      ) : null}

      {data ? <FeaturedGrid data={data} lang={lang} /> : null}

      {data?.categories.map((block) => (
        <section aria-labelledby={`news-block-${block.category.slug}`} className="news-block" key={block.category.slug}>
          <header className="news-block-head">
            <div>
              <h2 id={`news-block-${block.category.slug}`}>
                <NewsLink to={newsPaths.category(block.category.slug)}>{block.category.name[lang]}</NewsLink>
              </h2>
              {block.category.description[lang] ? <p>{block.category.description[lang]}</p> : null}
            </div>
            {block.total > block.posts.length ? (
              <NewsLink className="news-more-link" to={newsPaths.category(block.category.slug)}>
                <span>{t('Xem tất cả')}</span>
                <ArrowRight aria-hidden="true" size={16} />
              </NewsLink>
            ) : null}
          </header>
          <div className="news-grid" data-count={Math.min(block.posts.length, 3)}>
            {block.posts.map((card) => <NewsCardView card={card} key={card.slug} lang={lang} showCategory={false} variant={block.posts.length === 1 ? 'wide' : 'standard'} />)}
          </div>
        </section>
      ))}

      {data ? <NewsCta /> : null}
    </>
  )
}
