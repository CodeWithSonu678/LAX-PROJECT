// "use strict";

// const crypto = require("crypto");

// const laxId = "LAX-8bcc6c41-c637-4ac6-baea-6bc62983ee3a";
// const deviceSecret = "031a94ef3daa6fe578cfcf9e08bb85fd308cc007857c5e9156af9403e32ba949"; // Backend me stored encrypted secret ko decrypt karke use karein

// const timestamp = Math.floor(Date.now() / 1000).toString();

// const nonce = crypto.randomBytes(16).toString("hex");

// // Backend ke existing canonical message ke according
// const message = `${laxId}:${timestamp}:${nonce}`;

// // HMAC-SHA256
// const signature = crypto
//   .createHmac("sha256", deviceSecret)
//   .update(message, "utf8")
//   .digest("hex");

// console.log("\n========== LAX AUTH TEST ==========\n");

// console.log("LAX ID:", laxId);
// console.log("Timestamp:", timestamp);
// console.log("Nonce:", nonce);
// console.log("Signature:", signature);

// console.log("\n===================================\n");

const crypto = require("crypto");

const laxId = "LAX-8bcc6c41-c637-4ac6-baea-6bc62983ee3a";
const deviceSecret = "031a94ef3daa6fe578cfcf9e08bb85fd308cc007857c5e9156af9403e32ba949";

const timestamp = Math.floor(Date.now() / 1000).toString();

const nonce = crypto.randomBytes(16).toString("hex");

const message = `${laxId}:${timestamp}:${nonce}`;

const signature = crypto
  .createHmac("sha256", deviceSecret)
  .update(message, "utf8")
  .digest("hex");

console.log({
  laxId,
  timestamp,
  nonce,
  signature,
});