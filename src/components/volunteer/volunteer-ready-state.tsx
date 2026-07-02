/**
 * VolunteerReadyState
 * The offline/idle state for the volunteer app.
 * Provides option to go online/available.
 */

"use client";

import { motion } from "framer-motion";
import { User, Star, ShieldAlert } from "lucide-react";
import { Button, StatusPill, Surface } from "@/components/ui";
import { VOLUNTEER_COPY } from "./volunteer-copy";

interface VolunteerReadyStateProps {
  displayName: string;
  connected: boolean;
  onGoAvailable: () => void;
}

export function VolunteerReadyState({
  displayName,
  connected,
  onGoAvailable,
}: VolunteerReadyStateProps) {
  const copy = VOLUNTEER_COPY.ready;

  return (
    <motion.div
      className="flex flex-col flex-1 items-center justify-between px-[var(--hc-space-5)] py-[var(--hc-space-8)]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Top connection status */}
      <div className="flex flex-col items-center gap-[var(--hc-space-2)]">
        {connected ? (
          <StatusPill variant="neutral">
            {copy.connectedStatus}
          </StatusPill>
        ) : (
          <StatusPill variant="danger">
            {copy.disconnectedStatus}
          </StatusPill>
        )}
      </div>

      {/* Main card panel */}
      <div className="w-full max-w-xs flex flex-col items-center gap-[var(--hc-space-6)]">
        {/* Profile Card */}
        <Surface elevation="raised" padding="lg" className="w-full flex flex-col items-center gap-[var(--hc-space-3)]">
          <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-[var(--hc-surface-overlay)] border border-[var(--hc-border)] text-[var(--hc-text-muted)]" aria-hidden="true">
            <User size={28} />
          </div>
          <div className="text-center">
            <h2 className="text-[var(--hc-text-lg)] font-bold text-[var(--hc-text)]">
              {displayName}
            </h2>
            <div className="flex items-center justify-center gap-1 text-[var(--hc-warning)] mt-1">
              <Star size={14} fill="currentColor" strokeWidth={0} />
              <span className="text-[var(--hc-text-sm)] text-[var(--hc-text-muted)] font-medium">
                {VOLUNTEER_COPY.ratingText}
              </span>
            </div>
          </div>
        </Surface>

        <div className="text-center flex flex-col gap-[var(--hc-space-2)]">
          <h1 className="text-[var(--hc-text-xl)] font-bold text-[var(--hc-text)]">
            {copy.title}
          </h1>
          <p className="text-[var(--hc-text-sm)] text-[var(--hc-text-subtle)]">
            Go available to receive alerts when someone needs assistance near your location.
          </p>
        </div>

        <Button
          variant="primary"
          size="lg"
          className="w-full"
          onClick={onGoAvailable}
          disabled={!connected}
        >
          {copy.buttonGoOnline}
        </Button>
      </div>

      {/* Safety warning */}
      <div className="flex items-center gap-[var(--hc-space-2)] text-[var(--hc-text-subtle)] mt-[var(--hc-space-4)]">
        <ShieldAlert size={14} className="shrink-0" />
        <p className="text-[var(--hc-text-xs)] text-center">
          Maintain personal safety guidelines at all times.
        </p>
      </div>
    </motion.div>
  );
}
