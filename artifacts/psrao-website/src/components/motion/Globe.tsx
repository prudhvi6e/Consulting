import { useEffect, useRef } from "react";
import createGlobe from "cobe";
import { cn } from "@/lib/utils";

// Markers: Hyderabad HQ (prominent) + global financial hubs to signal reach.
const MARKERS: { location: [number, number]; size: number }[] = [
  { location: [17.385, 78.4867], size: 0.11 }, // Hyderabad (HQ)
  { location: [19.076, 72.8777], size: 0.05 }, // Mumbai
  { location: [28.6139, 77.209], size: 0.05 }, // Delhi
  { location: [1.3521, 103.8198], size: 0.06 }, // Singapore
  { location: [25.2048, 55.2708], size: 0.06 }, // Dubai
  { location: [51.5074, -0.1278], size: 0.06 }, // London
  { location: [40.7128, -74.006], size: 0.06 }, // New York
  { location: [35.6762, 139.6503], size: 0.05 }, // Tokyo
  { location: [-33.8688, 151.2093], size: 0.05 }, // Sydney
];

export function Globe({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerMovement = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    const onResize = () => {
      if (canvas) width = canvas.offsetWidth;
    };
    window.addEventListener("resize", onResize);
    onResize();

    // Start oriented toward India (Hyderabad HQ), then auto-rotate.
    let phi = 3.2;
    let raf = 0;

    const globe = createGlobe(canvas, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 3.2,
      theta: 0.28,
      dark: 0, // light / white globe
      diffuse: 0.6,
      mapSamples: 16000,
      mapBrightness: 2.4,
      mapBaseBrightness: 0.22,
      baseColor: [0.55, 0.7, 0.9], // soft blue continents on a white sphere
      markerColor: [0.02, 0.45, 0.95], // strong sky-blue markers
      glowColor: [0.62, 0.8, 1], // blue atmosphere rim to define the edge on white
      markers: MARKERS,
    });

    // cobe v2 has no onRender callback — drive the frame loop ourselves.
    const render = () => {
      if (!pointerInteracting.current && !reduceMotion) phi += 0.004;
      globe.update({ phi: phi + pointerMovement.current / 200, width: width * 2, height: width * 2 });
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    const t = setTimeout(() => {
      if (canvas) canvas.style.opacity = "1";
    }, 0);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
      globe.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    pointerInteracting.current = e.clientX - pointerMovement.current;
    if (canvasRef.current) canvasRef.current.style.cursor = "grabbing";
  };
  const onPointerUp = () => {
    pointerInteracting.current = null;
    if (canvasRef.current) canvasRef.current.style.cursor = "grab";
  };
  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (pointerInteracting.current !== null) {
      pointerMovement.current = e.clientX - pointerInteracting.current;
    }
  };

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label="Interactive globe highlighting our Hyderabad headquarters and the regions we serve"
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerOut={onPointerUp}
      onPointerMove={onPointerMove}
      className={cn(
        "aspect-square w-full max-w-[300px] cursor-grab touch-none opacity-0 transition-opacity duration-1000 [contain:layout_paint_size]",
        className,
      )}
    />
  );
}
