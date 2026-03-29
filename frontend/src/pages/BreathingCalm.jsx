import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import "../App.css";

const breathingModes = {
  box: {
    label: "Box Breathing",
    subtitle: "Balanced focus with equal inhale, hold, exhale, and hold.",
    steps: [
      { label: "Breathe in", seconds: 4, scale: 1.2 },
      { label: "Hold", seconds: 4, scale: 1.2 },
      { label: "Breathe out", seconds: 4, scale: 0.86 },
      { label: "Hold", seconds: 4, scale: 0.86 },
    ],
  },
  calm478: {
    label: "4-7-8 Breathing",
    subtitle: "Slower release for settling a busy nervous system.",
    steps: [
      { label: "Breathe in", seconds: 4, scale: 1.14 },
      { label: "Hold", seconds: 7, scale: 1.14 },
      { label: "Breathe out", seconds: 8, scale: 0.84 },
    ],
  },
  belly: {
    label: "Deep Belly Breathing",
    subtitle: "Gentle body-based breathing for a grounded reset.",
    steps: [
      { label: "Breathe in", seconds: 5, scale: 1.18 },
      { label: "Breathe out", seconds: 6, scale: 0.86 },
    ],
  },
  panic: {
    label: "Panic Breathing Mode",
    subtitle: "Shorter guided rhythm for faster support during intense moments.",
    steps: [
      { label: "In", seconds: 3, scale: 1.1 },
      { label: "Out", seconds: 4, scale: 0.84 },
    ],
  },
};

function BreathingCalm() {
  const navigate = useNavigate();
  const [modeKey, setModeKey] = useState("box");
  const [isRunning, setIsRunning] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(
    breathingModes.box.steps[0].seconds
  );
  const [cycleCount, setCycleCount] = useState(0);

  const activeMode = useMemo(() => breathingModes[modeKey], [modeKey]);
  const activeStep = activeMode.steps[stepIndex];

  useEffect(() => {
    setStepIndex(0);
    setSecondsLeft(activeMode.steps[0].seconds);
    setCycleCount(0);
    setIsRunning(false);
  }, [activeMode]);

  useEffect(() => {
    if (!isRunning) return undefined;

    const timer = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current > 1) return current - 1;

        const nextIndex = (stepIndex + 1) % activeMode.steps.length;

        if (nextIndex === 0) {
          setCycleCount((count) => count + 1);
        }

        setStepIndex(nextIndex);
        return activeMode.steps[nextIndex].seconds;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isRunning, stepIndex, activeMode]);

  return (
    <PageWrapper>
      <div className="breathing-page">
        <section className="breathing-shell">
          <div className="breathing-topbar">
            <button
              type="button"
              className="breathing-back-btn"
              onClick={() => navigate("/")}
            >
              Back to Home
            </button>
            <div className="breathing-status-pill">
              {isRunning ? "Session Active" : "Ready to Begin"}
            </div>
          </div>

          <div className="breathing-copy">
            <span className="breathing-eyebrow">Interactive Calm</span>
            <h1>2-Minute Breathing Calm</h1>
            <p>
              Follow the circle, breathe with the rhythm, and let the guidance
              slow the moment down one step at a time.
            </p>
          </div>

          <div className="breathing-mode-grid">
            {Object.entries(breathingModes).map(([key, mode]) => (
              <button
                key={key}
                type="button"
                className={`breathing-mode-card ${modeKey === key ? "active" : ""}`}
                onClick={() => setModeKey(key)}
              >
                <strong>{mode.label}</strong>
                <span>{mode.subtitle}</span>
              </button>
            ))}
          </div>

          <div className="breathing-practice-card">
            <div className="breathing-visual-panel">
              <div
                className={`breathing-orb ${isRunning ? "running" : ""}`}
                style={{
                  transform: `scale(${isRunning ? activeStep.scale : 1})`,
                }}
              >
                <div className="breathing-orb-core">
                  <span>{activeStep.label}</span>
                  <strong>{secondsLeft}s</strong>
                </div>
              </div>
            </div>

            <div className="breathing-guide-panel">
              <h2>{activeMode.label}</h2>
              <p>{activeMode.subtitle}</p>

              <div className="breathing-guidance-box">
                <span>Guide</span>
                <h3>
                  {activeStep.label}
                  {activeStep.label.toLowerCase().includes("hold") ? "..." : "..."}
                </h3>
                <p>Stay with the rhythm and keep your shoulders soft.</p>
              </div>

              <div className="breathing-stats-row">
                <div className="breathing-stat">
                  <span>Current phase</span>
                  <strong>{stepIndex + 1}</strong>
                </div>
                <div className="breathing-stat">
                  <span>Cycles done</span>
                  <strong>{cycleCount}</strong>
                </div>
              </div>

              <div className="breathing-action-row">
                <button
                  type="button"
                  className="breathing-main-btn"
                  onClick={() => setIsRunning((value) => !value)}
                >
                  {isRunning ? "Pause Session" : "Start Session"}
                </button>
                <button
                  type="button"
                  className="breathing-reset-btn"
                  onClick={() => {
                    setIsRunning(false);
                    setStepIndex(0);
                    setSecondsLeft(activeMode.steps[0].seconds);
                    setCycleCount(0);
                  }}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          <div className="breathing-tips-grid">
            <article className="breathing-tip-card">
              <h3>How it works</h3>
              <p>When the circle expands, breathe in. When it shrinks, breathe out.</p>
            </article>
            <article className="breathing-tip-card">
              <h3>When to use it</h3>
              <p>Helpful before sleep, after stress, during anxiety, or before meetings.</p>
            </article>
            <article className="breathing-tip-card">
              <h3>Gentle reminder</h3>
              <p>There is no perfect breath here. Slow and steady is enough.</p>
            </article>
          </div>
        </section>
      </div>
    </PageWrapper>
  );
}

export default BreathingCalm;
