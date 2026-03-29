import { useState } from "react";
import { motion } from "framer-motion";
import "./Slider.css";

const cards = [
  {
    id: "burnout",
    title: "Feeling burnt out from work?",
    subtitle:
      "You are not lazy. You are mentally exhausted. Let us help you reset with kinder structure.",
    cta: "Check Burnout",
    tag: "Burnout",
    accent: "aqua",
    image: "/images/therapy1.png",
  },
  {
    id: "overthinking",
    title: "Caught in overthinking at night?",
    subtitle:
      "Slow racing thoughts, reduce tension, and build calmer mental routines before sleep.",
    cta: "Ease My Mind",
    tag: "Overthinking",
    accent: "sky",
    image: "/images/therapy.png",
  },
  {
    id: "career",
    title: "Career confusion weighing on you?",
    subtitle:
      "Explore role fit, direction, and next steps without the pressure to figure it out alone.",
    cta: "Explore Career",
    tag: "Career",
    accent: "mint",
    image: "/images/therapy1.png",
  },
  {
    id: "toxic-boss",
    title: "Struggling with a toxic boss?",
    subtitle:
      "Find language, boundaries, and coping strategies for stressful work dynamics.",
    cta: "Find Clarity",
    tag: "Toxic Boss",
    accent: "peach",
    image: "/images/therapy.png",
  },
  {
    id: "loneliness",
    title: "Feeling lonely even around people?",
    subtitle:
      "Reconnect with yourself, express what hurts, and take small steps toward support.",
    cta: "Feel Connected",
    tag: "Loneliness",
    accent: "lilac",
    image: "/images/therapy1.png",
  },
];

function Slider() {
  const [index, setIndex] = useState(0);

  const next = () => {
    setIndex((prev) => (prev + 1) % cards.length);
  };

  const prev = () => {
    setIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const activeCard = cards[index];
  const leftCard = cards[(index - 1 + cards.length) % cards.length];
  const rightCard = cards[(index + 1) % cards.length];

  return (
    <section className="slider-shell">
      <div className="slider-backdrop" />
      <div className="slider-cloud slider-cloud-left" />
      <div className="slider-cloud slider-cloud-right" />

      <div className="slider-head">
        <h2>Situations We Help With</h2>
      </div>

      <div className="slider-stage">
        <motion.aside
          key={`left-${leftCard.id}`}
          className={`slider-side-card left ${leftCard.accent}`}
          initial={{ opacity: 0.45, x: -12 }}
          animate={{ opacity: 0.62, x: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <span>{leftCard.title}</span>
          <small>{leftCard.tag}</small>
        </motion.aside>

        <button type="button" className="slider-nav left" onClick={prev} aria-label="Previous slide">
          &#8249;
        </button>

        <motion.article
          key={activeCard.id}
          className={`slider-focus-card ${activeCard.accent}`}
          initial={{ opacity: 0.55, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.42, ease: "easeOut" }}
        >
          <div className="slider-focus-copy">
            <span className="slider-kicker">Guided Support</span>
            <h3>{activeCard.title}</h3>
            <p>{activeCard.subtitle}</p>
            <button type="button" className="slider-cta">
              {activeCard.cta}
              <span>&#8250;</span>
            </button>
          </div>

          <motion.div
            className="slider-focus-visual"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="slider-image-glow" />
            <img src={activeCard.image} alt={activeCard.tag} />
          </motion.div>
        </motion.article>

        <button type="button" className="slider-nav right" onClick={next} aria-label="Next slide">
          &#8250;
        </button>

        <motion.aside
          key={`right-${rightCard.id}`}
          className={`slider-side-card right ${rightCard.accent}`}
          initial={{ opacity: 0.45, x: 12 }}
          animate={{ opacity: 0.62, x: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <span>{rightCard.title}</span>
          <small>{rightCard.tag}</small>
        </motion.aside>
      </div>

      <div className="slider-footer">
        <div className="slider-dots">
          {cards.map((card, dotIndex) => (
            <button
              key={card.id}
              type="button"
              className={`slider-dot ${dotIndex === index ? "active" : ""}`}
              onClick={() => setIndex(dotIndex)}
              aria-label={`Go to ${card.tag}`}
            />
          ))}
        </div>

        <div className="slider-tags">
          {cards.map((card, tagIndex) => (
            <button
              key={card.id}
              type="button"
              className={`slider-tag ${tagIndex === index ? "active" : ""}`}
              onClick={() => setIndex(tagIndex)}
            >
              {card.tag}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Slider;
