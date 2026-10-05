// Read-only client for the site's built-in CMS (Cloudflare Pages Functions + KV + R2).
// Content is edited at /admin and served same-origin from /api/cms/<collection>.
// Every getter returns null/[] when the collection has never been edited, so pages
// fall back to their bundled defaults.
const CMS = (import.meta.env.VITE_CMS_URL ?? "").replace(/\/$/, "");

export const cmsConfigured = true;

/** Image fields hold ready-to-use URLs (e.g. /api/media/<key>); pass through. */
export const assetUrl = (src?: string | null): string => (src ? (src.startsWith("/") || /^https?:/.test(src) ? src : `/api/media/${src}`) : "");

async function fetchData<T>(collection: string): Promise<T | null> {
  const res = await fetch(`${CMS}/api/cms/${collection}`);
  if (!res.ok) throw new Error(`CMS ${collection} → ${res.status}`);
  return (await res.json()) as T | null;
}
const list = async <T,>(collection: string): Promise<T[]> => {
  const v = await fetchData<T[]>(collection);
  return Array.isArray(v) ? v : [];
};

// ---- Collection types (raw shapes from Directus; image fields are file IDs) ----
export type SiteSettings = {
  companyName: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  workingHours: string;
  mapEmbedUrl: string;
  linkedin?: string | null;
  twitter?: string | null;
  facebook?: string | null;
  instagram?: string | null;
};

export type HeroSlide = {
  id: string;
  badge: string;
  titleTop: string;
  titleAccent: string;
  desc: string;
  image: string | null;
  showWater: boolean;
  sort: number | null;
};

export type Capability = {
  id: string;
  title: string;
  desc: string;
  image: string | null;
  icon: string | null;
  span: string | null;
  big: boolean;
  sort: number | null;
};

export type Industry = {
  id: string;
  name: string;
  image: string | null;
  icon: string | null;
  sort: number | null;
};

export type Service = {
  id: string;
  title: string;
  icon: string | null;
  desc: string;
  featured: boolean;
  points: string[] | null;
  sort: number | null;
};

export type ServiceGroup = {
  id: string;
  category: string;
  sort: number | null;
  services: Service[];
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  image: string | null;
  desc: string;
  memberType: string | null;
  sort: number | null;
};

export type CaseStudy = {
  id: string;
  status?: string;
  title: string;
  client: string;
  sector: string;
  challenge: string;
  approach: string;
  outcome: string;
  metric: string;
  metricLabel: string;
  services: string[];
  image: string | null;
};

export type Testimonial = {
  id: string;
  status?: string;
  approved?: boolean;
  name: string;
  role: string;
  company: string;
  quote: string;
  image: string | null;
};

export type Stat = {
  id: string;
  value: number;
  suffix: string | null;
  label: string;
  sort: number | null;
};

export type ClientLogo = { id: string; image: string | null; sort: number | null };

export type ArticleSection = { heading?: string; paragraphs: string[] };
export type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  category: string | null;
  date: string | null;
  readTime: string | null;
  author: string | null;
  authorRole: string | null;
  content: ArticleSection[] | null;
  status?: "published" | "draft";
};

// ---- Reads ----
export const getSiteSettings = () => fetchData<SiteSettings>("settings");
export const getHeroSlides = () => list<HeroSlide>("hero");
export const getCapabilities = () => list<Capability>("capabilities");
export const getIndustries = () => list<Industry>("industries");
export const getServiceGroups = () => list<ServiceGroup>("service_groups");
export const getTeam = () => list<TeamMember>("team");
export async function getCaseStudies(): Promise<CaseStudy[]> {
  const rows = await list<CaseStudy>("case_studies");
  return rows.filter((c) => c.status !== "draft").map((c) => ({ ...c, image: c.image ? assetUrl(c.image) : null, services: Array.isArray(c.services) ? c.services : [] }));
}
export async function getTestimonials(): Promise<Testimonial[]> {
  const rows = await list<Testimonial>("testimonials");
  return rows.filter((t) => t.status !== "draft" && t.quote).map((t) => ({ ...t, image: t.image ? assetUrl(t.image) : null }));
}
export const getStats = () => list<Stat>("stats");
export const getClientLogos = () => list<ClientLogo>("client_logos");
export const getArticles = () => list<Article>("articles");
export const getArticle = (slug: string) => getArticles().then((a) => a.find((x) => x.slug === slug) ?? null);

export type CmsEvent = { id: string; title: string; type: "event" | "duedate"; date: string; color: string };
export type Job = { id: string; title: string; location: string; type: string; department?: string; experience?: string; level?: string; salaryRange?: string; expiresOn?: string; description?: string; responsibilities?: string[]; requirements?: string[]; status?: "open" | "closed"; sort: number | null };
export const getJobs = () => list<Job>("jobs");
