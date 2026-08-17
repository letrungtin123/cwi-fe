import type { LegalDocumentSection } from './legalDocumentTypes'

export const operationSections: LegalDocumentSection[] = [
  {
    id: 'vision',
    title: '1. Tầm nhìn',
    blocks: [
      { type: 'paragraph', text: 'Trở thành la bàn chiến lược giúp lãnh đạo doanh nghiệp định hướng năng lực thực thi của tổ chức trên hành trình tăng trưởng.' },
    ],
  },
  {
    id: 'mission',
    title: '2. Sứ mệnh',
    blocks: [
      { type: 'paragraph', text: 'Giúp lãnh đạo doanh nghiệp nhìn rõ và củng cố năng lực vận hành tích hợp giữa Con người, AI, Công nghệ và Hệ sinh thái, từ đó hiện thực hóa chiến lược tăng trưởng một cách hiệu quả và bền vững.' },
    ],
  },
  {
    id: 'activities',
    title: '3. Các hoạt động chính',
    blocks: [
      { type: 'paragraph', text: 'Các hoạt động trọng tâm của CWI gồm:' },
      {
        type: 'list',
        items: [
          'Quarterly Index: Chỉ số đo lường năng lực thực thi theo quý.',
          'Executive Snapshot: Tổng quan ngắn gọn dành cho nhà điều hành.',
          'Executive Brief: Phân tích chuyên sâu và hàm ý chiến lược.',
          'CEO Roundtable: Tọa đàm định kỳ dành cho CEO và lãnh đạo cấp cao.',
          'Yearly Event: Sự kiện thường niên kết nối và chia sẻ tri thức.',
          'AI Advisor: Trợ lý trí tuệ nhân tạo.',
          'Các chương trình nghiên cứu, đào tạo và phổ biến kiến thức phục vụ cộng đồng doanh nghiệp.',
        ],
      },
    ],
  },
  {
    id: 'principles',
    title: '4. Năm nguyên tắc cốt lõi',
    blocks: [
      { type: 'paragraph', emphasis: true, text: '4.1 Độc lập' },
      { type: 'paragraph', text: 'CWI không phục vụ riêng cho lợi ích thương mại của bất kỳ nhà cung cấp, doanh nghiệp, nhà tài trợ hoặc nhóm lợi ích nào.' },
      { type: 'paragraph', text: 'Mức độ đóng góp tài chính không quyết định nội dung nghiên cứu, kết quả chỉ số hoặc khuyến nghị của CWI.' },
      { type: 'paragraph', emphasis: true, text: '4.2 Dựa trên bằng chứng' },
      { type: 'paragraph', text: 'Mọi nhận định và khuyến nghị phải được xây dựng trên dữ liệu, nghiên cứu, kinh nghiệm thực tiễn hoặc ý kiến chuyên gia có thể kiểm chứng.' },
      { type: 'paragraph', text: 'CWI công khai phương pháp luận, phạm vi dữ liệu và những giới hạn quan trọng của từng kết quả nghiên cứu.' },
      { type: 'paragraph', emphasis: true, text: '4.3 Thực tiễn' },
      { type: 'paragraph', text: 'Các sản phẩm của CWI phải giúp nhà lãnh đạo hiểu vấn đề, xác định ưu tiên và chuyển hóa insight thành hành động cụ thể.' },
      { type: 'paragraph', emphasis: true, text: '4.4 Đồng kiến tạo' },
      { type: 'paragraph', text: 'CWI tin rằng tri thức có chất lượng cao hơn khi được xây dựng từ nhiều góc nhìn.' },
      { type: 'paragraph', text: 'Dữ liệu và insight được đồng kiến tạo cùng CEO, chuyên gia, doanh nghiệp, cộng đồng nghề nghiệp, trường/viện, startup, nền tảng công nghệ và các đối tác uy tín.' },
      { type: 'paragraph', emphasis: true, text: '4.5 Cởi mở' },
      { type: 'paragraph', text: 'CWI chào đón các tổ chức và cá nhân có cùng giá trị tham gia hệ sinh thái trên cơ sở tự nguyện, minh bạch và không độc quyền.' },
      { type: 'paragraph', text: 'Trong mỗi nhóm đối tác có thể có nhiều tổ chức cùng tham gia, nhằm bảo đảm tính đa dạng và hạn chế sự chi phối của một bên duy nhất.' },
    ],
  },
  {
    id: 'governance',
    title: '5. Mô hình quản trị',
    blocks: [
      { type: 'paragraph', text: 'CWI được vận hành thông qua các cơ chế quản trị sau:' },
      { type: 'paragraph', emphasis: true, text: '5.1 Ban Quản trị' },
      { type: 'paragraph', text: 'Ban Quản trị định hướng chiến lược, giám sát việc thực hiện sứ mệnh và bảo đảm các nguồn lực của CWI được sử dụng vì lợi ích chung.' },
      { type: 'paragraph', text: 'Ban Quản trị họp định kỳ ít nhất hai lần mỗi năm. Về nguyên tắc, mỗi nhóm đối tác chỉ có tối đa một đại diện trong Ban.' },
      { type: 'paragraph', emphasis: true, text: '5.2 Ban Điều hành' },
      { type: 'paragraph', text: 'Ban Điều hành chịu trách nhiệm tổ chức các hoạt động thường xuyên, triển khai kế hoạch nghiên cứu, phát triển cộng đồng, quản lý nguồn lực và báo cáo kết quả hoạt động.' },
      { type: 'paragraph', emphasis: true, text: '5.3 Ban Biên tập' },
      { type: 'paragraph', text: 'Ban Biên tập có toàn quyền chuyên môn đối với nội dung do CWI phát hành.' },
      { type: 'paragraph', text: 'Mọi dữ liệu, insight và nội dung - kể cả nội dung do đối tác đóng góp - đều phải được kiểm chứng và đáp ứng các tiêu chuẩn về tính chính xác, khách quan và đáng tin cậy.' },
      { type: 'paragraph', text: 'Nhà tài trợ và đối tác không được can thiệp vào kết luận nghiên cứu hoặc yêu cầu CWI điều chỉnh nội dung để phục vụ lợi ích riêng.' },
    ],
  },
  {
    id: 'partners',
    title: '6. Vai trò của các đối tác',
    blocks: [
      { type: 'paragraph', text: 'CWI phát triển trên mô hình “co-created intelligence” - tri thức được đồng kiến tạo bởi nhiều thành phần trong hệ sinh thái.' },
      { type: 'paragraph', text: 'Các nhóm đối tác có thể bao gồm:' },
      {
        type: 'list',
        items: [
          'Đối tác tri thức: đóng góp chuyên gia, nghiên cứu, case study, phản biện và kiểm chứng.',
          'Đối tác cộng đồng: kết nối CEO, hỗ trợ khảo sát, tọa đàm và các hoạt động cộng đồng.',
          'Đối tác truyền thông: phổ biến insight và đưa tri thức đến với thị trường.',
          'Đối tác công nghệ - vận hành: đóng góp giải pháp AI, dữ liệu, nền tảng và năng lực phân tích.',
        ],
      },
      { type: 'paragraph', text: 'Không đối tác nào phải đảm nhiệm tất cả các vai trò. CWI phát huy thế mạnh riêng của từng bên để tạo ra giá trị chung.' },
      { type: 'paragraph', text: 'Việc tham gia CWI không đồng nghĩa với quyền kiểm soát nội dung, quyền ưu tiên trong bảng xếp hạng hoặc sự chứng thực thương mại từ CWI.' },
    ],
  },
  {
    id: 'resources',
    title: '7. Quản lý tài trợ và nguồn lực',
    blocks: [
      { type: 'paragraph', text: 'CWI có thể tiếp nhận tài trợ, đóng góp tự nguyện và các nguồn thu hợp pháp khác phù hợp với sứ mệnh.' },
      { type: 'paragraph', text: 'Các nguồn lực này được sử dụng cho:' },
      {
        type: 'list',
        items: [
          'Nghiên cứu và phát triển hệ thống chỉ số.',
          'Xây dựng nền tảng dữ liệu và công nghệ.',
          'Tổ chức tọa đàm, sự kiện và chương trình cộng đồng.',
          'Sản xuất và phổ biến các sản phẩm tri thức.',
          'Phát triển đội ngũ và năng lực vận hành.',
          'Bảo đảm an toàn dữ liệu, chất lượng nghiên cứu và tính độc lập biên tập.',
        ],
      },
      { type: 'paragraph', text: 'CWI không tiếp nhận tài trợ kèm điều kiện làm sai lệch kết quả nghiên cứu, hạn chế quyền công bố hoặc tạo lợi thế không công bằng cho một đối tác.' },
      { type: 'paragraph', text: 'Mọi khoản thặng dư đều được tái đầu tư cho sứ mệnh của CWI và không được phân chia cho người sáng lập, thành viên hoặc đối tác.' },
    ],
  },
  {
    id: 'data-privacy',
    title: '8. Dữ liệu và quyền riêng tư',
    blocks: [
      { type: 'paragraph', text: 'CWI chỉ thu thập dữ liệu cần thiết cho các mục tiêu nghiên cứu và hoạt động đã được thông báo.' },
      { type: 'paragraph', text: 'Dữ liệu do thành viên và đối tác đóng góp được quản lý theo các nguyên tắc được công bố tại chính sách bảo mật.' },
      { type: 'paragraph', text: 'Khi một đối tác dừng hợp tác, dữ liệu đã đóng góp có thể tiếp tục được lưu giữ dưới dạng tổng hợp hoặc ẩn danh để bảo đảm tính liên tục của benchmark, nếu phù hợp với thỏa thuận và quy định pháp luật.' },
    ],
  },
  {
    id: 'intellectual-property',
    title: '9. Sở hữu trí tuệ',
    blocks: [
      { type: 'paragraph', text: 'Đối tác giữ quyền đối với dữ liệu và tài sản trí tuệ gốc do mình sở hữu.' },
      { type: 'paragraph', text: 'Quyền đối với phương pháp luận, hệ thống chỉ số, báo cáo, nền tảng, phần mềm và nội dung do CWI phát triển thuộc CWI hoặc được xác định theo thỏa thuận đồng kiến tạo.' },
      { type: 'paragraph', text: 'Đối tác có thể trích dẫn và sử dụng các kết quả được cấp quyền, với điều kiện ghi nguồn đầy đủ, không làm sai lệch nội dung và không sử dụng thương hiệu CWI để ngụ ý sự chứng thực khi chưa được chấp thuận.' },
    ],
  },
  {
    id: 'responsible-ai',
    title: '10. Sử dụng AI có trách nhiệm',
    blocks: [
      { type: 'paragraph', text: 'Các công cụ AI của CWI được thiết kế để hỗ trợ con người phân tích thông tin và ra quyết định.' },
      { type: 'paragraph', text: 'CWI cam kết:' },
      {
        type: 'list',
        items: [
          'Có sự giám sát của con người đối với các đầu ra quan trọng.',
          'Kiểm tra chất lượng và nguy cơ thiên lệch.',
          'Bảo vệ dữ liệu được sử dụng trong hệ thống.',
          'Công khai những giới hạn quan trọng của công cụ.',
          'Không trình bày nội dung do AI tạo ra như một kết luận tuyệt đối.',
          'Không sử dụng AI để thay thế trách nhiệm và phán đoán của nhà lãnh đạo.',
        ],
      },
    ],
  },
  {
    id: 'conduct',
    title: '11. Xung đột lợi ích và chuẩn mực ứng xử',
    blocks: [
      { type: 'paragraph', text: 'Thành viên Ban Quản trị, Ban Điều hành, Ban Biên tập, chuyên gia và các bên tham gia phải công khai những lợi ích có thể ảnh hưởng đến tính khách quan của mình.' },
      { type: 'paragraph', text: 'Người có xung đột lợi ích không được tham gia thẩm định, biểu quyết hoặc phê duyệt vấn đề liên quan trực tiếp đến lợi ích đó.' },
      { type: 'paragraph', emphasis: true, text: 'CWI không chấp nhận:' },
      {
        type: 'list',
        items: [
          'Hối lộ hoặc lợi ích không phù hợp.',
          'Can thiệp vào kết quả nghiên cứu.',
          'Làm sai lệch hoặc che giấu dữ liệu.',
          'Sử dụng thông tin nội bộ để thu lợi riêng.',
          'Quấy rối, phân biệt đối xử hoặc trả đũa người phản ánh.',
          'Nhân danh CWI khi chưa được ủy quyền.',
        ],
      },
    ],
  },
  {
    id: 'transparency',
    title: '12. Minh bạch và trách nhiệm giải trình',
    blocks: [
      { type: 'paragraph', text: 'CWI công bố định kỳ các thông tin phù hợp về:' },
      {
        type: 'list',
        items: [
          'Hoạt động và tác động của tổ chức.',
          'Cơ cấu quản trị.',
          'Phương pháp luận chủ chốt.',
          'Các nhóm đối tác và nguồn tài trợ trọng yếu.',
          'Việc sử dụng nguồn lực.',
          'Chính sách dữ liệu và xung đột lợi ích.',
          'Các đính chính quan trọng đối với nội dung đã phát hành.',
        ],
      },
      { type: 'paragraph', text: 'CWI duy trì cơ chế tiếp nhận phản hồi, khiếu nại và phản ánh vi phạm.' },
    ],
  },
  {
    id: 'participation',
    title: '13. Tham gia và chấm dứt hợp tác',
    blocks: [
      { type: 'paragraph', text: 'Tổ chức và cá nhân có thể tham gia CWI khi:' },
      {
        type: 'list',
        items: [
          'Đồng thuận với tầm nhìn, sứ mệnh và nguyên tắc hoạt động.',
          'Có năng lực hoặc nguồn lực phù hợp để đóng góp.',
          'Cam kết tuân thủ quy định về đạo đức, bảo mật, dữ liệu và xung đột lợi ích.',
          'Được chấp thuận theo quy trình xét duyệt của CWI.',
        ],
      },
      { type: 'paragraph', text: 'Các bên có quyền chủ động chấm dứt hợp tác. Những nghĩa vụ đã phát sinh về bảo mật, dữ liệu, sở hữu trí tuệ và tài chính vẫn tiếp tục có hiệu lực theo thỏa thuận liên quan.' },
      { type: 'paragraph', text: 'CWI có quyền tạm đình chỉ hoặc chấm dứt hợp tác khi một bên vi phạm nghiêm trọng các nguyên tắc hoạt động, làm sai lệch dữ liệu hoặc gây tổn hại đáng kể đến uy tín và tính độc lập của CWI.' },
    ],
  },
  {
    id: 'amendments',
    title: '14. Sửa đổi quy chế',
    blocks: [
      { type: 'paragraph', text: 'Quy chế này được rà soát định kỳ để phản ánh sự phát triển của CWI, thay đổi của công nghệ, yêu cầu của cộng đồng và quy định pháp luật.' },
      { type: 'paragraph', text: 'Các thay đổi quan trọng phải được cơ quan quản trị có thẩm quyền thông qua và công bố minh bạch trên các kênh chính thức của CWI.' },
    ],
  },
]
