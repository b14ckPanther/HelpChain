/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState, useCallback } from "react";
import { getSocket } from "./socket";
import type { DirectorScenario, DirectorStateSnapshot } from "./types";
import { SOCKET_EVENTS } from "./types";

const EMPTY_DIRECTOR_STATE: DirectorStateSnapshot = {
  connectedDevices: [],
  demoHealth: {
    requesterDevicesConnected: 0,
    volunteersConnected: 0,
    volunteersAvailable: 0,
    partnerStationsConnected: 0,
    directorConsolesConnected: 0,
    activeSessionState: "idle",
    noorStarBalance: 4,
    activeCouponCount: 0,
  },
  activeRequestSummary: null,
  rewardSummary: {
    noorStarBalance: 4,
    activeCouponsCount: 0,
    redeemedCouponsCount: 0,
    expiredCouponsCount: 0,
    mostRecentCoupon: null,
  },
  partnerSummary: {
    havenCafeRecentRedemptionsCount: 0,
  },
  eventLog: [],
};

export function useDirectorRealtime() {
  const [connected, setConnected] = useState(false);
  const [state, setState] = useState<DirectorStateSnapshot>(EMPTY_DIRECTOR_STATE);
  const [error, setError] = useState<string | null>(null);
  const [lastActionMessage, setLastActionMessage] = useState<string | null>(null);

  const socket = getSocket();

  const requestDirectorState = useCallback(() => {
    if (!socket || !socket.connected) return;
    socket.emit(
      SOCKET_EVENTS.DIRECTOR_STATE_REQUEST,
      (ack: { success: boolean; snapshot?: DirectorStateSnapshot; error?: string }) => {
        if (ack?.success && ack.snapshot) {
          setState(ack.snapshot);
          setError(null);
        } else if (ack?.error) {
          setError(ack.error);
        }
      }
    );
  }, [socket]);

  const joinDirector = useCallback(() => {
    if (!socket || !socket.connected) return;

    socket.emit(
      SOCKET_EVENTS.JOIN,
      { role: "director", displayName: "Director" },
      (ack: { success: boolean }) => {
        if (ack?.success) {
          requestDirectorState();
        }
      }
    );
  }, [socket, requestDirectorState]);

  const resetDemo = useCallback(
    (callback?: (success: boolean, message?: string, errorMessage?: string) => void) => {
      if (!socket || !socket.connected) {
        if (callback) callback(false, undefined, "Server not connected.");
        return;
      }

      socket.emit(
        SOCKET_EVENTS.DIRECTOR_DEMO_RESET,
        {},
        (ack: { success: boolean; message?: string; error?: string }) => {
          if (ack?.success) {
            setLastActionMessage(ack.message || "Demo reset to baseline.");
            setError(null);
            if (callback) callback(true, ack.message);
          } else {
            const errMsg = ack?.error || "Unable to reset the demo.";
            setError(errMsg);
            if (callback) callback(false, undefined, errMsg);
          }
        }
      );
    },
    [socket]
  );

  const prepareDirectorScenario = useCallback(
    (
      scenario: DirectorScenario,
      callback?: (success: boolean, message?: string, errorMessage?: string) => void
    ) => {
      if (!socket || !socket.connected) {
        if (callback) callback(false, undefined, "Server not connected.");
        return;
      }

      const operationId = `director-op-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

      socket.emit(
        SOCKET_EVENTS.DIRECTOR_SCENARIO_PREPARE,
        { scenario, operationId },
        (ack: { success: boolean; message?: string; error?: string }) => {
          if (ack?.success) {
            setLastActionMessage(ack.message || "Scenario prepared.");
            setError(null);
            if (callback) callback(true, ack.message);
          } else {
            const errMsg = ack?.error || "Unable to prepare scenario.";
            setError(errMsg);
            if (callback) callback(false, undefined, errMsg);
          }
        }
      );
    },
    [socket]
  );

  useEffect(() => {
    if (!socket) return;

    if (!socket.connected) {
      socket.connect();
    }

    setConnected(socket.connected);

    const handleConnect = () => {
      setConnected(true);
      setError(null);
      joinDirector();
    };

    const handleDisconnect = () => {
      setConnected(false);
    };

    const handleDirectorState = (snapshot: DirectorStateSnapshot) => {
      setState(snapshot);
    };

    const handleDirectorActionCompleted = (payload: { message?: string }) => {
      if (payload?.message) {
        setLastActionMessage(payload.message);
      }
    };

    const handleError = (errPayload: { message: string }) => {
      setError(errPayload?.message || "Unknown server error");
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on(SOCKET_EVENTS.DIRECTOR_STATE, handleDirectorState);
    socket.on(SOCKET_EVENTS.DIRECTOR_ACTION_COMPLETED, handleDirectorActionCompleted);
    socket.on(SOCKET_EVENTS.ERROR, handleError);

    if (socket.connected) {
      joinDirector();
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off(SOCKET_EVENTS.DIRECTOR_STATE, handleDirectorState);
      socket.off(SOCKET_EVENTS.DIRECTOR_ACTION_COMPLETED, handleDirectorActionCompleted);
      socket.off(SOCKET_EVENTS.ERROR, handleError);
    };
  }, [socket, joinDirector]);

  return {
    connected,
    state,
    error,
    lastActionMessage,
    requestDirectorState,
    resetDemo,
    prepareDirectorScenario,
  };
}
