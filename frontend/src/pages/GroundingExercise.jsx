import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import "../App.css";

const groundingPrompts = [
  {
    key: "see",
    title: "5 Things You See",
    hint: "Look slowly around you and notice visible details, colors, or shapes.",
    count: 5,
    placeholder: "Type something you can see",
  },
  {
    key: "touch",
    title: "4 Things You Touch",
    hint: "Notice textures, temperature, weight, or pressure around your body.",
    count: 4,
    placeholder: "Type something you can touch",
  },
  {
    key: "hear",
    title: "3 Things You Hear",
    hint: "Listen for near sounds, far sounds, or even tiny background noise.",
    count: 3,
    placeholder: "Type something you can hear",
  },
  {
    key: "smell",
    title: "2 Things You Smell",
    hint: "If smell is hard right now, name two scents you remember around you.",
    count: 2,
    placeholder: "Type something you can smell",
  },
  {
    key: "feel",
    title: "1 Thing You Feel",
    hint: "This can be a body sensation, emotion, or the chair beneath you.",
    count: 1,
    placeholder: "Type one thing you feel",
  },
];

const quickGroundingOptions = [
  "Name 5 colors around you",
  "Touch something cold",
  "Describe your room in detail",
  "Count backwards from 100",
];

function GroundingExercise() {
  const navigate = useNavigate();
  const [stepIndex, setStepIndex] = useState(0);
  const [currentInput, setCurrentInput] = useState("");
  const [responses, setResponses] = useState(
    groundingPrompts.reduce((acc, prompt) => {
      acc[prompt.key] = [];
      return acc;
    }, {})
  );

  const currentPrompt = groundingPrompts[stepIndex];
  const currentResponses = responses[currentPrompt.key];
  const completedCount = useMemo(
    () => groundingPrompts.filter((prompt) => responses[prompt.key].length >= prompt.count).length,
    [responses]
  );

  const addResponse = () => {
    const trimmed = currentInput.trim();
    if (!trimmed || currentResponses.length >= currentPrompt.count) return;

    setResponses((prev) => ({
      ...prev,
      [currentPrompt.key]: [...prev[currentPrompt.key], trimmed],
    }));
    setCurrentInput("");
  };

  const nextStep = () => {
    if (stepIndex < groundingPrompts.length - 1) {
      setStepIndex((value) => value + 1);
      setCurrentInput("");
    }
  };

  const prevStep = () => {
    if (stepIndex > 0) {
      setStepIndex((value) => value - 1);
      setCurrentInput("");
    }
  };

  const resetExercise = () => {
    setResponses(
      groundingPrompts.reduce((acc, prompt) => {
        acc[prompt.key] = [];
        return acc;
      }, {})
    );
    setCurrentInput("");
    setStepIndex(0);
  };

  return (
    <PageWrapper>
      <div className="grounding-page">
        <section className="grounding-shell">
          <div className="grounding-topbar">
            <button
              type="button"
              className="grounding-back-btn"
              onClick={() => navigate("/")}
            >
              Back to Home
            </button>
            <div className="grounding-status-pill">
              {completedCount}/{groundingPrompts.length} stages completed
            </div>
          </div>

          <div className="grounding-copy">
            <span className="grounding-eyebrow">Grounding Support</span>
            <h1>Grounding Exercises</h1>
            <p>
              Move your attention out of racing thoughts and back into the
              present moment with this guided 5-4-3-2-1 reset.
            </p>
          </div>

          <div className="grounding-layout">
            <div className="grounding-main-card">
              <div className="grounding-progress-row">
                {groundingPrompts.map((prompt, index) => (
                  <button
                    key={prompt.key}
                    type="button"
                    className={`grounding-step-pill ${index === stepIndex ? "active" : ""} ${
                      responses[prompt.key].length >= prompt.count ? "done" : ""
                    }`}
                    onClick={() => {
                      setStepIndex(index);
                      setCurrentInput("");
                    }}
                  >
                    {prompt.count}
                  </button>
                ))}
              </div>

              <div className="grounding-focus-card">
                <span className="grounding-step-label">Current step</span>
                <h2>{currentPrompt.title}</h2>
                <p>{currentPrompt.hint}</p>

                <div className="grounding-entry-row">
                  <input
                    type="text"
                    value={currentInput}
                    onChange={(event) => setCurrentInput(event.target.value)}
                    placeholder={currentPrompt.placeholder}
                    className="grounding-input"
                  />
                  <button type="button" className="grounding-add-btn" onClick={addResponse}>
                    Add
                  </button>
                </div>

                <div className="grounding-response-list">
                  {Array.from({ length: currentPrompt.count }).map((_, index) => (
                    <div key={index} className="grounding-response-item">
                      <span>{index + 1}</span>
                      <p>{currentResponses[index] || "Notice one thing and add it here"}</p>
                    </div>
                  ))}
                </div>

                <div className="grounding-action-row">
                  <button
                    type="button"
                    className="grounding-secondary-btn"
                    onClick={prevStep}
                    disabled={stepIndex === 0}
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    className="grounding-main-btn"
                    onClick={nextStep}
                    disabled={stepIndex === groundingPrompts.length - 1}
                  >
                    Next Step
                  </button>
                </div>
              </div>
            </div>

            <div className="grounding-side-panel">
              <div className="grounding-side-card">
                <h3>Quick grounding ideas</h3>
                <div className="grounding-chip-list">
                  {quickGroundingOptions.map((item) => (
                    <span key={item} className="grounding-chip">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grounding-side-card">
                <h3>Gentle reminder</h3>
                <p>
                  You do not need perfect answers. The goal is simply to notice
                  what is real and present around you right now.
                </p>
                <button type="button" className="grounding-reset-btn" onClick={resetExercise}>
                  Reset Exercise
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageWrapper>
  );
}

export default GroundingExercise;
