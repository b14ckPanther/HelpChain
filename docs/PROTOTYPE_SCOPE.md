# Helpchain — Prototype Scope (MVP Boundaries)

This document defines what the Helpchain prototype honestly implements, simulates, and excludes.

---

## Implemented live in the prototype

- **Requester assistance request** — Category selection, text description, demo location, giant accessible help action on `/requester`.
- **Volunteer availability and first-accept-wins matching** — Volunteer goes available; first accepting volunteer locks the session atomically on the server.
- **Live Socket.IO state synchronization** — Requester, volunteer, rewards, partner, and director views update from the same in-memory server.
- **Arrival and dual confirmation** — Volunteer confirms arrival; volunteer marks complete; requester confirms help received before any reward.
- **Exactly-once star award** — Server guards `starAwardedAt`; duplicate confirmation does not inflate stars.
- **Ratings** — Requester and volunteer can submit 1–5 ratings after completion (in-memory).
- **Reward wallet** — Star balance, catalogue, locked/unlocked states on `/rewards`.
- **QR coupon issuance** — Server-generated unique coupon codes and QR data URLs via canonical redemption logic.
- **Partner redemption simulation** — Manual code entry and simulate-scan on `/partner`; duplicate redemption rejected.
- **Director reset and presentation scenarios** — Baseline reset, rewards ready, coupon ready, help session ready on `/director`.

---

## Simulated (clearly labelled in UI)

- **Voice transcript** — Button inserts prepared text after a short delay; no microphone API.
- **Demo location / proximity** — Fixed label “Demo Zone A — Main Hall”; radar is abstract, not GPS.
- **QR scanning** — Partner “Simulate scan” validates server-side; no camera access.
- **Partner validation environment** — Haven Café terminal is a demo browser screen, not a POS integration.
- **Local presentation controls** — Director console is for rehearsal/recovery, not production operations.

---

## Out of scope

- Authentication, user registration, OTP, SSO
- Disability verification and admin review workflows
- Real GPS, maps, background tracking
- Real push notifications or SMS
- Chat or messaging beyond demo session structure
- Production payments or real partner POS integration
- Database persistence or cloud dependency
- Medical or emergency-service integrations
- Analytics dashboards, fraud detection, GDPR workflows
- Single-device fallback showcase mode
- Multi-language production release

---

## Honest framing for assessment

This prototype proves the **critical value loop**:

```text
Request → match → help session → dual confirmation → star → coupon → partner redemption
```

It does **not** prove production scalability, regulatory compliance, or real-world emergency response.
