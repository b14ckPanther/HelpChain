/**
 * VolunteerCompletedState
 * Displayed when requester confirms help.
 * Triggers star balance increments (4 to 5) and displays session rating selectors.
 */

"use client";

import { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { Star, ShieldCheck, ArrowRight } from "lucide-react";
import { Surface, StatusPill, Button } from "@/components/ui";
import { SessionTimeline, RatingSelector } from "@/components/session";
import Link from "next/link";

interface VolunteerCompletedStateProps {
  onRatingSubmit: (rating: number) => void;
  starBalance: number;
}

export function VolunteerCompletedState({
  onRatingSubmit,
  starBalance,
}: VolunteerCompletedStateProps) {
  const [displayStars, setDisplayStars] = useState(4);
  const controls = useAnimation();

  useEffect(() => {
    // Star increment animation sequence:
    // Display starts at 4, after 1 second, it scales and increments to 5!
    const timer = setTimeout(async () => {
      await controls.start({
        scale: [1, 1.4, 1],
        rotate: [0, 15, -15, 0],
        transition: { duration: 0.6, ease: "easeInOut" },
      });
      setDisplayStars(starBalance);
    }, 800);

    return () => clearTimeout(timer);
  }, [starBalance, controls]);

  return (
    <motion.div
      className="flex flex-col flex-1 items-center justify-between px-[var(--hc-space-5)] py-[var(--hc-space-6)]"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Top Banner */}
      <div className="flex flex-col items-center gap-[var(--hc-space-2)]">
        <StatusPill variant="success">
          Session Verified
        </StatusPill>
      </div>

      {/* Center directions panel */}
      <div className="w-full max-w-xs flex flex-col items-center gap-[var(--hc-space-5)] text-center">
        
        {/* Timeline */}
        <SessionTimeline status="completed" />

        <div className="flex flex-col gap-1.5">
          <h1 className="text-[var(--hc-text-xl)] font-bold text-[var(--hc-text)] tracking-tight">
            Session verified
          </h1>
          <p className="text-[var(--hc-text-sm)] text-[var(--hc-text-muted)]">
            You made a difference.
          </p>
        </div>

        {/* Star balance award card */}
        <Surface elevation="overlay" padding="md" className="w-full flex items-center justify-between border-[var(--hc-success)]/40 bg-[rgba(53,208,127,0.05)]">
          <div className="text-left">
            <h4 className="text-[var(--hc-text-sm)] font-bold text-[var(--hc-text)]">
              +1 Star Earned
            </h4>
            <p className="text-[var(--hc-text-xs)] text-[var(--hc-text-muted)] leading-relaxed">
              Help confirmed by requester
            </p>
          </div>

          {/* Star animation trigger */}
          <div className="flex items-center gap-1.5 bg-[var(--hc-surface)] border border-[var(--hc-border)] px-3 py-1.5 rounded-full shrink-0">
            <motion.div animate={controls} className="text-[var(--hc-warning)]" aria-hidden="true">
              <Star size={16} fill="currentColor" strokeWidth={0} />
            </motion.div>
            <span className="text-[var(--hc-text-sm)] font-bold text-[var(--hc-text)] font-mono">
              {displayStars}
            </span>
          </div>
        </Surface>

        {/* Rating selector */}
        <Surface elevation="base" padding="md" className="w-full border-[var(--hc-border-subtle)]">
          <RatingSelector onSubmit={onRatingSubmit} />
        </Surface>
      </div>

      {/* Safety warning */}
      <div className="w-full max-w-xs text-center flex flex-col gap-3">
        <Link href="/rewards" className="w-full">
          <Button variant="primary" size="lg" className="w-full flex items-center justify-center gap-2">
            <span>My rewards</span>
            <ArrowRight size={16} />
          </Button>
        </Link>

        <Surface elevation="base" padding="sm" className="border-dashed border-[var(--hc-border)] flex items-start gap-2">
          <ShieldCheck size={14} className="text-[var(--hc-text-subtle)] shrink-0 mt-0.5" />
          <p className="text-[10px] text-[var(--hc-text-subtle)] text-left leading-relaxed">
            Help confirmed. You can now redeem your earned stars for discount coupons in your rewards wallet.
          </p>
        </Surface>
      </div>
    </motion.div>
  );
}
