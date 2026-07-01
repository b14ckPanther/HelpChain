/**
 * RewardRedemptionDialog
 * Confirmation modal prompt displayed prior to star exchanges.
 * Lists cost parameters, updated balances, and provides click mitigations.
 */

"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Surface, Button } from "@/components/ui";
import { useAccessibleDialog } from "@/hooks/use-accessible-dialog";
import { REWARD_COPY } from "./reward-copy";
import type { DemoReward } from "./reward-types";

interface RewardRedemptionDialogProps {
  reward: DemoReward | null;
  currentStars: number;
  onConfirm: () => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function RewardRedemptionDialog({
  reward,
  currentStars,
  onConfirm,
  onCancel,
  isSubmitting = false,
}: RewardRedemptionDialogProps) {
  const { dialogRef } = useAccessibleDialog({
    isOpen: Boolean(reward),
    onClose: onCancel,
    closeOnEscape: !isSubmitting,
  });

  if (!reward) return null;

  const copy = REWARD_COPY.redemptionDialog;
  const remainingStars = currentStars - reward.starsRequired;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      {/* Click outside backdrop triggers cancel */}
      <div className="absolute inset-0 cursor-default" onClick={onCancel} aria-hidden="true" />

      <motion.div
        ref={dialogRef}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-sm relative"
        tabIndex={-1}
      >
        <Surface elevation="overlay" padding="lg" className="border border-[var(--hc-border)] shadow-[var(--hc-shadow-lg)] relative text-center flex flex-col gap-4">
          
          {/* Header */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[var(--hc-violet-muted)] text-[var(--hc-violet)]">
              <Star size={24} fill="currentColor" strokeWidth={0} />
            </div>
            <h3 id="dialog-title" className="text-[var(--hc-text-base)] font-bold text-[var(--hc-text)]">
              {copy.title}
            </h3>
          </div>

          {/* Reward Summary Card */}
          <Surface elevation="base" padding="md" className="border border-[var(--hc-border-subtle)] text-left flex flex-col gap-1">
            <span className="text-[9px] text-[var(--hc-text-subtle)] uppercase tracking-wider font-semibold">
              Selected Item
            </span>
            <h4 className="text-[var(--hc-text-sm)] font-bold text-[var(--hc-text)]">
              {reward.partnerName}
            </h4>
            <p className="text-[var(--hc-text-xs)] text-[var(--hc-text-muted)] font-medium">
              {reward.title}
            </p>
          </Surface>

          {/* Star Accounting Details */}
          <div className="w-full flex flex-col gap-1.5 py-1.5 border-t border-b border-[var(--hc-border-subtle)] text-[var(--hc-text-xs)] text-[var(--hc-text-muted)] font-medium text-left">
            <div className="flex justify-between">
              <span>Your current balance</span>
              <span className="font-mono text-[var(--hc-text)]">{currentStars} stars</span>
            </div>
            <div className="flex justify-between text-[var(--hc-help-red)]">
              <span>Deducted cost</span>
              <span className="font-mono font-bold">-{reward.starsRequired} stars</span>
            </div>
            <div className="flex justify-between border-t border-[var(--hc-border-subtle)]/50 pt-1.5 mt-0.5 text-[var(--hc-success)] font-bold">
              <span>Remaining balance</span>
              <span className="font-mono">{remainingStars} stars</span>
            </div>
          </div>

          {/* Statement */}
          <p className="text-[var(--hc-text-xs)] text-[var(--hc-text-subtle)] font-medium leading-relaxed max-w-[280px] mx-auto">
            {copy.warning}
          </p>

          {/* Buttons Row */}
          <div className="flex flex-col gap-2 w-full mt-1.5">
            <Button
              variant="primary"
              size="md"
              className="w-full flex justify-center font-bold"
              onClick={onConfirm}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Redeeming..." : copy.confirm(reward.starsRequired)}
            </Button>
            <Button
              variant="secondary"
              size="md"
              className="w-full text-[var(--hc-text-subtle)] hover:text-white"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              {copy.cancel}
            </Button>
          </div>

        </Surface>
      </motion.div>
    </div>
  );
}
