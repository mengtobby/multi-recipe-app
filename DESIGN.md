---
name: Multi-Recipe Meal Coordinator
description: The ticket rail above a kitchen pass — dishes clipped to one steel rail, riding toward the pass bell.
colors:
  wall: "#c7bda3"
  board: "#ecdfc0"
  frame: "#565a5e"
  frame-dark: "#3d4144"
  frame-light: "#83878a"
  frame-label: "#eef0ee"
  ink: "#2a2119"
  ink-muted: "#5c4c38"
  ink-faint: "#6b5c46"
  paper: "#f7f0dc"
  amber: "#c97a24"
  amber-text: "#7a4a12"
  amber-ink: "#4a2f0c"
  amber-surface: "#f0d59a"
  red: "#b3261e"
  red-ink: "#4a1712"
  red-surface: "#f5d9d3"
  green: "#2f7d52"
  green-surface: "#dcefe1"
  fallback-neutral: "#8b9096"
typography:
  display:
    fontFamily: "var(--font-stamp), var(--font-geist-sans), sans-serif"
    fontWeight: 400
    lineHeight: 1
  body:
    fontFamily: "var(--font-geist-sans), Arial, Helvetica, sans-serif"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "var(--font-geist-mono)"
    letterSpacing: "normal"
rounded:
  sm: "2px"
  md: "6px"
  full: "9999px"
spacing:
  sm: "8px"
  md: "16px"
components:
  button-primary:
    backgroundColor: "{colors.frame}"
    textColor: "{colors.frame-label}"
    rounded: "{rounded.sm}"
    padding: "8px 12px"
  button-primary-hover:
    backgroundColor: "{colors.frame-dark}"
  ticket:
    backgroundColor: "{colors.board}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "10px"
---

# Design System: Multi-Recipe Meal Coordinator

## Overview

**Creative North Star: "Expediter's Rail"**

The product is the ticket rail bolted above a kitchen pass: a cool steel rod that every dish's order ticket clips to, riding down toward the pass bell at serve time. Kraft-paper tickets under brushed steel, a stamped-typewriter voice for headers, and colored ticket stock per dish stand in for a settings dashboard. This is the second visual world this project has shipped — it replaces "Kitchen Line Board" (a dry-erase whiteboard world) outright, at the user's explicit direction, rather than refining it. Nothing about the whiteboard survives here except the underlying page structure (two-pane setup/timeline layout, mobile tab default) and the CSS custom-property names, which were kept stable and re-pointed at new values rather than renamed, to minimize the diff.

The rejected defaults for this category are the cozy cookbook-blog look (cream paper, serif display, food photography) and the bare gray SaaS settings dashboard. This system also refuses its own predecessor's cooler, flatter whiteboard reading in favor of something warmer and more physically specific: a real service-industry object, not a generic "kitchen" mood.

**Key Characteristics:**
- Warm kraft-paper tickets inside a cool brushed-steel frame — the two materials are deliberately different temperatures so the "paper clipped to metal" read survives at a glance.
- Every ticket carries a faint wash of its own dish's color (`color-mix()` of the dish color into the board), so "colored ticket stock" is a property of the paper, not just its label.
- A warm, lamp-lit night-pass dark mode, not a generic dark theme — the same kraft/steel materials, just under service lighting after dark.
- Conflicts and infeasibility are marked with a rotated rubber-stamp badge ("HOLD" / "STOP") plus an icon, never color alone.

## Colors

Two grounds (warm kraft ticket paper / cool steel) plus a small set of stamp-ink accents; per-dish identity uses an existing, separately-curated eight-color "ticket stock" palette rather than a role color.

### Primary
- **Steel Rail** (`#565a5e`, `#3d4144` pressed, `#3a3630` in dark mode): the rail itself, the top strip, and every primary button/active-tag surface. Paired with **Frame Label** (`#eef0ee`) for text — a fixed light neutral chosen because the frame stays a dark, cool steel tone in both themes, so `--board` (which inverts per theme, light kraft by day / dark kraft by night) cannot be reused as its text color.

### Neutral
- **Board / Kraft Ticket** (`#ecdfc0` light / `#3a2f1e` dark): the paper every ticket and Order Rail entry is printed on. Each entry additionally carries a ~16% wash of its dish's own color mixed into this base, via CSS `color-mix()`.
- **Wall** (`#c7bda3` light / `#14110d` dark): the counter/backdrop the pass is mounted against.
- **Paper / Order Pad** (`#f7f0dc` light / `#241e14` dark): the Kitchen setup, Menu, and Order Rail card shells themselves — a shade cleaner than the kraft tickets they hold.
- **Ink** (`#2a2119` light / `#f1e6cc` dark): primary text, and — inverted — the fill of the final SERVE entry, the one place the pass's light/dark polarity flips to spotlight the finish line.

### Signal (never color alone — always paired with a stamp badge and/or an icon)
- **Amber** (`#c97a24`): the rotated "HOLD" rubber-stamp conflict alert. **Amber Text** (`#7a4a12` light / `#eeab52` dark) is a separate, contrast-checked token for amber used as small text (e.g. "+5 min late") on the plain ticket/pad — the saturated `--amber` itself fails 4.5:1 as text on the light board.
- **Red** (`#b3261e`): the rotated "STOP" stamp on an infeasible schedule, destructive actions.
- **Green** (`#2f7d52`): the live "in progress" step timer, paired with a pulsing dot, never green text alone.

### Named Rules
**The Paired-Token Rule.** Any color meant to sit on a surface that inverts between light and dark (the board, the ink) must never itself be that inverting token when used as text/foreground on a non-inverting surface (the frame). Use a dedicated fixed-neutral token (`frame-label`) instead. This rule exists because it was broken twice across this project's two visual worlds: once as a light/dark asymmetry bug (buttons and active tags went invisible in dark mode), and once as a same-surface bug (dark-mode `amber-ink` was dark text on a dark `amber-surface`, ~1.5:1 contrast, shipped because the conflict banner was never screenshotted in dark mode). Every `-surface`/`-ink` signal pair must be verified in *both* themes before shipping, not just its own theme's internal consistency.

## Typography

**Display Font:** Special Elite (`var(--font-stamp)`, fallback: Geist Sans, sans-serif) — a stamped-typewriter face
**Body Font:** Geist Sans (`var(--font-geist-sans)`, fallback: Arial, Helvetica, sans-serif)
**Label/Mono Font:** Geist Mono (`var(--font-geist-mono)`) — reserved for measurement, never used decoratively

**Character:** A stamped, printed-ticket voice for section titles and short badges, set against a plain, highly legible sans for every instruction and control — the stamp face is never used for body copy or data, only short single-line headers and tags.

### Hierarchy
- **Display** (400, `text-lg`–`text-2xl`/`text-3xl`, `leading-none`, `.font-stamp`): section headers ("Kitchen setup", "Menu", "Order rail"), the page title ticket, and the "Serve"/"HOLD"/"STOP" stamp labels. Never more than a few words.
- **Body** (400–500, `text-sm`, 1.5 line-height): step descriptions, form labels, button text, all prose.
- **Label/Mono** (500, `text-xs`–`text-sm`, tabular-nums): every clock time, duration, countdown, and equipment temperature. If it's a measurement, it's mono; nothing else is.

### Named Rules
**The Measurement-Is-Mono Rule.** Tabular mono is reserved for numbers a cook actually times against (clock times, minutes remaining, temperatures). It never appears as a "technical" costume on non-numeric labels.

## Layout

Two-column shell at `lg:` and above (`340px` setup/menu rail + flexible timeline column) inside a single steel-framed pass capped at `max-w-[100rem]`, mounted on a `--wall` background with a tight outer margin (`px-2 py-2` at rest, `sm:px-4 sm:py-4`) so the frame reads as dominating the viewport rather than a centered, heavily-margined card. Below `lg:`, the columns collapse to one, gated by a segmented "Timeline / Setup & menu" control that defaults to **Timeline** — the live view is the higher-priority context (a phone propped in the kitchen) and must never be buried under setup on first load. Card padding is `p-4` (16px); timeline entries use `p-2.5` (10px) with `mb-4` (16px) rhythm between entries.

## Elevation & Depth

Hybrid: the pass frame lifts off the wall with a real soft shadow (`0 18px 45px`, tinted from `--wall-shadow`); pinned order-pad cards lift off the pass the same way, offset + blurred (`2px 5px 10px`), never a flat zero-blur block shadow. The rail clip icon and the tickets' magnet-ring nodes carry a tight drop-shadow, appropriate to their scale as small physical hardware rather than as panels.

### Shadow Vocabulary
- **Pass-on-wall** (`box-shadow: 0 18px 45px var(--wall-shadow)`): the one large lift, used once per page on the outer frame.
- **Card-on-pass** (`box-shadow: 2px 5px 10px var(--board-edge)`): every order-pad card (Kitchen setup, Menu, Order rail) and the step-edit form.
- **Small hardware** (`box-shadow: 1px 1px 2px var(--board-edge)`; `filter: drop-shadow(...)` on SVG icons): stepper buttons, the rail clip icon, the ticket rings.

### Named Rules
**The No-Flat-Block Rule.** Every shadow in this system carries both an offset and a blur. A zero-blur `Npx Npx 0` block shadow belongs to a neobrutalist world this project never chose, and is a defect if it appears.

## Shapes

Small, near-square corners (`rounded-sm`, 2px) on every rectangular surface — cards, inputs, buttons, badges — reads as cut paper and cut steel rather than soft app-UI bubbles. The one larger radius (`rounded-md`, 6px) is reserved for the single outer pass frame. Every ticket carries a solid border on three sides and a **2px dashed top edge** — a torn-off-the-pad cue reused consistently from the page's title ticket down to every Order Rail entry. Circles are reserved for physical round objects: the rail clip's pincer, and the ring each ticket clips onto the rail with.

## Components

### Buttons
- **Shape:** `rounded-sm` (2px)
- **Primary:** `background: var(--frame)`, `color: var(--frame-label)`, hover darkens to `var(--frame-dark)` — used for "Clip" and "Add step"
- **Secondary/Text:** `color: var(--ink-muted)` with a dotted underline, hover to `var(--ink)` — used for "+ add step", "edit", "cancel"

### Chips / Tags
- **Cook filter tabs:** unselected = `var(--paper)` bg / `var(--frame-light)` border / `var(--ink-muted)` text; active = `var(--frame)` bg / `var(--frame-label)` text (never `var(--board)` — see the Paired-Token Rule).
- **Dish badge:** background is the dish's own ticket-stock color (from the existing 8-color palette); text color is computed per-badge via `readableTextColor()` (a WCAG luminance check), never hardcoded white.

### Order Pad Cards
- **Corner Style:** `rounded-sm`, with a steel `RailClip` SVG (a gradient-filled trapezoid + pincer rectangle, with a highlight stroke) at the top-left corner of Kitchen Setup, Menu, and Order Rail.
- **Background:** `var(--paper)`
- **Shadow Strategy:** Card-on-pass (see Elevation).
- **Internal Padding:** `p-4`, `pt-6` to clear the clip.

### Timeline Entry ("ticket")
The signature component. A ring (stroked in the dish's own color, or `var(--ink)` for the final Serve entry) sits on the steel rail in a fixed-width column; a short 2px steel tether connects the ring to the ticket. The ticket itself is a `color-mix()`-tinted kraft card with a solid border on three sides and a dashed torn top edge, holding: a mono clock time, a dish-colored badge, the description, an equipment/kind line, and a right-aligned timer + delay control. The final "Serve" entry inverts to `var(--ink)` background / `var(--board)` text, the only place polarity flips, marking it as the milestone the whole rail converges on.

### Conflict / Infeasibility Stamps
- **Conflict:** a rotated (`-12deg`), thick-bordered oval reading "HOLD" in the stamp face, on an `var(--amber-surface)`/`var(--amber-ink)` body — a rubber ink stamp, not a hazard stripe.
- **Infeasible:** a matching small `-6deg` rotated "STOP" badge inside a `var(--red)`-bordered `var(--red-surface)` pill, placed directly in the Order Rail header.

### Inputs / Fields
- **Style:** `var(--board)` background, `var(--frame-light)` border, `rounded-sm`
- **Focus:** browser-default focus ring recolored to `var(--focus-ring)` via `:focus-visible`

### Step Timer (signature micro-component)
Three states, keyed by React `key` on status so the DOM element remounts and its entrance animation replays on every state transition: upcoming (muted mono "starts in N min"), active (a `var(--green)`/`var(--green-surface)` pill with a continuously pulsing dot and a one-time "stamp" pop-in), done (muted, struck through).

## Do's and Don'ts

### Do:
- **Do** keep every shadow offset-plus-blur; this is a physical-object world, not a neobrutalist one.
- **Do** verify every `-surface`/`-ink` signal pair in both light and dark mode before shipping — this project has shipped the same class of dark-mode-only contrast bug twice.
- **Do** tint each ticket's own background with its dish's color via `color-mix()`, not just its badge — "colored ticket stock" is a property of the paper.
- **Do** compute dish-badge text color from the badge's own background (`readableTextColor()`); never assume white or black text works for an arbitrary per-dish color.
- **Do** default the mobile view to the Timeline tab, never Setup — kitchen-during-cooking is the highest-priority context per PRODUCT.md.

### Don't:
- **Don't** use `var(--board)` as a text/foreground color on `var(--frame)` — `--board` inverts per theme, `--frame` does not, and the pairing goes invisible in dark mode. Use `var(--frame-label)`.
- **Don't** add a colored `border-left`/`border-right` to cards, list items, or alerts to encode category — dish identity is carried by the ring and the ticket's own color wash, not a side stripe.
- **Don't** use an emoji or unicode glyph as an icon. Every icon in this system is an authored inline SVG at one consistent stroke weight.
- **Don't** use the stamp display face for body copy, descriptions, or anything longer than a short label — it is a header/badge voice only.
- **Don't** name a CSS token or class after a *previous* world's material once its value changes — rename it (this project once shipped `--font-marker` holding a typewriter font, confusing to anyone reading it cold).
