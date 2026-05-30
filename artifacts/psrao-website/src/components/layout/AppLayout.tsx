import { useEffect } from "react";
import { useLocation } from "wouter";
import { Navbar } from "@/components/layout/Navbar";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Phone, Mail, ArrowRight, ArrowUpRight } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground pt-20 pb-10 border-t border-border/10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <h3 className="font-display text-2xl font-bold text-white tracking-tight">
              PS RAO & ASSOCIATES
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
              Minding your business as ours. Next-gen advisory firm combining human expertise with futuristic efficiency to deliver 24/7 corporate compliance and governance solutions.
            </p>
          </div>

          <div>
            <h4 className="font-display font-semibold text-white mb-6">Quick Links</h4>
            <ul className="space-y-4">
              {['Home', 'About', 'Services', 'Team', 'Insights', 'Contact'].map((link) => (
                <li key={link}>
                  <Link href={link === 'Home' ? '/' : `/${link.toLowerCase()}`} className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group text-sm">
                    <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all text-primary" />
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-white mb-6">Services</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li>Corporate Governance</li>
              <li>Secretarial Audit</li>
              <li>Corporate Restructuring</li>
              <li>Financial Markets</li>
              <li>RBI & FOREX Laws</li>
              <li>Legal Due Diligence</li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-white mb-6">Corporate Office</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>
                  D.No. 6-3-347-22/2, Flat-10, 4th Floor,<br />
                  Iswarya Nilayam, Dwarakapuri Colony,<br />
                  Punjagutta, Hyderabad 500081
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <span>040-23352185 / 6</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <span>info@psraoassociates.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>© 2012–2026 PS Rao & Associates. All rights reserved.</p>
          <p>Company Secretaries · Hyderabad, India</p>
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

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" });
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col selection:bg-primary selection:text-white">
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
    </div>
  );
}
