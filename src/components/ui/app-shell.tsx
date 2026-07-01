/**
 * AppShell
 * Top-level page wrapper. Provides full-height layout, safe-area insets,
 * and the dark canvas background. All pages should be wrapped in this.
 */

import React from "react";

interface AppShellProps {
  children: React.ReactNode;
  className?: string;
}

export function AppShell({ children, className = "" }: AppShellProps) {
  return (
    <div
      className={[
        "flex flex-col flex-1 min-h-screen min-h-[100dvh]",
        "bg-[var(--hc-canvas)] text-[var(--hc-text)]",
        "overflow-x-hidden",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
        paddingLeft: "env(safe-area-inset-left)",
        paddingRight: "env(safe-area-inset-right)",
      }}
    >
      {children}
    </div>
  );
}
