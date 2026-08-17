export type PolicyBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[] }

export type PolicySection = {
  id: string
  title: string
  blocks: PolicyBlock[]
}

export const policySections: PolicySection[] = [
  {
    id: 'definitions',
    title: 'PHẦN I - ĐỊNH NGHĨA',
    blocks: [
      {
        type: 'list',
        items: [
          '1. Chúng Tôi: có nghĩa là CEO Workforce Index và các cá nhân, tổ chức tham gia Ban Điều hành CEO Workforce Index, trong phạm vi các tổ chức đó tham gia vào việc quản lý, vận hành và phát triển Website.',
          '2. CWI: có nghĩa là dự án CEO Workforce Index hoạt động trong lĩnh vực nghiên cứu và phát triển các tiêu chuẩn về quản trị dành cho CEO, được xây dựng và vận hành bởi Ban Điều hành CEO Workforce Index.',
          '3. Đối Tác: là các tổ chức, cá nhân cung cấp dịch vụ hoặc hợp tác với CWI trong quá trình tổ chức và triển khai các hoạt động của CWI, bao gồm nhưng không giới hạn ở đối tác cung cấp nền tảng công nghệ, đơn vị tư vấn, đơn vị tổ chức sự kiện, đơn vị truyền thông, nhà tài trợ, đối tác nghiên cứu và các bên có liên quan khác.',
          '4. Thành viên: là cá nhân hoặc tổ chức đăng ký tham gia, sử dụng hoặc tương tác với các hoạt động, sự kiện, khảo sát, nền tảng hoặc các sáng kiến do CWI tổ chức hoặc điều phối.',
          '5. Dữ Liệu Cá Nhân: là thông tin dưới dạng ký hiệu, chữ viết, chữ số, hình ảnh, âm thanh hoặc dạng tương tự trên môi trường điện tử gắn liền với một con người cụ thể hoặc giúp xác định một con người cụ thể. Dữ liệu cá nhân bao gồm dữ liệu cá nhân cơ bản và dữ liệu cá nhân nhạy cảm.',
          '8. Chủ Thể Dữ Liệu Cá Nhân: là cá nhân được dữ liệu cá nhân phản ánh.',
          '9. Bên Kiểm Soát Dữ Liệu Cá Nhân: là tổ chức, cá nhân quyết định mục đích và phương tiện xử lý dữ liệu cá nhân.',
          '10. Bên Xử Lý Dữ Liệu Cá Nhân: là tổ chức, cá nhân thực hiện việc xử lý dữ liệu thay mặt cho Bên Kiểm soát dữ liệu, thông qua một hợp đồng hoặc thỏa thuận với Bên Kiểm soát dữ liệu.',
          '11. Bên Thứ Ba: là tổ chức, cá nhân ngoài Chủ thể dữ liệu, Bên Kiểm soát dữ liệu cá nhân, Bên Xử lý dữ liệu cá nhân, Bên Kiểm soát và xử lý dữ liệu cá nhân được phép xử lý dữ liệu.',
          '12. Sản phẩm, dịch vụ: bao gồm (i) Sản phẩm, dịch vụ của CWI: các sản phẩm, nội dung, chương trình và hoạt động do CWI trực tiếp hoặc thông qua Ban Điều hành thực hiện, sản xuất, tổ chức hoặc điều phối, bao gồm nhưng không giới hạn ở khảo sát, báo cáo, sự kiện, hội nghị, hội thảo, tọa đàm, podcast và các sản phẩm, nội dung, chương trình hoặc hoạt động khác do CWI triển khai theo từng thời kỳ; và (ii) Sản phẩm, dịch vụ riêng của thành viên Ban Điều hành: các sản phẩm, dịch vụ, chương trình, sự kiện và hoạt động do từng thành viên Ban Điều hành CWI tự mình thực hiện, sản xuất, cung cấp, tổ chức hoặc điều phối.',
        ],
      },
    ],
  },
  {
    id: 'notice',
    title: 'PHẦN II - THÔNG BÁO BẢO VỆ VÀ XỬ LÝ DỮ LIỆU CÁ NHÂN',
    blocks: [
      {
        type: 'list',
        items: [
          '1. Chúng tôi, luôn xem trọng sự riêng tư và bảo vệ dữ liệu cá nhân của bạn. Chúng tôi hiểu rằng, bạn cần được biết một cách minh bạch những thông tin dưới đây liên quan đến toàn bộ cách thức chúng tôi xử lý và bảo vệ dữ liệu cá nhân của bạn trong khuôn khổ quy định của pháp luật cũng như chuẩn mực bảo mật tại CWI.',
          '2. Khi nói về dữ liệu cá nhân, có nghĩa là chúng tôi đề cập đến các thông tin của bạn, ví dụ: họ, tên, thông tin liên lạc… dưới dạng ký hiệu, chữ viết, chữ số, hình ảnh, âm thanh hoặc dạng tương tự trên môi trường điện tử gắn liền với bạn. Chúng tôi xử lý dữ liệu cá nhân từ bạn với mục đích đúng đắn theo thỏa thuận trong hợp đồng, tuân thủ yêu cầu của pháp luật hoặc thực hiện các nghĩa vụ theo quy định của pháp luật hay các mục đích khác được thông báo đến bạn.',
        ],
      },
    ],
  },
  {
    id: 'consent',
    title: 'PHẦN III - SỰ ĐỒNG Ý TRONG VIỆC XỬ LÝ DỮ LIỆU CÁ NHÂN',
    blocks: [
      {
        type: 'list',
        items: [
          '1. Chúng tôi luôn duy trì nỗ lực để gửi Thông Báo về Chính Sách Bảo Vệ Và Xử Lý Dữ Liệu Cá Nhân đến bạn để đọc, hiểu, biết rõ và đồng ý một cách tự nguyện trước khi chúng tôi bắt đầu thực hiện một phần hay toàn bộ hoạt động xử lý dữ liệu cá nhân.',
          '2. Bằng việc đồng ý với nội dung của Thông báo này, bạn đồng ý cho phép CWI thực hiện việc thu thập, lưu trữ, xử lý các dữ liệu cá nhân cho các mục đích sau (Dữ Liệu Cá Nhân được hiểu là các dữ liệu được quy định tại Phần IV). Ngoài ra, bạn cũng thừa nhận rằng bạn đã nhận được sự đồng ý của các cá nhân mà bạn cung cấp Dữ Liệu Cá Nhân của họ cho Chúng tôi cho các mục đích, hoạt động thu thập và Xử Lý tại Thông báo này.',
          '3. Cho phép CWI thu thập, ghi nhận, lưu trữ, tổ chức, phân tích, chỉnh sửa, cập nhật, sử dụng, chia sẻ trong phạm vi cần thiết, lưu giữ, mã hóa, sao lưu, xóa hoặc thực hiện các hoạt động xử lý dữ liệu cá nhân khác theo quy định của pháp luật nhằm các mục đích sau:',
        ],
      },
      {
        type: 'list',
        items: [
          'a) Xác nhận, quản lý và duy trì tư cách thành viên của CWI.',
          'b) Liên hệ với Thành viên thông qua email hoặc các phương thức liên lạc mà Thành viên cung cấp.',
          'c) Gửi báo cáo nghiên cứu, bản tin, tài liệu chuyên môn, sự kiện, hội thảo, chương trình chia sẻ kiến thức và các nội dung liên quan đến quản trị doanh nghiệp, quản trị công ty, quản trị nhân sự, lãnh đạo và các chủ đề chuyên môn khác của CWI.',
          'd) Tiếp nhận, xử lý và tổng hợp các thông tin khảo sát do Thành viên cung cấp nhằm nghiên cứu, phân tích xu hướng quản trị doanh nghiệp, xây dựng báo cáo thống kê, báo cáo nghiên cứu và các ấn phẩm chuyên môn.',
          'đ) Cải thiện nội dung, chất lượng nghiên cứu, chất lượng hoạt động và trải nghiệm của Thành viên trên website của CWI.',
          'e) Thực hiện thống kê, phân tích dữ liệu ở dạng tổng hợp, ẩn danh hoặc không còn khả năng nhận diện cá nhân nhằm phục vụ hoạt động nghiên cứu, phát triển nội dung và công bố báo cáo.',
          'g) Thực hiện các nghĩa vụ theo quy định của pháp luật hoặc theo yêu cầu của cơ quan nhà nước có thẩm quyền.',
          'h) Các mục đích khác được CWI thông báo cho bạn.',
        ],
      },
      {
        type: 'list',
        items: [
          '4. Bên cạnh đó, bạn đồng ý để CWI chia sẻ dữ liệu cá nhân trong phạm vi cần thiết với:',
          'a) Các nhà cung cấp dịch vụ công nghệ thông tin, dịch vụ lưu trữ dữ liệu, dịch vụ gửi email, dịch vụ quản trị website hoặc các đơn vị cung cấp hạ tầng kỹ thuật phục vụ hoạt động của CWI.',
          'b) Các tổ chức, cá nhân hỗ trợ CWI trong việc thực hiện nghiên cứu, thống kê hoặc phát hành báo cáo, với điều kiện các tổ chức, cá nhân này chỉ được xử lý dữ liệu theo hướng dẫn của CWI và có nghĩa vụ bảo mật dữ liệu.',
          'c) Cơ quan nhà nước có thẩm quyền khi có yêu cầu theo quy định của pháp luật.',
          'd) Các bên có liên quan khác trong phạm vi cần thiết như luật sư, kế toán, cố vấn chuyên nghiệp, tổ chức thu hồi nợ, tổ chức tài chính/y tế và các bên đối tác liên quan khác.',
          '5. Cho phép Chúng tôi giới thiệu, quảng bá và cung cấp thông tin về (i) các sản phẩm, dịch vụ, chương trình, sự kiện và hoạt động của CWI; và (ii) các sản phẩm, dịch vụ, chương trình, sự kiện và hoạt động riêng của từng thành viên Ban Điều hành CWI, bao gồm việc gửi thông tin quảng cáo, tiếp thị, lời mời tham gia sự kiện, hội thảo, tọa đàm, khảo sát và các chương trình khác do CWI và/hoặc thành viên Ban Điều hành tương ứng tổ chức hoặc cung cấp.',
          '6. Sự đồng ý của bạn sẽ bị loại trừ trong trường hợp pháp luật có quy định về những trường hợp chúng tôi có thể xử lý dữ liệu cá nhân mà không cần sự đồng ý của bạn như: để phục vụ hoạt động của cơ quan nhà nước đã được quy định theo luật chuyên ngành hoặc để thực hiện nghĩa vụ theo hợp đồng/thỏa thuận mà chúng tôi ký kết với bạn.',
          '8. Bạn có thể rút lại sự đồng ý như một quyền của bạn theo luật định, trừ trường hợp chúng tôi được xử lý dữ liệu mà không cần sự đồng ý của bạn. Việc bạn rút lại sự đồng ý không ảnh hưởng đến tính hợp pháp của việc xử lý dữ liệu của chúng tôi đã được bạn đồng ý trước khi rút lại sự đồng ý. Tuy nhiên, khi bạn rút lại sự đồng ý xử lý dữ liệu cá nhân của bạn theo Chính Sách Bảo Vệ Và Xử Lý Dữ Liệu Cá Nhân, chúng tôi có thể không thực hiện được các hành động cần thiết để đạt mục đích xử lý để đảm bảo các quyền/nghĩa vụ theo quy định pháp luật hoặc quyền của bạn với tư cách là Thành viên của CWI. Khi đó, chúng tôi vẫn có thể tiếp tục xử lý dữ liệu cá nhân của bạn trong phạm vi được yêu cầu hoặc theo pháp luật hiện hành.',
        ],
      },
    ],
  },
  {
    id: 'data-types',
    title: 'PHẦN IV - CÁC LOẠI DỮ LIỆU CÁ NHÂN CHÚNG TÔI SẼ THU THẬP XỬ LÝ',
    blocks: [
      { type: 'paragraph', text: 'Chúng tôi thu thập, xử lý (và có thể kết hợp với các đối tác khác) các loại dữ liệu cá nhân về bạn như được liệt kê dưới đây:' },
      {
        type: 'list',
        items: [
          '1. Thông tin cá nhân và thông tin liên lạc chi tiết, ví dụ: chức danh, họ tên, thông tin liên lạc và lịch sử liên lạc.',
          '2. Hồ sơ liên lạc của bạn với chúng tôi như: lịch sử các cuộc gọi, các tin nhắn, các email.',
          '3. Sản phẩm/dịch vụ của chúng tôi mà bạn đã sử dụng hoặc những thông tin quan tâm.',
          '4. Việc sử dụng các sản phẩm/dịch vụ của chúng tôi.',
          '5. Phân tích dữ liệu tiếp thị sản phẩm hoặc dịch vụ được thực hiện riêng cho bạn, bao gồm: lịch sử liên lạc và thông tin về việc bạn có mở các tài liệu này hay nhấp vào đường link liên kết.',
        ],
      },
    ],
  },
  {
    id: 'purposes',
    title: 'PHẦN V - MỤC ĐÍCH CHÚNG TÔI XỬ LÝ DỮ LIỆU CÁ NHÂN CỦA BẠN',
    blocks: [
      {
        type: 'paragraph',
        text: 'Chúng tôi thu thập, xử lý dữ liệu cá nhân của bạn nhằm các mục đích sau: xác minh và quản lý thông tin đăng ký thành viên; quản lý và duy trì tư cách thành viên của CWI; liên hệ, trao đổi và hỗ trợ bạn trong quá trình tham gia các hoạt động của CWI; gửi báo cáo nghiên cứu, bản tin, tài liệu chuyên môn, thông tin về hội thảo, tọa đàm, sự kiện và các nội dung liên quan đến quản trị doanh nghiệp, quản trị công ty, quản trị nhân sự, lãnh đạo và các lĩnh vực chuyên môn khác của CWI; thu thập, xử lý, phân tích và tổng hợp thông tin khảo sát nhằm nghiên cứu, đánh giá xu hướng, xây dựng cơ sở dữ liệu, biên soạn báo cáo, tài liệu nghiên cứu và các ấn phẩm chuyên môn; thực hiện thống kê, phân tích dữ liệu dưới dạng tổng hợp hoặc dữ liệu đã được xử lý để không nhằm nhận diện một cá nhân cụ thể; quản trị, vận hành, bảo mật và cải thiện website, hệ thống công nghệ thông tin và các nền tảng phục vụ hoạt động của CWI; lưu trữ hồ sơ, thực hiện công tác thống kê, báo cáo và quản trị nội bộ; và các mục đích khác có liên quan trực tiếp đến hoạt động của CWI, phù hợp với phạm vi đã thông báo cho bạn hoặc được bạn đồng ý theo quy định của pháp luật.',
      },
    ],
  },
  {
    id: 'collection',
    title: 'PHẦN VI - CÁCH THỨC CHÚNG TÔI THU THẬP DỮ LIỆU CÁ NHÂN CỦA BẠN',
    blocks: [
      {
        type: 'paragraph',
        text: 'Chúng tôi sẽ thu thập dữ liệu cá nhân về bạn từ các nguồn chung sau:',
      },
      {
        type: 'list',
        items: [
          '1. Trực tiếp từ bạn, khi bạn đăng ký trở thành thành viên của CWI, điền biểu mẫu đăng ký, biểu mẫu liên hệ, biểu mẫu khảo sát hoặc cung cấp thông tin thông qua website, thư điện tử (email) hoặc các kênh liên lạc khác của CWI.',
          '2. Trong quá trình bạn tham gia các hoạt động của CWI, bao gồm nhưng không giới hạn việc tham gia khảo sát, hội thảo, tọa đàm, chương trình đào tạo, sự kiện, diễn đàn hoặc các hoạt động chuyên môn khác do CWI tổ chức hoặc phối hợp tổ chức.',
          '3. Từ các tương tác của bạn với website và các nền tảng công nghệ của CWI, bao gồm thông tin về thiết bị, địa chỉ IP, loại trình duyệt, dữ liệu nhật ký (log), cookie và các công nghệ tương tự (nếu có) nhằm phục vụ việc vận hành, bảo mật và cải thiện trải nghiệm sử dụng website.',
          '4. Từ các tổ chức hoặc cá nhân mà bạn đã đồng ý cho phép chia sẻ thông tin với CWI, hoặc từ các đối tác của CWI trong phạm vi cần thiết để tổ chức các hoạt động nghiên cứu, khảo sát, hội thảo hoặc các chương trình hợp tác mà bạn tham gia.',
          '5. Từ các nguồn thông tin được công khai hợp pháp, bao gồm thông tin do bạn chủ động công bố hoặc được đăng tải trên các phương tiện thông tin đại chúng, website hoặc nền tảng trực tuyến, trong phạm vi pháp luật cho phép và phù hợp với mục đích hoạt động của CWI.',
          '6. Từ các nguồn hợp pháp khác theo quy định của pháp luật hoặc theo sự đồng ý của bạn tại từng thời điểm.',
        ],
      },
    ],
  },
  {
    id: 'retention',
    title: 'PHẦN VII - THỜI HẠN LƯU TRỮ DỮ LIỆU CÁ NHÂN',
    blocks: [
      {
        type: 'paragraph',
        text: 'Dữ liệu cá nhân của bạn được CWI lưu trữ và bảo vệ bằng các biện pháp kỹ thuật và tổ chức phù hợp nhằm bảo đảm tính bảo mật, toàn vẹn và an toàn của dữ liệu, đồng thời hạn chế việc truy cập, sử dụng, tiết lộ, sửa đổi hoặc hủy dữ liệu trái phép.',
      },
      {
        type: 'paragraph',
        text: 'CWI chỉ lưu trữ dữ liệu cá nhân của bạn trong thời gian cần thiết để thực hiện các mục đích xử lý dữ liệu đã được nêu trong Chính sách này hoặc cho đến khi bạn rút lại sự đồng ý, yêu cầu xóa dữ liệu hoặc chấm dứt việc tham gia các hoạt động của CWI, trừ trường hợp pháp luật quy định hoặc cho phép lưu trữ trong thời gian dài hơn.',
      },
      {
        type: 'paragraph',
        text: 'Trong trường hợp pháp luật yêu cầu hoặc để phục vụ việc giải quyết khiếu nại, tranh chấp, yêu cầu của cơ quan nhà nước có thẩm quyền, bảo vệ quyền và lợi ích hợp pháp của CWI hoặc các mục đích hợp pháp khác theo quy định của pháp luật, CWI có thể tiếp tục lưu trữ dữ liệu cá nhân của bạn trong thời hạn tương ứng theo quy định của pháp luật. Khi hết thời hạn lưu trữ, CWI sẽ xóa, hủy hoặc thực hiện việc ẩn danh dữ liệu cá nhân theo quy định của pháp luật, trừ trường hợp pháp luật có quy định khác.',
      },
    ],
  },
  {
    id: 'rights',
    title: 'PHẦN VIII - QUYỀN VÀ NGHĨA VỤ CỦA BẠN',
    blocks: [
      {
        type: 'paragraph',
        text: 'Pháp luật về bảo vệ dữ liệu cá nhân cho phép bạn thực hiện một số quyền, và có nghĩa vụ tương ứng, đối với chúng tôi khi chúng tôi xử lý dữ liệu cá nhân của bạn.',
      },
      { type: 'paragraph', text: 'Quyền của bạn: Trừ trường hợp pháp luật có quy định khác đi, bạn có quyền:' },
      {
        type: 'list',
        items: [
          'a. Khiếu nại, tố cáo, hoặc khởi kiện theo quy định của pháp luật.',
          'b. Tự bảo vệ dữ liệu cá nhân của bạn hoặc yêu cầu cơ quan, tổ chức có thẩm quyền thực hiện các phương thức bảo vệ quyền dân sự theo quy định của pháp luật.',
          'c. Biết về cách thức chúng tôi xử lý dữ liệu cá nhân của bạn.',
          'd. Đồng ý hoặc không đồng ý cho phép chúng tôi xử lý dữ liệu cá nhân của bạn.',
          'e. Truy cập để xem, chỉnh sửa hoặc yêu cầu chúng tôi chỉnh sửa dữ liệu cá nhân của bạn.',
          'f. Rút lại sự đồng ý của bạn.',
          'g. Xóa hoặc yêu cầu chúng tôi xóa dữ liệu cá nhân của bạn.',
          'h. Yêu cầu chúng tôi hạn chế xử lý dữ liệu cá nhân của bạn.',
          'i. Yêu cầu một bản sao dữ liệu cá nhân của bạn miễn phí.',
          'j. Phản đối chúng tôi xử lý dữ liệu cá nhân của bạn nhằm ngăn chặn hoặc hạn chế tiết lộ dữ liệu cá nhân hoặc sử dụng cho mục đích tiếp thị, giới thiệu sản phẩm, quảng cáo, khuyến mại.',
          'k. Yêu cầu bồi thường thiệt hại theo quy định của pháp luật khi xảy ra vi phạm quy định về bảo vệ dữ liệu cá nhân của bạn, trừ trường hợp các bên có thỏa thuận khác.',
          'l. Quyền khác theo quy định của pháp luật có liên quan.',
        ],
      },
      {
        type: 'paragraph',
        text: '2. Để thực thi các quyền của mình trên cơ sở pháp luật hoặc muốn giải thích (về các quyền này), bạn có thể liên lạc với chúng tôi trong phần Liên hệ. Chúng tôi bảo lưu quyền để yêu cầu thêm tài liệu, chứng từ phù hợp để giúp chúng tôi xác định danh tính cũng như sàng lọc, xác minh tính hợp pháp, hợp lệ trong yêu cầu về quyền của bạn đối với chúng tôi. Sau khi xác minh, chúng tôi sẽ xử lý các yêu cầu của bạn trong thời hạn được quy định bởi pháp luật.',
      },
      {
        type: 'paragraph',
        text: '3. Bạn có đầy đủ các quyền/nghĩa vụ đối với dữ liệu cá nhân bạn đã cung cấp cho chúng tôi theo Chính Sách Bảo Mật Thông Tin này. Và, trường hợp bạn thay đổi ý định và/hoặc bạn muốn từ chối nhận thông tin tiếp thị, giới thiệu sản phẩm, quảng cáo và khuyến mại, bạn có thể cho chúng tôi biết bất kỳ lúc nào bằng việc gửi yêu cầu theo một trong các tùy chọn trong mục Liên Hệ.',
      },
      { type: 'paragraph', text: 'Nghĩa vụ của bạn: Bạn có nghĩa vụ theo luật định như sau:' },
      {
        type: 'list',
        items: [
          '1. Tự bảo vệ dữ liệu cá nhân của bạn; yêu cầu chúng tôi bảo vệ dữ liệu cá nhân của bạn.',
          '2. Tôn trọng, bảo vệ dữ liệu cá nhân của người khác.',
          '3. Cung cấp đầy đủ, chính xác dữ liệu cá nhân khi đồng ý cho phép chúng tôi xử lý dữ liệu cá nhân.',
          '4. Nghĩa vụ khác theo quy định pháp luật có liên quan.',
        ],
      },
    ],
  },
  {
    id: 'consequences',
    title: 'PHẦN X - HẬU QUẢ THIỆT HẠI KHÔNG MONG MUỐN CÓ THỂ XẢY RA',
    blocks: [
      {
        type: 'list',
        items: [
          '1. Bạn có những quyền theo luật định và yêu cầu chúng tôi thực hiện trong khi đang xử lý dữ liệu cá nhân của bạn. Lúc này, chúng tôi có thể cần thời gian hợp lý (tùy thuộc vào mức độ phức tạp và sự ảnh hưởng của yêu cầu của bạn đối với mối quan hệ giữa chúng tôi và bạn) để xử lý yêu cầu của bạn và hoặc để thông báo cho bạn biết hậu quả, thiệt hại không mong muốn có thể xảy ra nếu yêu cầu của bạn được thực hiện.',
          '2. Căn cứ vào bản chất và phạm vi yêu cầu của bạn. Chúng tôi có thể sẽ không thể tiếp tục cung cấp cho bạn một phần hoặc toàn bộ các quyền lợi, thông tin, báo cáo, bản tin hoặc các hoạt động dành cho thành viên có liên quan đến việc xử lý dữ liệu cá nhân. Trong trường hợp đó, CWI sẽ thông báo cho bạn trước khi thực hiện yêu cầu, trừ trường hợp pháp luật có quy định khác.',
          '3. Trong một số trường hợp nhất định, chúng tôi có quyền từ chối hoặc chỉ thực hiện một phần yêu cầu của bạn, bao gồm nhưng không giới hạn các trường hợp: (i) CWI có nghĩa vụ tiếp tục lưu trữ hoặc xử lý dữ liệu cá nhân để tuân thủ quy định của pháp luật hoặc yêu cầu của cơ quan nhà nước có thẩm quyền; (ii) việc tiếp tục xử lý dữ liệu là cần thiết để bảo vệ quyền và lợi ích hợp pháp của CWI hoặc của bên thứ ba theo quy định của pháp luật; (iii) việc xử lý dữ liệu thuộc trường hợp pháp luật cho phép không cần có sự đồng ý của chủ thể dữ liệu; hoặc (iv) các trường hợp khác theo quy định của pháp luật về bảo vệ dữ liệu cá nhân.',
          '4. Chúng tôi cam kết sử dụng các biện pháp bảo vệ và xử lý dữ liệu cá nhân của bạn theo quy định của pháp luật. Trong các trường hợp bất khả kháng hoặc khách quan khác dẫn đến việc mất, hủy, thiệt hại do sự cố, các vấn đề về kỹ thuật… có thể xảy ra và đó hoàn toàn không phải là điều chúng tôi cố ý hoặc mong muốn xảy ra. Chúng tôi cam kết, trong khuôn khổ pháp luật và bằng hết sức của mình, chúng tôi sẽ tiến hành thông báo đến các bên liên quan. Các biện pháp về khắc phục, bồi thường sẽ được chúng tôi thực hiện theo quy định của pháp luật.',
        ],
      },
    ],
  },
  {
    id: 'contact',
    title: 'PHẦN XI - LIÊN HỆ VỚI CHÚNG TÔI',
    blocks: [
      {
        type: 'list',
        items: [
          '1. Liên hệ bộ phận pháp lý của chúng tôi theo email: trang.le@l-a.com.vn',
          '2. Hoặc liên hệ trực tiếp với chúng tôi tại địa chỉ: 36 Mạc Đĩnh Chi, phường Tân Định, Tp. Hồ Chí Minh.',
        ],
      },
    ],
  },
]