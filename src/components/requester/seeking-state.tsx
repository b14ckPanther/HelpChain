/**
 * SeekingState
 * Visually impressive seeking/searching screen.
 * Abstract radar visualization + status text + cancel action.
 * Clearly marked as demo/simulated.
 */

"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Radio, AlertTriangle } from "lucide-react";
import { Button, Surface, StatusPill } from "@/components/ui";
import { RadarVisual } from "./radar-visual";
import { REQUESTER_COPY } from "./requester-copy";

interface SeekingStateProps {
  onCancel: () => void;
}

export function SeekingState({ onCancel }: SeekingStateProps) {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const copy = REQUESTER_COPY.seeking;

  const handleCancelRequest = useCallback(() => {
    setShowCancelConfirm(true);
  }, []);

  const handleConfirmCancel = useCallback(() => {
    setShowCancelConfirm(false);
    onCancel();
  }, [onCancel]);

  const handleDismissCancel = useCallback(() => {
    setShowCancelConfirm(false);
  }, []);

  return (
    <motion.div
      className="flex flex-col flex-1 items-center px-[var(--hc-space-5)]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Status pills */}
      <div className="flex flex-col items-center gap-[var(--hc-space-3)] pt-[var(--hc-space-6)]">
        <StatusPill variant="info" pulse>
          <Radio size={12} strokeWidth={2} className="mr-1" aria-hidden="true" />
          {copy.searchingLabel}
        </StatusPill>
      </div>

      {/* Radar + headline */}
      <div className="flex flex-col flex-1 items-center justify-center gap-[var(--hc-space-6)] w-full max-w-xs">
        <RadarVisual />

        <div className="flex flex-col items-center gap-[var(--hc-space-3)] text-center">
          <h1 className="text-[var(--hc-text-xl)] sm:text-[var(--hc-text-2xl)] font-bold text-[var(--hc-text)]">
            {copy.headline}
          </h1>
          <p className="text-[var(--hc-text-sm)] text-[var(--hc-text-muted)] leading-relaxed">
            {copy.subline}
          </p>
          <p className="text-[var(--hc-text-xs)] text-[var(--hc-text-subtle)]">
            {copy.responseHint}
          </p>
        </div>
      </div>

      {/* Match preview placeholder */}
      <Surface elevation="base" padding="sm" className="w-full mb-[var(--hc-space-4)] text-center">
        <p className="text-[var(--hc-text-sm)] text-[var(--hc-text-subtle)] italic">
          {copy.matchPreview}
        </p>
      </Surface>

      {/* Reassurance + cancel */}
      <div className="flex flex-col items-center gap-[var(--hc-space-4)] pb-[var(--hc-space-8)] w-full">
        <p className="text-[var(--hc-text-xs)] text-[var(--hc-text-subtle)]">
          {copy.reassurance}
        </p>
        <button
          type="button"
          onClick={handleCancelRequest}
          className={[
            "text-[var(--hc-text-sm)] text-[var(--hc-text-muted)]",
            "hover:text-[var(--hc-help-red)]",
            "min-h-[var(--hc-touch-min)] px-[var(--hc-space-4)]",
            "cursor-pointer transition-colors",
          ].join(" ")}
          style={{ transitionDuration: "var(--hc-duration-fast)" }}
        >
          {copy.cancelButton}
        </button>
      </div>

      {/* Cancel confirmation overlay */}
      <AnimatePresence>
        {showCancelConfirm && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleDismissCancel}
              aria-hidden="true"
            />
            <motion.div
              role="alertdialog"
              aria-modal="true"
              aria-label={copy.cancelConfirmTitle}
              aria-describedby="cancel-confirm-message"
              className={[
                "fixed inset-x-0 bottom-0 z-50",
                "bg-[var(--hc-surface)] border-t border-[var(--hc-border)]",
                "rounded-t-[var(--hc-radius-2xl)]",
                "px-[var(--hc-space-5)] pt-[var(--hc-space-6)]",
              ].join(" ")}
              style={{
                paddingBottom: "max(var(--hc-space-6), env(safe-area-inset-bottom))",
              }}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              <div className="flex flex-col items-center gap-[var(--hc-space-4)]">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[var(--hc-warning-muted)]">
                  <AlertTriangle size={24} strokeWidth={1.75} className="text-[var(--hc-warning)]" />
                </div>
                <h3 className="text-[var(--hc-text-lg)] font-bold text-[var(--hc-text)]">
                  {copy.cancelConfirmTitle}
                </h3>
                <p
                  id="cancel-confirm-message"
                  className="text-[var(--hc-text-sm)] text-[var(--hc-text-muted)] text-center leading-relaxed"
                >
                  {copy.cancelConfirmMessage}
                </p>
                <div className="flex gap-[var(--hc-space-3)] w-full pt-[var(--hc-space-2)]">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="flex-1"
                    onClick={handleDismissCancel}
                  >
                    {copy.cancelConfirmNo}
                  </Button>
                  <Button
                    variant="danger"
                    size="lg"
                    className="flex-1"
                    onClick={handleConfirmCancel}
                  >
                    {copy.cancelConfirmYes}
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Simulated proximity label */}
      <div className="fixed bottom-2 left-0 right-0 flex justify-center pointer-events-none z-30" aria-hidden="true">
        <span className="text-[10px] text-[var(--hc-text-subtle)] opacity-50">
          {copy.nearbyLabel}
        </span>
      </div>
    </motion.div>
  );
}
