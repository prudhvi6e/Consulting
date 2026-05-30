import { useEffect } from "react";
import psrMonogram from "@/assets/images/psr-monogram.png";
import vikasImg from "@/assets/brand/vikas-sirohiya.jpg";
import vanithaImg from "@/assets/brand/n-vanitha.jpg";
import { Reveal } from "@/components/visual/Reveal";
import { TiltCard } from "@/components/visual/TiltCard";
import { Parallax } from "@/components/visual/Parallax";

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
    <div className="w-full pt-20 bg-transparent overflow-hidden relative">
      <Parallax offset={100} className="absolute top-0 right-0 w-[50vw] h-[50vw] max-w-[800px] bg-primary/15 rounded-full blur-[150px] mix-blend-screen pointer-events-none animate-aurora" />
      
      <section className="py-24 md:py-40 relative z-10 glass-panel border-b border-white/10 shadow-xl">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl">
            <Reveal>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/30 text-primary text-sm font-medium mb-8 shadow-[0_0_20px_rgba(46,107,255,0.2)]">
                <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(46,107,255,1)] animate-pulse" />
                Leadership
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="text-6xl md:text-8xl font-display font-bold text-foreground mb-10 tracking-tight drop-shadow-md">
                Meet the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400 drop-shadow-lg">Experts.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-2xl md:text-3xl text-foreground/80 leading-relaxed font-light max-w-3xl">
                "A team is a reflection of its leadership." Comprising 25 members, we are an ideal blend of young talent and experience, equipped to take up challenges in a dynamic corporate environment.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="py-32 relative z-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="space-y-40">
            {teamMembers.map((member, i) => (
              <Reveal key={member.name} delay={0.1}>
                <div className={`flex flex-col ${i % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-16 lg:gap-24 items-center`}>
                  <div className="w-full md:w-2/5 shrink-0 relative">
                    <TiltCard glow={true}>
                      {/* Decorative backdrop */}
                      <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 to-transparent rounded-[3rem] transform scale-95 opacity-50 blur-xl pointer-events-none transition-all duration-700" />
                      <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden glass border border-white/20 shadow-2xl group">
                        <img src={member.image} alt={member.name} className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                        <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[2.5rem] pointer-events-none" />
                      </div>
                    </TiltCard>
                  </div>
                  <div className="w-full md:w-3/5 flex flex-col justify-center relative">
                    <div className="mb-10">
                       <h2 className="text-5xl md:text-6xl font-display font-bold text-foreground mb-4 tracking-tight drop-shadow-sm">{member.name}</h2>
                       <h3 className="text-2xl md:text-3xl text-primary font-medium">{member.role}</h3>
                    </div>
                    <div className="w-24 h-1 bg-gradient-to-r from-primary to-transparent mb-10 rounded-full" />
                    <p className="text-xl md:text-2xl text-foreground/80 leading-relaxed font-light glass p-8 rounded-3xl border border-white/10 shadow-lg">
                      {member.desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          
          <Reveal>
            <TiltCard glow={false}>
              <div className="mt-48 p-16 md:p-24 glass-panel rounded-[3.5rem] text-center relative overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-[url('@/assets/images/office-abstract.png')] opacity-5 mix-blend-overlay object-cover scale-110" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
                <div className="relative z-10">
                   <h3 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-8 tracking-tight drop-shadow-md">Supported by 20+ dedicated professionals</h3>
                   <p className="text-2xl text-foreground/80 max-w-4xl mx-auto font-light leading-relaxed">
                     Our leadership is backed by a robust team of qualified associates, article assistants, and support staff working round the clock to ensure seamless compliance for your business.
                   </p>
                </div>
              </div>
            </TiltCard>
          </Reveal>
        </div>
      </section>
    </div>
  );
}