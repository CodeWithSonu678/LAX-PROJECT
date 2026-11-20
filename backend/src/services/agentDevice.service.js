"use strict";

const crypto = require("node:crypto");

const AgentDevice = require("../models/AgentDevice");
const PairingSession = require("../models/PairingSession");

const {
  generateDeviceToken,
  hashToken,
  verifyToken,
} = require("./agentAuth.service");

const {
  encryptCredential,
  decryptCredential,
} = require("./credentialEncryption.service");

// ============================================
// HELPERS
// ============================================

// SHA-256 hash for pairing code and polling secret.
function hashValue(value) {
  return crypto
    .createHash("sha256")
    .update(value, "utf8")
    .digest("hex");
}

// Constant-time comparison of SHA-256 hashes.
function safeHashCompare(value, storedHash) {
  if (
    typeof value !== "string" ||
    typeof storedHash !== "string" ||
    !/^[a-f0-9]{64}$/i.test(storedHash)
  ) {
    return false;
  }

  const actual = Buffer.from(hashValue(value), "hex");
  const expected = Buffer.from(storedHash, "hex");

  return crypto.timingSafeEqual(actual, expected);
}

// Generate permanent laptop System ID.
function generateSystemId() {
  return `SYS-${crypto.randomBytes(8)
    .toString("hex")
    .toUpperCase()}`;
}

// Generate an 8-digit pairing code.
function generatePairingCode() {
  return crypto
    .randomInt(0, 100000000)
    .toString()
    .padStart(8, "0");
}

// ============================================
// 1. START PAIRING
// ============================================

async function startPairing({
  installationId,
  pollSecret,
  deviceName,
  os,
}) {
  if (
    typeof installationId !== "string" ||
    typeof pollSecret !== "string" ||
    typeof deviceName !== "string" ||
    !installationId.trim() ||
    installationId.length > 150 ||
    !deviceName.trim() ||
    deviceName.length > 150 ||
    !/^[a-f0-9]{64}$/.test(pollSecret)
  ) {
    throw new Error("Invalid pairing information.");
  }

  // Check whether this installation is already registered.
  const existingDevice = await AgentDevice.findOne({
    installationId,
  });

  if (existingDevice) {
    throw new Error("Installation is already registered.");
  }

  // Generate a fresh pairing code.
  const pairingCode = generatePairingCode();

  const expiresAt = new Date(
    Date.now() + 10 * 60 * 1000
  );

  const sessionData = {
    pairingCodeHash: hashValue(pairingCode),
    pollSecretHash: hashValue(pollSecret),
    deviceName: deviceName.trim(),
    os: typeof os === "string" ? os.slice(0, 100) : "unknown",
    status: "pending",
    userId: null,
    systemId: null,
    encryptedCredential: null,
    credentialIv: null,
    credentialTag: null,
    deliveredAt: null,
    expiresAt,
  };

  // Reuse expired or delivered sessions.
  // Do not replace an active pairing session.
  const existingSession = await PairingSession.findOne({
    installationId,
  });

  if (
    existingSession &&
    ["pending", "processing", "approved"].includes(
      existingSession.status
    ) &&
    existingSession.expiresAt > new Date()
  ) {
    throw new Error("Pairing session already exists.");
  }

  if (existingSession) {
    const updated = await PairingSession.findOneAndUpdate(
      {
        _id: existingSession._id,
        status: existingSession.status,
      },
      {
        $set: sessionData,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updated) {
      throw new Error("Pairing session changed. Please retry.");
    }
  } else {
    await PairingSession.create({
      installationId,
      ...sessionData,
    });
  }

  return {
    pairingCode,
    expiresAt,
  };
}

// ============================================
// 2. CLAIM PAIRING
// ============================================

async function claimPairing({
  pairingCode,
  userId,
}) {
  if (
    typeof pairingCode !== "string" ||
    !/^\d{8}$/.test(pairingCode) ||
    !userId
  ) {
    throw new Error("Invalid pairing request.");
  }

  // Atomically reserve the pairing code.
  // Only one user can claim this code.
  const session = await PairingSession.findOneAndUpdate(
    {
      pairingCodeHash: hashValue(pairingCode),
      status: "pending",
      expiresAt: { $gt: new Date() },
    },
    {
      $set: {
        status: "processing",
        userId,
      },
    },
    {
      new: true,
    }
  );

  if (!session) {
    throw new Error(
      "Invalid, expired or already used pairing code."
    );
  }

  let createdDeviceId = null;

  try {
    // Prevent duplicate installation registration.
    const existingDevice = await AgentDevice.findOne({
      installationId: session.installationId,
    });

    if (existingDevice) {
      throw new Error("Installation already registered.");
    }

    // Generate permanent credentials.
    const systemId = generateSystemId();
    const token = generateDeviceToken();

    // Encrypt the credential for retry-safe delivery.
    const encrypted = encryptCredential(token);

    // Register laptop in database.
    const device = await AgentDevice.create({
      deviceId: systemId,
      installationId: session.installationId,
      userId,
      deviceName: session.deviceName,
      deviceType: "laptop",
      os: session.os,
      tokenHash: hashToken(token),
      status: "active",
    });

    createdDeviceId = device._id;

    // Save encrypted credential in pairing session.
    session.systemId = systemId;
    session.encryptedCredential =
      encrypted.encryptedCredential;
    session.credentialIv = encrypted.credentialIv;
    session.credentialTag = encrypted.credentialTag;
    session.status = "approved";

    await session.save();

    return {
      systemId,
      deviceName: session.deviceName,
      message: "Laptop successfully paired.",
    };
  } catch (error) {
    // Compensate for a partially completed registration.
    if (createdDeviceId) {
      await AgentDevice.deleteOne({
        _id: createdDeviceId,
      });
    }

    // Restore session to pending only if it is still processing.
    await PairingSession.updateOne(
      {
        _id: session._id,
        status: "processing",
      },
      {
        $set: {
          status: "pending",
          userId: null,
        },
      }
    );

    throw error;
  }
}

// ============================================
// 3. POLL PAIRING STATUS
// ============================================

async function pollPairing({
  installationId,
  pollSecret,
}) {
  if (
    typeof installationId !== "string" ||
    typeof pollSecret !== "string" ||
    !/^[a-f0-9]{64}$/.test(pollSecret)
  ) {
    throw new Error("Invalid polling credentials.");
  }

  const session = await PairingSession.findOne({
    installationId,
  }).select(
    "+pollSecretHash +encryptedCredential +credentialIv +credentialTag"
  );

  if (!session) {
    throw new Error("Pairing session not found.");
  }

  // Authenticate the Local Agent.
  if (!safeHashCompare(pollSecret, session.pollSecretHash)) {
    throw new Error("Invalid polling credentials.");
  }

  // Expire sessions that were never claimed.
  if (
    session.status === "pending" &&
    session.expiresAt <= new Date()
  ) {
    session.status = "expired";
    await session.save();

    return {
      status: "expired",
    };
  }

  // Wait for website approval.
  if (
    session.status === "pending" ||
    session.status === "processing"
  ) {
    return {
      status: session.status,
    };
  }

  // Credential already acknowledged.
  if (session.status === "delivered") {
    return {
      status: "delivered",
      systemId: session.systemId,
    };
  }

  // Reject invalid states.
  if (session.status !== "approved") {
    return {
      status: session.status,
    };
  }

  // Verify credential is still available.
  if (
    !session.encryptedCredential ||
    !session.credentialIv ||
    !session.credentialTag
  ) {
    throw new Error("Device credential is unavailable.");
  }

  // Decrypt permanent credential.
  const token = decryptCredential({
    encryptedCredential: session.encryptedCredential,
    credentialIv: session.credentialIv,
    credentialTag: session.credentialTag,
  });

  // IMPORTANT:
  // Do not delete encrypted credentials here.
  // The Local Agent must acknowledge successful storage.
  return {
    status: "approved",
    systemId: session.systemId,
    token,
  };
}

// ============================================
// 4. ACKNOWLEDGE CREDENTIAL DELIVERY
// ============================================

async function acknowledgePairing({
  installationId,
  pollSecret,
  systemId,
}) {
  if (
    typeof installationId !== "string" ||
    typeof pollSecret !== "string" ||
    typeof systemId !== "string"
  ) {
    throw new Error("Invalid acknowledgement.");
  }

  const session = await PairingSession.findOne({
    installationId,
    systemId,
  }).select("+pollSecretHash");

  if (!session) {
    throw new Error("Pairing session not found.");
  }

  if (!safeHashCompare(pollSecret, session.pollSecretHash)) {
    throw new Error("Invalid polling credentials.");
  }

  // Make acknowledgement idempotent.
  if (session.status === "delivered") {
    return {
      status: "delivered",
    };
  }

  if (session.status !== "approved") {
    throw new Error("Pairing is not approved.");
  }

  session.status = "delivered";
  session.deliveredAt = new Date();

  // Remove encrypted credential after acknowledgement.
  session.encryptedCredential = null;
  session.credentialIv = null;
  session.credentialTag = null;

  await session.save();

  return {
    status: "delivered",
  };
}

// ============================================
// 5. AUTHENTICATE WEBSOCKET DEVICE
// ============================================

async function authenticateDevice(deviceId, token) {
  if (
    typeof deviceId !== "string" ||
    typeof token !== "string"
  ) {
    return null;
  }

  const device = await AgentDevice.findOne({
    deviceId,
    status: "active",
    revoked: false,
  }).select("+tokenHash");

  if (!device) {
    return null;
  }

  if (!verifyToken(token, device.tokenHash)) {
    return null;
  }

  // Update last successful authentication time.
  device.lastSeen = new Date();

  await device.save();

  return {
    deviceId: device.deviceId,
    userId: device.userId,
  };
}

// ============================================
// EXPORT SERVICES
// ============================================

module.exports = Object.freeze({
  startPairing,
  claimPairing,
  pollPairing,
  acknowledgePairing,
  authenticateDevice,
});