import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import logoUrl from "@/assets/brand/ps-logo.png";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

export function Navbar() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const prefersReduced = useReducedMotion();
  const { scrollY } = useScroll();

  // Scale down the navbar when scrolling (transform + paint only, no layout thrash)
  const navScale = useTransform(scrollY, [0, 100], [1, 0.95]);
  const navY = useTransform(scrollY, [0, 100], ["0px", "16px"]);
  const navRadius = useTransform(scrollY, [0, 100], ["0px", "32px"]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/team", label: "Team" },
    { href: "/insights", label: "Insights" },
    { href: "/careers", label: "Careers" },
  ];

  return (
    <motion.header
      style={{
        scaleX: prefersReduced ? 1 : navScale,
        transformOrigin: "center top",
        y: prefersReduced ? "0px" : navY,
        borderRadius: prefersReduced ? "0px" : navRadius,
      }}
      className={cn(
        "fixed top-0 left-0 right-0 mx-auto z-50 transition-all duration-300",
        isScrolled 
          ? "glass shadow-2xl py-3" 
          : "bg-transparent border-transparent py-5"
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group relative">
            <div className="bg-white p-1 rounded-sm relative z-10 shadow-sm">
               <img src={logoUrl} alt="PS Rao & Associates" className="h-8 w-auto object-contain" />
            </div>
            <span className={cn(
              "font-display font-bold text-lg tracking-tight transition-colors z-10",
              isScrolled ? "text-foreground" : "text-foreground dark:text-white"
            )}>
              PS RAO & ASSOCIATES
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <ul className="flex items-center gap-8">
              {links.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-primary relative group",
                      location === link.href ? "text-primary font-semibold" : (isScrolled ? "text-muted-foreground" : "text-foreground/80 dark:text-gray-200")
                    )}
                  >
                    {link.label}
                    <span className={cn(
                      "absolute -bottom-1 left-0 w-full h-0.5 bg-primary transform origin-left transition-transform duration-300",
                      location === link.href ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    )} />
                  </Link>
                </li>
              ))}
            </ul>
            
            <Link href="/contact" className={cn(
              "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-10 px-6 py-2 shadow-lg relative overflow-hidden group",
              isScrolled 
                ? "bg-primary text-primary-foreground hover:shadow-[0_0_20px_rgba(46,107,255,0.4)]"
                : "bg-foreground text-background dark:bg-white dark:text-black hover:bg-foreground/90 dark:hover:bg-white/90"
            )}>
              <span className="relative z-10 flex items-center">Consult Us <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" /></span>
              {/* Shimmer effect */}
              <span className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            </Link>
          </nav>

          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 glass border-t border-white/20 shadow-xl py-4 px-4 flex flex-col gap-4 mx-2 rounded-2xl mt-2">
          <ul className="flex flex-col gap-4">
            {links.map((link) => (
              <li key={link.href}>
                <Link 
                  href={link.href}
                  className={cn(
                    "block text-base font-medium p-2 rounded-md transition-colors",
                    location === link.href ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/contact" className="mt-2 flex w-full">
            <Button className="w-full rounded-full shadow-lg">Consult Us <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </Link>
        </div>
      )}
    </motion.header>
  );
}
