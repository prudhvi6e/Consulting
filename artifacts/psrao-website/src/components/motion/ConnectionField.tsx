import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

type Node = { x: number; y: number; vx: number; vy: number; r: number; hub: boolean };

// Mouse-reactive "connection constellation": drifting nodes joined by proximity
// lines that brighten and lean toward the cursor — a visual metaphor for connecting.
// Decorative (aria-hidden). Follows the lifecycle/perf pattern of WebGLHero.
export function ConnectionField({ className }: { className?: string }) {
  const reduced = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const DPR = Math.min(window.devicePixelRatio || 1, 1.5);
    let w = 0;
    let h = 0;
    let nodes: Node[] = [];

    const LINK_DIST = 150; // px between nodes to draw a line
    const MOUSE_DIST = 200; // px around cursor that nodes react to

    const seed = () => {
      // Density scales with area; clamp to a sensible range.
      const count = Math.max(26, Math.min(52, Math.round((w * h) / 13000)));
      nodes = Array.from({ length: count }, (_, i) => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        r: 1.6 + Math.random() * 1.6,
        hub: i === 0,
      }));
      // The hub sits near the centre, a touch larger/brighter.
      if (nodes[0]) {
        nodes[0].x = w * 0.5;
        nodes[0].y = h * 0.5;
        nodes[0].r = 3.6;
      }
    };

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(w * DPR));
      canvas.height = Math.max(1, Math.floor(h * DPR));
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      seed();
      if (reduced) draw(); // static frame for reduced motion
    };

    // Pointer tracked relative to the canvas; null when outside.
    const mouse = { x: 0, y: 0, active: false };
    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mouse.active = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
      mouse.x = x;
      mouse.y = y;
    };
    const onLeave = () => (mouse.active = false);

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);

      // Lines between nearby nodes.
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d < LINK_DIST) {
            const alpha = (1 - d / LINK_DIST) * 0.5;
            ctx.strokeStyle = `rgba(14,165,233,${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Brighter lines reaching toward the cursor.
      if (mouse.active) {
        for (const n of nodes) {
          const d = Math.hypot(n.x - mouse.x, n.y - mouse.y);
          if (d < MOUSE_DIST) {
            const alpha = (1 - d / MOUSE_DIST) * 0.85;
            ctx.strokeStyle = `rgba(56,189,248,${alpha})`;
            ctx.lineWidth = 1.1;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
        // Cursor node.
        ctx.fillStyle = "rgba(56,189,248,0.95)";
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Nodes (with glow).
      for (const n of nodes) {
        ctx.fillStyle = n.hub ? "rgba(56,189,248,0.95)" : "rgba(14,165,233,0.9)";
        ctx.shadowColor = "rgba(14,165,233,0.9)";
        ctx.shadowBlur = n.hub ? 16 : 8;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
    }

    const step = () => {
      for (const n of nodes) {
        if (n.hub) continue; // hub stays put as the anchor
        // Gentle attraction toward the cursor.
        if (mouse.active) {
          const dx = mouse.x - n.x;
          const dy = mouse.y - n.y;
          const d = Math.hypot(dx, dy);
          if (d < MOUSE_DIST && d > 0.001) {
            const pull = (1 - d / MOUSE_DIST) * 0.04;
            n.vx += (dx / d) * pull;
            n.vy += (dy / d) * pull;
          }
        }
        n.x += n.vx;
        n.y += n.vy;
        // Friction so cursor pulls don't accumulate forever.
        n.vx *= 0.99;
        n.vy *= 0.99;
        // Bounce within bounds.
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
        n.x = Math.max(0, Math.min(w, n.x));
        n.y = Math.max(0, Math.min(h, n.y));
      }
      draw();
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    if (reduced) {
      draw();
      return () => ro.disconnect();
    }

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerout", onLeave);

    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0 });
    io.observe(canvas);

    let raf = requestAnimationFrame(function loop() {
      raf = requestAnimationFrame(loop);
      if (!visible || document.hidden) return;
      step();
    });

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerout", onLeave);
    };
  }, [reduced]);

  return <canvas ref={canvasRef} aria-hidden className={className} />;
}
