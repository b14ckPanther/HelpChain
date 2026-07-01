# Helpchain — Accessibility Audit (Phase 6)

**Date:** 2026-07-01  
**Scope:** All six prototype routes and shared UI primitives

---

## Keyboard Coverage

| Flow | Keyboard path verified |
|---|---|
| Landing role cards | Tab to each card link; Enter activates navigation |
| Requester help flow | Tab to help button; category sheet options; back/edit controls; submit |
| Volunteer flow | Availability toggle; accept/decline; session actions |
| Rewards redemption | Catalog redeem buttons; dialog confirm/cancel |
| Partner validation | Manual code input; submit button |
| Director | Scenario cards; reset; dialog confirm/cancel |

All primary flows can be initiated and completed without a pointer on desktop browsers.

---

## Focus Behavior

- Global `:focus-visible` violet ring on interactive elements.
- New `useAccessibleDialog` hook moves focus into dialogs on open and restores focus on close.
- Applied to: category sheet, reward redemption dialog, coupon detail sheet, director reset/scenario dialogs.
- Giant requester help button retains high-contrast white focus ring at 4px offset.

---

## Dialog Behavior

| Dialog | `role="dialog"` | Accessible name | Escape closes | Focus trapped |
|---|---|---|---|---|
| Category sheet | Yes | `#category-sheet-title` | Yes | Initial focus |
| Reward redemption | Yes | `#dialog-title` | Yes (unless submitting) | Yes |
| Coupon detail sheet | Yes | `#coupon-sheet-title` | Yes | Yes |
| Director reset | Yes | `#director-reset-title` | Yes (unless submitting) | Yes |
| Director scenario | Yes | `#director-scenario-title` | Yes (unless submitting) | Yes |
| Seeking cancel confirm | Yes | alertdialog pattern | Existing | Existing |

---

## Live Regions

- Requester: `RequesterStatusAnnouncer` for step transitions.
- Session: `SessionStatusAnnouncer` for milestone changes.
- Rewards: aria-live announcements on redemption success/error.
- Director: polite live region for reset/scenario/connection messages.
- Status pills use `role="status"` with text labels (never color-only).

---

## Touch Target Review

- UI primitives enforce `--hc-touch-min` (44px) on buttons and icon buttons.
- Coupon sheet close control enlarged to 44px minimum.
- Category sheet options use 72px min-height rows.
- Requester help button remains substantially larger than minimum (160px).

---

## Reduced-Motion Review

- Global CSS collapses animation/transition duration under `prefers-reduced-motion: reduce`.
- Framer Motion components use `useReducedMotion()` in radar, scanner, and volunteer/requester transitions.
- Reduced motion preserves static rings, status text, check icons, and success/error copy.

---

## Contrast Observations

- Text on dark surfaces meets high-contrast presentation goals (`--hc-text` on `--hc-canvas`).
- Success/warning/violet status pills pair colored backgrounds with explicit text labels.
- QR codes include text fallback codes and descriptive `alt` text with partner name and code.

---

## Form Labels and Inputs

- Request description textarea has visible `<label>`.
- Partner manual entry includes sr-only label and 16px input class.
- iOS Safari auto-zoom mitigated via `.hc-input-base` (16px font size).

---

## Known Limitations

1. Dialog focus trap is initial-focus based, not full roving tabindex cycle — sufficient for prototype modal depth but not as strict as dedicated focus-trap libraries.
2. No automated axe/Lighthouse CI gate installed (manual verification only, per Phase 6 scope).
3. Simulated voice input remains button-triggered demo behavior — not a real speech interface.
