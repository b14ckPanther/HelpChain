/**
 * /volunteer route
 * The companion interface for nearby student volunteers.
 * Wraps VolunteerExperience in AppShell + DemoFrame.
 * Full-bleed on mobile, inside device frame on desktop.
 */

import type { Metadata } from "next";
import { AppShell, DemoFrame } from "@/components/ui";
import { VolunteerExperience } from "@/components/volunteer";

export const metadata: Metadata = {
  title: "Helpchain Volunteer — Receive Assistance Requests",
  description: "The Helpchain companion interface for nearby volunteers to accept assistance requests.",
};

export default function VolunteerPage() {
  return (
    <AppShell className="items-center justify-center">
      <DemoFrame label="Volunteer device">
        <div className="flex flex-col min-h-[100dvh] sm:min-h-[844px]">
          <VolunteerExperience />
        </div>
      </DemoFrame>
    </AppShell>
  );
}
