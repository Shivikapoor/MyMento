const dns = require("node:dns");
const http = require("http");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { Server } = require("socket.io");
const { registerChatSocket } = require("./socket/chatSocket");
require("dotenv").config();

const dnsServers = (
  process.env.DNS_SERVERS ||
  (process.env.NODE_ENV !== "production" ? "8.8.8.8,1.1.1.1" : "")
)
  .split(",")
  .map((server) => server.trim())
  .filter(Boolean);

if (dnsServers.length) {
  try {
    dns.setServers(dnsServers);
    console.log("Using DNS servers:", dnsServers.join(", "));
  } catch (error) {
    console.warn("Unable to apply custom DNS servers:", error.message);
  }
}

// Routes
const authRoutes = require("./routes/authRoutes");
const counsellorRoutes = require("./routes/counsellorRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const counsellorProfileRoutes = require("./routes/counsellorProfileRoutes");
const ratingRoutes = require("./routes/ratingRoutes");
const wellnessRoutes = require("./routes/wellnessRoutes");

const app = express();
const allowedOrigins = new Set(
  [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "https://my-mento.vercel.app",
    "https://mymento.vercel.app",
    process.env.FRONTEND_URL,
    ...(process.env.CORS_ORIGINS
      ? process.env.CORS_ORIGINS.split(",").map((origin) => origin.trim())
      : []),
  ].filter(Boolean)
);

function isAllowedPreviewHostname(hostname) {
  return hostname.endsWith(".vercel.app") || hostname.endsWith(".onrender.com");
}

function isAllowedOrigin(origin) {
  if (!origin) return true;
  if (allowedOrigins.has(origin)) return true;

  try {
    const { hostname, protocol } = new URL(origin);
    const isLocalhost = hostname === "localhost" || hostname === "127.0.0.1";

    if (isLocalhost && (protocol === "http:" || protocol === "https:")) {
      return true;
    }

    if (protocol === "https:" && isAllowedPreviewHostname(hostname)) {
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
      return callback(null, origin || true);
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 204,
};

const server = http.createServer(app);
const io = new Server(server, {
  cors: corsOptions,
});

/* ================= MIDDLEWARES ================= */

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

app.use(express.json());

/* ================= DATABASE ================= */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.log("Mongo Error:", err.message));

mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB disconnected");
});

mongoose.connection.on("error", (error) => {
  console.error("MongoDB connection error:", error);
});

/* ================= ROUTES ================= */

app.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "MyMento backend",
    message: "Server is running",
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

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
const HOST = process.env.HOST || "0.0.0.0";

server.listen(PORT, HOST, () => {
  console.log(`Server running on port ${PORT}`);
});

server.on("error", (error) => {
  console.error("HTTP server error:", error);
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled promise rejection:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error);
});
