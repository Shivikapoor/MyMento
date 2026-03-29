import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import DashboardNavbar from "../components/DashboardNavbar";
import DreamProgressCard from "../components/DreamProgressCard";
import MoodThisWeekCard from "../components/MoodThisWeekCard";
import ScheduleProgressCard from "../components/ScheduleProgressCard";
import WeeklyInsightCard from "../components/WeeklyInsightCard";
import {
  fetchDreamProgress,
  fetchInsight,
  fetchTaskStats,
  fetchWeeklyMood,
} from "../services/wellnessService";
import { getToken, getUser } from "../utils/auth";
import "../styles/mentalHealth.css";

function Dashboard() {
  const navigate = useNavigate();
  const token = getToken();
  const user = getUser();

  const [moodData, setMoodData] = useState([]);
  const [taskStats, setTaskStats] = useState(null);
  const [dreamProgress, setDreamProgress] = useState(null);
  const [insight, setInsight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (user?.role === "counsellor") {
      navigate("/counsellor-dashboard");
      return;
    }

    const loadDashboard = async () => {
      try {
        const [moodRes, taskRes, dreamRes, insightRes] = await Promise.all([
          fetchWeeklyMood(),
          fetchTaskStats(),
          fetchDreamProgress(),
          fetchInsight(),
        ]);

        setMoodData(moodRes);
        setTaskStats(taskRes);
        setDreamProgress(dreamRes);
        setInsight(insightRes);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load dashboard.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [navigate, token, user?.role]);

  if (loading) {
    return <div className="mental-loading">Loading your dashboard...</div>;
  }

  return (
    <PageWrapper>
      <div className="mental-layout">
        <DashboardNavbar />

        <main className="mental-page-shell">
          <section className="mental-welcome-card">
            <div>
              <span className="section-tag">Welcome back</span>
              <h1>{user?.name}'s wellness dashboard</h1>
              <p>
                Track how you feel, monitor routine progress, and get weekly
                guidance based on your real activity.
              </p>
            </div>

            <div className="welcome-metrics">
              <div>
                <strong>{taskStats?.scheduleProgress || 0}%</strong>
                <span>Schedule progress</span>
              </div>
              <div>
                <strong>{dreamProgress?.progress || 0}%</strong>
                <span>Dream progress</span>
              </div>
              <div>
                <strong>{insight?.moodAverage ?? 0}</strong>
                <span>Avg mood</span>
              </div>
            </div>
          </section>

          {error ? <div className="mental-error-banner">{error}</div> : null}

          <section className="mental-card-grid">
            <MoodThisWeekCard moodData={moodData} />
            <ScheduleProgressCard stats={taskStats} />
            <DreamProgressCard dataSet={dreamProgress} />
            <WeeklyInsightCard insight={insight} />
          </section>

          <section className="mental-quick-actions">
            <article className="mental-card quick-action-card">
              <span className="mental-card-kicker">Quick Actions</span>
              <h3>Keep your momentum going</h3>
              <div className="quick-action-row">
                <button type="button" onClick={() => navigate("/mood-tracker")}>
                  Log today's mood
                </button>
                <button type="button" onClick={() => navigate("/my-schedule")}>
                  Update schedule
                </button>
                <button type="button" onClick={() => navigate("/my-dreams")}>
                  Work on dreams
                </button>
              </div>
            </article>
          </section>
        </main>
      </div>
    </PageWrapper>
  );
}

export default Dashboard;
