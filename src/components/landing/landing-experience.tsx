"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, UserCircle, LogOut } from "lucide-react";
import { AppShell, PageContainer, ScreenReaderOnly, Button, StatusPill } from "@/components/ui";
import { BrandMark } from "@/components/shared/brand-mark";
import { RoleCard } from "./role-card";
import { LANDING_COPY } from "./landing-copy";
import { AUTH_COPY } from "./auth-copy";
import { AuthPanel } from "./auth-panel";
import { SignupFlowDialog } from "./signup-flow-dialog";
import { ProfileDialog } from "./profile-dialog";
import { AdminVerificationConsole } from "./admin-verification-console";
import { useLandingAuth } from "@/hooks/use-landing-auth";
import type { LandingAuthProvider } from "@/lib/landing-auth-storage";
import {
  appendVerificationAudit,
  readAuthSkipped,
  writeAuthSkipped,
} from "@/lib/landing-auth-storage";
import { HandHeart, Store, Users } from "lucide-react";

const ROLE_CARDS = [
  { ...LANDING_COPY.roles.requester, icon: HandHeart },
  { ...LANDING_COPY.roles.volunteer, icon: Users },
  { ...LANDING_COPY.roles.partner, icon: Store },
] as const;

export function LandingExperience() {
  const { account, hydrated, signIn, signUp, saveAccount, signOut, deactivate, deleteData, refresh } =
    useLandingAuth();

  const [authSkipped, setAuthSkipped] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);
  const [signupDraft, setSignupDraft] = useState<{
    displayName: string;
    identifier: string;
    provider: LandingAuthProvider;
  } | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [adminRefresh, setAdminRefresh] = useState(0);

  useEffect(() => {
    setAuthSkipped(readAuthSkipped());
  }, []);

  const handleSkip = () => {
    writeAuthSkipped(true);
    setAuthSkipped(true);
  };

  const handleReopenAuth = () => {
    writeAuthSkipped(false);
    setAuthSkipped(false);
  };

  const handleSignIn = (identifier: string) => {
    writeAuthSkipped(false);
    setAuthSkipped(false);
    const result = signIn(identifier);
    return { ok: result.ok, error: result.error };
  };

  const handleSignUpStart = (params: {
    displayName: string;
    identifier: string;
    provider: LandingAuthProvider;
  }) => {
    writeAuthSkipped(false);
    setAuthSkipped(false);
    setSignupDraft(params);
    setSignupOpen(true);
  };

  const handleSignUpFinish = (params: {
    roles: import("@/lib/landing-auth-storage").UserRole;
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
  }) => {
    if (!signupDraft) return;

    const result = signUp({
      displayName: signupDraft.displayName,
      identifier: signupDraft.identifier,
      provider: signupDraft.provider,
      roles: params.roles,
    });

    if (!result.ok || !result.account) return;

    let updated = { ...result.account };

    if (params.requester) {
      updated.requester = {
        disabilityType: params.requester.disabilityType,
        emergencyContactName: params.requester.emergencyContactName,
        emergencyContactPhone: params.requester.emergencyContactPhone,
        verificationStatus: "pending_review",
        verificationDocumentName: params.requester.verificationDocumentName,
        verificationDocumentDescription: params.requester.verificationDocumentDescription,
        verificationSubmittedAt: new Date().toISOString(),
      };
      appendVerificationAudit({
        userId: updated.id,
        userDisplayName: updated.displayName,
        result: "submitted",
      });
    }

    if (params.volunteer) {
      updated.volunteer = {
        ...params.volunteer,
        phoneVerifiedAt: params.volunteer.phoneVerified ? new Date().toISOString() : undefined,
      };
    }

    saveAccount(updated);
    setSignupOpen(false);
    setSignupDraft(null);
    setAdminRefresh((k) => k + 1);
  };

  const signedIn = !!account;
  const showAuthPanel = !signedIn && !authSkipped;

  if (!hydrated) {
    return (
      <AppShell>
        <PageContainer maxWidth="lg" className="flex flex-1 items-center justify-center">
          <p className="text-[var(--hc-text-muted)] text-[var(--hc-text-sm)]">Loading…</p>
        </PageContainer>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageContainer maxWidth="lg" className="flex flex-col flex-1 gap-[var(--hc-space-10)] py-[var(--hc-space-8)]">
        <div
          className="flex flex-col items-center gap-[var(--hc-space-10)] w-full"
          style={{
            animation: "hc-fade-up var(--hc-duration-slow) var(--hc-ease-out) both",
          }}
        >
          <header className="flex flex-col items-center gap-[var(--hc-space-5)] text-center max-w-2xl">
            <BrandMark size="lg" />
            <div className="flex flex-col gap-[var(--hc-space-3)]">
              <p className="text-[var(--hc-text-sm)] font-semibold tracking-[0.18em] uppercase text-[var(--hc-violet)]">
                Helpchain
              </p>
              <h1 className="text-[var(--hc-text-3xl)] sm:text-[var(--hc-text-4xl)] font-bold tracking-tight text-[var(--hc-text)] leading-[var(--hc-leading-tight)]">
                {LANDING_COPY.headline}
              </h1>
              <p className="text-[var(--hc-text-base)] sm:text-[var(--hc-text-lg)] text-[var(--hc-text-muted)] leading-[var(--hc-leading-relaxed)] max-w-xl mx-auto">
                {LANDING_COPY.description}
              </p>
            </div>
          </header>

          <div
            className={[
              "w-full grid gap-[var(--hc-space-6)] items-start",
              showAuthPanel || signedIn
                ? "grid-cols-1 lg:grid-cols-[minmax(0,380px)_1fr]"
                : "grid-cols-1",
            ].join(" ")}
          >
            {signedIn && account ? (
              <div className="flex flex-col gap-[var(--hc-space-4)] p-[var(--hc-space-6)] rounded-[var(--hc-radius-lg)] border border-[var(--hc-border)] bg-[var(--hc-surface-raised)]">
                <div className="flex flex-col gap-1">
                  <p className="text-[var(--hc-text-lg)] font-bold text-[var(--hc-text)]">
                    {AUTH_COPY.signedIn.welcome(account.displayName)}
                  </p>
                  <p className="text-[var(--hc-text-sm)] text-[var(--hc-text-muted)]">
                    {AUTH_COPY.signedIn.subtitle}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {account.requester?.verificationStatus === "verified" && (
                    <StatusPill variant="success">
                      <ShieldCheck size={14} className="mr-1 inline" />
                      {AUTH_COPY.signedIn.verifiedBadge}
                    </StatusPill>
                  )}
                  {account.volunteer?.phoneVerified && (
                    <StatusPill variant="success">{AUTH_COPY.signedIn.volunteerVerifiedBadge}</StatusPill>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="gap-2 flex-1"
                    onClick={() => setProfileOpen(true)}
                  >
                    <UserCircle size={16} />
                    {AUTH_COPY.signedIn.openProfile}
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-2" onClick={signOut}>
                    <LogOut size={16} />
                    {AUTH_COPY.signedIn.signOut}
                  </Button>
                </div>
              </div>
            ) : showAuthPanel ? (
              <AuthPanel
                onSignIn={handleSignIn}
                onSignUpStart={handleSignUpStart}
                onSkip={handleSkip}
              />
            ) : null}

            <section aria-labelledby="role-cards-heading" className="flex flex-col gap-[var(--hc-space-4)]">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-[var(--hc-space-3)]">
                <h2
                  id="role-cards-heading"
                  className="text-[var(--hc-text-sm)] font-semibold text-[var(--hc-text-muted)] uppercase tracking-wide"
                >
                  Choose a role
                </h2>
                {!signedIn && authSkipped && (
                  <Button variant="ghost" size="sm" onClick={handleReopenAuth}>
                    {AUTH_COPY.reopenAuth}
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-[var(--hc-space-4)]">
                {ROLE_CARDS.map((role) => (
                  <RoleCard key={role.href} {...role} />
                ))}
              </div>
            </section>
          </div>

          <footer className="text-center pt-[var(--hc-space-2)]">
            <p className="text-[var(--hc-text-xs)] text-[var(--hc-text-subtle)]">{LANDING_COPY.footer}</p>
          </footer>

          <ScreenReaderOnly>
            Helpchain home. Choose requester, volunteer, or partner to begin. Sign in is optional.
          </ScreenReaderOnly>
        </div>

        <AdminVerificationConsole
          refreshKey={adminRefresh}
          onReviewComplete={() => {
            refresh();
            setAdminRefresh((k) => k + 1);
          }}
        />
      </PageContainer>

      {signupDraft && (
        <SignupFlowDialog
          open={signupOpen}
          displayName={signupDraft.displayName}
          identifier={signupDraft.identifier}
          provider={signupDraft.provider}
          onComplete={handleSignUpFinish}
          onCancel={() => {
            setSignupOpen(false);
            setSignupDraft(null);
          }}
        />
      )}

      {account && profileOpen && (
        <ProfileDialog
          open={profileOpen}
          account={account}
          onSave={(updated) => {
            saveAccount(updated);
            setAdminRefresh((k) => k + 1);
          }}
          onDeactivate={() => {
            deactivate();
            setProfileOpen(false);
          }}
          onDelete={() => {
            deleteData();
            setProfileOpen(false);
            setAdminRefresh((k) => k + 1);
          }}
          onClose={() => setProfileOpen(false)}
        />
      )}
    </AppShell>
  );
}
