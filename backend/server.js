const dns = require("node:dns");
const http = require("http");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { Server } = require("socket.io");
const { registerChatSocket } = require("./socket/chatSocket");

dns.setServers(["8.8.8.8", "1.1.1.1"]);
require("dotenv").config();

// Routes
const authRoutes = require("./routes/authRoutes");
const counsellorRoutes = require("./routes/counsellorRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const counsellorProfileRoutes = require("./routes/counsellorProfileRoutes");
const ratingRoutes = require("./routes/ratingRoutes");
const wellnessRoutes = require("./routes/wellnessRoutes");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

/* ================= MIDDLEWARES ================= */

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

/* ================= DATABASE ================= */

console.log("Mongo URI:", process.env.MONGO_URI);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.log("Mongo Error:", err.message));

/* ================= ROUTES ================= */

app.get("/api/mymento", (req, res) => {
  res.json({
    name: "MyMento",
    message: "Counselling Backend Connected Successfully",
    services: ["Career", "Marriage", "Life Coaching"],
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/counsellors", counsellorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/profile", counsellorProfileRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/ratings", ratingRoutes);
app.use("/api", wellnessRoutes);

/* ================= SOCKET ================= */

registerChatSocket(io);

/* ================= SERVER ================= */

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
