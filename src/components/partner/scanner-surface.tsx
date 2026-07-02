/**
 * ScannerSurface
 * Abstract visual scanner with an animated viewfinder laser line.
 * Provides one-click demo scan paths matching server-validated active coupons.
 */

"use client";

import { motion, useReducedMotion } from "framer-motion";
import { QrCode, Play, AlertCircle } from "lucide-react";
import { Surface, Button } from "@/components/ui";
import { PARTNER_COPY } from "./partner-copy";
import type { DemoCoupon } from "./partner-types";

interface ScannerSurfaceProps {
  activeCoupon: DemoCoupon | null;
  onSimulateScan: (couponId: string) => void;
  isSubmitting?: boolean;
}

export function ScannerSurface({
  activeCoupon,
  onSimulateScan,
  isSubmitting = false,
}: ScannerSurfaceProps) {
  const copy = PARTNER_COPY.scanner;
  const prefersReduced = useReducedMotion();

  return (
    <Surface
      elevation="base"
      padding="md"
      className="w-full flex flex-col items-center gap-4 border border-[var(--hc-border-subtle)] text-center relative"
    >
      <div className="flex flex-col gap-1 w-full text-left">
        <h3 className="text-[var(--hc-text-sm)] font-bold text-[var(--hc-text)]">
          {copy.title}
        </h3>
        <span className="text-[10px] text-[var(--hc-text-subtle)] font-medium">
          {copy.label}
        </span>
      </div>

      {/* Viewfinder scanner container */}
      <div className="relative w-52 h-52 bg-[var(--hc-canvas)] border border-[var(--hc-border)] rounded-[var(--hc-radius-lg)] flex items-center justify-center overflow-hidden shadow-inner">
        {prefersReduced ? (
          <div className="absolute left-4 right-4 top-1/2 h-[2px] bg-[var(--hc-violet)]/50" aria-hidden="true" />
        ) : (
          <motion.div
            className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--hc-violet)] to-transparent opacity-80"
            animate={{ top: ["5%", "95%", "5%"] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            aria-hidden="true"
          />
        )}

        {/* Framing brackets */}
        <div className="absolute top-4 left-4 w-5 h-5 border-t-2 border-l-2 border-[var(--hc-border)]" aria-hidden="true" />
        <div className="absolute top-4 right-4 w-5 h-5 border-t-2 border-r-2 border-[var(--hc-border)]" aria-hidden="true" />
        <div className="absolute bottom-4 left-4 w-5 h-5 border-b-2 border-l-2 border-[var(--hc-border)]" aria-hidden="true" />
        <div className="absolute bottom-4 right-4 w-5 h-5 border-b-2 border-r-2 border-[var(--hc-border)]" aria-hidden="true" />

        <QrCode size={44} className="text-[var(--hc-border)] opacity-35" aria-hidden="true" />
      </div>

      {/* Simulation triggers */}
      <div className="w-full flex flex-col gap-2.5 pt-2 border-t border-[var(--hc-border-subtle)]">
        {activeCoupon ? (
          <>
            <Button
              variant="primary"
              size="md"
              className="w-full flex items-center justify-center gap-2 border-[var(--hc-violet)] bg-[rgba(169,144,255,0.06)] hover:bg-[rgba(169,144,255,0.12)] text-[var(--hc-violet)]"
              onClick={() => onSimulateScan(activeCoupon.id)}
              disabled={isSubmitting}
            >
              <Play size={14} fill="currentColor" />
              <span>{copy.scanBtn}</span>
            </Button>
            <p className="text-[9px] text-[var(--hc-text-subtle)] font-medium max-w-[250px] mx-auto leading-relaxed">
              {copy.scanNotice} (Code: <span className="font-mono font-bold text-white">{activeCoupon.couponCode}</span>)
            </p>
          </>
        ) : (
          <Surface elevation="base" padding="sm" className="w-full flex items-start gap-2 border-[var(--hc-border)] bg-[var(--hc-surface-raised)]/25 text-[var(--hc-text-subtle)] text-left">
            <AlertCircle size={14} className="shrink-0 mt-0.5" />
            <p className="text-[10px] leading-relaxed">
              No active Haven Café coupons found. Redeem a coupon on the volunteer device first to enable scanning.
            </p>
          </Surface>
        )}
      </div>
    </Surface>
  );
}
