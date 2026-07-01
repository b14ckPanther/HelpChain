/**
 * RecentRedemptions
 * Lists validated coupon codes and timestamps processed during the active session.
 */

"use client";

import { CheckSquare } from "lucide-react";
import { Surface } from "@/components/ui";
import { PARTNER_COPY } from "./partner-copy";
import type { RecentRedemptionItem } from "./partner-types";

interface RecentRedemptionsProps {
  redemptions: RecentRedemptionItem[];
}

export function RecentRedemptions({ redemptions }: RecentRedemptionsProps) {
  const copy = PARTNER_COPY.recent;

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="w-full flex flex-col gap-2.5 text-left">
      <h3 className="text-[10px] uppercase tracking-wider text-[var(--hc-text-subtle)] font-bold px-1">
        {copy.title} ({redemptions.length})
      </h3>

      {redemptions.length === 0 ? (
        <Surface elevation="base" padding="sm" className="border-dashed border-[var(--hc-border)] text-center">
          <p className="text-[10px] text-[var(--hc-text-subtle)]">
            {copy.empty}
          </p>
        </Surface>
      ) : (
        <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto pr-1">
          {redemptions.map((item) => (
            <Surface
              key={item.id}
              elevation="base"
              padding="sm"
              className="flex items-center justify-between gap-3 border border-[var(--hc-border-subtle)] bg-[var(--hc-surface)]"
            >
              <div className="flex items-center gap-2 min-w-0">
                <CheckSquare size={13} className="text-[var(--hc-success)] shrink-0" />
                <div className="min-w-0">
                  <span className="text-[var(--hc-text-xs)] font-mono font-bold text-white block">
                    {item.couponCode}
                  </span>
                  <span className="text-[9px] text-[var(--hc-text-subtle)] truncate block mt-0.5 max-w-[200px]">
                    {item.rewardTitle}
                  </span>
                </div>
              </div>

              <span className="text-[10px] font-mono text-[var(--hc-text-subtle)] font-medium shrink-0">
                {formatDate(item.redeemedAt)}
              </span>
            </Surface>
          ))}
        </div>
      )}
    </div>
  );
}
