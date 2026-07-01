/**
 * RedemptionResult
 * Renders validation feedback panels indicating verification success or error.
 */

"use client";

import { motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";
import { Surface, Button } from "@/components/ui";
import { PARTNER_COPY } from "./partner-copy";
import type { DemoCoupon } from "./partner-types";

interface RedemptionResultProps {
  coupon: DemoCoupon | null;
  error: string | null;
  onClear: () => void;
}

export function RedemptionResult({ coupon, error, onClear }: RedemptionResultProps) {
  const copy = PARTNER_COPY.result;

  if (!coupon && !error) return null;

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      return date.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 cursor-default" onClick={onClear} aria-hidden="true" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-sm"
      >
        {coupon ? (
          /* SUCCESS CASE */
          <Surface
            elevation="overlay"
            padding="lg"
            className="border border-[var(--hc-success)]/30 shadow-[var(--hc-shadow-lg)] text-center flex flex-col gap-4 bg-[var(--hc-surface)]"
          >
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[var(--hc-success-muted)] text-[var(--hc-success)]">
                <CheckCircle2 size={28} />
              </div>
              <h3 className="text-[var(--hc-text-base)] font-bold text-[var(--hc-text)]">
                {copy.successTitle}
              </h3>
            </div>

            <Surface elevation="base" padding="md" className="border border-[var(--hc-border-subtle)] text-left flex flex-col gap-1 bg-[var(--hc-canvas)]">
              <span className="text-[9px] text-[var(--hc-success)] uppercase tracking-wider font-bold">
                {coupon.partnerName} Reward
              </span>
              <h4 className="text-[var(--hc-text-sm)] font-bold text-white">
                {coupon.title}
              </h4>
              <div className="flex justify-between items-center text-[10px] text-[var(--hc-text-subtle)] mt-2 pt-2 border-t border-[var(--hc-border-subtle)]/50 font-mono">
                <span>Validated at:</span>
                <span>{formatDate(coupon.redeemedAt)}</span>
              </div>
            </Surface>

            <p className="text-[var(--hc-text-xs)] text-[var(--hc-text-subtle)] font-medium max-w-[260px] mx-auto leading-relaxed">
              {copy.successNotice} No payment or checkout processing is required.
            </p>

            <Button
              variant="primary"
              size="md"
              className="w-full flex items-center justify-center gap-2 font-bold"
              onClick={onClear}
            >
              <span>{copy.successAction}</span>
              <ArrowRight size={14} />
            </Button>
          </Surface>
        ) : (
          /* FAILURE CASE */
          <Surface
            elevation="overlay"
            padding="lg"
            className="border border-[var(--hc-help-red)]/30 shadow-[var(--hc-shadow-lg)] text-center flex flex-col gap-4 bg-[var(--hc-surface)]"
          >
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[rgba(229,72,77,0.08)] text-[var(--hc-help-red)]">
                <AlertTriangle size={28} />
              </div>
              <h3 className="text-[var(--hc-text-base)] font-bold text-[var(--hc-text)]">
                Validation Failed
              </h3>
            </div>

            <Surface elevation="base" padding="md" className="border border-[var(--hc-border-subtle)] text-center bg-[var(--hc-canvas)]">
              <p className="text-[var(--hc-text-xs)] text-[var(--hc-help-red)] font-bold leading-relaxed">
                {error || "An unknown validation error occurred."}
              </p>
            </Surface>

            <p className="text-[10px] text-[var(--hc-text-subtle)] leading-relaxed max-w-[260px] mx-auto">
              Please check that the coupon code matches and that it was generated for Haven Café.
            </p>

            <Button
              variant="secondary"
              size="md"
              className="w-full font-bold"
              onClick={onClear}
            >
              Dismiss
            </Button>
          </Surface>
        )}
      </motion.div>
    </div>
  );
}
