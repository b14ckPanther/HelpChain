/**
 * Requester UI copy
 * All user-facing text for the requester experience.
 * Centralized here to avoid scattered string literals.
 */

export const REQUESTER_COPY = {
  brand: "Helpchain",

  nav: {
    home: "Home",
  },

  completed: {
    requestAgain: "I need help again",
    homeHint: "Or return to the home page to switch roles.",
  },

  // Ready state
  ready: {
    headline: "Need a hand nearby?",
    subline: "One clear action connects you with a nearby volunteer.",
    buttonLabel: "I need help",
    safetyNote: "For immediate danger, contact local emergency services.",
    connectedStatus: "Connected to Helpchain",
    disconnectedStatus: "Waiting for connection",
  },

  // Category selection
  category: {
    sheetTitle: "What do you need help with?",
    navigation: {
      title: "Navigation",
      description: "Help getting to a specific location or finding your way",
    },
    read_text: {
      title: "Read text",
      description: "Help reading signs, labels, menus, or documents",
    },
    reach_shelf: {
      title: "Reach shelf",
      description: "Help reaching or picking up an item",
    },
    other: {
      title: "Other",
      description: "Any other short situational assistance",
    },
  },

  // Details step
  details: {
    heading: "Describe what you need",
    descriptionPlaceholder: "Tell your volunteer what you need help with...",
    voiceLabel: "Voice input",
    voiceListening: "Listening...",
    voiceReady: "Tap to speak",
    voiceDisclaimer: "An alternative to typing your request",
    locationLabel: "Location",
    submitButton: "Send help request",
    editCategory: "Change",
  },

  // Sending transition
  sending: {
    headline: "Request sent",
    subline: "Looking for a nearby volunteer",
  },

  // Seeking state
  seeking: {
    headline: "Looking for a nearby volunteer",
    subline: "We're notifying available volunteers near Main Hall.",
    reassurance: "You can stay on this screen while we look.",
    searchingLabel: "Searching nearby",
    responseHint: "Response usually takes less than a minute",
    cancelButton: "Cancel request",
    cancelConfirmTitle: "Cancel your request?",
    cancelConfirmMessage: "Your request will be removed and volunteers will no longer be notified.",
    cancelConfirmYes: "Yes, cancel",
    cancelConfirmNo: "Keep looking",
    nearbyLabel: "Searching nearby",
    matchPreview: "Volunteer matching will appear here.",
  },

  // Demo voice transcript for "Read text" category
  demoVoiceTranscript: "Can someone help me read the platform sign?",
} as const;
