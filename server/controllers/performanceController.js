const crypto = require("crypto");
const Performance = require("../models/Performance");
const { createSamplePerformance } = require("../models/samplePerformance");

const markFields = ["test1", "test2", "midterm", "final"];

function clamp(value, min = 0, max = 100) {
  const next = Number(value);
  if (Number.isNaN(next)) {
    return min;
  }
  return Math.min(max, Math.max(min, next));
}

function sanitizeProfile(profile = {}) {
  return {
    termName: String(profile.termName || "Semester 2").trim().slice(0, 80),
    attendance: clamp(profile.attendance, 0, 100),
    targetGpa: clamp(profile.targetGpa, 0, 10)
  };
}

function sanitizeSubject(subject = {}) {
  const clean = {
    id: String(subject.id || crypto.randomUUID()),
    name: String(subject.name || "Untitled Subject").trim().slice(0, 80),
    credit: clamp(subject.credit, 1, 6)
  };

  markFields.forEach((field) => {
    clean[field] = clamp(subject[field], 0, 100);
  });

  return clean;
}

async function getPerformance(req, res) {
  let performance = await Performance.findOne({ userId: req.user.id }).lean();

  if (!performance) {
    performance = await Performance.create(createSamplePerformance(req.user.id));
    performance = performance.toObject();
  }

  res.json({
    profile: performance.profile,
    subjects: performance.subjects,
    updatedAt: performance.updatedAt
  });
}

async function updatePerformance(req, res) {
  try {
    const profile = sanitizeProfile(req.body.profile);
    const subjects = Array.isArray(req.body.subjects)
      ? req.body.subjects.slice(0, 24).map(sanitizeSubject)
      : [];

    const performance = await Performance.findOneAndUpdate(
      { userId: req.user.id },
      { $set: { profile, subjects } },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true
      }
    ).lean();

    res.json({
      profile: performance.profile,
      subjects: performance.subjects,
      updatedAt: performance.updatedAt
    });
  } catch {
    res.status(400).json({ message: "Could not save performance data" });
  }
}

module.exports = {
  getPerformance,
  updatePerformance
};
