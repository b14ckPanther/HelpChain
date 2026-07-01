"use client";

import { useEffect, useRef, useCallback } from "react";

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface UseAccessibleDialogOptions {
  isOpen: boolean;
  onClose: () => void;
  /** When false, Escape will not close (e.g. destructive confirmations mid-submit) */
  closeOnEscape?: boolean;
  /** Element to restore focus to when dialog closes */
  triggerRef?: React.RefObject<HTMLElement | null>;
}

export function useAccessibleDialog({
  isOpen,
  onClose,
  closeOnEscape = true,
  triggerRef,
}: UseAccessibleDialogOptions) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!closeOnEscape || event.key !== "Escape") return;
      event.preventDefault();
      onClose();
    },
    [closeOnEscape, onClose]
  );

  useEffect(() => {
    if (!isOpen) return;

    previousFocusRef.current =
      triggerRef?.current ?? (document.activeElement as HTMLElement | null);

    const restoreOnClose = triggerRef?.current ?? previousFocusRef.current;

    const dialog = dialogRef.current;
    if (!dialog) return;

    document.addEventListener("keydown", handleKeyDown);

    const focusable = dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
    const first = focusable[0];
    if (first) {
      first.focus();
    } else {
      dialog.focus();
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      restoreOnClose?.focus();
    };
  }, [isOpen, handleKeyDown, triggerRef]);

  return { dialogRef };
}
