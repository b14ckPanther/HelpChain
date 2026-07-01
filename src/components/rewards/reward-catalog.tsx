/**
 * RewardCatalog
 * Renders the catalogue list of partner benefits.
 */

"use client";

import { RewardCard } from "./reward-card";
import type { DemoReward } from "./reward-types";

interface RewardCatalogProps {
  rewards: DemoReward[];
  currentStars: number;
  onRedeemPress: (reward: DemoReward) => void;
}

export function RewardCatalog({ rewards, currentStars, onRedeemPress }: RewardCatalogProps) {
  return (
    <div className="w-full flex flex-col gap-3">
      <h3 className="text-[var(--hc-text-xs)] uppercase tracking-wider text-[var(--hc-text-subtle)] font-bold text-left px-1">
        Available Rewards
      </h3>
      
      <div className="grid grid-cols-1 gap-3 w-full">
        {rewards.map((reward) => (
          <RewardCard
            key={reward.id}
            reward={reward}
            currentStars={currentStars}
            onRedeemPress={onRedeemPress}
          />
        ))}
      </div>
    </div>
  );
}
