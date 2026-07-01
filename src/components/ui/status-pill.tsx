/**
 * StatusPill
 * Small labelled status indicator with semantic color coding.
 * Always pairs color with text (never color-only).
 */

import React from "react";

type StatusPillVariant = "neutral" | "success" | "warning" | "danger" | "info";

interface StatusPillProps {
  children: React.ReactNode;
  variant?: StatusPillVariant;
  /** Optional pulsing dot indicator */
  pulse?: boolean;
  className?: string;
}

const variantStyles: Record<StatusPillVariant, { bg: string; text: string; dot: string }> = {
  neutral: {
    bg: "bg-[var(--hc-surface-overlay)]",
    text: "text-[var(--hc-text-muted)]",
    dot: "bg-[var(--hc-text-subtle)]",
  },
  success: {
    bg: "bg-[var(--hc-success-muted)]",
    text: "text-[var(--hc-success)]",
    dot: "bg-[var(--hc-success)]",
  },
  warning: {
    bg: "bg-[var(--hc-warning-muted)]",
    text: "text-[var(--hc-warning)]",
    dot: "bg-[var(--hc-warning)]",
  },
  danger: {
    bg: "bg-[var(--hc-help-red-muted)]",
    text: "text-[var(--hc-help-red)]",
    dot: "bg-[var(--hc-help-red)]",
  },
  info: {
    bg: "bg-[var(--hc-violet-muted)]",
    text: "text-[var(--hc-violet)]",
    dot: "bg-[var(--hc-violet)]",
  },
};

export function StatusPill({
  children,
  variant = "neutral",
  pulse = false,
  className = "",
}: StatusPillProps) {
  const style = variantStyles[variant];

  return (
    <span
      className={[
        "inline-flex items-center gap-[var(--hc-space-2)]",
        "px-[var(--hc-space-3)] py-[var(--hc-space-1)]",
        "rounded-[var(--hc-radius-full)]",
        "text-[var(--hc-text-sm)] font-medium",
        "select-none",
        style.bg,
        style.text,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      role="status"
    >
      {pulse && (
        <span className="relative flex h-2 w-2" aria-hidden="true">
          <span
            className={[
              "absolute inline-flex h-full w-full rounded-full opacity-75",
              style.dot,
            ].join(" ")}
            style={{
              animation: "hc-pulse-subtle 2s var(--hc-ease-in-out) infinite",
            }}
          />
          <span
            className={["relative inline-flex h-2 w-2 rounded-full", style.dot].join(
              " "
            )}
          />
        </span>
      )}
      {children}
    </span>
  );
}
