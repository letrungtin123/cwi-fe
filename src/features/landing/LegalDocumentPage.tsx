import { ChevronRight, ShieldCheck } from 'lucide-react'
import { useEffect } from 'react'
import footerLogo from '@/assets/figma/footer-logo.svg'
import image131 from '@/assets/figma/image-131.png'
import { SiteHeader } from './LandingPage'
import type { LegalDocumentBlock, LegalDocumentSection } from './legalDocumentTypes'
import './privacyPolicy.css'

export type LegalTocItem = {
  id: string
  label: string
}

export type LegalDocumentConfig = {
  pageTitle: string
  heroEyebrow: string
  heroTitle: string
  heroDescription: string
  documentKicker: string
  documentTitle: string
  documentIntro: string[]
  toc: readonly LegalTocItem[]
  sections: readonly LegalDocumentSection[]
}

function DocumentBlock({ block }: { block: LegalDocumentBlock }) {
  if (block.type === 'paragraph') {
    return <p className={block.emphasis ? 'policy-subheading' : 'policy-paragraph'}>{block.text}</p>
  }

  return (
    <ul className="policy-list">
      {block.items.map((item) => <li key={item}>{item}</li>)}
    </ul>
  )
}

function LegalDocumentFooter() {
  return (
    <footer className="privacy-footer">
      <img alt="" aria-hidden="true" className="privacy-footer-pattern" src={image131} />
      <div className="privacy-footer-grid">
        <div className="privacy-footer-brand">
          <img alt="CEO Workforce Index" className="privacy-footer-logo" src={footerLogo} />
        </div>
        <div className="privacy-footer-column">
          <h2>CHÍNH SÁCH BẢO MẬT</h2>
          <p>Mọi dữ liệu doanh nghiệp nhập vào hệ thống AI đều được mã hóa đầu cuối theo tiêu chuẩn bảo mật quốc tế <strong>ISO/IEC 27001.</strong></p>
          <p>Chúng tôi cam kết không chia sẻ dữ liệu cho bên thứ ba dưới bất kỳ hình thức nào.</p>
        </div>
        <div className="privacy-footer-column">
          <h2>THÔNG TIN LIÊN HỆ ĐẶC QUYỀN</h2>
          <p><strong>Hotline VIP (24/7):</strong> 0909 123 456</p>
          <p><strong>Email Ban điều hành CWI:</strong> cwi@xyz.com</p>
          <p><strong>Trụ sở:</strong> 36 Mạc Đĩnh Chi, phường Tân Định, TP. HCM</p>
        </div>
      </div>
      <div className="privacy-footer-bottom">
        <nav aria-label="Thông tin pháp lý" className="privacy-footer-links">
          <a href="/privacy-policy">Chính sách bảo mật</a>
          <a href="/terms-of-operation">Quy chế hoạt động</a>
        </nav>
        <p>Bản quyền 2026 Toàn bộ quyền sở hữu trí tuệ thuộc về các <strong>Đơn vị đồng tổ chức và Đối tác.</strong></p>
      </div>
    </footer>
  )
}

export function LegalDocumentPage({ config }: { config: LegalDocumentConfig }) {
  useEffect(() => {
    const previousTitle = document.title
    document.title = config.pageTitle

    return () => {
      document.title = previousTitle
    }
  }, [config.pageTitle])

  return (
    <div className="privacy-page">
      <SiteHeader isPolicyPage />
      <main className="privacy-main">
        <section className="privacy-hero" aria-labelledby="legal-document-title">
          <div className="privacy-hero-glow" aria-hidden="true" />
          <div className="privacy-hero-copy">
            <div className="privacy-eyebrow"><span /> {config.heroEyebrow}</div>
            <h1 id="legal-document-title">{config.heroTitle}</h1>
            <p>{config.heroDescription}</p>
          </div>
        </section>

        <div className="privacy-layout" id="policy-content">
          <aside className="privacy-toc" aria-label="Mục lục tài liệu">
            <div className="privacy-toc-heading">
              <span>Nội dung</span>
              <strong>Mục lục</strong>
            </div>
            <nav className="privacy-toc-links">
              {config.toc.map((item, index) => (
                <a href={'#policy-' + item.id} key={item.id}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  {item.label}
                  <ChevronRight aria-hidden="true" size={15} strokeWidth={1.8} />
                </a>
              ))}
            </nav>
          </aside>

          <article className="privacy-document">
            <div className="privacy-document-intro">
              <span className="privacy-document-icon"><ShieldCheck aria-hidden="true" size={22} strokeWidth={1.7} /></span>
              <div>
                <p className="privacy-document-kicker">{config.documentKicker}</p>
                {config.documentIntro.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
            </div>

            <header className="privacy-document-heading">
              <span>{config.documentTitle}</span>
              <small>Nội dung được trình bày theo tài liệu CWI</small>
            </header>

            {config.sections.map((section) => (
              <section className="privacy-section" id={'policy-' + section.id} key={section.id}>
                <h2>{section.title}</h2>
                <div className="privacy-section-body">
                  {section.blocks.map((block, index) => <DocumentBlock block={block} key={section.id + '-' + index} />)}
                </div>
              </section>
            ))}
          </article>
        </div>
      </main>
      <LegalDocumentFooter />
    </div>
  )
}
