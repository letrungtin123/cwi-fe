import { LegalDocumentPage, type LegalDocumentConfig } from './LegalDocumentPage'
import { operationSections } from './operationPolicyContent'

const operationToc = [
  { id: 'vision', label: 'Tầm nhìn' },
  { id: 'mission', label: 'Sứ mệnh' },
  { id: 'activities', label: 'Các hoạt động chính' },
  { id: 'principles', label: 'Nguyên tắc cốt lõi' },
  { id: 'governance', label: 'Mô hình quản trị' },
  { id: 'partners', label: 'Vai trò đối tác' },
  { id: 'resources', label: 'Tài trợ và nguồn lực' },
  { id: 'data-privacy', label: 'Dữ liệu và quyền riêng tư' },
  { id: 'intellectual-property', label: 'Sở hữu trí tuệ' },
  { id: 'responsible-ai', label: 'Sử dụng AI có trách nhiệm' },
  { id: 'conduct', label: 'Xung đột lợi ích' },
  { id: 'transparency', label: 'Minh bạch và giải trình' },
  { id: 'participation', label: 'Tham gia và chấm dứt hợp tác' },
  { id: 'amendments', label: 'Sửa đổi quy chế' },
] as const

const operationConfig: LegalDocumentConfig = {
  pageTitle: 'Quy chế hoạt động | CEO Workforce Index',
  heroEyebrow: 'CWI / QUY CHẾ HOẠT ĐỘNG',
  heroTitle: 'Quy chế hoạt động của CEO Workforce Index',
  heroDescription: 'Các nguyên tắc, cơ chế quản trị và chuẩn mực vận hành được CWI công bố minh bạch để đồng kiến tạo giá trị bền vững cho cộng đồng doanh nghiệp.',
  documentKicker: 'QUY CHẾ HOẠT ĐỘNG CỦA CEO WORKFORCE INDEX',
  documentTitle: 'QUY CHẾ HOẠT ĐỘNG CỦA CEO WORKFORCE INDEX',
  documentIntro: [
    'Quy chế hoạt động của CEO Workforce Index xác lập tầm nhìn, sứ mệnh, các hoạt động chính và các nguyên tắc cốt lõi của CWI.',
    'Tài liệu quy định mô hình quản trị, vai trò của các đối tác, quản lý tài trợ và nguồn lực, dữ liệu và quyền riêng tư, sở hữu trí tuệ, sử dụng AI có trách nhiệm, chuẩn mực ứng xử và cơ chế minh bạch.',
    'Các nội dung bên dưới được trình bày theo tài liệu Quy chế hoạt động CWI.',
  ],
  toc: operationToc,
  sections: operationSections,
}

export function TermsOfOperationPage() {
  return <LegalDocumentPage config={operationConfig} />
}
