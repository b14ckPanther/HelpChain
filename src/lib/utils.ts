/**
 * Utility functions for the Helpchain prototype.
 * Keep this file small — add utilities as needed.
 */

/**
 * Merge class name strings, filtering out falsy values.
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
