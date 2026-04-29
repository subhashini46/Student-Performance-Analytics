const User = require("../models/User");
const Performance = require("../models/Performance");
const { createSamplePerformance } = require("../models/samplePerformance");
const { hashPassword, verifyPassword } = require("../utils/password");
const { signToken } = require("../utils/token");

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function publicUser(user) {
  return {
    id: user._id ? user._id.toString() : user.id,
    name: user.name,
    email: user.email
  };
}

function sendAuthResponse(res, user, status = 200) {
  res.status(status).json({
    token: signToken({ id: user._id ? user._id.toString() : user.id }),
    user: publicUser(user)
  });
}

async function register(req, res) {
  try {
    const name = String(req.body.name || "").trim();
    const email = normalizeEmail(req.body.email);
    const password = String(req.body.password || "");

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existing = await User.findOne({ email }).lean();
    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const user = await User.create({
        name,
        email,
      passwordHash: hashPassword(password)
    });

    await Performance.create(createSamplePerformance(user._id.toString()));
    sendAuthResponse(res, user, 201);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Email already registered" });
    }
    res.status(500).json({ message: error.message || "Registration failed" });
  }
}

async function login(req, res) {
  try {
    const email = normalizeEmail(req.body.email);
    const password = String(req.body.password || "");
    const user = await User.findOne({ email });

    if (!user || !verifyPassword(password, user.passwordHash)) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    sendAuthResponse(res, user);
  } catch {
    res.status(500).json({ message: "Login failed" });
  }
}

async function me(req, res) {
  res.json({ user: req.user });
}

module.exports = {
  register,
  login,
  me
};
