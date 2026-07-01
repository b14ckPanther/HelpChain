# Helpchain — Lightweight FMEA (Prototype)

**Not a production safety certification.** Severity, Occurrence, and Detection use a 1–5 scale. **RPN = S × O × D**.

| Failure Mode | Effect | S | O | D | RPN | Preventive Control | Demo Recovery Action |
|---|---|:---:|:---:|:---:|:---:|---|---|
| Requester cannot send request | Demo stops at start | 5 | 2 | 2 | 20 | Check connected pill; verify server running | Refresh requester; director **baseline**; check Wi-Fi URL |
| Volunteer does not receive request | No match shown | 5 | 2 | 2 | 20 | Confirm volunteer **Go available** | Refresh volunteer; verify same server host |
| Stale match state after reset | Confusing UI | 4 | 2 | 2 | 16 | Use director reset with confirmation | **baseline** reset; refresh all tabs |
| Duplicate star award attempt | Breaks reward integrity story | 5 | 1 | 1 | 5 | Server `starAwardedAt` guard | Narrate server authority; show still 5 stars |
| Duplicate coupon redemption | Partner story fails | 4 | 2 | 1 | 8 | Server rejects second submit | Show rejection message; issue new coupon via **coupon_ready** |
| QR display issue | Coupon hard to show | 3 | 2 | 2 | 12 | Readable alphanumeric fallback always shown | Read code aloud; manual partner entry |
| Partner code entry failure | Redemption not shown | 4 | 2 | 2 | 16 | Use uppercase monospace field; test code copy | Use **Simulate scan** if active coupon exists |
| Director reset misuse | Demo state lost mid-flow | 4 | 2 | 2 | 16 | Confirmation dialog; reset at bottom | **help_session_ready** or **rewards_ready** scenario |
| Browser disconnect | Frozen UI | 4 | 3 | 2 | 24 | Keep connection pills visible | Refresh tab; rejoin via auto socket connect |
| Server crash / restart | All state lost | 5 | 1 | 1 | 5 | Avoid killing terminal | Restart `npm run dev`; director **baseline**; reopen routes |

## Highest RPN items to rehearse

1. **Browser disconnect (24)** — refresh recovery
2. **Requester cannot send / volunteer no request (20 each)** — network + availability checks
