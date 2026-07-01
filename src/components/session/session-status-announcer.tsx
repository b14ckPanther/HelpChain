/**
 * SessionStatusAnnouncer
 * Accessible live region for announcing help session status transitions to screen readers.
 */

"use client";

import { useEffect, useState } from "react";

interface SessionStatusAnnouncerProps {
  message: string;
}

export function SessionStatusAnnouncer({ message }: SessionStatusAnnouncerProps) {
  const [announced, setAnnounced] = useState("");

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setAnnounced(message), 100);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    >
      {announced}
    </div>
  );
}
