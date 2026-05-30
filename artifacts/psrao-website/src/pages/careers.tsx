import { useEffect } from "react";
import { useReducedMotion } from "framer-motion";
import { Briefcase, ArrowRight, CheckCircle2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/visual/Reveal";
import { TiltCard } from "@/components/visual/TiltCard";
import { Parallax } from "@/components/visual/Parallax";

const ROLES = [
  {
    title: "Company Secretary",
    department: "Corporate Governance",
    experience: "3-5 years",
    location: "Hyderabad",
    type: "Full-time"
  },
  {
    title: "Associate – Securities Law",
    department: "Capital Markets",
    experience: "1-3 years",
    location: "Hyderabad",
    type: "Full-time"
  },
  {
    title: "Paralegal",
    department: "Legal Due Diligence",
    experience: "0-2 years",
    location: "Hyderabad",
    type: "Full-time"
  },
  {
    title: "Articleship",
    department: "Trainee Program",
    experience: "Fresher",
    location: "Hyderabad",
    type: "Internship"
  }
];

const BENEFITS = [
  "Continuous learning and professional development",
  "Exposure to complex corporate restructuring & capital markets",
  "Mentorship from industry veterans",
  "Modern, AI-augmented workflows and tools",
  "Performance-driven career progression",
  "Comprehensive health and wellness benefits"
];

export default function Careers() {
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    document.title = "Careers | PS Rao & Associates";
  }, []);

  return (
    <div className="w-full pt-20 bg-transparent overflow-hidden relative">
      <Parallax offset={150} className="absolute top-0 right-0 w-[60vw] max-w-[800px] h-[60vw] max-h-[800px] bg-blue-500/15 rounded-full blur-[180px] mix-blend-screen pointer-events-none animate-aurora" />

      {/* Hero */}
      <section className="py-24 md:py-40 relative z-10 glass-panel border-b border-white/10 shadow-xl">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl">
            <Reveal>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/30 text-primary text-sm font-medium mb-8 shadow-[0_0_20px_rgba(46,107,255,0.2)]">
                <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(46,107,255,1)] animate-pulse" />
                Join Our Firm
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="text-6xl md:text-8xl font-display font-bold text-foreground mb-8 leading-[1.1] tracking-tight drop-shadow-md">
                Build the future of <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400 drop-shadow-lg">corporate advisory.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-2xl text-foreground/80 leading-relaxed mb-12 font-light max-w-3xl">
                We are a next-generation advisory firm blending decades of human expertise with futuristic efficiency. Join us to navigate the most complex corporate challenges.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <Button size="lg" className="rounded-full h-14 px-10 text-base font-bold shadow-[0_0_20px_rgba(46,107,255,0.4)] hover:shadow-[0_0_30px_rgba(46,107,255,0.6)] transition-all hover:scale-105" onClick={() => document.getElementById("open-roles")?.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth" })}>
                View Open Roles
              </Button>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Culture & Benefits */}
      <section className="py-32 relative z-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <Reveal>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-8 drop-shadow-sm">Culture of Excellence</h2>
              <p className="text-xl text-foreground/80 leading-relaxed mb-12 font-light">
                At PS Rao & Associates, we don't just advise; we partner. Our culture is built on deep intellectual curiosity, rigorous analysis, and a commitment to technological leverage. We empower our team with the best tools, including bespoke AI models, to deliver unparalleled accuracy and speed.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {BENEFITS.map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl glass border border-white/10 hover:bg-white/5 transition-colors">
                    <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-0.5 drop-shadow-[0_0_8px_rgba(46,107,255,0.6)]" />
                    <span className="text-base font-medium text-foreground/90 leading-snug">{benefit}</span>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <TiltCard>
                <div className="relative h-[600px] rounded-[3.5rem] overflow-hidden glass border border-white/20 shadow-2xl">
                   <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-blue-500/10 mix-blend-overlay" />
                   <div className="absolute inset-0 bg-[url('@/assets/images/office-abstract.png')] opacity-30 mix-blend-luminosity object-cover scale-110" />
                   <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-40 h-40 rounded-full glass border border-white/30 flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.1)]">
                         <Briefcase className="w-16 h-16 text-foreground drop-shadow-md" />
                      </div>
                   </div>
                </div>
              </TiltCard>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Open Roles */}
      <section id="open-roles" className="py-32 relative z-10 glass-panel border-t border-white/10">
        <div className="container mx-auto px-4 md:px-6">
          <Reveal className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-5xl md:text-6xl font-display font-bold text-foreground mb-6 drop-shadow-sm">Open Positions</h2>
            <p className="text-2xl text-foreground/70 font-light">Find where you belong. We are always looking for exceptional talent to join our practices.</p>
          </Reveal>

          <div className="max-w-4xl mx-auto space-y-6">
            {ROLES.map((role, idx) => (
              <Reveal key={idx} delay={idx * 0.1}>
                <TiltCard glow={true}>
                  <div className="group flex flex-col md:flex-row md:items-center justify-between p-8 md:p-10 rounded-[2.5rem] glass border border-white/10 hover:border-primary/40 hover:shadow-[0_15px_30px_rgba(46,107,255,0.15)] transition-all duration-500">
                    <div className="mb-8 md:mb-0 relative z-10">
                      <h3 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4 group-hover:text-primary transition-colors">{role.title}</h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-foreground/80 font-bold uppercase tracking-wider">
                        <span className="bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 rounded-full shadow-inner">{role.department}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                        <span>{role.experience}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                        <span>{role.location}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                        <span>{role.type}</span>
                      </div>
                    </div>
                    <Button 
                      asChild
                      className="w-full md:w-auto h-14 rounded-full glass border border-white/20 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all group/btn shadow-md text-base font-bold relative z-10"
                    >
                      <a href={`mailto:info@psraoassociates.com?subject=Application for ${role.title}`}>
                        Apply Now <ChevronRight className="ml-2 w-5 h-5 transform group-hover/btn:translate-x-1 transition-transform" />
                      </a>
                    </Button>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
          
          <Reveal delay={0.4} className="mt-24 text-center glass p-10 rounded-[2.5rem] max-w-2xl mx-auto border border-white/10 shadow-lg">
            <p className="text-xl text-foreground/80 font-light">
              Don't see a perfect fit? Send your resume to <br/><a href="mailto:info@psraoassociates.com" className="text-primary hover:underline font-bold mt-2 inline-block">info@psraoassociates.com</a>
            </p>
          </Reveal>
        </div>
      </section>
    </div>
  );
}