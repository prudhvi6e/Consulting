// Read-only client for the Directus CMS (public role → no token needed).
// Uses plain fetch against the Directus REST API. Configure VITE_CMS_URL in .env.
const CMS = (import.meta.env.VITE_CMS_URL ?? "").replace(/\/$/, "");

export const cmsConfigured = CMS.length > 0;

/** Public URL for an uploaded file (Directus asset). */
export const assetUrl = (id?: string | null): string =>
  id ? `${CMS}/assets/${id}` : "";

async function fetchData<T>(path: string): Promise<T> {
  const res = await fetch(`${CMS}${path}`);
  if (!res.ok) throw new Error(`CMS ${path} → ${res.status}`);
  const json = (await res.json()) as { data: T };
  return json.data;
}

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
  id: number;
  badge: string;
  titleTop: string;
  titleAccent: string;
  desc: string;
  image: string | null;
  showWater: boolean;
  sort: number | null;
};

export type Capability = {
  id: number;
  title: string;
  desc: string;
  image: string | null;
  icon: string | null;
  span: string | null;
  big: boolean;
  sort: number | null;
};

export type Industry = {
  id: number;
  name: string;
  image: string | null;
  icon: string | null;
  sort: number | null;
};

export type Service = {
  id: number;
  title: string;
  icon: string | null;
  desc: string;
  featured: boolean;
  points: string[] | null;
  sort: number | null;
};

export type ServiceGroup = {
  id: number;
  category: string;
  sort: number | null;
  services: Service[];
};

export type TeamMember = {
  id: number;
  name: string;
  role: string;
  image: string | null;
  desc: string;
  memberType: string | null;
  sort: number | null;
};

export type Stat = {
  id: number;
  value: number;
  suffix: string | null;
  label: string;
  sort: number | null;
};

export type ClientLogo = { id: number; image: string | null; sort: number | null };

export type ArticleSection = { heading?: string; paragraphs: string[] };
export type Article = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  category: string | null;
  date: string | null;
  readTime: string | null;
  author: string | null;
  authorRole: string | null;
  content: ArticleSection[] | null;
};

// ---- Reads ----
export const getSiteSettings = () => fetchData<SiteSettings>("/items/site_settings");
export const getHeroSlides = () => fetchData<HeroSlide[]>("/items/hero_slides?sort=sort");
export const getCapabilities = () => fetchData<Capability[]>("/items/capabilities?sort=sort");
export const getIndustries = () => fetchData<Industry[]>("/items/industries?sort=sort");
export const getServiceGroups = () =>
  fetchData<ServiceGroup[]>("/items/service_groups?fields=*,services.*&sort=sort&deep[services][_sort]=sort");
export const getTeam = () => fetchData<TeamMember[]>("/items/team_members?sort=sort");
export const getStats = () => fetchData<Stat[]>("/items/stats?sort=sort");
export const getClientLogos = () => fetchData<ClientLogo[]>("/items/client_logos?sort=sort");
export const getArticles = () =>
  fetchData<Article[]>("/items/articles?filter[status][_eq]=published&sort=id");
export const getArticle = (slug: string) =>
  fetchData<Article[]>(`/items/articles?filter[slug][_eq]=${encodeURIComponent(slug)}&limit=1`).then((a) => a[0] ?? null);
