/**
 * RequesterReadyState
 * The calm, highly accessible "assist device" home screen.
 * Features the giant red help button as the star of the product.
 */

"use client";

import { motion } from "framer-motion";
import { Hand, MapPin, Shield } from "lucide-react";
import { StatusPill } from "@/components/ui";
import { REQUESTER_COPY } from "./requester-copy";

interface RequesterReadyStateProps {
  locationLabel: string;
  onHelpPress: () => void;
  connected: boolean;
}

export function RequesterReadyState({
  locationLabel,
  onHelpPress,
  connected,
}: RequesterReadyStateProps) {
  const copy = REQUESTER_COPY.ready;

  return (
    <motion.div
      className="flex flex-col flex-1 items-center px-[var(--hc-space-5)]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Top section: brand + status */}
      <div className="flex flex-col items-center gap-[var(--hc-space-3)] pt-[var(--hc-space-6)]">
        {connected ? (
          <StatusPill variant="success" pulse>
            {copy.connectedStatus}
          </StatusPill>
        ) : (
          <StatusPill variant="warning">
            {copy.disconnectedStatus}
          </StatusPill>
        )}

        <div className="flex items-center gap-[var(--hc-space-2)] text-[var(--hc-text-subtle)]">
          <MapPin size={14} strokeWidth={1.75} aria-hidden="true" />
          <span className="text-[var(--hc-text-xs)]">{locationLabel}</span>
        </div>
      </div>

      {/* Center section: headline + giant button */}
      <div className="flex flex-col flex-1 items-center justify-center gap-[var(--hc-space-8)] w-full max-w-xs">
        <div className="flex flex-col items-center gap-[var(--hc-space-3)] text-center">
          <h1 className="text-[var(--hc-text-2xl)] sm:text-[var(--hc-text-3xl)] font-bold text-[var(--hc-text)]">
            {copy.headline}
          </h1>
          <p className="text-[var(--hc-text-base)] text-[var(--hc-text-muted)] leading-relaxed">
            {copy.subline}
          </p>
        </div>

        {/* ===== THE GIANT HELP BUTTON ===== */}
        <div className="relative flex items-center justify-center">
          {/* Outer glow ring — decorative */}
          <div
            className="absolute rounded-full"
            style={{
              width: "200px",
              height: "200px",
              background: "radial-gradient(circle, var(--hc-help-red-glow) 0%, transparent 70%)",
            }}
            aria-hidden="true"
          />
          {/* Secondary ring — subtle depth cue */}
          <div
            className="absolute rounded-full border border-[var(--hc-help-red)]"
            style={{
              width: "180px",
              height: "180px",
              opacity: 0.15,
            }}
            aria-hidden="true"
          />

          <motion.button
            type="button"
            onClick={onHelpPress}
            className={[
              "relative z-10 flex flex-col items-center justify-center",
              "rounded-full cursor-pointer",
              "bg-[var(--hc-help-red)] text-white",
              "select-none",
              "focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-white",
            ].join(" ")}
            style={{
              width: "160px",
              height: "160px",
              boxShadow: [
                "0 0 0 1px rgba(229, 72, 77, 0.3)",
                "0 4px 16px rgba(229, 72, 77, 0.35)",
                "0 8px 32px rgba(229, 72, 77, 0.2)",
                "inset 0 1px 0 rgba(255, 255, 255, 0.15)",
                "inset 0 -2px 0 rgba(0, 0, 0, 0.15)",
              ].join(", "),
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            aria-label={copy.buttonLabel}
          >
            <Hand
              size={40}
              strokeWidth={1.5}
              className="mb-[var(--hc-space-2)]"
              aria-hidden="true"
            />
            <span className="text-[var(--hc-text-lg)] font-bold leading-tight">
              {copy.buttonLabel}
            </span>
          </motion.button>
        </div>
      </div>

      {/* Bottom section: safety note */}
      <div className="flex items-center gap-[var(--hc-space-2)] pb-[var(--hc-space-8)] pt-[var(--hc-space-4)]">
        <Shield size={14} strokeWidth={1.75} className="text-[var(--hc-text-subtle)] shrink-0" aria-hidden="true" />
        <p className="text-[var(--hc-text-xs)] text-[var(--hc-text-subtle)] text-center leading-relaxed">
          {copy.safetyNote}
        </p>
      </div>
    </motion.div>
  );
}
