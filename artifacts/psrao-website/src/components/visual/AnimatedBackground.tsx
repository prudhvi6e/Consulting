import { useReducedMotion } from "framer-motion";

export function AnimatedBackground() {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return (
      <div className="fixed inset-0 z-[-1] bg-background">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-background pointer-events-none">
      {/* Noise overlay */}
      <div className="absolute inset-0 z-10 opacity-20 dark:opacity-40 mix-blend-overlay bg-[url('data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjAwIDIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC42NSIgbnVtT2N0YXZlcz0iMyIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIvPjwvc3ZnPg==')] pointer-events-none" />
      
      {/* Aurora / Orbs */}
      <div className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-primary/20 blur-[120px] mix-blend-screen animate-aurora pointer-events-none" />
      <div className="absolute top-[20%] -right-[20%] w-[60vw] h-[60vw] rounded-full bg-blue-500/10 blur-[150px] mix-blend-screen animate-aurora-reverse pointer-events-none" style={{ animationDelay: '-5s' }} />
      <div className="absolute -bottom-[20%] left-[20%] w-[80vw] h-[80vw] rounded-full bg-indigo-500/10 blur-[130px] mix-blend-screen animate-aurora pointer-events-none" style={{ animationDelay: '-10s' }} />
      
      {/* Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black_40%,transparent_100%)] pointer-events-none" />
    </div>
  );
}