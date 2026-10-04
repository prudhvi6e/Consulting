import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Briefcase, ArrowRight, CheckCircle2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RevealGroup, RevealItem, WordReveal } from "@/components/motion/Reveal";
import { Magnetic } from "@/components/motion/Magnetic";
import { useQuery } from "@tanstack/react-query";
import { getJobs } from "@/lib/cms";

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
  const { data: cmsJobs } = useQuery({ queryKey: ["cms", "jobs"], queryFn: getJobs });
  const roles = cmsJobs?.length
    ? cmsJobs.map((j) => ({ id: j.id, title: j.title, department: (j as { department?: string }).department ?? "", experience: (j as { experience?: string }).experience ?? "", location: j.location, type: j.type }))
    : ROLES.map((r) => ({ id: "", ...r }));
  useEffect(() => {
    document.title = "Careers | PS Rao Corporate Solutions Pvt. Ltd.";
  }, []);

  return (
    <div className="w-full pt-20 bg-background overflow-hidden relative">
      {/* Background gradients */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-sky-400/15 rounded-full blur-[150px] mix-blend-screen pointer-events-none" />

      {/* Hero */}
      <section className="py-20 md:py-32 relative z-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              Join Our Firm
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-6 leading-tight">
              <WordReveal text="Build the future of" />{" "}
              <WordReveal text="corporate advisory." delay={0.25} className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-sky-300" />
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed mb-10">
              We are a next-generation advisory firm blending decades of human expertise with futuristic efficiency. Join us to navigate the most complex corporate challenges.
            </p>
            <div className="flex gap-4">
              <Magnetic>
                <Button data-cursor size="lg" className="rounded-full px-8 shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_30px_rgba(14,165,233,0.5)] transition-shadow" onClick={() => document.getElementById("open-roles")?.scrollIntoView({ behavior: "smooth" })}>
                  View Open Roles
                </Button>
              </Magnetic>
            </div>
          </div>
        </div>
      </section>

      {/* Culture & Benefits */}
      <section className="py-24 bg-card/50 border-y border-border relative z-10 backdrop-blur-sm">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-6">Culture of Excellence</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                At PS Rao Corporate Solutions Pvt. Ltd., we don't just advise; we partner. Our culture is built on deep intellectual curiosity, rigorous analysis, and a commitment to technological leverage. We empower our team with the best tools, including bespoke AI models, to deliver unparalleled accuracy and speed.
              </p>
              <RevealGroup className="grid grid-cols-1 sm:grid-cols-2 gap-4" stagger={0.08}>
                {BENEFITS.map((benefit, idx) => (
                  <RevealItem key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm font-medium text-foreground/80">{benefit}</span>
                  </RevealItem>
                ))}
              </RevealGroup>
            </div>
            <div className="relative h-[500px] rounded-3xl overflow-hidden bg-muted border border-border">
               {/* Abstract placeholder for culture image, using gradients */}
               <div className="absolute inset-0 bg-gradient-to-br from-secondary to-background" />
               <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.8)_0,transparent_100%)] mix-blend-overlay" />
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full border border-white/20 flex items-center justify-center backdrop-blur-md">
                     <Briefcase className="w-12 h-12 text-white/50" />
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Open Roles */}
      <section id="open-roles" className="py-24 bg-background relative z-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">Open Positions</h2>
            <p className="text-lg text-muted-foreground">Find where you belong. We are always looking for exceptional talent to join our practices.</p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {roles.map((role, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group flex flex-col md:flex-row md:items-center justify-between p-6 rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
              >
                <div className="mb-4 md:mb-0">
                  <h3 className="text-xl font-display font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{role.title}</h3>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground font-medium">
                    <span className="bg-secondary/5 px-2 py-1 rounded">{role.department}</span>
                    <span className="w-1 h-1 rounded-full bg-border" />
                    <span>{role.experience}</span>
                    <span className="w-1 h-1 rounded-full bg-border" />
                    <span>{role.location}</span>
                    <span className="w-1 h-1 rounded-full bg-border" />
                    <span>{role.type}</span>
                  </div>
                </div>
                <Button 
                  asChild
                  variant="outline" 
                  className="w-full md:w-auto rounded-full bg-background border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all group/btn"
                >
                  <Link href={role.id ? `/careers/apply/${role.id}` : "/careers/apply"}>
                    Apply Now <ChevronRight className="ml-2 w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <p className="text-muted-foreground">
              Don't see a perfect fit? <Link href="/careers/apply" className="text-primary hover:underline font-medium">Send us your profile</Link> or write to <a href="mailto:career@psrao.co.in" className="text-primary hover:underline font-medium">career@psrao.co.in</a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
