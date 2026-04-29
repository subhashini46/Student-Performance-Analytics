const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    termName: {
      type: String,
      default: "Semester 2",
      trim: true,
      maxlength: 80
    },
    attendance: {
      type: Number,
      default: 88,
      min: 0,
      max: 100
    },
    targetGpa: {
      type: Number,
      default: 8,
      min: 0,
      max: 10
    }
  },
  { _id: false }
);

const subjectSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80
    },
    credit: {
      type: Number,
      default: 3,
      min: 1,
      max: 6
    },
    test1: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    test2: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    midterm: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    final: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    }
  },
  { _id: false }
);

const performanceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true
    },
    profile: {
      type: profileSchema,
      default: () => ({})
    },
    subjects: {
      type: [subjectSchema],
      default: []
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Performance", performanceSchema);
