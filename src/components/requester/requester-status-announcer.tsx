/**
 * RequesterStatusAnnouncer
 * Accessible live region for announcing state changes to screen readers.
 * Uses aria-live="assertive" for critical status updates.
 */

"use client";

import { useEffect, useState } from "react";

interface RequesterStatusAnnouncerProps {
  message: string;
}

export function RequesterStatusAnnouncer({ message }: RequesterStatusAnnouncerProps) {
  const [announced, setAnnounced] = useState("");

  useEffect(() => {
    if (message) {
      // Brief delay ensures the live region update is picked up
      const timer = setTimeout(() => setAnnounced(message), 100);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div
      role="status"
      aria-live="assertive"
      aria-atomic="true"
      className="sr-only"
    >
      {announced}
    </div>
  );
}
