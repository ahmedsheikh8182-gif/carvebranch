import type { Variants } from "framer-motion";

// ─── Easing Curves ────────────────────────────────────────────────
// Expo-out: immediate start, graceful deceleration — the "luxury" feel
export const luxuryEase = [0.22, 1, 0.36, 1] as [number, number, number, number];
// Smooth ease-out for secondary elements
export const smoothEase = [0.25, 0.46, 0.45, 0.94] as [number, number, number, number];
// Symmetrical for hover
export const inOutEase = [0.4, 0, 0.2, 1] as [number, number, number, number];

// ─── Scroll-triggered Variants ───────────────────────────────────
// All accept `custom` in MILLISECONDS, convert to seconds internally.

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 38 },
  visible: (delayMs: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1.0, ease: luxuryEase, delay: delayMs / 1000 },
  }),
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: (delayMs: number = 0) => ({
    opacity: 1,
    transition: { duration: 0.85, ease: smoothEase, delay: delayMs / 1000 },
  }),
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: (delayMs: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.95, ease: luxuryEase, delay: delayMs / 1000 },
  }),
};

// Clip-path wipe — image containers, section reveals
export const clipReveal: Variants = {
  hidden: { clipPath: "inset(100% 0% 0% 0%)" },
  visible: (delayMs: number = 0) => ({
    clipPath: "inset(0% 0% 0% 0%)",
    transition: { duration: 1.4, ease: luxuryEase, delay: delayMs / 1000 },
  }),
};

// Decorative rule draws in from left
export const lineReveal: Variants = {
  hidden: { scaleX: 0 },
  visible: (delayMs: number = 0) => ({
    scaleX: 1,
    transition: { duration: 1.0, ease: luxuryEase, delay: delayMs / 1000 },
  }),
};

// ─── Stagger System ───────────────────────────────────────────────
// staggerChildren is in seconds (Framer Motion native)
export const staggerContainer = (staggerChildren = 0.09, delayChildren = 0): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren, delayChildren } },
});

export const staggerChild: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: luxuryEase },
  },
};
