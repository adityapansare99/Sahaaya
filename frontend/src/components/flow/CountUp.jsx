// CountUp — animates a number from 0 -> value when scrolled into view.
// Presentational animation only (no business logic). Respects reduced-motion.
import { useEffect, useRef, useState } from "react";

const easeOut = (t) => 1 - Math.pow(1 - t, 3);

const formatIN = (n, decimals) => {
  if (decimals && decimals > 0) {
    return Number(n).toLocaleString("en-IN", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  }
  return Math.round(n).toLocaleString("en-IN");
};

const CountUp = ({
  value,
  duration = 1500,
  decimals = 0,
  prefix = "",
  suffix = "",
  className = "",
  placeholder = "—",
}) => {
  const ref = useRef(null);
  const [display, setDisplay] = useState(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (value == null || Number.isNaN(Number(value))) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced || typeof IntersectionObserver === "undefined") {
      setDisplay(formatIN(value, decimals));
      startedRef.current = true;
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !startedRef.current) {
            startedRef.current = true;
            const target = Number(value) || 0;
            const start = performance.now();
            const tick = (now) => {
              const t = Math.min(1, (now - start) / duration);
              setDisplay(formatIN(target * easeOut(t), decimals));
              if (t < 1) requestAnimationFrame(tick);
              else setDisplay(formatIN(target, decimals));
            };
            requestAnimationFrame(tick);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value, duration, decimals]);

  return (
    <span ref={ref} className={"nums " + className}>
      {display == null ? placeholder : prefix + display + suffix}
    </span>
  );
};

export default CountUp;
