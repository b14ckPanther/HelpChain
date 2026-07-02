/**
 * RequesterMatchedState
 * Displayed when a volunteer accepts the requester's help request.
 * Contains volunteer identity card, rating, session timeline, and simulated proximity notes.
 */

"use client";

import { motion } from "framer-motion";
import { User, Star, MapPin } from "lucide-react";
import { Surface, StatusPill } from "@/components/ui";
import { SessionTimeline } from "@/components/session";

interface RequesterMatchedStateProps {
  volunteerName: string;
  volunteerRating: number;
  locationLabel: string;
  categoryTitle: string;
  description: string;
  onCancel: () => void;
}

export function RequesterMatchedState({
  volunteerName,
  volunteerRating,
  locationLabel,
  categoryTitle,
  description,
  onCancel,
}: RequesterMatchedStateProps) {
  return (
    <motion.div
      className="flex flex-col flex-1 px-[var(--hc-space-5)]"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Top section: Status */}
      <div className="flex flex-col items-center gap-[var(--hc-space-3)] pt-[var(--hc-space-6)]">
        <StatusPill variant="success" pulse>
          Volunteer Approaching
        </StatusPill>
      </div>

      {/* Center content */}
      <div className="flex flex-col flex-1 items-center justify-start gap-[var(--hc-space-6)] w-full mx-auto max-w-xs pt-4">
        
        {/* Step progress timeline */}
        <SessionTimeline status="matched" />

        <div className="flex flex-col items-center gap-1.5 text-center">
          <h1 className="text-[var(--hc-text-xl)] font-bold text-[var(--hc-text)] tracking-tight">
            A volunteer is on the way
          </h1>
          <p className="text-[var(--hc-text-sm)] text-[var(--hc-text-muted)] leading-relaxed">
            {volunteerName} accepted your request.
          </p>
        </div>

        {/* Volunteer Identity Card */}
        <Surface elevation="overlay" padding="md" className="w-full flex flex-col items-center gap-[var(--hc-space-3)]">
          <div className="flex items-center gap-3 w-full">
            <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-[var(--hc-violet-muted)] border border-[var(--hc-violet)] text-[var(--hc-violet)]" aria-hidden="true">
              <User size={22} strokeWidth={2} />
            </div>
            <div className="text-left flex-1 min-w-0">
              <h2 className="text-[var(--hc-text-base)] font-bold text-[var(--hc-text)] truncate">
                {volunteerName}
              </h2>
              <div className="flex items-center gap-1 text-[var(--hc-warning)]">
                <Star size={12} fill="currentColor" strokeWidth={0} />
                <span className="text-[var(--hc-text-xs)] text-[var(--hc-text-muted)] font-medium">
                  {volunteerRating.toFixed(1)} Rating
                </span>
              </div>
            </div>
          </div>

          <div className="w-full border-t border-[var(--hc-border-subtle)] pt-2 mt-1 text-left">
            <span className="text-[10px] text-[var(--hc-text-subtle)] uppercase tracking-wider block">Your request summary</span>
            <p className="text-[var(--hc-text-xs)] text-[var(--hc-text-muted)] italic mt-0.5 truncate">
              {categoryTitle} — &quot;{description}&quot;
            </p>
          </div>
        </Surface>

        {/* Meeting location block */}
        <div className="flex items-center justify-center gap-[var(--hc-space-2)] text-[var(--hc-text-subtle)]">
          <MapPin size={14} strokeWidth={1.75} aria-hidden="true" />
          <span className="text-[var(--hc-text-xs)]">Meet at: {locationLabel}</span>
        </div>
      </div>

      {/* Bottom disclaimer and cancel option */}
      <div className="pb-[var(--hc-space-8)] pt-[var(--hc-space-4)] w-full flex flex-col gap-4">
        <Surface elevation="base" padding="sm" className="border-dashed border-[var(--hc-border)]">
          <p className="text-[10px] text-[var(--hc-text-subtle)] text-center leading-relaxed">
            You are now connected through Helpchain.<br />
            <span className="text-[var(--hc-violet)] font-medium">
              Connected through Helpchain
            </span>
          </p>
        </Surface>

        <button
          type="button"
          onClick={onCancel}
          className={[
            "text-[var(--hc-text-sm)] text-[var(--hc-text-muted)]",
            "hover:text-[var(--hc-help-red)] mx-auto",
            "min-h-[var(--hc-touch-min)] px-[var(--hc-space-4)]",
            "cursor-pointer transition-colors font-medium",
          ].join(" ")}
          style={{ transitionDuration: "var(--hc-duration-fast)" }}
        >
          Cancel request
        </button>
      </div>
    </motion.div>
  );
}
