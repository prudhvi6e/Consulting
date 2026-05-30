import { useEffect } from "react";
import { motion } from "framer-motion";
import { Briefcase, Building, FileCheck, Scale, Landmark, Banknote, ShieldCheck, Globe2, BookOpen, ArrowRight } from "lucide-react";

const services = [
  {
    id: "company-law",
    title: "Company Law & Secretarial Compliances",
    icon: Building,
    desc: "We undertake all kinds of company law related and secretarial services under direct supervision of qualified and experienced company secretaries. Includes incorporation, maintenance of statutory registers, minutes books, Board & shareholders meetings, ROC filings, and providing proper advice to management."
  },
  {
    id: "corporate-governance",
    title: "Corporate Governance Services",
    icon: Briefcase,
    desc: "Advising on good governance practices and compliance of regulations and guidelines. Establishing good governance practices and sound ethical and professional standards on the foundation of which the edifice of a corporate is built."
  },
  {
    id: "audit-certification",
    title: "Secretarial / Compliance Audit",
    icon: FileCheck,
    desc: "We conduct compliance and secretarial audit for corporates to strengthen Corporate Governance. Assists Audit Committee and Board on statutory compliances, internal control systems, and transparent governance."
  },
  {
    id: "restructuring",
    title: "Corporate Restructuring",
    icon: Scale,
    desc: "Pragmatic and effective strategies for mergers, amalgamations, demergers, reduction of capital, and winding-up. We help clients secure financing, reduce cost, and reorganize operations to improve competitive position."
  },
  {
    id: "representation",
    title: "Representation Services",
    icon: Landmark,
    desc: "Close liaisoning and representation before NCLT, Competition Commission of India, SAT, ROC, Telecom Disputes Tribunal, Tax Tribunals, and other quasi-judicial bodies and regulatory authorities."
  },
  {
    id: "financial-markets",
    title: "Financial Markets Services",
    icon: Banknote,
    desc: "Consultancy for Public/Right/Bonus issues. Drawing marketing strategies, advising on timing/price, SEBI compliances, drafting Prospectus, Takeover Code, Insider Trading, and private placements."
  },
  {
    id: "banking",
    title: "Banking Services",
    icon: ShieldCheck,
    desc: "Diligence Report and Certification for Consortium / Multiple banking arrangements, Loan Syndication, Loan Documentation, Registration of Charges, Status & Search Reports, and Corporate Debt Restructuring."
  },
  {
    id: "rbi-forex",
    title: "RBI and FOREX Law Services",
    icon: Globe2,
    desc: "Overseas investments, setting up branch/liaison offices, joint ventures abroad, FDI compliances, NRI investments, and FEMA related approvals and procedural matters."
  },
  {
    id: "due-diligence",
    title: "Legal Due Diligence",
    icon: BookOpen,
    desc: "Meticulous due diligence for acquisitions, strategic investments, and JVs. Issuing reports, assisting in negotiations, and drafting Shareholders & Share Subscription Agreements."
  }
];

export default function Services() {
  useEffect(() => {
    document.title = "Services | PS Rao & Associates";
  }, []);

  return (
    <div className="w-full pt-20 bg-background relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />

      <section className="py-20 md:py-32 relative z-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              Our Expertise
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold text-foreground mb-8 tracking-tight">
              Comprehensive <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Advisory.</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-light">
              We deliver precision-engineered corporate advisory and secretarial services, tailored to navigate complex regulatory environments and unlock business growth at scale.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 relative z-10 bg-card/30 backdrop-blur-xl border-t border-border">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, i) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group relative flex flex-col p-8 rounded-3xl border border-border bg-background shadow-lg shadow-primary/5 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 transition-all duration-500 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="h-16 w-16 rounded-2xl bg-card border border-border/50 shadow-inner flex items-center justify-center mb-8 group-hover:border-primary/50 group-hover:bg-primary/5 transition-colors duration-500">
                    <service.icon className="h-8 w-8 text-primary/80 group-hover:text-primary transition-colors" />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-foreground mb-4 group-hover:text-primary transition-colors">{service.title}</h3>
                  <p className="text-muted-foreground leading-relaxed flex-grow font-light">{service.desc}</p>
                  
                  <div className="mt-8 pt-6 border-t border-border/50 flex justify-end">
                     <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all duration-300">
                        <ArrowRight className="w-5 h-5" />
                     </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}