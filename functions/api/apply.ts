// POST /api/apply (multipart) -> stores a job application in KV + resume in R2, emails career@.
// Public endpoint: rate-limited per IP via KV, duplicate check per (email, jobId).
import { type CmsEnv, type Application, json, bad, readCollection, writeCollection, slugify, newId } from "./_cms";

type Env = CmsEnv & { CAREERS_NOTIFY_EMAIL?: string; RESEND_API_KEY?: string; NOTIFY_FROM?: string };

const MAX_RESUME = 5 * 1024 * 1024; // 5MB
const REQUIRED = ["name", "email", "phone", "recentJobTitle", "recentEmployer", "yearsOfExperience", "city", "state", "country", "pincode"] as const;
const emailRe = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export const onRequestPost: PagesFunction<Env> = async ({ request, env, waitUntil }) => {
  const form = await request.formData().catch(() => null);
  if (!form) return bad("Invalid form");

  // --- rate limit: 5 applications / hour / IP
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const rlKey = `rl:apply:${ip}`;
  const count = Number((await env.CMS.get(rlKey)) || 0);
  if (count >= 5) return bad("Too many submissions. Please try again later.", 429);
  waitUntil(env.CMS.put(rlKey, String(count + 1), { expirationTtl: 3600 }));

  // honeypot
  if (String(form.get("website") || "")) return json({ ok: true });

  const get = (k: string) => String(form.get(k) ?? "").trim();
  for (const k of REQUIRED) if (!get(k)) return bad(`${k} is required`);
  const email = get("email").toLowerCase();
  if (!emailRe.test(email)) return bad("Please enter a valid email address");

  const file = form.get("resume");
  if (!(file instanceof File) || !file.size) return bad("Resume (PDF) is required");
  if (file.type !== "application/pdf" && !/\.pdf$/i.test(file.name)) return bad("Resume must be a PDF", 415);
  if (file.size > MAX_RESUME) return bad("Resume must be under 5 MB", 413);

  const jobId = get("jobId") || null;
  const jobs = ((await readCollection<{ id: string; title: string }[]>(env, "jobs")) ?? []);
  const job = jobId ? jobs.find((j) => j.id === jobId) : undefined;
  const jobTitle = job?.title || get("jobTitle") || "General application";

  const apps = ((await readCollection<Application[]>(env, "applications")) ?? []);
  if (apps.some((a) => a.email === email && (a.jobId ?? null) === jobId)) {
    return json({ error: "You have already applied for this position." }, 409);
  }

  const id = newId();
  const key = `applications/${new Date().toISOString().slice(0, 10)}/${slugify(get("name")) || "applicant"}-${id.slice(0, 8)}.pdf`;
  await env.MEDIA.put(key, file.stream(), { httpMetadata: { contentType: "application/pdf" }, customMetadata: { applicant: email, private: "1" } });

  const app: Application = {
    id, jobId, jobTitle,
    name: get("name"), email, phone: get("phone"),
    recentJobTitle: get("recentJobTitle"), recentEmployer: get("recentEmployer"), yearsOfExperience: get("yearsOfExperience"),
    city: get("city"), state: get("state"), country: get("country"), pincode: get("pincode"),
    message: get("message").slice(0, 2000),
    resume: key, resumeName: file.name.slice(0, 120),
    status: "new", createdAt: new Date().toISOString(),
  };
  apps.unshift(app);
  await writeCollection(env, "applications", apps);

  waitUntil(notify(env, app, request));
  return json({ ok: true, id }, 201);
};

async function notify(env: Env, a: Application, request: Request) {
  const to = env.CAREERS_NOTIFY_EMAIL;
  if (!to || !env.RESEND_API_KEY) return;
  const origin = new URL(request.url).origin;
  const html = `
    <h2>New application: ${esc(a.jobTitle)}</h2>
    <table cellpadding="4">
      <tr><td><b>Name</b></td><td>${esc(a.name)}</td></tr>
      <tr><td><b>Email</b></td><td>${esc(a.email)}</td></tr>
      <tr><td><b>Phone</b></td><td>${esc(a.phone)}</td></tr>
      <tr><td><b>Recent role</b></td><td>${esc(a.recentJobTitle)} at ${esc(a.recentEmployer)}</td></tr>
      <tr><td><b>Experience</b></td><td>${esc(a.yearsOfExperience)} years</td></tr>
      <tr><td><b>Location</b></td><td>${esc(a.city)}, ${esc(a.state)}, ${esc(a.country)} – ${esc(a.pincode)}</td></tr>
      ${a.message ? `<tr><td valign="top"><b>Message</b></td><td>${esc(a.message).replace(/\n/g, "<br>")}</td></tr>` : ""}
    </table>
    <p><a href="${origin}/admin/#applications">Open in admin</a> to view the resume and update status.</p>`;
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: env.NOTIFY_FROM || "PS Rao Careers <onboarding@resend.dev>", to: [to], reply_to: a.email, subject: `Application: ${a.jobTitle} — ${a.name}`, html }),
    });
  } catch (e) { console.error("notify failed", e); }
}
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c] as string));
