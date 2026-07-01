"use client";

import { motion } from "framer-motion";
import { RotateCcw, Route, Star, Ticket, Sparkles } from "lucide-react";
import { Surface, SectionLabel, Button } from "@/components/ui";
import { DIRECTOR_COPY } from "./director-copy";
import type { DirectorScenario } from "./director-types";

interface ScenarioDefinition {
  id: DirectorScenario;
  title: string;
  purpose: string;
  prepared: string;
  action: string;
  icon: typeof RotateCcw;
}

const SCENARIOS: ScenarioDefinition[] = [
  {
    id: "baseline",
    ...DIRECTOR_COPY.scenarios.baseline,
    icon: RotateCcw,
  },
  {
    id: "help_session_ready",
    ...DIRECTOR_COPY.scenarios.help_session_ready,
    icon: Route,
  },
  {
    id: "rewards_ready",
    ...DIRECTOR_COPY.scenarios.rewards_ready,
    icon: Star,
  },
  {
    id: "coupon_ready",
    ...DIRECTOR_COPY.scenarios.coupon_ready,
    icon: Ticket,
  },
];

interface PresentationSetupPanelProps {
  onPrepareScenario: (scenario: DirectorScenario) => void;
  isBusy: boolean;
}

export function PresentationSetupPanel({ onPrepareScenario, isBusy }: PresentationSetupPanelProps) {
  return (
    <Surface elevation="raised" padding="lg" as="section" aria-labelledby="director-setup-heading">
      <SectionLabel as="h2" id="director-setup-heading" size="sm" className="mb-[var(--hc-space-2)]">
        {DIRECTOR_COPY.sections.setup}
      </SectionLabel>
      <p className="text-[var(--hc-text-xs)] text-[var(--hc-text-subtle)] mb-[var(--hc-space-4)]">
        Rehearsal shortcuts only. Each action requires confirmation.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--hc-space-3)]">
        {SCENARIOS.map((scenario) => {
          const Icon = scenario.icon;
          return (
            <motion.article
              key={scenario.id}
              className="flex flex-col gap-[var(--hc-space-3)] rounded-[var(--hc-radius-lg)] border border-[var(--hc-border-subtle)] bg-[var(--hc-surface)] p-[var(--hc-space-4)]"
              whileHover={{ y: -1 }}
              transition={{ duration: 0.18 }}
            >
              <div className="flex items-start gap-[var(--hc-space-3)]">
                <div
                  className="flex items-center justify-center w-10 h-10 rounded-[var(--hc-radius-md)] bg-[var(--hc-violet-muted)] text-[var(--hc-violet)] shrink-0"
                  aria-hidden="true"
                >
                  <Icon size={18} strokeWidth={1.75} />
                </div>
                <div>
                  <h3 className="text-[var(--hc-text-sm)] font-bold text-[var(--hc-text)]">{scenario.title}</h3>
                  <p className="text-[var(--hc-text-xs)] text-[var(--hc-text-muted)] mt-1 leading-relaxed">
                    {scenario.purpose}
                  </p>
                </div>
              </div>

              <p className="text-[var(--hc-text-xs)] text-[var(--hc-text-subtle)] leading-relaxed border-t border-[var(--hc-border-subtle)] pt-[var(--hc-space-3)]">
                <Sparkles size={12} className="inline mr-1 text-[var(--hc-violet)]" aria-hidden="true" />
                {scenario.prepared}
              </p>

              <Button
                variant="secondary"
                size="md"
                className="w-full justify-center min-h-[var(--hc-touch-min)]"
                onClick={() => onPrepareScenario(scenario.id)}
                disabled={isBusy}
                aria-label={`${scenario.action} scenario`}
              >
                {scenario.action}
              </Button>
            </motion.article>
          );
        })}
      </div>
    </Surface>
  );
}
