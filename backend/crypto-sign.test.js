const crypto = require("crypto");

const secret = Buffer.alloc(32, 0);

const message = "The quick brown fox jumps over the lazy dog";

const signature = crypto
    .createHmac("sha256", secret)
    .update(message, "utf8")
    .digest("hex");

console.log(signature);