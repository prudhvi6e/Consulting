import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Send, CheckCircle2, Calendar as CalendarIcon, Clock, Building2 } from "lucide-react";
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
    <div className="w-full pt-20 bg-background relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      <section className="py-20 md:py-32 relative z-10 border-b border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
               Get in Touch
             </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold text-foreground mb-6 tracking-tight">
              Let's <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Connect.</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-light">
              Reach out for specialized corporate advice or to schedule a strategic consultation with our partners.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 relative z-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
            
            {/* Contact Info & Map */}
            <div className="lg:col-span-5 space-y-12">
              <div className="p-8 rounded-3xl bg-card border border-border shadow-lg">
                <h2 className="text-3xl font-display font-bold text-foreground mb-8 flex items-center gap-3">
                  <Building2 className="w-8 h-8 text-primary" />
                  Corporate Office
                </h2>
                <div className="space-y-8">
                  <div className="flex gap-4 items-start group">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <MapPin className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">Address</h4>
                      <p className="text-foreground leading-relaxed font-medium">
                        D.No. 6-3-347-22/2, Flat-10, 4th Floor,<br />
                        Iswarya Nilayam, Dwarakapuri Colony,<br />
                        Punjagutta, Hyderabad 500081, AP
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 items-start group">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Phone className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">Tele-Fax</h4>
                      <p className="text-foreground leading-relaxed font-medium">
                        040-23352185 / 6
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start group">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Mail className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">Email</h4>
                      <p className="text-foreground leading-relaxed font-medium">
                        info@psraoassociates.com
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Embed */}
              <div className="h-[400px] w-full rounded-3xl overflow-hidden border border-border shadow-lg p-2 bg-card">
                <div className="w-full h-full rounded-2xl overflow-hidden">
                  <iframe 
                    src="https://www.google.com/maps?q=Dwarakapuri%20Colony%2C%20Punjagutta%2C%20Hyderabad%20500081&output=embed" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade" 
                    title="PS Rao & Associates Office Location" 
                    className="w-full h-full bg-muted grayscale hover:grayscale-0 transition-all duration-700"
                  />
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-7 bg-card/60 backdrop-blur-xl border border-border rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
              {/* Decorative inner glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />

              {isSuccess ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 bg-card/95 backdrop-blur-md z-10 flex flex-col items-center justify-center text-center p-8"
                >
                  <div className="w-24 h-24 bg-green-500/10 border border-green-500/20 rounded-3xl flex items-center justify-center mb-8 text-green-500 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                    <CheckCircle2 className="w-12 h-12" />
                  </div>
                  <h3 className="text-3xl font-display font-bold text-foreground mb-4">Ready to Send</h3>
                  <p className="text-lg text-muted-foreground mb-10 max-w-md font-light">Your email client should now be open with your consultation request prepared. Prefer to reach us directly? Email <span className="text-foreground font-medium">info@psraoassociates.com</span>.</p>
                  <Button variant="outline" size="lg" className="rounded-full" onClick={() => setIsSuccess(false)}>Compose Another</Button>
                </motion.div>
              ) : null}

              <h3 className="text-3xl font-display font-bold text-foreground mb-8">Schedule a Consultation</h3>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 relative z-10">
                  
                  {/* Scheduling Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 rounded-3xl bg-background/50 border border-border shadow-inner">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Preferred Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full h-14 pl-4 text-left font-medium bg-card border-border hover:border-primary/50 transition-colors rounded-xl",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-5 w-5 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 bg-card border-border rounded-xl shadow-xl" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  isBefore(date, startOfDay(new Date())) || isWeekend(date)
                                }
                                initialFocus
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
                          <FormLabel className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Time Slot</FormLabel>
                          <div className="grid grid-cols-3 gap-2" role="group" aria-label="Preferred time slot">
                            {TIME_SLOTS.map((time) => (
                              <div key={time}>
                                <FormControl>
                                  <Button
                                    type="button"
                                    variant={field.value === time ? "default" : "outline"}
                                    aria-pressed={field.value === time}
                                    className={cn(
                                      "w-full h-12 bg-card border-border transition-colors rounded-lg font-medium",
                                      field.value === time && "bg-primary text-primary-foreground border-primary hover:bg-primary/90 shadow-[0_0_15px_rgba(46,107,255,0.3)]"
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} className="h-14 bg-background/50 border-border rounded-xl px-4" />
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
                          <FormLabel className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Email Address</FormLabel>
                          <FormControl>
                            <Input placeholder="john@company.com" {...field} className="h-14 bg-background/50 border-border rounded-xl px-4" />
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
                        <FormLabel className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Company / Organization</FormLabel>
                        <FormControl>
                          <Input placeholder="Acme Corp (Optional)" {...field} className="h-14 bg-background/50 border-border rounded-xl px-4" />
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
                        <FormLabel className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Topic of Consultation</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Briefly describe your requirements..." 
                            className="min-h-[150px] bg-background/50 border-border rounded-xl p-4 resize-none text-base"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full h-16 rounded-2xl text-lg font-bold shadow-[0_0_20px_rgba(46,107,255,0.3)] hover:shadow-[0_0_30px_rgba(46,107,255,0.5)] transition-all" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? "Preparing..." : (
                      <>Prepare Consultation Request <Send className="ml-2 w-5 h-5" /></>
                    )}
                  </Button>
                </form>
              </Form>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}