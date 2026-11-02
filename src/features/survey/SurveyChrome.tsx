import { ArrowLeft, Menu } from 'lucide-react'
import type { ReactNode } from 'react'
import { t } from '@/i18n'
import { LanguageToggle } from '@/i18n/LanguageToggle'
import { figmaAssets } from '../landing/figmaAssets'

export type SurveyBrandMarkVariant = 'header' | 'intro' | 'trust' | 'report'

type SurveyHeaderProps = {
  canGoBack?: boolean
  canOpenDrawer: boolean
  onBackHome: () => void
  onOpenDrawer: () => void
}

export function SurveyBrandMark({
  className = '',
  decorative = false,
  variant = 'header',
}: {
  className?: string
  decorative?: boolean
  variant?: SurveyBrandMarkVariant
}) {
  return (
    <img
      alt={decorative ? '' : 'CEO Workforce Index'}
      aria-hidden={decorative ? 'true' : undefined}
      className={'survey-brand-mark survey-brand-mark--' + variant + (className ? ' ' + className : '')}
      src={figmaAssets.cwiLogo}
    />
  )
}

export function SurveyForwardArrow() {
  return <img alt="" aria-hidden="true" className="survey-button-arrow" src={figmaAssets.arrow1} />
}

export function SurveyHeader({ canGoBack = true, canOpenDrawer, onBackHome, onOpenDrawer }: SurveyHeaderProps) {
  return (
    <header className="survey-app-header">
      <div className="survey-header-inner">
        <div className="survey-header-leading">
          <button aria-label={t('Quay lại')} className="survey-header-home" disabled={!canGoBack} onClick={onBackHome} type="button">
            <ArrowLeft aria-hidden="true" size={18} />
            <span>{t('Quay lại')}</span>
          </button>
        </div>
        <div className="survey-header-logo">
          <SurveyBrandMark variant="header" />
        </div>
        <div className="survey-header-actions">
          <div className="survey-header-actions-row">
            <LanguageToggle className="survey-header-lang" />
            {canOpenDrawer ? (
              <button aria-label={t('Mở danh sách câu hỏi')} className="survey-header-menu" onClick={onOpenDrawer} type="button">
                <Menu aria-hidden="true" size={18} />
                <span>{t('Danh sách câu hỏi')}</span>
              </button>
            ) : <span aria-hidden="true" className="survey-header-spacer" />}
          </div>
        </div>
      </div>
    </header>
  )
}
export function SurveyEyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="survey-eyebrow">
      <i />
      {children}
    </span>
  )
}
