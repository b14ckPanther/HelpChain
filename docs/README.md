# Helpchain — Verification & Presentation Package

## Problem (one sentence)

People who need immediate, situational human assistance often cannot navigate complex apps quickly enough to get help when it matters.

## Prototype (one sentence)

Helpchain is an interactive local-network engineering prototype that turns connected browsers into an accessible request device, volunteer companion, reward wallet, and partner validation terminal synchronized through a shared demo server.

## Live demo routes

| Route | Role |
|---|---|
| `/` | Local demo introduction |
| `/requester` | Accessible assist device (Rajaa) |
| `/volunteer` | Volunteer companion (Noor) |
| `/rewards` | Star wallet and coupon issuance |
| `/partner` | Haven Café validation terminal |
| `/director` | Presenter control room (not linked publicly) |

## Start the local server

```bash
npm run build
npm run dev
```

Default port: **3000** (override with `PORT=3003 npm run dev` if needed).

The terminal prints **Local Access** and **Network Access** URLs for LAN demos.

## LAN demo setup (summary)

1. Connect Mac and phones to the **same Wi-Fi** or phone hotspot.
2. Start the custom server (`npm run dev`).
3. Note the **Network Access** URL from terminal output (e.g. `http://192.168.x.x:3000`).
4. Open on iPhone: `http://<lan-ip>:3000/requester`
5. Open on other devices: volunteer, rewards, partner, director routes on the same host.

See `DEMO_RUNBOOK.md` and `DEVICE_REHEARSAL_CHECKLIST.md` for full presentation guidance.

## Documentation index

| File | Purpose |
|---|---|
| [PROTOTYPE_SCOPE.md](./PROTOTYPE_SCOPE.md) | MVP boundaries — implemented, simulated, out of scope |
| [ARCHITECTURE_AND_BLOCK_DIAGRAM.md](./ARCHITECTURE_AND_BLOCK_DIAGRAM.md) | Engineering architecture and data flow |
| [REQUIREMENTS_TRACEABILITY.md](./REQUIREMENTS_TRACEABILITY.md) | SRS-to-prototype traceability matrix |
| [TEST_REPORT.md](./TEST_REPORT.md) | Ten acceptance tests with evidence |
| [RISK_REGISTER.md](./RISK_REGISTER.md) | Presentation risk register |
| [FMEA.md](./FMEA.md) | Lightweight prototype FMEA |
| [DEMO_RUNBOOK.md](./DEMO_RUNBOOK.md) | 90-second live demo script |
| [DEVICE_REHEARSAL_CHECKLIST.md](./DEVICE_REHEARSAL_CHECKLIST.md) | Physical rehearsal checklist |
| [RECOVERY_PLAYBOOK.md](./RECOVERY_PLAYBOOK.md) | Live problem recovery actions |
| [SCREENSHOT_INDEX.md](./SCREENSHOT_INDEX.md) | Screenshot evidence index |
| [SCREENSHOT_CAPTURE_GUIDE.md](./SCREENSHOT_CAPTURE_GUIDE.md) | Manual screenshot capture steps |

## Important disclaimer

**This is an interactive engineering prototype.** It uses simulated voice input, simulated location/proximity, simulated partner scanning, and in-memory demo state. It is not a production deployment, emergency service, or real GPS/payment system.
