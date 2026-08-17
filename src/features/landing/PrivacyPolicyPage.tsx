import { ChevronRight, ShieldCheck } from 'lucide-react'
import { useEffect } from 'react'
import footerLogo from '@/assets/figma/footer-logo.svg'
import image131 from '@/assets/figma/image-131.png'
import { SiteHeader } from './LandingPage'
import { policySections, type PolicyBlock } from './privacyPolicyContent'
import './privacyPolicy.css'

const policyToc = [
  { id: 'definitions', label: 'Định nghĩa' },
  { id: 'notice', label: 'Thông báo bảo vệ và xử lý' },
  { id: 'consent', label: 'Sự đồng ý' },
  { id: 'data-types', label: 'Loại dữ liệu thu thập' },
  { id: 'purposes', label: 'Mục đích xử lý' },
  { id: 'collection', label: 'Cách thức thu thập' },
  { id: 'retention', label: 'Thời hạn lưu trữ' },
  { id: 'rights', label: 'Quyền và nghĩa vụ' },
  { id: 'consequences', label: 'Hậu quả có thể xảy ra' },
  { id: 'contact', label: 'Liên hệ' },
] as const

function PolicyBlockView({ block }: { block: PolicyBlock }) {
  if (block.type === 'paragraph') {
    return <p className="policy-paragraph">{block.text}</p>
  }

  return (
    <ul className="policy-list">
      {block.items.map((item) => <li key={item}>{item}</li>)}
    </ul>
  )
}

function PolicyFooter() {
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

export function PrivacyPolicyPage() {
  useEffect(() => {
    const previousTitle = document.title
    document.title = 'Chính sách bảo vệ dữ liệu cá nhân | CEO Workforce Index'

    return () => {
      document.title = previousTitle
    }
  }, [])

  return (
    <div className="privacy-page">
      <SiteHeader isPolicyPage />
      <main className="privacy-main">
        <section className="privacy-hero" aria-labelledby="privacy-title">
          <div className="privacy-hero-glow" aria-hidden="true" />
          <div className="privacy-hero-copy">
            <div className="privacy-eyebrow"><span /> CWI / CHÍNH SÁCH BẢO MẬT</div>
            <h1 id="privacy-title">Chính sách bảo vệ và xử lý dữ liệu cá nhân</h1>
            <p>Thông báo minh bạch về cách CWI thu thập, sử dụng, lưu trữ và bảo vệ dữ liệu cá nhân trong quá trình bạn tham gia các hoạt động của CEO Workforce Index.</p>
          </div>
        </section>

        <div className="privacy-layout" id="policy-content">
          <aside className="privacy-toc" aria-label="Mục lục chính sách">
            <div className="privacy-toc-heading">
              <span>Nội dung</span>
              <strong>Mục lục</strong>
            </div>
            <nav className="privacy-toc-links">
              {policyToc.map((item, index) => (
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
                <p className="privacy-document-kicker">THÔNG BÁO VỀ VIỆC BẢO VỆ VÀ XỬ LÝ DỮ LIỆU CÁ NHÂN</p>
                <p>Nhằm giúp bạn an tâm về việc dữ liệu cá nhân do mình là Chủ Thể Dữ Liệu hoặc là Bên Xử Lý Dữ Liệu hoặc là Bên Kiểm Soát Dữ Liệu hoặc là bên có liên quan (sau đây gọi chung là “Dữ Liệu Cá Nhân”) luôn được bảo mật tại CWI. Chúng tôi gửi đến bạn Thông báo về việc bảo vệ và xử lý dữ liệu cá nhân.</p>
                <p>Chi tiết thông báo này, vui lòng xem tại “Chính Sách Bảo Vệ và Xử Lý Dữ Liệu Cá Nhân”. Chính Sách Bảo Vệ Và Xử Lý Dữ Liệu Cá Nhân này có thể thay đổi khi cần thiết, và phiên bản cập nhật mới nhất sẽ được tải trên trang thông tin điện tử chính thức của chúng tôi hoặc được chúng tôi thông báo qua hình thức điện tử hoặc phi điện tử.</p>
                <p>Bằng việc nhấn vào nút “Đồng Ý”, bạn xác nhận đã đọc, hiểu rõ và tự nguyện đồng ý với toàn bộ nội dung tại Chính Sách Bảo Vệ Và Xử Lý Dữ Liệu Cá Nhân cũng như đồng ý cho phép CWI thực hiện việc thu thập/sử dụng/xử lý Dữ Liệu Cá Nhân đã cung cấp cho CWI.</p>
              </div>
            </div>

            <header className="privacy-document-heading">
              <span>CHÍNH SÁCH BẢO VỆ VÀ XỬ LÝ DỮ LIỆU CÁ NHÂN</span>
              <small>Thông tin được trình bày theo tài liệu chính sách CWI</small>
            </header>

            {policySections.map((section) => (
              <section className="privacy-section" id={'policy-' + section.id} key={section.id}>
                <h2>{section.title}</h2>
                <div className="privacy-section-body">
                  {section.blocks.map((block, index) => <PolicyBlockView block={block} key={section.id + '-' + index} />)}
                </div>
              </section>
            ))}
          </article>
        </div>
      </main>
      <PolicyFooter />
    </div>
  )
}