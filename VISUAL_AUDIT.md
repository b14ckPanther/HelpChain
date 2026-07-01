# Helpchain — Visual Audit (Phase 6)

**Date:** 2026-07-01  
**Scope:** Global design system and all six prototype routes

---

## Visual-System Findings

| Area | Finding | Action taken |
|---|---|---|
| Color semantics | Reward gold used ad hoc via `--hc-warning` and raw rgba | Added `--hc-reward-gold`, `--hc-reward-gold-muted`, `--hc-help-red-muted` tokens |
| Typography | Landing page still showed Phase 0 preflight content | Replaced `/` with polished local-demo introduction |
| Spacing | Generally consistent via `--hc-space-*` | Preserved; improved landing grid and director timeline alignment |
| Surfaces | Strong foundation from Phase 0 | Kept layered surfaces; softened incoming-request card away from alarm-red |
| Focus | Global violet ring present | Preserved; dialog panels receive initial focus |
| Motion | Some decorative motion lacked reduced-motion fallbacks | Added static scanner line fallback; existing radar/timeline patterns retained |
| Overflow | Potential horizontal scroll on narrow devices | Added `overflow-x: hidden` on `html`/`body` and `AppShell` |
| Emojis | Wallet header used star emoji characters | Replaced with Lucide `Star` icon per brief |

---

## Refinements Made

1. **Shared `BrandMark`** — Reusable abstract identity mark for landing and future reuse.
2. **Restrained reward gold** — Wallet, reward cards, and director health cards use dedicated gold tokens instead of generic warning color.
3. **Volunteer incoming request** — Violet accent and primary Accept button; decline remains secondary. Strong for projection without emergency-alarm tone.
4. **Partner scanner** — Reduced-motion-safe scan line; clearer simulated-scan disclaimer preserved.
5. **Coupon detail sheet** — Safe-area bottom padding, larger close target, `break-all` on validation codes.
6. **Director event timeline** — Grid layout for cleaner timestamp alignment on wide screens.

---

## Route-by-Route Review Summary

### `/` — Landing
- Replaced temporary foundation checklist with headline, description, and three public role cards.
- No director link. Calm projector-friendly layout at mobile, tablet, and desktop widths.

### `/requester`
- Giant help button remains dominant with tactile depth (inset shadow, glow ring).
- Category sheet uses labelled dialog title, safe-area bottom padding, Escape-to-close.
- Request details textarea uses `hc-input-base` (16px) to prevent iOS zoom.
- Radar visualization unchanged structurally; remains clearly labelled simulated proximity.

### `/volunteer`
- Incoming request card visually strong but no longer heavily red.
- Accept/decline hierarchy clarified (primary accept, secondary decline).
- Session timeline label width improved for 390px viewports.

### `/rewards`
- Gold restrained to star meaning; progress bar simplified to solid gold (no gradient).
- Locked/unlocked states retain icon + text labels.
- Redemption and coupon sheets polished for readability and safe areas.

### `/partner`
- Scanner frame remains abstract with explicit no-camera simulation copy.
- Manual code entry labelled and uses accessible input sizing.

### `/director`
- Operational layout preserved; health cards and event log readability improved.
- Reset remains the only destructive red action; scenario cards use secondary/violet styling.

---

## Responsive Observations

| Viewport | Observations |
|---|---|
| **390×844** | Requester help button and bottom sheets fit with safe-area padding. Landing stacks role cards vertically. Timeline labels readable at narrow width. |
| **768×1024** | Landing shows two/three-column role grid. Director panels begin two-column layout. Demo frames on requester/volunteer remain intentional. |
| **1440×900** | Landing centered with generous whitespace. Director console uses multi-column grid without excessive density. Partner terminal comfortable on desktop browser. |

---

## Remaining Non-Blocking Visual Limitations

1. DemoFrame device chrome on desktop requester/volunteer is intentional for presentation context but adds horizontal margin on very narrow desktop windows.
2. Rewards catalogue grid remains compact on small phones — functional but not as spacious as tablet layout.
3. Director console mobile layout is usable but optimized for presenter laptop/projector widths.
