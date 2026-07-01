# Helpchain — Recovery Playbook

Quick actions for live presentation problems. All scenarios use **implemented** director controls only.

| Problem | Immediate presenter action | Backup route / scenario | Verification |
|---|---|---|---|
| Requester page disconnected | Check same Wi-Fi; confirm server terminal running; refresh `/requester` | Narrate from laptop browser at mobile width | Green connected pill returns |
| Volunteer does not receive request | Confirm **Go available**; same host URL as requester | Refresh `/volunteer`; director shows volunteer available count | Incoming card appears |
| Local URL not opening on iPhone | Re-copy **Network Access** URL from terminal; avoid `localhost` on phone | Use hotspot; open requester on Mac as narrative backup | iPhone loads `/requester` |
| Wrong state currently visible | Open `/director` — read event timeline | **baseline** reset with confirmation | All tabs show idle/baseline |
| Coupon already redeemed | Explain one-time redemption | Director **coupon_ready** for fresh coupon | Partner simulate scan succeeds once |
| Partner page shows no active coupon | Ensure coupon issued on `/rewards` first | Director **coupon_ready** | Simulate scan enabled |
| Accidental director reset | Acknowledge briefly; continue | **help_session_ready** or full live flow from start | Matched session or clean baseline |
| Browser refresh loses display | Wait for reconnect pill; tab will rejoin | Refresh once; avoid multiple refreshes | State matches other devices |
| Server crashes / restarts | Restart `npm run dev`; reopen all routes | Director **baseline** after reconnect | 4 stars, no session |
| Wi-Fi fails entirely | Switch to phone hotspot; restart server | Shortened path: **rewards_ready** → redeem → **coupon_ready** partner step | Core loop still explainable |
| Time running short | Skip ratings; skip landing intro | **help_session_ready** → confirm → **rewards_ready** → **coupon_ready** | Hit star + coupon + redeem only |

---

## Recovery types

### Normal recovery
Refresh tab, toggle volunteer availability, verify network URL — no director mutation.

### Shortened demo route (~45s)
1. Director **help_session_ready**
2. Complete confirm on requester (if not already completed in scenario)
3. Director **rewards_ready** → redeem on `/rewards`
4. Director **coupon_ready** → partner scan

### Full restart procedure
1. Restart `npm run dev` (only if crashed)
2. Open all routes fresh
3. Director **baseline** reset
4. Begin runbook from 0:10

---

## Director scenario quick reference

| Scenario | Use when |
|---|---|
| **baseline** | Clean slate; after accidental reset; end of demo |
| **help_session_ready** | Need matched session without live request creation |
| **rewards_ready** | Need 5 stars, no coupon, skip full session |
| **coupon_ready** | Need partner redemption immediately |

Every scenario requires confirmation. Reset is destructive — red button at bottom only.
