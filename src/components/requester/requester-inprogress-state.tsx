/**
 * RequesterInProgressState
 * Displayed when the volunteer confirms arrival.
 * Features an active session timeline, elapsed active timer, and calm reassure copy.
 */

"use client";

import { motion } from "framer-motion";
import { UserCheck } from "lucide-react";
import { Surface, StatusPill } from "@/components/ui";
import { SessionTimeline, SessionElapsedTime } from "@/components/session";

interface RequesterInProgressStateProps {
  volunteerName: string;
  locationLabel: string;
  arrivedAt: string | null;
}

export function RequesterInProgressState({
  volunteerName,
  locationLabel,
  arrivedAt,
}: RequesterInProgressStateProps) {
  return (
    <motion.div
      className="flex flex-col flex-1 px-[var(--hc-space-5)]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Top Section */}
      <div className="flex flex-col items-center gap-[var(--hc-space-3)] pt-[var(--hc-space-6)]">
        <StatusPill variant="info" pulse>
          Assistance Active
        </StatusPill>
      </div>

      {/* Center Details */}
      <div className="flex flex-col flex-1 items-center justify-start gap-[var(--hc-space-6)] w-full mx-auto max-w-xs pt-4">
        
        {/* Timeline */}
        <SessionTimeline status="in_progress" />

        <div className="flex flex-col items-center gap-1.5 text-center">
          <h1 className="text-[var(--hc-text-xl)] font-bold text-[var(--hc-text)] tracking-tight">
            {volunteerName} has arrived
          </h1>
          <p className="text-[var(--hc-text-sm)] text-[var(--hc-text-muted)]">
            Your help session is now active
          </p>
        </div>

        {/* Live timer card */}
        <Surface elevation="overlay" padding="lg" className="w-full flex flex-col items-center gap-4">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[var(--hc-violet-muted)] text-[var(--hc-violet)]">
            <UserCheck size={28} />
          </div>
          
          <SessionElapsedTime startTimestamp={arrivedAt} />
        </Surface>

        <p className="text-[var(--hc-text-xs)] text-[var(--hc-text-subtle)] text-center leading-relaxed max-w-[200px]">
          Stay together at {locationLabel} while the assistance is completed.
        </p>
      </div>

      {/* Reassurance footer */}
      <div className="pb-[var(--hc-space-8)] pt-[var(--hc-space-4)] w-full">
        <Surface elevation="base" padding="md" className="border-dashed border-[var(--hc-border)]">
          <p className="text-[10px] text-[var(--hc-text-subtle)] text-center leading-relaxed">
            Need emergency dispatch? Contact local emergency services directly. Helpchain is for situational peer help.
          </p>
        </Surface>
      </div>
    </motion.div>
  );
}
