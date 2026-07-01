# Helpchain — 90-Second Live Demo Runbook

**Duration:** ~90 seconds  
**Audience goal:** Understand accessible request → human help → trust → reward → partner value loop.

## Required devices / tabs

| Device | Route | Open before demo |
|---|---|---|
| Presenter Mac (optional) | `/` | Landing intro |
| iPhone | `/requester` | Primary requester |
| Laptop / iPad | `/volunteer` | Noor — go available first |
| Laptop / phone | `/rewards` | After star earned (can open live) |
| Laptop | `/partner` | Before redemption step |
| Presenter laptop | `/director` | Hidden — recovery only |

**Device order:** Start requester + volunteer → rewards + partner when needed → director only if recovery required.

**Avoid during demo:** Director reset mid-flow, refreshing all tabs unnecessarily, explaining internal socket details.

---

## 0:00–0:10 — Opening

**Screen:** `/` landing on projector (or verbal intro if jumping straight to devices)

**Say:**  
“Helpchain helps someone ask for nearby, situational help through one clear action — not a complex app. This is a local engineering prototype: voice, location, and scanning are simulated, but the live coordination is real.”

**Audience should notice:** Calm intro; three roles; prototype disclaimer.

---

## 0:10–0:25 — Requester creates help request

**Screen:** iPhone `/requester`

**Actions:**
1. Show connected status.
2. Press **I need help**.
3. Choose **Read text**.
4. Tap **simulated voice** (or type description).
5. Send request — show seeking radar.

**Say:**  
“Rajaa needs help reading a sign. One button, one category, one message — designed for clarity under stress. We’re not using real GPS; the location is a labelled demo zone.”

**Audience should notice:** Large help button; simulated voice label; seeking state.

---

## 0:25–0:38 — Volunteer accepts

**Screen:** `/volunteer` incoming request card

**Actions:**
1. Confirm Noor is **available**.
2. Tap **Accept request**.

**Say:**  
“The request appears live on a volunteer device. The server assigns the first volunteer who accepts — that prevents two people claiming the same session.”

**Audience should notice:** Accept is primary; match feedback on requester (switch briefly if possible).

---

## 0:38–0:55 — Active session

**Screens:** `/volunteer` + `/requester`

**Actions:**
1. Volunteer taps **Confirm arrival**.
2. Briefly show synchronized session timeline / elapsed time.
3. Volunteer taps **Assistance completed**.

**Say:**  
“Both sides see the same session state. The volunteer marks complete, but the reward is not issued yet — the requester must confirm they actually received help.”

**Audience should notice:** Dual-sided progress; calm timers, not countdown alarms.

---

## 0:55–1:08 — Dual confirmation and star

**Screen:** `/requester` confirmation prompt

**Actions:**
1. Requester taps **Yes, I received help**.
2. Show volunteer star balance updating to 5.

**Say:**  
“Trust matters. Only after the requester confirms does Noor earn exactly one star.”

**Audience should notice:** Single star increment; completed state.

---

## 1:08–1:22 — Rewards and coupon

**Screen:** `/rewards`

**Actions:**
1. Open rewards from volunteer completed state or navigate to `/rewards`.
2. Redeem **Haven Café** (5 stars).
3. Open coupon detail — show QR **and** readable code.

**Say:**  
“Stars unlock a partner benefit. The server creates a real coupon record with a unique code and QR image for the demo.”

**Audience should notice:** Gold restrained; code readable without scanning.

---

## 1:22–1:30 — Partner redemption

**Screen:** `/partner`

**Actions:**
1. Tap **Simulate scan** (or enter code manually).
2. Show success and redeemed history.

**Say:**  
“Haven Café validates the coupon once. A second attempt is rejected — same as production intent, without a real POS.”

**Audience should notice:** Success state; duplicate protection if time allows.

---

## Closing line (if time)

“Everything you saw runs on one local server with in-memory state — no cloud database. The director console can reset the demo in seconds for another run.”

---

## Pre-demo checklist (5 minutes)

- [ ] `npm run dev` running; Network URL noted
- [ ] iPhone on same Wi-Fi
- [ ] Volunteer **available**
- [ ] Director on **baseline** (optional pre-reset)
- [ ] Screen brightness high; Do Not Disturb on phones
- [ ] Close unrelated tabs

## Post-demo reset

1. Open `/director`
2. **Reset demo** → confirm
3. Verify Noor at 4 stars, no active session
