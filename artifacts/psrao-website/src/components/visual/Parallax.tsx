import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from "framer-motion";

interface ParallaxProps {
  children?: React.ReactNode;
  offset?: number;
  className?: string;
}

export function Parallax({ children, offset = 50, className = "" }: ParallaxProps) {
  const prefersReduced = useReducedMotion();
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const rawY = useTransform(scrollYProgress, [0, 1], [-offset, offset]);
  const y = useSpring(rawY, { damping: 20, stiffness: 100, mass: 10 });

  const hasPosition = /\b(absolute|fixed|sticky|relative)\b/.test(className);
  const cls = hasPosition ? className : `relative ${className}`;

  if (prefersReduced) {
    return <div className={cls}>{children}</div>;
  }

  return (
    <motion.div ref={ref} style={{ y }} className={cls}>
      {children}
    </motion.div>
  );
}