# CWI MOBILE UI/UX IMPROVEMENT SPEC
## Landing Page + Privacy Policy + Operational Regulations
### Mobile-only implementation brief for agent
### Desktop / PC UI must remain unchanged

---

# 0. PURPOSE

Tài liệu này dùng để chỉ đạo agent cải tiến **UI/UX mobile responsive** cho 3 khu vực:

1. **Trang Landing chính**
2. **Trang Chính sách bảo mật**
3. **Trang Quy chế hoạt động**

Mục tiêu là nâng trải nghiệm mobile từ mức “responsive đúng kỹ thuật” lên mức:

> **mobile-first, premium, dễ đọc, dễ thao tác, và phù hợp với một chương trình nghiên cứu/khảo sát dành cho CEO**

---

# 1. CRITICAL CONSTRAINT

## KHÔNG ĐƯỢC THAY ĐỔI UI/UX PC

Đây là ràng buộc quan trọng nhất.

### Agent chỉ được:
- chỉnh layout mobile;
- chỉnh spacing / padding / typography / sticky behavior / overflow / navigation / hierarchy trên mobile;
- thêm logic mobile-only;
- sửa shared behavior **chỉ khi không làm thay đổi desktop UI**.

### Agent tuyệt đối không được:
- thay đổi desktop layout;
- thay đổi desktop spacing;
- thay đổi desktop typography;
- thay đổi desktop section ordering;
- thay đổi desktop component architecture;
- redesign các section desktop;
- thay đổi header/footer desktop appearance;
- thay đổi biểu đồ/chart desktop trừ khi là shared logic bắt buộc và không làm đổi desktop visual.

### Nguyên tắc kỹ thuật:
Mọi thay đổi visual phải nằm trong:
- mobile breakpoints hiện có;
- hoặc breakpoint mới nhưng **chỉ target mobile/tablet nhỏ**;
- hoặc branch render riêng cho mobile.

---

# 2. SCOPE

## In scope
- mobile landing page
- mobile privacy policy page
- mobile operational regulations page
- mobile shared header behavior nếu cần
- mobile shared footer behavior nếu cần
- mobile navigation / TOC / sticky behavior
- mobile reading experience
- mobile chart usability
- mobile CTA behavior

## Out of scope
- desktop UI
- desktop UX
- survey pages
- report pages
- data logic / scoring
- SEO copy rewrite
- content rewrite lớn
- branding redesign toàn site
- animation overhaul toàn site

---

# 3. SOURCE CONTEXT

Audit hiện tại dựa trên `source4(6).zip`.

Agent cần đọc kỹ:
- Landing page mobile implementation
- shared mobile header / footer
- legal page shared layout
- privacy content page
- operational regulations content page

---

# 4. TARGET VIEWPORTS

Agent bắt buộc QA ít nhất ở:

## Mobile chính
- 430 × 932
- 390 × 844
- 375 × 812
- 360 × 800

## Mobile edge cases
- 344 × 882
- iPhone SE / small-height equivalent
- landscape small-height case cho mobile menu

### Lưu ý
Thiết kế phải hoạt động tốt ở:
- width nhỏ
- height ngắn
- safe area
- notch / dynamic island devices

---

# 5. DESIGN INTENT

## Landing mobile phải đạt:
- premium
- clean
- conversion-friendly
- dễ scan
- CTA rõ nhưng không quá aggressive
- chart và content “hiểu được trên điện thoại”

## Privacy / Regulations mobile phải đạt:
- đọc dài không mệt
- heading hierarchy rõ
- TOC điều hướng hiệu quả
- sticky navigation không chiếm quá nhiều chiều cao
- cảm giác editorial document, không phải “một card rất dài”

---

# 6. GLOBAL RULES

## Rule 1 — PC must remain visually identical
Bất kỳ thay đổi nào làm thay đổi desktop UI sẽ bị xem là failed.

## Rule 2 — Mobile should not be a compressed desktop
Mobile cần tối ưu riêng, không chỉ scale down.

## Rule 3 — Legal pages prioritize readability
Trang pháp lý phải ưu tiên:
- text size
- spacing
- navigation
- orientation
- reading flow

## Rule 4 — Remove friction, not add decoration
Không thêm hiệu ứng màu mè.
Chỉ tập trung:
- dễ dùng hơn
- dễ đọc hơn
- dễ điều hướng hơn

---

# 7. DELIVERABLE EXPECTATION

Agent phải sửa code trực tiếp để:
- mobile landing tốt hơn;
- mobile privacy tốt hơn;
- mobile regulations tốt hơn;
- desktop không đổi.

Sau cùng, agent phải trả về:
1. Files changed
2. Mobile landing changes
3. Mobile privacy changes
4. Mobile regulations changes
5. Shared header/footer changes
6. QA screenshots / notes
7. Confirmation that desktop was not changed

---

# 8. LANDING PAGE — CURRENT ASSESSMENT SUMMARY

Điểm mạnh hiện tại:
- mobile landing có architecture riêng
- hero tốt
- CTA rõ
- advisors carousel tốt
- section stack hợp lý
- footer stack ổn

Điểm yếu hiện tại:
- chart mobile chưa tối ưu
- sticky CTA quá aggressive
- mobile menu có edge case chiều cao
- một vài responsive decisions còn hơi “mechanical”
- animation reveal chưa thật sự tối ưu cho mobile

---

# 9. LANDING MOBILE — PRIORITY LIST

## P0
1. Fix mobile chart usability
2. Refine sticky CTA behavior
3. Ensure mobile menu works on low-height screens

## P1
4. Improve section-level CTA coexistence with sticky CTA
5. Improve organizer/logo grid behavior at very small widths
6. Review unnecessary mobile animation/reveal behavior

## P2
7. Micro polish for spacing / rhythm if needed
8. Ensure carousel / marquee edge states feel intentional

---

# 10. LANDING MOBILE — HERO

## Current direction
Hero mobile hiện khá tốt và không nên redesign.

## Must keep
- visual hierarchy
- large title
- branded CTA
- overall hero tone
- image / content relationship
- premium look

## Allowed improvements
- spacing refinement
- top spacing relative to header
- CTA vertical spacing
- safe-area handling
- section rhythm after hero

## Do not do
- redesign hero structure
- shrink typography aggressively
- turn hero into text-dense block

---

# 11. LANDING MOBILE — CHART IS A P0 ISSUE

## Current issue
Chart mobile đang sử dụng inner width lớn hơn viewport, buộc user phải kéo ngang để xem đầy đủ.

Điều này có thể chấp nhận nếu:
- content quá phức tạp;
- horizontal scroll là rõ ràng;
- insight chính vẫn xuất hiện ở viewport đầu.

Hiện tại điều đó chưa đủ tốt.

---

# 12. CHART MOBILE TARGET

### Mục tiêu ưu tiên
Nếu dữ liệu chart chỉ gồm số điểm/mốc giới hạn, hãy làm chart **fit hoàn toàn trong viewport mobile**.

### Nếu chart bắt buộc cần horizontal scroll:
phải bổ sung đủ affordance:
- hint `Vuốt để xem`;
- fade edge trái/phải;
- default scroll position hoặc composition để điểm quan trọng không bị nằm ngoài màn hình ban đầu;
- touch interaction rõ ràng.

---

# 13. CHART IMPROVEMENT OPTIONS

## Option A — Preferred
Refactor chart để fit viewport mobile:
- giảm width
- giảm horizontal padding
- scale axis/text hợp lý
- giữ readability
- không cần horizontal scroll

## Option B — Acceptable if A impossible
Giữ horizontal scroll nhưng:
- visible affordance
- ensure most important data point is visible initially
- add right-edge gradient hint
- ensure scroll snapping or smooth touch feels intentional

---

# 14. CHART MOBILE RULES

- Không được làm desktop chart thay đổi visual
- Không được làm text trong chart quá nhỏ
- Không được dùng chart “giả” hoặc ảnh chụp chart
- Không được thêm tooltip kiểu desktop-only
- Nếu cần extra legend/hint, phải ngắn gọn

---

# 15. STICKY CTA — CURRENT ISSUE

Sticky CTA trên mobile hiện đang xuất hiện khá nhiều và gần như tồn tại xuyên suốt sau hero.

Điều này tạo cảm giác:
- quá salesy
- lặp CTA quá dày
- cạnh tranh với các CTA ngay trong section

---

# 16. STICKY CTA — TARGET BEHAVIOR

Sticky CTA mobile nên:
- chỉ xuất hiện khi user không đang nhìn thấy một primary CTA trong main content;
- ẩn khi hero CTA hoặc section CTA đang visible;
- ẩn khi xuống gần footer;
- không gây chồng chéo với input focus / keyboard / bottom safe area.

---

# 17. STICKY CTA — IMPLEMENTATION INTENT

Agent nên dùng 1 trong 2 approach:

## Approach A — Preferred
Use IntersectionObserver để detect:
- hero CTA visible?
- section CTA visible?
- final CTA visible?
- footer visible?

Nếu visible thì ẩn sticky CTA.

## Approach B
Use scroll zones / threshold logic nếu architecture hiện tại khiến observer phức tạp.

### But:
Không được làm behavior phức tạp hoặc giật.

---

# 18. STICKY CTA — VISUAL RULES

- giữ visual DNA hiện tại
- không redesign button
- không làm nhỏ quá mức
- không thêm extra copy
- chỉ chỉnh behavior / spacing / safe area

---

# 19. MOBILE MENU — CURRENT ISSUE

Mobile menu hiện đẹp về mặt visual, nhưng có risk trên màn hình thấp hoặc landscape:
- panel có thể chật
- nội dung có thể bị crop
- CTA cuối panel có thể khó thấy
- scrolling behavior chưa chắc đủ robust

---

# 20. MOBILE MENU — REQUIRED IMPROVEMENTS

Agent phải đảm bảo:
- menu panel có `max-height` an toàn theo viewport thực;
- menu panel có `overflow-y: auto` khi cần;
- safe area bottom không làm nút cuối bị cắt;
- focus handling tốt;
- body scroll lock giữ nguyên;
- close / dismiss behavior ổn định.

---

# 21. MOBILE MENU — ACCESSIBILITY

Nếu chưa có, cần đảm bảo:
- focus trap trong menu
- restore focus về nút menu khi đóng
- body lock
- no content clipped on small-height devices
- touch targets >= 44px

---

# 22. ADVISORS CAROUSEL

Advisors carousel mobile là phần mạnh hiện tại.

## Must keep
- swipe experience
- visible next-card hint
- active indicator
- swipe affordance
- progress/counter

## Only polish if needed
- spacing
- card height consistency
- safe area
- text overflow

## Do not redesign
Không được thay đổi core pattern.

---

# 23. LOGO / ORGANIZER GRID MOBILE

Ở viewport nhỏ nhất hiện tại, một số logo grid có nguy cơ bị đẩy về 1 cột.

Điều này làm section dài không cần thiết.

## Target
Ở 360px, ưu tiên giữ:
- 2 cột nếu khả thi;
- padding hợp lý;
- logo scale phù hợp;
- tránh 1 logo 1 hàng nếu không thực sự cần.

## Rule
Chỉ chuyển 1 cột nếu thật sự không thể giữ readability / spacing.

---

# 24. MOBILE ANIMATION / REVEAL

Hiện có nhiều reveal animation / `data-reveal`.

## Issue
Nếu animation chạy ngay từ load thay vì khi section vào viewport:
- user không thấy effect đúng thời điểm
- tốn render/compositing
- mobile performance có thể bị ảnh hưởng nhẹ

## Target
Giữ animation tinh gọn:
- hero / first fold có thể giữ
- section dưới nên chỉ animate nếu thật sự vào viewport
- hoặc giảm bớt nếu implementation phức tạp

### Important
Không được thêm animation mới.

---

# 25. LANDING FOOTER MOBILE

Footer stack hiện khá ổn.

## Only refine if needed
- spacing consistency
- touch targets
- legal link grouping
- content density

## Do not redesign
Footer desktop / structure lớn giữ nguyên.

---

# 26. LEGAL PAGES — SHARED ASSESSMENT SUMMARY

Privacy và Regulations hiện đang có shared layout system.

Điều này tốt cho consistency.

Nhưng mobile UX hiện còn yếu ở các điểm:
- body text hơi nhỏ
- sticky TOC chiếm nhiều chiều cao
- navigation ngang chưa thực sự phù hợp long-form legal docs
- section heading có thể bị che khi anchor scroll
- document card nesting làm reading width hơi hẹp

---

# 27. LEGAL PAGES — P0 ISSUES

## P0
1. Increase body readability on mobile
2. Redesign / refine mobile TOC behavior
3. Fix sticky header + sticky TOC stacking logic
4. Fix anchor positioning / scroll margin
5. Improve long-form document reading width feel

## P1
6. Current section awareness
7. More compact legal mobile navigation
8. Refine shared legal intro card / block density
9. Improve footer compactness if needed

## P2
10. Reading progress line
11. Auto-scroll active TOC item
12. Additional small UX polish

---

# 28. LEGAL TYPOGRAPHY — BODY TEXT

## Current issue
Body text hiện quá nhỏ trên mobile.

Legal content đọc dài trên mobile không nên rơi xuống mức quá nhỏ.

## Target
- paragraph text: khoảng **15px**
- line-height: khoảng **1.7–1.75**
- list text: cùng hệ với paragraph
- subheading / small section title: khoảng **18–20px**
- meta/kicker nhỏ có thể thấp hơn, nhưng phần nội dung chính phải ưu tiên readability

---

# 29. LEGAL TYPOGRAPHY RULES

- Không được hy sinh readability để “nhét nhiều chữ hơn”
- Không được dùng 13px cho body legal text
- Không được để heading quá sát paragraph
- Phải giữ hierarchy rõ giữa:
  - page heading
  - section heading
  - paragraph
  - list items

---

# 30. LEGAL PAGE WIDTH FEEL

## Current issue
Mobile legal page hiện có cảm giác:
- page gutter
- outer surface/card
- inner document
- inner padding

Tức là nhiều lớp container chồng nhau, khiến reading width thực tế hơi hẹp.

## Target
Trên mobile, legal document phải cho cảm giác gần với:
> editorial document / article

hơn là:
> một card rất dài đặt trong một page

---

# 31. LEGAL DOCUMENT SURFACE — MOBILE TARGET

Trên `<=560px`, agent nên cân nhắc:
- giảm border prominence
- giảm card feeling
- giảm unnecessary shadow
- giảm nested padding
- tăng usable text width

### Preferred direction
Document vẫn giữ sạch và branded, nhưng nhẹ bớt “card” trên mobile.

---

# 32. LEGAL INTRO BLOCK / HEADER BLOCK

Nếu currently có intro card với icon + nhiều paragraph trong card:
- không cần redesign toàn bộ
- nhưng có thể giảm card feel
- giảm density
- tối ưu spacing để đọc bớt mệt

## Allowed
- lighter surface
- less boxed feel
- simpler mobile stacking
- improved spacing

## Not allowed
- xóa nội dung
- rewrite legal copy lớn
- phá visual identity desktop

---

# 33. MOBILE TOC — THIS IS THE BIGGEST LEGAL UX PROBLEM

Current TOC mobile kiểu horizontal chips sticky là chưa tối ưu, đặc biệt với:
- Privacy: ít section hơn
- Regulations: nhiều section hơn, UX kém hơn rõ rệt

---

# 34. LEGAL TOC — TARGET DIRECTION

Agent cần redesign mobile TOC theo một trong hai hướng:

## Option A — Preferred
**Compact sticky bar + bottom sheet TOC**

### Sticky bar hiển thị:
- current section index / total
- current section title (rút gọn)
- button `Mục lục`

Ví dụ:
```text
03 / 10 · Loại dữ liệu thu thập      Mục lục
```

Bấm `Mục lục` → mở bottom sheet / panel liệt kê toàn bộ section.

### Lợi ích
- tiết kiệm chiều cao
- dễ biết mình đang ở đâu
- dễ jump tới section khác
- xử lý tốt tài liệu dài 10–14 section

---

# 35. LEGAL TOC — OPTION B

Nếu không implement bottom sheet, có thể giữ horizontal nav nhưng phải:
- chỉ là **1 hàng compact**
- bỏ bớt phần heading thừa phía trên
- có current active state
- có auto-scroll active item vào view
- có fade edge để báo còn nội dung
- height gọn

### But:
Option B vẫn kém hơn Option A cho long-form legal documents.

---

# 36. RECOMMENDATION

## Privacy page
Có thể dùng Option B nếu implementation simple và đủ tốt.

## Regulations page
Rất nên dùng **Option A** vì có nhiều mục hơn, horizontal chips sẽ nhanh chóng trở nên kém hiệu quả.

### Strong recommendation:
Dùng **cùng một mobile TOC pattern** cho cả Privacy và Regulations để consistency.

---

# 37. LEGAL TOC — STICKY HEIGHT

Sticky TOC hiện không được chiếm quá nhiều chiều cao.

## Target
Mobile legal TOC sticky area nên nằm khoảng:
- **48–56px** nếu compact bar
- tối đa khoảng **64px** nếu có 2 dòng nhỏ

### Không chấp nhận
- 1 block cao 100px+
- có title + subtitle + chips + separator dày cộp chiếm quá nhiều màn hình

---

# 38. HEADER + TOC COORDINATION

## Current issue
Khi header ẩn lúc scroll xuống, TOC vẫn có top offset cố định, gây cảm giác có khoảng trống không cần thiết.

## Target
TOC sticky phải phối hợp với header state:
- header visible → TOC nằm dưới header
- header hidden → TOC nhích lên tương ứng

### Acceptable alternative
Thiết kế TOC đủ nhỏ để top offset luôn ổn trong cả hai trạng thái.

---

# 39. ANCHOR SCROLL / SECTION OFFSET

## Current issue
Khi user tap TOC item, heading section có thể bị sticky layers che mất.

## Required
Agent phải fix `scroll-margin-top` hoặc logic scroll sao cho:
- section heading luôn lộ rõ
- không bị header/TOC che
- hoạt động đúng trên mobile

### Important
Không chỉ test 1 device.
Phải test ít nhất 360, 390, 430 widths.

---

# 40. CURRENT SECTION AWARENESS

Legal mobile cần giúp người dùng biết:
> tôi đang ở mục nào?

## Required
Nếu dùng compact bar, phải hiển thị:
- current section number
- total sections
- current section title (có thể rút gọn)

Ví dụ:
```text
08 / 14 · Dữ liệu và quyền riêng tư
```

### This is especially important for Regulations page.

---

# 41. TOC ITEM ACTIVE STATE

Nếu dùng bottom sheet / list:
- active item phải highlight rõ
- item tapped phải scroll đúng section
- sau khi chọn nên đóng sheet
- focus / scroll behavior phải tự nhiên

Nếu dùng horizontal chips:
- active chip phải rõ
- chips auto-scroll để active chip nằm trong viewport
- fade edge / scroll affordance rõ

---

# 42. LEGAL PAGE READING PROGRESS (OPTIONAL P2)

Có thể thêm một thin progress indicator rất nhẹ cho legal pages:
- 1–2px line
- placed under sticky legal nav
- cho biết user đã đọc tới đâu tương đối

### Không bắt buộc
Chỉ làm nếu implementation gọn và không ảnh hưởng desktop.

Không thêm số phần trăm to tướng.

---

# 43. PRIVACY PAGE SPECIFIC DIRECTION

Privacy page có ít section hơn Regulations.

## Target
- text readability tốt hơn
- TOC compact hơn
- intro block bớt boxed
- document width feel rộng hơn
- easier scanning section headings

## Do not do
- rewrite chính sách
- remove sections
- shorten content

---

# 44. REGULATIONS PAGE SPECIFIC DIRECTION

Đây là legal page cần ưu tiên nhất.

## Because
- nhiều mục hơn
- khó scan hơn
- TOC ngang hiện tại kém hiệu quả hơn
- long-form fatigue cao hơn

## Required
- strong current-section awareness
- compact TOC
- easy jumping between sections
- typography thoải mái hơn
- clear document rhythm

---

# 45. SHARED LEGAL HEADER / HERO

Nếu privacy/regulations có hero/page heading, giữ overall structure.

## Allowed improvements on mobile
- spacing
- reducing oversized gaps
- simplifying stacked meta text
- ensuring sticky nav does not push content too far down

## Not allowed
- redesign desktop hero
- rewrite branding structure

---

# 46. SHARED LEGAL FOOTER

Footer legal mobile currently likely long and stacked.

## Only improve if needed
- spacing
- link grouping
- density
- readability

## Not priority
Chỉ xử lý sau khi typography + TOC + sticky issues xong.

---

# 47. SHARED HEADER ON LEGAL PAGES

Legal pages có thể đang reuse mobile header/menu từ landing.

Điều này chấp nhận được.

## But
Nếu menu / CTA gây chiếm dụng quá nhiều context khi user đang đọc long-form legal docs, có thể:
- đơn giản hóa behavior trên legal pages;
- hoặc chỉ cần đảm bảo sticky TOC/legal nav làm việc hài hòa với header.

### Important
Không được làm desktop header thay đổi.

---

# 48. MOBILE-SPECIFIC IMPLEMENTATION STRATEGY

Agent nên ưu tiên:
1. shared CSS media query refinements
2. mobile-specific render branches if necessary
3. isolated legal mobile nav component nếu cần
4. sticky logic state only where beneficial

### Avoid
- large refactor affecting desktop
- rewriting everything into separate pages unless necessary

---

# 49. COMPONENT / FILE STRATEGY

Agent cần tìm và sửa đúng các khu vực liên quan:
- landing mobile layout / sections
- shared mobile header
- shared mobile footer
- legal page layout component
- legal TOC component
- legal content section anchors
- chart mobile styling / logic

### If legal pages currently share one component
Hãy tận dụng shared system và implement mobile solution một cách tái sử dụng.

---

# 50. LANDING MOBILE — DETAILED ACCEPTANCE CRITERIA

### PASS nếu:
- hero vẫn mạnh
- CTA rõ
- chart dễ hiểu trên điện thoại
- sticky CTA không còn quá aggressive
- mobile menu không bị crop trên small-height screens
- advisor carousel vẫn mượt
- section flow tự nhiên
- footer ổn

### FAIL nếu:
- desktop bị thay đổi
- chart vẫn khó dùng
- sticky CTA vẫn đè lên CTA content
- mobile menu thấp màn hình bị lỗi
- agent redesign quá đà

---

# 51. PRIVACY MOBILE — DETAILED ACCEPTANCE CRITERIA

### PASS nếu:
- body text dễ đọc hơn rõ rệt
- headings scan tốt
- TOC mobile hiệu quả hơn
- sticky legal nav gọn
- anchor scroll đúng
- page feel giống document/editorial hơn

### FAIL nếu:
- text vẫn quá nhỏ
- TOC vẫn chiếm nhiều chiều cao
- section title bị che khi jump
- document vẫn quá boxed/chật
- desktop bị ảnh hưởng

---

# 52. REGULATIONS MOBILE — DETAILED ACCEPTANCE CRITERIA

### PASS nếu:
- long-form navigation tốt hơn thấy rõ
- current section awareness rõ
- nhiều section nhưng vẫn không gây lạc hướng
- typography / spacing hỗ trợ đọc dài
- TOC pattern phù hợp hơn horizontal chips thô

### FAIL nếu:
- vẫn dùng navigation ngang rối rắm mà không giải quyết orientation
- current section không rõ
- sticky block quá cao
- desktop thay đổi

---

# 53. MOBILE BREAKPOINT POLICY

Agent được phép chỉnh tại:
- <= 900px nếu trang hiện tại đã có mobile branch
- <= 768px
- <= 560px
- <= 390px
- <= 374px

### But
Mọi rule phải được viết cẩn thận để:
- không impact desktop
- không tạo regression ở tablet

---

# 54. TABLET CONSIDERATION

User chủ yếu yêu cầu mobile, nhưng agent không được làm tablet hỏng.

### Minimum requirement
Kiểm tra:
- 768px
- 820px

### Rule
Nếu thay đổi chỉ nên nhắm vào phone widths, hãy khóa đúng breakpoint để tablet không bị ảnh hưởng xấu.

---

# 55. PERFORMANCE / BEHAVIOR RULES

Không thêm JS nặng nếu CSS đủ giải quyết.

Chỉ thêm logic JS khi thật sự cần cho:
- sticky CTA intelligent behavior
- legal current section awareness
- bottom sheet TOC
- chart affordance
- menu robustness

### Do not
- add new heavy libraries
- add complex animation frameworks
- add chart library chỉ để sửa mobile

---

# 56. ACCESSIBILITY RULES

## Mobile menu
- focus trap
- restore focus
- body lock
- no clipped content

## Legal TOC / bottom sheet
- keyboard/touch accessible
- close behavior rõ
- active state rõ

## Sticky CTA
- safe area
- not covering essential content
- touch target đủ lớn

## Body text
- readable size
- sufficient contrast
- no tiny interactive chips

---

# 57. QA CHECKLIST — LANDING

Agent phải QA:
- hero
- chart
- sticky CTA
- mobile menu
- advisors carousel
- organizer/partner logo section
- roundtable section
- final CTA
- footer

At:
- 430
- 390
- 375
- 360 widths

---

# 58. QA CHECKLIST — PRIVACY

Agent phải QA:
- page heading
- intro block
- TOC mobile
- jumping giữa section
- sticky behavior
- body text readability
- lists
- footer

At:
- 430
- 390
- 375
- 360 widths

---

# 59. QA CHECKLIST — REGULATIONS

Agent phải QA:
- page heading
- TOC mobile
- long-form navigation
- active section awareness
- body text readability
- long lists
- footer

At:
- 430
- 390
- 375
- 360 widths

---

# 60. REQUIRED HANDOFF FORMAT FROM AGENT

Sau khi implement, agent phải report theo format sau:

## 1. Files changed
Liệt kê file đã sửa.

## 2. Landing mobile changes
Mô tả rõ:
- chart
- sticky CTA
- menu
- logo grid / other mobile refinements

## 3. Privacy mobile changes
Mô tả rõ:
- typography
- TOC
- sticky behavior
- anchor logic
- document width / spacing

## 4. Regulations mobile changes
Mô tả rõ:
- TOC strategy
- current section awareness
- typography
- long-form UX improvements

## 5. Shared mobile changes
Header / footer / common legal layout / reusable components.

## 6. Desktop regression confirmation
Phải xác nhận rõ:
> Desktop UI was not changed.

## 7. QA summary
Tóm tắt test theo viewport.

## 8. Remaining limitations
Nêu nếu còn giới hạn hoặc trade-off.

---

# 61. FAILURE CONDITIONS

Task xem như failed nếu xảy ra bất kỳ điều nào sau đây:

- desktop UI bị thay đổi;
- desktop spacing/typography bị thay đổi;
- landing mobile chart vẫn khó dùng như cũ;
- sticky CTA vẫn aggressive và chồng với content CTA;
- legal body text vẫn quá nhỏ;
- legal TOC vẫn chiếm quá nhiều chiều cao mà không cải thiện orientation;
- anchor scroll vẫn bị che bởi sticky layers;
- regulations mobile vẫn khó điều hướng khi có nhiều section;
- agent redesign quá đà ngoài phạm vi mobile improvements;
- thêm thư viện nặng không cần thiết;
- tạo nhiều regression mobile/tablet.

---

# 62. PRIORITY EXECUTION ORDER

Agent nên làm theo thứ tự:

## Phase 1 — P0
1. Legal typography
2. Legal TOC / sticky nav redesign
3. Anchor offset fixes
4. Landing chart mobile
5. Sticky CTA mobile behavior
6. Mobile menu robustness

## Phase 2 — P1
7. Current section awareness
8. Legal document width feel
9. Organizer/logo grid refinement
10. Shared footer/header mobile polish

## Phase 3 — P2
11. Reading progress
12. Auto-scroll active TOC item
13. Animation/reveal polish

---

# 63. FINAL PRINCIPLE

Mục tiêu không phải làm giao diện “nhiều hiệu ứng hơn”.

Mục tiêu là:

### Landing
- dễ tương tác hơn trên mobile
- conversion tốt hơn nhưng vẫn premium

### Privacy / Regulations
- dễ đọc hơn
- dễ điều hướng hơn
- ít mệt hơn khi đọc dài
- trông chuyên nghiệp hơn trên điện thoại

### Most important
**Desktop must stay exactly as-is.**

---

# 64. FINAL DIRECTIVE TO AGENT

Implement directly in code.

Do not just write suggestions.

Do not touch desktop UI.

Use mobile-specific logic and styling only.

If a shared component must change, ensure desktop output remains visually unchanged.

The end result should feel like:

> **a polished mobile experience for a premium research/assessment website, with legal pages that are truly usable on phones.**
