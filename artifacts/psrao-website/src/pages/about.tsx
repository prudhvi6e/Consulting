import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, TrendingUp, Users, Target } from "lucide-react";
import officeAbstract from "@/assets/images/office-abstract.jpg";
import { Counter } from "@/components/motion/Counter";
import { Reveal, WordReveal } from "@/components/motion/Reveal";
import { Parallax } from "@/components/motion/Parallax";
import { TiltCard } from "@/components/motion/TiltCard";

type Milestone = { label: string; to?: number; suffix?: string; value?: string };
const MILESTONES: Milestone[] = [
  { to: 20, suffix: "+", label: "Years Experience" },
  { to: 25, suffix: "+", label: "Team Members" },
  { to: 9, suffix: "+", label: "Service Areas" },
  { value: "24/7", label: "Client Support" },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

export default function About() {
  useEffect(() => {
    document.title = "About Us | PS Rao Corporate Solutions";
  }, []);

  return (
    <div className="w-full pt-20">
      {/* Header */}
      <section className="py-20 md:py-32 bg-card border-b border-border relative overflow-hidden">
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-card z-10" />
          <Parallax speed={0.25} className="w-full h-full">
            <img src={officeAbstract} alt="" aria-hidden className="w-full h-full object-cover scale-125" />
          </Parallax>
        </div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-3xl">
            <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl font-display font-bold text-foreground mb-6">
              Minding your business as <span className="text-primary">ours.</span>
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-xl text-muted-foreground leading-relaxed">
              We are a dynamic and progressive partnership firm of Company Secretaries, delivering value through a dedicated team of professionals with extensive experience across a broad range of disciplines.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <Reveal className="max-w-4xl mx-auto text-center">
            <div className="text-primary text-6xl font-display leading-none mb-4 opacity-50">"</div>
            <h2 className="text-2xl md:text-4xl font-display font-medium text-foreground mb-8 leading-snug">
              <WordReveal text="Individual commitment to a group effort - that is what makes a team work, a company work, a society work, a civilization work." />
            </h2>
            <p className="text-muted-foreground uppercase tracking-widest text-sm font-medium">— Vince Lombardi</p>
          </Reveal>
        </div>
      </section>

      {/* Core Approach */}
      <section className="py-24 bg-secondary text-secondary-foreground relative">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h3 className="text-3xl md:text-4xl font-display font-bold text-white mb-6"><WordReveal text="Our Approach" /></h3>
              <div className="space-y-6 text-secondary-foreground/80 text-lg leading-relaxed">
                <p>
                  Working with a team of professionals, committed to excel with sound knowledge and technology thereby unlocking the growth potential through required structuring.
                </p>
                <p>
                  Our customized services with outstanding delivery model provide long term sustainable wealth creation. Allied with this, we have considerable resources essential to enable us to successfully manage and drive forward transactions within the timetables required.
                </p>
                <p>
                  Each tailored assignment is undertaken by a team with the most appropriate blend of skills with the objective of providing the best professional advice available.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Reveal direction="up" delay={0.05}>
                <TiltCard max={7} className="p-8 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-4 h-full">
                  <Target className="h-8 w-8 text-primary" />
                  <h4 className="text-xl font-display font-bold text-white">Mission</h4>
                  <p className="text-sm text-secondary-foreground/70">Help clients accomplish their Mission and Vision objectives with the highest standards of performance and quality service.</p>
                </TiltCard>
              </Reveal>
              <Reveal direction="up" delay={0.15} className="mt-0 sm:mt-12">
                <TiltCard max={7} className="p-8 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-4 h-full">
                  <TrendingUp className="h-8 w-8 text-primary" />
                  <h4 className="text-xl font-display font-bold text-white">Vision</h4>
                  <p className="text-sm text-secondary-foreground/70">Unlock growth potential by maximizing value through extensive professional advice and sustain an enriching environment.</p>
                </TiltCard>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Stats/Milestones */}
      <section className="py-20 bg-background border-b border-border">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-border">
            {MILESTONES.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 0.1} className="text-center px-4">
                <div className="text-4xl md:text-5xl font-display font-bold text-foreground mb-2">
                  {stat.value ? stat.value : <Counter to={stat.to!} suffix={stat.suffix} />}
                </div>
                <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
