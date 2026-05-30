import { useRef, useState } from "react";
import { motion, useSpring, useTransform, useReducedMotion, useMotionTemplate } from "framer-motion";
import { cn } from "@/lib/utils";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}

export function TiltCard({ children, className, glow = true }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  
  const [hovered, setHovered] = useState(false);
  
  const x = useSpring(0, { stiffness: 150, damping: 20 });
  const y = useSpring(0, { stiffness: 150, damping: 20 });

  // Glow position
  const mouseX = useSpring(0, { stiffness: 200, damping: 20 });
  const mouseY = useSpring(0, { stiffness: 200, damping: 20 });

  const rotateX = useTransform(y, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(x, [-0.5, 0.5], ["-7deg", "7deg"]);

  const glowBackground = useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, rgba(255,255,255,0.15), transparent 40%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReduced || !ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    const mouseXPos = e.clientX - rect.left;
    const mouseYPos = e.clientY - rect.top;
    
    const xPct = (mouseXPos / width) - 0.5;
    const yPct = (mouseYPos / height) - 0.5;
    
    x.set(xPct);
    y.set(yPct);
    
    mouseX.set(mouseXPos);
    mouseY.set(mouseYPos);
  };

  const handleMouseLeave = () => {
    if (prefersReduced) return;
    x.set(0);
    y.set(0);
    setHovered(false);
  };

  const handleMouseEnter = () => {
    if (prefersReduced) return;
    setHovered(true);
  };

  if (prefersReduced) {
    return (
      <div className={cn("relative overflow-hidden", className)}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={cn("relative transition-all duration-200 ease-linear perspective-[1000px]", className)}
    >
      {glow && hovered && (
        <motion.div
          className="pointer-events-none absolute -inset-px z-20 rounded-xl transition-opacity duration-300 mix-blend-overlay"
          style={{
            background: glowBackground,
            opacity: 1
          }}
        />
      )}
      <div style={{ transform: "translateZ(30px)" }} className="h-full w-full">
        {children}
      </div>
    </motion.div>
  );
}