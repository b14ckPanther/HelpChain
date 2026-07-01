/**
 * Landing page copy — local demo introduction only.
 */

export const LANDING_COPY = {
  headline: "One clear action. A nearby human connection.",
  description:
    "Helpchain helps people request nearby, situational assistance through an accessible real-time volunteer network.",
  footer: "Interactive prototype for demonstration purposes.",
  roles: {
    requester: {
      title: "Request assistance",
      description: "Open the accessible assist device for Rajaa's demo request flow.",
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
      description: "Simulate Haven Café coupon validation at the merchant terminal.",
      href: "/partner",
      cta: "Open partner",
    },
  },
} as const;
