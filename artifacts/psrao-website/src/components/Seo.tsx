import { useEffect } from "react";

const SITE = "https://psrao.co.in";
const NAME = "PS Rao Corporate Solutions Pvt. Ltd.";
const DEFAULT_IMAGE = `${SITE}/opengraph.jpg`;

export type SeoProps = {
  title: string;
  description: string;
  /** path starting with "/" */
  path: string;
  type?: "website" | "article";
  image?: string;
  /** Extra JSON-LD objects to add to the page */
  jsonLd?: Record<string, unknown>[];
  noindex?: boolean;
};

const ORG = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${SITE}/#organization`,
  name: NAME,
  alternateName: "PS Rao & Associates",
  url: SITE,
  logo: `${SITE}/apple-touch-icon.png`,
  image: DEFAULT_IMAGE,
  description: "Hyderabad-based firm of Company Secretaries delivering corporate governance, secretarial audit, restructuring, FEMA/RBI, capital markets and legal due diligence advisory.",
  telephone: "+91-40-2335-2185",
  email: "info@psrao.co.in",
  address: { "@type": "PostalAddress", streetAddress: "6-3-683/10, Flat-102, Suseela Sadan, Anand Nagar Road, Khairtabad", addressLocality: "Hyderabad", addressRegion: "Telangana", postalCode: "500004", addressCountry: "IN" },
  geo: { "@type": "GeoCoordinates", latitude: 17.4126, longitude: 78.4616 },
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "10:00", closes: "19:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "10:00", closes: "17:00" },
  ],
  areaServed: "IN",
  knowsAbout: ["Companies Act 2013", "SEBI LODR", "FEMA", "Corporate Restructuring", "Insolvency and Bankruptcy Code", "Secretarial Audit", "Legal Due Diligence"],
};

function upsert(selector: string, create: () => HTMLElement, set: (el: HTMLElement) => void) {
  let el = document.head.querySelector<HTMLElement>(selector);
  if (!el) { el = create(); document.head.appendChild(el); }
  set(el);
  return el;
}
const meta = (attr: "name" | "property", key: string, content: string) =>
  upsert(`meta[${attr}="${key}"]`, () => { const m = document.createElement("meta"); m.setAttribute(attr, key); return m; }, (m) => m.setAttribute("content", content));

/** Sets document title, meta description, canonical, Open Graph/Twitter and JSON-LD for the current page. */
export function Seo({ title, description, path, type = "website", image = DEFAULT_IMAGE, jsonLd = [], noindex }: SeoProps) {
  useEffect(() => {
    const fullTitle = title.includes(NAME) ? title : `${title} | ${NAME}`;
    const url = `${SITE}${path === "/" ? "/" : path.replace(/\/$/, "")}`;
    document.title = fullTitle;
    meta("name", "description", description);
    meta("name", "robots", noindex ? "noindex, nofollow" : "index, follow");
    meta("property", "og:title", fullTitle);
    meta("property", "og:description", description);
    meta("property", "og:type", type);
    meta("property", "og:url", url);
    meta("property", "og:image", image);
    meta("property", "og:site_name", NAME);
    meta("property", "og:locale", "en_IN");
    meta("name", "twitter:card", "summary_large_image");
    meta("name", "twitter:title", fullTitle);
    meta("name", "twitter:description", description);
    meta("name", "twitter:image", image);
    upsert('link[rel="canonical"]', () => { const l = document.createElement("link"); l.rel = "canonical"; return l; }, (l) => l.setAttribute("href", url));

    document.head.querySelectorAll('script[data-seo-jsonld]').forEach((s) => s.remove());
    const blocks = [ORG, { "@context": "https://schema.org", "@type": "WebPage", "@id": url, url, name: fullTitle, description, isPartOf: { "@id": `${SITE}/#organization` } }, ...jsonLd];
    for (const b of blocks) {
      const s = document.createElement("script");
      s.type = "application/ld+json"; s.setAttribute("data-seo-jsonld", "");
      s.textContent = JSON.stringify(b);
      document.head.appendChild(s);
    }
  }, [title, description, path, type, image, noindex, JSON.stringify(jsonLd)]);
  return null;
}

export const breadcrumbs = (items: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: `${SITE}${it.path}` })),
});
