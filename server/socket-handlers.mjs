/**
 * Registers Socket.IO handlers and routes events to the DemoStore.
 * Enforces first-accept-wins state machine transitions, session steps,
 * Phase 4 rewards redemption operations, and Phase 5 director controls.
 */

export function registerSocketHandlers(io, store) {
  const broadcastDirectorState = () => {
    const snapshot = store.getDirectorSnapshot();
    for (const [, socket] of io.sockets.sockets) {
      if (socket.role === "director") {
        socket.emit("director:state", snapshot);
      }
    }
  };

  const emitDirectorEvent = (event) => {
    if (!event) return;
    for (const [, socket] of io.sockets.sockets) {
      if (socket.role === "director") {
        socket.emit("director:event:recorded", { event });
      }
    }
  };

  const broadcastState = () => {
    const sockets = io.sockets.sockets;
    for (const [socketId, socket] of sockets) {
      socket.emit("demo:state", store.getSnapshotForClient(socketId));
    }
    broadcastDirectorState();
  };

  const requireDirectorRole = (socket) => {
    if (socket.role !== "director") {
      throw new Error("Only the director console can perform this action.");
    }
  };

  io.on("connection", (socket) => {
    socket.role = null;
    socket.participantId = null;
    socket.partnerId = null;

    socket.on("demo:join", (payload, callback) => {
      const { role, displayName, participantId, partnerId } = payload || {};
      socket.role = role;
      socket.participantId = participantId;
      socket.partnerId = partnerId;

      store.registerSocket(socket.id, role, participantId, partnerId);

      let availability = false;
      if (role === "volunteer" && participantId) {
        const volunteer = store.registerVolunteer(socket.id, participantId, displayName);
        availability = volunteer?.available ?? false;
      }

      const deviceLabel =
        role === "volunteer"
          ? displayName || "Noor (volunteer)"
          : role === "partner"
            ? "Haven Café station"
            : role === "director"
              ? "Director console"
              : "Rajaa (requester)";

      store.registerConnectedDevice(socket.id, role, deviceLabel, availability);

      if (role === "director") {
        const event = store.recordEvent(
          "director_connected",
          "Director console connected.",
          "neutral"
        );
        emitDirectorEvent(event);
      }

      broadcastState();

      if (typeof callback === "function") {
        callback({ success: true });
      }
    });

    socket.on("demo:state:request", (callback) => {
      const snapshot = store.getSnapshotForClient(socket.id);
      if (typeof callback === "function") {
        callback(snapshot);
      } else {
        socket.emit("demo:state", snapshot);
      }
    });

    socket.on("director:state:request", (callback) => {
      try {
        requireDirectorRole(socket);
        const snapshot = store.getDirectorSnapshot();
        if (typeof callback === "function") {
          callback({ success: true, snapshot });
        } else {
          socket.emit("director:state", snapshot);
        }
      } catch (err) {
        socket.emit("demo:error", { message: err.message });
        if (typeof callback === "function") {
          callback({ success: false, error: err.message });
        }
      }
    });

    socket.on("director:demo:reset", (payload, callback) => {
      try {
        requireDirectorRole(socket);
        store.resetDemo();
        broadcastState();
        socket.emit("director:action:completed", {
          action: "reset",
          success: true,
          message: "Demo reset to baseline.",
        });
        if (typeof callback === "function") {
          callback({ success: true, message: "Demo reset to baseline." });
        }
      } catch (err) {
        socket.emit("demo:error", { message: err.message });
        if (typeof callback === "function") {
          callback({ success: false, error: err.message });
        }
      }
    });

    socket.on("director:scenario:prepare", async (payload, callback) => {
      const { scenario, operationId } = payload || {};

      try {
        requireDirectorRole(socket);

        if (!scenario) {
          throw new Error("A presentation scenario is required.");
        }

        const result = await store.prepareScenario(scenario, operationId);
        broadcastState();

        const scenarioMessages = {
          baseline: "Fresh start scenario applied.",
          rewards_ready: "Rewards-ready scenario prepared.",
          coupon_ready: "Coupon-ready scenario prepared.",
          help_session_ready: "Help-session-ready scenario prepared.",
        };

        const message = scenarioMessages[scenario] || "Scenario prepared.";
        socket.emit("director:action:completed", {
          action: "scenario",
          scenario,
          success: true,
          message,
          alreadyProcessed: result.alreadyProcessed || false,
        });

        if (typeof callback === "function") {
          callback({ success: true, message, alreadyProcessed: result.alreadyProcessed || false });
        }
      } catch (err) {
        socket.emit("demo:error", { message: err.message });
        if (typeof callback === "function") {
          callback({ success: false, error: err.message });
        }
      }
    });

    socket.on("volunteer:availability:set", (payload, callback) => {
      const { available, displayName, participantId } = payload || {};
      const volPartId = participantId || socket.participantId;
      store.setVolunteerAvailability(socket.id, available, displayName, volPartId);
      broadcastState();

      if (typeof callback === "function") {
        callback({ success: true });
      }
    });

    socket.on("help:request:create", (payload, callback) => {
      const { category, description, locationLabel } = payload || {};

      try {
        const request = store.createRequest(category, description, locationLabel);
        broadcastState();

        socket.broadcast.emit("help:request:incoming", request);

        if (typeof callback === "function") {
          callback({ success: true, request });
        }
      } catch (err) {
        socket.emit("demo:error", { message: err.message });
        if (typeof callback === "function") {
          callback({ success: false, error: err.message });
        }
      }
    });

    socket.on("help:request:accept", (payload, callback) => {
      const { requestId, participantId } = payload || {};
      const volPartId = participantId || socket.participantId;

      try {
        const request = store.acceptRequest(requestId, socket.id, volPartId);

        io.emit("help:request:accepted", {
          requestId,
          volunteer: request.volunteer,
        });

        broadcastState();

        if (typeof callback === "function") {
          callback({ success: true, request });
        }
      } catch (err) {
        socket.emit("demo:error", { message: err.message });
        if (typeof callback === "function") {
          callback({ success: false, error: err.message });
        }
      }
    });

    socket.on("help:request:decline", (payload, callback) => {
      const { requestId, participantId } = payload || {};
      const volPartId = participantId || socket.participantId;
      store.declineRequest(requestId, volPartId);

      socket.emit("demo:state", store.getSnapshotForClient(socket.id));

      if (typeof callback === "function") {
        callback({ success: true });
      }
    });

    socket.on("help:request:cancel", (payload, callback) => {
      const { requestId } = payload || {};
      const cancelled = store.cancelRequest(requestId);

      if (cancelled) {
        broadcastState();
      }

      if (typeof callback === "function") {
        callback({ success: cancelled });
      }
    });

    socket.on("session:arrival:confirm", (payload, callback) => {
      const { requestId, participantId } = payload || {};
      const volPartId = participantId || socket.participantId;

      try {
        const request = store.confirmArrival(requestId, volPartId);
        io.emit("session:arrived", { requestId });
        broadcastState();
        if (typeof callback === "function") {
          callback({ success: true, request });
        }
      } catch (err) {
        socket.emit("demo:error", { message: err.message });
        if (typeof callback === "function") {
          callback({ success: false, error: err.message });
        }
      }
    });

    socket.on("session:completion:mark", (payload, callback) => {
      const { requestId, participantId } = payload || {};
      const volPartId = participantId || socket.participantId;

      try {
        const request = store.markCompletion(requestId, volPartId);
        io.emit("session:completion:awaiting-confirmation", { requestId });
        broadcastState();
        if (typeof callback === "function") {
          callback({ success: true, request });
        }
      } catch (err) {
        socket.emit("demo:error", { message: err.message });
        if (typeof callback === "function") {
          callback({ success: false, error: err.message });
        }
      }
    });

    socket.on("session:completion:confirm", (payload, callback) => {
      const { requestId } = payload || {};

      try {
        const request = store.confirmCompletion(requestId);
        io.emit("session:completed", { requestId });
        broadcastState();
        if (typeof callback === "function") {
          callback({ success: true, request });
        }
      } catch (err) {
        socket.emit("demo:error", { message: err.message });
        if (typeof callback === "function") {
          callback({ success: false, error: err.message });
        }
      }
    });

    socket.on("session:rating:submit", (payload, callback) => {
      const { requestId, participantId, rating, role } = payload || {};
      const volPartId = participantId || socket.participantId;

      try {
        const request = store.submitRating(requestId, volPartId, rating, role);
        socket.emit("session:rating:updated", { requestId, success: true });
        broadcastState();
        if (typeof callback === "function") {
          callback({ success: true, request });
        }
      } catch (err) {
        socket.emit("demo:error", { message: err.message });
        if (typeof callback === "function") {
          callback({ success: false, error: err.message });
        }
      }
    });

    socket.on("rewards:catalog:request", (callback) => {
      const snapshot = store.getSnapshotForClient(socket.id);
      if (typeof callback === "function") {
        callback(snapshot);
      } else {
        socket.emit("demo:state", snapshot);
      }
    });

    socket.on("reward:redemption:create", async (payload, callback) => {
      const { rewardId, operationId } = payload || {};
      const participantId = socket.participantId;

      try {
        const coupon = await store.createRewardRedemption(participantId, rewardId, operationId);
        broadcastState();

        socket.emit("coupon:issued", { coupon });

        if (typeof callback === "function") {
          callback({ success: true, coupon });
        }
      } catch (err) {
        socket.emit("demo:error", { message: err.message });
        if (typeof callback === "function") {
          callback({ success: false, error: err.message });
        }
      }
    });

    socket.on("coupon:redemption:submit", (payload, callback) => {
      const { couponCode } = payload || {};
      const partnerId = socket.partnerId;

      try {
        const coupon = store.submitCouponRedemption(partnerId, couponCode);
        broadcastState();

        io.emit("coupon:redeemed", { couponCode: coupon.couponCode, partnerId });

        if (typeof callback === "function") {
          callback({ success: true, coupon });
        }
      } catch (err) {
        store.recordEvent(
          "coupon_rejected",
          `Coupon redemption rejected: ${err.message}`,
          "warning"
        );
        broadcastDirectorState();
        socket.emit("coupon:rejected", { error: err.message, couponCode });
        if (typeof callback === "function") {
          callback({ success: false, error: err.message });
        }
      }
    });

    socket.on("coupon:redemption:simulate-scan", (payload, callback) => {
      const { couponId } = payload || {};
      const partnerId = socket.partnerId;

      try {
        const coupon = store.coupons.get(couponId);
        if (!coupon) {
          throw new Error("Demo coupon not found.");
        }

        const redeemedCoupon = store.submitCouponRedemption(partnerId, coupon.couponCode);
        broadcastState();

        io.emit("coupon:redeemed", { couponCode: redeemedCoupon.couponCode, partnerId });

        if (typeof callback === "function") {
          callback({ success: true, coupon: redeemedCoupon });
        }
      } catch (err) {
        store.recordEvent(
          "coupon_rejected",
          `Coupon redemption rejected: ${err.message}`,
          "warning"
        );
        broadcastDirectorState();
        socket.emit("coupon:rejected", { error: err.message, couponId });
        if (typeof callback === "function") {
          callback({ success: false, error: err.message });
        }
      }
    });

    socket.on("disconnect", () => {
      store.unregisterSocket(socket.id);
      broadcastState();
    });
  });
}
