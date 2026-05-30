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
    <div className="w-full pt-20 bg-background overflow-hidden relative">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] mix-blend-screen pointer-events-none" />
      
      <section className="py-20 md:py-32 relative z-10 border-b border-border/50 bg-card/30 backdrop-blur-md">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              Leadership
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold text-foreground mb-8 tracking-tight">
              Meet the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Experts.</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-light max-w-3xl">
              "A team is a reflection of its leadership." Comprising 25 members, we are an ideal blend of young talent and experience, equipped to take up challenges in a dynamic corporate environment.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 relative z-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="space-y-32">
            {teamMembers.map((member, i) => (
              <motion.div 
                key={member.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className={`flex flex-col ${i % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-12 lg:gap-20 items-center`}
              >
                <div className="w-full md:w-2/5 shrink-0 relative group">
                  {/* Decorative backdrop */}
                  <div className="absolute -inset-4 bg-gradient-to-br from-primary/10 to-transparent rounded-[2.5rem] transform group-hover:scale-105 transition-transform duration-700 pointer-events-none" />
                  <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-card border border-border shadow-2xl">
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
                  </div>
                </div>
                <div className="w-full md:w-3/5 flex flex-col justify-center">
                  <div className="mb-8">
                     <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4 tracking-tight">{member.name}</h2>
                     <h3 className="text-xl md:text-2xl text-primary font-medium">{member.role}</h3>
                  </div>
                  <div className="w-16 h-1 bg-gradient-to-r from-primary to-transparent mb-8" />
                  <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-light">
                    {member.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mt-40 p-12 md:p-20 bg-secondary rounded-[3rem] text-center relative overflow-hidden border border-border/20 shadow-2xl"
          >
            <div className="absolute inset-0 bg-[url('@/assets/images/office-abstract.png')] opacity-10 mix-blend-overlay object-cover" />
            <div className="relative z-10">
               <h3 className="text-3xl md:text-5xl font-display font-bold text-white mb-6 tracking-tight">Supported by 20+ dedicated professionals</h3>
               <p className="text-xl text-secondary-foreground/80 max-w-3xl mx-auto font-light leading-relaxed">
                 Our leadership is backed by a robust team of qualified associates, article assistants, and support staff working round the clock to ensure seamless compliance for your business.
               </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}