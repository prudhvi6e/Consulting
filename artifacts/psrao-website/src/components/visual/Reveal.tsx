import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  blur?: boolean;
}

export function Reveal({ children, className, delay = 0, blur = true }: RevealProps) {
  const prefersReduced = useReducedMotion();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, filter: blur ? "blur(10px)" : "none", scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)", scale: 1 } : { opacity: 0, y: 30, filter: blur ? "blur(10px)" : "none", scale: 0.95 }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] as const }}
      className={cn("will-change-transform", className)}
    >
      {children}
    </motion.div>
  );
}