import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import "../App.css";

const sleepOptions = ["Sleep story", "Night breathing", "No-phone routine", "Gratitude"];

function SleepHelp() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Sleep story");
  const [storyPlaying, setStoryPlaying] = useState(false);
  const [breathPhase, setBreathPhase] = useState("Inhale...");
  const [checklist, setChecklist] = useState({
    notifications: false,
    lights: false,
    screens: false,
  });
  const [gratitudeItems, setGratitudeItems] = useState(["", "", ""]);

  useEffect(() => {
    if (activeTab !== "Night breathing") return undefined;

    const sequence = [
      { label: "Inhale...", time: 4000 },
      { label: "Hold...", time: 7000 },
      { label: "Exhale...", time: 8000 },
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
  }, [activeTab]);

  const checklistCount = useMemo(
    () => Object.values(checklist).filter(Boolean).length,
    [checklist]
  );

  return (
    <PageWrapper>
      <div className="sleephelp-page">
        <section className="tool-shell sleephelp-shell">
          <div className="tool-topbar sleephelp-topbar">
            <button type="button" className="tool-back-btn sleephelp-back-btn" onClick={() => navigate("/")}>
              Back to Home
            </button>
            <div className="tool-status-pill sleephelp-pill">Difficult Night Support</div>
          </div>

          <div className="tool-hero sleephelp-hero">
            <span className="tool-eyebrow sleephelp-eyebrow">Night Routine</span>
            <h1>Sleep Help</h1>
            <p>Soft tools for restless nights, bedtime routines, and winding down without pressure.</p>
          </div>

          <div className="sleephelp-tab-row">
            {sleepOptions.map((option) => (
              <button
                key={option}
                type="button"
                className={`sleephelp-tab ${activeTab === option ? "active" : ""}`}
                onClick={() => setActiveTab(option)}
              >
                {option}
              </button>
            ))}
          </div>

          <div className="tool-panel sleephelp-panel">
            {activeTab === "Sleep story" ? (
              <div className="sleephelp-story-panel">
                <div className="sleephelp-story-card">
                  <span>Sleep story</span>
                  <h2>Quiet Rain Cabin</h2>
                  <p>A simple bedtime story setting for a calm transition into sleep.</p>
                  <strong>{storyPlaying ? "Now playing..." : "Ready to play"}</strong>
                </div>
                <button
                  type="button"
                  className="tool-main-btn"
                  onClick={() => setStoryPlaying((current) => !current)}
                >
                  {storyPlaying ? "Pause Story" : "Play Story"}
                </button>
              </div>
            ) : null}

            {activeTab === "Night breathing" ? (
              <div className="sleephelp-breathing-layout">
                <div className={`sleephelp-breath-circle ${breathPhase.toLowerCase().includes("hold") ? "hold" : ""}`}>
                  <div>
                    <span>4-7-8 Breathing</span>
                    <strong>{breathPhase}</strong>
                  </div>
                </div>
                <div className="sleephelp-story-card">
                  <h2>Night breathing</h2>
                  <p>Follow the circle and let your exhale be the longest part.</p>
                </div>
              </div>
            ) : null}

            {activeTab === "No-phone routine" ? (
              <div className="sleephelp-checklist">
                <div className="tool-panel-head">
                  <h2>No-phone routine</h2>
                  <span>{checklistCount}/3 done</span>
                </div>
                {[
                  ["notifications", "Turn off notifications"],
                  ["lights", "Dim lights"],
                  ["screens", "Avoid screens"],
                ].map(([key, label]) => (
                  <label key={key} className="sleephelp-check-item">
                    <input
                      type="checkbox"
                      checked={checklist[key]}
                      onChange={() =>
                        setChecklist((current) => ({ ...current, [key]: !current[key] }))
                      }
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            ) : null}

            {activeTab === "Gratitude" ? (
              <div className="sleephelp-gratitude">
                <h2>Write 1 to 3 things you’re grateful for today</h2>
                <div className="tool-list">
                  {gratitudeItems.map((item, index) => (
                    <input
                      key={index}
                      type="text"
                      value={item}
                      onChange={(event) =>
                        setGratitudeItems((current) => {
                          const next = [...current];
                          next[index] = event.target.value;
                          return next;
                        })
                      }
                      placeholder={`Gratitude ${index + 1}`}
                      className="tool-input sleephelp-input"
                    />
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </PageWrapper>
  );
}

export default SleepHelp;
