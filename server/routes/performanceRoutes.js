const express = require("express");
const { getPerformance, updatePerformance } = require("../controllers/performanceController");
const { requireAuth } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", requireAuth, getPerformance);
router.put("/", requireAuth, updatePerformance);

module.exports = router;
