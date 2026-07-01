"use client";

import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { Surface, Button } from "@/components/ui";
import { useAccessibleDialog } from "@/hooks/use-accessible-dialog";
import { DIRECTOR_COPY } from "./director-copy";

interface DirectorResetDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function DirectorResetDialog({
  open,
  onConfirm,
  onCancel,
  isSubmitting = false,
}: DirectorResetDialogProps) {
  const { dialogRef } = useAccessibleDialog({
    isOpen: open,
    onClose: onCancel,
    closeOnEscape: !isSubmitting,
  });

  if (!open) return null;

  const copy = DIRECTOR_COPY.dialogs.reset;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="director-reset-title"
    >
      <div className="absolute inset-0" onClick={onCancel} aria-hidden="true" />

      <motion.div
        ref={dialogRef}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.18 }}
        className="w-full max-w-md relative"
        tabIndex={-1}
      >
        <Surface elevation="overlay" padding="lg" className="flex flex-col gap-[var(--hc-space-4)]">
          <div className="flex items-start gap-[var(--hc-space-3)]">
            <div
              className="flex items-center justify-center w-11 h-11 rounded-full bg-[var(--hc-help-red)]/15 text-[var(--hc-help-red)] shrink-0"
              aria-hidden="true"
            >
              <AlertTriangle size={22} strokeWidth={1.75} />
            </div>
            <div>
              <h2 id="director-reset-title" className="text-[var(--hc-text-lg)] font-bold text-[var(--hc-text)]">
                {copy.title}
              </h2>
              <p className="text-[var(--hc-text-sm)] text-[var(--hc-text-muted)] mt-2 leading-relaxed">{copy.body}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-[var(--hc-space-2)]">
            <Button
              variant="danger"
              size="md"
              className="w-full min-h-[var(--hc-touch-min)]"
              onClick={onConfirm}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Resetting..." : copy.confirm}
            </Button>
            <Button
              variant="secondary"
              size="md"
              className="w-full min-h-[var(--hc-touch-min)]"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              {copy.cancel}
            </Button>
          </div>
        </Surface>
      </motion.div>
    </div>
  );
}
