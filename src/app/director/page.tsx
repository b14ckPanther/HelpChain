/**
 * /director route
 * Local-only presenter control room for rehearsals and classroom demos.
 */

import type { Metadata } from "next";
import { DirectorExperience } from "@/components/director";

export const metadata: Metadata = {
  title: "Helpchain Director — Presentation Controls",
  description: "Operations console to monitor, reset, and prepare Helpchain sessions.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DirectorPage() {
  return <DirectorExperience />;
}
