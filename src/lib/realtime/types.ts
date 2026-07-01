/**
 * Socket.IO Real-time layer types
 */

export type HelpCategory = "navigation" | "read_text" | "reach_shelf" | "other";

export type RequestStatus =
  | "pending"
  | "matched"
  | "in_progress"
  | "awaiting_requester_confirmation"
  | "completed";

export interface DemoSessionData {
  id: string;
  matchedAt: string;
  arrivedAt: string | null;
  volunteerCompletedAt: string | null;
  requesterConfirmedAt: string | null;
  requesterRating: number | null;
  volunteerRating: number | null;
  starAwardedAt: string | null;
}

export interface DemoVolunteerInfo {
  participantId: string;
  displayName: string;
  initials: string;
  averageRating: number;
  starBalance: number;
}

export interface HelpRequestData {
  id: string;
  status: RequestStatus;
  category: HelpCategory;
  description: string;
  locationLabel: string;
  createdAt: string;
  volunteer: DemoVolunteerInfo | null;
  session: DemoSessionData | null;
}

// --- Phase 4 State Model Definitions ---

export interface DemoReward {
  id: string;
  partnerId: string;
  partnerName: string;
  partnerCategory: string;
  title: string;
  description: string;
  starsRequired: number;
  monthlyRedemptionLimit: number;
  active: boolean;
  visualAccentKey: string;
}

export interface DemoCoupon {
  id: string;
  couponCode: string;
  qrPayload: string;
  qrDataUrl: string;
  volunteerId: string;
  rewardId: string;
  partnerId: string;
  partnerName: string;
  title: string;
  starsSpent: number;
  issuedAt: string;
  expiresAt: string;
  status: "active" | "redeemed" | "expired";
  redeemedAt: string | null;
  redeemedByPartnerId: string | null;
  refundedAt: string | null;
}

export interface DemoVolunteerProfile {
  id: string;
  displayName: string;
  initials: string;
  starBalance: number;
  averageRating: number;
  rewardHistory: Array<{
    couponId: string;
    rewardId: string;
    title: string;
    starsSpent: number;
    redeemedAt: string | null;
    issuedAt: string;
  }>;
  couponIds: string[];
}

export interface DemoRewardsRoleData {
  profile: DemoVolunteerProfile;
  rewardsCatalog: DemoReward[];
  coupons: DemoCoupon[];
}

export interface RecentRedemptionItem {
  id: string;
  couponCode: string;
  rewardTitle: string;
  redeemedAt: string;
}

export interface DemoPartnerRoleData {
  partnerId: string;
  partnerName: string;
  coupons: DemoCoupon[];
  recentRedemptions: RecentRedemptionItem[];
}

export interface DemoStateSnapshot {
  activeRequest: HelpRequestData | null;
  availableVolunteersCount: number;
  totalVolunteersCount: number;
  rewardsRoleData?: DemoRewardsRoleData;
  partnerRoleData?: DemoPartnerRoleData;
}

// --- Phase 5 Director Console ---

export type DemoRole = "requester" | "volunteer" | "partner" | "director";

export type DirectorEventTone = "neutral" | "success" | "warning" | "critical";

export type DirectorScenario =
  | "baseline"
  | "rewards_ready"
  | "coupon_ready"
  | "help_session_ready";

export interface DirectorConnectedDevice {
  id: string;
  role: DemoRole;
  label: string;
  connectedAt: string;
  availability?: boolean;
}

export interface DirectorActiveRequestSummary {
  status: RequestStatus;
  category: HelpCategory;
  categoryLabel: string;
  locationLabel: string;
  volunteerName: string | null;
  sessionMilestone: string;
  createdAt: string;
  matchedAt: string | null;
  arrivedAt: string | null;
}

export interface DirectorRewardSummary {
  noorStarBalance: number;
  activeCouponsCount: number;
  redeemedCouponsCount: number;
  expiredCouponsCount: number;
  mostRecentCoupon: {
    code: string;
    status: DemoCoupon["status"];
    partnerName: string;
    issuedAt: string;
  } | null;
}

export interface DirectorPartnerSummary {
  havenCafeRecentRedemptionsCount: number;
}

export interface DirectorEventLogEntry {
  id: string;
  type: string;
  message: string;
  createdAt: string;
  tone: DirectorEventTone;
}

export interface DirectorDemoHealth {
  requesterDevicesConnected: number;
  volunteersConnected: number;
  volunteersAvailable: number;
  partnerStationsConnected: number;
  directorConsolesConnected: number;
  activeSessionState: RequestStatus | "idle";
  noorStarBalance: number;
  activeCouponCount: number;
}

export interface DirectorStateSnapshot {
  connectedDevices: DirectorConnectedDevice[];
  demoHealth: DirectorDemoHealth;
  activeRequestSummary: DirectorActiveRequestSummary | null;
  rewardSummary: DirectorRewardSummary;
  partnerSummary: DirectorPartnerSummary;
  eventLog: DirectorEventLogEntry[];
}

// Client Protocol Event Name Constants
export const SOCKET_EVENTS = {
  // Client -> Server
  JOIN: "demo:join",
  STATE_REQUEST: "demo:state:request",
  AVAILABILITY_SET: "volunteer:availability:set",
  REQUEST_CREATE: "help:request:create",
  REQUEST_ACCEPT: "help:request:accept",
  REQUEST_DECLINE: "help:request:decline",
  REQUEST_CANCEL: "help:request:cancel",

  // Session Stage Controls
  ARRIVAL_CONFIRM: "session:arrival:confirm",
  COMPLETION_MARK: "session:completion:mark",
  COMPLETION_CONFIRM: "session:completion:confirm",
  RATING_SUBMIT: "session:rating:submit",

  // Phase 4 Rewards & Redemption
  REWARDS_CATALOG_REQUEST: "rewards:catalog:request",
  REWARD_REDEMPTION_CREATE: "reward:redemption:create",
  COUPON_REDEMPTION_SUBMIT: "coupon:redemption:submit",
  COUPON_REDEMPTION_SIMULATE_SCAN: "coupon:redemption:simulate-scan",

  // Server -> Client
  STATE: "demo:state",
  ERROR: "demo:error",
  INCOMING_REQUEST: "help:request:incoming",
  REQUEST_ACCEPTED: "help:request:accepted",

  // Session Stage Updates
  ARRIVED: "session:arrived",
  AWAITING_CONFIRMATION: "session:completion:awaiting-confirmation",
  COMPLETED: "session:completed",
  RATING_UPDATED: "session:rating:updated",

  // Phase 4 S -> C Alerts
  COUPON_ISSUED: "coupon:issued",
  COUPON_REDEEMED: "coupon:redeemed",
  COUPON_REJECTED: "coupon:rejected",

  // Phase 5 Director Console
  DIRECTOR_STATE_REQUEST: "director:state:request",
  DIRECTOR_DEMO_RESET: "director:demo:reset",
  DIRECTOR_SCENARIO_PREPARE: "director:scenario:prepare",
  DIRECTOR_STATE: "director:state",
  DIRECTOR_EVENT_RECORDED: "director:event:recorded",
  DIRECTOR_ACTION_COMPLETED: "director:action:completed",
} as const;
