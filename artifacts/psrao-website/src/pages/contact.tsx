import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Send, CheckCircle2, Calendar as CalendarIcon, Building2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, isBefore, startOfDay, isWeekend } from "date-fns";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/visual/Reveal";
import { TiltCard } from "@/components/visual/TiltCard";
import { Parallax } from "@/components/visual/Parallax";

const TIME_SLOTS = ["10:00", "11:30", "14:00", "15:30", "17:00"];

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  company: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters."),
  date: z.date({
    required_error: "A consultation date is required.",
  }),
  time: z.string({
    required_error: "A time slot is required.",
  }),
});

export default function Contact() {
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    document.title = "Contact Us | PS Rao & Associates";
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      message: "",
    }
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const formattedDate = format(values.date, "MMMM do, yyyy");
    const subject = `Consultation Request: ${values.name}${values.company ? ` (${values.company})` : ""}`;
    const body = `Name: ${values.name}\nEmail: ${values.email}\nCompany: ${values.company || "—"}\n\nRequested Date: ${formattedDate}\nRequested Time: ${values.time}\n\nMessage:\n${values.message}`;
    window.location.href = `mailto:info@psraoassociates.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setIsSuccess(true);
    form.reset();
  }

  return (
    <div className="w-full pt-20 bg-transparent relative overflow-hidden">
      <Parallax offset={150} className="absolute top-0 right-0 w-[70vw] h-[70vw] max-w-[900px] bg-primary/15 rounded-full blur-[180px] pointer-events-none mix-blend-screen animate-aurora" />
      <Parallax offset={-100} className="absolute bottom-0 left-0 w-[50vw] h-[50vw] max-w-[700px] bg-blue-500/10 rounded-full blur-[150px] pointer-events-none mix-blend-screen animate-aurora-reverse" />

      <section className="py-24 md:py-40 relative z-10 glass-panel border-b border-white/10 shadow-xl">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl">
             <Reveal>
               <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/30 text-primary text-sm font-medium mb-8 shadow-[0_0_20px_rgba(46,107,255,0.2)]">
                 <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(46,107,255,1)] animate-pulse" />
                 Get in Touch
               </div>
             </Reveal>
            <Reveal delay={0.1}>
              <h1 className="text-6xl md:text-8xl font-display font-bold text-foreground mb-8 tracking-tight drop-shadow-md">
                Let's <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400 drop-shadow-lg">Connect.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-2xl md:text-3xl text-foreground/80 leading-relaxed font-light max-w-2xl">
                Reach out for specialized corporate advice or to schedule a strategic consultation with our partners.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="py-32 relative z-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
            
            {/* Contact Info & Map */}
            <div className="lg:col-span-5 space-y-12">
              <Reveal>
                <TiltCard glow={true}>
                  <div className="p-10 md:p-12 rounded-[3rem] glass border border-white/10 shadow-2xl relative overflow-hidden h-full">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-primary/20 blur-[60px] rounded-full pointer-events-none mix-blend-screen" />
                    
                    <h2 className="text-4xl font-display font-bold text-foreground mb-12 flex items-center gap-4 drop-shadow-sm">
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <Building2 className="w-8 h-8 text-primary drop-shadow-[0_0_8px_rgba(46,107,255,0.8)]" />
                      </div>
                      Corporate Office
                    </h2>
                    
                    <div className="space-y-10 relative z-10">
                      <div className="flex gap-6 items-start group">
                        <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center shrink-0 border border-white/20 group-hover:bg-primary group-hover:border-primary group-hover:shadow-[0_0_20px_rgba(46,107,255,0.5)] transition-all duration-300">
                          <MapPin className="w-6 h-6 text-foreground group-hover:text-white transition-colors" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold uppercase tracking-widest text-primary mb-2">Address</h4>
                          <p className="text-foreground/90 leading-relaxed font-medium text-lg">
                            D.No. 6-3-347-22/2, Flat-10, 4th Floor,<br />
                            Iswarya Nilayam, Dwarakapuri Colony,<br />
                            Punjagutta, Hyderabad 500081, AP
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex gap-6 items-start group">
                        <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center shrink-0 border border-white/20 group-hover:bg-primary group-hover:border-primary group-hover:shadow-[0_0_20px_rgba(46,107,255,0.5)] transition-all duration-300">
                          <Phone className="w-6 h-6 text-foreground group-hover:text-white transition-colors" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold uppercase tracking-widest text-primary mb-2">Tele-Fax</h4>
                          <p className="text-foreground/90 leading-relaxed font-medium text-lg">
                            040-23352185 / 6
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-6 items-start group">
                        <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center shrink-0 border border-white/20 group-hover:bg-primary group-hover:border-primary group-hover:shadow-[0_0_20px_rgba(46,107,255,0.5)] transition-all duration-300">
                          <Mail className="w-6 h-6 text-foreground group-hover:text-white transition-colors" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold uppercase tracking-widest text-primary mb-2">Email</h4>
                          <a href="mailto:info@psraoassociates.com" className="text-foreground/90 leading-relaxed font-medium text-lg hover:text-primary transition-colors">
                            info@psraoassociates.com
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </Reveal>

              {/* Map Embed */}
              <Reveal delay={0.2}>
                <div className="h-[450px] w-full rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl p-2 glass">
                  <div className="w-full h-full rounded-[2.5rem] overflow-hidden">
                    <iframe 
                      src="https://www.google.com/maps?q=Dwarakapuri%20Colony%2C%20Punjagutta%2C%20Hyderabad%20500081&output=embed" 
                      width="100%" 
                      height="100%" 
                      style={{ border: 0 }} 
                      allowFullScreen 
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade" 
                      title="PS Rao & Associates Office Location" 
                      className="w-full h-full bg-muted grayscale hover:grayscale-0 transition-all duration-700 opacity-80 hover:opacity-100"
                    />
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-7">
              <Reveal delay={0.1}>
                <div className="glass-panel border border-white/10 rounded-[3.5rem] p-10 md:p-16 shadow-2xl relative overflow-hidden">
                  {/* Decorative inner glow */}
                  <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />

                  {isSuccess ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute inset-0 bg-card/95 backdrop-blur-xl z-20 flex flex-col items-center justify-center text-center p-12"
                    >
                      <div className="w-32 h-32 glass border border-green-500/30 rounded-[2.5rem] flex items-center justify-center mb-10 text-green-500 shadow-[0_0_40px_rgba(34,197,94,0.3)]">
                        <CheckCircle2 className="w-16 h-16 drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
                      </div>
                      <h3 className="text-5xl font-display font-bold text-foreground mb-6">Ready to Send</h3>
                      <p className="text-xl text-foreground/70 mb-12 max-w-lg font-light leading-relaxed">Your email client should now be open with your consultation request prepared. Prefer to reach us directly? Email <span className="text-primary font-bold">info@psraoassociates.com</span>.</p>
                      <Button variant="outline" size="lg" className="rounded-full h-14 px-8 glass font-bold hover:bg-white/10" onClick={() => setIsSuccess(false)}>Compose Another</Button>
                    </motion.div>
                  ) : null}

                  <h3 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-12 drop-shadow-sm relative z-10">Schedule a Consultation</h3>
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10 relative z-10">
                      
                      {/* Scheduling Section */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-10 rounded-[2.5rem] glass border border-white/5 shadow-inner">
                        <FormField
                          control={form.control}
                          name="date"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel className="text-sm font-bold uppercase tracking-widest text-foreground/80 mb-2 flex items-center gap-2"><CalendarIcon className="w-4 h-4 text-primary" /> Preferred Date</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "w-full h-16 pl-6 text-left font-medium glass border-white/10 hover:bg-white/10 hover:border-white/20 transition-all rounded-2xl text-lg shadow-sm",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                      <CalendarIcon className="ml-auto h-5 w-5 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0 glass border-white/10 rounded-2xl shadow-2xl" align="start">
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) => isBefore(date, startOfDay(new Date())) || isWeekend(date)}
                                    initialFocus
                                    className="bg-card/50 rounded-2xl"
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="time"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel className="text-sm font-bold uppercase tracking-widest text-foreground/80 mb-2">Time Slot</FormLabel>
                              <div className="grid grid-cols-3 gap-3" role="group" aria-label="Preferred time slot">
                                {TIME_SLOTS.map((time) => (
                                  <div key={time}>
                                    <FormControl>
                                      <Button
                                        type="button"
                                        variant="outline"
                                        aria-pressed={field.value === time}
                                        className={cn(
                                          "w-full h-12 glass border-white/10 transition-all rounded-xl font-bold shadow-sm hover:bg-white/10 hover:border-white/20",
                                          field.value === time && "bg-primary text-primary-foreground border-primary hover:bg-primary/90 shadow-[0_0_15px_rgba(46,107,255,0.4)]"
                                        )}
                                        onClick={() => field.onChange(time)}
                                      >
                                        {time}
                                      </Button>
                                    </FormControl>
                                  </div>
                                ))}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Contact Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-bold uppercase tracking-widest text-foreground/80 mb-2">Full Name</FormLabel>
                              <FormControl>
                                <Input placeholder="John Doe" {...field} className="h-16 glass border-white/10 hover:border-white/20 focus:border-primary focus:ring-primary/20 rounded-2xl px-6 text-lg shadow-sm transition-all" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-bold uppercase tracking-widest text-foreground/80 mb-2">Email Address</FormLabel>
                              <FormControl>
                                <Input placeholder="john@company.com" {...field} className="h-16 glass border-white/10 hover:border-white/20 focus:border-primary focus:ring-primary/20 rounded-2xl px-6 text-lg shadow-sm transition-all" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="company"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-bold uppercase tracking-widest text-foreground/80 mb-2">Company / Organization</FormLabel>
                            <FormControl>
                              <Input placeholder="Acme Corp (Optional)" {...field} className="h-16 glass border-white/10 hover:border-white/20 focus:border-primary focus:ring-primary/20 rounded-2xl px-6 text-lg shadow-sm transition-all" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-bold uppercase tracking-widest text-foreground/80 mb-2">Topic of Consultation</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Briefly describe your requirements..." 
                                className="min-h-[180px] glass border-white/10 hover:border-white/20 focus:border-primary focus:ring-primary/20 rounded-2xl p-6 resize-none text-lg shadow-sm transition-all"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full h-16 rounded-[2rem] text-lg font-bold shadow-[0_0_20px_rgba(46,107,255,0.4)] hover:shadow-[0_0_30px_rgba(46,107,255,0.6)] hover:scale-[1.02] transition-all bg-primary hover:bg-primary/90" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? "Preparing..." : (
                          <>Prepare Consultation Request <Send className="ml-3 w-5 h-5" /></>
                        )}
                      </Button>
                    </form>
                  </Form>
                </div>
              </Reveal>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}