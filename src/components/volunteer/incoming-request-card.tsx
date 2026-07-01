/**
 * IncomingRequestCard
 * Highlighted alert card showing an active incoming help request.
 * Designed to look premium and high-visibility for demo presentations.
 */

"use client";

import { motion } from "framer-motion";
import { BookOpen, Navigation, ArrowUpFromLine, HelpCircle, MapPin, Radio } from "lucide-react";
import { Button, Surface } from "@/components/ui";
import { VOLUNTEER_COPY } from "./volunteer-copy";
import type { HelpCategory } from "@/lib/realtime";

const CATEGORY_DISPLAY: Record<HelpCategory, { title: string; Icon: React.ComponentType<{ size?: number; className?: string }> }> = {
  navigation: { title: "Navigation", Icon: Navigation },
  read_text: { title: "Read text", Icon: BookOpen },
  reach_shelf: { title: "Reach shelf", Icon: ArrowUpFromLine },
  other: { title: "Other assistance", Icon: HelpCircle },
};

interface IncomingRequestCardProps {
  category: HelpCategory;
  description: string;
  locationLabel: string;
  onAccept: () => void;
  onDecline: () => void;
}

export function IncomingRequestCard({
  category,
  description,
  locationLabel,
  onAccept,
  onDecline,
}: IncomingRequestCardProps) {
  const copy = VOLUNTEER_COPY.incoming;
  const display = CATEGORY_DISPLAY[category] || CATEGORY_DISPLAY.other;
  const CatIcon = display.Icon;

  return (
    <motion.div
      className="w-full max-w-sm px-[var(--hc-space-4)]"
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
    >
      <Surface elevation="overlay" padding="none" className="overflow-hidden border-[var(--hc-violet)]/35 shadow-[var(--hc-shadow-glow-violet)]">
        {/* Banner */}
        <div className="bg-[var(--hc-violet-muted)] border-b border-[var(--hc-violet)]/20 px-[var(--hc-space-5)] py-[var(--hc-space-3)] flex items-center justify-between">
          <div className="flex items-center gap-[var(--hc-space-2)] text-[var(--hc-violet)] font-bold text-[var(--hc-text-sm)]">
            <Radio size={14} aria-hidden="true" />
            <span>{copy.alert}</span>
          </div>
          <span className="text-[10px] text-[var(--hc-text-subtle)] uppercase tracking-wider font-semibold">
            {copy.simulatedProximity}
          </span>
        </div>

        {/* Content details */}
        <div className="p-[var(--hc-space-5)] flex flex-col gap-[var(--hc-space-4)]">
          {/* Category row */}
          <div className="flex items-center gap-[var(--hc-space-3)]">
            <span
              className="flex items-center justify-center w-10 h-10 rounded-[var(--hc-radius-md)] bg-[var(--hc-violet-muted)] text-[var(--hc-violet)]"
              aria-hidden="true"
            >
              <CatIcon size={20} />
            </span>
            <div>
              <p className="text-[var(--hc-text-xs)] text-[var(--hc-text-subtle)] uppercase tracking-wider">
                {copy.categoryLabel}
              </p>
              <p className="text-[var(--hc-text-base)] font-bold text-[var(--hc-text)]">
                {display.title}
              </p>
            </div>
          </div>

          {/* Location row */}
          <div className="flex items-start gap-[var(--hc-space-3)] bg-[var(--hc-surface)] p-[var(--hc-space-3)] rounded-[var(--hc-radius-md)] border border-[var(--hc-border)]">
            <MapPin size={16} className="text-[var(--hc-text-muted)] mt-0.5 shrink-0" aria-hidden="true" />
            <div>
              <p className="text-[var(--hc-text-xs)] text-[var(--hc-text-subtle)]">
                {copy.locationLabel}
              </p>
              <p className="text-[var(--hc-text-sm)] font-medium text-[var(--hc-text)]">
                {locationLabel}
              </p>
            </div>
          </div>

          {/* Description row */}
          <div className="flex flex-col gap-[var(--hc-space-1)]">
            <p className="text-[var(--hc-text-xs)] text-[var(--hc-text-subtle)] uppercase tracking-wider">
              {copy.descriptionLabel}
            </p>
            <p className="text-[var(--hc-text-base)] text-[var(--hc-text)] leading-relaxed italic bg-[var(--hc-surface)] p-[var(--hc-space-4)] rounded-[var(--hc-radius-md)] border border-[var(--hc-border-subtle)]">
              &quot;{description}&quot;
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-[var(--hc-space-3)] pt-[var(--hc-space-2)]">
            <Button
              variant="primary"
              size="md"
              className="flex-1 font-bold"
              onClick={onAccept}
            >
              {copy.acceptButton}
            </Button>
            <Button
              variant="secondary"
              size="md"
              className="flex-1"
              onClick={onDecline}
            >
              {copy.declineButton}
            </Button>
          </div>
        </div>
      </Surface>
    </motion.div>
  );
}
