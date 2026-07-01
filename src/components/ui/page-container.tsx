/**
 * PageContainer
 * Constrains page content width and adds consistent padding.
 * Responsive: tighter on mobile, wider on desktop.
 */

import React from "react";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "full";
}

const maxWidthStyles: Record<string, string> = {
  sm: "max-w-md",
  md: "max-w-2xl",
  lg: "max-w-5xl",
  full: "max-w-full",
};

export function PageContainer({
  children,
  className = "",
  maxWidth = "md",
}: PageContainerProps) {
  return (
    <div
      className={[
        "w-full mx-auto",
        "px-[var(--hc-space-5)] sm:px-[var(--hc-space-8)]",
        "py-[var(--hc-space-6)] sm:py-[var(--hc-space-10)]",
        maxWidthStyles[maxWidth],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}
