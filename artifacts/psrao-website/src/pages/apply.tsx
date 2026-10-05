import { Seo } from "@/components/Seo";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useParams } from "wouter";
import { ArrowLeft, Briefcase, MapPin, Clock, CheckCircle2, Upload, Loader2, FileText, Calendar } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { WordReveal } from "@/components/motion/Reveal";
import { getJobs, type Job } from "@/lib/cms";

const schema = z.object({
  name: z.string().min(2, "Please enter your full name."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().min(8, "Please enter a valid phone number."),
  recentJobTitle: z.string().min(2, "Required."),
  recentEmployer: z.string().min(2, "Required."),
  yearsOfExperience: z.string().min(1, "Required."),
  city: z.string().min(2, "Required."),
  state: z.string().min(2, "Required."),
  country: z.string().min(2, "Required."),
  pincode: z.string().min(4, "Required."),
  message: z.string().max(2000).optional(),
  resume: z
    .custom<FileList>((v) => v instanceof FileList && v.length > 0, "Please attach your resume (PDF).")
    .refine((f) => f[0]?.type === "application/pdf" || /\.pdf$/i.test(f[0]?.name ?? ""), "Resume must be a PDF.")
    .refine((f) => (f[0]?.size ?? 0) <= 5 * 1024 * 1024, "Resume must be under 5 MB."),
});
type Values = z.infer<typeof schema>;

const inputCls = "h-12 rounded-xl bg-card border-border focus-visible:border-primary focus-visible:shadow-[0_0_0_4px_rgba(14,165,233,0.15)] transition-shadow";
const labelCls = "text-xs font-bold uppercase tracking-wider text-muted-foreground";

async function submitApplication(values: Values, job: Job | undefined) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(values)) {
    if (k === "resume") fd.append("resume", (v as FileList)[0]);
    else if (v != null) fd.append(k, String(v));
  }
  if (job) { fd.append("jobId", job.id); fd.append("jobTitle", job.title); }
  const res = await fetch("/api/apply", { method: "POST", body: fd });
  const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
  if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
  return data;
}

export default function Apply() {
  const { id } = useParams<{ id?: string }>();
  const { data: jobs, isLoading } = useQuery({ queryKey: ["cms", "jobs"], queryFn: getJobs });
  const job = jobs?.find((j) => j.id === id);
  const [done, setDone] = useState(false);

  useEffect(() => { window.scrollTo({ top: 0 }); }, [job]);

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", phone: "", recentJobTitle: "", recentEmployer: "", yearsOfExperience: "", city: "Hyderabad", state: "Telangana", country: "India", pincode: "", message: "" },
  });
  const resumeReg = form.register("resume");
  const resumeFile = form.watch("resume")?.[0];

  const mutation = useMutation({ mutationFn: (v: Values) => submitApplication(v, job), onSuccess: () => setDone(true) });

  const j = job as (Job & { department?: string; experience?: string; level?: string; salaryRange?: string; expiresOn?: string; description?: string; responsibilities?: string[]; requirements?: string[] }) | undefined;

  return (
    <div className="w-full pt-20 bg-background relative overflow-hidden min-h-screen">
      <Seo
        title={j ? `Apply: ${j.title}` : "Send your profile"}
        description={j ? `Apply for ${j.title} at PS Rao Corporate Solutions, ${j.location || "Hyderabad"}.` : "Send your profile to PS Rao Corporate Solutions for future openings."}
        path={j ? `/careers/apply/${j.id}` : "/careers/apply"}
        jsonLd={j ? [{ "@context": "https://schema.org", "@type": "JobPosting", title: j.title, description: j.description || `${j.title} at PS Rao Corporate Solutions`, datePosted: new Date().toISOString().slice(0, 10), ...(j.expiresOn ? { validThrough: j.expiresOn } : {}), employmentType: (j.type || "Full-time").toUpperCase().replace("-", "_"), hiringOrganization: { "@type": "Organization", name: "PS Rao Corporate Solutions Pvt. Ltd.", sameAs: "https://psrao.co.in" }, jobLocation: { "@type": "Place", address: { "@type": "PostalAddress", addressLocality: j.location || "Hyderabad", addressRegion: "Telangana", addressCountry: "IN" } } }] : []}
      />
      <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />

      <section className="py-14 md:py-20 relative z-10 border-b border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 md:px-6">
          <Link href="/careers" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> All openings
          </Link>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-5">
            <Briefcase className="w-3.5 h-3.5" /> {j ? "Open position" : "General application"}
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground tracking-tight mb-4">
            <WordReveal text={j?.title ?? (isLoading ? " " : "Send your profile")} />
          </h1>
          {j && (
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground font-medium">
              {j.department && <span className="bg-secondary/5 px-2 py-1 rounded">{j.department}</span>}
              {j.location && <span className="inline-flex items-center gap-1.5"><MapPin className="w-4 h-4" />{j.location}</span>}
              {j.type && <span className="inline-flex items-center gap-1.5"><Clock className="w-4 h-4" />{j.type}</span>}
              {j.experience && <span>{j.experience}</span>}
              {j.expiresOn && <span className="inline-flex items-center gap-1.5"><Calendar className="w-4 h-4" />Apply by {new Date(j.expiresOn).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 relative z-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-16 items-start">
            {/* Job details */}
            <div className="space-y-8 lg:sticky lg:top-28">
              {j?.description && <p className="text-lg text-muted-foreground leading-relaxed">{j.description}</p>}
              {j?.salaryRange && (
                <div className="rounded-2xl border border-border bg-card p-5">
                  <div className={labelCls}>Compensation</div>
                  <div className="text-xl font-display font-bold text-foreground mt-1">{j.salaryRange}</div>
                </div>
              )}
              {!!j?.responsibilities?.length && (
                <div>
                  <h3 className="font-display font-bold text-foreground mb-3">What you'll do</h3>
                  <ul className="space-y-2">{j.responsibilities.map((r, i) => <li key={i} className="flex gap-3 text-muted-foreground"><CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" /><span>{r}</span></li>)}</ul>
                </div>
              )}
              {!!j?.requirements?.length && (
                <div>
                  <h3 className="font-display font-bold text-foreground mb-3">What we're looking for</h3>
                  <ul className="space-y-2">{j.requirements.map((r, i) => <li key={i} className="flex gap-3 text-muted-foreground"><CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" /><span>{r}</span></li>)}</ul>
                </div>
              )}
              {!j && !isLoading && (
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Don't see a matching opening? Send us your profile and we'll reach out when a suitable role comes up.
                </p>
              )}
              <p className="text-sm text-muted-foreground">
                Questions? Write to <a href="mailto:career@psrao.co.in" className="text-primary hover:underline">career@psrao.co.in</a>.
              </p>
            </div>

            {/* Form */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="rounded-3xl border border-border bg-card/60 backdrop-blur-xl p-6 md:p-10 shadow-xl shadow-primary/5">
              {done ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 rounded-full bg-primary/10 text-primary grid place-items-center mx-auto mb-5"><CheckCircle2 className="w-8 h-8" /></div>
                  <h2 className="text-2xl font-display font-bold text-foreground mb-2">Application received</h2>
                  <p className="text-muted-foreground max-w-md mx-auto">Thank you{form.getValues("name") ? `, ${form.getValues("name").split(" ")[0]}` : ""}. Our team will review your profile and get in touch if there's a fit.</p>
                  <Button asChild variant="outline" className="mt-8 rounded-full"><Link href="/careers">Back to Careers</Link></Button>
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit((v) => mutation.mutate(v))} className="space-y-6" noValidate>
                    <h2 className="text-2xl font-display font-bold text-foreground">Send your profile</h2>
                    <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
                    <div className="grid md:grid-cols-2 gap-5">
                      {([
                        ["name", "Full name", "text", "Your name"],
                        ["email", "Email address", "email", "you@example.com"],
                        ["phone", "Phone number", "tel", "+91 98765 43210"],
                        ["yearsOfExperience", "Years of experience", "text", "e.g. 3"],
                        ["recentJobTitle", "Recent job title", "text", "e.g. Company Secretary"],
                        ["recentEmployer", "Recent employer", "text", "Company name"],
                        ["city", "City", "text", ""],
                        ["state", "State", "text", ""],
                        ["country", "Country", "text", ""],
                        ["pincode", "Pin code", "text", ""],
                      ] as const).map(([name, label, type, ph]) => (
                        <FormField key={name} control={form.control} name={name} render={({ field }) => (
                          <FormItem>
                            <FormLabel className={labelCls}>{label}</FormLabel>
                            <FormControl><Input type={type} placeholder={ph} className={inputCls} {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                      ))}
                    </div>

                    <div className="space-y-2">
                      <label className={labelCls}>Resume (PDF, max 5 MB)</label>
                      <label className="flex items-center gap-4 rounded-xl border border-dashed border-border bg-card hover:border-primary/60 transition-colors p-4 cursor-pointer">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary grid place-items-center shrink-0">{resumeFile ? <FileText className="w-5 h-5" /> : <Upload className="w-5 h-5" />}</div>
                        <div className="min-w-0">
                          <div className="font-medium text-foreground truncate">{resumeFile ? resumeFile.name : "Choose a PDF file"}</div>
                          <div className="text-xs text-muted-foreground">{resumeFile ? `${(resumeFile.size / 1024).toFixed(0)} KB · click to change` : "Only PDF files are accepted"}</div>
                        </div>
                        <input type="file" accept="application/pdf,.pdf" className="hidden" {...resumeReg} />
                      </label>
                      {form.formState.errors.resume && <p className="text-sm font-medium text-destructive">{String(form.formState.errors.resume.message)}</p>}
                    </div>

                    <FormField control={form.control} name="message" render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelCls}>Message (optional)</FormLabel>
                        <FormControl><Textarea placeholder="Anything you'd like us to know" className="min-h-28 rounded-xl bg-card border-border" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    {mutation.isError && <p className="text-sm font-medium text-destructive">{(mutation.error as Error).message}</p>}

                    <Button type="submit" size="lg" disabled={mutation.isPending} className="w-full md:w-auto rounded-full px-10 shadow-[0_0_20px_rgba(14,165,233,0.3)]">
                      {mutation.isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting…</> : "Submit application"}
                    </Button>
                    <p className="text-xs text-muted-foreground">By applying you agree that we may store your details and resume for recruitment purposes.</p>
                  </form>
                </Form>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
