import type { MetadataRoute } from "next";
import { getNews, getProjects, services, solutions } from "@/lib/content";

const base = process.env.NEXT_PUBLIC_SITE_URL || "https://skv.lighting";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/giai-phap", "/dich-vu", "/san-pham", "/du-an", "/doi-tac", "/tin-tuc", "/gioi-thieu", "/lien-he"].map((p) => ({
    url: base + p,
    changeFrequency: "monthly" as const,
    priority: p === "" ? 1 : 0.8,
  }));
  return [
    ...pages,
    ...solutions.map((s) => ({ url: `${base}/giai-phap/${s.slug}`, priority: 0.9 })),
    ...services.map((s) => ({ url: `${base}/dich-vu/${s.slug}`, priority: 0.8 })),
    ...getProjects().map((p) => ({ url: `${base}/du-an/${p.slug}`, lastModified: p.date, priority: 0.6 })),
    ...getNews().map((p) => ({ url: `${base}/tin-tuc/${p.slug}`, lastModified: p.date, priority: 0.5 })),
  ];
}
