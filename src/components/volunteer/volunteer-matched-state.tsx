/**
 * VolunteerMatchedState
 * Displayed when the volunteer accepts a request.
 * Guides them to the location to assist, displaying progress timeline and an arrival button.
 */

"use client";

import { motion } from "framer-motion";
import { MapPin, Info, ArrowRight } from "lucide-react";
import { Surface, StatusPill, Button } from "@/components/ui";
import { SessionTimeline } from "@/components/session";
import { VOLUNTEER_COPY } from "./volunteer-copy";

interface VolunteerMatchedStateProps {
  locationLabel: string;
  categoryTitle: string;
  description: string;
  onConfirmArrival: () => void;
}

export function VolunteerMatchedState({
  locationLabel,
  categoryTitle,
  description,
  onConfirmArrival,
}: VolunteerMatchedStateProps) {
  const copy = VOLUNTEER_COPY.matched;

  return (
    <motion.div
      className="flex flex-col flex-1 items-center justify-between px-[var(--hc-space-5)] py-[var(--hc-space-6)]"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Top Banner */}
      <div className="flex flex-col items-center gap-[var(--hc-space-2)]">
        <StatusPill variant="success" pulse>
          En Route
        </StatusPill>
      </div>

      {/* Center directions panel */}
      <div className="w-full max-w-xs flex flex-col items-center gap-[var(--hc-space-5)] text-center">
        
        {/* Timeline */}
        <SessionTimeline status="matched" />

        <div className="flex flex-col gap-1">
          <h1 className="text-[var(--hc-text-lg)] font-bold text-[var(--hc-text)] tracking-tight">
            {copy.title}
          </h1>
          <p className="text-[var(--hc-text-xs)] text-[var(--hc-text-muted)]">
            Head to {locationLabel}
          </p>
        </div>

        {/* Location box */}
        <Surface elevation="overlay" padding="md" className="w-full flex flex-col items-center gap-[var(--hc-space-2)]">
          <MapPin size={20} className="text-[var(--hc-violet)]" />
          <h2 className="text-[10px] uppercase tracking-wider text-[var(--hc-text-subtle)]">
            {copy.locationHeader}
          </h2>
          <p className="text-[var(--hc-text-sm)] font-bold text-[var(--hc-text)]">
            {locationLabel}
          </p>
          <div className="w-full border-t border-[var(--hc-border-subtle)] my-1.5 pt-1.5 text-left">
            <span className="text-[9px] text-[var(--hc-text-subtle)] uppercase">Request details</span>
            <p className="text-[var(--hc-text-xs)] text-[var(--hc-text-muted)] italic mt-0.5">
              {categoryTitle} — &quot;{description}&quot;
            </p>
          </div>
        </Surface>

        {/* Primary Action Button */}
        <Button
          variant="primary"
          size="lg"
          className="w-full flex items-center justify-center gap-2"
          onClick={onConfirmArrival}
        >
          <span>I&apos;ve arrived</span>
          <ArrowRight size={16} />
        </Button>
      </div>

      {/* Disclaimers */}
      <div className="w-full max-w-xs flex flex-col gap-[var(--hc-space-3)]">
        <Surface elevation="base" padding="sm" className="border-dashed border-[var(--hc-border)] flex items-start gap-2">
          <Info size={14} className="text-[var(--hc-text-subtle)] shrink-0 mt-0.5" />
          <p className="text-[10px] text-[var(--hc-text-subtle)] text-left leading-relaxed">
            {copy.disclaimers}
          </p>
        </Surface>
        <p className="text-[9px] text-[var(--hc-text-subtle)] opacity-50 text-center">
          {copy.notice}
        </p>
      </div>
    </motion.div>
  );
}
