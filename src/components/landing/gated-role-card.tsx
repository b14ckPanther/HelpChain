"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, Lock } from "lucide-react";
import { Surface } from "@/components/ui";

interface GatedRoleCardProps {
  title: string;
  description: string;
  href: string;
  cta: string;
  icon: LucideIcon;
  signedIn: boolean;
  allowed: boolean;
  gateMessage?: string;
}

export function GatedRoleCard({
  title,
  description,
  href,
  cta,
  icon: Icon,
  signedIn,
  allowed,
  gateMessage,
}: GatedRoleCardProps) {
  const blocked = !signedIn || !allowed;

  const inner = (
    <>
      <div
        className="flex items-center justify-center w-11 h-11 rounded-[var(--hc-radius-md)] bg-[var(--hc-violet-muted)] text-[var(--hc-violet)]"
        aria-hidden="true"
      >
        {blocked ? <Lock size={20} strokeWidth={1.75} /> : <Icon size={22} strokeWidth={1.75} />}
      </div>

      <div className="flex flex-col gap-[var(--hc-space-2)] flex-1">
        <h2 className="text-[var(--hc-text-lg)] font-bold text-[var(--hc-text)] leading-tight">{title}</h2>
        <p className="text-[var(--hc-text-sm)] text-[var(--hc-text-muted)] leading-relaxed">{description}</p>
        {gateMessage && blocked && (
          <p className="text-[var(--hc-text-xs)] text-[var(--hc-warning)] leading-relaxed">{gateMessage}</p>
        )}
      </div>

      <span
        className={[
          "inline-flex items-center gap-[var(--hc-space-2)]",
          "text-[var(--hc-text-sm)] font-semibold",
          blocked ? "text-[var(--hc-text-subtle)]" : "text-[var(--hc-violet)]",
          "min-h-[var(--hc-touch-min)] items-center",
        ].join(" ")}
      >
        {blocked ? "Simulated sign in required" : cta}
        {!blocked && (
          <ArrowRight
            size={16}
            strokeWidth={2}
            className="transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        )}
      </span>
    </>
  );

  return (
    <Surface
      elevation="raised"
      padding="lg"
      as="article"
      className={[
        "group h-full transition-colors",
        blocked ? "opacity-75" : "hover:border-[var(--hc-violet)]/40",
      ].join(" ")}
    >
      {blocked ? (
        <div
          className="flex flex-col gap-[var(--hc-space-4)] h-full cursor-not-allowed"
          aria-disabled="true"
        >
          {inner}
        </div>
      ) : (
        <Link
          href={href}
          className={[
            "flex flex-col gap-[var(--hc-space-4)] h-full",
            "rounded-[var(--hc-radius-lg)]",
            "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--hc-violet)]",
          ].join(" ")}
        >
          {inner}
        </Link>
      )}
    </Surface>
  );
}
