/**
 * Surface / Card
 * Layered container that sits above the canvas.
 * Uses design token borders, radii, and shadows for depth.
 */

import React from "react";

type SurfaceElevation = "base" | "raised" | "overlay";

interface SurfaceProps {
  children: React.ReactNode;
  elevation?: SurfaceElevation;
  padding?: "none" | "sm" | "md" | "lg";
  className?: string;
  as?: "div" | "section" | "article" | "aside";
}

const elevationStyles: Record<SurfaceElevation, string> = {
  base: "bg-[var(--hc-surface)] shadow-[var(--hc-shadow-sm)]",
  raised: "bg-[var(--hc-surface-raised)] shadow-[var(--hc-shadow-md)]",
  overlay: "bg-[var(--hc-surface-overlay)] shadow-[var(--hc-shadow-lg)]",
};

const paddingStyles: Record<string, string> = {
  none: "",
  sm: "p-[var(--hc-space-4)]",
  md: "p-[var(--hc-space-6)]",
  lg: "p-[var(--hc-space-8)]",
};

export function Surface({
  children,
  elevation = "raised",
  padding = "md",
  className = "",
  as: Tag = "div",
}: SurfaceProps) {
  return (
    <Tag
      className={[
        "rounded-[var(--hc-radius-lg)]",
        "border border-[var(--hc-border)]",
        elevationStyles[elevation],
        paddingStyles[padding],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </Tag>
  );
}
