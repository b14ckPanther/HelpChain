/**
 * Phase 5 validation script — exercises director socket contract.
 */

import { io } from "socket.io-client";

const BASE = process.env.BASE_URL || "http://localhost:3003";

function connect(role, extra = {}) {
  return new Promise((resolve, reject) => {
    const socket = io(BASE, { transports: ["websocket"], forceNew: true });
    socket.on("connect", () => {
      socket.emit("demo:join", { role, ...extra }, (ack) => {
        if (ack?.success) resolve(socket);
        else reject(new Error(`Join failed for ${role}`));
      });
    });
    socket.on("connect_error", reject);
    setTimeout(() => reject(new Error(`Timeout connecting ${role}`)), 5000);
  });
}

function emitAck(socket, event, payload) {
  return new Promise((resolve, reject) => {
    const handler = (ack) => {
      if (ack?.success === false) reject(new Error(ack.error || "Request failed"));
      else resolve(ack);
    };

    if (payload === undefined) {
      socket.emit(event, handler);
    } else {
      socket.emit(event, payload, handler);
    }

    setTimeout(() => reject(new Error(`Timeout on ${event}`)), 10000);
  });
}

async function main() {
  const results = [];
  const runId = Date.now();

  const director = await connect("director");
  const requester = await connect("requester");
  const volunteer = await connect("volunteer", {
    displayName: "Noor",
    participantId: "vol-noor-id",
  });
  const partner = await connect("partner", { partnerId: "partner-haven-cafe" });

  await new Promise((r) => setTimeout(r, 500));

  const stateAck = await emitAck(director, "director:state:request");
  results.push(["director state request", stateAck.snapshot?.demoHealth ? "pass" : "fail"]);

  const devices = stateAck.snapshot?.connectedDevices?.length || 0;
  results.push(["connected devices tracked", devices >= 4 ? "pass" : `fail (${devices})`]);

  await emitAck(volunteer, "volunteer:availability:set", {
    available: true,
    displayName: "Noor",
    participantId: "vol-noor-id",
  });

  await emitAck(requester, "help:request:create", {
    category: "read_text",
    description: "Can someone help me read the platform sign?",
    locationLabel: "Demo Zone A — Main Hall",
  });

  await new Promise((r) => setTimeout(r, 300));

  const liveState = await emitAck(director, "director:state:request");
  results.push([
    "live session monitoring",
    liveState.snapshot?.activeRequestSummary?.status === "pending" ? "pass" : "fail",
  ]);

  await emitAck(director, "director:demo:reset", {});
  await new Promise((r) => setTimeout(r, 300));
  const resetState = await emitAck(director, "director:state:request");
  results.push([
    "reset baseline stars",
    resetState.snapshot?.rewardSummary?.noorStarBalance === 4 ? "pass" : "fail",
  ]);
  results.push([
    "reset clears session",
    resetState.snapshot?.activeRequestSummary === null ? "pass" : "fail",
  ]);

  await emitAck(director, "director:scenario:prepare", {
    scenario: "rewards_ready",
    operationId: `test-rewards-ready-${runId}`,
  });
  const rewardsState = await emitAck(director, "director:state:request");
  results.push([
    "rewards_ready scenario",
    rewardsState.snapshot?.rewardSummary?.noorStarBalance === 5 ? "pass" : "fail",
  ]);

  await emitAck(director, "director:scenario:prepare", {
    scenario: "coupon_ready",
    operationId: `test-coupon-ready-${runId}`,
  });
  const couponState = await emitAck(director, "director:state:request");
  results.push([
    "coupon_ready scenario",
    couponState.snapshot?.rewardSummary?.activeCouponsCount === 1 &&
      couponState.snapshot?.rewardSummary?.noorStarBalance === 0
      ? "pass"
      : "fail",
  ]);

  await emitAck(director, "director:scenario:prepare", {
    scenario: "help_session_ready",
    operationId: `test-help-session-${runId}`,
  });
  const helpState = await emitAck(director, "director:state:request");
  results.push([
    "help_session_ready scenario",
    helpState.snapshot?.activeRequestSummary?.status === "matched" ? "pass" : "fail",
  ]);

  await emitAck(director, "director:scenario:prepare", {
    scenario: "baseline",
    operationId: `test-baseline-${runId}`,
  });
  const baselineState = await emitAck(director, "director:state:request");
  results.push([
    "baseline scenario",
    baselineState.snapshot?.activeRequestSummary === null &&
      baselineState.snapshot?.rewardSummary?.noorStarBalance === 4
      ? "pass"
      : "fail",
  ]);

  results.push([
    "event timeline populated",
    (baselineState.snapshot?.eventLog?.length || 0) > 0 ? "pass" : "fail",
  ]);

  director.disconnect();
  requester.disconnect();
  volunteer.disconnect();
  partner.disconnect();

  console.log("\nPhase 5 Socket Validation Results:\n");
  for (const [name, status] of results) {
    console.log(`  ${status === "pass" ? "✓" : "✗"} ${name}: ${status}`);
  }

  const failed = results.filter(([, status]) => status !== "pass");
  process.exit(failed.length ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
