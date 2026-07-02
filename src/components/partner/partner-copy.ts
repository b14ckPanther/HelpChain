/**
 * Copy constants for partner scanner interface.
 */

export const PARTNER_COPY = {
  header: {
    title: "Partner Terminal",
    subtitle: "Validate and redeem Helpchain coupons",
  },
  scanner: {
    title: "Validate a Helpchain coupon",
    label: "Manual entry — camera not required",
    inputPlaceholder: "Enter HC-XXXX-XXXX coupon code",
    redeemBtn: "Redeem code",
    scanBtn: "Scan active coupon",
    scanNotice: "Validates coupon on server",
  },
  result: {
    successTitle: "Coupon validated",
    successNotice: "Thank you for validating this reward.",
    successAction: "Ready for next coupon",
  },
  recent: {
    title: "Recent Validations",
    empty: "No redemptions logged during this session.",
  }
} as const;
