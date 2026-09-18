---
name: Multi-Recipe Meal Coordinator
description: A food-editorial masthead — red nameplate, serif headlines, white story-sheets — for a kitchen-timing coordinator.
colors:
  wall: "#faf6ef"
  board: "#ffffff"
  frame: "#c02f24"
  frame-dark: "#98241b"
  frame-light: "#e2685c"
  frame-label: "#fff8f2"
  ink: "#201a16"
  ink-muted: "#5c5049"
  ink-faint: "#746a62"
  paper: "#fffdfa"
  amber: "#b8791f"
  amber-text: "#7a4f10"
  amber-ink: "#3d2705"
  amber-surface: "#f3dfb0"
  red: "#8c2318"
  red-ink: "#430e08"
  red-surface: "#f0d3ce"
  green: "#2f7d52"
  green-surface: "#dcefe1"
  fallback-neutral: "#8b9096"
typography:
  display:
    fontFamily: "var(--font-display), var(--font-geist-sans), serif"
    fontWeight: 700
    lineHeight: 1.05
  body:
    fontFamily: "var(--font-geist-sans), Arial, Helvetica, sans-serif"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "var(--font-geist-mono)"
    letterSpacing: "normal"
components:
  button-primary:
    backgroundColor: "{colors.frame}"
    textColor: "{colors.frame-label}"
    rounded: "2px"
    padding: "8px 12px"
  button-primary-hover:
    backgroundColor: "{colors.frame-dark}"
  story-card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "2px"
    padding: "20px"
rounded:
  sm: "2px"
  full: "9999px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
---

# Design System: Multi-Recipe Meal Coordinator

## Overview

**Creative North Star: "Sunday Table"**

The product reads like a food-editorial masthead rather than a settings dashboard: a saturated red nameplate at the top of every page, a bold serif headline voice for every section, and clean white story-sheets underneath. This is the third visual world this project has shipped this session — it replaces "Expediter's Rail" (a kitchen ticket-rail world) outright, at the user's explicit direction from a reference screenshot of a real food-media product's mobile app. Nothing about the ticket-rail world survives here except the underlying page structure (two-pane setup/timeline layout, mobile tab default) and most CSS custom-property names, kept stable and re-pointed at new values rather than renamed.

The reference image the user provided uses a small red label ("RECIPE OF THE DAY") stacked directly above its headline — a kicker/eyebrow. This project's craft floor names that exact device as the one absolute ban no brief earns back, so it is deliberately **not** reproduced anywhere except the single top-of-page masthead lockup (a small tagline over the big "Sunday Table" wordmark), which is brand identity rather than a recurring content label. Every other heading in the app (Kitchen setup, Menu, Timeline, the hero card) carries its own weight with no label above it — differentiated instead by a rule line, scale, and color, borrowed from a different, permitted newspaper convention: the section-header rule.

**Key Characteristics:**
- A saturated, fixed brand red (`--frame`) that does not invert between light and dark mode — brand identity, not a material tone.
- A warm newsprint-white reading surface, distinct from a stark SaaS white.
- A bold serif display voice (Source Serif 4) reserved for headlines and the masthead; never for body copy.
- A rule line under every section heading — the newspaper section-divider, standing in for the eyebrow this project's craft floor forbids. Timeline's rule is drawn in brand red and its heading set larger than its siblings, reflecting its priority per PRODUCT.md.
- One hero card, structurally distinguished from every other card by a heavy red top rule, extra padding, and the largest headline on the page — not just another item in the grid.

## Colors

A warm off-white page and pure-white cards, with one fixed saturated red carrying the entire brand identity.

### Primary
- **Masthead Red** (`#c02f24`, `#98241b` pressed, `#e2685c` light accent): the top nameplate bar, primary buttons, active tags, and every rule line that marks primary content (the Timeline heading's underline). Fixed across light and dark mode — a brand color, not a material that changes with ambient light. Paired with **Frame Label** (`#fff8f2`) for text, since `--board` (which inverts per theme) cannot safely sit on a surface that does not invert.

### Neutral
- **Board** (`#ffffff` light / `#201b16` dark): every story-sheet — Kitchen setup, Menu, Timeline, the timeline's inline elements.
- **Wall** (`#faf6ef` light / `#16130f` dark): the page background — a warm newsprint tone in light mode, a warm near-black "night edition" in dark mode, never a generic gray dark theme.
- **Paper** (`#fffdfa` light / `#241f19` dark): a near-identical white to Board, used for the same story-sheet shells; kept as a separate token for future differentiation rather than collapsed into Board.
- **Ink** (`#201a16` light / `#f2ece3` dark): primary text, and — inverted — the fill of the final Serve entry, the one place polarity flips to spotlight the finish line.

### Signal (never color alone — always paired with an icon and explicit wording)
- **Amber** (`#b8791f`): the "needs attention" alert for equipment conflicts, both in the hero card's one-line summary and the Timeline's per-conflict detail list.
- **Red** (`#8c2318`, deliberately distinct from the brand `--frame` red): the infeasible-schedule alert. Kept as a separate, more muted/oxblood tone specifically so a safety-relevant "stop" state never visually reads as ordinary brand chrome.
- **Green** (`#2f7d52`): the live "in progress" step timer, paired with a pulsing dot, never green text alone.

### Named Rules
**The Paired-Token Rule.** Any color meant to sit on a surface that inverts between light and dark (Board, Ink) must never itself be that inverting token when used as text/foreground on a non-inverting surface (Frame). This project has shipped this exact bug twice already across its first two worlds — once as a light/dark asymmetry, once as a same-surface dark-mode-only failure that went undetected because the affected state was never screenshotted in dark mode. Every signal pair is now verified in both themes before shipping.

**The Brand-Never-Inverts Rule.** Unlike every other color token, `--frame` and its variants hold the identical value in light and dark mode. A masthead brand color that changed hue between themes would read as a different product at night.

## Typography

**Display Font:** Source Serif 4 (`var(--font-display)`, fallback: Geist Sans, serif) — a bold editorial newspaper serif
**Body Font:** Geist Sans (`var(--font-geist-sans)`, fallback: Arial, Helvetica, sans-serif)
**Label/Mono Font:** Geist Mono (`var(--font-geist-mono)`) — reserved for measurement, never used decoratively

**Character:** A confident, bold serif voice for the masthead and every section headline, set against a plain, highly legible sans for every instruction, control, and list row — the serif is never used for body copy or dense repeated content, only short headline-scale text.

### Hierarchy
- **Display** (700, `text-xl`–`text-5xl`, tight leading, `.font-display`): the masthead wordmark, the hero card's serve-time headline (largest text on the page), and every section title (Kitchen setup, Menu, Timeline). Headline scale varies by importance: Timeline's is a step larger than Kitchen setup/Menu, reflecting its priority as the page's primary surface.
- **Body** (400–700, `text-sm`–`text-base`, 1.5 line-height): step descriptions, form labels, button text, all prose. Dish-identity badges use bold weight at small size on a colored chip.
- **Label/Mono** (500–600, `text-xs`–`text-sm`, tabular-nums): every clock time, duration, countdown, and equipment temperature. If it's a measurement, it's mono; nothing else is.

### Named Rules
**The Measurement-Is-Mono Rule.** Tabular mono is reserved for numbers a cook actually times against. It never appears as a "technical" costume on non-numeric labels.

**The No-Stacked-Eyebrow Rule.** No heading in this system carries a small label stacked above it, with exactly one exception: the top-of-page masthead lockup (tagline over wordmark), which is brand identity rendered once, not a recurring content pattern. This constraint came directly from the project's craft floor and overrode the literal reference image the user provided, which used a stacked kicker throughout. Differentiate headline importance with a rule line, color, and scale instead.

## Layout

Two-column shell at `lg:` and above (`340px` setup/menu rail + flexible timeline column) inside a page capped at `max-w-6xl`, sitting on the warm `--wall` background below a full-width masthead bar. Below `lg:`, the columns collapse to one, gated by a segmented "Tonight / Setup & menu" control that defaults to **Tonight** (the live timeline) — the highest-priority context per PRODUCT.md (a phone propped in the kitchen) must never be buried under setup on first load. The hero status card sits directly below the masthead, full-width, above the two-column grid — the one element on the page that is not part of that grid.

## Elevation & Depth

Cards lift off the page with a real soft shadow, offset and blurred, never a flat zero-blur block shadow. The hero card carries a heavier shadow than the setup/menu/timeline cards (`3px 8px 20px` vs `2px 5px 10px`) as one of the structural devices that marks it as the lead story rather than another grid item.

### Shadow Vocabulary
- **Hero lift** (`box-shadow: 3px 8px 20px var(--board-edge)`): the hero status card only.
- **Card lift** (`box-shadow: 2px 5px 10px var(--board-edge)`): Kitchen setup, Menu, Timeline, and the step-edit form.
- **Small control** (`box-shadow: 1px 1px 2px var(--board-edge)`): stepper buttons.

### Named Rules
**The No-Flat-Block Rule.** Every shadow in this system carries both an offset and a blur. A zero-blur `Npx Npx 0` block shadow belongs to a neobrutalist world this project never chose.

## Shapes

Small, near-square corners (`rounded-sm`, 2px) on every rectangular surface. No larger radius exists anywhere in this world — a deliberate contrast with the two prior worlds, which each reserved one larger radius for an outer frame; this world has no outer frame, only the masthead bar and flat-topped cards.

## Components

### Buttons
- **Shape:** `rounded-sm` (2px)
- **Primary:** `background: var(--frame)`, `color: var(--frame-label)`, hover darkens to `var(--frame-dark)` — used for "Add" (menu) and "Add step"
- **Secondary/Text:** `color: var(--ink-muted)` with a dotted underline, hover to `var(--ink)`; the brand-red text-link variant (`color: var(--frame)`) is reserved for "+ add a cook", the one secondary action that benefits from brand-color emphasis

### Story Cards (Kitchen Setup, Menu, Timeline)
- **Corner Style:** `rounded-sm`, flat — no pinned decoration (no clip, no pushpin; those belonged to the two prior physical-object worlds)
- **Heading:** bold serif with a rule line underneath (`border-bottom: 2px solid`) — black for Kitchen setup/Menu, brand red and one size larger for Timeline
- **Background:** `var(--paper)`
- **Shadow Strategy:** Card lift (see Elevation)

### Hero Status Card (signature component)
The one card structurally distinguished from the grid: a heavy `5px solid var(--frame)` top rule, extra padding, the heaviest shadow on the page, and the largest headline (serve time or infeasibility message). Below the headline: a plain summary line (dish/cook count), then exactly one status line — a green "on track" note, an amber "N conflicts" alert, or a red "not enough time" alert, matching the semantics used in the Timeline's own alerts below it.

### Timeline Entry
A plain divided list (`divide-y`), each entry two rows: time + dish badge + description + kind on top, equipment + timer + delay control below — never a single wrapping flex row, which breaks at narrow widths when the timer/delay block floats up next to the badge instead of staying under the description (a bug this project has now hit and fixed twice across two different worlds). The dish badge is always a colored chip with text color computed by `readableTextColor()`, never colored text directly on the white card — several of the eight dish colors fail contrast outright as plain text on white. The final Serve entry inverts to `var(--ink)` background / `var(--board)` text, the one polarity flip on the page.

### Conflict / Infeasibility Alerts
- **Conflict:** a plain bordered amber box with a warning icon and bold text, both in the hero card's one-line summary and the Timeline's detailed per-conflict list — no stamp, no rotation, no hazard pattern; those belonged to the two prior worlds.
- **Infeasible:** the same treatment in the distinct oxblood `--red` (not the brand `--frame` red), so a safety-relevant stop state never reads as ordinary brand chrome.

### Inputs / Fields
- **Style:** `var(--board)` background, a neutral `var(--ink-faint)/40` border (never `var(--frame-light)`, which is a bright red/pink unsuited to a plain input border), `rounded-sm`
- **Focus:** browser-default focus ring recolored to `var(--focus-ring)` via `:focus-visible`

### Step Timer (signature micro-component)
Three states, keyed by React `key` on status so the DOM element remounts and its entrance animation replays on every state transition: upcoming (muted mono "starts in N min"), active (a `var(--green)`/`var(--green-surface)` pill with a continuously pulsing dot and a one-time "stamp" pop-in), done (muted, struck through).

## Do's and Don'ts

### Do:
- **Do** verify every `-surface`/`-ink` signal pair in both light and dark mode before shipping — this project has shipped the same class of dark-mode contrast bug twice.
- **Do** structure a timeline/list row's timer-and-actions block as its own row below the description, never a third item in the same flex-wrap line as the time and description — that ordering breaks identically every time at narrow widths.
- **Do** compute dish-badge text color from the badge's own background (`readableTextColor()`); never assume a raw dish color works as plain text against a fixed page background.
- **Do** default the mobile view to the live timeline tab, never Setup — kitchen-during-cooking is the highest-priority context per PRODUCT.md.
- **Do** differentiate a hero/lead element from its siblings with a structural device (a rule, a scale jump, extra shadow) — color and font alone, applied uniformly, reads as a reskin rather than a hierarchy.

### Don't:
- **Don't** stack a small label above any heading except the one top-of-page masthead lockup. This is an absolute constraint from the project's craft floor, not a style preference — it held even against a literal user-provided reference image that used the device throughout.
- **Don't** use `var(--board)` as a text/foreground color on `var(--frame)` — `--board` inverts per theme, `--frame` does not.
- **Don't** add a colored `border-left`/`border-right` to cards, list items, or alerts to encode category — dish identity is carried by the badge, not a side stripe.
- **Don't** use an emoji or unicode glyph as an icon. Every icon in this system is an authored inline SVG at one consistent stroke weight.
- **Don't** use the display serif for body copy, descriptions, or dense repeated content — it is a headline voice only.
- **Don't** name a CSS token or class after a *specific* world's material — this project learned that lesson renaming `--font-marker` (world 1) to `--font-stamp` (world 2) before finally generalizing to `--font-display` here, which should survive any future world change without another rename.
