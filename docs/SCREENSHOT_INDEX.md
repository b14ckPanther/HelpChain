# Helpchain — Screenshot Evidence Index

**Capture status:** NOT CAPTURED — no image files exist in `docs/screenshots/` yet.  
Follow [SCREENSHOT_CAPTURE_GUIDE.md](./SCREENSHOT_CAPTURE_GUIDE.md) to produce evidence manually.

| # | Filename | Route | Required state | What it proves | Status |
|---|---|---|---|---|---|
| 01 | `01-landing-page.png` | `/` | Default load | Polished demo intro; role entry points | NOT CAPTURED |
| 02 | `02-requester-ready.png` | `/requester` | Connected, ready | Accessible help button; demo location | NOT CAPTURED |
| 03 | `03-requester-seeking.png` | `/requester` | After submit | Seeking/radar; simulated proximity label | NOT CAPTURED |
| 04 | `04-volunteer-incoming.png` | `/volunteer` | Pending request | Live incoming request; accept hierarchy | NOT CAPTURED |
| 05 | `05-session-in-progress.png` | `/requester` or `/volunteer` | in_progress | Synchronized session timeline | NOT CAPTURED |
| 06 | `06-star-awarded.png` | `/volunteer` | After confirm | Exactly one star earned (5 total) | NOT CAPTURED |
| 07 | `07-rewards-unlocked.png` | `/rewards` | 5 stars | Haven Café unlocked catalogue | NOT CAPTURED |
| 08 | `08-coupon-qr.png` | `/rewards` | Coupon sheet open | QR + readable alphanumeric fallback | NOT CAPTURED |
| 09 | `09-partner-redemption.png` | `/partner` | After successful scan | Partner validation success | NOT CAPTURED |
| 10 | `10-director-console.png` | `/director` | Mid-demo monitoring | Presenter control room; event timeline | NOT CAPTURED |

## Standards

- Desktop: 1440×900 where appropriate
- Requester: 390×844 iPhone viewport
- No browser chrome or devtools visible
- No raw socket IDs, QR payloads, or filesystem paths in frame

## Folder

Place captured files in: `docs/screenshots/`

After capture, update **Status** column to `CAPTURED` and add capture date in commit notes or report appendix.
