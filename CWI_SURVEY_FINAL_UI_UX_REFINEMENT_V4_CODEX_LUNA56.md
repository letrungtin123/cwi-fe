# CWI SURVEY — FINAL UI/UX REFINEMENT V4
## Production Credibility, Executive Polish & Micro-UX
### Implementation specification for Codex / Luna 5.6 Extra High

---

# 0. PURPOSE

Đây là vòng **refinement cuối** cho Survey trong:

```text
source4(5).zip
```

Không phải redesign mới.

Architecture hiện tại đã đúng và phải được bảo toàn:

```text
Intro
→ Part 1: one-question-at-a-time
→ Part 2: one-question-at-a-time
→ Contact
→ Loading
→ Report
→ Roundtable
```

Mục tiêu V4:

> đưa sản phẩm từ **“good polished prototype”** thành **“production-ready executive research experience”**.

Trọng tâm không còn là thêm UI.

Trọng tâm là:

```text
remove prototype signals
improve hierarchy
reduce repetition
make interactions feel intentional
protect credibility
polish desktop/mobile composition
```

---

# 1. FINAL QUALITY TARGET

Survey hiện tại đã có core architecture tốt.

Vòng này không được phá nó.

Target sau V4:

```text
UI architecture          9/10+
UX correctness           9/10+
Executive credibility    9/10
Brand consistency        8.5/10+
Mobile usability         8.5/10+
Report presentation      8.5/10+
```

Không cần thêm flashy visual để đạt target.

---

# 2. SOURCE FILES TO WORK ON

Primary:

```text
src/features/survey/SurveyQuestionPage.tsx
src/features/survey/SurveyNavigation.tsx
src/features/survey/SurveyScreens.tsx
src/features/survey/SurveyExperience.tsx
src/features/survey/SurveyChrome.tsx
src/features/survey/survey.css
src/features/survey/surveyReportData.ts
```

Read-only unless genuinely required:

```text
src/features/survey/surveyData.ts
src/features/survey/surveyScoring.ts
```

Landing is visual reference only:

```text
src/features/landing/LandingPage.tsx
src/features/landing/landing.css
src/features/landing/figmaAssets.ts
```

---

# 3. NON-NEGOTIABLE — DO NOT REDESIGN CORE SURVEY

DO NOT:

- return to long-form 18 questions;
- show multiple question cards simultaneously;
- add side navigation rail back;
- add dashboard panels around question;
- add auto-advance;
- add animation between every answer;
- change question wording;
- change scoring;
- change Part 1 / Part 2 logic;
- move Roundtable before Report;
- add UI framework;
- add glassmorphism;
- add AI-looking glow;
- add decorative gradients beyond established CTA brand style.

---

# 4. PRIORITY LEVELS

This file uses:

```text
BLOCKER
P0
P1
P2
```

## BLOCKER

Must be fixed before CEO-facing production.

## P0

UX correctness / credibility issue.

## P1

Important visual refinement.

## P2

Nice micro-polish after higher priorities.

---

# 5. BLOCKER — REMOVE INTERNAL / DEVELOPER-FACING COPY FROM REPORT

Current implementation exposes internal data/application state directly to CEO.

Examples currently present:

```text
CHƯA CÓ DỮ LIỆU LIVE
```

```text
Dữ liệu benchmark sẽ được cập nhật từ Teaser Report.
```

```text
Trạng thái dữ liệu: chưa có dataset benchmark live trong nguồn hiện tại.
Không hiển thị số minh họa như kết quả thực tế.
```

These strings are unacceptable in CEO-facing production UI.

They communicate:

```text
unfinished product
missing integration
developer implementation details
```

---

# 6. WHY THIS IS A BLOCKER

CEO should see:

```text
research result
```

not:

```text
system development status
```

Terms such as:

```text
live
dataset
source hiện tại
wiring
model connected
```

are implementation vocabulary.

They break trust and immersion.

---

# 7. MARKET SECTION — PRODUCTION STATES

Market section must support only executive-safe states.

## STATE A — market data available

Show:

```text
KẾT QUẢ THỊ TRƯỜNG

Bối cảnh năng lực lãnh đạo Q3/2026

[real visualization]

[real metrics]

Nguồn: ...
```

Only show source label if actual source exists.

---

# 8. STATE B — market data not available yet

Do NOT show fake chart.

Do NOT show demo metrics.

Use a restrained message:

```text
Dữ liệu đối chuẩn thị trường đang được tổng hợp
trong kỳ nghiên cứu Q3/2026.
```

Optional second line:

```text
Kết quả đối chuẩn sẽ được cập nhật khi bộ dữ liệu
tham chiếu của chương trình hoàn tất.
```

No technical language.

---

# 9. STATE B VISUAL

Do not show a fake empty chart grid.

Do not show axes pretending data exists.

Instead:

```text
┌───────────────────────────────────────────┐
│                                           │
│   Đối chuẩn thị trường Q3/2026            │
│                                           │
│   Dữ liệu đang được tổng hợp trong        │
│   kỳ nghiên cứu hiện tại.                 │
│                                           │
└───────────────────────────────────────────┘
```

This can be a subtle figure surface.

No chart-like decoration.

---

# 10. REMOVE DATA STATUS BADGE IN PRODUCTION

Delete user-facing:

```tsx
survey-data-status
```

when it communicates:

```text
DỮ LIỆU LIVE
CHƯA CÓ DỮ LIỆU LIVE
```

If internal status is useful to developers:

keep it in data/config or console/dev environment.

Do not surface to CEO.

---

# 11. DEV-ONLY DATA STATUS

If needed:

```ts
if (import.meta.env.DEV) {
  console.info(...)
}
```

or internal object:

```ts
status: 'unavailable'
```

No visible badge.

---

# 12. BLOCKER — PRIVATE REPORT MUST NOT SAY PRODUCT IS UNFINISHED

Current copy:

```text
Phần diễn giải và khuyến nghị sẽ được bổ sung
khi mô hình phân tích được kết nối.
```

Remove completely from user-facing UI.

---

# 13. WHY THIS IS A BLOCKER

The phrase tells CEO:

```text
the analysis engine does not exist yet
```

This immediately reduces credibility of:

```text
Báo cáo Riêng tư
```

Even if this is true internally, it should not be exposed as product copy.

---

# 14. PRIVATE REPORT WHEN ONLY RAW SIGNALS EXIST

Until real interpretation/recommendation logic is available:

section should honestly be positioned as:

```text
BỐI CẢNH DOANH NGHIỆP

Các tín hiệu từ Phần 2
```

not:

```text
deep analysis
recommendations
AI flags
```

---

# 15. PRIVATE SECTION TARGET COPY

Recommended:

```text
05 · BỐI CẢNH DOANH NGHIỆP

Các tín hiệu từ Phần 2

Tổng hợp các thông tin Anh/Chị đã cung cấp
về cơ chế ra quyết định, khả năng mở rộng,
mức độ phụ thuộc vào CEO và bối cảnh tăng trưởng.
```

Then render actual answers.

No promise of unavailable analysis.

---

# 16. PRIVATE SECTION TITLE

Current:

```text
Tín hiệu dành riêng cho doanh nghiệp
```

This is acceptable.

Could improve to:

```text
Bối cảnh vận hành và tăng trưởng
```

ONLY if it accurately matches the questions.

Preferred safest:

```text
Các tín hiệu từ Phần 2
```

---

# 17. NO FALSE ANALYTICAL CLAIMS

Until actual logic exists, do NOT show:

```text
Phân tích sâu
Khuyến nghị
Hành động ưu tiên
AI đánh giá
AI gắn cờ
Rủi ro được phát hiện
```

unless the data/logic actually produces them.

---

# 18. P0 — RENAME “PHÂN TÍCH ĐỐI CHUẨN” IF NO MARKET COMPARISON EXISTS

Current domain section:

```text
03
5 NHÓM NĂNG LỰC
Phân tích đối chuẩn
```

But current visualization is based on:

```ts
scores.domains
```

only.

No market benchmark values are being compared.

Therefore the term:

```text
đối chuẩn
```

is currently misleading.

---

# 19. CURRENT SECTION IS ACTUALLY

```text
personal competency profile
```

not:

```text
benchmark comparison
```

---

# 20. RENAME TARGET

Use:

```text
03 · 5 NHÓM NĂNG LỰC

Hồ sơ 5 nhóm năng lực
```

or:

```text
Phân tích 5 nhóm năng lực
```

Preferred:

```text
Hồ sơ 5 nhóm năng lực
```

It feels executive and does not overclaim.

---

# 21. UPDATED LEDE

Current lede mentions:

```text
Điểm của từng nhóm được tính...
Radar giúp...
```

This is okay.

Refine slightly:

```text
Điểm của từng nhóm được tổng hợp từ các câu hỏi
trong Phần 1. Biểu đồ radar giúp nhìn nhanh hình thái
tổng thể, trong khi thanh điểm cho biết giá trị
cụ thể của từng nhóm năng lực.
```

Only adjust if allowed to edit UI explanatory copy.

Do not change scoring terminology.

---

# 22. FUTURE BENCHMARK MODE

When actual benchmark values become available:

then UI may become:

```text
Phân tích đối chuẩn
```

with explicit comparison:

```text
Doanh nghiệp
Thị trường
Top quartile
```

Do not use benchmark naming before comparison exists.

---

# 23. P0 — FIX DESKTOP QUESTION ACTION LAYOUT

Current CSS:

```css
.survey-question-actions {
  display: grid;
  grid-template-columns:
    auto
    minmax(0, 1fr)
    auto;
}
```

Current JSX has only two main buttons:

```tsx
Previous
Next
```

There is no center completion element anymore.

This grid is no longer semantically correct.

---

# 24. RISK

Browser placement becomes:

```text
column 1 → Previous
column 2 → Next
column 3 → empty
```

This can make primary CTA stretch awkwardly.

Premium form controls should not have accidental width.

---

# 25. DESKTOP ACTION TARGET

Use flex:

```css
.survey-question-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  margin-top: 42px;
  padding-top: 24px;

  border-top:
    1px solid var(--survey-border);
}
```

Buttons use natural width.

---

# 26. DESKTOP TARGET VISUAL

```text
← Câu trước                             Câu tiếp theo →
```

No giant CTA stretching across center.

---

# 27. TABLET

At tablet:

flex still fine.

Use:

```text
gap: 12px
```

---

# 28. MOBILE

At mobile <=767:

```text
[←]                [Câu tiếp theo →]
```

Primary may use:

```css
flex: 1;
```

Previous:

```text
48×48
```

---

# 29. MOBILE CSS TARGET

```css
@media (max-width: 767px) {
  .survey-question-actions {
    display: flex;
  }

  .survey-question-actions
  .survey-outline-button {
    width: 48px;
    min-width: 48px;
  }

  .survey-question-actions
  .survey-primary-button {
    flex: 1;
    min-width: 0;
  }
}
```

---

# 30. REMOVE OBSOLETE GRID COLUMN RULES

Delete:

```css
grid-template-columns:
  auto minmax(0,1fr) auto;
```

and <=390:

```css
grid-template-columns:
  48px minmax(0,1fr);
```

if flex replaces them.

Do not leave dead layout CSS.

---

# 31. P1 — DIFFERENTIATE HERO CTA FROM REPEATED TASK CTA

Current Survey CTA successfully matches Landing.

This is good.

But the same premium red treatment appears repeatedly on:

```text
Câu tiếp theo
```

18+ times.

The repeated question CTA should be calmer than:

```text
Bắt đầu khảo sát
Nhận báo cáo
Tải PDF
```

---

# 32. CREATE CTA INTENSITY LEVELS

## Level A — Conversion / milestone CTA

Use full premium treatment:

```text
Bắt đầu khảo sát
Tiếp tục sang Phần 2
Nhận báo cáo
Tải xuống PDF
Đăng ký Roundtable
```

Full:

- gradient;
- inset highlight;
- stronger shadow.

---

# 33. Level B — repeated navigation CTA

```text
Câu tiếp theo
```

Same shape and brand family.

But reduce shadow.

Suggested modifier:

```css
.survey-primary-button--task
```

---

# 34. TASK BUTTON STYLE

```css
.survey-primary-button--task {
  min-height: 50px;

  box-shadow:
    inset 0 1px 0 rgba(255,255,255,.26),
    0 7px 18px rgba(225,27,34,.13);
}
```

Hover:

```css
box-shadow:
  inset 0 1px 0 rgba(255,255,255,.30),
  0 9px 21px rgba(225,27,34,.16);
```

Still branded.

Less sales-like.

---

# 35. APPLY TASK MODIFIER

In `SurveyQuestionPage.tsx`:

```tsx
<button
  className="
    survey-primary-button
    survey-primary-button--task
  "
>
```

---

# 36. FINAL QUESTION CTA

When label becomes:

```text
Tiếp tục sang Phần 2
```

or final Part action:

can use full primary style again.

Implementation:

```ts
const isLast = position === questions.length
```

Then:

```tsx
className={cn(
  'survey-primary-button',
  !isLast && 'survey-primary-button--task'
)}
```

---

# 37. P1 — PREVIOUS BUTTON SHOULD FEEL MORE UTILITY-LIKE

Current desktop Previous:

```text
outline pill
```

It competes somewhat with primary.

Recommended direction:

Desktop:

```text
← Câu trước
```

as ghost utility.

---

# 38. OPTION A — RECOMMENDED

Create:

```css
.survey-previous-button
```

Style:

```css
background: transparent;
border: 0;
border-radius: 8px;

color: var(--survey-ink-secondary);

min-height: 44px;
padding: 8px 6px;

font-weight: 600;
```

Hover:

```css
color: var(--survey-navy);
background: var(--survey-surface-subtle);
```

---

# 39. MOBILE PREVIOUS

Keep square/icon utility:

```text
[←]
```

with border if useful.

Do not force ghost if touch affordance becomes unclear.

Suggested mobile:

```css
border: 1px solid var(--survey-border-strong);
border-radius: 12px;
background: #fff;
```

---

# 40. IF NOT CHANGING PREVIOUS STYLE

At minimum:

reduce its visual weight:

```text
lighter border
no strong navy border
no shadow
```

---

# 41. P1 — INTRO BRAND REPETITION

Current Intro displays:

```text
CWI logo

CEO WORKFORCE INDEX · 2026Q3

GIỚI THIỆU · CEO WORKFORCE INDEX 2026Q3

Năng lực Lãnh đạo...
```

CWI identity repeats too much in a small vertical area.

---

# 42. BRANDING RULE

Brand recognition should come from:

```text
logo
+
one program label
+
visual system
```

not repeating brand name in every label.

---

# 43. INTRO TARGET

Recommended:

```text
[CWI LOGO]

GIỚI THIỆU · 2026Q3

Năng lực Lãnh đạo
cho Tăng trưởng
```

---

# 44. REMOVE

```tsx
<span>
  CEO WORKFORCE INDEX · 2026Q3
</span>
```

inside `.survey-intro-brand`

IF eyebrow remains.

Or:

keep brand label and change eyebrow to:

```text
GIỚI THIỆU
```

Do not keep both long forms.

---

# 45. PREFERRED OPTION

Body:

```text
[CWI LOGO]

CEO WORKFORCE INDEX · 2026Q3

GIỚI THIỆU

Năng lực Lãnh đạo
cho Tăng trưởng
```

This creates clearer hierarchy.

---

# 46. INTRO LOGO STILL STAYS

Do not remove CWI body logo.

It works as branded research entry.

Just reduce textual repetition.

---

# 47. P1 — CONSIDER EARLIER INTRO CTA

The Intro content is intentionally substantial.

Do not delete content.

But CEO users may already understand the initiative from Landing.

Consider surfacing CTA earlier.

---

# 48. OPTION — EARLY CTA

Target:

```text
Logo

Title

First 1–2 key paragraphs

18 câu · approximately X
[Start]

────

Chi tiết về báo cáo

remaining content
```

However:

Only do this if duration/metadata is actually available.

Do not invent completion time.

---

# 49. SAFE VERSION WITHOUT NEW COPY

Move existing:

```text
[Bắt đầu khảo sát]
```

after first main intro content block

and keep report detail below.

But this changes reading order.

Do NOT do automatically if stakeholder expects user to read entire invitation.

---

# 50. V4 DEFAULT

For this pass:

DO NOT move CTA unless visual review clearly shows Intro is too long.

Main mandatory Intro change is only:

```text
remove brand text repetition
```

---

# 51. P1 — LOADING SCREEN: REMOVE SPINNER

Current hierarchy:

```text
CWI
eyebrow
spinner
title
progress
steps
```

Spinner interrupts title hierarchy.

Executive loading experience should feel controlled, not generic.

---

# 52. TARGET LOADING

```text
[CWI]

ĐANG PHÂN TÍCH

Đang tạo Báo cáo Riêng tư

━━━━━━━━━━━━━━━━━━━━

✓ Tổng hợp câu trả lời
✓ Đối chiếu dữ liệu
○ Phân tích các nhóm năng lực
○ Tạo báo cáo
```

No spinner required.

---

# 53. REMOVE

```tsx
<LoaderCircle />
```

from Loading screen.

Then remove unused import.

---

# 54. LOADING TITLE SPACING

After logo:

```text
logo → 24px
eyebrow → 12px
H1 → 28px
progress
```

---

# 55. LOADING PROGRESS

Current progress + steps are enough.

Keep.

---

# 56. P0/P1 — LOADING TIMING MUST NOT FEEL THEATRICAL

Current:

```ts
520ms
1040ms
1560ms
2260ms
```

These are synthetic timers.

Prototype demo:

acceptable.

Production:

should represent real processing.

---

# 57. CURRENT IMPLEMENTATION RULE

If there is no real async report generation yet:

reduce simulated wait.

Recommended total:

```text
700–1100ms
```

not ~2.3s.

Enough for transition perception.

Not enough to pretend heavy analysis.

---

# 58. SIMPLIFIED LOCAL LOADING

Example:

```ts
setLoadingStep(1)

250ms → step 2
500ms → step 3
750ms → step 4
950ms → result
```

Only if report remains fully client-side.

---

# 59. FUTURE BACKEND RULE

Once real report API exists:

replace timers with actual async states.

Do not maintain fake timing.

---

# 60. P1 — MOBILE QUESTION NAV COMPACTNESS

Current <=390 rule moves:

```text
Danh sách
```

to a full new row.

This can create unnecessary vertical height.

---

# 61. CURRENT RISK

At 360px:

```text
Phần 1   05/18   3 hoàn tất
Danh sách

progress
```

Question gets pushed down.

---

# 62. TARGET A — PREFERRED

At <=390:

```text
05 / 18                         Danh sách
3 câu hoàn tất
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Remove redundant:

```text
Phần 1
```

because header already says Part.

---

# 63. TARGET B

If space allows:

```text
05/18        3 hoàn tất       ☰
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Icon-only menu requires accessible label.

But text `Danh sách` is more discoverable.

Prefer Target A.

---

# 64. MOBILE NAV MARKUP OPTION

```tsx
<div className="survey-mobile-question-nav-head">
  <div>
    <strong>05 / 18</strong>
    <small>3 câu hoàn tất</small>
  </div>

  <button>
    <ListIcon />
    Danh sách
  </button>
</div>
```

No separate `Phần 1` label mobile.

---

# 65. DESKTOP PART LABEL REMAINS

Desktop progress already displays:

```text
PHẦN 1 · KHẢO SÁT KHUYẾT DANH
```

good.

---

# 66. P2 — DRAWER AUTO-SCROLL ACTIVE QUESTION INTO VIEW

When opening Drawer at late question:

```text
Q17
```

the active row should be visible immediately.

---

# 67. IMPLEMENTATION

Give active row a ref.

On drawer open:

```ts
requestAnimationFrame(() => {
  activeItemRef.current?.scrollIntoView({
    block: 'center',
    behavior: 'auto'
  })
})
```

Important:

scroll only Drawer internal content.

Not document body.

---

# 68. NO SMOOTH SCROLL FOR DRAWER OPEN

Use:

```text
behavior: auto
```

so drawer does not visibly animate list after opening.

---

# 69. DRAWER ACTIVE ROW REF

In question list map:

```tsx
ref={
  question.n === activeQuestion
    ? activeItemRef
    : undefined
}
```

---

# 70. P1 — CONTACT BRAND SIZE

Current trust logo:

```text
104–112px
```

fine.

Do not enlarge.

Contact is not another hero.

---

# 71. CONTACT UI STATUS

Overall current Contact direction is approved.

Do not redesign.

Only verify:

- field alignment;
- consent;
- button hierarchy;
- mobile stack;
- brand spacing.

---

# 72. CONTACT SECONDARY BUTTON

`Xem lại câu trả lời`

should remain secondary.

Could use outline.

No need change.

---

# 73. P1 — REPORT MARKET EMPTY STATE SHOULD NOT LOOK LIKE A CHART

Current no-data market visual uses:

```text
grid
axis
market labels
```

even when no data exists.

This can imply that a visualization is present but blank.

Avoid.

---

# 74. NO-DATA MARKET TARGET

Use simple editorial block:

```text
Đối chuẩn thị trường Q3/2026

Dữ liệu đối chuẩn đang được tổng hợp
trong kỳ nghiên cứu hiện tại.
```

Optional small icon:

```text
not needed
```

Keep pure typography.

---

# 75. WHEN REAL MARKET DATA EXISTS

Then render actual:

```text
chart
axes
metrics
source
```

---

# 76. CONDITIONALLY RENDER MARKET FIGURE

Pseudo:

```tsx
if (!hasLiveData) {
  return <MarketPendingState />
}

return <MarketLiveFigure />
```

Do not force both into same visual.

---

# 77. `surveyReportData.ts`

Keep status internally.

Example:

```ts
status: 'unavailable' | 'live'
```

Do not rename for CEO copy.

---

# 78. P1 — MARKET METRICS WHEN UNAVAILABLE

If metric values are placeholders like:

```text
—
```

do not render three metric columns unless they add real value.

Prefer hide metrics entirely when no real data.

---

# 79. NO EMPTY KPI ROW

Do not show:

```text
Mẫu đối chuẩn —
Top quartile —
Xu hướng —
```

This looks unfinished.

---

# 80. P1 — REPORT DOMAIN RADAR LABEL QA

Radar has labels around a 320×320 SVG.

Long labels may collide on mobile.

Particularly:

```text
CEO–Nhân sự Alignment
```

or other long domain names.

---

# 81. DO NOT CHANGE DOMAIN NAMES

Do not rename methodology terms.

Instead improve chart layout.

---

# 82. RADAR MOBILE SOLUTIONS

Option A:

Reduce label font:

```text
9.5–10px
```

and max 2 lines.

Option B:

Use short numbered labels:

```text
01
02
03
04
05
```

with legend beside/below.

Only if current text labels collide.

---

# 83. PREFERRED

Keep text labels if readable at:

```text
390px
```

and:

```text
360px
```

Do not prematurely replace.

QA visually.

---

# 84. RADAR WIDTH

Mobile max:

```text
300px
```

currently.

Test actual usable width with 24px shell margins.

---

# 85. P1 — REPORT VISUAL LANGUAGE

Current report direction:

```text
editorial dividers
radar
bars
details appendix
```

is approved.

Do not revert to KPI card grid.

---

# 86. NO NEW REPORT CARDS

Do not add:

```text
insight cards
AI cards
recommendation cards
```

just to make report look richer.

---

# 87. P1 — REPORT SECTION 01 IF UNAVAILABLE

If Market data unavailable, section should remain shorter.

Example:

```text
01
KẾT QUẢ THỊ TRƯỜNG

Bối cảnh năng lực lãnh đạo Q3/2026

Dữ liệu đối chuẩn đang được tổng hợp
trong kỳ nghiên cứu hiện tại.
```

Then proceed to Section 02.

Do not occupy 400px vertical area for missing data.

---

# 88. P1 — REPORT PERSONAL SCORES

Current score rows approved.

Do not change architecture.

---

# 89. SCORE SEMANTICS

Continue showing:

```text
Leadership Capacity
Scale Readiness
```

with score.

Do not add color interpretation thresholds unless methodology exists.

---

# 90. P1 — PRIVATE SIGNAL LIST

Current list is editorial.

Approved.

Refine lede only.

---

# 91. PRIVATE ITEM LABEL

Current:

```text
TÍN HIỆU DOANH NGHIỆP
```

Good.

Keep.

---

# 92. BỐI CẢNH DOANH NGHIỆP ITEM

Current:

```text
Doanh thu: ...
Website: ...
```

If website answer empty/optional:

ensure UI does not show ugly:

```text
Website: —
```

unless `getAnswerDisplay` intentionally uses a good absent label.

---

# 93. EMPTY OPTIONAL ANSWER

Preferred:

```text
Chưa cung cấp
```

if this wording is compatible with product.

If source already returns something, do not arbitrarily change.

---

# 94. P2 — ANSWER APPENDIX DETAILS ICON

Current `<details>` should show state visually.

If plus stays plus when opened, fix.

---

# 95. TARGET

Closed:

```text
+
```

Open:

```text
−
```

or rotate chevron.

---

# 96. ACCESSIBLE SUMMARY

Keep native details.

No custom JS needed.

---

# 97. P1 — ROUND TABLE INVITATION

Current placement after Report is approved.

Do not move.

---

# 98. ROUND TABLE COPY

Do not change source content.

---

# 99. ROUND TABLE BUTTON

Registration inside modal can remain strong red CTA.

Invitation button in report can remain secondary outline.

Good hierarchy.

---

# 100. P2 — MODAL POLISH

Current modal radius:

```text
18px desktop
20px top mobile
```

good.

Do not increase.

---

# 101. P2 — LOGO FREQUENCY REVIEW

Current logo placements:

```text
header
intro
contact
loading
report
```

strategically appropriate.

Do not add more by default.

---

# 102. INTRO IS THE ONLY PLACE WITH REPETITION ISSUE

Fix textual brand repetition there.

Do not remove strategic logos elsewhere.

---

# 103. BRAND RULE AFTER V4

Visible logo at major transition:

```text
entry
data handoff
processing
result
```

Correct.

---

# 104. QUESTION SCREEN LOGO

Still no second logo in body.

Header only.

Correct.

---

# 105. P1 — QUESTION PROGRESS MICROCOPY

Current:

```text
05 / 18
3 câu hoàn tất
```

good.

No change.

---

# 106. COMPLETION PROGRESS

Current uses:

```ts
completedCount / questions.length
```

correct.

Do not regress.

---

# 107. NEXT LOGIC

Current sequential navigation is correct.

Do not regress.

---

# 108. CONTACT REVIEW LOGIC

Current Part 1 / Part 2 review behavior is correct.

Do not regress.

---

# 109. P2 — BUTTON LABEL END STATES

At Q18:

```text
Tiếp tục sang Phần 2
```

good.

At Q24:

ensure final label clearly indicates next step.

Could be:

```text
Tiếp tục nhận báo cáo
```

only if source/current flow supports.

Do not change without checking existing primary label.

---

# 110. P1 — BUTTON SYSTEM FINAL HIERARCHY

## Full Primary

Use for:

```text
Bắt đầu khảo sát
Tiếp tục sang Phần 2
Nhận báo cáo
Tải xuống PDF
Đăng ký tham dự
```

---

# 111. Task Primary

Use calmer modifier for:

```text
Câu tiếp theo
```

---

# 112. Secondary

Use outline for:

```text
Xem lại câu trả lời
Quay về trang chủ
```

---

# 113. Utility

Use ghost/text/icon for:

```text
Câu trước
Danh sách
Back
Close
Skip
```

---

# 114. THIS HIERARCHY IS IMPORTANT

Do not style every click target like a brand CTA.

The hierarchy itself creates premium feel.

---

# 115. P1 — BUTTON SHADOW RULE

Only full milestone CTA gets:

```text
stronger shadow
```

Repeated task CTA gets:

```text
lighter shadow
```

Utility gets:

```text
none
```

---

# 116. P1 — HOVER RULE

No large movement.

Max:

```text
translateY(-1px)
```

Arrow:

```text
translateX(3px)
```

good.

---

# 117. ACTIVE RULE

No scale.

No bounce.

---

# 118. P1 — MOBILE CTA

Task CTA should fit natural width/flex.

No truncation.

At 360:

```text
Câu tiếp theo →
```

must remain one line.

---

# 119. P1 — QUESTION FIRST-SCREEN CONTEXT

Current first question adds:

```text
BẮT ĐẦU PHẦN 1
intro
subtitle
```

This is useful.

But ensure it does not dominate.

---

# 120. FIRST CONTEXT HEIGHT

Keep:

```text
compact
```

No new boxes.

No logo.

---

# 121. P2 — FIRST QUESTION MOBILE

At 360×800, try to keep:

```text
question title
+
at least answer controls start
```

visible in first viewport when possible.

Do not shrink text just to achieve.

---

# 122. P1 — QUESTION TYPOGRAPHY

Current question typography is approved.

Do not modify font family.

Do not add serif.

Do not increase to huge editorial 40px.

---

# 123. P1 — ANSWER CONTROLS

Current Likert/MCQ approved.

Do not redesign.

---

# 124. P2 — LIKERT MOBILE LABELS

Check:

```text
Không đồng ý
Hoàn toàn đồng ý
```

at 360.

Ensure no awkward overlap.

---

# 125. P2 — LONG MCQ

Test Q17/Q18/Part2 longest option.

Tap target >=44px.

Current ~52.

good.

---

# 126. P1 — NO MORE DECORATIVE UI

Do not add:

- icons next to question type;
- step illustrations;
- CWI watermark;
- animated background;
- gradient page background;
- side quote;
- emoji.

---

# 127. P0 — REMOVE “LIVE” LANGUAGE THROUGHOUT SURVEY

Search source:

```bash
rg -n \
  "DỮ LIỆU LIVE|CHƯA CÓ DỮ LIỆU LIVE|dataset|live trong nguồn|mô hình phân tích được kết nối|sẽ được bổ sung" \
  src/features/survey
```

Review every match.

No development-state language visible to CEO.

---

# 128. P0 — SEARCH FOR OTHER PROTOTYPE COPY

Also search:

```bash
rg -n \
  "demo|placeholder|prototype|mock|chưa có|đang chờ|source hiện tại|wiring|engine|model" \
  src/features/survey
```

Not every match is wrong.

Review context.

Remove from user-facing production copy if technical.

---

# 129. INTERNAL CODE COMMENTS ARE FINE

Only visible UI is concern.

---

# 130. P0 — MARKET DATA HONESTY

If status unavailable:

no fake values.

Keep this principle from V3.

---

# 131. NO HARDCODED DEMO VALUES

Do not show:

```text
300+
78/100
61%
```

as real unless actual data source exists.

---

# 132. P0 — REPORT SOURCE LABEL

If no actual source:

do not render:

```text
undefined
·
```

or misleading source.

Conditionally render.

---

# 133. P1 — REPORT NO-DATA FIGCAPTION

Do not show technical figcaption.

If pending state has explanatory copy, no figcaption needed.

---

# 134. P1 — MARKET SECTION VISUAL QA

When unavailable:

section should feel intentional, not broken.

When live:

chart should feel meaningful.

Both states must look designed.

---

# 135. P1 — LOADING COPY

Existing:

```text
Đang tạo Báo cáo...
```

good.

No technical processing copy.

---

# 136. P1 — LOADING STEPS

Current:

```text
Tổng hợp câu trả lời
Đối chiếu dữ liệu
Phân tích các nhóm năng lực
Tạo báo cáo
```

These are acceptable product-facing.

Keep.

---

# 137. P1 — LOADING IF MARKET DATA UNAVAILABLE

Do not claim:

```text
Đối chiếu dữ liệu
```

if there is no actual benchmark process?

This is a product decision.

For prototype, okay.

For production truthfulness, consider:

```text
Tổng hợp câu trả lời
Tính điểm các nhóm năng lực
Chuẩn bị báo cáo
```

BUT do not change content unless stakeholder/product confirms.

This spec does not mandate copy change here.

---

# 138. P2 — APP HEADER ON LOADING

Current back disabled.

Could hide Back entirely during loading.

Optional.

Preferred:

hide or visually mute.

No user action available.

---

# 139. P1 — REPORT HEADER BRAND

Current report identity approved.

Do not add more logos.

---

# 140. P1 — PRINT

Print branding approved direction.

Verify no user-facing pending developer copy prints.

Important.

---

# 141. PRINT NO-DATA STATE

If market data unavailable:

print the executive-safe pending message.

No technical copy.

---

# 142. PRINT PRIVATE REPORT

No unfinished-model statement.

---

# 143. P1 — REPORT SCREENSHOT TEST

Take screenshot at:

```text
1440×900
```

Review first 900px.

It should immediately communicate:

```text
CWI report
report type
key result
```

Not:

```text
data unavailable
```

---

# 144. REPORT FIRST VIEWPORT PRIORITY

If Section 01 has unavailable market data and consumes too much room, key scores may fall below fold.

Compress pending Market state.

---

# 145. PREFERRED PENDING MARKET HEIGHT

Around:

```text
160–220px
```

including heading/description.

Not 400px.

---

# 146. IF MARKET DATA UNAVAILABLE FOR MVP

An alternative is:

```text
move pending Market note after personal score
```

BUT requirement order expects market context first.

Default: preserve order.

Just keep it compact.

---

# 147. P2 — RADAR VS BAR BALANCE

Current radar and bars side-by-side desktop.

Good.

Ensure radar does not dominate bars.

Bars are more precise.

Suggested columns:

```text
0.8fr / 1.2fr
```

already direction.

Keep.

---

# 148. P2 — RADAR FIGCAPTION

Current:

```text
Hình thái 5 nhóm năng lực
```

good.

---

# 149. P2 — BAR VALUES

Current:

```text
82 / 100
```

good.

---

# 150. P2 — SCORE VALUE TYPOGRAPHY

No need giant dashboard numerals.

Current should remain editorial.

---

# 151. P1 — RESULT CTA ORDER

Primary:

```text
Tải xuống PDF
```

Secondary:

```text
Quay về trang chủ
```

Correct.

---

# 152. P1 — DOWNLOAD CTA FULL PREMIUM

This is a milestone CTA.

Can retain full brand shadow.

---

# 153. P2 — ROUND TABLE CTA

If invitation uses outline, good.

Modal register uses primary.

---

# 154. P1 — DRAWER SCROLL LOCK

Current good.

Keep.

---

# 155. P2 — DRAWER ACTIVE SCROLL

Implement.

---

# 156. P2 — DRAWER FOCUS

Current focus trap/restore should remain.

Do not regress when adding ref.

---

# 157. P1 — MOBILE HEADER

Current:

```text
Back
CWI logo
Phase
```

approved.

No hamburger.

Keep.

---

# 158. P1 — MOBILE HEADER PHASE

Keep short:

```text
Phần 1
Phần 2
Báo cáo
```

No long subtitle.

---

# 159. P2 — HEADER LOGO WIDTH

Current 76px mobile.

Good.

---

# 160. P2 — INTRO LOGO WIDTH

108px mobile.

Good.

---

# 161. P2 — REPORT LOGO WIDTH

96px mobile.

Good.

---

# 162. P2 — CONTACT LOGO WIDTH

104px mobile.

Good.

---

# 163. DO NOT INCREASE LOGOS

No need.

---

# 164. P1 — ERROR PLACEMENT

Inspect current UI for duplication.

`QuestionCard` receives:

```tsx
error={error}
```

and `SurveyQuestionPage` also renders:

```tsx
survey-validation-message
```

Confirm QuestionCard does not render the same error.

---

# 165. ERROR MUST APPEAR ONCE

Target:

```text
answer controls

⚠ Vui lòng...

actions
```

one message.

---

# 166. SEARCH

```bash
rg -n "error" \
  src/features/survey/QuestionCard.tsx \
  src/features/survey/SurveyQuestionPage.tsx
```

---

# 167. P1 — ERROR SCROLL

Because one question is visible, no special scroll needed.

Good.

---

# 168. P2 — FOCUS ERROR

After user presses Next with no answer:

consider focus to first answer control or alert.

Do not force if it harms mouse flow.

Accessibility improvement optional.

---

# 169. P2 — KEYBOARD NAV

Native radios remain accessible.

Keep.

---

# 170. P1 — LOADING ICON IMPORT CLEANUP

After removing spinner:

remove:

```ts
LoaderCircle
```

import.

Delete unused CSS:

```text
survey-loading-spinner
```

if exists.

---

# 171. P1 — CSS CLEANUP

After action flex changes:

delete obsolete grid action CSS.

After spinner removed:

delete spinner rules.

After market status removed:

delete `survey-data-status` visible styling if unused.

After no-data figure redesigned:

delete grid/axis rules if only used in unavailable state and no live chart uses them.

---

# 172. DO NOT LEAVE DEAD V3 STYLES

V4 is refinement, not another override layer.

---

# 173. CSS FILE RULE

Modify rules in place.

Do not append:

```text
/* V4 PATCH */
```

at bottom.

---

# 174. P1 — COMPONENT CLEANUP

If Market section becomes two state components:

create:

```tsx
MarketPendingState
MarketLiveFigure
```

if it improves readability.

No excessive file fragmentation.

---

# 175. RECOMMENDED MARKET JSX

```tsx
function MarketBenchmarkSection({ data }) {
  const hasData = data.status === 'live'

  return (
    <section ...>
      <ReportSectionHeading ... />

      <p ... />

      {hasData ? (
        <MarketLiveFigure data={data} />
      ) : (
        <MarketPendingState period={data.period} />
      )}
    </section>
  )
}
```

---

# 176. MARKET PENDING JSX

```tsx
function MarketPendingState({
  period,
}: {
  period: string
}) {
  return (
    <div
      className="survey-market-pending"
      role="status"
    >
      <strong>
        Đối chuẩn thị trường {period}
      </strong>

      <p>
        Dữ liệu đối chuẩn đang được tổng hợp
        trong kỳ nghiên cứu hiện tại.
      </p>
    </div>
  )
}
```

Exact copy may be adjusted with product owner.

No dev terms.

---

# 177. MARKET PENDING STYLE

```css
.survey-market-pending {
  margin-top: 26px;
  padding: 28px 0;

  border-top:
    1px solid var(--survey-border);
  border-bottom:
    1px solid var(--survey-border);
}
```

No card needed.

---

# 178. P1 — MARKET LIVE STYLE

When live:

one actual figure container can have:

```text
border
radius 16
```

because it is a figure.

Fine.

---

# 179. P0 — COPY AUDIT

After changes, perform full visible-copy audit.

Search:

```bash
rg -n \
  "\"[^\"]+\"" \
  src/features/survey
```

or inspect rendered screens.

Look for anything that sounds like:

```text
developer
internal
demo
future functionality
```

---

# 180. CUSTOMER TEST

Ask:

> Would a CEO reasonably see this sentence in a finished report?

If no:

remove/rewrite.

---

# 181. P1 — BRAND VOICE

UI copy should sound:

```text
calm
authoritative
transparent
research-oriented
```

not:

```text
technical
salesy
AI hype
```

---

# 182. NO AI TERM UNLESS CONTENT REQUIRES

Survey questions may mention AI.

That is content.

But product chrome/report should not add:

```text
AI-powered
AI analysis
AI insights
```

without actual feature.

---

# 183. P1 — INTRO BODY BRAND TEXT

Implementation recommendation:

Current:

```tsx
<div className="survey-intro-brand">
  <SurveyBrandMark ... />
  <span>
    CEO WORKFORCE INDEX · 2026Q3
  </span>
</div>

<SurveyEyebrow>
  GIỚI THIỆU · CEO WORKFORCE INDEX 2026Q3
</SurveyEyebrow>
```

Change to:

```tsx
<div className="survey-intro-brand">
  <SurveyBrandMark ... />
  <span>
    CEO WORKFORCE INDEX · 2026Q3
  </span>
</div>

<SurveyEyebrow>
  GIỚI THIỆU
</SurveyEyebrow>
```

Preferred.

---

# 184. P1 — INTRO EYEBROW WIDTH

Shorter eyebrow improves visual hierarchy.

Good.

---

# 185. P1 — INTRO CTA SHADOW

Keep full brand style.

This is conversion milestone.

---

# 186. P1 — TASK CTA SHADOW

Reduce.

---

# 187. P1 — CONTACT CTA

Full brand.

---

# 188. P1 — REPORT DOWNLOAD

Full brand.

---

# 189. P1 — MODAL REGISTER

Full brand.

---

# 190. P1 — FINAL Q CTA

Full brand because phase transition.

---

# 191. P2 — PART 2 SECONDARY ACTION

Current text:

```text
Nhận Báo cáo Phần 1
```

should remain a text/secondary action.

Do not make outline heavy.

---

# 192. P2 — SECONDARY ACTION SPACING

Ensure it is visibly separated from Next actions.

No accidental third CTA row clutter.

---

# 193. P1 — MOBILE QUESTION SECONDARY ACTION

At Part 2, text secondary may create vertical height.

Keep readable.

No sticky.

---

# 194. P2 — SAFE AREA

Current mobile modal handles safe area.

Question actions are not fixed, so no issue.

Keep.

---

# 195. P1 — REPORT MOBILE NO-DATA

Pending market section should stack cleanly.

No fake visual grid.

---

# 196. P1 — REPORT MOBILE RADAR

QA labels.

---

# 197. P1 — REPORT MOBILE ANSWERS

Details summary must not truncate question text excessively.

Allow wrapping.

---

# 198. P2 — REPORT DETAILS SUMMARY

Touch target >=48px.

---

# 199. P2 — REPORT DETAILS BORDER

Keep divider-based.

No cards.

---

# 200. P1 — PRINT DETAILS

All open in print.

Current behavior.

Keep.

---

# 201. P1 — PRINT MARKET PENDING

No technical status.

---

# 202. P1 — PRINT CWI LOGO

Keep.

---

# 203. P1 — PRINT PAGE BREAK

Ensure Radar + Bars not split awkwardly if possible.

---

# 204. P2 — PRINT PRIVATE ITEMS

Break per article.

Good.

---

# 205. P0 — NO VISUAL REGRESSION LANDING

Landing must remain untouched.

Screenshot compare.

---

# 206. P0 — NO SURVEY LOGIC REGRESSION

Test:

```text
Q1 → Q2
drawer jump Q7 → Next Q8
Q18 validation
Part2 Q19 → Q20
Q24 → Contact
Contact review
Consent
Report
Roundtable
```

---

# 207. P1 — VISUAL ACCEPTANCE CRITERIA: INTRO

PASS if:

- CWI clearly visible;
- only one long textual brand label;
- title dominates;
- no repeated program name clutter;
- CTA clearly primary.

FAIL if:

- CEO Workforce Index repeated 3+ times above fold;
- logo feels decorative;
- intro looks like marketing landing clone.

---

# 208. VISUAL ACCEPTANCE: QUESTION

PASS if:

- question dominates;
- answer controls clear;
- Previous subtle;
- Next clear but not overly salesy;
- buttons natural width desktop.

FAIL if:

- Next spans huge area;
- two CTA pills feel equal;
- question competes with progress.

---

# 209. VISUAL ACCEPTANCE: MOBILE QUESTION

PASS if:

```text
position
completion
list trigger
question
answer
actions
```

all clear.

FAIL if:

- nav consumes >100px before question;
- List gets isolated in awkward row;
- task button feels huge.

---

# 210. VISUAL ACCEPTANCE: CONTACT

PASS if:

- trustworthy;
- calm;
- CWI anchor;
- form easy;
- privacy readable.

No redesign required.

---

# 211. VISUAL ACCEPTANCE: LOADING

PASS if:

- looks like intentional process;
- no generic spinner;
- title visible immediately;
- progress clear.

FAIL if:

- feels like fake AI generation.

---

# 212. VISUAL ACCEPTANCE: REPORT

PASS if:

- no technical status language;
- report feels complete;
- personal score visible;
- domains readable;
- pending market state looks intentional;
- no false claims.

FAIL if:

- CEO reads “dataset/live/model not connected”;
- empty fake chart;
- “benchmark” without benchmark.

---

# 213. PRODUCTION CREDIBILITY CHECKLIST

- [ ] No “CHƯA CÓ DỮ LIỆU LIVE”
- [ ] No “DỮ LIỆU LIVE” badge
- [ ] No “dataset” visible
- [ ] No “nguồn hiện tại” technical copy
- [ ] No “mô hình phân tích được kết nối”
- [ ] No “sẽ được bổ sung” feature-roadmap copy
- [ ] No fake benchmark values
- [ ] No false “đối chuẩn” claim
- [ ] No AI analysis claim without feature

---

# 214. P0 FUNCTIONAL CHECKLIST

- [ ] Next sequential
- [ ] Progress completion-based
- [ ] Q18 validates
- [ ] Q24 validates
- [ ] Contact Part1 review correct
- [ ] Contact Part2 review correct
- [ ] Drawer correct
- [ ] Consent correct
- [ ] Report mode correct
- [ ] Roundtable after report

---

# 215. P1 QUESTION UI CHECKLIST

- [ ] Desktop actions now flex
- [ ] Primary natural width
- [ ] Previous reduced visual weight
- [ ] Repeated Next has task modifier
- [ ] Final transition CTA retains full premium style
- [ ] Mobile remains ergonomic

---

# 216. P1 INTRO CHECKLIST

- [ ] Brand text repetition reduced
- [ ] Logo retained
- [ ] Eyebrow simplified
- [ ] Title unchanged
- [ ] Copy preserved
- [ ] CTA preserved

---

# 217. P1 LOADING CHECKLIST

- [ ] Spinner removed
- [ ] Loader import removed
- [ ] Spinner CSS removed
- [ ] Progress retained
- [ ] Steps retained
- [ ] Delay reduced if still synthetic

---

# 218. P1 REPORT CHECKLIST

- [ ] Market unavailable state executive-safe
- [ ] No fake empty chart
- [ ] No empty metrics
- [ ] Domain section renamed appropriately
- [ ] Radar retained
- [ ] Bars retained
- [ ] Private unfinished copy removed
- [ ] Report print safe

---

# 219. P2 CHECKLIST

- [ ] Drawer active item auto-scroll
- [ ] Details +/- state
- [ ] Radar mobile label QA
- [ ] Modal unchanged unless needed
- [ ] Header logo sizes unchanged

---

# 220. CSS CLEANUP CHECKLIST

- [ ] Remove action grid rules
- [ ] Remove obsolete <=390 grid action rules
- [ ] Remove spinner styles
- [ ] Remove unused data-status styles
- [ ] Remove fake market grid rules if unused
- [ ] No V4 override block
- [ ] No duplicate selectors created

---

# 221. FILE-BY-FILE IMPLEMENTATION

## `SurveyQuestionPage.tsx`

Required:

```text
action layout class compatible with flex
task CTA modifier
final CTA full primary
optional Previous utility class
```

Do not change navigation logic.

---

# 222. Suggested question button code

```tsx
const isLastQuestion =
  position === questions.length

...

<button
  className="survey-previous-button"
  onClick={onPrevious}
  type="button"
>
  <ArrowLeft ... />
  Câu trước
</button>

<button
  className={cn(
    'survey-primary-button',
    !isLastQuestion &&
      'survey-primary-button--task'
  )}
  onClick={onNext}
  type="button"
>
  {isLastQuestion
    ? primaryLabel
    : 'Câu tiếp theo'}

  <SurveyForwardArrow />
</button>
```

If `cn` import not currently present, import existing project helper.

---

# 223. `SurveyScreens.tsx`

Required:

- Intro brand copy simplify;
- Loading spinner remove;
- Market pending state;
- market technical copy remove;
- Domain section rename;
- Private unfinished copy remove.

---

# 224. `SurveyNavigation.tsx`

Required/P2:

- active item auto-scroll;
- compact <=390 composition if needed.

Do not rewrite drawer architecture.

---

# 225. `SurveyExperience.tsx`

Only:

- optionally reduce synthetic loading timings.

Do not touch question navigation logic unless regression found.

---

# 226. `survey.css`

Required:

- action flex;
- task button modifier;
- previous utility;
- intro hierarchy;
- loading cleanup;
- market pending style;
- mobile nav compact;
- remove dead rules.

---

# 227. `surveyReportData.ts`

Keep internal availability status.

No demo numbers as production.

If metrics absent:

provide empty metrics.

UI should hide row.

---

# 228. PREFERRED DATA SHAPE

```ts
export const marketBenchmarkData = {
  status: 'unavailable',
  period: 'Q3/2026',
  sourceLabel: '',
  series: [],
  metrics: [],
}
```

This is fine internally.

---

# 229. MARKET UI CONDITION

```tsx
const hasLiveData =
  data.status === 'live'
```

Then:

```tsx
{hasLiveData
  ? <MarketLiveFigure ... />
  : <MarketPendingState ... />
}
```

---

# 230. DO NOT DISPLAY `status` DIRECTLY

Critical.

---

# 231. LOADING TIMER RECOMMENDATION

If pure frontend:

```ts
const timers = [
  setTimeout(step2, 250),
  setTimeout(step3, 500),
  setTimeout(step4, 750),
  setTimeout(result, 950),
]
```

This is recommendation, not mandatory if another real async operation exists.

---

# 232. NO RANDOM LOADING TIMINGS

If changing, centralize constants.

---

# 233. OPTIONAL CONSTANT

```ts
const DEMO_REPORT_LOADING_MS = {
  step2: 250,
  step3: 500,
  step4: 750,
  complete: 950,
}
```

Only if useful.

---

# 234. MOBILE NAV CSS TARGET

Example:

```css
@media (max-width: 390px) {
  .survey-mobile-question-nav-head {
    grid-template-columns:
      minmax(0,1fr)
      auto;
  }

  .survey-mobile-question-nav-head
  > span {
    display: none;
  }

  .survey-mobile-question-nav-head
  > small {
    grid-column: 1;
  }

  .survey-mobile-question-nav-head
  button {
    grid-column: 2;
    grid-row: 1 / span 2;
    align-self: center;
  }
}
```

Adapt to actual markup.

Do not force if layout differs.

---

# 235. P2 ACTIVE DRAWER REF IMPLEMENTATION

Use:

```tsx
const activeItemRef =
  useRef<HTMLButtonElement>(null)
```

Effect:

```tsx
useEffect(() => {
  if (!open) return

  requestAnimationFrame(() => {
    activeItemRef.current
      ?.scrollIntoView({
        block: 'center',
        behavior: 'auto',
      })
  })
}, [open, activeQuestion])
```

---

# 236. IMPORTANT DRAWER FOCUS ORDER

Do not auto-focus active item if current focus trap expects close button.

Scroll only.

Focus behavior stays as existing.

---

# 237. P2 DETAILS STATE

CSS:

```css
.survey-answer-disclosure
summary .indicator::before {
  content: "+";
}

.survey-answer-disclosure[open]
summary .indicator::before {
  content: "−";
}
```

Adapt to actual DOM.

---

# 238. NO JS FOR DETAILS STATE

Native CSS only.

---

# 239. REPORT HEADING TARGET

Market:

```text
01
KẾT QUẢ THỊ TRƯỜNG

Bối cảnh năng lực lãnh đạo Q3/2026
```

Personal:

```text
02
KẾT QUẢ CỦA ANH/CHỊ

Tổng quan từ Phần 1
```

Domains:

```text
03
5 NHÓM NĂNG LỰC

Hồ sơ 5 nhóm năng lực
```

Answers:

```text
04
CÂU TRẢ LỜI
...
```

Private:

```text
05
BỐI CẢNH DOANH NGHIỆP

Các tín hiệu từ Phần 2
```

---

# 240. KEEP REPORT NUMBERING

Good executive hierarchy.

---

# 241. NO “ANALYTICS DASHBOARD” COPY

Do not say:

```text
dashboard
real-time
live analytics
AI insight
```

---

# 242. USER-FACING LANGUAGE TEST

All report language should survive being pasted into a PDF for a CEO.

If a sentence would look embarrassing in a formal PDF:

do not ship it.

---

# 243. P1 — EMPTY MARKET SCREEN READER COPY

`role="status"` is okay.

But no technical aria label.

Use:

```text
Dữ liệu đối chuẩn thị trường Q3/2026
đang được tổng hợp.
```

---

# 244. RADAR ACCESSIBILITY

Current role/img and bars are enough.

Keep.

---

# 245. NO NEED TO ADD SCREEN-READER TABLE

Bars provide redundant values.

---

# 246. P1 — REPORT MOBILE SECTION SPACING

Current ~36px.

Good.

Pending Market being shorter helps.

---

# 247. P1 — DESKTOP REPORT SPACING

Current ~52px.

Good.

Do not tighten globally.

---

# 248. P2 — PRIVATE SIGNAL NUMBER ALIGNMENT

Ensure 01–05 align top across variable content.

Current editorial row likely good.

---

# 249. P2 — PRIVATE SIGNAL LONG WEBSITE

Website URL can overflow.

CSS:

```css
overflow-wrap: anywhere;
```

for private item paragraph.

---

# 250. P2 — EMAIL/URL WRAP

Same for any report text.

---

# 251. P1 — BUTTON RED COLOR

Do not alter brand red.

Use existing Landing-derived tokens.

---

# 252. P1 — TASK CTA STILL SAME GRADIENT

Keep gradient.

Only shadow/intensity reduced.

This preserves brand continuity.

---

# 253. P1 — OUTLINE CTA

Contact review / Home can retain pill.

No need change.

---

# 254. PREVIOUS IS NOT A STANDARD SECONDARY CTA

It's navigation.

That's why utility treatment is preferred.

---

# 255. P2 — HEADER BACK

Current utility treatment is good.

No changes.

---

# 256. P1 — INTRO BODY PADDING

Current mobile intro spacing looks reasonable.

Do not add cards.

---

# 257. P2 — INTRO REPORT ROWS

Approved.

Keep.

---

# 258. P2 — INTRO LAST PARAGRAPH

Keep.

---

# 259. P1 — LOADING BACK BUTTON

During synthetic loading:

hide or disable.

Current disabled acceptable.

No blocker.

---

# 260. P1 — REPORT HOME BEHAVIOR

Home returns Landing.

Good.

---

# 261. P1 — ROUND TABLE CLOSE

Focus restore good.

Keep.

---

# 262. P1 — DRAWER ESC

Keep.

---

# 263. P1 — REDUCED MOTION

Keep.

Task button modifier must respect current reduced-motion rules automatically.

---

# 264. P1 — PRINT COLOR

Keep print-color-adjust.

---

# 265. P0 — BUILD

Run:

```bash
npm run build
```

If toolchain has known unrelated issue:

report exact error.

Do not patch build config opportunistically.

---

# 266. P1 — LINT

Run project configured lint if available.

No package changes.

---

# 267. P0 — RENDER QA

Do not declare done from code inspection only.

Render/check major screens.

---

# 268. REQUIRED DESKTOP QA

```text
1440×900
1366×768
1280×800
```

---

# 269. REQUIRED MOBILE QA

```text
430×932
390×844
375×812
360×800
```

---

# 270. REQUIRED SCREEN QA

```text
Intro
Part1 Q1
Part1 mid
Part1 Q18
Part2 Q19
Part2 Q24
Drawer at Q17
Contact Part1
Contact Private
Loading
Report Part1
Report Private
Roundtable modal
```

---

# 271. SPECIFIC SCREENSHOT — QUESTION DESKTOP

Validate:

```text
Previous left
Next right
```

natural widths.

No stretched red bar.

---

# 272. SPECIFIC SCREENSHOT — INTRO

Validate:

CWI program name not duplicated excessively.

---

# 273. SPECIFIC SCREENSHOT — LOADING

Validate:

No spinner.

No AI-generation feel.

---

# 274. SPECIFIC SCREENSHOT — MARKET UNAVAILABLE

Validate:

Looks intentional.

No dev copy.

No empty chart.

---

# 275. SPECIFIC SCREENSHOT — PRIVATE REPORT

Validate:

No statement that analysis model is missing.

---

# 276. SPECIFIC SCREENSHOT — MOBILE NAV

Validate:

question starts reasonably high.

---

# 277. CUSTOMER-LEVEL ACCEPTANCE TEST

Imagine the report is emailed to:

```text
CEO
Board member
HR Director
Investor
```

Would any visible sentence imply:

```text
unfinished
demo
fake
technical limitation
```

If yes, fail.

---

# 278. FINAL VISUAL DESIGN PRINCIPLE

The final refinement should make UI look:

```text
less designed
more deliberate
```

Meaning:

- fewer competing controls;
- fewer technical states;
- less repeated branding;
- stronger hierarchy;
- cleaner transitions.

---

# 279. DO NOT ADD SOMETHING TO FIX EVERY PROBLEM

Many V4 fixes are removals:

```text
remove spinner
remove status badge
remove technical copy
remove fake visual
remove repeated brand phrase
remove oversized button width
```

This is intentional.

---

# 280. FINAL P0/BLOCKER ORDER

Agent must execute in this order:

## Step 1

Remove production credibility blockers.

## Step 2

Fix action layout.

## Step 3

Fix section naming.

## Step 4

Run functional regression.

Only then polish.

---

# 281. FINAL P1 ORDER

1. Task CTA intensity.
2. Previous button hierarchy.
3. Intro repetition.
4. Loading.
5. Market pending visual.
6. Mobile nav compactness.
7. Radar mobile QA.

---

# 282. FINAL P2 ORDER

1. Drawer auto-scroll.
2. Details +/-.
3. URL wrapping.
4. Tiny spacing.

---

# 283. DEFINITION OF DONE — BLOCKERS

All must be true:

- [ ] No technical report-status copy.
- [ ] No unfinished-analysis copy.
- [ ] No false benchmark label.
- [ ] No fake market chart if data absent.
- [ ] No demo numbers presented as real.

---

# 284. DEFINITION OF DONE — QUESTION

- [ ] One-question mode intact.
- [ ] Desktop actions flex.
- [ ] Next natural width.
- [ ] Repeated Next calmer.
- [ ] Final phase CTA stronger.
- [ ] Previous visually secondary.
- [ ] Mobile works at 360.

---

# 285. DEFINITION OF DONE — INTRO

- [ ] CWI logo stays.
- [ ] Program label not duplicated.
- [ ] Full content preserved.
- [ ] No extra UI added.
- [ ] CTA brand retained.

---

# 286. DEFINITION OF DONE — LOADING

- [ ] Spinner removed.
- [ ] Progress line remains.
- [ ] Steps remain.
- [ ] Loading time reasonable or real async.
- [ ] No theatrical AI feel.

---

# 287. DEFINITION OF DONE — REPORT

- [ ] Executive-safe pending Market state.
- [ ] Score rows present.
- [ ] Domain radar present.
- [ ] Domain bars present.
- [ ] Domain section accurately named.
- [ ] Answers present.
- [ ] Private signals present.
- [ ] No unavailable-feature promise.
- [ ] Roundtable after Report.

---

# 288. DEFINITION OF DONE — MOBILE

- [ ] Mobile nav compact.
- [ ] List trigger easy.
- [ ] Question near top.
- [ ] Actions fit.
- [ ] Radar labels readable.
- [ ] No horizontal overflow.
- [ ] Drawer opens with active row visible.

---

# 289. DEFINITION OF DONE — ACCESSIBILITY

- [ ] Focus styles preserved.
- [ ] Drawer trap preserved.
- [ ] Modal trap preserved.
- [ ] Escape preserved.
- [ ] Focus restore preserved.
- [ ] Native radio semantics preserved.
- [ ] Progress aria correct.
- [ ] Radar has text/value alternative.

---

# 290. DEFINITION OF DONE — CODE

- [ ] No new dependency.
- [ ] No landing modification.
- [ ] No scoring modification.
- [ ] No survey question copy change.
- [ ] No appended CSS patch section.
- [ ] Dead CSS removed.
- [ ] Unused imports removed.

---

# 291. FAILURE CONDITIONS

Task fails if:

- agent redesigns architecture again;
- long-form returns;
- technical data status remains visible;
- unfinished-model text remains;
- domain section still says benchmark without benchmark;
- fake chart remains in unavailable state;
- Next is still accidentally stretched desktop;
- all question buttons remain full hero-level CTA;
- Intro brand repetition remains unchanged;
- spinner remains after claiming refinement complete;
- agent changes Landing to solve Survey issues;
- agent invents market data;
- agent invents analysis/recommendations.

---

# 292. REQUIRED AGENT HANDOFF

After implementation return:

```text
1. Files changed
2. Blockers removed
3. Question action changes
4. CTA hierarchy changes
5. Intro branding changes
6. Loading changes
7. Market unavailable/live state behavior
8. Report terminology changes
9. Private report copy changes
10. Mobile navigation refinement
11. Drawer refinement
12. Desktop QA
13. Mobile QA
14. Accessibility QA
15. Build/lint result
16. Remaining known gaps
```

---

# 293. REQUIRED MARKET DATA HANDOFF

Agent must explicitly state one:

```text
A. Real market data source found and wired.
```

or:

```text
B. No real market dataset found;
   executive-safe pending state is rendered.
```

No ambiguity.

---

# 294. REQUIRED ANALYSIS HANDOFF

Agent must explicitly state:

```text
No interpretation/recommendation logic
was fabricated.
```

if none exists.

---

# 295. FINAL INSTRUCTION

Implement directly.

Do not only comment.

Do not over-design.

This V4 pass should make the product feel more expensive by:

```text
removing the wrong things
fixing hierarchy
protecting trust
refining micro-interactions
```

not by adding visual effects.

---

# 296. FINAL END STATE

The finished experience should feel like:

> **a serious CWI executive research product that is ready to be sent to real CEOs.**

The user should never see evidence that they are using:

> a prototype,
> an unfinished data pipeline,
> or an internal product build.

That is the standard for this pass.
