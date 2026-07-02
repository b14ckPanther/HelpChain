/**
 * PartnerExperience
 * Main orchestrator for the partner counter station at Haven Café.
 * Links realtime events, validators, and validation results.
 */

"use client";

import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { useDemoRealtime } from "@/lib/realtime";
import { PartnerHeader } from "./partner-header";
import { ScannerSurface } from "./scanner-surface";
import { CouponCodeEntry } from "./coupon-code-entry";
import { RedemptionResult } from "./redemption-result";
import { RecentRedemptions } from "./recent-redemptions";
import type { DemoCoupon } from "./partner-types";

export function PartnerExperience() {
  const partnerId = "partner-haven-cafe";
  const partnerName = "Haven Café";

  const {
    connected,
    state: realtimeState,
    redeemCouponCode,
    simulateCouponScan,
  } = useDemoRealtime({
    role: "partner",
    partnerId,
  });

  const [redeemedCoupon, setRedeemedCoupon] = useState<DemoCoupon | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ariaAnnouncement, setAriaAnnouncement] = useState("");

  const handleSimulateScan = useCallback((couponId: string) => {
    setIsSubmitting(true);
    setValidationError(null);
    setRedeemedCoupon(null);

    simulateCouponScan(couponId, (success, coupon: DemoCoupon | undefined, err) => {
      setIsSubmitting(false);
      if (success && coupon) {
        setRedeemedCoupon(coupon);
        setAriaAnnouncement(`Coupon ${coupon.couponCode} validated successfully.`);
      } else {
        setValidationError(err || "Scan failed.");
        setAriaAnnouncement(`Scan failed: ${err}`);
      }
    });
  }, [simulateCouponScan]);

  const handleRedeemCode = useCallback((code: string) => {
    setIsSubmitting(true);
    setValidationError(null);
    setRedeemedCoupon(null);

    redeemCouponCode(code, (success, coupon: DemoCoupon | undefined, err) => {
      setIsSubmitting(false);
      if (success && coupon) {
        setRedeemedCoupon(coupon);
        setAriaAnnouncement(`Code validation successful. Coupon ${coupon.couponCode} validated.`);
      } else {
        setValidationError(err || "Validation failed.");
        setAriaAnnouncement(`Validation failed: ${err}`);
      }
    });
  }, [redeemCouponCode]);

  const handleClearResult = useCallback(() => {
    setRedeemedCoupon(null);
    setValidationError(null);
  }, []);

  const partnerData = realtimeState.partnerRoleData;
  const coupons = partnerData?.coupons || [];
  const recentRedemptions = partnerData?.recentRedemptions || [];

  // Identify first active coupon in the system valid for Haven Café
  const activeCoupon = coupons.find(c => c.status === "active") || null;

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-[var(--hc-canvas)] select-none">
      
      {/* Aria Announcement Region */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {ariaAnnouncement}
      </div>

      {/* Header validation banner */}
      <PartnerHeader partnerName={partnerName} connected={connected} />

      {/* Main scrolling details */}
      <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-5 max-w-sm mx-auto w-full">
        
        {/* Scanner Viewfinder Area */}
        <ScannerSurface
          activeCoupon={activeCoupon}
          onSimulateScan={handleSimulateScan}
          isSubmitting={isSubmitting}
        />

        {/* Fallback code entry */}
        <CouponCodeEntry
          onRedeemCode={handleRedeemCode}
          isSubmitting={isSubmitting}
        />

        {/* Recent validations list */}
        <RecentRedemptions redemptions={recentRedemptions} />

      </div>

      {/* Verification Dialog alerts */}
      <AnimatePresence>
        {(redeemedCoupon || validationError) && (
          <RedemptionResult
            coupon={redeemedCoupon}
            error={validationError}
            onClear={handleClearResult}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
