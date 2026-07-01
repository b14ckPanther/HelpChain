/**
 * SimulatedVoiceInput
 * Simulates voice-to-text input without using the device microphone.
 * Clearly labelled as simulated. Uses an intentional delay before
 * inserting a prepared transcript.
 */

"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff } from "lucide-react";
import { REQUESTER_COPY } from "./requester-copy";

/** Delay before the simulated transcript appears (ms) */
const VOICE_SIM_DELAY = 1300;

interface SimulatedVoiceInputProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
}

export function SimulatedVoiceInput({
  onTranscript,
  disabled = false,
}: SimulatedVoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const copy = REQUESTER_COPY.details;

  const handlePress = useCallback(() => {
    if (isListening || disabled) return;
    setIsListening(true);

    setTimeout(() => {
      onTranscript(REQUESTER_COPY.demoVoiceTranscript);
      setIsListening(false);
    }, VOICE_SIM_DELAY);
  }, [isListening, disabled, onTranscript]);

  return (
    <div className="flex flex-col items-center gap-[var(--hc-space-2)]">
      <button
        type="button"
        onClick={handlePress}
        disabled={disabled || isListening}
        className={[
          "flex items-center justify-center",
          "w-14 h-14 rounded-full",
          "cursor-pointer select-none",
          "transition-colors",
          "border",
          isListening
            ? "bg-[var(--hc-help-red)] border-[var(--hc-help-red)] text-white"
            : "bg-[var(--hc-surface-raised)] border-[var(--hc-border)] text-[var(--hc-text-muted)] hover:text-[var(--hc-text)] hover:bg-[var(--hc-surface-overlay)]",
          "disabled:opacity-40 disabled:cursor-not-allowed",
        ].join(" ")}
        style={{
          transitionDuration: "var(--hc-duration-normal)",
        }}
        aria-label={isListening ? copy.voiceListening : copy.voiceReady}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isListening ? (
            <motion.span
              key="listening"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MicOff size={22} strokeWidth={1.75} aria-hidden="true" />
            </motion.span>
          ) : (
            <motion.span
              key="ready"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Mic size={22} strokeWidth={1.75} aria-hidden="true" />
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* Status text */}
      <p
        className="text-[var(--hc-text-xs)] text-[var(--hc-text-subtle)] text-center"
        aria-live="polite"
      >
        {isListening ? copy.voiceListening : copy.voiceLabel}
      </p>

      {/* Disclaimer */}
      <p className="text-[var(--hc-text-xs)] text-[var(--hc-text-subtle)] opacity-60 text-center">
        {copy.voiceDisclaimer}
      </p>
    </div>
  );
}
