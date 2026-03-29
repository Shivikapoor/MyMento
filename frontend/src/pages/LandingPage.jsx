import React from "react";
import { motion } from "framer-motion";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import Slider from "../components/Slider";
import "../App.css";

const barHeights = [74, 63, 56, 34, 46, 28];
const barLabels = ["Work", "Joy", "Sleep", "Hope", "Stress", "Ease"];
const lineOnePoints = "18,108 72,52 126,72 180,40 234,84 288,58 342,72";
const lineTwoPoints = "18,72 72,92 126,44 180,82 234,50 288,88 342,62";
const lineDots = [
  { x: 18, y: 108 },
  { x: 72, y: 52 },
  { x: 126, y: 72 },
  { x: 180, y: 40 },
  { x: 234, y: 84 },
  { x: 288, y: 58 },
  { x: 342, y: 72 },
];

const LandingPage = () => {
  return (
    <>
      <NavBar />

      <section className="hero">
        <div className="hero-text">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Your Safe Space <br /> for Mental Well-being
          </motion.h1>

          <motion.p
            className="desc"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Talk, heal, and grow with professional support. You do not have to
            go through it alone.
          </motion.p>

          <motion.div
            className="hero-buttons"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <button className="primary-btn">Book a Session</button>
            <button className="secondary-btn">Explore</button>
          </motion.div>

          <p className="trust">4.8 rating • 10,000+ users helped</p>
        </div>

        <div className="hero-img">
          <img src="/images/therapy.png" alt="therapy" />

          <motion.div
            className="float bubble1"
            animate={{ y: [0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
          />

          <motion.div
            className="float bubble2"
            animate={{ y: [0, 15, 0] }}
            transition={{ repeat: Infinity, duration: 5 }}
          />
        </div>
      </section>

      <section className="slider-section">
        <Slider />
      </section>

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
                  {barHeights.map((height, index) => (
                    <div key={barLabels[index]} className="bar-group">
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
                      <span>{barLabels[index]}</span>
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
                    points={lineOnePoints}
                    className="line-path warm-line"
                    animate={{ opacity: [0.82, 1, 0.88] }}
                    transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.polyline
                    points={lineTwoPoints}
                    className="line-path cool-line"
                    animate={{ opacity: [0.8, 1, 0.86] }}
                    transition={{ duration: 4.9, repeat: Infinity, ease: "easeInOut" }}
                  />
                  {lineDots.map((point, index) => (
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

      <section className="blogs">
        <h2>Explore Mental Wellness</h2>

        <div className="blog-cards">
          <div className="card pink">
            <h3>Understanding Anxiety</h3>
            <p>Learn how to manage stress effectively.</p>
          </div>

          <div className="card purple">
            <h3>Mindfulness</h3>
            <p>Stay present and calm your thoughts.</p>
          </div>

          <div className="card yellow">
            <h3>Relationships</h3>
            <p>Build strong emotional connections.</p>
          </div>

          <div className="card green">
            <h3>Self Care</h3>
            <p>Simple habits for better mental health.</p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default LandingPage;
