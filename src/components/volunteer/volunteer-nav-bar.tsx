/**
 * VolunteerNavBar
 * Persistent top navigation for the volunteer companion app.
 */

"use client";

import Link from "next/link";
import { Home, LayoutDashboard, Gift } from "lucide-react";
import { VOLUNTEER_COPY } from "./volunteer-copy";

type VolunteerNavTab = "dashboard" | "rewards";

interface VolunteerNavBarProps {
  activeTab?: VolunteerNavTab;
}

export function VolunteerNavBar({ activeTab = "dashboard" }: VolunteerNavBarProps) {
  const copy = VOLUNTEER_COPY.nav;

  return (
    <header className="flex items-center justify-between gap-2 px-4 py-3 border-b border-[var(--hc-border-subtle)] shrink-0 bg-[var(--hc-surface)]">
      <Link
        href="/"
        className="flex items-center gap-1.5 text-[var(--hc-text-xs)] text-[var(--hc-text-subtle)] hover:text-[var(--hc-text)] font-semibold transition-colors min-h-[var(--hc-touch-min)] px-2 -ml-2"
      >
        <Home size={14} aria-hidden="true" />
        <span>{copy.home}</span>
      </Link>

      <Link
        href="/volunteer"
        className={[
          "flex items-center gap-1.5 text-[var(--hc-text-xs)] font-semibold transition-colors min-h-[var(--hc-touch-min)] px-2",
          activeTab === "dashboard"
            ? "text-[var(--hc-text)]"
            : "text-[var(--hc-text-subtle)] hover:text-[var(--hc-text)]",
        ].join(" ")}
        aria-current={activeTab === "dashboard" ? "page" : undefined}
      >
        <LayoutDashboard size={14} aria-hidden="true" />
        <span>{copy.dashboard}</span>
      </Link>

      <Link
        href="/rewards"
        className={[
          "flex items-center gap-1.5 text-[var(--hc-text-xs)] font-semibold transition-colors min-h-[var(--hc-touch-min)] px-2 -mr-2",
          activeTab === "rewards"
            ? "text-[var(--hc-text)]"
            : "text-[var(--hc-text-subtle)] hover:text-[var(--hc-text)]",
        ].join(" ")}
        aria-current={activeTab === "rewards" ? "page" : undefined}
      >
        <Gift size={14} aria-hidden="true" />
        <span>{copy.rewards}</span>
      </Link>
    </header>
  );
}
