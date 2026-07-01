/**
 * PartnerHeader
 * Top banner card indicating Haven Café details and server online connection indicators.
 */

"use client";

import { Store } from "lucide-react";
import { Surface, StatusPill } from "@/components/ui";
import { PARTNER_COPY } from "./partner-copy";

interface PartnerHeaderProps {
  partnerName: string;
  connected: boolean;
}

export function PartnerHeader({ partnerName, connected }: PartnerHeaderProps) {
  const copy = PARTNER_COPY.header;

  return (
    <Surface
      elevation="base"
      padding="sm"
      className="w-full flex items-center justify-between border border-[var(--hc-border-subtle)] text-left bg-[var(--hc-surface)] shrink-0"
    >
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--hc-violet-muted)] text-[var(--hc-violet)]">
          <Store size={20} />
        </div>
        <div>
          <h2 className="text-[var(--hc-text-sm)] font-bold text-[var(--hc-text)]">
            {partnerName}
          </h2>
          <p className="text-[10px] text-[var(--hc-text-subtle)] font-medium mt-0.5">
            {copy.subtitle}
          </p>
        </div>
      </div>

      <StatusPill variant={connected ? "success" : "danger"}>
        {connected ? "Server Online" : "Server Offline"}
      </StatusPill>
    </Surface>
  );
}
