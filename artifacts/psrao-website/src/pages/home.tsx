import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, ChevronRight, Shield, Zap, Target, Globe, ArrowUpRight } from "lucide-react";
import heroBg from "@/assets/images/hero-bg.png";
import officeAbstract from "@/assets/images/office-abstract.png";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Home() {
  useEffect(() => {
    document.title = "PS Rao & Associates | Corporate Advisors & Company Secretaries";
  }, []);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-20 pb-20 overflow-hidden bg-background">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background z-10" />
          <img src={heroBg} alt="Abstract futuristic background" className="w-full h-full object-cover opacity-30 dark:opacity-20" />
          
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] mix-blend-screen animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-blue-400/10 rounded-full blur-[120px] mix-blend-screen" />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-4xl"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Next-Gen Advisory Firm
            </motion.div>
            
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight text-foreground mb-6 leading-[1.1]">
              Professionals at work <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">for you.</span>
            </motion.h1>
            
            <motion.p variants={fadeInUp} className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed">
              Minding your business as ours. We combine decades of specialized corporate law expertise with AI-augmented workflows to deliver unparalleled corporate governance, restructuring, and compliance solutions.
            </motion.p>
            
            <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-4">
              <Link href="/services" className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 group">
                Explore Services
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/contact" className="inline-flex h-12 items-center justify-center rounded-md border border-input bg-background/50 backdrop-blur-sm px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                Consult With Us
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Marquee Section */}
      <section className="py-10 border-y border-border bg-card/50 overflow-hidden flex items-center">
        <div className="container mx-auto px-4 md:px-6 mb-4">
          <p className="text-sm font-medium text-muted-foreground text-center tracking-widest uppercase mb-6">Trusted By Forward-Thinking Enterprises</p>
        </div>
        <div className="flex w-[200%] animate-[marquee_20s_linear_infinite] opacity-50 dark:opacity-30 items-center justify-around gap-16 md:gap-32">
          {['FINANCE', 'TECHNOLOGY', 'HEALTHCARE', 'MANUFACTURING', 'INFRASTRUCTURE', 'RETAIL', 'FINANCE', 'TECHNOLOGY'].map((text, i) => (
            <span key={i} className="text-2xl md:text-4xl font-display font-bold text-foreground tracking-widest">{text}</span>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-background relative">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-medium text-primary tracking-wider uppercase mb-2">The PSR Advantage</h2>
            <h3 className="text-3xl md:text-5xl font-display font-bold text-foreground">Beyond Traditional Advisory</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: "Uncompromising Quality", desc: "Highest standards of performance and quality service, executing complex transactions within required timetables." },
              { icon: Zap, title: "Modern & Agile", desc: "A blend of extensive experience and innovative attitude, utilizing AI and modern tech to work 24/7 for you." },
              { icon: Target, title: "Customized Structuring", desc: "Practical advice and business solutions designed specifically to maximize value and unlock growth potential." }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }
                }}
                className="group p-8 rounded-2xl border border-border bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h4 className="text-xl font-display font-bold text-foreground mb-3">{feature.title}</h4>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-24 bg-secondary text-secondary-foreground relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-sm font-medium text-primary tracking-wider uppercase mb-2">Our Expertise</h2>
              <h3 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">Comprehensive Corporate Solutions</h3>
              <p className="text-secondary-foreground/70 text-lg">We deliver value through a dedicated team of professionals with extensive experience across a broad range of disciplines.</p>
            </div>
            <Link href="/services" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium border border-white/20 hover:bg-white/10 hover:text-white h-11 px-8 py-2 transition-colors">
              View All Services
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "Company Law & Secretarial",
              "Corporate Restructuring",
              "Financial Markets",
              "Legal Due Diligence",
              "RBI & FOREX Laws",
              "Corporate Governance"
            ].map((service, i) => (
              <Link key={i} href="/services" className="group p-8 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/50 transition-all duration-300 block">
                <div className="flex justify-between items-start mb-12">
                  <span className="text-5xl font-display font-light text-white/20 group-hover:text-primary/40 transition-colors">0{i+1}</span>
                  <ArrowUpRight className="h-6 w-6 text-white/40 group-hover:text-primary transition-colors transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                </div>
                <h4 className="text-xl font-display font-bold text-white mb-2">{service}</h4>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden bg-background">
        <div className="absolute inset-0 opacity-10">
           <img src={officeAbstract} alt="Abstract" className="w-full h-full object-cover mix-blend-luminosity" />
        </div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="bg-primary/5 border border-primary/20 rounded-3xl p-10 md:p-20 text-center max-w-4xl mx-auto backdrop-blur-sm">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-6">Ready to transform your corporate governance?</h2>
            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">Get in touch with our team of experts to discuss how we can help you navigate complex regulatory environments and unlock growth.</p>
            <Link href="/contact" className="inline-flex h-14 items-center justify-center rounded-full bg-primary px-10 text-base font-medium text-primary-foreground shadow transition-all hover:bg-primary/90 hover:scale-105 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
              Schedule a Consultation <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
