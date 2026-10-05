import { useEffect, useState, type ReactNode } from "react";

/** Mounts children after the page is interactive (idle callback), so heavy decorative
 *  components (WebGL, canvas loops, globes) never delay first paint or hydration. */
export function Deferred({ children, fallback = null, delay = 0 }: { children: ReactNode; fallback?: ReactNode; delay?: number }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void };
    let id: number | undefined; let t: number | undefined;
    const go = () => { t = window.setTimeout(() => setReady(true), delay); };
    if (w.requestIdleCallback) id = w.requestIdleCallback(go, { timeout: 2500 });
    else t = window.setTimeout(go, 600);
    return () => { if (id !== undefined) w.cancelIdleCallback?.(id); if (t) clearTimeout(t); };
  }, [delay]);
  return <>{ready ? children : fallback}</>;
}
