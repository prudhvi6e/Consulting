import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, Shield, Zap, Target, ArrowUpRight, TrendingUp, Building2, Briefcase, ChevronLeft, ChevronRight, CheckCircle, Scale, Sprout, HardHat, GraduationCap, Landmark, Rocket, HeartPulse, Cpu, Umbrella, Factory, Clapperboard, Pill, ShoppingBag, RadioTower, Truck } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { useQuery } from "@tanstack/react-query";

import officeAbstract from "@/assets/images/office-abstract.jpg";

// Capability Images
import capRestructuring from "@/assets/images/capability-restructuring.jpg";
import capMarkets from "@/assets/images/capability-markets.jpg";
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
import indAgri from "@/assets/images/james-baltz-jAt6cN6zl8M-unsplash.jpg";
import indDefence from "@/assets/images/Defence.jpg";
import indEducation from "@/assets/images/Education.jpg";
import indInsurance from "@/assets/images/Insurance.jpg";
import indEntertainment from "@/assets/images/Entertainment.jpg";
import indPharma from "@/assets/images/Pharma.jpg";
import indTelecom from "@/assets/images/Telecom.jpg";
import indInfra from "@/assets/images/Trans & infra.jpg";

import { cn } from "@/lib/utils";
import { WebGLHero } from "@/components/motion/WebGLHero";
import { Counter } from "@/components/motion/Counter";
import { Magnetic } from "@/components/motion/Magnetic";
import { TiltCard } from "@/components/motion/TiltCard";
import { Reveal, WordReveal } from "@/components/motion/Reveal";
import { Parallax } from "@/components/motion/Parallax";
import { getHeroSlides, getCapabilities, getIndustries, getStats, getClientLogos, assetUrl } from "@/lib/cms";
import { getIcon } from "@/lib/icons";

// Real client logos (downloaded from the firm's CMS into src/assets/clients).
const clientLogoModules = import.meta.glob("../assets/clients/*.{png,jpg,jpeg,webp}", {
  eager: true,
  query: "?url",
  import: "default",
});
const LOGOS = Object.entries(clientLogoModules)
  .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
  .map(([, url]) => url as string);

// Hero banner slides. To add/replace a banner: import an image at the top of this
// file and set it as `image` here (or add a whole new slide object). The carousel,
// autoplay, arrows, dots and crossfading photo backdrop all pick it up automatically.
const HERO_SLIDES = [
  {
    badge: "Next-Gen Advisory Firm",
    titleTop: "Professionals at work",
    titleAccent: "for you.",
    desc: "Minding your business as ours. We combine decades of specialized corporate law expertise with AI-augmented workflows to deliver unparalleled corporate governance, restructuring, and compliance solutions.",
    image: officeAbstract,
  },
  {
    badge: "Corporate Restructuring",
    titleTop: "Restructuring built",
    titleAccent: "for growth.",
    desc: "Pragmatic, effective strategies that help emerging and mid-cap companies navigate complex transitions, mergers, and reorganizations to unlock lasting value.",
    image: capRestructuring,
  },
  {
    badge: "Governance & Compliance",
    titleTop: "Governance you",
    titleAccent: "can trust.",
    desc: "Sound ethical standards and superior corporate governance frameworks that keep you compliant, credible, and ready for listing, scrutiny, and what comes next.",
    image: capGovernance,
  },
  {
    badge: "Financial Markets",
    titleTop: "Capital markets,",
    titleAccent: "navigated.",
    desc: "End-to-end advisory across public issues, takeovers, insider trading, securities and FEMA, so you can move on opportunities with confidence and clarity.",
    image: capMarkets,
  }
];

// Bento-grid flagship capabilities. `span` controls the tile footprint.
const CAPABILITIES = [
  {
    title: "Corporate Restructuring",
    desc: "Pragmatic, effective restructuring strategies for emerging and mid-cap companies navigating complex transitions, mergers and demergers.",
    img: capRestructuring,
    icon: Scale,
    span: "col-span-2 md:col-span-1 md:row-span-2",
    big: true,
  },
  {
    title: "Capital Markets",
    desc: "Public issues, takeovers, insider trading and securities.",
    img: capMarkets,
    icon: TrendingUp,
    span: "",
    big: false,
  },
  {
    title: "RBI & FEMA",
    desc: "Cross-border transactions, overseas investment and approvals.",
    img: indFinance,
    icon: Landmark,
    span: "",
    big: false,
  },
  {
    title: "Corporate Governance",
    desc: "Sound ethical standards and superior governance frameworks for listing compliance and board confidence.",
    img: capGovernance,
    icon: Briefcase,
    span: "col-span-2",
    big: false,
  },
  {
    title: "Legal Due Diligence",
    desc: "Meticulous verification of compliance, risks and obligations ahead of strategic investments and mergers.",
    img: capDueDiligence,
    icon: Shield,
    span: "col-span-2",
    big: false,
  },
];

// All sectors shown as photo cards
const INDUSTRIES = [
  { name: "Financial Institutions", img: indFinance, icon: Landmark },
  { name: "Information Technology", img: indTech, icon: Cpu },
  { name: "Health & Personal Care", img: indHealthcare, icon: HeartPulse },
  { name: "Pharmaceutical", img: indPharma, icon: Pill },
  { name: "Manufacturing", img: indManufacturing, icon: Factory },
  { name: "Construction & Engineering", img: indRealEstate, icon: HardHat },
  { name: "Transportation & Infrastructure", img: indInfra, icon: Truck },
  { name: "Energy", img: indEnergy, icon: Zap },
  { name: "Retail & Franchising", img: indRetail, icon: ShoppingBag },
  { name: "Venture Capital & Angel Investors", img: indStartup, icon: Rocket },
  { name: "Agriculture & Plantations", img: indAgri, icon: Sprout },
  { name: "Defence", img: indDefence, icon: Shield },
  { name: "Education", img: indEducation, icon: GraduationCap },
  { name: "Insurance", img: indInsurance, icon: Umbrella },
  { name: "Media & Entertainment", img: indEntertainment, icon: Clapperboard },
  { name: "Telecom & Broadcasting", img: indTelecom, icon: RadioTower },
];

const STATS = [
  { to: 60, suffix: "+", label: "Clients Served" },
  { to: 80, suffix: "+", label: "Projects Delivered" },
  { to: 30, suffix: "+", label: "Compliance Reports" },
];

export default function Home() {
  const prefersReducedMotion = useReducedMotion();
  
  useEffect(() => {
    document.title = "PS Rao Corporate Solutions | Corporate Advisors & Company Secretaries";
  }, []);

  // Hero Carousel Setup
  const [heroRef, heroApi] = useEmblaCarousel({ loop: true });
  const [heroSelected, setHeroSelected] = useState(0);

  // CMS content; each falls back to the bundled defaults if the CMS is unreachable.
  const { data: cmsHero } = useQuery({ queryKey: ["cms", "hero"], queryFn: getHeroSlides });
  const { data: cmsCaps } = useQuery({ queryKey: ["cms", "capabilities"], queryFn: getCapabilities });
  const { data: cmsInds } = useQuery({ queryKey: ["cms", "industries"], queryFn: getIndustries });
  const { data: cmsStats } = useQuery({ queryKey: ["cms", "stats"], queryFn: getStats });
  const { data: cmsLogos } = useQuery({ queryKey: ["cms", "logos"], queryFn: getClientLogos });

  const heroSlides = cmsHero?.length
    ? cmsHero.map((s) => ({ badge: s.badge, titleTop: s.titleTop, titleAccent: s.titleAccent, desc: s.desc, image: assetUrl(s.image), showWater: s.showWater }))
    : HERO_SLIDES.map((s, i) => ({ ...s, showWater: i === 0 }));
  const caps = cmsCaps?.length
    ? cmsCaps.map((c) => ({ title: c.title, desc: c.desc, img: assetUrl(c.image), icon: getIcon(c.icon), span: c.span ?? "", big: c.big }))
    : CAPABILITIES;
  const inds = cmsInds?.length
    ? cmsInds.map((x) => ({ name: x.name, img: assetUrl(x.image), icon: getIcon(x.icon) }))
    : INDUSTRIES;
  const stats = cmsStats?.length
    ? cmsStats.map((s) => ({ to: s.value, suffix: s.suffix ?? "", label: s.label }))
    : STATS;
  const logos = cmsLogos?.length ? cmsLogos.map((l) => assetUrl(l.image)) : LOGOS;

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
          {/* Banner photos — crossfade in sync with the carousel */}
          {heroSlides.map((slide, i) => (
            <img
              key={i}
              src={slide.image}
              alt=""
              aria-hidden
              className={cn(
                "absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-out",
                heroSelected === i ? "opacity-100" : "opacity-0"
              )}
            />
          ))}
          {/* Floating water effect — shown on the first slide only; the rest are clean photo banners */}
          <WebGLHero
            className={cn(
              "absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-700",
              heroSlides[heroSelected]?.showWater ? "opacity-100" : "opacity-0"
            )}
          />
          {/* Legibility: white sits mainly behind the left-side text; the photo stays vivid on the right */}
          <div className="absolute inset-0 z-10 bg-gradient-to-r from-background via-background/55 to-transparent" />
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-background/85 to-transparent to-[40%]" />

          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] mix-blend-screen animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-sky-400/15 rounded-full blur-[120px] mix-blend-screen" />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
          >
            <div className="overflow-hidden" ref={heroRef}>
              <div className="flex">
                {heroSlides.map((slide, i) => (
                  <div key={i} className="flex-[0_0_100%] min-w-0">
                    <div className="max-w-4xl">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
                        <span className="relative flex h-2 w-2">
                          {!prefersReducedMotion && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>}
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        {slide.badge}
                      </div>

                      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight text-foreground mb-6 leading-[1.1]">
                        <span className="block">{slide.titleTop}</span>
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-sky-300">{slide.titleAccent}</span>
                      </h1>

                      <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed">
                        {slide.desc}
                      </p>

                      <div className="flex flex-wrap items-center gap-4">
                        <Magnetic>
                          <Link href="/services" data-cursor className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 group">
                            Explore Services
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </Link>
                        </Magnetic>
                        <Magnetic>
                          <Link href="/contact" data-cursor className="inline-flex h-12 items-center justify-center rounded-md border border-input bg-background/50 backdrop-blur-sm px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                            Consult With Us
                          </Link>
                        </Magnetic>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Slide Indicators */}
            <div className="flex items-center gap-2 mt-12" role="tablist" aria-label="Hero slides">
              {heroSlides.map((slide, i) => (
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

        {/* Hero side navigation */}
        <button
          type="button"
          onClick={() => heroApi?.scrollPrev()}
          aria-label="Previous slide"
          className="hidden md:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 h-12 w-12 items-center justify-center rounded-full border border-foreground/15 bg-foreground/5 backdrop-blur-md text-foreground shadow-sm hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => heroApi?.scrollNext()}
          aria-label="Next slide"
          className="hidden md:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 h-12 w-12 items-center justify-center rounded-full border border-foreground/15 bg-foreground/5 backdrop-blur-md text-foreground shadow-sm hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </section>

      {/* Marquee Section */}
      <section className="py-12 border-y border-border bg-card/30 overflow-hidden flex flex-col items-center group">
        <div className="container mx-auto px-4 md:px-6 mb-8">
          <p className="text-sm font-medium text-muted-foreground text-center tracking-widest uppercase">Trusted across sectors</p>
        </div>
        <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
          <div className={cn(
            "flex w-max flex-nowrap transform-gpu [will-change:transform] [backface-visibility:hidden]",
            prefersReducedMotion ? "" : "animate-[marquee_40s_linear_infinite] group-hover:[animation-play-state:paused]"
          )}>
            {[0, 1].map((copy) => (
              <div
                key={copy}
                aria-hidden={copy === 1 ? true : undefined}
                className="flex shrink-0 items-center [&_img]:max-w-none gap-16 md:gap-32 pr-16 md:pr-32"
              >
                {logos.map((logo, i) => (
                  <img
                    key={i}
                    src={logo}
                    alt=""
                    aria-hidden="true"
                    loading="eager"
                    decoding="async"
                    draggable={false}
                    className="h-10 md:h-12 w-auto object-contain opacity-50 dark:opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 md:py-24 bg-background border-b border-border">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center"
              >
                <Counter
                  to={stat.to}
                  suffix={stat.suffix}
                  className="block text-5xl md:text-7xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-sky-300 mb-3"
                />
                <div className="text-sm md:text-base font-medium uppercase tracking-widest text-muted-foreground">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Flagship Capabilities — bento grid */}
      <section className="py-16 md:py-24 bg-background relative">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-12">
            <h2 className="text-sm font-medium text-primary tracking-wider uppercase mb-2">Flagship Capabilities</h2>
            <h3 className="text-3xl md:text-5xl font-display font-bold text-foreground"><WordReveal text="Excellence in Execution" /></h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 auto-rows-[160px] sm:auto-rows-[200px] gap-3 sm:gap-4 md:gap-5">
            {caps.map((cap, index) => {
              const Icon = cap.icon;
              return (
                <Reveal key={cap.title} delay={(index % 3) * 0.06} className={cap.span}>
                  <Link href="/services" data-cursor className="group relative block h-full w-full rounded-2xl md:rounded-3xl overflow-hidden bg-muted">
                    <img src={cap.img} alt={cap.title} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 group-hover:from-black/95 transition-colors duration-300" />
                    <div className="absolute inset-0 p-4 sm:p-5 md:p-7 flex flex-col justify-end">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-primary transition-colors duration-300">
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <h4 className={`font-display font-bold text-white ${cap.big ? "text-xl sm:text-2xl md:text-3xl mb-1.5 sm:mb-3" : "text-base sm:text-lg lg:text-xl mb-1.5 sm:mb-2"}`}>{cap.title}</h4>
                      <p className={`hidden sm:block text-white/75 leading-relaxed mb-4 ${cap.big ? "text-base max-w-md" : "text-sm line-clamp-2"}`}>{cap.desc}</p>
                      <span className="inline-flex items-center gap-2 text-white text-sm font-medium opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                        View details <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              );
            })}

            {/* CTA tile */}
            <Reveal delay={0.18} className="col-span-2 md:col-span-1">
              <Link href="/services" data-cursor className="group relative flex h-full w-full flex-col justify-between rounded-2xl md:rounded-3xl overflow-hidden bg-primary text-primary-foreground p-6 md:p-7">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                <ArrowUpRight className="w-8 h-8 relative z-10 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                <div className="relative z-10">
                  <h4 className="text-xl font-display font-bold mb-1">All Services</h4>
                  <p className="text-sm text-primary-foreground/80">Explore our full range of practices</p>
                </div>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Industries Grid */}
      <section className="py-16 md:py-24 bg-card border-y border-border">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-medium text-primary tracking-wider uppercase mb-2">Industries We Serve</h2>
            <h3 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-6"><WordReveal text="Cross-Sector Expertise" /></h3>
            <p className="text-lg text-muted-foreground">Our specialized teams deliver tailored corporate advisory solutions across a wide spectrum of modern industries.</p>
          </div>

          {/* All sectors — photo cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {inds.map((ind, i) => (
              <Reveal key={ind.name} delay={(i % 4) * 0.05} className="h-[180px] sm:h-[240px] lg:h-[280px]">
                <TiltCard max={6} className="group relative h-full rounded-2xl overflow-hidden cursor-pointer">
                  <div data-cursor className="absolute inset-0">
                    <img src={ind.img} alt={`Industry: ${ind.name}`} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/10 transition-opacity duration-300 group-hover:from-black/95" />
                    <div className="absolute inset-0 p-4 sm:p-6 flex flex-col justify-end" style={{ transform: "translateZ(40px)" }}>
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mb-3 sm:mb-4 border border-white/20">
                        <ind.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <h4 className="text-sm sm:text-lg lg:text-xl font-display font-bold text-white leading-tight mb-2">{ind.name}</h4>
                      <div className="h-0.5 w-0 bg-primary group-hover:w-12 transition-all duration-300" />
                    </div>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>

          <p className="text-center text-muted-foreground mt-12">
            …and many more sectors we proudly serve.
          </p>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-24 bg-background relative">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-medium text-primary tracking-wider uppercase mb-2">The PSR Advantage</h2>
            <h3 className="text-3xl md:text-5xl font-display font-bold text-foreground"><WordReveal text="Beyond Traditional Advisory" /></h3>
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
      <section className="py-16 md:py-24 bg-secondary text-secondary-foreground relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-sm font-medium text-primary tracking-wider uppercase mb-2">Our Expertise</h2>
              <h3 className="text-3xl md:text-5xl font-display font-bold text-white mb-6"><WordReveal text="Comprehensive Solutions" /></h3>
              <p className="text-secondary-foreground/70 text-lg">We deliver value through a dedicated team of professionals with extensive experience across a broad range of disciplines.</p>
            </div>
            <Link href="/services" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium border border-white/20 hover:bg-white/10 hover:text-white h-11 px-8 py-2 transition-colors">
              View All Services
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "Corporate Secretarial Services",
              "Corporate Restructuring",
              "Capital Markets Services",
              "Legal Due Diligence",
              "RBI & FEMA Services",
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
      <section className="py-16 md:py-24 relative overflow-hidden bg-background">
        <Parallax speed={0.3} className="absolute inset-0 opacity-10">
           <img src={officeAbstract} alt="" aria-hidden className="w-full h-full object-cover scale-125 mix-blend-luminosity" />
        </Parallax>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <Reveal className="bg-primary/5 border border-primary/20 rounded-3xl p-10 md:p-20 text-center max-w-4xl mx-auto backdrop-blur-sm">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-6"><WordReveal text="Ready to transform your corporate governance?" /></h2>
            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">Get in touch with our team of experts to discuss how we can help you navigate complex regulatory environments and unlock growth.</p>
            <Magnetic>
              <Link href="/contact" data-cursor className="inline-flex h-14 items-center justify-center rounded-full bg-primary px-10 text-base font-medium text-primary-foreground shadow transition-all hover:bg-primary/90 hover:scale-105 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                Schedule a Consultation <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Magnetic>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
