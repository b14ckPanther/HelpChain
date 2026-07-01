"use client";

import { useEffect, useState } from "react";
import { MapPin, User, Route, Clock3 } from "lucide-react";
import { Surface, SectionLabel } from "@/components/ui";
import { DIRECTOR_COPY } from "./director-copy";
import type { DirectorActiveRequestSummary } from "./director-types";

interface ActiveSessionPanelProps {
  session: DirectorActiveRequestSummary | null;
}

function formatElapsed(startIso: string | null, endIso?: string | null) {
  if (!startIso) return null;
  const start = new Date(startIso).getTime();
  const end = endIso ? new Date(endIso).getTime() : Date.now();
  const totalSeconds = Math.max(0, Math.floor((end - start) / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function ActiveSessionPanel({ session }: ActiveSessionPanelProps) {
  const [, setTick] = useState(0);

  useEffect(() => {
    if (!session?.arrivedAt) return;
    const interval = window.setInterval(() => setTick((value) => value + 1), 1000);
    return () => window.clearInterval(interval);
  }, [session?.arrivedAt]);

  const elapsed =
    session?.arrivedAt
      ? formatElapsed(session.arrivedAt)
      : session?.matchedAt
        ? formatElapsed(session.matchedAt)
        : session?.createdAt
          ? formatElapsed(session.createdAt)
          : null;

  return (
    <Surface elevation="raised" padding="lg" as="section" aria-labelledby="director-session-heading">
      <SectionLabel as="h2" id="director-session-heading" size="sm" className="mb-[var(--hc-space-4)]">
        {DIRECTOR_COPY.sections.session}
      </SectionLabel>

      {!session ? (
        <p className="text-[var(--hc-text-sm)] text-[var(--hc-text-muted)]">{DIRECTOR_COPY.session.empty}</p>
      ) : (
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-[var(--hc-space-4)]">
          <SessionField
            icon={Route}
            label={DIRECTOR_COPY.session.status}
            value={
              DIRECTOR_COPY.statusLabels[session.status as keyof typeof DIRECTOR_COPY.statusLabels] ||
              session.status
            }
          />
          <SessionField
            icon={MapPin}
            label={DIRECTOR_COPY.session.category}
            value={session.categoryLabel}
          />
          <SessionField icon={MapPin} label={DIRECTOR_COPY.session.location} value={session.locationLabel} />
          <SessionField
            icon={User}
            label={DIRECTOR_COPY.session.volunteer}
            value={session.volunteerName || "Not assigned"}
          />
          <SessionField
            icon={Route}
            label={DIRECTOR_COPY.session.milestone}
            value={
              DIRECTOR_COPY.milestones[
                session.sessionMilestone as keyof typeof DIRECTOR_COPY.milestones
              ] || session.sessionMilestone
            }
          />
          {elapsed && (
            <SessionField icon={Clock3} label={DIRECTOR_COPY.session.elapsed} value={elapsed} />
          )}
        </dl>
      )}
    </Surface>
  );
}

function SessionField({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Route;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-[var(--hc-space-3)] rounded-[var(--hc-radius-md)] border border-[var(--hc-border-subtle)] bg-[var(--hc-surface)] p-[var(--hc-space-4)]">
      <Icon size={18} className="text-[var(--hc-violet)] shrink-0 mt-0.5" strokeWidth={1.75} aria-hidden="true" />
      <div>
        <dt className="text-[var(--hc-text-xs)] text-[var(--hc-text-subtle)] font-medium">{label}</dt>
        <dd className="text-[var(--hc-text-sm)] font-semibold text-[var(--hc-text)] mt-1">{value}</dd>
      </div>
    </div>
  );
}
