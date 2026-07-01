/**
 * Session UI copy
 */

export const SESSION_COPY = {
  timeline: {
    step1: "Request accepted",
    step2: "Volunteer arrived",
    step3: "Help confirmed",
  },
  rating: {
    heading: "How was your experience?",
    subheading: "Submit a rating to close this help session record.",
    ratingButtonLabel: (value: number) => `Rate ${value} out of 5`,
    thanks: "Thank you for your rating!",
    submit: "Submit rating",
  },
} as const;
