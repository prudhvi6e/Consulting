import { Globe } from "./Globe";
import { cn } from "@/lib/utils";

const PHRASE = "PS RAO CORPORATE SOLUTIONS • ";
const RING_TEXT = PHRASE.repeat(2);

// One tilted, spinning ring of text. Rendered twice (back + front halves) so the
// text passes behind the globe at the far edge and in front at the near edge — Saturn-style.
function Ring({ variant }: { variant: "back" | "front" }) {
  const mask =
    variant === "back"
      ? "linear-gradient(to bottom, #000 0%, #000 46%, transparent 54%)"
      : "linear-gradient(to top, #000 0%, #000 46%, transparent 54%)";
  return (
    <div
      aria-hidden
      className={cn(
        "absolute inset-0 h-full w-full pointer-events-none",
        variant === "back" ? "z-0" : "z-20",
      )}
      style={{
        transform: "perspective(1000px) rotateX(72deg)",
        WebkitMaskImage: mask,
        maskImage: mask,
      }}
    >
      <svg
        viewBox="0 0 300 300"
        className="h-full w-full animate-[spin_24s_linear_infinite] motion-reduce:animate-none"
      >
        <defs>
          <path id="ring-path" d="M150,16 a134,134 0 1,1 -0.01,0" fill="none" />
        </defs>
        <text
          className="fill-primary font-display font-semibold uppercase"
          style={{ fontSize: "14px", letterSpacing: "0.32em" }}
        >
          <textPath href="#ring-path" startOffset="0">
            {RING_TEXT}
          </textPath>
        </text>
      </svg>
    </div>
  );
}

export function GlobeOrbit({ className }: { className?: string }) {
  return (
    <div className={cn("relative aspect-square w-full max-w-[440px]", className)}>
      {/* Saturn ring — far half (behind the globe) */}
      <Ring variant="back" />

      {/* Soft white disc so the white globe reads cleanly on the light page */}
      <div className="absolute inset-0 z-[5] flex items-center justify-center pointer-events-none">
        <div className="aspect-square w-[66%] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.96)_52%,rgba(186,230,253,0.55)_76%,transparent_82%)]" />
      </div>

      {/* The globe */}
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <div className="aspect-square w-[64%]">
          <Globe className="!max-w-none h-full w-full drop-shadow-[0_14px_45px_rgba(14,165,233,0.3)]" />
        </div>
      </div>

      {/* Saturn ring — near half (in front of the globe) */}
      <Ring variant="front" />
    </div>
  );
}
