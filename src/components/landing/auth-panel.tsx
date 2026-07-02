"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, ChevronLeft } from "lucide-react";
import { Button, Surface } from "@/components/ui";
import { AUTH_COPY } from "./auth-copy";
import { GoogleIcon, AppleIcon } from "./auth-provider-icons";
import type { LandingAuthProvider } from "@/lib/landing-auth-storage";
import { isValidEmail, isValidPhone, isValidOtp, formatPhoneDisplay } from "@/lib/landing-auth-storage";

type AuthMode = "providers" | "email" | "phone";
type AuthTab = "signIn" | "signUp";

interface AuthPanelProps {
  onSignIn: (identifier: string) => { ok: boolean; error?: string };
  onSignUpStart: (params: {
    displayName: string;
    identifier: string;
    provider: LandingAuthProvider;
  }) => void;
  onSkip: () => void;
}

const SSO_DELAY_MS = 1200;
const OTP_DELAY_MS = 900;

export function AuthPanel({ onSignIn, onSignUpStart, onSkip }: AuthPanelProps) {
  const [tab, setTab] = useState<AuthTab>("signIn");
  const [mode, setMode] = useState<AuthMode>("providers");
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  const resetForm = () => {
    setError(null);
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setPhone("");
    setOtpSent(false);
    setOtp("");
  };

  const handleSso = async (provider: "google" | "apple") => {
    setLoading(provider);
    setError(null);
    await new Promise((r) => setTimeout(r, SSO_DELAY_MS));

    const mockName = provider === "google" ? "Alex Morgan" : "Jordan Lee";
    const mockEmail =
      provider === "google" ? "alex.morgan@gmail.com" : "jordan.lee@icloud.com";

    if (tab === "signIn") {
      const result = onSignIn(mockEmail);
      if (!result.ok) {
        onSignUpStart({ displayName: mockName, identifier: mockEmail, provider });
      }
    } else {
      onSignUpStart({ displayName: mockName, identifier: mockEmail, provider });
    }
    setLoading(null);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError(AUTH_COPY.errors.required);
      return;
    }
    if (!isValidEmail(email)) {
      setError(AUTH_COPY.errors.invalidEmail);
      return;
    }
    if (tab === "signUp") {
      if (!name.trim()) {
        setError(AUTH_COPY.errors.required);
        return;
      }
      if (password !== confirmPassword) {
        setError(AUTH_COPY.errors.passwordMatch);
        return;
      }
    }

    setLoading("email");
    await new Promise((r) => setTimeout(r, OTP_DELAY_MS));

    if (tab === "signIn") {
      const result = onSignIn(email.trim().toLowerCase());
      if (!result.ok) {
        onSignUpStart({
          displayName: name.trim() || email.split("@")[0] || "Demo User",
          identifier: email.trim().toLowerCase(),
          provider: "email",
        });
      }
    } else {
      onSignUpStart({
        displayName: name.trim(),
        identifier: email.trim().toLowerCase(),
        provider: "email",
      });
    }
    setLoading(null);
  };

  const handleSendOtp = async () => {
    setError(null);
    if (!isValidPhone(phone)) {
      setError(AUTH_COPY.errors.invalidPhone);
      return;
    }
    if (tab === "signUp" && !name.trim()) {
      setError(AUTH_COPY.errors.required);
      return;
    }
    setLoading("sendOtp");
    await new Promise((r) => setTimeout(r, OTP_DELAY_MS));
    setOtpSent(true);
    setLoading(null);
  };

  const handlePhoneVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!isValidOtp(otp)) {
      setError(AUTH_COPY.errors.invalidCode);
      return;
    }

    setLoading("phone");
    await new Promise((r) => setTimeout(r, OTP_DELAY_MS));

    const digits = phone.replace(/\D/g, "");
    const identifier = `+${digits.length === 10 ? "1" + digits : digits}`;

    if (tab === "signIn") {
      const result = onSignIn(identifier);
      if (!result.ok) {
        onSignUpStart({
          displayName: name.trim() || "Demo User",
          identifier,
          provider: "phone",
        });
      }
    } else {
      onSignUpStart({
        displayName: name.trim(),
        identifier,
        provider: "phone",
      });
    }
    setLoading(null);
  };

  return (
    <Surface elevation="raised" padding="lg" className="w-full">
      <div className="flex flex-col gap-[var(--hc-space-5)]">
        <div className="text-center">
          <h2 className="text-[var(--hc-text-xl)] font-bold text-[var(--hc-text)]">
            {AUTH_COPY.panelTitle}
          </h2>
          <p className="text-[var(--hc-text-sm)] text-[var(--hc-text-muted)] mt-2">
            {AUTH_COPY.panelSubtitle}
          </p>
        </div>

        {mode === "providers" && (
          <>
            <div
              className="flex rounded-[var(--hc-radius-md)] border border-[var(--hc-border)] p-1 bg-[var(--hc-surface)]"
              role="tablist"
            >
              {(["signIn", "signUp"] as const).map((t) => (
                <button
                  key={t}
                  role="tab"
                  aria-selected={tab === t}
                  className={[
                    "flex-1 min-h-[var(--hc-touch-min)] rounded-[var(--hc-radius-sm)] text-[var(--hc-text-sm)] font-medium transition-colors",
                    tab === t
                      ? "bg-[var(--hc-violet-muted)] text-[var(--hc-violet)]"
                      : "text-[var(--hc-text-muted)] hover:text-[var(--hc-text)]",
                  ].join(" ")}
                  onClick={() => {
                    setTab(t);
                    resetForm();
                  }}
                >
                  {t === "signIn" ? AUTH_COPY.signInTab : AUTH_COPY.signUpTab}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-[var(--hc-space-2)]">
              <Button
                variant="secondary"
                size="md"
                className="w-full justify-center gap-3"
                loading={loading === "google"}
                onClick={() => handleSso("google")}
              >
                <GoogleIcon />
                {AUTH_COPY.continueWith} {AUTH_COPY.providers.google}
              </Button>
              <Button
                variant="secondary"
                size="md"
                className="w-full justify-center gap-3"
                loading={loading === "apple"}
                onClick={() => handleSso("apple")}
              >
                <AppleIcon />
                {AUTH_COPY.continueWith} {AUTH_COPY.providers.apple}
              </Button>
              <Button
                variant="secondary"
                size="md"
                className="w-full justify-center gap-3"
                onClick={() => {
                  resetForm();
                  setMode("email");
                }}
              >
                <Mail size={18} />
                {AUTH_COPY.continueWith} {AUTH_COPY.providers.email}
              </Button>
              <Button
                variant="secondary"
                size="md"
                className="w-full justify-center gap-3"
                onClick={() => {
                  resetForm();
                  setMode("phone");
                }}
              >
                <Phone size={18} />
                {AUTH_COPY.continueWith} {AUTH_COPY.providers.phone}
              </Button>
            </div>
          </>
        )}

        <AnimatePresence mode="wait">
          {mode === "email" && (
            <motion.form
              key="email"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              className="flex flex-col gap-[var(--hc-space-4)]"
              onSubmit={handleEmailSubmit}
            >
              <button
                type="button"
                className="inline-flex items-center gap-2 text-[var(--hc-text-sm)] text-[var(--hc-text-muted)] hover:text-[var(--hc-text)] self-start"
                onClick={() => {
                  resetForm();
                  setMode("providers");
                }}
              >
                <ChevronLeft size={16} />
                Back
              </button>

              <h3 className="text-[var(--hc-text-lg)] font-semibold text-[var(--hc-text)]">
                {tab === "signIn" ? AUTH_COPY.email.signInTitle : AUTH_COPY.email.signUpTitle}
              </h3>

              {tab === "signUp" && (
                <label className="flex flex-col gap-1.5">
                  <span className="text-[var(--hc-text-sm)] text-[var(--hc-text-muted)]">
                    {AUTH_COPY.email.nameLabel}
                  </span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={AUTH_COPY.email.namePlaceholder}
                    className="hc-input"
                    autoComplete="name"
                  />
                </label>
              )}

              <label className="flex flex-col gap-1.5">
                <span className="text-[var(--hc-text-sm)] text-[var(--hc-text-muted)]">
                  {AUTH_COPY.email.emailLabel}
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={AUTH_COPY.email.emailPlaceholder}
                  className="hc-input"
                  autoComplete="email"
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-[var(--hc-text-sm)] text-[var(--hc-text-muted)]">
                  {AUTH_COPY.email.passwordLabel}
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={AUTH_COPY.email.passwordPlaceholder}
                  className="hc-input"
                  autoComplete={tab === "signIn" ? "current-password" : "new-password"}
                />
              </label>

              {tab === "signUp" && (
                <label className="flex flex-col gap-1.5">
                  <span className="text-[var(--hc-text-sm)] text-[var(--hc-text-muted)]">
                    {AUTH_COPY.email.confirmLabel}
                  </span>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder={AUTH_COPY.email.passwordPlaceholder}
                    className="hc-input"
                    autoComplete="new-password"
                  />
                </label>
              )}

              {error && <p className="text-[var(--hc-text-sm)] text-[var(--hc-help-red)]">{error}</p>}

              <Button type="submit" size="md" className="w-full" loading={loading === "email"}>
                {tab === "signIn" ? AUTH_COPY.email.submitSignIn : AUTH_COPY.email.submitSignUp}
              </Button>
            </motion.form>
          )}

          {mode === "phone" && (
            <motion.div
              key="phone"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              className="flex flex-col gap-[var(--hc-space-4)]"
            >
              <button
                type="button"
                className="inline-flex items-center gap-2 text-[var(--hc-text-sm)] text-[var(--hc-text-muted)] hover:text-[var(--hc-text)] self-start"
                onClick={() => {
                  resetForm();
                  setMode("providers");
                }}
              >
                <ChevronLeft size={16} />
                Back
              </button>

              <h3 className="text-[var(--hc-text-lg)] font-semibold text-[var(--hc-text)]">
                {tab === "signIn" ? AUTH_COPY.phone.title : AUTH_COPY.phone.signUpTitle}
              </h3>
              {!otpSent ? (
                <>
                  {tab === "signUp" && (
                    <label className="flex flex-col gap-1.5">
                      <span className="text-[var(--hc-text-sm)] text-[var(--hc-text-muted)]">
                        {AUTH_COPY.phone.nameLabel}
                      </span>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={AUTH_COPY.phone.namePlaceholder}
                        className="hc-input"
                        autoComplete="name"
                      />
                    </label>
                  )}
                  <label className="flex flex-col gap-1.5">
                    <span className="text-[var(--hc-text-sm)] text-[var(--hc-text-muted)]">
                      {AUTH_COPY.phone.numberLabel}
                    </span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={AUTH_COPY.phone.numberPlaceholder}
                      className="hc-input"
                      autoComplete="tel"
                    />
                  </label>
                  {error && (
                    <p className="text-[var(--hc-text-sm)] text-[var(--hc-help-red)]">{error}</p>
                  )}
                  <Button
                    size="md"
                    className="w-full"
                    loading={loading === "sendOtp"}
                    onClick={handleSendOtp}
                  >
                    {AUTH_COPY.phone.sendCode}
                  </Button>
                </>
              ) : (
                <form onSubmit={handlePhoneVerify} className="flex flex-col gap-[var(--hc-space-4)]">
                  <p className="text-[var(--hc-text-sm)] text-[var(--hc-text-muted)]">
                    {AUTH_COPY.phone.codeSent(formatPhoneDisplay(phone))}
                  </p>
                  <label className="flex flex-col gap-1.5">
                    <span className="text-[var(--hc-text-sm)] text-[var(--hc-text-muted)]">
                      {AUTH_COPY.phone.codeLabel}
                    </span>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder={AUTH_COPY.phone.codePlaceholder}
                      className="hc-input tracking-widest text-center text-lg"
                      autoComplete="one-time-code"
                    />
                  </label>
                  {error && (
                    <p className="text-[var(--hc-text-sm)] text-[var(--hc-help-red)]">{error}</p>
                  )}
                  <Button type="submit" size="md" className="w-full" loading={loading === "phone"}>
                    {AUTH_COPY.phone.verify}
                  </Button>
                  <button
                    type="button"
                    className="text-[var(--hc-text-sm)] text-[var(--hc-violet)] hover:underline"
                    onClick={() => {
                      setOtpSent(false);
                      setOtp("");
                      setError(null);
                    }}
                  >
                    {AUTH_COPY.phone.changeNumber}
                  </button>
                </form>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="border-t border-[var(--hc-border)] pt-[var(--hc-space-4)] flex flex-col gap-[var(--hc-space-2)]">
          <Button variant="ghost" size="md" className="w-full" onClick={onSkip}>
            {AUTH_COPY.skip}
          </Button>
          <p className="text-[var(--hc-text-xs)] text-[var(--hc-text-subtle)] text-center">
            {AUTH_COPY.skipHint}
          </p>
        </div>
      </div>
    </Surface>
  );
}
