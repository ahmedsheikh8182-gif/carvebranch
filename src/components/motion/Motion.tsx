/**
 * Luxury Motion Components
 * All delay props are in milliseconds (ms) for consistency with the rest of the app.
 * Framer Motion conversion (ms → s) happens internally.
 */
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode, type CSSProperties } from "react";
import {
  fadeUp,
  fadeIn,
  scaleIn,
  clipReveal,
  lineReveal,
  staggerContainer,
  staggerChild,
  luxuryEase,
} from "@/lib/animations";

interface BaseProps {
  children?: ReactNode;
  delay?: number;   // milliseconds
  className?: string;
  style?: CSSProperties;
  once?: boolean;
}

// ─── FadeUp ──────────────────────────────────────────────────────
// Fades in while rising from below. Use for most scroll reveals.
export function FadeUp({ children, delay = 0, className, style, once = true }: BaseProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once, margin: "-64px 0px" as any });
  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      custom={delay}
      variants={fadeUp}
    >
      {children}
    </motion.div>
  );
}

// ─── FadeIn ──────────────────────────────────────────────────────
// Pure opacity reveal — for overlays, decorative elements.
export function FadeIn({ children, delay = 0, className, style, once = true }: BaseProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once, margin: "-64px 0px" as any });
  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      custom={delay}
      variants={fadeIn}
    >
      {children}
    </motion.div>
  );
}

// ─── ScaleIn ──────────────────────────────────────────────────────
// Gentle scale-up + fade. Icons, badges, compact elements.
export function ScaleIn({ children, delay = 0, className, style, once = true }: BaseProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once, margin: "-64px 0px" as any });
  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      custom={delay}
      variants={scaleIn}
    >
      {children}
    </motion.div>
  );
}

// ─── Reveal ──────────────────────────────────────────────────────
// Clip-path wipe from top. For image containers, content blocks.
export function Reveal({ children, delay = 0, className, style, once = true }: BaseProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once, margin: "-40px 0px" as any });
  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ ...style, overflow: "hidden" }}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      custom={delay}
      variants={clipReveal}
    >
      {children}
    </motion.div>
  );
}

// ─── LineReveal ──────────────────────────────────────────────────
// Decorative rule that draws in from the left.
export function LineReveal({ delay = 0, className, style }: Omit<BaseProps, "children">) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px 0px" as any });
  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ ...style, transformOrigin: "left" }}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      custom={delay}
      variants={lineReveal}
    />
  );
}

// ─── Stagger ──────────────────────────────────────────────────────
// Container that staggers children as they scroll into view.
interface StaggerProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  staggerDelay?: number;  // seconds between children
  delayChildren?: number; // seconds before first child
  once?: boolean;
}

export function Stagger({
  children,
  className,
  style,
  staggerDelay = 0.09,
  delayChildren = 0,
  once = true,
}: StaggerProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once, margin: "-64px 0px" as any });
  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={staggerContainer(staggerDelay, delayChildren)}
    >
      {children}
    </motion.div>
  );
}

// ─── StaggerItem ──────────────────────────────────────────────────
// Direct child of <Stagger>. Gets timing from parent's stagger config.
export function StaggerItem({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <motion.div className={className} style={style} variants={staggerChild}>
      {children}
    </motion.div>
  );
}

// ─── Parallax ────────────────────────────────────────────────────
// Scroll-driven Y translate for background depth.
// speed: 0.25 means content moves 25px per 100px scrolled
interface ParallaxProps {
  children: ReactNode;
  speed?: number;
  className?: string;
  style?: CSSProperties;
}

export function Parallax({ children, speed = 0.25, className, style }: ParallaxProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [`${-speed * 80}px`, `${speed * 80}px`]);
  return (
    <div ref={ref} className={className} style={style}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  );
}

// ─── PageReveal ──────────────────────────────────────────────────
// Mount animation for full pages / hero content (not scroll-triggered).
export function PageReveal({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: luxuryEase }}
    >
      {children}
    </motion.div>
  );
}

// ─── AnimatedText ────────────────────────────────────────────────
// Luxury text reveal: slides up from behind overflow-hidden parent.
// Animates on mount. Use for hero headings, not scroll sections.
// delay is in milliseconds.
export function AnimatedText({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <span style={{ display: "block", overflow: "hidden" }}>
      <motion.span
        className={className}
        style={{ display: "block" }}
        initial={{ y: "108%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.15, ease: luxuryEase, delay: delay / 1000 }}
      >
        {children}
      </motion.span>
    </span>
  );
}
