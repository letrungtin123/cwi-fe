import footerLogo from '@/assets/figma/footer-logo.svg'
import image131 from '@/assets/figma/image-131.png'
import { t } from '@/i18n'
import { legalLinks } from './landingContent'
import './siteFooter.css'

// Footer of the pages outside the landing page (policies, news): the same content and look
// as the landing page footer (FooterSection on desktop, the mobile footer below 1100px).
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <img alt="" aria-hidden="true" className="site-footer-pattern" src={image131} />
      <div className="site-footer-inner">
        <div className="site-footer-main">
          <img alt="CEO Workforce Index" className="site-footer-logo" src={footerLogo} />
          <span aria-hidden="true" className="site-footer-divider" />
          <div className="site-footer-info">
            <nav aria-label={t('Thông tin pháp lý')} className="site-footer-legal">
              {legalLinks.map((link) => (
                <a href={link.href} key={link.href}>{t(link.label)}</a>
              ))}
            </nav>
            <p className="site-footer-contact"><strong>{t('LIÊN HỆ:')}</strong> contact@ceo-workforce-index.com</p>
            <p className="site-footer-address"><strong>{t('ĐỊA CHỈ:')}</strong> {t('11 Huỳnh Đình Hai, Phường Bình Thạnh, TP.HCM')}</p>
          </div>
        </div>
        <p className="site-footer-copyright">{t('Bản quyền 2026 Toàn bộ quyền sở hữu trí tuệ thuộc về SKALE')}</p>
      </div>
    </footer>
  )
}
