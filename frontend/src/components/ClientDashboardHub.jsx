import { useEffect, useState } from "react";
import DreamProgressCard from "./DreamProgressCard";
import MoodThisWeekCard from "./MoodThisWeekCard";
import ScheduleProgressCard from "./ScheduleProgressCard";
import WeeklyInsightCard from "./WeeklyInsightCard";
import {
  createDream,
  createTask,
  fetchDreamProgress,
  fetchDreams,
  fetchInsight,
  fetchTaskStats,
  fetchTasks,
  fetchWeeklyMood,
  saveMood,
  updateTaskStatus,
} from "../services/wellnessService";
import "../styles/mentalHealth.css";

const moodOptions = [
  { value: 1, label: "Very low" },
  { value: 2, label: "Low" },
  { value: 3, label: "Okay" },
  { value: 4, label: "Good" },
  { value: 5, label: "Great" },
];

function ClientDashboardHub() {
  const [moodData, setMoodData] = useState([]);
  const [taskStats, setTaskStats] = useState(null);
  const [dreamProgress, setDreamProgress] = useState(null);
  const [insight, setInsight] = useState(null);
  const [dreams, setDreams] = useState([]);
  const [scheduleTasks, setScheduleTasks] = useState([]);
  const [dreamTasks, setDreamTasks] = useState([]);
  const [selectedMood, setSelectedMood] = useState(null);
  const [dreamTitle, setDreamTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");
  const [scheduleForm, setScheduleForm] = useState({
    title: "",
    date: new Date().toISOString().slice(0, 10),
  });
  const [dreamTaskForm, setDreamTaskForm] = useState({
    title: "",
    date: new Date().toISOString().slice(0, 10),
    dreamId: "",
  });

  const loadDashboard = async () => {
    try {
      const [
        weeklyMood,
        taskStatsData,
        dreamProgressData,
        insightData,
        dreamsData,
        scheduleTasksData,
        dreamTasksData,
      ] = await Promise.all([
        fetchWeeklyMood(),
        fetchTaskStats(),
        fetchDreamProgress(),
        fetchInsight(),
        fetchDreams(),
        fetchTasks("schedule"),
        fetchTasks("dream"),
      ]);

      setMoodData(weeklyMood);
      setTaskStats(taskStatsData);
      setDreamProgress(dreamProgressData);
      setInsight(insightData);
      setDreams(dreamsData);
      setScheduleTasks(scheduleTasksData);
      setDreamTasks(dreamTasksData);

      const today = new Date().toISOString().slice(0, 10);
      const todayMood = weeklyMood.find((item) => item.date === today);
      setSelectedMood(todayMood?.moodValue || null);
      setDreamTaskForm((prev) => ({
        ...prev,
        dreamId: prev.dreamId || dreamsData[0]?._id || "",
      }));
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleMoodSave = async () => {
    if (!selectedMood) return;

    try {
      await saveMood({ moodValue: selectedMood });
      setFeedback("Today's mood saved.");
      await loadDashboard();
    } catch (err) {
      setFeedback(err.response?.data?.message || "Unable to save mood.");
    }
  };

  const handleScheduleSubmit = async (event) => {
    event.preventDefault();

    try {
      await createTask({
        title: scheduleForm.title,
        type: "schedule",
        date: scheduleForm.date,
      });
      setScheduleForm({
        title: "",
        date: new Date().toISOString().slice(0, 10),
      });
      setFeedback("Schedule task added.");
      await loadDashboard();
    } catch (err) {
      setFeedback(err.response?.data?.message || "Unable to add schedule task.");
    }
  };

  const handleDreamSubmit = async (event) => {
    event.preventDefault();

    try {
      await createDream({ dreamTitle });
      setDreamTitle("");
      setFeedback("Dream added.");
      await loadDashboard();
    } catch (err) {
      setFeedback(err.response?.data?.message || "Unable to add dream.");
    }
  };

  const handleDreamTaskSubmit = async (event) => {
    event.preventDefault();

    try {
      await createTask({
        title: dreamTaskForm.title,
        type: "dream",
        date: dreamTaskForm.date,
        dreamId: dreamTaskForm.dreamId || null,
      });
      setDreamTaskForm((prev) => ({
        ...prev,
        title: "",
        date: new Date().toISOString().slice(0, 10),
      }));
      setFeedback("Dream task added.");
      await loadDashboard();
    } catch (err) {
      setFeedback(err.response?.data?.message || "Unable to add dream task.");
    }
  };

  const handleTaskStatusChange = async (taskId, status) => {
    try {
      await updateTaskStatus({ taskId, status });
      await loadDashboard();
    } catch (err) {
      setFeedback(err.response?.data?.message || "Unable to update task status.");
    }
  };

  if (loading) {
    return <div className="mental-loading inline-loading">Loading your wellness dashboard...</div>;
  }

  return (
    <section className="hub-section embedded-dashboard-section">
      <div className="section-heading">
        <h2>Mental Health Dashboard</h2>
        <p>Your mood, schedule, dreams, and insights now live right here in one place.</p>
      </div>

      {error ? <div className="mental-error-banner">{error}</div> : null}
      {feedback ? <div className="mental-feedback-banner">{feedback}</div> : null}

      <div className="mental-card-grid embedded-grid">
        <MoodThisWeekCard moodData={moodData} />
        <ScheduleProgressCard stats={taskStats} />
        <DreamProgressCard dataSet={dreamProgress} />
        <WeeklyInsightCard insight={insight} />
      </div>

      <div className="embedded-input-grid">
        <article className="mental-card embedded-input-card">
          <div className="mental-card-head">
            <div>
              <span className="mental-card-kicker">Mood Tracker</span>
              <h3>Log today's mood</h3>
            </div>
          </div>

          <div className="compact-mood-grid">
            {moodOptions.map((mood) => (
              <button
                key={mood.value}
                type="button"
                className={`mini-mood-pill ${selectedMood === mood.value ? "active" : ""}`}
                onClick={() => setSelectedMood(mood.value)}
              >
                <strong>{mood.value}</strong>
                <span>{mood.label}</span>
              </button>
            ))}
          </div>

          <button type="button" className="primary-soft-btn" onClick={handleMoodSave}>
            Save Mood
          </button>
        </article>

        <article className="mental-card embedded-input-card">
          <div className="mental-card-head">
            <div>
              <span className="mental-card-kicker">My Schedule</span>
              <h3>Add and update daily tasks</h3>
            </div>
          </div>

          <form className="wellness-form compact-form" onSubmit={handleScheduleSubmit}>
            <input
              type="text"
              value={scheduleForm.title}
              onChange={(event) =>
                setScheduleForm((prev) => ({ ...prev, title: event.target.value }))
              }
              placeholder="Add a daily task"
              required
            />
            <input
              type="date"
              value={scheduleForm.date}
              onChange={(event) =>
                setScheduleForm((prev) => ({ ...prev, date: event.target.value }))
              }
              required
            />
            <button type="submit" className="primary-soft-btn">
              Add Task
            </button>
          </form>

          <div className="embedded-task-list">
            {scheduleTasks.slice(0, 4).map((task) => (
              <article key={task._id} className="task-row embedded-task-row">
                <div>
                  <strong>{task.title}</strong>
                  <span>{new Date(task.date).toLocaleDateString()}</span>
                </div>
                <select
                  value={task.status}
                  onChange={(event) =>
                    handleTaskStatusChange(task._id, event.target.value)
                  }
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="missed">Missed</option>
                </select>
              </article>
            ))}
          </div>
        </article>

        <article className="mental-card embedded-input-card">
          <div className="mental-card-head">
            <div>
              <span className="mental-card-kicker">My Dreams</span>
              <h3>Build progress toward long-term goals</h3>
            </div>
          </div>

          <form className="wellness-form compact-form" onSubmit={handleDreamSubmit}>
            <input
              type="text"
              value={dreamTitle}
              onChange={(event) => setDreamTitle(event.target.value)}
              placeholder="Add a dream"
              required
            />
            <button type="submit" className="primary-soft-btn">
              Save Dream
            </button>
          </form>

          <form className="wellness-form compact-form dream-task-form" onSubmit={handleDreamTaskSubmit}>
            <input
              type="text"
              value={dreamTaskForm.title}
              onChange={(event) =>
                setDreamTaskForm((prev) => ({ ...prev, title: event.target.value }))
              }
              placeholder="Add a dream task"
              required
            />
            <input
              type="date"
              value={dreamTaskForm.date}
              onChange={(event) =>
                setDreamTaskForm((prev) => ({ ...prev, date: event.target.value }))
              }
              required
            />
            <select
              value={dreamTaskForm.dreamId}
              onChange={(event) =>
                setDreamTaskForm((prev) => ({ ...prev, dreamId: event.target.value }))
              }
            >
              <option value="">Select dream</option>
              {dreams.map((dream) => (
                <option key={dream._id} value={dream._id}>
                  {dream.dreamTitle}
                </option>
              ))}
            </select>
            <button type="submit" className="primary-soft-btn">
              Add Dream Task
            </button>
          </form>

          <div className="embedded-task-list">
            {dreamTasks.slice(0, 4).map((task) => (
              <article key={task._id} className="task-row embedded-task-row">
                <div>
                  <strong>{task.title}</strong>
                  <span>{task.dreamId?.dreamTitle || "General dream"}</span>
                </div>
                <select
                  value={task.status}
                  onChange={(event) =>
                    handleTaskStatusChange(task._id, event.target.value)
                  }
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="missed">Missed</option>
                </select>
              </article>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}

export default ClientDashboardHub;
