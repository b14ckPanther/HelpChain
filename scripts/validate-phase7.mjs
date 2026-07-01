/**
 * Phase 7 verification script — server-side integrity checks for Helpchain MVP.
 * Does not replace browser/UI or physical-device validation.
 */

import { io } from "socket.io-client";

const BASE = process.env.BASE_URL || "http://localhost:3003";
const NOOR_ID = "vol-noor-id";
const HAVEN_PARTNER = "partner-haven-cafe";
const HAVEN_REWARD = "reward-haven-cafe";

const results = [];

function record(name, pass, detail = "") {
  results.push({ name, pass, detail });
}

function connect(role, extra = {}) {
  return new Promise((resolve, reject) => {
    const socket = io(BASE, { transports: ["websocket"], forceNew: true });
    socket.on("connect", () => {
      socket.emit("demo:join", { role, ...extra }, (ack) => {
        if (ack?.success) resolve(socket);
        else reject(new Error(`Join failed for ${role}`));
      });
    });
    socket.on("connect_error", (err) => reject(err));
    setTimeout(() => reject(new Error(`Timeout connecting ${role}`)), 8000);
  });
}

function emitAck(socket, event, payload) {
  return new Promise((resolve, reject) => {
    const handler = (ack) => {
      if (ack?.success === false) reject(new Error(ack.error || `Failed: ${event}`));
      else resolve(ack);
    };
    if (payload === undefined) socket.emit(event, handler);
    else socket.emit(event, payload, handler);
    setTimeout(() => reject(new Error(`Timeout on ${event}`)), 12000);
  });
}

function emitMaybeFail(socket, event, payload) {
  return new Promise((resolve) => {
    socket.emit(event, payload, (ack) => resolve(ack));
    setTimeout(() => resolve({ success: false, error: "timeout" }), 12000);
  });
}

function getVolunteerStars(socket) {
  return new Promise((resolve, reject) => {
    socket.emit("demo:state:request", (state) => {
      const stars =
        state?.rewardsRoleData?.profile?.starBalance ??
        state?.activeRequest?.volunteer?.starBalance ??
        null;
      if (stars === null) reject(new Error("Could not read volunteer star balance"));
      else resolve(stars);
    });
    setTimeout(() => reject(new Error("Timeout reading state")), 12000);
  });
}

async function run() {
  const runId = Date.now();
  let director;
  let requester;
  let volunteer;
  let volunteer2;
  let partner;

  try {
    director = await connect("director");
    requester = await connect("requester");
    volunteer = await connect("volunteer", { displayName: "Noor", participantId: NOOR_ID });
    volunteer2 = await connect("volunteer", {
      displayName: "Backup Volunteer",
      participantId: `vol-backup-${runId}`,
    });
    partner = await connect("partner", { partnerId: HAVEN_PARTNER });
  } catch (err) {
    record("server connectivity", false, err.message);
    printResults();
    process.exit(1);
  }

  record("server connectivity", true, `Connected to ${BASE}`);

  await emitAck(director, "director:demo:reset", {});
  await new Promise((r) => setTimeout(r, 250));

  const afterReset = await emitAck(director, "director:state:request");
  const resetStars = afterReset.snapshot?.rewardSummary?.noorStarBalance;
  record(
    "baseline reset returns 4 stars",
    resetStars === 4,
    `stars=${resetStars}`
  );
  record(
    "reset clears active session",
    afterReset.snapshot?.activeRequestSummary === null,
    "activeRequestSummary is null"
  );
  record(
    "reset preserves connected devices",
    (afterReset.snapshot?.connectedDevices?.length || 0) >= 5,
    `devices=${afterReset.snapshot?.connectedDevices?.length || 0}`
  );

  await emitAck(volunteer, "volunteer:availability:set", {
    available: true,
    displayName: "Noor",
    participantId: NOOR_ID,
  });
  await emitAck(volunteer2, "volunteer:availability:set", {
    available: true,
    displayName: "Backup Volunteer",
    participantId: `vol-backup-${runId}`,
  });

  const createAck = await emitAck(requester, "help:request:create", {
    category: "read_text",
    description: "Can someone help me read the platform sign?",
    locationLabel: "Demo Zone A — Main Hall",
  });
  const requestId = createAck.request?.id;
  record("help request created", Boolean(requestId), requestId || "no id");

  const accept1 = await emitAck(volunteer, "help:request:accept", {
    requestId,
    participantId: NOOR_ID,
  });
  record("first volunteer accept succeeds", accept1.success !== false, "Noor accepted");

  const accept2 = await emitMaybeFail(volunteer2, "help:request:accept", {
    requestId,
    participantId: `vol-backup-${runId}`,
  });
  record(
    "second accept rejected (first-accept-wins)",
    accept2.success === false,
    accept2.error || "no error message"
  );

  await emitAck(volunteer, "session:arrival:confirm", { requestId, participantId: NOOR_ID });
  await emitAck(volunteer, "session:completion:mark", { requestId, participantId: NOOR_ID });

  const starsBeforeConfirm = await getVolunteerStars(volunteer);
  record(
    "no star before requester confirmation",
    starsBeforeConfirm === 4,
    `stars=${starsBeforeConfirm}`
  );

  await emitAck(requester, "session:completion:confirm", { requestId });
  const starsAfterConfirm = await getVolunteerStars(volunteer);
  record(
    "dual confirmation awards exactly one star",
    starsAfterConfirm === 5,
    `stars=${starsAfterConfirm}`
  );

  const duplicateConfirm = await emitMaybeFail(requester, "session:completion:confirm", {
    requestId,
  });
  const starsAfterDuplicate = await getVolunteerStars(volunteer);
  record(
    "duplicate confirmation does not add another star",
    duplicateConfirm.success === false && starsAfterDuplicate === 5,
    duplicateConfirm.error || `stars=${starsAfterDuplicate}`
  );

  await emitAck(requester, "session:rating:submit", {
    requestId,
    participantId: "requester-demo",
    rating: 5,
    role: "requester",
  });
  await emitAck(volunteer, "session:rating:submit", {
    requestId,
    participantId: NOOR_ID,
    rating: 5,
    role: "volunteer",
  });
  record("ratings accepted for both roles", true, "requester and volunteer ratings submitted");

  const opId = `phase7-redeem-${runId}`;
  const redeem1 = await emitAck(volunteer, "reward:redemption:create", {
    rewardId: HAVEN_REWARD,
    operationId: opId,
  });
  const coupon1 = redeem1.coupon;
  record(
    "reward redemption creates coupon",
    Boolean(coupon1?.couponCode),
    coupon1?.couponCode || "missing coupon"
  );

  const starsAfterRedeem = await getVolunteerStars(volunteer);
  record(
    "redemption deducts stars",
    starsAfterRedeem === 0,
    `stars=${starsAfterRedeem}`
  );

  const redeem2 = await emitAck(volunteer, "reward:redemption:create", {
    rewardId: HAVEN_REWARD,
    operationId: opId,
  });
  record(
    "redemption idempotent by operationId",
    redeem2.coupon?.couponCode === coupon1?.couponCode && (await getVolunteerStars(volunteer)) === 0,
    "same coupon returned, stars unchanged"
  );

  const redeemPartner = await emitAck(partner, "coupon:redemption:submit", {
    couponCode: coupon1.couponCode,
  });
  record(
    "partner coupon redemption succeeds once",
    redeemPartner.success !== false,
    coupon1.couponCode
  );

  const duplicateRedeem = await emitMaybeFail(partner, "coupon:redemption:submit", {
    couponCode: coupon1.couponCode,
  });
  record(
    "duplicate coupon redemption rejected",
    duplicateRedeem.success === false,
    duplicateRedeem.error || "no error"
  );

  await emitAck(director, "director:scenario:prepare", {
    scenario: "rewards_ready",
    operationId: `phase7-rewards-${runId}`,
  });
  const rewardsReady = await emitAck(director, "director:state:request");
  record(
    "director rewards_ready scenario",
    rewardsReady.snapshot?.rewardSummary?.noorStarBalance === 5 &&
      rewardsReady.snapshot?.rewardSummary?.activeCouponsCount === 0,
    "5 stars, 0 coupons"
  );

  await emitAck(director, "director:scenario:prepare", {
    scenario: "coupon_ready",
    operationId: `phase7-coupon-${runId}`,
  });
  const couponReady = await emitAck(director, "director:state:request");
  record(
    "director coupon_ready scenario",
    couponReady.snapshot?.rewardSummary?.activeCouponsCount === 1 &&
      couponReady.snapshot?.rewardSummary?.noorStarBalance === 0,
    "1 active coupon, 0 stars"
  );

  await emitAck(director, "director:scenario:prepare", {
    scenario: "help_session_ready",
    operationId: `phase7-help-${runId}`,
  });
  const helpReady = await emitAck(director, "director:state:request");
  record(
    "director help_session_ready scenario",
    helpReady.snapshot?.activeRequestSummary?.status === "matched",
    helpReady.snapshot?.activeRequestSummary?.status || "no session"
  );

  await emitAck(director, "director:demo:reset", {});
  const finalReset = await emitAck(director, "director:state:request");
  record(
    "director reset clears coupons and session",
    finalReset.snapshot?.activeRequestSummary === null &&
      finalReset.snapshot?.rewardSummary?.activeCouponsCount === 0 &&
      finalReset.snapshot?.rewardSummary?.noorStarBalance === 4,
    "baseline restored"
  );

  director.disconnect();
  requester.disconnect();
  volunteer.disconnect();
  volunteer2.disconnect();
  partner.disconnect();
}

function printResults() {
  console.log("\nPhase 7 Server Verification Results\n");
  console.log(`Target: ${BASE}\n`);
  let failed = 0;
  for (const { name, pass, detail } of results) {
    console.log(`  ${pass ? "✓" : "✗"} ${name}${detail ? ` — ${detail}` : ""}`);
    if (!pass) failed += 1;
  }
  console.log(`\n${results.length - failed}/${results.length} checks passed.\n`);
  if (failed > 0) process.exit(1);
}

run()
  .then(() => {
    printResults();
  })
  .catch((err) => {
    record("unexpected failure", false, err.message);
    printResults();
    process.exit(1);
  });
