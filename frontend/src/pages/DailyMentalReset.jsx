import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import "../App.css";

const STORAGE_KEY = "dailyMentalResetEntries";

function DailyMentalReset() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({
    stress: 5,
    sleepHours: "",
    worry: "",
    goodThing: "",
  });

  useEffect(() => {
    try {
      setEntries(JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]"));
    } catch {
      setEntries([]);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  const saveEntry = () => {
    const entry = {
      id: Date.now(),
      date: new Date().toISOString().slice(0, 10),
      stress: Number(form.stress),
      sleepHours: Number(form.sleepHours) || 0,
      worry: form.worry.trim(),
      goodThing: form.goodThing.trim(),
    };

    setEntries((current) => [entry, ...current]);
    setForm({
      stress: 5,
      sleepHours: "",
      worry: "",
      goodThing: "",
    });
  };

  const streakCount = useMemo(() => {
    if (!entries.length) return 0;

    const uniqueDays = [...new Set(entries.map((entry) => entry.date))].sort().reverse();
    let streak = 0;
    let current = new Date();

    for (const day of uniqueDays) {
      const compare = current.toISOString().slice(0, 10);
      if (day !== compare) break;
      streak += 1;
      current.setDate(current.getDate() - 1);
    }

    return streak;
  }, [entries]);

  const insight = useMemo(() => {
    if (entries.length < 2) return "Take 30 seconds to check in.";

    const moreSleepDays = entries.filter((entry) => entry.sleepHours >= 7);
    const lessSleepDays = entries.filter((entry) => entry.sleepHours > 0 && entry.sleepHours < 7);

    const averageStress = (list) =>
      list.length ? list.reduce((total, entry) => total + entry.stress, 0) / list.length : null;

    const moreSleepStress = averageStress(moreSleepDays);
    const lessSleepStress = averageStress(lessSleepDays);

    if (moreSleepStress !== null && lessSleepStress !== null && moreSleepStress < lessSleepStress) {
      return "You feel better on days with more sleep.";
    }

    return "Take 30 seconds to check in.";
  }, [entries]);

  return (
    <PageWrapper>
      <div className="dailyreset-page">
        <section className="tool-shell">
          <div className="tool-topbar">
            <button type="button" className="tool-back-btn" onClick={() => navigate("/")}>
              Back to Home
            </button>
            <div className="tool-status-pill">Daily Check-in</div>
          </div>

          <div className="tool-hero">
            <span className="tool-eyebrow">Daily Return</span>
            <h1>Daily Mental Reset</h1>
            <p>Take 30 seconds to check in and build a clearer picture of your days over time.</p>
          </div>

          <div className="dailyreset-layout">
            <div className="tool-panel">
              <div className="tool-list">
                <label className="cbt-field">
                  <span>Stress level: {form.stress}/10</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={form.stress}
                    onChange={(event) => setForm((current) => ({ ...current, stress: event.target.value }))}
                  />
                </label>
                <label className="cbt-field">
                  <span>Sleep hours</span>
                  <input
                    type="number"
                    min="0"
                    max="24"
                    value={form.sleepHours}
                    onChange={(event) => setForm((current) => ({ ...current, sleepHours: event.target.value }))}
                    className="tool-input"
                  />
                </label>
                <label className="cbt-field">
                  <span>One worry</span>
                  <input
                    type="text"
                    value={form.worry}
                    onChange={(event) => setForm((current) => ({ ...current, worry: event.target.value }))}
                    className="tool-input"
                  />
                </label>
                <label className="cbt-field">
                  <span>One good thing</span>
                  <input
                    type="text"
                    value={form.goodThing}
                    onChange={(event) => setForm((current) => ({ ...current, goodThing: event.target.value }))}
                    className="tool-input"
                  />
                </label>
                <button type="button" className="tool-main-btn" onClick={saveEntry}>
                  Save Entry
                </button>
              </div>
            </div>

            <div className="tool-panel">
              <div className="dailyreset-insight-card">
                <span>{streakCount}-day streak</span>
                <h2>{insight}</h2>
              </div>
              <div className="tool-list">
                {entries.slice(0, 5).map((entry) => (
                  <div key={entry.id} className="tool-list-item">
                    <strong>{entry.date}</strong>
                    <p>Stress {entry.stress}/10, Sleep {entry.sleepHours} hrs</p>
                    <p>Worry: {entry.worry || "None added"}</p>
                    <p>Good thing: {entry.goodThing || "None added"}</p>
                  </div>
                ))}
                {!entries.length ? <p className="tool-empty-text">Your previous entries will show up here.</p> : null}
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageWrapper>
  );
}

export default DailyMentalReset;
