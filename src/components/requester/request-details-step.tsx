/**
 * RequestDetailsStep
 * Focused request details experience after category selection.
 * Text description, simulated voice input, demo location, submit action.
 */

"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { MapPin, ChevronLeft, BookOpen, Navigation, ArrowUpFromLine, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui";
import { SimulatedVoiceInput } from "./simulated-voice-input";
import { REQUESTER_COPY } from "./requester-copy";
import type { HelpCategory } from "./requester-types";

const CATEGORY_DISPLAY: Record<HelpCategory, { title: string; Icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }> }> = {
  navigation: { title: REQUESTER_COPY.category.navigation.title, Icon: Navigation },
  read_text: { title: REQUESTER_COPY.category.read_text.title, Icon: BookOpen },
  reach_shelf: { title: REQUESTER_COPY.category.reach_shelf.title, Icon: ArrowUpFromLine },
  other: { title: REQUESTER_COPY.category.other.title, Icon: HelpCircle },
};

interface RequestDetailsStepProps {
  category: HelpCategory;
  locationLabel: string;
  onBack: () => void;
  onEditCategory: () => void;
  onSubmit: (description: string) => void;
  connected: boolean;
}

export function RequestDetailsStep({
  category,
  locationLabel,
  onBack,
  onEditCategory,
  onSubmit,
  connected,
}: RequestDetailsStepProps) {
  const [description, setDescription] = useState("");
  const copy = REQUESTER_COPY.details;
  const catDisplay = CATEGORY_DISPLAY[category];

  const handleSubmit = useCallback(() => {
    if (description.trim()) {
      onSubmit(description.trim());
    }
  }, [description, onSubmit]);

  const handleVoiceTranscript = useCallback((text: string) => {
    setDescription(text);
  }, []);

  const canSubmit = description.trim().length > 0;

  return (
    <motion.div
      className="flex flex-col flex-1 px-[var(--hc-space-5)]"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Header with back */}
      <div className="flex items-center gap-[var(--hc-space-2)] pt-[var(--hc-space-4)] pb-[var(--hc-space-6)]">
        <button
          type="button"
          onClick={onBack}
          className={[
            "flex items-center justify-center",
            "w-[var(--hc-touch-min)] h-[var(--hc-touch-min)]",
            "rounded-[var(--hc-radius-md)]",
            "text-[var(--hc-text-muted)] hover:text-[var(--hc-text)]",
            "hover:bg-[var(--hc-surface-raised)]",
            "cursor-pointer transition-colors",
          ].join(" ")}
          style={{ transitionDuration: "var(--hc-duration-fast)" }}
          aria-label="Go back"
        >
          <ChevronLeft size={22} strokeWidth={2} />
        </button>
        <h2 className="text-[var(--hc-text-lg)] font-bold text-[var(--hc-text)]">
          {copy.heading}
        </h2>
      </div>

      {/* Category summary */}
      <div className="flex items-center justify-between mb-[var(--hc-space-5)]">
        <div className="flex items-center gap-[var(--hc-space-3)]">
          <span
            className="flex items-center justify-center w-9 h-9 rounded-[var(--hc-radius-md)] bg-[var(--hc-violet-muted)] text-[var(--hc-violet)]"
            aria-hidden="true"
          >
            <catDisplay.Icon size={18} strokeWidth={1.75} />
          </span>
          <span className="text-[var(--hc-text-base)] font-medium text-[var(--hc-text)]">
            {catDisplay.title}
          </span>
        </div>
        <button
          type="button"
          onClick={onEditCategory}
          className={[
            "text-[var(--hc-text-sm)] text-[var(--hc-violet)]",
            "hover:underline cursor-pointer",
            "min-h-[var(--hc-touch-min)] flex items-center px-[var(--hc-space-2)]",
          ].join(" ")}
        >
          {copy.editCategory}
        </button>
      </div>

      {/* Description textarea */}
      <div className="mb-[var(--hc-space-5)]">
        <label
          htmlFor="request-description"
          className="block text-[var(--hc-text-sm)] text-[var(--hc-text-muted)] mb-[var(--hc-space-2)]"
        >
          Description
        </label>
        <textarea
          id="request-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={copy.descriptionPlaceholder}
          rows={3}
          className={[
            "w-full resize-none",
            "bg-[var(--hc-surface-raised)] text-[var(--hc-text)]",
            "border border-[var(--hc-border)]",
            "rounded-[var(--hc-radius-lg)]",
            "px-[var(--hc-space-4)] py-[var(--hc-space-3)]",
            "text-[var(--hc-text-base)] hc-input-base",
            "placeholder:text-[var(--hc-text-subtle)]",
            "focus:border-[var(--hc-violet)] focus:outline-none focus:ring-2 focus:ring-[var(--hc-violet)] focus:ring-opacity-30",
            "transition-colors",
          ].join(" ")}
          style={{
            transitionDuration: "var(--hc-duration-fast)",
          }}
        />
      </div>

      {/* Simulated voice */}
      <div className="flex justify-center mb-[var(--hc-space-6)]">
        <SimulatedVoiceInput onTranscript={handleVoiceTranscript} />
      </div>

      {/* Demo location — read-only */}
      <div
        className={[
          "flex items-center gap-[var(--hc-space-3)]",
          "px-[var(--hc-space-4)] py-[var(--hc-space-3)]",
          "rounded-[var(--hc-radius-lg)]",
          "bg-[var(--hc-surface)] border border-[var(--hc-border-subtle)]",
          "mb-[var(--hc-space-8)]",
        ].join(" ")}
      >
        <MapPin size={16} strokeWidth={1.75} className="text-[var(--hc-text-subtle)] shrink-0" aria-hidden="true" />
        <div className="flex-1 min-w-0">
          <p className="text-[var(--hc-text-xs)] text-[var(--hc-text-subtle)]">
            {copy.locationLabel}
          </p>
          <p className="text-[var(--hc-text-sm)] text-[var(--hc-text)]">
            {locationLabel}
          </p>
        </div>
      </div>

      {/* Submit */}
      <div className="mt-auto pb-[var(--hc-space-6)]">
        <Button
          variant="danger"
          size="lg"
          className="w-full"
          disabled={!canSubmit || !connected}
          onClick={handleSubmit}
        >
          {connected ? copy.submitButton : "Disconnected from server"}
        </Button>
      </div>
    </motion.div>
  );
}
