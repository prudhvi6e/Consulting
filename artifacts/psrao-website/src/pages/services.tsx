import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { TiltCard } from "@/components/motion/TiltCard";
import { WordReveal } from "@/components/motion/Reveal";
import { Magnetic } from "@/components/motion/Magnetic";
import { GlobeOrbit } from "@/components/motion/GlobeOrbit";
import { getServiceGroups } from "@/lib/cms";
import { getIcon } from "@/lib/icons";
import { Building2, Briefcase, FileCheck, Network, TrendingUp, Gavel, BookOpen, Globe2, Landmark, Stamp, Lightbulb, ArrowRight, type LucideIcon } from "lucide-react";

type Service = { id: string; title: string; icon: LucideIcon; desc: string; sub?: string[]; featured?: boolean };
type Group = { category: string; services: Service[] };

const groups: Group[] = [
  {
    category: "Secretarial & Governance",
    services: [
      {
        id: "corporate-secretarial",
        title: "Corporate Secretarial Services",
        icon: Building2,
        featured: true,
        desc: "Responsible for shareholder administration and communication, corporate governance and statutory compliances. Our dynamic team has the experience and acumen to provide complete solutions for all corporate secretarial matters — from incorporation and share capital issues to share transfers, board & shareholder meetings, reports and statutory record maintenance.",
        sub: ["Incorporation of Business Entities", "Issue of Share Capital & Equity Restructuring", "Share Registration & Transfers", "Meetings of Directors & Shareholders", "Reports & Maintenance"],
      },
      {
        id: "corporate-governance",
        title: "Corporate Governance Services",
        icon: Briefcase,
        desc: "A set of principles, processes, customs, policies and laws affecting the way a corporation is directed, administered or controlled. We help establish sound ethical and professional standards on which the edifice of a corporate is built.",
      },
      {
        id: "audit-certification",
        title: "Secretarial / Compliance Audit & Certification",
        icon: FileCheck,
        desc: "Secretarial audit covers the non-financial aspects of the business and their impact on company performance, verifying compliance of applicable laws, regulations and guidelines — strengthening governance and giving the Board confidence in its compliance posture.",
      },
    ],
  },
  {
    category: "Capital Markets & Banking",
    services: [
      {
        id: "capital-markets",
        title: "Capital Markets Services",
        icon: TrendingUp,
        featured: true,
        desc: "We stay updated on the movements and trends in the capital market and provide overall consultancy for Public Issues, Rights Issues and Bonus Issues — covering marketing strategy, timing and pricing, SEBI compliances, prospectus drafting, takeover code, insider trading and securities certifications.",
        sub: ["Public Issue of Equity & Listing", "Takeover Code & Insider Trading", "Securities Compliance & Certifications"],
      },
      {
        id: "banking",
        title: "Banking Services",
        icon: Landmark,
        desc: "Diligence Reports and Certification in respect of Consortium / Multiple banking arrangements made by Scheduled Commercial Banks and Urban Co-operative Banks, along with Loan Syndication, Loan Documentation and Registration of Charges.",
      },
      {
        id: "rbi-fema",
        title: "RBI & FEMA Services",
        icon: Globe2,
        desc: "Cross-border transactions are the order of the present business era. Overseas investments into India, branch offices, subsidiaries and joint ventures are primarily governed by FEMA — with RBI permissions and approvals. We guide clients end-to-end through these requirements.",
      },
    ],
  },
  {
    category: "Restructuring & Resolution",
    services: [
      {
        id: "restructuring",
        title: "Corporate Restructuring Services",
        icon: Network,
        desc: "The process of significantly changing a company's business model, management team or financial structure to address challenges and increase shareholder value. We formulate and implement pragmatic, effective strategies across mergers, amalgamations, demergers and acquisitions — keeping the needs of emerging and mid-cap companies in view.",
      },
      {
        id: "insolvency-bankruptcy",
        title: "Insolvency & Bankruptcy",
        icon: Gavel,
        desc: "The Insolvency and Bankruptcy Code, 2016 transformed a fragmented system into an integrated, time-bound platform for resolving insolvency of corporates, firms and individuals. We advise across this framework — IBBI, Adjudicating Authorities and Insolvency Professionals — to protect and recover stakeholder value.",
      },
    ],
  },
  {
    category: "Advisory, Diligence & IP",
    services: [
      {
        id: "due-diligence",
        title: "Legal Due Diligence",
        icon: BookOpen,
        featured: true,
        desc: "Our due diligence specialists and legal experts have a proven track record of conducting meticulous due diligence for enterprises of every size — in respect of potential acquisitions, strategic investments, collaborations and joint ventures — issuing clear reports and supporting negotiations and agreements.",
      },
      {
        id: "regulatory-representation",
        title: "Regulatory Approvals & Representation",
        icon: Stamp,
        desc: "Organizations need to obtain corporate approvals from various government, judicial and quasi-judicial bodies under numerous laws and regulations. We secure these approvals and represent clients before the relevant authorities, ensuring timely and effective outcomes.",
      },
      {
        id: "ipr",
        title: "Intellectual Property Rights",
        icon: Lightbulb,
        desc: "Patents, trademarks, copyrights and trade secrets are valuable assets of the company, and legally protecting them from outside use is critical. We help clients identify, register and safeguard their intellectual property.",
      },
    ],
  },
];

function FeaturedCard({ service }: { service: Service }) {
  const Icon = service.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5 }}
      className="group relative overflow-hidden rounded-3xl border border-primary/25 bg-card/80 backdrop-blur-sm p-8 md:p-10 shadow-lg shadow-primary/5"
    >
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="relative grid md:grid-cols-12 gap-8 md:gap-10 items-center">
        <div className="md:col-span-7">
          <div className="flex items-center gap-4 mb-5">
            <div className="h-14 w-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors duration-300">
              <Icon className="h-7 w-7 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Flagship Practice</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">{service.title}</h3>
          <p className="text-muted-foreground leading-relaxed">{service.desc}</p>
        </div>
        {service.sub && (
          <div className="md:col-span-5 md:border-l md:border-border md:pl-10">
            <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">What this covers</h4>
            <ul className="space-y-3">
              {service.sub.map((item) => (
                <li key={item} className="flex items-start gap-3 text-foreground/90">
                  <ArrowRight className="h-4 w-4 text-primary mt-1 shrink-0" />
                  <span className="leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const Icon = service.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="h-full"
    >
      <TiltCard max={6} className="group flex flex-col h-full p-8 rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
        <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
          <Icon className="h-7 w-7 text-primary group-hover:text-primary-foreground transition-colors" />
        </div>
        <h3 className="text-xl font-display font-bold text-foreground mb-4">{service.title}</h3>
        <p className="text-muted-foreground leading-relaxed flex-grow">{service.desc}</p>
        {service.sub && (
          <div className="mt-6 flex flex-wrap gap-2">
            {service.sub.map((item) => (
              <span key={item} className="text-xs font-medium px-3 py-1 rounded-full bg-primary/5 border border-primary/15 text-primary/90">
                {item}
              </span>
            ))}
          </div>
        )}
      </TiltCard>
    </motion.div>
  );
}

export default function Services() {
  useEffect(() => {
    document.title = "Services | PS Rao Corporate Solutions";
  }, []);

  // Content from the CMS; falls back to the bundled defaults if the CMS is unreachable.
  const { data: cmsGroups } = useQuery({ queryKey: ["cms", "serviceGroups"], queryFn: getServiceGroups });
  const data: Group[] = cmsGroups?.length
    ? cmsGroups.map((g) => ({
        category: g.category,
        services: (g.services ?? []).map((s) => ({
          id: String(s.id),
          title: s.title,
          icon: getIcon(s.icon),
          desc: s.desc,
          sub: s.points && s.points.length ? s.points : undefined,
          featured: s.featured,
        })),
      }))
    : groups;

  return (
    <div className="w-full pt-20 bg-background relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Hero */}
      <section className="py-20 md:py-28 relative z-10 border-b border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-start">
            {/* Left — copy */}
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
                What We Do
              </div>
              <h1 className="text-5xl md:text-7xl font-display font-bold text-foreground mb-6 tracking-tight">
                <WordReveal text="Our" />{" "}
                <WordReveal text="Services." delay={0.1} className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-sky-300" />
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-light">
                Comprehensive corporate advisory and secretarial services — organized across the disciplines we practice, tailored to navigate complex regulatory environments and unlock business growth.
              </p>
            </div>

            {/* Right — interactive globe: wherever you operate, we're close by */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex flex-col items-center justify-start lg:-mt-12"
            >
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[60%] h-[60%] rounded-full bg-primary/15 blur-[90px]" />
              </div>
              <GlobeOrbit className="relative z-10" />
              <p className="relative z-10 mt-4 text-center text-sm md:text-base text-muted-foreground max-w-sm">
                <span className="font-semibold text-foreground">Wherever you do business, we're never far away.</span><br />
                From our Hyderabad base to clients across India and beyond.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Grouped services */}
      <section className="py-20 md:py-24 relative z-10">
        <div className="container mx-auto px-4 md:px-6 space-y-20">
          {data.map((group) => {
            const featured = group.services.length >= 3 ? group.services.find((s) => s.featured) : undefined;
            const rest = featured ? group.services.filter((s) => s !== featured) : group.services;
            return (
              <div key={group.category}>
                <div className="flex items-center gap-5 mb-10">
                  <h2 className="text-sm font-bold text-primary tracking-widest uppercase whitespace-nowrap">{group.category}</h2>
                  <div className="h-px flex-grow bg-border" />
                </div>

                {featured && (
                  <div className="mb-6">
                    <FeaturedCard service={featured} />
                  </div>
                )}

                <div className={`grid gap-6 ${rest.length === 1 ? "md:grid-cols-1" : "md:grid-cols-2"}`}>
                  {rest.map((service, i) => (
                    <ServiceCard key={service.id} service={service} index={i} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="py-24 relative z-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="bg-primary/5 border border-primary/20 rounded-3xl p-10 md:p-16 text-center max-w-4xl mx-auto backdrop-blur-sm">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-5">Not sure which service you need?</h2>
            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
              Tell us about your requirement and our partners will point you to the right practice — and the right next step.
            </p>
            <Magnetic>
              <Link href="/contact" data-cursor className="inline-flex h-14 items-center justify-center rounded-full bg-primary px-10 text-base font-medium text-primary-foreground shadow transition-all hover:bg-primary/90 hover:scale-105 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                Consult Us <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Magnetic>
          </div>
        </div>
      </section>
    </div>
  );
}
