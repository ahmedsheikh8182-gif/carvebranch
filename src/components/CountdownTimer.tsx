/**
 * CountdownTimer — Cormorant Garamond countdown display for limited drops.
 * Accepts an `endsAt` ISO string. Shows "Collection Closed" when expired.
 */
import { useState, useEffect } from "react";

interface CountdownTimerProps {
  endsAt: string; // ISO 8601 date string
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function compute(target: Date): TimeLeft | null {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return null;
  const total = Math.floor(diff / 1000);
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  return { days, hours, minutes, seconds };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function CountdownTimer({ endsAt, className }: CountdownTimerProps) {
  const target = new Date(endsAt);
  const [left, setLeft] = useState<TimeLeft | null>(() => compute(target));

  useEffect(() => {
    const id = setInterval(() => {
      setLeft(compute(target));
    }, 1000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endsAt]);

  if (left === null) {
    return (
      <div className={className}>
        <span className="font-serif italic text-white/70" style={{ fontSize: "clamp(18px, 2vw, 26px)" }}>
          Collection Closed
        </span>
      </div>
    );
  }

  const units = [
    { value: pad(left.days), label: "Days" },
    { value: pad(left.hours), label: "Hrs" },
    { value: pad(left.minutes), label: "Min" },
    { value: pad(left.seconds), label: "Sec" },
  ];

  return (
    <div className={className}>
      <span className="font-sans text-[9px] uppercase tracking-[0.3em] text-white/50 block mb-3">
        Ends In
      </span>
      <div className="flex items-end gap-3">
        {units.map(({ value, label }, i) => (
          <div key={label} className="flex items-end gap-1">
            <span
              className="font-serif text-white tabular-nums leading-none"
              style={{ fontSize: "clamp(28px, 3.5vw, 48px)" }}
            >
              {value}
            </span>
            <span className="font-sans text-[9px] uppercase tracking-[0.15em] text-white/50 pb-1.5">
              {label}
            </span>
            {i < units.length - 1 && (
              <span className="font-serif text-white/40 pb-0.5 ml-1" style={{ fontSize: "clamp(20px, 2.5vw, 34px)" }}>·</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
