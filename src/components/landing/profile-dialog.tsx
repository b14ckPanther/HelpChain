"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, ShieldCheck, Phone, Trash2, Power } from "lucide-react";
import { Button, Surface, StatusPill } from "@/components/ui";
import { useAccessibleDialog } from "@/hooks/use-accessible-dialog";
import { AUTH_COPY } from "./auth-copy";
import type { LandingUserAccount } from "@/lib/landing-auth-storage";
import {
  DISABILITY_TYPES,
  LANGUAGE_OPTIONS,
  PROFILE_AVATARS,
  appendVerificationAudit,
  formatPhoneDisplay,
  isValidPhone,
  isValidOtp,
} from "@/lib/landing-auth-storage";

type ProfileTab = "requester" | "volunteer" | "account";

interface ProfileDialogProps {
  open: boolean;
  account: LandingUserAccount;
  onSave: (account: LandingUserAccount) => void;
  onDeactivate: () => void;
  onDelete: () => void;
  onClose: () => void;
}

export function ProfileDialog({
  open,
  account,
  onSave,
  onDeactivate,
  onDelete,
  onClose,
}: ProfileDialogProps) {
  const { dialogRef } = useAccessibleDialog({ isOpen: open, onClose });
  const [tab, setTab] = useState<ProfileTab>("requester");
  const [draft, setDraft] = useState(account);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmDeactivate, setConfirmDeactivate] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [docFile, setDocFile] = useState("");

  useEffect(() => {
    if (open) {
      setDraft(account);
      setEditing(false);
      setError(null);
      setConfirmDelete(false);
      setConfirmDeactivate(false);
      setOtpSent(false);
      setOtp("");
      setDocFile("");
    }
  }, [open, account]);

  if (!open) return null;

  const hasRequester = draft.roles === "requester" || draft.roles === "both";
  const hasVolunteer = draft.roles === "volunteer" || draft.roles === "both";

  const tabs: ProfileTab[] = [
    ...(hasRequester ? (["requester"] as const) : []),
    ...(hasVolunteer ? (["volunteer"] as const) : []),
    "account",
  ];

  const activeTab = tabs.includes(tab) ? tab : tabs[0];

  const verificationVariant = (status?: string) => {
    if (status === "verified") return "success" as const;
    if (status === "pending_review") return "info" as const;
    if (status === "rejected") return "danger" as const;
    if (status === "additional_docs_required") return "warning" as const;
    return "neutral" as const;
  };

  const handleSave = async () => {
    setError(null);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    onSave({ ...draft, updatedAt: new Date().toISOString() });
    setEditing(false);
    setLoading(false);
  };

  const handleResubmitVerification = async () => {
    if (!draft.requester) return;
    const docName = draft.requester.verificationDocumentName?.trim();
    const docDesc = draft.requester.verificationDocumentDescription?.trim();
    if (!docName || !docDesc || !docFile) {
      setError(AUTH_COPY.errors.uploadRequired);
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));

    const updated: LandingUserAccount = {
      ...draft,
      requester: {
        ...draft.requester,
        verificationStatus: "pending_review",
        verificationSubmittedAt: new Date().toISOString(),
        adminNote: undefined,
      },
    };

    appendVerificationAudit({
      userId: draft.id,
      userDisplayName: draft.displayName,
      result: "submitted",
    });

    setDraft(updated);
    onSave(updated);
    setDocFile("");
    setLoading(false);
  };

  const handleVerifyPhone = async () => {
    if (!isValidOtp(otp)) {
      setError(AUTH_COPY.errors.invalidCode);
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));

    const updated: LandingUserAccount = {
      ...draft,
      volunteer: draft.volunteer
        ? {
            ...draft.volunteer,
            phoneVerified: true,
            phoneVerifiedAt: new Date().toISOString(),
          }
        : undefined,
    };
    setDraft(updated);
    onSave(updated);
    setOtpSent(false);
    setOtp("");
    setLoading(false);
  };

  const toggleLanguage = (lang: string) => {
    if (!draft.volunteer) return;
    const langs = draft.volunteer.languages;
    setDraft({
      ...draft,
      volunteer: {
        ...draft.volunteer,
        languages: langs.includes(lang) ? langs.filter((l) => l !== lang) : [...langs, lang],
      },
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-dialog-title"
    >
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      <motion.div
        ref={dialogRef}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl relative my-8"
        tabIndex={-1}
      >
        <Surface elevation="overlay" padding="lg" className="flex flex-col gap-[var(--hc-space-5)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 id="profile-dialog-title" className="text-[var(--hc-text-xl)] font-bold text-[var(--hc-text)]">
                {AUTH_COPY.profile.title}
              </h2>
              <p className="text-[var(--hc-text-sm)] text-[var(--hc-text-muted)] mt-1">
                {AUTH_COPY.profile.signedInAs(draft.displayName)}
              </p>
            </div>
            <StatusPill variant="info">{AUTH_COPY.profile.roles[draft.roles]}</StatusPill>
          </div>

          <div className="flex gap-1 border-b border-[var(--hc-border)] pb-1">
            {tabs.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  setTab(t);
                  setEditing(false);
                  setError(null);
                }}
                className={[
                  "px-4 py-2 text-[var(--hc-text-sm)] font-medium rounded-t-[var(--hc-radius-sm)] transition-colors",
                  activeTab === t
                    ? "text-[var(--hc-violet)] border-b-2 border-[var(--hc-violet)]"
                    : "text-[var(--hc-text-muted)] hover:text-[var(--hc-text)]",
                ].join(" ")}
              >
                {AUTH_COPY.profile.tabs[t]}
              </button>
            ))}
          </div>

          {activeTab === "requester" && draft.requester && (
            <div className="flex flex-col gap-[var(--hc-space-4)]">
              <div className="flex items-center justify-between">
                <StatusPill variant={verificationVariant(draft.requester.verificationStatus)}>
                  {AUTH_COPY.requesterProfile.status[draft.requester.verificationStatus]}
                </StatusPill>
                {!editing && (
                  <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
                    {AUTH_COPY.profile.edit}
                  </Button>
                )}
              </div>

              {draft.requester.verificationStatus === "verified" && (
                <div className="flex items-center gap-2 p-3 rounded-[var(--hc-radius-md)] bg-[var(--hc-success-muted)] text-[var(--hc-success)]">
                  <ShieldCheck size={18} />
                  <span className="text-[var(--hc-text-sm)] font-medium">
                    {AUTH_COPY.signedIn.verifiedBadge}
                  </span>
                </div>
              )}

              {draft.requester.adminNote && (
                <p className="text-[var(--hc-text-sm)] text-[var(--hc-warning)]">
                  {AUTH_COPY.requesterProfile.adminNote(draft.requester.adminNote)}
                </p>
              )}

              {editing ? (
                <>
                  <label className="flex flex-col gap-1.5">
                    <span className="text-[var(--hc-text-sm)] text-[var(--hc-text-muted)]">
                      {AUTH_COPY.requesterProfile.disabilityLabel}
                    </span>
                    <select
                      value={draft.requester.disabilityType}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          requester: { ...draft.requester!, disabilityType: e.target.value },
                        })
                      }
                      className="hc-input"
                    >
                      {DISABILITY_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className="text-[var(--hc-text-sm)] text-[var(--hc-text-muted)]">
                      {AUTH_COPY.requesterProfile.emergencyNameLabel}
                    </span>
                    <input
                      type="text"
                      value={draft.requester.emergencyContactName}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          requester: { ...draft.requester!, emergencyContactName: e.target.value },
                        })
                      }
                      className="hc-input"
                    />
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className="text-[var(--hc-text-sm)] text-[var(--hc-text-muted)]">
                      {AUTH_COPY.requesterProfile.emergencyPhoneLabel}
                    </span>
                    <input
                      type="tel"
                      value={draft.requester.emergencyContactPhone}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          requester: { ...draft.requester!, emergencyContactPhone: e.target.value },
                        })
                      }
                      className="hc-input"
                    />
                  </label>
                  <div className="flex gap-2">
                    <Button size="sm" loading={loading} onClick={handleSave}>
                      {AUTH_COPY.profile.save}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>
                      {AUTH_COPY.profile.cancel}
                    </Button>
                  </div>
                </>
              ) : (
                <dl className="grid gap-3 text-[var(--hc-text-sm)]">
                  <div>
                    <dt className="text-[var(--hc-text-muted)]">{AUTH_COPY.requesterProfile.disabilityLabel}</dt>
                    <dd className="text-[var(--hc-text)] font-medium mt-0.5">{draft.requester.disabilityType}</dd>
                  </div>
                  <div>
                    <dt className="text-[var(--hc-text-muted)]">{AUTH_COPY.requesterProfile.emergencyNameLabel}</dt>
                    <dd className="text-[var(--hc-text)] font-medium mt-0.5">
                      {draft.requester.emergencyContactName}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[var(--hc-text-muted)]">{AUTH_COPY.requesterProfile.emergencyPhoneLabel}</dt>
                    <dd className="text-[var(--hc-text)] font-medium mt-0.5">
                      {formatPhoneDisplay(draft.requester.emergencyContactPhone)}
                    </dd>
                  </div>
                </dl>
              )}

              {(draft.requester.verificationStatus === "not_submitted" ||
                draft.requester.verificationStatus === "rejected" ||
                draft.requester.verificationStatus === "additional_docs_required") && (
                <div className="border-t border-[var(--hc-border)] pt-4 flex flex-col gap-3">
                  <h3 className="font-semibold text-[var(--hc-text)]">
                    {AUTH_COPY.requesterProfile.verificationTitle}
                  </h3>
                  <input
                    type="text"
                    value={draft.requester.verificationDocumentName ?? ""}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        requester: { ...draft.requester!, verificationDocumentName: e.target.value },
                      })
                    }
                    placeholder={AUTH_COPY.requesterProfile.documentNamePlaceholder}
                    className="hc-input"
                  />
                  <textarea
                    value={draft.requester.verificationDocumentDescription ?? ""}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        requester: { ...draft.requester!, verificationDocumentDescription: e.target.value },
                      })
                    }
                    placeholder={AUTH_COPY.requesterProfile.documentDescPlaceholder}
                    className="hc-input min-h-[72px]"
                    rows={2}
                  />
                  <Button variant="secondary" size="sm" onClick={() => setDocFile("updated_document.pdf")}>
                    {AUTH_COPY.requesterProfile.uploadAction}
                  </Button>
                  <p className="text-[var(--hc-text-xs)] text-[var(--hc-text-subtle)]">
                    {AUTH_COPY.requesterProfile.uploadHint}
                  </p>
                  {docFile && (
                    <p className="text-[var(--hc-text-sm)] text-[var(--hc-success)]">
                      {AUTH_COPY.requesterProfile.uploadSelected(docFile)}
                    </p>
                  )}
                  {error && <p className="text-[var(--hc-text-sm)] text-[var(--hc-help-red)]">{error}</p>}
                  <Button size="md" loading={loading} onClick={handleResubmitVerification}>
                    {AUTH_COPY.requesterProfile.resubmitVerification}
                  </Button>
                </div>
              )}
            </div>
          )}

          {activeTab === "volunteer" && draft.volunteer && (
            <div className="flex flex-col gap-[var(--hc-space-4)]">
              <div className="flex items-center justify-between">
                {draft.volunteer.phoneVerified ? (
                  <StatusPill variant="success">{AUTH_COPY.volunteerProfile.verified}</StatusPill>
                ) : (
                  <StatusPill variant="warning">Phone verification required</StatusPill>
                )}
                {!editing && (
                  <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
                    {AUTH_COPY.profile.edit}
                  </Button>
                )}
              </div>

              {editing ? (
                <>
                  <label className="flex flex-col gap-1.5">
                    <span className="text-[var(--hc-text-sm)] text-[var(--hc-text-muted)]">
                      {AUTH_COPY.volunteerProfile.nameLabel}
                    </span>
                    <input
                      type="text"
                      value={draft.volunteer.displayName}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          volunteer: { ...draft.volunteer!, displayName: e.target.value },
                        })
                      }
                      className="hc-input"
                    />
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {PROFILE_AVATARS.map((a) => (
                      <button
                        key={a}
                        type="button"
                        onClick={() =>
                          setDraft({
                            ...draft,
                            volunteer: { ...draft.volunteer!, profilePicture: a },
                          })
                        }
                        className={[
                          "w-10 h-10 rounded-full text-lg border",
                          draft.volunteer!.profilePicture === a
                            ? "border-[var(--hc-violet)] bg-[var(--hc-violet-muted)]"
                            : "border-[var(--hc-border)]",
                        ].join(" ")}
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={draft.volunteer.shortDescription}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        volunteer: { ...draft.volunteer!, shortDescription: e.target.value },
                      })
                    }
                    className="hc-input min-h-[72px]"
                    rows={2}
                  />
                  <div className="flex flex-wrap gap-2">
                    {LANGUAGE_OPTIONS.map((lang) => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => toggleLanguage(lang)}
                        className={[
                          "px-3 py-1 rounded-full text-[var(--hc-text-sm)] border",
                          draft.volunteer!.languages.includes(lang)
                            ? "border-[var(--hc-violet)] bg-[var(--hc-violet-muted)] text-[var(--hc-violet)]"
                            : "border-[var(--hc-border)] text-[var(--hc-text-muted)]",
                        ].join(" ")}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" loading={loading} onClick={handleSave}>
                      {AUTH_COPY.profile.save}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>
                      {AUTH_COPY.profile.cancel}
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex gap-4">
                  <div className="w-16 h-16 rounded-full bg-[var(--hc-violet-muted)] flex items-center justify-center text-3xl shrink-0">
                    {draft.volunteer.profilePicture}
                  </div>
                  <dl className="grid gap-2 text-[var(--hc-text-sm)] flex-1">
                    <div>
                      <dt className="text-[var(--hc-text-muted)]">{AUTH_COPY.volunteerProfile.nameLabel}</dt>
                      <dd className="text-[var(--hc-text)] font-medium">{draft.volunteer.displayName}</dd>
                    </div>
                    <div>
                      <dt className="text-[var(--hc-text-muted)]">{AUTH_COPY.volunteerProfile.descriptionLabel}</dt>
                      <dd className="text-[var(--hc-text)]">{draft.volunteer.shortDescription}</dd>
                    </div>
                    <div>
                      <dt className="text-[var(--hc-text-muted)]">{AUTH_COPY.volunteerProfile.languagesLabel}</dt>
                      <dd className="text-[var(--hc-text)]">{draft.volunteer.languages.join(", ")}</dd>
                    </div>
                    <div>
                      <dt className="text-[var(--hc-text-muted)]">{AUTH_COPY.volunteerProfile.phoneLabel}</dt>
                      <dd className="text-[var(--hc-text)]">{formatPhoneDisplay(draft.volunteer.phone)}</dd>
                    </div>
                  </dl>
                </div>
              )}

              {!draft.volunteer.phoneVerified && (
                <div className="border-t border-[var(--hc-border)] pt-4 flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-[var(--hc-text-sm)] text-[var(--hc-text-muted)]">
                    <Phone size={16} />
                    {AUTH_COPY.volunteerProfile.otpSubtitle}
                  </div>
                  {!otpSent ? (
                    <Button
                      size="sm"
                      onClick={async () => {
                        if (!isValidPhone(draft.volunteer!.phone)) {
                          setError(AUTH_COPY.errors.invalidPhone);
                          return;
                        }
                        setLoading(true);
                        await new Promise((r) => setTimeout(r, 800));
                        setOtpSent(true);
                        setLoading(false);
                      }}
                    >
                      {AUTH_COPY.volunteerProfile.sendOtp}
                    </Button>
                  ) : (
                    <>
                      <p className="text-[var(--hc-text-sm)] text-[var(--hc-text-muted)]">
                        {AUTH_COPY.volunteerProfile.otpSent(formatPhoneDisplay(draft.volunteer.phone))}
                      </p>
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        className="hc-input tracking-widest text-center"
                      />
                      {error && <p className="text-[var(--hc-text-sm)] text-[var(--hc-help-red)]">{error}</p>}
                      <Button size="sm" loading={loading} onClick={handleVerifyPhone}>
                        {AUTH_COPY.volunteerProfile.verifyOtp}
                      </Button>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === "account" && (
            <div className="flex flex-col gap-[var(--hc-space-5)]">
              <div className="flex items-center gap-3 p-4 rounded-[var(--hc-radius-md)] bg-[var(--hc-surface)] border border-[var(--hc-border)]">
                <User size={20} className="text-[var(--hc-violet)]" />
                <div className="text-[var(--hc-text-sm)]">
                  <p className="font-medium text-[var(--hc-text)]">{draft.displayName}</p>
                  <p className="text-[var(--hc-text-muted)]">{draft.identifier}</p>
                  <p className="text-[var(--hc-text-subtle)] capitalize mt-1">via {draft.provider}</p>
                </div>
              </div>

              <p className="text-[var(--hc-text-xs)] text-[var(--hc-text-subtle)]">{AUTH_COPY.account.gdprNote}</p>

              <div className="border border-[var(--hc-border)] rounded-[var(--hc-radius-md)] p-4 flex flex-col gap-3">
                <div>
                  <h3 className="font-semibold text-[var(--hc-text)]">{AUTH_COPY.account.deactivateTitle}</h3>
                  <p className="text-[var(--hc-text-sm)] text-[var(--hc-text-muted)] mt-1">
                    {AUTH_COPY.account.deactivateDescription}
                  </p>
                </div>
                {!confirmDeactivate ? (
                  <Button variant="secondary" size="sm" className="self-start gap-2" onClick={() => setConfirmDeactivate(true)}>
                    <Power size={16} />
                    {AUTH_COPY.account.deactivateAction}
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm" onClick={onDeactivate}>
                      {AUTH_COPY.account.deactivateConfirm}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setConfirmDeactivate(false)}>
                      Cancel
                    </Button>
                  </div>
                )}
              </div>

              <div className="border border-[var(--hc-help-red)]/30 rounded-[var(--hc-radius-md)] p-4 flex flex-col gap-3">
                <div>
                  <h3 className="font-semibold text-[var(--hc-help-red)]">{AUTH_COPY.account.deleteTitle}</h3>
                  <p className="text-[var(--hc-text-sm)] text-[var(--hc-text-muted)] mt-1">
                    {AUTH_COPY.account.deleteDescription}
                  </p>
                </div>
                {!confirmDelete ? (
                  <Button variant="danger" size="sm" className="self-start gap-2" onClick={() => setConfirmDelete(true)}>
                    <Trash2 size={16} />
                    {AUTH_COPY.account.deleteAction}
                  </Button>
                ) : (
                  <div className="flex flex-col gap-2">
                    <p className="text-[var(--hc-text-sm)] text-[var(--hc-help-red)]">
                      {AUTH_COPY.account.deleteWarning}
                    </p>
                    <div className="flex gap-2">
                      <Button variant="danger" size="sm" onClick={onDelete}>
                        {AUTH_COPY.account.deleteConfirm}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <Button variant="ghost" size="sm" className="self-center" onClick={onClose}>
            Close
          </Button>
        </Surface>
      </motion.div>
    </div>
  );
}
