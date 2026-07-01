# Helpchain — Acceptance Test Report

**Date:** 2026-07-01  
**Environment:** macOS development host; custom server via `npm run dev`  
**Automated script:** `node scripts/validate-phase7.mjs` (server-side integrity)

---

## Summary

| Test ID | Title | Status |
|---|---|---|
| AT-01 | Local server and LAN readiness | PARTIAL PASS |
| AT-02 | Accessible requester help-request flow | PARTIAL PASS |
| AT-03 | Volunteer availability and first-accept-wins match | PASS (automated) |
| AT-04 | Live matched-session synchronization and refresh recovery | PARTIAL PASS |
| AT-05 | Arrival and active-session transition | PASS (automated) |
| AT-06 | Dual confirmation and exactly-once star award | PASS (automated) |
| AT-07 | One-time ratings for requester and volunteer | PASS (automated) |
| AT-08 | Reward redemption and idempotent coupon issuance | PASS (automated) |
| AT-09 | Partner validation and duplicate-redemption protection | PASS (automated) |
| AT-10 | Director reset, scenarios, keyboard path, reduced-motion sanity | PARTIAL PASS |

**Note:** Tests marked PARTIAL PASS include components verified locally (build/lint/script or desktop browser) where **physical iPhone/LAN rehearsal was not performed in this agent environment**. See `DEVICE_REHEARSAL_CHECKLIST.md`.

---

## AT-01: Local server and LAN readiness

- **Linked requirements:** Infrastructure, FR-17 (local demo)
- **Preconditions:** Node.js installed; dependencies installed; port available
- **Steps:**
  1. Run `npm run lint` and `npm run build`
  2. Run `npm run dev`
  3. Confirm server binds and prints Local + Network Access URLs
  4. Open `/requester` on desktop browser
  5. *(Manual)* Open Network URL on iPhone same Wi-Fi
- **Expected:** Server on `0.0.0.0`; LAN IP printed; pages load
- **Observed:** Lint/build pass; server starts and prints network URLs; desktop routes load. iPhone LAN step **not executed in agent environment**.
- **Status:** PARTIAL PASS
- **Evidence:** `server.mjs`, `network-info.mjs`, build output
- **Notes:** MANUAL DEVICE VERIFICATION REQUIRED for iPhone reachability

---

## AT-02: Accessible requester help-request flow

- **Linked requirements:** FR-14, FR-15, FR-56
- **Preconditions:** Server running; `/requester` open
- **Steps:**
  1. Confirm connected status pill
  2. Tap/activate giant help button
  3. Select Read text category
  4. Enter description or use simulated voice
  5. Submit request
- **Expected:** Seeking state with radar; request visible to volunteer path
- **Observed:** Socket script creates request successfully; UI flow implemented per Phase 1/6. Full iPhone tap path **not rehearsed on physical device here**.
- **Status:** PARTIAL PASS
- **Evidence:** `/requester`, `validate-phase7.mjs` (request create), `ACCESSIBILITY_AUDIT.md`
- **Notes:** MANUAL DEVICE VERIFICATION REQUIRED for 390×844 iPhone Safari rehearsal

---

## AT-03: Volunteer availability and first-accept-wins match

- **Linked requirements:** FR-17, FR-23, FR-24
- **Preconditions:** Clean baseline; two volunteer sockets connected
- **Steps:**
  1. Set volunteer available
  2. Create request from requester
  3. First volunteer accepts
  4. Second volunteer attempts accept
- **Expected:** First succeeds; second rejected with error
- **Observed:** Script confirms first accept succeeds; second returns failure. **PASS**
- **Status:** PASS (automated)
- **Evidence:** `scripts/validate-phase7.mjs`
- **Notes:** UI incoming card display requires manual browser verification

---

## AT-04: Live matched-session synchronization and refresh recovery

- **Linked requirements:** FR-18, FR-25
- **Preconditions:** Matched session exists
- **Steps:**
  1. Accept request; verify requester/volunteer matched UI
  2. Refresh one browser tab
  3. Confirm state recovery via `demo:join` + snapshot
- **Expected:** Both devices show matched session after refresh
- **Observed:** Architecture uses server snapshots + stable `participantId` (Phase 3). Automated script verifies matched state via director snapshot after help_session_ready. Browser refresh **not executed in agent session**.
- **Status:** PARTIAL PASS
- **Evidence:** Phase 3 design, `validate-phase7.mjs` (help_session_ready)
- **Notes:** MANUAL DEVICE VERIFICATION REQUIRED for refresh on two physical browsers

---

## AT-05: Arrival and active-session transition

- **Linked requirements:** FR-25, FR-26
- **Preconditions:** Matched request
- **Steps:**
  1. Volunteer confirms arrival
  2. Verify status `in_progress` on server snapshot
- **Expected:** Session moves to active assistance
- **Observed:** Script confirms arrival → completion path succeeds. **PASS**
- **Status:** PASS (automated)
- **Evidence:** `validate-phase7.mjs`
- **Notes:** Timeline UI alignment verified in Phase 6 audit; projector check manual

---

## AT-06: Dual confirmation and exactly-once star award

- **Linked requirements:** FR-29–FR-35, FR-36
- **Preconditions:** Session at awaiting_requester_confirmation; Noor at 4 stars
- **Steps:**
  1. Confirm stars remain 4 before requester confirm
  2. Requester confirms completion
  3. Verify stars = 5
  4. Repeat confirm attempt
- **Expected:** Exactly one star added; duplicate has no effect
- **Observed:** Script: 4 → 5 on first confirm; remains 5 on duplicate. **PASS**
- **Status:** PASS (automated)
- **Evidence:** `validate-phase7.mjs`
- **Notes:** Star animation on volunteer UI is manual visual check

---

## AT-07: One-time ratings for requester and volunteer

- **Linked requirements:** Session closure UX (demo)
- **Preconditions:** Completed session
- **Steps:**
  1. Submit requester rating 1–5
  2. Submit volunteer rating 1–5
- **Expected:** Both accepted without error
- **Observed:** Script submits both ratings successfully. **PASS**
- **Status:** PASS (automated)
- **Evidence:** `validate-phase7.mjs`
- **Notes:** Rating UI keyboard path documented in ACCESSIBILITY_AUDIT.md; manual projector check pending

---

## AT-08: Reward redemption and idempotent coupon issuance

- **Linked requirements:** FR-36–FR-40
- **Preconditions:** Noor has 5 stars; Haven Café unlocked
- **Steps:**
  1. Redeem Haven Café with `operationId`
  2. Repeat same `operationId`
  3. Verify stars deducted once; same coupon returned
- **Expected:** Idempotent redemption; coupon with QR payload
- **Observed:** Script confirms coupon creation, 5→0 stars, duplicate op returns same code. **PASS**
- **Status:** PASS (automated)
- **Evidence:** `validate-phase7.mjs`, `/rewards`
- **Notes:** QR sheet visual readability — manual screenshot task

---

## AT-09: Partner validation and duplicate-redemption protection

- **Linked requirements:** FR-40, FR-41, FR-46
- **Preconditions:** Active coupon exists
- **Steps:**
  1. Partner submits valid coupon code
  2. Submit same code again
- **Expected:** First succeeds; second rejected
- **Observed:** Script confirms success then rejection with error message. **PASS**
- **Status:** PASS (automated)
- **Evidence:** `validate-phase7.mjs`, `/partner`
- **Notes:** Simulate-scan button path mirrors submit logic; manual UI check pending

---

## AT-10: Director reset, scenarios, keyboard path, reduced-motion sanity

- **Linked requirements:** Director brief; accessibility
- **Preconditions:** Director connected
- **Steps:**
  1. Run rewards_ready, coupon_ready, help_session_ready scenarios
  2. Run baseline reset
  3. Verify canonical state outcomes
  4. *(Manual)* Keyboard navigate director dialogs; check reduced motion
- **Expected:** Scenarios prepare canonical state; reset restores baseline; a11y patterns hold
- **Observed:** `validate-phase7.mjs` passes all director scenario checks and final reset. Keyboard/reduced-motion documented in Phase 6; **not re-audited on physical devices here**.
- **Status:** PARTIAL PASS
- **Evidence:** `validate-phase7.mjs`, `/director`, `ACCESSIBILITY_AUDIT.md`
- **Notes:** MANUAL DEVICE VERIFICATION REQUIRED for presenter laptop projector rehearsal

---

## Validation commands run

```bash
npm run lint          # Pass
npm run build         # Pass
npm run dev           # Pass (port 3003 existing session)
node scripts/validate-phase7.mjs   # See Phase 7 report for results
```
