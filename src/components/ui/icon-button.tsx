/**
 * IconButton
 * Circular or rounded icon-only button with mandatory accessible label.
 * Minimum 44x44 touch target.
 */

import React from "react";

type IconButtonVariant = "default" | "ghost" | "danger";
type IconButtonSize = "sm" | "md" | "lg";

interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Required accessible label — icon buttons must be named */
  label: string;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  loading?: boolean;
  children: React.ReactNode;
}

const variantStyles: Record<IconButtonVariant, string> = {
  default: [
    "bg-[var(--hc-surface-raised)] text-[var(--hc-text-muted)]",
    "border border-[var(--hc-border)]",
    "hover:bg-[var(--hc-surface-overlay)] hover:text-[var(--hc-text)]",
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

const sizeValues: Record<IconButtonSize, string> = {
  sm: "min-w-[var(--hc-touch-min)] min-h-[var(--hc-touch-min)] p-[var(--hc-space-2)]",
  md: "min-w-[var(--hc-touch-lg)] min-h-[var(--hc-touch-lg)] p-[var(--hc-space-3)]",
  lg: "min-w-[4rem] min-h-[4rem] p-[var(--hc-space-4)]",
};

export function IconButton({
  label,
  variant = "default",
  size = "md",
  loading = false,
  disabled,
  children,
  className = "",
  ...props
}: IconButtonProps) {
  return (
    <button
      className={[
        "inline-flex items-center justify-center",
        "rounded-[var(--hc-radius-full)]",
        "select-none cursor-pointer",
        "transition-all",
        variantStyles[variant],
        sizeValues[size],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        transitionDuration: "var(--hc-duration-normal)",
        transitionTimingFunction: "var(--hc-ease-out)",
      }}
      disabled={disabled || loading}
      aria-label={label}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? (
        <span
          className="inline-block h-5 w-5 rounded-full border-2 border-current border-t-transparent animate-spin"
          aria-hidden="true"
        />
      ) : (
        children
      )}
    </button>
  );
}
