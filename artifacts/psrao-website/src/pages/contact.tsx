import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Send, CheckCircle2, Calendar as CalendarIcon, Clock } from "lucide-react";
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
    <div className="w-full pt-20">
      <section className="py-20 md:py-32 bg-card border-b border-border">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-6">
              Let's <span className="text-primary">Connect</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Reach out for specialized corporate advice or to schedule a consultation with our partners.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* Contact Info & Map */}
            <div className="lg:col-span-5 space-y-12">
              <div>
                <h2 className="text-3xl font-display font-bold text-foreground mb-8">Corporate Office</h2>
                <div className="space-y-8">
                  <div className="flex gap-4 items-start">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-foreground mb-2">Address</h4>
                      <p className="text-muted-foreground leading-relaxed">
                        D.No. 6-3-347-22/2, Flat-10, 4th Floor,<br />
                        Iswarya Nilayam, Dwarakapuri Colony,<br />
                        Punjagutta, Hyderabad 500081, AP
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 items-start">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-foreground mb-2">Tele-Fax</h4>
                      <p className="text-muted-foreground leading-relaxed">
                        040-23352185 / 6
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-foreground mb-2">Email</h4>
                      <p className="text-muted-foreground leading-relaxed">
                        info@psraoassociates.com
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Embed */}
              <div className="h-[300px] w-full rounded-2xl overflow-hidden border border-border shadow-sm">
                <iframe 
                  src="https://www.google.com/maps?q=Dwarakapuri%20Colony%2C%20Punjagutta%2C%20Hyderabad%20500081&output=embed" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade" 
                  title="PS Rao & Associates Office Location" 
                  className="w-full h-full bg-muted"
                />
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-7 bg-card border border-border rounded-3xl p-8 md:p-10 shadow-sm relative overflow-hidden">
              {isSuccess ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 bg-card z-10 flex flex-col items-center justify-center text-center p-8"
                >
                  <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6 text-green-500">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-foreground mb-3">Ready to Send</h3>
                  <p className="text-muted-foreground mb-8">Your email client should now be open with your consultation request prepared. Prefer to reach us directly? Email <span className="text-foreground font-medium">info@psraoassociates.com</span> or call <span className="text-foreground font-medium">040-23352185</span>.</p>
                  <Button variant="outline" onClick={() => setIsSuccess(false)}>Compose Another</Button>
                </motion.div>
              ) : null}

              <h3 className="text-2xl font-display font-bold text-foreground mb-6">Schedule a Consultation</h3>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  
                  {/* Scheduling Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-muted/50 border border-border/50">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Preferred Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full h-12 pl-3 text-left font-normal bg-background",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 bg-card" align="start">
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
                          <FormLabel>Time Slot</FormLabel>
                          <div className="grid grid-cols-3 gap-2" role="group" aria-label="Preferred time slot">
                            {TIME_SLOTS.map((time) => (
                              <div key={time}>
                                <FormControl>
                                  <Button
                                    type="button"
                                    variant={field.value === time ? "default" : "outline"}
                                    aria-pressed={field.value === time}
                                    className={cn(
                                      "w-full bg-background transition-colors",
                                      field.value === time && "bg-primary text-primary-foreground hover:bg-primary/90"
                                    )}
                                    onClick={() => field.onChange(time)}
                                  >
                                    <Clock className="w-3 h-3 mr-2 hidden sm:inline" />
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
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} className="bg-background" />
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
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input placeholder="john@company.com" {...field} className="bg-background" />
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
                        <FormLabel>Company / Organization</FormLabel>
                        <FormControl>
                          <Input placeholder="Acme Corp (Optional)" {...field} className="bg-background" />
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
                        <FormLabel>Topic of Consultation</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Briefly describe your requirements..." 
                            className="min-h-[120px] bg-background resize-none"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full h-12 text-base font-semibold" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? "Preparing..." : (
                      <>Prepare Consultation Request <Send className="ml-2 w-4 h-4" /></>
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
