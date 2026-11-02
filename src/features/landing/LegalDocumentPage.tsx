import { ChevronRight, ShieldCheck } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import footerLogo from '@/assets/figma/footer-logo.svg'
import image131 from '@/assets/figma/image-131.png'
import { t } from '@/i18n'
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
    return <p className={block.emphasis ? 'policy-subheading' : 'policy-paragraph'}>{t(block.text)}</p>
  }

  return (
    <ul className="policy-list">
      {block.items.map((item) => <li key={item}>{t(item)}</li>)}
    </ul>
  )
}


function LegalDocumentToc({ items }: { items: readonly LegalTocItem[] }) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? '')
  const [isOpen, setIsOpen] = useState(false)
  const mobileToggleRef = useRef<HTMLButtonElement>(null)
  const sheetRef = useRef<HTMLElement>(null)

  useEffect(() => {
    let frame = 0

    const syncActiveSection = () => {
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(() => {
        const anchorLine = window.innerHeight * 0.28
        let currentId = items[0]?.id ?? ''

        for (const item of items) {
          const section = document.getElementById('policy-' + item.id)
          if (section && section.getBoundingClientRect().top <= anchorLine) currentId = item.id
        }

        setActiveId((previous) => previous === currentId ? previous : currentId)
      })
    }

    syncActiveSection()
    window.addEventListener('scroll', syncActiveSection, { passive: true })
    window.addEventListener('resize', syncActiveSection)

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', syncActiveSection)
      window.removeEventListener('resize', syncActiveSection)
    }
  }, [items])

  useEffect(() => {
    if (!isOpen) return

    const previousOverflow = document.body.style.overflow
    const toggleButton = mobileToggleRef.current
    document.body.style.overflow = 'hidden'

    const focusableSelector = 'button, a[href]'
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
        return
      }

      if (event.key !== 'Tab') return
      const focusable = sheetRef.current
        ? Array.from(sheetRef.current.querySelectorAll<HTMLElement>(focusableSelector))
        : []
      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    window.requestAnimationFrame(() => sheetRef.current?.querySelector<HTMLElement>(focusableSelector)?.focus())
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
      toggleButton?.focus()
    }
  }, [isOpen])

  const activeIndex = Math.max(0, items.findIndex((item) => item.id === activeId))
  const activeItem = items[activeIndex] ?? items[0]

  const selectSection = (id: string) => {
    setActiveId(id)
    setIsOpen(false)
    const target = document.getElementById('policy-' + id)
    if (!target) return

    window.history.replaceState(null, '', '#policy-' + id)
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <aside className="privacy-toc privacy-toc-desktop" aria-label={t('Mục lục tài liệu')}>
        <div className="privacy-toc-heading">
          <span>{t('Nội dung')}</span>
          <strong>{t('Mục lục')}</strong>
        </div>
        <nav className="privacy-toc-links">
          {items.map((item, index) => (
            <a className={item.id === activeId ? 'is-active' : undefined} href={'#policy-' + item.id} key={item.id} onClick={() => setActiveId(item.id)}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              {t(item.label)}
              <ChevronRight aria-hidden="true" size={15} strokeWidth={1.8} />
            </a>
          ))}
        </nav>
      </aside>

      <div className={isOpen ? 'privacy-mobile-toc is-open' : 'privacy-mobile-toc'}>
        <div className="privacy-mobile-toc-bar">
          <div className="privacy-mobile-toc-current" aria-live="polite">
            <span>{String(activeIndex + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}</span>
            <strong>{activeItem ? t(activeItem.label) : null}</strong>
          </div>
          <button aria-expanded={isOpen} className="privacy-mobile-toc-trigger" onClick={() => setIsOpen(true)} ref={mobileToggleRef} type="button">
            <span>{t('Mục lục')}</span>
            <ChevronRight aria-hidden="true" size={16} strokeWidth={2} />
          </button>
        </div>

        {isOpen && (
          <div className="privacy-mobile-toc-backdrop" onMouseDown={() => setIsOpen(false)}>
            <section aria-label={t('Mục lục tài liệu')} className="privacy-mobile-toc-sheet" onMouseDown={(event) => event.stopPropagation()} ref={sheetRef} role="dialog">
              <div className="privacy-mobile-toc-sheet-head">
                <div>
                  <span>{t('Nội dung')}</span>
                  <strong>{t('Mục lục')}</strong>
                </div>
                <button aria-label={t('Đóng mục lục')} className="privacy-mobile-toc-close" onClick={() => setIsOpen(false)} type="button">×</button>
              </div>
              <nav className="privacy-mobile-toc-sheet-links">
                {items.map((item, index) => (
                  <button className={item.id === activeId ? 'is-active' : undefined} key={item.id} onClick={() => selectSection(item.id)} type="button">
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <strong>{t(item.label)}</strong>
                    <ChevronRight aria-hidden="true" size={16} strokeWidth={1.8} />
                  </button>
                ))}
              </nav>
            </section>
          </div>
        )}
      </div>
    </>
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
          <h2>{t('CHÍNH SÁCH BẢO MẬT')}</h2>
          <p>{t('Mọi dữ liệu doanh nghiệp nhập vào hệ thống AI đều được mã hóa đầu cuối theo tiêu chuẩn bảo mật quốc tế')} <strong>ISO/IEC 27001.</strong></p>
          <p>{t('Chúng tôi cam kết không chia sẻ dữ liệu cho bên thứ ba dưới bất kỳ hình thức nào.')}</p>
        </div>
        <div className="privacy-footer-column">
          <h2>{t('THÔNG TIN LIÊN HỆ ĐẶC QUYỀN')}</h2>
          <p><strong>Hotline VIP (24/7):</strong> 0909 123 456</p>
          <p><strong>{t('Email Ban điều hành CWI:')}</strong> cwi@xyz.com</p>
          <p><strong>{t('Trụ sở:')}</strong> {t('36 Mạc Đĩnh Chi, phường Tân Định, TP. HCM')}</p>
        </div>
      </div>
      <div className="privacy-footer-bottom">
        <nav aria-label={t('Thông tin pháp lý')} className="privacy-footer-links">
          <a href="/privacy-policy">{t('Chính sách bảo mật')}</a>
          <a href="/terms-of-operation">{t('Quy chế hoạt động')}</a>
        </nav>
        <p>{t('Bản quyền 2026 Toàn bộ quyền sở hữu trí tuệ thuộc về các')} <strong>{t('Đơn vị đồng tổ chức và Đối tác.')}</strong></p>
      </div>
    </footer>
  )
}

export function LegalDocumentPage({ config }: { config: LegalDocumentConfig }) {
  const pageTitle = t(config.pageTitle)

  useEffect(() => {
    const previousTitle = document.title
    document.title = pageTitle

    return () => {
      document.title = previousTitle
    }
  }, [pageTitle])

  return (
    <div className="privacy-page">
      <SiteHeader isPolicyPage />
      <main className="privacy-main">
        <section className="privacy-hero" aria-labelledby="legal-document-title">
          <div className="privacy-hero-glow" aria-hidden="true" />
          <div className="privacy-hero-copy">
            <div className="privacy-eyebrow"><span /> {t(config.heroEyebrow)}</div>
            <h1 id="legal-document-title">{t(config.heroTitle)}</h1>
            <p>{t(config.heroDescription)}</p>
          </div>
        </section>

        <div className="privacy-layout" id="policy-content">
          <LegalDocumentToc items={config.toc} />

          <article className="privacy-document">
            <div className="privacy-document-intro">
              <span className="privacy-document-icon"><ShieldCheck aria-hidden="true" size={22} strokeWidth={1.7} /></span>
              <div>
                <p className="privacy-document-kicker">{t(config.documentKicker)}</p>
                {config.documentIntro.map((paragraph) => <p key={paragraph}>{t(paragraph)}</p>)}
              </div>
            </div>

            <header className="privacy-document-heading">
              <span>{t(config.documentTitle)}</span>
              <small>{t('Nội dung được trình bày theo tài liệu CWI')}</small>
            </header>

            {config.sections.map((section) => (
              <section className="privacy-section" id={'policy-' + section.id} key={section.id}>
                <h2>{t(section.title)}</h2>
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
