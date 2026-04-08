import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import "../App.css";

const actions = ["Breathing", "Journal", "Walk timer", "Eye relax"];

function FiveMinuteReset() {
  const navigate = useNavigate();
  const [activeAction, setActiveAction] = useState("");
  const [journalText, setJournalText] = useState("");
  const [timerLeft, setTimerLeft] = useState(0);
  const [breathPhase, setBreathPhase] = useState("Inhale...");
  const [completeMessage, setCompleteMessage] = useState("");

  useEffect(() => {
    if (!timerLeft) return undefined;

    const timer = window.setInterval(() => {
      setTimerLeft((current) => {
        if (current <= 1) {
          setCompleteMessage("Nice reset. You're back.");
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [timerLeft]);

  useEffect(() => {
    if (activeAction !== "Breathing") return undefined;

    const sequence = [
      { label: "Inhale...", time: 4000 },
      { label: "Exhale...", time: 4000 },
    ];

    const timers = [];

    const loopStep = (index) => {
      setBreathPhase(sequence[index].label);
      timers.push(
        window.setTimeout(() => loopStep((index + 1) % sequence.length), sequence[index].time)
      );
    };

    loopStep(0);
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [activeAction]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAction = (action) => {
    setActiveAction(action);
    setCompleteMessage("");

    if (action === "Breathing") setTimerLeft(60);
    if (action === "Walk timer") setTimerLeft(300);
    if (action === "Eye relax") setTimerLeft(20);
    if (action === "Journal") setTimerLeft(300);
  };

  return (
    <PageWrapper>
      <div className="fivemin-page">
        <section className="tool-shell">
          <div className="tool-topbar">
            <button type="button" className="tool-back-btn" onClick={() => navigate("/")}>
              Back to Home
            </button>
            <div className="tool-status-pill">Quick Reset</div>
          </div>

          <div className="tool-hero">
            <span className="tool-eyebrow">Five Minutes</span>
            <h1>I Have 5 Minutes</h1>
            <p>Fast reset activities for busy moments when you need something simple and helpful.</p>
          </div>

          <div className="fivemin-layout">
            <div className="tool-panel">
              <div className="moodbooster-action-grid">
                {actions.map((action) => (
                  <button
                    key={action}
                    type="button"
                    className={`moodbooster-action-card ${activeAction === action ? "active" : ""}`}
                    onClick={() => handleAction(action)}
                  >
                    <strong>{action}</strong>
                  </button>
                ))}
              </div>
            </div>

            <div className="tool-panel">
              {activeAction === "Breathing" ? (
                <div className="sleephelp-breathing-layout">
                  <div className="sleephelp-breath-circle">
                    <div>
                      <span>1-minute breathing</span>
                      <strong>{breathPhase}</strong>
                    </div>
                  </div>
                  <p className="tool-empty-text">{formatTime(timerLeft)}</p>
                </div>
              ) : null}

              {activeAction === "Journal" ? (
                <label className="cbt-field">
                  <span>What's bothering you right now?</span>
                  <textarea
                    value={journalText}
                    onChange={(event) => setJournalText(event.target.value)}
                    className="tool-textarea"
                  />
                  <strong>{formatTime(timerLeft)}</strong>
                </label>
              ) : null}

              {activeAction === "Walk timer" ? (
                <div className="sleephelp-story-card">
                  <h2>Walk timer</h2>
                  <p>Take five minutes away from the pressure if you can.</p>
                  <strong>{formatTime(timerLeft)}</strong>
                </div>
              ) : null}

              {activeAction === "Eye relax" ? (
                <div className="sleephelp-story-card">
                  <h2>Eye relax</h2>
                  <p>Look away from screen and focus on a distant object for 20 seconds.</p>
                  <strong>{formatTime(timerLeft)}</strong>
                </div>
              ) : null}

              {!activeAction ? <p className="tool-empty-text">Pick a quick reset to begin.</p> : null}
              {completeMessage ? <div className="tool-inline-status success">{completeMessage}</div> : null}
            </div>
          </div>
        </section>
      </div>
    </PageWrapper>
  );
}

export default FiveMinuteReset;
