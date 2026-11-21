# Land and Level Up: design system

This file governs one page: `/land-and-level-up`. It does not change the rest of joinclearcareer.com.
The page follows this file with no exceptions. If the page and this file disagree, the page is wrong.

Implementation: tokens and primitives live in `src/styles/llu.css`, scoped under `.llu`.
Content and every number live in `src/data/llu.ts`.

## 1. The feeling

A well-printed prospectus. Calm, solid, specific. Paper, ink, one blue.
The page earns trust with real names, real faces and real numbers, not with effects.

## 2. Palette

Only these values appear on the page. No tints, no opacity-derived colours, no second accent.

| Token | Hex | Use |
|---|---|---|
| `--llu-paper` | `#F7F6F2` | Page background on light sections. Body text on dark sections. |
| `--llu-card` | `#FFFFFF` | Cards on light sections. Headlines on dark sections. Button text. |
| `--llu-ink` | `#030620` | Headlines on light. Background of dark sections. |
| `--llu-blue` | `#0161EF` | The one accent: buttons, links, highlighted phrases, chart bars, the status dot. |
| `--llu-body` | `#2B3040` | Body text on light. |
| `--llu-caption` | `#565C6B` | Captions, sources and labels on light. |
| `--llu-hairline` | `#E2DFD6` | 1px borders on light. Caption text on dark. |
| `--llu-panel` | `#0B1030` | Panels inside dark sections. |
| `--llu-panel-border` | `#262C52` | 1px borders inside dark sections. |

Screenshots and photographs keep their own colours. They are evidence, not decoration.

### Contrast (WCAG ratio, measured)

Every text pair on the page is in this table and is 4.5:1 or better, 14px captions included.

| Text | Background | Ratio |
|---|---|---|
| ink | paper / card | 18.48 / 19.99 |
| body | paper / card | 12.14 / 13.13 |
| caption | paper / card | 6.19 / 6.69 |
| blue | paper / card | 4.91 / 5.31 |
| white | blue (button) | 5.31 |
| white | ink / panel | 19.99 / 18.57 |
| paper | ink / panel | 18.48 / 17.17 |
| hairline | ink / panel | 15.00 / 13.93 |
| ink | white (button hover on dark) | 19.99 |

Banned pairs, because they fail: blue text on ink (3.77), caption grey on ink (2.99), blue text on hairline (3.98).
On dark sections blue appears only as a button fill, an underline, a bar or the dot. Never as text.

## 3. Type

Two typefaces, both already self-hosted: **DM Serif Display** (headlines) and **Inter** (everything else).
DM Serif Display has one weight (400). Never bold it. `font-synthesis: none`.

Scale in px: **76 / 52 / 34 / 20 / 17 / 14**. No other sizes on desktop.

| Role | Desktop | Phone (under 768px) | Face | Line-height |
|---|---|---|---|---|
| Display (hero h1) | 76 | 52 | DM Serif Display | 1.02 |
| Headline (section h2) | 52 | 34 | DM Serif Display | 1.06 desktop, 1.1 phone |
| Title (h3, tier names, pull lines) | 34 | 34 | DM Serif Display | 1.1 |
| Stat figure | 52 or 34 | 34 | Inter 600, tabular numerals | 1.02 to 1.1 |
| Lead and card titles | 20 | 20 | Inter 400 (lead) or 600 (card title) | 1.5 (lead), 1.3 (title) |
| Body | 17 | 17 | Inter 400 | 1.55 |
| Caption, label, source | 14 | **15** | Inter 400 or 600 | 1.5 |

- Phone floor: no text under 15px at 390px wide. That is why captions step up from 14 to 15 on phones. This is the system, not an exception to it.
- Body measure: 55 to 70 characters on desktop. Running copy is capped at 600px wide (about 66 characters at 17px) and never sits in a column under 520px. Short card copy (a label and one or two sentences) may run narrower.
- Statistics use Inter with `font-variant-numeric: tabular-nums`, always.
- Labels (eyebrows) are 14px Inter 600, uppercase, 0.08em tracking, caption colour. 15px on phones.
- Headline letter-spacing: -0.01em on Display and Headline. None elsewhere.
- No centred body paragraphs longer than 2 lines. Body copy is left-aligned.

## 4. Space and layout

Spacing tokens in px: **8, 16, 24, 32, 48, 72, 96**. Nothing between them.

- Section padding: 96px top and bottom on desktop, 56px on phones.
- The hero sits directly under the nav, so it uses 72px top and bottom on desktop and 48px on top on phones. This keeps the headline, the button and the 3 proof numbers above the fold at 1440 x 900.
- Sections that continue the same light background are separated by a hairline rule instead of doubled padding.
- Content max-width: 1120px, with 24px side gutters at every size.
- Grid: 12 columns on desktop, 32px gap (72px between a feature's text and its interface view). Single column under 768px. Two columns allowed from 768px.
- Card radius: 20px. Images and inner panels: 16px. Small chips: pill. All within 16 to 24px or full pill.
- Card border: 1px hairline on light, 1px panel-border on dark.
- Card shadow: `0 1px 2px rgb(3 6 32 / 0.06)` on light cards only. Nothing heavier anywhere. No shadow on dark.
- Card padding: 32px desktop, 24px phone.

### Light and dark rhythm

Never more than 3 light sections in a row.

1. Hero: light
2. Is this you: dark
3. The after: light
4. By the numbers: light
5. Izzy: dark
6. What you get: light
7. First week: light
8. What a month costs: light
9. Choose your room: dark
10. Guarantee and who it is not for: light
11. Objections: light
12. Close and footer: dark

## 5. Components

**Primary button.** 56px tall, pill, blue fill, white Inter 600 at 17px, 32px side padding. One label on the whole page: "Claim my founding seat". Full width on phones.
Hover: background changes to ink on light sections, to white with ink text on dark sections. 120ms.

**Text link.** Blue on light, white on dark, underlined, 1px, offset 4px. Minimum 44px tall hit area (links inside a sentence get 16px of vertical padding, which widens the hit area without moving the line). Hover: underline goes to 2px. Used for the Concierge application and for "see the original review".

**Status label.** 6px blue dot plus "Founding group open, N of 20 seats left". N is set by hand in `src/data/llu.ts`. It is never computed and never faked.

**Review card.** White card (panel on dark). Face cropped from the person's own LinkedIn review, 56px circle. Clients with no public photo get a serif initial in the same circle, never a stock face. First name and last initial, source and date. Exact words, 25 to 70 words. One highlighted phrase per quote: blue Inter 600 on light, white 600 with a 2px blue underline on dark. Link to the original screenshot.

**Review screenshot.** The untouched LinkedIn screenshot, shown from 960px wide and up at a maximum of 880px so its text stays readable. Hidden under 960px, where the same review appears as a review card.

**Stat.** Figure in Inter 600 tabular. One line saying what it counts. Source and sample size directly under it in caption style. No stat appears without its source.

**Interface view.** A white card (or panel on dark) drawn like a product screen: a title bar label, rows, chips. Used to show the weekly call, the rebuild, the AI Achievement Interviewer and the Concierge shortlist. Any view that is not a real screenshot carries the caption "Illustration".

**Chart.** Static horizontal bars. HTML and CSS only. Single series, blue bars, 16px tall, 4px rounded data ends, 8px gaps, the value printed beside every bar, an ink baseline on the left, a title that states the sample. A "before" bar may use caption grey. No tooltips, no animation.

**Objection.** Native `<details>`. The question is in the buyer's words at 20px Inter 600. Plus and minus glyph, no rotation, no transition. 44px minimum summary height.

**Focus.** 2px blue outline, 2px offset, on light. 2px white outline on dark.

## 6. Touch and phone rules

- Every link, button and summary is at least 44px tall.
- At 390px: one column, nothing clipped, no horizontal scroll, no text under 15px.
- The nav shows the wordmark and the status label on phones. The button moves to the hero.
- The nav is sticky from 1024px wide and static below that. Sticky is position, not motion.

## 7. Motion budget: 95% static

Everything renders at opacity 1 in its final position on load.

**Allowed, and nothing else:**
1. The 6px status dot pulses opacity 0.35 to 1 over 3.5s. It stops under `prefers-reduced-motion`.
2. Hover states: a 120ms change of `background-color` or `border-color` (or underline thickness) on buttons, links and cards. No movement.

**Forbidden:** scroll-triggered fades or slides, stagger delays, parallax, typing effects, carousels, marquees, counters that tick up, hover transforms, smooth scrolling, and every JS animation library. The page ships no JavaScript of its own.

## 8. Anti-patterns

- No gradient washes.
- No glassmorphism or backdrop blur.
- No glow.
- No drop shadow heavier than `0 1px 2px` at 6% opacity.
- No emoji.
- No stock photos.
- No icons used as decoration.
- No cards with a coloured left border.
- No centred body paragraphs longer than 2 lines.
- No more than 2 typefaces.
- No second accent colour, no tints of the accent.
- No empty boxes, bracketed placeholders or lorem ipsum.
- No competing buttons. One label.
- No statistic without a source and sample size beside it.
- No testimonial that is not the client's exact words.

## 9. Voice

Plain, warm, direct, first person. Sentences under 20 words. Canadian English. No em dashes.
No buzzwords. The site is joinclearcareer.com only. Client names appear as first name and last initial.

## 10. What I studied, and what I borrow

Each was opened at 1440px and 390px. I borrow patterns and polish. Never words, layouts or brand.

**join.creatorscience.com/explore**
- Trust: a named person with a face and a credential sits inside every section, and the member numbers state their sample ("128 members answered").
- Desire: it sells the room. You see who is in it and this week's calls before you see a price.
- Borrow: a quote beside every feature, the "this week" schedule card, and pricing framed as choosing a room.

**founderos.com**
- Trust: a founder who says plainly what he wishes he had when he started.
- Desire: a "today" list set beside a "with us" list, so the gap is visible at a glance.
- Borrow: the before and after pairing, told here in each client's own numbers.

**lifestylebusiness.com/part-time-youtuber-academy**
- Trust: the founder's own story opens the page and reads as proof, with his numbers on a timeline.
- Desire: case studies are sorted by where the person started, so every reader finds themselves.
- Borrow: reviews grouped by starting point, and objections headed "what you're probably thinking".

**ship30for30.com**
- Trust: dates, session count and days are stated in the first line of the page.
- Desire: three "is this you" cards make the reader self-select in seconds.
- Borrow: the "is this you?" opening, and accountability made concrete as a named day and time.

**justinwelsh.me/the-creator-mba**
- Trust: restraint. One column, plain statements, a refund policy stated without spin.
- Desire: three plain numbers under the hero do the selling.
- Borrow: the stat strip, the quiet close, and the confidence to leave space empty.

**buildingasecondbrain.com**
- Trust: it describes the reader's problem accurately before it mentions the product.
- Desire: the button is written in the first person, so clicking is a statement.
- Borrow: the problem-first opening and first-person button copy ("Claim my founding seat").

**sevenfigurecreators.mattlakajev.ai/6-weeks/online**
- Trust: every result has a name, a job and a place. A "not typical, not promised" line sits under the results.
- Desire: each feature is tied to a worry in the buyer's own words.
- Borrow: objections in the buyer's voice, the short "not for you if" list, and "today, then day one" sequencing.
