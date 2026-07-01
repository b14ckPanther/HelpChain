/**
 * /rewards route
 * Displays the volunteer's reward wallet and catalog.
 */

import type { Metadata } from "next";
import { AppShell, DemoFrame } from "@/components/ui";
import { RewardsExperience } from "@/components/rewards";

export const metadata: Metadata = {
  title: "Helpchain Volunteer — Rewards Wallet",
  description: "View earned stars, browse partner benefits, and redeem coupons.",
};

export default function RewardsPage() {
  return (
    <AppShell className="items-center justify-center bg-[var(--hc-canvas)]">
      <DemoFrame label="Volunteer device">
        <div className="flex flex-col min-h-[100dvh] sm:min-h-[844px]">
          <RewardsExperience />
        </div>
      </DemoFrame>
    </AppShell>
  );
}
