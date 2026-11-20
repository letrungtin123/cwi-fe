import { ArrowRight, ArrowUpRight, Clock3 } from 'lucide-react'
import { clearSurveySession } from '@/features/survey/surveyPersistence'
import { t, type Lang } from '@/i18n'
import { formatNewsDate, readingTime } from './newsFormat'
import { newsImageUrl, type NewsCard } from './newsApi'
import { NewsLink } from './NewsLink'
import { newsPaths } from './newsRouting'

export function NewsMeta({ card, lang }: { card: Pick<NewsCard, 'publishedAt' | 'readingMinutes'>; lang: Lang }) {
  return (
    <p className="news-meta">
      <time dateTime={card.publishedAt}>{formatNewsDate(card.publishedAt, lang)}</time>
      <span aria-hidden="true" className="news-meta-dot" />
      <span className="news-meta-read"><Clock3 aria-hidden="true" size={13} strokeWidth={2} />{readingTime(card.readingMinutes[lang])}</span>
    </p>
  )
}

function CardImage({ card, lang, priority = false, sizes }: { card: NewsCard; lang: Lang; priority?: boolean; sizes: string }) {
  const src = newsImageUrl(card.coverUrl)
  return (
    <div className="news-card-media">
      {src ? (
        <img
          alt={card.coverAlt[lang] || ''}
          decoding="async"
          fetchPriority={priority ? 'high' : undefined}
          loading={priority ? 'eager' : 'lazy'}
          sizes={sizes}
          src={src}
        />
      ) : <div aria-hidden="true" className="news-card-media-empty" />}
    </div>
  )
}

// lead / side: the pinned posts on top of /tin-tuc. wide: a category with a single post.
export type NewsCardVariant = 'lead' | 'side' | 'standard' | 'wide'

// One post as a card. The title is the link; it covers the whole card, so the picture and the
// text open the post too, while screen readers hear a single link.
export function NewsCardView({ card, lang, priority = false, showCategory = true, variant = 'standard' }: {
  card: NewsCard
  lang: Lang
  priority?: boolean
  showCategory?: boolean
  variant?: NewsCardVariant
}) {
  const Heading = variant === 'lead' ? 'h2' : 'h3'
  return (
    <article className={`news-card news-card--${variant}`}>
      <CardImage card={card} lang={lang} priority={priority} sizes={variant === 'lead' ? '(max-width: 900px) 100vw, 760px' : variant === 'wide' ? '(max-width: 900px) 100vw, 640px' : '(max-width: 900px) 100vw, 400px'} />
      <div className="news-card-body">
        {showCategory ? <span className="news-card-category">{card.category.name[lang]}</span> : null}
        <Heading className="news-card-title">
          <NewsLink className="news-card-link" to={newsPaths.post(card.slug)}>{card.title[lang]}</NewsLink>
        </Heading>
        {variant !== 'side' ? <p className="news-card-excerpt">{card.excerpt[lang]}</p> : null}
        <NewsMeta card={card} lang={lang} />
      </div>
    </article>
  )
}

export function NewsCardSkeleton({ variant = 'standard' }: { variant?: NewsCardVariant }) {
  return (
    <div aria-hidden="true" className={`news-card news-card--${variant} news-card--skeleton`}>
      <div className="news-card-media news-skeleton" />
      <div className="news-card-body">
        <span className="news-skeleton news-skeleton-line is-short" />
        <span className="news-skeleton news-skeleton-line" />
        <span className="news-skeleton news-skeleton-line is-mid" />
      </div>
    </div>
  )
}

function startSurvey() {
  // The same as the landing page's "Thực hiện khảo sát": a new attempt, at /survey.
  clearSurveySession()
  window.history.pushState(null, '', '/survey')
  window.dispatchEvent(new CustomEvent('cwi:landing-action', { detail: { action: 'survey' } }))
}

// What a reader coming from an ad can do next: take the survey or read the quarterly report.
export function NewsCta({ compact = false }: { compact?: boolean }) {
  return (
    <section aria-labelledby="news-cta-title" className={`news-cta${compact ? ' news-cta--compact' : ''}`}>
      <div aria-hidden="true" className="news-cta-glow" />
      <div className="news-cta-copy">
        <p className="news-eyebrow"><span />CEO WORKFORCE INDEX</p>
        <h2 id="news-cta-title">{t('Doanh nghiệp của Anh/Chị đang ở đâu trên bản đồ Hệ cộng lực?')}</h2>
        <p>{t('Tham gia khảo sát của CEO Workforce Index để đối chuẩn Hệ cộng lực (con người - AI - tự động hoá - hệ sinh thái) của doanh nghiệp bạn với thị trường, hiểu nguyên nhân và nhận khuyến nghị hành động.')}</p>
      </div>
      <div className="news-cta-actions">
        <button className="news-button news-button--primary" onClick={startSurvey} type="button">
          <span>{t('Thực hiện khảo sát')}</span>
          <ArrowRight aria-hidden="true" size={18} />
        </button>
        <a className="news-button news-button--ghost" href="/bao-cao-quy">
          <span>{t('Xem báo cáo quý')}</span>
          <ArrowUpRight aria-hidden="true" size={18} />
        </a>
      </div>
    </section>
  )
}

export function NewsEyebrow({ children }: { children: string }) {
  return <p className="news-eyebrow"><span />{children}</p>
}
