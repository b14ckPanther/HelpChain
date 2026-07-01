/* eslint-disable @next/next/no-img-element */
/**
 * CouponDetailSheet
 * Bottom sheet overlay displaying full coupon details, QR codes, and fallback alphanumeric codes.
 */

"use client";

import { motion } from "framer-motion";
import { X, Calendar, ShieldAlert } from "lucide-react";
import { Surface, Button } from "@/components/ui";
import { useAccessibleDialog } from "@/hooks/use-accessible-dialog";
import { REWARD_COPY } from "./reward-copy";
import type { DemoCoupon } from "./reward-types";

interface CouponDetailSheetProps {
  coupon: DemoCoupon | null;
  onClose: () => void;
}

export function CouponDetailSheet({ coupon, onClose }: CouponDetailSheetProps) {
  const { dialogRef } = useAccessibleDialog({
    isOpen: Boolean(coupon),
    onClose,
  });

  if (!coupon) return null;

  const copy = REWARD_COPY.couponDetail;

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="coupon-sheet-title"
    >
      {/* Click outside to close */}
      <div className="absolute inset-0 cursor-default" onClick={onClose} aria-hidden="true" />

      <motion.div
        ref={dialogRef}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 220 }}
        className="relative w-full max-w-md bg-[var(--hc-canvas)] border-t border-[var(--hc-border)] rounded-t-[var(--hc-radius-xl)] px-5 pb-[max(2rem,env(safe-area-inset-bottom))] pt-5 shadow-[0_-8px_30px_rgb(0,0,0,0.5)] max-h-[90vh] overflow-y-auto"
        tabIndex={-1}
      >
        {/* Drag handle */}
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-[var(--hc-border)]" aria-hidden="true" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close coupon sheet"
          className="absolute right-4 top-4 flex items-center justify-center min-w-[var(--hc-touch-min)] min-h-[var(--hc-touch-min)] rounded-full bg-[var(--hc-surface-raised)] text-[var(--hc-text-subtle)] hover:text-[var(--hc-text)] transition-colors"
        >
          <X size={18} />
        </button>

        {/* Detail Panel */}
        <div className="flex flex-col items-center text-center gap-4 mt-2">
          
          <div className="flex flex-col gap-1 w-full">
            <span className="text-[10px] text-[var(--hc-violet)] uppercase tracking-wider font-bold">
              {coupon.partnerName} Coupon
            </span>
            <h3 id="coupon-sheet-title" className="text-[var(--hc-text-lg)] font-bold text-[var(--hc-text)] max-w-[280px] mx-auto leading-tight">
              {coupon.title}
            </h3>
          </div>

          {/* QR Container */}
          <div className="p-3 bg-white rounded-[var(--hc-radius-lg)] border border-[var(--hc-border)] shadow-[var(--hc-shadow-sm)] flex items-center justify-center">
            {coupon.qrDataUrl ? (
              <img
                src={coupon.qrDataUrl}
                alt={`QR coupon for ${coupon.partnerName}, code ${coupon.couponCode}`}
                className="w-44 h-44 object-contain select-none"
              />
            ) : (
              <div className="w-44 h-44 flex items-center justify-center text-black/60 font-semibold font-mono text-[var(--hc-text-xs)]">
                QR Error
              </div>
            )}
          </div>

          {/* Fallback Alphanumeric Text */}
          <div className="flex flex-col items-center gap-1 bg-[var(--hc-surface-raised)] border border-[var(--hc-border)] px-6 py-2.5 rounded-[var(--hc-radius-md)] w-full max-w-[240px]">
            <span className="text-[9px] text-[var(--hc-text-subtle)] uppercase tracking-wider font-semibold">
              Validation Code
            </span>
            <span className="text-[var(--hc-text-base)] sm:text-[var(--hc-text-lg)] font-mono font-bold tracking-wider text-[var(--hc-text)] break-all">
              {coupon.couponCode}
            </span>
          </div>

          {/* Present instructions */}
          <p className="text-[var(--hc-text-xs)] text-[var(--hc-text-muted)] font-medium leading-relaxed max-w-[280px]">
            {copy.instructions(coupon.partnerName)}
          </p>

          {/* Validity stats */}
          <div className="flex flex-col gap-1 w-full border-t border-b border-[var(--hc-border-subtle)] py-3 mt-1.5 text-left text-[var(--hc-text-xs)] text-[var(--hc-text-subtle)] font-medium">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Calendar size={12} />
                <span>Issued date</span>
              </span>
              <span className="font-mono">{formatDate(coupon.issuedAt)}</span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="flex items-center gap-1.5 text-[var(--hc-violet)]">
                <Calendar size={12} />
                <span>Expires date</span>
              </span>
              <span className="font-mono text-[var(--hc-violet)]">{formatDate(coupon.expiresAt)}</span>
            </div>
          </div>

          {/* Disclaimer warning */}
          <Surface elevation="base" padding="sm" className="w-full flex items-start gap-2 border-[var(--hc-border)] bg-[var(--hc-surface-raised)]/20 text-[var(--hc-text-subtle)]">
            <ShieldAlert size={14} className="shrink-0 mt-0.5" />
            <p className="text-[10px] text-left leading-relaxed">
              {copy.disclaimer}
            </p>
          </Surface>

          {/* Action dismiss */}
          <Button
            variant="secondary"
            size="md"
            className="w-full mt-2"
            onClick={onClose}
          >
            Back to Wallet
          </Button>

        </div>
      </motion.div>
    </div>
  );
}
