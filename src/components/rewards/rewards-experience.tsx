/**
 * RewardsExperience
 * Handles visual layouts, catalog grids, coupon list cards,
 * confirmation overlays, and bottom sheet details for rewards.
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { AlertCircle, ShoppingBag } from "lucide-react";
import { useDemoRealtime } from "@/lib/realtime";
import { VolunteerNavBar } from "@/components/volunteer";
import { WalletHeader } from "./wallet-header";
import { RewardCatalog } from "./reward-catalog";
import { CouponWallet } from "./coupon-wallet";
import { RewardRedemptionDialog } from "./reward-redemption-dialog";
import { CouponDetailSheet } from "./coupon-detail-sheet";
import { Surface, StatusPill } from "@/components/ui";
import type { DemoReward, DemoCoupon } from "./reward-types";

export function RewardsExperience() {
  const {
    connected,
    state: realtimeState,
    error: realtimeError,
    requestRewardsCatalog,
    createRewardRedemption,
  } = useDemoRealtime({
    role: "volunteer",
    displayName: "Noor",
  });

  const [selectedReward, setSelectedReward] = useState<DemoReward | null>(null);
  const [activeDetailCoupon, setActiveDetailCoupon] = useState<DemoCoupon | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [ariaAnnouncement, setAriaAnnouncement] = useState("");

  // Sync state on load or reconnect
  useEffect(() => {
    if (connected) {
      requestRewardsCatalog();
    }
  }, [connected, requestRewardsCatalog]);

  const handleRedeemPress = useCallback((reward: DemoReward) => {
    setSelectedReward(reward);
    setLocalError(null);
  }, []);

  const handleConfirmRedeem = useCallback(() => {
    if (!selectedReward) return;
    setIsSubmitting(true);
    setLocalError(null);

    // Generate unique operationId to enforce idempotency
    const operationId = `op-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;

    createRewardRedemption(selectedReward.id, operationId, (success, coupon: DemoCoupon | undefined, err) => {
      setIsSubmitting(false);
      if (success && coupon) {
        setSelectedReward(null);
        setActiveDetailCoupon(coupon);
        setAriaAnnouncement(
          `Stars deducted. Issued validation code ${coupon.couponCode} for ${coupon.partnerName}.`
        );
      } else {
        setLocalError(err || "Failed to redeem reward. Please check your star balance.");
      }
    });
  }, [selectedReward, createRewardRedemption]);

  const handleCancelRedeem = useCallback(() => {
    setSelectedReward(null);
    setLocalError(null);
  }, []);

  const handleShowQr = useCallback((coupon: DemoCoupon) => {
    setActiveDetailCoupon(coupon);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setActiveDetailCoupon(null);
  }, []);

  const rewardsData = realtimeState.rewardsRoleData;
  const profile = rewardsData?.profile || {
    displayName: "Noor",
    initials: "NOO",
    starBalance: 4,
    averageRating: 4.9,
  };
  const catalog = rewardsData?.rewardsCatalog || [];
  const coupons = rewardsData?.coupons || [];

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-[var(--hc-canvas)] select-none">
      
      {/* Aria Live Announcement Region */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {ariaAnnouncement}
      </div>

      {/* Header Navigation Bar */}
      <VolunteerNavBar activeTab="rewards" />

      <div className="flex items-center justify-end px-4 py-2 border-b border-[var(--hc-border-subtle)] bg-[var(--hc-surface)]">
        <StatusPill variant={connected ? "success" : "danger"}>
          {connected ? "Online" : "Offline"}
        </StatusPill>
      </div>

      {/* Main scrolling content */}
      <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-6">
        
        {/* Error notification banner if any */}
        {(realtimeError || localError) && (
          <Surface elevation="base" padding="sm" className="border-[var(--hc-help-red)]/30 bg-[rgba(229,72,77,0.06)] text-[var(--hc-help-red)] flex items-start gap-2">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <p className="text-[var(--hc-text-xs)] text-left leading-relaxed font-medium">
              {localError || realtimeError}
            </p>
          </Surface>
        )}

        {/* Noor Profile & Balance */}
        <WalletHeader
          displayName={profile.displayName}
          initials={profile.initials}
          starBalance={profile.starBalance}
          averageRating={profile.averageRating}
        />

        {/* Reward Catalogue section */}
        <RewardCatalog
          rewards={catalog}
          currentStars={profile.starBalance}
          onRedeemPress={handleRedeemPress}
        />

        {/* Coupon Wallet section */}
        <div className="flex flex-col gap-3">
          <h3 className="text-[var(--hc-text-xs)] uppercase tracking-wider text-[var(--hc-text-subtle)] font-bold text-left px-1 flex items-center gap-1.5">
            <ShoppingBag size={12} />
            <span>My Coupons & History</span>
          </h3>
          <CouponWallet coupons={coupons} onShowQr={handleShowQr} />
        </div>

      </div>

      {/* Dialog Overlays */}
      <AnimatePresence>
        {selectedReward && (
          <RewardRedemptionDialog
            reward={selectedReward}
            currentStars={profile.starBalance}
            onConfirm={handleConfirmRedeem}
            onCancel={handleCancelRedeem}
            isSubmitting={isSubmitting}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeDetailCoupon && (
          <CouponDetailSheet
            coupon={activeDetailCoupon}
            onClose={handleCloseDetail}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
