import { useEffect, useRef, useState } from "react";

export function CountUp({ end, suffix = "", duration = 1800 }: { end: number; suffix?: string; duration?: number }) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement | null>(null);
  const started = useRef(false);
  const rafId = useRef<number>(0);

  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !started.current) {
            started.current = true;
            const start = performance.now();
            const step = (now: number) => {
              const t = Math.min(1, (now - start) / duration);
              const eased = 1 - Math.pow(1 - t, 3);
              setValue(Math.floor(eased * end));
              if (t < 1) rafId.current = requestAnimationFrame(step);
            };
            rafId.current = requestAnimationFrame(step);
          }
        }
      },
      { threshold: 0.3 },
    );
    obs.observe(ref.current);
    return () => {
      obs.disconnect();
      cancelAnimationFrame(rafId.current);
    };
  }, [end, duration]);

  return (
    <span ref={ref}>
      {value.toLocaleString()}
      {suffix}
    </span>
  );
}
