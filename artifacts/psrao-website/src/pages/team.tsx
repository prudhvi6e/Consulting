import { useEffect } from "react";
import { motion } from "framer-motion";
import psrMonogram from "@/assets/images/psr-monogram.png";
import vikasImg from "@/assets/brand/vikas-sirohiya.jpg";
import vanithaImg from "@/assets/brand/n-vanitha.jpg";

const teamMembers = [
  {
    name: "Mr. P S Rao",
    role: "Founder Partner",
    image: psrMonogram,
    desc: "A Commerce Graduate and a fellow member of Company Secretary with nearly two decades of experience. Expert in Company Law, FEMA, Mergers & Acquisitions, Corporate Restructuring, Joint Ventures, Due Diligence Audits, and Capital Market Issues. Former member of the Secretarial Standards Board of ICSI."
  },
  {
    name: "Mr. Vikas Sirohiya",
    role: "Associate Member, ICSI",
    image: vikasImg,
    desc: "Qualified as a Company Secretary in 1999 with over 12 years of experience in legal, secretarial, capital markets, and corporate affairs. Actively engages with governmental authorities including ROC, Regional Directors, MCA, RBI, and SEBI."
  },
  {
    name: "Ms. N. Vanitha",
    role: "Associate Member, ICSI",
    image: vanithaImg,
    desc: "An associate of the firm with expertise handling various secretarial matters, statutory compliances, and related corporate governance issues."
  }
];

export default function Team() {
  useEffect(() => {
    document.title = "Our Team | PS Rao & Associates";
  }, []);

  return (
    <div className="w-full pt-20">
      <section className="py-20 md:py-32 bg-card border-b border-border">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-6">
              Our <span className="text-primary">Team</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              "A team is a reflection of its leadership." Comprising 25 members, we are an ideal blend of young talent and experience, equipped to take up challenges in a dynamic corporate environment.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="space-y-24">
            {teamMembers.map((member, i) => (
              <motion.div 
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex flex-col md:flex-row gap-10 items-start"
              >
                <div className="w-full md:w-1/3 lg:w-1/4 shrink-0">
                  <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-muted border border-border">
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                  </div>
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
          
          <div className="mt-32 p-10 bg-secondary rounded-3xl text-center">
            <h3 className="text-2xl font-display font-bold text-white mb-4">Supported by 20+ dedicated professionals</h3>
            <p className="text-secondary-foreground/80 max-w-2xl mx-auto">
              Our leadership is backed by a robust team of qualified associates, article assistants, and support staff working round the clock to ensure seamless compliance for your business.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
