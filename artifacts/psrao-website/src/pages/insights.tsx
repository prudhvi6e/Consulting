import { useEffect } from "react";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { Link } from "wouter";
import { articles } from "../data/articles";
import { Reveal } from "@/components/visual/Reveal";
import { TiltCard } from "@/components/visual/TiltCard";
import { Parallax } from "@/components/visual/Parallax";

export default function Insights() {
  useEffect(() => {
    document.title = "Insights & Advisory | PS Rao & Associates";
  }, []);

  return (
    <div className="w-full pt-20 bg-transparent relative overflow-hidden">
      {/* Decorative Background Elements */}
      <Parallax offset={80} className="absolute top-0 right-0 w-[50vw] h-[50vw] max-w-[800px] bg-primary/15 rounded-full blur-[150px] mix-blend-screen pointer-events-none animate-aurora" />

      <section className="py-24 md:py-40 glass-panel border-b border-white/10 relative z-10 shadow-xl">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl">
            <Reveal>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/30 text-primary text-sm font-medium mb-8 shadow-[0_0_20px_rgba(46,107,255,0.2)]">
                <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(46,107,255,1)] animate-pulse" />
                Expert Perspectives
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="text-6xl md:text-8xl font-display font-bold text-foreground mb-8 drop-shadow-md tracking-tight">
                Insights & <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400 drop-shadow-lg">Advisory</span>
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-2xl text-foreground/80 leading-relaxed font-light">
                Stay ahead of regulatory curves with our expert analysis on corporate law, financial markets, and governance trends.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="py-32 relative z-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {articles.map((article, i) => (
              <Reveal key={article.id} delay={i * 0.1}>
                <TiltCard className="h-full">
                  <article className="group flex flex-col p-10 rounded-[2.5rem] border border-white/10 glass shadow-xl hover:shadow-[0_20px_40px_rgba(46,107,255,0.1)] transition-all duration-500 relative overflow-hidden h-full">
                    {/* Inner highlight */}
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    <div className="relative z-10 flex flex-col h-full">
                      <div className="flex items-center gap-4 text-sm font-bold text-muted-foreground mb-8">
                        <span className="text-primary uppercase tracking-wider">{article.category}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                        <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {article.date}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                        <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> {article.readTime}</span>
                      </div>
                      
                      <h3 className="text-3xl font-display font-bold text-foreground mb-6 group-hover:text-primary transition-colors leading-tight">
                        {article.title}
                      </h3>
                      
                      <p className="text-lg text-foreground/70 leading-relaxed mb-10 flex-grow font-light">
                        {article.excerpt}
                      </p>
                      
                      <div className="mt-auto">
                        <Link href={`/insights/${article.slug}`} className="inline-flex items-center h-14 px-8 rounded-full glass border border-white/20 text-sm font-bold text-foreground group-hover:text-primary group-hover:border-primary/40 group-hover:bg-primary/5 transition-all w-fit shadow-md">
                          Read Article <ArrowRight className="ml-3 w-4 h-4 transform group-hover:translate-x-2 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </article>
                </TiltCard>
              </Reveal>
            ))}
          </div>
          
          <Reveal delay={0.3} className="mt-24 text-center">
            <button className="inline-flex h-14 items-center justify-center rounded-full glass border border-white/20 px-10 text-sm font-bold shadow-lg transition-all hover:bg-white/10 hover:scale-105">
              Load More Articles
            </button>
          </Reveal>
        </div>
      </section>
    </div>
  );
}