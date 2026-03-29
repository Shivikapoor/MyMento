import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardNavbar from "../components/DashboardNavbar";
import PageWrapper from "../components/PageWrapper";
import {
  createTask,
  fetchTasks,
  updateTaskStatus,
} from "../services/wellnessService";
import { getToken, getUser } from "../utils/auth";
import "../styles/mentalHealth.css";

function MySchedule() {
  const navigate = useNavigate();
  const token = getToken();
  const user = getUser();

  const [tasks, setTasks] = useState([]);
  const [status, setStatus] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    date: new Date().toISOString().slice(0, 10),
  });

  const loadTasks = async () => {
    const data = await fetchTasks("schedule");
    setTasks(data);
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

    loadTasks();
  }, [navigate, token, user?.role]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await createTask({
        title: formData.title,
        type: "schedule",
        date: formData.date,
      });
      setFormData({
        title: "",
        date: new Date().toISOString().slice(0, 10),
      });
      setStatus("Task added.");
      loadTasks();
    } catch (error) {
      setStatus(error.response?.data?.message || "Unable to add task.");
    }
  };

  const handleStatusChange = async (taskId, nextStatus) => {
    await updateTaskStatus({ taskId, status: nextStatus });
    loadTasks();
  };

  return (
    <PageWrapper>
      <div className="mental-layout">
        <DashboardNavbar />

        <main className="mental-page-shell">
          <section className="mental-page-hero">
            <span className="section-tag">My Schedule</span>
            <h1>Plan your day with less pressure</h1>
            <p>Add daily tasks and update each one as completed, pending, or missed.</p>
          </section>

          <section className="mental-card">
            <form className="wellness-form" onSubmit={handleSubmit}>
              <label>
                <span>Task title</span>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, title: event.target.value }))
                  }
                  placeholder="Example: Finish journal reflection"
                  required
                />
              </label>

              <label>
                <span>Date</span>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, date: event.target.value }))
                  }
                  required
                />
              </label>

              <button type="submit" className="primary-soft-btn">
                Add Task
              </button>
            </form>
            {status ? <p className="form-status">{status}</p> : null}
          </section>

          <section className="mental-card">
            <span className="mental-card-kicker">Daily Tasks</span>
            <div className="task-list">
              {tasks.length === 0 ? (
                <p className="empty-text">No schedule tasks yet.</p>
              ) : (
                tasks.map((task) => (
                  <article key={task._id} className="task-row">
                    <div>
                      <strong>{task.title}</strong>
                      <span>{new Date(task.date).toLocaleDateString()}</span>
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

export default MySchedule;
