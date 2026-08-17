# CWI SURVEY — UI/UX CONTINUATION SPEC V3
## Brand Integration, Landing Button Parity, UX Corrections & Executive Report Completion
### Implementation specification for Codex / Luna 5.6 Extra High

---

# 0. PURPOSE OF THIS SPEC

Đây là **continuation specification** cho source hiện tại sau khi Survey đã được refactor sang kiến trúc **one-question-at-a-time**.

Không redesign lại từ đầu.

Không quay về long-form survey.

Không phá những phần UX đã được cải thiện ở phiên bản hiện tại.

Mục tiêu của vòng này là đưa Survey từ:

> clean research form

thành:

> **một trải nghiệm CEO Workforce Index có branding rõ, đồng nhất hoàn toàn với Landing Page và đủ chất lượng để trở thành flagship digital research product.**

---

# 1. SOURCE OF TRUTH

## Implementation hiện tại

Audit dựa trực tiếp trên:

```text
source4(4).zip
```

Các file liên quan chính:

```text
src/features/survey/SurveyExperience.tsx
src/features/survey/SurveyChrome.tsx
src/features/survey/SurveyQuestionPage.tsx
src/features/survey/QuestionCard.tsx
src/features/survey/SurveyNavigation.tsx
src/features/survey/SurveyScreens.tsx
src/features/survey/survey.css
src/features/survey/surveyData.ts
src/features/survey/surveyScoring.ts

src/features/landing/LandingPage.tsx
src/features/landing/landing.css
src/features/landing/figmaAssets.ts
```

## Requirement cho Report

File:

```text
CWI_Survey_Wireframe(1).html
```

được xem là **functional/content requirement tổng quát cho những nội dung CEO cần nhìn thấy trong Report**.

Không yêu cầu copy visual/CSS của HTML wireframe.

Không lấy visual language cũ của wireframe làm chuẩn.

Chỉ dùng nó để xác định:

- report cần những nhóm nội dung nào;
- loại visualization nào cần có;
- CEO cần nhìn thấy insight gì;
- cấu trúc Part 1 / Part 2;
- market context;
- benchmark;
- 5 nhóm năng lực;
- private analysis.

---

# 2. CURRENT STATE — DO NOT DESTROY WHAT IS WORKING

Architecture hiện tại đã đi đúng hướng:

```text
Intro
  ↓
Part 1 — focused question mode
  ↓
Part 2 — focused question mode
  ↓
Contact
  ↓
Loading
  ↓
Report
  ↓
Roundtable invitation
```

Survey hiện render **một câu hỏi tại một thời điểm**.

Đây là architecture cần GIỮ.

## BẮT BUỘC GIỮ

- one-question-at-a-time
- focused answer experience
- current answer state
- Other answer behavior
- question drawer
- error tại câu hỏi hiện tại
- Part 1 / Part 2 data
- scoring logic
- contact logic
- consent logic
- report mode
- Roundtable nằm sau Report
- modal focus management hiện tại
- reduced-motion support
- print capability

---

# 3. ABSOLUTE NON-GOALS

Agent KHÔNG được:

- quay lại 18 câu một trang;
- redesign Landing Page;
- sửa nội dung câu hỏi;
- đổi thứ tự câu hỏi;
- đổi scoring vì mục tiêu visual;
- thêm UI framework;
- thêm chart framework lớn nếu không cần;
- thêm dependency chỉ để render radar đơn giản;
- add glassmorphism;
- add neon;
- add futuristic AI visual;
- add animation decorative;
- làm Survey thành dashboard SaaS;
- hardcode demo benchmark rồi trình bày như dữ liệu thật;
- append một block CSS override khổng lồ xuống cuối file;
- đổi visual language của Landing.

---

# 4. MAIN OBJECTIVES OF V3

Vòng này có 4 workstream.

## WORKSTREAM A — UX correctness

Fix các interaction chưa đúng semantics:

1. Next phải là sequential navigation.
2. Progress bar phải đo completion.
3. Position và completion phải được phân biệt.
4. Mobile không duplicate progress.
5. Mobile không duplicate question navigator.
6. Contact Part 1 phải quay đúng Part 1.
7. Back behavior phải coherent.
8. Final validation chỉ xảy ra khi hoàn tất Part.

---

## WORKSTREAM B — Landing → Survey brand continuity

Survey phải dùng cùng visual DNA với Landing:

- red premium CTA;
- pill primary action;
- black/navy outline CTA;
- same arrow asset;
- same CWI logo asset;
- same brand red;
- same interaction restraint;
- same premium feel.

Không copy kích thước pixel tuyệt đối của Landing.

Copy:

> **brand language**

không copy:

> **landing layout dimensions**.

---

## WORKSTREAM C — CWI brand reinforcement

CWI logo hiện không được sử dụng đủ ở các high-trust/high-value moment.

Phải reinforce tại:

- global header;
- Intro;
- Contact;
- Loading;
- Report;
- Print/PDF;
- optional Drawer;
- optional Roundtable.

Không add logo vào Question body.

---

## WORKSTREAM D — Report completion

Current Result chưa fulfill đầy đủ requirement.

Phải hoàn thiện:

- Market Context visualization;
- Market benchmark metrics;
- Leadership Capacity;
- Scale Readiness;
- 5-group visual summary;
- domain bars;
- response appendix;
- Private analysis structure;
- CWI report identity;
- print identity.

---

# 5. QUALITY BAR

Sau vòng này, cảm giác mong muốn:

```text
Landing Page
      ↓
same brand
      ↓
Survey
      ↓
same brand
      ↓
Executive Report
```

Không được có cảm giác:

```text
Premium Landing
      ↓
Generic enterprise form
      ↓
Simple HTML report
```

---

# 6. CURRENT LANDING BUTTON DNA — SOURCE OF TRUTH

Landing hiện có:

```css
.figma-button-red {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;

  color: #fff;

  background:
    linear-gradient(
      180deg,
      #e9252b 32.98%,
      #831518 158.51%
    );

  border: 0.911px solid #d73a3a;

  box-shadow:
    0 12px 38px rgba(233, 37, 43, 0.24);
}
```

Hero survey CTA:

```css
.figma-button-red.figma-hero-survey-button {
  gap: 8px;

  border:
    1px solid rgba(255, 151, 154, 0.95);

  border-radius: 999px;

  background:
    linear-gradient(
      180deg,
      #ff2d34 0%,
      #f3232b 46%,
      #d81920 100%
    );

  box-shadow:
    inset 0 1.2px 0 rgba(255,255,255,.34),
    0 18px 34px rgba(225,27,34,.20);
}
```

Landing outline button:

```css
.figma-button-outline {
  color: #000;
  background: #fff;
  border: 1px solid #000;
}
```

Arrow asset:

```ts
figmaAssets.arrow1
```

CWI logo:

```ts
figmaAssets.cwiLogo
```

Agent phải coi những thứ trên là **brand source**.

---

# 7. DO NOT DIRECTLY REUSE `.figma-*` CLASSES INSIDE SURVEY

Không nên viết:

```tsx
<button className="figma-button-red figma-hero-survey-button">
```

trong Survey.

Lý do:

- coupling Survey vào Landing CSS;
- khó maintain;
- responsive Landing có thể ảnh hưởng Survey;
- CSS ownership không rõ.

Thay vào đó, tạo **Survey-scoped implementation matching Landing visual DNA**.

Ví dụ:

```css
.survey-primary-button
```

vẫn là class riêng.

Nhưng value phải match brand.

---

# 8. ADD SURVEY ACTION TOKENS

Trong `.survey-page`, thêm:

```css
--survey-action-red-top: #ff2d34;
--survey-action-red-mid: #f3232b;
--survey-action-red-bottom: #d81920;

--survey-action-red-border: rgba(255, 151, 154, 0.95);

--survey-action-red-shadow:
  inset 0 1.2px 0 rgba(255,255,255,.34),
  0 12px 28px rgba(225,27,34,.18);

--survey-action-red-shadow-hover:
  inset 0 1.2px 0 rgba(255,255,255,.40),
  0 15px 32px rgba(225,27,34,.22);

--survey-action-outline: #00132f;
```

Không dùng magic values lặp nhiều chỗ.

---

# 9. PRIMARY BUTTON — REQUIRED REDESIGN

Current Survey:

```css
.survey-primary-button {
  background: var(--survey-red);
  border-color: var(--survey-red);
}
```

Không đủ brand continuity.

Thay bằng:

```css
.survey-primary-button {
  min-height: 52px;
  padding: 13px 24px;

  border:
    1px solid var(--survey-action-red-border);

  border-radius: 999px;

  background:
    linear-gradient(
      180deg,
      var(--survey-action-red-top) 0%,
      var(--survey-action-red-mid) 46%,
      var(--survey-action-red-bottom) 100%
    );

  color: #fff;

  box-shadow:
    var(--survey-action-red-shadow);

  font-size: 15px;
  font-weight: 650;
  line-height: 1;

  transition:
    transform 180ms cubic-bezier(.2,.8,.2,1),
    box-shadow 180ms cubic-bezier(.2,.8,.2,1),
    filter 180ms cubic-bezier(.2,.8,.2,1),
    opacity 180ms ease;
}
```

Hover desktop:

```css
.survey-primary-button:hover:not(:disabled) {
  transform: translateY(-1px);
  filter: brightness(1.015);
  box-shadow:
    var(--survey-action-red-shadow-hover);
}
```

Active:

```css
.survey-primary-button:active:not(:disabled) {
  transform: translateY(0);
}
```

---

# 10. DISABLED PRIMARY BUTTON

Không dùng:

```text
flat grey rectangle
```

vì mất toàn bộ shape/brand.

Dùng:

```css
.survey-primary-button:disabled {
  border-color: #d2d5d9;
  background: #c4c8cd;
  box-shadow: none;
  color: rgba(255,255,255,.9);
  opacity: .72;
  transform: none;
}
```

Pill shape vẫn giữ.

---

# 11. PRIMARY BUTTON ARROW — MUST USE LANDING ASSET

Survey hiện dùng:

```tsx
<ArrowRight />
```

Primary CTA phải chuyển sang:

```tsx
<img
  src={figmaAssets.arrow1}
  alt=""
  aria-hidden="true"
  className="survey-button-arrow"
/>
```

Reuse:

```ts
import { figmaAssets } from '../landing/figmaAssets'
```

hoặc tạo shared helper hợp lý.

Không duplicate SVG.

---

# 12. PRIMARY ARROW MOTION

```css
.survey-button-arrow {
  width: 15px;
  height: 13px;
  flex: none;
  transition: transform 180ms cubic-bezier(.2,.8,.2,1);
}

.survey-primary-button:hover .survey-button-arrow {
  transform: translateX(3px);
}

.survey-primary-button:active .survey-button-arrow {
  transform: translateX(4px);
}
```

Reduced motion phải disable.

---

# 13. BUTTONS THAT MUST BECOME LANDING-DNA PRIMARY CTA

Các action sau:

```text
Bắt đầu khảo sát
Câu tiếp theo
Tiếp tục sang Phần 2
Xem kết quả khảo sát
Nhận báo cáo
Nhận báo cáo Phần 1
Tải xuống PDF
Đăng ký tham dự
```

phải dùng `survey-primary-button`.

---

# 14. BUTTONS THAT MUST NOT BECOME RED PRIMARY

Không biến các utility actions sau thành red CTA:

```text
Quay lại
Câu trước
Danh sách
Xem lại câu trả lời
Hủy
Đóng
Bỏ qua Phần 2
```

---

# 15. OUTLINE BUTTON — MATCH LANDING DNA

Current:

```css
border-color: #cdd3da;
```

nhìn generic enterprise.

Thay bằng:

```css
.survey-outline-button {
  min-height: 50px;
  padding: 12px 20px;

  border:
    1px solid var(--survey-action-outline);

  border-radius: 999px;

  background: #fff;
  color: var(--survey-action-outline);

  box-shadow: none;

  font-weight: 600;
}
```

Hover:

```css
.survey-outline-button:hover {
  background: #f8f9fa;
  border-color: #00132f;
}
```

---

# 16. DO NOT PILL EVERY CONTROL

Pill chỉ cho:

- primary CTA;
- secondary CTA;
- important action button.

Không dùng pill cho:

- Likert;
- MCQ;
- text input;
- consent rows;
- question list row;
- score bar;
- report section;
- mobile progress container.

---

# 17. LIKERT — POLISH

Current Likert lacks radius.

Add:

```css
.survey-likert-grid label {
  border-radius: 12px;
}
```

Selected:

```css
background: var(--survey-navy);
```

GIỮ.

Không gradient selected.

Không shadow selected.

---

# 18. LIKERT WIDTH / VISUAL RHYTHM

Desktop:

```text
max-width: 680px
gap: 10px
height: 56px
```

ổn.

Nhưng visually normalize:

```css
font-size: 16px;
font-weight: 650;
```

Không để quá bold.

Mobile:

```text
>= 390: gap 6px
<= 390: gap 4px
```

Giữ 5 items cùng một row.

---

# 19. MCQ — POLISH

Add:

```css
.survey-options label {
  border-radius: 12px;
}
```

Selected:

```css
background: #f5f8fd;
border-color: var(--survey-blue);
```

GIỮ.

Không dùng full navy fill cho MCQ.

---

# 20. MCQ RADIO

Current radio dot đã dùng:

```css
border-radius: 50%;
```

GIỮ.

Không đổi sang rounded square.

---

# 21. INPUT POLISH

Current:

```css
border-radius: 8px;
```

Có thể tăng:

```css
border-radius: 10px;
```

hoặc:

```css
12px
```

Nhưng không pill.

Recommended:

```text
10px
```

Focus:

- blue border;
- visible focus ring;
- no shadow glow.

---

# 22. UX FIX #1 — NEXT MUST BE SEQUENTIAL

Current `continuePartOne()`:

```ts
if (!currentAnswered) error

const missingQuestion =
  firstUnansweredQuestion(partOneQuestions)

if (missingQuestion) {
  jumpToQuestion(missingQuestion.n)
}
```

Đây là behavior sai cho button:

```text
Câu tiếp theo
```

---

# 23. CORRECT PART 1 NEXT LOGIC

Pseudo:

```ts
function continuePartOne() {
  const currentIndex =
    getQuestionIndex(
      partOneQuestions,
      activeQuestion
    )

  const currentQuestion =
    partOneQuestions[currentIndex]

  if (!hasAnswer(currentQuestion)) {
    showCurrentQuestionError()
    return
  }

  const isLast =
    currentIndex === partOneQuestions.length - 1

  if (!isLast) {
    jumpToQuestion(
      partOneQuestions[currentIndex + 1].n
    )
    return
  }

  const missing =
    firstUnansweredQuestion(
      partOneQuestions,
      hasAnswer
    )

  if (missing) {
    setQuestionError(
      `Anh/Chị còn câu chưa hoàn tất.`
    )
    jumpToQuestion(missing.n)
    return
  }

  setActiveQuestion(
    partTwoQuestions[0].n
  )

  goToScreen('part2')
}
```

---

# 24. WHY THIS MATTERS

Nếu CEO dùng Drawer:

```text
Q1
→ jump Q7
→ answer
→ Next
```

Expected:

```text
Q8
```

Không phải:

```text
Q2
```

“Next” phải có semantic:

> next in sequence

không phải:

> find missing answer.

---

# 25. PART 2 NEXT LOGIC

Part 2 tương tự.

Nếu đã bắt đầu Part 2:

```text
Q19 → Q20 → Q21...
```

Next sequential.

Final question:

```text
Q24
```

mới validate toàn Part.

---

# 26. PART 2 ZERO-ANSWER BEHAVIOR

Current business rule:

Nếu user chưa trả lời bất kỳ câu Part 2 nào và muốn xem report:

```text
→ Báo cáo Part 1
```

Giữ logic hiện tại.

Nhưng CTA semantics phải rõ.

Không để user hiểu rằng “Câu tiếp theo” có thể skip Part.

---

# 27. UX FIX #2 — PROGRESS MUST MEASURE COMPLETION

Current Desktop:

```ts
positionProgress =
  position / questions.length
```

Current Mobile cũng vậy.

Điều này sai nếu user jump bằng drawer.

---

# 28. SEPARATE TWO CONCEPTS

### Position

```text
Câu 07 / 18
```

### Completion

```text
5 câu hoàn tất
```

### Progress bar

Dùng completion:

```ts
completionProgress =
  completedCount / questions.length
```

---

# 29. DESKTOP PROGRESS TARGET

```text
PHẦN 1 · KHẢO SÁT KHUYẾT DANH

Câu 07 / 18                         5 câu hoàn tất

━━━━━━━━━━━━━━━━━━━━━━░░░░░░░░░░
```

Bar = `5/18`.

Không bar = `7/18`.

---

# 30. PROGRESS COMPONENT API

Update:

```tsx
<MobileQuestionNav
  activeQuestion={...}
  completedCount={...}
  ...
/>
```

`MobileQuestionNav` phải nhận `completedCount`.

Không tự derive progress bằng current position.

---

# 31. UX FIX #3 — MOBILE DUPLICATE PROGRESS

Current mobile render:

```tsx
survey-question-progress
+
MobileQuestionNav
```

Cả hai cùng xuất hiện.

Không được.

---

# 32. MOBILE PROGRESS RULE

At:

```css
max-width: 767px
```

hide desktop progress:

```css
.survey-question-progress {
  display: none;
}
```

Chỉ show:

```text
05 / 18             3 câu hoàn tất         Danh sách
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

# 33. MOBILE NAV COMPOSITION

Recommended:

```text
Câu 05 / 18              3 hoàn tất      ☰ Danh sách
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Nếu 360px quá chật:

```text
05 / 18                         ☰ Danh sách
3 câu hoàn tất
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Không wrap bất ngờ.

---

# 34. UX FIX #4 — DUPLICATE QUESTION NAV ENTRY POINT

Current mobile header:

```text
←   LOGO   PHẦN 1   ☰
```

Mobile nav:

```text
05/18   Danh sách
```

Hai action mở cùng drawer.

Bỏ một.

---

# 35. MOBILE HEADER TARGET

Preferred:

```text
←        [CWI LOGO]                Phần 1
```

Không menu trong header mobile.

Drawer entry nằm ở MobileQuestionNav:

```text
☰ Danh sách
```

---

# 36. DESKTOP HEADER

Desktop có thể giữ:

```text
← Quay lại
[CWI]
Phase / state
Danh sách câu hỏi
```

Desktop button “Danh sách câu hỏi” hữu ích.

Only mobile hides header menu.

---

# 37. UX FIX #5 — CONTACT PART 1 BACK BUG

Current:

```tsx
<ContactScreen
  mode="part1"
  onBack={() => goToScreen('part2')}
/>
```

Sai.

---

# 38. CONTACT BACK TARGET

Part 1 report contact:

```text
Xem lại câu trả lời
→ Part 1
→ activeQuestion = Q18
```

Private report contact:

```text
Xem lại câu trả lời
→ Part 2
→ activeQuestion = Q24
```

---

# 39. IMPLEMENT CONTACT BACK HELPERS

Ví dụ:

```ts
const reviewPartOneAnswers = () => {
  setActiveQuestion(
    partOneQuestions[
      partOneQuestions.length - 1
    ].n
  )
  goToScreen('part1')
}

const reviewPartTwoAnswers = () => {
  setActiveQuestion(
    partTwoQuestions[
      partTwoQuestions.length - 1
    ].n
  )
  goToScreen('part2')
}
```

---

# 40. HEADER BACK ON CONTACT

Current:

```ts
if (
  screen === 'contact1' ||
  screen === 'contact2'
) {
  goToScreen('part2')
}
```

Fix:

```text
contact1 → Part 1 Q18
contact2 → Part 2 Q24
```

Button và header phải cùng semantics.

---

# 41. INTRO TERMINOLOGY

Current Intro eyebrow có thể gây confusion nếu ghi:

```text
PHẦN 1 / 3
```

trước khi user bước vào:

```text
PHẦN 1 · KHẢO SÁT KHUYẾT DANH
```

---

# 42. INTRO EYEBROW TARGET

Use:

```text
GIỚI THIỆU · CEO WORKFORCE INDEX 2026Q3
```

hoặc:

```text
BƯỚC 1 / 3 · GIỚI THIỆU
```

Ưu tiên:

```text
GIỚI THIỆU · CEO WORKFORCE INDEX 2026Q3
```

để tránh hai hệ numbering.

---

# 43. REMOVE INTRO DUPLICATE BACK ACTION

Current Intro có:

```text
Header: Quay lại
Body: Quay lại landing page
```

Bỏ body ghost button.

Intro action chỉ còn:

```text
[Bắt đầu khảo sát →]
```

Header chịu trách nhiệm Back.

---

# 44. CWI BRAND STRATEGY

Branding không phải:

> dán logo ở mọi nơi.

Branding =

- logo;
- color;
- button DNA;
- typography;
- spacing;
- report identity;
- interaction pattern.

---

# 45. LOGO VISIBILITY RULE

Không quá:

```text
2 CWI logos visible
```

trong cùng viewport.

Default:

```text
1
```

---

# 46. LOGO COMPONENT

Tạo shared component trong SurveyChrome:

```tsx
type SurveyBrandMarkProps = {
  className?: string
  variant?: 'header' | 'intro' | 'trust' | 'report'
}

export function SurveyBrandMark(...) {
  return (
    <img
      src={figmaAssets.cwiLogo}
      alt="CEO Workforce Index"
      ...
    />
  )
}
```

Không repeat raw `<img>` khắp component.

---

# 47. GLOBAL HEADER LOGO

Current header logo:

```tsx
figmaAssets.cwiLogo
```

GIỮ.

Desktop width:

```text
88–96px
```

Mobile:

```text
72–80px
```

---

# 48. INTRO BRAND MARK

Add logo trong Intro body.

Composition:

```text
[CWI LOGO]

GIỚI THIỆU · CEO WORKFORCE INDEX 2026Q3

Năng lực Lãnh đạo
cho Tăng trưởng
```

Desktop:

```text
120–140px
```

Mobile:

```text
96–108px
```

---

# 49. AVOID INTRO LOGO DUPLICATION FEEL

Header vẫn có logo.

Body logo được phép vì Intro là brand-entry screen.

Nhưng khoảng cách phải đủ lớn.

Không đặt:

```text
header logo
logo body
```

cách nhau 20px.

Dùng intro top spacing để body logo có vai trò cover identity.

---

# 50. INTRO BRAND LOCKUP

Recommended:

```tsx
<div className="survey-intro-brand">
  <SurveyBrandMark variant="intro" />
  <span>CEO WORKFORCE INDEX · 2026Q3</span>
</div>
```

Không thêm box.

Không background.

Không border.

---

# 51. QUESTION BODY — NO LOGO

Không add:

```text
CWI logo
```

vào `QuestionCard`.

Question body phải ưu tiên:

```text
question
answer
next
```

Header đã đủ branding.

---

# 52. QUESTION BRANDING THROUGH SYSTEM

Question screen nhận brand từ:

- red CTA;
- navy selection;
- CWI blue progress;
- header logo;
- Inter;
- spacing;
- premium action shape.

Không cần logo thứ hai.

---

# 53. CONTACT SCREEN — ADD TRUST BRAND MARK

Contact là trust moment.

Add:

```text
[CWI LOGO]

NHẬN BÁO CÁO
```

trước eyebrow/headline.

Recommended width:

```text
104–120px desktop
92–104px mobile
```

---

# 54. CONTACT BRAND PURPOSE

User đang cung cấp:

- name;
- email;
- consent.

Logo giúp reinforce:

```text
Data is being provided to CWI
```

không phải một random form.

---

# 55. CONTACT VISUAL TARGET

```text
[CWI]

NHẬN BÁO CÁO

Nhận Báo cáo Riêng tư

Thank-you copy...


Họ tên
[input]

Email
[input]


────────────────────────

🔒 Bảo mật dữ liệu
...

○ Đồng ý
○ Không đồng ý


[Nhận báo cáo →]    [Xem lại câu trả lời]
```

---

# 56. CONTACT CONSENT CONTROL

Consent hiện giống rectangular rows.

Polish:

```css
border-radius: 12px;
```

Không pill.

Add visible radio circle nếu hiện tại label chỉ là text.

Recommended:

```text
○ Đồng ý
○ Không đồng ý
```

---

# 57. LOADING — ADD CWI BRAND

Add CWI logo:

```text
[CWI LOGO]

ĐANG PHÂN TÍCH

Đang tạo Báo cáo Riêng tư
```

Recommended width:

```text
100–116px
```

Centered.

---

# 58. LOADING SPINNER

Current:

```tsx
<LoaderCircle />
```

Có thể GIỮ.

Nhưng không cần spinner là visual hero.

Hierarchy:

1. CWI
2. eyebrow
3. title
4. progress
5. steps
6. spinner optional

---

# 59. BETTER LOADING OPTION

Có thể bỏ spinner và dùng:

```text
logo
title
progress line
steps
```

Đây là recommended option.

Nếu giữ spinner:

```text
24–28px
```

không >36px.

---

# 60. REPORT — CWI LOGO IS MANDATORY

Report là nơi cần CWI branding mạnh nhất.

Current report thiếu report cover identity.

Add:

```text
[CWI LOGO]

CEO WORKFORCE INDEX · Q3 2026

BÁO CÁO CHẨN ĐOÁN
NĂNG LỰC LÃNH ĐẠO CHO TĂNG TRƯỞNG

Báo cáo Khuyết danh
```

hoặc Private variant.

---

# 61. REPORT HEAD ARCHITECTURE

Replace current:

```text
eyebrow
Báo cáo Riêng tư
paragraph
```

with:

```text
[CWI LOGO]

CEO WORKFORCE INDEX
2026 Q3

────────────────────────────────

BÁO CÁO CHẨN ĐOÁN

Năng lực Lãnh đạo
cho Tăng trưởng

Báo cáo Riêng tư

25 trang · Phần 1 + Phần 2
```

Không cần tất cả text uppercase.

---

# 62. REPORT HEAD DESKTOP LAYOUT

Option recommended:

```text
┌─────────────────────────────────────────────┐
│ CWI logo                                    │
│                                             │
│ CEO WORKFORCE INDEX · Q3 2026               │
│                                             │
│ BÁO CÁO CHẨN ĐOÁN                           │
│ Năng lực Lãnh đạo cho Tăng trưởng           │
│                                             │
│ Báo cáo Riêng tư                            │
│                                             │
│ metadata                                    │
└─────────────────────────────────────────────┘
```

No card shadow.

No decorative gradient.

---

# 63. REPORT PRINT BRANDING

Current `@media print` hides header.

Correct.

Nhưng Result body phải có riêng:

```text
print brand header
```

vì app header không print.

---

# 64. ADD PRINT-ONLY REPORT HEADER/FOOTER

Markup:

```tsx
<div className="survey-report-print-brand">
  <img ... />
  <span>CEO Workforce Index · Q3 2026</span>
</div>
```

Screen:

```css
display: none;
```

Print:

```css
display: flex;
```

---

# 65. PRINT FOOTER

Add:

```text
CEO Workforce Index · Q3 2026
Confidential
```

Không position fixed nếu browser print gây overlap multi-page.

Có thể render block cuối hoặc use print-safe footer.

---

# 66. DRAWER LOGO — OPTIONAL

Drawer có thể add logo small:

```text
[CWI]                      ×

Danh sách câu hỏi
Phần 1
5/18 đã trả lời
```

Width:

```text
72–84px
```

---

# 67. DRAWER LOGO PRIORITY

Priority:

```text
P2
```

Không cần nếu header vẫn visible desktop.

Mobile bottom sheet che header một phần visual context nên logo nhỏ hữu ích.

---

# 68. ROUNDTABLE BRAND MARK — OPTIONAL

Add small CWI logo:

```text
[CWI]

CEO ROUNDTABLE
```

Width:

```text
80–96px
```

Không repeat logo nếu Result section phía trên vẫn visible sát ngay modal launch.

Modal overlay che background → small logo acceptable.

---

# 69. REPORT REQUIREMENT — IMPORTANT CLARIFICATION

`CWI_Survey_Wireframe(1).html` là requirement.

Không copy CSS.

Không copy old visual.

Không bỏ chart chỉ vì spec V2 trước đây ưu tiên data credibility.

Requirement yêu cầu CEO nhìn thấy các nhóm thông tin report.

---

# 70. PART 1 REPORT REQUIRED CONTENT

Báo cáo Part 1 cần có tối thiểu:

## Section 01

```text
Kết quả thị trường
```

## Section 02

```text
Input / kết quả 18 câu
Leadership Capacity
Scale Readiness
```

## Section 03

```text
Phân tích đối chuẩn
5 nhóm năng lực
```

## Appendix

```text
18 answers
```

---

# 71. CURRENT REPORT GAP

Current React có:

```text
Kết quả thị trường
```

nhưng chỉ là:

```text
heading
paragraph
```

Không có chart/data visual.

Phải hoàn thiện.

---

# 72. MARKET BENCHMARK COMPONENT

Create component:

```tsx
<MarketBenchmarkSection
  data={marketBenchmarkData}
/>
```

Suggested type:

```ts
type MarketBenchmarkData = {
  period: string
  sourceLabel?: string
  series?: Array<{
    label: string
    value: number
  }>
  metrics: Array<{
    label: string
    value: string
    description?: string
  }>
}
```

---

# 73. DO NOT FABRICATE PRODUCTION DATA

HTML wireframe có demo values như:

```text
300+
78/100
61%
```

và ghi rõ đây là:

```text
Demo bố cục
Dữ liệu thực tế lấy từ Teaser Report
```

Vì vậy:

- không hardcode rồi trình bày là actual;
- không gọi là market truth nếu chưa wired data;
- không invent benchmark.

---

# 74. MARKET DATA STATES

Component phải support:

## State A — Real data available

Render chart + metrics.

## State B — Demo visual QA

Allowed only if explicitly marked:

```text
Dữ liệu minh họa
```

## State C — No data

Render tasteful unavailable state:

```text
Dữ liệu thị trường sẽ được cập nhật
từ Teaser Report.
```

Không fake chart.

---

# 75. DEV SEED POLICY

Nếu agent cần visual QA bằng wireframe demo:

```ts
const marketBenchmarkDemo = {
  isDemo: true,
  ...
}
```

UI phải display:

```text
DỮ LIỆU MINH HỌA
```

Không được remove badge trước khi có real source.

---

# 76. MARKET CHART DESIGN

Không dùng old fake wavy decorative chart.

Chart phải có meaning.

Recommended:

### Option A — Horizontal benchmark distribution

```text
Leadership Capacity — Market Benchmark

Lower                  Median             Top quartile
│                        │                    │
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

                      ● Your score
```

Best if benchmark stats exist.

---

# 77. MARKET CHART OPTION B

Nếu Teaser data là time/category series:

```text
line / bars
```

phải có:

- axis label;
- data label;
- legend nếu cần;
- units;
- source note.

Không chart vô nghĩa.

---

# 78. NO CHART LIBRARY REQUIRED

Nếu simple chart:

- SVG;
- CSS;
- semantic markup.

Không thêm Recharts/D3 chỉ cho một visualization.

Nếu project đã có chart dependency, mới cân nhắc reuse.

---

# 79. MARKET METRICS LAYOUT

Desktop:

```text
┌────────────┬────────────┬────────────┐
│ metric     │ metric     │ metric     │
└────────────┴────────────┴────────────┘
```

Nhưng không floating cards.

Use shared row:

```text
Metric 1        │ Metric 2        │ Metric 3
```

divider vertical.

Mobile:

stack.

---

# 80. SCORE SECTION

Current `ScoreRow` là direction tốt.

Giữ.

Polish hierarchy.

---

# 81. LEADERSHIP CAPACITY

Display:

```text
Leadership Capacity

78 / 100
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Score large enough:

```text
28–36px
```

Không dashboard card.

---

# 82. SCALE READINESS

Same system.

No different decoration.

---

# 83. SCORE COLOR

Use:

```text
navy
```

for score.

Use CWI blue for progress.

Do not use:

```text
green = good
red = bad
```

unless scoring methodology explicitly defines threshold.

Avoid implying interpretation not in source.

---

# 84. 5-GROUP SECTION — ADD RADAR + BARS

HTML requirement expects visual summary.

Current only `DomainBars`.

Add a Radar summary using actual:

```ts
scores.domains
```

No fake values.

---

# 85. RADAR PURPOSE

Radar:

> pattern recognition

Bars:

> exact reading

Both can coexist.

---

# 86. RADAR IMPLEMENTATION

No library required.

Create:

```tsx
<DomainRadar domains={scores.domains} />
```

SVG:

- neutral grid;
- CWI blue polygon;
- low-opacity fill;
- navy points;
- labels around radar.

---

# 87. RADAR LABELS

Must show domain names.

Do not create unlabeled pentagon.

If names too long:

- wrap SVG labels carefully;
- or use numbered axis with visible legend;
- but prefer short existing domain names.

---

# 88. RADAR DESKTOP LAYOUT

```text
┌──────────────────────┬─────────────────────────────┐
│                      │ Domain 1               82   │
│       RADAR          │ ━━━━━━━━━━━━━━━━━━━━━       │
│                      │                             │
│                      │ Domain 2               71   │
│                      │ ━━━━━━━━━━━━━━━━━━          │
└──────────────────────┴─────────────────────────────┘
```

---

# 89. RADAR MOBILE LAYOUT

```text
RADAR
↓
DOMAIN BARS
```

Radar max width:

```text
280–320px
```

center.

---

# 90. RADAR ACCESSIBILITY

SVG:

```tsx
role="img"
aria-label="Biểu đồ 5 nhóm năng lực..."
```

Also render bars with exact values.

Thus radar is not sole information channel.

---

# 91. REPORT SECTION NUMBERING

For executive-report feel, introduce section numbers:

```text
01 · KẾT QUẢ THỊ TRƯỜNG
02 · KẾT QUẢ CỦA ANH/CHỊ
03 · 5 NHÓM NĂNG LỰC
04 · CÂU TRẢ LỜI
05 · PHÂN TÍCH RIÊNG
```

Private only has 05.

---

# 92. SECTION NUMBER STYLE

Small:

```text
12px
blue
tabular number
```

No giant numbers.

No decorative cards.

---

# 93. PRIVATE REPORT REQUIREMENT

HTML states private report:

```text
5 trang phân tích riêng
```

with:

- deeper analysis;
- recommendation;
- solution/action relevance.

Current implementation only displays raw answers.

Not enough.

---

# 94. CURRENT PRIVATE `deepItems`

Current:

```ts
[
  ['Cơ chế ra quyết định', answer19],
  ['Độ sẵn sàng mở rộng', answer20],
  ...
]
```

This is:

```text
answer recap
```

not:

```text
private analysis
```

---

# 95. DO NOT INVENT CONSULTING INSIGHT

Agent không được tự fabricate recommendations từ raw answer nếu chưa có business rule/source.

Need support architecture for analysis.

---

# 96. PRIVATE ANALYSIS DATA MODEL

Create presentation model:

```ts
type PrivateAnalysisItem = {
  id: string
  title: string
  signal: string
  interpretation?: string
  risk?: string
  priorityAction?: string
}
```

Populate fields only when data/business rule exists.

---

# 97. WHEN ONLY RAW ANSWER EXISTS

Render:

```text
01
Cơ chế ra quyết định

TÍN HIỆU DOANH NGHIỆP
[actual answer]

PHÂN TÍCH
Đang chờ mô hình phân tích / nguồn dữ liệu
```

Better:

If product shouldn't show incomplete analysis, only show signal and omit empty analysis rows.

---

# 98. DO NOT SHOW “AI GẮN CỜ” WITHOUT AI LOGIC

HTML wireframe has demo wording.

Do not copy:

```text
AI gắn cờ
```

unless actual AI inference exists.

---

# 99. PRIVATE ANALYSIS FINAL STRUCTURE

When data becomes available:

```text
01 · Cơ chế ra quyết định

Tín hiệu
...

Ý nghĩa
...

Rủi ro cần lưu ý
...

Hành động ưu tiên
...
```

Same for 5 themes.

---

# 100. FIVE PRIVATE THEMES

Use current themes:

```text
01 Cơ chế ra quyết định
02 Độ sẵn sàng mở rộng
03 Mức phụ thuộc vào CEO
04 Rào cản tăng trưởng
05 Bối cảnh doanh nghiệp
```

---

# 101. PRIVATE ANALYSIS VISUAL

Do not render as five rounded cards.

Use editorial rows.

Example:

```text
01
Cơ chế ra quyết định

TÍN HIỆU
...

Ý NGHĨA
...

────────────────────────────
```

---

# 102. REPORT ANSWER APPENDIX

Current `<details>` is good for screen.

Keep.

For print:

current CSS forces details contents visible.

Good.

---

# 103. ANSWER APPENDIX PLUS/MINUS

Current summary always:

```text
+
```

even when open.

Improve:

```css
details[open] summary span
```

to:

```text
−
```

or rotate icon.

No animation needed.

---

# 104. REPORT ROUND TABLE

Current placement after report is correct.

GIỮ.

---

# 105. ROUNDTABLE BUTTON PRIORITY

Inside report:

Current outline button is fine because Roundtable is secondary to report.

Do not make Roundtable invitation primary red if:

```text
Download PDF
```

is main report action.

However modal registration CTA should be red primary.

---

# 106. REPORT ACTION ORDER

Recommended:

```text
[Tải xuống PDF →]     [Quay về trang chủ]
```

Primary:

```text
Download PDF
```

Secondary:

```text
Home
```

---

# 107. DOWNLOAD BUTTON ICON

Current:

```tsx
<Download />
```

Can keep.

Do not replace with arrow because semantic download icon is more appropriate.

Landing DNA comes from:

- red fill;
- border;
- pill;
- shadow.

Icon semantics can differ.

---

# 108. INTRO CTA ARROW

Use `figmaAssets.arrow1`.

---

# 109. QUESTION NEXT ARROW

Use `figmaAssets.arrow1`.

---

# 110. CONTACT SUBMIT ARROW

Use `figmaAssets.arrow1`.

---

# 111. MODAL REGISTER

Could use arrow asset.

Recommended:

```text
Đăng ký tham dự →
```

---

# 112. HEADER VISUAL POLISH

Current header is clean.

Do not redesign heavily.

---

# 113. DESKTOP HEADER GRID

Current:

```css
grid-template-columns:
  minmax(116px, auto)
  92px
  minmax(0, 1fr)
  auto;
```

Potential issue:

Logo is not central relative viewport.

But this is acceptable if utility structure is intentional.

Do not chase mathematical center if it destabilizes.

---

# 114. MOBILE HEADER GRID

Simplify after removing menu.

Suggested:

```css
grid-template-columns:
  44px
  minmax(72px, 86px)
  minmax(0, 1fr);
```

Composition:

```text
Back
Logo
Phase
```

Phase align right.

---

# 115. MOBILE HEADER STATE

Do not show long state subtitle if it truncates poorly.

Use:

```text
Phần 1
```

or:

```text
Báo cáo
```

Header secondary state can be hidden mobile.

---

# 116. QUESTION WORKSPACE DESKTOP

Current white card:

```css
border
radius 16
padding 50 56
```

This is acceptable.

Keep.

Do not remove just to make flat.

It now acts as the one focused surface, not a stack of 18 cards.

This is contextually correct.

---

# 117. QUESTION WORKSPACE POLISH

Recommended:

```css
border-radius: 20px;
```

ONLY if needed to harmonize premium feel.

But avoid giant radius.

Preferred:

```text
16px
```

Keep current.

---

# 118. QUESTION WORKSPACE SHADOW

No shadow.

Keep.

---

# 119. QUESTION NUMBER

Current:

```text
05
CÂU HỎI ĐÁNH GIÁ
```

Works.

Could reduce metadata noise:

```text
05 · CÂU HỎI ĐÁNH GIÁ
```

on one line.

Optional.

---

# 120. QUESTION TITLE

Current size:

```text
25–34 desktop
24 mobile
```

Good.

Keep.

---

# 121. FIRST QUESTION CONTEXT

Current first question displays:

- eyebrow;
- intro;
- subtitle.

Good.

But it adds vertical height.

Make it compact.

---

# 122. FIRST QUESTION CONTEXT TARGET

```text
BẮT ĐẦU PHẦN 1

Phần 1 được xử lý ở chế độ khuyết danh...
```

Subtitle can be muted.

No more than ~3 lines combined desktop if possible.

Do not change actual copy unless layout allows.

---

# 123. QUESTION ACTIONS DESKTOP

Current:

```text
[Câu trước]     5/18 đã trả lời     [Câu tiếp theo]
```

Good.

After progress fix:

middle:

```text
5/18 hoàn tất
```

---

# 124. QUESTION ACTIONS MOBILE

Current previous becomes icon-only.

Good concept.

But after primary buttons become pill:

Ensure layout doesn't become cramped at 360px.

---

# 125. MOBILE ACTION TARGET <=390

```text
[←]      5/18       [Tiếp theo →]
```

Primary CTA may need:

```text
flex: 1
```

Previous:

```text
48x48
```

---

# 126. MOBILE PRIMARY CTA FONT

Use:

```text
14px
```

if required.

Do not shrink below 14px.

---

# 127. MOBILE PRIMARY PILL

Pill is okay.

Height:

```text
48–50px
```

not 56 for every question.

Hero/Intro CTA can be 54–56.

---

# 128. BUTTON SIZE HIERARCHY

## Intro CTA

```text
56px
```

## Standard survey CTA

```text
50–52px
```

## Mobile question Next

```text
48–50px
```

## Utility

```text
40–44px
```

---

# 129. INTRO PRIMARY CTA

Make larger than normal Survey CTA.

```css
.survey-intro-actions
.survey-primary-button {
  min-height: 56px;
  padding-inline: 28px;
  font-size: 16px;
}
```

---

# 130. INTRO REPORT PARTS

Current editorial rows are good.

Keep.

No return to report cards.

---

# 131. INTRO EMPHASIS COLOR

Current emphasis:

```css
blue
```

Fine.

Do not make headline red gradient.

Landing already has dramatic hero.

Survey Intro should be calmer.

---

# 132. FORM SCREEN SURFACE

Current form is free-standing, no card.

Good.

Keep.

---

# 133. CONTACT FORM GRID DESKTOP

Current `.survey-form-grid` is one column.

Source old version had 2 columns.

For executive form with only Name + Email:

Desktop can use 2 columns.

Recommended:

```css
grid-template-columns:
  repeat(2, minmax(0, 1fr));
```

Mobile:

```text
1 column
```

---

# 134. CONTACT FORM WIDTH

Max:

```text
760px
```

good.

---

# 135. FORM FIELD LABEL

Current 14px 650 good.

Keep.

---

# 136. PRIVACY SECTION

Current border top is good.

Keep.

Add subtle lock icon.

Already exists.

No card.

---

# 137. CONSENT GRID DESKTOP

2 columns acceptable.

Add radius 12.

Add radio dot.

---

# 138. CONSENT GRID MOBILE

One column current.

Good.

---

# 139. LOADING STEPS

Current structure good.

No separate cards.

Keep.

---

# 140. LOADING ICON CIRCLES

Current steps have square boxes because no radius.

Could use:

```css
border-radius: 50%;
```

for step status numbers/check.

This reads as process step.

---

# 141. LOADING PROGRESS

Current:

```text
step * 25
```

okay as pseudo progress.

No need numeric percent.

---

# 142. REPORT WIDTH

Current:

```text
920px
```

good for report.

Can expand to:

```text
960px
```

if radar + bars side by side needs room.

Do not exceed ~1040.

---

# 143. REPORT PAGE BACKGROUND

Screen:

```text
white report body
on soft grey page
```

good.

Could add subtle border:

```css
border: 1px solid #e7e9ec;
```

desktop only.

No shadow.

Mobile edge-to-edge.

---

# 144. REPORT SECTION SPACING

Current:

```text
48px
```

good.

For new visualization section:

```text
52–64px
```

between major sections.

---

# 145. EXECUTIVE REPORT VISUAL RULE

Report should feel closer to:

```text
annual report
research publication
strategy memo
```

than:

```text
analytics dashboard
```

---

# 146. NO CARD GRID IN REPORT

Avoid:

```text
4 KPI cards
5 analysis cards
3 insight cards
```

Use:

- rows;
- dividers;
- columns;
- figures;
- typography.

---

# 147. MARKET VISUAL CONTAINER

Chart can live in one contained figure:

```css
border: 1px solid var(--survey-border);
border-radius: 16px;
padding: 24px;
```

This is acceptable because chart is a distinct figure.

---

# 148. FIGURE CAPTION

Add:

```text
Nguồn: Teaser Report · CEO Workforce Index Q3/2026
```

only when source info exists.

Don't invent source detail.

---

# 149. DATA SOURCE PROP

Suggested:

```ts
sourceLabel?: string
```

If absent:

do not render source.

---

# 150. REPORT BENCHMARK RELATION

If benchmark exists, show:

```text
Your score
vs
market benchmark
```

Do not infer percentile unless data supports.

---

# 151. DOMAIN BARS LABEL

Current `domain.name` and value good.

Add `/100` maybe:

```text
82 / 100
```

to make scale explicit.

---

# 152. DOMAIN BARS TRACK

Current 7px.

Fine.

Use 6–8px.

No gradient.

---

# 153. DOMAIN RADAR COLORS

Use:

```text
grid: #dfe3e8
stroke: #1d4f91
fill: rgba(29,79,145,.12)
point: #001a3d
```

No red/cyan rainbow.

---

# 154. BRAND RED IN REPORT

Use red very sparingly:

- CTA;
- perhaps one small accent;
- warning if meaning exists.

Do not use red chart data just for brand.

---

# 155. REPORT CWI BLUE

Blue can drive:

- section number;
- chart stroke;
- progress;
- domain bars;
- eyebrow.

---

# 156. REPORT NAVY

Use for:

- headline;
- big scores;
- report title.

---

# 157. REPORT MOBILE

At <=767:

- report body edge-to-edge;
- chart stack;
- metrics stack;
- radar center;
- bars full width;
- buttons full width;
- no horizontal scrolling.

---

# 158. PRINT RADAR

Make SVG print-safe.

Use:

```css
print-color-adjust: exact;
-webkit-print-color-adjust: exact;
```

---

# 159. PRINT MARKET CHART

Same.

---

# 160. PRINT PAGE BREAK

Use:

```css
break-inside: avoid;
```

for:

- score summary;
- chart figure;
- radar figure;
- private analysis item where feasible.

---

# 161. DO NOT FORCE LARGE SECTION TO ONE PAGE

If private analysis is long:

Don't `break-inside: avoid` on whole huge section.

Use per-item.

---

# 162. ROUNDTABLE INVITATION VISUAL

Current subtle surface.

Good.

Add CWI mini mark only if it enhances identity.

Not mandatory.

---

# 163. ROUNDTABLE META

Current simple lines.

Good.

Do not turn into pills.

---

# 164. ROUNDTABLE MODAL

Current focus trap is improved.

Keep.

---

# 165. DRAWER ACCESSIBILITY GAP

Drawer currently handles Escape + scroll lock but not full Tab focus trap.

Improve to same pattern as Roundtable modal.

---

# 166. DRAWER ROLE

Current:

```tsx
<aside role="dialog">
```

Add:

```tsx
aria-modal="true"
```

mobile and desktop overlay drawer.

---

# 167. DRAWER FOCUS RESTORE

Current useEffect restores previous focus.

Good.

Keep.

---

# 168. DRAWER TAB TRAP

Add same first/last focus logic used by Roundtable modal.

---

# 169. MODAL INITIAL FOCUS

Current focuses close button.

Acceptable.

Could focus first form field instead for registration modal.

Recommended desktop:

```text
close button
```

for safety.

Keep.

---

# 170. HEADER BACK DISABLED LOADING

Current loading disables Back.

Fine.

Need ensure disabled header button doesn't appear clickable.

---

# 171. HEADER LOADING

Loading screen could hide header back entirely instead of disabled.

Optional.

If keep disabled:

visual mute.

---

# 172. GLOBAL BODY SCROLL

When Drawer/Modal open:

current body overflow lock good.

Keep.

---

# 173. AUTO-SCROLL TO TOP

`jumpToQuestion()` calls smooth page top.

Good.

But make sure mobile sticky header does not cause odd offset.

Since one-question mode, top 0 is okay.

---

# 174. ANSWER AUTO-ADVANCE

Do NOT add auto-advance in this pass.

CEO may need review after click.

Next explicit action is safer.

---

# 175. KEYBOARD SHORTCUTS

Do not add numeric shortcuts now.

Could create accidental answer.

---

# 176. BUTTON FOCUS

Primary pill still needs visible focus ring.

Current global focus selector good.

Ensure img arrow not intercept.

---

# 177. PRIMARY BUTTON `:focus-visible`

Match Landing:

```css
outline:
  3px solid rgba(20,78,175,.45);

outline-offset: 3px;
```

---

# 178. BUTTON TEXT WRAPPING

Prevent primary CTA from ugly 2-line wrap:

```css
white-space: nowrap;
```

Except mobile if needed.

At 360px, allow label shortening via responsive copy only if current copy can be safely changed.

Prefer CSS layout over copy changes.

---

# 179. CWI LOGO ALT

When logo is identity:

```text
alt="CEO Workforce Index"
```

When duplicate decorative within same region:

```text
alt=""
```

Don't announce same logo twice in header + adjacent body unnecessarily.

---

# 180. INTRO BODY LOGO ACCESSIBILITY

Header already has alt.

Intro logo could:

```text
alt=""
```

because heading contains CEO Workforce Index.

Or use alt if header not part of semantic context.

Prefer avoiding duplicate announcements.

---

# 181. REPORT LOGO ALT

Use:

```text
alt="CEO Workforce Index"
```

because report is standalone deliverable.

---

# 182. REPORT PRINT LOGO ALT

Screen hidden, irrelevant to screen reader.

Fine.

---

# 183. BRAND ASSET PATH

Reuse:

```ts
figmaAssets.cwiLogo
figmaAssets.arrow1
```

Do not copy files into Survey folder.

---

# 184. CONSIDER SHARED BRAND ACTION COMPONENT

Optional but recommended:

```tsx
type SurveyActionButtonProps = ...
```

However don't over-engineer.

If only 2 classes enough, keep native buttons.

---

# 185. PREFERRED SMALL HELPER

Create:

```tsx
export function SurveyArrow() {
  return (
    <img
      src={figmaAssets.arrow1}
      alt=""
      aria-hidden="true"
      className="survey-button-arrow"
    />
  )
}
```

Can live `SurveyChrome.tsx`.

---

# 186. REPLACE LUCIDE ARROWRIGHT ONLY WHERE BRAND CTA

Don't remove Lucide ArrowRight from:

- semantic non-brand action if used;
- roundtable outline if desired.

But primary CTA uses brand arrow.

---

# 187. MOBILE BUTTON TOUCH TARGET

Minimum:

```text
44px
```

Pill CTA >=48.

---

# 188. RESPONSIVE TEST — PRIMARY BUTTON

Test:

```text
360×800
375×812
390×844
430×932
```

Ensure no overflow.

---

# 189. REPORT REQUIREMENT DATA BOUNDARY

Do not mix:

```text
wireframe requirement
```

with:

```text
actual market values
```

Build layout now.

Wire actual data later/now if source exists.

---

# 190. SEARCH SOURCE BEFORE DECLARING MARKET DATA ABSENT

Agent must search project for:

```text
Teaser
benchmark
300+
78/100
61%
market
quartile
```

If real structured data exists, reuse.

If not, don't fabricate.

---

# 191. REPORT DATA FILE

If market data needs a local config, create:

```text
src/features/survey/surveyReportData.ts
```

Only if useful.

Do not overload `surveyData.ts` if it already focuses survey copy/questions.

---

# 192. `surveyReportData.ts` TYPES

Example:

```ts
export type MarketMetric = {
  label: string
  value: string
  description: string
}

export type MarketSeriesPoint = {
  label: string
  value: number
}
```

---

# 193. DEMO MODE

If using demo data temporarily:

```ts
export const marketBenchmarkData = {
  status: 'demo',
  ...
}
```

UI must show:

```text
Dữ liệu minh họa
```

---

# 194. PRODUCTION MODE

Later:

```ts
status: 'live'
```

remove demo badge via state logic.

---

# 195. PRIVATE ANALYSIS DATA SOURCE

Search source for analysis mapping.

If none:

Do not invent.

Build structure around available signals.

---

# 196. ANALYSIS PLACEHOLDER POLICY

Avoid visible ugly placeholders in CEO production experience.

If analysis isn't ready:

render:

```text
Tín hiệu doanh nghiệp
```

only.

Do not show:

```text
TODO
Coming soon
AI analysis pending
```

to CEO.

---

# 197. REPORT CONTENT LABEL

Change current:

```text
Phần định danh
```

to:

```text
Phân tích riêng cho doanh nghiệp
```

only if content actually includes analysis.

If still only raw answers:

keep:

```text
Bối cảnh doanh nghiệp
```

until analysis data exists.

---

# 198. NO FALSE CLAIMS

UI text must not imply:

- market benchmark if none;
- AI analysis if none;
- recommendation if none;
- percentile if none.

---

# 199. REPORT MARKET CONTEXT IF NO DATA

If no source available, use transparent state:

```text
KẾT QUẢ THỊ TRƯỜNG

Dữ liệu đối chuẩn sẽ được tổng hợp
từ Teaser Report của chương trình.
```

But user requested report content. Prefer implementing data wiring architecture now.

---

# 200. UI VISUAL PRIORITY

Highest visual focal point in Survey:

```text
question
```

Highest visual focal point in Report:

```text
report identity + key results
```

Not logo.

Logo is anchor, not hero.

---

# 201. LOGO SIZE CAP

Never exceed:

```text
160px
```

inside Survey UI.

---

# 202. BRAND RED USAGE CAP

Use red mainly:

- primary action.

Do not color every heading red.

---

# 203. BLUE USAGE

Blue is structural:

- progress;
- eyebrow;
- numbers;
- chart;
- focus.

---

# 204. SURVEY BACKGROUND

Current soft grey desktop / white mobile is good.

Keep.

---

# 205. INTRO BACKGROUND

No gradient.

Keep.

---

# 206. REPORT BACKGROUND

No gradient.

Keep.

---

# 207. BUTTON SHADOW

Landing CTA has shadow.

Survey can use lighter shadow:

```text
0 12px 28px rgba(...)
```

Do not use same 38px dramatic hero shadow everywhere.

---

# 208. HERO CTA VS INTERNAL CTA

Differentiate:

Intro:

```text
stronger shadow
56px
```

Internal:

```text
lighter shadow
50–52px
```

---

# 209. CSS TOKENS FOR TWO LEVELS

Optional:

```css
--survey-action-shadow:
  inset ...,
  0 10px 24px ...;

--survey-action-shadow-hero:
  inset ...,
  0 16px 32px ...;
```

---

# 210. `survey-intro-actions` MOBILE

Current full-width.

Good.

Primary can max width:

```text
344px
```

or full available width.

Follow Landing mobile:

```text
min(100%, 344px)
```

if aligned left.

---

# 211. QUESTION PRIMARY MOBILE

Do not force 344px.

Needs fit actions row.

---

# 212. CONTACT BUTTON MOBILE

Full width.

Good.

---

# 213. REPORT ACTION MOBILE

Full width.

Good.

---

# 214. MODAL ACTION MOBILE

Full width.

Good.

---

# 215. DESKTOP CONTACT ACTION

Primary left.

Review answers right.

Current layout does this.

Good.

---

# 216. OUTLINE BUTTON BLACK VS NAVY

Landing uses black.

Survey may use:

```text
#00132f
```

to harmonize CWI navy.

Preferred.

It still reads Landing-like without pure black harshness.

---

# 217. BUTTON CORNER CONSISTENCY

Primary / outline CTA:

```text
999px
```

Utility:

```text
8–12px
```

Answer:

```text
12px
```

Input:

```text
10px
```

Modal:

```text
16–20px optional
```

---

# 218. MODAL CURRENT NO RADIUS

Current `.survey-modal` has no radius.

Add:

Desktop:

```text
18px
```

Mobile bottom sheet:

```text
20px 20px 0 0
```

---

# 219. MODAL CLOSE

Current square.

Add:

```text
border-radius: 50%;
```

or 12px.

Preferred circle because icon-only utility.

---

# 220. DRAWER CLOSE

Same.

Circle or 12px.

---

# 221. MOBILE DRAWER CURRENT RADIUS

20px top.

Good.

Keep.

---

# 222. DRAWER DESKTOP

Right drawer can use:

```text
0
```

radius because edge-attached.

Good.

---

# 223. FORM ERROR

Current global error appears after consent.

For name/email validation, ideally show near fields.

But do not over-refactor logic if time.

At minimum:

- error directly before form actions;
- clear red;
- no floating alert card.

Current acceptable.

---

# 224. QUESTION ERROR

Current inline + duplicate?

`QuestionCard` receives `error`.

Then `SurveyQuestionPage` renders error again.

Inspect `QuestionCard`.

Ensure error is not displayed twice.

---

# 225. ERROR SINGLE SOURCE

Final question screen must show one error only.

Recommended location:

```text
after answer controls
before action row
```

---

# 226. ERROR ARIA

`role="alert"`.

Good.

---

# 227. PROGRESS ARIA

Current:

```text
aria-label="Câu X trên Y"
```

Need include completion:

```text
Câu 7 trên 18. Đã hoàn tất 5 câu.
```

---

# 228. MOBILE NAV ARIA

Same.

---

# 229. QUESTION DRAWER ANSWERED STATE

Current green check.

Good.

Keep.

---

# 230. QUESTION DRAWER ACTIVE STATE

Current left blue accent.

Good.

Keep.

---

# 231. QUESTION DRAWER LOGO

Optional only after UX fixes.

Don't let logo consume vertical height mobile.

---

# 232. DESKTOP QUESTION DRAWER TOP

Current starts below header at `top:72px`.

Good.

---

# 233. HEADER PHASE LABELS

Recommended:

```text
Intro:
CEO Workforce Index

Part 1:
Phần 1

Part 2:
Phần 2

Contact:
Nhận báo cáo

Loading:
Đang phân tích

Result:
Báo cáo
```

---

# 234. HEADER SECONDARY STATE MOBILE

Hide.

Desktop can show.

---

# 235. REPORT HEADER APP NAV

Current app header remains visible on screen result.

Okay.

Body report logo still needed because:

- report identity;
- print;
- standalone screenshot.

---

# 236. RESULT SCREEN LOGO DUPLICATION

App header logo + report logo both visible near top.

Acceptable only if spacing.

Could hide header logo on result desktop? Not necessary.

Alternative:

keep app header logo small 92px,
report brand logo ~120px after 56px shell padding.

Good.

---

# 237. MOBILE RESULT

Header logo + report logo may appear too close.

On mobile, reduce report logo:

```text
88–96px
```

and top margin.

---

# 238. PRINT REPORT TITLE

Must not print application eyebrow like:

```text
PHẦN 1 + PHẦN 2 · BÁO CÁO
```

as sole identity.

Need full CWI title.

---

# 239. REPORT METADATA

Possible:

```text
CEO Workforce Index
Q3/2026
```

No invented respondent/company metadata unless available.

---

# 240. PRIVATE REPORT CONFIDENTIAL

If appropriate from product requirement, could show:

```text
Riêng tư
```

Do not add legal “Confidential” if not desired.

Print footer “Confidential” only if project requires.

If uncertain, omit.

---

# 241. MARKET CONTEXT SCREEN ORDER

Recommended final report order:

```text
Cover / identity

01 Market Context

02 Your Results
   Leadership Capacity
   Scale Readiness

03 5 Competency Domains
   Radar
   Bars

04 Answers Appendix

05 Private Analysis
   only private mode

CEO Roundtable

Actions
```

---

# 242. PRIVATE SECTION ORDER

Place private analysis after Part 1 result.

Matches requirement.

---

# 243. MARKET CONTEXT BEFORE PERSONAL SCORE

Requirement does this.

Keep.

Gives benchmark framing.

---

# 244. DO NOT PUT ROUND TABLE BEFORE REPORT

Already fixed.

Do not regress.

---

# 245. REPORT SCORE LABEL LANGUAGE

Current English:

```text
Leadership Capacity
Scale Readiness
```

Requirement uses these.

Keep.

Could add Vietnamese sublabel only if already defined.

Do not invent translation.

---

# 246. DOMAIN NAMES

Use exactly current scoring domain names.

Do not rename for style.

---

# 247. REPORT CHART RESPONSIVE

At <768:

SVG width 100%.

No fixed px greater viewport.

---

# 248. CHART TOOLTIP

Not required.

CEO report should work without hover.

---

# 249. CHART LABELS

Must be visible without hover.

---

# 250. PRINT CHART

Must preserve labels.

---

# 251. SCREENSHOT QUALITY

Report must look good in screenshots at:

```text
1440×900
```

and mobile:

```text
390×844
```

---

# 252. LANDING REGRESSION

No changes to:

```text
landing.css
LandingPage.tsx
```

unless shared asset import only.

Do not change button on Landing while trying to match Survey.

---

# 253. SHARED ASSET IMPORT DOES NOT COUNT AS LANDING CHANGE

Using:

```ts
figmaAssets
```

from Landing module is acceptable.

Long-term shared assets could move, but not necessary now.

---

# 254. CSS REFACTOR POLICY

Modify existing definitions.

Do not append:

```text
/* V3 FINAL OVERRIDE */
```

at end.

---

# 255. CSS TARGET ORDER

Keep/organize:

```text
tokens
base
shared controls
header
intro
questions
navigation
contact
loading
report
modal
tablet
mobile
reduced motion
print
```

---

# 256. REMOVE DEAD RULES

After implementation:

run search for unused selectors.

Delete obsolete.

---

# 257. DO NOT DUPLICATE PRIMARY CSS

One base:

```css
.survey-primary-button
```

Then modifiers:

```css
.survey-primary-button--hero
```

if needed.

---

# 258. OPTIONAL CTA MODIFIER

Intro:

```tsx
className="
  survey-primary-button
  survey-primary-button--hero
"
```

---

# 259. BUTTON ICON ORDER

Primary forward:

```text
label → arrow
```

Download:

```text
download icon → label
```

Previous:

```text
left arrow → label
```

---

# 260. SURVEY HEADER BACK BUTTON

Do not style as pill.

It's utility navigation.

---

# 261. HEADER MENU DESKTOP

Do not style as red.

Utility.

---

# 262. MOBILE NAV `Danh sách`

Could use radius 999?

No.

Use:

```text
10–12px
```

small utility.

---

# 263. USER FLOW — TARGET PART 1

```text
Intro
↓
Q1
answer
↓ Next
Q2
...
↓
Q18
answer
↓
validate Part 1
↓
Part 2 Q19
```

---

# 264. USER FLOW — TARGET PART 2 SKIP

At Part 2:

User has 0 answers.

If user chooses secondary:

```text
Nhận Báo cáo Phần 1
```

→ contact1.

---

# 265. USER FLOW — TARGET PART 2 STARTED

User answers Q19.

Then cannot silently skip incompletely using primary.

Must:

- complete Part 2;
- or explicit secondary action to Part 1 report.

Preserve business logic.

---

# 266. USER FLOW — CONTACT1 REVIEW

```text
Contact Part 1
→ Review
→ Q18 Part 1
```

---

# 267. USER FLOW — CONTACT2 REVIEW

```text
Contact Private
→ Review
→ Q24 Part 2
```

---

# 268. USER FLOW — REPORT

```text
Contact
↓
Loading
↓
Report immediately
```

No Roundtable intercept.

Keep.

---

# 269. REPORT ROUND TABLE

Invitation after core report.

Good.

---

# 270. CWI LOGO FLOW

Recommended visible journey:

```text
Landing logo/system
↓
Survey Header CWI
↓
Intro CWI
↓
Question Header CWI
↓
Contact Header + CWI trust mark
↓
Loading CWI
↓
Report CWI identity
↓
Roundtable optional CWI
```

---

# 271. BRAND FREQUENCY RULE

Logo reinforcement occurs at **transition moments**, not every interaction.

Transition moments:

- entry;
- identity/data handoff;
- processing;
- result;
- event invitation.

---

# 272. TYPOGRAPHY

Keep Inter Variable.

No new font.

---

# 273. REPORT TITLE WEIGHT

Current 620 okay.

Keep 600–650.

Avoid 800.

---

# 274. BUTTON WEIGHT

Landing hero uses 400 currently in CSS, other mobile CTA ~680.

Survey internal target:

```text
600–650
```

Intro:

```text
600
```

Avoid overly bold SaaS button.

---

# 275. BUTTON FONT SIZE

Desktop internal:

```text
15px
```

Intro:

```text
16px
```

Mobile internal:

```text
14–15px
```

---

# 276. BRAND RED SHADOW ON MOBILE

Reduce:

```text
0 8px 20px rgba(...)
```

because mobile frequent buttons.

---

# 277. PERFORMANCE

No continuous animation except optional loader.

Chart pure SVG.

No huge blur.

---

# 278. REDUCED MOTION

Add:

```css
@media (prefers-reduced-motion: reduce) {
  .survey-button-arrow {
    transition: none;
  }
}
```

Already global transition duration mostly handles.

---

# 279. REPORT DATA TEST

Test scores:

```text
all 1
all 3
all 5
mixed
```

Radar and bars must handle:

```text
0–100
```

correctly.

---

# 280. RADAR EDGE CASE

If score 0:

polygon should render safely.

No NaN.

---

# 281. DOMAIN COUNT ASSUMPTION

Do not hardcode exactly five vertices if `scores.domains` can differ.

But requirement says 5 groups.

Implementation can support dynamic count easily.

Preferred dynamic.

---

# 282. MARKET DATA EDGE CASE

No `series`:

render metrics or unavailable state.

No crash.

---

# 283. PRINT EDGE CASE

Details expanded in print.

Already implemented.

Ensure radar not clipped.

---

# 284. CONTACT CONSENT EDGE CASE

`No` disables private submit.

Existing logic.

Keep.

---

# 285. FORM AUTOCOMPLETE

Keep.

---

# 286. LOGO SVG

Use existing SVG for crisp print.

Good.

---

# 287. ARROW SVG

Use existing arrow asset.

Good.

---

# 288. QUESTION DRAWER ACTIVE COUNT

Completed count should update immediately after answer.

Current state makes this possible.

---

# 289. MOBILE PROGRESS UPDATE

After answer Q5:

bar updates.

Position stays Q5 until Next.

This is correct.

---

# 290. DO NOT AUTO-MARK CURRENT AS COMPLETE BEFORE OTHER INPUT FILLED

For `Mục khác`:

completion only if actual other text satisfies current `hasQuestionAnswer`.

Keep scoring helper semantics.

---

# 291. PROGRESS COLOR

CWI blue.

Do not use red for progress.

---

# 292. REPORT SCORE TRACK

Navy/blue.

No gradient.

---

# 293. PRIMARY BUTTON IS THE MAIN RED ELEMENT

This creates intentional brand focus.

---

# 294. INTRO CWI LOGO SPACING

Desktop:

```text
margin-bottom: 18–24px
```

Mobile:

```text
16–20px
```

---

# 295. CONTACT CWI LOGO SPACING

```text
margin-bottom: 20px
```

---

# 296. LOADING CWI LOGO SPACING

Center.

```text
margin-bottom: 20px
```

---

# 297. REPORT CWI LOGO SPACING

```text
margin-bottom: 24–28px
```

---

# 298. DRAWER CWI LOGO SPACING

Small, same row as close optional.

---

# 299. ROUND TABLE LOGO

Don't use if modal becomes cluttered.

P2.

---

# 300. IMPLEMENTATION PRIORITY

## P0 — mandatory correctness

- sequential Next;
- completion progress;
- mobile duplicate progress;
- duplicate navigator;
- Contact Part 1 back;
- header contact back.

## P1 — mandatory brand

- buttons match Landing DNA;
- arrow asset;
- CWI Intro;
- Contact;
- Loading;
- Report;
- print.

## P1 — mandatory Report

- Market section architecture;
- market visualization with truthful data state;
- radar + bars;
- report identity;
- private analysis structure.

## P2

- Drawer logo;
- Roundtable logo;
- minor modal polish.

---

# 301. FILE-BY-FILE IMPLEMENTATION PLAN

---

# 302. `SurveyChrome.tsx`

Modify:

- introduce `SurveyBrandMark`;
- introduce `SurveyForwardArrow`;
- simplify mobile header menu behavior through CSS or prop;
- use BrandMark in header.

Potential exports:

```tsx
SurveyHeader
SurveyEyebrow
SurveyBrandMark
SurveyForwardArrow
```

---

# 303. `SurveyQuestionPage.tsx`

Modify:

- calculate `completionProgress`;
- position remains separate;
- pass `completedCount` to MobileQuestionNav;
- brand arrow on primary;
- remove duplicate mobile desktop progress via CSS;
- keep current question architecture.

Do not re-map all questions.

---

# 304. `SurveyNavigation.tsx`

Modify:

- `MobileQuestionNav` accepts `completedCount`;
- progress = completion;
- display position + completion;
- mobile navigator remains only drawer entry;
- add drawer focus trap;
- optional CWI logo.

---

# 305. `SurveyExperience.tsx`

Modify:

- `continuePartOne()`;
- `continuePartTwo()`;
- Contact Part 1 review;
- header back contact behavior;
- no scoring changes.

---

# 306. `QuestionCard.tsx`

Modify only visual markup if required:

- Likert/MCQ classes already enough;
- no brand logo;
- ensure one error source.

Do not change answer values.

---

# 307. `SurveyScreens.tsx`

Main work:

- Intro brand mark;
- remove duplicate landing back;
- Contact brand mark;
- Loading brand mark;
- Report brand identity;
- MarketBenchmarkSection;
- DomainRadar;
- Private analysis presentation architecture;
- brand arrows;
- print brand block;
- optional modal brand.

---

# 308. `survey.css`

Main visual implementation.

Do not append patch.

Refactor existing rules.

---

# 309. `surveyData.ts`

Do not alter survey copy.

Only add report copy if requirement text already exists and belongs there.

Prefer separate report data file.

---

# 310. `surveyScoring.ts`

Do not modify scoring unless needed for a presentation-safe helper.

No logic changes.

---

# 311. OPTIONAL `surveyReportData.ts`

Create if market data or report-specific types need separation.

---

# 312. INTRO JSX TARGET

Example structure:

```tsx
<section className="survey-intro-screen">

  <div className="survey-intro-brand">
    <SurveyBrandMark variant="intro" />
    <span>
      CEO WORKFORCE INDEX · 2026Q3
    </span>
  </div>

  <div className="survey-intro-copy">
    <SurveyEyebrow>
      GIỚI THIỆU
    </SurveyEyebrow>

    ...
  </div>

  ...

  <div className="survey-intro-actions">
    <button
      className="
        survey-primary-button
        survey-primary-button--hero
      "
    >
      Bắt đầu khảo sát
      <SurveyForwardArrow />
    </button>
  </div>
</section>
```

No body Back button.

---

# 313. CONTACT JSX TARGET

```tsx
<section className="survey-form-screen">

  <SurveyBrandMark variant="trust" />

  <SurveyEyebrow>
    ...
  </SurveyEyebrow>

  <h1>...</h1>

  ...
</section>
```

---

# 314. LOADING JSX TARGET

```tsx
<section className="survey-loading-screen">

  <SurveyBrandMark variant="trust" />

  <SurveyEyebrow>
    ĐANG PHÂN TÍCH
  </SurveyEyebrow>

  <h1>...</h1>

  ...
</section>
```

---

# 315. REPORT JSX TARGET

```tsx
<section className="survey-result-screen">

  <ReportIdentity ... />

  <MarketBenchmarkSection ... />

  <PersonalScoreSection ... />

  <DomainAnalysisSection ... />

  <AnswerAppendix ... />

  {private && (
    <PrivateAnalysisSection ... />
  )}

  <RoundtableInvitation />

  <ResultActions />
</section>
```

Break current `ResultScreen` into internal components if file readability improves.

---

# 316. RESULT COMPONENT REFACTOR

Recommended components inside same file or small files:

```text
ReportIdentity
MarketBenchmarkSection
PersonalScoreSection
DomainRadar
DomainAnalysisSection
AnswerAppendix
PrivateAnalysisSection
```

Do not create 20 tiny files.

---

# 317. REPORT IDENTITY COMPONENT

Props:

```ts
{
  mode: 'part1' | 'private'
}
```

No answer data required.

---

# 318. MARKET COMPONENT

Props:

```ts
{
  data?: MarketBenchmarkData
}
```

---

# 319. DOMAIN RADAR

Props:

```ts
{
  domains: ScoreSet['domains']
}
```

---

# 320. PRIVATE ANALYSIS

Props:

```ts
{
  answers
  otherAnswers
}
```

Potential future analysis data.

---

# 321. REPORT HEAD COPY

Do not invent new promise.

Use existing:

```text
Báo cáo Khuyết danh
Báo cáo Riêng tư
```

plus program identity.

---

# 322. CHART REQUIREMENT FROM HTML

Do not interpret requirement as:

```text
must copy old radar CSS
```

Interpret as:

```text
CEO needs a visual summary
of five competency domains.
```

---

# 323. MARKET REQUIREMENT FROM HTML

Interpret:

```text
CEO needs market context
from Teaser Report.
```

Not:

```text
hardcode old demo curve.
```

---

# 324. REPORT MINI STATS REQUIREMENT

If real values available, show.

If not, do not fake.

---

# 325. BENCHMARK SOURCE SEARCH

Before implementation:

```bash
rg -n \
  "Teaser|benchmark|quartile|300\\+|78/100|61%" \
  src
```

Document result in handoff.

---

# 326. REPORT V1 IF NO MARKET DATA

Even without market source, Report can still be visually complete with:

```text
market placeholder state
personal scores
radar
bars
answers
private context
```

But must explicitly flag missing data internally in handoff.

---

# 327. NO USER-FACING “SYSTEM LIMITATION” COPY UNLESS NEEDED

If this is still prototype:

demo label acceptable.

If production:

don't show technical missing-data message.

Ask product/data owner later.

For current agent implementation, use provided requirement responsibly.

---

# 328. BUTTON CSS — REFERENCE IMPLEMENTATION

Suggested:

```css
.survey-primary-button {
  align-items: center;
  justify-content: center;
  gap: 9px;

  min-height: 52px;
  padding: 13px 24px;

  border: 1px solid
    var(--survey-action-red-border);

  border-radius: 999px;

  background:
    linear-gradient(
      180deg,
      var(--survey-action-red-top) 0%,
      var(--survey-action-red-mid) 46%,
      var(--survey-action-red-bottom) 100%
    );

  color: #fff;

  box-shadow:
    var(--survey-action-red-shadow);

  font-size: 15px;
  font-weight: 650;

  transition:
    transform 180ms cubic-bezier(.2,.8,.2,1),
    filter 180ms ease,
    box-shadow 180ms ease;
}
```

---

# 329. OUTLINE CSS — REFERENCE

```css
.survey-outline-button {
  min-height: 50px;
  padding: 12px 20px;

  border: 1px solid
    var(--survey-action-outline);

  border-radius: 999px;

  background: #fff;
  color: var(--survey-action-outline);

  box-shadow: none;
}
```

---

# 330. ANSWER CSS — REFERENCE

```css
.survey-likert-grid label,
.survey-options label,
.survey-consent-option label {
  border-radius: 12px;
}
```

---

# 331. MODAL CSS — REFERENCE

```css
.survey-modal {
  border-radius: 18px;
}

@media (max-width: 767px) {
  .survey-modal {
    border-radius: 20px 20px 0 0;
  }
}
```

---

# 332. LOGO VARIANT CSS

```css
.survey-brand-mark {
  display: block;
  width: 100%;
  height: auto;
}

.survey-brand-mark--header {
  max-width: 92px;
}

.survey-brand-mark--intro {
  max-width: 136px;
}

.survey-brand-mark--trust {
  max-width: 112px;
}

.survey-brand-mark--report {
  max-width: 132px;
}
```

Responsive adjust.

---

# 333. PRINT BRAND

```css
.survey-report-print-brand {
  display: none;
}

@media print {
  .survey-report-print-brand {
    display: flex;
  }
}
```

---

# 334. REPORT COVER CSS DIRECTION

```css
.survey-report-identity {
  padding-bottom: 42px;
  border-bottom:
    1px solid var(--survey-border);
}
```

No card.

---

# 335. SECTION GRID FOR RADAR

```css
.survey-domain-analysis-layout {
  display: grid;
  grid-template-columns:
    minmax(260px, .8fr)
    minmax(0, 1.2fr);
  gap: 48px;
  align-items: center;
}
```

---

# 336. MOBILE RADAR GRID

```css
@media (max-width: 767px) {
  .survey-domain-analysis-layout {
    grid-template-columns: 1fr;
    gap: 32px;
  }
}
```

---

# 337. MARKET METRIC ROW

```css
.survey-market-metrics {
  display: grid;
  grid-template-columns:
    repeat(3, minmax(0,1fr));
  border-top: 1px solid ...;
  border-bottom: 1px solid ...;
}
```

Each:

```text
padding: 24px
```

Use dividers.

---

# 338. MOBILE MARKET METRICS

1 column.

Each row border bottom.

---

# 339. REPORT SECTION NUMBERS

Use:

```tsx
<span className="survey-report-section-number">
  01
</span>
```

No eyebrow dot required if number already acts as label.

---

# 340. EYEBROW DOT

Current `SurveyEyebrow` adds square dot via:

```css
6px square
```

Fine.

Could add `border-radius: 50%` if brand prefers dot.

Current square isn't harmful.

Do not spend time unless visual mismatch.

---

# 341. CWI LOGO ON WHITE

Use original asset.

No white card behind logo.

---

# 342. CWI LOGO BACKGROUND

Do not add badge.

---

# 343. DO NOT ADD WATERMARK LOGOS

No giant low-opacity logo.

Looks cheap.

---

# 344. DO NOT ADD LOGO IN PROGRESS BAR

No.

---

# 345. DO NOT ADD LOGO INSIDE CTA

No.

---

# 346. DO NOT ADD LOGO IN EVERY REPORT SECTION

No.

Report cover only.

---

# 347. BRANDING THROUGH BUTTONS IS HIGHER PRIORITY THAN EXTRA LOGOS

If time constrained:

1. button parity;
2. report identity;
3. contact/loading logo;
4. optional drawer/modal logo.

---

# 348. VISUAL REVIEW CRITERIA — SURVEY

At first glance:

- question is dominant;
- progress is secondary;
- navigation is tertiary;
- red CTA is clear;
- CWI brand is recognizable;
- no clutter.

---

# 349. VISUAL REVIEW CRITERIA — REPORT

At first glance:

- this is CWI;
- this is a report;
- CEO can see key score quickly;
- market context is visible;
- 5 domains are understandable;
- no dashboard overload.

---

# 350. MOBILE REVIEW CRITERIA

At 390px:

- one progress only;
- one drawer trigger only;
- logo not oversized;
- CTA pill fits;
- previous button remains 48px;
- no horizontal scroll;
- 5 Likert controls fit;
- chart labels readable;
- report metrics stack.

---

# 351. DESKTOP REVIEW CRITERIA

At 1440px:

- Survey feels aligned with Landing brand;
- content width not excessive;
- report figure balanced;
- no generic grey rectangular CTAs;
- no excessive empty area;
- no giant logo.

---

# 352. TABLET REVIEW

At 768/820:

- primary pill not wrap;
- radar may stack before 768 if cramped;
- report margins adequate;
- drawer works.

---

# 353. ACCESSIBILITY CHECKLIST

- [ ] button focus visible
- [ ] radio focus visible
- [ ] drawer focus trap
- [ ] drawer Escape
- [ ] drawer focus restore
- [ ] modal focus trap
- [ ] modal Escape
- [ ] modal focus restore
- [ ] no color-only answered state
- [ ] chart has text alternative
- [ ] bars show numeric values
- [ ] progress aria reflects completion
- [ ] logo alt appropriate
- [ ] touch target >=44px

---

# 354. FUNCTIONAL CHECKLIST — PART 1

- [ ] Q1 opens
- [ ] answer saves
- [ ] Next → Q2
- [ ] jump Q7
- [ ] Next Q7 → Q8
- [ ] unanswered current blocks Next
- [ ] progress = completed
- [ ] position independent
- [ ] Q18 validates full Part
- [ ] if missing, jump first missing
- [ ] if complete, Part 2 opens

---

# 355. FUNCTIONAL CHECKLIST — PART 2

- [ ] Q19 opens
- [ ] sequential Next
- [ ] zero-answer skip Part 2 works
- [ ] started Part requires complete for private report
- [ ] explicit Part 1 report action works
- [ ] Q24 final validation works

---

# 356. FUNCTIONAL CHECKLIST — CONTACT

- [ ] Contact Part 1 review → Part 1 Q18
- [ ] Contact Part 2 review → Part 2 Q24
- [ ] header Back same behavior
- [ ] name validation
- [ ] email validation
- [ ] consent
- [ ] no-consent private block
- [ ] skip private works

---

# 357. FUNCTIONAL CHECKLIST — REPORT

- [ ] Part 1 score renders
- [ ] Scale renders
- [ ] domains render
- [ ] radar uses same domain values
- [ ] market state doesn't fake data
- [ ] 18 answers render
- [ ] private signals render
- [ ] Roundtable after report
- [ ] PDF print
- [ ] home

---

# 358. BRAND CHECKLIST

- [ ] Survey primary matches Landing visual DNA
- [ ] Survey outline matches Landing DNA
- [ ] forward arrows use `figmaAssets.arrow1`
- [ ] header CWI
- [ ] intro CWI
- [ ] contact CWI
- [ ] loading CWI
- [ ] report CWI
- [ ] print CWI
- [ ] no logo spam
- [ ] no question-body logo

---

# 359. REPORT REQUIREMENT CHECKLIST

- [ ] market context
- [ ] market visualization
- [ ] benchmark metrics or truthful unavailable state
- [ ] Leadership Capacity
- [ ] Scale Readiness
- [ ] 5 groups radar
- [ ] 5 groups bars
- [ ] 18 answers
- [ ] private context
- [ ] private analysis architecture
- [ ] recommendation fields only when source exists

---

# 360. CSS CHECKLIST

- [ ] no giant appended override block
- [ ] no duplicate `.survey-primary-button`
- [ ] no duplicate mobile breakpoint
- [ ] button tokens centralized
- [ ] answer controls 12px radius
- [ ] modal radius
- [ ] no glass
- [ ] no radial background
- [ ] no neon
- [ ] shadows only purposeful

---

# 361. QA VIEWPORTS

Desktop:

```text
1440×900
1366×768
1280×800
```

Tablet:

```text
1024×768
820×1180
768×1024
```

Mobile:

```text
430×932
390×844
375×812
360×800
```

---

# 362. REQUIRED QA SCREENS

Screenshot/check:

```text
Intro
Part 1 Q1
Part 1 mid
Part 1 error
Part 1 Q18
Part 2 Q19
Part 2 other input
Part 2 Q24
Question drawer
Contact Part 1
Contact Private
Consent No
Loading
Report Part 1
Report Private
Radar desktop
Radar mobile
Market section desktop
Market section mobile
Roundtable invitation
Roundtable modal
Print preview
```

---

# 363. REQUIRED INTERACTION QA

Test manually:

```text
Q1 answer
Q1 next
drawer jump Q7
Q7 answer
Q7 next
back
forward
final missing validation
```

---

# 364. REGRESSION — LANDING

Before/after screenshot Landing:

```text
1440×900
390×844
```

No visual changes allowed.

---

# 365. BUILD / LINT

Run project existing commands.

If pre-existing toolchain error exists:

- report;
- do not modify package/tsconfig unless required by this task.

---

# 366. DO NOT “FIX” LANDING TO MAKE PARITY

Survey follows Landing.

Landing does not follow Survey.

---

# 367. CODE QUALITY

Avoid:

```text
inline style for every chart
```

Some dynamic width styles are fine.

Use CSS classes.

---

# 368. SVG RADAR HELPER

Keep math in small pure function.

Example:

```ts
function polarPoint(...) { ... }
```

No complex state.

---

# 369. SVG RADAR DATA

Normalize:

```ts
value / 100
```

Clamp 0–100.

---

# 370. MARKET VISUAL DATA

Likewise validate.

---

# 371. REPORT `details`

Keep semantic `<details>`.

Good.

---

# 372. MOBILE `details`

Summary touch target >=48.

---

# 373. REPORT ACTION STICKINESS

Do not make sticky.

Report browsing is document mode.

---

# 374. QUESTION ACTION STICKINESS

Current actions inside card.

Keep.

Do not add bottom fixed bar unless user testing shows need.

---

# 375. MOBILE QUESTION NEXT VISIBILITY

At 800px height, Next should typically be reachable without excessive scroll for normal Likert question.

Long MCQ may scroll.

Okay.

---

# 376. FIRST QUESTION HEIGHT

Intro context + question may push CTA down.

Acceptable but tighten first context.

---

# 377. NO AUTO-HIDE HEADER

Survey header sticky.

Keep.

---

# 378. MOBILE STICKY HEADER

Good.

Ensure MobileQuestionNav isn't also sticky unless required.

Current normal flow likely fine.

---

# 379. QUESTION NAV PROGRESS

Do not make sticky below header unless long question needs it.

With one question, not necessary.

---

# 380. BRAND BUTTON IN QUESTION CARD

Red CTA visually dominant enough.

Do not add red selection states.

---

# 381. SELECTED ANSWER COLOR

Navy.

Good contrast with red CTA.

---

# 382. COLOR ROLE SYSTEM

```text
Red = action
Blue = structure / data
Navy = selected / authority
Green = completed
Error red-dark = error
Neutral = surfaces
```

Follow consistently.

---

# 383. DO NOT USE GREEN FOR SCORE QUALITY

Unless methodology.

Green only:

```text
answered / success
```

---

# 384. DO NOT USE RED FOR LOW SCORE

Unless methodology.

---

# 385. REPORT INTERPRETATION

No color coding high/low without thresholds.

---

# 386. CWI REPORT ASSET REUSE

Only logo + brand colors.

No new fake certification marks.

---

# 387. REPORT DOWNLOAD

`window.print()` still acceptable for prototype.

Do not implement PDF library in this pass.

---

# 388. PRINT BUTTON LABEL

Can remain:

```text
Tải xuống PDF
```

if browser print saves PDF in intended environment.

---

# 389. REPORT SOURCE NOTE

If market data real:

show source.

If not:

demo label.

---

# 390. REPORT PERIOD

Q3/2026.

Use existing program term.

---

# 391. CONTENT PRESERVATION

Do not paraphrase:

- intro paragraphs;
- survey questions;
- consent copy;
- Roundtable content.

UI labels can be adjusted minimally for UX:

```text
GIỚI THIỆU
Câu X/Y
x hoàn tất
```

---

# 392. PRIVATE REPORT CONTENT

Do not silently make consulting recommendations.

Presentation architecture only if logic absent.

---

# 393. REPORT REQUIREMENT IS NOT A LICENSE TO INVENT DATA

Critical.

---

# 394. DEFINITION OF DONE — UX

Done only if:

- Next sequential;
- progress truthful;
- no duplicate mobile progress;
- no duplicate mobile drawer trigger;
- contact review correct.

---

# 395. DEFINITION OF DONE — BRAND

Done only if:

- red CTA looks like same brand as Landing;
- outline action feels same family;
- arrow asset same;
- strategic CWI logo placement complete.

---

# 396. DEFINITION OF DONE — REPORT

Done only if:

- Report visibly feels like CWI deliverable;
- market area is not empty heading;
- 5 domains have visual summary;
- actual domain values used;
- no fake market data;
- private architecture aligned with requirement.

---

# 397. DEFINITION OF DONE — CODE

Done only if:

- no CSS patch pile;
- no new heavy dependencies;
- no landing regression;
- no survey content regression;
- build status reported.

---

# 398. DEFINITION OF DONE — MOBILE

Done only if:

- 360px works;
- 390px works;
- CTA fits;
- Likert fits;
- report chart responsive;
- drawer accessible.

---

# 399. HANDOFF FORMAT REQUIRED FROM AGENT

After implementation, return:

```text
1. Files changed
2. UX fixes implemented
3. Button parity changes
4. CWI logo placements
5. Report sections added
6. Market data source status
7. Radar implementation status
8. Private analysis data status
9. Desktop QA
10. Tablet QA
11. Mobile QA
12. Accessibility QA
13. Build/lint
14. Remaining gaps
```

---

# 400. AGENT MUST REPORT MARKET DATA HONESTLY

Example:

```text
Market benchmark UI implemented.
No production Teaser Report dataset was found.
Demo values were not presented as live data.
```

or:

```text
Market benchmark wired to X source.
```

---

# 401. AGENT MUST REPORT PRIVATE ANALYSIS HONESTLY

Example:

```text
Private analysis presentation structure implemented.
No recommendation engine/business rules exist in source,
so no recommendations were fabricated.
```

---

# 402. FAILURE CONDITIONS

Task is considered FAILED if any of these happen:

- long-form survey returns;
- Landing altered;
- all controls become pill;
- Survey primary remains flat solid red rectangle;
- progress still uses current position;
- contact1 review still goes Part 2;
- mobile has two question-list buttons;
- market heading remains empty with no visual/data state;
- radar uses fake data;
- hardcoded wireframe metrics shown as actual;
- CWI logo spammed in every question;
- report still looks like generic text page;
- agent appends another giant override pass.

---

# 403. FINAL DESIGN PRINCIPLE

Do not add more decoration.

Add:

```text
consistency
truthful data
brand continuity
clear navigation
report identity
```

The visual system should communicate:

> **CWI is a serious executive research program.**

Not:

> a generic survey tool with a logo.

And not:

> an AI-generated premium template.

---

# 404. FINAL IMPLEMENTATION DIRECTIVE

Implement the changes directly.

Do not only provide recommendations.

Start with P0 UX correctness.

Then implement Landing button parity.

Then CWI brand placement.

Then Report completion.

Do not spend time on decorative polish before the P0/P1 work is complete.

---

# 405. PRIORITY SUMMARY

## FIRST

```text
Sequential Next
Completion progress
Contact back
Mobile duplicate controls
```

## SECOND

```text
Landing button DNA
Brand arrow
CWI logo transitions
```

## THIRD

```text
Report identity
Market visualization
Radar + bars
Private report structure
```

## LAST

```text
Drawer logo
Roundtable logo
micro polish
```

---

# 406. EXPECTED END STATE

## Intro

```text
CWI identity
Editorial invitation
Premium Landing-family CTA
```

## Question

```text
Focused question
Truthful progress
Clean input
Brand CTA
```

## Contact

```text
Trusted CWI handoff
Clear consent
Brand action
```

## Loading

```text
CWI processing state
Minimal
Confident
```

## Result

```text
CWI executive research report
Market context
Personal scores
Five-domain visual analysis
Private context/analysis
Report actions
```

This is the target.
