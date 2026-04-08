import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import "../App.css";

const steps = ["Breathing", "Write it out", "Reframe", "Plan tomorrow"];

function ResetAfterWork() {
  const navigate = useNavigate();
  const [stepIndex, setStepIndex] = useState(0);
  const [breathPhase, setBreathPhase] = useState("Inhale...");
  const [responses, setResponses] = useState({
    heavy: "",
    handledWell: "",
    learned: "",
    priorities: ["", "", ""],
  });

  useEffect(() => {
    if (stepIndex !== 0) return undefined;

    const sequence = [
      { label: "Inhale...", time: 4000 },
      { label: "Hold...", time: 2000 },
      { label: "Exhale...", time: 6000 },
    ];

    const timeouts = [];

    const loopPhase = (index) => {
      setBreathPhase(sequence[index].label);
      const timeout = window.setTimeout(
        () => loopPhase((index + 1) % sequence.length),
        sequence[index].time
      );
      timeouts.push(timeout);
    };

    loopPhase(0);

    return () => {
      timeouts.forEach((timeout) => window.clearTimeout(timeout));
    };
  }, [stepIndex]);

  const completionReady =
    stepIndex === steps.length &&
    (responses.priorities.filter((item) => item.trim()).length > 0 ||
      responses.heavy.trim() ||
      responses.handledWell.trim() ||
      responses.learned.trim());

  const updatePriority = (index, value) => {
    setResponses((current) => {
      const nextPriorities = [...current.priorities];
      nextPriorities[index] = value;
      return { ...current, priorities: nextPriorities };
    });
  };

  const nextStep = () => {
    setStepIndex((current) => Math.min(current + 1, steps.length));
  };

  const previousStep = () => {
    setStepIndex((current) => Math.max(current - 1, 0));
  };

  return (
    <PageWrapper>
      <div className="reset-page">
        <section className="tool-shell">
          <div className="tool-topbar">
            <button type="button" className="tool-back-btn" onClick={() => navigate("/")}>
              Back to Home
            </button>
            <div className="tool-status-pill">Step Reset Flow</div>
          </div>

          <div className="tool-hero">
            <span className="tool-eyebrow">After Work Reset</span>
            <h1>Guided Reset After Work</h1>
            <p>
              Move through breath, reflection, and tomorrow planning so the day
              can end with a little more clarity.
            </p>
          </div>

          <div className="reset-step-row">
            {steps.map((step, index) => (
              <div
                key={step}
                className={`reset-step-pill ${index === stepIndex ? "active" : ""} ${index < stepIndex ? "done" : ""}`}
              >
                {step}
              </div>
            ))}
          </div>

          <div className="tool-panel reset-main-panel">
            {stepIndex === 0 ? (
              <div className="reset-stage-grid">
                <div className="reset-breath-visual">
                  <div className={`reset-breath-circle ${breathPhase.toLowerCase().includes("hold") ? "hold" : ""}`}>
                    <div>
                      <span>Breathing</span>
                      <strong>{breathPhase}</strong>
                    </div>
                  </div>
                </div>
                <div className="reset-copy-card">
                  <h2>Step 1: Breathing</h2>
                  <p>Follow the circle through a 4 second inhale, 2 second hold, and 6 second exhale.</p>
                </div>
              </div>
            ) : null}

            {stepIndex === 1 ? (
              <div className="reset-form-card">
                <h2>Step 2: Write it out</h2>
                <label>
                  <span>What made today heavy?</span>
                  <textarea
                    value={responses.heavy}
                    onChange={(event) =>
                      setResponses((current) => ({ ...current, heavy: event.target.value }))
                    }
                    placeholder="Name the moments, tension, or weight you are carrying."
                    className="tool-textarea"
                  />
                </label>
              </div>
            ) : null}

            {stepIndex === 2 ? (
              <div className="reset-form-card">
                <h2>Step 3: Reframe</h2>
                <label>
                  <span>What did you handle well today?</span>
                  <textarea
                    value={responses.handledWell}
                    onChange={(event) =>
                      setResponses((current) => ({ ...current, handledWell: event.target.value }))
                    }
                    placeholder="Notice what you did with care, effort, or courage."
                    className="tool-textarea"
                  />
                </label>
                <label>
                  <span>What did you learn today?</span>
                  <textarea
                    value={responses.learned}
                    onChange={(event) =>
                      setResponses((current) => ({ ...current, learned: event.target.value }))
                    }
                    placeholder="Capture one useful lesson from the day."
                    className="tool-textarea"
                  />
                </label>
              </div>
            ) : null}

            {stepIndex === 3 ? (
              <div className="reset-form-card">
                <h2>Step 4: Plan tomorrow</h2>
                <p>List one to three priorities so tomorrow starts lighter.</p>
                <div className="reset-priority-grid">
                  {responses.priorities.map((priority, index) => (
                    <input
                      key={index}
                      type="text"
                      value={priority}
                      onChange={(event) => updatePriority(index, event.target.value)}
                      placeholder={`Priority ${index + 1}`}
                      className="tool-input"
                    />
                  ))}
                </div>
              </div>
            ) : null}

            {stepIndex === steps.length ? (
              <div className="reset-complete-card">
                <span>Complete</span>
                <h2>You’ve reset for today. Good job.</h2>
                <p>
                  {completionReady
                    ? "Your reflections and priorities are still on the page if you want one last look."
                    : "You can step back through the flow if you want to fill anything in."}
                </p>
              </div>
            ) : null}

            <div className="tool-nav-row">
              <button
                type="button"
                className="tool-muted-btn"
                onClick={previousStep}
                disabled={stepIndex === 0}
              >
                Back
              </button>
              <button type="button" className="tool-main-btn" onClick={nextStep}>
                {stepIndex === steps.length - 1 ? "Finish" : stepIndex === steps.length ? "Done" : "Next"}
              </button>
            </div>
          </div>
        </section>
      </div>
    </PageWrapper>
  );
}

export default ResetAfterWork;
