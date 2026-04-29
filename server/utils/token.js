const crypto = require("crypto");

const sevenDays = 7 * 24 * 60 * 60 * 1000;

function base64url(value) {
  return Buffer.from(value)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function secret() {
  return process.env.TOKEN_SECRET || "student-performance-analytics-dev-secret";
}

function signToken(payload) {
  const body = {
    ...payload,
    exp: Date.now() + sevenDays
  };
  const encoded = base64url(JSON.stringify(body));
  const signature = crypto.createHmac("sha256", secret()).update(encoded).digest("base64url");
  return `${encoded}.${signature}`;
}

function verifyToken(token) {
  const [encoded, signature] = String(token || "").split(".");
  if (!encoded || !signature) {
    return null;
  }

  const expected = crypto.createHmac("sha256", secret()).update(encoded).digest("base64url");
  const expectedBuffer = Buffer.from(expected);
  const receivedBuffer = Buffer.from(signature);

  if (expectedBuffer.length !== receivedBuffer.length || !crypto.timingSafeEqual(expectedBuffer, receivedBuffer)) {
    return null;
  }

  const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
  if (!payload.exp || payload.exp < Date.now()) {
    return null;
  }

  return payload;
}

module.exports = {
  signToken,
  verifyToken
};
