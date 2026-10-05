import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowRight, Quote } from "lucide-react";
import { Reveal, WordReveal } from "@/components/motion/Reveal";
import { getCaseStudies, getTestimonials, type CaseStudy, type Testimonial } from "@/lib/cms";
import { cn } from "@/lib/utils";

/** Outcome-led engagement stories. Renders nothing until the CMS has at least one published study. */
export function CaseStudies({ className, limit = 3, heading = "Proven in Practice" }: { className?: string; limit?: number; heading?: string }) {
  const { data } = useQuery({ queryKey: ["cms", "case_studies"], queryFn: getCaseStudies });
  const items = (data || []).slice(0, limit);
  if (!items.length) return null;
  return (
    <section id="case-studies" className={cn("py-16 md:py-24 bg-muted/40 relative", className)}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-10 md:mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h2 className="text-sm font-medium text-primary tracking-wider uppercase mb-2">Case Studies</h2>
            <h3 className="text-3xl md:text-5xl font-display font-bold text-foreground"><WordReveal text={heading} /></h3>
          </div>
          <p className="text-muted-foreground max-w-md md:text-right">Real engagements, anonymised. The numbers are the client's.</p>
        </div>
        <div className={cn("grid gap-4 md:gap-6", items.length === 1 ? "md:grid-cols-1 max-w-3xl" : items.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3")}>
          {items.map((c, i) => <CaseStudyCard key={c.id} c={c} delay={i * 0.08} />)}
        </div>
      </div>
    </section>
  );
}

function CaseStudyCard({ c, delay }: { c: CaseStudy; delay: number }) {
  return (
    <Reveal delay={delay} className="h-full">
      <article className="group relative h-full flex flex-col rounded-2xl md:rounded-3xl bg-card border border-border/60 overflow-hidden hover:border-primary/40 hover:shadow-[0_20px_60px_-20px_rgba(46,107,255,0.25)] transition-all duration-500">
        {c.image && (
          <div className="relative h-40 overflow-hidden">
            <img src={c.image} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
          </div>
        )}
        <div className="p-6 md:p-8 flex flex-col flex-1">
          <div className="flex items-center gap-2 text-xs font-medium tracking-wider uppercase text-muted-foreground mb-4">
            <span className="text-primary">{c.sector}</span>
            <span aria-hidden>·</span>
            <span className="truncate">{c.client}</span>
          </div>
          {c.metric && (
            <div className="mb-4">
              <div className="text-4xl md:text-5xl font-display font-bold text-foreground tracking-tight">{c.metric}</div>
              {c.metricLabel && <div className="text-sm text-muted-foreground mt-1">{c.metricLabel}</div>}
            </div>
          )}
          <h4 className="text-xl font-display font-bold text-foreground mb-3 leading-snug">{c.title}</h4>
          <p className="text-muted-foreground text-sm leading-relaxed mb-5 line-clamp-4">{c.challenge}</p>
          <details className="group/d mt-auto">
            <summary className="list-none cursor-pointer inline-flex items-center gap-2 text-sm font-medium text-primary select-none">
              <span className="group-open/d:hidden">Read the full story</span>
              <span className="hidden group-open/d:inline">Hide</span>
              <ArrowRight className="w-4 h-4 transition-transform group-open/d:rotate-90" />
            </summary>
            <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground border-t border-border/60 pt-4">
              <div><div className="text-foreground font-semibold mb-1">What we did</div><p>{c.approach}</p></div>
              <div><div className="text-foreground font-semibold mb-1">Outcome</div><p>{c.outcome}</p></div>
              {c.services.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {c.services.map((s) => <Link key={s} href="/services" className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium hover:bg-primary hover:text-primary-foreground transition-colors">{s}</Link>)}
                </div>
              )}
            </div>
          </details>
        </div>
      </article>
    </Reveal>
  );
}

/** Client quotes. Renders nothing until at least one published testimonial exists. */
export function Testimonials({ className, limit = 4 }: { className?: string; limit?: number }) {
  const { data } = useQuery({ queryKey: ["cms", "testimonials"], queryFn: getTestimonials });
  const items = (data || []).slice(0, limit);
  if (!items.length) return null;
  return (
    <section id="testimonials" className={cn("py-16 md:py-24 bg-background relative overflow-hidden", className)}>
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" aria-hidden />
      <div className="container mx-auto px-4 md:px-6 relative">
        <div className="mb-10 md:mb-14">
          <h2 className="text-sm font-medium text-primary tracking-wider uppercase mb-2">Client Voices</h2>
          <h3 className="text-3xl md:text-5xl font-display font-bold text-foreground"><WordReveal text="What our clients say" /></h3>
        </div>
        <div className={cn("grid gap-4 md:gap-6", items.length >= 4 ? "md:grid-cols-2 lg:grid-cols-4" : items.length === 3 ? "md:grid-cols-3" : items.length === 2 ? "md:grid-cols-2" : "max-w-2xl")}>
          {items.map((t, i) => <TestimonialCard key={t.id} t={t} delay={i * 0.08} />)}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ t, delay }: { t: Testimonial; delay: number }) {
  const initials = t.name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  return (
    <Reveal delay={delay} className="h-full">
      <figure className="h-full flex flex-col rounded-2xl md:rounded-3xl bg-card border border-border/60 p-6 md:p-7 hover:border-primary/40 transition-colors duration-500">
        <Quote className="w-8 h-8 text-primary/30 mb-4" aria-hidden />
        <blockquote className="text-foreground leading-relaxed flex-1 text-[15px]">“{t.quote}”</blockquote>
        <figcaption className="mt-6 flex items-center gap-3">
          {t.image ? (
            <img src={t.image} alt="" loading="lazy" decoding="async" className="w-11 h-11 rounded-full object-cover bg-muted" />
          ) : (
            <div className="w-11 h-11 rounded-full bg-primary/10 text-primary font-display font-bold flex items-center justify-center text-sm">{initials}</div>
          )}
          <div className="min-w-0">
            <div className="font-semibold text-foreground text-sm truncate">{t.name}</div>
            <div className="text-xs text-muted-foreground truncate">{[t.role, t.company].filter(Boolean).join(", ")}</div>
          </div>
        </figcaption>
      </figure>
    </Reveal>
  );
}
