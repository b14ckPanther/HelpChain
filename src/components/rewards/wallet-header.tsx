/**
 * WalletHeader
 * Renders the top summary banner of the volunteer rewards wallet.
 * Includes star counts, explanatory help notes, and dynamic progress bar towards next unlocks.
 */

"use client";

import { Star, Info } from "lucide-react";
import { Surface } from "@/components/ui";
import { REWARD_COPY } from "./reward-copy";

interface WalletHeaderProps {
  displayName: string;
  initials: string;
  starBalance: number;
  averageRating: number;
}

export function WalletHeader({
  displayName,
  initials,
  starBalance,
  averageRating,
}: WalletHeaderProps) {
  const copy = REWARD_COPY.header;

  // Determine target for next unlock progress
  let nextRewardTarget = 5;
  let nextRewardName = "Haven Café (15% Off)";
  if (starBalance >= 5 && starBalance < 10) {
    nextRewardTarget = 10;
    nextRewardName = "City Books (10% Off)";
  } else if (starBalance >= 10 && starBalance < 15) {
    nextRewardTarget = 15;
    nextRewardName = "Care Pharmacy (12% Off)";
  } else if (starBalance >= 15) {
    nextRewardTarget = 15;
    nextRewardName = "All rewards unlocked!";
  }

  const progressPercent = Math.min(100, Math.floor((starBalance / nextRewardTarget) * 100));

  return (
    <Surface elevation="base" padding="md" className="w-full flex flex-col gap-4 border border-[var(--hc-border-subtle)] text-left">
      <div className="flex items-start justify-between gap-3">
        {/* User Identity Info */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-full bg-[var(--hc-violet-muted)] border border-[var(--hc-violet)] text-[var(--hc-violet)] text-[var(--hc-text-sm)] font-bold" aria-hidden="true">
            {initials}
          </div>
          <div>
            <h2 className="text-[var(--hc-text-base)] font-bold text-[var(--hc-text)]">
              {displayName}
            </h2>
            <div className="flex items-center gap-1.5 text-[var(--hc-text-subtle)] text-[10px] font-medium mt-0.5">
              <span>Rating {averageRating.toFixed(1)}</span>
              <span>•</span>
              <span>Volunteer Account</span>
            </div>
          </div>
        </div>

        {/* Star Badge */}
        <div className="flex items-center gap-1.5 bg-[var(--hc-reward-gold-muted)] border border-[var(--hc-reward-gold)]/25 px-3 py-1.5 rounded-full shrink-0 shadow-[var(--hc-shadow-sm)]">
          <Star size={14} fill="var(--hc-reward-gold)" className="text-[var(--hc-reward-gold)]" aria-hidden="true" />
          <span className="text-[var(--hc-text-xs)] font-bold font-mono text-[var(--hc-text)]">
            {starBalance} {starBalance === 1 ? "Star" : "Stars"}
          </span>
        </div>
      </div>

      {/* Progress Bar towards next reward */}
      {starBalance < 15 ? (
        <div className="w-full flex flex-col gap-1.5 pt-1.5 border-t border-[var(--hc-border-subtle)]">
          <div className="flex justify-between items-center text-[10px] text-[var(--hc-text-subtle)] font-medium">
            <span>Next: {nextRewardName}</span>
            <span className="font-mono">{starBalance} / {nextRewardTarget} stars</span>
          </div>
          
          <div className="h-1.5 w-full bg-[var(--hc-surface-raised)] rounded-full overflow-hidden border border-[var(--hc-border-subtle)]">
            <div
              className="h-full bg-[var(--hc-reward-gold)] transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
              role="progressbar"
              aria-valuenow={starBalance}
              aria-valuemin={0}
              aria-valuemax={nextRewardTarget}
              aria-label={`Progress toward ${nextRewardName}`}
            />
          </div>
        </div>
      ) : (
        <div className="w-full pt-1.5 border-t border-[var(--hc-border-subtle)] text-center">
          <p className="text-[10px] text-[var(--hc-success)] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5">
            <Star size={12} fill="currentColor" strokeWidth={0} aria-hidden="true" />
            All catalog items unlocked
          </p>
        </div>
      )}

      {/* Reassuring Civic Notice */}
      <div className="flex items-start gap-2 bg-[var(--hc-surface-raised)]/30 border border-dashed border-[var(--hc-border)] p-2.5 rounded-[var(--hc-radius-md)] text-[var(--hc-text-subtle)]">
        <Info size={14} className="shrink-0 mt-0.5" />
        <div className="flex flex-col gap-0.5">
          <p className="text-[10px] leading-relaxed font-medium">
            {copy.subtitle}
          </p>
        </div>
      </div>
    </Surface>
  );
}
