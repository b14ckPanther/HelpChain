# Helpchain — Requirements Traceability Matrix

Maps major SRS expectations to prototype implementation and acceptance evidence.

| Requirement Area | Relevant SRS IDs | Prototype Implementation | Evidence Route / Script | Acceptance Test | MVP Status |
|---|---|---|---|---|---|
| Accessible request initiation | FR-14, FR-56 | Giant red help button, keyboard focus, live status | `/requester`, `ACCESSIBILITY_AUDIT.md` | AT-02 | Implemented |
| Help category and description | FR-15 | Category sheet + textarea; demo location label | `/requester` | AT-02 | Implemented |
| Simulated voice input | FR-15 (demo) | Simulated voice button with prepared transcript | `/requester` | AT-02 | Simulated |
| Nearby volunteer matching | FR-17, FR-22 | Socket broadcast to available volunteers | `/volunteer`, `validate-phase7.mjs` | AT-03 | Implemented (simulated distance) |
| First-accept-wins | FR-23, FR-24 | Server atomic lock on accept | `validate-phase7.mjs` | AT-03 | Implemented |
| Shared session lifecycle | FR-18, FR-25, FR-26 | matched → in_progress → awaiting → completed | `/requester`, `/volunteer` | AT-04, AT-05 | Implemented |
| Dual confirmation | FR-29–FR-35 | Requester confirm after volunteer completion | `validate-phase7.mjs` | AT-06 | Implemented |
| Rating | FR-29 area (demo UX) | 1–5 rating selector both roles | `/requester`, `/volunteer` | AT-07 | Implemented |
| Star reward | FR-36, FR-37 | Exactly one star after dual confirm | `validate-phase7.mjs` | AT-06 | Implemented |
| Reward catalogue | FR-36–FR-38 | Haven Café + locked future rewards | `/rewards` | AT-08 | Implemented |
| QR coupon | FR-40, FR-41 | Server QR data URL + readable code | `/rewards` | AT-08 | Implemented |
| Partner redemption | FR-40, FR-41, FR-46 | Simulate scan + manual entry | `/partner`, `validate-phase7.mjs` | AT-09 | Simulated |
| Duplicate redemption prevention | FR-41 | Server rejects second redemption | `validate-phase7.mjs` | AT-09 | Implemented |
| Accessibility | FR-56–FR-60 | Tokens, focus, live regions, touch targets | `ACCESSIBILITY_AUDIT.md`, `/director` | AT-10 | Implemented |
| Safety / privacy boundaries | NFR / scope | No real emergency dispatch; disclaimer copy | `PROTOTYPE_SCOPE.md`, `/requester` | AT-02 | Out of Scope (production) |
| Director reset / rehearsal | Brief Phase 5 | Reset + four scenarios | `/director`, `validate-phase7.mjs` | AT-10 | Implemented |
| Persistence / accounts | Production SRS | In-memory only; no auth | `ARCHITECTURE_AND_BLOCK_DIAGRAM.md` | AT-01 | Out of Scope |
| Real GPS / maps | FR-16 prod | Demo Zone label + radar visual | `/requester` | — | Simulated |
| Real push notifications | Deferred | Socket.IO live updates only | Socket events | — | Out of Scope |

## Legend

- **Implemented** — Working in prototype with server authority.
- **Simulated** — Deliberately demo-labelled; not production-real.
- **Out of Scope** — Not built; documented honestly.
