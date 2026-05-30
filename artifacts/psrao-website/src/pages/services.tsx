import { useEffect } from "react";
import { Briefcase, Building, FileCheck, Scale, Landmark, Banknote, ShieldCheck, Globe2, BookOpen, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/visual/Reveal";
import { TiltCard } from "@/components/visual/TiltCard";
import { Parallax } from "@/components/visual/Parallax";

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
    <div className="w-full pt-20 bg-transparent relative overflow-hidden">
      {/* Decorative Glow */}
      <Parallax offset={100} className="absolute top-0 right-0 w-[60vw] h-[50vw] max-w-[800px] bg-primary/15 rounded-full blur-[150px] pointer-events-none mix-blend-screen animate-aurora" />

      <section className="py-24 md:py-40 relative z-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl">
            <Reveal>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/30 text-primary text-sm font-medium mb-8 shadow-[0_0_20px_rgba(46,107,255,0.2)]">
                <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(46,107,255,1)] animate-pulse" />
                Our Expertise
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="text-6xl md:text-8xl font-display font-bold text-foreground mb-10 tracking-tight drop-shadow-md">
                Comprehensive <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400 drop-shadow-lg">Advisory.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-2xl md:text-3xl text-foreground/80 leading-relaxed font-light">
                We deliver precision-engineered corporate advisory and secretarial services, tailored to navigate complex regulatory environments and unlock business growth at scale.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="py-32 relative z-10 glass-panel border-y border-white/10 shadow-2xl">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {services.map((service, i) => (
              <Reveal key={service.id} delay={i * 0.1}>
                <TiltCard className="h-full">
                  <div className="group relative flex flex-col p-10 rounded-[2.5rem] border border-white/10 glass shadow-xl hover:shadow-[0_20px_40px_rgba(46,107,255,0.1)] transition-all duration-500 overflow-hidden h-full">
                    {/* Inner highlight */}
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    
                    <div className="relative z-10 flex flex-col h-full">
                      <div className="h-20 w-20 rounded-3xl glass border border-white/20 shadow-inner flex items-center justify-center mb-8 group-hover:border-primary/50 group-hover:bg-primary/10 transition-colors duration-500 shadow-[0_0_15px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_20px_rgba(46,107,255,0.2)]">
                        <service.icon className="h-10 w-10 text-primary/80 group-hover:text-primary transition-colors drop-shadow-md" />
                      </div>
                      <h3 className="text-3xl font-display font-bold text-foreground mb-6 group-hover:text-primary transition-colors">{service.title}</h3>
                      <p className="text-foreground/70 leading-relaxed flex-grow font-light text-lg">{service.desc}</p>
                      
                      <div className="mt-10 pt-8 border-t border-white/10 flex justify-between items-center group-hover:border-primary/20 transition-colors">
                         <span className="text-sm font-bold uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0 transition-all duration-300">Learn More</span>
                         <div className="w-12 h-12 rounded-full glass border border-white/20 flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all duration-300 shadow-md">
                            <ArrowRight className="w-5 h-5" />
                         </div>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}