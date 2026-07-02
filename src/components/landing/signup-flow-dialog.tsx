"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { HandHeart, Users, Layers } from "lucide-react";
import { Button, Surface } from "@/components/ui";
import { useAccessibleDialog } from "@/hooks/use-accessible-dialog";
import { AUTH_COPY } from "./auth-copy";
import type { LandingAuthProvider, UserRole } from "@/lib/landing-auth-storage";
import {
  DISABILITY_TYPES,
  LANGUAGE_OPTIONS,
  PROFILE_AVATARS,
  isValidPhone,
  isValidOtp,
  formatPhoneDisplay,
} from "@/lib/landing-auth-storage";

type SignupStep = "role" | "requester" | "volunteer" | "volunteer-otp";

interface SignupFlowDialogProps {
  open: boolean;
  displayName: string;
  identifier: string;
  provider: LandingAuthProvider;
  onComplete: (params: {
    roles: UserRole;
    requester?: {
      disabilityType: string;
      emergencyContactName: string;
      emergencyContactPhone: string;
      verificationDocumentName: string;
      verificationDocumentDescription: string;
    };
    volunteer?: {
      displayName: string;
      profilePicture: string;
      shortDescription: string;
      languages: string[];
      phone: string;
      phoneVerified: boolean;
    };
  }) => void;
  onCancel: () => void;
}

const ROLE_OPTIONS: { value: UserRole; icon: typeof HandHeart }[] = [
  { value: "requester", icon: HandHeart },
  { value: "volunteer", icon: Users },
  { value: "both", icon: Layers },
];

export function SignupFlowDialog({
  open,
  displayName,
  identifier,
  provider,
  onComplete,
  onCancel,
}: SignupFlowDialogProps) {
  const { dialogRef } = useAccessibleDialog({ isOpen: open, onClose: onCancel });

  const [step, setStep] = useState<SignupStep>("role");
  const [roles, setRoles] = useState<UserRole | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [disabilityType, setDisabilityType] = useState("");
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [docName, setDocName] = useState("");
  const [docDesc, setDocDesc] = useState("");
  const [docFile, setDocFile] = useState("");

  const [volName, setVolName] = useState(displayName);
  const [avatar, setAvatar] = useState<string>(PROFILE_AVATARS[0]);
  const [description, setDescription] = useState("");
  const [languages, setLanguages] = useState<string[]>(["English"]);
  const [volPhone, setVolPhone] = useState(provider === "phone" ? identifier : "");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  if (!open) return null;

  const needsRequester = roles === "requester" || roles === "both";
  const needsVolunteer = roles === "volunteer" || roles === "both";

  const toggleLanguage = (lang: string) => {
    setLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  const handleRoleContinue = () => {
    if (!roles) {
      setError(AUTH_COPY.errors.selectRole);
      return;
    }
    setError(null);
    if (needsRequester) setStep("requester");
    else if (needsVolunteer) setStep("volunteer");
  };

  const handleRequesterContinue = async () => {
    setError(null);
    if (!disabilityType || !emergencyName.trim() || !isValidPhone(emergencyPhone)) {
      setError(AUTH_COPY.errors.required);
      return;
    }
    if (!docName.trim() || !docDesc.trim() || !docFile) {
      setError(AUTH_COPY.errors.uploadRequired);
      return;
    }

    if (needsVolunteer) {
      setStep("volunteer");
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    onComplete({
      roles: roles!,
      requester: {
        disabilityType,
        emergencyContactName: emergencyName.trim(),
        emergencyContactPhone: emergencyPhone.trim(),
        verificationDocumentName: docName.trim(),
        verificationDocumentDescription: docDesc.trim(),
      },
    });
    setLoading(false);
  };

  const handleVolunteerContinue = () => {
    setError(null);
    if (!volName.trim() || !description.trim() || languages.length === 0) {
      setError(AUTH_COPY.errors.required);
      return;
    }
    if (languages.length === 0) {
      setError(AUTH_COPY.errors.selectLanguage);
      return;
    }
    if (!isValidPhone(volPhone)) {
      setError(AUTH_COPY.errors.invalidPhone);
      return;
    }
    setStep("volunteer-otp");
  };

  const handleSendOtp = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setOtpSent(true);
    setLoading(false);
  };

  const handleFinish = async () => {
    setError(null);
    if (!isValidOtp(otp)) {
      setError(AUTH_COPY.errors.invalidCode);
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));

    const payload: Parameters<SignupFlowDialogProps["onComplete"]>[0] = {
      roles: roles!,
      volunteer: {
        displayName: volName.trim(),
        profilePicture: avatar,
        shortDescription: description.trim(),
        languages,
        phone: volPhone.trim(),
        phoneVerified: true,
      },
    };

    if (needsRequester) {
      payload.requester = {
        disabilityType,
        emergencyContactName: emergencyName.trim(),
        emergencyContactPhone: emergencyPhone.trim(),
        verificationDocumentName: docName.trim(),
        verificationDocumentDescription: docDesc.trim(),
      };
    }

    onComplete(payload);
    setLoading(false);
  };

  const handleFileSelect = () => {
    const name = docName.trim() || "accessibility_assessment.pdf";
    setDocFile(name.endsWith(".pdf") ? name : `${name.replace(/\s+/g, "_").toLowerCase()}.pdf`);
    if (!docName.trim()) setDocName("Accessibility assessment letter");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="signup-flow-title"
    >
      <div className="absolute inset-0" onClick={onCancel} aria-hidden="true" />

      <motion.div
        ref={dialogRef}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg relative my-8"
        tabIndex={-1}
      >
        <Surface elevation="overlay" padding="lg" className="flex flex-col gap-[var(--hc-space-5)]">
          {step === "role" && (
            <>
              <div>
                <h2 id="signup-flow-title" className="text-[var(--hc-text-xl)] font-bold text-[var(--hc-text)]">
                  {AUTH_COPY.roleSelection.title}
                </h2>
                <p className="text-[var(--hc-text-sm)] text-[var(--hc-text-muted)] mt-2">
                  {AUTH_COPY.roleSelection.subtitle}
                </p>
              </div>

              <div className="flex flex-col gap-[var(--hc-space-3)]">
                {ROLE_OPTIONS.map(({ value, icon: Icon }) => {
                  const copy = AUTH_COPY.roleSelection[value];
                  const selected = roles === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setRoles(value)}
                      className={[
                        "flex items-start gap-[var(--hc-space-4)] p-[var(--hc-space-4)] rounded-[var(--hc-radius-lg)] border text-left transition-colors",
                        selected
                          ? "border-[var(--hc-violet)] bg-[var(--hc-violet-muted)]"
                          : "border-[var(--hc-border)] hover:border-[var(--hc-violet)]/40",
                      ].join(" ")}
                    >
                      <div
                        className={[
                          "flex items-center justify-center w-10 h-10 rounded-[var(--hc-radius-md)] shrink-0",
                          selected
                            ? "bg-[var(--hc-violet)]/20 text-[var(--hc-violet)]"
                            : "bg-[var(--hc-surface-overlay)] text-[var(--hc-text-muted)]",
                        ].join(" ")}
                      >
                        <Icon size={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-[var(--hc-text)]">{copy.title}</p>
                        <p className="text-[var(--hc-text-sm)] text-[var(--hc-text-muted)] mt-1">
                          {copy.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {error && <p className="text-[var(--hc-text-sm)] text-[var(--hc-help-red)]">{error}</p>}

              <Button size="md" className="w-full" onClick={handleRoleContinue}>
                {AUTH_COPY.roleSelection.continue}
              </Button>
            </>
          )}

          {step === "requester" && (
            <>
              <div>
                <h2 className="text-[var(--hc-text-xl)] font-bold text-[var(--hc-text)]">
                  {AUTH_COPY.requesterProfile.title}
                </h2>
                <p className="text-[var(--hc-text-sm)] text-[var(--hc-text-muted)] mt-2">
                  {AUTH_COPY.requesterProfile.subtitle}
                </p>
              </div>

              <div className="flex flex-col gap-[var(--hc-space-4)]">
                <label className="flex flex-col gap-1.5">
                  <span className="text-[var(--hc-text-sm)] text-[var(--hc-text-muted)]">
                    {AUTH_COPY.requesterProfile.disabilityLabel}
                  </span>
                  <select
                    value={disabilityType}
                    onChange={(e) => setDisabilityType(e.target.value)}
                    className="hc-input"
                  >
                    <option value="">{AUTH_COPY.requesterProfile.disabilityPlaceholder}</option>
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
                    value={emergencyName}
                    onChange={(e) => setEmergencyName(e.target.value)}
                    placeholder={AUTH_COPY.requesterProfile.emergencyNamePlaceholder}
                    className="hc-input"
                  />
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="text-[var(--hc-text-sm)] text-[var(--hc-text-muted)]">
                    {AUTH_COPY.requesterProfile.emergencyPhoneLabel}
                  </span>
                  <input
                    type="tel"
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    placeholder={AUTH_COPY.requesterProfile.emergencyPhonePlaceholder}
                    className="hc-input"
                  />
                </label>

                <div className="border-t border-[var(--hc-border)] pt-[var(--hc-space-4)]">
                  <h3 className="text-[var(--hc-text-base)] font-semibold text-[var(--hc-text)]">
                    {AUTH_COPY.requesterProfile.verificationTitle}
                  </h3>
                  <p className="text-[var(--hc-text-sm)] text-[var(--hc-text-muted)] mt-1 mb-3">
                    {AUTH_COPY.requesterProfile.verificationSubtitle}
                  </p>

                  <div className="flex flex-col gap-[var(--hc-space-3)]">
                    <label className="flex flex-col gap-1.5">
                      <span className="text-[var(--hc-text-sm)] text-[var(--hc-text-muted)]">
                        {AUTH_COPY.requesterProfile.documentNameLabel}
                      </span>
                      <input
                        type="text"
                        value={docName}
                        onChange={(e) => setDocName(e.target.value)}
                        placeholder={AUTH_COPY.requesterProfile.documentNamePlaceholder}
                        className="hc-input"
                      />
                    </label>

                    <label className="flex flex-col gap-1.5">
                      <span className="text-[var(--hc-text-sm)] text-[var(--hc-text-muted)]">
                        {AUTH_COPY.requesterProfile.documentDescLabel}
                      </span>
                      <textarea
                        value={docDesc}
                        onChange={(e) => setDocDesc(e.target.value)}
                        placeholder={AUTH_COPY.requesterProfile.documentDescPlaceholder}
                        className="hc-input min-h-[80px] resize-y"
                        rows={3}
                      />
                    </label>

                    <div className="flex flex-col gap-2">
                      <span className="text-[var(--hc-text-sm)] text-[var(--hc-text-muted)]">
                        {AUTH_COPY.requesterProfile.uploadLabel}
                      </span>
                      <Button variant="secondary" size="sm" type="button" onClick={handleFileSelect}>
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
                    </div>
                  </div>
                </div>
              </div>

              {error && <p className="text-[var(--hc-text-sm)] text-[var(--hc-help-red)]">{error}</p>}

              <Button size="md" className="w-full" loading={loading} onClick={handleRequesterContinue}>
                {needsVolunteer ? "Continue" : AUTH_COPY.requesterProfile.submitVerification}
              </Button>
            </>
          )}

          {step === "volunteer" && (
            <>
              <div>
                <h2 className="text-[var(--hc-text-xl)] font-bold text-[var(--hc-text)]">
                  {AUTH_COPY.volunteerProfile.title}
                </h2>
                <p className="text-[var(--hc-text-sm)] text-[var(--hc-text-muted)] mt-2">
                  {AUTH_COPY.volunteerProfile.subtitle}
                </p>
              </div>

              <div className="flex flex-col gap-[var(--hc-space-4)]">
                <label className="flex flex-col gap-1.5">
                  <span className="text-[var(--hc-text-sm)] text-[var(--hc-text-muted)]">
                    {AUTH_COPY.volunteerProfile.nameLabel}
                  </span>
                  <input
                    type="text"
                    value={volName}
                    onChange={(e) => setVolName(e.target.value)}
                    placeholder={AUTH_COPY.volunteerProfile.namePlaceholder}
                    className="hc-input"
                  />
                </label>

                <div className="flex flex-col gap-2">
                  <span className="text-[var(--hc-text-sm)] text-[var(--hc-text-muted)]">
                    {AUTH_COPY.volunteerProfile.avatarLabel}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {PROFILE_AVATARS.map((a) => (
                      <button
                        key={a}
                        type="button"
                        onClick={() => setAvatar(a)}
                        className={[
                          "w-11 h-11 rounded-full text-xl flex items-center justify-center border transition-colors",
                          avatar === a
                            ? "border-[var(--hc-violet)] bg-[var(--hc-violet-muted)]"
                            : "border-[var(--hc-border)] hover:border-[var(--hc-violet)]/40",
                        ].join(" ")}
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                </div>

                <label className="flex flex-col gap-1.5">
                  <span className="text-[var(--hc-text-sm)] text-[var(--hc-text-muted)]">
                    {AUTH_COPY.volunteerProfile.descriptionLabel}
                  </span>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={AUTH_COPY.volunteerProfile.descriptionPlaceholder}
                    className="hc-input min-h-[72px] resize-y"
                    rows={2}
                  />
                </label>

                <div className="flex flex-col gap-2">
                  <span className="text-[var(--hc-text-sm)] text-[var(--hc-text-muted)]">
                    {AUTH_COPY.volunteerProfile.languagesLabel}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {LANGUAGE_OPTIONS.map((lang) => {
                      const selected = languages.includes(lang);
                      return (
                        <button
                          key={lang}
                          type="button"
                          onClick={() => toggleLanguage(lang)}
                          className={[
                            "px-3 py-1.5 rounded-[var(--hc-radius-full)] text-[var(--hc-text-sm)] border transition-colors",
                            selected
                              ? "border-[var(--hc-violet)] bg-[var(--hc-violet-muted)] text-[var(--hc-violet)]"
                              : "border-[var(--hc-border)] text-[var(--hc-text-muted)] hover:border-[var(--hc-violet)]/40",
                          ].join(" ")}
                        >
                          {lang}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <label className="flex flex-col gap-1.5">
                  <span className="text-[var(--hc-text-sm)] text-[var(--hc-text-muted)]">
                    {AUTH_COPY.volunteerProfile.phoneLabel}
                  </span>
                  <input
                    type="tel"
                    value={volPhone}
                    onChange={(e) => setVolPhone(e.target.value)}
                    placeholder={AUTH_COPY.volunteerProfile.phonePlaceholder}
                    className="hc-input"
                  />
                </label>
              </div>

              {error && <p className="text-[var(--hc-text-sm)] text-[var(--hc-help-red)]">{error}</p>}

              <Button size="md" className="w-full" onClick={handleVolunteerContinue}>
                {AUTH_COPY.volunteerProfile.otpTitle}
              </Button>
            </>
          )}

          {step === "volunteer-otp" && (
            <>
              <div>
                <h2 className="text-[var(--hc-text-xl)] font-bold text-[var(--hc-text)]">
                  {AUTH_COPY.volunteerProfile.otpTitle}
                </h2>
                <p className="text-[var(--hc-text-sm)] text-[var(--hc-text-muted)] mt-2">
                  {AUTH_COPY.volunteerProfile.otpSubtitle}
                </p>
              </div>

              {!otpSent ? (
                <Button size="md" className="w-full" loading={loading} onClick={handleSendOtp}>
                  {AUTH_COPY.volunteerProfile.sendOtp}
                </Button>
              ) : (
                <div className="flex flex-col gap-[var(--hc-space-4)]">
                  <p className="text-[var(--hc-text-sm)] text-[var(--hc-text-muted)]">
                    {AUTH_COPY.volunteerProfile.otpSent(formatPhoneDisplay(volPhone))}
                  </p>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="6-digit code"
                    className="hc-input tracking-widest text-center text-lg"
                  />
                  {error && (
                    <p className="text-[var(--hc-text-sm)] text-[var(--hc-help-red)]">{error}</p>
                  )}
                  <Button size="md" className="w-full" loading={loading} onClick={handleFinish}>
                    {AUTH_COPY.volunteerProfile.verifyOtp}
                  </Button>
                </div>
              )}
            </>
          )}

          <Button variant="ghost" size="sm" className="self-center" onClick={onCancel}>
            Cancel
          </Button>
        </Surface>
      </motion.div>
    </div>
  );
}
