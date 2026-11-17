import { useEffect, useState } from 'react'
import { t, useLang } from '@/i18n'
import { getSurveyQuarters, surveyQuarterImageUrl, type SurveyQuarterList } from './surveyApi'
import { getSurveyEdition, LATEST_SURVEY_VERSION, surveyQuarterLabel } from './surveyEditions'
import { hasSurveyDraft } from './surveyPersistence'

// Shown when the card list cannot be loaded: only the current quarter, with its default text,
// so the survey can still be taken.
const fallback: SurveyQuarterList = {
  page: {
    description: {
      en: "Choose the survey edition that fits you to benchmark your organization's capabilities and keep tracking how your company moves quarter by quarter.",
      vi: 'Chọn kỳ khảo sát phù hợp để đối chuẩn năng lực tổ chức và tiếp tục theo dõi sự dịch chuyển của doanh nghiệp qua từng quý.',
    },
    kicker: { en: 'CEO Workforce Index · 2026 Survey', vi: 'CEO Workforce Index · Khảo sát 2026' },
    title: { en: 'Quarterly surveys', vi: 'Khảo sát theo quý' },
  },
  quarters: [
    {
      description: {
        en: 'Benchmark your Workforce Plus (people - AI - automation - ecosystem) and how ready your team is for the next stage of operations.',
        vi: 'Đối chuẩn Hệ cộng lực (con người - AI - tự động hoá - hệ sinh thái) và mức độ sẵn sàng của đội ngũ cho giai đoạn vận hành tiếp theo.',
      },
      imageUrl: null,
      isCurrent: true,
      label: { en: surveyQuarterLabel(LATEST_SURVEY_VERSION, 'en'), vi: surveyQuarterLabel(LATEST_SURVEY_VERSION, 'vi') },
      surveyVersion: LATEST_SURVEY_VERSION,
      title: { en: 'A Future-Ready Workforce', vi: 'Đội ngũ sẵn sàng cho tương lai' },
    },
  ],
}

// Only quarters this page has questions for; the newest of them is highlighted.
function usable(list: SurveyQuarterList): SurveyQuarterList {
  const quarters = list.quarters.filter((quarter) => getSurveyEdition(quarter.surveyVersion))
  return quarters.length ? { ...list, quarters } : fallback
}

type SurveyQuarterCardsProps = {
  onSelect: (surveyVersion: string) => void
}

export function SurveyQuarterCards({ onSelect }: SurveyQuarterCardsProps) {
  const lang = useLang()
  const [list, setList] = useState<SurveyQuarterList | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    getSurveyQuarters(controller.signal)
      .then((result) => setList(usable(result)))
      .catch(() => {
        if (!controller.signal.aborted) setList(fallback)
      })
    return () => controller.abort()
  }, [])

  const page = (list ?? fallback).page

  return (
    <section aria-labelledby="survey-quarters-title" className="survey-quarters">
      <p className="survey-quarters-kicker">{page.kicker[lang]}</p>
      <h2 id="survey-quarters-title">{page.title[lang]}</h2>
      {page.description[lang] ? <p className="survey-quarters-description">{page.description[lang]}</p> : null}

      {list ? (
        <div className={'survey-quarter-grid' + (list.quarters.length === 1 ? ' survey-quarter-grid--single' : '')}>
          {list.quarters.map((quarter) => {
            const edition = getSurveyEdition(quarter.surveyVersion)
            const titleId = `survey-quarter-title-${quarter.surveyVersion}`
            const image = quarter.imageUrl ? surveyQuarterImageUrl(quarter.imageUrl) : edition?.defaultImage
            return (
              <article className={'survey-quarter-card' + (quarter.isCurrent ? ' is-current' : '')} key={quarter.surveyVersion}>
                <div className="survey-quarter-media">{image ? <img alt="" decoding="async" loading="lazy" src={image} /> : null}</div>
                <div className="survey-quarter-body">
                  <p className="survey-quarter-kicker">{t('Khảo sát {label}', { label: quarter.label[lang] })}</p>
                  <h3 id={titleId}>{quarter.title[lang]}</h3>
                  {quarter.description[lang] ? <p className="survey-quarter-description">{quarter.description[lang]}</p> : null}
                  <span aria-hidden="true" className="survey-quarter-spacer" />
                  <button aria-describedby={titleId} className="survey-quarter-button" onClick={() => onSelect(quarter.surveyVersion)} type="button">
                    <span>{hasSurveyDraft(quarter.surveyVersion) ? t('Tiếp tục khảo sát') : t('Làm khảo sát ngay')}</span>
                    <span aria-hidden="true">→</span>
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      ) : (
        <p className="survey-quarters-loading" role="status">{t('Đang tải các kỳ khảo sát…')}</p>
      )}
    </section>
  )
}
