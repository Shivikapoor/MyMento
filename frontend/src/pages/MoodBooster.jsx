import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import "../App.css";

const STORAGE_KEY = "moodBoosterCompletedActions";

const allActions = [
  {
    id: "walk",
    label: "Walk 10 min",
    message: "A short walk can reset your mind and shift your energy.",
    duration: 600,
  },
  {
    id: "water",
    label: "Drink water",
    message: "A little hydration can help your body and mood feel less stuck.",
    duration: 0,
  },
  {
    id: "stretch",
    label: "Stretch",
    message: "Small movement tells your nervous system it can soften a bit.",
    duration: 120,
  },
  {
    id: "friend",
    label: "Call a friend",
    message: "Reaching out for a few minutes can make the day feel lighter.",
    duration: 300,
  },
];

function MoodBooster() {
  const navigate = useNavigate();
  const [activeAction, setActiveAction] = useState(null);
  const [timerLeft, setTimerLeft] = useState(0);
  const [completedActions, setCompletedActions] = useState([]);
  const [celebrateId, setCelebrateId] = useState("");

  useEffect(() => {
    try {
      setCompletedActions(JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]"));
    } catch {
      setCompletedActions([]);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(completedActions));
  }, [completedActions]);

  useEffect(() => {
    if (!timerLeft) return undefined;

    const timer = window.setInterval(() => {
      setTimerLeft((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [timerLeft]);

  const daySeed = new Date().toISOString().slice(0, 10);

  const dailyActions = useMemo(() => {
    const seedValue = daySeed.split("-").reduce((total, part) => total + Number(part), 0);
    const reordered = [...allActions].sort((first, second) => {
      const firstScore = (seedValue + first.label.length * 17) % 17;
      const secondScore = (seedValue + second.label.length * 17) % 17;
      return firstScore - secondScore;
    });
    return reordered;
  }, [daySeed]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleActionClick = (action) => {
    setActiveAction(action);
    setTimerLeft(action.duration);
  };

  const handleDone = () => {
    if (!activeAction) return;

    const doneEntry = {
      id: `${activeAction.id}-${Date.now()}`,
      label: activeAction.label,
      timestamp: new Date().toISOString(),
    };

    setCompletedActions((current) => [doneEntry, ...current]);
    setCelebrateId(doneEntry.id);

    window.setTimeout(() => {
      setCelebrateId("");
    }, 900);
  };

  return (
    <PageWrapper>
      <div className="moodbooster-page">
        <section className="tool-shell">
          <div className="tool-topbar">
            <button type="button" className="tool-back-btn" onClick={() => navigate("/")}>
              Back to Home
            </button>
            <div className="tool-status-pill">Lift Your State</div>
          </div>

          <div className="tool-hero">
            <span className="tool-eyebrow">Mood Support</span>
            <h1>Mood Booster</h1>
            <p>Small uplifting actions for low-energy days when simple momentum matters most.</p>
          </div>

          <div className="moodbooster-layout">
            <div className="tool-panel">
              <div className="tool-panel-head">
                <h2>Today's Suggestions</h2>
                <span>Rotates daily</span>
              </div>

              <div className="moodbooster-action-grid">
                {dailyActions.map((action) => (
                  <button
                    key={action.id}
                    type="button"
                    className={`moodbooster-action-card ${activeAction?.id === action.id ? "active" : ""}`}
                    onClick={() => handleActionClick(action)}
                  >
                    <strong>{action.label}</strong>
                    <span>{action.duration ? `${Math.round(action.duration / 60)} min support` : "Quick win"}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="tool-panel moodbooster-side-panel">
              <div className="moodbooster-focus-card">
                <span>Current boost</span>
                <h2>{activeAction ? activeAction.label : "Pick one action"}</h2>
                <p>{activeAction ? activeAction.message : "Choose one small action to get started."}</p>
                {activeAction?.duration ? <strong>{formatTime(timerLeft)}</strong> : null}
              </div>

              <button type="button" className="tool-main-btn" onClick={handleDone} disabled={!activeAction}>
                Mark Done
              </button>

              <AnimatePresence>
                {celebrateId ? (
                  <motion.div
                    className="tool-inline-status success"
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.24 }}
                  >
                    Nice work. Small steps count.
                  </motion.div>
                ) : null}
              </AnimatePresence>

              <div className="tool-list">
                {completedActions.slice(0, 4).map((entry) => (
                  <div key={entry.id} className="tool-list-item">
                    <strong>{entry.label}</strong>
                    <p>{new Date(entry.timestamp).toLocaleString()}</p>
                  </div>
                ))}
                {!completedActions.length ? (
                  <p className="tool-empty-text">Completed boosts will show up here.</p>
                ) : null}
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageWrapper>
  );
}

export default MoodBooster;
