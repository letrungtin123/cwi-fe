# CWI Survey — European-Grade UI/UX Redesign Specification

## Implementation brief for coding agent

**Scope:** Redesign toàn bộ trải nghiệm `Survey` của CEO Workforce Index từ **Intro → Part 1 → Part 2 → Contact/Consent → Loading → Result → CEO Roundtable Modal**.

**Project reviewed:** `source4(2).zip`

**Primary source files:**

- `src/features/survey/SurveyExperience.tsx`
- `src/features/survey/SurveyChrome.tsx`
- `src/features/survey/SurveyQuestionPage.tsx`
- `src/features/survey/QuestionCard.tsx`
- `src/features/survey/SurveyNavigation.tsx`
- `src/features/survey/SurveyScreens.tsx`
- `src/features/survey/survey.css`
- `src/features/survey/surveyData.ts`
- `src/features/survey/surveyScoring.ts`

---

# 0. MISSION

Redesign phần Survey để đạt cảm giác:

- **Premium nhưng không phô diễn**
- **European editorial + digital product**
- **Institutional credibility**
- **Executive-grade**
- **Calm, precise, mature**
- **Có hệ thống và có chủ đích**
- **Không nhìn giống UI được AI generate**
- **Không giống SaaS dashboard template**
- **Không giống landing page startup dùng glassmorphism**
- **Không dùng hiệu ứng để che việc hierarchy yếu**

Người trả lời là CEO/Ban lãnh đạo. Trải nghiệm phải tạo cảm giác đây là một **research instrument có uy tín**, không phải một form marketing.

Design direction nên lấy tinh thần từ:

- Wise Design: system-first, rõ foundation/component/pattern
- N26: digital product đơn giản, sạch, restrained
- GOV.UK service design: task hierarchy rõ, form dễ hoàn thành, error rõ ràng
- Typeform: nhịp trả lời tập trung, friction thấp

**Không clone trực tiếp bất kỳ website nào.**

---

# 1. SOURCE AUDIT — VẤN ĐỀ HIỆN TẠI

## 1.1 `survey.css` đang bị chồng nhiều thế hệ style

File hiện tại khoảng **2.446 dòng** và đang chứa:

- CSS gốc
- responsive rules
- sau đó thêm một block `SURVEY PREMIUM REDESIGN PASS`
- rồi tiếp tục override lại rất nhiều selector cũ
- breakpoint `980px` xuất hiện nhiều lần
- breakpoint `640px` xuất hiện nhiều lần
- cùng một component bị định nghĩa lại nhiều lần ở các khu vực khác nhau

### Hậu quả

- specificity khó kiểm soát
- desktop/mobile dễ lệch nhau
- radius không thống nhất
- shadow không thống nhất
- spacing bị patch theo từng component
- khó bảo trì
- agent tiếp theo rất dễ tiếp tục append CSS thay vì sửa kiến trúc

### BẮT BUỘC

**KHÔNG được thêm một block `REDESIGN PASS V2/V3` xuống cuối `survey.css`.**

Agent phải **refactor hoặc rewrite sạch `survey.css`** thành một design system duy nhất.

---

## 1.2 Quá nhiều visual signal thường thấy ở UI “AI-generated”

Source hiện tại đang sử dụng dày đặc:

- linear gradient
- radial gradient
- background grid
- glass/blur
- pill radius `999px`
- nhiều shadow khác nhau
- floating cards
- gradient selected state
- gradient CTA
- cyan accent
- decorative circles
- sparkle icon
- nhiều label uppercase
- nhiều box nằm trong box

Từng yếu tố riêng lẻ không sai.

Sai ở chỗ **chúng xuất hiện đồng thời và lặp lại trên gần như mọi màn hình**.

Điều này tạo cảm giác:

> “mọi component đều đang cố premium cùng lúc.”

Một giao diện executive-grade phải làm ngược lại:

> **80–90% UI phải bình tĩnh. Chỉ 10–20% điểm nhấn.**

---

# 2. NON-NEGOTIABLE CONSTRAINTS

## 2.1 LANDING PAGE LÀ IMMUTABLE

Không được làm thay đổi visual hoặc layout của landing page hiện tại.

### Không chỉnh

- `src/features/landing/LandingPage.tsx`
- `src/features/landing/landing.css`
- landing assets
- desktop landing layout
- mobile landing layout

Trừ trường hợp compile bắt buộc, nhưng không được tạo visual regression.

---

## 2.2 KHÔNG THAY ĐỔI NỘI DUNG SURVEY

Giữ **100% nội dung hiện tại** trong:

`src/features/survey/surveyData.ts`

Bao gồm:

- Intro copy
- 18 câu Part 1
- 6 câu Part 2
- options
- consent copy
- report copy
- CEO Roundtable copy

### Cấm

- paraphrase
- rút gọn
- đổi nghĩa
- sửa wording vì thấy “hay hơn”
- tự thêm câu hỏi
- bỏ câu hỏi
- đổi thứ tự câu hỏi

UI có thể thay đổi cách trình bày, nhưng text phải đầy đủ.

---

## 2.3 KHÔNG THAY ĐỔI BUSINESS LOGIC

Giữ nguyên behavior hiện tại:

- answer state
- `otherAnswers`
- validation
- first unanswered question
- Part 1 → Part 2
- skip Part 2
- consent
- contact validation
- roundtable registration state
- report mode
- score calculation
- radar data
- back to landing
- result generation flow

Không chỉnh `surveyScoring.ts` trừ khi bắt buộc do refactor type/interface.

---

## 2.4 KHÔNG CÀI THÊM UI LIBRARY

Không thêm:

- Material UI
- Ant Design
- Chakra
- shadcn chỉ để lấy style
- Bootstrap
- component library mới

Dùng:

- React hiện tại
- CSS
- Lucide hiện tại
- Framer Motion **chỉ khi thực sự cần**

---

# 3. DESIGN PRINCIPLE — “QUIET CONFIDENCE”

Visual mới phải dựa trên 6 nguyên tắc:

### 1. Typography trước decoration

Heading, body, label và spacing phải tạo hierarchy trước khi dùng card/shadow.

### 2. Flat surfaces trước floating surfaces

Không biến mọi section thành card.

### 3. Border trước shadow

Nếu có thể phân nhóm bằng whitespace hoặc border `1px`, không dùng shadow.

### 4. Solid color trước gradient

CTA, selection, nav active nên dùng solid color.

### 5. One accent at a time

Trong một component chỉ nên có một màu accent chính.

### 6. Interaction phải phục vụ task

Hover/motion chỉ được dùng để:

- xác nhận trạng thái
- tăng affordance
- làm navigation mượt hơn
- giảm cognitive load

Không animation chỉ để “xịn”.

---

# 4. ANTI-AI VISUAL BLACKLIST

## BẮT BUỘC LOẠI BỎ khỏi core survey UI

### Background

- radial gradient trang
- futuristic grid background
- neon glow
- decorative blobs
- decorative orbit/circle vô nghĩa

### Surface

- glassmorphism header
- glassmorphism sticky action bar
- `backdrop-filter` cho core navigation
- card trong card trong card

### Buttons

- glossy gradient CTA
- inset highlight
- pill button cho mọi CTA
- shadow đỏ lớn dưới CTA

### Cards

- mỗi câu hỏi là một floating card có shadow
- hover làm cả card bay lên
- mọi section đều radius 20–28px

### Accent

- cyan dùng làm chữ emphasis chính
- cyan + navy + red cùng tranh attention
- green/blue/red xuất hiện liên tục chỉ để “có màu”

### Iconography

- Sparkles icon
- icon cho mọi label
- icon decorative không mang meaning

### Motion

- scale on hover
- bounce
- parallax
- shimmer
- glowing pulse
- stagger animation dày đặc
- scroll animation trên từng card

---

# 5. DESIGN TOKENS — SINGLE SOURCE OF TRUTH

Tạo tokens ngay đầu `survey.css`.

```css
.survey-page {
  --survey-bg: #f5f6f7;
  --survey-surface: #ffffff;
  --survey-surface-subtle: #f8f9fa;

  --survey-ink: #07111f;
  --survey-ink-secondary: #46515f;
  --survey-ink-muted: #6d7682;

  --survey-navy: #00132f;
  --survey-blue: #144eaf;
  --survey-red: #e9252b;
  --survey-green: #087a55;

  --survey-border: #dfe3e8;
  --survey-border-strong: #c9d0d8;

  --survey-radius-sm: 8px;
  --survey-radius-md: 12px;
  --survey-radius-lg: 16px;

  --survey-shadow-floating: 0 12px 32px rgba(7, 17, 31, 0.10);
  --survey-shadow-modal: 0 24px 64px rgba(7, 17, 31, 0.18);

  --survey-content: 1120px;
  --survey-reading: 760px;
}
```

## Radius rules

### Allowed

- `8px`
- `12px`
- `16px`
- modal/bottom sheet maximum `20px`

### `999px` chỉ được dùng cho

- tiny status badge thực sự là badge
- progress capsule cực nhỏ nếu cần

### Không dùng `999px` cho

- header
- main CTA
- secondary CTA
- sticky footer
- consent option
- nav container

---

# 6. SPACING SYSTEM

Chỉ dùng spacing scale:

```text
4
8
12
16
24
32
40
48
64
80
96
```

Không để random:

- 13
- 14
- 18
- 22
- 26
- 28
- 34
- 46
- 54
- 72

trừ trường hợp typography/optical adjustment thực sự cần.

## Desktop page gutter

```text
>= 1280px: 32px
1024–1279px: 24px
< 768px: 16px
< 390px: 12px
```

---

# 7. TYPOGRAPHY

Giữ `Inter Variable` đang có.

Không import font mới.

## Display

Desktop:

```css
font-size: clamp(40px, 4vw, 56px);
line-height: 1.02;
font-weight: 600;
letter-spacing: -0.035em;
```

Mobile:

```css
font-size: clamp(32px, 9vw, 42px);
line-height: 1.04;
font-weight: 600;
letter-spacing: -0.03em;
```

## Section heading

```text
Desktop: 28–32px / 1.15 / 600
Mobile: 24–28px / 1.18 / 600
```

## Question

```text
Desktop: 20–22px / 1.45 / 600
Mobile: 18–20px / 1.45 / 600
```

## Body

```text
Desktop: 15–16px / 1.65
Mobile: 15px / 1.6
```

## Label

```text
12–13px
500–650
```

### Không dùng uppercase trên mọi microcopy

Uppercase chỉ dành cho:

- PHẦN 1
- PHẦN 2
- category rất ngắn

Không uppercase status dài.

---

# 8. PAGE BACKGROUND

## Desktop

Dùng **một nền neutral duy nhất**.

```css
background: var(--survey-bg);
```

### Cấm

```css
radial-gradient(...)
linear-gradient(...) /* dùng làm page background */
background-size: 40px 40px;
```

Không grid.

Không glow.

Không cyan wash.

---

# 9. SURVEY HEADER — REDESIGN

## Current problem

Header hiện tại là:

- floating capsule
- radius `999px`
- blur
- shadow
- nhiều border
- giống AI/SaaS floating toolbar

## New direction

Header phải giống **service/product navigation**.

### Desktop

- sticky top `0`
- full-width white surface
- `border-bottom: 1px solid var(--survey-border)`
- không shadow hoặc shadow cực nhẹ khi scrolled
- không glass
- không capsule

Bên trong:

```text
[← Trang chủ]   [CWI logo]      [Phần / trạng thái]      [Danh sách câu hỏi]
```

Inner max-width:

```text
1120px
```

Height:

```text
64–68px
```

### Mobile

```text
[←] [CWI logo] [Part 1 · 6/18] [☰]
```

- header height 56–60px
- hide secondary descriptive line nếu thiếu chỗ
- không floating bên trong viewport
- không bo nguyên thanh header

---

# 10. INTRO SCREEN — EXECUTIVE EDITORIAL MODE

## Current problem

Intro đang có:

- dark gradient brand panel
- radial accent
- circle decoration
- sparkle icon
- logo nằm trong một white mini-card
- multiple floating cards
- italic cyan emphasis
- shadow lớn

Kết quả nhìn giống AI-generated campaign page.

## New desktop composition

```text
┌──────────────────────────────────────────────────────┐
│ Left identity rail       │ Main editorial content    │
│                          │                           │
│ CWI logo                 │ Part 1/3                  │
│ Research 2026Q3          │ Năng lực Lãnh đạo         │
│                          │ cho Tăng trưởng            │
│ short context            │                           │
│                          │ paragraphs...              │
│ Privacy note             │                           │
│                          │ [Report part 1]            │
│                          │ [Report part 2]            │
│                          │                           │
│                          │ [Bắt đầu khảo sát →]       │
└──────────────────────────────────────────────────────┘
```

### Left rail

Có thể giữ `.survey-brand-panel`, nhưng redesign thành:

- solid navy hoặc white
- **không gradient**
- không Sparkles
- không decorative circle
- radius `16px`
- không shadow hoặc shadow rất nhẹ
- logo không nằm trong box bo 16–22px nếu không cần
- privacy note là plain text + lock icon nhỏ
- không card con có glass background

### Main intro

- white
- radius 16px
- hoặc thậm chí **không cần shadow**
- generous whitespace
- title dark navy
- bỏ cyan italic emphasis
- nếu cần emphasis: dùng font weight hoặc line break

Ví dụ:

```text
Năng lực Lãnh đạo
cho Tăng trưởng
```

Có thể dùng `color: var(--survey-red)` cho **một từ rất nhỏ** nếu brand yêu cầu, nhưng không cyan italic.

---

# 11. REPORT PART 1 / PART 2 BLOCKS TRONG INTRO

## Current

Hai card riêng có gradient background.

## New

Biến thành **editorial comparison rows**.

Desktop:

```text
01   Khảo sát và Báo cáo Khuyết danh
     • ...
     • ...

────────────────────────────────────

02   Khảo sát Định danh và Báo cáo Riêng tư
     • ...
     • ...
```

Không cần shadow.

Không cần gradient.

Nếu muốn 2-column, dùng border divider ở giữa, không dùng card nổi.

---

# 12. QUESTION PAGE — CORE UX REARCHITECTURE

Đây là phần quan trọng nhất.

## Current problem

Hiện tại:

- hero là card
- progress là card trong card
- notice là card
- rail là card
- mỗi question là card
- action là floating glass pill

Quá nhiều container tạo hierarchy giả.

## New hierarchy

Desktop:

```text
Page header
────────────────────────────────────────────────────────

Survey intro / progress overview

┌───────────────┬────────────────────────────────────────┐
│ Question nav  │ Main questionnaire                     │
│               │                                        │
│ 01 ✓          │ Question 01                            │
│ 02 ✓          │ answer                                 │
│ 03            │ ─────────────────────────────────────  │
│ ...           │ Question 02                            │
│               │ answer                                 │
│               │ ─────────────────────────────────────  │
│               │ Question 03                            │
└───────────────┴────────────────────────────────────────┘
```

### Key rule

**Không render mỗi question thành một floating card.**

Thay vào đó:

- một main white survey sheet
- từng question là một section
- ngăn cách bằng border bottom
- whitespace lớn
- active question có subtle left indicator

---

# 13. QUESTION HERO

Simplify mạnh.

## Desktop

```text
PHẦN 1 · KHẢO SÁT KHUYẾT DANH

Khảo sát Năng lực Lãnh đạo

18 câu hỏi · 11/18 hoàn tất
━━━━━━━━━━━━━━━━━━━━ 61%
```

Không cần một progress card 208px ở bên phải.

Có thể dùng layout 2-column nhẹ:

- title bên trái
- count + progress nhỏ bên phải

Nhưng **không wrap progress vào floating card**.

## Height

Hero không nên cao quá `220px`.

Mục tiêu: user nhìn thấy câu hỏi sớm ngay trong first viewport.

---

# 14. QUESTION INTRO / NOTE

Current “Lưu ý” đang là một card nhỏ.

New:

- border-left 2px blue
- plain text
- background transparent hoặc very subtle
- radius 0 hoặc 8px
- không badge pill

Ví dụ:

```text
│ Lưu ý
│ [full intro text]
```

---

# 15. DESKTOP PROGRESS RAIL

Giữ ý tưởng progress rail vì survey dài và rất hữu ích.

## New styling

- width: `220–240px`
- sticky
- background transparent hoặc white
- không shadow
- radius tối đa 12px nếu dùng white panel
- list compact
- chỉ active item mới có surface

### Item

```text
01   Doanh nghiệp của chúng tôi...
     ✓
```

States:

### Default

- number muted
- text secondary

### Active

- 2px left border blue
- text navy
- background `#f5f8ff`

### Answered

- check green
- **không đổi cả số thành blue filled circle**
- không dùng quá nhiều color fill

---

# 16. QUESTION BLOCK

Refactor visual của `.survey-question-card`.

Tên class có thể giữ để giảm code impact, nhưng nó **không được trông như card**.

## Desktop

```css
.survey-question-card {
  position: relative;
  padding: 32px 0 40px;
  border: 0;
  border-bottom: 1px solid var(--survey-border);
  border-radius: 0;
  background: transparent;
  box-shadow: none;
}
```

Main survey stack có white surface:

```css
.survey-question-stack {
  padding: 0 40px;
  border: 1px solid var(--survey-border);
  border-radius: 16px;
  background: #fff;
}
```

Last child bỏ border bottom.

### Active

Có thể thêm:

```css
.survey-question-card::before {
  /* only active/focus-within */
  left: -40px;
  width: 3px;
}
```

Không scale.

Không shadow.

---

# 17. QUESTION META

## Current

`PHẦN 1` bên trái + `Đã trả lời/Câu X` pill bên phải.

## New

Simplify thành:

```text
CÂU 01 · PHẦN 1                         Đã trả lời ✓
```

Hoặc:

```text
01
Question title...
```

### Status

`Đã trả lời ✓`

- green text
- icon 14px
- **không background pill**
- không blue pill

Nếu unanswered:

- không cần ghi “Câu 1” lần nữa nếu heading đã có số

Tránh duplicate information.

---

# 18. LIKERT — REDESIGN

Đây phải là một trong các interaction đẹp nhất.

## Desktop

5 lựa chọn nằm trên một hàng.

Không dùng gradient.

Không shadow.

### Cell

```text
┌────────┐
│   1    │
└────────┘
```

Default:

- white
- border neutral
- radius 10–12px
- height 52–56px

Hover:

- border blue
- subtle blue 3–4% background

Selected:

- solid navy hoặc blue
- white text
- no gradient
- no shadow

### Labels

Bên dưới hoặc phía trên scale:

```text
1
Không đồng ý

                  5
                  Hoàn toàn đồng ý
```

Không cần lặp legend cho từng button.

## Mobile

Giữ 5 option cùng một hàng nếu viewport >=360px.

- gap 6–8px
- min touch target 44px
- selected rõ
- legend ở dưới, 2 đầu trái/phải

Không horizontal scroll.

---

# 19. MCQ — REDESIGN

## Current issue

Có lúc options bị chia 2 columns trên desktop.

Đối với survey executive có câu dài, việc scan 2 cột làm tăng cognitive load.

## Rule

**Default: SINGLE COLUMN.**

Chỉ cho 2-column khi:

- tất cả option rất ngắn
- số option >= 6
- desktop >= 1200
- hierarchy vẫn đọc theo row rõ

Với source hiện tại, ưu tiên **single column**.

## Option

```text
○  Thiếu năng lực quản lý
```

- min height 52px
- `padding: 14px 16px`
- radius 10–12px
- border neutral
- no shadow

Selected:

- border blue 1.5–2px
- background subtle blue
- radio dot solid blue

Hover:

- border darker
- no translate

---

# 20. “OTHER” INPUT

Khi chọn `Mục khác:`:

- input xuất hiện ngay dưới option
- animate `opacity + height` nhẹ
- không pop/fade mạnh
- focus input tự động nếu implementation thuận tiện
- giữ state hiện tại

Input:

- height 48–52px
- radius 10px
- solid white
- no shadow normally
- focus ring 3px light blue

---

# 21. TEXT INPUT

Website company:

- label rõ
- optional helper text nếu source đã có; **không tự thêm nội dung mới**
- URL input full width
- no floating label
- no overly rounded field

---

# 22. DESKTOP BOTTOM ACTIONS

## Current

`survey-sticky-actions` là một floating glass capsule fixed bottom.

Đây là một trong các yếu tố tạo “AI UI” mạnh nhất.

## Desktop new behavior

### Preferred

**Không fixed floating bar.**

Dùng action row ở cuối survey sheet:

```text
← Quay lại                           Tiếp tục →
```

Có progress nhỏ phía trên hoặc bên trái.

User vẫn có rail để biết tiến độ.

### Nếu cần persistent CTA

Chỉ dùng sticky footer **bên trong content column**, không glass:

- white
- border-top
- radius 0 hoặc 12px
- no blur
- no pill
- no floating shadow

---

# 23. MOBILE PROGRESS UX

Current horizontal list 18 circular number buttons tạo cảm giác noisy.

## New mobile top progress

```text
Phần 1                              11 / 18
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Câu 12                              [Danh sách]
```

### Interaction

`Danh sách` mở drawer/bottom sheet.

Không cần render 18 circle buttons ngang trên màn hình chính.

Lý do:

- giảm clutter
- tiết kiệm vertical space
- dễ scan
- trông trưởng thành hơn
- không tạo “game/progress app” feel

Có thể giữ `MobileQuestionNav` component nhưng đổi UX/markup.

---

# 24. MOBILE QUESTION DRAWER

Bottom sheet:

- white
- radius top `20px`
- drag handle subtle
- max-height 78dvh
- no glass
- no huge shadow
- item full-width
- question number + truncated question + answered check

Active item:

- left accent
- subtle background

Tap → close sheet → smooth scroll đúng câu.

---

# 25. MOBILE QUESTION LAYOUT

Mobile không được chỉ “co desktop xuống”.

## Rules

- page gutter 16px
- main survey surface có thể edge-to-edge gần full width
- question stack padding 18–20px
- question vertical spacing 28–32px
- body text 15px+
- question 18–20px
- CTA min height 48px
- tap target >=44px
- no text below 12px
- no horizontal scroll

---

# 26. MOBILE ACTION BAR

Mobile được phép sticky bottom vì ergonomic.

Nhưng phải giống product toolbar, không giống glass capsule.

```text
┌──────────────────────────────────┐
│ ←             Tiếp tục Phần 2 → │
└──────────────────────────────────┘
```

- left/right: `12px`
- bottom: safe-area
- white solid
- border
- radius `14px`
- shadow dùng duy nhất `--survey-shadow-floating`
- no blur
- no gradient

Secondary back button có thể icon-only ở <=390px.

---

# 27. PRIMARY BUTTON SYSTEM

## Primary

Brand red có thể giữ vì landing đang dùng red CTA.

Nhưng:

```css
background: var(--survey-red);
color: #fff;
border: 1px solid var(--survey-red);
border-radius: 10px;
box-shadow: none;
```

Hover:

- darken nhẹ
- không translate nếu không cần

Active:

- darken thêm
- `transform: translateY(1px)` tối đa nếu muốn tactile

### Cấm

- gradient
- glossy inset
- red glow
- huge shadow

---

# 28. SECONDARY BUTTON

```css
background: #fff;
color: var(--survey-navy);
border: 1px solid var(--survey-border-strong);
border-radius: 10px;
```

Hover:

- light neutral background

Không black heavy border.

---

# 29. CONTACT SCREEN

Contact/consent screen phải giống secure executive form.

## Layout

Desktop:

- max-width 760px
- white surface
- heading + thank-you text
- privacy
- fields
- action

Không cần floating card + nested blue privacy card + pills.

### Fields

2 columns desktop, 1 column mobile.

### Labels

Label nằm trên input.

### Error

Error nằm gần field hoặc group liên quan.

Không chỉ show chung ở cuối nếu có thể map error chính xác.

**Không thay logic validation**, chỉ cải thiện presentation.

---

# 30. PRIVACY / CONSENT

Đây là nội dung quan trọng về trust.

## New visual

Privacy copy:

- neutral subtle surface
- small lock/shield icon 18px
- border-left/navy accent hoặc border neutral
- no blue-tinted rounded marketing card

Consent:

```text
◉ Đồng ý
○ Không đồng ý
```

Không dùng 2 pill lớn.

Dùng radio rows chuẩn.

Nếu `Không đồng ý`:

- show warning dưới consent
- plain red/brown text
- CTA skip rõ ràng

---

# 31. LOADING SCREEN

## Current

Spinner 76px + 4 little cards.

## New

Executive/data processing feel:

```text
Đang tạo Báo cáo Riêng tư

━━━━━━━━━━━━━━━━━━━━

✓ Tổng hợp câu trả lời
✓ Đối chiếu dữ liệu
• Phân tích các nhóm năng lực
  Tạo báo cáo
```

### Animation

- spinner nhỏ 28–36px hoặc progress line
- step active có subtle opacity transition
- completed step có check
- no 4 floating boxes
- no glow

Giữ timing logic hiện tại.

---

# 32. RESULT SCREEN

Result phải trông như **research report preview**, không phải AI analytics dashboard.

## Principle

Editorial report > SaaS dashboard.

### Hierarchy

1. Report title
2. context/note
3. key scores
4. analysis
5. radar/domain
6. private sections
7. actions

---

# 33. MARKET DEMO

Current:

- dark gradient
- fake futuristic grid chart
- cyan curve
- red glowing dots

Đây là AI-dashboard visual rất rõ.

## New

Có 2 lựa chọn:

### Option A — Editorial data panel

- white
- border
- heading left
- mini chart right
- navy/blue only
- red chỉ highlight một data point

### Option B — Solid navy report cover block

- solid navy
- no gradient
- no grid
- chart đơn giản
- no glowing dots

Ưu tiên **Option A** nếu muốn modern European digital report.

---

# 34. SCORE CARDS

Không tạo 2 giant “metric cards” floating.

Có thể dùng một shared metrics row:

```text
Leadership Capacity           Scale Readiness
78                            72
━━━━━━━━━━━━━━                ━━━━━━━━━━━━━
```

Divider dọc/giữa.

White surface chung.

Không mỗi metric một card.

---

# 35. RADAR + DOMAIN BARS

Giữ logic hiện tại.

Visual:

- chart line blue
- fill blue opacity thấp
- dot navy hoặc red rất hạn chế
- grid neutral gray
- no gradient bars

Domain bars:

```css
track: #edf0f3;
fill: var(--survey-blue);
```

Không:

```css
linear-gradient(90deg, blue, cyan)
```

---

# 36. PRIVATE REPORT SECTIONS

Current deep analysis đang là grid card.

New:

### Desktop

5 rows/sections đánh số:

```text
01  Cơ chế ra quyết định
    [answer]
    [analysis copy]

────────────────────────────

02  Độ sẵn sàng mở rộng
...
```

Hoặc 2-column editorial layout nếu content ngắn.

Không render 5 identical rounded cards.

---

# 37. CEO ROUNDTABLE MODAL

Modal được phép có visual emphasis cao hơn survey.

Nhưng vẫn restrained.

## Desktop

2 columns:

- left event identity
- right registration

### Left

- solid navy
- no gradient
- no circles
- no glass
- headline white
- meta rows plain
- no meta pills

### Right

- white
- form
- primary CTA
- secondary CTA

Modal radius max 20px.

Shadow dùng `--survey-shadow-modal`.

No scale-in.

Animation:

```text
opacity 0 → 1
translateY(8px) → 0
200ms
```

---

# 38. ICONOGRAPHY

Use Lucide sparingly.

Allowed semantic icons:

- ArrowLeft
- ArrowRight
- Check
- AlertCircle
- LockKeyhole / Shield
- Menu
- Download
- X

Remove decorative usage:

- Sparkles
- generic chart icon chỉ để lấp khoảng trống
- icon trên highlight cards nếu highlight cards bị bỏ

---

# 39. MOTION SYSTEM

Motion phải “quiet”.

## Global

```text
Fast interaction: 120–160ms
Standard: 180–220ms
Screen enter: 220–280ms
```

Easing:

```css
cubic-bezier(0.2, 0.8, 0.2, 1)
```

## Allowed

- opacity
- translateY max 8px
- height reveal cho Other input
- drawer slide
- modal fade/translate
- progress width transition

## Forbidden

- scale hover
- bounce
- rotate decoration
- glow
- shimmer
- text reveal từng chữ
- floating cards
- parallax

Respect:

```css
@media (prefers-reduced-motion: reduce)
```

---

# 40. FOCUS / ACCESSIBILITY

Không hy sinh accessibility để đẹp.

## Required

- visible `:focus-visible`
- contrast text tối thiểu tốt
- radio native vẫn accessible
- label click được
- aria labels giữ nguyên
- tab order logic
- drawer/modal focus behavior không bị phá
- touch target >=44px
- error có `role="alert"` nơi phù hợp
- disabled state vẫn đọc rõ

Focus ring:

```css
outline: 3px solid rgba(20, 78, 175, 0.20);
outline-offset: 2px;
```

---

# 41. RESPONSIVE BREAKPOINT STRATEGY

Không tiếp tục append nhiều media query trùng nhau.

Dùng tối đa 3 main ranges:

## Desktop

```text
>= 1024px
```

## Tablet

```text
768px – 1023px
```

## Mobile

```text
<= 767px
```

Optional micro breakpoint:

```text
<= 390px
```

### Không tạo 2 block riêng cho cùng `max-width: 980px`

### Không tạo 2 block riêng cho cùng `max-width: 640px`

Mỗi breakpoint nên được gom thành **một section duy nhất** trong CSS.

---

# 42. DESKTOP LAYOUT TARGET

At 1440px:

```text
page max width: 1120px
rail: 232px
gap: 40–48px
main: remaining
reading measure: <=760px
```

Main question content không kéo text full 1000px.

---

# 43. TABLET TARGET

At 768–1023px:

- hide left rail
- show compact progress header
- main sheet full width
- options single column
- no desktop fixed action
- sticky mobile/tablet bottom action acceptable
- intro left brand rail moves above content

---

# 44. MOBILE TARGET

Test tối thiểu:

- 430×932
- 390×844
- 360×800

Mỗi màn hình phải:

- không horizontal overflow
- header không wrap xấu
- title không orphan kỳ
- 5 Likert button không vỡ
- long MCQ text không sát edge
- sticky CTA không che option cuối
- drawer không vượt viewport
- modal scroll đúng
- safe-area hoạt động

---

# 45. COMPONENT-SPECIFIC REFACTOR

## `SurveyChrome.tsx`

Allowed:

- thay markup header
- thêm inner wrapper
- simplify meta
- đổi button arrangement

Preserve callbacks.

---

## `SurveyQuestionPage.tsx`

Allowed:

- simplify hero
- merge progress card vào hero
- redesign note
- redesign mobile progress
- restructure question sheet
- desktop/mobile actions khác presentation

Preserve:

- observer
- active question
- callbacks
- questions
- validation
- progress calculation

---

## `QuestionCard.tsx`

Allowed:

- rename visual hierarchy
- remove duplicate question number display
- change legend layout
- improve MCQ semantic structure
- improve Other input reveal

Preserve:

- `onAnswer`
- `onOtherAnswer`
- radio values
- answer state
- Other logic

---

## `SurveyNavigation.tsx`

Allowed:

- redesign desktop rail
- redesign MobileQuestionNav thành compact progress control
- redesign drawer

Preserve jump behavior.

---

## `SurveyScreens.tsx`

Allowed:

- redesign Intro
- Contact
- Loading
- Results
- Modal
- remove decorative Sparkles import
- simplify highlight components

Preserve all copy and callbacks.

---

# 46. CSS ARCHITECTURE

Rewrite `survey.css` theo thứ tự:

```text
1. Tokens
2. Page/reset scoped to .survey-page
3. Shared typography
4. Shared buttons/inputs/status
5. Header
6. Intro
7. Question layout
8. Navigation
9. Question controls
10. Contact
11. Loading
12. Result
13. Modal
14. Tablet
15. Mobile
16. Reduced motion
17. Print
```

Không rải media query giữa từng component.

---

# 47. REMOVE LEGACY CSS

Sau redesign, xóa toàn bộ rule không còn dùng.

Không để:

- duplicate selector
- dead CSS
- old premium pass
- old radial background
- old glass styles
- old 999px CTA
- old hover transform
- old desktop/mobile overrides không còn relevance

Mục tiêu không phải “override để nhìn đúng”.

Mục tiêu là:

> **source CSS đọc từ trên xuống đã đúng.**

---

# 48. QUANTITATIVE CLEANUP TARGETS

Không phải hard build constraint, nhưng dùng để tự kiểm tra.

Sau refactor:

### `radial-gradient`

```text
Target: 0
```

### `backdrop-filter`

```text
Target: 0
```

### `border-radius: 999px`

```text
Target: <= 2 occurrences
```

Chỉ tiny badge nếu thực sự cần.

### Gradient

```text
Core UI surfaces/buttons: 0
Data visualization: tối đa 1 nếu thật sự cần
```

### Box shadow

Chỉ dùng 2 semantic shadow token:

- floating mobile toolbar
- modal

Các component khác ưu tiên border/whitespace.

---

# 49. VISUAL HIERARCHY CHECK

Khi nhìn screenshot ở 50% zoom, phải phân biệt ngay:

1. current phase
2. survey title
3. current question
4. answer options
5. progress
6. continue action

Nếu eye bị hút vào:

- background
- glow
- radius
- card shell
- cyan decoration
- shadow

thì design chưa đạt.

---

# 50. “EUROPEAN-GRADE” QUALITY BAR

Không hiểu “European” là beige/minimal hoặc serif.

Ở đây nó có nghĩa:

- restrained
- editorial hierarchy
- functional
- less decoration
- confident whitespace
- deliberate alignment
- typography-led
- consistent system
- high trust
- no visual gimmick

CEO phải cảm thấy:

> “Đây là một nghiên cứu nghiêm túc được thiết kế tốt.”

Không phải:

> “Đây là một template AI đẹp mắt.”

---

# 51. UX IMPROVEMENTS WITHOUT CHANGING LOGIC

Agent được phép cải thiện:

- auto-scroll tới câu chưa trả lời
- focus visible
- active question indication
- progress clarity
- sticky mobile continue
- drawer scanability
- Other input reveal
- error placement
- mobile safe-area
- scroll margin
- semantic states

Nhưng không thay journey/business rules.

---

# 52. ERROR STATES

Validation cần rõ nhưng không dramatic.

### Question error

Hiện gần khu vực action:

```text
! Vui lòng hoàn tất Câu 12 trước khi chuyển sang Phần 2.
```

- red icon nhỏ
- text 14px
- light red background nếu cần
- radius 8px
- no huge alert card

### Form error

Hiện dưới field/group liên quan nếu có thể.

---

# 53. ANSWERED STATE

Không tô cả card.

Chỉ cần:

- `✓ Đã trả lời`
- subtle green
- left rail check
- maybe border-left accent khi active

Answered state phải giúp orientation, không trở thành decoration.

---

# 54. PROGRESS BEHAVIOR

Progress phải xuất hiện nhất quán ở:

- question header
- navigation
- mobile compact bar

Nhưng cùng một thông tin không được duplicate 3 lần trên cùng viewport.

### Desktop

- hero progress + rail
- không cần sticky footer progress

### Mobile

- compact top progress + sticky CTA
- drawer chứa item states

---

# 55. PRINT / RESULT PDF

Giữ print behavior hiện tại.

Trong `@media print`:

- hide nav
- hide action buttons
- white background
- remove shadows
- result sections tránh break xấu
- chart visible
- text black/navy
- full width print-safe

Không làm print CSS ảnh hưởng screen.

---

# 56. PERFORMANCE

Không thêm:

- heavy image background
- video
- canvas animation
- large blur
- continuous animation

Survey phải feel instant.

---

# 57. DO NOT TOUCH BUILD TOOLING TO “FIX UI”

Không chỉnh:

- Vite config
- TS config
- package version
- package-lock

chỉ vì UI redesign.

Nếu build có lỗi pre-existing unrelated với survey, report riêng.

Không tự ý sửa toolchain ngoài scope.

---

# 58. IMPLEMENTATION ORDER

Agent thực hiện theo đúng thứ tự:

## Pass 1 — Audit

- map component → CSS
- identify unused selectors
- identify duplicate selectors
- identify legacy overrides

## Pass 2 — CSS reset

- backup mentally existing visual
- rewrite survey tokens
- remove page grid/glow/glass
- normalize typography/spacing

## Pass 3 — Header + Intro

- implement flat service header
- editorial intro
- simplify report part blocks

## Pass 4 — Core survey

- question hero
- rail
- survey sheet
- Likert
- MCQ
- Other
- errors
- actions

## Pass 5 — Mobile

- compact progress
- drawer
- sticky CTA
- safe area
- small viewport

## Pass 6 — Contact / Loading / Result / Modal

- bring all remaining screens into same system

## Pass 7 — Cleanup

- delete old CSS
- no override patch
- remove unused imports/components

## Pass 8 — QA

- desktop
- tablet
- mobile
- keyboard
- long text
- validation
- print

---

# 59. SCREENSHOT QA MATRIX

Agent phải tự kiểm tra tối thiểu:

## Desktop

- 1440×900
- 1366×768
- 1280×800

## Tablet

- 1024×768
- 768×1024

## Mobile

- 430×932
- 390×844
- 360×800

Check các screen:

- Intro
- Part 1 đầu trang
- Part 1 giữa survey
- Part 1 validation error
- Part 2
- Other input
- Contact Part 1
- Contact private + consent yes
- consent no
- Loading
- Result Part 1
- Result private
- CEO Roundtable Modal
- drawer mobile

---

# 60. FUNCTIONAL REGRESSION CHECKLIST

Phải verify:

- [ ] Landing CTA vẫn mở Survey
- [ ] Back Home vẫn hoạt động
- [ ] Part 1 có đủ 18 câu
- [ ] Part 2 có đủ 6 câu
- [ ] Không mất option
- [ ] Likert lưu đúng 1–5
- [ ] MCQ lưu đúng string
- [ ] `Mục khác:` vẫn yêu cầu text
- [ ] Question rail jump đúng
- [ ] Active question update khi scroll
- [ ] Validation jump tới câu thiếu
- [ ] Part 1 hoàn tất mới đi Part 2
- [ ] Part 2 chưa trả lời có thể về report Part 1 theo logic hiện tại
- [ ] Part 2 bắt đầu rồi thì validation giữ logic hiện tại
- [ ] Consent yes/no đúng
- [ ] Email validation đúng
- [ ] Roundtable modal đúng
- [ ] Loading timing đúng
- [ ] Result score đúng
- [ ] Radar render đúng
- [ ] Print/PDF button đúng
- [ ] Mobile không overflow
- [ ] Keyboard navigation hoạt động
- [ ] Reduced motion hoạt động

---

# 61. VISUAL ACCEPTANCE CHECKLIST

- [ ] Không còn page radial gradient
- [ ] Không còn page grid background
- [ ] Không còn glass header
- [ ] Không còn glass sticky toolbar
- [ ] Main CTA không gradient
- [ ] Likert selected không gradient
- [ ] Progress bar không cyan gradient
- [ ] Không còn Sparkles decorative icon
- [ ] Không còn mọi question là floating shadow card
- [ ] Không còn mọi section radius 20–28px
- [ ] Không còn pill button khắp nơi
- [ ] MCQ dễ scan
- [ ] Question text có readable measure
- [ ] Desktop nhìn như research/product experience
- [ ] Mobile nhìn native, clean, không “desktop compressed”
- [ ] Result nhìn như report, không như AI dashboard
- [ ] Toàn bộ Survey có cùng một visual language

---

# 62. DEFINITION OF DONE

Chỉ được xem là hoàn thành khi:

### Design

- giao diện có hierarchy rõ
- calm/executive
- không còn AI-template feel
- visual consistency desktop/mobile
- không over-design

### UX

- survey dài nhưng không gây mệt
- progress dễ hiểu
- navigation dễ dùng
- answer state rõ
- mobile ergonomic
- error dễ sửa

### Code

- `survey.css` không còn legacy override pass
- responsive rules được gom
- class không còn dead/duplicate vô nghĩa
- không thêm dependency
- không sửa landing
- không sửa survey content
- không sửa scoring/business logic

### Regression

- mọi flow cũ vẫn chạy
- mọi câu hỏi vẫn đầy đủ
- mọi breakpoint ổn

---

# 63. FINAL INSTRUCTION TO AGENT

**Hãy trực tiếp sửa code, không chỉ đưa recommendation.**

Ưu tiên **refactor đúng kiến trúc** thay vì append CSS override.

Nếu phải lựa chọn giữa:

1. thêm hiệu ứng để giao diện “xịn hơn”
2. giảm visual noise để hierarchy tốt hơn

→ luôn chọn **(2)**.

Nếu phải lựa chọn giữa:

1. một component nhìn nổi bật riêng lẻ
2. toàn bộ survey trông đồng nhất

→ luôn chọn **(2)**.

Nếu một style khiến giao diện “trông như AI design”, hãy bỏ nó dù style đó đang trendy.

Mục tiêu cuối:

> **CWI Survey phải giống một digital research product được một European design team có kinh nghiệm thiết kế — không phải một collection của gradient, glass, pill và floating cards.**

---

# 64. IMPORTANT: DO NOT STOP AT CSS

Nếu markup hiện tại khiến design không thể đạt quality bar, agent **được phép refactor JSX trong `src/features/survey/`**.

Không được dùng lý do “giữ HTML hiện tại” để tiếp tục patch CSS.

Tuy nhiên mọi refactor phải:

- giữ callback
- giữ state
- giữ data
- giữ logic
- giữ nội dung
- giữ accessibility hoặc cải thiện nó
- không ảnh hưởng landing

---

# 65. HANDOFF OUTPUT EXPECTED FROM AGENT

Sau khi sửa xong, agent phải trả lại:

1. Danh sách file đã sửa
2. Tóm tắt kiến trúc UI mới
3. Các legacy style đã xóa
4. Các component đã refactor markup
5. Desktop QA status
6. Tablet QA status
7. Mobile QA status
8. Functional regression status
9. Build/lint result
10. Các vấn đề còn lại nếu có

Không trả câu kiểu “done” mà không có kiểm chứng.
