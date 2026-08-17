import { LegalDocumentPage, type LegalDocumentConfig } from './LegalDocumentPage'
import { policySections } from './privacyPolicyContent'

const privacyToc = [
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

const privacyConfig: LegalDocumentConfig = {
  pageTitle: 'Chính sách bảo vệ dữ liệu cá nhân | CEO Workforce Index',
  heroEyebrow: 'CWI / CHÍNH SÁCH BẢO MẬT',
  heroTitle: 'Chính sách bảo vệ và xử lý dữ liệu cá nhân',
  heroDescription: 'Thông báo minh bạch về cách CWI thu thập, sử dụng, lưu trữ và bảo vệ dữ liệu cá nhân trong quá trình bạn tham gia các hoạt động của CEO Workforce Index.',
  documentKicker: 'THÔNG BÁO VỀ VIỆC BẢO VỆ VÀ XỬ LÝ DỮ LIỆU CÁ NHÂN',
  documentTitle: 'CHÍNH SÁCH BẢO VỆ VÀ XỬ LÝ DỮ LIỆU CÁ NHÂN',
  documentIntro: [
    'Nhằm giúp bạn an tâm về việc dữ liệu cá nhân do mình là Chủ Thể Dữ Liệu hoặc là Bên Xử Lý Dữ Liệu hoặc là Bên Kiểm Soát Dữ Liệu hoặc là bên có liên quan (sau đây gọi chung là “Dữ Liệu Cá Nhân”) luôn được bảo mật tại CWI. Chúng tôi gửi đến bạn Thông báo về việc bảo vệ và xử lý dữ liệu cá nhân.',
    'Chi tiết thông báo này, vui lòng xem tại “Chính Sách Bảo Vệ và Xử Lý Dữ Liệu Cá Nhân”. Chính Sách Bảo Vệ Và Xử Lý Dữ Liệu Cá Nhân này có thể thay đổi khi cần thiết, và phiên bản cập nhật mới nhất sẽ được tải trên trang thông tin điện tử chính thức của chúng tôi hoặc được chúng tôi thông báo qua hình thức điện tử hoặc phi điện tử.',
    'Bằng việc nhấn vào nút “Đồng Ý”, bạn xác nhận đã đọc, hiểu rõ và tự nguyện đồng ý với toàn bộ nội dung tại Chính Sách Bảo Vệ Và Xử Lý Dữ Liệu Cá Nhân cũng như đồng ý cho phép CWI thực hiện việc thu thập/sử dụng/xử lý Dữ Liệu Cá Nhân đã cung cấp cho CWI.',
  ],
  toc: privacyToc,
  sections: policySections,
}

export function PrivacyPolicyPage() {
  return <LegalDocumentPage config={privacyConfig} />
}
