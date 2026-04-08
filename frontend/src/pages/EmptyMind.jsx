import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import "../App.css";

const STORAGE_KEYS = {
  draft: "emptyMindDraft",
  entries: "emptyMindEntries",
  plan: "emptyMindPlanItems",
  journal: "emptyMindJournalEntries",
};

const parseStoredArray = (key) => {
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : [];
  } catch {
    return [];
  }
};

const extractActionableSentences = (text) =>
  text
    .split(/(?<=[.!?])\s+|\n+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence && /(^|\s)(i need to|i should)\b/i.test(sentence));

function EmptyMind() {
  const navigate = useNavigate();
  const textAreaRef = useRef(null);
  const [text, setText] = useState("");
  const [entries, setEntries] = useState([]);
  const [planItems, setPlanItems] = useState([]);
  const [journalEntries, setJournalEntries] = useState([]);
  const [status, setStatus] = useState("");
  const [statusTone, setStatusTone] = useState("soft");
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setText(window.localStorage.getItem(STORAGE_KEYS.draft) || "");
    setEntries(parseStoredArray(STORAGE_KEYS.entries));
    setPlanItems(parseStoredArray(STORAGE_KEYS.plan));
    setJournalEntries(parseStoredArray(STORAGE_KEYS.journal));
  }, []);

  useEffect(() => {
    textAreaRef.current?.focus();
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.entries, JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.plan, JSON.stringify(planItems));
  }, [planItems]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.journal, JSON.stringify(journalEntries));
  }, [journalEntries]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.draft, text);
  }, [text]);

  useEffect(() => {
    if (!text.trim()) return undefined;

    const timer = window.setInterval(() => {
      window.localStorage.setItem(STORAGE_KEYS.draft, text);
      setStatus("Draft auto-saved");
      setStatusTone("soft");
    }, 5000);

    return () => window.clearInterval(timer);
  }, [text]);

  useEffect(() => {
    if (!status) return undefined;

    const timer = window.setTimeout(() => setStatus(""), 2200);
    return () => window.clearTimeout(timer);
  }, [status]);

  const latestEntry = useMemo(() => entries[0], [entries]);

  const runTransition = (action) => {
    setIsTransitioning(true);
    window.setTimeout(() => {
      action();
      setIsTransitioning(false);
    }, 180);
  };

  const handleSave = () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const entry = {
      id: Date.now(),
      text: trimmed,
      timestamp: new Date().toISOString(),
    };

    runTransition(() => {
      setEntries((current) => [entry, ...current]);
      setStatus("Saved to brain dump history");
      setStatusTone("success");
    });
  };

  const handleDelete = () => {
    if (!text.trim()) return;
    if (!window.confirm("Clear what you wrote here?")) return;

    runTransition(() => {
      setText("");
      setStatus("Draft cleared");
      setStatusTone("danger");
    });
  };

  const handleToPlan = () => {
    const actionable = extractActionableSentences(text);
    if (!actionable.length) {
      setStatus("No clear action lines found yet");
      setStatusTone("soft");
      return;
    }

    const items = actionable.map((item, index) => ({
      id: Date.now() + index,
      text: item,
      timestamp: new Date().toISOString(),
    }));

    setPlanItems((current) => [...items, ...current]);
    setStatus(`Moved ${items.length} item${items.length > 1 ? "s" : ""} to plan`);
    setStatusTone("success");
  };

  const handleToJournal = () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const entry = {
      id: Date.now(),
      text: trimmed,
      timestamp: new Date().toISOString(),
    };

    setJournalEntries((current) => [entry, ...current]);
    setStatus("Copied to journal");
    setStatusTone("success");
  };

  return (
    <PageWrapper>
      <div className="emptymind-page">
        <section className="tool-shell">
          <div className="tool-topbar">
            <button type="button" className="tool-back-btn" onClick={() => navigate("/")}>
              Back to Home
            </button>
            <div className="tool-status-pill">Brain Dump Tool</div>
          </div>

          <div className="tool-hero">
            <span className="tool-eyebrow">Write and Release</span>
            <h1>Empty Your Mind</h1>
            <p>
              Put the mental noise somewhere safe, then decide whether to keep it,
              clear it, turn it into a plan, or save it as a journal entry.
            </p>
          </div>

          <div className="emptymind-layout">
            <div className="tool-panel emptymind-composer">
              <AnimatePresence mode="wait">
                <motion.div
                  key={isTransitioning ? "transitioning" : "steady"}
                  initial={{ opacity: 0.68, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.22 }}
                >
                  <textarea
                    ref={textAreaRef}
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                    placeholder="What’s been on your mind lately? Don’t filter—just write..."
                    className="emptymind-textarea"
                    autoFocus
                  />
                </motion.div>
              </AnimatePresence>

              <div className="emptymind-meta-row">
                <span>{text.length} characters</span>
                <span>{entries.length} saved entries</span>
              </div>

              <div className="emptymind-action-row">
                <button type="button" className="tool-main-btn" onClick={handleSave}>
                  Save
                </button>
                <button type="button" className="tool-muted-btn" onClick={handleDelete}>
                  Delete
                </button>
                <button type="button" className="tool-secondary-btn" onClick={handleToPlan}>
                  To Plan
                </button>
                <button type="button" className="tool-secondary-btn" onClick={handleToJournal}>
                  To Journal
                </button>
              </div>

              <AnimatePresence>
                {status ? (
                  <motion.div
                    key={status}
                    className={`tool-inline-status ${statusTone}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {status}
                  </motion.div>
                ) : null}
              </AnimatePresence>

              {latestEntry ? (
                <div className="emptymind-latest-card">
                  <span>Latest saved</span>
                  <p>{latestEntry.text}</p>
                  <strong>{new Date(latestEntry.timestamp).toLocaleString()}</strong>
                </div>
              ) : null}
            </div>

            <div className="emptymind-side-grid">
              <article className="tool-panel">
                <div className="tool-panel-head">
                  <h2>Plan</h2>
                  <span>{planItems.length} items</span>
                </div>
                <div className="tool-list">
                  {planItems.length ? (
                    planItems.slice(0, 4).map((item) => (
                      <div key={item.id} className="tool-list-item">
                        <p>{item.text}</p>
                      </div>
                    ))
                  ) : (
                    <p className="tool-empty-text">Actionable lines like "I need to" appear here.</p>
                  )}
                </div>
              </article>

              <article className="tool-panel">
                <div className="tool-panel-head">
                  <h2>Journal</h2>
                  <span>{journalEntries.length} entries</span>
                </div>
                <div className="tool-list">
                  {journalEntries.length ? (
                    journalEntries.slice(0, 4).map((entry) => (
                      <div key={entry.id} className="tool-list-item">
                        <p>{entry.text}</p>
                        <strong>{new Date(entry.timestamp).toLocaleDateString()}</strong>
                      </div>
                    ))
                  ) : (
                    <p className="tool-empty-text">Use "To Journal" to keep meaningful reflections.</p>
                  )}
                </div>
              </article>
            </div>
          </div>
        </section>
      </div>
    </PageWrapper>
  );
}

export default EmptyMind;
