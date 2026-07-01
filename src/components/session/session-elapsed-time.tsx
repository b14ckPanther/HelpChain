/**
 * SessionElapsedTime
 * Displays a synchronized elapsed-time counter derived from a server-side timestamp.
 * Updates periodically without pressure-inducing countdown warnings.
 */

"use client";

import { useEffect, useState } from "react";

interface SessionElapsedTimeProps {
  startTimestamp: string | null;
}

export function SessionElapsedTime({ startTimestamp }: SessionElapsedTimeProps) {
  const [elapsed, setElapsed] = useState("00:00");

  useEffect(() => {
    if (!startTimestamp) return;

    const startTime = new Date(startTimestamp).getTime();

    const updateTimer = () => {
      const diff = Math.max(0, Date.now() - startTime);
      const totalSecs = Math.floor(diff / 1000);
      const mins = Math.floor(totalSecs / 60);
      const secs = totalSecs % 60;
      
      const formatNum = (num: number) => String(num).padStart(2, "0");
      setElapsed(`${formatNum(mins)}:${formatNum(secs)}`);
    };

    updateTimer(); // run once immediately
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [startTimestamp]);

  if (!startTimestamp) return null;

  return (
    <div className="flex items-center justify-center gap-1.5" role="timer" aria-label="Help session active duration">
      <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--hc-violet)] animate-pulse" aria-hidden="true" />
      <span className="text-[var(--hc-text-xs)] font-mono text-[var(--hc-violet)] tracking-wider uppercase font-semibold">
        Session active · {elapsed}
      </span>
    </div>
  );
}
