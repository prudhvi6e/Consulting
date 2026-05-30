import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { Target, TrendingUp } from "lucide-react";
import officeAbstract from "@/assets/images/office-abstract.png";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

export default function About() {
  const prefersReducedMotion = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  useEffect(() => {
    document.title = "About Us | PS Rao & Associates";
  }, []);

  return (
    <div className="w-full pt-20 bg-background overflow-hidden">
      {/* Hero Section with Parallax */}
      <section ref={heroRef} className="relative min-h-[70vh] flex items-center bg-card border-b border-border overflow-hidden">
        <motion.div 
          style={{ y: prefersReducedMotion ? 0 : y, opacity: prefersReducedMotion ? 1 : opacity }}
          className="absolute inset-0 z-0 pointer-events-none"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-card via-card/80 to-transparent z-10" />
          <img src={officeAbstract} alt="Abstract" className="w-full h-full object-cover mix-blend-luminosity opacity-40" />
          <div className="absolute top-1/4 left-1/2 w-[800px] h-[600px] bg-primary/10 rounded-full blur-[120px] mix-blend-screen" />
        </motion.div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-4xl">
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6 backdrop-blur-md">
              Our Firm
            </motion.div>
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-foreground mb-8 leading-tight tracking-tight">
              Minding your business as <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">ours.</span>
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl font-light">
              We are a dynamic and progressive partnership firm of Company Secretaries, delivering value through a dedicated team of professionals with extensive experience across a broad range of disciplines.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Quote Section with Glow */}
      <section className="py-32 relative z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="container mx-auto px-4 md:px-6 relative">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }}
            className="max-w-5xl mx-auto text-center p-12 md:p-20 rounded-[3rem] bg-card/30 border border-border/50 backdrop-blur-xl shadow-2xl shadow-primary/5"
          >
            <div className="text-primary text-8xl font-display leading-none mb-8 opacity-20 bg-clip-text text-transparent bg-gradient-to-b from-primary to-transparent">"</div>
            <h2 className="text-3xl md:text-5xl font-display font-medium text-foreground mb-12 leading-snug tracking-tight">
              Individual commitment to a group effort - that is what makes a team work, a company work, a society work, a civilization work.
            </h2>
            <p className="text-primary uppercase tracking-widest text-sm font-bold">— Vince Lombardi</p>
          </motion.div>
        </div>
      </section>

      {/* Core Approach with Glassmorphism */}
      <section className="py-32 bg-secondary text-secondary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('@/assets/images/office-abstract.png')] opacity-5 mix-blend-overlay object-cover" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[150px] pointer-events-none" />
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-8 tracking-tight">The PSR <br /><span className="text-primary">Approach</span></h3>
              <div className="space-y-8 text-secondary-foreground/80 text-lg leading-relaxed font-light">
                <p className="text-xl text-white/90 font-medium">
                  Working with a team of professionals, committed to excel with sound knowledge and technology thereby unlocking the growth potential through required structuring.
                </p>
                <div className="w-12 h-px bg-primary/50" />
                <p>
                  Our customized services with outstanding delivery model provide long term sustainable wealth creation. Allied with this, we have considerable resources essential to enable us to successfully manage and drive forward transactions within the timetables required.
                </p>
                <p>
                  Each tailored assignment is undertaken by a team with the most appropriate blend of skills with the objective of providing the best professional advice available.
                </p>
              </div>
            </motion.div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="p-10 rounded-3xl bg-white/5 border border-white/10 flex flex-col gap-6 backdrop-blur-md shadow-2xl hover:bg-white/10 hover:border-primary/30 transition-all duration-500"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <h4 className="text-2xl font-display font-bold text-white">Mission</h4>
                <p className="text-base text-secondary-foreground/70 leading-relaxed font-light">Help clients accomplish their Mission and Vision objectives with the highest standards of performance and quality service.</p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="p-10 rounded-3xl bg-white/5 border border-white/10 flex flex-col gap-6 backdrop-blur-md shadow-2xl mt-0 sm:mt-12 hover:bg-white/10 hover:border-primary/30 transition-all duration-500"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <h4 className="text-2xl font-display font-bold text-white">Vision</h4>
                <p className="text-base text-secondary-foreground/70 leading-relaxed font-light">Unlock growth potential by maximizing value through extensive professional advice and sustain an enriching environment.</p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats/Milestones with Depth */}
      <section className="py-32 bg-background relative border-t border-border">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { num: "20+", label: "Years Experience" },
              { num: "25+", label: "Team Members" },
              { num: "9+", label: "Service Areas" },
              { num: "24/7", label: "Client Support" },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center p-8 rounded-3xl bg-card border border-border/50 shadow-lg shadow-primary/5 hover:border-primary/30 transition-colors"
              >
                <div className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-br from-foreground to-foreground/50 mb-4">{stat.num}</div>
                <div className="text-sm font-bold text-primary uppercase tracking-widest">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}