---
name: Multi-Recipe Meal Coordinator
description: A kitchen whiteboard, not a settings dashboard — dishes pinned along one hand-ruled timeline spine.
colors:
  wall: "#cfcbc0"
  board: "#f2ecdb"
  frame: "#4b5157"
  frame-dark: "#383d42"
  frame-light: "#7d8389"
  frame-label: "#cfd2ce"
  ink: "#23262b"
  ink-muted: "#5b6066"
  ink-faint: "#5f656b"
  paper: "#fffdf8"
  amber: "#d98324"
  amber-text: "#8a5213"
  amber-ink: "#5c3a0e"
  amber-surface: "#f6e3c4"
  red: "#b23a34"
  red-ink: "#4a1712"
  red-surface: "#f3d9d5"
  green: "#2f7d52"
  green-surface: "#dcefe1"
typography:
  display:
    fontFamily: "var(--font-marker), var(--font-geist-sans), sans-serif"
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
  chit-index-card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "16px"
---

# Design System: Multi-Recipe Meal Coordinator

## Overview

**Creative North Star: "The Kitchen Line Board"**

The product is a whiteboard mounted on the wall above a kitchen line: a steel-framed dry-erase board (a chalkboard after dark) that the cook pins dishes to, marks up in grease pencil, and reads at a glance while hands are busy. It exists to answer one question — will everything be ready at the same moment — so the page is built around a single hand-ruled timeline spine that every dish's steps visibly hang off, tethered by a short clipped line at each entry, converging on one SERVE pin.

The rejected default for this category is the cozy cookbook-blog look (cream paper, serif display, food photography) on one side and the bare gray SaaS settings dashboard on the other — this system explicitly refuses both in favor of a physical, work-surface object: paper index cards, steel, pushpins, magnets, grease pencil.

**Key Characteristics:**
- A warm dry-erase board in daylight; a genuine chalkboard at night, not a generic dark theme.
- Every card is a physical object pinned or clipped to the board — never a flat, borderless dashboard panel.
- Conflicts and infeasibility are marked with a hazard-stripe pattern and an icon, never color alone.
- Clock times, durations, and countdowns are always tabular mono; nothing else is.

## Colors

Two grounds (a warm cream board / a green-black chalkboard) plus a small set of physical-object accents; per-dish identity uses an existing, separately-curated eight-color "magnet" palette rather than a role color.

### Primary
- **Steel Frame** (`#4b5157`, `#383d42` pressed, `#2c3230` in dark mode): the board's mounting rail and every primary button/active-tag surface. Paired with **Frame Label** (`#cfd2ce`) for text — a fixed light neutral chosen because the frame stays dark-toned in both themes, so `--board` (which inverts per theme) cannot be reused as its text color.

### Neutral
- **Board** (`#f2ecdb` light / `#1d2320` dark): the writing surface itself — warm cream dry-erase by day, chalkboard by night. Carries a faint dot-grid texture (`--board-edge` at low opacity) rather than reading flat.
- **Wall** (`#cfcbc0` light / `#101312` dark): the page background the board is mounted on.
- **Paper** (`#fffdf8` light / `#262c28` dark): pinned index cards (Kitchen setup, Menu, Unified timeline) and popover-style panels — visually a shade lighter/cleaner than the board underneath it.
- **Ink** (`#23262b` light / `#f1efe4` dark): primary text, and — inverted — the fill of the final SERVE entry, which is deliberately the one place the board's light/dark polarity flips to spotlight the finish line.

### Signal (never color alone — always paired with an icon and/or a pattern)
- **Amber** (`#d98324`): equipment-conflict hazard stripe and border. **Amber Text** (`#8a5213` light / `#eeab52` dark) is a separate, contrast-checked token for amber used as small text (e.g. "+5 min late") on the plain board — the saturated `--amber` itself fails 4.5:1 as text on the light board.
- **Red** (`#b23a34`): infeasible-schedule banner, destructive actions.
- **Green** (`#2f7d52`): the live "in progress" step timer, paired with a pulsing dot, never green text alone.

### Named Rules
**The Paired-Token Rule.** Any color meant to sit on a surface that inverts between light and dark (the board, the ink) must never itself be that inverting token when used as text/foreground on a non-inverting surface (the frame). Use a dedicated fixed-neutral token (`frame-label`) instead — this was a real contrast bug caught during build (buttons and active tags went invisible in dark mode) and the rule exists to prevent it recurring.

## Typography

**Display Font:** Permanent Marker (`var(--font-marker)`, fallback: Geist Sans, sans-serif)
**Body Font:** Geist Sans (`var(--font-geist-sans)`, fallback: Arial, Helvetica, sans-serif)
**Label/Mono Font:** Geist Mono (`var(--font-geist-mono)`) — reserved for measurement, never used decoratively

**Character:** A grease-pencil marker voice for section titles and the handful of "written on the board" labels, set against a plain, highly legible sans for every instruction and control — the marker face is never used for body copy or data, only short single-line headers and tags.

### Hierarchy
- **Display** (400, `text-lg`–`text-2xl`/`text-3xl`, `leading-none`, `.font-marker`): section headers ("Kitchen setup", "Menu", "Unified timeline"), the page title card, and the "Serve" pill label. Never more than a few words.
- **Body** (400–500, `text-sm`, 1.5 line-height): step descriptions, form labels, button text, all prose.
- **Label/Mono** (500, `text-xs`–`text-sm`, tabular-nums): every clock time, duration, countdown, and equipment temperature. If it's a measurement, it's mono; nothing else is.

### Named Rules
**The Measurement-Is-Mono Rule.** Tabular mono is reserved for numbers a cook actually times against (clock times, minutes remaining, temperatures). It never appears as a "technical" costume on non-numeric labels.

## Layout

Two-column shell at `lg:` and above (`340px` setup/menu rail + flexible timeline column) inside a single steel-framed board capped at `max-w-6xl`, itself mounted on a `--wall` background with generous outer margin. Below `lg:`, the columns collapse to one, gated by a segmented "Timeline / Setup & menu" control that defaults to **Timeline** — the live view is the higher-priority context (a phone propped in the kitchen) and must never be buried under setup on first load. Card padding is `p-4` (16px); timeline entries use `p-2.5` (10px) with `mb-4` (16px) rhythm between entries.

## Elevation & Depth

Hybrid: the board itself lifts off the wall with a real soft shadow (`0 18px 45px`, tinted from `--wall-shadow`); pinned paper cards lift off the board the same way, offset + blurred (`2px 5px 10px`), never a flat zero-blur block shadow. Small physical accents (pushpins, magnet dots) carry a tight radial gradient plus a small hard-edged shadow, appropriate to their scale as tiny round objects rather than as panels.

### Shadow Vocabulary
- **Board-on-wall** (`box-shadow: 0 18px 45px var(--wall-shadow)`): the one large lift, used once per page on the outer board frame.
- **Card-on-board** (`box-shadow: 2px 5px 10px var(--board-edge)`): every pinned index card (Kitchen setup, Menu, Unified timeline) and the step-edit form.
- **Small object** (`box-shadow: 1px 1px 2px var(--board-edge)`): stepper buttons, small controls.

### Named Rules
**The No-Flat-Block Rule.** Every shadow in this system carries both an offset and a blur. A zero-blur `Npx Npx 0` block shadow belongs to a neobrutalist world this project never chose, and is a defect if it appears.

## Shapes

Small, near-square corners (`rounded-sm`, 2px) on every rectangular surface — cards, inputs, buttons, badges — reads as cut paper and cut steel rather than soft app-UI bubbles. The one larger radius (`rounded-md`, 6px) is reserved for the single outer board frame. Circles are used deliberately and only for physical round objects: pushpins, magnet dots on dishes, and timeline spine nodes — never as a decorative shape elsewhere.

## Components

### Buttons
- **Shape:** `rounded-sm` (2px)
- **Primary:** `background: var(--frame)`, `color: var(--frame-label)`, hover darkens to `var(--frame-dark)` — used for "Pin dish" and "Add step"
- **Secondary/Text:** `color: var(--ink-muted)` with a dotted underline, hover to `var(--ink)` — used for "+ add step", "edit", "cancel"

### Chips / Tags
- **Cook filter tabs:** unselected = `var(--paper)` bg / `var(--frame-light)` border / `var(--ink-muted)` text; active = `var(--frame)` bg / `var(--frame-label)` text (never `var(--board)` — see the Paired-Token Rule).
- **Dish badge:** background is the dish's own magnet color (from the existing 8-color `RECIPE_COLORS` set); text color is computed per-badge via `readableTextColor()` (a WCAG luminance check), never hardcoded white — several of the eight magnet colors are pale enough that white text fails contrast outright.

### Cards / Index Cards
- **Corner Style:** `rounded-sm`, with one small radial-gradient pushpin at the top-left corner (`Kitchen setup`, `Menu`, `Unified timeline`).
- **Background:** `var(--paper)`
- **Shadow Strategy:** Card-on-board (see Elevation).
- **Internal Padding:** `p-4`, `pt-6` to clear the pushpin.

### Timeline Entry ("chit")
The signature component. A magnet-colored dot sits in a fixed-width column on the spine; a short 2px horizontal tether connects the dot to the entry card, so each entry visibly clips onto the spine rather than merely sitting beside it. The entry itself is a plain-bordered `var(--board)` card holding: a mono clock time, a dish-colored badge, the description, an equipment/kind line, and a right-aligned timer + delay control. The final "Serve" entry inverts to `var(--ink)` background / `var(--board)` text, the only place polarity flips, to mark it as the milestone the whole spine converges on.

### Conflict / Infeasibility Banners
- **Conflict:** a solid `var(--amber)`/`var(--amber-ink)` diagonal hazard-stripe strip on top of an `var(--amber-surface)` body, with a warning-triangle icon — the stripe pattern carries the meaning, not the amber hue alone.
- **Infeasible:** a `var(--red)`-bordered `var(--red-surface)` badge with the same warning icon, placed directly in the timeline header where it cannot be missed.

### Inputs / Fields
- **Style:** `var(--board)` background, `var(--frame-light)` border, `rounded-sm`
- **Focus:** browser-default focus ring recolored to `var(--focus-ring)` via `:focus-visible`

### Step Timer (signature micro-component)
Three states, keyed by React `key` on status so the DOM element remounts and its entrance animation replays on every state transition: upcoming (muted mono "starts in N min"), active (a `var(--green)`/`var(--green-surface)` pill with a continuously pulsing dot and a one-time "stamp" pop-in), done (muted, struck through).

## Do's and Don'ts

### Do:
- **Do** keep every shadow offset-plus-blur; the board is a physical-object world, not a neobrutalist one.
- **Do** compute dish-badge text color from the badge's own background (`readableTextColor()`); never assume white or black text works for an arbitrary per-dish color.
- **Do** default the mobile view to the Timeline tab, never Setup — kitchen-during-cooking is the highest-priority context per PRODUCT.md.
- **Do** mark every conflict/infeasibility state with an icon and/or pattern in addition to color.

### Don't:
- **Don't** use `var(--board)` as a text/foreground color on `var(--frame)` — `--board` inverts per theme, `--frame` does not, and the pairing goes invisible in dark mode. Use `var(--frame-label)`.
- **Don't** add a colored `border-left`/`border-right` to cards, list items, or alerts to encode category — dish identity is carried by the magnet dot, not a side stripe.
- **Don't** use an emoji or unicode glyph as an icon. Every icon in this system is an authored inline SVG at one consistent stroke weight.
- **Don't** use the marker display face for body copy, descriptions, or anything longer than a short label — it is a header/tag voice only.
