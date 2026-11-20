import { ArrowLeft, RefreshCw, SearchX, WifiOff } from 'lucide-react'
import { Component, type ReactNode } from 'react'
import { t } from '@/i18n'
import { NewsLink } from './NewsLink'
import { newsPaths } from './newsRouting'

export function NewsError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="news-empty" role="alert">
      <span className="news-empty-icon"><WifiOff aria-hidden="true" size={28} /></span>
      <h2>{t('Chưa tải được tin tức')}</h2>
      <p>{t('Kết nối đang chậm hoặc bị gián đoạn. Anh/Chị vui lòng thử lại.')}</p>
      <button className="news-button news-button--outline" onClick={onRetry} type="button">
        <RefreshCw aria-hidden="true" size={16} />
        <span>{t('Thử lại')}</span>
      </button>
    </div>
  )
}

export function NewsNotFound({ message }: { message: string }) {
  return (
    <div className="news-empty news-empty--page">
      <span className="news-empty-icon"><SearchX aria-hidden="true" size={28} /></span>
      <h1>{t('Không tìm thấy trang')}</h1>
      <p>{message}</p>
      <NewsLink className="news-button news-button--outline" to={newsPaths.home()}>
        <ArrowLeft aria-hidden="true" size={16} />
        <span>{t('Về trang Tin tức')}</span>
      </NewsLink>
    </div>
  )
}

// A post that fails to render shows the error box with header and footer still in place,
// instead of a blank page.
export class NewsErrorBoundary extends Component<{ children: ReactNode; resetKey: string }, { failed: boolean; resetKey: string }> {
  state = { failed: false, resetKey: this.props.resetKey }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  static getDerivedStateFromProps(props: { resetKey: string }, state: { failed: boolean; resetKey: string }) {
    return props.resetKey === state.resetKey ? null : { failed: false, resetKey: props.resetKey }
  }

  render() {
    return this.state.failed ? <NewsError onRetry={() => window.location.reload()} /> : this.props.children
  }
}
