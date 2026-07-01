"use client";

import {
  CheckCircle2,
  AlertTriangle,
  Info,
  XCircle,
} from "lucide-react";
import { Surface, SectionLabel } from "@/components/ui";
import { DIRECTOR_COPY } from "./director-copy";
import type { DirectorEventLogEntry, DirectorEventTone } from "./director-types";

interface DirectorEventLogProps {
  events: DirectorEventLogEntry[];
}

function formatEventTime(iso: string) {
  const date = new Date(iso);
  const now = Date.now();
  const diffMs = now - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function toneIcon(tone: DirectorEventTone) {
  switch (tone) {
    case "success":
      return CheckCircle2;
    case "warning":
      return AlertTriangle;
    case "critical":
      return XCircle;
    default:
      return Info;
  }
}

function toneClass(tone: DirectorEventTone) {
  switch (tone) {
    case "success":
      return "text-[var(--hc-success)]";
    case "warning":
      return "text-[var(--hc-warning)]";
    case "critical":
      return "text-[var(--hc-help-red)]";
    default:
      return "text-[var(--hc-violet)]";
  }
}

export function DirectorEventLog({ events }: DirectorEventLogProps) {
  const orderedEvents = [...events].reverse();

  return (
    <Surface elevation="raised" padding="lg" as="section" aria-labelledby="director-timeline-heading">
      <SectionLabel as="h2" id="director-timeline-heading" size="sm" className="mb-[var(--hc-space-4)]">
        {DIRECTOR_COPY.sections.timeline}
      </SectionLabel>

      {orderedEvents.length === 0 ? (
        <p className="text-[var(--hc-text-sm)] text-[var(--hc-text-muted)]">
          Demo events will appear here as the presentation runs.
        </p>
      ) : (
        <ol className="flex flex-col gap-[var(--hc-space-2)] max-h-[420px] overflow-y-auto pr-1" role="list">
          {orderedEvents.map((event) => {
            const Icon = toneIcon(event.tone);
            return (
              <li
                key={event.id}
                className="grid grid-cols-[auto_1fr_auto] items-start gap-[var(--hc-space-3)] rounded-[var(--hc-radius-md)] border border-[var(--hc-border-subtle)] bg-[var(--hc-surface)] px-[var(--hc-space-4)] py-[var(--hc-space-3)]"
              >
                <Icon
                  size={18}
                  className={`shrink-0 mt-0.5 ${toneClass(event.tone)}`}
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-[var(--hc-text-sm)] text-[var(--hc-text)] leading-relaxed">{event.message}</p>
                  <p className="sr-only">
                    {event.message} at {new Date(event.createdAt).toLocaleString()}
                  </p>
                </div>
                <time
                  className="text-[var(--hc-text-xs)] text-[var(--hc-text-subtle)] tabular-nums whitespace-nowrap pt-0.5"
                  dateTime={event.createdAt}
                >
                  {formatEventTime(event.createdAt)}
                </time>
              </li>
            );
          })}
        </ol>
      )}

      <div className="sr-only" aria-live="polite" aria-atomic="false">
        {orderedEvents[0]?.message}
      </div>
    </Surface>
  );
}
