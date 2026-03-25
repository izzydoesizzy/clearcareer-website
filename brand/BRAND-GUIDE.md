# ClearCareer Brand Guide

## Colors

| Token | Hex | CSS Variable | Tailwind Class | Usage |
|-------|-----|-------------|----------------|-------|
| Primary Blue | `#0161EF` | `--color-blue` | `text-blue`, `bg-blue` | CTAs, links, accents, active states |
| Dark Blue | `#0450c8` | `--color-blue-dark` | `text-blue-dark`, `bg-blue-dark` | Hover states, secondary buttons |
| Light Blue BG | `#EFF5FF` | `--color-blue-bg` | `text-blue-bg`, `bg-blue-bg` | Section backgrounds, cards, highlights |
| Navy | `#030620` | `--color-navy` | `text-navy`, `bg-navy` | Headings, hero backgrounds, footer |
| White | `#FFFFFF` | n/a | `text-white`, `bg-white` | Page background, card backgrounds |
| Text | `#0f0f0f` | `--color-text` | `text-text` | Body copy |
| Text Muted | `#6b7280` | `--color-text-muted` | `text-text-muted` | Secondary text, captions, metadata |
| Border | `#e5e7eb` | `--color-border` | `border-border` | Dividers, card borders, input borders |
| Success Green | `#059669` | `--color-success` | `text-success`, `bg-success` | Positive outcomes, checkmarks |
| Warning Amber | `#D97706` | `--color-warning` | `text-warning`, `bg-warning` | Alerts, urgency |

### Color Usage Rules

- Primary Blue is the dominant accent color. Use it for all interactive elements.
- Navy is reserved for high-contrast areas: hero backgrounds, footer, and headings.
- Light Blue BG creates visual hierarchy without competing with the primary blue.
- Never place Primary Blue text on Navy background (insufficient contrast). Use white instead.

---

## Typography

**Font:** Inter (variable weight, self-hosted via `@fontsource-variable/inter`)

| Element | Weight | Size | Line Height | Tailwind Example |
|---------|--------|------|-------------|-----------------|
| H1 | 700 (bold) | `clamp(2rem, 5vw, 3.5rem)` | 1.1 | `text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.1]` |
| H2 | 700 (bold) | `clamp(1.5rem, 3vw, 2.25rem)` | 1.2 | `text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-[1.2]` |
| H3 | 600 (semibold) | `1.25rem` | 1.3 | `text-xl font-semibold leading-[1.3]` |
| Body | 400 (normal) | `17px (1.0625rem)` | 1.75 | `text-[1.0625rem] leading-[1.75]` |
| Small | 400 (normal) | `0.875rem` | 1.5 | `text-sm leading-normal` |
| Button | 600 (semibold) | `1rem` | n/a | `text-base font-semibold` |

---

## Brand Voice

### Tone and Register

- **Tone:** Warm, direct, encouraging. Like a knowledgeable friend who genuinely cares.
- **Register:** Conversational professional. Never stiff, never sloppy.
- **Energy:** High-energy and action-oriented. Moves fast but pauses for emotional moments.
- **Default mode:** Collaborative. "We" > "I", "Let's" > "You should".
- **Signature quality:** Makes the complex feel doable. Turns anxiety into action.

### Teaching Pattern

Problem > Why it fails > What to do instead > Step-by-step > Celebrate.

### Voice Characteristics

- Always uses specific numbers ($35K salary increase, 200+ applications, 7 weeks).
- Metaphors: Job search as journey (funnel, marathon, quicksand), growth as farming (planting seeds, harvesting relationships).

### Signature Phrases

- "Here's what I want you to do"
- "Let's take a look at this"
- "That's a good problem, and it's solvable"
- "Keep showing up"
- "Game changer"
- "Boom"

### Words to Use

"Let's", "Try this", "Plug it in", "Walk through", "Dig into", "Bust through", "Awesome", "Magic", "Cheat code", "Unlock"

### Words to AVOID

"Compelling", "Comprehensive", "Innovative", "Impactful", "Leverage" (unless literal), "Facilitate"

---

## Button Styles

### Primary

- Background: `#0161EF` (Primary Blue)
- Text: White, 600 weight
- Border radius: `rounded-lg` (8px)
- Hover: `#0450c8` (Dark Blue)
- Padding: `px-6 py-3`

```html
<a href="#" class="inline-flex items-center justify-center rounded-lg bg-blue px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-blue-dark">
  Get Started
</a>
```

### Secondary

- Background: White
- Border: Primary Blue
- Text: Primary Blue, 600 weight
- Hover: Light Blue BG

```html
<a href="#" class="inline-flex items-center justify-center rounded-lg border-2 border-blue bg-white px-6 py-3 text-base font-semibold text-blue transition-colors hover:bg-blue-bg">
  Learn More
</a>
```

### Ghost

- Background: Transparent
- Text: Primary Blue
- Underline on hover

```html
<a href="#" class="text-base font-semibold text-blue underline-offset-4 transition-colors hover:underline">
  View Details
</a>
```

---

## Spacing

- Base unit: 4px (Tailwind default scale)
- Section padding: `py-16 md:py-24` (64px / 96px)
- Container max-width: `max-w-[1080px]`
- Container padding: `px-4 sm:px-6 lg:px-8`

---

## Logo

- File: `clearcareer-logo.png` (in `/public/images/logo/`)
- Fallback: Text "ClearCareer" in Primary Blue, font-bold
- Minimum size: 120px wide

---

## Component Patterns

### Cards
- Background: White
- Border: 1px `--color-border`
- Border radius: `rounded-xl` (12px)
- Shadow: `shadow-sm`
- Padding: `p-6` or `p-8`

### Sections
- Alternating white and Light Blue BG backgrounds
- Consistent vertical rhythm with `py-16 md:py-24`
- Content centered within `max-w-[1080px] mx-auto`

### Forms
- Input border: `--color-border`
- Focus ring: Primary Blue
- Error state: Warning Amber
- Success state: Success Green
