import { useId } from 'react'

// Heading and grid of quarter cards, shared by /survey (survey quarters) and /bao-cao-quy
// (quarterly reports). The newest quarter's card is highlighted.

export type QuarterCardItem = {
  buttonLabel: string
  description: string
  id: string
  image: string | null | undefined
  isCurrent: boolean
  kicker: string
  onSelect: () => void
  title: string
}

type QuarterCardSectionProps = {
  description: string
  // null while the cards are loading.
  items: QuarterCardItem[] | null
  kicker: string
  loadingText: string
  title: string
}

export function QuarterCardSection({ description, items, kicker, loadingText, title }: QuarterCardSectionProps) {
  const headingId = useId()
  return (
    <section aria-labelledby={headingId} className="survey-quarters">
      <p className="survey-quarters-kicker">{kicker}</p>
      <h2 id={headingId}>{title}</h2>
      {description ? <p className="survey-quarters-description">{description}</p> : null}

      {items ? (
        <div className={'survey-quarter-grid' + (items.length === 1 ? ' survey-quarter-grid--single' : '')}>
          {items.map((item) => {
            const titleId = `${headingId}-${item.id}`
            return (
              <article className={'survey-quarter-card' + (item.isCurrent ? ' is-current' : '')} key={item.id}>
                {/* The whole picture is shown (report covers are portrait); a blurred copy fills the rest of the frame. */}
                <div className="survey-quarter-media">
                  {item.image ? (
                    <>
                      <img alt="" aria-hidden="true" className="survey-quarter-media-backdrop" decoding="async" loading="lazy" src={item.image} />
                      <img alt="" className="survey-quarter-media-image" decoding="async" loading="lazy" src={item.image} />
                    </>
                  ) : null}
                </div>
                <div className="survey-quarter-body">
                  <p className="survey-quarter-kicker">{item.kicker}</p>
                  <h3 id={titleId}>{item.title}</h3>
                  {item.description ? <p className="survey-quarter-description">{item.description}</p> : null}
                  <span aria-hidden="true" className="survey-quarter-spacer" />
                  <button aria-describedby={titleId} className="survey-quarter-button" onClick={item.onSelect} type="button">
                    <span>{item.buttonLabel}</span>
                    <span aria-hidden="true">→</span>
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      ) : (
        <p className="survey-quarters-loading" role="status">{loadingText}</p>
      )}
    </section>
  )
}
