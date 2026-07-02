"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, XCircle, FileQuestion, Clock } from "lucide-react";
import { Button, Surface, StatusPill, SectionLabel } from "@/components/ui";
import { AUTH_COPY } from "./auth-copy";
import {
  adminReviewVerification,
  getPendingVerifications,
  readVerificationAudit,
  type LandingUserAccount,
  type VerificationAuditEntry,
} from "@/lib/landing-auth-storage";

function formatTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function resultVariant(result: VerificationAuditEntry["result"]) {
  if (result === "accepted") return "success" as const;
  if (result === "rejected") return "danger" as const;
  if (result === "additional_docs_required") return "warning" as const;
  return "info" as const;
}

interface AdminVerificationConsoleProps {
  refreshKey: number;
  onReviewComplete?: () => void;
}

export function AdminVerificationConsole({ refreshKey, onReviewComplete }: AdminVerificationConsoleProps) {
  const [pending, setPending] = useState<LandingUserAccount[]>([]);
  const [audit, setAudit] = useState<VerificationAuditEntry[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState<string | null>(null);

  const refresh = useCallback(() => {
    setPending(getPendingVerifications());
    setAudit(readVerificationAudit());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh, refreshKey]);

  const selected = pending.find((p) => p.id === selectedId) ?? pending[0] ?? null;

  const handleReview = async (decision: "accepted" | "rejected" | "additional_docs_required") => {
    if (!selected) return;
    setLoading(decision);
    await new Promise((r) => setTimeout(r, 500));
    adminReviewVerification(selected.id, decision, note);
    setNote("");
    setSelectedId(null);
    refresh();
    onReviewComplete?.();
    setLoading(null);
  };

  return (
    <section aria-labelledby="admin-console-heading" className="w-full flex flex-col gap-[var(--hc-space-6)]">
      <div>
        <SectionLabel id="admin-console-heading">{AUTH_COPY.admin.title}</SectionLabel>
        <p className="text-[var(--hc-text-sm)] text-[var(--hc-text-muted)] mt-2 max-w-2xl">
          {AUTH_COPY.admin.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[var(--hc-space-4)]">
        <Surface elevation="raised" padding="md" className="flex flex-col gap-[var(--hc-space-4)]">
          <h3 className="text-[var(--hc-text-base)] font-semibold text-[var(--hc-text)] flex items-center gap-2">
            <Clock size={18} className="text-[var(--hc-violet)]" />
            {AUTH_COPY.admin.pendingTitle}
            {pending.length > 0 && (
              <StatusPill variant="warning" pulse>
                {pending.length}
              </StatusPill>
            )}
          </h3>

          {pending.length === 0 ? (
            <p className="text-[var(--hc-text-sm)] text-[var(--hc-text-muted)]">{AUTH_COPY.admin.noPending}</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {pending.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(item.id)}
                    className={[
                      "w-full text-left p-3 rounded-[var(--hc-radius-md)] border transition-colors",
                      selected?.id === item.id
                        ? "border-[var(--hc-violet)] bg-[var(--hc-violet-muted)]"
                        : "border-[var(--hc-border)] hover:border-[var(--hc-violet)]/40",
                    ].join(" ")}
                  >
                    <p className="font-medium text-[var(--hc-text)]">{item.displayName}</p>
                    <p className="text-[var(--hc-text-xs)] text-[var(--hc-text-subtle)] mt-1 font-mono">
                      {item.id}
                    </p>
                    <StatusPill variant="info" className="mt-2">
                      {AUTH_COPY.requesterProfile.status[item.requester!.verificationStatus]}
                    </StatusPill>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {selected?.requester && (
            <div className="border-t border-[var(--hc-border)] pt-4 flex flex-col gap-3">
              <h4 className="text-[var(--hc-text-sm)] font-semibold text-[var(--hc-text)]">
                {AUTH_COPY.admin.documentSection}
              </h4>
              <dl className="grid gap-2 text-[var(--hc-text-sm)]">
                <div>
                  <dt className="text-[var(--hc-text-muted)]">{AUTH_COPY.requesterProfile.disabilityLabel}</dt>
                  <dd className="text-[var(--hc-text)]">{selected.requester.disabilityType}</dd>
                </div>
                <div>
                  <dt className="text-[var(--hc-text-muted)]">{AUTH_COPY.requesterProfile.documentNameLabel}</dt>
                  <dd className="text-[var(--hc-text)]">{selected.requester.verificationDocumentName}</dd>
                </div>
                <div>
                  <dt className="text-[var(--hc-text-muted)]">{AUTH_COPY.requesterProfile.documentDescLabel}</dt>
                  <dd className="text-[var(--hc-text)]">{selected.requester.verificationDocumentDescription}</dd>
                </div>
                <div>
                  <dt className="text-[var(--hc-text-muted)]">Submitted</dt>
                  <dd className="text-[var(--hc-text)]">
                    {selected.requester.verificationSubmittedAt
                      ? formatTime(selected.requester.verificationSubmittedAt)
                      : "—"}
                  </dd>
                </div>
              </dl>

              <label className="flex flex-col gap-1.5">
                <span className="text-[var(--hc-text-sm)] text-[var(--hc-text-muted)]">
                  {AUTH_COPY.admin.reviewNoteLabel}
                </span>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder={AUTH_COPY.admin.reviewNotePlaceholder}
                  className="hc-input min-h-[64px]"
                  rows={2}
                />
              </label>

              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  className="gap-1.5"
                  loading={loading === "accepted"}
                  onClick={() => handleReview("accepted")}
                >
                  <CheckCircle2 size={16} />
                  {AUTH_COPY.admin.actions.accept}
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="gap-1.5"
                  loading={loading === "additional_docs_required"}
                  onClick={() => handleReview("additional_docs_required")}
                >
                  <FileQuestion size={16} />
                  {AUTH_COPY.admin.actions.requestDocs}
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  className="gap-1.5"
                  loading={loading === "rejected"}
                  onClick={() => handleReview("rejected")}
                >
                  <XCircle size={16} />
                  {AUTH_COPY.admin.actions.reject}
                </Button>
              </div>
            </div>
          )}
        </Surface>

        <Surface elevation="raised" padding="md" className="flex flex-col gap-[var(--hc-space-4)] overflow-hidden">
          <h3 className="text-[var(--hc-text-base)] font-semibold text-[var(--hc-text)]">
            {AUTH_COPY.admin.auditTitle}
          </h3>

          {audit.length === 0 ? (
            <p className="text-[var(--hc-text-sm)] text-[var(--hc-text-muted)]">{AUTH_COPY.admin.noAudit}</p>
          ) : (
            <div className="overflow-x-auto -mx-2">
              <table className="w-full text-[var(--hc-text-sm)] min-w-[480px]">
                <thead>
                  <tr className="text-[var(--hc-text-muted)] text-left border-b border-[var(--hc-border)]">
                    <th className="pb-2 px-2 font-medium">{AUTH_COPY.admin.columns.id}</th>
                    <th className="pb-2 px-2 font-medium">{AUTH_COPY.admin.columns.user}</th>
                    <th className="pb-2 px-2 font-medium">{AUTH_COPY.admin.columns.time}</th>
                    <th className="pb-2 px-2 font-medium">{AUTH_COPY.admin.columns.result}</th>
                    <th className="pb-2 px-2 font-medium">{AUTH_COPY.admin.columns.note}</th>
                  </tr>
                </thead>
                <tbody>
                  {audit.map((entry) => (
                    <tr key={entry.id} className="border-b border-[var(--hc-border-subtle)]">
                      <td className="py-2.5 px-2 font-mono text-[var(--hc-text-xs)] text-[var(--hc-text-subtle)]">
                        {entry.id}
                      </td>
                      <td className="py-2.5 px-2 text-[var(--hc-text)]">{entry.userDisplayName}</td>
                      <td className="py-2.5 px-2 text-[var(--hc-text-muted)] whitespace-nowrap">
                        {formatTime(entry.timestamp)}
                      </td>
                      <td className="py-2.5 px-2">
                        <StatusPill variant={resultVariant(entry.result)}>
                          {AUTH_COPY.admin.results[entry.result]}
                        </StatusPill>
                      </td>
                      <td className="py-2.5 px-2 text-[var(--hc-text-muted)] max-w-[140px] truncate">
                        {entry.note ?? "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Surface>
      </div>
    </section>
  );
}
