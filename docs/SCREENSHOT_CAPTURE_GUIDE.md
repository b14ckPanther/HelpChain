# Helpchain — Screenshot Capture Guide

Automated screenshot capture was **not available** in the Phase 7 agent environment. Use this guide to capture presentation-quality evidence manually.

---

## Prerequisites

1. Start server: `npm run dev`
2. Use a clean baseline: `/director` → **Reset demo** → confirm
3. Complete live flow once to reach each required state (or use director scenarios where noted)

---

## Capture settings

| Context | Viewport | Tool suggestion |
|---|---|---|
| Landing, volunteer, rewards, partner, director | 1440×900 | Desktop browser responsive mode or full window |
| Requester states | 390×844 | Chrome/Safari device toolbar — iPhone 14 Pro or custom |

**Hide:** bookmarks bar, devtools, extensions overlays.

---

## Step-by-step

### 01 — Landing (`01-landing-page.png`)
- Open `http://localhost:3000/`
- Capture full page centered on headline and three role cards

### 02 — Requester ready (`02-requester-ready.png`)
- Open `/requester` at 390×844
- Ensure green connected pill visible
- Capture ready state with help button

### 03 — Requester seeking (`03-requester-seeking.png`)
- Create Read text request with simulated voice
- Capture seeking radar state

### 04 — Volunteer incoming (`04-volunteer-incoming.png`)
- Volunteer available on `/volunteer` at 1440×900 or tablet width
- Capture incoming request card

### 05 — Session in progress (`05-session-in-progress.png`)
- After volunteer confirms arrival
- Capture timeline on requester or volunteer (either acceptable)

### 06 — Star awarded (`06-star-awarded.png`)
- After requester confirms help received
- Capture volunteer completed state showing 5 stars

### 07 — Rewards unlocked (`07-rewards-unlocked.png`)
- Open `/rewards` with 5 stars
- Capture Haven Café unlocked card

### 08 — Coupon QR (`08-coupon-qr.png`)
- Redeem Haven Café; open coupon detail sheet
- Ensure QR and validation code both visible

### 09 — Partner redemption (`09-partner-redemption.png`)
- Open `/partner`; simulate scan or manual redeem
- Capture success overlay / recent redemption entry

### 10 — Director console (`10-director-console.png`)
- During or after live flow, open `/director` at 1440×900+
- Capture health cards + event timeline (no sensitive internals)

---

## Shortcut scenarios (if live flow timing is tight)

| Screenshot | Director shortcut |
|---|---|
| 05 matched/in progress | **help_session_ready** then volunteer confirms arrival |
| 07 rewards | **rewards_ready** |
| 08 + 09 coupon | **coupon_ready** then open rewards + partner |

---

## After capture

1. Save PNG files to `docs/screenshots/` using exact filenames from `SCREENSHOT_INDEX.md`
2. Update status column in `SCREENSHOT_INDEX.md` to **CAPTURED**
3. Attach screenshots to final course report as evidence

---

## Quality check before submission

- [ ] No socket IDs or debug text visible
- [ ] Text readable at report print size
- [ ] Requester shots clearly show simulated labels where relevant
- [ ] Filenames match index exactly
