/**
 * VolunteerAwaitingConfirmState
 * Displayed when volunteer marks complete.
 * Shows a loading indicator while awaiting requester confirmation.
 */

"use client";

import { motion } from "framer-motion";
import { Hourglass } from "lucide-react";
import { StatusPill } from "@/components/ui";
import { SessionTimeline } from "@/components/session";

export function VolunteerAwaitingConfirmState() {

  return (
    <motion.div
      className="flex flex-col flex-1 items-center justify-between px-[var(--hc-space-5)] py-[var(--hc-space-8)]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Top Banner */}
      <div className="flex flex-col items-center gap-[var(--hc-space-2)]">
        <StatusPill variant="warning" pulse>
          Awaiting Confirmation
        </StatusPill>
      </div>

      {/* Center directions panel */}
      <div className="w-full max-w-xs flex flex-col items-center gap-[var(--hc-space-6)] text-center">
        
        {/* Timeline */}
        <SessionTimeline status="awaiting_requester_confirmation" />

        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[var(--hc-violet-muted)] text-[var(--hc-violet)] animate-pulse">
          <Hourglass size={24} />
        </div>

        <div className="flex flex-col gap-[var(--hc-space-2)]">
          <h1 className="text-[var(--hc-text-xl)] font-bold text-[var(--hc-text)] tracking-tight">
            Waiting for confirmation
          </h1>
          <p className="text-[var(--hc-text-sm)] text-[var(--hc-text-muted)] leading-relaxed">
            The requester has been asked to confirm the assistance on their device.
          </p>
        </div>
      </div>

      {/* Static context warning */}
      <div className="w-full max-w-xs text-center">
        <p className="text-[10px] text-[var(--hc-text-subtle)]">
          Once confirmed, your star balance will update automatically.
        </p>
      </div>
    </motion.div>
  );
}
