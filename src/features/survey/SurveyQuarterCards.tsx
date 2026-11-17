import { useEffect, useState } from 'react'
import { t, useLang } from '@/i18n'
import { getSurveyQuarters, surveyQuarterImageUrl, type SurveyQuarterList } from './surveyApi'
import { getSurveyEdition, LATEST_SURVEY_VERSION, surveyQuarterLabel } from './surveyEditions'
import { hasSurveyDraft } from './surveyPersistence'
import { QuarterCardSection } from './QuarterCardSection'

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
    <QuarterCardSection
      description={page.description[lang]}
      items={list ? list.quarters.map((quarter) => ({
        buttonLabel: hasSurveyDraft(quarter.surveyVersion) ? t('Tiếp tục khảo sát') : t('Làm khảo sát ngay'),
        description: quarter.description[lang],
        id: quarter.surveyVersion,
        image: quarter.imageUrl ? surveyQuarterImageUrl(quarter.imageUrl) : getSurveyEdition(quarter.surveyVersion)?.defaultImage,
        isCurrent: quarter.isCurrent,
        kicker: t('Khảo sát {label}', { label: quarter.label[lang] }),
        onSelect: () => onSelect(quarter.surveyVersion),
        title: quarter.title[lang],
      })) : null}
      kicker={page.kicker[lang]}
      loadingText={t('Đang tải các kỳ khảo sát…')}
      title={page.title[lang]}
    />
  )
}
