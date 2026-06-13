import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Phone, Mail, Send, CheckCircle2, Clock, Building2, UserRound, ArrowLeft, CalendarCheck, Loader2, Video, Users } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { WordReveal } from "@/components/motion/Reveal";
import { ConnectionField } from "@/components/motion/ConnectionField";
import { ConsultationCalendar } from "@/components/ConsultationCalendar";
import { getSiteSettings } from "@/lib/cms";
import {
  getAvailableSlots,
  createMeeting,
  slotLabel,
  slotRangeLabel,
  buildStartEnd,
  type Slot,
  type CreateMeetingResult,
} from "@/lib/booking";

const darkInput =
  "h-14 bg-white/10 border border-white/15 rounded-xl px-4 text-white placeholder:text-white/40 focus-visible:border-primary focus-visible:shadow-[0_0_0_4px_rgba(14,165,233,0.2)] transition-shadow";
const darkLabel = "text-xs font-bold uppercase tracking-wider text-white/60";

const emailRe = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  company: z.string().optional(),
  guests: z
    .string()
    .optional()
    .refine(
      (v) => !v || !v.trim() || v.split(",").every((e) => emailRe.test(e.trim())),
      "Enter valid email addresses separated by commas.",
    ),
  message: z.string().min(10, "Message must be at least 10 characters."),
  date: z.date({ required_error: "Please pick a consultation date." }),
  time: z.string({ required_error: "Please select a time slot." }).min(1, "Please select a time slot."),
});

type FormValues = z.infer<typeof formSchema>;

export default function Contact() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [result, setResult] = useState<CreateMeetingResult | null>(null);

  useEffect(() => {
    document.title = "Contact Us | PS Rao Corporate Solutions";
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", company: "", guests: "", message: "", time: "" },
  });
  const watchDate = form.watch("date");
  const dateStr = watchDate ? format(watchDate, "yyyy-MM-dd") : "";

  // Office/contact details from the CMS (falls back to the bundled values).
  const { data: settings } = useQuery({ queryKey: ["cms", "settings"], queryFn: getSiteSettings });

  // Open slots for the chosen day (read-only).
  const {
    data: slots,
    isLoading: slotsLoading,
    isError: slotsError,
  } = useQuery({
    queryKey: ["slots", dateStr],
    queryFn: () => getAvailableSlots(dateStr),
    enabled: !!dateStr,
    retry: 1,
  });

  const mutation = useMutation({
    mutationFn: createMeeting,
    onSuccess: (data) => {
      setResult(data);
      setIsSuccess(true);
      form.reset();
    },
  });

  function onSubmit(values: FormValues) {
    const slot = JSON.parse(values.time) as Slot;
    const { startDateTime, endDateTime } = buildStartEnd(slot, values.date);
    const guestEmails = (values.guests ?? "")
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
    const attendees = Array.from(new Set([...guestEmails, values.email.trim().toLowerCase()]));

    mutation.mutate({
      eventName: `${values.name} Consultation`,
      startDateTime,
      endDateTime,
      attendees,
      timeZone: "Asia/Kolkata",
      agenda: values.message,
    });
  }

  return (
    <div className="w-full pt-20 bg-background relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-sky-400/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Hero */}
      <section className="py-20 md:py-28 relative z-10 border-b border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Left — copy */}
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
                Get in Touch
              </div>
              <h1 className="text-5xl md:text-7xl font-display font-bold text-foreground mb-6 tracking-tight">
                <WordReveal text="Let's" />{" "}
                <WordReveal text="Connect." delay={0.1} className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-sky-300" />
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-light">
                Reach out for specialized corporate advice or to schedule a strategic consultation with our partners.
              </p>
            </div>

            {/* Right — interactive connection constellation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full aspect-[4/3] lg:aspect-square max-w-[560px] mx-auto"
            >
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[70%] h-[70%] rounded-full bg-primary/15 blur-[90px]" />
              </div>
              <ConnectionField className="absolute inset-0 h-full w-full [mask-image:radial-gradient(circle_at_center,#000_60%,transparent_92%)]" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Scheduler */}
      <section className="py-16 md:py-24 relative z-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="relative rounded-[2.5rem] text-white border border-white/15 shadow-2xl overflow-hidden">
            {/* Dark base + animated sky-blue motion shades, behind the glass */}
            <div aria-hidden className="absolute inset-0 bg-secondary" />
            <motion.div
              aria-hidden
              className="absolute -top-24 -left-16 w-[480px] h-[480px] rounded-full bg-sky-400/40 blur-[120px] pointer-events-none"
              animate={{ x: [0, 70, 0], y: [0, 40, 0], scale: [1, 1.15, 1] }}
              transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              aria-hidden
              className="absolute top-1/4 -right-10 w-[520px] h-[520px] rounded-full bg-primary/40 blur-[130px] pointer-events-none"
              animate={{ x: [0, -60, 0], y: [0, 50, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />
            <motion.div
              aria-hidden
              className="absolute -bottom-28 left-1/3 w-[460px] h-[460px] rounded-full bg-cyan-400/30 blur-[120px] pointer-events-none"
              animate={{ x: [0, 50, -40, 0], y: [0, -30, 0, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* Frosted glass overlay */}
            <div aria-hidden className="absolute inset-0 bg-white/[0.05] backdrop-blur-2xl" />

            {isSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 bg-secondary/95 backdrop-blur-md z-20 flex flex-col items-center justify-center text-center p-8"
              >
                <div className="w-24 h-24 bg-green-500/10 border border-green-500/20 rounded-3xl flex items-center justify-center mb-8 text-green-400 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <h3 className="text-3xl font-display font-bold text-white mb-4">Consultation Scheduled!</h3>
                <p className="text-lg text-white/70 mb-8 max-w-md font-light">
                  A Google Calendar invite with all the details is on its way to your inbox{result?.meetLink ? " — join the call using the link below" : ""}.
                </p>
                {result?.meetLink && (
                  <a href={result.meetLink} target="_blank" rel="noreferrer" className="mb-6">
                    <Button size="lg" className="rounded-full shadow-[0_0_20px_rgba(14,165,233,0.4)]">
                      <Video className="mr-2 w-5 h-5" /> Join Google Meet
                    </Button>
                  </a>
                )}
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full bg-transparent border-white/30 text-white hover:bg-white/10"
                  onClick={() => {
                    setIsSuccess(false);
                    setResult(null);
                    mutation.reset();
                  }}
                >
                  Book Another
                </Button>
              </motion.div>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="relative z-10">
                <div className="grid">
                  <div className="[grid-area:1/1] grid grid-cols-1 lg:grid-cols-2">
                  {/* Left — consultant info */}
                  <div className="p-8 md:p-12 lg:p-14 lg:border-r border-white/10">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-sky-400 flex items-center justify-center mb-6 shadow-[0_0_24px_rgba(14,165,233,0.4)]">
                      <UserRound className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-sm text-white/60 mb-3">PS Rao Consultant</p>
                    <h2 className="text-3xl md:text-4xl font-display font-bold mb-5 leading-tight">
                      Schedule your free{" "}
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-sky-300">consultation</span> here.
                    </h2>
                    <p className="text-white/70 leading-relaxed max-w-md mb-8">
                      A quick meeting where we discuss how PS Rao Corporate Solutions can help with your secretarial, compliance and governance needs. You'll receive a Google Calendar invite with a Meet link.
                    </p>
                    <div className="inline-flex items-center gap-2 text-white/80 text-sm font-medium rounded-full border border-white/15 bg-white/5 px-4 py-2">
                      <Clock className="w-4 h-4 text-primary" /> 30 min
                    </div>
                    {watchDate && (
                      <div className="mt-8 inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm font-medium text-white">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        {format(watchDate, "EEEE, MMMM d, yyyy")}
                      </div>
                    )}
                  </div>

                  {/* Right — calendar */}
                  <div className="p-8 md:p-12 lg:p-14">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <ConsultationCalendar
                            value={field.value}
                            onSelect={(d) => {
                              field.onChange(d);
                              form.resetField("time");
                            }}
                          />
                          <FormMessage className="text-red-300" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Booking overlay — pops forward over the same section after a date is picked */}
                <AnimatePresence>
                  {watchDate && !isSuccess && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="[grid-area:1/1] relative z-20"
                    >
                      <div aria-hidden className="absolute inset-0 bg-secondary/70 backdrop-blur-xl" />
                      <motion.div
                        initial={{ opacity: 0, y: 28, scale: 0.985 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 28, scale: 0.985 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="relative p-8 md:p-10 lg:p-12"
                      >
                        <button
                          type="button"
                          onClick={() => { form.resetField("date"); form.resetField("time"); }}
                          className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors mb-6"
                        >
                          <ArrowLeft className="w-4 h-4" /> Back to calendar
                        </button>

                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
                          {/* Left — your details (wider) */}
                          <div className="lg:col-span-3 flex flex-col gap-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <FormField control={form.control} name="name" render={({ field }) => (
                                <FormItem>
                                  <FormLabel className={darkLabel}>Full Name</FormLabel>
                                  <FormControl><Input placeholder="John Doe" {...field} className={darkInput} /></FormControl>
                                  <FormMessage className="text-red-300" />
                                </FormItem>
                              )} />
                              <FormField control={form.control} name="email" render={({ field }) => (
                                <FormItem>
                                  <FormLabel className={darkLabel}>Email Address</FormLabel>
                                  <FormControl><Input placeholder="john@company.com" {...field} className={darkInput} /></FormControl>
                                  <FormMessage className="text-red-300" />
                                </FormItem>
                              )} />
                            </div>
                            <FormField control={form.control} name="company" render={({ field }) => (
                              <FormItem>
                                <FormLabel className={darkLabel}>Company / Organization</FormLabel>
                                <FormControl><Input placeholder="Acme Corp (Optional)" {...field} className={darkInput} /></FormControl>
                                <FormMessage className="text-red-300" />
                              </FormItem>
                            )} />
                            <FormField control={form.control} name="guests" render={({ field }) => (
                              <FormItem>
                                <FormLabel className={darkLabel}>
                                  <Users className="inline w-3.5 h-3.5 mr-1 -mt-0.5" />
                                  Guests <span className="normal-case font-normal tracking-normal text-white/40">· optional, comma-separated</span>
                                </FormLabel>
                                <FormControl><Input placeholder="colleague@company.com, partner@company.com" {...field} className={darkInput} /></FormControl>
                                <FormMessage className="text-red-300" />
                              </FormItem>
                            )} />
                            <FormField control={form.control} name="message" render={({ field }) => (
                              <FormItem className="flex flex-col flex-1">
                                <FormLabel className={darkLabel}>Topic of Consultation</FormLabel>
                                <FormControl>
                                  <Textarea placeholder="Briefly describe your requirements..." {...field}
                                    className="flex-1 min-h-[120px] bg-white/10 border border-white/15 rounded-xl p-4 resize-none text-base text-white placeholder:text-white/40 focus-visible:border-primary focus-visible:shadow-[0_0_0_4px_rgba(14,165,233,0.2)] transition-shadow" />
                                </FormControl>
                                <FormMessage className="text-red-300" />
                              </FormItem>
                            )} />
                          </div>

                          {/* Right — pick a time (live availability) */}
                          <FormField
                            control={form.control}
                            name="time"
                            render={({ field }) => (
                              <FormItem className="lg:col-span-2">
                                {/* Consultation date — moved here, above the time slots */}
                                <div className="flex items-center gap-3 mb-6">
                                  <div className="w-12 h-12 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0">
                                    <CalendarCheck className="w-6 h-6 text-primary" />
                                  </div>
                                  <div>
                                    <p className="text-xs uppercase tracking-wider text-white/50">Your consultation</p>
                                    <p className="text-lg font-display font-bold text-white">{format(watchDate, "EEEE, MMMM d, yyyy")}</p>
                                  </div>
                                </div>
                                <FormLabel className={darkLabel}>Pick a time slot (IST)</FormLabel>
                                <div className="mt-3 min-h-[140px]" role="group" aria-label="Available time slots">
                                  {slotsLoading ? (
                                    <div className="flex items-center justify-center gap-2 text-white/60 text-sm py-12">
                                      <Loader2 className="w-4 h-4 animate-spin" /> Loading available times…
                                    </div>
                                  ) : slotsError ? (
                                    <p className="text-sm text-red-300 py-12 text-center">
                                      Couldn't load time slots. Please choose another date or try again shortly.
                                    </p>
                                  ) : !slots || slots.length === 0 ? (
                                    <p className="text-sm text-white/60 py-12 text-center">
                                      No open slots for this day — please choose another date.
                                    </p>
                                  ) : (
                                    <div className="grid grid-cols-2 gap-2.5">
                                      {slots.map((slot) => {
                                        const val = JSON.stringify(slot);
                                        return (
                                          <FormControl key={val}>
                                            <Button
                                              type="button"
                                              variant="outline"
                                              aria-pressed={field.value === val}
                                              aria-label={slotRangeLabel(slot)}
                                              onClick={() => field.onChange(val)}
                                              className={cn(
                                                "h-11 px-0 rounded-lg text-sm bg-white/5 border-white/15 text-white hover:bg-white/10 transition-colors",
                                                field.value === val && "bg-primary text-primary-foreground border-primary hover:bg-primary/90 shadow-[0_0_15px_rgba(14,165,233,0.4)]"
                                              )}
                                            >
                                              {slotLabel(slot.start)}
                                            </Button>
                                          </FormControl>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                                <p className="mt-3 text-xs text-white/45">Each consultation runs 30 minutes.</p>
                                <FormMessage className="text-red-300" />
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* API error (e.g. duplicate booking in next 30 days) */}
                        {mutation.isError && (
                          <div className="mt-6 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                            {(mutation.error as Error)?.message}
                          </div>
                        )}

                        {/* Submit */}
                        <div className="mt-8">
                          <Button
                            type="submit"
                            disabled={mutation.isPending}
                            className="w-full h-14 rounded-2xl text-lg font-bold shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_30px_rgba(14,165,233,0.5)] transition-all disabled:opacity-70"
                          >
                            {mutation.isPending ? (
                              <><Loader2 className="mr-2 w-5 h-5 animate-spin" /> Scheduling…</>
                            ) : (
                              <>Confirm Slot <Send className="ml-2 w-5 h-5" /></>
                            )}
                          </Button>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </section>

      {/* Office + Map */}
      <section className="pb-24 relative z-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="p-8 rounded-3xl bg-card border border-border shadow-lg">
              <h2 className="text-3xl font-display font-bold text-foreground mb-8 flex items-center gap-3">
                <Building2 className="w-8 h-8 text-primary" />
                Corporate Office
              </h2>
              <div className="space-y-8">
                <div className="flex gap-4 items-start group">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 group-hover:bg-primary transition-colors">
                    <MapPin className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">Address</h4>
                    <p className="text-foreground leading-relaxed font-medium whitespace-pre-line">
                      {settings?.address ?? "6-3-683/10, Flat-102,\nSuseela Sadan, Anand Nagar Road,\nAnand Nagar, Khairtabad,\nHyderabad - 500004, Telangana."}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start group">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 group-hover:bg-primary transition-colors">
                    <Phone className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">Phone</h4>
                    <p className="text-foreground leading-relaxed font-medium">{settings?.phone ?? "+91 40 2335 2185"}</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start group">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 group-hover:bg-primary transition-colors">
                    <Mail className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">Email</h4>
                    <p className="text-foreground leading-relaxed font-medium">{settings?.email ?? "info@psraoassociates.com"}</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start group">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 group-hover:bg-primary transition-colors">
                    <Clock className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">Working Hours</h4>
                    <p className="text-foreground leading-relaxed font-medium whitespace-pre-line">
                      {settings?.workingHours ?? "Mon–Fri: 10:00 AM – 7:00 PM\nSaturday: 10:00 AM – 5:00 PM\nSunday: Closed"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-[400px] lg:h-auto w-full rounded-3xl overflow-hidden border border-border shadow-lg p-2 bg-card">
              <div className="w-full h-full min-h-[380px] rounded-2xl overflow-hidden">
                <iframe
                  src={settings?.mapEmbedUrl ?? "https://www.google.com/maps?q=Anand%20Nagar%20Road%2C%20Khairtabad%2C%20Hyderabad%20500004%2C%20Telangana&output=embed"}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="PS Rao Corporate Solutions Office Location"
                  className="w-full h-full bg-muted grayscale hover:grayscale-0 transition-all duration-700"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
