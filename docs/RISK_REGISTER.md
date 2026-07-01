# Helpchain — Risk Register

**Risk score = Probability × Impact** (each 1–5)

| Risk ID | Risk | Category | P | I | Score | Preventive Action | Contingency / Recovery | Owner | Status |
|---|---|---|:---:|:---:|:---:|---|---|---|
| R-01 | Wi-Fi or hotspot failure | Network | 3 | 5 | 15 | Test same network day before; carry phone hotspot | Use director `rewards_ready` + `coupon_ready` shortened path; narrate architecture from laptop | Presenter | Open |
| R-02 | LAN firewall / port blocked | Network | 2 | 4 | 8 | Use known-good Wi-Fi; avoid guest networks with isolation | Switch hotspot; try alternate port `PORT=3003` | Presenter | Open |
| R-03 | iPhone cannot reach local server | Network | 3 | 5 | 15 | Print Network URL from terminal; test `/requester` before class | Open requester on Mac browser at 390px width as backup narration | Presenter | Open |
| R-04 | Socket reconnect or stale state | Technical | 2 | 4 | 8 | Keep tabs open; use director monitoring | Director **baseline** reset; refresh tabs if needed | Presenter | Open |
| R-05 | Browser cache / stale bundle | Technical | 2 | 3 | 6 | Hard refresh before demo; run fresh `npm run dev` | Clear cache or private window | Presenter | Open |
| R-06 | Presenter starts wrong scenario | Process | 3 | 3 | 9 | Open director first; read event timeline | Run **baseline** then intended scenario with confirmation | Presenter | Open |
| R-07 | Accidental reset during demo | Process | 2 | 4 | 8 | Keep reset at bottom; confirm dialog | Re-run **help_session_ready** or full live flow if time | Presenter | Open |
| R-08 | Device battery / connectivity | Hardware | 3 | 4 | 12 | Charge all devices; keep Mac plugged in | Swap to backup phone/laptop with pre-opened routes | Presenter | Open |
| R-09 | Audience confuses simulated vs live | Communication | 4 | 3 | 12 | State “engineering prototype” upfront; point to simulated labels | Refer to `PROTOTYPE_SCOPE.md` talking points | Presenter | Open |
| R-10 | Accessibility issue under projector / iPhone | UX | 2 | 4 | 8 | Rehearse at 390×844 and projector; review ACCESSIBILITY_AUDIT | Increase brightness; use readable code fallback not QR alone | Presenter | Open |
| R-11 | Coupon already redeemed unexpectedly | Demo state | 2 | 3 | 6 | Start from **baseline** or **rewards_ready** | Director **coupon_ready** to issue fresh coupon | Presenter | Open |
| R-12 | Server restart wipes in-memory state | Technical | 2 | 5 | 10 | Do not restart mid-demo; keep terminal visible | Restart server + director **baseline**; reopen all routes | Presenter | Open |

## Score guide

- **1–6:** Low — monitor
- **7–12:** Medium — rehearse mitigation
- **13–25:** High — must rehearse contingency before presentation

## Top three presentation risks

1. **R-01 / R-03** — Network reachability (score 15)
2. **R-12** — In-memory state loss on restart (score 10)
3. **R-09** — Overclaiming simulated features (score 12)
