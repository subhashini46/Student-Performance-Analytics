const User = require("../models/User");
const { verifyToken } = require("../utils/token");

async function requireAuth(req, res, next) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const payload = verifyToken(token);

    if (!payload?.id) {
      return res.status(401).json({ message: "Please sign in again" });
    }

    const user = await User.findById(payload.id).select("name email").lean();

    if (!user) {
      return res.status(401).json({ message: "Account not found" });
    }

    req.user = { id: user._id.toString(), name: user.name, email: user.email };
    next();
  } catch {
    res.status(401).json({ message: "Please sign in again" });
  }
}

module.exports = {
  requireAuth
};
