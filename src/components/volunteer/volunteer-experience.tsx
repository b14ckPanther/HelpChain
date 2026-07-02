/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Info, RefreshCw } from "lucide-react";
import { useDemoRealtime } from "@/lib/realtime";
import { VOLUNTEER_COPY } from "./volunteer-copy";
import {
  VolunteerReadyState,
  IncomingRequestCard,
  VolunteerMatchedState,
  VolunteerInProgressState,
  VolunteerAwaitingConfirmState,
  VolunteerCompletedState,
  VolunteerNavBar,
} from "./index";
import { StatusPill, Surface, Button } from "@/components/ui";
import type { LocalVolunteerState } from "./volunteer-types";

export function VolunteerExperience() {
  const [displayName] = useState("Noor");
  const [localState, setLocalState] = useState<LocalVolunteerState>({
    step: "ready",
    available: false,
    displayName,
  });

  const lostRaceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initialize socket realtime layer
  const {
    connected,
    state: realtimeState,
    setAvailability,
    acceptRequest,
    declineRequest,
    confirmArrival,
    markCompletion,
    submitRating,
    cancelRequest,
  } = useDemoRealtime({
    role: "volunteer",
    displayName,
  });

  // Sync state step based on server snapshot
  useEffect(() => {
    if (!connected) {
      setLocalState((prev) => ({ ...prev, step: "ready", available: false }));
      return;
    }

    const activeRequest = realtimeState.activeRequest;

    if (!activeRequest) {
      // If server has no active request and we were not idle, return to waiting or ready
      if (
        localState.step === "incoming" ||
        localState.step === "matched" ||
        localState.step === "in_progress" ||
        localState.step === "awaiting_confirmation" ||
        localState.step === "completed"
      ) {
        setLocalState((prev) => ({
          ...prev,
          step: prev.available ? "waiting" : "ready",
        }));
      }
    } else {
      // Active request exists on server
      if (activeRequest.status === "pending") {
        if (localState.available && localState.step === "waiting") {
          setLocalState((prev) => ({ ...prev, step: "incoming" }));
        }
      } else if (activeRequest.status === "matched") {
        const matchedVol = activeRequest.volunteer?.displayName;
        if (matchedVol === displayName) {
          setLocalState((prev) => ({ ...prev, step: "matched" }));
        } else {
          // Another volunteer won the race
          if (
            localState.step === "incoming" ||
            localState.step === "matched" ||
            localState.step === "in_progress" ||
            localState.step === "awaiting_confirmation" ||
            localState.step === "completed"
          ) {
            setLocalState((prev) => ({ ...prev, step: "ready" })); // Temporarily show lost race
            
            if (lostRaceTimeoutRef.current) clearTimeout(lostRaceTimeoutRef.current);
            lostRaceTimeoutRef.current = setTimeout(() => {
              setLocalState((prev) => ({
                ...prev,
                step: prev.available ? "waiting" : "ready",
              }));
            }, 2500);
          }
        }
      } else if (activeRequest.status === "in_progress") {
        const matchedVol = activeRequest.volunteer?.displayName;
        if (matchedVol === displayName && localState.step !== "in_progress") {
          setLocalState((prev) => ({ ...prev, step: "in_progress" }));
        }
      } else if (activeRequest.status === "awaiting_requester_confirmation") {
        const matchedVol = activeRequest.volunteer?.displayName;
        if (matchedVol === displayName && localState.step !== "awaiting_confirmation") {
          setLocalState((prev) => ({ ...prev, step: "awaiting_confirmation" }));
        }
      } else if (activeRequest.status === "completed") {
        const matchedVol = activeRequest.volunteer?.displayName;
        if (matchedVol === displayName && localState.step !== "completed") {
          setLocalState((prev) => ({ ...prev, step: "completed" }));
        }
      }
    }
  }, [realtimeState.activeRequest, connected, localState.available, localState.step, displayName]);

  // Clean timeouts on unmount
  useEffect(() => {
    return () => {
      if (lostRaceTimeoutRef.current) clearTimeout(lostRaceTimeoutRef.current);
    };
  }, []);

  // --- Handlers ---

  const handleGoAvailable = useCallback(() => {
    setLocalState((prev) => ({ ...prev, step: "waiting", available: true }));
    setAvailability(true);
  }, [setAvailability]);

  const handleGoUnavailable = useCallback(() => {
    setLocalState((prev) => ({ ...prev, step: "ready", available: false }));
    setAvailability(false);
  }, [setAvailability]);

  const handleAccept = useCallback(() => {
    const request = realtimeState.activeRequest;
    if (!request) return;

    acceptRequest(request.id, (success) => {
      if (success) {
        setLocalState((prev) => ({ ...prev, step: "matched" }));
      } else {
        setLocalState((prev) => ({ ...prev, step: "ready" })); // Show lost race state
        if (lostRaceTimeoutRef.current) clearTimeout(lostRaceTimeoutRef.current);
        lostRaceTimeoutRef.current = setTimeout(() => {
          setLocalState((prev) => ({
            ...prev,
            step: prev.available ? "waiting" : "ready",
          }));
        }, 2500);
      }
    });
  }, [realtimeState.activeRequest, acceptRequest]);

  const handleDecline = useCallback(() => {
    const request = realtimeState.activeRequest;
    if (!request) return;

    declineRequest(request.id, () => {
      setLocalState((prev) => ({ ...prev, step: "waiting" }));
    });
  }, [realtimeState.activeRequest, declineRequest]);

  const handleConfirmArrival = useCallback(() => {
    const request = realtimeState.activeRequest;
    if (!request) return;
    confirmArrival(request.id);
  }, [realtimeState.activeRequest, confirmArrival]);

  const handleMarkComplete = useCallback(() => {
    const request = realtimeState.activeRequest;
    if (!request) return;
    markCompletion(request.id);
  }, [realtimeState.activeRequest, markCompletion]);

  const handleRatingSubmit = useCallback((rating: number) => {
    const request = realtimeState.activeRequest;
    if (!request) return;
    submitRating(request.id, rating, "volunteer");
  }, [realtimeState.activeRequest, submitRating]);

  const handleReturnToDashboard = useCallback(() => {
    const request = realtimeState.activeRequest;

    const finish = () => {
      setLocalState((prev) => ({
        ...prev,
        step: prev.available ? "waiting" : "ready",
      }));
    };

    if (request) {
      cancelRequest(request.id, () => finish());
    } else {
      finish();
    }
  }, [realtimeState.activeRequest, cancelRequest]);

  const activeRequest = realtimeState.activeRequest;
  const isAnotherVolMatch = activeRequest?.status === "matched" && activeRequest.volunteer?.displayName !== displayName;

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
      <VolunteerNavBar activeTab="dashboard" />

      <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
      <AnimatePresence mode="wait">
        {/* LOST MATCH RACE VIEW */}
        {isAnotherVolMatch && (
          <motion.div
            key="lost-race"
            className="flex flex-col flex-1 items-center justify-center p-[var(--hc-space-6)] text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Surface elevation="overlay" padding="lg" className="w-full max-w-xs flex flex-col items-center gap-[var(--hc-space-4)]">
              <RefreshCw size={36} className="text-[var(--hc-violet)] animate-spin" />
              <h2 className="text-[var(--hc-text-lg)] font-bold text-[var(--hc-text)]">
                {VOLUNTEER_COPY.lostRace.title}
              </h2>
              <p className="text-[var(--hc-text-sm)] text-[var(--hc-text-subtle)]">
                {VOLUNTEER_COPY.lostRace.backToWaiting}
              </p>
            </Surface>
          </motion.div>
        )}

        {/* READY VIEW */}
        {!isAnotherVolMatch && localState.step === "ready" && (
          <VolunteerReadyState
            displayName={displayName}
            connected={connected}
            onGoAvailable={handleGoAvailable}
          />
        )}

        {/* AVAILABLE / WAITING VIEW */}
        {!isAnotherVolMatch && localState.step === "waiting" && (
          <motion.div
            key="waiting"
            className="flex flex-col flex-1 items-center justify-between px-[var(--hc-space-5)] py-[var(--hc-space-8)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col items-center gap-[var(--hc-space-2)]">
              <StatusPill variant="success" pulse>
                {VOLUNTEER_COPY.waiting.statusMessage}
              </StatusPill>
            </div>

            <div className="w-full max-w-xs flex flex-col items-center gap-[var(--hc-space-6)] text-center">
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[var(--hc-success-muted)] text-[var(--hc-success)]">
                <ShieldCheck size={28} />
              </div>
              <div className="flex flex-col gap-[var(--hc-space-2)]">
                <h1 className="text-[var(--hc-text-xl)] font-bold text-[var(--hc-text)]">
                  {VOLUNTEER_COPY.waiting.title}
                </h1>
                <p className="text-[var(--hc-text-sm)] text-[var(--hc-text-subtle)] leading-relaxed">
                  {VOLUNTEER_COPY.waiting.subtitle}
                </p>
              </div>
              <Button
                variant="secondary"
                size="lg"
                className="w-full"
                onClick={handleGoUnavailable}
              >
                {VOLUNTEER_COPY.waiting.buttonGoOffline}
              </Button>
            </div>

            <div className="flex items-center gap-2 text-[var(--hc-text-subtle)]">
              <Info size={12} />
              <span className="text-[10px]">No active requests nearby</span>
            </div>
          </motion.div>
        )}

        {/* INCOMING VIEW */}
        {!isAnotherVolMatch && localState.step === "incoming" && activeRequest && (
          <motion.div
            key="incoming"
            className="flex flex-col flex-1 items-center justify-center py-[var(--hc-space-8)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <IncomingRequestCard
              category={activeRequest.category}
              description={activeRequest.description}
              locationLabel={activeRequest.locationLabel}
              onAccept={handleAccept}
              onDecline={handleDecline}
            />
          </motion.div>
        )}

        {/* MATCHED VIEW */}
        {!isAnotherVolMatch && localState.step === "matched" && activeRequest && (
          <VolunteerMatchedState
            locationLabel={activeRequest.locationLabel}
            categoryTitle={activeRequest.category}
            description={activeRequest.description}
            onConfirmArrival={handleConfirmArrival}
          />
        )}

        {/* IN PROGRESS VIEW */}
        {!isAnotherVolMatch && localState.step === "in_progress" && activeRequest && (
          <VolunteerInProgressState
            locationLabel={activeRequest.locationLabel}
            categoryTitle={activeRequest.category}
            description={activeRequest.description}
            arrivedAt={activeRequest.session?.arrivedAt || null}
            onMarkComplete={handleMarkComplete}
          />
        )}

        {/* AWAITING CONFIRMATION VIEW */}
        {!isAnotherVolMatch && localState.step === "awaiting_confirmation" && (
          <VolunteerAwaitingConfirmState />
        )}

        {/* COMPLETED VIEW */}
        {!isAnotherVolMatch && localState.step === "completed" && activeRequest && (
          <VolunteerCompletedState
            onRatingSubmit={handleRatingSubmit}
            starBalance={activeRequest.volunteer?.starBalance || 5}
            onReturnToDashboard={handleReturnToDashboard}
            wasAvailable={localState.available}
          />
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}
