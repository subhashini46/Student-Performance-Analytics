const crypto = require("crypto");

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password, storedHash) {
  const [salt, hash] = storedHash.split(":");
  const candidate = crypto.scryptSync(password, salt, 64);
  const original = Buffer.from(hash, "hex");
  return original.length === candidate.length && crypto.timingSafeEqual(original, candidate);
}

module.exports = {
  hashPassword,
  verifyPassword
};
