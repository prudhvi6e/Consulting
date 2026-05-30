import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { Link } from "wouter";
import { articles } from "../data/articles";

export default function Insights() {
  useEffect(() => {
    document.title = "Insights & Advisory | PS Rao & Associates";
  }, []);

  return (
    <div className="w-full pt-20 bg-background relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] mix-blend-screen pointer-events-none" />

      <section className="py-20 md:py-32 bg-card/40 backdrop-blur-sm border-b border-border relative z-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              Expert Perspectives
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-6">
              Insights & <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Advisory</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Stay ahead of regulatory curves with our expert analysis on corporate law, financial markets, and governance trends.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 relative z-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {articles.map((article, i) => (
              <motion.article 
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group flex flex-col p-8 rounded-3xl border border-border bg-card/80 backdrop-blur-sm hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-500 relative overflow-hidden"
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground mb-6">
                    <span className="text-primary uppercase tracking-wider">{article.category}</span>
                    <span className="w-1 h-1 rounded-full bg-border" />
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {article.date}</span>
                    <span className="w-1 h-1 rounded-full bg-border" />
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {article.readTime}</span>
                  </div>
                  
                  <h3 className="text-2xl font-display font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed mb-8 flex-grow">
                    {article.excerpt}
                  </p>
                  
                  <Link href={`/insights/${article.slug}`} className="inline-flex items-center text-sm font-bold text-foreground group-hover:text-primary transition-colors w-fit">
                    Read Article <ArrowRight className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <button className="inline-flex h-12 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground">
              Load More Articles
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
