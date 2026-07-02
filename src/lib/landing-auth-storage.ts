/**
 * Home-page account persistence (localStorage).
 * Not connected to the realtime server or other routes.
 */

export type LandingAuthProvider = "email" | "phone" | "google" | "apple";

export type UserRole = "requester" | "volunteer" | "both";

export type VerificationStatus =
  | "not_submitted"
  | "pending_review"
  | "verified"
  | "rejected"
  | "additional_docs_required";

export type VerificationAuditResult =
  | "submitted"
  | "accepted"
  | "rejected"
  | "additional_docs_required";

export interface VerificationAuditEntry {
  id: string;
  userId: string;
  userDisplayName: string;
  timestamp: string;
  result: VerificationAuditResult;
  note?: string;
}

export interface RequesterProfile {
  disabilityType: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  verificationStatus: VerificationStatus;
  verificationDocumentName?: string;
  verificationDocumentDescription?: string;
  verificationSubmittedAt?: string;
  adminNote?: string;
}

export interface VolunteerProfile {
  displayName: string;
  profilePicture: string;
  shortDescription: string;
  languages: string[];
  phone: string;
  phoneVerified: boolean;
  phoneVerifiedAt?: string;
}

export interface LandingUserAccount {
  id: string;
  displayName: string;
  identifier: string;
  provider: LandingAuthProvider;
  roles: UserRole;
  signedInAt: string;
  updatedAt: string;
  accountStatus: "active" | "deactivated";
  requester?: RequesterProfile;
  volunteer?: VolunteerProfile;
}

const SESSION_KEY = "helpchain_landing_session";
const ACCOUNTS_KEY = "helpchain_landing_accounts";
const AUDIT_KEY = "helpchain_verification_audit";
const SKIP_AUTH_KEY = "helpchain_landing_skip_auth";

function generateId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function readLandingSession(): LandingUserAccount | null {
  const session = readJson<LandingUserAccount | null>(SESSION_KEY, null);
  if (!session || session.accountStatus === "deactivated") return null;

  const accounts = readAllAccounts();
  const stored = accounts.find((a) => a.id === session.id);
  if (!stored || stored.accountStatus === "deactivated") return null;
  return stored;
}

export function writeLandingSession(account: LandingUserAccount): void {
  writeJson(SESSION_KEY, account);
  upsertAccount(account);
}

export function clearLandingSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function readAuthSkipped(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(SKIP_AUTH_KEY) === "true";
}

export function writeAuthSkipped(skipped: boolean): void {
  if (skipped) {
    localStorage.setItem(SKIP_AUTH_KEY, "true");
  } else {
    localStorage.removeItem(SKIP_AUTH_KEY);
  }
}

function readAllAccounts(): LandingUserAccount[] {
  return readJson<LandingUserAccount[]>(ACCOUNTS_KEY, []);
}

function upsertAccount(account: LandingUserAccount): void {
  const accounts = readAllAccounts();
  const index = accounts.findIndex((a) => a.id === account.id);
  if (index >= 0) {
    accounts[index] = account;
  } else {
    accounts.push(account);
  }
  writeJson(ACCOUNTS_KEY, accounts);
}

export function findAccountByIdentifier(identifier: string): LandingUserAccount | null {
  const normalized = identifier.trim().toLowerCase();
  return (
    readAllAccounts().find(
      (a) => a.identifier.toLowerCase() === normalized && a.accountStatus === "active"
    ) ?? null
  );
}

export function createAccount(params: {
  displayName: string;
  identifier: string;
  provider: LandingAuthProvider;
  roles: UserRole;
}): LandingUserAccount {
  const now = new Date().toISOString();
  const account: LandingUserAccount = {
    id: generateId("usr"),
    displayName: params.displayName.trim(),
    identifier: params.identifier.trim().toLowerCase(),
    provider: params.provider,
    roles: params.roles,
    signedInAt: now,
    updatedAt: now,
    accountStatus: "active",
  };
  writeLandingSession(account);
  return account;
}

export function updateAccount(account: LandingUserAccount): LandingUserAccount {
  const updated = { ...account, updatedAt: new Date().toISOString() };
  writeLandingSession(updated);
  return updated;
}

export function deactivateAccount(accountId: string): void {
  const accounts = readAllAccounts().map((a) =>
    a.id === accountId ? { ...a, accountStatus: "deactivated" as const, updatedAt: new Date().toISOString() } : a
  );
  writeJson(ACCOUNTS_KEY, accounts);
  const session = readJson<LandingUserAccount | null>(SESSION_KEY, null);
  if (session?.id === accountId) {
    clearLandingSession();
  }
}

export function deleteAccountData(accountId: string): void {
  const accounts = readAllAccounts().filter((a) => a.id !== accountId);
  writeJson(ACCOUNTS_KEY, accounts);

  const audit = readVerificationAudit().filter((e) => e.userId !== accountId);
  writeJson(AUDIT_KEY, audit);

  const session = readJson<LandingUserAccount | null>(SESSION_KEY, null);
  if (session?.id === accountId) {
    clearLandingSession();
  }
}

export function getPendingVerifications(): LandingUserAccount[] {
  return readAllAccounts().filter(
    (a) =>
      a.accountStatus === "active" &&
      a.requester &&
      (a.requester.verificationStatus === "pending_review" ||
        a.requester.verificationStatus === "additional_docs_required")
  );
}

export function getAllRequesterAccounts(): LandingUserAccount[] {
  return readAllAccounts().filter(
    (a) => a.accountStatus === "active" && a.requester && a.roles !== "volunteer"
  );
}

export function readVerificationAudit(): VerificationAuditEntry[] {
  return readJson<VerificationAuditEntry[]>(AUDIT_KEY, []).sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

export function appendVerificationAudit(entry: Omit<VerificationAuditEntry, "id" | "timestamp">): VerificationAuditEntry {
  const full: VerificationAuditEntry = {
    ...entry,
    id: generateId("audit"),
    timestamp: new Date().toISOString(),
  };
  const audit = readVerificationAudit();
  audit.unshift(full);
  writeJson(AUDIT_KEY, audit);
  return full;
}

export function adminReviewVerification(
  userId: string,
  decision: "accepted" | "rejected" | "additional_docs_required",
  note?: string
): LandingUserAccount | null {
  const accounts = readAllAccounts();
  const index = accounts.findIndex((a) => a.id === userId);
  if (index < 0 || !accounts[index].requester) return null;

  const statusMap: Record<typeof decision, VerificationStatus> = {
    accepted: "verified",
    rejected: "rejected",
    additional_docs_required: "additional_docs_required",
  };

  const account = accounts[index];
  account.requester = {
    ...account.requester!,
    verificationStatus: statusMap[decision],
    adminNote: note?.trim() || undefined,
  };
  account.updatedAt = new Date().toISOString();
  accounts[index] = account;
  writeJson(ACCOUNTS_KEY, accounts);

  appendVerificationAudit({
    userId: account.id,
    userDisplayName: account.displayName,
    result: decision === "accepted" ? "accepted" : decision,
    note: note?.trim(),
  });

  const session = readJson<LandingUserAccount | null>(SESSION_KEY, null);
  if (session?.id === userId) {
    writeJson(SESSION_KEY, account);
  }

  return account;
}

export function formatPhoneDisplay(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 10) {
    return `+1 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  if (digits.length === 11 && digits.startsWith("1")) {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  return value.trim() || "+1";
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function isValidPhone(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 10;
}

export function isValidOtp(value: string): boolean {
  return /^\d{6}$/.test(value.trim());
}

export function canAccessRequesterRole(account: LandingUserAccount | null): boolean {
  if (!account) return false;
  if (account.roles === "volunteer") return false;
  return account.requester?.verificationStatus === "verified";
}

export function canAccessVolunteerRole(account: LandingUserAccount | null): boolean {
  if (!account) return false;
  if (account.roles === "requester") return false;
  return account.volunteer?.phoneVerified === true;
}

export function needsRequesterVerification(account: LandingUserAccount): boolean {
  if (account.roles === "volunteer") return false;
  const status = account.requester?.verificationStatus;
  return !status || status === "not_submitted" || status === "rejected" || status === "additional_docs_required";
}

export function needsVolunteerOtp(account: LandingUserAccount): boolean {
  if (account.roles === "requester") return false;
  return !account.volunteer?.phoneVerified;
}

export const DISABILITY_TYPES = [
  "Mobility impairment",
  "Visual impairment",
  "Hearing impairment",
  "Cognitive disability",
  "Chronic illness",
  "Other",
] as const;

export const LANGUAGE_OPTIONS = [
  "English",
  "Arabic",
  "French",
  "Spanish",
  "Mandarin",
  "Hindi",
  "Urdu",
  "Other",
] as const;

export const PROFILE_AVATARS = ["🧑", "👩", "👨", "🧑‍🦽", "👩‍🦯", "🧑‍🦼", "👨‍🦯", "👩‍🦽"] as const;
