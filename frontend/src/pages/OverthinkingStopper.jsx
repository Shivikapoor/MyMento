import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import "../App.css";

const steps = [
  "Thought",
  "Fact or Fear",
  "Evidence",
  "Worst Case",
  "Most Likely",
  "Small Action",
  "Summary",
];

function OverthinkingStopper() {
  const navigate = useNavigate();
  const [stepIndex, setStepIndex] = useState(0);
  const [responses, setResponses] = useState({
    thought: "",
    factOrFear: "Fact",
    supportingEvidence: "",
    againstEvidence: "",
    worstCase: "",
    likelyOutcome: "",
    smallAction: "",
  });

  const nextStep = () => {
    setStepIndex((current) => Math.min(current + 1, steps.length - 1));
  };

  const previousStep = () => {
    setStepIndex((current) => Math.max(current - 1, 0));
  };

  return (
    <PageWrapper>
      <div className="cbt-page">
        <section className="tool-shell">
          <div className="tool-topbar">
            <button type="button" className="tool-back-btn" onClick={() => navigate("/")}>
              Back to Home
            </button>
            <div className="tool-status-pill">CBT Reflection</div>
          </div>

          <div className="tool-hero">
            <span className="tool-eyebrow">Thought Reframe</span>
            <h1>Overthinking Stopper</h1>
            <p>
              Slow the spiral down by checking the story, reviewing the evidence,
              and ending with one small next step.
            </p>
          </div>

          <div className="cbt-step-row">
            {steps.map((step, index) => (
              <div
                key={step}
                className={`cbt-step-pill ${index === stepIndex ? "active" : ""} ${index < stepIndex ? "done" : ""}`}
              >
                {step}
              </div>
            ))}
          </div>

          <div className="tool-panel cbt-main-panel">
            {stepIndex === 0 ? (
              <label className="cbt-field">
                <span>What thought is looping right now?</span>
                <input
                  type="text"
                  value={responses.thought}
                  onChange={(event) =>
                    setResponses((current) => ({ ...current, thought: event.target.value }))
                  }
                  placeholder="Write the thought exactly as it sounds in your head."
                  className="tool-input"
                />
              </label>
            ) : null}

            {stepIndex === 1 ? (
              <div className="cbt-toggle-panel">
                <span>Fact or Fear?</span>
                <div className="cbt-toggle-row">
                  {["Fact", "Fear"].map((option) => (
                    <button
                      key={option}
                      type="button"
                      className={`cbt-toggle-btn ${responses.factOrFear === option ? "active" : ""}`}
                      onClick={() =>
                        setResponses((current) => ({ ...current, factOrFear: option }))
                      }
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {stepIndex === 2 ? (
              <div className="cbt-evidence-grid">
                <label className="cbt-field">
                  <span>Supporting evidence</span>
                  <textarea
                    value={responses.supportingEvidence}
                    onChange={(event) =>
                      setResponses((current) => ({
                        ...current,
                        supportingEvidence: event.target.value,
                      }))
                    }
                    className="tool-textarea"
                  />
                </label>
                <label className="cbt-field">
                  <span>Against evidence</span>
                  <textarea
                    value={responses.againstEvidence}
                    onChange={(event) =>
                      setResponses((current) => ({
                        ...current,
                        againstEvidence: event.target.value,
                      }))
                    }
                    className="tool-textarea"
                  />
                </label>
              </div>
            ) : null}

            {stepIndex === 3 ? (
              <label className="cbt-field">
                <span>What is the worst-case outcome?</span>
                <textarea
                  value={responses.worstCase}
                  onChange={(event) =>
                    setResponses((current) => ({ ...current, worstCase: event.target.value }))
                  }
                  className="tool-textarea"
                />
              </label>
            ) : null}

            {stepIndex === 4 ? (
              <label className="cbt-field">
                <span>What is the most likely outcome?</span>
                <textarea
                  value={responses.likelyOutcome}
                  onChange={(event) =>
                    setResponses((current) => ({ ...current, likelyOutcome: event.target.value }))
                  }
                  className="tool-textarea"
                />
              </label>
            ) : null}

            {stepIndex === 5 ? (
              <label className="cbt-field">
                <span>What’s one small action you can take right now?</span>
                <input
                  type="text"
                  value={responses.smallAction}
                  onChange={(event) =>
                    setResponses((current) => ({ ...current, smallAction: event.target.value }))
                  }
                  className="tool-input"
                />
              </label>
            ) : null}

            {stepIndex === 6 ? (
              <div className="cbt-summary-card">
                <h2>Reflection Summary</h2>
                <div className="tool-list">
                  <div className="tool-list-item">
                    <strong>Thought</strong>
                    <p>{responses.thought || "Not added yet"}</p>
                  </div>
                  <div className="tool-list-item">
                    <strong>Fact or Fear</strong>
                    <p>{responses.factOrFear}</p>
                  </div>
                  <div className="tool-list-item">
                    <strong>Evidence</strong>
                    <p>{responses.supportingEvidence || "No supporting evidence noted."}</p>
                    <p>{responses.againstEvidence || "No counter evidence noted."}</p>
                  </div>
                  <div className="tool-list-item">
                    <strong>Worst case</strong>
                    <p>{responses.worstCase || "Not filled in"}</p>
                  </div>
                  <div className="tool-list-item">
                    <strong>Most likely outcome</strong>
                    <p>{responses.likelyOutcome || "Not filled in"}</p>
                  </div>
                  <div className="tool-list-item">
                    <strong>Small action</strong>
                    <p>{responses.smallAction || "Not filled in"}</p>
                  </div>
                </div>
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
              <button
                type="button"
                className="tool-main-btn"
                onClick={nextStep}
                disabled={stepIndex === steps.length - 1}
              >
                Next
              </button>
            </div>
          </div>
        </section>
      </div>
    </PageWrapper>
  );
}

export default OverthinkingStopper;
