# CWI Survey UX Architecture V2
## Premium Executive Research Experience — Implementation Specification for Codex / Luna 5.6 Extra High

**Project reviewed:** `source4(3).zip`  
**Scope:** `src/features/survey/**` only, except minimal wiring needed to keep the existing landing → survey transition working.  
**Primary objective:** Rebuild the Survey experience from the current “clean enterprise form” into a **premium executive research product** with strong information hierarchy, focused interaction, high trust, and excellent mobile ergonomics.

---

# 0. READ THIS FIRST

This is **not** another CSS polish pass.

Do **not** append a new “V2 redesign override” block to the bottom of `survey.css`.

The current source already solved much of the previous visual noise:

- 0 gradients in `survey.css`
- 0 `backdrop-filter`
- 0 `999px` radius
- only 2 `box-shadow` declarations
- spacing/radius tokens exist
- most glass/glow/template styling is gone

The remaining problem is now primarily:

1. **UX architecture**
2. **information hierarchy**
3. **screen composition**
4. **trust / credibility**
5. **interaction semantics**
6. **mobile navigation**
7. **result/report meaning**

Therefore this task must refactor **React structure + interaction flow + CSS**, not merely restyle the current DOM.

---

# 1. PRODUCT POSITIONING

The CWI Survey is not:

- a lead-generation form
- a SaaS admin dashboard
- a marketing quiz
- a gamified assessment
- a generic Google Form replacement
- an AI-generated analytics demo

The CWI Survey should feel like:

> **A private, credible, executive-grade research and diagnostic instrument created for CEOs and senior leadership.**

The experience should communicate:

- seriousness
- confidentiality
- calm confidence
- high editorial quality
- thoughtful data collection
- low cognitive friction
- deliberate interaction
- credible reporting

The UI must feel expensive because it is **precise and restrained**, not because it has more effects.

---

# 2. CURRENT SOURCE — IMPORTANT FACTS

The current implementation contains:

## Core state / orchestration

`src/features/survey/SurveyExperience.tsx`

Current screen states:

```ts
type SurveyScreen =
  | 'intro'
  | 'part1'
  | 'part2'
  | 'contact1'
  | 'contact2'
  | 'loading'
  | 'result'
```

Current answer state:

```ts
const [answers, setAnswers] = useState<Answers>({})
const [otherAnswers, setOtherAnswers] = useState<Answers>({})
```

Existing scoring:

```ts
getSurveyScores(answers)
```

Existing Part 1:

- Questions 1–16 = Likert 1–5
- Questions 17–18 = MCQ

Existing Part 2:

- Questions 19–23 = MCQ
- Question 24 = Website text input

## Current UX architecture

`SurveyQuestionPage.tsx` currently does:

```tsx
{questions.map((question) => (
  <QuestionCard ... />
))}
```

This renders **all questions in a part in one long page**.

That architecture must change.

---

# 3. TARGET ARCHITECTURE — FOCUSED SURVEY MODE

## Mandatory design decision

### Replace the long-form “all questions on one page” survey with:

# **ONE QUESTION AT A TIME**

The user should make one decision per primary viewport.

This applies to:

- Part 1
- Part 2
- Desktop
- Tablet
- Mobile

The user can still navigate to previous/answered questions through a question navigator.

---

# 4. WHY ONE-QUESTION MODE IS REQUIRED

The current long-form architecture creates:

- excessive scrolling
- poor focus
- visual repetition
- repeated metadata
- a “form document” feeling
- weak mobile ergonomics
- validation jumps that feel broken
- duplicated progress UI
- an impression closer to internal enterprise software than a premium research experience

The target interaction should feel:

```text
context
↓
one question
↓
one answer
↓
next decision
```

Not:

```text
hero
↓
notice
↓
question
↓
question
↓
question
↓
question
↓
...
↓
sticky footer
```

---

# 5. NON-NEGOTIABLE DATA / CONTENT CONSTRAINTS

## Do not change `surveyData.ts` content

Preserve exactly:

- all 24 questions
- question numbering
- question order
- question wording
- MCQ options
- Part 1 / Part 2 definitions
- intro copy
- report parts copy
- privacy copy
- Roundtable copy

Do not:

- rewrite
- shorten
- paraphrase
- “improve Vietnamese”
- change punctuation
- reorder answer options
- normalize terminology
- invent new questions
- remove “Mục khác:”
- alter question scoring domains

If a typo exists in source, keep it unless explicitly instructed otherwise.

---

# 6. NON-NEGOTIABLE LOGIC CONSTRAINTS

Preserve the semantic behavior of:

- `hasQuestionAnswer`
- `OTHER_OPTION`
- `validEmail`
- `getSurveyScores`
- `answers`
- `otherAnswers`
- Part 1 completion requirement
- Part 2 optional behavior
- Part 2 started → completion requirement
- private report consent requirement
- report mode selection
- contact validation
- loading state
- print/download behavior

Do not modify scoring formulas merely to improve the visual output.

---

# 7. BUSINESS FLOW CHANGE — ROUNDTABLE

This is the **one intentional journey change required by this spec**.

## Current flow — REMOVE

```text
Complete survey
→ Contact
→ Click “Nhận báo cáo”
→ Roundtable modal interrupts
→ Register / Skip
→ Loading
→ Report
```

This feels like an upsell / lead-gen gate before delivering the value already promised.

## New flow — REQUIRED

```text
Complete survey
→ Contact / consent
→ Click “Nhận báo cáo”
→ Loading
→ Report
→ Optional CEO Roundtable invitation
```

The user must see the report **before** being asked to register for Roundtable.

### Roundtable placement

Place it:

- after the main result content
- before final page actions, OR
- as a restrained report footer section

Preferred:

```text
────────────────────────────────────────

CEO ROUNDTABLE

Tiếp tục cuộc đối thoại cùng nhóm CEO Đồng kiến tạo

[existing Roundtable copy summary]

11:00 – 13:30 | ...
Tối đa 30 người
Địa điểm: ...

Đăng ký tham dự →
```

Clicking CTA opens the Roundtable modal.

The modal is now a **voluntary post-report action**, never a blocker.

---

# 8. STATE MACHINE — TARGET

Refactor `SurveyExperience.tsx` so the application has explicit survey question position state.

Recommended:

```ts
type SurveyScreen =
  | 'intro'
  | 'part1'
  | 'part2'
  | 'contact1'
  | 'contact2'
  | 'loading'
  | 'result'

const [activeQuestion, setActiveQuestion] = useState<number>(1)
```

Active question must represent the actual displayed question, not “question currently detected by IntersectionObserver”.

## Remove need for IntersectionObserver

The target architecture displays one question at a time.

Therefore remove:

- `IntersectionObserver`
- scroll-based active-question detection
- `scrollIntoView` as the primary question navigation mechanism

Question navigation should become state-based.

---

# 9. QUESTION NAVIGATION MODEL

Implement utility helpers.

Recommended:

```ts
function getQuestionIndex(
  questions: SurveyQuestion[],
  questionNumber: number,
) {
  return questions.findIndex((q) => q.n === questionNumber)
}
```

```ts
function getCurrentQuestion(
  questions: SurveyQuestion[],
  questionNumber: number,
) {
  return questions.find((q) => q.n === questionNumber) ?? questions[0]
}
```

```ts
function getPreviousQuestion(
  questions: SurveyQuestion[],
  currentNumber: number,
) { ... }
```

```ts
function getNextQuestion(
  questions: SurveyQuestion[],
  currentNumber: number,
) { ... }
```

---

# 10. QUESTION NAVIGATION RULES

## Next

When user presses Next:

### If current question is unanswered

- do not move
- show inline error under the answer control
- focus the first appropriate answer control
- no page jump
- no global bottom error

### If current question is answered and not last

- move to next question
- scroll page to top of question workspace
- update progress
- update title/accessibility announcement

### If last question of Part 1

- validate Part 1
- move to Part 2

### If last question of Part 2

Existing semantics remain:

- if no Part 2 questions answered → Part 1 report path
- if Part 2 has started → all required Part 2 questions must be complete
- if complete → private report contact

---

# 11. PREVIOUS

When user presses Previous:

- if not first question → previous question
- keep existing answers
- no confirmation dialog

If first question in Part 1:

- Previous returns to Intro

If first question in Part 2:

- Previous returns to last question of Part 1

Preferred behavior:

```text
Part 1 Q18 → Part 2 Q19
Part 2 Q19 + Previous → Part 1 Q18
```

This creates continuity.

---

# 12. DIRECT JUMP

The question navigator can jump to any question in the **current part**.

Rules:

- answered question → always accessible
- unanswered future question → also accessible
- user is allowed to review in any order

Do not force a linear lock.

However the primary Next path should remain linear and obvious.

---

# 13. PART TRANSITION

When Part 1 completes, do not immediately dump user into Q19 with no context.

Use a compact transitional state or an inline Part 2 introduction.

Preferred:

```text
PHẦN 1 HOÀN TẤT

18/18 câu đã hoàn tất.

Anh/Chị có thể tiếp tục Phần 2 để nhận
Báo cáo Riêng tư với phân tích sâu hơn.

[Tiếp tục Phần 2 →]

[Xem thêm về Phần 2]
```

But do **not invent new copy** beyond what is already supported by source.

Therefore use the existing Part 2 intro text from `SurveyExperience.tsx`:

> “Phần 2 là phần định danh để tạo Báo cáo Riêng tư...”

Render this existing copy in a transition panel.

### Alternative

If avoiding new intermediate state, display the Part 2 intro once above Q19.

Do not repeat it for every question.

---

# 14. SCREEN ARCHITECTURE OVERVIEW

Target screen structure:

```text
SurveyExperience
│
├── SurveyHeader
│
├── IntroScreen
│
├── FocusedQuestionScreen
│   ├── SurveyProgressHeader
│   ├── QuestionWorkspace
│   │   ├── QuestionNumber
│   │   ├── QuestionText
│   │   ├── QuestionInput
│   │   ├── InlineValidation
│   │   └── QuestionActions
│   └── QuestionNavigator
│
├── ContactScreen
├── LoadingScreen
├── ResultScreen
│   ├── ReportHeader
│   ├── ScoreOverview
│   ├── DomainAnalysis
│   ├── AnswerSummary
│   ├── PrivateContextAnalysis
│   ├── RoundtableInvitation
│   └── ResultActions
│
└── RoundtableModal
```

---

# 15. RECOMMENDED COMPONENT REFACTOR

## Replace / refactor current files

### `SurveyQuestionPage.tsx`

Refactor heavily.

Target responsibility:

- current question selection
- progress context
- current question workspace
- previous/next controls
- navigator opening
- inline validation placement

### `QuestionCard.tsx`

Rename if desired:

```text
QuestionCard.tsx
→ SurveyQuestion.tsx
```

“Card” is conceptually wrong for the target UI.

It should render one question, not a visual card.

### `SurveyNavigation.tsx`

Refactor to:

- `SurveyProgressHeader`
- `QuestionNavigator`
- optional desktop navigator panel
- mobile bottom sheet

Remove:

- `SurveyProgressRail` long-list-as-primary-layout
- `MobileQuestionNav` current behavior
- current “Câu XX” button that scrolls to itself

### `SurveyScreens.tsx`

Strongly recommended to split.

Current file mixes:

- Intro
- Contact
- Loading
- Result
- Chart
- Roundtable modal
- Brand panel

This weakens maintainability.

Recommended files:

```text
src/features/survey/screens/IntroScreen.tsx
src/features/survey/screens/ContactScreen.tsx
src/features/survey/screens/LoadingScreen.tsx
src/features/survey/screens/ResultScreen.tsx
src/features/survey/components/RoundtableModal.tsx
src/features/survey/components/RoundtableInvitation.tsx
src/features/survey/components/DomainBars.tsx
```

This is optional if the agent judges file movement risky, but component responsibilities should still be separated internally.

---

# 16. INTRO — REMOVE THE LEFT BRAND CARD

Delete the visual use of:

```tsx
<SurveyBrandPanel />
```

from the Intro layout.

The current intro duplicates branding already present in the header and creates a two-card brochure layout.

The target Intro should be editorial, centered around the research proposition.

---

# 17. INTRO — TARGET DESKTOP LAYOUT

Recommended maximum width:

```text
880–960px
```

Not full 1120px for the reading content.

Structure:

```text
CEO WORKFORCE INDEX 2026Q3

Năng lực Lãnh đạo
cho Tăng trưởng

[existing paragraph 1]

[existing paragraph 2]

[existing paragraph 3]

────────────────────────────────────

01
Khảo sát và Báo cáo Khuyết danh
• bullet
• bullet

02
Khảo sát Định danh và Báo cáo Riêng tư
• bullet
• bullet

────────────────────────────────────

[existing last paragraph]

[Bắt đầu khảo sát →]

Quay lại landing page
```

---

# 18. INTRO — VISUAL RULES

No:

- side card
- sticky side panel
- duplicate logo
- “brochure card”
- nested bordered blocks
- shadows
- big colored boxes

Use:

- typography
- horizontal rules
- number hierarchy
- whitespace

The page background can remain neutral.

The reading area itself does not need a large outer border.

Preferred:

```css
.survey-intro-screen {
  max-width: 900px;
  margin: 0 auto;
  background: transparent;
  border: 0;
  padding: 32px 0 64px;
}
```

---

# 19. INTRO — HERO TYPOGRAPHY

Current global H1 can remain close to:

```css
font-size: clamp(40px, 4vw, 56px);
font-weight: 600;
line-height: 1.02;
letter-spacing: -0.035em;
```

Do not over-enlarge beyond approximately 64px.

This is a research experience, not an advertising hero.

---

# 20. HEADER — SIMPLIFY

Current header has:

```text
[← Trang chủ] [Logo] [Phase/state] [Menu/Home]
```

On non-question screens the right button duplicates Home.

Fix this.

## Desktop question screens

```text
[←] [CWI logo]        Phần 1 · 06/18        [Danh sách câu hỏi]
```

## Desktop non-question screens

```text
[←] [CWI logo]                  [current phase]
```

No second Home button.

## Mobile

```text
[←] [CWI]            06 / 18        [☰]
```

The center must visually balance.

Do not use right-aligned phase text in a way that makes the logo visibly off-center.

---

# 21. HEADER MOBILE GRID

Do not use the current:

```css
grid-template-columns: 44px 86px minmax(0,1fr) 44px;
```

with a separate text phase occupying arbitrary remaining space.

Prefer:

```css
grid-template-columns: 44px minmax(80px, auto) 1fr 44px;
```

or a flex solution where:

- logo has fixed width
- progress is centered/right without breaking balance
- left/right actions use identical 44px slots

Test 360px width.

---

# 22. SURVEY QUESTION SCREEN — DESKTOP COMPOSITION

Target:

```text
┌─────────────────────────────────────────────────────────────┐
│ PHẦN 1                                      06 / 18          │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
└─────────────────────────────────────────────────────────────┘


06
Doanh nghiệp của chúng tôi có đủ năng lực...

Chọn một mức độ phù hợp nhất

Không đồng ý                                      Hoàn toàn đồng ý

[ 1 ]       [ 2 ]       [ 3 ]       [ 4 ]       [ 5 ]


← Câu trước                                  Câu tiếp theo →


                         Xem tất cả câu hỏi
```

The current question should dominate.

---

# 23. QUESTION WORKSPACE WIDTH

Desktop:

```text
max-width: 760–820px
```

Center it.

Do not stretch one question to 1120px.

Question text should remain easy to read.

For long MCQ answer rows, maximum width may be 820px.

---

# 24. QUESTION SCREEN VERTICAL POSITIONING

Do not vertically center the question exactly in the viewport.

Exact vertical centering often causes unstable jumps as option height changes.

Prefer:

```text
top padding from header: 56–72px
```

Question text starts at a consistent position.

For short questions the lower half may contain whitespace.

That whitespace is desirable.

---

# 25. REMOVE CURRENT QUESTION HERO

Current:

```text
big page hero
+ subtitle
+ progress card
+ notice
+ mobile progress
+ question layout
```

This delays the first actual question.

Replace with a compact progress header.

Example:

```text
PHẦN 1 · KHẢO SÁT KHUYẾT DANH                     06 / 18
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Below it, the current question begins.

The part subtitle / intro may appear:

- only on Q1 of each part
- as a small note above Q1
- never as a large hero repeated during navigation

---

# 26. PROGRESS — TWO DIFFERENT MEANINGS

Distinguish:

## Position progress

Current question position:

```text
6 / 18
```

## Completion progress

Answered questions:

```text
8 / 18 answered
```

Do not visually overemphasize both.

Primary top progress should use **position**.

Question navigator can display completion status.

This avoids confusing situations where user jumps to Q12 but only answered 5 questions.

---

# 27. TOP PROGRESS BAR

Progress bar should represent position:

```ts
const currentIndex = questions.findIndex(...)
const positionProgress =
  ((currentIndex + 1) / questions.length) * 100
```

Not `completedCount / questions.length`.

Reason:

One-question flow is spatial/navigation progress first.

Completion status remains available in navigator.

---

# 28. QUESTION NUMBER

Use:

```text
06
```

or:

```text
CÂU 06
```

Choose one.

Preferred premium version:

```text
06
```

small/medium, muted blue/navy.

Do not show:

```text
Câu 06 · Phần 1
```

because Part 1 is already shown in top progress.

---

# 29. REMOVE “CHƯA TRẢ LỜI”

Do not display “Chưa trả lời” next to every current question.

It communicates nothing.

For answered question review:

Option state itself visibly shows the answer.

Navigator shows check state.

No status text needed in the question body.

---

# 30. LIKERT — DESKTOP

Part 1 Q1–Q16.

Target interaction:

```text
Không đồng ý                                      Hoàn toàn đồng ý

┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐
│  1   │  │  2   │  │  3   │  │  4   │  │  5   │
└──────┘  └──────┘  └──────┘  └──────┘  └──────┘
```

Use a single uninterrupted row.

Recommended:

```css
grid-template-columns: repeat(5, minmax(72px, 1fr));
gap: 10px;
```

Workspace max-width approximately 680px for Likert controls.

---

# 31. LIKERT — LABEL SEMANTICS

Current legend:

```text
1 · Không đồng ý
5 · Hoàn toàn đồng ý
```

Better visual layout:

```text
Không đồng ý                            Hoàn toàn đồng ý
```

Numbers are already inside buttons.

Do not duplicate 1 and 5 in legend unless needed for source clarity.

This is a presentation change only, not content rewriting.

---

# 32. LIKERT SELECTED STATE

Default:

- white or transparent
- 1px neutral border
- dark text

Hover:

- stronger border
- subtle blue-tinted background

Selected:

- solid `--survey-navy` OR `--survey-blue`
- white number
- no shadow
- no gradient
- no scale

Use one selected color consistently.

Preferred:

```css
background: var(--survey-navy);
border-color: var(--survey-navy);
color: #fff;
```

This feels more executive than bright blue.

---

# 33. LIKERT KEYBOARD

Keep native radio inputs accessible.

Important:

The current CSS visually hides radio inputs.

Ensure focus is visible on label:

```css
.survey-likert-grid input:focus-visible + label {
  outline: 3px solid rgba(...);
  outline-offset: 3px;
}
```

Do not rely on focus ring on invisible input.

---

# 34. OPTIONAL KEYBOARD SHORTCUTS

Recommended but not mandatory:

For Likert questions:

```text
keys 1–5 → select answer
Enter → Next
Arrow Left / Arrow Right → Previous / Next
```

Only implement if:

- it does not interfere with text inputs
- it remains discoverable/accessibility-safe
- keyboard listener is scoped properly

Do not add if implementation becomes fragile.

---

# 35. AUTO-ADVANCE — DO NOT FORCE

Do not automatically jump to next question immediately after selecting a radio.

For CEOs reviewing a question, forced movement can feel abrupt and lead to accidental answers.

Preferred:

- selection is immediate
- Next CTA becomes clearly enabled
- optional soft hint via button state
- user explicitly clicks/taps Next

If auto-advance is implemented, it must be delayed and cancellable; however this spec recommends **no auto-advance**.

---

# 36. MCQ

Use one column.

Current option texts are long.

Never split the current questions into two columns.

Target:

```text
○ Thiếu năng lực quản lý

○ Thiếu người kế nhiệm

○ Khó tuyển quản lý giỏi

○ Quản lý chưa theo kịp AI/chuyển đổi số

○ CEO và Nhân sự chưa thống nhất

○ Mục khác:
```

---

# 37. MCQ RADIO INDICATOR

Current `.survey-option-dot` uses rounded square geometry.

Change to true radio:

```css
border-radius: 50%;
```

Selected:

- outer border blue/navy
- internal 8px dot
- no filled square

Use pseudo-element or nested dot.

---

# 38. MCQ OPTION ROW

Recommended desktop:

```css
min-height: 54px;
padding: 14px 16px;
border-radius: 10px;
border: 1px solid var(--survey-border);
```

Selected:

```css
background: #f5f8fd;
border-color: var(--survey-blue);
```

No card shadow.

---

# 39. MCQ FOCUS

Ensure:

```css
input:focus-visible + label
```

gets a visible focus ring.

---

# 40. OTHER INPUT

When “Mục khác:” is selected:

- render or reveal the input directly below that selected row
- preserve existing `otherAnswers`
- focus the text input after selection if safe
- validation requires non-empty text exactly as current `hasQuestionAnswer` does

Preferred CSS reveal:

- opacity
- max-height
- small translateY
- 160–200ms

No large accordion animation.

---

# 41. TEXT QUESTION Q24

Q24:

```text
Website công ty
```

Use a large clean URL field.

Do not make the placeholder smaller than 14px.

Recommended:

```text
Website công ty

┌──────────────────────────────────────────┐
│ https://tencongty.vn                     │
└──────────────────────────────────────────┘
```

---

# 42. QUESTION INLINE ERROR

Remove the current single bottom-of-stack error.

Target state:

```ts
const [questionError, setQuestionError] = useState<string>('')
```

The error belongs next to the current question.

Example:

```text
⚠ Vui lòng chọn một đáp án để tiếp tục.
```

For Other:

```text
⚠ Vui lòng nhập nội dung cho “Mục khác”.
```

Do not invent highly specific strings if logic becomes cumbersome; existing error wording can be reused.

But error must be visually located in the current workspace.

---

# 43. QUESTION ERROR STYLE

No large warning card.

Use:

```css
display: flex;
gap: 8px;
margin-top: 16px;
color: #b42318;
font-size: 14px;
```

Optional:

```css
padding: 10px 12px;
background: #fff7f6;
border-left: 2px solid #d92d20;
```

No shadow.

---

# 44. QUESTION ACTIONS — DESKTOP

Actions belong directly below the current answer.

```text
← Câu trước                               Câu tiếp theo →
```

The row width follows workspace.

Primary Next button:

- solid red according to existing brand system
- 48px height minimum
- not oversized

Previous:

- ghost or outline
- lower visual priority

---

# 45. DISABLED VS VALIDATION BEHAVIOR

Preferred:

Do **not** permanently disable Next for unanswered questions.

Why:

- disabled buttons give poor explanation
- user may not know what is missing
- clicking Next can trigger clear validation

Therefore:

- Next looks normal
- clicking without answer shows inline error

Exception: consent submit can remain disabled in explicit no-consent state.

---

# 46. QUESTION NAVIGATOR — DESKTOP

Do not permanently display a large 18-row rail next to the question.

The focused question should get the full attention.

Preferred desktop:

Header button:

```text
Danh sách câu hỏi
```

opens a side sheet / popover panel.

Alternative accepted:

A slim navigator rail showing only numbers:

```text
01 ✓
02 ✓
03
04
...
```

but only if it remains visually quiet.

Strong recommendation: **use drawer / side panel on all breakpoints**.

This gives Desktop and Mobile the same mental model.

---

# 47. QUESTION NAVIGATOR — STRUCTURE

Panel header:

```text
Phần 1
8/18 đã trả lời
```

List item:

```text
06   Doanh nghiệp của chúng tôi...
     ✓
```

States:

- current
- answered
- unanswered

Current:

- subtle background
- left accent
- no filled blue capsule

Answered:

- check icon
- text remains neutral

---

# 48. QUESTION NAVIGATOR — DESKTOP DRAWER

Recommended:

```text
position: fixed
right: 0
top: headerHeight
height: calc(100dvh - headerHeight)
width: 380px
```

Overlay on background.

Use:

- white
- left border
- modal-level shadow only if needed

Do not make it another card floating 24px from edge.

---

# 49. QUESTION NAVIGATOR — MOBILE

Use bottom sheet, not right drawer.

```text
bottom: 0
left: 0
right: 0
max-height: 78dvh
border-radius: 20px 20px 0 0
```

Add:

- drag handle visual
- close button
- scrollable list

Do not implement actual drag physics unless already easy.

---

# 50. FIX CURRENT MOBILE “CÂU XX” AFFORDANCE

Delete the current behavior:

```tsx
<button onClick={() => onJump(activeQuestion)}>
  Câu XX
</button>
```

It currently navigates to the already active question and provides almost no useful action.

Replace with:

```text
06 / 18                     Tất cả câu hỏi
```

or:

```text
Câu 06                      ☰ Danh sách
```

Button must open navigator.

---

# 51. MOBILE TOP PROGRESS

Mobile should have one compact progress area only.

Target:

```text
PHẦN 1                              06 / 18
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Do not additionally show:

- `8/18 hoàn tất` in another box
- duplicate progress in sticky footer
- a second progress card

Completion count belongs in navigator.

---

# 52. MOBILE QUESTION SCREEN

At 390×844 target:

```text
Header 58px

16px top spacing

PHẦN 1                          06 / 18
progress line

32px gap

06

Question title wraps naturally

24px gap

answer controls

16px inline error if any

32px gap

Previous / Next

safe area
```

No nested panel border is required.

---

# 53. MOBILE LIKERT

Keep all 5 values on one row.

At 360px:

- page horizontal padding: 16px
- grid gap: 6px
- minimum label height: 48px

Calculate width correctly.

No horizontal scroll.

---

# 54. MOBILE ACTIONS

Do not use the current fixed bottom bar that contains duplicate progress + two buttons unless ergonomically necessary.

Preferred:

- normal flow actions below answer
- next question appears without excessive scroll because only one question exists

This eliminates the need for a persistent sticky footer entirely.

If Q19–Q24 option lists are tall, optional sticky Next may be used **only on mobile**, but it must not duplicate progress.

---

# 55. MOBILE SAFE AREA

If any fixed/bottom sheet element exists:

```css
padding-bottom: max(16px, env(safe-area-inset-bottom));
```

Test iPhone-style viewport.

---

# 56. PART 1 UX

Questions 1–16 have repeated Likert structure.

Maintain interaction consistency.

Question 17–18 switch to MCQ.

At Q17, no need for a special “new type” animation.

Question numbering is enough.

---

# 57. PART 2 UX

Part 2 is more sensitive because it becomes identifiable.

Before Q19, clearly display the **existing Part 2 intro**.

Do not repeat privacy consent yet; privacy/consent belongs on Contact screen.

Do not create fear by over-warning.

Use calm informational copy.

---

# 58. PART 2 OPTIONALITY

The current logic allows Part 2 to be skipped for Part 1 report.

This should be explicit in Part 2 entry/first question context.

Use source-supported wording:

> Nếu không muốn cung cấp thêm dữ liệu, Anh/Chị có thể ... nhận Báo cáo Phần 1.

Do not hide the skip option.

Potential UI:

```text
Tiếp tục Phần 2 để nhận Báo cáo Riêng tư.

[Bắt đầu Phần 2]

Nhận Báo cáo Phần 1
```

If implementing an entry screen, use only existing source copy.

---

# 59. CONTACT SCREEN — TARGET

Contact should feel like a private handoff, not a marketing form.

Desktop maximum width:

```text
720–760px
```

No large bordered outer card necessary.

Structure:

```text
NHẬN BÁO CÁO

Nhận Báo cáo Riêng tư

[thank-you paragraph]

Họ tên *
[input]

Email công ty/cá nhân *
[input]

[privacy / consent if private]

[Nhận báo cáo →]

Xem lại câu trả lời
```

---

# 60. CONTACT FIELDS

Prefer one-column fields even on Desktop.

Reason:

- name and email are not a dense admin form
- one-column reads more premium and deliberate
- better error placement
- easier mobile parity

If keeping two columns is acceptable, ensure width remains comfortable.

Strong preference: **one column**.

---

# 61. FORM VALIDATION

Current `isContactValid` returns one global error.

Recommended incremental improvement:

Keep logic function but map presentation close to form.

At minimum:

- show global error directly below fields
- focus first invalid input

Better:

```ts
type ContactErrors = {
  name?: string
  email?: string
}
```

But do not overcomplicate if it changes too much logic.

---

# 62. PRIVATE CONSENT — POSITION

Do not show consent before the user has entered fields if it creates a huge wall of legal text.

Recommended layout:

1. title / thank-you
2. fields
3. privacy section
4. consent radio
5. CTA

This creates a logical flow.

---

# 63. PRIVACY SECTION

Current privacy has a bordered box with a lock icon.

Keep the trust signal, but make it editorial:

```text
Bảo mật dữ liệu

[privacy paragraph]
[privacy paragraph]
[privacy paragraph]

○ Đồng ý
○ Không đồng ý
```

No nested “card inside form card”.

Use:

- top border
- 24px padding top
- icon optional
- subtle text

---

# 64. CONSENT RADIO

Use native radio row appearance.

Do not make “Đồng ý / Không đồng ý” look like two CTA buttons.

Selected row:

- subtle neutral/blue background
- proper radio dot

---

# 65. CONSENT = NO

Current semantics:

- private report cannot proceed
- user can receive Part 1 report instead

Keep this.

Display:

```text
Không có sự đồng ý xử lý dữ liệu, hệ thống không thể tạo Báo cáo Riêng tư.

[Nhận Báo cáo Phần 1]
```

Use existing copy where possible.

Do not use alarming modal.

---

# 66. SUBMIT CONTACT — NEW BEHAVIOR

Current:

```ts
onSubmit={openRoundtable}
```

Change.

Target:

```ts
onSubmit={startReportFromContact}
```

Logic:

```text
validate contact
validate private consent if private
set reportMode
goToScreen('loading')
```

No Roundtable modal.

---

# 67. ROUNDTABLE STATE

Keep:

```ts
roundtableContact
roundtableOpen
roundtableRegistered
roundtableError
```

But initialize `roundtableContact` from `contact` when user clicks the Roundtable CTA **inside ResultScreen**.

Recommended:

```ts
const openRoundtableFromResult = () => {
  setRoundtableContact(contact)
  setRoundtableRegistered(false)
  setRoundtableError('')
  setRoundtableOpen(true)
}
```

---

# 68. LOADING SCREEN

Current loading is acceptable conceptually but still slightly procedural.

Keep the four existing steps:

- Tổng hợp câu trả lời
- Đối chiếu dữ liệu
- Phân tích các nhóm năng lực
- Tạo báo cáo

Do not invent fake processing details.

---

# 69. LOADING LAYOUT

Target:

```text
ĐANG PHÂN TÍCH

Đang tạo Báo cáo Riêng tư

Tổng hợp kết quả ...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ Tổng hợp câu trả lời
✓ Đối chiếu dữ liệu
• Phân tích các nhóm năng lực
  Tạo báo cáo
```

No big spinner required.

Use small progress indicator.

The current `LoaderCircle` can be removed or reduced to 24px.

---

# 70. LOADING TIMING

Current total approximately 2260ms.

Keep unless explicitly required otherwise.

Do not increase fake wait time just to look “premium”.

---

# 71. RESULT — REBUILD AS AN EXECUTIVE REPORT

This is one of the most important tasks.

Current Result still feels like a dashboard because it is a stack of bordered sections/cards.

Target:

> **Editorial digital report**

The page should resemble a serious research report viewed on the web.

---

# 72. RESULT — REMOVE FAKE MARKET CHART

Current `MarketDemo()` renders a decorative hard-coded curve:

```tsx
<path d="M8 126 C58 92..." />
```

It has:

- no actual underlying data
- no axis
- no labels
- no values
- no benchmark
- no explanatory meaning

This must **not** be presented as a meaningful chart.

## Required action

Either:

### Preferred

Remove the chart entirely and keep market context as an editorial section.

OR

### Only if actual market benchmark data exists in source

Render real chart data.

There is no actual benchmark dataset in the reviewed source.

Therefore **remove decorative chart**.

---

# 73. RESULT — DO NOT CLAIM UNSUPPORTED MARKET COMPARISON VISUALLY

The source copy mentions market comparison/benchmark as report concept.

But the current code does not contain benchmark data.

Do not fabricate benchmark percentages or market averages.

You may retain source copy describing the intended report scope, but the on-screen preview must not pretend to have data that is not present.

---

# 74. PRIVATE RESULT — REMOVE HARD-CODED FAKE METRICS

Current:

```tsx
<MiniStat value="72/100" />
<MiniStat value="3" />
<MiniStat value="90" />
```

These values are hard-coded and not derived from answers.

Remove them.

Also remove copy:

> “Nhóm rủi ro ưu tiên được AI gắn cờ...”

unless the underlying source actually computes those signals.

Current code does not.

---

# 75. RESULT — ONLY DISPLAY COMPUTED METRICS

Current computed metrics that are source-supported:

```ts
scores.overall
scores.scale
scores.domains[]
```

These may be shown.

Part 2 answers may be shown as context.

Do not infer numerical scores from Part 2 unless a real formula exists.

---

# 76. RESULT — SCORE OVERVIEW

Instead of two separate big score cards:

```text
Leadership Capacity     78
Scale Readiness         72
```

render a single report score block.

Example:

```text
TỔNG QUAN

Leadership Capacity                     78 / 100
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Scale Readiness                         72 / 100
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

One surface or no surface.

No floating cards.

---

# 77. RESULT — DOMAIN ANALYSIS

The current implementation displays both:

- RadarChart
- DomainBars

This is redundant.

Remove RadarChart.

Use DomainBars only.

Why:

- easier executive scanning
- exact score visible
- mobile-friendly
- printable
- lower decoration
- stronger information density

---

# 78. DOMAIN BAR VISUAL

Each domain:

```text
Thực thi chiến lược                               76
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Năng lực quản lý                                  68
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Use:

- neutral track
- navy/blue fill
- no gradient
- no decorative icon

---

# 79. DOMAIN COPY

Do not invent interpretations like:

- “excellent”
- “at risk”
- “top quartile”

unless thresholds are defined in source.

Only show:

- domain name
- score

If explanatory copy is needed, use generic source-supported language such as “Điểm từ các câu trả lời thuộc nhóm năng lực này,” but do not overstate.

---

# 80. ANSWER SUMMARY

Current Part 1 summary only renders:

```ts
[1, 6, 10, 14, 17, 18]
```

This is arbitrary unless intentionally specified.

For a credible preview, choose one of:

### Option A — full answer appendix

Show all 18 answers in an expandable section.

Preferred.

### Option B — source-labeled “Một số câu trả lời nổi bật”

But that label would be new editorial content.

Therefore use **Option A**.

Structure:

```text
CÂU TRẢ LỜI CỦA ANH/CHỊ

01  [question abbreviated/full]
    4

02  [...]
    3
...
17  ...
18  ...
```

Use full source wording if space allows.

---

# 81. ANSWER SUMMARY — ACCORDION

To avoid excessive result length on screen:

Desktop/mobile can use:

```text
Xem 18 câu trả lời
```

expand/collapse.

But print CSS should render all.

If implementing disclosure:

```html
<details>
```

is acceptable and accessible.

Do not use complex animated accordion.

---

# 82. PRIVATE REPORT — PART 2 CONTEXT

For private mode, present the answers as context sections.

Current `deepItems`:

- Cơ chế ra quyết định
- Độ sẵn sàng mở rộng
- Mức phụ thuộc vào CEO
- Rào cản tăng trưởng
- Bối cảnh doanh nghiệp

These labels can remain because they are derived from existing code structure.

But remove generic fake paragraph:

> “Khu vực này tóm tắt phân tích sâu, kiến nghị...”

unless actual analysis exists.

Instead display:

```text
01
Cơ chế ra quyết định

[actual Q19 answer]
```

and so on.

This is honest and credible.

---

# 83. RESULT — VISUAL STRUCTURE

Target desktop:

```text
REPORT HEADER
────────────────────────────────────────

Báo cáo Riêng tư
Intro copy

Phần 1 + Phần 2


TỔNG QUAN
────────────────────────────────────────
Leadership Capacity             78 / 100
Scale Readiness                 72 / 100


5 NHÓM NĂNG LỰC
────────────────────────────────────────
bars...


CÂU TRẢ LỜI PHẦN 1
────────────────────────────────────────
expandable / rows


BỐI CẢNH RIÊNG CỦA DOANH NGHIỆP
────────────────────────────────────────
01 ...
02 ...
03 ...


CEO ROUNDTABLE
────────────────────────────────────────
invitation


[ Tải xuống PDF ]   Quay về trang chủ
```

No stack of bordered cards.

---

# 84. RESULT — SECTION SEPARATION

Prefer:

```css
border-top: 1px solid var(--survey-border);
padding-top: 48px;
margin-top: 48px;
```

over:

```css
border: 1px solid;
border-radius: 16px;
background: white;
padding: 32px;
```

The report should visually be one document.

---

# 85. RESULT PAGE BACKGROUND

Recommended:

- neutral page background
- main report body white or transparent

Option:

```css
.survey-result-screen {
  max-width: 900px;
  margin: 0 auto;
  background: #fff;
  padding: 56px 64px;
}
```

Could use no outer border.

On mobile:

```css
padding: 24px 0;
```

and full white page if desired.

---

# 86. REPORT HEADER

Use strong editorial hierarchy.

Example:

```text
CEO WORKFORCE INDEX 2026 Q3

Báo cáo Riêng tư

Tổng cấu trúc: ...
```

Right badge such as “Phần 1 + Phần 2” can remain only if it does not look like a pill.

Preferred plain text.

---

# 87. REPORT NUMBERS

Use tabular numerals:

```css
font-variant-numeric: tabular-nums;
```

For scores.

Avoid oversized “dashboard KPI” numbers.

Recommended 36–44px.

---

# 88. ROUNDTABLE INVITATION — RESULT

Create a new component:

```tsx
<RoundtableInvitation onRegister={...} />
```

Use the existing `roundtableCopy`.

Visual:

- top border
- generous padding
- optional very light navy background
- no pop-up styling
- no “limited seats” sales urgency beyond existing source

CTA:

```text
Đăng ký tham dự CEO Roundtable →
```

---

# 89. ROUNDTABLE MODAL — NEW ROLE

Modal is now opened only from the Result page.

Its job:

- allow registration
- not mediate report access

Therefore remove:

```text
Bỏ qua & xem báo cáo
Tiếp tục xem báo cáo
```

New actions:

Before registered:

```text
Đăng ký tham dự
Hủy
```

After registered:

```text
Đã đăng ký thành công
Đóng
```

Do not route away from report.

---

# 90. ROUNDTABLE MODAL DATA

Pre-fill:

- name
- email

from the report contact.

User can edit if desired.

---

# 91. MODAL ACCESSIBILITY — REQUIRED

Current modal lacks production-grade focus behavior.

Implement:

- `aria-modal="true"`
- `role="dialog"`
- labelled title
- focus initial interactive element
- Escape closes
- focus trap inside modal
- restore focus to trigger after close
- body scroll lock while open

Do not install a new dependency solely for focus trap unless necessary.

A small custom implementation is acceptable.

---

# 92. QUESTION NAVIGATOR ACCESSIBILITY

When open:

- background should not remain keyboard-interactive if practical
- Escape closes
- focus goes to close button/header
- restore focus to “Danh sách câu hỏi” trigger
- active question uses `aria-current="step"`

For list:

```tsx
aria-current={isActive ? 'step' : undefined}
```

---

# 93. SCREEN ANNOUNCEMENT

One-question navigation changes content without route changes.

Add a visually hidden live region or focus question heading.

Preferred:

On question change:

```ts
requestAnimationFrame(() => {
  questionHeadingRef.current?.focus()
})
```

with:

```tsx
<h1 tabIndex={-1} ref={...}>
```

This helps keyboard/screen-reader orientation.

Do not cause visible focus outline on programmatic heading focus unless desirable.

---

# 94. PAGE SCROLL ON QUESTION CHANGE

When active question changes:

```ts
window.scrollTo({
  top: 0,
  behavior: prefersReducedMotion ? 'auto' : 'smooth',
})
```

But account for sticky header.

Better:

scroll the question workspace root into view.

Avoid repeated animation if user rapidly navigates.

---

# 95. MOTION

Use motion sparingly.

Allowed question transition:

```text
old opacity 1 → 0
new opacity 0 → 1
translateY 6px → 0
180–220ms
```

No lateral carousel.

No large slide.

No scale.

Framer Motion already exists but do not use it if CSS transition is simpler.

---

# 96. REDUCED MOTION

Respect current reduced motion support.

If adding React/Framer animation, also detect reduced motion.

---

# 97. DESIGN SYSTEM V2

Current tokens are a reasonable base.

Keep:

```css
--survey-bg
--survey-surface
--survey-ink
--survey-ink-secondary
--survey-ink-muted
--survey-navy
--survey-blue
--survey-red
--survey-green
--survey-border
--survey-border-strong
```

Refine surfaces.

Recommended:

```css
--survey-bg: #f4f5f6;
--survey-surface: #ffffff;
--survey-surface-subtle: #f7f8f9;
--survey-ink: #0a1320;
--survey-ink-secondary: #47515e;
--survey-ink-muted: #727b86;
--survey-navy: #001a3d;
--survey-blue: #1d4f91;
--survey-red: #d9212a;
--survey-green: #087a55;
--survey-border: #e1e5e9;
--survey-border-strong: #cdd3da;
```

Do not obsess over exact hex if current brand tokens are intentional.

Architecture matters more.

---

# 98. SURFACE POLICY

Target count of bordered outer “cards” per screen:

### Intro

0–1

### Focused Question

0–1

### Contact

0–1

### Result

0–1 main document container

Do not create a card per content block.

---

# 99. RADIUS POLICY

Keep:

- 8px controls
- 10–12px buttons/input
- 16px drawer/modal/container if needed
- 20px mobile bottom sheet top corners

Do not use rounded rectangles as the main visual identity.

---

# 100. SHADOW POLICY

Use only:

- modal
- drawer if needed
- optional mobile bottom sheet

Question controls, report sections, intro sections: no shadows.

---

# 101. TYPOGRAPHY — PREMIUM THROUGH RHYTHM

Use Inter Variable already installed.

Do not add a serif merely to “look editorial”.

Use:

- larger heading
- smaller metadata
- strong whitespace
- controlled line length

This is sufficient.

---

# 102. TYPOGRAPHY SCALE

Suggested:

```text
Display Intro:
48–60 desktop
34–42 mobile

Screen title:
34–42 desktop
28–34 mobile

Question:
28–34 desktop
22–26 mobile

Report section:
24–28 desktop
22–24 mobile

Body:
16 desktop
15–16 mobile

Meta:
12–13
```

Current question H3 at 21px is too small to dominate one-question mode.

Increase question prominence.

---

# 103. QUESTION TEXT

Recommended:

```css
font-size: clamp(24px, 2.4vw, 32px);
line-height: 1.35;
letter-spacing: -0.02em;
font-weight: 600;
```

For mobile:

```css
font-size: 22px;
line-height: 1.4;
```

Long questions will still wrap well.

---

# 104. MAX LINE LENGTH

Question:

```text
~680–760px
```

Intro body:

```text
~720px
```

Report text:

```text
~720px
```

Do not let long Vietnamese paragraphs span 1000px.

---

# 105. WHITE SPACE

Question workspace target:

```text
progress → question number: 48px
number → question: 12px
question → instruction: 24px
instruction → answer: 16px
answer → error: 12px
answer/error → actions: 32–40px
```

Whitespace is part of the premium feel.

---

# 106. DO NOT ADD DECORATIVE ELEMENTS

No:

- illustration
- abstract circle
- AI glow
- grid
- gradient
- decorative icon cluster
- graph unless data-backed
- “premium” lines everywhere

The UI is content-first.

---

# 107. ICON POLICY

Allowed:

- ArrowLeft
- ArrowRight
- Check
- AlertCircle
- Menu
- X
- LockKeyhole
- Download

Remove unnecessary:

- Home duplicate
- decorative icons

---

# 108. BUTTON COPY

Preserve existing source/button meaning.

For question mode, labels may become contextually:

Part 1:

```text
Câu tiếp theo
Tiếp tục sang Phần 2
```

Part 2:

```text
Câu tiếp theo
Xem kết quả khảo sát
```

Previous:

```text
Câu trước
```

This is UI navigation copy and may be adjusted.

Do not rewrite survey content.

---

# 109. PRIMARY BUTTON COLOR

Current red primary is acceptable.

Do not change to generic blue just because the survey is blue/navy.

Red can remain a strong CTA anchor.

Use it sparingly:

- Begin
- Next
- Submit report
- Roundtable registration
- PDF download if desired

Do not use red for every selection.

---

# 110. QUESTION SELECTION COLOR

Use navy/blue, not red.

CTA = red.

Selection = navy/blue.

Error = red.

Success = green.

This creates semantic discipline.

---

# 111. PAGE HEIGHT

Do not force `min-height: 100vh` on internal cards.

The overall `.survey-page` can keep min-height.

Focused question area can have:

```css
min-height: calc(100dvh - header - margins);
```

but avoid awkward vertical centering.

---

# 112. TABLET

768–1023px.

Same focused-question model.

No rail.

Question workspace:

```text
max width 720px
```

Navigator opens drawer/sheet.

Action row remains in content.

---

# 113. MOBILE 430×932

QA:

- no header collision
- no duplicated progress
- title fits
- 5 Likert cells fit
- Next visible without huge scroll on Likert
- MCQ long answers readable
- Other input accessible
- bottom sheet correct
- no content hidden by safe area

---

# 114. MOBILE 390×844

This is a primary target.

Question controls must not feel cramped.

---

# 115. MOBILE 360×800

Hard minimum.

If 5 Likert cells cannot fit with current gap/padding, reduce:

- horizontal page padding from 16 → 12 only at <=390
- grid gap 6 → 4 if needed

Do not reduce tap target below 44px.

---

# 116. INTRO MOBILE

Remove card padding that causes content to feel boxed inside another page.

Recommended:

```css
.survey-intro-screen {
  padding: 16px 0 48px;
}
```

Use dividers.

CTA full width is acceptable.

Ghost back link below.

---

# 117. CONTACT MOBILE

Use full width fields.

No large outer border.

Consent rows stack.

CTA full width.

---

# 118. RESULT MOBILE

Result should behave like a readable report.

- full width
- 16px horizontal padding
- no mini dashboard cards
- domain bars full width
- answer rows stack
- Roundtable CTA full width
- print CTA full width if necessary

---

# 119. RESULT PRINT

Current print behavior should be preserved and improved.

Print:

- hide header
- hide navigator
- hide Roundtable modal
- optionally include Roundtable invitation? Prefer hide marketing invitation in PDF unless explicitly intended
- show full answer summary even if collapsed on screen
- no background gray
- no shadows
- page-break sections cleanly
- preserve bars

---

# 120. PRINT ANSWER DISCLOSURE

If using `<details>`:

Print CSS:

```css
@media print {
  details > * {
    display: block !important;
  }
}
```

Or render print-safe equivalent.

---

# 121. URL / WEBSITE INPUT

No automatic external navigation.

No validation beyond existing logic unless needed.

Current `hasQuestionAnswer` only requires non-empty text.

Do not introduce strict URL validation that changes completion behavior.

---

# 122. SCORING — DO NOT CHANGE

Current scoring:

```ts
overall = Q1–Q16 mean * 20
scale = mean(Q1,Q4,Q6,Q15,Q16) * 20
domains = configured question groups
```

Keep exactly.

---

# 123. DOMAIN WITH ONE QUESTION

Current:

```text
CEO–Nhân sự Alignment → Q14 only
```

Do not “fix” methodology.

UI may show score normally.

---

# 124. RESULT HONESTY RULE

If the code cannot prove a claim from:

- existing static source copy
- actual answers
- actual scoring formulas

do not generate the claim.

This rule takes priority over making the report look impressive.

---

# 125. REMOVE “AI” CLAIMS NOT BACKED BY LOGIC

The current private result includes:

```text
“AI gắn cờ”
```

Remove.

The survey may discuss AI in questions/content, but do not imply the report used AI analysis when source does not implement it.

---

# 126. MARKET CONTEXT

The report source describes market comparison as an intended output.

But current frontend has no benchmark data.

Use a neutral placeholder only if clearly labeled as a preview, or omit it.

Preferred implementation for this frontend:

```text
Kết quả thị trường

Bối cảnh năng lực lãnh đạo Q3/2026

Tổng quan các tín hiệu nổi bật trước khi đi vào phần phân tích chi tiết.
```

Then continue into actual survey scores.

No fake chart.

---

# 127. CONTENT LABELING

Do not number report sections “2.” and “3.” unless section 1 is clearly visible.

Current result has:

```text
2. Input ...
3. Phân tích ...
```

while MarketDemo acts as implicit 1.

This can feel prototype-like.

Preferred:

- remove numeric section prefixes
- use editorial section names

Example:

```text
Tổng quan
5 nhóm năng lực
Câu trả lời
Bối cảnh doanh nghiệp
```

These are interface labels; preserve core report copy where necessary.

---

# 128. EMPTY / MISSING ANSWERS

Use existing:

```text
—
```

Do not crash.

Private result should gracefully handle missing website/answer if flow allows it.

---

# 129. QUESTION NAVIGATOR COUNTS

Display:

```text
8/18 đã trả lời
```

not “hoàn tất” if some future questions can be jumped.

Either wording is acceptable, but “đã trả lời” is clearer.

---

# 130. ACTIVE QUESTION RESET BUG PREVENTION

Current `SurveyQuestionPage` effect resets active question to first question whenever mounted.

In V2:

When returning from Contact to review answers, preserve a meaningful last position.

Recommended state:

```ts
lastPartOneQuestion
lastPartTwoQuestion
```

or keep `activeQuestion`.

Rules:

- opening Part 1 first time → Q1
- returning to Part 1 from Part 2 → Q18 or previous active Part1
- opening Part 2 first time → Q19
- returning from Contact2 → previous active Part2

Do not unexpectedly reset user to Q1.

---

# 131. SCREEN HISTORY

Do not build a full router.

Simple state is enough.

But make Back semantics deliberate.

---

# 132. BACK BUTTON SEMANTICS

Global header Back should not always mean “Home”.

Current header ArrowLeft says “Trang chủ”.

That is surprising inside a multi-step survey.

Target:

### Intro

Header back → Landing

### Part 1

Header back → previous question if not Q1  
If Q1 → Intro

### Part 2

Header back → previous question / Part 1 Q18

### Contact

Header back → survey review

### Loading

No back if processing screen lasts 2.2s, or back disabled

### Result

Header back can return Home only if clear

Alternative:

Global logo clickable Home, left arrow context-aware.

Preferred: make left arrow context-aware.

---

# 133. HEADER COPY

Avoid showing:

```text
“Trang chủ”
```

on every screen next to a back arrow.

Use arrow-only on mobile.

Desktop can show:

```text
Quay lại
```

when context-aware.

---

# 134. INTRO BACK DUPLICATION

Intro currently has both:

- header Home/back
- “Quay lại landing page” ghost CTA

This duplication can remain if intentionally helpful, but preferred to keep only one secondary return path.

Since CTA hierarchy is important, keep the ghost text at bottom and use logo/header minimally.

---

# 135. LOADING NAVIGATION

During loading:

- hide question drawer
- no Roundtable
- avoid accidental home navigation if it causes lost state

Header may simply display CWI logo + “Đang phân tích”.

---

# 136. STATE PERSISTENCE DURING SESSION

Current state is memory-only.

Do not add localStorage unless user requested.

No scope creep.

---

# 137. PAGE REFRESH

Not required to persist.

Do not implement backend save.

---

# 138. COMPONENT API — RECOMMENDED

## `FocusedQuestionScreen`

Suggested props:

```ts
type FocusedQuestionScreenProps = {
  part: 1 | 2
  questions: SurveyQuestion[]
  activeQuestion: number
  answers: Answers
  otherAnswers: Answers
  completedCount: number
  intro: string
  error?: string

  onAnswer: (question: SurveyQuestion, value: string) => void
  onOtherAnswer: (question: SurveyQuestion, value: string) => void

  onPrevious: () => void
  onNext: () => void
  onJump: (questionNumber: number) => void
  onOpenNavigator: () => void
}
```

---

# 139. CURRENT QUESTION DERIVATION

Inside:

```ts
const currentIndex = questions.findIndex(
  (question) => question.n === activeQuestion,
)

const question =
  questions[currentIndex] ?? questions[0]

const position = currentIndex + 1
```

---

# 140. NEXT BUTTON LABEL

Derived:

```ts
const isLast = currentIndex === questions.length - 1

const nextLabel =
  !isLast
    ? 'Câu tiếp theo'
    : part === 1
      ? 'Tiếp tục sang Phần 2'
      : 'Xem kết quả khảo sát'
```

---

# 141. CURRENT QUESTION VALIDATION

Create:

```ts
function validateQuestion(
  question: SurveyQuestion,
  answers: Answers,
  otherAnswers: Answers,
) {
  return hasQuestionAnswer(question, answers, otherAnswers)
}
```

On Next:

```ts
if (!hasAnswer(question)) {
  setQuestionError(...)
  return
}
```

No need to scan the entire part on every Next.

Still run full part validation when leaving part for safety.

---

# 142. ERROR MESSAGE SOURCE

Existing error strings reference:

```text
“Vui lòng hoàn tất Câu X trước khi...”
```

For current-question mode, can keep them.

But local error:

```text
Vui lòng hoàn tất Câu 6 trước khi tiếp tục.
```

is clearer.

Do not over-innovate copy.

---

# 143. QUESTION NAVIGATOR JUMP AND ERROR

When user jumps:

- clear current inline error
- set active question
- focus heading

Do not prevent jump due to unanswered current question.

---

# 144. PART COMPLETION CTA

When on Q18 and answered:

Next → Part 2.

No need to scroll through completed questions.

---

# 145. PART 2 SKIP

At Part 2 first context:

Provide a secondary action to receive Part 1 report.

If user already answered any Part 2 question, current logic says they must complete Part 2 or go back to Part 1 report path.

Current UI can offer:

```text
Nhận Báo cáo Phần 1
```

only via an explicit route that resets/ignores Part2 as existing logic supports.

Do not silently discard Part2 answers.

---

# 146. `skipPrivateReport`

Existing:

```ts
setReportMode('part1')
setConsent('')
goToScreen('contact1')
```

Keep as canonical path.

---

# 147. CONTACT1 BACK

Current `contact1` Back always returns Part 2.

That may be okay if user reached Contact1 through Part2 skip.

But if there are other future entry paths, make it contextual.

For current scope, preserve unless straightforward to improve.

---

# 148. SCREEN TRANSITION

Current `goToScreen` always smooth-scrolls top.

Keep but respect reduced motion.

Create:

```ts
const scrollToTop = () => {
  const behavior =
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'auto'
      : 'smooth'

  window.scrollTo({ top: 0, behavior })
}
```

---

# 149. CSS FILE REWRITE

Current `survey.css` ≈ 2091 lines.

The V2 architecture should reduce CSS significantly.

Target:

```text
~1200–1600 lines maximum
```

This is a directional target, not a hard requirement.

Do not preserve dead long-form rail/card styles.

---

# 150. REMOVE LEGACY SELECTORS

Expected to remove or significantly change:

```text
.survey-intro-layout
.survey-brand-panel
.survey-brand-lock
.survey-progress-card
.survey-question-intro (old role)
.survey-question-layout
.survey-progress-rail
.survey-mobile-jump
.survey-question-stack
.survey-question-card (old multi-question semantics)
.survey-sticky-actions
.survey-market-chart
.survey-radar
.survey-radar-grid
.survey-mini-stats
```

If class names remain for convenience, their old architectural behavior must not.

---

# 151. CSS STRUCTURE V2

Recommended order:

```text
1. Tokens
2. Scoped reset
3. Typography
4. Buttons / inputs
5. Header
6. Intro
7. Focused survey layout
8. Progress
9. Question controls
10. Question navigator
11. Contact
12. Loading
13. Report
14. Roundtable invitation
15. Modal
16. Tablet
17. Mobile
18. <=390
19. Reduced motion
20. Print
```

No duplicate breakpoint blocks.

---

# 152. BREAKPOINT POLICY

Main:

```css
@media (max-width: 1023px)
@media (max-width: 767px)
@media (max-width: 390px)
```

One consolidated block per breakpoint.

---

# 153. NO TAILWIND MIGRATION

Tailwind exists in package dependencies.

Do not migrate survey to Tailwind in this task.

Keep scoped CSS.

Reason:

- unnecessary scope
- risk
- no visual benefit
- current component CSS is already isolated

---

# 154. NO NEW COMPONENT LIBRARY

Do not add:

- MUI
- Radix just for drawer/modal
- shadcn
- Headless UI
- Chakra
- Ant

Use existing stack.

---

# 155. NO NEW CHART LIBRARY

Radar is being removed.

Do not install chart.js/recharts.

Domain bars are simple CSS.

---

# 156. CURRENT BUILD BASELINE

The reviewed source currently has a pre-existing build issue:

```text
tsconfig.app.json(...):
TS5103: Invalid value for '--ignoreDeprecations'
```

Current lint execution also failed in the review environment because:

```text
oxlint: Permission denied
```

These are not Survey UX problems.

## Agent instruction

Do not modify build tooling merely to make the redesign appear complete unless the issue is directly caused by your changes.

At handoff:

- report these as pre-existing if still present
- distinguish them from Survey code errors

---

# 157. BUILD VALIDATION

Even with baseline toolchain issue, run:

```bash
npm run build
npm run lint
```

Report exact outcome.

If build is blocked before reaching survey code, additionally run TypeScript/editor diagnostics on changed files if available.

---

# 158. DESIGN QUALITY CHECK — “CHEAP” SIGNALS

Before completion, inspect screenshots and reject the result if it still shows:

- large gray background + many white boxes
- border around every section
- small question text in a huge container
- duplicate progress
- duplicate navigation
- dashboard cards
- decorative fake charts
- generic metric tiles
- repeated “Phần 1” labels
- repeated “Đã trả lời”
- dense admin form feeling
- sidebars that dominate content
- “AI” language not backed by data

---

# 159. DESKTOP VISUAL TARGET

At 1440×900:

The first question viewport should contain:

- header
- progress
- question
- answer
- actions

No scrolling required for a Likert question.

There should be meaningful whitespace around the question.

---

# 160. DESKTOP MCQ TARGET

For Q17/Q18:

Long option list may extend below fold.

That is okay.

Do not compress option spacing just to force everything above fold.

Primary usability > artificial viewport fit.

---

# 161. MOBILE LIKERT TARGET

At 390×844:

User should see:

- header
- progress
- question
- all five Likert buttons
- Next

within approximately one viewport, depending on question length.

---

# 162. MOBILE MCQ TARGET

User may scroll answers.

Do not make bottom sticky action cover the last option.

---

# 163. NAVIGATOR COMPLETION VISUAL

Answered:

```text
✓
```

Current:

```text
06
question text
```

Do not fill every answered row green.

Use check only.

---

# 164. NAVIGATOR QUESTION TEXT

Current truncates to 68 chars in JS.

Prefer CSS line clamp:

```css
-webkit-line-clamp: 2;
```

This keeps full text in DOM/accessibility.

Do not manually slice if avoidable.

---

# 165. NAVIGATOR ACCESSIBLE NAME

Button can contain full question text.

Visual clamp is CSS only.

---

# 166. ACTIVE NAVIGATOR ITEM

Use:

```css
background: #f4f7fb;
border-left: 2px solid var(--survey-blue);
```

No blue filled number circle needed.

---

# 167. INTRO REPORT PARTS

Current `survey-report-box` is already row-like.

Retain the concept but remove enclosing “box” visual.

Use horizontal divider.

---

# 168. INTRO CTA AREA

Primary CTA aligned left with content.

Do not center giant CTA.

Secondary Back can be text-like.

---

# 169. TRUST CUE

Privacy/bounded scope is important.

Do not need a dedicated sticky brand panel.

A small line near CTA:

```text
🔒 Thông tin được xử lý bảo mật theo phạm vi khảo sát.
```

can reuse existing brand panel copy if desired.

This copy is already in code, so it is supported.

---

# 170. INTRO COPY PRESERVATION

Current Intro renders:

- first 3 paragraphs
- report parts
- final paragraph

Keep this exact sequence.

---

# 171. FORM THANK-YOU

Current `.survey-thankyou` is a block.

Do not turn it into an alert card.

Render as normal body paragraph or a light intro note.

---

# 172. RESULT ROUNDTRIP

“Xem lại câu trả lời” from Contact should return to the most relevant question, not Q1.

Preserve active position.

---

# 173. REPORT ACTIONS

At bottom:

Primary:

```text
Tải xuống PDF
```

Secondary:

```text
Quay về trang chủ
```

Roundtable CTA appears above separately.

Do not add 3–4 competing CTAs.

---

# 174. PRINT BUTTON

Current implementation calls:

```ts
window.print()
```

Keep.

Do not label it “Download PDF” if browser print is the actual action unless current product intentionally uses that wording.

Current copy says “Tải xuống PDF”; keep due source/UI continuity.

---

# 175. RESULT URL

No share URL required.

---

# 176. REPORT DATA TABLES

No table needed.

Do not over-structure.

---

# 177. VISUAL DENSITY

Premium does not mean empty everywhere.

Result can be dense enough for executive scanning.

Survey question should remain sparse.

Use different density by task:

```text
Survey = low density
Report = medium density
Navigator = medium/high density
```

---

# 178. COLOR DENSITY

Most screen should be:

- white
- gray
- ink/navy

Accent distribution:

- blue for structural emphasis/progress
- red for CTA
- green for completed status

No more than one saturated accent in a local component.

---

# 179. BACKGROUND

The neutral background may remain.

But on mobile, consider full white survey workspace to reduce boxed feeling.

Example:

```css
@media (max-width: 767px) {
  .survey-page {
    background: #fff;
  }
}
```

Header still gets divider.

---

# 180. QUESTION WORKSPACE SURFACE

Preferred Desktop:

No border.

If the neutral page background makes content float too much, use one white workspace with:

```text
padding 48px
radius 16px
border 1px
```

But do not also put the question inside another bordered control shell.

Choose one.

Strong preference: one subtle workspace on desktop, flat on mobile.

---

# 181. CONTACT SURFACE

Same policy.

Do not use:

page background → outer card → privacy card → consent cards.

Flatten hierarchy.

---

# 182. REPORT SURFACE

One document surface at most.

Sections separated by dividers.

---

# 183. MODAL SURFACE

Modal can be clearly elevated.

This is where shadow is appropriate.

---

# 184. EMPTY WHITESPACE ON LARGE DESKTOP

Do not stretch content to fill 1440px.

A centered 820–960px column is premium.

---

# 185. QUESTION HINTS

Likert:

```text
Chọn một mức độ phù hợp nhất
```

can remain but should be secondary.

MCQ instruction source can remain.

Do not use italic star if avoidable if source string contains `*`.

Because content must be preserved, render the string exactly but visually normalize.

---

# 186. “MỤC KHÁC” FOCUS

When user selects Other:

Recommended:

```ts
requestAnimationFrame(() => inputRef.current?.focus())
```

This reduces friction.

---

# 187. TEXT INPUT ENTER

For Q24, Enter may trigger Next/report only if safe and expected.

Not required.

---

# 188. FORM ENTER

Contact form should preferably use an actual `<form>`.

Current buttons use manual click.

Refactor:

```tsx
<form onSubmit={...}>
```

Benefits:

- Enter submission
- semantics
- accessibility

Do not allow double-submit.

---

# 189. QUESTION FORM SEMANTICS

Each question can be wrapped in:

```html
<fieldset>
  <legend>...</legend>
</fieldset>
```

This is strongly recommended for radio groups.

Use CSS to make legend match question typography.

This improves accessibility substantially.

---

# 190. LIKERT FIELDSET

Example:

```tsx
<fieldset className="survey-question-fieldset">
  <legend id={`survey-question-${q.n}`}>
    {q.q}
  </legend>
  ...
</fieldset>
```

No extra `role="radiogroup"` needed if fieldset/legend used appropriately.

---

# 191. MCQ FIELDSET

Same.

---

# 192. TEXT QUESTION LABEL

Use actual `<label htmlFor>`.

Current Q24 input has no visible linked label aside from outer question h3.

Refactor semantics.

---

# 193. ACCESSIBILITY — ERRORS

Associate error with controls:

```tsx
aria-describedby={error ? errorId : undefined}
aria-invalid={Boolean(error)}
```

For radio group, can apply to fieldset or inputs as appropriate.

---

# 194. ACCESSIBILITY — DRAWER BACKDROP

Current backdrop is a `<button>` spanning viewport.

Use a `<div>` presentation backdrop with click handler if semantics are clearer.

Do not make a giant invisible button a tab stop.

Current:

```tsx
tabIndex={open ? 0 : -1}
```

Remove backdrop from keyboard navigation.

---

# 195. DRAWER `aria-hidden`

When closed:

- no tabbable children
- ideally unmount the drawer
- or use `inert`

Simplest:

```tsx
if (!open) return null
```

This avoids hidden interactive controls.

Use mount/unmount with CSS enter transition if desired.

---

# 196. MODAL MOUNT

Same:

If closed, unmount modal.

Current modal remains in DOM.

Prefer:

```tsx
if (!open) return null
```

Then animate on mount.

---

# 197. FOCUS RESTORE

Store trigger ref.

If implementation complexity is too high, at least focus the button that opened drawer/modal after close.

---

# 198. ESCAPE KEY

Required for:

- navigator
- Roundtable modal

---

# 199. BODY SCROLL LOCK

When mobile bottom sheet/modal opens:

```ts
document.body.style.overflow = 'hidden'
```

restore on cleanup.

Be careful not to permanently lock.

---

# 200. TEST WITH LONG VIETNAMESE COPY

Questions such as Q6 and Q20 are long.

Do not tune UI only for short Q23.

---

# 201. DESIGN QA — INTRO

Check:

- no duplicate logo
- no sidebar card
- H1 hierarchy
- all intro copy present
- report two parts present
- CTA visible
- content width readable

---

# 202. DESIGN QA — Q1

Check:

- one question only
- progress correct
- Likert labels clear
- Next works
- error local

---

# 203. DESIGN QA — Q6

Long Likert question.

Check wrapping.

---

# 204. DESIGN QA — Q17

MCQ with 6 options + Other.

Check option scanning.

---

# 205. DESIGN QA — Q18

Last Part1 transition.

Check CTA wording and transition to Part2.

---

# 206. DESIGN QA — Q19

Check Part2 context/optionality.

---

# 207. DESIGN QA — Q20/Q21/Q22

Long MCQ option flow.

---

# 208. DESIGN QA — Q23

Revenue options.

Do not alter exact formatting:

```text
Từ 100 - <300 tỷ VND
...
```

---

# 209. DESIGN QA — Q24

Website input.

---

# 210. NAVIGATOR QA

Test jumping:

```text
Q1 → Q12 → Q3 → Q18
```

Answers persist.

Active state correct.

---

# 211. PART VALIDATION QA

Scenario:

- answer Q1
- jump Q18
- answer Q18
- attempt transition

Should not incorrectly treat Part1 complete.

The full part validation before leaving must catch missing question.

Then navigate to first missing question.

---

# 212. FIRST MISSING QUESTION

When final part validation catches missing:

- set active question to missing
- show inline error there
- focus heading/control

No scroll scanning.

---

# 213. PART2 ZERO ANSWER QA

Enter Part2, answer none, choose Part1 report path.

Should go to `contact1`.

---

# 214. PART2 PARTIAL QA

Answer Q19 only, try to finish.

Should require missing Q20 etc per current semantics.

---

# 215. PART2 COMPLETE QA

All Q19–24 answered.

Go `contact2`.

---

# 216. CONSENT QA

Private:

### consent empty

Submit → error requesting consent.

### consent no

Private CTA disabled/current behavior or explicit error.

Part1 fallback available.

### consent yes

Submit → loading directly.

No Roundtable popup.

---

# 217. CONTACT VALIDATION QA

- empty name
- empty email
- malformed email
- valid email

---

# 218. LOADING QA

No Roundtable.

After timing → result.

---

# 219. REPORT QA

Check actual score changes when Likert answers change.

No hard-coded fake private metrics.

No decorative market chart.

No radar.

---

# 220. ROUNDTABLE QA

Result visible first.

Click register:

- modal opens
- contact prefilled
- registration succeeds
- report remains
- closing modal returns focus
- no screen transition

---

# 221. PRINT QA

Print report does not include:

- survey header
- question nav
- modal
- unnecessary Roundtable promotional CTA if undesirable
- background gray

All domain scores visible.

---

# 222. RESPONSIVE SCREEN MATRIX

Test:

## Desktop

- 1920×1080
- 1440×900
- 1366×768
- 1280×800

## Tablet

- 1024×768
- 820×1180
- 768×1024

## Mobile

- 430×932
- 390×844
- 375×812
- 360×800

---

# 223. KEYBOARD QA

Desktop:

- Tab through header
- Tab Likert options
- Space selects
- Tab Next
- Enter activates
- Open navigator
- Escape closes
- focus returns
- Roundtable modal traps focus

---

# 224. SCREEN READER SEMANTICS

At minimum verify markup:

- headings in logical order
- fieldset/legend for radio question
- label for text fields
- dialog title
- no hidden tabbable controls
- errors role alert
- current step announced

---

# 225. PERFORMANCE

Focused mode should render one question, not 18.

This reduces DOM and improves mobile responsiveness.

Navigator can render all question labels only when opened.

---

# 226. NO PREMATURE MEMOIZATION

Do not litter with `useMemo` unless useful.

Keep code readable.

---

# 227. NO COMPLEX STATE MACHINE LIBRARY

Plain React state is sufficient.

Do not install XState.

---

# 228. TYPES

Keep TypeScript strictness.

Avoid `any`.

Create small helper types if needed.

---

# 229. FILE NAMING

Prefer semantic names:

```text
SurveyQuestionPage
→ FocusedSurveyPage
```

if refactor is comprehensive.

But renaming is optional.

Do not spend time renaming everything if risk outweighs benefit.

---

# 230. CODE QUALITY

No giant 500-line component.

If `ResultScreen` remains complex, split data visualization/sections.

---

# 231. RESULT DATA MODEL

Optional helper:

```ts
const partOneAnswerRows = partOneQuestions.map((question) => ({
  number: question.n,
  question: question.q,
  answer: getAnswerDisplay(question.n, answers, otherAnswers),
}))
```

Private rows similarly.

---

# 232. DOMAIN ROW

Component:

```tsx
function DomainScoreRow({
  name,
  value,
}: {
  name: string
  value: number
}) { ... }
```

---

# 233. SCORE OVERVIEW COMPONENT

Could be:

```tsx
<ReportMetric
  label="Leadership Capacity"
  value={scores.overall}
/>
```

But visually row-based, not card-based.

---

# 234. REMOVE UNUSED COMPONENTS

After redesign remove:

- `RadarChart`
- `MiniStat`
- `MarketDemo` chart part
- `SurveyBrandPanel`
- old progress rail components
- old sticky actions if unused

Also remove unused imports:

- `Home`
- etc.

---

# 235. CSS DEAD CODE

After JSX refactor, search class names and remove unused rules.

Do not leave 500 lines of old CSS “just in case”.

---

# 236. CSS SEARCH CHECKS

At end:

```bash
grep -n "survey-brand-panel" ...
grep -n "survey-progress-rail" ...
grep -n "survey-radar" ...
grep -n "survey-mini-stats" ...
```

Expected removed if new architecture does not use them.

---

# 237. VISUAL REGRESSION — LANDING

The landing page is out of scope.

Do not alter:

```text
src/features/landing/**
```

except import usage that is strictly necessary and does not alter rendering.

The existing landing desktop/mobile visual must remain unchanged.

---

# 238. GLOBAL CSS

Do not leak `.survey-*` changes outside `.survey-page` where avoidable.

No global `body` changes except temporary modal scroll lock or print.

---

# 239. FONT

Keep current Inter Variable.

No external font request.

---

# 240. ASSET

Keep current CWI logo from `figmaAssets.cwiLogo`.

Do not recreate logo as text.

---

# 241. “EUROPEAN” INTERPRETATION

Do not interpret premium European design as:

- beige
- serif
- luxury fashion
- excessive thin lines
- black-and-white everything

Interpret it as:

- disciplined
- usable
- restrained
- typographically clear
- honest with data
- high-quality spacing
- minimal decorative noise
- strong service design

---

# 242. DESIGN DECISION PRIORITY

If choices conflict, prioritize:

1. task clarity
2. data credibility
3. accessibility
4. hierarchy
5. mobile ergonomics
6. visual refinement
7. animation

Animation is last.

---

# 243. WHEN IN DOUBT — REMOVE UI

If a component does not add information or task support, remove it.

Examples:

- duplicate status
- duplicate Home
- duplicate progress
- decorative market line chart
- fake KPI
- redundant radar
- repeated Part label

---

# 244. DO NOT “PREMIUMIZE” BY ADDING

Do not add:

- avatars
- glass
- animated gradient
- dots
- badges
- icon circles
- quote cards
- progress rings
- 3D visual
- AI sparkles
- floating help button

---

# 245. QUALITY BAR — INTRO

A screenshot of Intro should plausibly look like an executive research invitation from:

- a respected consulting firm
- a banking research product
- a serious think tank
- a modern European service

Not like a template marketplace design.

---

# 246. QUALITY BAR — QUESTION

A screenshot of a question should immediately tell the viewer:

> “This screen wants exactly one considered answer.”

No competing cards.

---

# 247. QUALITY BAR — RESULT

A screenshot of Result should look like:

> “A report containing data.”

Not:

> “A dashboard demo containing UI components.”

---

# 248. QUALITY BAR — MOBILE

Mobile should look intentionally designed, not desktop reduced.

---

# 249. IMPLEMENTATION PHASES

## Phase 1 — State / navigation refactor

- remove long-form scroll model
- remove IntersectionObserver
- implement current question navigation
- implement previous/next
- implement navigator jump
- preserve validation logic

No major visual work until this works.

---

# 250. Phase 2 — Focused question UI

- progress header
- question workspace
- Likert
- MCQ
- Other
- text input
- inline error
- action row

---

# 251. Phase 3 — Navigator

- desktop drawer
- mobile bottom sheet
- focus/accessibility
- answered/current states

---

# 252. Phase 4 — Intro

- remove SurveyBrandPanel
- flatten report parts
- editorial layout

---

# 253. Phase 5 — Contact

- flatten form
- reorganize privacy
- submit directly to loading
- remove pre-report Roundtable dependency

---

# 254. Phase 6 — Result

- remove fake chart
- remove hard-coded metrics
- remove radar
- create editorial report
- show computed metrics
- answer appendix
- private context rows

---

# 255. Phase 7 — Roundtable post-report

- invitation section
- modal behavior
- registration state
- accessibility

---

# 256. Phase 8 — CSS cleanup

- delete obsolete CSS
- consolidate breakpoints
- remove legacy classes

---

# 257. Phase 9 — QA

Full matrix.

---

# 258. DO NOT SKIP PHASE 1

If agent only restyles current 18-question long page, the task is considered failed.

---

# 259. DEFINITION OF DONE — FUNCTIONAL

- [ ] Intro opens correctly
- [ ] Part1 starts at Q1
- [ ] Only one question is displayed at a time
- [ ] Next validates current question
- [ ] Previous works
- [ ] Navigator jump works
- [ ] Answers persist
- [ ] Other requires text
- [ ] Q18 moves to Part2
- [ ] Part2 optional logic preserved
- [ ] Part2 partial completion validation preserved
- [ ] Contact validation preserved
- [ ] Consent logic preserved
- [ ] Contact submit opens Loading directly
- [ ] Roundtable no longer blocks report
- [ ] Loading reaches Result
- [ ] Score calculations unchanged
- [ ] Roundtable opens from Result
- [ ] PDF/print still works
- [ ] Landing unaffected

---

# 260. DEFINITION OF DONE — UX

- [ ] No multi-question scrolling survey
- [ ] No duplicate progress
- [ ] No useless “Câu XX” self-scroll button
- [ ] Inline validation near current question
- [ ] Desktop navigator is optional/openable, not a permanent huge rail
- [ ] Mobile navigator is a bottom sheet
- [ ] Back behavior is deliberate
- [ ] Contact flow does not feel like lead-gen interception
- [ ] Report appears before Roundtable promotion
- [ ] Mobile has no covered content
- [ ] User always knows current position

---

# 261. DEFINITION OF DONE — UI

- [ ] Intro no longer has duplicate-brand sidebar card
- [ ] Question is dominant visual element
- [ ] No white-card stack
- [ ] No dashboard feel
- [ ] No fake chart
- [ ] No hard-coded fake KPI
- [ ] No radar + bars redundancy
- [ ] Report sections use editorial dividers
- [ ] Color usage semantic
- [ ] CTA red remains controlled
- [ ] Selection uses navy/blue
- [ ] Typography has stronger hierarchy
- [ ] Whitespace intentional
- [ ] Mobile looks purpose-built

---

# 262. DEFINITION OF DONE — ACCESSIBILITY

- [ ] Radio focus visible on label
- [ ] fieldset/legend or equivalent semantic grouping
- [ ] text inputs labelled
- [ ] errors associated
- [ ] drawer closes Escape
- [ ] modal closes Escape
- [ ] hidden drawer/modal not tabbable
- [ ] focus restored
- [ ] modal focus trapped
- [ ] touch targets >=44px
- [ ] reduced motion respected

---

# 263. DEFINITION OF DONE — CODE

- [ ] No new UI dependency
- [ ] No chart library
- [ ] No landing visual changes
- [ ] No surveyData copy changes
- [ ] No scoring changes
- [ ] No new CSS override pass
- [ ] obsolete selectors removed
- [ ] components readable
- [ ] no unused imports
- [ ] breakpoints consolidated

---

# 264. HANDOFF FORMAT REQUIRED FROM CODEX

After implementation, return a concise but complete handoff:

```markdown
## Files changed
- ...

## Architecture changes
- ...

## UX changes
- ...

## Result/report credibility fixes
- ...

## Accessibility changes
- ...

## Removed legacy components/styles
- ...

## Functional regression checks
- Part1:
- Part2:
- Contact:
- Loading:
- Result:
- Roundtable:

## Responsive QA
- 1440×900:
- 1366×768:
- 1024×768:
- 768×1024:
- 430×932:
- 390×844:
- 360×800:

## Build
- npm run build:
- npm run lint:
- pre-existing blockers:

## Remaining issues
- ...
```

Do not respond only with “done”.

---

# 265. CRITICAL IMPLEMENTATION INSTRUCTION

**Make the code changes directly.**

Do not:

- merely explain recommendations
- leave TODO comments instead of implementing
- stop after updating CSS
- preserve long-form architecture because it is easier
- invent fake report data to fill empty visual space

---

# 266. PRIORITY IF TIME / COMPLEXITY BECOMES HIGH

If tradeoffs are required, complete in this priority:

## P0

1. one-question architecture
2. question validation/navigation
3. mobile behavior
4. Roundtable after Result
5. remove fake metrics/chart
6. preserve business logic

## P1

7. intro flattening
8. report editorial structure
9. navigator accessibility
10. contact layout

## P2

11. subtle motion
12. extra visual refinement

Never sacrifice P0 for animation or micro-polish.

---

# 267. EXPECTED END EXPERIENCE — DESKTOP

## Intro

Quiet editorial invitation.

## Survey

One question is visually dominant.

The user never sees 18 repeated boxes.

Progress is clear but secondary.

Question navigator is available on demand.

## Contact

Private, simple, high trust.

## Loading

Short and credible.

## Result

Reads like a report.

Roundtable is an optional follow-up after value delivery.

---

# 268. EXPECTED END EXPERIENCE — MOBILE

The user should be able to complete the entire survey comfortably one-handed.

The mental model is always:

```text
Where am I?
→ What is the question?
→ What are my choices?
→ What happens next?
```

Never:

```text
Where did the question go?
Why are there two progress counters?
What does this button do?
Why did a promotional modal block my report?
```

---

# 269. FINAL DESIGN PRINCIPLE

The premium feeling must come from:

> **less interface, better hierarchy, stronger trust, and precise interaction.**

Not from:

> **more styling.**

---

# 270. FINAL CODEX DIRECTIVE

Treat the current source as a functional prototype whose **visual cleanup was partially successful but whose survey UX architecture remains wrong**.

Refactor it into a focused executive assessment.

Be willing to change JSX structure substantially inside `src/features/survey/`.

Do not touch the survey content/scoring methodology.

Do not touch the landing design.

Do not fabricate data.

Do not make Roundtable a gate.

Do not add decorative UI to compensate for weak hierarchy.

The final result should feel like a **designed product**, not a styled form.

