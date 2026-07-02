/**
 * RequesterNavBar
 * Minimal top navigation for the requester assist device.
 */

"use client";

import Link from "next/link";
import { Home } from "lucide-react";
import { REQUESTER_COPY } from "./requester-copy";

export function RequesterNavBar() {
  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-[var(--hc-border-subtle)] shrink-0 bg-[var(--hc-surface)]">
      <Link
        href="/"
        className="flex items-center gap-1.5 text-[var(--hc-text-xs)] text-[var(--hc-text-subtle)] hover:text-[var(--hc-text)] font-semibold transition-colors min-h-[var(--hc-touch-min)] px-2 -ml-2"
      >
        <Home size={14} aria-hidden="true" />
        <span>{REQUESTER_COPY.nav.home}</span>
      </Link>

      <span className="text-[var(--hc-text-sm)] font-bold text-[var(--hc-text)]">
        {REQUESTER_COPY.brand}
      </span>

      <span className="w-[4.5rem]" aria-hidden="true" />
    </header>
  );
}
