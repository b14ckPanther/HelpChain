/**
 * Director console UI copy
 */

export const DIRECTOR_COPY = {
  pageTitle: "Helpchain Director",
  subtitle: "Operations console",
  notice:
    "Use this screen to monitor activity, prepare scenarios, and reset the system.",
  persistenceNote: "Session data resets when the server restarts.",

  connection: {
    connected: "Connected to Helpchain server",
    disconnected: "Waiting for connection",
  },

  sections: {
    health: "System health",
    devices: "Connected devices",
    session: "Current session",
    rewards: "Rewards and coupons",
    setup: "Presentation setup",
    timeline: "Event timeline",
    reset: "Reset all",
  },

  healthLabels: {
    requesters: "Requester devices",
    volunteers: "Volunteers connected",
    available: "Volunteers available",
    partners: "Partner stations",
    session: "Active session",
    stars: "Noor's stars",
    coupons: "Active coupons",
  },

  session: {
    empty: "No active assistance session.",
    status: "Session status",
    category: "Help category",
    location: "Location",
    volunteer: "Assigned volunteer",
    milestone: "Session milestone",
    elapsed: "Session elapsed",
  },

  rewards: {
    balance: "Star balance",
    active: "Active coupons",
    redeemed: "Redeemed coupons",
    expired: "Expired coupons",
    recent: "Most recent coupon",
    none: "No coupons issued yet",
  },

  scenarios: {
    baseline: {
      title: "Fresh start",
      purpose: "Return to the fully clean baseline before a new run.",
      prepared: "No active session, 4 stars, no coupons, volunteers unavailable.",
      action: "Prepare fresh start",
    },
    help_session_ready: {
      title: "Help session ready",
      purpose: "Jump to a matched assistance session for rehearsal.",
      prepared:
        "Matched Read text request at Main Hall with Noor assigned.",
      action: "Prepare help session",
    },
    rewards_ready: {
      title: "Rewards ready",
      purpose: "Show the rewards wallet flow without replaying the full session.",
      prepared: "Noor has 5 stars. Haven Café is unlocked. No coupon yet.",
      action: "Prepare rewards ready",
    },
    coupon_ready: {
      title: "Coupon ready",
      purpose: "Show partner redemption with an active coupon.",
      prepared:
        "One active Haven Café coupon issued. Noor has 0 stars after redemption.",
      action: "Prepare coupon ready",
    },
  },

  reset: {
    title: "Reset all",
    description:
      "Clear the active session, rewards, coupons, and event history. Connected devices return to their starting state.",
    action: "Reset all",
  },

  dialogs: {
    reset: {
      title: "Reset Helpchain?",
      body: "This clears the active session, rewards, coupons, and event history. Connected devices will return to their starting state.",
      confirm: "Reset all",
      cancel: "Keep current state",
    },
    scenarioConfirm: (title: string, purpose: string) =>
      `Prepare "${title}"? ${purpose}`,
    scenarioPrimary: "Prepare scenario",
    scenarioCancel: "Cancel",
  },

  milestones: {
    idle: "Idle",
    seeking_volunteer: "Seeking volunteer",
    volunteer_on_the_way: "Volunteer on the way",
    assistance_active: "Assistance active",
    awaiting_confirmation: "Awaiting requester confirmation",
    completed: "Completed",
    completed_and_rewarded: "Completed and star awarded",
  },

  statusLabels: {
    pending: "Pending",
    matched: "Matched",
    in_progress: "In progress",
    awaiting_requester_confirmation: "Awaiting confirmation",
    completed: "Completed",
    idle: "Idle",
  },
} as const;
