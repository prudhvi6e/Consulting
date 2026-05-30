import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { Link } from "wouter";

const articles = [
  {
    id: 1,
    title: "SEBI LODR Regulations: Key Amendments for 2024",
    excerpt: "An in-depth analysis of the recent changes to listing obligations and disclosure requirements affecting mid-cap and large-cap entities.",
    date: "Oct 15, 2024",
    readTime: "5 min read",
    category: "Compliance"
  },
  {
    id: 2,
    title: "Navigating FDI Route Changes in the Tech Sector",
    excerpt: "How recent FEMA notifications impact foreign direct investment structures for emerging technology startups in India.",
    date: "Sep 28, 2024",
    readTime: "7 min read",
    category: "FEMA"
  },
  {
    id: 3,
    title: "The Evolving Landscape of Corporate Governance",
    excerpt: "Why independent directors face increased scrutiny and how boards must adapt their internal audit mechanisms.",
    date: "Sep 10, 2024",
    readTime: "6 min read",
    category: "Governance"
  },
  {
    id: 4,
    title: "M&A Trends: Fast-Track Mergers Demystified",
    excerpt: "A practical guide to utilizing the Section 233 fast-track merger route under the Companies Act, 2013.",
    date: "Aug 22, 2024",
    readTime: "8 min read",
    category: "Restructuring"
  }
];

export default function Insights() {
  useEffect(() => {
    document.title = "Insights & Advisory | PS Rao & Associates";
  }, []);

  return (
    <div className="w-full pt-20">
      <section className="py-20 md:py-32 bg-card border-b border-border">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-6">
              Insights & <span className="text-primary">Advisory</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Stay ahead of regulatory curves with our expert analysis on corporate law, financial markets, and governance trends.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {articles.map((article, i) => (
              <motion.article 
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group flex flex-col p-8 rounded-2xl border border-border bg-card hover:border-primary/30 transition-all duration-300"
              >
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
                
                <div className="flex items-center text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                  Read Article <ArrowRight className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
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
