/**
 * /partner route
 * Merchant validator console terminal for Haven Café.
 */

import type { Metadata } from "next";
import { AppShell } from "@/components/ui";
import { PartnerExperience } from "@/components/partner";

export const metadata: Metadata = {
  title: "Helpchain Partner Portal — Validate Coupon",
  description: "Redeem and validate Helpchain volunteer QR coupons in real time.",
};

export default function PartnerPage() {
  return (
    <AppShell className="items-center justify-center bg-[var(--hc-canvas)]">
      <div className="w-full max-w-md min-h-[100dvh] sm:min-h-[844px] flex flex-col border border-[var(--hc-border)] sm:rounded-[var(--hc-radius-xl)] shadow-[var(--hc-shadow-lg)] overflow-hidden bg-[var(--hc-surface)]">
        <PartnerExperience />
      </div>
    </AppShell>
  );
}
