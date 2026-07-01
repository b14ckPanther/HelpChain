/**
 * RewardCard
 * Individual reward catalogue item.
 * Clearly articulates locked vs unlocked states with textual descriptions.
 */

"use client";

import { Star, Lock, Unlock } from "lucide-react";
import { Surface, Button } from "@/components/ui";
import type { DemoReward } from "./reward-types";

interface RewardCardProps {
  reward: DemoReward;
  currentStars: number;
  onRedeemPress: (reward: DemoReward) => void;
}

export function RewardCard({ reward, currentStars, onRedeemPress }: RewardCardProps) {
  const isUnlocked = currentStars >= reward.starsRequired;
  const starsNeeded = reward.starsRequired - currentStars;

  return (
    <Surface
      elevation="base"
      padding="md"
      className={[
        "flex flex-col justify-between border w-full transition-all duration-200 select-none",
        isUnlocked
          ? "border-[rgba(169,144,255,0.25)] bg-[var(--hc-surface)] shadow-[var(--hc-shadow-sm)] hover:border-[var(--hc-violet)]"
          : "border-[var(--hc-border)] bg-[var(--hc-surface-raised)]/40 opacity-85",
      ].join(" ")}
    >
      <div className="flex flex-col gap-2">
        {/* Header: Partner Name and Category Badge */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] uppercase tracking-wider text-[var(--hc-text-subtle)] font-medium">
            {reward.partnerCategory}
          </span>
          
          <div className="flex items-center gap-1 text-[var(--hc-reward-gold)]">
            <Star size={10} fill="currentColor" strokeWidth={0} aria-hidden="true" />
            <span className="text-[var(--hc-text-xs)] font-bold font-mono">
              {reward.starsRequired}
            </span>
          </div>
        </div>

        {/* Title & Description */}
        <div className="text-left mt-0.5">
          <h4 className="text-[var(--hc-text-sm)] font-bold text-[var(--hc-text)] leading-snug">
            {reward.partnerName}
          </h4>
          <p className="text-[var(--hc-text-xs)] text-[var(--hc-text-muted)] font-medium mt-0.5">
            {reward.title}
          </p>
        </div>
      </div>

      {/* Footer / Redeem / Locked Status */}
      <div className="mt-4 pt-3 border-t border-[var(--hc-border-subtle)] flex items-center justify-between gap-3">
        {isUnlocked ? (
          <>
            <div className="flex items-center gap-1.5 text-[var(--hc-success)]">
              <Unlock size={12} className="shrink-0" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Unlocked</span>
            </div>
            
            <Button
              variant="primary"
              size="sm"
              className="px-4"
              onClick={() => onRedeemPress(reward)}
            >
              Redeem
            </Button>
          </>
        ) : (
          <>
            <div className="flex items-center gap-1.5 text-[var(--hc-text-subtle)]">
              <Lock size={12} className="shrink-0" />
              <span className="text-[10px] font-semibold uppercase tracking-wider">Locked</span>
            </div>
            
            <span className="text-[10px] font-mono text-[var(--hc-text-subtle)] font-medium">
              Need {starsNeeded} more {starsNeeded === 1 ? "star" : "stars"}
            </span>
          </>
        )}
      </div>
    </Surface>
  );
}
