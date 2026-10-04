import { useEffect } from "react";
import { useLocation } from "wouter";
import { useLenis } from "lenis/react";
import { useQuery } from "@tanstack/react-query";
import { getSiteSettings } from "@/lib/cms";
import { Navbar } from "@/components/layout/Navbar";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Phone, Mail, ArrowRight, ArrowUp, Linkedin, Twitter, Instagram } from "lucide-react";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { Cursor } from "@/components/motion/Cursor";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import psrMark from "@/assets/brand/psr-mark.png";
import { ChatWidget } from "@/components/ChatWidget";

const FOOTER_LINKS = ["Home", "About", "Services", "Team", "Insights", "Careers", "Contact"];
const FOOTER_SERVICES = [
  "Corporate Secretarial", "Corporate Governance", "Secretarial Audit",
  "Corporate Restructuring", "Capital Markets", "RBI & FEMA", "Legal Due Diligence",
];
// TODO: replace href placeholders with the firm's real profile URLs
const SOCIALS = [
  { Icon: Linkedin, label: "LinkedIn", href: "#" },
  { Icon: Twitter, label: "X", href: "#" },
  { Icon: Instagram, label: "Instagram", href: "#" },
];

function Footer() {
  const lenis = useLenis();
  const { data: settings } = useQuery({ queryKey: ["cms", "settings"], queryFn: getSiteSettings });
  const toTop = () => {
    if (lenis) lenis.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative overflow-hidden bg-secondary text-secondary-foreground">
      {/* Top hairline */}
      <div aria-hidden className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-sky-400/50 to-transparent" />
      {/* Sky-aurora illumination */}
      <div aria-hidden className="pointer-events-none absolute -bottom-44 left-1/2 -translate-x-1/2 w-[min(1100px,150vw)] h-[540px] bg-sky-400/15 rounded-[100%] blur-[150px] animate-pulse" />
      <div className="container mx-auto px-4 md:px-6 relative z-10 pt-20 pb-10">
        {/* Glass panel — original 4-column layout, refined */}
        <Reveal>
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 md:p-12 shadow-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-10 lg:gap-x-20">
              {/* Brand */}
              <div className="space-y-7">
                <div className="flex items-center gap-3.5">
                  <div className="bg-white p-1.5 rounded-lg shrink-0">
                    <img src={psrMark} alt="PS Rao Corporate Solutions Pvt. Ltd." className="h-11 w-11 object-contain" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-display text-2xl font-bold text-white tracking-tight leading-none">PS Rao</h3>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary whitespace-nowrap leading-none">Corporate Solutions Pvt. Ltd.</p>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm leading-7 max-w-xs">
                  Minding your business as ours. Next-gen advisory firm combining human expertise with futuristic efficiency to deliver 24/7 corporate compliance and governance solutions.
                </p>
                <div className="flex items-center gap-3">
                  {SOCIALS.map(({ Icon, label, href }) => (
                    <a key={label} href={href} aria-label={label} target="_blank" rel="noopener noreferrer" data-cursor
                      className="h-10 w-10 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-muted-foreground hover:text-white hover:bg-primary hover:border-primary transition-colors">
                      <Icon className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div className="lg:pl-8">
                <h4 className="font-display font-semibold text-white mb-6">Quick Links</h4>
                <RevealGroup className="space-y-4" stagger={0.05}>
                  {FOOTER_LINKS.map((link) => (
                    <RevealItem key={link}>
                      <Link href={link === "Home" ? "/" : `/${link.toLowerCase()}`} className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group text-sm">
                        <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all text-primary" />
                        {link}
                      </Link>
                    </RevealItem>
                  ))}
                </RevealGroup>
              </div>

              {/* Services */}
              <div>
                <h4 className="font-display font-semibold text-white mb-6">Services</h4>
                <ul className="space-y-4 text-sm text-muted-foreground">
                  {FOOTER_SERVICES.map((s) => (
                    <li key={s} className="hover:text-secondary-foreground/90 transition-colors">{s}</li>
                  ))}
                </ul>
              </div>

              {/* Corporate Office */}
              <div>
                <h4 className="font-display font-semibold text-white mb-6">Corporate Office</h4>
                <ul className="space-y-4 text-sm text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="whitespace-pre-line">{settings?.address ?? "6-3-683/10, Flat-102, Suseela Sadan,\nAnand Nagar Road, Khairtabad,\nHyderabad - 500004, Telangana"}</span>
                  </li>
                  <li className="flex items-center gap-3"><Phone className="w-5 h-5 text-primary shrink-0" /><span>{settings?.phone ?? "+91 40 2335 2185"}</span></li>
                  <li className="flex items-center gap-3"><Mail className="w-5 h-5 text-primary shrink-0" /><span>{settings?.email ?? "info@psrao.co.in"}</span></li>
                </ul>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Bottom bar */}
        <div className="pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>© 2012–2026 PS Rao Corporate Solutions Pvt. Ltd. All rights reserved.</p>
          <p className="hidden md:block">Company Secretaries · Hyderabad, India</p>
          <button onClick={toTop} data-cursor className="inline-flex items-center gap-2 hover:text-primary transition-colors group">
            Back to top
            <span className="h-8 w-8 rounded-full border border-white/15 flex items-center justify-center group-hover:border-primary group-hover:bg-primary/10 transition-colors">
              <ArrowUp className="h-4 w-4 group-hover:-translate-y-0.5 transition-transform" />
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    filter: "blur(10px)",
  },
  enter: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    filter: "blur(10px)",
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const lenis = useLenis();

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      // Let the page render, then scroll to the anchor (e.g. /contact#schedule).
      let tries = 0;
      const tick = () => {
        const el = document.getElementById(hash);
        if (el) {
          if (lenis) lenis.scrollTo(el, { offset: -96 });
          else el.scrollIntoView({ behavior: "smooth", block: "start" });
        } else if (tries++ < 20) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      return;
    }
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [location, lenis]);

  // Same-page anchor clicks (e.g. already on /contact, click a #schedule link).
  useEffect(() => {
    const onHash = () => {
      const el = document.getElementById(window.location.hash.slice(1));
      if (!el) return;
      if (lenis) lenis.scrollTo(el, { offset: -96 });
      else el.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [lenis]);

  return (
    <div className="min-h-screen flex flex-col selection:bg-primary selection:text-white">
      <ScrollProgress />
      <Cursor />
      <Navbar />
      <main className="flex-1 w-full relative z-0 mt-16 md:mt-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={location}
            initial="initial"
            animate="enter"
            exit="exit"
            variants={pageVariants}
            className="w-full h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
}
