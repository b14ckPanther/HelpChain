/**
 * Copy definitions for the volunteer rewards wallet.
 */

export const REWARD_COPY = {
  header: {
    title: "My rewards",
    subtitle: "Stars are earned after verified help sessions.",
    progressLabel: (current: number, target: number) => 
      `${current} / ${target} stars toward your next reward`,
  },
  redemptionDialog: {
    title: "Confirm Reward Redemption",
    starsSpent: (cost: number) => `Cost: ${cost} stars`,
    warning: "Stars will be exchanged for one coupon.",
    confirm: (cost: number) => `Redeem ${cost} stars`,
    cancel: "Keep my stars",
  },
  couponDetail: {
    validity: "Valid for 30 days",
    instructions: (partnerName: string) => `Present this code at ${partnerName}.`,
    disclaimer: "Present this coupon at the participating partner location.",
  },
  status: {
    active: "Active",
    redeemed: "Redeemed",
    expired: "Expired",
  }
} as const;
