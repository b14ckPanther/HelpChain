/**
 * /director route
 * Local-only presenter control room for rehearsals and classroom demos.
 */

import type { Metadata } from "next";
import { DirectorExperience } from "@/components/director";

export const metadata: Metadata = {
  title: "Helpchain Director — Presentation Controls",
  description: "Local presentation controls to monitor, reset, and prepare the Helpchain demonstration.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DirectorPage() {
  return <DirectorExperience />;
}
