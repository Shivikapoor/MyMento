import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

function LazySection({
  children,
  minHeight = 320,
  className = "",
  rootMargin = "240px 0px",
  delay = 0,
}) {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node || isVisible) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold: 0.12 }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [isVisible, rootMargin]);

  return (
    <div
      ref={sectionRef}
      className={`lazy-section-shell ${className}`.trim()}
      style={{ minHeight }}
    >
      {isVisible ? (
        <motion.div
          className="lazy-section-content"
          initial={{ opacity: 0, y: 56, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.78, delay, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      ) : (
        <div className="lazy-section-placeholder" aria-hidden="true">
          <div className="lazy-section-shimmer" />
        </div>
      )}
    </div>
  );
}

export default LazySection;
