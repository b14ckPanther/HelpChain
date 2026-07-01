/**
 * /requester route
 * The accessible assist-device experience.
 * Wraps RequesterExperience in AppShell + DemoFrame.
 * Full-bleed on mobile, inside device frame on desktop.
 */

import type { Metadata } from "next";
import { AppShell, DemoFrame } from "@/components/ui";
import { RequesterExperience } from "@/components/requester";

export const metadata: Metadata = {
  title: "Helpchain — Request Assistance",
  description: "The accessible Helpchain assist device. One tap starts a nearby volunteer request.",
};

export default function RequesterPage() {
  return (
    <AppShell className="items-center justify-center">
      <DemoFrame label="Requester device — iPhone">
        <div className="flex flex-col min-h-[100dvh] sm:min-h-[844px]">
          <RequesterExperience />
        </div>
      </DemoFrame>
    </AppShell>
  );
}
