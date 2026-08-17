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

export const partOneQuestions: SurveyQuestion[] = [
  { n: 1, type: 'likert', q: 'Doanh nghiệp của chúng tôi có đủ năng lực nhân sự để đạt mục tiêu tăng trưởng mong muốn trong 2–3 năm tới.' },
  { n: 2, type: 'likert', q: 'Đội ngũ quản lý của chúng tôi chuyển hóa chiến lược thành kết quả một cách hiệu quả.' },
  { n: 3, type: 'likert', q: 'Tôi tin tưởng vào năng lực của đội ngũ quản lý.' },
  { n: 4, type: 'likert', q: 'Đội ngũ quản lý hiện tại đủ sức hỗ trợ kế hoạch tăng trưởng mà CEO mong đợi.' },
  { n: 5, type: 'likert', q: 'Chúng tôi giữ chân được nhân tài quan trọng.' },
  { n: 6, type: 'likert', q: 'Tôi tin Hệ năng lực (bao gồm  con người, AI, công nghệ, dữ liệu, đối tác) hiện tại sẽ tạo lợi thế cạnh tranh trong 3 năm tới.' },
  { n: 7, type: 'likert', q: 'Đội ngũ quản lý của chúng tôi có thể chuyển các ưu tiên chiến lược thành hành động nhất quán trong đơn vị mình phụ trách.' },
  { n: 8, type: 'likert', q: 'Các quản lý có đủ quyền và năng lực để tự ra quyết định trong phạm vi trách nhiệm mà không phải phụ thuộc quá nhiều vào cấp trên.' },
  { n: 9, type: 'likert', q: 'Các quản lý chủ động phát triển đội ngũ kế cận thay vì chỉ tập trung hoàn thành mục tiêu ngắn hạn.' },
  { n: 10, type: 'likert', q: 'Nếu một quản lý chủ chốt rời khỏi doanh nghiệp trong hôm nay, chúng tôi có người đủ năng lực để thay thế trong thời gian hợp lý.' },
  { n: 11, type: 'likert', q: 'Chúng tôi có khả năng xác định sớm những nhân sự có tiềm năng trở thành lãnh đạo trong tương lai.' },
  { n: 12, type: 'likert', q: 'Các chương trình phát triển lãnh đạo đã tạo ra sự cải thiện rõ rệt trong chất lượng quản lý và kết quả kinh doanh.' },
  { n: 13, type: 'likert', q: 'Đội ngũ quản lý của chúng tôi thích nghi nhanh với những thay đổi về công nghệ, dữ liệu và cách thức làm việc mới.' },
  { n: 14, type: 'likert', q: 'CEO và Giám đốc nhân sự có cùng quan điểm về chất lượng đội ngũ quản lý và các ưu tiên phát triển trong 12 tháng tới.' },
  { n: 15, type: 'likert', q: 'Khi doanh nghiệp mở rộng quy mô hoặc triển khai chiến lược mới, đội ngũ quản lý hiện tại đủ năng lực để dẫn dắt sự thay đổi.' },
  { n: 16, type: 'likert', q: 'Những quản lý giỏi nhất trong doanh nghiệp đang giúp nhân rộng năng lực cho tổ chức, thay vì chỉ tạo ra kết quả trong phạm vi đội ngũ của mình.' },
  {
    n: 17,
    type: 'mcq',
    q: 'Trong 12 tháng tới, rủi ro lớn nhất đối với tăng trưởng của doanh nghiệp liên quan đến đội ngũ quản lý là gì?',
    options: ['Thiếu năng lực quản lý', 'Thiếu người kế nhiệm', 'Khó tuyển quản lý giỏi', 'Quản lý chưa theo kịp AI/chuyển đổi số', 'CEO và Nhân sự chưa thống nhất', 'Mục khác:'],
  },
  {
    n: 18,
    type: 'mcq',
    q: 'Nếu chỉ được đầu tư vào một ưu tiên duy nhất trong năm tới, anh/chị sẽ chọn điều gì?',
    options: ['Phát triển năng lực quản lý', 'Xây dựng đội ngũ kế nhiệm', 'Nâng cao năng lực lãnh đạo trong chuyển đổi', 'AI cho đội ngũ quản lý', 'Coaching và phát triển nhân tài', 'Mục khác:'],
  },
]

export const partTwoQuestions: SurveyQuestion[] = [
  {
    n: 19,
    type: 'mcq',
    q: 'Khi doanh nghiệp cần đưa ra một quyết định quan trọng trong vòng 48 giờ, điều nào mô tả đúng nhất?',
    options: ['CEO là người ra quyết định cuối cùng trong hầu hết trường hợp', 'Ban điều hành cùng thống nhất trước khi quyết định', 'Business Unit có quyền quyết định trong phạm vi của mình', 'Quyền quyết định đã được phân cấp rõ đến các cấp quản lý.', 'Mục khác:'],
  },
  {
    n: 20,
    type: 'mcq',
    q: 'Nếu ngày mai doanh nghiệp mở thêm một chi nhánh, nhà máy hoặc đơn vị kinh doanh mới, điều gì sẽ là thách thức lớn nhất trong 90 ngày đầu?',
    options: ['Tìm người quản lý đủ năng lực', 'Đảm bảo các đơn vị phối hợp nhất quán', 'Chuẩn hóa quy trình và cách làm', 'Tuyển đủ nhân sự', 'Tôi tin doanh nghiệp đã sẵn sàng để mở rộng', 'Mục khác:'],
  },
  {
    n: 21,
    type: 'mcq',
    q: 'Nếu anh/chị vắng mặt trong ba tháng, điều gì khiến anh/chị lo ngại nhất?',
    options: ['Các quyết định quan trọng sẽ chậm lại', 'Chiến lược sẽ khó được triển khai nhất quán', 'Thiếu người đủ năng lực để thay thế', 'Các đơn vị sẽ phối hợp kém', 'Tôi không quá lo vì đội ngũ đã đủ trưởng thành', 'Mục khác:'],
  },
  {
    n: 22,
    type: 'mcq',
    q: 'Hiện nay, điều gì đang giới hạn khả năng tăng trưởng của doanh nghiệp nhiều nhất?',
    options: ['Thị trường', 'Nguồn vốn', 'Năng lực đội ngũ quản lý', 'Khả năng thực thi', 'Hệ thống và quy trình', 'Tôi chưa thấy có rào cản lớn', 'Mục khác:'],
  },
  {
    n: 23,
    type: 'mcq',
    q: 'Quy mô doanh thu của công ty hiện nay',
    instruction: '*Lựa chọn 1 đáp án phù hợp nhất',
    options: ['Dưới 100 tỷ VND', 'Từ 100 - <300 tỷ VND', 'Từ 300 - <1,000 tỷ VND', 'Từ 1,000 - <5,000 tỷ VND', 'Từ 5,000 - <10,000 tỷ VND', 'Trên 10,000 tỷ VND'],
  },
  { n: 24, type: 'text', q: 'Website công ty' },
]

export const surveyDomains = [
  { name: 'Thực thi chiến lược', questionNumbers: [2, 7, 15] },
  { name: 'Năng lực quản lý', questionNumbers: [3, 4, 8, 16] },
  { name: 'Kế nhiệm & nhân tài', questionNumbers: [5, 9, 10, 11, 12] },
  { name: 'Thích nghi & Hệ cộng lực', questionNumbers: [1, 6, 13] },
  { name: 'CEO–Nhân sự Alignment', questionNumbers: [14] },
] as const

export const introCopy = {
  eyebrow: 'Phần 1 / 3 · Khảo sát CEO Workforce Index 2026Q3',
  title: 'Năng lực Lãnh đạo',
  emphasis: 'cho Tăng trưởng',
  paragraphs: [
    'CEO Workforce Index (CWI) là dự án nghiên cứu và đối chuẩn Hệ cộng lực — kết nối con người, AI, công nghệ và hệ sinh thái thành một khối năng lực để hiện thực hóa chiến lược và phát triển bền vững. Mục tiêu của sáng kiến phi lợi nhuận này là cùng cộng đồng CEO xây dựng bộ dữ liệu đối chuẩn đầu tiên về "Hệ cộng lực" và bắt đầu bằng "Năng lực Lãnh đạo cho Tăng trưởng" (Leadership Capacity to Scale) của doanh nghiệp Việt Nam.',
    'Ngay trong mùa đầu tiên, Ban Tổ chức không triển khai khảo sát đại trà mà lựa chọn một Nhóm CEO Đồng kiến tạo gồm những nhà lãnh đạo đại diện cho nhiều ngành nghề và quy mô doanh nghiệp khác nhau. Quý Anh/Chị là một trong những CEO được Ban Tổ chức trân trọng mời tham gia Nhóm đồng kiến tạo này.',
    'Sau khi dữ liệu được tổng hợp và phân tích, Quý Anh/Chị sẽ nhận được Báo cáo Chẩn đoán Năng lực Lãnh đạo cho Tăng trưởng, được chia làm hai phần:',
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
  privacy: [
    'Dữ liệu cá nhân được sử dụng nhằm tiếp nhận thông tin khảo sát và gửi thông tin khác liên quan đến hoạt động của Ban Tổ chức. Thông qua đó, Anh/Chị có thể nhận thông tin, tài liệu và hỗ trợ từ Ban Tổ Chức.',
    'Thông tin riêng của doanh nghiệp là để dùng cho Báo cáo riêng của doanh nghiệp và không dùng để huấn luyện AI. Ban Tổ chức cam kết thu thập, sử dụng, lưu trữ, bảo vệ và xử lý dữ liệu cá nhân theo đúng quy định của pháp luật và Chính sách bảo vệ dữ liệu cá nhân hiện hành.',
    'Bằng việc chọn "Đồng ý", Anh/Chị xác nhận đã đọc, hiểu và chấp thuận cho Ban Tổ chức dự án CEO Workforce Index thu thập, lưu trữ, sử dụng và xử lý dữ liệu cá nhân của Anh/Chị cho mục đích của sáng kiến cộng đồng này.',
  ],
}

export const roundtableCopy = {
  title: 'Đăng kí tham dự CEO Roundtable',
  paragraphs: [
    'Sau khi hoàn tất quá trình phân tích dữ liệu, Quý Anh/Chị sẽ được trân trọng mời tham dự CEO Roundtable – phiên đối thoại giới hạn dành riêng cho các CEO Đồng kiến tạo.',
    'Tại đây, Quý Anh/Chị sẽ là một trong những người đầu tiên tiếp cận những phát hiện nổi bật của nghiên cứu, cùng trao đổi với các CEO khác về những thách thức và cơ hội trong việc xây dựng năng lực lãnh đạo, phát triển tổ chức và ứng dụng AI để tạo lợi thế cạnh tranh bền vững.',
  ],
  meta: [
    '11:00 – 13:30 | Thứ Năm, ngày 17/09/2026',
    'Quy mô giới hạn: Tối đa 30 người',
    'Địa điểm: Sẽ được thông báo trong thư xác nhận',
  ],
}