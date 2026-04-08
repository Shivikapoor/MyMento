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
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://my-mento.vercel.app",
  process.env.FRONTEND_URL,
  ...(process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(",").map((origin) => origin.trim())
    : []),
].filter(Boolean);

function isAllowedOrigin(origin) {
  if (!origin) return true;
  if (allowedOrigins.includes(origin)) return true;

  try {
    const hostname = new URL(origin).hostname;
    if (hostname.endsWith(".vercel.app")) {
      return true;
    }
  } catch (error) {
    return false;
  }

  return false;
}

const corsOptions = {
  origin(origin, callback) {
    if (isAllowedOrigin(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

const server = http.createServer(app);
const io = new Server(server, {
  cors: corsOptions,
});

/* ================= MIDDLEWARES ================= */

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (isAllowedOrigin(origin)) {
    res.header("Access-Control-Allow-Origin", origin || "*");
    res.header("Vary", "Origin");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
  }

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  return next();
});

app.use(cors(corsOptions));

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

app.use((error, req, res, next) => {
  if (error?.message?.includes("CORS blocked")) {
    return res.status(403).json({ message: error.message });
  }

  return next(error);
});

/* ================= SOCKET ================= */

registerChatSocket(io);

/* ================= SERVER ================= */

const PORT = process.env.PORT || 5000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
