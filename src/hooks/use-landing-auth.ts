"use client";

import { useCallback, useEffect, useState } from "react";
import type { LandingAuthProvider, LandingUserAccount, UserRole } from "@/lib/landing-auth-storage";
import {
  clearLandingSession,
  createAccount,
  deactivateAccount,
  deleteAccountData,
  findAccountByIdentifier,
  readLandingSession,
  updateAccount,
  writeLandingSession,
} from "@/lib/landing-auth-storage";

export function useLandingAuth() {
  const [account, setAccount] = useState<LandingUserAccount | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setAccount(readLandingSession());
    setHydrated(true);
  }, []);

  const refresh = useCallback(() => {
    setAccount(readLandingSession());
  }, []);

  const signIn = useCallback(
    (identifier: string, displayName?: string) => {
      const existing = findAccountByIdentifier(identifier);
      if (existing) {
        const session = { ...existing, signedInAt: new Date().toISOString() };
        writeLandingSession(session);
        setAccount(session);
        return { ok: true as const, account: session };
      }
      return { ok: false as const, error: "accountNotFound" as const };
    },
    []
  );

  const signUp = useCallback(
    (params: {
      displayName: string;
      identifier: string;
      provider: LandingAuthProvider;
      roles: UserRole;
    }) => {
      const existing = findAccountByIdentifier(params.identifier);
      if (existing) {
        return { ok: false as const, error: "accountExists" as const };
      }
      const created = createAccount(params);
      setAccount(created);
      return { ok: true as const, account: created };
    },
    []
  );

  const saveAccount = useCallback((updated: LandingUserAccount) => {
    const saved = updateAccount(updated);
    setAccount(saved);
    return saved;
  }, []);

  const signOut = useCallback(() => {
    clearLandingSession();
    setAccount(null);
  }, []);

  const deactivate = useCallback(() => {
    if (!account) return;
    deactivateAccount(account.id);
    setAccount(null);
  }, [account]);

  const deleteData = useCallback(() => {
    if (!account) return;
    deleteAccountData(account.id);
    setAccount(null);
  }, [account]);

  return {
    account,
    hydrated,
    refresh,
    signIn,
    signUp,
    saveAccount,
    signOut,
    deactivate,
    deleteData,
  };
}
