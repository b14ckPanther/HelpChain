"use client";

import { Radio } from "lucide-react";
import { StatusPill } from "@/components/ui";
import { DIRECTOR_COPY } from "./director-copy";

interface DirectorHeaderProps {
  connected: boolean;
}

export function DirectorHeader({ connected }: DirectorHeaderProps) {
  return (
    <header className="flex flex-col gap-[var(--hc-space-4)]">
      <div className="flex flex-col gap-[var(--hc-space-3)] lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-col gap-[var(--hc-space-2)]">
          <div className="flex items-center gap-[var(--hc-space-3)]">
            <div
              className="flex items-center justify-center w-11 h-11 rounded-[var(--hc-radius-lg)] bg-[var(--hc-violet-muted)] text-[var(--hc-violet)]"
              aria-hidden="true"
            >
              <Radio size={22} strokeWidth={1.75} />
            </div>
            <div>
              <h1 className="text-[var(--hc-text-2xl)] sm:text-[var(--hc-text-3xl)] font-bold text-[var(--hc-text)] tracking-tight">
                {DIRECTOR_COPY.pageTitle}
              </h1>
              <p className="text-[var(--hc-text-sm)] text-[var(--hc-violet)] font-medium">
                {DIRECTOR_COPY.subtitle}
              </p>
            </div>
          </div>

          <SurfaceNotice />
        </div>

        <div className="flex flex-col items-start gap-[var(--hc-space-2)] lg:items-end">
          <StatusPill variant={connected ? "success" : "warning"} pulse={connected}>
            {connected
              ? DIRECTOR_COPY.connection.connected
              : DIRECTOR_COPY.connection.disconnected}
          </StatusPill>
          <p className="text-[var(--hc-text-xs)] text-[var(--hc-text-subtle)] max-w-sm lg:text-right">
            {DIRECTOR_COPY.persistenceNote}
          </p>
        </div>
      </div>
    </header>
  );
}

function SurfaceNotice() {
  return (
    <div
      className="rounded-[var(--hc-radius-lg)] border border-[var(--hc-border)] bg-[var(--hc-surface-raised)] px-[var(--hc-space-4)] py-[var(--hc-space-3)]"
      role="note"
    >
      <p className="text-[var(--hc-text-sm)] text-[var(--hc-text-muted)] leading-relaxed">
        {DIRECTOR_COPY.notice}
      </p>
    </div>
  );
}
