/**
 * Button
 * Primary interactive element with variant, size, and state support.
 * Meets WCAG touch target minimums. Keyboard and focus accessible.
 */

import React from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: [
    "bg-[var(--hc-violet)] text-white",
    "hover:brightness-110",
    "active:brightness-95",
    "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:brightness-100",
  ].join(" "),
  secondary: [
    "bg-[var(--hc-surface-raised)] text-[var(--hc-text)]",
    "border border-[var(--hc-border)]",
    "hover:bg-[var(--hc-surface-overlay)]",
    "active:bg-[var(--hc-surface)]",
    "disabled:opacity-40 disabled:cursor-not-allowed",
  ].join(" "),
  ghost: [
    "bg-transparent text-[var(--hc-text-muted)]",
    "hover:bg-[var(--hc-surface-raised)] hover:text-[var(--hc-text)]",
    "active:bg-[var(--hc-surface)]",
    "disabled:opacity-40 disabled:cursor-not-allowed",
  ].join(" "),
  danger: [
    "bg-[var(--hc-help-red)] text-white",
    "hover:bg-[var(--hc-help-red-deep)]",
    "active:brightness-90",
    "disabled:opacity-40 disabled:cursor-not-allowed",
  ].join(" "),
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "min-h-[var(--hc-touch-min)] px-[var(--hc-space-4)] py-[var(--hc-space-2)] text-[var(--hc-text-sm)] rounded-[var(--hc-radius-md)]",
  md: "min-h-[var(--hc-touch-lg)] px-[var(--hc-space-6)] py-[var(--hc-space-3)] text-[var(--hc-text-base)] rounded-[var(--hc-radius-lg)]",
  lg: "min-h-[var(--hc-touch-lg)] px-[var(--hc-space-8)] py-[var(--hc-space-4)] text-[var(--hc-text-lg)] rounded-[var(--hc-radius-xl)]",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  children,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={[
        "inline-flex items-center justify-center gap-[var(--hc-space-2)]",
        "font-medium select-none",
        "transition-all",
        "cursor-pointer",
        variantStyles[variant],
        sizeStyles[size],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        transitionDuration: "var(--hc-duration-normal)",
        transitionTimingFunction: "var(--hc-ease-out)",
      }}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? (
        <>
          <span
            className="inline-block h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin"
            aria-hidden="true"
          />
          <span className="sr-only">Loading</span>
          {children}
        </>
      ) : (
        children
      )}
    </button>
  );
}
