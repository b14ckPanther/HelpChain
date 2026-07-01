/**
 * Volunteer domain types
 */

export type VolunteerStep =
  | "ready"         // Offline / ready state
  | "waiting"       // Online / available for requests
  | "incoming"      // Screen showing active incoming request to accept/decline
  | "matched"       // Connected to requester, on the way
  | "in_progress"   // Arrived, assistance in progress
  | "awaiting_confirmation" // Completion marked, waiting for requester confirmation
  | "completed";    // Dual completed verified, rating & reward update

export interface LocalVolunteerState {
  step: VolunteerStep;
  available: boolean;
  displayName: string;
}
