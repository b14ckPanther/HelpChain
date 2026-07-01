/**
 * CouponWallet
 * Segments active, redeemed, and expired coupons into distinct scannable list cards.
 */

"use client";

import { CouponCard } from "./coupon-card";
import type { DemoCoupon } from "./reward-types";

interface CouponWalletProps {
  coupons: DemoCoupon[];
  onShowQr: (coupon: DemoCoupon) => void;
}

export function CouponWallet({ coupons, onShowQr }: CouponWalletProps) {
  const activeCoupons = coupons.filter((c) => c.status === "active");
  const redeemedCoupons = coupons.filter((c) => c.status === "redeemed");
  const expiredCoupons = coupons.filter((c) => c.status === "expired");

  const hasAnyCoupons = coupons.length > 0;

  if (!hasAnyCoupons) {
    return (
      <div className="w-full py-8 text-center border border-dashed border-[var(--hc-border)] rounded-[var(--hc-radius-lg)]">
        <p className="text-[var(--hc-text-xs)] text-[var(--hc-text-subtle)] font-medium">
          No coupons generated yet. Redeem stars above.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-5 text-left">
      
      {/* Active Coupons Section */}
      {activeCoupons.length > 0 && (
        <div className="flex flex-col gap-2.5">
          <h4 className="text-[10px] uppercase tracking-wider text-[var(--hc-text-subtle)] font-bold px-1">
            Active Coupons ({activeCoupons.length})
          </h4>
          <div className="flex flex-col gap-2">
            {activeCoupons.map((coupon) => (
              <CouponCard key={coupon.id} coupon={coupon} onShowQr={onShowQr} />
            ))}
          </div>
        </div>
      )}

      {/* Redeemed Coupons Section */}
      {redeemedCoupons.length > 0 && (
        <div className="flex flex-col gap-2.5">
          <h4 className="text-[10px] uppercase tracking-wider text-[var(--hc-text-subtle)] font-bold px-1">
            Redeemed History ({redeemedCoupons.length})
          </h4>
          <div className="flex flex-col gap-2">
            {redeemedCoupons.map((coupon) => (
              <CouponCard key={coupon.id} coupon={coupon} onShowQr={onShowQr} />
            ))}
          </div>
        </div>
      )}

      {/* Expired Coupons Section */}
      {expiredCoupons.length > 0 && (
        <div className="flex flex-col gap-2.5">
          <h4 className="text-[10px] uppercase tracking-wider text-[var(--hc-text-subtle)] font-bold px-1">
            Expired & Refunded ({expiredCoupons.length})
          </h4>
          <div className="flex flex-col gap-2">
            {expiredCoupons.map((coupon) => (
              <CouponCard key={coupon.id} coupon={coupon} onShowQr={onShowQr} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
