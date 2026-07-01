"use client";

import {
  Smartphone,
  Users,
  UserCheck,
  Store,
  Activity,
  Star,
  Ticket,
} from "lucide-react";
import { Surface, SectionLabel } from "@/components/ui";
import { DIRECTOR_COPY } from "./director-copy";
import type { DirectorDemoHealth } from "./director-types";

interface DemoHealthOverviewProps {
  health: DirectorDemoHealth;
}

const CARDS = [
  { key: "requesterDevicesConnected", label: DIRECTOR_COPY.healthLabels.requesters, icon: Smartphone },
  { key: "volunteersConnected", label: DIRECTOR_COPY.healthLabels.volunteers, icon: Users },
  { key: "volunteersAvailable", label: DIRECTOR_COPY.healthLabels.available, icon: UserCheck },
  { key: "partnerStationsConnected", label: DIRECTOR_COPY.healthLabels.partners, icon: Store },
  { key: "activeSessionState", label: DIRECTOR_COPY.healthLabels.session, icon: Activity, isStatus: true },
  { key: "noorStarBalance", label: DIRECTOR_COPY.healthLabels.stars, icon: Star, isStar: true },
  { key: "activeCouponCount", label: DIRECTOR_COPY.healthLabels.coupons, icon: Ticket },
] as const;

export function DemoHealthOverview({ health }: DemoHealthOverviewProps) {
  return (
    <Surface elevation="raised" padding="lg" as="section" aria-labelledby="director-health-heading">
      <SectionLabel as="h2" id="director-health-heading" size="sm" className="mb-[var(--hc-space-4)]">
        {DIRECTOR_COPY.sections.health}
      </SectionLabel>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-[var(--hc-space-3)]">
        {CARDS.map((card) => {
          const Icon = card.icon;
          const rawValue = health[card.key as keyof DirectorDemoHealth];
          const displayValue =
            "isStatus" in card && card.isStatus
              ? DIRECTOR_COPY.statusLabels[rawValue as keyof typeof DIRECTOR_COPY.statusLabels] ||
                String(rawValue)
              : String(rawValue);

          return (
            <div
              key={card.key}
              className="flex flex-col gap-[var(--hc-space-2)] rounded-[var(--hc-radius-md)] border border-[var(--hc-border-subtle)] bg-[var(--hc-surface)] p-[var(--hc-space-4)] min-h-[88px]"
            >
              <div className="flex items-center gap-[var(--hc-space-2)] text-[var(--hc-text-subtle)]">
                <Icon
                  size={16}
                  strokeWidth={1.75}
                  aria-hidden="true"
                  className={"isStar" in card && card.isStar ? "text-[var(--hc-reward-gold)]" : "text-[var(--hc-violet)]"}
                />
                <span className="text-[var(--hc-text-xs)] font-medium leading-tight">{card.label}</span>
              </div>
              <span
                className={[
                  "text-[var(--hc-text-xl)] font-bold tabular-nums",
                  "isStar" in card && card.isStar ? "text-[var(--hc-reward-gold)]" : "text-[var(--hc-text)]",
                ].join(" ")}
              >
                {displayValue}
              </span>
            </div>
          );
        })}
      </div>
    </Surface>
  );
}
