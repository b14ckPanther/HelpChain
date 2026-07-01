"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Surface, Button } from "@/components/ui";
import { useAccessibleDialog } from "@/hooks/use-accessible-dialog";
import { DIRECTOR_COPY } from "./director-copy";
import type { DirectorScenario } from "./director-types";

interface DirectorScenarioDialogProps {
  open: boolean;
  scenario: DirectorScenario | null;
  onConfirm: () => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const SCENARIO_COPY = DIRECTOR_COPY.scenarios;

export function DirectorScenarioDialog({
  open,
  scenario,
  onConfirm,
  onCancel,
  isSubmitting = false,
}: DirectorScenarioDialogProps) {
  const { dialogRef } = useAccessibleDialog({
    isOpen: open && Boolean(scenario),
    onClose: onCancel,
    closeOnEscape: !isSubmitting,
  });

  if (!open || !scenario) return null;

  const details = SCENARIO_COPY[scenario];
  if (!details) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="director-scenario-title"
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
              className="flex items-center justify-center w-11 h-11 rounded-full bg-[var(--hc-violet-muted)] text-[var(--hc-violet)] shrink-0"
              aria-hidden="true"
            >
              <Sparkles size={22} strokeWidth={1.75} />
            </div>
            <div>
              <h2 id="director-scenario-title" className="text-[var(--hc-text-lg)] font-bold text-[var(--hc-text)]">
                Prepare {details.title}?
              </h2>
              <p className="text-[var(--hc-text-sm)] text-[var(--hc-text-muted)] mt-2 leading-relaxed">
                {details.purpose}
              </p>
              <p className="text-[var(--hc-text-xs)] text-[var(--hc-text-subtle)] mt-3 leading-relaxed">
                {details.prepared}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-[var(--hc-space-2)]">
            <Button
              variant="primary"
              size="md"
              className="w-full min-h-[var(--hc-touch-min)]"
              onClick={onConfirm}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Preparing..." : DIRECTOR_COPY.dialogs.scenarioPrimary}
            </Button>
            <Button
              variant="secondary"
              size="md"
              className="w-full min-h-[var(--hc-touch-min)]"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              {DIRECTOR_COPY.dialogs.scenarioCancel}
            </Button>
          </div>
        </Surface>
      </motion.div>
    </div>
  );
}
