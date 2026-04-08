import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import "../App.css";

const sounds = [
  { key: "rain", label: "Rain" },
  { key: "ocean", label: "Ocean" },
  { key: "piano", label: "Soft Piano" },
  { key: "whiteNoise", label: "White Noise" },
];

function createNoiseSource(context) {
  const bufferSize = context.sampleRate * 2;
  const noiseBuffer = context.createBuffer(1, bufferSize, context.sampleRate);
  const output = noiseBuffer.getChannelData(0);

  for (let index = 0; index < bufferSize; index += 1) {
    output[index] = Math.random() * 2 - 1;
  }

  const source = context.createBufferSource();
  source.buffer = noiseBuffer;
  source.loop = true;
  return source;
}

function createRainGraph(context, destination) {
  const source = createNoiseSource(context);
  const filter = context.createBiquadFilter();
  const gain = context.createGain();

  filter.type = "bandpass";
  filter.frequency.value = 900;
  filter.Q.value = 0.45;
  gain.gain.value = 0.0001;

  source.connect(filter);
  filter.connect(gain);
  gain.connect(destination);
  source.start();

  return { nodes: [source], gainNode: gain };
}

function createOceanGraph(context, destination) {
  const source = createNoiseSource(context);
  const lowpass = context.createBiquadFilter();
  const lfo = context.createOscillator();
  const lfoGain = context.createGain();
  const gain = context.createGain();

  lowpass.type = "lowpass";
  lowpass.frequency.value = 450;
  lfo.type = "sine";
  lfo.frequency.value = 0.08;
  lfoGain.gain.value = 120;
  gain.gain.value = 0.0001;

  lfo.connect(lfoGain);
  lfoGain.connect(lowpass.frequency);
  source.connect(lowpass);
  lowpass.connect(gain);
  gain.connect(destination);
  source.start();
  lfo.start();

  return { nodes: [source, lfo], gainNode: gain };
}

function createPianoGraph(context, destination) {
  const gain = context.createGain();
  gain.gain.value = 0.0001;
  gain.connect(destination);

  const notes = [261.63, 329.63, 392.0, 523.25];
  const timers = [];

  const playNote = () => {
    const oscillator = context.createOscillator();
    const noteGain = context.createGain();
    const note = notes[Math.floor(Math.random() * notes.length)];
    const now = context.currentTime;

    oscillator.type = "triangle";
    oscillator.frequency.value = note;
    noteGain.gain.setValueAtTime(0.0001, now);
    noteGain.gain.linearRampToValueAtTime(0.12, now + 0.08);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);

    oscillator.connect(noteGain);
    noteGain.connect(gain);
    oscillator.start(now);
    oscillator.stop(now + 2.4);

    timers.push(window.setTimeout(playNote, 1600 + Math.random() * 1200));
  };

  playNote();

  return {
    nodes: [],
    gainNode: gain,
    cleanup: () => timers.forEach((timer) => window.clearTimeout(timer)),
  };
}

function createWhiteNoiseGraph(context, destination) {
  const source = createNoiseSource(context);
  const gain = context.createGain();

  gain.gain.value = 0.0001;
  source.connect(gain);
  gain.connect(destination);
  source.start();

  return { nodes: [source], gainNode: gain };
}

function AmbientPlayer() {
  const navigate = useNavigate();
  const audioContextRef = useRef(null);
  const activeSoundRef = useRef(null);
  const stopTimerRef = useRef(null);
  const [currentSound, setCurrentSound] = useState("");
  const [volume, setVolume] = useState(60);
  const [timerMinutes, setTimerMinutes] = useState(15);
  const [status, setStatus] = useState("Nothing playing");

  useEffect(() => {
    return () => {
      if (stopTimerRef.current) {
        window.clearTimeout(stopTimerRef.current);
      }

      const active = activeSoundRef.current;
      active?.cleanup?.();
      active?.nodes?.forEach((node) => node.stop?.());
      audioContextRef.current?.close?.();
    };
  }, []);

  const fadeOutAndStop = () => {
    const active = activeSoundRef.current;
    const context = audioContextRef.current;
    if (!active || !context) return;

    const now = context.currentTime;
    active.gainNode.gain.cancelScheduledValues(now);
    active.gainNode.gain.setValueAtTime(active.gainNode.gain.value, now);
    active.gainNode.gain.linearRampToValueAtTime(0.0001, now + 0.45);

    window.setTimeout(() => {
      active.cleanup?.();
      active.nodes.forEach((node) => node.stop?.());
    }, 520);

    activeSoundRef.current = null;
  };

  const getContext = async () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new window.AudioContext();
    }

    if (audioContextRef.current.state === "suspended") {
      await audioContextRef.current.resume();
    }

    return audioContextRef.current;
  };

  const buildSound = (key, context) => {
    if (key === "rain") return createRainGraph(context, context.destination);
    if (key === "ocean") return createOceanGraph(context, context.destination);
    if (key === "piano") return createPianoGraph(context, context.destination);
    return createWhiteNoiseGraph(context, context.destination);
  };

  const scheduleStop = (minutes) => {
    if (stopTimerRef.current) {
      window.clearTimeout(stopTimerRef.current);
    }

    stopTimerRef.current = window.setTimeout(() => {
      fadeOutAndStop();
      setCurrentSound("");
      setStatus("Timer finished. Audio stopped.");
    }, minutes * 60 * 1000);
  };

  const handleToggle = async (key, label) => {
    if (currentSound === key) {
      fadeOutAndStop();
      setCurrentSound("");
      setStatus(`${label} paused`);
      return;
    }

    const context = await getContext();
    fadeOutAndStop();

    const soundGraph = buildSound(key, context);
    const now = context.currentTime;
    const targetGain = Math.max(volume / 100, 0.02) * 0.28;

    soundGraph.gainNode.gain.cancelScheduledValues(now);
    soundGraph.gainNode.gain.setValueAtTime(0.0001, now);
    soundGraph.gainNode.gain.linearRampToValueAtTime(targetGain, now + 0.55);
    activeSoundRef.current = soundGraph;

    setCurrentSound(key);
    setStatus(`Playing ${label}...`);
    scheduleStop(timerMinutes);
  };

  useEffect(() => {
    const active = activeSoundRef.current;
    const context = audioContextRef.current;
    if (!active || !context) return;

    const now = context.currentTime;
    const targetGain = Math.max(volume / 100, 0.02) * 0.28;
    active.gainNode.gain.cancelScheduledValues(now);
    active.gainNode.gain.linearRampToValueAtTime(targetGain, now + 0.2);
  }, [volume]);

  useEffect(() => {
    if (currentSound) {
      scheduleStop(timerMinutes);
    }
  }, [timerMinutes, currentSound]);

  return (
    <PageWrapper>
      <div className="ambient-page">
        <section className="tool-shell">
          <div className="tool-topbar">
            <button type="button" className="tool-back-btn" onClick={() => navigate("/")}>
              Back to Home
            </button>
            <div className="tool-status-pill">Ambient Player</div>
          </div>

          <div className="tool-hero">
            <span className="tool-eyebrow">Calm Audio</span>
            <h1>Calm Music & Sounds</h1>
            <p>
              Pick one sound, let it loop gently, and use the timer to stop it
              automatically when you want quiet again.
            </p>
          </div>

          <div className="ambient-layout">
            <div className="tool-panel ambient-main-panel">
              <div className="ambient-sound-grid">
                {sounds.map((sound) => (
                  <button
                    key={sound.key}
                    type="button"
                    className={`ambient-sound-card ${currentSound === sound.key ? "active" : ""}`}
                    onClick={() => handleToggle(sound.key, sound.label)}
                  >
                    <strong>{sound.label}</strong>
                    <span>{currentSound === sound.key ? "Pause" : "Play"}</span>
                  </button>
                ))}
              </div>

              <div className="ambient-controls">
                <div className="ambient-control-card">
                  <span>Timer</span>
                  <div className="ambient-pill-row">
                    {[5, 15, 30].map((minutes) => (
                      <button
                        key={minutes}
                        type="button"
                        className={`ambient-pill ${timerMinutes === minutes ? "active" : ""}`}
                        onClick={() => setTimerMinutes(minutes)}
                      >
                        {minutes} mins
                      </button>
                    ))}
                  </div>
                </div>

                <label className="ambient-control-card ambient-volume-card">
                  <span>Volume</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(event) => setVolume(Number(event.target.value))}
                  />
                  <strong>{volume}%</strong>
                </label>
              </div>
            </div>

            <div className="tool-panel ambient-status-panel">
              <div className="ambient-now-playing">
                <span>Now playing</span>
                <h2>{currentSound ? sounds.find((sound) => sound.key === currentSound)?.label : "Nothing yet"}</h2>
                <p>{status}</p>
              </div>

              <div className="ambient-wave-card" aria-hidden="true">
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>

              <div className="ambient-note-card">
                <p>Only one sound plays at a time, with smooth fade transitions between choices.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageWrapper>
  );
}

export default AmbientPlayer;
