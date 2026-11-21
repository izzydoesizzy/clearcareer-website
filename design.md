# Land and Level Up: design system

This file governs one page: `/land-and-level-up`. It does not change the rest of joinclearcareer.com.
The page follows this file with no exceptions. If the page and this file disagree, the page is wrong.

Implementation: tokens and primitives live in `src/styles/llu.css`, scoped under `.llu`.
Content and every number live in `src/data/llu.ts`. Images live in `public/images/llu/`.

## 1. The feeling

Sleek, calm and confident. A room of real people, shown plainly.
One idea per section. One visual per row. Plenty of air. Paper, ink, one blue.

The structure follows join.creatorscience.com/explore: a centred hero, a row of people, the reason it exists,
what it is like inside, what you get in alternating rows, results, who it is for, the numbers, the rooms, the host,
the questions, and a quiet close. I borrowed the structure and the polish. Never the words, the layout details or the brand.

## 2. Palette

Only these values appear on the page. No tints, no opacity-derived colours, no second accent.

| Token | Hex | Use |
|---|---|---|
| `--llu-paper` | `#F7F6F2` | Light band. Inset cards on white bands. Body text on navy. |
| `--llu-white` | `#FFFFFF` | White band. Cards. Headlines on navy and blue. Button text. |
| `--llu-ink` | `#030620` | Headlines on light. Navy band and nav. |
| `--llu-blue` | `#0161EF` | The one accent: buttons, links, eyebrows on light, highlighted phrases, chart bars, the dot, one blue band. |
| `--llu-body` | `#2B3040` | Body text on light. |
| `--llu-caption` | `#565C6B` | Captions and sources on light. |
| `--llu-hairline` | `#E2DFD6` | 1px borders on light. Caption text on navy. |
| `--llu-panel` | `#0B1030` | Panels inside navy bands. |
| `--llu-panel-border` | `#262C52` | 1px borders inside navy bands. |
| `--llu-sale` | `#C2392B` | The Black Friday bar background. Nothing else. A deliberate exception to "one accent only". |

Screenshots and photographs keep their own colours. They are evidence, not decoration.

### Bands

Every section is a full-width band in one of four colours. Each band sets its own text colours, so a component looks right wherever it sits.

| Band | Background | Headline | Body | Caption | Eyebrow |
|---|---|---|---|---|---|
| Paper | `#F7F6F2` | ink | body | caption | blue |
| White | `#FFFFFF` | ink | body | caption | blue |
| Navy | `#030620` | white | paper | hairline | hairline |
| Blue | `#0161EF` | white | white | white | white |

The blue band is used once. Never more than 3 light bands in a row.

### Contrast (WCAG ratio, measured)

Every text pair on the page is 4.5:1 or better, 14px captions included.

| Text | Background | Ratio |
|---|---|---|
| ink | paper / white | 18.48 / 19.99 |
| body | paper / white | 12.14 / 13.13 |
| caption | paper / white | 6.19 / 6.69 |
| blue | paper / white | 4.91 / 5.31 |
| white | blue | 5.31 |
| white | ink / panel | 19.99 / 18.57 |
| paper | ink / panel | 18.48 / 17.17 |
| hairline | ink / panel | 15.00 / 13.93 |

Banned pairs, because they fail: blue text on ink (3.77), caption grey on ink (2.99), ink or paper-grey text on blue.
On navy, blue appears only as a button fill, an underline, a bar or the dot. Never as text.

## 3. Type

Two typefaces, both already self-hosted: **DM Serif Display** (headlines) and **Inter** (everything else).
DM Serif Display has one weight (400). Never bold it. `font-synthesis: none`.

Scale in px: **76 / 52 / 34 / 20 / 17 / 14**. No other sizes on desktop.

| Role | Desktop | Phone (under 768px) | Face | Line-height |
|---|---|---|---|---|
| Display (hero h1) | 76 | 52 | DM Serif Display | 1.02 |
| Headline (section h2) | 52 | 34 | DM Serif Display | 1.06 desktop, 1.1 phone |
| Title (h3, featured quote) | 34 | 34 | DM Serif Display | 1.1 |
| Stat figure | 52 or 34 | 34 | Inter 600, tabular numerals | 1.04 to 1.1 |
| Lead and card titles | 20 | 20 | Inter 400 (lead) or 600 (title) | 1.5 (lead), 1.3 (title) |
| Body | 17 | 17 | Inter 400 | 1.55 |
| Caption, eyebrow, chip, source | 14 | **15** | Inter 400 or 600 | 1.5 |

- Phone floor: no text under 15px at 390px wide. Captions step up from 14 to 15 on phones. That is the system, not an exception.
- Body measure: 55 to 70 characters on desktop. Running copy is capped at 600px wide.
- Statistics use Inter with `font-variant-numeric: tabular-nums`, always.
- Eyebrows are 14px Inter 600, uppercase, 0.08em tracking.
- Section headers are centred from 768px and left-aligned on phones. A centred header is an eyebrow, a headline and at most one line of lead.
- No centred body paragraphs longer than 2 lines. Running copy is left-aligned.

## 4. Space and layout

Spacing tokens in px: **8, 16, 24, 32, 48, 72, 96**. Nothing between them.

- Band padding: 96px top and bottom on desktop, 56px on phones. The hero uses 72px so the headline, button and 3 proof numbers sit above the fold at 1440 x 900.
- Content max-width: 1120px, with 24px side gutters at every size.
- Rows: two equal columns with a 72px gap from 1024px. Words on one side, one visual on the other. Rows alternate sides. Rows inside a band are 96px apart.
- Grids: 2, 3 or 4 equal columns with a 32px gap. Single column under 768px.
- Card radius: 20px. Interface views: 24px. Images: 16 to 20px. Chips and people pills: full pill.
- Card border: 1px hairline on light, 1px panel-border on navy.
- Card shadow: `0 1px 2px rgb(3 6 32 / 0.06)` on white cards only. Nothing heavier anywhere.

### Band order

1. Black Friday bar: brick red, sticky
2. Nav: navy, sticky from 1024px beneath the bar
3. Hero: navy
4. People row: paper
5. Why this exists: paper
6. The questions you can't ask at dinner: blue
7. Here's what you get: white
8. The private rebuild: paper
9. Your first week: white
10. Results: navy
11. Before and after: paper
12. Who it's for: white
13. By the numbers: paper
14. Choose your room, with the guarantee: navy
15. Your host: paper
16. The questions I'd ask too: white
17. Close and footer: navy

## 5. Components

**Primary button.** 56px tall, pill, blue fill, white Inter 600 at 17px, 32px side padding. One label on the whole page: "Claim my founding seat". Full width on phones and inside a tier card.
Hover: background goes to ink on light bands, to white with ink text on navy. 120ms.

**Text link.** Blue on light, white on navy and blue, underlined 1px, offset 4px. At least 44px tall hit area. Hover: underline goes to 2px.

**Black Friday bar.** A brick-red band (`#C2392B`) above the nav that stays stuck to the top of the screen. White Inter 600 at 14px (15px on phones), at least 44px tall. Long text from 768px, a short line on phones, and a "See the prices" text link to the pricing band. No countdown, no close button, no animation. The nav sticks directly beneath it from 1024px. Sticky is position, not motion. The red is the one deliberate exception to the single-accent rule, chosen by Izzy so the sale reads as urgent. White on it is 5.37:1. It appears on this bar only, never on buttons, text or anything else. Remove the bar and the Black Friday labels after November 30.

**Status label.** 6px blue dot plus "Founding group open, N of 16 seats left". N is set by hand in `src/data/llu.ts`. Never computed, never faked.

**People pill.** A 48px face, a name and a result of five words or fewer. The result is taken from that person's own review.

**Quote.** Exact client words. One highlighted phrase per quote. A 56px face cropped from the person's own LinkedIn review, or a serif initial where no public photo exists. Never a stock face.
Three forms: a white card, a plain quote with no box, and one featured quote set in the headline face.

**Case card.** Face, name, a one-fact chip, "the starting point", "the result", and a link to the original review. Facts restate the review. No adjectives.

**Stat.** Figure in Inter 600 tabular, one line saying what it counts. One source line per section states the source and sample size.

**Ruled row.** Three or four figures or short notes, each under a 1px rule. Used for the hero stats, the first week, the cost of waiting and the pricing notes.

**Interface view.** A white card drawn like a product screen: a title bar, then rows, bubbles or a before and after pair. One per row. Any view that is not a real screenshot says "Illustration" in its title bar.

**Chip.** A pill with 14px Inter 600. Outline by default, solid ink for emphasis. On the blue band chips are white or paper with ink text.

**Chart.** Static horizontal bars. HTML and CSS only. Single series, blue, 16px tall, 4px rounded data ends, the value printed beside every bar. A "before" bar may use caption grey. No tooltips, no animation.

**Tier card.** Tier name, the price in the stat face, the regular price struck through beside it, who it is for, what is included, the button, seats left.

**Deadline.** Stated as plain text with a date and time. No countdown timer. Nothing ticks.

**Objection.** Native `<details>`. The question is in the buyer's words at 20px Inter 600. Plus and minus glyph, no rotation, no transition.

**Focus.** 2px outline, 2px offset: blue on light, white on navy and blue.

## 6. Photos and assets

Every image comes from elsewhere on joinclearcareer.com. Nothing is stock and nothing is generated.

| Used for | Source in `public/images/` |
|---|---|
| Nav and footer mark | `logo/clearcareer-logo.png` |
| Client faces | cropped from the 8 screenshots in `testimonials/` |
| Before and after profiles | `before-after/` (Eblen, Nathaniel, Henrique, Julia, Rubina), cropped to banner and headline |
| Host photo | `izzy.webp` |
| Private rebuild and close | `izzy-coaching.jpg` |
| Community photos | `remote-work/matz.jpg`, `remote-work/vietnam3.jpg`, `izzy-more.webp` |
| Client video | thumbnail of the client video already embedded on `/testimonials`, linking to YouTube |

Rules: crops never change what a screenshot says. Personal contact details are covered (Henrique's banner email). Third-party names under a profile are cropped out. A client's own press logos are never presented as ClearCareer's.

## 7. Touch and phone rules

- Every link, button and summary is at least 44px tall.
- At 390px: one column, nothing clipped, no horizontal scroll, no text under 15px.
- The nav shows the mark, the wordmark and the status label on phones. Section links appear from 1280px. The button appears from 1024px.

## 8. Motion budget: 95% static

Everything renders at opacity 1 in its final position on load.

**Allowed, and nothing else:**
1. The 6px status dot pulses opacity 0.35 to 1 over 3.5s. It stops under `prefers-reduced-motion`.
2. Hover states: a 120ms change of `background-color`, `border-color` or underline colour on buttons, links and cards. No movement.

**Forbidden:** scroll-triggered fades or slides, stagger delays, parallax, typing effects, carousels, marquees, counters that tick up, countdown timers, autoplaying video, hover transforms, smooth scrolling, and every JS animation library. The page ships no JavaScript of its own.

## 9. Anti-patterns

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
- No more than one visual per row, and no caption under every number.
- No statistic without a source and sample size in its section.
- No testimonial that is not the client's exact words.

## 10. Voice

Plain, warm, direct, first person. Sentences under 20 words. Canadian English. No em dashes.
No buzzwords. The site is joinclearcareer.com only. Client names appear as first name and last initial.

## 11. What I studied, and what I borrow

Each was opened at 1440px and 390px. I borrow patterns and polish. Never words, layouts or brand.

**join.creatorscience.com/explore** (the model for this page)
- Trust: a named person with a face sits in every section, and the member numbers state their sample.
- Desire: it sells the room. You see who is in it and what a week looks like before you see a price.
- Borrow: the section order, centred headers, the people row, question chips, alternating rows with one quote each, case cards, the wall of quotes, "who it's for" on each tier, the host block and the quiet close.

**founderos.com**
- Trust: a founder who says plainly what he wishes he had when he started.
- Desire: a "today" list beside a "with us" list, so the gap is visible at a glance.
- Borrow: the before and after pairing, told here with real LinkedIn profiles.

**lifestylebusiness.com/part-time-youtuber-academy**
- Trust: the founder's own story reads as proof.
- Desire: case studies are sorted by where the person started.
- Borrow: "the starting point" and "the result" on every case card.

**ship30for30.com**
- Trust: dates and the weekly rhythm are stated up front.
- Desire: "is this you" makes the reader self-select in seconds.
- Borrow: a named day for the live call, and the "for you if" list.

**justinwelsh.me/the-creator-mba**
- Trust: restraint. Plain statements, a refund policy stated without spin.
- Desire: three plain numbers under the hero do the selling.
- Borrow: the stat strip and the confidence to leave space empty.

**buildingasecondbrain.com**
- Trust: it describes the reader's problem before it mentions the product.
- Desire: the button is written in the first person.
- Borrow: the problem-first opening and first-person button copy.

**sevenfigurecreators.mattlakajev.ai/6-weeks/online**
- Trust: every result has a name and a job, with a "not typical, not promised" line under the results.
- Desire: each feature answers a worry in the buyer's own words.
- Borrow: objections in the buyer's voice and the short "not for you if" list.
