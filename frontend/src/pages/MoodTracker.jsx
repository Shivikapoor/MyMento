import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardNavbar from "../components/DashboardNavbar";
import PageWrapper from "../components/PageWrapper";
import { fetchWeeklyMood, saveMood } from "../services/wellnessService";
import { getToken, getUser } from "../utils/auth";
import "../styles/mentalHealth.css";

const moods = [
  { value: 1, label: "Very low" },
  { value: 2, label: "Low" },
  { value: 3, label: "Okay" },
  { value: 4, label: "Good" },
  { value: 5, label: "Great" },
];

function MoodTracker() {
  const navigate = useNavigate();
  const token = getToken();
  const user = getUser();

  const [selectedMood, setSelectedMood] = useState(null);
  const [weeklyMood, setWeeklyMood] = useState([]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (user?.role === "counsellor") {
      navigate("/counsellor-dashboard");
      return;
    }

    const loadMoods = async () => {
      const data = await fetchWeeklyMood();
      setWeeklyMood(data);
      const today = new Date().toISOString().slice(0, 10);
      const todayMood = data.find((item) => item.date === today);
      setSelectedMood(todayMood?.moodValue || null);
    };

    loadMoods();
  }, [navigate, token, user?.role]);

  const handleSave = async () => {
    if (!selectedMood) return;

    try {
      await saveMood({ moodValue: selectedMood });
      const refreshed = await fetchWeeklyMood();
      setWeeklyMood(refreshed);
      setStatus("Mood saved for today.");
    } catch (error) {
      setStatus(error.response?.data?.message || "Unable to save mood.");
    }
  };

  return (
    <PageWrapper>
      <div className="mental-layout">
        <DashboardNavbar />

        <main className="mental-page-shell">
          <section className="mental-page-hero">
            <span className="section-tag">Mood Tracker</span>
            <h1>How are you feeling today?</h1>
            <p>Choose one mood on the 1 to 5 scale and save your daily check-in.</p>
          </section>

          <section className="mental-card">
            <div className="mood-selector-grid">
              {moods.map((mood) => (
                <button
                  key={mood.value}
                  type="button"
                  className={`mood-pill ${selectedMood === mood.value ? "active" : ""}`}
                  onClick={() => setSelectedMood(mood.value)}
                >
                  <strong>{mood.value}</strong>
                  <span>{mood.label}</span>
                </button>
              ))}
            </div>

            <div className="form-action-row">
              <button type="button" className="primary-soft-btn" onClick={handleSave}>
                Save Mood
              </button>
              {status ? <p className="form-status">{status}</p> : null}
            </div>
          </section>

          <section className="mental-card">
            <span className="mental-card-kicker">Last 7 Days</span>
            <div className="simple-list">
              {weeklyMood.map((item) => (
                <div key={item.date} className="simple-list-row">
                  <strong>{item.label}</strong>
                  <span>{item.moodValue ? `${item.moodValue} / 5` : "No entry"}</span>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </PageWrapper>
  );
}

export default MoodTracker;
