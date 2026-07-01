/**
 * Helpchain Design Token Constants
 * TypeScript-accessible tokens that mirror CSS custom properties.
 * Use these for component logic (e.g., conditional styling, animation config).
 * CSS variables remain the primary styling mechanism.
 */

export const COLORS = {
  canvas: "#0A0B0E",
  surface: "#12141A",
  surfaceRaised: "#1A1D25",
  surfaceOverlay: "#22252F",
  text: "#F8F7F4",
  textMuted: "#B5B8C2",
  textSubtle: "#7A7E8A",
  helpRed: "#E5484D",
  helpRedDeep: "#B92D37",
  success: "#35D07F",
  warning: "#F6B94D",
  violet: "#A990FF",
} as const;

export const TIMING = {
  fast: 150,
  normal: 250,
  slow: 400,
  slower: 600,
} as const;

export const TOUCH_TARGETS = {
  /** Minimum 44px — WCAG requirement */
  min: 44,
  /** Comfortable 56px */
  large: 56,
} as const;

/**
 * Project-level constants
 */
export const PROJECT = {
  name: "Helpchain",
  tagline: "One clear action. A nearby human connection.",
  version: "0.1.0",
  phase: 6,
  mode: "prototype" as const,
} as const;
