/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState, useCallback } from "react";
import { getSocket } from "./socket";
import type { DemoStateSnapshot, HelpCategory, DemoCoupon } from "./types";
import { SOCKET_EVENTS } from "./types";

interface UseDemoRealtimeProps {
  role: "requester" | "volunteer" | "partner";
  displayName?: string;
  partnerId?: string;
}

export function useDemoRealtime({ role, displayName, partnerId }: UseDemoRealtimeProps) {
  const [connected, setConnected] = useState(false);
  const [participantId, setParticipantId] = useState<string>("");
  const [state, setState] = useState<DemoStateSnapshot>({
    activeRequest: null,
    availableVolunteersCount: 0,
    totalVolunteersCount: 0,
  });
  const [error, setError] = useState<string | null>(null);

  const socket = getSocket();

  // Load/Generate participant identity for refresh resilience (only for requester and volunteer roles)
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (role === "partner") return;

    let pId = localStorage.getItem("helpchain_participant_id");
    if (!pId) {
      if (role === "volunteer" && displayName === "Noor") {
        pId = "vol-noor-id"; // Fix the default Noor identity for class demo stars balance stability!
      } else {
        pId = `${role}-${Math.random().toString(36).substr(2, 9)}`;
      }
      localStorage.setItem("helpchain_participant_id", pId);
    }
    setParticipantId(pId);
  }, [role, displayName]);

  // --- Actions ---

  const requestState = useCallback(() => {
    if (!socket || !socket.connected) return;
    socket.emit(SOCKET_EVENTS.STATE_REQUEST, (freshState: DemoStateSnapshot) => {
      setState(freshState);
    });
  }, [socket]);

  const joinDemo = useCallback(() => {
    if (!socket || !socket.connected) return;
    // For volunteer role, wait until participantId is loaded before joining
    if (role === "volunteer" && !participantId) return;

    socket.emit(
      SOCKET_EVENTS.JOIN,
      { role, displayName, participantId, partnerId },
      (ack: { success: boolean }) => {
        if (ack?.success) {
          requestState();
        }
      }
    );
  }, [socket, role, displayName, participantId, partnerId, requestState]);

  const createRequest = useCallback(
    (category: HelpCategory, description: string, locationLabel: string, callback?: (success: boolean) => void) => {
      if (!socket || !socket.connected) {
        if (callback) callback(false);
        return;
      }
      socket.emit(
        SOCKET_EVENTS.REQUEST_CREATE,
        { category, description, locationLabel },
        (ack: { success: boolean }) => {
          if (callback) {
            callback(ack?.success || false);
          }
        }
      );
    },
    [socket]
  );

  const cancelRequest = useCallback(
    (requestId: string, callback?: (success: boolean) => void) => {
      if (!socket || !socket.connected) {
        if (callback) callback(false);
        return;
      }
      socket.emit(SOCKET_EVENTS.REQUEST_CANCEL, { requestId }, (ack: { success: boolean }) => {
        if (callback) {
          callback(ack?.success || false);
        }
      });
    },
    [socket]
  );

  const setAvailability = useCallback(
    (available: boolean, name?: string) => {
      if (!socket || !socket.connected) return;
      const volPartId = participantId || "";
      socket.emit(SOCKET_EVENTS.AVAILABILITY_SET, {
        available,
        displayName: name || displayName,
        participantId: volPartId,
      });
    },
    [socket, displayName, participantId]
  );

  const acceptRequest = useCallback(
    (requestId: string, callback?: (success: boolean, error?: string) => void) => {
      if (!socket || !socket.connected) {
        if (callback) callback(false, "Server not connected.");
        return;
      }
      const volPartId = participantId || "";
      socket.emit(
        SOCKET_EVENTS.REQUEST_ACCEPT,
        { requestId, participantId: volPartId },
        (ack: { success: boolean; error?: string }) => {
          if (callback) {
            callback(ack?.success || false, ack?.error);
          }
        }
      );
    },
    [socket, participantId]
  );

  const declineRequest = useCallback(
    (requestId: string, callback?: (success: boolean) => void) => {
      if (!socket || !socket.connected) {
        if (callback) callback(false);
        return;
      }
      const volPartId = participantId || "";
      socket.emit(
        SOCKET_EVENTS.REQUEST_DECLINE,
        { requestId, participantId: volPartId },
        (ack: { success: boolean }) => {
          if (callback) {
            callback(ack?.success || false);
          }
        }
      );
    },
    [socket, participantId]
  );

  // --- Session Stage Controls ---

  const confirmArrival = useCallback(
    (requestId: string, callback?: (success: boolean) => void) => {
      if (!socket || !socket.connected) {
        if (callback) callback(false);
        return;
      }
      const volPartId = participantId || "";
      socket.emit(
        SOCKET_EVENTS.ARRIVAL_CONFIRM,
        { requestId, participantId: volPartId },
        (ack: { success: boolean }) => {
          if (callback) callback(ack?.success || false);
        }
      );
    },
    [socket, participantId]
  );

  const markCompletion = useCallback(
    (requestId: string, callback?: (success: boolean) => void) => {
      if (!socket || !socket.connected) {
        if (callback) callback(false);
        return;
      }
      const volPartId = participantId || "";
      socket.emit(
        SOCKET_EVENTS.COMPLETION_MARK,
        { requestId, participantId: volPartId },
        (ack: { success: boolean }) => {
          if (callback) callback(ack?.success || false);
        }
      );
    },
    [socket, participantId]
  );

  const confirmCompletion = useCallback(
    (requestId: string, callback?: (success: boolean) => void) => {
      if (!socket || !socket.connected) {
        if (callback) callback(false);
        return;
      }
      socket.emit(
        SOCKET_EVENTS.COMPLETION_CONFIRM,
        { requestId },
        (ack: { success: boolean }) => {
          if (callback) callback(ack?.success || false);
        }
      );
    },
    [socket]
  );

  const submitRating = useCallback(
    (requestId: string, rating: number, roleOverride?: "requester" | "volunteer", callback?: (success: boolean) => void) => {
      if (!socket || !socket.connected) {
        if (callback) callback(false);
        return;
      }
      const volPartId = participantId || "";
      socket.emit(
        SOCKET_EVENTS.RATING_SUBMIT,
        { requestId, participantId: volPartId, rating, role: roleOverride || role },
        (ack: { success: boolean }) => {
          if (callback) callback(ack?.success || false);
        }
      );
    },
    [socket, participantId, role]
  );

  // --- Phase 4 Rewards & Redemption ---

  const requestRewardsCatalog = useCallback(() => {
    if (!socket || !socket.connected) return;
    socket.emit(SOCKET_EVENTS.REWARDS_CATALOG_REQUEST, (freshState: DemoStateSnapshot) => {
      setState(freshState);
    });
  }, [socket]);

  const createRewardRedemption = useCallback(
    (rewardId: string, operationId: string, callback?: (success: boolean, coupon?: DemoCoupon, error?: string) => void) => {
      if (!socket || !socket.connected) {
        if (callback) callback(false, undefined, "Server not connected.");
        return;
      }
      socket.emit(
        SOCKET_EVENTS.REWARD_REDEMPTION_CREATE,
        { rewardId, operationId },
        (ack: { success: boolean; coupon?: DemoCoupon; error?: string }) => {
          if (callback) {
            callback(ack?.success || false, ack?.coupon, ack?.error);
          }
        }
      );
    },
    [socket]
  );

  const redeemCouponCode = useCallback(
    (couponCode: string, callback?: (success: boolean, coupon?: DemoCoupon, error?: string) => void) => {
      if (!socket || !socket.connected) {
        if (callback) callback(false, undefined, "Server not connected.");
        return;
      }
      socket.emit(
        SOCKET_EVENTS.COUPON_REDEMPTION_SUBMIT,
        { couponCode },
        (ack: { success: boolean; coupon?: DemoCoupon; error?: string }) => {
          if (callback) {
            callback(ack?.success || false, ack?.coupon, ack?.error);
          }
        }
      );
    },
    [socket]
  );

  const simulateCouponScan = useCallback(
    (couponId: string, callback?: (success: boolean, coupon?: DemoCoupon, error?: string) => void) => {
      if (!socket || !socket.connected) {
        if (callback) callback(false, undefined, "Server not connected.");
        return;
      }
      socket.emit(
        SOCKET_EVENTS.COUPON_REDEMPTION_SIMULATE_SCAN,
        { couponId },
        (ack: { success: boolean; coupon?: DemoCoupon; error?: string }) => {
          if (callback) {
            callback(ack?.success || false, ack?.coupon, ack?.error);
          }
        }
      );
    },
    [socket]
  );

  // --- Socket Lifecycle and Listening ---

  useEffect(() => {
    if (!socket) return;

    if (!socket.connected) {
      socket.connect();
    }

    setConnected(socket.connected);

    const handleConnect = () => {
      setConnected(true);
      setError(null);
      joinDemo();
    };

    const handleDisconnect = () => {
      setConnected(false);
    };

    const handleStateUpdate = (newState: DemoStateSnapshot) => {
      setState(newState);
    };

    const handleError = (errPayload: { message: string }) => {
      setError(errPayload?.message || "Unknown server error");
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on(SOCKET_EVENTS.STATE, handleStateUpdate);
    socket.on(SOCKET_EVENTS.ERROR, handleError);

    if (socket.connected) {
      joinDemo();
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off(SOCKET_EVENTS.STATE, handleStateUpdate);
      socket.off(SOCKET_EVENTS.ERROR, handleError);
    };
  }, [socket, joinDemo]);

  return {
    connected,
    participantId,
    state,
    error,
    createRequest,
    cancelRequest,
    setAvailability,
    acceptRequest,
    declineRequest,
    confirmArrival,
    markCompletion,
    confirmCompletion,
    submitRating,
    requestState,

    // Phase 4 Exposed Actions
    requestRewardsCatalog,
    createRewardRedemption,
    redeemCouponCode,
    simulateCouponScan,
  };
}
