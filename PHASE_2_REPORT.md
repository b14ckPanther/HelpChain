# Helpchain — Phase 2 Report

## What Was Completed

Phase 2: Live Volunteer Match is **complete**.

### 1. Hybrid Server Architecture
- Created a root-level custom `server.mjs` incorporating a Node native HTTP server running Next.js App Router requests alongside a `Socket.IO` websocket server instance on the same port.
- Connected a LAN IPv4 auto-detection script (`server/network-info.mjs`) that resolves OS level interfaces and logs dynamic access links on boot to make hotspot and iPhone demo setups plug-and-play.
- Set up scripts in `package.json` to handle starting `npm run dev` and `npm run start` targeting the unified server.

### 2. In-Memory Store & First-Accept Matching
- Constructed `server/demo-store.mjs` owning safe transactional states.
- Implemented first-accept-wins logic: when multiple volunteers accept a request, the server allocates it to the first responder, rejecting secondary attempts and showing them a clean "Another volunteer accepted this request" screen.
- Supports automatic recovery of pending or matched session parameters on client browser refreshes.

### 3. User-Visible Requester Route Changes
- Integrated `Connected to local Helpchain demo` / `Waiting for local demo server` header status indicators.
- Enabled disabled states for final help requests if the server is offline.
- Introduced real Socket.IO event emissions when finalizing requests or cancelling them.
- Rendered `/requester` matched views displaying the assigned volunteer profile card, rating metadata, and location details once accepted.

### 4. Companion Volunteer Dashboard Route
- Created the `/volunteer` companion route. On desktop, this is rendered inside the generic `DemoFrame` wrapper, and on mobile, it transitions to a native full-bleed display.
- **Offline state:** Noor profile panel with availability trigger action.
- **Available state:** Continuous green ping indicating listening standby status.
- **Incoming takeover state:** Prominent, styled details card listing request parameters, simulated proximity markers, and Accept/Decline action buttons.
- **Matched state:** Clear connected banner guiding the volunteer to the location details of the requester.
- **Lost race state:** If another volunteer accepts first, a spinner informs Noor, and automatically goes back to the availability standby queue after 2.5 seconds.

### 5. Client Real-time Layer
- Assembled connection factory `src/lib/realtime/socket.ts` and React hook `src/lib/realtime/use-demo-realtime.ts`.
- Handles connection, reconnect, disconnection status logs, and cleans up socket subscriptions.
- Emits protocol payloads using named typescript events to avoid duplicate string values.

### 6. Accessibility Work
- Integrated full keyboard controls across all views.
- Escaped all HTML layout strings to satisfy ESLint.
- Maintained responsive flex layout systems suitable for standard viewport sizes (390×844 to 1440×900).

---

## Socket Event Contract

| Event | Direction | Payload | Description |
|---|---|---|---|
| `demo:join` | Client → Server | `{ role: string, displayName?: string }` | Registers client role on the socket connection. |
| `demo:state:request` | Client → Server | - | Forces immediate state snapshot return callback. |
| `volunteer:availability:set` | Client → Server | `{ available: boolean, displayName?: string }` | Updates standby flag for connection socket. |
| `help:request:create` | Client → Server | `{ category: string, description: string, locationLabel: string }` | Dispatches assistance request to all active volunteers. |
| `help:request:accept` | Client → Server | `{ requestId: string }` | Attempts to lock request matching. |
| `help:request:decline` | Client → Server | `{ requestId: string }` | Instructs server to filter request details for this socket. |
| `help:request:cancel` | Client → Server | `{ requestId: string }` | Deletes active request from memory. |
| `demo:state` | Server → Client | `{ activeRequest: object, availableVolunteersCount: number }` | Pushes serialized snapshot customized for the receiver socket. |
| `demo:error` | Server → Client | `{ message: string }` | Notifies receiver socket of server-side failure. |
| `help:request:incoming` | Server → Client | `{ id, category, description, locationLabel }` | Alerts available volunteers. |
| `help:request:accepted` | Server → Client | `{ requestId, volunteer }` | Alerts matched peers. |

---

## Local Network Run Instructions

To test on your local network (e.g. desktop + iPhone):

1. Connect both devices to the **same Wi-Fi network**.
2. Run the build step to compile everything:
   ```bash
   npm run build
   ```
3. Start the custom server in dev/prod mode (default port 3000):
   ```bash
   npm run dev
   # or PORT=3003 npm run dev if port 3000 is occupied
   ```
4. Look at the startup terminal logs. You will see lines like:
   ```
   Network Access (for iPhone / Wi-Fi devices):
     http://192.168.2.180:3000
   ```
5. Open the network link on your iPhone browser:
   `http://192.168.2.180:3000/requester`
6. Open the link on your desktop browser:
   `http://localhost:3000/volunteer`
7. Click **Go available** on `/volunteer`.
8. Create a request on `/requester` and click **Send help request**.
9. Accept the incoming card on `/volunteer` to verify real-time state sync.

---

## Test/Lint/Build Result Summary

| Gate | Status | Details |
|---|---|---|
| `npm run lint` | PASS | 0 errors, 0 warnings. All HTML layout quotes escaped. |
| `npm run build` | PASS | Clean Turbopack compilation. Static routing files resolved. |
| Project Master Brief | PASS | `PROJECT_MASTER_BRIEF.md` remains unmodified. |

---

## Known Limitations
- State is stored purely in Node heap memory; it resets upon server process restart.
- No real GPS triggers or push alert services are integrated.

---

## Recommended Phase 3 Starting Point
Proceed directly to **Phase 3: Active Session and Dual Confirmation**:
1. Design the visual timer countdown indicators on both screens.
2. Implement local state sync for session timers (requester and volunteer must view matching timers).
3. Build the double-confirmation UI trigger once a volunteer arrives at the location.
