import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Target, TrendingUp } from "lucide-react";
import officeAbstract from "@/assets/images/office-abstract.png";
import { Reveal } from "@/components/visual/Reveal";
import { TiltCard } from "@/components/visual/TiltCard";
import { Parallax } from "@/components/visual/Parallax";

export default function About() {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    document.title = "About Us | PS Rao & Associates";
  }, []);

  return (
    <div className="w-full pt-20 bg-transparent overflow-hidden">
      {/* Hero Section with Parallax */}
      <section className="relative min-h-[80vh] flex items-center glass-panel border-b border-white/10 overflow-hidden perspective-[1000px]">
        <Parallax offset={150} className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-card/80 via-card/50 to-transparent z-10" />
          <img src={officeAbstract} alt="Abstract" className="w-full h-full object-cover mix-blend-luminosity opacity-30 dark:opacity-20 scale-110" />
          <div className="absolute top-1/4 left-1/2 w-[80vw] h-[60vw] max-w-[1000px] max-h-[800px] bg-primary/20 rounded-full blur-[150px] mix-blend-screen animate-aurora" />
        </Parallax>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-5xl">
            <Reveal>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/30 text-primary text-sm font-medium mb-8 shadow-[0_0_20px_rgba(46,107,255,0.2)]">
                <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(46,107,255,1)] animate-pulse" />
                Our Firm
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-foreground mb-10 leading-[1.1] tracking-tight drop-shadow-md">
                Minding your business as <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400 drop-shadow-lg">ours.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-xl md:text-3xl text-foreground/80 leading-relaxed max-w-3xl font-light">
                We are a dynamic and progressive partnership firm of Company Secretaries, delivering value through a dedicated team of professionals with extensive experience across a broad range of disciplines.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Quote Section with Glow */}
      <section className="py-40 relative z-10">
        <Parallax offset={100} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[40vw] max-w-[800px] bg-blue-500/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="container mx-auto px-4 md:px-6 relative">
          <Reveal>
            <TiltCard glow={true}>
              <div className="max-w-5xl mx-auto text-center p-12 md:p-24 rounded-[3.5rem] glass border border-white/20 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
                <div className="text-primary text-9xl font-display leading-none mb-10 opacity-30 bg-clip-text text-transparent bg-gradient-to-b from-primary to-transparent drop-shadow-sm">"</div>
                <h2 className="text-3xl md:text-5xl font-display font-medium text-foreground mb-16 leading-snug tracking-tight">
                  Individual commitment to a group effort - that is what makes a team work, a company work, a society work, a civilization work.
                </h2>
                <p className="text-primary uppercase tracking-widest text-sm font-bold flex items-center justify-center gap-4">
                  <span className="w-12 h-px bg-primary/50" />
                  Vince Lombardi
                  <span className="w-12 h-px bg-primary/50" />
                </p>
              </div>
            </TiltCard>
          </Reveal>
        </div>
      </section>

      {/* Core Approach with Glassmorphism */}
      <section className="py-40 relative overflow-hidden glass-panel border-y border-white/10">
        <Parallax offset={50} className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('@/assets/images/office-abstract.png')] opacity-5 mix-blend-overlay object-cover scale-110" />
          <div className="absolute bottom-0 right-0 w-[60vw] h-[60vw] max-w-[1000px] bg-primary/20 rounded-full blur-[180px] pointer-events-none animate-aurora" />
        </Parallax>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <Reveal>
              <h3 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-foreground mb-12 tracking-tight">The PSR <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Approach</span></h3>
              <div className="space-y-10 text-foreground/80 text-xl leading-relaxed font-light">
                <p className="text-2xl text-foreground font-medium drop-shadow-sm">
                  Working with a team of professionals, committed to excel with sound knowledge and technology thereby unlocking the growth potential through required structuring.
                </p>
                <div className="w-24 h-px bg-gradient-to-r from-primary to-transparent" />
                <p>
                  Our customized services with outstanding delivery model provide long term sustainable wealth creation. Allied with this, we have considerable resources essential to enable us to successfully manage and drive forward transactions within the timetables required.
                </p>
                <p>
                  Each tailored assignment is undertaken by a team with the most appropriate blend of skills with the objective of providing the best professional advice available.
                </p>
              </div>
            </Reveal>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 relative">
              <Reveal delay={0.2} className="mt-0 sm:mt-12">
                <TiltCard className="h-full">
                  <div className="p-10 md:p-12 h-full rounded-[2.5rem] glass border border-white/20 flex flex-col gap-8 shadow-2xl hover:bg-white/10 transition-colors">
                    <div className="w-20 h-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-[0_0_20px_rgba(46,107,255,0.15)]">
                      <Target className="h-10 w-10 text-primary drop-shadow-[0_0_10px_rgba(46,107,255,0.8)]" />
                    </div>
                    <div>
                      <h4 className="text-3xl font-display font-bold text-foreground mb-4">Mission</h4>
                      <p className="text-lg text-foreground/70 leading-relaxed font-light">Help clients accomplish their Mission and Vision objectives with the highest standards of performance and quality service.</p>
                    </div>
                  </div>
                </TiltCard>
              </Reveal>
              
              <Reveal delay={0.4}>
                <TiltCard className="h-full">
                  <div className="p-10 md:p-12 h-full rounded-[2.5rem] glass border border-white/20 flex flex-col gap-8 shadow-2xl hover:bg-white/10 transition-colors">
                    <div className="w-20 h-20 rounded-3xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.15)]">
                      <TrendingUp className="h-10 w-10 text-blue-500 drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                    </div>
                    <div>
                      <h4 className="text-3xl font-display font-bold text-foreground mb-4">Vision</h4>
                      <p className="text-lg text-foreground/70 leading-relaxed font-light">Unlock growth potential by maximizing value through extensive professional advice and sustain an enriching environment.</p>
                    </div>
                  </div>
                </TiltCard>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Stats/Milestones with Depth */}
      <section className="py-32 bg-transparent relative">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
            {[
              { num: "20+", label: "Years Experience" },
              { num: "25+", label: "Team Members" },
              { num: "9+", label: "Service Areas" },
              { num: "24/7", label: "Client Support" },
            ].map((stat, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <TiltCard>
                  <div className="text-center p-10 md:p-12 rounded-[2.5rem] glass border border-white/10 shadow-xl hover:bg-white/5 transition-colors group">
                    <div className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-b from-foreground to-foreground/30 mb-6 drop-shadow-md group-hover:from-primary group-hover:to-blue-400/50 transition-all duration-500">{stat.num}</div>
                    <div className="text-sm font-bold text-primary uppercase tracking-widest flex items-center justify-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary" /> {stat.label}
                    </div>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}