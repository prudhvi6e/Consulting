import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/motion/Magnetic";

export default function NotFound() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-background px-4 overflow-hidden">
      {/* Decorative glows */}
      <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-sky-400/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="text-center max-w-md relative z-10">
        <motion.p
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1, y: [0, -14, 0] }}
          transition={{
            opacity: { duration: 0.5 },
            scale: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
            y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          }}
          className="font-display text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-sky-300 mb-4"
        >
          404
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-2xl md:text-3xl font-display font-bold text-foreground mb-3"
        >
          Page not found
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-muted-foreground mb-8"
        >
          The page you're looking for doesn't exist or may have moved.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Magnetic>
            <Link href="/" data-cursor>
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
              </Button>
            </Link>
          </Magnetic>
        </motion.div>
      </div>
    </div>
  );
}
