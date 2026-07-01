/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDemoRealtime } from "@/lib/realtime";
import { REQUESTER_COPY } from "./requester-copy";
import {
  RequesterReadyState,
  HelpCategorySheet,
  RequestDetailsStep,
  SeekingState,
  RequesterMatchedState,
  RequesterInProgressState,
  RequesterCompletionPromptState,
  RequesterCompletedState,
  RequesterStatusAnnouncer,
} from "./index";
import type { RequesterStep, HelpCategory, LocalRequestState } from "./requester-types";
import { INITIAL_REQUEST_STATE } from "./requester-types";
import { Button } from "@/components/ui";
import { Bell, ArrowRight } from "lucide-react";

/** Duration of the "sending" transition before moving to seeking (ms) */
const SENDING_DISPLAY_DURATION = 2000;

export function RequesterExperience() {
  const [state, setState] = useState<LocalRequestState>(INITIAL_REQUEST_STATE);
  const [showCategorySheet, setShowCategorySheet] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [dismissedConfirm, setDismissedConfirm] = useState(false);
  const sendingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initialize socket realtime layer
  const {
    connected,
    state: realtimeState,
    createRequest,
    cancelRequest,
    confirmCompletion,
    submitRating,
  } = useDemoRealtime({
    role: "requester",
  });

  // Sync state step from server activeRequest
  useEffect(() => {
    if (!connected) return;

    const activeRequest = realtimeState.activeRequest;

    if (!activeRequest) {
      // If server has no active request, reset to ready
      setDismissedConfirm(false);
      if (
        state.step === "seeking" ||
        state.step === "matched" ||
        state.step === "in_progress" ||
        state.step === "awaiting_requester_confirmation" ||
        state.step === "completed"
      ) {
        setState(INITIAL_REQUEST_STATE);
      }
    } else {
      // Server has active request: map status to step
      if (activeRequest.status === "pending") {
        if (state.step !== "sending" && state.step !== "seeking") {
          setState((prev) => ({
            ...prev,
            step: "seeking",
            category: activeRequest.category,
            description: activeRequest.description,
          }));
        }
      } else if (activeRequest.status === "matched") {
        if (state.step !== "matched") {
          setState((prev) => ({
            ...prev,
            step: "matched",
            category: activeRequest.category,
            description: activeRequest.description,
          }));
        }
      } else if (activeRequest.status === "in_progress") {
        if (state.step !== "in_progress") {
          setState((prev) => ({
            ...prev,
            step: "in_progress",
            category: activeRequest.category,
            description: activeRequest.description,
          }));
          setStatusMessage("Volunteer has arrived. Assistance in progress.");
        }
      } else if (activeRequest.status === "awaiting_requester_confirmation") {
        // Toggle view based on dismissed status
        const targetStep = dismissedConfirm ? "in_progress" : "awaiting_requester_confirmation";
        if (state.step !== targetStep) {
          setState((prev) => ({
            ...prev,
            step: targetStep,
            category: activeRequest.category,
            description: activeRequest.description,
          }));
          if (!dismissedConfirm) {
            setStatusMessage("Assistance complete? Please confirm you received the help.");
          }
        }
      } else if (activeRequest.status === "completed") {
        if (state.step !== "completed") {
          setState((prev) => ({
            ...prev,
            step: "completed",
            category: activeRequest.category,
            description: activeRequest.description,
          }));
          setStatusMessage("Help confirmed. Helpchain session verified.");
        }
      }
    }
  }, [realtimeState.activeRequest, connected, state.step, dismissedConfirm]);

  // Cleanup sending timer on unmount
  useEffect(() => {
    return () => {
      if (sendingTimerRef.current) {
        clearTimeout(sendingTimerRef.current);
      }
    };
  }, []);

  const goToStep = useCallback((step: RequesterStep) => {
    setState((prev) => ({ ...prev, step }));
  }, []);

  const handleHelpPress = useCallback(() => {
    setShowCategorySheet(true);
    setStatusMessage("Category selection opened");
  }, []);

  const handleCategorySelect = useCallback((category: HelpCategory) => {
    setState((prev) => ({ ...prev, category, step: "details" }));
    setShowCategorySheet(false);
    setStatusMessage(`Selected category: ${REQUESTER_COPY.category[category].title}. Describe what you need.`);
  }, []);

  const handleCategoryClose = useCallback(() => {
    setShowCategorySheet(false);
    if (state.step === "ready") {
      setStatusMessage("");
    }
  }, [state.step]);

  const handleEditCategory = useCallback(() => {
    setShowCategorySheet(true);
  }, []);

  const handleDetailsBack = useCallback(() => {
    goToStep("ready");
    setStatusMessage("");
  }, [goToStep]);

  const handleSubmit = useCallback((description: string) => {
    if (!state.category) return;
    setState((prev) => ({ ...prev, description, step: "sending" }));
    setStatusMessage(REQUESTER_COPY.sending.headline + ". " + REQUESTER_COPY.sending.subline);

    let serverAcked = false;
    let timerFinished = false;

    const maybeAdvance = () => {
      if (serverAcked && timerFinished) {
        goToStep("seeking");
        setStatusMessage(REQUESTER_COPY.seeking.headline);
      }
    };

    createRequest(state.category, description, state.locationLabel, (success) => {
      if (success) {
        serverAcked = true;
        maybeAdvance();
      } else {
        // Reset to details on error
        setState((prev) => ({ ...prev, step: "details" }));
        setStatusMessage("Failed to submit request. Please try again.");
      }
    });

    sendingTimerRef.current = setTimeout(() => {
      timerFinished = true;
      maybeAdvance();
    }, SENDING_DISPLAY_DURATION);
  }, [state.category, state.locationLabel, createRequest, goToStep]);

  const handleCancel = useCallback(() => {
    if (realtimeState.activeRequest) {
      cancelRequest(realtimeState.activeRequest.id, (success) => {
        if (success) {
          setState(INITIAL_REQUEST_STATE);
          setStatusMessage("Request cancelled. Ready for a new request.");
        }
      });
    } else {
      setState(INITIAL_REQUEST_STATE);
      setStatusMessage("Request cancelled. Ready for a new request.");
    }
  }, [realtimeState.activeRequest, cancelRequest]);

  // --- Session Control Actions ---

  const handleConfirmReceived = useCallback(() => {
    if (realtimeState.activeRequest) {
      confirmCompletion(realtimeState.activeRequest.id, (success) => {
        if (success) {
          setStatusMessage("Session verified. Thank you.");
        }
      });
    }
  }, [realtimeState.activeRequest, confirmCompletion]);

  const handleNotReady = useCallback(() => {
    setDismissedConfirm(true);
    setStatusMessage("Confirmation postponed. Reopen panel from screen bottom anytime.");
  }, []);

  const handleReopenConfirmation = useCallback(() => {
    setDismissedConfirm(false);
  }, []);

  const handleRatingSubmit = useCallback((rating: number) => {
    if (realtimeState.activeRequest) {
      submitRating(realtimeState.activeRequest.id, rating, "requester", (success) => {
        if (success) {
          setStatusMessage("Rating submitted. Thank you.");
        }
      });
    }
  }, [realtimeState.activeRequest, submitRating]);

  const activeReq = realtimeState.activeRequest;
  const isAwaitingConfirm = activeReq?.status === "awaiting_requester_confirmation";

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden relative">
      <RequesterStatusAnnouncer message={statusMessage} />

      <AnimatePresence mode="wait">
        {/* READY STATE */}
        {state.step === "ready" && (
          <motion.div
            key="ready"
            className="flex flex-col flex-1"
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <RequesterReadyState
              locationLabel={state.locationLabel}
              onHelpPress={handleHelpPress}
              connected={connected}
            />
          </motion.div>
        )}

        {/* DETAILS STATE */}
        {state.step === "details" && state.category && (
          <motion.div
            key="details"
            className="flex flex-col flex-1"
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <RequestDetailsStep
              category={state.category}
              locationLabel={state.locationLabel}
              onBack={handleDetailsBack}
              onEditCategory={handleEditCategory}
              onSubmit={handleSubmit}
              connected={connected}
            />
          </motion.div>
        )}

        {/* SENDING TRANSITION */}
        {state.step === "sending" && (
          <motion.div
            key="sending"
            className="flex flex-col flex-1 items-center justify-center gap-[var(--hc-space-6)] px-[var(--hc-space-5)]"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative flex items-center justify-center w-24 h-24">
              <motion.div
                className="absolute rounded-full border-2 border-[var(--hc-help-red)]"
                initial={{ width: 40, height: 40, opacity: 0.6 }}
                animate={{ width: 96, height: 96, opacity: 0 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
              <motion.div
                className="w-10 h-10 rounded-full bg-[var(--hc-help-red)]"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              />
            </div>

            <div className="flex flex-col items-center gap-[var(--hc-space-2)] text-center">
              <h1 className="text-[var(--hc-text-2xl)] font-bold text-[var(--hc-text)]">
                {REQUESTER_COPY.sending.headline}
              </h1>
              <p className="text-[var(--hc-text-base)] text-[var(--hc-text-muted)]">
                {REQUESTER_COPY.sending.subline}
              </p>
            </div>
          </motion.div>
        )}

        {/* SEEKING STATE */}
        {state.step === "seeking" && (
          <motion.div
            key="seeking"
            className="flex flex-col flex-1"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <SeekingState onCancel={handleCancel} />
          </motion.div>
        )}

        {/* MATCHED STATE */}
        {state.step === "matched" && activeReq?.volunteer && (
          <motion.div
            key="matched"
            className="flex flex-col flex-1"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <RequesterMatchedState
              volunteerName={activeReq.volunteer.displayName}
              volunteerRating={activeReq.volunteer.averageRating}
              locationLabel={activeReq.locationLabel}
              categoryTitle={activeReq.category}
              description={activeReq.description}
              onCancel={handleCancel}
            />
          </motion.div>
        )}

        {/* IN PROGRESS STATE */}
        {state.step === "in_progress" && activeReq?.volunteer && (
          <motion.div
            key="inprogress"
            className="flex flex-col flex-1"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <RequesterInProgressState
              volunteerName={activeReq.volunteer.displayName}
              locationLabel={activeReq.locationLabel}
              arrivedAt={activeReq.session?.arrivedAt || null}
            />
          </motion.div>
        )}

        {/* AWAITING CONFIRMATION STATE */}
        {state.step === "awaiting_requester_confirmation" && activeReq?.volunteer && (
          <motion.div
            key="awaitingconfirm"
            className="flex flex-col flex-1"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <RequesterCompletionPromptState
              volunteerName={activeReq.volunteer.displayName}
              onConfirmReceived={handleConfirmReceived}
              onNotReady={handleNotReady}
            />
          </motion.div>
        )}

        {/* COMPLETED STATE */}
        {state.step === "completed" && activeReq?.volunteer && (
          <motion.div
            key="completed"
            className="flex flex-col flex-1"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <RequesterCompletedState
              volunteerName={activeReq.volunteer.displayName}
              onRatingSubmit={handleRatingSubmit}
              starBalance={activeReq.volunteer.starBalance}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category sheet overlays ready step */}
      <HelpCategorySheet
        isOpen={showCategorySheet}
        selectedCategory={state.category}
        onSelect={handleCategorySelect}
        onClose={handleCategoryClose}
      />

      {/* Floating confirm button if requester postponed dual confirmation */}
      {isAwaitingConfirm && dismissedConfirm && (
        <div className="absolute bottom-4 left-4 right-4 z-50">
          <Button
            variant="primary"
            size="lg"
            className="w-full flex items-center justify-center gap-2 shadow-[var(--hc-shadow-lg)]"
            onClick={handleReopenConfirmation}
          >
            <Bell size={18} className="animate-bounce" />
            <span>Confirm assistance completion</span>
            <ArrowRight size={16} />
          </Button>
        </div>
      )}
    </div>
  );
}
