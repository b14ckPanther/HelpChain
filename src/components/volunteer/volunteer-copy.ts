/**
 * Volunteer UI Copy
 */

export const VOLUNTEER_COPY = {
  brand: "Helpchain Volunteer",
  defaultName: "Noor",
  ratingText: "4.9 Rating",

  nav: {
    home: "Home",
    dashboard: "Dashboard",
    rewards: "Rewards",
  },

  completed: {
    returnAvailable: "Return to availability",
    returnHome: "Back to home screen",
    viewRewards: "My rewards",
  },

  ready: {
    title: "Be ready to help someone nearby.",
    buttonGoOnline: "Go available",
    connectedStatus: "Connected to Helpchain",
    disconnectedStatus: "Waiting for connection",
    offlineStatus: "Unavailable",
  },

  waiting: {
    title: "You're available for nearby requests.",
    subtitle: "Keep this screen active. We'll alert you with sound and vibration if someone nearby needs a hand.",
    buttonGoOffline: "Go unavailable",
    statusMessage: "Available",
  },

  incoming: {
    alert: "New assistance request nearby",
    categoryLabel: "Category",
    locationLabel: "Location",
    descriptionLabel: "Description",
    acceptButton: "Accept request",
    declineButton: "Decline",
    proximityLabel: "Nearby",
  },

  matched: {
    title: "You're connected",
    instruction: "Please proceed directly to the location below to assist the requester.",
    locationHeader: "Assistance Location",
    disclaimers: "Always prioritize personal safety. Confirm with the requester once you arrive.",
    notice: "Completion, rating, and reward coupon states will be unlocked in later phases.",
  },

  lostRace: {
    title: "Another volunteer accepted this request.",
    backToWaiting: "Returning to availability list...",
  },
} as const;
