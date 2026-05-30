import { useEffect, useCallback, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Shield, Zap, Target, ArrowUpRight, TrendingUp, Building2, Briefcase, ChevronLeft, ChevronRight, CheckCircle, Scale, Cpu, Network, Sparkles } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";

import { Reveal } from "@/components/visual/Reveal";
import { TiltCard } from "@/components/visual/TiltCard";
import { Parallax } from "@/components/visual/Parallax";

import heroBg from "@/assets/images/hero-bg.png";
import officeAbstract from "@/assets/images/office-abstract.png";

// Capability Images
import capRestructuring from "@/assets/images/capability-restructuring.jpg";
import capMarkets from "@/assets/images/capability-markets.jpg";
import capForex from "@/assets/images/capability-forex.jpg";
import capGovernance from "@/assets/images/capability-governance.jpg";
import capDueDiligence from "@/assets/images/capability-duediligence.jpg";

// Industry Images
import indFinance from "@/assets/images/industry-finance.jpg";
import indTech from "@/assets/images/industry-tech.jpg";
import indHealthcare from "@/assets/images/industry-healthcare.jpg";
import indManufacturing from "@/assets/images/industry-manufacturing.jpg";
import indRealEstate from "@/assets/images/industry-realestate.jpg";
import indRetail from "@/assets/images/industry-retail.jpg";
import indEnergy from "@/assets/images/industry-energy.jpg";
import indStartup from "@/assets/images/industry-startup.jpg";

// Logos
import logo1 from "@/assets/images/logo-1.png";
import logo2 from "@/assets/images/logo-2.png";
import logo3 from "@/assets/images/logo-3.png";
import logo4 from "@/assets/images/logo-4.png";
import logo5 from "@/assets/images/logo-5.png";
import logo6 from "@/assets/images/logo-6.png";
import logo7 from "@/assets/images/logo-7.png";
import logo8 from "@/assets/images/logo-8.png";
import { cn } from "@/lib/utils";

const HERO_SLIDES = [
  {
    badge: "Next-Gen Advisory Firm",
    titleTop: "Professionals at work",
    titleAccent: "for you.",
    desc: "Minding your business as ours. We combine decades of specialized corporate law expertise with AI-augmented workflows to deliver unparalleled corporate governance, restructuring, and compliance solutions."
  },
  {
    badge: "Corporate Restructuring",
    titleTop: "Restructuring built",
    titleAccent: "for growth.",
    desc: "Pragmatic, effective strategies that help emerging and mid-cap companies navigate complex transitions, mergers, and reorganizations to unlock lasting value."
  },
  {
    badge: "Governance & Compliance",
    titleTop: "Governance you",
    titleAccent: "can trust.",
    desc: "Sound ethical standards and superior corporate governance frameworks that keep you compliant, credible, and ready for listing, scrutiny, and what comes next."
  },
  {
    badge: "Financial Markets",
    titleTop: "Capital markets,",
    titleAccent: "navigated.",
    desc: "End-to-end advisory across public issues, takeovers, insider trading, securities and FEMA, so you can move on opportunities with confidence and clarity."
  }
];

const CAPABILITIES = [
  {
    title: "Corporate Restructuring",
    desc: "Pragmatic, effective restructuring strategies for emerging and mid-cap companies facing complex transitions.",
    img: capRestructuring,
    link: "/services"
  },
  {
    title: "Financial Markets",
    desc: "Comprehensive advisory on public issues, takeovers, insider trading, and securities management.",
    img: capMarkets,
    link: "/services"
  },
  {
    title: "RBI & FOREX Laws",
    desc: "Guiding cross-border transactions, overseas investments, and FEMA compliances.",
    img: capForex,
    link: "/services"
  },
  {
    title: "Corporate Governance",
    desc: "Establishing sound ethical standards and superior governance frameworks for listing compliance.",
    img: capGovernance,
    link: "/services"
  },
  {
    title: "Legal Due Diligence",
    desc: "Meticulous verification of compliance, risks, and obligations prior to strategic investments and mergers.",
    img: capDueDiligence,
    link: "/services"
  }
];

const INDUSTRIES = [
  { name: "Finance & Banking", img: indFinance, icon: Building2 },
  { name: "Technology", img: indTech, icon: Zap },
  { name: "Healthcare & Pharma", img: indHealthcare, icon: Shield },
  { name: "Manufacturing", img: indManufacturing, icon: Target },
  { name: "Infrastructure", img: indRealEstate, icon: Building2 },
  { name: "Retail & FMCG", img: indRetail, icon: Briefcase },
  { name: "Energy", img: indEnergy, icon: Zap },
  { name: "Startups & Ventures", img: indStartup, icon: TrendingUp },
];

const LOGOS = [logo1, logo2, logo3, logo4, logo5, logo6, logo7, logo8];

export default function Home() {
  const prefersReducedMotion = useReducedMotion();
  
  useEffect(() => {
    document.title = "PS Rao & Associates | Corporate Advisors & Company Secretaries";
  }, []);

  // Embla Carousel Setup
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi || prefersReducedMotion) return;
    
    let autoplayInterval: NodeJS.Timeout;
    let isHovered = false;

    const play = () => {
      autoplayInterval = setInterval(() => {
        if (!isHovered && emblaApi) emblaApi.scrollNext();
      }, 5000);
    };

    const handleMouseEnter = () => { isHovered = true; };
    const handleMouseLeave = () => { isHovered = false; };

    const container = emblaApi.rootNode();
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    play();

    return () => {
      clearInterval(autoplayInterval);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [emblaApi, prefersReducedMotion]);

  // Hero Carousel Setup
  const [heroRef, heroApi] = useEmblaCarousel({ loop: true });
  const [heroSelected, setHeroSelected] = useState(0);

  useEffect(() => {
    if (!heroApi) return;
    const onSelect = () => setHeroSelected(heroApi.selectedScrollSnap());
    onSelect();
    heroApi.on("select", onSelect);
    return () => {
      heroApi.off("select", onSelect);
    };
  }, [heroApi]);

  useEffect(() => {
    if (!heroApi || prefersReducedMotion) return;

    let isHovered = false;
    const root = heroApi.rootNode();
    const onEnter = () => { isHovered = true; };
    const onLeave = () => { isHovered = false; };
    root.addEventListener("mouseenter", onEnter);
    root.addEventListener("mouseleave", onLeave);

    const interval = setInterval(() => {
      if (!isHovered) heroApi.scrollNext();
    }, 7000);

    return () => {
      clearInterval(interval);
      root.removeEventListener("mouseenter", onEnter);
      root.removeEventListener("mouseleave", onLeave);
    };
  }, [heroApi, prefersReducedMotion]);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative min-h-[100dvh] flex items-center overflow-hidden bg-transparent perspective-[1000px]">
        {/* Parallax Layers */}
        <Parallax offset={100} className="absolute inset-0 z-0">
          <img src={heroBg} alt="Abstract futuristic background" className="w-full h-full object-cover opacity-20 dark:opacity-10 mix-blend-screen scale-110" />
        </Parallax>

        <Parallax offset={200} className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] bg-primary/20 rounded-full blur-[100px] mix-blend-screen animate-aurora" />
          <div className="absolute bottom-1/4 right-1/4 w-[50vw] h-[50vw] max-w-[700px] max-h-[700px] bg-blue-400/10 rounded-full blur-[120px] mix-blend-screen animate-aurora-reverse" style={{ animationDelay: '-5s' }} />
        </Parallax>

        {/* Floating Glass Chips - Depth layer */}
        {!prefersReducedMotion && (
          <Parallax offset={-50} className="absolute inset-0 z-30 pointer-events-none hidden lg:block">
            <div className="absolute top-[16%] right-[4%] glass px-6 py-4 rounded-2xl flex items-center gap-4 animate-[float_6s_ease-in-out_infinite]">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Compliance</p>
                <p className="text-foreground font-display font-bold">24/7 Monitoring</p>
              </div>
            </div>
            
            <div className="absolute bottom-[18%] right-[4%] glass px-6 py-4 rounded-2xl flex items-center gap-4 animate-[float_8s_ease-in-out_infinite_reverse]">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Target className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Restructuring</p>
                <p className="text-foreground font-display font-bold">Strategic Growth</p>
              </div>
            </div>
          </Parallax>
        )}

        <div className="container mx-auto px-4 md:px-6 relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] as const }}
          >
            <div className="glass-panel rounded-[2.5rem] p-8 md:p-16 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
              <div className="overflow-hidden relative z-10" ref={heroRef}>
                <div className="flex">
                {HERO_SLIDES.map((slide, i) => (
                  <div key={i} className="flex-[0_0_100%] min-w-0">
                    <div className="max-w-4xl relative z-10">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/30 text-primary text-sm font-medium mb-8 shadow-[0_0_20px_rgba(46,107,255,0.2)]">
                        <span className="relative flex h-2 w-2">
                          {!prefersReducedMotion && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>}
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary shadow-[0_0_8px_rgba(46,107,255,1)]"></span>
                        </span>
                        {slide.badge}
                      </div>

                      <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight text-foreground mb-6 leading-[1.1] drop-shadow-sm">
                        {slide.titleTop} <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400 drop-shadow-md">{slide.titleAccent}</span>
                      </h1>

                      <p className="text-lg md:text-xl text-foreground/80 mb-10 max-w-2xl leading-relaxed font-light">
                        {slide.desc}
                      </p>

                      <div className="flex flex-wrap items-center gap-4">
                        <Link href="/services" className="inline-flex h-14 items-center justify-center rounded-full bg-primary px-8 text-sm font-medium text-primary-foreground shadow-[0_0_20px_rgba(46,107,255,0.4)] transition-all hover:shadow-[0_0_30px_rgba(46,107,255,0.6)] hover:bg-primary/90 hover:scale-105 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 group">
                          Explore Services
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link href="/contact" className="inline-flex h-14 items-center justify-center rounded-full glass px-8 text-sm font-medium shadow-sm transition-all hover:bg-white/20 hover:scale-105 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                          Consult With Us
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
                </div>
              </div>
              
              {/* Hero Slide Indicators */}
              <div className="flex items-center gap-3 mt-16 relative z-10" role="tablist" aria-label="Hero slides">
                {HERO_SLIDES.map((slide, i) => (
                  <button
                    key={i}
                    type="button"
                    role="tab"
                    onClick={() => heroApi?.scrollTo(i)}
                    aria-label={`Show: ${slide.badge}`}
                    aria-selected={heroSelected === i}
                    className={cn(
                      "h-2 rounded-full transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                      heroSelected === i ? "w-12 bg-primary shadow-[0_0_10px_rgba(46,107,255,0.8)]" : "w-2 bg-foreground/20 hover:bg-foreground/40"
                    )}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Marquee Section */}
      <section className="py-10 border-y border-white/10 glass overflow-hidden flex flex-col items-center group relative z-20 shadow-xl">
        <div className="container mx-auto px-4 md:px-6 mb-6">
          <p className="text-xs font-bold text-muted-foreground text-center tracking-widest uppercase">Trusted across sectors</p>
        </div>
        <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
          <div className={cn(
            "flex items-center justify-center md:justify-start [&_img]:max-w-none gap-16 md:gap-32",
            prefersReducedMotion ? "" : "animate-[marquee_40s_linear_infinite]"
          )}>
            {[...LOGOS, ...LOGOS, ...LOGOS].map((logo, i) => (
              <img 
                key={i} 
                src={logo} 
                alt="" 
                aria-hidden="true"
                className="h-10 md:h-12 w-auto object-contain opacity-40 dark:opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300 drop-shadow-md"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Showcase Carousel */}
      <section className="py-32 relative bg-transparent overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 mb-16 flex items-end justify-between relative z-10">
          <Reveal>
            <h2 className="text-sm font-bold text-primary tracking-widest uppercase mb-4 flex items-center gap-2">
              <span className="w-8 h-px bg-primary"></span> Flagship Capabilities
            </h2>
            <h3 className="text-4xl md:text-6xl font-display font-bold text-foreground">Excellence in Execution</h3>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="hidden md:flex gap-4">
              <button onClick={scrollPrev} className="h-14 w-14 rounded-full glass border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors shadow-lg" aria-label="Previous capability">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button onClick={scrollNext} className="h-14 w-14 rounded-full glass border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors shadow-lg" aria-label="Next capability">
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </Reveal>
        </div>
        
        <div className="pl-4 md:pl-6 lg:pl-[max(1.5rem,calc((100vw-1280px)/2))] relative z-10">
          <div className="overflow-visible" ref={emblaRef}>
            <div className="flex touch-pan-y -ml-4 pb-12 pt-4">
              {CAPABILITIES.map((cap, index) => (
                <div key={index} className="flex-[0_0_90%] md:flex-[0_0_50%] lg:flex-[0_0_35%] min-w-0 pl-4 relative">
                  <TiltCard className="h-full">
                    <div className="relative h-[500px] md:h-[650px] w-full rounded-[2.5rem] overflow-hidden bg-card border border-white/10 group shadow-2xl">
                      <img src={cap.img} alt={cap.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 group-hover:rotate-1 opacity-80" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                      
                      <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end z-20">
                        <div className="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                          <h4 className="text-3xl md:text-4xl font-display font-bold text-white mb-4 drop-shadow-md">{cap.title}</h4>
                          <p className="text-white/80 text-lg mb-8 max-w-lg leading-relaxed line-clamp-2 drop-shadow-sm font-light">{cap.desc}</p>
                          <Link href={cap.link} className="inline-flex items-center gap-2 text-white font-medium group/btn glass px-6 py-3 rounded-full w-fit hover:bg-white/20 transition-colors">
                            View details <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </TiltCard>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Industries Grid */}
      <section className="py-32 relative border-y border-white/10 glass-panel">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <Reveal className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-sm font-bold text-primary tracking-widest uppercase mb-4 flex items-center justify-center gap-2">
              <span className="w-8 h-px bg-primary"></span> Industries We Serve <span className="w-8 h-px bg-primary"></span>
            </h2>
            <h3 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-6">Cross-Sector Expertise</h3>
            <p className="text-xl text-muted-foreground font-light">Our specialized teams deliver tailored corporate advisory solutions across a wide spectrum of modern industries.</p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {INDUSTRIES.map((ind, i) => (
              <Reveal key={ind.name} delay={i * 0.1}>
                <TiltCard glow={true}>
                  <div className="group relative h-[350px] rounded-3xl overflow-hidden cursor-pointer border border-white/10 shadow-xl bg-card">
                    <img src={ind.img} alt={`Industry: ${ind.name}`} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-70 group-hover:opacity-90" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 transition-opacity duration-300 group-hover:from-black/95" />
                    <div className="absolute inset-0 p-8 flex flex-col justify-end z-20">
                      <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center mb-6 transform translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                        <ind.icon className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="text-2xl font-display font-bold text-white mb-3 drop-shadow-md">{ind.name}</h4>
                      <div className="h-1 w-0 bg-primary group-hover:w-16 transition-all duration-500 rounded-full shadow-[0_0_10px_rgba(46,107,255,0.8)]" />
                    </div>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* AI & Technology Section */}
      <section className="py-40 relative overflow-hidden bg-transparent">
        <Parallax offset={150} className="absolute top-1/2 left-0 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[1000px] max-h-[1000px] bg-primary/10 rounded-full blur-[150px] mix-blend-screen pointer-events-none" />
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <Reveal>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20 text-primary text-sm font-medium mb-8 shadow-[0_0_20px_rgba(46,107,255,0.15)]">
                <Sparkles className="w-4 h-4 animate-pulse" /> AI-Augmented Advisory
              </div>
              <h3 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-foreground mb-8 leading-[1.1]">
                Human Expertise. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400 drop-shadow-lg">Machine Precision.</span>
              </h3>
              <p className="text-xl text-foreground/80 leading-relaxed mb-10 font-light max-w-xl">
                We don't just interpret the law; we operationalize it. By integrating proprietary AI models and automated compliance workflows, we accelerate due diligence, monitor regulatory changes in real-time, and eliminate manual blind spots.
              </p>
              <div className="space-y-10">
                <div className="flex items-start gap-6 group">
                  <div className="h-16 w-16 rounded-2xl glass border border-white/20 flex items-center justify-center shrink-0 shadow-xl group-hover:bg-primary/10 transition-colors">
                    <Cpu className="w-8 h-8 text-primary drop-shadow-[0_0_10px_rgba(46,107,255,0.8)]" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-foreground mb-2">Automated Due Diligence</h4>
                    <p className="text-lg text-muted-foreground font-light leading-relaxed">Our models parse thousands of documents to identify risks and anomalies in minutes, ensuring no detail is overlooked.</p>
                  </div>
                </div>
                <div className="flex items-start gap-6 group">
                  <div className="h-16 w-16 rounded-2xl glass border border-white/20 flex items-center justify-center shrink-0 shadow-xl group-hover:bg-primary/10 transition-colors">
                    <Network className="w-8 h-8 text-primary drop-shadow-[0_0_10px_rgba(46,107,255,0.8)]" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-foreground mb-2">Real-time Regulatory Mapping</h4>
                    <p className="text-lg text-muted-foreground font-light leading-relaxed">Continuous monitoring of MCA, SEBI, and RBI notifications mapped directly to your company's obligations.</p>
                  </div>
                </div>
              </div>
            </Reveal>
            
            <Reveal delay={0.2} className="relative h-[700px]">
              <TiltCard className="h-full">
                <div className="relative h-full rounded-[3rem] overflow-hidden glass-panel p-2 shadow-2xl border border-white/20">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-blue-500/10 opacity-50" />
                  <div className="relative h-full w-full rounded-[2.5rem] bg-background/80 backdrop-blur-3xl overflow-hidden flex flex-col shadow-inner border border-white/10">
                    <div className="h-16 border-b border-white/10 flex items-center px-8 gap-3 glass">
                      <div className="w-4 h-4 rounded-full bg-destructive/80 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                      <div className="w-4 h-4 rounded-full bg-yellow-500/80 shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
                      <div className="w-4 h-4 rounded-full bg-green-500/80 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                    </div>
                    <div className="p-10 flex-1 flex flex-col gap-8 relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[80px] rounded-full pointer-events-none" />
                        <div className="flex justify-between items-end mb-4">
                          <div className="h-12 w-1/3 bg-primary/30 rounded-xl animate-pulse shadow-[0_0_15px_rgba(46,107,255,0.2)]" />
                          <div className="h-8 w-1/4 bg-foreground/10 rounded-full" />
                        </div>
                        <div className="space-y-6">
                          <div className="h-6 w-full bg-foreground/5 rounded-lg" />
                          <div className="h-6 w-5/6 bg-foreground/5 rounded-lg" />
                          <div className="h-6 w-4/6 bg-foreground/5 rounded-lg" />
                        </div>
                        <div className="mt-12 grid grid-cols-2 gap-8 relative z-10">
                          <div className="h-40 glass rounded-2xl border border-primary/30 p-6 flex flex-col justify-between shadow-[0_8px_32px_rgba(46,107,255,0.15)] group hover:bg-primary/5 transition-colors">
                            <div className="h-5 w-1/2 bg-primary/40 rounded-md" />
                            <div className="h-10 w-3/4 bg-primary/30 rounded-lg shadow-inner" />
                          </div>
                          <div className="h-40 glass rounded-2xl border border-blue-500/30 p-6 flex flex-col justify-between shadow-[0_8px_32px_rgba(59,130,246,0.15)] group hover:bg-blue-500/5 transition-colors">
                            <div className="h-5 w-1/2 bg-blue-500/40 rounded-md" />
                            <div className="h-10 w-3/4 bg-blue-500/30 rounded-lg shadow-inner" />
                          </div>
                        </div>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-32 relative border-t border-white/10 glass-panel">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <Reveal className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-sm font-bold text-primary tracking-widest uppercase mb-4 flex items-center justify-center gap-2">
              <span className="w-8 h-px bg-primary"></span> The PSR Advantage <span className="w-8 h-px bg-primary"></span>
            </h2>
            <h3 className="text-4xl md:text-6xl font-display font-bold text-foreground">Beyond Traditional Advisory</h3>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
              { icon: Shield, title: "Uncompromising Quality", desc: "Highest standards of performance and quality service, executing complex transactions within required timetables." },
              { icon: Zap, title: "Modern & Agile", desc: "A blend of extensive experience and innovative attitude, utilizing modern tech to work 24/7 for you." },
              { icon: Target, title: "Customized Structuring", desc: "Practical advice and business solutions designed specifically to maximize value and unlock growth potential." }
            ].map((feature, i) => (
              <Reveal key={i} delay={i * 0.15}>
                <TiltCard>
                  <div className="glass p-10 rounded-[2.5rem] border border-white/10 text-center flex flex-col items-center h-full hover:bg-white/5 transition-colors shadow-xl">
                    <div className="w-20 h-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-8 shadow-[0_0_20px_rgba(46,107,255,0.15)]">
                      <feature.icon className="w-10 h-10 text-primary drop-shadow-[0_0_10px_rgba(46,107,255,0.8)]" />
                    </div>
                    <h4 className="text-2xl font-display font-bold text-foreground mb-4">{feature.title}</h4>
                    <p className="text-muted-foreground leading-relaxed font-light text-lg">{feature.desc}</p>
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