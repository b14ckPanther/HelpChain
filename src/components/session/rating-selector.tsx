/**
 * RatingSelector
 * Highly accessible 1-5 rating selector.
 * Combines visible numeric labels, star icons, and distinct outline selected states.
 */

"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui";
import { SESSION_COPY } from "./session-copy";

interface RatingSelectorProps {
  onSubmit: (rating: number) => void;
  disabled?: boolean;
}

export function RatingSelector({ onSubmit, disabled = false }: RatingSelectorProps) {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const copy = SESSION_COPY.rating;

  const handleSubmit = () => {
    if (selectedRating !== null && !disabled) {
      onSubmit(selectedRating);
      setIsSubmitted(true);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-4" role="status">
        <p className="text-[var(--hc-text-sm)] font-bold text-[var(--hc-success)]">
          {copy.thanks}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="text-center">
        <h3 className="text-[var(--hc-text-base)] font-bold text-[var(--hc-text)]">
          {copy.heading}
        </h3>
        <p className="text-[var(--hc-text-xs)] text-[var(--hc-text-subtle)] mt-1">
          {copy.subheading}
        </p>
      </div>

      {/* 1-5 rating button row */}
      <div
        className="flex items-center justify-between gap-2 max-w-xs mx-auto w-full"
        role="radiogroup"
        aria-label="Help experience rating 1 to 5 stars"
      >
        {[1, 2, 3, 4, 5].map((value) => {
          const isSelected = selectedRating === value;
          const label = copy.ratingButtonLabel(value);

          return (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={label}
              disabled={disabled}
              onClick={() => setSelectedRating(value)}
              className={[
                "flex flex-col items-center justify-center gap-1.5",
                "w-12 h-14 rounded-[var(--hc-radius-md)] border",
                "cursor-pointer select-none transition-all",
                "focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-white",
                isSelected
                  ? "bg-[var(--hc-violet)] border-[var(--hc-violet)] text-white scale-[1.05] ring-2 ring-offset-2 ring-[var(--hc-violet)] ring-offset-[var(--hc-surface)]"
                  : "bg-[var(--hc-surface-raised)] border-[var(--hc-border)] text-[var(--hc-text-muted)] hover:border-[var(--hc-text-subtle)]",
                "disabled:opacity-40 disabled:cursor-not-allowed",
              ].join(" ")}
            >
              {/* Star Icon */}
              <Star
                size={16}
                fill={isSelected ? "currentColor" : "none"}
                className={isSelected ? "text-white" : "text-[var(--hc-text-subtle)]"}
                aria-hidden="true"
              />
              {/* Visible numeric label */}
              <span className="text-[var(--hc-text-sm)] font-bold">{value}</span>
            </button>
          );
        })}
      </div>

      <div className="flex justify-center pt-2">
        <Button
          variant="primary"
          size="md"
          className="w-full max-w-[200px]"
          disabled={selectedRating === null || disabled}
          onClick={handleSubmit}
        >
          {copy.submit}
        </Button>
      </div>
    </div>
  );
}
