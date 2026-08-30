# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Home cooks coordinating a multi-dish meal (e.g. a holiday dinner or dinner party with several dishes that must land hot at the same time). One person plans and organizes the menu and schedule; other cooks may follow along on the same screen or their own device to see what they're responsible for and when.

## Product Purpose

Multi-Recipe Meal Coordinator lets a user add every dish planned for a meal, along with each dish's steps (duration, active/passive, equipment, dependencies, optional assigned cook), plus a target serving time. It computes one unified backward-scheduled timeline across all dishes so everything finishes at the same time, flags equipment conflicts (e.g. oven double-booked), and gives live per-step timers plus a "running late" delay control. Success = the whole meal comes together on time without a scheduling collision, and each cook always knows what to do next.

## Positioning

Unlike a single-recipe timer or a generic checklist/to-do app, this tool schedules *across* multiple independent recipes and shared kitchen resources (oven, burners, prep space, cooks) simultaneously, computing one synced timeline backward from a single target serving time and surfacing resource conflicts before they happen in the kitchen.

## Operating Context

- Used in two phases: (1) planning ahead — building the menu, steps, and kitchen setup, typically at a desk/laptop with more time and care; (2) live during cooking — the unified timeline and step timers are glanced at frequently on a phone or tablet propped in the kitchen, often with messy/full hands. Kitchen-during-cooking is the higher-priority context to design for.
- No accounts or backend: state is client-only, persisted to the browser via localStorage (zustand persist).
- Core workflow: set target serving time and kitchen equipment capacity/cooks -> add dishes -> add steps per dish (duration, active/passive, equipment used, optional temp, optional assigned cook, optional dependency on other steps, optional batch key to merge identical simultaneous steps) -> unified timeline appears automatically once a target time + at least one dish exist -> user can filter timeline by cook, see live countdowns per step, mark a step running late (+5 min), and see equipment conflicts called out.

## Capabilities and Constraints

- Steps can depend on other steps (across recipes), can be tagged with a `batchKey` to combine identical concurrent steps (e.g. "chop garlic" for two dishes at once), and can require kitchen equipment with an optional temperature.
- Equipment has finite capacity (e.g. 1 oven, 4 burners) and the scheduler detects conflicts when demand exceeds capacity.
- Cooks are just labels assigned to steps for filtering the timeline; there is no per-device/per-user login — "multiple cooks may follow along" means they view the same coordinator's schedule, not that each has an authenticated account.
- Schedule is infeasible if there isn't enough time before the target serving time; the UI must communicate this clearly, not just show an error string.

## Brand Commitments

None yet — no existing name/logo commitments beyond the working title "Multi-Recipe Meal Coordinator." Free to establish a visual identity as part of this redesign.

## Evidence on Hand

None — no real menus, testimonials, or screenshots supplied. Use realistic placeholder dish/step content (e.g. roast chicken, mashed potatoes, gravy) consistent with the existing seed/demo behavior, not fabricated claims about the product itself.

## Product Principles

- Kitchen-during-cooking glanceability beats planning-time density: the live timeline, current/next step, and timers must be readable at a glance, at arm's length, one-handed.
- One synced timeline is the product's core value — it must always be the most prominent, trustworthy element on screen, especially when conflicts or infeasibility occur.
- Setup (menu + kitchen configuration) is necessary but secondary — it should be fast and low-friction, not competing visually with the live timeline.
- Never hide a scheduling conflict or infeasible schedule behind subtle styling — these are safety-relevant (food timing) and must be unmissable.

## Accessibility & Inclusion

No specific standard mandated yet, but given kitchen use with visually busy/distracting environments and potential one-handed/glanced use, strong contrast, large touch targets, and no reliance on color alone (for conflicts, cook-colors, active/passive) are functionally required, not optional polish.
