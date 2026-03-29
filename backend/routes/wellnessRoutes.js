const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  createDream,
  createTask,
  getDreamProgress,
  getInsight,
  getTaskStats,
  getWeeklyMood,
  listDreams,
  listTasks,
  saveMood,
  updateTaskStatus,
} = require("../controllers/wellnessController");

const router = express.Router();

router.post("/mood", protect, saveMood);
router.get("/mood/weekly", protect, getWeeklyMood);

router.post("/task", protect, createTask);
router.put("/task/status", protect, updateTaskStatus);
router.get("/task/stats", protect, getTaskStats);
router.get("/task", protect, listTasks);

router.post("/dream", protect, createDream);
router.get("/dream", protect, listDreams);
router.get("/dream/progress", protect, getDreamProgress);

router.get("/insight", protect, getInsight);

module.exports = router;
