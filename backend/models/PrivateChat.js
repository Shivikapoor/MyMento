const mongoose = require("mongoose");

const privateMessageSchema = new mongoose.Schema(
  {
    nickname: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const privateChatSchema = new mongoose.Schema({
  users: {
    type: [String],
    default: [],
    required: true,
  },
  messages: {
    type: [privateMessageSchema],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("PrivateChat", privateChatSchema);
