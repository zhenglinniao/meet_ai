const crypto = require("crypto");
const { readFileSync } = require("fs");

const body = JSON.parse(readFileSync("./scripts/payload.json", "utf8"));
const bodyString = JSON.stringify(body);
const secret = process.env.STREAM_VIDEO_SECRET_KEY;

if (!secret) {
  throw new Error("STREAM_VIDEO_SECRET_KEY must be set");
}

const signature = crypto.createHmac("sha256", secret).update(bodyString).digest("hex");
console.log(signature);
