import type { MetadataRoute } from "next";
import { htmlLang, localize, locales } from "@/i18n/config";
import { getContent } from "@/lib/content";

const base = process.env.NEXT_PUBLIC_SITE_URL || "https://skv.lighting";

// Every page in every language, each listing its translations (hreflang).
export default function sitemap(): MetadataRoute.Sitemap {
  const c = getContent();
  const pages: { path: string; priority: number; lastModified?: string }[] = [
    ...["/", "/giai-phap", "/dich-vu", "/san-pham", "/du-an", "/doi-tac", "/tin-tuc", "/gioi-thieu", "/lien-he"].map((path) => ({
      path,
      priority: path === "/" ? 1 : 0.8,
    })),
    ...c.solutions.map((s) => ({ path: `/giai-phap/${s.slug}`, priority: 0.9 })),
    ...c.services.map((s) => ({ path: `/dich-vu/${s.slug}`, priority: 0.8 })),
    ...c.projects.map((p) => ({ path: `/du-an/${p.slug}`, lastModified: p.date, priority: 0.6 })),
    ...c.news.map((p) => ({ path: `/tin-tuc/${p.slug}`, lastModified: p.date, priority: 0.5 })),
  ];
  const url = (path: string, l: (typeof locales)[number]) => base + (localize(l, path) === "/" ? "" : localize(l, path));
  return pages.flatMap(({ path, ...rest }) =>
    locales.map((l) => ({
      url: url(path, l),
      ...rest,
      alternates: { languages: Object.fromEntries(locales.map((x) => [htmlLang[x], url(path, x)])) },
    })),
  );
}
