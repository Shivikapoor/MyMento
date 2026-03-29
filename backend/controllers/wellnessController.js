const Dream = require("../models/Dream");
const Mood = require("../models/Mood");
const Task = require("../models/Task");

function getDayBounds(value = new Date()) {
  const date = new Date(value);
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

function getDaysAgo(daysAgo) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return getDayBounds(date);
}

function toPercent(completed, total) {
  if (!total) return 0;
  return Math.round((completed / total) * 100);
}

function average(values) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

async function getWeeklyMoodSeries(userId) {
  const { start } = getDaysAgo(6);
  const moods = await Mood.find({
    userId,
    date: { $gte: start },
  }).sort({ date: 1 });

  const moodMap = new Map(
    moods.map((entry) => [
      new Date(entry.date).toISOString().slice(0, 10),
      entry.moodValue,
    ])
  );

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    const key = date.toISOString().slice(0, 10);
    return {
      date: key,
      moodValue: moodMap.get(key) ?? null,
      label: date.toLocaleDateString("en-US", {
        weekday: "short",
      }),
    };
  });
}

async function getTaskStats(userId) {
  const stats = await Task.aggregate([
    { $match: { userId } },
    {
      $group: {
        _id: { type: "$type", status: "$status" },
        count: { $sum: 1 },
      },
    },
  ]);

  const base = {
    overall: { completed: 0, pending: 0, missed: 0, total: 0 },
    schedule: { completed: 0, pending: 0, missed: 0, total: 0 },
    dream: { completed: 0, pending: 0, missed: 0, total: 0 },
  };

  stats.forEach(({ _id, count }) => {
    const bucket = base[_id.type];
    if (!bucket) return;
    bucket[_id.status] = count;
    bucket.total += count;
    base.overall[_id.status] += count;
    base.overall.total += count;
  });

  return {
    ...base,
    scheduleProgress: toPercent(base.schedule.completed, base.schedule.total),
    dreamProgress: toPercent(base.dream.completed, base.dream.total),
  };
}

async function getDreamProgress(userId) {
  const [dreams, tasks] = await Promise.all([
    Dream.find({ userId }).sort({ createdAt: -1 }),
    Task.find({ userId, type: "dream" }),
  ]);

  const totalsByDream = new Map();

  tasks.forEach((task) => {
    const key = task.dreamId ? String(task.dreamId) : "unassigned";
    const current = totalsByDream.get(key) || { total: 0, completed: 0 };
    current.total += 1;
    if (task.status === "completed") {
      current.completed += 1;
    }
    totalsByDream.set(key, current);
  });

  const dreamsWithProgress = dreams.map((dream) => {
    const counts = totalsByDream.get(String(dream._id)) || {
      total: 0,
      completed: 0,
    };

    return {
      _id: dream._id,
      dreamTitle: dream.dreamTitle,
      createdAt: dream.createdAt,
      totalTasks: counts.total,
      completedTasks: counts.completed,
      progress: toPercent(counts.completed, counts.total),
    };
  });

  const totalDreamTasks = tasks.length;
  const completedDreamTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length;

  return {
    progress: toPercent(completedDreamTasks, totalDreamTasks),
    completedDreamTasks,
    totalDreamTasks,
    dreams: dreamsWithProgress,
  };
}

async function buildInsight(userId) {
  const [weeklyMood, taskStats, dreamProgressData] = await Promise.all([
    getWeeklyMoodSeries(userId),
    getTaskStats(userId),
    getDreamProgress(userId),
  ]);

  const moodValues = weeklyMood
    .map((item) => item.moodValue)
    .filter((value) => value !== null);
  const moodAverage = average(moodValues);

  const previousWindow = getDaysAgo(13);
  const currentWindow = getDaysAgo(6);
  const previousEnd = new Date(currentWindow.start);
  previousEnd.setMilliseconds(previousEnd.getMilliseconds() - 1);

  const previousMoods = await Mood.find({
    userId,
    date: { $gte: previousWindow.start, $lte: previousEnd },
  });

  const previousMoodAverage = average(
    previousMoods.map((entry) => entry.moodValue)
  );
  const moodTrend =
    moodAverage > previousMoodAverage
      ? "improving"
      : moodAverage < previousMoodAverage
        ? "declining"
        : "steady";

  const messages = [];

  if (moodAverage > 0 && moodAverage <= 2.5 && taskStats.scheduleProgress < 50) {
    messages.push(
      "Your mood and progress both look a little low this week. Try one small task at a time and keep today's plan very light."
    );
  }

  if (moodAverage > 0 && moodAverage <= 2.5 && taskStats.scheduleProgress >= 50) {
    messages.push(
      "You have still been getting a lot done while feeling low. Make room for rest, hydration, and a shorter to-do list tomorrow."
    );
  }

  if (moodAverage >= 3.5 && taskStats.scheduleProgress < 50) {
    messages.push(
      "Your energy looks stronger than your follow-through right now. This could be a good moment to turn that energy into one focused win."
    );
  }

  if (dreamProgressData.progress >= 70) {
    messages.push(
      "Your dream progress is moving well. Keep reinforcing that momentum with one meaningful next step."
    );
  }

  if (moodTrend === "improving") {
    messages.push(
      "Your mood is trending upward compared with the previous week. Notice what helped and repeat the routines that supported you."
    );
  }

  if (!messages.length) {
    messages.push(
      "You are building a steady rhythm. Keep balancing daily care, realistic goals, and progress that feels sustainable."
    );
  }

  return {
    moodAverage: Number(moodAverage.toFixed(2)),
    moodTrend,
    scheduleProgress: taskStats.scheduleProgress,
    dreamProgress: dreamProgressData.progress,
    suggestions: messages,
  };
}

exports.saveMood = async (req, res) => {
  try {
    const { moodValue, date } = req.body;

    if (!moodValue || moodValue < 1 || moodValue > 5) {
      return res.status(400).json({ message: "Mood value must be between 1 and 5." });
    }

    const { start } = getDayBounds(date ? new Date(date) : new Date());

    const mood = await Mood.findOneAndUpdate(
      { userId: req.user._id, date: start },
      { userId: req.user._id, date: start, moodValue },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(201).json(mood);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getWeeklyMood = async (req, res) => {
  try {
    const moods = await getWeeklyMoodSeries(req.user._id);
    res.json(moods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createTask = async (req, res) => {
  try {
    const { title, type, status, date, dreamId } = req.body;

    if (!title || !type || !date) {
      return res.status(400).json({ message: "Title, type and date are required." });
    }

    const task = await Task.create({
      userId: req.user._id,
      title,
      type,
      status: status || "pending",
      date,
      dreamId: type === "dream" ? dreamId || null : null,
    });

    const populatedTask = await Task.findById(task._id).populate("dreamId");
    res.status(201).json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTaskStatus = async (req, res) => {
  try {
    const { taskId, status } = req.body;

    if (!taskId || !status) {
      return res.status(400).json({ message: "taskId and status are required." });
    }

    const task = await Task.findOneAndUpdate(
      { _id: taskId, userId: req.user._id },
      { status },
      { new: true }
    ).populate("dreamId");

    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTaskStats = async (req, res) => {
  try {
    const stats = await getTaskStats(req.user._id);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.listTasks = async (req, res) => {
  try {
    const query = { userId: req.user._id };
    if (req.query.type) {
      query.type = req.query.type;
    }

    const tasks = await Task.find(query).populate("dreamId").sort({ date: 1, createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createDream = async (req, res) => {
  try {
    const { dreamTitle } = req.body;

    if (!dreamTitle) {
      return res.status(400).json({ message: "Dream title is required." });
    }

    const dream = await Dream.create({
      userId: req.user._id,
      dreamTitle,
    });

    res.status(201).json(dream);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.listDreams = async (req, res) => {
  try {
    const dreams = await Dream.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(dreams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDreamProgress = async (req, res) => {
  try {
    const progress = await getDreamProgress(req.user._id);
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getInsight = async (req, res) => {
  try {
    const insight = await buildInsight(req.user._id);
    res.json(insight);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
