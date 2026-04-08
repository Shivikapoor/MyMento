import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getToken, getUser, logout } from "../utils/auth";
import PageWrapper from "../components/PageWrapper";
import LazySection from "../components/LazySection";
import Slider from "../components/Slider";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import ClientDashboardHub from "../components/ClientDashboardHub";
import ThemeToggle from "../components/ThemeToggle";
import "../App.css";

const publicBarHeights = [74, 63, 56, 34, 46, 28];
const publicBarLabels = ["Work", "Joy", "Sleep", "Hope", "Stress", "Ease"];
const publicLineOnePoints = "18,108 72,52 126,72 180,40 234,84 288,58 342,72";
const publicLineTwoPoints = "18,72 72,92 126,44 180,82 234,50 288,88 342,62";
const publicLineDots = [
  { x: 18, y: 108 },
  { x: 72, y: 52 },
  { x: 126, y: 72 },
  { x: 180, y: 40 },
  { x: 234, y: 84 },
  { x: 288, y: 58 },
  { x: 342, y: 72 },
];

const wellnessFeatureCards = [
  {
    title: "2-Minute Breathing Calm",
    description:
      "Quick breathing support for stress spikes, panic moments, and emotional overload.",
    highlight: "Most-used calming tool",
    items: ["Box 4-4-4-4", "4-7-8", "Deep belly", "Panic mode"],
    tone: "calm-aqua",
  },
  {
    title: "Grounding Exercises",
    description:
      "Gentle prompts that bring attention back to the room when the mind is racing.",
    highlight: "Best for anxiety loops",
    items: ["5-4-3-2-1", "Name 5 colors", "Touch something cold", "Count backward"],
    tone: "calm-sky",
  },
  {
    title: "Empty Your Mind",
    description:
      "A safe brain-dump space to write everything out, save it, delete it, or turn it into a plan.",
    highlight: "Write and release",
    items: ["Save", "Delete", "To plan", "To journal"],
    tone: "calm-mint",
  },
  {
    title: "Calm Music & Sounds",
    description:
      "Background audio you can play while working, resting, journaling, or trying to sleep.",
    highlight: "Ambient support",
    items: ["Rain", "Ocean", "Soft piano", "White noise"],
    tone: "calm-lilac",
  },
  {
    title: "Guided Reset After Work",
    description:
      "A short routine for those heavy workdays when you need to decompress before carrying it home.",
    highlight: "Bad work day help",
    items: ["1 min breathe", "Write it out", "Reframe", "Plan tomorrow"],
    tone: "calm-peach",
  },
  {
    title: "Overthinking Stopper",
    description:
      "A CBT-inspired reflection tool that helps separate facts, assumptions, and next actions.",
    highlight: "Thought reframing",
    items: ["Fact or fear?", "Evidence", "Worst case", "Most likely"],
    tone: "calm-blue",
  },
  {
    title: "Mood Booster",
    description:
      "Small uplifting actions for low-energy days when simple encouragement matters most.",
    highlight: "Lift your state",
    items: ["Walk 10 min", "Drink water", "Stretch", "Call a friend"],
    tone: "calm-gold",
  },
  {
    title: "Sleep Help",
    description:
      "Night-time tools for restless minds, bedtime routines, and winding down without pressure.",
    highlight: "For difficult nights",
    items: ["Sleep story", "Night breathing", "No-phone routine", "Gratitude"],
    tone: "calm-indigo",
  },
  {
    title: "I Have 5 Minutes",
    description:
      "Fast reset activities for busy days when you only have a few minutes to feel better.",
    highlight: "5-minute reset",
    items: ["Breathing", "Journal", "Walk timer", "Eye relax"],
    tone: "calm-rose",
  },
  {
    title: "Daily Mental Reset",
    description:
      "A daily check-in routine that keeps users returning and helps them notice patterns over time.",
    highlight: "Daily return feature",
    items: ["Stress level", "Sleep hours", "One worry", "One good thing"],
    tone: "calm-emerald",
  },
];

function Home() {
  const navigate = useNavigate();
  const token = getToken();
  const user = getUser();

  const openPlaceholder = (label) => {
    alert(`${label} feature can be connected next.`);
  };

  const wellnessCards = wellnessFeatureCards.map((card) =>
    card.title === "2-Minute Breathing Calm"
      ? { ...card, action: () => navigate("/breathing-calm"), clickable: true }
      : card.title === "Grounding Exercises"
        ? { ...card, action: () => navigate("/grounding-exercise"), clickable: true }
        : card.title === "Empty Your Mind"
          ? { ...card, action: () => navigate("/empty-your-mind"), clickable: true }
          : card.title === "Calm Music & Sounds"
            ? { ...card, action: () => navigate("/calm-music-sounds"), clickable: true }
            : card.title === "Guided Reset After Work"
              ? { ...card, action: () => navigate("/guided-reset-after-work"), clickable: true }
              : card.title === "Overthinking Stopper"
                ? { ...card, action: () => navigate("/overthinking-stopper"), clickable: true }
                : card.title === "Mood Booster"
                  ? { ...card, action: () => navigate("/mood-booster"), clickable: true }
                  : card.title === "Sleep Help"
                    ? { ...card, action: () => navigate("/sleep-help"), clickable: true }
                    : card.title === "I Have 5 Minutes"
                      ? { ...card, action: () => navigate("/five-minute-reset"), clickable: true }
                      : card.title === "Daily Mental Reset"
                        ? { ...card, action: () => navigate("/daily-mental-reset"), clickable: true }
        : card
  );

  const clientQuickActions = [
    { title: "Book a Session", subtitle: "Reserve time with your counsellor", action: () => navigate("/book-session"), tone: "booksession-visual" },
    { title: "My Appointments", subtitle: "Track upcoming and past sessions", action: () => navigate("/my-appointments"), tone: "appointments-visual" },
    { title: "Rate Your Experience", subtitle: "Share how your last session felt", action: () => navigate("/rate-session"), tone: "rateexperience-visual" },
    { title: "About Counsellor", subtitle: "Read profile, background and approach", action: () => navigate("/profile"), tone: "aboutcounsellor-visual" },
  ];

  const counsellorQuickActions = [
    { title: "View Appointments", subtitle: "Check your current bookings", action: () => navigate("/counsellor-dashboard"), tone: "sunrise" },
    { title: "View Ratings", subtitle: "See recent client feedback", action: () => navigate("/ratings"), tone: "sky" },
    { title: "About Counsellor", subtitle: "Update and review your profile", action: () => navigate("/profile"), tone: "mint" },
  ];

  const supportTools = [
    { title: "Burnout Checker", text: "Notice early signs of emotional overload and stress.", cta: "Assess Now", action: () => openPlaceholder("Burnout Checker"), tone: "warm burnout-visual" },
    { title: "Career Guide", text: "Reflect on role fit, goals and work direction.", cta: "Get Advice", action: () => navigate("/career-guide"), tone: "cool career-visual" },
    { title: "Talk Space", text: "Capture what is on your mind without pressure.", cta: "Start Writing", action: () => navigate("/talk-space"), tone: "soft talkspace-visual" },
    { title: "After Work Relax", text: "Take a quick reset with guided decompression.", cta: "Relax Now", action: () => navigate("/guided-reset-after-work"), tone: "fresh afterwork-visual" },
  ];

  const spotlightTools = [
    { title: "2-Minute Stress Relief", action: () => openPlaceholder("2-Minute Stress Relief"), tone: "amber" },
    { title: "Sunday Anxiety Help", action: () => openPlaceholder("Sunday Anxiety Help"), tone: "blue" },
    { title: "Mood Tracker", action: () => navigate("/mood-tracker"), tone: "navy" },
  ];

  if (!token) {
    return (
      <div className="public-landing">
        <NavBar />

        <section className="hero" id="home">
          <div className="hero-mesh-orb hero-mesh-orb-left" aria-hidden="true" />
          <div className="hero-mesh-orb hero-mesh-orb-right" aria-hidden="true" />
          <div className="hero-noise" aria-hidden="true" />

          <div className="hero-text hero-left">
            <span className="hero-kicker">
              Private. Secure. Professional Support.
            </span>
            <h1>
              Your Safe Space
              <br />
              to Heal, Grow,
              <br />
              and Feel Better.
            </h1>
            <p className="desc">
              Talk to certified counselors, track your mood, and improve your
              mental well-being all in one calm, supportive place.
            </p>

            <div className="hero-buttons">
              <button
                className="primary-btn"
                onClick={() => navigate("/LoginSignup")}
              >
                Book a Session
              </button>
              <button
                className="secondary-btn"
                onClick={() => navigate("/LoginSignup")}
              >
                Explore
              </button>
            </div>
            <div className="hero-trust-row" aria-label="platform trust indicators">
              <span className="hero-trust-item">4.8 Rating</span>
              <span className="hero-trust-item">10,000+ Users</span>
              <span className="hero-trust-item">Private &amp; Secure</span>
            </div>

            <p className="trust">4.8 rating • 10,000+ users helped</p>
          </div>

          <div className="hero-img hero-right">
            <div className="hero-glass-card">
              <div className="hero-mini-card hero-mini-top-left">
                <div className="hero-mini-avatar">Dr</div>
                <div className="hero-mini-copy">
                  <strong>Dr. Aryan</strong>
                  <span>Counselor</span>
                </div>
              </div>

              <div className="hero-mini-card hero-mini-top-right">
                <div className="hero-mini-avatar hero-mini-avatar-warm">+</div>
                <div className="hero-mini-copy">
                  <strong>Mood +12%</strong>
                  <span>This week</span>
                </div>
              </div>

              <div className="hero-mini-card hero-mini-bottom-left">
                <div className="hero-check-bubble">✓</div>
                <div className="hero-mini-copy">
                  <strong>Session Done</strong>
                  <span>3:00 PM today</span>
                </div>
              </div>

              <div className="hero-mini-card hero-mini-bottom-right">
                <div className="hero-mini-chart" aria-hidden="true">
                  <span className="bar-1" />
                  <span className="bar-2" />
                  <span className="bar-3" />
                  <span className="bar-4" />
                  <span className="bar-5" />
                </div>
                <div className="hero-mini-copy">
                  <strong>Progress</strong>
                  <span>↑ 28%</span>
                </div>
              </div>

              <div className="hero-glass-inner" />
              <div className="hero-illustration-wrap">
                <img src="/images/Hero_image.png" alt="Illustration of calm mental wellness support" />
              </div>
            </div>
            <div className="float bubble1" />
            <div className="float bubble2" />
            <div className="float float-soft bubble3" />
            <div className="float float-soft bubble4" />
            <div className="float float-ring bubble5" />
            <div className="float float-ring bubble6" />
          </div>
          <div className="hero-wave" aria-hidden="true" />
        </section>

        <LazySection minHeight={560} delay={0.05}>
          <section className="slider-section" id="services">
            <Slider onCtaClick={() => navigate("/LoginSignup")} />
          </section>
        </LazySection>

        <LazySection minHeight={520} delay={0.08}>
          <section className="insights-section">
            <div className="insights-shell">
              <div className="insights-copy">
                <span className="insights-eyebrow">Wellness Insights</span>
                <h2>Track Your Moods & Stress</h2>
                <p>
                  Keep an eye on emotional rhythm and stress shifts with soft,
                  animated visuals that feel calm, supportive, and easy to read.
                </p>
              </div>

              <div className="insights-grid">
                <motion.article
                  className="graph-card"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="graph-card-header">
                    <h3>Life Dashboard</h3>
                    <span>Live balance snapshot</span>
                  </div>

                  <div className="bar-chart">
                    <div className="bar-chart-copy">
                      <p>You are doing better than yesterday.</p>
                      <ul>
                        <li>Work 8 hours</li>
                        <li>Sleep 7 hours</li>
                        <li>Stress moderate</li>
                      </ul>
                    </div>
                    <div className="chart-axis" />
                    <div className="bar-chart-bars">
                      {publicBarHeights.map((height, index) => (
                        <div key={publicBarLabels[index]} className="bar-group">
                          <motion.div
                            className={`chart-bar tone-${index + 1}`}
                            animate={{
                              height: [
                                `${Math.max(height - 12, 18)}%`,
                                `${height}%`,
                                `${Math.max(height - 6, 18)}%`,
                              ],
                              filter: [
                                "hue-rotate(0deg)",
                                "hue-rotate(18deg)",
                                "hue-rotate(-12deg)",
                                "hue-rotate(0deg)",
                              ],
                            }}
                            transition={{
                              duration: 3.8 + index * 0.25,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          />
                          <span>{publicBarLabels[index]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.article>

                <motion.article
                  className="graph-card"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 5.6, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="graph-card-header">
                    <h3>Daily Mood Tracker</h3>
                    <span>Responsive emotional rhythm</span>
                  </div>

                  <div className="line-chart">
                    <div className="line-chart-grid" />
                    <div className="line-chart-caption">Mood patterns for this week</div>
                    <motion.svg
                      viewBox="0 0 360 140"
                      className="line-chart-svg"
                      animate={{
                        filter: [
                          "hue-rotate(0deg)",
                          "hue-rotate(16deg)",
                          "hue-rotate(-10deg)",
                          "hue-rotate(0deg)",
                        ],
                      }}
                      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <motion.polyline
                        points={publicLineOnePoints}
                        className="line-path warm-line"
                        animate={{ opacity: [0.82, 1, 0.88] }}
                        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                      />
                      <motion.polyline
                        points={publicLineTwoPoints}
                        className="line-path cool-line"
                        animate={{ opacity: [0.8, 1, 0.86] }}
                        transition={{ duration: 4.9, repeat: Infinity, ease: "easeInOut" }}
                      />
                      {publicLineDots.map((point, index) => (
                        <motion.circle
                          key={`${point.x}-${point.y}-${index}`}
                          cx={point.x}
                          cy={point.y}
                          r="5"
                          className="line-dot"
                          animate={{ r: [5, 6.5, 5], opacity: [0.75, 1, 0.75] }}
                          transition={{
                            duration: 2.4,
                            delay: index * 0.18,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        />
                      ))}
                    </motion.svg>

                    <div className="line-chart-labels">
                      <span>Motivation</span>
                      <span>Anxiousness</span>
                      <span>Spirit</span>
                      <span>Loneliness</span>
                    </div>
                  </div>
                </motion.article>
              </div>
            </div>
          </section>
        </LazySection>

        <LazySection minHeight={860} delay={0.1}>
          <section className="blogs" id="about">
            <h2>Explore Mental Wellness</h2>
            <p className="blogs-subtitle">
              Small, supportive tools people can open anytime for calm, clarity,
              sleep, reflection, or a quick mental reset.
            </p>
            <div className="wellness-card-grid">
              {wellnessCards.map((card) => (
                <article
                  key={card.title}
                  className={`wellness-mini-card ${card.tone} ${card.clickable ? "clickable" : ""}`}
                  onClick={card.action}
                  onKeyDown={(event) => {
                    if ((event.key === "Enter" || event.key === " ") && card.action) {
                      event.preventDefault();
                      card.action();
                    }
                  }}
                  role={card.action ? "button" : undefined}
                  tabIndex={card.action ? 0 : undefined}
                >
                  <span className="wellness-card-badge">{card.highlight}</span>
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                  <div className="wellness-chip-row">
                    {card.items.map((item) => (
                      <span key={item} className="wellness-chip">
                        {item}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>
        </LazySection>

        <Footer />
      </div>
    );
  }

  const quickActions =
    user?.role === "counsellor" ? counsellorQuickActions : clientQuickActions;

  return (
    <PageWrapper>
      <div className="container home-page">
        <div className="hub-shell">
          <LazySection minHeight={220} delay={0.03}>
            <section className="hub-hero">
              <div className="hub-badge brand-inline brand-badge">
                <img src="/images/Logo.png" alt="MyMento logo" className="brand-logo brand-logo-badge" />
                <span>MyMento Hub</span>
              </div>
              <ThemeToggle className="hub-theme-toggle" />
              <h1 className="home-title">Welcome, {user?.name}</h1>
              <p className="welcome">
                Your personalized wellness space for support, clarity and next
                steps.
              </p>

              <div className="hub-nav">
                <button type="button" className="hub-nav-chip" onClick={() => navigate(user?.role === "counsellor" ? "/counsellor-dashboard" : "/")}>
                  Dashboard
                </button>
                <button type="button" className="hub-nav-chip" onClick={() => openPlaceholder("Stress Test")}>
                  Stress Test
                </button>
                <button type="button" className="hub-nav-chip" onClick={() => navigate("/career-guide")}>
                  Career Guide
                </button>
                <button type="button" className="hub-nav-chip" onClick={() => navigate("/talk-space")}>
                  Talk Space
                </button>
                <button type="button" className="hub-nav-chip" onClick={() => openPlaceholder("Quick Help")}>
                  Quick Help
                </button>
                <button type="button" className="hub-nav-chip emergency" onClick={() => openPlaceholder("Emergency Support")}>
                  Emergency
                </button>
              </div>
            </section>
          </LazySection>

          {user?.role !== "counsellor" ? (
            <LazySection minHeight={250} delay={0.06}>
              <ClientDashboardHub />
            </LazySection>
          ) : null}

          <LazySection minHeight={250} delay={0.08}>
            <section className="hub-section">
              <div className="section-heading">
                <h2>Quick Actions</h2>
                <p>Keep your current workflow, now with more room and context.</p>
              </div>

              <div className="quick-actions-grid">
                {quickActions.map((item) => (
                  <button
                    key={item.title}
                    type="button"
                    className={`feature-panel quick-action ${item.tone}`}
                    onClick={item.action}
                  >
                    <span className="feature-eyebrow">Action</span>
                    <strong>{item.title}</strong>
                    <span>{item.subtitle}</span>
                  </button>
                ))}
              </div>
            </section>
          </LazySection>

          <LazySection minHeight={320} delay={0.09}>
            <section className="hub-section">
              <div className="section-heading">
                <h2>Wellness Tools</h2>
                <p>Helpful guidance modules users can explore right after login.</p>
              </div>

              <div className="support-grid">
                {supportTools.map((tool) => (
                  <article key={tool.title} className={`feature-panel support-card ${tool.tone}`}>
                    <div>
                      <span className="feature-eyebrow">Guided Tool</span>
                      <h3>{tool.title}</h3>
                      <p>{tool.text}</p>
                    </div>
                    <button type="button" className="feature-cta" onClick={tool.action}>
                      {tool.cta}
                    </button>
                  </article>
                ))}
              </div>
            </section>
          </LazySection>

          <LazySection minHeight={120} delay={0.12}>
            <section className="hub-strip">
              {spotlightTools.map((tool) => (
                <button
                  key={tool.title}
                  type="button"
                  className={`spotlight-card ${tool.tone}`}
                  onClick={tool.action}
                >
                  {tool.title}
                </button>
              ))}
            </section>
          </LazySection>

          <LazySection minHeight={180} delay={0.15}>
            <section className="hub-footer-row">
              <div className="feature-panel insight-card">
                <span className="feature-eyebrow">Daily Insight</span>
                <h3>Today's focus</h3>
                <p>
                  Small check-ins, clear boundaries, and one calm decision at a
                  time can make the day feel lighter.
                </p>
              </div>

              <button
                type="button"
                className="logout-btn hub-logout"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
              >
                Logout
              </button>
            </section>
          </LazySection>
        </div>
      </div>
    </PageWrapper>
  );
}

export default Home;
