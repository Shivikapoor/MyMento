const mongoose = require("mongoose");

const chatUserSchema = new mongoose.Schema(
  {
    nickname: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    socketId: {
      type: String,
      required: true,
    },
    isOnline: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ChatUser", chatUserSchema);
