/**
 * CouponCodeEntry
 * Text entry field allowing manual validation code submission.
 */

"use client";

import { useState } from "react";
import { Keyboard, ArrowRight } from "lucide-react";
import { Surface, Button } from "@/components/ui";
import { PARTNER_COPY } from "./partner-copy";

interface CouponCodeEntryProps {
  onRedeemCode: (code: string) => void;
  isSubmitting?: boolean;
}

export function CouponCodeEntry({ onRedeemCode, isSubmitting = false }: CouponCodeEntryProps) {
  const [code, setCode] = useState("");
  const copy = PARTNER_COPY.scanner;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim() && !isSubmitting) {
      onRedeemCode(code.trim());
      setCode("");
    }
  };

  return (
    <Surface
      elevation="base"
      padding="md"
      className="w-full flex flex-col gap-3.5 border border-[var(--hc-border-subtle)] text-left bg-[var(--hc-surface)]"
    >
      <div className="flex items-center gap-1.5 text-[var(--hc-text-xs)] uppercase tracking-wider text-[var(--hc-text-subtle)] font-bold">
        <Keyboard size={14} />
        <span>Manual Code Entry</span>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
        <label htmlFor="partner-coupon-code" className="sr-only">
          Coupon validation code
        </label>
        <input
          id="partner-coupon-code"
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder={copy.inputPlaceholder}
          disabled={isSubmitting}
          autoComplete="off"
          spellCheck={false}
          className={[
            "hc-input-base w-full min-h-[var(--hc-touch-min)] px-3.5 rounded-[var(--hc-radius-md)] border text-left",
            "bg-[var(--hc-canvas)] border-[var(--hc-border)] text-[var(--hc-text)]",
            "font-mono font-bold tracking-wider uppercase",
            "placeholder:font-sans placeholder:normal-case placeholder:font-normal placeholder:text-[var(--hc-text-subtle)]",
          ].join(" ")}
          style={{ transitionDuration: "var(--hc-duration-fast)" }}
        />

        <Button
          type="submit"
          variant="secondary"
          size="md"
          className="w-full flex items-center justify-center gap-2 border-[var(--hc-border)] font-bold"
          disabled={!code.trim() || isSubmitting}
        >
          <span>{copy.redeemBtn}</span>
          <ArrowRight size={14} />
        </Button>
      </form>
    </Surface>
  );
}
