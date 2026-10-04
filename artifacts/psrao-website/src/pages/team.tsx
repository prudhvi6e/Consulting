import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Reveal } from "@/components/motion/Reveal";
import { Magnetic } from "@/components/motion/Magnetic";
import { TiltCard } from "@/components/motion/TiltCard";
import { LampContainer } from "@/components/ui/lamp";
import { getTeam, assetUrl } from "@/lib/cms";
import psRaoImg from "@/assets/brand/p-s-rao.jpg";
import saiImg from "@/assets/brand/p-sai-sampath.jpg";

const teamMembers = [
  {
    name: "Mr. P S Rao",
    role: "Founder Partner",
    image: psRaoImg,
    desc: "A Commerce Graduate and a fellow member of Company Secretary with nearly two decades of experience. Expert in Company Law, FEMA, Mergers & Acquisitions, Corporate Restructuring, Joint Ventures, Due Diligence Audits, and Capital Market Issues. Former member of the Secretarial Standards Board of ICSI."
  },
  {
    name: "Mr. P Sai Sampath",
    role: "Director",
    image: saiImg,
    desc: "A young entrepreneur and a professional in the secretarial sector with over 8 years of experience. He completed his Company Secretary (CS) qualification in 2022 and works closely with the firm's leadership across corporate secretarial and compliance engagements."
  }
];

export default function Team() {
  useEffect(() => {
    document.title = "Our Team | PS Rao Corporate Solutions Pvt. Ltd.";
  }, []);

  // Content from the CMS; falls back to the bundled defaults if the CMS is unreachable.
  const { data: cmsTeam } = useQuery({ queryKey: ["cms", "team"], queryFn: getTeam });
  const members = cmsTeam?.length
    ? cmsTeam.map((m) => ({ name: m.name, role: m.role, image: assetUrl(m.image), desc: m.desc }))
    : teamMembers;

  return (
    <div className="w-full">
      {/* Hero — lamp effect (light theme), centered in the viewport */}
      <LampContainer surfaceClassName="bg-background" contentClassName="-translate-y-32" className="min-h-[64vh] rounded-none pt-[150px]">
        <motion.h1
          initial={{ opacity: 0.5, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          className="bg-gradient-to-br from-slate-900 to-slate-600 py-4 bg-clip-text text-center text-4xl md:text-7xl font-display font-bold tracking-tight text-transparent"
        >
          Our Team
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8, ease: "easeInOut" }}
          className="mt-3 max-w-xl text-center text-base md:text-lg text-muted-foreground leading-relaxed"
        >
          "A team is a reflection of its leadership." Comprising 25 members — an ideal blend of young talent and seasoned experience, ready for a dynamic corporate environment.
        </motion.p>
      </LampContainer>

      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="space-y-24">
            {members.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col md:flex-row gap-10 items-start"
              >
                <div className="w-full md:w-1/3 lg:w-1/4 shrink-0">
                  <TiltCard max={8} className="aspect-[4/5] rounded-2xl overflow-hidden bg-muted border border-border">
                    <img src={member.image} alt={member.name} loading="lazy" decoding="async" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                  </TiltCard>
                </div>
                <div className="w-full md:w-2/3 lg:w-3/4 flex flex-col justify-center py-4">
                  <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">{member.name}</h2>
                  <h3 className="text-xl text-primary font-medium mb-6">{member.role}</h3>
                  <div className="w-12 h-1 bg-border mb-6" />
                  <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
                    {member.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
          
          <Reveal className="mt-32 bg-primary/5 border border-primary/20 rounded-3xl p-10 md:p-16 text-center max-w-4xl mx-auto backdrop-blur-sm">
            <h3 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-5">Supported by 25 dedicated professionals</h3>
            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
              Our leadership is backed by a robust team of qualified associates, article assistants, and support staff working round the clock to ensure seamless compliance for your business.
            </p>
            <Magnetic>
              <Link href="/careers" data-cursor className="inline-flex h-14 items-center justify-center rounded-full bg-primary px-10 text-base font-medium text-primary-foreground shadow transition-all hover:bg-primary/90 hover:scale-105 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                Explore Careers <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Magnetic>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
