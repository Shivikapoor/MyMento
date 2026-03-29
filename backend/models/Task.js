const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["schedule", "dream"],
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["completed", "pending", "missed"],
      default: "pending",
      index: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    dreamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dream",
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
