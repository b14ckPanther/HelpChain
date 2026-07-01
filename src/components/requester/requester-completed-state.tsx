/**
 * RequesterCompletedState
 * Renders verified session completion state and lets requester rate Noor.
 */

"use client";

import { motion } from "framer-motion";
import { Award, ShieldCheck } from "lucide-react";
import { Surface, StatusPill } from "@/components/ui";
import { SessionTimeline, RatingSelector } from "@/components/session";

interface RequesterCompletedStateProps {
  volunteerName: string;
  onRatingSubmit: (rating: number) => void;
  starBalance: number;
}

export function RequesterCompletedState({
  volunteerName,
  onRatingSubmit,
  starBalance,
}: RequesterCompletedStateProps) {
  return (
    <motion.div
      className="flex flex-col flex-1 px-[var(--hc-space-5)]"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Top Banner */}
      <div className="flex flex-col items-center gap-[var(--hc-space-3)] pt-[var(--hc-space-6)]">
        <StatusPill variant="success">
          Session Completed
        </StatusPill>
      </div>

      {/* Center detail */}
      <div className="flex flex-col flex-1 items-center justify-start gap-[var(--hc-space-6)] w-full mx-auto max-w-xs pt-4">
        
        {/* Timeline */}
        <SessionTimeline status="completed" />

        <div className="flex flex-col items-center gap-1.5 text-center">
          <h1 className="text-[var(--hc-text-xl)] font-bold text-[var(--hc-text)] tracking-tight">
            Help confirmed
          </h1>
          <p className="text-[var(--hc-text-sm)] text-[var(--hc-text-muted)]">
            Thank you for closing the session together.
          </p>
        </div>

        {/* Verification & Star alert card */}
        <Surface elevation="overlay" padding="md" className="w-full flex items-center gap-3 border-[var(--hc-success)]/40 bg-[rgba(53,208,127,0.05)]">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--hc-success-muted)] text-[var(--hc-success)] shrink-0">
            <Award size={20} />
          </div>
          <div className="text-left min-w-0">
            <h4 className="text-[var(--hc-text-sm)] font-bold text-[var(--hc-text)]">
              Verified Session
            </h4>
            <p className="text-[var(--hc-text-xs)] text-[var(--hc-text-muted)] leading-relaxed">
              {volunteerName} earned 1 star for helping. (New balance: {starBalance} stars)
            </p>
          </div>
        </Surface>

        {/* Noor rating selector */}
        <Surface elevation="base" padding="md" className="w-full border-[var(--hc-border-subtle)]">
          <RatingSelector onSubmit={onRatingSubmit} />
        </Surface>
      </div>

      {/* Close note */}
      <div className="pb-[var(--hc-space-8)] pt-[var(--hc-space-4)] w-full">
        <Surface elevation="base" padding="sm" className="border-dashed border-[var(--hc-border)] flex items-center gap-2">
          <ShieldCheck size={14} className="text-[var(--hc-text-subtle)] shrink-0" />
          <p className="text-[10px] text-[var(--hc-text-subtle)] text-center leading-relaxed">
            Helpchain verified prototype closed. Rewards catalogue and QR coupon code redemptions will unlock in Phase 4.
          </p>
        </Surface>
      </div>
    </motion.div>
  );
}
