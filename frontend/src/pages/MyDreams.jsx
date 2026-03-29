import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardNavbar from "../components/DashboardNavbar";
import PageWrapper from "../components/PageWrapper";
import {
  createDream,
  createTask,
  fetchDreamProgress,
  fetchDreams,
  fetchTasks,
  updateTaskStatus,
} from "../services/wellnessService";
import { getToken, getUser } from "../utils/auth";
import "../styles/mentalHealth.css";

function MyDreams() {
  const navigate = useNavigate();
  const token = getToken();
  const user = getUser();

  const [dreams, setDreams] = useState([]);
  const [dreamTasks, setDreamTasks] = useState([]);
  const [dreamProgress, setDreamProgress] = useState(null);
  const [notice, setNotice] = useState("");
  const [dreamTitle, setDreamTitle] = useState("");
  const [taskForm, setTaskForm] = useState({
    title: "",
    date: new Date().toISOString().slice(0, 10),
    dreamId: "",
  });

  const loadDreamData = async () => {
    const [dreamsData, tasksData, progressData] = await Promise.all([
      fetchDreams(),
      fetchTasks("dream"),
      fetchDreamProgress(),
    ]);

    setDreams(dreamsData);
    setDreamTasks(tasksData);
    setDreamProgress(progressData);
    setTaskForm((prev) => ({
      ...prev,
      dreamId: prev.dreamId || dreamsData[0]?._id || "",
    }));
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (user?.role === "counsellor") {
      navigate("/counsellor-dashboard");
      return;
    }

    loadDreamData();
  }, [navigate, token, user?.role]);

  const handleDreamSubmit = async (event) => {
    event.preventDefault();

    try {
      await createDream({ dreamTitle });
      setDreamTitle("");
      setNotice("Dream added.");
      loadDreamData();
    } catch (error) {
      setNotice(error.response?.data?.message || "Unable to add dream.");
    }
  };

  const handleTaskSubmit = async (event) => {
    event.preventDefault();

    try {
      await createTask({
        title: taskForm.title,
        type: "dream",
        date: taskForm.date,
        dreamId: taskForm.dreamId || null,
      });
      setTaskForm({
        title: "",
        date: new Date().toISOString().slice(0, 10),
        dreamId: taskForm.dreamId,
      });
      setNotice("Dream task added.");
      loadDreamData();
    } catch (error) {
      setNotice(error.response?.data?.message || "Unable to add dream task.");
    }
  };

  const handleStatusChange = async (taskId, status) => {
    await updateTaskStatus({ taskId, status });
    loadDreamData();
  };

  return (
    <PageWrapper>
      <div className="mental-layout">
        <DashboardNavbar />

        <main className="mental-page-shell">
          <section className="mental-page-hero">
            <span className="section-tag">My Dreams</span>
            <h1>Turn long-term goals into real progress</h1>
            <p>Add dreams, connect tasks to them, and track your completion percentage.</p>
          </section>

          <section className="dual-form-grid">
            <article className="mental-card">
              <span className="mental-card-kicker">Add Dream</span>
              <form className="wellness-form" onSubmit={handleDreamSubmit}>
                <label>
                  <span>Dream title</span>
                  <input
                    type="text"
                    value={dreamTitle}
                    onChange={(event) => setDreamTitle(event.target.value)}
                    placeholder="Example: Become Software Engineer"
                    required
                  />
                </label>
                <button type="submit" className="primary-soft-btn">
                  Save Dream
                </button>
              </form>
            </article>

            <article className="mental-card">
              <span className="mental-card-kicker">Add Dream Task</span>
              <form className="wellness-form" onSubmit={handleTaskSubmit}>
                <label>
                  <span>Task title</span>
                  <input
                    type="text"
                    value={taskForm.title}
                    onChange={(event) =>
                      setTaskForm((prev) => ({ ...prev, title: event.target.value }))
                    }
                    placeholder="Example: Complete DSA practice"
                    required
                  />
                </label>

                <label>
                  <span>Date</span>
                  <input
                    type="date"
                    value={taskForm.date}
                    onChange={(event) =>
                      setTaskForm((prev) => ({ ...prev, date: event.target.value }))
                    }
                    required
                  />
                </label>

                <label>
                  <span>Dream</span>
                  <select
                    value={taskForm.dreamId}
                    onChange={(event) =>
                      setTaskForm((prev) => ({ ...prev, dreamId: event.target.value }))
                    }
                  >
                    <option value="">No dream selected</option>
                    {dreams.map((dream) => (
                      <option key={dream._id} value={dream._id}>
                        {dream.dreamTitle}
                      </option>
                    ))}
                  </select>
                </label>

                <button type="submit" className="primary-soft-btn">
                  Save Dream Task
                </button>
              </form>
            </article>
          </section>

          {notice ? <p className="form-status">{notice}</p> : null}

          <section className="mental-card">
            <div className="progress-summary-row">
              <div>
                <strong>{dreamProgress?.progress || 0}%</strong>
                <span>Total dream progress</span>
              </div>
              <div>
                <strong>{dreamProgress?.completedDreamTasks || 0}</strong>
                <span>Completed dream tasks</span>
              </div>
              <div>
                <strong>{dreamProgress?.totalDreamTasks || 0}</strong>
                <span>Total dream tasks</span>
              </div>
            </div>
          </section>

          <section className="mental-card">
            <span className="mental-card-kicker">Dream List</span>
            <div className="simple-list">
              {dreamProgress?.dreams?.length ? (
                dreamProgress.dreams.map((dream) => (
                  <div key={dream._id} className="simple-list-row">
                    <strong>{dream.dreamTitle}</strong>
                    <span>{dream.progress}% complete</span>
                  </div>
                ))
              ) : (
                <p className="empty-text">No dreams added yet.</p>
              )}
            </div>
          </section>

          <section className="mental-card">
            <span className="mental-card-kicker">Dream Tasks</span>
            <div className="task-list">
              {dreamTasks.length === 0 ? (
                <p className="empty-text">No dream tasks yet.</p>
              ) : (
                dreamTasks.map((task) => (
                  <article key={task._id} className="task-row">
                    <div>
                      <strong>{task.title}</strong>
                      <span>
                        {(task.dreamId?.dreamTitle || "General dream")} •{" "}
                        {new Date(task.date).toLocaleDateString()}
                      </span>
                    </div>

                    <select
                      value={task.status}
                      onChange={(event) =>
                        handleStatusChange(task._id, event.target.value)
                      }
                    >
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="missed">Missed</option>
                    </select>
                  </article>
                ))
              )}
            </div>
          </section>
        </main>
      </div>
    </PageWrapper>
  );
}

export default MyDreams;
