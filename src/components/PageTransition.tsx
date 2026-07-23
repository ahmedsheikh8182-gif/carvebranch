import { motion } from "framer-motion";
import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { luxuryEase } from "@/lib/animations";

interface PageTransitionProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  delay?: number;
}

/**
 * Drop-in replacement for the CSS-only version.
 * `delay` is in milliseconds to keep API compatibility.
 */
export function PageTransition({
  children,
  className,
  delay = 0,
  ...props
}: PageTransitionProps) {
  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.9,
        ease: luxuryEase,
        delay: delay / 1000, // ms → seconds
      }}
      {...(props as any)}
    >
      {children}
    </motion.div>
  );
}
