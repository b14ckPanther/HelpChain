/**
 * SectionLabel
 * Typography primitive for labelling card groups or page sections.
 * Provides consistent heading hierarchy and muted styling.
 */

import React from "react";

interface SectionLabelProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeStyles: Record<string, string> = {
  sm: "text-[var(--hc-text-xs)] tracking-widest uppercase",
  md: "text-[var(--hc-text-sm)] tracking-wide uppercase",
  lg: "text-[var(--hc-text-base)] tracking-wide uppercase",
};

export function SectionLabel({
  children,
  as: Tag = "h2",
  size = "md",
  className = "",
  ...props
}: SectionLabelProps) {
  return (
    <Tag
      className={[
        "font-medium text-[var(--hc-text-subtle)]",
        "select-none",
        sizeStyles[size],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </Tag>
  );
}
