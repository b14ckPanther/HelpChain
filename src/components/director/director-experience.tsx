"use client";

import { useCallback, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { AlertCircle, RotateCcw } from "lucide-react";
import { useDirectorRealtime } from "@/lib/realtime";
import { AppShell, PageContainer, Surface, SectionLabel, Button } from "@/components/ui";
import { DirectorHeader } from "./director-header";
import { DemoHealthOverview } from "./demo-health-overview";
import { ConnectedDevicesPanel } from "./connected-devices-panel";
import { ActiveSessionPanel } from "./active-session-panel";
import { RewardsOverviewPanel } from "./rewards-overview-panel";
import { PresentationSetupPanel } from "./presentation-setup-panel";
import { DirectorEventLog } from "./director-event-log";
import { DirectorResetDialog } from "./director-reset-dialog";
import { DirectorScenarioDialog } from "./director-scenario-dialog";
import { DIRECTOR_COPY } from "./director-copy";
import type { DirectorScenario } from "./director-types";

export function DirectorExperience() {
  const {
    connected,
    state,
    error,
    lastActionMessage,
    resetDemo,
    prepareDirectorScenario,
  } = useDirectorRealtime();

  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [scenarioDialogOpen, setScenarioDialogOpen] = useState(false);
  const [pendingScenario, setPendingScenario] = useState<DirectorScenario | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ariaAnnouncement, setAriaAnnouncement] = useState("");

  const handleOpenScenario = useCallback((scenario: DirectorScenario) => {
    setPendingScenario(scenario);
    setScenarioDialogOpen(true);
  }, []);

  const handleConfirmScenario = useCallback(() => {
    if (!pendingScenario) return;
    setIsSubmitting(true);

    prepareDirectorScenario(pendingScenario, (success, message, err) => {
      setIsSubmitting(false);
      setScenarioDialogOpen(false);
      setPendingScenario(null);

      if (success) {
        setAriaAnnouncement(message || "Scenario prepared.");
      } else {
        setAriaAnnouncement(err || "Scenario preparation failed.");
      }
    });
  }, [pendingScenario, prepareDirectorScenario]);

  const handleConfirmReset = useCallback(() => {
    setIsSubmitting(true);
    resetDemo((success, message, err) => {
      setIsSubmitting(false);
      setResetDialogOpen(false);

      if (success) {
        setAriaAnnouncement(message || "Demo reset to baseline.");
      } else {
        setAriaAnnouncement(err || "Demo reset failed.");
      }
    });
  }, [resetDemo]);

  return (
    <AppShell>
      <PageContainer className="py-[var(--hc-space-6)] sm:py-[var(--hc-space-8)] max-w-[1400px]">
        <div className="flex flex-col gap-[var(--hc-space-6)]">
          <DirectorHeader connected={connected} />

          {(error || !connected) && (
            <Surface elevation="base" padding="md" className="border border-[var(--hc-warning)]/30">
              <div className="flex items-start gap-[var(--hc-space-3)]">
                <AlertCircle
                  size={18}
                  className="text-[var(--hc-warning)] shrink-0 mt-0.5"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
                <p className="text-[var(--hc-text-sm)] text-[var(--hc-text-muted)]">
                  {error || "Connect to the local Helpchain demo server to use director controls."}
                </p>
              </div>
            </Surface>
          )}

          <DemoHealthOverview health={state.demoHealth} />

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-[var(--hc-space-6)]">
            <ConnectedDevicesPanel devices={state.connectedDevices} />
            <ActiveSessionPanel session={state.activeRequestSummary} />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-[var(--hc-space-6)]">
            <RewardsOverviewPanel rewards={state.rewardSummary} />
            <DirectorEventLog events={state.eventLog} />
          </div>

          <PresentationSetupPanel onPrepareScenario={handleOpenScenario} isBusy={isSubmitting} />

          <Surface
            elevation="base"
            padding="lg"
            as="section"
            aria-labelledby="director-reset-heading"
            className="border border-[var(--hc-help-red)]/20"
          >
            <SectionLabel as="h2" id="director-reset-heading" size="sm" className="mb-[var(--hc-space-2)]">
              {DIRECTOR_COPY.sections.reset}
            </SectionLabel>
            <p className="text-[var(--hc-text-sm)] text-[var(--hc-text-muted)] mb-[var(--hc-space-4)] max-w-2xl leading-relaxed">
              {DIRECTOR_COPY.reset.description}
            </p>
            <Button
              variant="danger"
              size="md"
              className="min-h-[var(--hc-touch-min)] inline-flex items-center gap-2"
              onClick={() => setResetDialogOpen(true)}
              disabled={!connected || isSubmitting}
            >
              <RotateCcw size={18} strokeWidth={1.75} aria-hidden="true" />
              {DIRECTOR_COPY.reset.action}
            </Button>
          </Surface>
        </div>

        <AnimatePresence>
          {resetDialogOpen && (
            <DirectorResetDialog
              open={resetDialogOpen}
              onConfirm={handleConfirmReset}
              onCancel={() => setResetDialogOpen(false)}
              isSubmitting={isSubmitting}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {scenarioDialogOpen && (
            <DirectorScenarioDialog
              open={scenarioDialogOpen}
              scenario={pendingScenario}
              onConfirm={handleConfirmScenario}
              onCancel={() => {
                setScenarioDialogOpen(false);
                setPendingScenario(null);
              }}
              isSubmitting={isSubmitting}
            />
          )}
        </AnimatePresence>

        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {ariaAnnouncement ||
            lastActionMessage ||
            (connected ? DIRECTOR_COPY.connection.connected : DIRECTOR_COPY.connection.disconnected)}
        </div>
      </PageContainer>
    </AppShell>
  );
}
