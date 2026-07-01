/**
 * VolunteerInProgressState
 * Displayed to the volunteer while assistance is active.
 * Shows dynamic elapsed session timers and a completion confirmation modal checklist.
 */

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Surface, StatusPill, Button } from "@/components/ui";
import { SessionTimeline, SessionElapsedTime, ConfirmationPanel } from "@/components/session";

interface VolunteerInProgressStateProps {
  locationLabel: string;
  categoryTitle: string;
  description: string;
  arrivedAt: string | null;
  onMarkComplete: () => void;
}

export function VolunteerInProgressState({
  locationLabel,
  categoryTitle,
  description,
  arrivedAt,
  onMarkComplete,
}: VolunteerInProgressStateProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <motion.div
      className="flex flex-col flex-1 items-center justify-between px-[var(--hc-space-5)] py-[var(--hc-space-6)]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Top Banner */}
      <div className="flex flex-col items-center gap-[var(--hc-space-2)]">
        <StatusPill variant="info" pulse>
          Helping
        </StatusPill>
      </div>

      {/* Center directions panel */}
      <div className="w-full max-w-xs flex flex-col items-center gap-[var(--hc-space-5)] text-center">
        
        {/* Timeline */}
        <SessionTimeline status="in_progress" />

        <div className="flex flex-col gap-1">
          <h1 className="text-[var(--hc-text-lg)] font-bold text-[var(--hc-text)] tracking-tight">
            Assistance in progress
          </h1>
          <p className="text-[var(--hc-text-xs)] text-[var(--hc-text-muted)]">
            Helping at {locationLabel}
          </p>
        </div>

        {/* Dynamic active elapsed timer */}
        <Surface elevation="overlay" padding="md" className="w-full flex flex-col items-center gap-3">
          <SessionElapsedTime startTimestamp={arrivedAt} />
          
          <div className="w-full border-t border-[var(--hc-border-subtle)] my-1 pt-2 text-left">
            <span className="text-[9px] text-[var(--hc-text-subtle)] uppercase">Assisting with</span>
            <p className="text-[var(--hc-text-xs)] text-[var(--hc-text-muted)] italic mt-0.5 truncate">
              {categoryTitle} — &quot;{description}&quot;
            </p>
          </div>
        </Surface>

        {/* Primary Completion Control */}
        <AnimatePresence mode="wait">
          {!showConfirm ? (
            <motion.div
              key="complete-btn"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              <Button
                variant="danger"
                size="lg"
                className="w-full"
                onClick={() => setShowConfirm(true)}
              >
                Mark assistance complete
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="confirm-panel"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="w-full"
            >
              <ConfirmationPanel
                isOpen={true}
                title="Mark this assistance as complete?"
                description="The requester will be asked to confirm they received help."
                confirmLabel="Mark complete"
                cancelLabel="Keep session active"
                onConfirm={onMarkComplete}
                onCancel={() => setShowConfirm(false)}
                variant="danger"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Reminder notes */}
      <div className="w-full max-w-xs text-center">
        <p className="text-[10px] text-[var(--hc-text-subtle)] font-medium">
          Confirm completion only when the help is finished.
        </p>
      </div>
    </motion.div>
  );
}
