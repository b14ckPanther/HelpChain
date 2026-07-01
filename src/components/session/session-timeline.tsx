/**
 * SessionTimeline
 * Accessible, responsive horizontal/vertical timeline for help sessions.
 * Communicates progress through text, layout, and check icons.
 */

"use client";

import { Check } from "lucide-react";
import { SESSION_COPY } from "./session-copy";

interface SessionTimelineProps {
  status: "matched" | "in_progress" | "awaiting_requester_confirmation" | "completed";
}

export function SessionTimeline({ status }: SessionTimelineProps) {
  const steps = [
    {
      id: "accepted",
      label: SESSION_COPY.timeline.step1,
      completed: true,
      active: status === "matched",
    },
    {
      id: "arrived",
      label: SESSION_COPY.timeline.step2,
      completed: status !== "matched",
      active: status === "in_progress",
    },
    {
      id: "confirmed",
      label: SESSION_COPY.timeline.step3,
      completed: status === "completed",
      active: status === "awaiting_requester_confirmation" || status === "completed",
    },
  ];

  return (
    <div className="w-full py-4 px-2" role="region" aria-label="Help session progress timeline">
      <ol className="flex items-center w-full justify-between gap-1 text-[var(--hc-text-xs)]">
        {steps.map((step, index) => {
          const showConnector = index < steps.length - 1;

          return (
            <li key={step.id} className="flex items-center gap-1.5 flex-1 last:flex-initial">
              <div className="flex flex-col items-center gap-1">
                {/* Indicator circle */}
                <div
                  className={[
                    "flex items-center justify-center w-6 h-6 rounded-full border text-[var(--hc-text-xs)] font-bold shrink-0 transition-colors",
                    step.active
                      ? "border-[var(--hc-violet)] bg-[var(--hc-violet-muted)] text-[var(--hc-violet)]"
                      : step.completed
                      ? "border-[var(--hc-success)] bg-[var(--hc-success-muted)] text-[var(--hc-success)]"
                      : "border-[var(--hc-border)] bg-[var(--hc-surface)] text-[var(--hc-text-subtle)]",
                  ].join(" ")}
                >
                  {step.completed ? (
                    <Check size={12} strokeWidth={2.5} aria-hidden="true" />
                  ) : (
                    <span aria-hidden="true">{index + 1}</span>
                  )}
                </div>

                {/* Step label */}
                <span
                  className={[
                    "text-[10px] text-center font-medium leading-tight max-w-[4.75rem] sm:max-w-[5.5rem]",
                    step.active
                      ? "text-[var(--hc-text)] font-semibold"
                      : step.completed
                      ? "text-[var(--hc-text-muted)]"
                      : "text-[var(--hc-text-subtle)]",
                  ].join(" ")}
                >
                  {step.label}
                </span>
              </div>

              {/* Timeline Connector Line */}
              {showConnector && (
                <div
                  className={[
                    "h-[2px] flex-1 mb-5 transition-colors duration-300",
                    step.completed && steps[index + 1].completed
                      ? "bg-[var(--hc-success)]"
                      : "bg-[var(--hc-border)]",
                  ].join(" ")}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
