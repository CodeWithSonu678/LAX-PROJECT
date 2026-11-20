const {
  generateHmac,
  verifyHmac
} = require("./src/modules/lax-registration/utils/hmac.utils");

const secret = "LAX_TEST_SECRET";
const message = "LAX-123456:1794360000:abc123";

const signature = generateHmac(secret, message);

console.log("Signature:", signature);

console.log(
  "Valid Signature:",
  verifyHmac(secret, message, signature)
);

console.log(
  "Invalid Signature:",
  verifyHmac(secret, message, "invalid")
);