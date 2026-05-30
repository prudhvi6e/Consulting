import { useEffect, useCallback, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Shield, Zap, Target, ArrowUpRight, TrendingUp, Building2, Briefcase, ChevronLeft, ChevronRight, CheckCircle, Scale } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";

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
      <section className="relative min-h-[90vh] flex items-center pt-20 pb-20 overflow-hidden bg-background">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background z-10" />
          <img src={heroBg} alt="Abstract futuristic background" className="w-full h-full object-cover opacity-30 dark:opacity-20" />
          
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] mix-blend-screen animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-blue-400/10 rounded-full blur-[120px] mix-blend-screen" />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
          >
            <div className="overflow-hidden" ref={heroRef}>
              <div className="flex">
                {HERO_SLIDES.map((slide, i) => (
                  <div key={i} className="flex-[0_0_100%] min-w-0">
                    <div className="max-w-4xl">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
                        <span className="relative flex h-2 w-2">
                          {!prefersReducedMotion && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>}
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        {slide.badge}
                      </div>

                      <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight text-foreground mb-6 leading-[1.1]">
                        {slide.titleTop} <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">{slide.titleAccent}</span>
                      </h1>

                      <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed">
                        {slide.desc}
                      </p>

                      <div className="flex flex-wrap items-center gap-4">
                        <Link href="/services" className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 group">
                          Explore Services
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link href="/contact" className="inline-flex h-12 items-center justify-center rounded-md border border-input bg-background/50 backdrop-blur-sm px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                          Consult With Us
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Slide Indicators */}
            <div className="flex items-center gap-2 mt-12" role="tablist" aria-label="Hero slides">
              {HERO_SLIDES.map((slide, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  onClick={() => heroApi?.scrollTo(i)}
                  aria-label={`Show: ${slide.badge}`}
                  aria-selected={heroSelected === i}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    heroSelected === i ? "w-8 bg-primary" : "w-2 bg-foreground/20 hover:bg-foreground/40"
                  )}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Marquee Section */}
      <section className="py-12 border-y border-border bg-card/30 overflow-hidden flex flex-col items-center group">
        <div className="container mx-auto px-4 md:px-6 mb-8">
          <p className="text-sm font-medium text-muted-foreground text-center tracking-widest uppercase">Trusted across sectors</p>
        </div>
        <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
          <div className={cn(
            "flex items-center justify-center md:justify-start [&_img]:max-w-none gap-16 md:gap-32",
            prefersReducedMotion ? "" : "animate-[marquee_30s_linear_infinite] group-hover:[animation-play-state:paused]"
          )}>
            {[...LOGOS, ...LOGOS, ...LOGOS].map((logo, i) => (
              <img 
                key={i} 
                src={logo} 
                alt="" 
                aria-hidden="true"
                className="h-10 md:h-12 w-auto object-contain opacity-50 dark:opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Showcase Carousel */}
      <section className="py-24 bg-background relative">
        <div className="container mx-auto px-4 md:px-6 mb-12 flex items-end justify-between">
          <div>
            <h2 className="text-sm font-medium text-primary tracking-wider uppercase mb-2">Flagship Capabilities</h2>
            <h3 className="text-3xl md:text-5xl font-display font-bold text-foreground">Excellence in Execution</h3>
          </div>
          <div className="hidden md:flex gap-3">
            <button onClick={scrollPrev} className="h-12 w-12 rounded-full border border-border flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors" aria-label="Previous capability">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={scrollNext} className="h-12 w-12 rounded-full border border-border flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors" aria-label="Next capability">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="pl-4 md:pl-6 lg:pl-[max(1.5rem,calc((100vw-1280px)/2))]">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex touch-pan-y -ml-4">
              {CAPABILITIES.map((cap, index) => (
                <div key={index} className="flex-[0_0_90%] md:flex-[0_0_60%] lg:flex-[0_0_40%] min-w-0 pl-4 relative group">
                  <div className="relative h-[450px] md:h-[600px] w-full rounded-2xl md:rounded-3xl overflow-hidden bg-muted">
                    <img src={cap.img} alt={cap.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end">
                      <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                        <h4 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">{cap.title}</h4>
                        <p className="text-white/80 text-lg mb-8 max-w-lg leading-relaxed line-clamp-2">{cap.desc}</p>
                        <Link href={cap.link} className="inline-flex items-center gap-2 text-white font-medium group/btn">
                          View details <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Industries Grid */}
      <section className="py-24 bg-card border-y border-border">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-medium text-primary tracking-wider uppercase mb-2">Industries We Serve</h2>
            <h3 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-6">Cross-Sector Expertise</h3>
            <p className="text-lg text-muted-foreground">Our specialized teams deliver tailored corporate advisory solutions across a wide spectrum of modern industries.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {INDUSTRIES.map((ind, i) => (
              <motion.div
                key={ind.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.5 } }
                }}
                className="group relative h-[300px] rounded-2xl overflow-hidden cursor-pointer"
              >
                <img src={ind.img} alt={`Industry: ${ind.name}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/10 transition-opacity duration-300 group-hover:from-black/95" />
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mb-4 border border-white/20 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <ind.icon className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="text-xl font-display font-bold text-white mb-2">{ind.name}</h4>
                  <div className="h-0.5 w-0 bg-primary group-hover:w-12 transition-all duration-300" />
                </div>
              </motion.div>
            ))}
          </div>
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
              { icon: Zap, title: "Modern & Agile", desc: "A blend of extensive experience and innovative attitude, utilizing modern tech to work 24/7 for you." },
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
              <h3 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">Comprehensive Solutions</h3>
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
