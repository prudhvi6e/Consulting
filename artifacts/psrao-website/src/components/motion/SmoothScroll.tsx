import { ReactLenis } from "lenis/react";
import { useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * App-wide smooth scrolling (Lenis). Disabled under prefers-reduced-motion so
 * the native scroll is retained for users who ask for less motion.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  if (reduced) return <>{children}</>;
  return (
    <ReactLenis root options={{ duration: 1.1, smoothWheel: true, touchMultiplier: 1.5 }}>
      {children}
    </ReactLenis>
  );
}
