export type LikertQuestion = {
  n: number
  q: string
  type: 'likert'
}

export type McqQuestion = {
  instruction?: string
  n: number
  options: string[]
  q: string
  type: 'mcq'
}

export type TextQuestion = {
  n: number
  q: string
  type: 'text'
}

export type SurveyQuestion = LikertQuestion | McqQuestion | TextQuestion

export const jobTitleOptions = [
  'Chủ tịch HĐQT',
  'CEO / Tổng Giám đốc',
  'Phó Tổng Giám đốc',
  'Giám đốc / C-level',
  'Giám đốc Khối / Business Unit',
  'Founder / Chủ doanh nghiệp',
  'HRD/HRM',
  'Khác',
] as const

// Question set of the 2026Q4 edition. Text must match the backend and the CWI AI
// registry character for character; the backend rejects any other wording.
export const SURVEY_VERSION = '2026Q4'

export const partOneQuestions: SurveyQuestion[] = [
  { n: 1, type: 'likert', q: 'Chúng tôi có đủ năng lực để thích ứng nhanh trước thay đổi của thị trường.' },
  { n: 2, type: 'likert', q: 'AI và công nghệ đang giúp cải thiện hiệu quả quản trị.' },
  { n: 3, type: 'likert', q: 'Người quản lý có đủ dữ liệu để ra quyết định kịp thời.' },
  { n: 4, type: 'likert', q: 'Các phòng ban phối hợp hiệu quả để đạt mục tiêu chung.' },
  { n: 5, type: 'likert', q: 'Chúng tôi có thể mở rộng quy mô mà không phụ thuộc quá nhiều vào một vài cá nhân chủ chốt.' },
  { n: 6, type: 'likert', q: 'Văn hóa doanh nghiệp hỗ trợ hiệu suất cao.' },
  { n: 7, type: 'likert', q: 'Ban điều hành của chúng tôi có tầm nhìn rõ ràng và hiểu sâu sắc về cách AI sẽ thay đổi mô hình kinh doanh của doanh nghiệp.' },
  { n: 8, type: 'likert', q: 'Chúng tôi đã thiết lập các chính sách và nguyên tắc quản trị (governance) rõ ràng để bảo đảm việc sử dụng dữ liệu và AI an toàn, đạo đức.' },
  { n: 9, type: 'likert', q: 'Đội ngũ quản lý và nhân viên của chúng tôi đang chủ động ứng dụng công nghệ/AI để nâng cao hiệu suất làm việc hàng ngày.' },
  { n: 10, type: 'likert', q: 'Chúng tôi nhận diện rõ những kỹ năng nào sắp lỗi thời và đang chủ động đào tạo lại (reskill/upskill) cho lực lượng lao động.' },
  { n: 11, type: 'likert', q: 'Đội ngũ của chúng tôi có tư duy cởi mở, không e ngại sự thay đổi và học hỏi rất nhanh các phương thức làm việc mới.' },
  { n: 12, type: 'likert', q: 'Cơ cấu tổ chức của chúng tôi tinh gọn, ít tầng nấc quan liêu, cho phép ra quyết định và hành động nhanh chóng.' },
  { n: 13, type: 'likert', q: 'Các phòng ban trong công ty có khả năng phá vỡ ranh giới (silo) để phối hợp chéo một cách linh hoạt khi có dự án hoặc chiến lược mới.' },
  { n: 14, type: 'likert', q: 'Chu kỳ lập kế hoạch chiến lược và phân bổ nguồn lực của chúng tôi đủ nhanh để bắt kịp những biến động bất ngờ của thị trường.' },
  { n: 15, type: 'likert', q: 'Chúng tôi đang ưu tiên đầu tư xây dựng các năng lực mới cho tương lai (emerging skills) thay vì chỉ tuyển dụng để lấp đầy các vị trí hiện tại.' },
  { n: 16, type: 'likert', q: 'AI và công nghệ đang mở ra cơ hội đột phá về mô hình vận hành cho doanh nghiệp, chứ không chỉ dừng lại ở việc cắt giảm chi phí.' },
  {
    n: 17,
    type: 'mcq',
    q: 'Trong 12 tháng tới, rủi ro lớn nhất cản trở doanh nghiệp của anh/chị trở nên sẵn sàng cho tương lai (Future-Ready) là gì?',
    options: ['Ban điều hành thiếu tầm nhìn và tư duy về AI.', 'Đội ngũ thiếu kỹ năng và e ngại sự thay đổi.', 'Cơ cấu tổ chức cồng kềnh, phản ứng chậm.', 'Nguồn lực hạn chế để đầu tư chuyển đổi.', 'Thiếu hụt các nhân tài có kỹ năng mới (Strategic Skills).', 'Khác.'],
  },
  {
    n: 18,
    type: 'mcq',
    q: 'Nếu chỉ được đầu tư vào một ưu tiên duy nhất để xây dựng lực lượng lao động tương lai, anh/chị sẽ chọn điều gì?',
    options: ['Đào tạo kỹ năng AI và năng lực số cho toàn hệ thống.', 'Tái cấu trúc tổ chức để tăng tốc độ và sự linh hoạt.', 'Đưa AI vào quá trình ra quyết định của Ban điều hành.', 'Xây dựng văn hóa đổi mới sáng tạo và thử nghiệm.', 'Xây dựng hệ thống quản trị dữ liệu (Data Governance).', 'Khác.'],
  },
]

export const partTwoQuestions: SurveyQuestion[] = [
  {
    n: 19,
    type: 'mcq',
    q: 'Khi thị trường biến động mạnh hoặc xuất hiện công nghệ đột phá, phản ứng của tổ chức anh/chị thường diễn ra như thế nào?',
    options: ['Chờ chỉ đạo từ Ban điều hành rồi mới lập kế hoạch ứng phó.', 'Mất nhiều tháng để điều chỉnh quy trình và phân bổ lại nguồn lực.', 'Các phòng ban phối hợp chậm chạp, có xu hướng đùn đẩy trách nhiệm.', 'Nhanh chóng lập các nhóm phản ứng nhanh (cross-functional) để xử lý.', 'Tổ chức tự điều chỉnh rất linh hoạt mà không cần chỉ đạo gắt gao.'],
  },
  {
    n: 20,
    type: 'mcq',
    q: 'Đối với việc ứng dụng AI và tự động hóa, chiến lược hiện tại của doanh nghiệp anh/chị nghiêng về hướng nào nhất?',
    options: ['Chúng tôi vẫn đang quan sát, chưa có ưu tiên đầu tư rõ ràng.', 'Ứng dụng nhỏ lẻ ở một vài phòng ban (như Marketing, IT) theo nhu cầu tự phát.', 'Chủ yếu ứng dụng để cắt giảm chi phí và thay thế các tác vụ thủ công.', 'Triển khai có hệ thống để nâng cao năng suất và ra quyết định.', 'AI là trọng tâm chiến lược để chuyển đổi hoàn toàn mô hình kinh doanh.'],
  },
  {
    n: 21,
    type: 'mcq',
    q: 'Khi nghĩ về nguồn nhân lực cho 3 năm tới (đặc biệt trước làn sóng AI), rào cản nào khiến anh/chị lo ngại nhất?',
    options: ['Nhân viên hiện tại thiếu kỹ năng số/AI và e ngại sự thay đổi.', 'Rất khó tuyển dụng được nhân tài có các kỹ năng công nghệ mới.', 'Cấu trúc tổ chức hiện tại quá cứng nhắc để tích hợp công nghệ mới.', 'Chúng tôi không có dữ liệu để đánh giá năng lực thực sự của đội ngũ.', 'Tôi không lo ngại vì đã có lộ trình nâng cấp năng lực rõ ràng.'],
  },
  {
    n: 22,
    type: 'mcq',
    q: 'Hiện tại, các quyết định điều hành của doanh nghiệp dựa nhiều nhất vào yếu tố nào?',
    options: ['Chủ yếu dựa vào kinh nghiệm và trực giác của người quản lý.', 'Dữ liệu bị phân mảnh, phòng ban nào dùng số liệu của phòng ban đó.', 'Có hệ thống báo cáo nhưng thường chậm trễ, chỉ phản ánh dữ liệu quá khứ.', 'Hệ thống dữ liệu cập nhật theo thời gian thực (real-time) để hỗ trợ quyết định.', 'Đang ứng dụng AI và phân tích dự báo (predictive) để chủ động định hướng.'],
  },
  {
    n: 23,
    type: 'mcq',
    q: 'Quy mô doanh thu của công ty hiện nay:',
    options: ['Dưới 100 tỉ VND', 'Từ 100 - <300 tỉ VND', 'Từ 300 - <1000 tỉ VND', 'Từ 1000 - <5000 tỉ VND', 'Từ 5000 - <10000 tỉ VND', 'Từ 10000 tỉ VND trở lên'],
  },
  { n: 24, type: 'text', q: 'Website chính thức của công ty' },
]

// The 2026Q4 edition has no local domain grouping; CWI AI computes its
// weighted indexes inside the generated report.
export const surveyDomains: ReadonlyArray<{ name: string; questionNumbers: readonly number[] }> = []

export const introCopy = {
  eyebrow: 'Phần 1 / 3 · Khảo sát CEO Workforce Index 2026Q4',
  title: 'Hệ cộng lực sẵn sàng',
  emphasis: 'cho Tương lai',
  paragraphs: [
    'CEO Workforce Index (CWI) là sáng kiến nghiên cứu và đối chuẩn phi lợi nhuận, hướng tới xây dựng bộ dữ liệu đối chuẩn đầu tiên tại Việt Nam về Hệ cộng lực (Workforce Plus) — năng lực kết hợp con người, AI, tự động hóa và nguồn lực hệ sinh thái để hiện thực hóa chiến lược và thúc đẩy phát triển bền vững.',
    'Sau khảo sát “Năng lực Lãnh đạo cho Tăng trưởng” triển khai trong Q3/2026, CWI tiếp tục thực hiện khảo sát “Hệ cộng lực sẵn sàng cho tương lai” dành cho lãnh đạo cấp C trong Q4/2026. Dữ liệu khảo sát sẽ được chuyển hóa thành những góc nhìn thực tiễn, làm cơ sở cho đối thoại và kiểm chứng cùng cộng đồng doanh nghiệp.',
    'Sau khi dữ liệu được tổng hợp và phân tích, Quý Anh/Chị sẽ nhận được Báo cáo Chẩn đoán Hệ cộng lực sẵn sàng cho tương lai, được chia làm hai phần:',
    'Mỗi phản hồi của Quý Anh/Chị sẽ góp phần tạo nên một chuẩn tham chiếu mới cho cộng đồng doanh nghiệp Việt Nam và giúp bản thân thấy rõ và có biện pháp can thiệp sớm cho riêng doanh nghiệp mình.',
  ],
}

export const reportParts = [
  {
    kicker: '1. Phần 1',
    title: 'Khảo sát và Báo cáo Khuyết danh',
    bullets: [
      'Bức tranh tổng quan về năng lực lãnh đạo và năng lực tổ chức phục vụ tăng trưởng;',
      'So sánh doanh nghiệp của Anh/Chị với bối cảnh và xu hướng chung của thị trường;',
    ],
  },
  {
    kicker: '2. Phần 2',
    title: 'Khảo sát Định danh và Báo cáo Riêng tư',
    bullets: [
      'Nhận diện những khoảng trống và rủi ro có thể ảnh hưởng đến khả năng mở rộng của doanh nghiệp;',
      'Những khuyến nghị hành động ưu tiên giúp CEO nâng cao năng lực thực thi trong giai đoạn tiếp theo',
    ],
  },
]

export const contactCopy = {
  thankYou:
    'Chúng tôi trân trọng cảm ơn Quý Anh/Chị đã nhận lời đồng hành với tư cách CEO Đồng kiến tạo của CEO Workforce Index 2026 và dành thời gian thực hiện khảo sát này. Vui lòng điền email ở ô bên dưới để nhận Báo cáo được gửi riêng đến Quý Anh/Chị.',
  anonymousPrivacy:
    'Bằng việc chọn "Đồng ý", Anh/Chị chấp thuận cho Ban Điều hành dự án CEO Workforce Index thu thập, lưu trữ, xử lý dữ liệu cá nhân của Anh/Chị và gửi báo cáo khảo sát cho Anh/Chị',
  privatePrivacy: [
    'Dữ liệu cá nhân được sử dụng nhằm tiếp nhận thông tin khảo sát và gửi thông tin khác liên quan đến hoạt động của Ban Điều hành. Thông qua đó, Anh/Chị có thể nhận thông tin, tài liệu và hỗ trợ từ Ban Điều hành. Ban Điều hành cam kết thu thập, sử dụng, lưu trữ, bảo vệ và xử lý dữ liệu cá nhân theo đúng quy định của pháp luật và Chính sách bảo vệ dữ liệu cá nhân hiện hành.',
    'Bằng việc chọn "Đồng ý", Anh/Chị xác nhận đã đọc, hiểu và chấp thuận cho Ban Điều hành dự án CEO Workforce Index thu thập, lưu trữ, xử lý dữ liệu cá nhân của Anh/Chị và gửi báo cáo khảo sát cho Anh/Chị',
  ],
}

export const roundtableCopy = {
  title: 'Đăng kí tham dự CEO Roundtable',
  paragraphs: [
    'Sau khi hoàn tất quá trình phân tích dữ liệu, Quý Anh/Chị sẽ được trân trọng mời tham dự CEO Roundtable – phiên đối thoại giới hạn dành riêng cho các CEO Đồng kiến tạo.',
    'Tại đây, Quý Anh/Chị sẽ là một trong những người đầu tiên tiếp cận những phát hiện nổi bật của nghiên cứu, cùng trao đổi với các CEO khác về những thách thức và cơ hội trong việc xây dựng năng lực lãnh đạo, phát triển tổ chức và ứng dụng AI để tạo lợi thế cạnh tranh bền vững.',
  ],
}
