import { motion } from "framer-motion";
import type { ReactNode } from "react";

type Dir = "up" | "down" | "left" | "right" | "none";

const offset = (d: Dir): { x?: number; y?: number } =>
  ({ up: { y: 28 }, down: { y: -28 }, left: { x: 28 }, right: { x: -28 }, none: {} }[d]);

const EASE = [0.22, 1, 0.36, 1] as const;

/** Scroll-reveal wrapper: fade + slide + optional blur, once on entry. */
export function Reveal({
  children, delay = 0, direction = "up", blur = true, className, once = true, duration = 0.6,
}: {
  children: ReactNode; delay?: number; direction?: Dir; blur?: boolean; className?: string; once?: boolean; duration?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...offset(direction), filter: blur ? "blur(8px)" : "blur(0px)" }}
      whileInView={{ opacity: 1, x: 0, y: 0, filter: "blur(0px)" }}
      viewport={{ once, margin: "-60px" }}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Stagger container — pair with <RevealItem> children. */
export function RevealGroup({
  children, className, stagger = 0.08, once = true,
}: {
  children: ReactNode; className?: string; stagger?: number; once?: boolean;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-60px" }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: stagger } } }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children, className, direction = "up",
}: {
  children: ReactNode; className?: string; direction?: Dir;
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, ...offset(direction), filter: "blur(6px)" },
        visible: { opacity: 1, x: 0, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: EASE } },
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Headline reveal — words rise into place behind a clip mask.
 * Animates on mount (headings are often above the fold, so gating on
 * scroll-into-view left them hidden).
 */
export function WordReveal({
  text, className, delay = 0,
}: {
  text: string; className?: string; delay?: number;
}) {
  const words = text.split(" ");
  return (
    <span style={{ display: "inline" }}>
      {words.map((w, i) => (
        <span key={i} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top" }}>
          <motion.span
            className={className}
            style={{ display: "inline-block", willChange: "transform" }}
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, delay: delay + i * 0.06, ease: EASE }}
          >
            {w}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
