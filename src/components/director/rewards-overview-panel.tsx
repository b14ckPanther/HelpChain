"use client";

import { Star, Ticket, History, Clock } from "lucide-react";
import { Surface, SectionLabel } from "@/components/ui";
import { DIRECTOR_COPY } from "./director-copy";
import type { DirectorRewardSummary } from "./director-types";

interface RewardsOverviewPanelProps {
  rewards: DirectorRewardSummary;
}

export function RewardsOverviewPanel({ rewards }: RewardsOverviewPanelProps) {
  return (
    <Surface elevation="raised" padding="lg" as="section" aria-labelledby="director-rewards-heading">
      <SectionLabel as="h2" id="director-rewards-heading" size="sm" className="mb-[var(--hc-space-4)]">
        {DIRECTOR_COPY.sections.rewards}
      </SectionLabel>

      <div className="grid grid-cols-2 gap-[var(--hc-space-3)] mb-[var(--hc-space-4)]">
        <RewardStat
          icon={Star}
          label={DIRECTOR_COPY.rewards.balance}
          value={`${rewards.noorStarBalance}`}
          accent
        />
        <RewardStat icon={Ticket} label={DIRECTOR_COPY.rewards.active} value={`${rewards.activeCouponsCount}`} />
        <RewardStat icon={History} label={DIRECTOR_COPY.rewards.redeemed} value={`${rewards.redeemedCouponsCount}`} />
        <RewardStat icon={Clock} label={DIRECTOR_COPY.rewards.expired} value={`${rewards.expiredCouponsCount}`} />
      </div>

      <div className="rounded-[var(--hc-radius-md)] border border-[var(--hc-border-subtle)] bg-[var(--hc-surface)] p-[var(--hc-space-4)]">
        <p className="text-[var(--hc-text-xs)] text-[var(--hc-text-subtle)] font-medium mb-1">
          {DIRECTOR_COPY.rewards.recent}
        </p>
        {rewards.mostRecentCoupon ? (
          <p className="text-[var(--hc-text-sm)] text-[var(--hc-text)]">
            <span className="font-semibold">{rewards.mostRecentCoupon.code}</span>
            <span className="text-[var(--hc-text-muted)]">
              {" "}
              · {rewards.mostRecentCoupon.partnerName} · {rewards.mostRecentCoupon.status}
            </span>
          </p>
        ) : (
          <p className="text-[var(--hc-text-sm)] text-[var(--hc-text-muted)]">{DIRECTOR_COPY.rewards.none}</p>
        )}
      </div>
    </Surface>
  );
}

function RewardStat({
  icon: Icon,
  label,
  value,
  accent = false,
}: {
  icon: typeof Star;
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex flex-col gap-[var(--hc-space-2)] rounded-[var(--hc-radius-md)] border border-[var(--hc-border-subtle)] bg-[var(--hc-surface)] p-[var(--hc-space-4)]">
      <div className="flex items-center gap-[var(--hc-space-2)] text-[var(--hc-text-subtle)]">
        <Icon
          size={16}
          strokeWidth={1.75}
          aria-hidden="true"
          className={accent ? "text-[var(--hc-warning)]" : "text-[var(--hc-violet)]"}
        />
        <span className="text-[var(--hc-text-xs)] font-medium">{label}</span>
      </div>
      <span
        className={[
          "text-[var(--hc-text-xl)] font-bold tabular-nums",
          accent ? "text-[var(--hc-warning)]" : "text-[var(--hc-text)]",
        ].join(" ")}
      >
        {value}
      </span>
    </div>
  );
}
