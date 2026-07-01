/**
 * ScreenReaderOnly
 * Visually hides content while keeping it accessible to screen readers.
 */

import React from "react";

interface ScreenReaderOnlyProps {
  children: React.ReactNode;
  as?: keyof React.JSX.IntrinsicElements;
}

export function ScreenReaderOnly({
  children,
  as: Tag = "span",
}: ScreenReaderOnlyProps) {
  return <Tag className="sr-only">{children}</Tag>;
}
