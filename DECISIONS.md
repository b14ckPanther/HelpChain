# Helpchain — Architecture and Design Decisions

---

## D-001: Local requester state only in Phase 1
**Date:** 2026-07-01  
**Decision:** Phase 1 uses local client-side state (React useState) for all requester flow transitions. No shared state, no Socket.IO, no server communication.

**Rationale:** The brief's Phase 1 scope focuses on making the requester iPhone experience "immediately impressive and accessible." Cross-device state sync is a Phase 2 concern. Building the visual flow first allows isolated iteration on UX quality without coupling to the real-time layer.

**Consequence:** The seeking state displays a placeholder ("Volunteer matching will appear here in the live prototype") instead of simulating a completed match. This is honest — no false claim of functionality.

---

## D-002: Socket.IO matching deferred to Phase 2
**Date:** 2026-07-01  
**Decision:** Socket.IO and socket.io-client are not installed. The custom server.mjs is not created. No event contract is implemented.

**Rationale:** Phase 2 is explicitly titled "Live Volunteer Match" in the brief. Adding Socket.IO infrastructure before the volunteer UI exists would create untestable code. The requester flow must stand alone as a polished, accessible experience before cross-device concerns are introduced.

---

## D-003: Simulated voice input, not browser microphone
**Date:** 2026-07-01  
**Decision:** The voice input feature uses a simulated 1.3-second delay followed by a prepared transcript. It does not invoke the Web Speech API or request microphone permissions.

**Rationale:**
1. The prototype is a controlled demo, not a production speech system.
2. Browser microphone permissions create friction during presentations and may fail silently.
3. The demo transcript ("Can someone help me read the platform sign?") is deterministic and repeatable.
4. The component is clearly labelled "Simulated voice input" and "Simulated — does not use your microphone."
5. No sound is required to complete any flow — this is an accessibility requirement.

---

## D-004: Framer Motion for purposeful animation
**Date:** 2026-07-01  
**Decision:** Installed framer-motion for the requester experience. Used for:
- Sheet entrance/exit (spring animation)
- State transitions (fade, slide, scale)
- Button press feedback (whileTap scale)
- Radar ring expansion (seeking state)
- Sending confirmation burst

**Rationale:** The brief specifies Framer Motion and requires motion to "explain an event." All animations respect `prefers-reduced-motion` through the useReducedMotion hook and the global CSS reduced-motion rule.

---

## D-005: Giant button design approach
**Date:** 2026-07-01  
**Decision:** The help button is 160px diameter with:
- Radial glow background (decorative ring)
- Outer ring at 15% opacity
- Multi-layer box shadows (outer glow + inset highlights for tactile depth)
- Framer Motion whileTap scale feedback
- Hand icon + text label
- aria-label for screen readers
- 4px white focus ring at 4px offset for keyboard visibility

**Rationale:** The brief states the button is "the star of the product: extremely large, tactile, high-contrast, and visually unmistakable." The 160px size greatly exceeds the 44px WCAG minimum. The inset shadows create a physical, pressable feel. The glow provides visual salience without aggressive pulsing or flashing.

---

## D-006: Centralized copy in requester-copy.ts
**Date:** 2026-07-01  
**Decision:** All user-facing text for the requester flow is centralized in `requester-copy.ts` as a typed const object. Components import copy rather than containing string literals.

**Rationale:** The brief requires "named constants for text copy" and forbids "duplicated hard-coded strings." Centralization enables:
- Consistent voice throughout the requester experience
- Easy iteration on microcopy without touching component logic
- Clear separation of content from presentation
- Future internationalization readiness (not required for prototype)

---

## D-007: Combined Node HTTP + Socket.IO server on a single port
**Date:** 2026-07-01  
**Decision:** Built a custom `server.mjs` running a unified Node http server wrapping the Next.js request handler and Socket.IO on the same port.

**Rationale:** Running Next.js and Socket.IO on the same port avoids CORS issues, simplifies deployment/hotspot setups for the classroom demo, and aligns with the requirement to let iPhones connect directly without secondary port mappings.

---

## D-008: In-memory store logic for prototype
**Date:** 2026-07-01  
**Decision:** All match-making and socket room connection states are kept inside a transient, non-persistent, in-memory JS class instance (`DemoStore`).

**Rationale:** The brief explicitly specifies "No database". Using an in-memory store avoids storage complexity and network dependencies. It also guarantees a fresh, predictable demo state whenever the custom Node server restarts.

---

## D-009: LAN IP address auto-resolution
**Date:** 2026-07-01  
**Decision:** Implemented a network IP discovery utility (`network-info.mjs`) that pulls host OS IPv4 interfaces and prints formatted connection URLs on boot.

**Rationale:** Presenters need to open the routes on separate mobile devices on the same Wi-Fi. Outputting the local LAN address in the terminal logs on server startup eliminates the need to manually query the local IP address on macOS.

---

## D-010: Server-enforced first-accept-wins
**Date:** 2026-07-01  
**Decision:** The server locks the active request status to `matched` atomically on the first valid accept payload. Subsequent socket accept messages are rejected.

**Rationale:** If multiple volunteer pages attempt to accept the same request simultaneously, the server must prevent dual matches. The first socket that completes the handshakes wins. Others are sent an acknowledgement failure, ensuring the integrity of the match state.

---

## D-011: Same-origin socket client setup
**Date:** 2026-07-01  
**Decision:** The client `io()` socket is initialized without a hardcoded URL string.

**Rationale:** When `io()` is called parameter-free, it defaults to connecting to the window's protocol, domain, and port. This guarantees that whether accessed on `localhost` or via a LAN IP (e.g. `192.168.2.180`), the socket connects seamlessly to the correct host.

---

## D-012: Server-authoritative session state transitions
**Date:** 2026-07-01  
**Decision:** Every critical session stage transition (matched, arrived, completed) is validated and computed on the in-memory server, rather than locally on client devices.

**Rationale:** The server enforces state integrity (e.g., verifying a requester can only confirm completion when the status is `awaiting_requester_confirmation`). This prevents out-of-order state transitions or malicious triggers.

---

## D-013: Server-side exactly-once star award accounting
**Date:** 2026-07-01  
**Decision:** The server checks if `session.starAwardedAt` is null before awarding a star. If not null, it suppresses duplicate awards.

**Rationale:** Guarding the transaction on the server side ensures that even if a requester double-clicks or duplicates confirm requests due to latency, Noor will receive exactly 1 star (no duplicate inflation).

---

## D-014: Stable participant identity for refresh resilience
**Date:** 2026-07-01  
**Decision:** Voluntarily joined clients store a stable, persistent `participantId` (persisted to `localStorage` on load). Reconnecting sockets supply this key during `demo:join`.

**Rationale:** Ephemeral socket IDs reset on page refresh or temporary Wi-Fi drops. By binding session ownership to a client-persisted `participantId` (like Noor's mapped `vol-noor-id`), volunteers can refresh the page and instantly restore their active state.

---

## D-015: In-memory rating storage
**Date:** 2026-07-01  
**Decision:** Star ratings submitted at session close are stored inside the active session object in server heap memory and reset on restart.

**Rationale:** Consistent with the "no database" constraint, the rating system is designed purely as an interactive demo step to illustrate the UX flows.

---

## D-016: Exclusion of timeouts or automatic confirmations in Phase 3
**Date:** 2026-07-01  
**Decision:** Session timeouts (such as a 5-minute standby expiry or automatic completion trigger) are omitted from this phase.

**Rationale:** In a live course demonstration, presenters need absolute control over the flow. Automated expiration triggers could disrupt slides or discussions.

---

## D-017: Elapsed timer instead of pressure-inducing countdowns
**Date:** 2026-07-01  
**Decision:** Displayed helper session durations as elapsed times ("Session active · 00:26") instead of count-down warnings.

**Rationale:** Countdowns create visual pressure and emergency-like anxiety, violating the product brief's calm design guidelines. An elapsed timer provides clarity without negative psychological friction.

## D-018: Server-authoritative reward catalogue and coupon code issuance
**Date:** 2026-07-01  
**Decision:** The reward catalogue items and the logic for coupon issuance are managed on the server. Code formats follow the syntax `HC-HAVEN-XXXX`.

**Rationale:** Moving catalogue rules and redemption math to the server guarantees coupon code uniqueness, partner boundary enforcement, and star deduction safety.

---

## D-019: Client-sent operationId for idempotency safety
**Date:** 2026-07-01  
**Decision:** Every client redemption request includes a unique `operationId`. The server caches redemptions by `operationId` and returns the identical coupon response if repeated.

**Rationale:** Solves double-tap network issues or double-deductions. Re-submitting the same client `operationId` is safe and idempotent.

---

## D-020: Base64 QR coupon generation using qrcode dependency
**Date:** 2026-07-01  
**Decision:** Installed and utilized the standard `qrcode` library on the custom server to render coupon code URLs into Base64-encoded Data URLs on-demand.

**Rationale:** Client-side camera-scanner configurations are prohibited. Relying on static pre-rendered image slots fails to demo unique code flows. In-memory server-side QR generation provides authentic, unique code generation without external network API calls.

---

## D-021: Live client-partner synchronization on redemption
**Date:** 2026-07-01  
**Decision:** Broadcasters send socket events `coupon:redeemed` when coupons are validated, triggering instantaneous history and history status updates on the volunteer wallet.

**Rationale:** Keeps the volunteer's wallet history and active screen updated without requiring page refreshes or polling.

---

## D-022: Automated in-memory coupon reconciliation and star refunds
**Date:** 2026-07-01  
**Decision:** Coupon models define a 30-day relative expiration timestamp. Snapshot queries dynamically reconcile expired coupon states and refund spent stars exactly once.

**Rationale:** Ensures Noor does not permanently lose stars to unused expired coupons. The reconciliation is performed on server snapshot requests.

---

## D-023: Director console is local-only presenter tooling
**Date:** 2026-07-01  
**Decision:** The `/director` route is built as a discreet local presentation control room. It is not linked from requester, volunteer, rewards, or partner navigation and is clearly labelled “Local presentation controls.”

**Rationale:** The director console is a rehearsal and demo safety net, not a production operations product. Keeping it separate avoids confusing judges or users about product scope.

---

## D-024: Server-authoritative reset and scenario preparation
**Date:** 2026-07-01  
**Decision:** All demo reset and presentation scenario actions are executed on the in-memory server via `resetDemo()` and `prepareScenario()`. Clients only request actions and render resulting snapshots.

**Rationale:** Prevents stale client state, duplicate mutations, and unauthorized state changes. Ensures all connected devices return to a coherent baseline through normal Socket.IO broadcasts.

---

## D-025: Scenarios reuse canonical server logic
**Date:** 2026-07-01  
**Decision:** The coupon-ready scenario creates a Haven Café coupon through the same `createRewardRedemption()` path used by `/rewards`. The help-session-ready scenario uses the same request/session structure as live requester/volunteer flows.

**Rationale:** Reusing canonical logic guarantees partner scan, wallet, requester, and volunteer screens behave naturally without handcrafted demo objects or special-case UI branches.

---

## D-026: Demo state remains intentionally non-persistent
**Date:** 2026-07-01  
**Decision:** Director event logs, connected-device records, and demo session state remain in server memory only. The director UI states that demo data resets when the local server restarts.

**Rationale:** Aligns with the prototype’s no-database constraint and keeps presentation recovery simple: restart server or use director reset/scenarios.

---

## D-027: Director snapshots are sanitized
**Date:** 2026-07-01  
**Decision:** Director state exposes safe display device IDs (e.g. `req-1`, `vol-2`), human-readable summaries, and event messages. Raw socket IDs, QR payload tokens, and internal object dumps are never sent to the director client.

**Rationale:** The control room is for presenters, not engineers. Sanitized snapshots reduce accidental disclosure during projection while preserving operational clarity.

---

## D-028: Limited, confirmation-protected scenario controls
**Date:** 2026-07-01  
**Decision:** Phase 5 implements exactly four named scenarios (baseline, rewards ready, coupon ready, help session ready). Each requires a confirmation dialog and a unique `operationId` for idempotency. No arbitrary star inputs, JSON editors, or error-injection controls were added.

**Rationale:** Presentation preparation needs reliability, not open-ended admin power. Limited scenarios cover rehearsal needs without expanding prototype scope or demo risk.

---

## D-029: Landing page as local demo intro, not marketing site
**Date:** 2026-07-01  
**Decision:** Phase 6 replaced the Phase 0 foundation screen with a concise local-demo introduction: one headline, one explanatory sentence, three role cards, and a prototype disclaimer. No director link, no feature marketing, no external CTAs.

**Rationale:** Presenters need a calm opening screen to launch the live demo quickly. A marketing-style site would misrepresent prototype scope and distract from the classroom demonstration.

---

## D-030: Status communication beyond color alone
**Date:** 2026-07-01  
**Decision:** Visual polish retained and strengthened text/icon pairings for locked/unlocked rewards, timeline milestones, connection pills, and volunteer incoming alerts. Incoming accept uses primary button styling with explicit labels rather than red-only urgency.

**Rationale:** Accessibility and presentation clarity require that state never depend on color alone. This also avoids making volunteer alerts feel like a medical emergency product.

---

## D-031: Reduced motion preserves status clarity
**Date:** 2026-07-01  
**Decision:** Decorative motion (radar rings, scanner line, dialog scale) falls back to static equivalents under `prefers-reduced-motion`. Success, error, and milestone feedback remain visible through text, icons, and surface styling.

**Rationale:** Motion is explanatory, not essential. Users who disable animation must still understand whether an action succeeded.

---

## D-032: No new dependencies during polish phase
**Date:** 2026-07-01  
**Decision:** Phase 6 used existing Framer Motion, Lucide, and Tailwind/token infrastructure. Accessibility dialog behavior implemented with a small local hook rather than adding focus-trap or a11y libraries.

**Rationale:** The prototype is functionally complete; polish should reduce risk and scope creep. Local hooks are sufficient for demo-modal depth.

---

## D-033: Honest acceptance-test reporting in Phase 7
**Date:** 2026-07-01  
**Decision:** Acceptance tests in `docs/TEST_REPORT.md` use PASS only when actually executed. Server-side checks run via `validate-phase7.mjs`; browser UI and iPhone LAN steps are marked PARTIAL PASS or MANUAL DEVICE VERIFICATION REQUIRED when not performed in the agent environment.

**Rationale:** Course assessment requires engineering honesty. Inventing iPhone rehearsal or screenshot evidence would misrepresent verification status.
