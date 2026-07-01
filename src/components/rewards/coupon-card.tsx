/**
 * CouponCard
 * Displays individual coupon status (Active / Redeemed / Expired).
 * Integrates fallback alphanumeric codes and a "Show QR" button callback.
 */

"use client";

import { QrCode, CheckCircle2, AlertTriangle } from "lucide-react";
import { Surface, Button, StatusPill } from "@/components/ui";
import type { DemoCoupon } from "./reward-types";

interface CouponCardProps {
  coupon: DemoCoupon;
  onShowQr: (coupon: DemoCoupon) => void;
}

export function CouponCard({ coupon, onShowQr }: CouponCardProps) {
  const isActive = coupon.status === "active";
  const isRedeemed = coupon.status === "redeemed";
  const isExpired = coupon.status === "expired";

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    } catch {
      return dateStr;
    }
  };

  return (
    <Surface
      elevation="base"
      padding="sm"
      className={[
        "flex flex-col gap-2.5 border text-left",
        isActive
          ? "border-[var(--hc-violet)]/30 bg-[var(--hc-surface)]"
          : "border-[var(--hc-border)] bg-[var(--hc-surface-raised)]/40 opacity-70",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col min-w-0">
          <span className="text-[10px] text-[var(--hc-text-subtle)] uppercase tracking-wider font-semibold">
            {coupon.partnerName}
          </span>
          <h5 className="text-[var(--hc-text-sm)] font-bold text-[var(--hc-text)] truncate mt-0.5">
            {coupon.title}
          </h5>
        </div>

        {/* Status badges */}
        {isActive && (
          <StatusPill variant="info">Active</StatusPill>
        )}
        {isRedeemed && (
          <div className="flex items-center gap-1 text-[var(--hc-success)] text-[10px] font-bold uppercase tracking-wider bg-[rgba(53,208,127,0.08)] px-2 py-0.5 rounded-full border border-[var(--hc-success)]/20">
            <CheckCircle2 size={10} />
            <span>Redeemed</span>
          </div>
        )}
        {isExpired && (
          <div className="flex items-center gap-1 text-[var(--hc-help-red)] text-[10px] font-bold uppercase tracking-wider bg-[rgba(229,72,77,0.08)] px-2 py-0.5 rounded-full border border-[var(--hc-help-red)]/20">
            <AlertTriangle size={10} />
            <span>Expired</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-[var(--hc-border-subtle)] pt-2 mt-0.5">
        <div className="flex flex-col">
          <span className="text-[9px] text-[var(--hc-text-subtle)] uppercase">Coupon Code</span>
          <span className="text-[var(--hc-text-xs)] font-mono font-bold tracking-wider text-[var(--hc-text)]">
            {coupon.couponCode}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isActive ? (
            <Button
              variant="secondary"
              size="sm"
              className="flex items-center gap-1.5 px-3 py-1 font-bold text-[10px]"
              onClick={() => onShowQr(coupon)}
            >
              <QrCode size={12} />
              <span>Show QR</span>
            </Button>
          ) : isRedeemed ? (
            <span className="text-[10px] text-[var(--hc-text-subtle)]">
              Used {formatDate(coupon.redeemedAt || "")}
            </span>
          ) : (
            <span className="text-[10px] text-[var(--hc-text-subtle)]">
              Refunded
            </span>
          )}
        </div>
      </div>
    </Surface>
  );
}
