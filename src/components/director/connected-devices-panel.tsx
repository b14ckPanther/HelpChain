"use client";

import { MonitorSmartphone, Circle } from "lucide-react";
import { Surface, SectionLabel } from "@/components/ui";
import { DIRECTOR_COPY } from "./director-copy";
import type { DirectorConnectedDevice } from "./director-types";

interface ConnectedDevicesPanelProps {
  devices: DirectorConnectedDevice[];
}

function formatConnectedTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function ConnectedDevicesPanel({ devices }: ConnectedDevicesPanelProps) {
  return (
    <Surface elevation="raised" padding="lg" as="section" aria-labelledby="director-devices-heading">
      <SectionLabel as="h2" id="director-devices-heading" size="sm" className="mb-[var(--hc-space-4)]">
        {DIRECTOR_COPY.sections.devices}
      </SectionLabel>

      {devices.length === 0 ? (
        <p className="text-[var(--hc-text-sm)] text-[var(--hc-text-muted)]">
          No devices connected yet.
        </p>
      ) : (
        <ul className="flex flex-col gap-[var(--hc-space-2)]" role="list">
          {devices.map((device) => (
            <li
              key={device.id}
              className="flex items-center gap-[var(--hc-space-3)] rounded-[var(--hc-radius-md)] border border-[var(--hc-border-subtle)] bg-[var(--hc-surface)] px-[var(--hc-space-4)] py-[var(--hc-space-3)] min-h-[var(--hc-touch-min)]"
            >
              <MonitorSmartphone
                size={18}
                className="text-[var(--hc-violet)] shrink-0"
                strokeWidth={1.75}
                aria-hidden="true"
              />
              <div className="flex-1 min-w-0">
                <p className="text-[var(--hc-text-sm)] font-semibold text-[var(--hc-text)] truncate">
                  {device.label}
                </p>
                <p className="text-[var(--hc-text-xs)] text-[var(--hc-text-subtle)] capitalize">
                  {device.role}
                  {device.role === "volunteer" && (
                    <>
                      {" · "}
                      {device.availability ? "Available" : "Unavailable"}
                    </>
                  )}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <span className="inline-flex items-center gap-1 text-[var(--hc-text-xs)] text-[var(--hc-success)]">
                  <Circle size={8} fill="currentColor" strokeWidth={0} aria-hidden="true" />
                  Live
                </span>
                <time
                  className="text-[var(--hc-text-xs)] text-[var(--hc-text-subtle)] tabular-nums"
                  dateTime={device.connectedAt}
                >
                  {formatConnectedTime(device.connectedAt)}
                </time>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Surface>
  );
}
