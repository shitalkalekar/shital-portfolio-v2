import { useEffect, useRef, useState } from "react";

/**
 * AnimatedStatValue
 * - Counts up numeric stats (e.g. "5+") from 0 to target when scrolled into view, played once.
 * - Non-numeric stats ("MERN", "AI/ML") display directly with smooth fade-in.
 * - Respects prefers-reduced-motion.
 */
export const AnimatedStatValue = ({ value, className = "" }) => {
  const containerRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [displayValue, setDisplayValue] = useState(value);

  // Extract number and suffix (e.g., "5+" -> number: 5, suffix: "+")
  const match = String(value).match(/^(\d+)(.*)$/);
  const isNumeric = Boolean(match);
  const targetNumber = isNumeric ? parseInt(match[1], 10) : null;
  const suffix = isNumeric ? match[2] : "";

  useEffect(() => {
    // Non-numeric values (MERN, AI/ML) display directly
    if (!isNumeric) {
      setDisplayValue(value);
      return;
    }

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      setDisplayValue(value);
      setHasAnimated(true);
      return;
    }

    // Initialize at 0 before entering view
    setDisplayValue(`0${suffix}`);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          observer.disconnect();

          const duration = 850; // ms
          const startTime = performance.now();

          const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Smooth ease-out cubic curve
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(easeOut * targetNumber);

            if (progress < 1) {
              setDisplayValue(`${current}${suffix}`);
              requestAnimationFrame(animate);
            } else {
              setDisplayValue(`${targetNumber}${suffix}`);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [value, isNumeric, targetNumber, suffix, hasAnimated]);

  return (
    <span ref={containerRef} className={`inline-block ${className}`}>
      {displayValue}
    </span>
  );
};

export default AnimatedStatValue;
