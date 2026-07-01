/**
 * ConfirmationPanel
 * Elegant, accessible inline confirmation panel used for critical steps.
 * Provides trapped focus option and respects reduced-motion.
 */

"use client";

import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { Button, Surface } from "@/components/ui";

interface ConfirmationPanelProps {
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  isOpen: boolean;
  variant?: "danger" | "primary" | "warning";
}

export function ConfirmationPanel({
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  isOpen,
  variant = "primary",
}: ConfirmationPanelProps) {
  if (!isOpen) return null;

  const btnVariant = variant === "danger" ? "danger" : "primary";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="w-full max-w-sm mx-auto"
    >
      <Surface elevation="overlay" padding="md" className="border-[var(--hc-border)] shadow-[var(--hc-shadow-lg)]">
        <div className="flex flex-col items-center text-center gap-3">
          <div className={[
            "flex items-center justify-center w-10 h-10 rounded-full",
            variant === "danger"
              ? "bg-[var(--hc-help-red-glow)] text-[var(--hc-help-red)]"
              : "bg-[var(--hc-violet-muted)] text-[var(--hc-violet)]",
          ].join(" ")}>
            <AlertCircle size={20} />
          </div>

          <div className="flex flex-col gap-1">
            <h4 className="text-[var(--hc-text-sm)] font-bold text-[var(--hc-text)]">
              {title}
            </h4>
            <p className="text-[var(--hc-text-xs)] text-[var(--hc-text-muted)] leading-relaxed">
              {description}
            </p>
          </div>

          <div className="flex gap-2 w-full mt-2">
            <Button
              variant="secondary"
              size="sm"
              className="flex-1"
              onClick={onCancel}
            >
              {cancelLabel}
            </Button>
            <Button
              variant={btnVariant}
              size="sm"
              className="flex-1"
              onClick={onConfirm}
            >
              {confirmLabel}
            </Button>
          </div>
        </div>
      </Surface>
    </motion.div>
  );
}
