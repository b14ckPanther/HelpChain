# Helpchain — Master Prototype Build Brief

> **Purpose:** This is the single, living source of truth for the Helpchain prototype. Every agent must read this file before planning, coding, testing, or changing the project.
>
> **Prototype mode:** Local-first, multi-device, interactive simulation. This is an engineering proof-of-concept for a course presentation, **not** a production deployment.
>
> **Primary outcome:** One person uses an iPhone as the accessible Helpchain request device; a second device shows the volunteer receiving and accepting the request in real time; the session then completes through dual confirmation, awards one star, and creates a reward QR coupon.

---

## 0. Non-negotiable project decision

Build **Helpchain Assist**, a polished, fully responsive web prototype that behaves like a mobile assistive device on the requester’s iPhone and like a volunteer/partner system on other devices.

There is **no database, real authentication, real GPS, real emergency-service connection, payment processing, or external cloud dependency** in the initial prototype. The app must still behave as a coherent end-to-end system because all demo state is held in the local demo server and broadcast between devices on the same Wi-Fi network.

This is a simulation of the critical Helpchain value loop:

```text
Requester taps a huge accessible help button
        ↓
Live request appears on volunteer device
        ↓
Volunteer accepts first
        ↓
Requester sees that a volunteer is on the way
        ↓
Volunteer marks assistance complete
        ↓
Requester confirms completion
        ↓
Volunteer receives exactly one star
        ↓
Volunteer redeems a sample partner benefit as a QR coupon
```

### Core framing for the presentation

> “Helpchain turns a smartphone into an accessible, single-purpose assist device. A person needing immediate situational help does not need to search through an app or complete a form: one clear action starts a nearby human-help flow.”

Do **not** present this prototype as a real emergency-response system. It is a controlled prototype of nearby voluntary assistance.

---

## 1. Course alignment

The course expects a prototype that demonstrates an engineering process: a defined problem, a measurable functional solution, a proof of capability, validation, documentation, risk analysis, and iteration.

This project proves the most important product assumptions without pretending to build every production requirement from the SRS.

### Prototype requirements directly traced to the SRS

| Prototype capability | Relevant SRS requirement(s) | Prototype interpretation |
|---|---:|---|
| Prominent, accessible request action | FR-14 | Huge red requester button, positioned centrally and usable with one tap. |
| Help category, text/voice description, demo location | FR-15, FR-16 | Choose a category, type a message, or use a simulated voice transcript; use a clearly labelled demo location. |
| Nearby volunteer match | FR-17, FR-22 | A local server broadcasts the request to connected volunteer screens. “Distance” is simulated. |
| First volunteer wins | FR-23, FR-24 | The first accepted request is atomically locked on the server; other volunteer screens update immediately. |
| Shared active-session status | FR-18, FR-25, FR-26 | Requester and volunteer see a live session screen, proximity visual and short chat/quick messages. |
| Dual confirmation | FR-29 to FR-35 | Volunteer marks complete; requester must confirm before a reward is awarded. |
| Reward economy | FR-36 to FR-42 | Award one star after valid confirmation; reward page creates one QR coupon. |
| Partner redemption | FR-40, FR-41, FR-46 | A partner page simulates validating and marking a coupon as redeemed. |
| Accessibility | FR-56 to FR-60 | Large controls, high contrast, visible focus states, screen-reader labels, keyboard support and reduced motion. |

### Explicitly deferred to future / production scope

- Real disability verification documents and admin review
- OTP, SSO, identity checks, user profiles, and account deletion
- Real GPS, background tracking, map provider integrations, and actual push notifications
- Payment/POS integrations, real partner onboarding, analytics, and reports
- Real SOS contact delivery and emergency escalation
- Fraud detection, GDPR workflows, three-language release, performance/scalability guarantees

Never build fake “real” versions of the deferred features. Clearly label any simulated element as a demo simulation when it could otherwise be misunderstood.

---

## 2. Product concept and demo scenario

### Demo personas

- **Requester:** Rajaa — a person with visual impairment who needs a quick, situation-specific human assist.
- **Volunteer:** Noor — a nearby student volunteer who can accept a short request.
- **Partner:** Local Café — a sample business that offers a reward for earned stars.

### Default request used in the main demo

- Help category: **Read text**
- Request description: **“Can someone help me read the platform sign?”**
- Location label: **Demo Zone A — Main Hall**
- Simulated distance: **260 m away**
- Estimated arrival: **2 minutes**

### 90-second demo choreography

1. Open `/requester` on the iPhone before presenting.
2. Tap the huge **I need help** button.
3. Choose **Read text** and use a prepared text/voice message.
4. Volunteer screen at `/volunteer` receives an animated live request.
5. Tap **Accept request** on the volunteer device.
6. Requester screen immediately shows **Noor is on the way**.
7. Use the short chat/quick reply once, if desired.
8. Volunteer taps **Assistance completed**.
9. Requester taps **Yes, I received help**.
10. Volunteer screen shows one star earned, then opens `/rewards` and redeems a sample offer.
11. Display QR coupon; `/partner` validates it with one tap.
12. Use `/director` to reset for a second demonstration.

---

## 3. Technical architecture

### Required stack

- **Next.js** with App Router
- **TypeScript** in strict mode
- **Tailwind CSS** plus centralized CSS variables/design tokens
- **Socket.IO** and `socket.io-client` for local real-time communication
- **Framer Motion** for purposeful, accessible animation
- **Lucide React** for iconography
- **React QR Code** or an equivalent local QR library
- **Ubuntu** font by Dalton Maag, loaded through `next/font/google` where possible
- **No database**
- **No external APIs**
- **No environment secrets**

### Required local-server approach

Use a small custom Node server that serves Next.js and Socket.IO together. It must bind to `0.0.0.0` so the demo can be opened from iPhones on the same Wi-Fi or local hotspot.

The server holds the entire demo state in memory. This state should reset safely from the Director Console. A server restart may also reset it.

```text
Requester iPhone ─┐
                  ├── local Wi-Fi / hotspot ── Next.js + Socket.IO demo server ── in-memory demo state
Volunteer device ─┤
Partner device ───┤
Director laptop ──┘
```

### Why this architecture is correct for the prototype

- It demonstrates a real cross-device system rather than unrelated mocked screens.
- It avoids a database, cloud setup, authentication, cost, and presentation-day network risk.
- It makes reset/repeat testing easy.
- It keeps all interactions controllable in front of the class.

### Real-time event contract

Use typed event names and a single source of truth on the server.

```ts
request:create
request:created
volunteer:accept
volunteer:decline
session:message
session:complete
requester:confirmCompletion
reward:redeem
coupon:redeem
state:sync
demo:reset
```

The server must validate state transitions. A client must never be able to award a star directly.

### Demo state machine

```text
idle
  → request_configuring
  → seeking_volunteer
  → matched
  → active_session
  → awaiting_requester_confirmation
  → confirmed
  → rewarded
  → coupon_created
  → coupon_redeemed
```

Allowed alternate states:

```text
seeking_volunteer → no_volunteer_found → seeking_volunteer
matched → request_cancelled
awaiting_requester_confirmation → disputed
```

Only the following rule awards a star:

```text
volunteer completed AND requester confirmed AND session has not already been rewarded
```

---

## 4. Required routes and screen responsibilities

| Route | Main device | Purpose |
|---|---|---|
| `/` | Any | Beautiful entry screen with role cards and “Demo mode” explanation. |
| `/requester` | iPhone | The accessible assist-device experience. |
| `/volunteer` | iPhone, iPad, laptop | Live volunteer inbox, acceptance, session, and earned-star moment. |
| `/rewards` | Volunteer device | Rewards wallet, sample offer, and QR coupon. |
| `/partner` | Laptop or phone | Partner coupon-validation simulation. |
| `/director` | Presenter laptop only | Reset, force a prepared scenario, inspect state, and recover from demo problems. |

### `/requester` screen states

1. **Ready:** calm but confident screen with one enormous red circular/rounded help button.
2. **Category selection:** simple bottom sheet; four options: Navigation, Read text, Reach shelf, Other.
3. **Description:** text field and a simulated microphone action that produces a sample transcript after a short intentional delay.
4. **Seeking:** radar/proximity visualization, clear status text, cancel option.
5. **Matched:** Noor profile, simulated distance, arrival status, accessible feedback.
6. **Active:** quick chat and status timeline.
7. **Confirm completion:** clear yes/no question, one primary confirmation action.
8. **Completed:** gratitude state; no reward details need to distract requester.

### `/volunteer` screen states

1. **Available:** “You are ready to help” status with quiet ambient visual.
2. **Incoming request:** rich request card, countdown, distance, category, description, accept/decline.
3. **Accepted:** active session timeline, requester context, quick message buttons.
4. **Complete:** require deliberate completion tap.
5. **Awaiting requester confirmation:** not yet rewarded.
6. **Star earned:** joyful but restrained, visible “+1 star” response.

### `/rewards` screen states

- Star balance
- Progress toward a reward
- One or two premium-looking partner offer cards
- Confirm redemption
- Generate a unique-looking demo QR coupon
- Show coupon expiry and redemption status

### `/partner` screen states

- Clean partner validation view
- Simulated scan area / coupon identifier
- “Validate coupon” action
- Green success state with redemption timestamp
- Reject second redemption of the same coupon

### `/director` requirements

This is the presentation safety net. It must include:

- Reset entire demo
- Set requester state to ready
- Create prepared request
- Force volunteer acceptance
- Force completion waiting state
- Force confirmation/rewarded state
- Display current state as readable JSON or labelled status cards
- Show local connection status

It should look professional but be clearly identified as **Presenter controls** and never appear in the core user demo.

---

## 5. Design direction: “Civic urgency, not generic fintech”

### Emotional direction

The visual system should feel like a premium, compassionate public-service product:

- Calm before the action
- Absolute clarity during the request
- Human warmth after a volunteer accepts
- Pride and trust around rewards

It must not look childish, medical, generic dashboard-like, or like a social-media app.

### Typography

- Primary font: **Ubuntu**
- Use a strong display weight for major status messages.
- Keep line length short and message hierarchy obvious.
- Never use tiny, low-contrast helper text.
- Use sentence case and human language.

### Color tokens

Use these as starting tokens; modify only centrally if needed.

```css
--hc-canvas: #0A0B0E;
--hc-surface: #12141A;
--hc-surface-raised: #1A1D25;
--hc-text: #F8F7F4;
--hc-text-muted: #B5B8C2;
--hc-help-red: #E5484D;
--hc-help-red-deep: #B92D37;
--hc-success: #35D07F;
--hc-warning: #F6B94D;
--hc-violet: #A990FF;
--hc-border: rgba(255, 255, 255, 0.10);
```

### Visual rules

- The requester help button is the star of the product: extremely large, tactile, high-contrast, and visually unmistakable.
- Use soft, layered shadows, blurred glow, fine borders, and limited glass effects—not overdone gradients.
- Use line icons, not emojis.
- Do not use generic stock photos.
- Use an abstract proximity/radar visualization rather than a real-looking map, because the location is simulated.
- Never rely on red/green alone to communicate state; pair color with text, icon, and motion.
- Make the phone experience feel native: safe-area padding, thumb-friendly placement, touch feedback, no desktop layouts squeezed into mobile.

### Motion rules

- Motion must explain an event: sending, searching, matching, completion, reward.
- Default transitions: approximately 180–300ms.
- No flashing or rapid strobing.
- Respect `prefers-reduced-motion`.
- Do not block interaction behind decorative animation.

---

## 6. Accessibility requirements

Accessibility is a main product feature, not a checklist added at the end.

### Must-have implementation rules

- All touch targets: at least 44×44 CSS pixels; the primary requester button should be much larger.
- Every icon-only control must have an accessible name.
- All critical status changes must be announced using an appropriate live region.
- Use semantic buttons, headings, lists, labels, and form controls.
- Focus must always be visible on keyboard navigation.
- Main requester actions must be reachable with keyboard/switch access equivalents on desktop.
- No essential action can depend on a hover state.
- Support large system text and narrow screens without clipping the primary action.
- Maintain high text/background contrast.
- Reduced-motion mode must preserve all essential feedback with text and static state styling.
- Sound must never be the only way a user learns about an event.

### Accessibility demo moments for presentation

- Show that the requester button is large and isolated.
- Show a clear visible status: “Request sent. Looking for a volunteer.”
- Show that the volunteer identity/status appears in readable text, not only on a map.
- Show the dual-confirmation action with one obvious primary control.
- Mention that the prototype uses semantic labels and screen-reader-ready live status updates.

---

## 7. Suggested file structure

```text
helpchain/
├── PROJECT_MASTER_BRIEF.md
├── README.md
├── PROGRESS.md
├── DECISIONS.md
├── server.mjs
├── package.json
├── public/
│   └── brand/
├── src/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── requester/page.tsx
│   │   ├── volunteer/page.tsx
│   │   ├── rewards/page.tsx
│   │   ├── partner/page.tsx
│   │   ├── director/page.tsx
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── requester/
│   │   ├── volunteer/
│   │   ├── rewards/
│   │   ├── shared/
│   │   └── ui/
│   ├── lib/
│   │   ├── demo-types.ts
│   │   ├── demo-state.ts
│   │   ├── socket.ts
│   │   ├── constants.ts
│   │   └── utils.ts
│   └── hooks/
│       └── use-demo-state.ts
└── tests/ (only after core demo works)
```

No large single-file implementation. Keep request, volunteer, reward, socket, and UI primitives modular.

---

## 8. Required data model (in memory)

```ts
type HelpCategory = "navigation" | "read_text" | "reach_shelf" | "other";

type SessionStatus =
  | "idle"
  | "request_configuring"
  | "seeking_volunteer"
  | "matched"
  | "active_session"
  | "awaiting_requester_confirmation"
  | "confirmed"
  | "rewarded"
  | "coupon_created"
  | "coupon_redeemed"
  | "cancelled";

interface DemoRequester {
  id: "requester-rajaa";
  name: "Rajaa";
  accessibilityNote: "VoiceOver-ready demo";
  locationLabel: "Demo Zone A — Main Hall";
}

interface DemoVolunteer {
  id: "volunteer-noor";
  name: "Noor";
  rating: 4.9;
  starBalance: number;
  distanceMeters: number;
  availability: "available" | "busy";
}

interface HelpRequest {
  id: string;
  category: HelpCategory;
  description: string;
  createdAt: string;
  requesterId: string;
  locationLabel: string;
  status: SessionStatus;
}

interface DemoSession {
  id: string;
  requestId: string;
  volunteerId?: string;
  volunteerCompleted: boolean;
  requesterConfirmed: boolean;
  rewardAwarded: boolean;
  messages: Array<{ id: string; from: "requester" | "volunteer"; text: string; createdAt: string }>;
}

interface DemoCoupon {
  id: string;
  code: string;
  rewardTitle: string;
  starsCost: number;
  createdAt: string;
  expiresAt: string;
  redeemedAt?: string;
}
```

### Default reward

```text
Local Café — 15% off a drink
Cost: 3 stars
Coupon expiry: 30 days (shown as demo data)
```

For the first demo session, allow the Director Console to seed the volunteer with **3 stars** so reward redemption can be shown without repeating three assistance sessions.

---

## 9. Engineering and quality rules

### Code quality

- TypeScript strict; no `any` unless justified in a comment.
- Use named constants for timings, text copy, demo users, and colors.
- Keep state transition logic on the server, not distributed through components.
- Avoid duplicated hard-coded strings.
- Never fabricate an interaction that does not update the shared demo state.
- Make all success, error, pending, and reset states intentional.
- Avoid unnecessary dependencies.
- No external HTTP calls in the core demo path.
- Do not use a database, ORM, authentication provider, or environment secret unless the user explicitly changes scope.

### Testing gates after every phase

Run and report:

```text
npm run lint
npm run build
```

Then manually verify the changed flow in a browser at:

- iPhone/mobile width: 390×844
- iPad/tablet width: 768×1024
- laptop width: 1440×900

Update `PROGRESS.md` with what was completed, what was verified, and known issues.

### Key acceptance tests

| ID | Test | Pass condition |
|---|---|---|
| T-01 | Request creation | One requester tap creates a shared request. |
| T-02 | Device sync | Volunteer sees the request within 2 seconds on the same local network. |
| T-03 | Accept-first | Only one volunteer can accept a request. |
| T-04 | Match feedback | Requester sees Noor’s match state after acceptance. |
| T-05 | Reward integrity | No star is awarded before requester confirmation. |
| T-06 | Single reward | A confirmed session awards exactly one star. |
| T-07 | Redemption | Coupon is created only when the volunteer has enough stars. |
| T-08 | Single redemption | Redeeming a coupon twice is rejected. |
| T-09 | Accessibility | Main flows work with keyboard and visible focus; critical UI has accessible names. |
| T-10 | Reset | Director reset restores a repeatable ready-to-demo state. |

---

## 10. Risks and mitigations

| Risk | Why it matters | Mitigation |
|---|---|---|
| Devices cannot reach local server | The live effect fails | Use one phone hotspot or one known Wi-Fi; test before presentation; show IP/QR in Director Console. |
| Browser blocks sound without a gesture | Audio is unreliable | Treat sound as decorative; text, visuals and haptics are not required for proof. |
| Local state is lost on restart | Demo has to restart | Director Console can seed/recover every important state. |
| Presentation Wi-Fi is unreliable | Live cross-device demo could stall | Carry a hotspot plan and a polished single-device fallback scenario. |
| Overbuilding | Core journey may not work in time | Freeze the scope: requester → volunteer → dual confirm → star → QR. |
| Fake GPS looks misleading | Judges may question authenticity | Use abstract proximity visual and clear “Demo Zone / simulated distance” language. |
| Attractive UI hides unclear interaction | Accessibility suffers | Test every state for clear copy and one obvious next action. |

---

## 11. Phase plan

### Phase 0 — Project foundation and guardrails

**Goal:** Create a stable scaffold and the shared design/engineering rules.

**Tasks:**

- Initialize the Next.js TypeScript project.
- Configure Tailwind, Ubuntu, basic global styles and design tokens.
- Add `server.mjs` with Socket.IO and a typed in-memory demo state.
- Add the six required routes as minimal placeholders.
- Add `README.md`, `PROGRESS.md`, and `DECISIONS.md`.
- Ensure the server can bind to `0.0.0.0` and run locally.

**Done when:**

- App runs without errors.
- `/requester`, `/volunteer`, `/rewards`, `/partner`, and `/director` render.
- Two browser windows can connect to the socket server.
- Lint and production build pass.

---

### Phase 1 — Visual system and requester experience

**Goal:** Make the requester iPhone experience immediately impressive and accessible.

**Tasks:**

- Build a premium requester shell with safe-area support.
- Implement the giant red primary button.
- Add category selection and text entry.
- Add simulated voice-input flow using a prepared transcript.
- Implement request creation and seeking state.
- Add accessible live status messages and reduced-motion support.

**Done when:**

- On mobile width, the requester can complete the start of the flow in under 15 seconds.
- The request has a category, description, and demo location.
- The requester page looks polished before the volunteer page is even opened.

---

### Phase 2 — Live volunteer match

**Goal:** Prove the cross-device concept.

**Tasks:**

- Implement volunteer availability/home screen.
- Implement a real Socket.IO broadcast from requester to volunteer.
- Build the incoming-request experience with a countdown and accept/decline actions.
- Atomically lock the session when the first volunteer accepts.
- Synchronize match feedback on requester and volunteer screens.
- Add simulated proximity/arrival visual—not a fake real map.

**Done when:**

- Two different devices on local Wi-Fi demonstrate the full request → accept transition.
- Refreshing an individual client reconnects and receives current state.
- The request cannot be accepted twice.

---

### Phase 3 — Active session and dual confirmation

**Goal:** Demonstrate trust, safety, and reward integrity.

**Tasks:**

- Implement active-session timeline.
- Add short real-time chat or quick-message actions.
- Add volunteer completion action.
- Add requester confirmation action.
- Prevent reward until dual confirmation is complete.
- Include an alternate “report an issue” non-destructive visual state.

**Done when:**

- The completion flow is understandable without explanation.
- A star is never awarded from only one user action.

---

### Phase 4 — Star economy, reward wallet, and QR redemption

**Goal:** Complete the business value loop.

**Tasks:**

- Show animated but respectful `+1 star` reward moment.
- Implement star balance and a seeded demo balance via Director Console.
- Build reward catalogue and redemption confirmation.
- Generate a QR coupon with a unique-looking coupon ID.
- Implement partner validation and single redemption.

**Done when:**

- Judges can see the direct link between volunteering, reward, and partner benefit.
- Coupon has a meaningful state before and after redemption.

---

### Phase 5 — Director Console, resilience, and demo fallback

**Goal:** Make the presentation safe and repeatable.

**Tasks:**

- Build the Director Console described above.
- Add simple connection indicators.
- Add prebuilt scenario controls.
- Add reset confirmation.
- Create a “single-device showcase mode” fallback that can advance the full flow if local networking fails.

**Done when:**

- The demo can be reset in under 5 seconds.
- The core story can still be demonstrated without network access.

---

### Phase 6 — Accessibility polish and jaw-dropping visual refinement

**Goal:** Improve taste, clarity and confidence without changing the product scope.

**Tasks:**

- Audit every screen at mobile/tablet/desktop breakpoints.
- Improve typography, spacing, depth, haptics-like visual feedback, loading states, focus states and transitions.
- Remove visual clutter.
- Test reduced motion and keyboard use.
- Add a refined product landing page and cohesive microcopy.

**Done when:**

- The app feels designed, not generated.
- The next action is obvious on every screen.
- The visual hierarchy remains clean on an iPhone.

---

### Phase 7 — Verification package and presentation readiness

**Goal:** Produce evidence that this is an engineering prototype, not merely a UI demo.

**Tasks:**

- Create `docs/TEST_REPORT.md` with the ten acceptance tests and results.
- Create `docs/RISK_REGISTER.md` from the risk table above.
- Create a simple block diagram of requester device, local server, volunteer device and partner device.
- Capture presentation-quality screenshots.
- Write a 90-second live-demo checklist and recovery plan.
- Rehearse the live flow three times on the actual presentation devices.

**Done when:**

- You can explain exactly what was validated.
- You can handle a failed Wi-Fi demo without panic.

---

## 12. Agent operating protocol

Every coding agent must follow this protocol.

1. Read `PROJECT_MASTER_BRIEF.md`, `PROGRESS.md`, and `DECISIONS.md` first.
2. Work on **one named phase or subtask only**. Do not silently expand scope.
3. Before editing, state the smallest viable implementation plan and the exact files likely to change.
4. Preserve the agreed stack and architecture.
5. After editing, run the required quality gates.
6. Use the browser/device preview to verify the actual visual outcome. Do not claim UI quality from code alone.
7. Update `PROGRESS.md` and `DECISIONS.md` with concise, factual notes.
8. Report remaining issues honestly.
9. Never rewrite working sections merely because another implementation style seems preferable.
10. Do not use multi-agent parallel edits on the same files. Use one implementing agent and separate reviewers/testers who do not modify the same area simultaneously.

### Preferred agent roles

| Role | Scope |
|---|---|
| Lead implementer | Owns the current phase and writes the production prototype code. |
| Visual reviewer | Reviews screenshots, spacing, layout, typography, and mobile polish; returns a focused change list. |
| Accessibility reviewer | Checks semantics, contrast, focus, touch targets, and reduced motion; returns a focused change list. |
| QA/realtime reviewer | Tests cross-device state, edge cases, resets and event integrity. |

Keep the lead implementer authoritative. Parallelize review, not competing implementation.

---

## 13. Definition of done for the entire prototype

The prototype is complete only when all statements below are true:

- A requester can use an iPhone-sized screen to initiate a help request through one huge, accessible primary action.
- Another device receives the exact same live request through the local server.
- A volunteer can accept the request, and the requester receives live match feedback.
- The session moves through completion and requester confirmation.
- One and only one star is awarded after dual confirmation.
- A reward can be redeemed into a QR coupon and marked redeemed by a partner screen.
- The demonstration resets instantly and can be performed again.
- The UI is fully responsive, cohesive, high-contrast, keyboard aware and screen-reader conscious.
- No core demo step depends on an external service, production data, or an internet connection.
- Lint, build and manual multi-device acceptance tests pass.

---

## 14. Things agents must not do

- Do not build a database.
- Do not add authentication or real user registration.
- Do not integrate real maps, real GPS tracking, real push services, real emergency services, payments, or POS.
- Do not use generic dashboards as the main requester experience.
- Do not add emojis to the UI.
- Do not use a visual style that resembles a medical alarm system or a children’s game.
- Do not overuse giant gradients, glass effects, confetti, or animation.
- Do not use inaccessible icon-only controls without labels.
- Do not change the master architecture without recording a decision and obtaining explicit user approval.
- Do not claim functionality is verified unless it was actually run and observed.

---

## 15. Next working instruction

Start with **Phase 0 only**. Do not begin Phase 1 until Phase 0 passes lint, build, local server verification, and the required documentation files exist.
