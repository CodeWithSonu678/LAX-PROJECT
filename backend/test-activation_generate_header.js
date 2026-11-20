require("dotenv").config();

const mongoose = require("mongoose");
const crypto = require("crypto");

const LaxDevice = require("./src/models/LaxDevice");
const { decryptSecret } = require(
  "./src/modules/lax-registration/utils/encryption.utils"
);

async function generateActivationHeaders() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);

    // Apna provisioned device find karo
    const device = await LaxDevice.findOne({
      status: "pending"
    }).select("+deviceSecretEncrypted");

    if (!device) {
      throw new Error("No pending LAX device found.");
    }

    const secret = decryptSecret(device.deviceSecretEncrypted);

    const timestamp = Math.floor(Date.now() / 1000).toString();

    const nonce = crypto.randomBytes(16).toString("hex");

    const message = `${device.laxId}:${timestamp}:${nonce}`;

    const signature = crypto
      .createHmac("sha256", secret)
      .update(message, "utf8")
      .digest("hex");

    console.log("\nActivation Headers:\n");

    console.log("x-lax-id:", device.laxId);
    console.log("x-lax-timestamp:", timestamp);
    console.log("x-lax-nonce:", nonce);
    console.log("x-lax-signature:", signature);

  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

generateActivationHeaders();