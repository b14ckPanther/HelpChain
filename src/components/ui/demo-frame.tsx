/**
 * DemoFrame
 * A responsive device frame for presentation contexts.
 * Shows content inside an iPhone-like frame on desktop,
 * or full-bleed on mobile devices where framing is unnecessary.
 *
 * This is purely presentational — it does not affect layout logic.
 */

import React from "react";

interface DemoFrameProps {
  children: React.ReactNode;
  /** Label shown beneath the device frame on desktop */
  label?: string;
  className?: string;
}

export function DemoFrame({
  children,
  label,
  className = "",
}: DemoFrameProps) {
  return (
    <div
      className={[
        "flex flex-col items-center gap-[var(--hc-space-4)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* On mobile: no frame. On desktop: device-like container */}
      <div
        className={[
          /* Mobile: full width, no frame */
          "w-full",
          /* Desktop: fixed device-like dimensions with rounded frame */
          "sm:w-[390px] sm:min-h-[700px]",
          "sm:rounded-[var(--hc-radius-2xl)]",
          "sm:border sm:border-[var(--hc-border)]",
          "sm:shadow-[var(--hc-shadow-xl)]",
          "sm:overflow-hidden",
          "bg-[var(--hc-canvas)]",
        ].join(" ")}
      >
        {children}
      </div>
      {label && (
        <p className="hidden sm:block text-[var(--hc-text-sm)] text-[var(--hc-text-subtle)] select-none">
          {label}
        </p>
      )}
    </div>
  );
}
