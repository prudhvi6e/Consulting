import { useEffect } from "react";
import { motion } from "framer-motion";
import { Briefcase, Building, FileCheck, Scale, Landmark, Banknote, ShieldCheck, Globe2, BookOpen } from "lucide-react";

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
    <div className="w-full pt-20">
      <section className="py-20 md:py-32 bg-card border-b border-border">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-6">
              Our <span className="text-primary">Services</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Comprehensive corporate advisory and secretarial services tailored to navigate complex regulatory environments and unlock business growth.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, i) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group flex flex-col p-8 rounded-2xl border border-border bg-card hover:border-primary/50 transition-all duration-300"
              >
                <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                  <service.icon className="h-7 w-7 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="text-2xl font-display font-bold text-foreground mb-4">{service.title}</h3>
                <p className="text-muted-foreground leading-relaxed flex-grow">{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
