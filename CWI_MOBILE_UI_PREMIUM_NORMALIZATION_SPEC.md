# CWI Mobile UI — Premium Normalization & Redesign Pass
## Prescriptive Implementation Specification for Coding Agent

---

# 0. Mục tiêu của pass này

Đây là **pass chỉnh sửa lần 2 dành riêng cho Mobile UI** của CWI.

Source hiện tại đã có:

- Mobile layout riêng.
- Mobile navigation.
- Hero mobile.
- Report section.
- Chart animation.
- Unlock report card.
- Statistics.
- CEO Roundtable.
- CWI story.
- Advisor carousel.
- Partner/association sections.
- Sticky CTA.
- Footer.
- Motion/reveal logic.

Tuy nhiên visual mobile hiện tại vẫn chưa đạt chất lượng mong muốn vì:

- border-radius không nhất quán;
- padding và spacing bị phân mảnh;
- mỗi section có một “container philosophy” khác nhau;
- typography chưa có một type scale rõ ràng;
- card surfaces chưa thống nhất;
- shadow/glass/blur đang dùng tùy hứng;
- một số section trông như UI component library thay vì một landing page được art-direct;
- motion có nhiều nhưng chưa tạo cảm giác premium;
- hierarchy giữa các section chưa đủ mạnh;
- tổng thể chưa có “shape language” và “rhythm” xuyên suốt.

**Pass này không phải redesign tự do.**

Agent phải thực hiện theo các token, rules và section specification dưới đây.

---

# 1. Non-negotiable constraints

## 1.1 Desktop là IMMUTABLE BASELINE

Desktop đã pixel-perfect theo Figma.

**Tuyệt đối không thay đổi desktop.**

Không:

- sửa desktop DOM;
- sửa desktop spacing;
- sửa desktop CSS;
- sửa desktop absolute positioning;
- sửa desktop typography;
- sửa desktop assets;
- sửa desktop animation;
- sửa desktop breakpoints theo cách làm desktop thay đổi;
- refactor shared style nếu có nguy cơ ảnh hưởng desktop.

### Desktop definition

```text
viewport > 900px
```

### Mobile definition

```text
viewport <= 900px
```

Mọi thay đổi trong pass này phải:

- nằm trong `MobileLandingPage`;
- hoặc mobile-only classes;
- hoặc `@media (max-width: 900px)`;
- hoặc utility/hook chỉ được gọi từ mobile DOM.

---

## 1.2 Không được làm mất content

Mobile phải giữ đầy đủ nội dung hiện tại.

Không:

- cắt text;
- paraphrase;
- tóm tắt;
- bỏ bullet;
- bỏ metric;
- bỏ advisor;
- bỏ logo;
- bỏ chart labels;
- bỏ footer information;
- bỏ CTA đang có;
- tự thêm claim mới.

Nếu một section dài, **cho nó dài**.

Không được hy sinh content để làm mobile “gọn”.

---

# 2. Core design direction

Mobile CWI phải có cảm giác:

```text
Executive
Editorial
Premium
Data-led
Modern
Minimal
Structured
Confident
Corporate
```

Không được mang cảm giác:

```text
Generic SaaS
Dashboard card soup
Template landing page
Over-glassmorphism
Over-rounded playful UI
Over-animated agency demo
Neon/futuristic gaming
```

Reference mindset:

- premium annual report;
- executive intelligence product;
- consulting-grade editorial page;
- high-end data publication;
- leadership research platform.

---

# 3. GLOBAL MOBILE DESIGN TOKENS

Agent phải tạo một nhóm token mobile duy nhất.

Ví dụ:

```css
@media (max-width: 900px) {
  :root {
    --m-page-x: 20px;

    --m-space-1: 4px;
    --m-space-2: 8px;
    --m-space-3: 12px;
    --m-space-4: 16px;
    --m-space-5: 24px;
    --m-space-6: 32px;
    --m-space-7: 48px;
    --m-space-8: 64px;
    --m-space-9: 80px;

    --m-radius-sm: 12px;
    --m-radius-md: 16px;
    --m-radius-lg: 24px;
    --m-radius-xl: 32px;
    --m-radius-pill: 999px;

    --m-shadow-card: 0 16px 48px rgba(15, 23, 42, .08);
    --m-shadow-floating: 0 12px 32px rgba(15, 23, 42, .12);
    --m-shadow-cta: 0 12px 28px rgba(233, 37, 43, .20);

    --m-display: clamp(44px, 12vw, 56px);
    --m-h1: clamp(36px, 9.5vw, 44px);
    --m-h2: 32px;
    --m-h3: 24px;

    --m-body-lg: 17px;
    --m-body: 15px;
    --m-small: 13px;
    --m-label: 11px;
  }
}
```

---

# 4. Radius system — LOCKED

Chỉ được dùng:

```text
12px
16px
24px
32px
999px
```

### Meaning

```text
12px = small controls / compact UI
16px = inner surfaces
24px = standard cards / images
32px = flagship section surfaces
999px = pills / floating header / capsule buttons
```

### Không được dùng

```text
18px
20px
22px
26px
28px
30px
40px
58px
```

hoặc giá trị arbitrary khác.

Nếu existing mobile CSS có các radius này, normalize về token tương ứng.

---

# 5. Spacing system — LOCKED

Chỉ dùng spacing scale:

```text
4
8
12
16
24
32
48
64
80
```

Không tạo các giá trị:

```text
18
20 (ngoại trừ page gutter)
22
26
28
30
34
36
38
40
44
52
56
58
60
72
76
88
```

nếu không có lý do đặc biệt được ghi trong spec này.

### Exception duy nhất

```text
--m-page-x: 20px
```

Trên màn lớn mobile:

```css
@media (min-width: 430px) and (max-width: 900px) {
  :root {
    --m-page-x: 24px;
  }
}
```

---

# 6. Global mobile layout grid

Tạo:

```css
.mobile-shell {
  width: 100%;
  max-width: 560px;
  margin-inline: auto;
}

.mobile-container {
  width: 100%;
  padding-inline: var(--m-page-x);
}
```

Text content của tất cả section phải bám cùng vertical axis.

### Full-bleed exception

Chỉ các section sau được phép full-bleed:

```text
Hero background
CEO Roundtable background
Advisor horizontal track
Logo marquee / logo rail
Final CTA background
```

Nhưng text bên trong full-bleed section vẫn phải bám:

```text
var(--m-page-x)
```

---

# 7. Global section rhythm

Default vertical spacing:

```text
section top/bottom = 80px
```

Section nhỏ có thể:

```text
64px
```

Không dùng mỗi section một padding riêng arbitrary.

### Internal rhythm

```text
Eyebrow → Heading: 12px
Heading → Subtitle: 12px
Subtitle → Body: 16px
Body → Visual: 32px
Visual → Supporting content: 32px
Card → Card: 16px
Major content group → next: 48px
```

---

# 8. Typography system — LOCKED

## Hero display

```text
font-size: var(--m-display)
line-height: 0.98–1
```

## Major section heading

```text
font-size: var(--m-h1)
line-height: 1.05
```

## Standard section heading

```text
font-size: var(--m-h2)
line-height: 1.1
```

## Card heading

```text
font-size: var(--m-h3)
line-height: 1.2
```

## Body large

```text
font-size: var(--m-body-lg)
line-height: 1.55
```

## Body

```text
font-size: var(--m-body)
line-height: 1.55–1.6
```

## Small

```text
font-size: var(--m-small)
line-height: 1.45
```

## Label

```text
font-size: var(--m-label)
line-height: 1.4
letter-spacing: .08em–.12em
```

Không tạo thêm quá nhiều `clamp()`.

---

# 9. Shadow system — LOCKED

Chỉ có:

```css
--m-shadow-card
--m-shadow-floating
--m-shadow-cta
```

Không dùng các shadow tùy hứng khác.

### Rule

- Standard card: `--m-shadow-card`
- Header/menu floating: `--m-shadow-floating`
- Red CTA: `--m-shadow-cta`

Không animate box-shadow liên tục.

---

# 10. Surface system

Chỉ dùng 4 loại surface:

## A. Plain

```text
white / neutral background
no border
no shadow
```

Dùng cho:

- editorial text section;
- partner logo rows;
- story;
- statistics nếu không cần card.

## B. Standard card

```text
white
radius 24px
subtle border optional
shadow card
```

## C. Dark flagship

```text
deep navy
radius 32px
white/light text
```

Dùng cho:

- CEO Roundtable;
- final CTA nếu cần.

## D. Floating glass

Chỉ dùng cho:

- header;
- sticky CTA shell;
- full-screen menu control bar nếu cần.

Không dùng glass card khắp page.

---

# 11. Motion system — LOCKED

Chỉ dùng 5 motion patterns.

## Motion A — Mask heading reveal

Heading wrapper:

```css
overflow: hidden;
```

Inner:

```css
transform: translateY(110%);
opacity: 0;
```

Active:

```css
transform: translateY(0);
opacity: 1;
```

Duration:

```text
620ms
```

Ease:

```text
cubic-bezier(0.22, 1, 0.36, 1)
```

---

## Motion B — Body fade-up

```text
translateY(16px)
opacity 0
→
translateY(0)
opacity 1
```

Duration:

```text
560ms
```

---

## Motion C — Divider growth

```text
scaleX(0)
transform-origin:left
→
scaleX(1)
```

Duration:

```text
560–700ms
```

---

## Motion D — Image settle

```text
scale 1.04
opacity .85
→
scale 1
opacity 1
```

Duration:

```text
700–900ms
```

---

## Motion E — Interactive translation

For arrow/button/card:

```text
translateX 0 → 4px
```

hoặc:

```text
scale 1 → .98
```

Tap feedback:

```text
120–180ms
```

---

# 12. Không dùng motion kiểu sau

Không:

```text
bounce
elastic
overshoot mạnh
rotating icon loops
floating mọi card
continuous glow pulse
reveal 1.5–2s
large parallax
scroll-jacking
auto carousel
```

---

# 13. MOBILE HEADER — REDESIGN NORMALIZATION

## Layout

Header:

```text
left/right: 12px
top: safe area + 10px
height: 60px
radius: 999px
```

### Internal

```text
padding-inline: 16px
gap: 12px
```

### Visual

```text
background rgba white ~0.88
blur 20px
subtle border
shadow-floating
```

Không dùng radius khác.

---

## Header behavior

- At top: visible.
- Scroll down: translateY negative.
- Scroll up: show.
- Duration: 320ms.
- No bounce.

---

## Mobile menu

Full-screen or near-full-screen overlay.

Surface:

```text
deep navy hoặc white premium
radius: 0 nếu full viewport
```

Không dùng side drawer 280px.

Menu item spacing:

```text
16px
```

Section between nav and CTA:

```text
32px
```

Nav font:

```text
24–28px
```

---

# 14. HERO — PREMIUM ART DIRECTION PASS

Hero là cinematic entry point.

## Layout

```text
min-height: 720px
```

Text block:

```text
padding-top: 144px
padding-inline: var(--m-page-x)
padding-bottom: 80px
```

Không center toàn bộ.

**Text left aligned.**

---

## Eyebrow

```text
label size
aqua
max-width 330px
```

Spacing:

```text
margin-bottom: 12px
```

---

## Heading

Dùng `--m-display`.

Composition:

```text
Hệ năng lực
tốt hơn

Doanh nghiệp
mạnh hơn
```

Không đổi text.

Spacing giữa 2 clusters:

```text
8px
```

Không dùng một margin 20/26/34 tùy ý.

---

## Description

```text
margin-top: 24px
font-size: 16–17px
line-height: 1.55
max-width: 360px
```

---

## CTA

```text
margin-top: 24px
height: 56px
radius: 999px
padding-inline: 24px
```

Không full-width nếu không cần.

---

## Hero motion sequence

```text
0ms: eyebrow
80ms: heading line 1
150ms: heading line 2
220ms: heading cluster 2
340ms: body
440ms: CTA
```

Heading dùng mask reveal.

Không fade toàn hero một lần.

---

## Hero background

Giữ asset hiện tại.

Scale:

```text
1.06 → 1
```

Duration:

```text
1200ms
```

Parallax tối đa:

```text
12px
```

Không blur animate.

---

# 15. HERO → REPORT TRANSITION

Transition phải rất tối giản.

Layout:

```text
height: 64px
```

Content:

```text
Q3 / 2026
thin line
down arrow
```

Không tạo extra marketing copy.

Line animation dùng Divider Growth.

---

# 16. REPORT INTRO — EDITORIAL SYSTEM

Section:

```text
padding-block: 80px
```

Không card.

Plain surface.

Content:

```text
small date / quarter
heading
subtitle
paragraph
```

Spacing:

```text
label → heading: 12px
heading → subtitle: 12px
subtitle → paragraph: 16px
paragraph → chart: 32px
```

---

# 17. CHART — CLEAN DATA SURFACE

Chart không đặt trong 3 lớp card.

Dùng:

```text
standard card
radius 24px
padding 24px
shadow card
```

Nếu chart cần horizontal overflow:

```text
overflow-x: auto
```

Inner chart:

```text
min-width phù hợp để labels không chồng
```

Không dùng inner card radius khác ngoài:

```text
16px
```

nếu có sub-surface thật sự cần thiết.

---

## Chart animation

Sequence:

```text
grid
→ area
→ line
→ points
→ active Q3/2026
```

Không thêm nhiều glow.

Active point có thể:

```text
scale .8 → 1
```

Không pulse loop.

---

# 18. UNLOCK REPORT CARD — SIMPLIFY LAYERS

Hiện tại cần bỏ cảm giác:

```text
card
inside card
inside image
buttons
note
```

## New structure

Một outer card duy nhất:

```text
radius 24px
background white
shadow card
overflow hidden
```

Visual zone:

```text
deep navy
min-height 280px
radius 0
```

Không đặt inner visual card với radius 18/22/26.

Text/actions zone:

```text
padding 24px
```

Spacing:

```text
title → body: 12px
body → primary CTA: 24px
primary → secondary: 12px
secondary → security: 16px
```

---

## Lock motion

Chỉ entrance:

```text
scale .94 → 1
rotate -4deg → 0
```

Duration:

```text
600ms
```

Không loop.

---

# 19. REPORT STATISTICS — REMOVE GENERIC 2×2 CARD GRID

Không dùng 4 cards.

Dùng vertical editorial metric list.

## Structure

```text
row
icon
metric value
description
divider
```

Row:

```text
padding-block: 24px
```

Divider:

```text
1px
```

Không outer card.

---

## Metric typography

Value:

```text
26–30px
font-weight strong
```

Description:

```text
15px
```

Icon:

```text
40–44px
```

---

## Motion

For each row:

```text
divider grow
→ icon
→ metric
→ body
```

Stagger 60ms.

---

# 20. CEO ROUNDTABLE — FLAGSHIP SURFACE

Đây phải là visual anchor chính của mobile.

## Outer

Preferred:

```text
margin-inline: 8px
background: deep navy
radius: 32px
overflow: hidden
```

Không `border-radius: 0`.

Không generic white card.

---

## Internal content

```text
padding: 64px var(--m-page-x)
```

Heading:

```text
--m-h1
```

Subtitle:

```text
17px
```

Body:

```text
15–16px
```

Spacing:

```text
heading → subtitle: 12px
subtitle → body: 16px
body → metrics: 32px
metrics → CTA: 32px
CTA → image: 48px
```

---

# 21. ROUNDTABLE METRICS

Không card.

Two-column editorial grid:

```text
Metric A | divider | Metric B
```

Each:

```text
icon
label
value
```

Mobile 320px:

```text
stack vertical
```

Breakpoint for stack:

```text
max-width ~340px
```

---

# 22. ROUNDTABLE IMAGE

Không card-in-card.

Image container:

```text
radius 24px
overflow hidden
```

Không inner radius khác.

Parallax tối đa:

```text
16px
```

Image settle motion.

---

# 23. CWI STORY — EDITORIAL ARTICLE MODE

Không card.

Plain white/neutral.

Heading:

```text
--m-h1
```

Paragraph:

```text
--m-body-lg
```

Spacing:

```text
paragraph → paragraph: 24px
```

---

## Three key bullets

Không render như 3 bubble cards.

Dùng numbered editorial points:

```text
01
text
────────────

02
text
────────────

03
text
```

Each point:

```text
padding-block: 24px
```

Number:

```text
label size
aqua / blue accent
```

Text:

```text
16px
```

---

# 24. ADVISOR SECTION — MODERN CAROUSEL NORMALIZATION

## Section intro

Plain surface.

Section heading:

```text
Hội đồng Cố vấn chuyên môn
```

Spacing:

```text
heading → carousel: 32px
```

---

## Card

Normalize:

```text
width: min(78vw, 300px)
height: 400px
radius: 24px
```

**Không dùng `border-top-left-radius: 58px`.**

Nếu cần visual identity đặc biệt:

- dùng graphic overlay;
- dùng diagonal shape;
- dùng pseudo element;
- nhưng outer card vẫn 24px.

---

## Track

```text
gap: 16px
padding-inline: var(--m-page-x)
scroll-snap
```

No arbitrary 18/22/28 gap.

---

## Card active state

```text
active scale 1
inactive scale .96
inactive opacity .78
```

Không opacity quá thấp.

---

## Card progress

Use:

```text
01 / NN
horizontal progress line
SWIPE →
```

Spacing:

```text
margin-top: 24px
```

Không dot pagination.

---

# 25. PARTNER / LOGO SECTION — REMOVE CARD SOUP

Đây là section cần tối giản mạnh.

Không:

```text
white card
border
shadow
radius 18
cho từng logo
```

---

# 26. Organizer logos

Label:

```text
Đơn vị Đồng tổ chức
```

Layout:

```text
2 columns
gap 24px
```

Logo container:

```text
min-height 64–72px
display flex
align center
justify center
```

No card border.

No shadow.

---

# 27. Association logos

Label:

```text
Hiệp hội
```

Use horizontal rail hoặc marquee theo implementation hiện tại, nhưng **chốt một cách duy nhất**:

### Chọn: Horizontal auto-marquee

Rules:

```text
duration 32s
linear
pause on reduced motion
```

Each logo item:

```text
padding-inline: 16px
min-width: 140px
height: 72px
```

No card.

No border.

No radius needed.

---

# 28. Partner logos

Use 2 marquee rows.

Row 1:

```text
left → right
```

Row 2:

```text
right → left
```

Duration:

```text
34–38s
```

Gap:

```text
32px
```

No logo cards.

No shadow.

If two rows cause complexity, use one rail but do not revert to 2-column card grid.

---

# 29. FINAL CTA — STRONG CONVERSION BLOCK

Use dark flagship surface.

Outer:

```text
margin: 8px
radius: 32px
background navy
```

Inner:

```text
padding: 64px var(--m-page-x)
```

Reuse existing content only.

Heading:

```text
Hệ năng lực tốt hơn
Doanh nghiệp mạnh hơn
```

CTA:

```text
Thực hiện khảo sát
```

Button:

```text
height 56px
radius 999px
margin-top 24px
```

---

# 30. FOOTER — UTILITY, NOT ANOTHER CARD SECTION

Footer không dùng card.

Background:

```text
white / neutral
```

Padding:

```text
64px var(--m-page-x)
```

Bottom:

```text
calc(80px + env(safe-area-inset-bottom))
```

Group spacing:

```text
logo → privacy: 48px
privacy → contact: 32px
contact → copyright: 48px
```

No arbitrary values.

---

# 31. STICKY CTA

Sticky CTA shell:

```text
left/right 12px
bottom calc(12px + safe-area)
radius 999px
padding 6px
```

Glass shell.

Inside button:

```text
height 52px
radius 999px
```

Show:

```text
after hero
```

Hide:

```text
near final CTA/footer
```

Transition:

```text
translateY 16px + opacity
duration 280ms
```

---

# 32. Border policy

Borders chỉ dùng khi:

- cần phân tách card nhẹ;
- input/control;
- chart grid;
- divider.

Không border mọi card.

Default:

```text
1px solid rgba(...)
```

Không border đậm.

---

# 33. Divider policy

Use dividers thay vì nested cards.

Divider:

```text
1px
low contrast
```

Dùng trong:

- statistics;
- story bullets;
- roundtable metrics;
- footer groups nếu cần.

---

# 34. Background policy

Mobile page chỉ nên có vài background zone rõ:

```text
Hero cinematic
White editorial area
Navy Roundtable
White editorial area
Navy Final CTA
White footer
```

Không đổi background mỗi 1–2 block.

---

# 35. Content density policy

Không cố nhét quá nhiều thành phần horizontally.

At <=390px:

- ưu tiên stack;
- giữ whitespace;
- body line length hợp lý;
- không ép 3 columns;
- không font <14px để chứa layout.

---

# 36. Page hierarchy — MUST MATCH

Mobile page nên cảm nhận theo sequence:

```text
01 CINEMATIC
Hero

02 EDITORIAL
Report intro

03 DATA
Chart

04 PREMIUM ACTION
Unlock report

05 EVIDENCE
Metrics

06 FLAGSHIP
CEO Roundtable

07 EDITORIAL STORY
Why CWI

08 PEOPLE
Advisors

09 ECOSYSTEM
Partners

10 CONVERSION
Final CTA

11 UTILITY
Footer
```

Không để tất cả section có cùng visual weight.

---

# 37. Visual hierarchy levels

## Level 1

```text
Hero
CEO Roundtable
Final CTA
```

Strong backgrounds / cinematic.

## Level 2

```text
Report
CWI story
Advisors
```

Editorial.

## Level 3

```text
Stats
Partners
Footer
```

Supporting.

---

# 38. Mobile QA — DESIGN CONSISTENCY

Agent phải grep/check CSS mobile để đảm bảo:

### Radius values

Chỉ còn:

```text
12
16
24
32
999
```

### Spacing values

Ưu tiên:

```text
4
8
12
16
20 page gutter
24
32
48
64
80
```

### Shadows

Chỉ:

```text
3 token shadows
```

### Typography

Không có hơn ~8 font-size roles.

---

# 39. CSS audit requirement

Trước khi kết thúc, agent phải tự audit mobile CSS:

## Border radius

Không còn arbitrary radius.

## Padding

Không còn hàng chục tuple khác nhau nếu có thể dùng token.

## Gap

Normalize về token.

## Margin

Normalize về token.

## Shadows

Normalize về token.

## Z-index

Giữ một scale nhỏ:

```text
1
10
20
50
100
```

Không z-index random.

---

# 40. Responsive requirements

Visual QA:

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

Desktop QA:

```text
1440px
```

Desktop phải không đổi.

---

# 41. Interaction QA

Check:

- hamburger open/close;
- scroll lock;
- nav scroll;
- login;
- survey CTA;
- unlock;
- teaser download;
- roundtable CTA;
- advisor swipe;
- sticky CTA;
- final CTA;
- logo marquee;
- reduced motion.

---

# 42. Accessibility

Respect:

```css
@media (prefers-reduced-motion: reduce)
```

Disable:

- marquee;
- parallax;
- non-essential reveal transforms.

Interactive target:

```text
>=44px
```

Contrast phải đảm bảo đọc được.

---

# 43. Performance

Không add animation framework nặng chỉ để làm pass này.

Ưu tiên:

- CSS;
- IntersectionObserver;
- requestAnimationFrame;
- native scroll snap.

Không:

- GSAP nếu project chưa có và không thực sự cần;
- Framer Motion nếu chỉ để animate opacity/translate;
- WebGL;
- Three.js.

---

# 44. Do not “improve” content

Không sửa wording.

Không sửa:

```text
CEO Workforce Index
Roundtable
Hội đồng Cố vấn
Bảo mật
Contact
Metrics
```

Visual redesign only.

---

# 45. Implementation order — MANDATORY

Agent phải làm theo thứ tự:

## Step 1 — Create mobile tokens

Normalize:

- radius;
- spacing;
- typography;
- shadows;
- grid.

## Step 2 — Create/normalize shared mobile primitives

```text
mobile-shell
mobile-container
mobile-section
mobile-heading
mobile-card
mobile-divider
```

## Step 3 — Normalize header

## Step 4 — Redesign Hero

## Step 5 — Normalize Report + Chart

## Step 6 — Simplify Unlock Card

## Step 7 — Replace statistics cards

## Step 8 — Rebuild Roundtable hierarchy

## Step 9 — Normalize Story bullets

## Step 10 — Normalize Advisor cards

## Step 11 — Remove logo card soup

## Step 12 — Final CTA + Footer

## Step 13 — Normalize motion

## Step 14 — CSS token audit

## Step 15 — Desktop regression QA

---

# 46. Definition of Done

Pass này chỉ được xem là hoàn tất nếu:

- [ ] Desktop >900px không thay đổi visual.
- [ ] Mobile không thiếu content.
- [ ] Mobile dùng một page gutter duy nhất.
- [ ] Mobile dùng một max-width shell duy nhất.
- [ ] Radius system chỉ dùng 12/16/24/32/999.
- [ ] Spacing system được normalize.
- [ ] Typography hierarchy rõ.
- [ ] Shadows chỉ còn 3 token.
- [ ] Unlock card không còn nested-card soup.
- [ ] Statistics không còn generic 2×2 card grid.
- [ ] Roundtable trở thành flagship dark section.
- [ ] Advisor card không còn arbitrary 58px radius.
- [ ] Partner logos không còn mỗi logo một bordered card.
- [ ] Hero có cinematic hierarchy.
- [ ] Motion theo 5 pattern thống nhất.
- [ ] Không có horizontal page overflow.
- [ ] Sticky CTA không che content.
- [ ] Reduced motion hoạt động.
- [ ] Mobile 320–900px ổn.
- [ ] Desktop regression đạt.

---

# 47. Final instruction to coding agent

Không “creative freestyle”.

Không tự chọn radius.

Không tự chọn spacing.

Không tự chọn card style từng section.

Không tự phát minh shadow.

Không tự phát minh animation.

Hãy coi đây là một **design normalization pass có hệ thống**.

Mọi section phải nhìn như cùng thuộc một sản phẩm.

Ưu tiên theo thứ tự:

```text
1. Desktop safety
2. Content completeness
3. Visual consistency
4. Hierarchy
5. Premium feel
6. Motion polish
```

Nếu một hiệu ứng đẹp nhưng làm:

- spacing lệch;
- content khó đọc;
- performance giảm;
- desktop ảnh hưởng;
- UI inconsistent;

thì bỏ hiệu ứng đó.

Kết quả cuối phải tạo cảm giác:

```text
Một mobile experience được art-direct thống nhất,
không phải tập hợp nhiều section do agent thiết kế riêng lẻ.
```
