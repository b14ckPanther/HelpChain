/**
 * RequesterCompletionPromptState
 * Displayed when the volunteer marks help as completed.
 * Prompts the requester with dual confirmation prompt.
 */

"use client";

import { motion } from "framer-motion";
import { CheckSquare } from "lucide-react";
import { Surface, StatusPill } from "@/components/ui";
import { ConfirmationPanel, SessionTimeline } from "@/components/session";

interface RequesterCompletionPromptStateProps {
  volunteerName: string;
  onConfirmReceived: () => void;
  onNotReady: () => void;
}

export function RequesterCompletionPromptState({
  volunteerName,
  onConfirmReceived,
  onNotReady,
}: RequesterCompletionPromptStateProps) {
  return (
    <motion.div
      className="flex flex-col flex-1 px-[var(--hc-space-5)]"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.4 }}
    >
      {/* Top Banner */}
      <div className="flex flex-col items-center gap-[var(--hc-space-3)] pt-[var(--hc-space-6)]">
        <StatusPill variant="warning" pulse>
          Confirmation Pending
        </StatusPill>
      </div>

      {/* Center Prompt */}
      <div className="flex flex-col flex-1 items-center justify-start gap-[var(--hc-space-6)] w-full mx-auto max-w-xs pt-4">
        
        {/* Timeline */}
        <SessionTimeline status="awaiting_requester_confirmation" />

        <div className="flex flex-col items-center gap-1.5 text-center mb-2">
          <h1 className="text-[var(--hc-text-xl)] font-bold text-[var(--hc-text)] tracking-tight">
            Assistance complete?
          </h1>
          <p className="text-[var(--hc-text-sm)] text-[var(--hc-text-muted)]">
            {volunteerName} marked this request as complete.
          </p>
        </div>

        {/* Inline confirmation card */}
        <ConfirmationPanel
          isOpen={true}
          title="Did you receive the help you needed?"
          description="Confirming completes this Helpchain session, verifying the service and awarding a star to the volunteer."
          confirmLabel="Yes, confirm help received"
          cancelLabel="Not ready yet"
          onConfirm={onConfirmReceived}
          onCancel={onNotReady}
          variant="primary"
        />
      </div>

      {/* Reassurance text */}
      <div className="pb-[var(--hc-space-8)] pt-[var(--hc-space-4)] w-full">
        <Surface elevation="base" padding="sm" className="border-dashed border-[var(--hc-border)] flex items-center gap-2">
          <CheckSquare size={14} className="text-[var(--hc-text-subtle)] shrink-0" />
          <p className="text-[10px] text-[var(--hc-text-subtle)] text-left leading-relaxed">
            Your confirmation wraps up this active session. Noor receives +1 star after you confirm.
          </p>
        </Surface>
      </div>
    </motion.div>
  );
}
