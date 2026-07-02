/**
 * Extended In-memory demo state store for Helpchain.
 * Manages request lifecycle transitions, active sessions, ratings,
 * rewards catalogue, coupon redemptions, and idempotency guarantees.
 */

import QRCode from "qrcode";

const CATEGORY_LABELS = {
  navigation: "Navigation",
  read_text: "Read text",
  reach_shelf: "Reach shelf",
  other: "Other",
};

const NOOR_PARTICIPANT_ID = "vol-noor-id";
const HAVEN_CAFE_PARTNER_ID = "partner-haven-cafe";
const HAVEN_CAFE_REWARD_ID = "reward-haven-cafe";
const BASELINE_STAR_BALANCE = 4;
const MAX_EVENT_LOG_ENTRIES = 30;

function getInitials(name) {
  if (!name) return "N";
  return name.trim().split(/\s+/).map(n => n[0]).join("").toUpperCase().slice(0, 3);
}

export class DemoStore {
  constructor() {
    this.reset();
  }

  reset() {
    this.activeRequest = null;
    // Map of participantId -> { participantId, socketId, displayName, available: boolean, declinedRequests: Set<string>, starBalance: number }
    this.volunteers = new Map();
    // Map of socketId -> participantId
    this.socketToVolunteerId = new Map();
    // Map of socketId -> partnerId
    this.socketToPartnerId = new Map();
    // Map of socketId -> role
    this.socketToRole = new Map();

    // --- Phase 4 State Model Structures ---
    
    // volunteerProfiles: id -> profile
    this.volunteerProfiles = new Map([
      ["vol-noor-id", {
        id: "vol-noor-id",
        displayName: "Noor",
        initials: "NOO",
        starBalance: 4, // Noor starts with 4 demo stars
        averageRating: 4.9,
        rewardHistory: [],
        couponIds: [],
      }]
    ]);

    // Seed catalog rewards
    this.rewards = new Map([
      ["reward-haven-cafe", {
        id: "reward-haven-cafe",
        partnerId: "partner-haven-cafe",
        partnerName: "Haven Café",
        partnerCategory: "Café",
        title: "15% off a drink and pastry",
        description: "Redeemable at Haven Café.",
        starsRequired: 5,
        monthlyRedemptionLimit: 100,
        active: true,
        visualAccentKey: "cafe",
      }],
      ["reward-city-books", {
        id: "reward-city-books",
        partnerId: "partner-city-books",
        partnerName: "City Books",
        partnerCategory: "Books",
        title: "10% off your next purchase",
        description: "Redeemable at City Books.",
        starsRequired: 10,
        monthlyRedemptionLimit: 50,
        active: true,
        visualAccentKey: "books",
      }],
      ["reward-care-pharmacy", {
        id: "reward-care-pharmacy",
        partnerId: "partner-care-pharmacy",
        partnerName: "Care Pharmacy",
        partnerCategory: "Pharmacy",
        title: "12% off selected essentials",
        description: "Redeemable at Care Pharmacy.",
        starsRequired: 15,
        monthlyRedemptionLimit: 50,
        active: true,
        visualAccentKey: "pharmacy",
      }]
    ]);

    this.coupons = new Map();
    this.partnerRedemptions = [];
    this.idempotencyRecords = new Map();

    // --- Phase 5 Director Console ---
    this.eventLog = [];
    this.deviceCounter = 0;
    this.socketToDeviceId = new Map();
    this.connectedDevices = new Map();
    this.directorOperationIds = new Set();
  }

  // --- Socket / Role Registration ---

  registerSocket(socketId, role, participantId, partnerId) {
    this.socketToRole.set(socketId, role);
    if (role === "volunteer" && participantId) {
      this.socketToVolunteerId.set(socketId, participantId);
    } else if (role === "partner" && partnerId) {
      this.socketToPartnerId.set(socketId, partnerId);
    }
  }

  registerConnectedDevice(socketId, role, label, availability) {
    let deviceId = this.socketToDeviceId.get(socketId);
    if (!deviceId) {
      this.deviceCounter += 1;
      const rolePrefix =
        role === "requester"
          ? "req"
          : role === "volunteer"
            ? "vol"
            : role === "partner"
              ? "prt"
              : "dir";
      deviceId = `${rolePrefix}-${this.deviceCounter}`;
      this.socketToDeviceId.set(socketId, deviceId);
    }

    const existing = this.connectedDevices.get(deviceId);
    const device = {
      id: deviceId,
      role,
      label: label || this.getDefaultDeviceLabel(role),
      connectedAt: existing?.connectedAt || new Date().toISOString(),
    };

    if (role === "volunteer") {
      device.availability = availability ?? existing?.availability ?? false;
    }

    this.connectedDevices.set(deviceId, device);
    return device;
  }

  updateConnectedDeviceAvailability(socketId, available) {
    const deviceId = this.socketToDeviceId.get(socketId);
    if (!deviceId) return;
    const device = this.connectedDevices.get(deviceId);
    if (device && device.role === "volunteer") {
      device.availability = available;
      this.connectedDevices.set(deviceId, device);
    }
  }

  unregisterConnectedDevice(socketId) {
    const deviceId = this.socketToDeviceId.get(socketId);
    if (deviceId) {
      this.connectedDevices.delete(deviceId);
      this.socketToDeviceId.delete(socketId);
    }
  }

  getDefaultDeviceLabel(role) {
    switch (role) {
      case "requester":
        return "Requester device";
      case "volunteer":
        return "Noor (volunteer)";
      case "partner":
        return "Haven Café station";
      case "director":
        return "Director console";
      default:
        return "Connected device";
    }
  }

  recordEvent(type, message, tone = "neutral") {
    const event = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      type,
      message,
      createdAt: new Date().toISOString(),
      tone,
    };

    this.eventLog.push(event);
    if (this.eventLog.length > MAX_EVENT_LOG_ENTRIES) {
      this.eventLog = this.eventLog.slice(-MAX_EVENT_LOG_ENTRIES);
    }

    return event;
  }

  getCategoryLabel(category) {
    return CATEGORY_LABELS[category] || "Help";
  }

  getSessionMilestone(request) {
    if (!request) return "idle";
    switch (request.status) {
      case "pending":
        return "seeking_volunteer";
      case "matched":
        return "volunteer_on_the_way";
      case "in_progress":
        return "assistance_active";
      case "awaiting_requester_confirmation":
        return "awaiting_confirmation";
      case "completed":
        return request.session?.starAwardedAt ? "completed_and_rewarded" : "completed";
      default:
        return request.status;
    }
  }

  getNoorProfile() {
    return this.volunteerProfiles.get(NOOR_PARTICIPANT_ID);
  }

  clearDemoSessionAndRewards() {
    this.activeRequest = null;

    for (const vol of this.volunteers.values()) {
      vol.declinedRequests.clear();
    }

    this.coupons.clear();
    this.partnerRedemptions = [];
    this.idempotencyRecords.clear();

    const profile = this.getNoorProfile();
    if (profile) {
      profile.rewardHistory = [];
      profile.couponIds = [];
    }
  }

  setNoorStarBalance(balance) {
    const profile = this.getNoorProfile();
    if (profile) {
      profile.starBalance = balance;
    }

    const volunteer = this.volunteers.get(NOOR_PARTICIPANT_ID);
    if (volunteer) {
      volunteer.starBalance = balance;
    }
  }

  resetVolunteerAvailability() {
    for (const vol of this.volunteers.values()) {
      vol.available = false;
      if (vol.socketId) {
        this.updateConnectedDeviceAvailability(vol.socketId, false);
      }
    }
  }

  resetDemo() {
    this.clearDemoSessionAndRewards();
    this.setNoorStarBalance(BASELINE_STAR_BALANCE);
    this.resetVolunteerAvailability();
    this.recordEvent("director_reset", "System reset to baseline.", "neutral");
    return { success: true };
  }

  createHelpSessionReadyRequest() {
    const profile = this.getNoorProfile();
    const starBalance = profile ? profile.starBalance : BASELINE_STAR_BALANCE;
    const timestamp = new Date().toISOString();

    this.activeRequest = {
      id: `req-${Date.now()}-scenario`,
      status: "matched",
      category: "read_text",
      description: "Can someone help me read the platform sign?",
      locationLabel: "Main Hall",
      createdAt: timestamp,
      volunteer: {
        participantId: NOOR_PARTICIPANT_ID,
        displayName: "Noor",
        initials: getInitials("Noor"),
        averageRating: 4.9,
        starBalance,
      },
      session: {
        id: `session-${Date.now()}`,
        matchedAt: timestamp,
        arrivedAt: null,
        volunteerCompletedAt: null,
        requesterConfirmedAt: null,
        requesterRating: null,
        volunteerRating: null,
        starAwardedAt: null,
      },
    };

    return this.activeRequest;
  }

  async prepareScenario(scenario, operationId) {
    if (!operationId) {
      throw new Error("Operation ID is required.");
    }

    if (this.directorOperationIds.has(operationId)) {
      return { success: true, alreadyProcessed: true, scenario };
    }

    switch (scenario) {
      case "baseline":
        this.resetDemo();
        break;

      case "rewards_ready":
        this.clearDemoSessionAndRewards();
        this.setNoorStarBalance(5);
        this.resetVolunteerAvailability();
        this.recordEvent(
          "scenario_prepared",
          "Rewards-ready scenario prepared. Noor has 5 stars.",
          "success"
        );
        break;

      case "coupon_ready":
        this.clearDemoSessionAndRewards();
        this.setNoorStarBalance(5);
        this.resetVolunteerAvailability();
        await this.createRewardRedemption(
          NOOR_PARTICIPANT_ID,
          HAVEN_CAFE_REWARD_ID,
          `director-coupon-${operationId}`
        );
        this.recordEvent(
          "scenario_prepared",
          "Coupon-ready scenario prepared for Haven Café.",
          "success"
        );
        break;

      case "help_session_ready":
        this.clearDemoSessionAndRewards();
        this.setNoorStarBalance(BASELINE_STAR_BALANCE);
        this.resetVolunteerAvailability();
        this.createHelpSessionReadyRequest();
        this.recordEvent(
          "scenario_prepared",
          "Help-session-ready scenario prepared.",
          "neutral"
        );
        break;

      default:
        throw new Error("Unknown presentation scenario.");
    }

    this.directorOperationIds.add(operationId);
    return { success: true, scenario };
  }

  getDirectorSnapshot() {
    this.reconcileCoupons();

    const connectedDevices = Array.from(this.connectedDevices.values()).map((device) => {
      const sanitized = {
        id: device.id,
        role: device.role,
        label: device.label,
        connectedAt: device.connectedAt,
      };
      if (device.role === "volunteer") {
        sanitized.availability = device.availability ?? false;
      }
      return sanitized;
    });

    let activeRequestSummary = null;
    if (this.activeRequest) {
      activeRequestSummary = {
        status: this.activeRequest.status,
        category: this.activeRequest.category,
        categoryLabel: this.getCategoryLabel(this.activeRequest.category),
        locationLabel: this.activeRequest.locationLabel,
        volunteerName: this.activeRequest.volunteer?.displayName || null,
        sessionMilestone: this.getSessionMilestone(this.activeRequest),
        createdAt: this.activeRequest.createdAt,
        matchedAt: this.activeRequest.session?.matchedAt || null,
        arrivedAt: this.activeRequest.session?.arrivedAt || null,
      };
    }

    const profile = this.getNoorProfile();
    let activeCouponsCount = 0;
    let redeemedCouponsCount = 0;
    let expiredCouponsCount = 0;
    let mostRecentCoupon = null;

    for (const coupon of this.coupons.values()) {
      if (coupon.volunteerId !== NOOR_PARTICIPANT_ID) continue;

      if (coupon.status === "active") activeCouponsCount += 1;
      else if (coupon.status === "redeemed") redeemedCouponsCount += 1;
      else if (coupon.status === "expired") expiredCouponsCount += 1;

      if (!mostRecentCoupon || coupon.issuedAt > mostRecentCoupon.issuedAt) {
        mostRecentCoupon = {
          code: coupon.couponCode,
          status: coupon.status,
          partnerName: coupon.partnerName,
          issuedAt: coupon.issuedAt,
        };
      }
    }

    const rewardSummary = {
      noorStarBalance: profile?.starBalance ?? BASELINE_STAR_BALANCE,
      activeCouponsCount,
      redeemedCouponsCount,
      expiredCouponsCount,
      mostRecentCoupon,
    };

    const partnerSummary = {
      havenCafeRecentRedemptionsCount: this.partnerRedemptions.filter(
        (entry) => entry.partnerId === HAVEN_CAFE_PARTNER_ID
      ).length,
    };

    let requesterCount = 0;
    let volunteerCount = 0;
    let availableVolunteerCount = 0;
    let partnerCount = 0;
    let directorCount = 0;

    for (const device of connectedDevices) {
      if (device.role === "requester") requesterCount += 1;
      if (device.role === "volunteer") {
        volunteerCount += 1;
        if (device.availability) availableVolunteerCount += 1;
      }
      if (device.role === "partner") partnerCount += 1;
      if (device.role === "director") directorCount += 1;
    }

    return {
      connectedDevices,
      demoHealth: {
        requesterDevicesConnected: requesterCount,
        volunteersConnected: volunteerCount,
        volunteersAvailable: availableVolunteerCount,
        partnerStationsConnected: partnerCount,
        directorConsolesConnected: directorCount,
        activeSessionState: activeRequestSummary?.status || "idle",
        noorStarBalance: rewardSummary.noorStarBalance,
        activeCouponCount: activeCouponsCount,
      },
      activeRequestSummary,
      rewardSummary,
      partnerSummary,
      eventLog: [...this.eventLog].slice(-MAX_EVENT_LOG_ENTRIES),
    };
  }

  unregisterSocket(socketId) {
    this.socketToRole.delete(socketId);
    this.socketToVolunteerId.delete(socketId);
    this.socketToPartnerId.delete(socketId);
    this.unregisterVolunteer(socketId);
    this.unregisterConnectedDevice(socketId);
  }

  // --- Volunteer Management ---

  registerVolunteer(socketId, participantId, displayName = "Anonymous Volunteer") {
    // Sync with volunteerProfiles
    this.registerVolunteerProfile(participantId, displayName);
    const profile = this.volunteerProfiles.get(participantId);

    let volunteer = this.volunteers.get(participantId);
    if (!volunteer) {
      volunteer = {
        participantId,
        displayName,
        available: false,
        declinedRequests: new Set(),
        starBalance: profile.starBalance,
      };
      this.volunteers.set(participantId, volunteer);
    }
    
    volunteer.socketId = socketId;
    this.socketToVolunteerId.set(socketId, participantId);
    return volunteer;
  }

  registerVolunteerProfile(participantId, displayName) {
    if (!this.volunteerProfiles.has(participantId)) {
      this.volunteerProfiles.set(participantId, {
        id: participantId,
        displayName: displayName || "Anonymous Volunteer",
        initials: getInitials(displayName || "Anonymous Volunteer"),
        starBalance: 4, // Default starting balance
        averageRating: 4.9,
        rewardHistory: [],
        couponIds: [],
      });
    }
    return this.volunteerProfiles.get(participantId);
  }

  unregisterVolunteer(socketId) {
    const participantId = this.socketToVolunteerId.get(socketId);
    if (participantId) {
      const volunteer = this.volunteers.get(participantId);
      if (volunteer && volunteer.socketId === socketId) {
        volunteer.socketId = null;
      }
      this.socketToVolunteerId.delete(socketId);
    }
  }

  setVolunteerAvailability(socketId, available, displayName, participantId) {
    let volunteer = null;
    const volPartId = participantId || this.socketToVolunteerId.get(socketId);
    
    if (volPartId) {
      this.registerVolunteerProfile(volPartId, displayName);
      volunteer = this.volunteers.get(volPartId);
    }

    const profile = volPartId ? this.volunteerProfiles.get(volPartId) : null;
    const currentStars = profile ? profile.starBalance : 4;

    if (!volunteer) {
      const actualPartId = volPartId || `vol-${Date.now()}`;
      this.registerVolunteerProfile(actualPartId, displayName);
      volunteer = {
        participantId: actualPartId,
        socketId,
        displayName: displayName || "Noor",
        available,
        declinedRequests: new Set(),
        starBalance: currentStars,
      };
      this.volunteers.set(actualPartId, volunteer);
      this.socketToVolunteerId.set(socketId, actualPartId);
    } else {
      volunteer.available = available;
      volunteer.socketId = socketId;
      volunteer.starBalance = currentStars;
      this.socketToVolunteerId.set(socketId, volunteer.participantId);
      if (displayName) {
        volunteer.displayName = displayName;
      }
    }

    this.updateConnectedDeviceAvailability(socketId, available);

    if (available) {
      const name = volunteer.displayName || displayName || "Volunteer";
      this.recordEvent(
        "volunteer_available",
        `${name} became available to help.`,
        "neutral"
      );
    }

    return volunteer;
  }

  getVolunteerBySocket(socketId) {
    const pId = this.socketToVolunteerId.get(socketId);
    return pId ? this.volunteers.get(pId) : null;
  }

  // --- Request Management ---

  createRequest(category, description, locationLabel) {
    const request = {
      id: `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: "pending",
      category,
      description,
      locationLabel: locationLabel || "Main Hall",
      createdAt: new Date().toISOString(),
      volunteer: null,
      session: null,
    };
    
    for (const vol of this.volunteers.values()) {
      vol.declinedRequests.clear();
    }

    this.activeRequest = request;
    this.recordEvent(
      "request_created",
      `Requester created a ${this.getCategoryLabel(category)} request.`,
      "neutral"
    );
    return request;
  }

  acceptRequest(requestId, socketId, participantId) {
    if (!this.activeRequest) {
      throw new Error("No active request found.");
    }
    if (this.activeRequest.id !== requestId) {
      throw new Error("Request ID mismatch.");
    }
    if (this.activeRequest.status !== "pending") {
      throw new Error("This request has already been accepted.");
    }

    let volunteer = this.volunteers.get(participantId);
    if (!volunteer) {
      volunteer = this.registerVolunteer(socketId, participantId, "Noor");
    }

    const profile = this.volunteerProfiles.get(participantId);
    volunteer.available = true;

    const timestamp = new Date().toISOString();
    this.activeRequest.status = "matched";
    this.activeRequest.volunteer = {
      participantId: volunteer.participantId,
      displayName: volunteer.displayName || "Noor",
      initials: getInitials(volunteer.displayName || "Noor"),
      averageRating: 4.9,
      starBalance: profile ? profile.starBalance : volunteer.starBalance,
    };

    this.activeRequest.session = {
      id: `session-${Date.now()}`,
      matchedAt: timestamp,
      arrivedAt: null,
      volunteerCompletedAt: null,
      requesterConfirmedAt: null,
      requesterRating: null,
      volunteerRating: null,
      starAwardedAt: null,
    };

    const volunteerName = volunteer.displayName || "Noor";
    this.recordEvent(
      "request_accepted",
      `${volunteerName} accepted the help request.`,
      "success"
    );

    return this.activeRequest;
  }

  declineRequest(requestId, participantId) {
    const volunteer = this.volunteers.get(participantId);
    if (volunteer) {
      volunteer.declinedRequests.add(requestId);
    }
    return true;
  }

  cancelRequest(requestId) {
    if (this.activeRequest && this.activeRequest.id === requestId) {
      this.activeRequest = null;
      return true;
    }
    return false;
  }

  // --- Session Control ---

  confirmArrival(requestId, participantId) {
    if (!this.activeRequest) throw new Error("No active request.");
    if (this.activeRequest.id !== requestId) throw new Error("Request mismatch.");
    if (this.activeRequest.status !== "matched") throw new Error("Invalid stage for arrival.");
    if (this.activeRequest.volunteer?.participantId !== participantId) throw new Error("Unauthorized volunteer.");

    this.activeRequest.status = "in_progress";
    this.activeRequest.session.arrivedAt = new Date().toISOString();

    const location = this.activeRequest.locationLabel || "the location";
    const volunteerName = this.activeRequest.volunteer?.displayName || "Noor";
    this.recordEvent(
      "volunteer_arrived",
      `${volunteerName} arrived at ${location}.`,
      "success"
    );

    return this.activeRequest;
  }

  markCompletion(requestId, participantId) {
    if (!this.activeRequest) throw new Error("No active request.");
    if (this.activeRequest.id !== requestId) throw new Error("Request mismatch.");
    if (this.activeRequest.status !== "in_progress") throw new Error("Invalid stage for completion.");
    if (this.activeRequest.volunteer?.participantId !== participantId) throw new Error("Unauthorized volunteer.");

    this.activeRequest.status = "awaiting_requester_confirmation";
    this.activeRequest.session.volunteerCompletedAt = new Date().toISOString();

    const volunteerName = this.activeRequest.volunteer?.displayName || "Noor";
    this.recordEvent(
      "assistance_complete",
      `${volunteerName} marked assistance complete.`,
      "neutral"
    );

    return this.activeRequest;
  }

  confirmCompletion(requestId) {
    if (!this.activeRequest) throw new Error("No active request.");
    if (this.activeRequest.id !== requestId) throw new Error("Request mismatch.");
    if (this.activeRequest.status !== "awaiting_requester_confirmation") throw new Error("Invalid stage for confirmation.");

    const timestamp = new Date().toISOString();
    this.activeRequest.status = "completed";
    this.activeRequest.session.requesterConfirmedAt = timestamp;

    // Award exactly one star safely
    if (this.activeRequest.session.starAwardedAt === null) {
      this.activeRequest.session.starAwardedAt = timestamp;
      const volId = this.activeRequest.volunteer?.participantId;
      
      const profile = this.volunteerProfiles.get(volId);
      if (profile) {
        profile.starBalance += 1;
      }

      const volunteer = this.volunteers.get(volId);
      if (volunteer) {
        volunteer.starBalance = profile ? profile.starBalance : (volunteer.starBalance + 1);
        this.activeRequest.volunteer.starBalance = volunteer.starBalance;
      }

      this.recordEvent(
        "requester_confirmed",
        "Requester confirmed help received.",
        "success"
      );
      this.recordEvent(
        "star_awarded",
        `${this.activeRequest.volunteer?.displayName || "Noor"} earned 1 star.`,
        "success"
      );
    }

    return this.activeRequest;
  }

  submitRating(requestId, participantId, rating, role) {
    if (!this.activeRequest) throw new Error("No active request.");
    if (this.activeRequest.id !== requestId) throw new Error("Request mismatch.");
    if (this.activeRequest.status !== "completed") throw new Error("Rating accepted only after completion.");
    if (rating < 1 || rating > 5) throw new Error("Rating must be 1 to 5.");

    const session = this.activeRequest.session;
    if (role === "requester") {
      if (session.requesterRating === null) {
        session.requesterRating = rating;
      }
    } else if (role === "volunteer") {
      if (this.activeRequest.volunteer?.participantId !== participantId) throw new Error("Unauthorized volunteer.");
      if (session.volunteerRating === null) {
        session.volunteerRating = rating;
      }
    }

    return this.activeRequest;
  }

  // --- Phase 4 Reward Redemption Operations ---

  async createRewardRedemption(participantId, rewardId, operationId) {
    if (!participantId) throw new Error("Participant ID is required.");
    if (!rewardId) throw new Error("Reward ID is required.");
    if (!operationId) throw new Error("Operation ID is required.");

    // Idempotency check:
    if (this.idempotencyRecords.has(operationId)) {
      return this.idempotencyRecords.get(operationId);
    }

    const profile = this.volunteerProfiles.get(participantId);
    if (!profile) throw new Error(`Volunteer profile not found for participant: ${participantId}`);

    const reward = this.rewards.get(rewardId);
    if (!reward) throw new Error(`Reward not found: ${rewardId}`);
    if (!reward.active) throw new Error("This reward catalog item is currently inactive.");

    if (profile.starBalance < reward.starsRequired) {
      throw new Error(`Insufficient stars. You have ${profile.starBalance} stars, but ${reward.starsRequired} are required.`);
    }

    // Deduct stars
    profile.starBalance -= reward.starsRequired;

    // Sync transient volunteer if exists
    const volunteer = this.volunteers.get(participantId);
    if (volunteer) {
      volunteer.starBalance = profile.starBalance;
      if (this.activeRequest && this.activeRequest.volunteer?.participantId === participantId) {
        this.activeRequest.volunteer.starBalance = profile.starBalance;
      }
    }

    // Generate unique coupon code suffix (4 alphanumeric chars)
    const suffix = Math.random().toString(36).substr(2, 4).toUpperCase();
    const partnerSlug = reward.partnerName.split(' ')[0].toUpperCase();
    const couponCode = `HC-${partnerSlug}-${suffix}`;
    const couponId = `coupon-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;

    // Generate QR payload (opaque token) & Data URL
    const qrPayload = couponId;
    let qrDataUrl = "";
    try {
      qrDataUrl = await QRCode.toDataURL(qrPayload, { margin: 1, width: 200 });
    } catch (err) {
      console.error("Failed to generate QR data URL:", err);
    }

    const coupon = {
      id: couponId,
      couponCode,
      qrPayload,
      qrDataUrl,
      volunteerId: participantId,
      rewardId,
      partnerId: reward.partnerId,
      partnerName: reward.partnerName,
      title: reward.title,
      starsSpent: reward.starsRequired,
      issuedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 Days Expiration
      status: "active",
      redeemedAt: null,
      redeemedByPartnerId: null,
      refundedAt: null,
    };

    // Store records
    this.coupons.set(couponId, coupon);
    profile.couponIds.push(couponId);
    profile.rewardHistory.push({
      couponId,
      rewardId,
      title: reward.title,
      starsSpent: reward.starsRequired,
      redeemedAt: null,
      issuedAt: coupon.issuedAt,
    });

    this.idempotencyRecords.set(operationId, coupon);

    this.recordEvent(
      "coupon_issued",
      `${reward.partnerName} coupon ${coupon.couponCode} issued.`,
      "success"
    );

    return coupon;
  }

  submitCouponRedemption(partnerId, couponCode) {
    if (!partnerId) throw new Error("Partner ID is required.");
    if (!couponCode) throw new Error("Coupon code is required.");

    this.reconcileCoupons();

    let matchingCoupon = null;
    const cleanCode = couponCode.trim().toUpperCase();

    for (const coupon of this.coupons.values()) {
      if (coupon.couponCode.toUpperCase() === cleanCode) {
        matchingCoupon = coupon;
        break;
      }
    }

    if (!matchingCoupon) {
      throw new Error(`Coupon code '${couponCode}' was not found. Please verify the characters.`);
    }

    if (matchingCoupon.partnerId !== partnerId) {
      throw new Error(`This coupon belongs to ${matchingCoupon.partnerName} and cannot be redeemed here.`);
    }

    if (matchingCoupon.status === "redeemed") {
      throw new Error("This coupon code has already been redeemed.");
    }

    if (matchingCoupon.status === "expired") {
      throw new Error("This coupon is expired and is no longer valid.");
    }

    if (matchingCoupon.status !== "active") {
      throw new Error(`This coupon cannot be redeemed (Status: ${matchingCoupon.status}).`);
    }

    // Re-verify expiration date manually just in case
    const nowTime = Date.now();
    const expireTime = new Date(matchingCoupon.expiresAt).getTime();
    if (nowTime > expireTime) {
      matchingCoupon.status = "expired";
      this.refundExpiredCoupon(matchingCoupon);
      throw new Error("This coupon is expired and has been automatically refunded.");
    }

    // Mark redeemed
    const timestamp = new Date().toISOString();
    matchingCoupon.status = "redeemed";
    matchingCoupon.redeemedAt = timestamp;
    matchingCoupon.redeemedByPartnerId = partnerId;

    // Record partner validation log
    const redemptionId = `redempt-${Date.now()}`;
    this.partnerRedemptions.push({
      id: redemptionId,
      partnerId,
      couponId: matchingCoupon.id,
      redeemedAt: timestamp,
    });

    // Update volunteer profile history logs
    const profile = this.volunteerProfiles.get(matchingCoupon.volunteerId);
    if (profile) {
      const historyItem = profile.rewardHistory.find(item => item.couponId === matchingCoupon.id);
      if (historyItem) {
        historyItem.redeemedAt = timestamp;
      }
    }

    this.recordEvent(
      "coupon_redeemed",
      `${matchingCoupon.partnerName} coupon ${matchingCoupon.couponCode} was redeemed.`,
      "success"
    );

    return matchingCoupon;
  }

  refundExpiredCoupon(coupon) {
    if (coupon.refundedAt) return;
    coupon.refundedAt = new Date().toISOString();

    const profile = this.volunteerProfiles.get(coupon.volunteerId);
    if (profile) {
      profile.starBalance += coupon.starsSpent;
      const volunteer = this.volunteers.get(coupon.volunteerId);
      if (volunteer) {
        volunteer.starBalance = profile.starBalance;
      }

      this.recordEvent(
        "coupon_expired",
        `${coupon.partnerName} coupon ${coupon.couponCode} expired and stars were refunded.`,
        "warning"
      );
    }
  }

  reconcileCoupons() {
    const nowTime = Date.now();
    for (const coupon of this.coupons.values()) {
      if (coupon.status === "active") {
        const expireTime = new Date(coupon.expiresAt).getTime();
        if (nowTime > expireTime) {
          coupon.status = "expired";
          this.refundExpiredCoupon(coupon);
        }
      }
    }
  }

  // --- Serializable Snapshot ---

  getSnapshotForClient(clientSocketId) {
    this.reconcileCoupons();

    const role = this.socketToRole.get(clientSocketId);
    const participantId = this.socketToVolunteerId.get(clientSocketId);
    const partnerId = this.socketToPartnerId.get(clientSocketId);

    let activeRequest = null;

    if (this.activeRequest) {
      let isDeclined = false;
      if (participantId) {
        const volunteer = this.volunteers.get(participantId);
        isDeclined = volunteer?.declinedRequests.has(this.activeRequest.id) || false;
      }
      
      if (!isDeclined) {
        // Sync star balance on active request if matched volunteer's balance updated
        const matchedId = this.activeRequest.volunteer?.participantId;
        if (matchedId) {
          const profile = this.volunteerProfiles.get(matchedId);
          if (profile && this.activeRequest.volunteer) {
            this.activeRequest.volunteer.starBalance = profile.starBalance;
          }
        }
        activeRequest = { ...this.activeRequest };
      }
    }

    let availableCount = 0;
    for (const vol of this.volunteers.values()) {
      if (vol.available) {
        availableCount++;
      }
    }

    const baseSnapshot = {
      activeRequest,
      availableVolunteersCount: availableCount,
      totalVolunteersCount: this.volunteers.size,
    };

    // Volunteer Rewards Snapshots
    if (role === "volunteer" && participantId) {
      this.registerVolunteerProfile(participantId, "Noor");
      const profile = this.volunteerProfiles.get(participantId);

      const volunteerCoupons = [];
      for (const coupon of this.coupons.values()) {
        if (coupon.volunteerId === participantId) {
          volunteerCoupons.push(coupon);
        }
      }

      return {
        ...baseSnapshot,
        rewardsRoleData: {
          profile,
          rewardsCatalog: Array.from(this.rewards.values()),
          coupons: volunteerCoupons,
        }
      };
    }

    // Partner Redemption Snapshots
    if (role === "partner" && partnerId) {
      const partnerCoupons = [];
      for (const coupon of this.coupons.values()) {
        if (coupon.partnerId === partnerId) {
          partnerCoupons.push(coupon);
        }
      }

      const recentRedemptions = [];
      for (const redemption of this.partnerRedemptions) {
        if (redemption.partnerId === partnerId) {
          const coupon = this.coupons.get(redemption.couponId);
          recentRedemptions.push({
            id: redemption.id,
            couponCode: coupon?.couponCode || "UNKNOWN",
            rewardTitle: coupon?.title || "Unknown Reward",
            redeemedAt: redemption.redeemedAt,
          });
        }
      }

      return {
        ...baseSnapshot,
        partnerRoleData: {
          partnerId,
          partnerName: partnerId === "partner-haven-cafe" ? "Haven Café" : "Partner Store",
          coupons: partnerCoupons,
          recentRedemptions: recentRedemptions.slice(-10),
        }
      };
    }

    return baseSnapshot;
  }
}
