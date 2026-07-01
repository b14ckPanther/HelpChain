/**
 * HelpCategorySheet
 * Premium mobile bottom sheet for selecting a help category.
 * Animated entrance/exit, keyboard accessible, large touch targets.
 */

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Navigation, BookOpen, ArrowUpFromLine, HelpCircle, Check } from "lucide-react";
import type { HelpCategory, CategoryOption } from "./requester-types";
import { REQUESTER_COPY } from "./requester-copy";
import { IconButton } from "@/components/ui";
import { useAccessibleDialog } from "@/hooks/use-accessible-dialog";

const CATEGORIES: CategoryOption[] = [
  {
    id: "navigation",
    title: REQUESTER_COPY.category.navigation.title,
    description: REQUESTER_COPY.category.navigation.description,
    iconName: "navigation",
  },
  {
    id: "read_text",
    title: REQUESTER_COPY.category.read_text.title,
    description: REQUESTER_COPY.category.read_text.description,
    iconName: "read_text",
  },
  {
    id: "reach_shelf",
    title: REQUESTER_COPY.category.reach_shelf.title,
    description: REQUESTER_COPY.category.reach_shelf.description,
    iconName: "reach_shelf",
  },
  {
    id: "other",
    title: REQUESTER_COPY.category.other.title,
    description: REQUESTER_COPY.category.other.description,
    iconName: "other",
  },
];

const CATEGORY_ICONS: Record<string, React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>> = {
  navigation: Navigation,
  read_text: BookOpen,
  reach_shelf: ArrowUpFromLine,
  other: HelpCircle,
};

interface HelpCategorySheetProps {
  isOpen: boolean;
  selectedCategory: HelpCategory | null;
  onSelect: (category: HelpCategory) => void;
  onClose: () => void;
}

export function HelpCategorySheet({
  isOpen,
  selectedCategory,
  onSelect,
  onClose,
}: HelpCategorySheetProps) {
  const { dialogRef } = useAccessibleDialog({
    isOpen,
    onClose,
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Sheet */}
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="category-sheet-title"
            tabIndex={-1}
            className={[
              "fixed inset-x-0 bottom-0 z-50",
              "bg-[var(--hc-surface)] border-t border-[var(--hc-border)]",
              "rounded-t-[var(--hc-radius-2xl)]",
              "max-h-[85vh] overflow-y-auto",
            ].join(" ")}
            style={{
              paddingBottom: "max(var(--hc-space-6), env(safe-area-inset-bottom))",
            }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            {/* Handle bar */}
            <div className="flex justify-center pt-[var(--hc-space-3)]" aria-hidden="true">
              <div className="w-10 h-1 rounded-full bg-[var(--hc-text-subtle)] opacity-40" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-[var(--hc-space-5)] pt-[var(--hc-space-4)] pb-[var(--hc-space-2)]">
              <h2 id="category-sheet-title" className="text-[var(--hc-text-xl)] font-bold text-[var(--hc-text)]">
                {REQUESTER_COPY.category.sheetTitle}
              </h2>
              <IconButton
                label="Close category selection"
                variant="ghost"
                size="sm"
                onClick={onClose}
              >
                <X size={20} strokeWidth={2} />
              </IconButton>
            </div>

            {/* Category options */}
            <ul
              className="flex flex-col gap-[var(--hc-space-2)] px-[var(--hc-space-5)] pt-[var(--hc-space-2)] pb-[var(--hc-space-4)]"
              role="listbox"
              aria-label="Help categories"
            >
              {CATEGORIES.map((cat) => {
                const Icon = CATEGORY_ICONS[cat.iconName];
                const isSelected = selectedCategory === cat.id;

                return (
                  <li key={cat.id} role="option" aria-selected={isSelected}>
                    <button
                      type="button"
                      onClick={() => onSelect(cat.id)}
                      className={[
                        "w-full flex items-center gap-[var(--hc-space-4)]",
                        "min-h-[72px] px-[var(--hc-space-4)] py-[var(--hc-space-3)]",
                        "rounded-[var(--hc-radius-lg)]",
                        "text-left cursor-pointer select-none",
                        "transition-colors",
                        "border",
                        isSelected
                          ? "bg-[var(--hc-surface-raised)] border-[var(--hc-violet)] text-[var(--hc-text)]"
                          : "bg-transparent border-[var(--hc-border-subtle)] text-[var(--hc-text)] hover:bg-[var(--hc-surface-raised)]",
                      ].join(" ")}
                      style={{
                        transitionDuration: "var(--hc-duration-fast)",
                      }}
                    >
                      {/* Icon */}
                      <span
                        className={[
                          "flex items-center justify-center shrink-0",
                          "w-11 h-11 rounded-[var(--hc-radius-md)]",
                          isSelected
                            ? "bg-[var(--hc-violet-muted)] text-[var(--hc-violet)]"
                            : "bg-[var(--hc-surface-overlay)] text-[var(--hc-text-muted)]",
                        ].join(" ")}
                        aria-hidden="true"
                      >
                        <Icon size={20} strokeWidth={1.75} />
                      </span>

                      {/* Text */}
                      <span className="flex-1 min-w-0">
                        <span className="block text-[var(--hc-text-base)] font-medium">
                          {cat.title}
                        </span>
                        <span className="block text-[var(--hc-text-sm)] text-[var(--hc-text-muted)] leading-snug mt-0.5">
                          {cat.description}
                        </span>
                      </span>

                      {/* Selection indicator — not color-only */}
                      {isSelected && (
                        <span
                          className="flex items-center justify-center shrink-0 w-6 h-6 rounded-full bg-[var(--hc-violet)] text-white"
                          aria-hidden="true"
                        >
                          <Check size={14} strokeWidth={2.5} />
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
