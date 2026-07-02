/**
 * Landing page copy
 */

export const LANDING_COPY = {
  headline: "One clear action. A nearby human connection.",
  description:
    "Helpchain helps people request nearby, situational assistance through an accessible real-time volunteer network.",
  footer: "Connecting people with nearby volunteers.",
  roles: {
    requester: {
      title: "Request assistance",
      description: "Open the accessible assist device to request nearby help.",
      href: "/requester",
      cta: "Open requester",
    },
    volunteer: {
      title: "Volunteer companion",
      description: "Receive live help requests and guide Noor through the session.",
      href: "/volunteer",
      cta: "Open volunteer",
    },
    partner: {
      title: "Partner validation",
      description: "Validate Haven Café coupons at the merchant terminal.",
      href: "/partner",
      cta: "Open partner",
    },
  },
} as const;
