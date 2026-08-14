# CWI Frontend — Mobile UI Redesign Implementation Specification

## 0. Mục đích tài liệu

Tài liệu này là **implementation specification dành cho coding agent** để redesign toàn bộ giao diện mobile của CWI (`CEO Workforce Index`) dựa trên source hiện tại.

Mục tiêu không phải là làm một phiên bản responsive đơn giản của desktop. Mobile cần trở thành một trải nghiệm được art-direct riêng: **premium, executive, editorial, data-driven, mượt và hiện đại**, nhưng vẫn phải giữ nguyên brand, dữ liệu, nội dung và logic hiện có.

---

# 1. Các nguyên tắc bắt buộc — KHÔNG ĐƯỢC VI PHẠM

## 1.1. Desktop đã hoàn thiện pixel-perfect — tuyệt đối không thay đổi

Desktop PC hiện tại đã được chỉnh theo Figma và được xem là **locked baseline**.

Agent tuyệt đối không được:

- thay đổi layout desktop;
- thay đổi vị trí desktop;
- thay đổi spacing desktop;
- thay đổi font-size desktop;
- thay đổi line-height desktop;
- thay đổi width/height desktop;
- thay đổi absolute positioning desktop;
- thay đổi màu sắc desktop;
- thay đổi asset desktop;
- thay đổi chart desktop;
- thay đổi header desktop;
- thay đổi footer desktop;
- thay đổi scale logic của Figma desktop;
- refactor desktop nếu việc refactor có nguy cơ làm thay đổi pixel;
- thay class hiện có của desktop bằng class mới nếu không thật sự cần thiết;
- đổi breakpoint theo cách làm desktop bị ảnh hưởng.

### Desktop breakpoint hiện tại

Source hiện sử dụng:

```css
@media (max-width: 900px)
```

Trong đó:

- `> 900px`: Desktop Figma canvas.
- `<= 900px`: Mobile UI.

**Giữ nguyên kiến trúc tách desktop/mobile này.**

Mọi code redesign mobile phải được scope vào:

```css
@media (max-width: 900px)
```

hoặc class chỉ tồn tại trong `MobileLandingPage`.

Không áp animation mới lên desktop trừ khi class đó chỉ render trên mobile.

---

## 1.2. Mobile phải giữ 100% nội dung

Mobile hiện tại đang có nguy cơ bị giản lược nội dung so với desktop.

### Quy tắc:

**Không được bỏ bất kỳ thông tin nội dung có ý nghĩa nào đang xuất hiện ở desktop.**

Có thể:

- thay bố cục;
- đổi thứ tự trình bày trong cùng section khi cần cho UX;
- đổi cách chia line;
- đổi card thành list;
- đổi grid thành carousel;
- đổi static layout thành motion;
- đổi cách hiển thị chart;
- đổi cách hiển thị logo.

Không được:

- tóm tắt;
- viết lại;
- rút ngắn;
- paraphrase;
- xóa câu;
- xóa bullet;
- xóa label;
- xóa metric;
- xóa quarter;
- xóa dữ liệu;
- xóa tên advisor;
- xóa chức danh;
- xóa lĩnh vực;
- xóa đối tác;
- xóa thông tin footer;
- tự thêm claim kinh doanh mới không có trong source.

Nếu phải tối ưu không gian mobile, ưu tiên:

1. vertical layout;
2. horizontal scroll;
3. accordion nếu thật sự phù hợp;
4. marquee đối với logo;
5. carousel;
6. tăng chiều dài page.

**Không dùng việc “mobile nhỏ” làm lý do để bỏ content.**

---

# 2. Source cần làm việc

Các file chính:

```text
src/features/landing/
├── LandingPage.tsx
├── landing.css
├── landingData.ts
└── figmaAssets.ts
```

Entry:

```text
src/App.tsx
```

Mobile đã được tách thành:

```tsx
function MobileLandingPage()
```

Desktop được render riêng trong Figma canvas.

### Hướng triển khai ưu tiên

- Giữ nguyên desktop components.
- Có thể tạo thêm mobile-only components để code sạch.
- Có thể bổ sung hooks nhỏ cho mobile motion.
- Không cần đưa mobile vào absolute Figma canvas.
- Không dùng pixel absolute positioning rộng khắp cho mobile.
- Mobile phải responsive thật sự.

---

# 3. Responsive target

Thiết kế mobile phải hoạt động tốt tối thiểu ở:

```text
320 px
360 px
375 px
390 px
393 px
412 px
430 px
768 px
900 px
```

### Thiết kế chính

Ưu tiên visual QA ở:

```text
390 × 844
```

và:

```text
430 × 932
```

### Safe area

Hỗ trợ:

```css
env(safe-area-inset-top)
env(safe-area-inset-bottom)
```

đặc biệt cho:

- header;
- sticky CTA;
- full-screen menu.

---

# 4. Visual direction cho Mobile

Mobile cần có cảm giác:

- Executive;
- Premium;
- Editorial;
- Consulting-grade;
- Data intelligence;
- Modern corporate technology;
- Không giống template SaaS thông thường;
- Không giống dashboard thu nhỏ;
- Không quá playful;
- Không lạm dụng glassmorphism;
- Không lạm dụng gradient;
- Không lạm dụng animation.

Brand language giữ theo source hiện tại:

- Navy / deep blue;
- CWI blue;
- Red CTA;
- Aqua / turquoise accent;
- White;
- subtle warm/orange hero glow.

---

# 5. Motion design system

Không tạo animation ngẫu nhiên riêng cho từng component.

Dùng một motion system nhất quán.

## 5.1. Text reveal

Dùng cho:

- section heading;
- hero heading;
- subtitle;
- paragraph blocks quan trọng.

Suggested baseline:

```css
opacity: 0;
transform: translateY(20px);
```

Active:

```css
opacity: 1;
transform: translateY(0);
```

Timing:

```text
duration: 560–720ms
easing: cubic-bezier(0.22, 1, 0.36, 1)
```

Có thể stagger các dòng:

```text
50–90ms
```

---

## 5.2. Image reveal

Dùng cho:

- Roundtable image;
- advisor cards;
- hero background initial load;
- premium report visual.

Có thể dùng:

```css
clip-path
```

hoặc:

```css
transform: scale(1.04)
```

về:

```css
scale(1)
```

Không dùng zoom mạnh.

---

## 5.3. Data reveal

Dùng cho:

- report statistics;
- chart;
- roundtable metrics.

Có thể:

- number/count reveal;
- divider grow;
- chart line draw;
- focus point pop-in.

Không được biến text metric thành fake counter nếu giá trị không phải số đơn giản.

Ví dụ:

```text
HƠN 300+
25+ NGÀNH NGHỀ
34 TỈNH / THÀNH PHỐ
5 NĂM
```

Có thể reveal từng block thay vì parse/count toàn bộ chuỗi.

---

## 5.4. Horizontal content

Dùng cho:

- advisors;
- partner logos;
- association logos khi phù hợp.

Ưu tiên native browser:

```css
overflow-x: auto;
scroll-snap-type: x mandatory;
-webkit-overflow-scrolling: touch;
```

Không cần dependency nặng.

---

## 5.5. Parallax

Chỉ dùng rất nhẹ.

Max recommended motion:

```text
±12–24px
```

Không gây motion sickness.

---

# 6. Accessibility và reduced motion

Phải hỗ trợ:

```css
@media (prefers-reduced-motion: reduce)
```

Trong reduced motion:

- tắt parallax;
- tắt marquee animation hoặc hiển thị static;
- tắt transform reveal;
- chart hiển thị ngay;
- không loop animation không cần thiết.

Không được khiến content bị invisible nếu JavaScript animation lỗi.

Default markup phải vẫn readable khi JS disabled hoặc observer chưa chạy.

---

# 7. Performance requirements

Mobile animations phải ưu tiên:

```text
transform
opacity
clip-path (có kiểm soát)
```

Hạn chế animate:

```text
width
height
top
left
filter blur lớn
box-shadow liên tục
```

Không thêm dependency animation nặng nếu không bắt buộc.

Ưu tiên:

- CSS transitions;
- CSS keyframes;
- IntersectionObserver;
- requestAnimationFrame nếu cần;
- native scroll snap.

Không thêm Three.js/WebGL.

Không cần canvas animation.

---

# 8. Header Mobile

## Hiện trạng

Desktop nav bị ẩn ở mobile.

Header mobile hiện có:

- CWI logo;
- language icon;
- `EN`;
- `Đăng nhập`.

Cần giữ đầy đủ các thành phần trên.

## Redesign

### Container

Giữ floating pill nhưng nâng cấp visual:

```text
left/right: 12px
top: safe-area + 10px
height: ~60–64px
border-radius: 999px
```

Background:

```css
rgba(255,255,255,.88)
```

Blur:

```css
backdrop-filter: blur(20px) saturate(1.3);
```

Border cực nhẹ.

Shadow nhẹ, premium.

### Scroll behavior

Giữ logic:

- ở top: visible;
- scroll down: hide;
- scroll up: show.

Animation show/hide cần mượt hơn:

```text
translateY
opacity
duration 300–420ms
```

### Hamburger

Thêm nút hamburger cho mobile.

Không xóa:

```text
EN
Đăng nhập
```

Nếu không đủ không gian 320px:

- giữ logo;
- giữ login;
- chuyển language vào mobile menu;
- nhưng language không được mất khỏi mobile experience.

### Menu

Hamburger mở full-screen / near-full-screen overlay.

Không dùng sidebar nhỏ bên phải kiểu generic.

Suggested structure:

```text
CWI logo                         Close

01   Trang chủ
02   Tiêu điểm
03   Báo cáo
04   Roundtable
05   Về CWI

Language: EN

[ Thực hiện khảo sát → ]
```

### Navigation labels bắt buộc

Giữ toàn bộ:

```text
Trang chủ
Tiêu điểm
Báo cáo
Roundtable
Về CWI
```

### Menu motion

- overlay fade;
- content slight translateY;
- item stagger 40–60ms;
- close bằng reverse transition.

Body phải lock scroll khi menu mở.

ESC close nếu có keyboard.

Focus management tối thiểu hợp lý.

---

# 9. Hero Mobile

## Nội dung bắt buộc giữ nguyên

```text
NỀN TẢNG TRI THỨC DÀNH CHO LÃNH ĐẠO CẤP CAO
```

```text
Hệ năng lực tốt hơn
Doanh nghiệp mạnh hơn
```

```text
Tham gia khảo sát của CEO Workforce Index để đối chuẩn năng lực đội ngũ của doanh nghiệp bạn với hàng trăm doanh nghiệp khác
```

CTA:

```text
Thực hiện khảo sát
```

Không chỉnh wording.

---

## Layout mới

Mobile hero không nên chỉ là desktop center-align thu nhỏ.

Preferred:

- Hero khoảng `700–780px`;
- text block left aligned;
- cinematic background;
- clear bottom transition.

Suggested padding:

```text
top: 140–155px
left/right: 20–24px
bottom: 76–92px
```

### Eyebrow

Left aligned.

```text
font-size: 11–12px
line-height: 16–18px
letter-spacing nhẹ
uppercase
aqua
max-width ~330px
```

### Heading

Strong editorial typography.

Target:

```text
42–56px
line-height 0.98–1.04
```

Visual composition:

```text
Hệ năng lực
tốt hơn

Doanh nghiệp
mạnh hơn
```

`Doanh nghiệp` giữ visual gradient/italic treatment theo brand.

Không đổi actual text.

### Description

Max width khoảng:

```text
340–365px
```

Size:

```text
15–17px
22–25px line-height
```

Left aligned.

### CTA

Không phải full-width edge-to-edge.

Target:

```text
height: 54–58px
width: fit-content hoặc 100% max 344px
```

Arrow microinteraction:

```text
tap/hover: translateX(4px)
```

---

## Hero background motion

Giữ:

```text
image75Bg
```

Không thay asset bắt buộc.

Initial:

```text
scale 1.07 → 1.02/1
duration ~1200ms
```

Scroll:

- background translate nhẹ;
- glow translate nhẹ khác tốc độ;
- spark float ±5px.

Không làm quá nhiều spark.

---

# 10. Hero → Report transition

Thêm transition block nhỏ để page có flow.

Không cần thêm business copy mới.

Có thể dùng text dữ liệu đã tồn tại:

```text
Q3 / 2026
```

và UI direction generic:

```text
SCROLL
```

Nếu muốn tránh thêm copy hoàn toàn, chỉ dùng:

- thin line;
- down arrow;
- Q3/2026.

Animation:

- line grow;
- arrow subtle loop;
- không gây distract.

---

# 11. Report Section — Tiêu điểm quý

## Nội dung bắt buộc

Heading:

```text
Tiêu điểm quý 3/2026
```

Subtitle:

```text
Nâng cao năng lực lãnh đạo để mở rộng quy mô
```

Body desktop đầy đủ:

```text
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
```

### LƯU Ý QUAN TRỌNG

Mobile source hiện tại đang thiếu đoạn:

```text
quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
```

Agent phải sửa mobile để khớp **toàn bộ body desktop**.

Không được giữ bản mobile rút gọn hiện tại.

---

## Layout

Editorial section.

Suggested:

```text
padding: 60–72px 20–24px
```

Heading có thể sử dụng:

- small `Q3 / 2026` accent;
- title;
- subtitle;
- paragraph.

Không bắt buộc thêm copy mới.

Heading khoảng:

```text
32–38px
```

---

# 12. Mobile Report Chart

Chart mobile phải chứa đầy đủ thông tin chart desktop.

## Label bắt buộc

```text
TỐC ĐỘ TĂNG TRƯỞNG
```

Y-axis desktop:

```text
100
75
50
25
0
```

X-axis desktop:

```text
Q3/2025
Q4/2025
Q1/2026
Q2/2026
Q3/2026
Q4/2026
```

### LƯU Ý

Mobile hiện tại chỉ đang render:

```text
0
50
100
Q3/2026
```

Đây là thiếu content.

**Phải restore đầy đủ các labels.**

Không nhất thiết hiển thị tất cả theo layout desktop nếu quá chật.

Có thể:

- scale font xuống;
- dùng horizontal chart overflow;
- dùng min-width chart lớn hơn viewport;
- hoặc bố trí label hợp lý.

Preferred:

```text
chart viewport width: 100%
inner chart min-width: 520–580px
horizontal pan optional
```

Hoặc fit chart nếu vẫn đọc được.

---

## Chart animation

Khi chart vào viewport:

1. grid fade;
2. filled area reveal left → right;
3. line reveal;
4. points reveal sequentially;
5. active `Q3/2026` point pop;
6. active label emphasize.

Duration:

```text
800–1100ms
```

Không replay liên tục mỗi lần scroll.

Chỉ play once per page load.

Nếu prefers-reduced-motion:

- show final state ngay.

---

# 13. Unlock Report Card

## Nội dung bắt buộc

Title:

```text
Mở khóa báo cáo chẩn đoán năng lực lãnh đạo
```

Description:

```text
Khám phá vị thế năng lực của doanh nghiệp bạn so với 100+ tổ chức khác.
```

CTA 1:

```text
Mở khóa báo cáo / Làm khảo sát
```

CTA 2:

```text
Tải báo cáo teaser miễn phí
```

Security:

```text
BẢO MẬT DỮ LIỆU: Vui lòng xác thực tài khoản Client để mở khóa báo cáo
```

Không được bỏ security text.

---

## Redesign

Biến thành premium access card.

Suggested:

- deep navy visual;
- `bgForm` giữ lại;
- lock icon là focal element;
- subtle glow;
- soft inner border;
- radius 22–26px.

Visual zone có thể khoảng:

```text
260–320px height
```

Text được đặt có hierarchy rõ.

Lock motion:

```text
rotate(-5deg) scale(.94)
→ rotate(0) scale(1)
```

Chỉ entrance một lần.

Không loop lock.

CTA red nằm ngoài/giáp visual block.

Outline teaser button giữ đúng hierarchy secondary.

---

# 14. Report Statistics

Dữ liệu bắt buộc giữ nguyên từ `reportStats`.

## Metric 1

```text
HƠN 300+
Lãnh đạo C-LEVEL tham gia
```

## Metric 2

```text
25+ NGÀNH NGHỀ
Chủ lực đại diện
```

## Metric 3

```text
34 TỈNH / THÀNH PHỐ
Trên toàn quốc
```

## Metric 4

```text
5 NĂM
Dữ liệu nghiên cứu liên tục
```

---

## Layout mới

Không dùng generic 2x2 cards nếu có thể.

Preferred vertical editorial metrics:

```text
icon         HƠN 300+
             Lãnh đạo C-LEVEL tham gia
──────────────────────────────────────

icon         25+ NGÀNH NGHỀ
             Chủ lực đại diện
──────────────────────────────────────
...
```

Hoặc alternating alignment.

Target:

- metric value 24–30px;
- label 14–16px;
- icon 38–48px;
- divider thin.

Animation:

- each row reveal;
- divider width 0 → 100%;
- icon 0.94 → 1.

Không đổi metric text.

---

# 15. CEO Roundtable Section

## Nội dung bắt buộc

Heading:

```text
Bàn tròn CEO
```

Subtitle:

```text
Khai mở góc nhìn - Kiến tạo giá trị
```

Body:

```text
Không "thuyết trình". Tranh luận để tìm kiếm những sự thật ngầm hiểu đắt giá nhất. Tham gia Bàn tròn CEO định kỳ dành riêng cho thành viên CWI.
```

Metrics:

```text
QUY MÔ GIỚI HẠN
Tối đa 30 CEO
```

```text
100% TUYỂN CHỌN
Bởi Ban cố vấn
```

CTA:

```text
Đăng Ký Xét Duyệt Tham Gia
```

Không đổi capitalization trừ khi chỉ bằng CSS `text-transform`.

---

## Layout

Đây là flagship section.

Mobile nên gần full-bleed.

Preferred:

```text
margin: 8px hoặc 0
border-radius top/bottom 28–32px nếu cần
background deep navy
```

Không giữ card nhỏ giữa white gutters quá rộng.

### Text block

Padding khoảng:

```text
24px
```

Heading:

```text
36–48px
```

CEO asset `textCeo` có thể giữ như desktop.

### Metrics

Không dùng 2 card generic.

Preferred two-column with divider:

```text
[ icon ]
QUY MÔ GIỚI HẠN
Tối đa 30 CEO

vertical divider

[ icon ]
100% TUYỂN CHỌN
Bởi Ban cố vấn
```

Ở 320px có thể stack.

---

# 16. Roundtable image

Giữ:

```text
image124
```

Không thay ảnh.

Image nên có cảm giác immersive.

Suggested:

- ratio ~4:5 hoặc 1:1.08;
- overflow hidden;
- radius 18–24px;
- border white 1px / subtle;
- image scale khoảng 1.06.

Scroll parallax:

```text
translateY ~ -16 → +16px
```

Container giữ cố định.

Không để image jump/reflow.

---

# 17. Advisors introduction / CWI story

## Heading bắt buộc

```text
Thước đo sức khỏe hệ năng lực
cho Ban giám đốc
```

Accent `hệ năng lực` giữ aqua/italic.

## Paragraph 1

```text
Gần 25 năm qua, bà Phạm Thị Mỹ Lệ cùng cộng sự đã đồng hành với hàng trăm doanh nghiệp giải quyết bài toán về con người, năng lực lãnh đạo và hiệu quả tổ chức.
```

## Paragraph 2

```text
Từ thực tiễn đó, bà nhận thấy lãnh đạo có nhiều dữ liệu về thị trường và khách hàng, nhưng lại thiếu thông tin để đánh giá mức độ sẵn sàng của đội ngũ thực thi chiến lược tăng trưởng.
```

## Intro line

```text
CEO Workforce Index ra đời
```

---

## NỘI DUNG MOBILE HIỆN ĐANG BỊ THIẾU — PHẢI THÊM LẠI

Desktop có thêm 3 bullet:

```text
Một hệ tri thức và đối chuẩn năng lực điều hành tổ chức dành cho CEO.
```

```text
Dữ liệu được phân tích chuyên sâu bởi AI.
```

```text
Giúp lãnh đạo nhận diện và thu hẹp khoảng cách giữa mục tiêu tăng trưởng và năng lực thực thi của đội ngũ.
```

Mobile hiện chưa render 3 bullet này.

**Agent bắt buộc thêm đầy đủ.**

Có thể redesign bullets thành:

- numbered editorial points;
- thin dividers;
- icon/dot;
- 01/02/03.

Nhưng wording phải giữ nguyên.

---

# 18. Advisor Section Label

Bắt buộc giữ:

```text
Hội đồng Cố vấn chuyên môn
```

Thiết kế section label:

- thin lines;
- typography nhỏ;
- cân giữa;
- spacing thoáng.

Không cần giống pixel desktop.

---

# 19. Advisor Carousel

Mobile source hiện đã dùng horizontal scroll. Giữ hướng này nhưng nâng cấp.

## Advisor data

Phải render toàn bộ array `advisors`.

Không được chỉ render 3–5 người để page ngắn hơn.

Tất cả entries đang có trong source phải còn.

Mỗi card giữ:

```text
advisor.title
advisor.field
advisor.name
advisor.image
```

---

## Card size

Preferred:

```css
width: min(78vw, 300px);
height: 380–410px;
flex: 0 0 auto;
```

Để card kế tiếp peek khoảng 20–40px.

### Active state

Active card:

```text
scale 1
opacity 1
```

Non-active:

```text
scale .94–.97
opacity .68–.8
```

Không làm unreadable.

Use IntersectionObserver hoặc scroll position.

---

## Card motion

Khi active:

- portrait scale 1.04 → 1;
- blue graphic reveal;
- copy translateY 10px → 0;
- opacity → 1.

Không replay liên tục khi scroll một pixel.

---

## Carousel progress

Thêm indicator.

Preferred:

```text
01 / 10                  SWIPE →
```

Hoặc progress bar.

Không dùng 10 dots nhỏ nếu visual clutter.

Indicator có thể cập nhật active index.

---

# 20. Partners Section

Không được bỏ logo nào.

Dữ liệu phải render đầy đủ:

```text
organizerLogos
associationLogos
partnerLogos
```

---

# 21. Đơn vị Đồng tổ chức

Label bắt buộc:

```text
Đơn vị Đồng tổ chức
```

Có 4 logo trong data.

Giữ đủ cả 4.

Preferred:

- 2 columns hoặc 2-row premium layout;
- logo nhiều whitespace;
- không dùng card border nặng.

Nếu muốn replicate desktop repetition của organizer rows, chỉ cần đảm bảo semantic content/logo data hiện có không bị thiếu; không cần lặp vô nghĩa trên mobile nếu desktop chỉ lặp visual cùng bộ logo.

---

# 22. Hiệp hội

Label:

```text
Hiệp hội
```

Phải render đủ 11 entries trong `associationLogos`.

Preferred:

### Option A — horizontal rail

```text
[logo][logo][logo] →
```

### Option B — slow marquee

Nếu marquee:

- duplicate DOM chỉ để loop;
- duplicate phải `aria-hidden="true"`;
- source data gốc vẫn render đầy đủ;
- tốc độ 28–40s;
- pause khi `prefers-reduced-motion`.

Không chạy quá nhanh.

---

# 23. Công ty đối tác

Label:

```text
Công ty đối tác
```

Phải render đủ toàn bộ `partnerLogos`:

- Borgs
- Peter Millar
- partner logo 67
- partner logo 68
- partner logo 65
- Alice Olivia
- VidaXL
- Sally Skoufis
- Furniture Choice
- Mercury

Preferred:

- 2 marquee rows;
- hoặc swipe rail.

Không dùng grid 2 cột làm page kéo dài quá mức nếu có thể tối ưu bằng horizontal motion.

---

# 24. Footer Mobile

Không bỏ bất kỳ thông tin nào.

## Logo

```text
CEO Workforce Index
```

giữ footer logo hiện tại.

---

## Chính sách bảo mật

Heading:

```text
CHÍNH SÁCH BẢO MẬT
```

Body:

```text
Mọi dữ liệu doanh nghiệp nhập vào hệ thống AI đều được mã hóa đầu cuối theo tiêu chuẩn bảo mật quốc tế ISO/IEC 27001.
```

```text
Chúng tôi cam kết không chia sẻ dữ liệu cho bên thứ ba dưới bất kỳ hình thức nào.
```

---

## Contact

Heading:

```text
THÔNG TIN LIÊN HỆ ĐẶC QUYỀN
```

Giữ:

```text
Hotline VIP (24/7): 0909 123 456
```

```text
Email Ban điều hành CWI: cwi@xyz.com
```

```text
Trụ sở: 36 Mạc Đĩnh Chi, Phường Tân Định, TP. HCM
```

---

## Copyright

Giữ nguyên:

```text
Bản quyền 2026 Toàn bộ quyền sở hữu trí tuệ thuộc về các Đơn vị đồng tổ chức và Đối tác.
```

---

# 25. Final CTA trước footer

Có thể thêm một final conversion block nhưng **không được tự tạo claim mới**.

Ưu tiên reuse copy đã tồn tại.

Ví dụ:

```text
Hệ năng lực tốt hơn
Doanh nghiệp mạnh hơn
```

CTA:

```text
Thực hiện khảo sát
```

Điều này được phép vì reuse existing content.

Không tạo câu marketing mới nếu không có requirement.

---

# 26. Sticky Mobile CTA

Có thể thêm mobile sticky CTA sau khi user scroll qua Hero.

Label:

```text
Thực hiện khảo sát
```

Không đổi CTA.

Behavior:

- hidden trong hero;
- show sau hero;
- hide khi gần footer;
- bottom safe-area;
- width calc viewport - 24/32px;
- subtle glass container;
- red button.

Không che nội dung.

Không che advisor carousel controls.

---

# 27. Scroll progress

Có thể thêm 2px progress line dưới/top header.

Use:

```text
scrollY / (documentHeight - viewportHeight)
```

Update bằng requestAnimationFrame.

Không gây layout reflow.

Color:

- CWI blue hoặc red;
- chọn một, giữ subtle.

Không bắt buộc nếu làm ảnh hưởng performance.

---

# 28. Recommended component structure

Có thể refactor MobileLandingPage thành:

```tsx
MobileHeaderMenu
MobileHero
MobileReportSection
MobileReportChart
MobileUnlockCard
MobileReportStats
MobileRoundtable
MobileCwiStory
MobileAdvisorCarousel
MobilePartners
MobileFinalCta
MobileFooter
MobileStickyCta
MobileScrollProgress
```

Desktop components giữ nguyên.

Không refactor desktop thành shared component nếu có nguy cơ làm thay đổi DOM/CSS desktop.

---

# 29. Intersection Observer utility

Recommended:

```tsx
useRevealOnView(...)
```

hoặc data attribute:

```html
data-reveal
```

Observer:

```text
threshold ~0.12–0.22
rootMargin bottom -8% tới -12%
```

Add class:

```text
is-visible
```

Observer nên unobserve sau khi reveal để animation chỉ chạy một lần.

---

# 30. No-JS fallback

Không thiết kế kiểu:

```css
opacity: 0
```

mãi nếu observer không init.

Một approach an toàn:

- add root class `motion-ready` từ JS;
- chỉ hide `[data-reveal]` khi `.motion-ready`;
- hoặc initial render visible rồi requestAnimationFrame enable states.

Mục tiêu:

**content không được biến mất vì animation bug.**

---

# 31. Touch interaction

Button min touch target:

```text
44 × 44 px
```

Không có interactive element quá sát nhau.

Horizontal scroll phải:

```css
touch-action: pan-x;
overscroll-behavior-inline: contain;
```

Không khóa vertical scroll khi user swipe advisor trừ khi thực sự cần.

---

# 32. Typography mobile

Giữ font system hiện tại.

Không thay font family toàn site.

Recommended scales:

### Hero H1

```text
42–56px
```

### Section H2

```text
30–38px
```

### Major subtitle

```text
17–20px
```

### Body

```text
15–16px
line-height 22–25px
```

### Labels

```text
11–13px
```

Không dùng body dưới 14px.

---

# 33. Spacing system

Mobile nên dùng consistent rhythm.

Recommended:

```text
4
8
12
16
20
24
32
40
48
56
64
72
```

Section vertical padding:

```text
56–72px
```

Không dùng hàng chục giá trị spacing ngẫu nhiên.

---

# 34. Border radius system

Recommended:

```text
small: 12px
medium: 18px
large: 24px
section: 28–32px
pill: 999px
```

Không mỗi card một radius khác nhau.

---

# 35. Shadows

Giữ subtle.

Light sections:

```css
0 18px 48px rgba(15, 23, 42, .08)
```

CTA:

```css
0 14px 36px rgba(233, 37, 43, .25)
```

Không animate box-shadow liên tục.

---

# 36. Content parity audit bắt buộc trước khi hoàn tất

Agent phải so sánh desktop và mobile.

Mobile phải có tối thiểu đầy đủ:

## Header

- CWI logo
- Trang chủ
- Tiêu điểm
- Báo cáo
- Roundtable
- Về CWI
- EN
- Đăng nhập

## Hero

- eyebrow
- Hệ năng lực tốt hơn
- Doanh nghiệp mạnh hơn
- full description
- Thực hiện khảo sát

## Report

- Tiêu điểm quý 3/2026
- subtitle
- full Lorem ipsum paragraph
- full chart y labels
- full chart quarter labels
- unlock title
- unlock description
- unlock CTA
- teaser CTA
- security note
- 4 report metrics

## Roundtable

- Bàn tròn CEO
- subtitle
- full paragraph
- 2 metrics
- CTA
- image

## CWI story

- heading
- paragraph 1
- paragraph 2
- CEO Workforce Index ra đời
- bullet 1
- bullet 2
- bullet 3

## Advisors

- Hội đồng Cố vấn chuyên môn
- all advisor entries
- all names
- all titles
- all fields
- all images

## Partner ecosystem

- Đơn vị Đồng tổ chức
- all organizer logos
- Hiệp hội
- all association logos
- Công ty đối tác
- all partner logos

## Footer

- privacy heading
- full privacy paragraph
- no third-party sharing paragraph
- contact heading
- hotline
- email
- address
- copyright

---

# 37. Functional behavior phải giữ

Không phá các existing actions:

```text
survey
unlock-report
download-teaser
roundtable-apply
login
```

Nếu thêm sticky/final CTA:

- reuse `emitLandingAction(...)`;
- không tạo handler khác với cùng business action trừ khi cần.

Navigation phải scroll tới đúng mobile section.

Không dùng desktop Figma offset cho mobile menu navigation.

Mobile nên dùng:

```tsx
element.scrollIntoView({
  behavior: 'smooth',
  block: 'start'
})
```

hoặc tương đương.

Cần xử lý header offset bằng:

```css
scroll-margin-top
```

---

# 38. Desktop regression protection

Sau khi sửa, agent phải kiểm tra desktop.

### Mandatory:

Viewport:

```text
1440px
```

Desktop phải:

- vẫn render Figma canvas;
- header giữ y chang;
- hero giữ y chang;
- report giữ y chang;
- roundtable giữ y chang;
- advisors giữ y chang;
- partners giữ y chang;
- footer giữ y chang.

Nếu có screenshot baseline trong:

```text
qa/
```

ưu tiên đối chiếu với:

```text
qa/figma-1440.png
```

và các screenshot desktop final hiện có.

Không chấp nhận desktop “gần giống”.

Desktop phải được xem là immutable regression baseline.

---

# 39. Mobile QA matrix

Kiểm tra ít nhất:

```text
320 × 568
360 × 800
375 × 812
390 × 844
393 × 852
412 × 915
430 × 932
768 × 1024
900 × 1000
```

### Không được có

- horizontal page overflow;
- clipped heading;
- text overlap;
- cropped CTA;
- logo vượt container;
- chart label đè nhau nghiêm trọng;
- sticky CTA che footer;
- menu bị safe-area che;
- carousel làm page ngang;
- animation gây blank section;
- image layout shift mạnh.

---

# 40. Mobile visual QA checklist

Agent tự kiểm:

### Header
- [ ] Floating header premium.
- [ ] Scroll hide/show smooth.
- [ ] Menu usable 320px.
- [ ] Navigation đầy đủ.
- [ ] EN còn truy cập được.
- [ ] Login còn truy cập được.

### Hero
- [ ] Không giống desktop thu nhỏ.
- [ ] Strong hierarchy.
- [ ] Background cinematic.
- [ ] CTA rõ.
- [ ] Motion subtle.

### Report
- [ ] Full text.
- [ ] Chart đủ labels.
- [ ] Chart animation smooth.
- [ ] Unlock card premium.
- [ ] 4 metrics đọc dễ.

### Roundtable
- [ ] Section immersive.
- [ ] Full content.
- [ ] Image đẹp.
- [ ] Data hierarchy mạnh.

### Story
- [ ] 3 bullets bị thiếu đã được restore.
- [ ] Paragraph đọc thoải mái.
- [ ] Không cắt nội dung.

### Advisors
- [ ] Swipe rõ ràng.
- [ ] Peek card.
- [ ] Active state premium.
- [ ] Progress indicator hoạt động.
- [ ] Không thiếu advisor.

### Partners
- [ ] Không thiếu logo.
- [ ] Marquee/rail mượt.
- [ ] Không quá dài.
- [ ] Reduced motion xử lý đúng.

### Footer
- [ ] Full privacy text.
- [ ] Full contact.
- [ ] Copyright đầy đủ.
- [ ] Layout sạch.

---

# 41. Code quality

Agent cần:

- giữ TypeScript;
- không dùng `any` tràn lan;
- tránh inline style nếu CSS class phù hợp;
- tránh copy/paste animation mỗi component;
- đặt mobile class prefix rõ ràng;
- cleanup event listener;
- cleanup observers;
- không memory leak;
- không add global styles ảnh hưởng desktop;
- không xóa QA assets;
- không đổi Figma assets nếu không cần.

---

# 42. Không làm các việc sau

Không:

- redesign desktop;
- thay Figma desktop;
- đổi desktop breakpoint;
- xóa content;
- rút gọn content;
- tự viết thêm claim;
- dùng lorem mới khác source;
- thay advisor data;
- thay partner data;
- thay phone/email/address;
- dùng scroll-jacking;
- dùng horizontal page scroll;
- dùng animation kéo dài >1.5s cho interaction cơ bản;
- dùng autoplay video;
- dùng quá nhiều blur;
- dùng neon effect;
- dùng glass card khắp nơi;
- dùng bounce animation trẻ con;
- dùng infinite animation cho text;
- làm advisor carousel auto-scroll bắt buộc;
- làm page phụ thuộc animation lib nặng.

---

# 43. Definition of Done

Task chỉ hoàn tất khi tất cả điều kiện sau đạt:

1. Desktop `>900px` giữ nguyên visual pixel-perfect hiện tại.
2. Mobile `<=900px` có UI riêng hoàn chỉnh.
3. Không thiếu content so với desktop.
4. Full report paragraph đã được restore.
5. Full chart labels đã được restore.
6. Ba bullet CWI story đã được restore.
7. Header mobile có navigation đầy đủ.
8. Advisor carousel hoạt động tốt.
9. Tất cả advisor render đầy đủ.
10. Organizer/association/partner logos đầy đủ.
11. Roundtable được redesign premium.
12. Report statistics không còn cảm giác generic dashboard.
13. Motion system nhất quán.
14. `prefers-reduced-motion` được hỗ trợ.
15. Không có horizontal page overflow.
16. Không có animation làm content invisible khi lỗi JS.
17. Mobile responsive tốt từ 320–900px.
18. Existing actions vẫn hoạt động.
19. Desktop regression QA đạt.
20. Code build/typecheck không tạo thêm lỗi mới.

---

# 44. Ưu tiên triển khai

## P0 — bắt buộc

1. Content parity.
2. Hero redesign.
3. Report redesign.
4. Full chart data + animation.
5. Unlock card.
6. Report statistics.
7. Roundtable.
8. Restore missing CWI story bullets.
9. Advisor carousel.
10. Partners mobile.
11. Footer.
12. Desktop regression protection.

## P1 — premium polish

1. Mobile navigation overlay.
2. Sticky CTA.
3. Reveal motion system.
4. Advisor active scaling.
5. Image parallax.
6. Logo marquee.
7. Hero ambient motion.

## P2 — optional nếu không ảnh hưởng stability

1. Scroll progress.
2. More advanced chart point sequencing.
3. Fine-grained microinteractions.

---

# 45. Final instruction to agent

Hãy coi:

```text
Desktop = LOCKED PRODUCTION BASELINE
Mobile = REDESIGN SURFACE
```

Mục tiêu không phải “responsive cho chạy được”.

Mục tiêu là tạo một mobile experience có thể đứng độc lập về chất lượng thiết kế:

```text
Executive
Premium
Editorial
Data-driven
Smooth
Modern
Conversion-focused
```

Nhưng mọi cải tiến visual đều đứng sau hai yêu cầu quan trọng nhất:

```text
1. Không thay đổi Desktop.
2. Không làm mất bất kỳ nội dung nào trên Mobile.
```

Nếu một ý tưởng animation/layout xung đột với content readability hoặc desktop stability, **bỏ ý tưởng animation/layout đó**.

Không được hy sinh nội dung hoặc desktop pixel-perfect để đạt hiệu ứng.
