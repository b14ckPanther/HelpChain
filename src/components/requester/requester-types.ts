/**
 * Requester domain types
 * Local client-side state types for the requester experience.
 * No server/socket types — those belong in Phase 2+.
 */

export type RequesterStep =
  | "ready"
  | "category"
  | "details"
  | "sending"
  | "seeking"
  | "matched"
  | "in_progress"
  | "awaiting_requester_confirmation"
  | "completed";

export type HelpCategory = "navigation" | "read_text" | "reach_shelf" | "other";

export interface CategoryOption {
  id: HelpCategory;
  title: string;
  description: string;
  iconName: string;
}

export interface LocalRequestState {
  step: RequesterStep;
  category: HelpCategory | null;
  description: string;
  locationLabel: string;
}

export const INITIAL_REQUEST_STATE: LocalRequestState = {
  step: "ready",
  category: null,
  description: "",
  locationLabel: "Demo Zone A — Main Hall",
};
