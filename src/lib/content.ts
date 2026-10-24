import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import { defaultLocale, type Locale } from "@/i18n/config";

import site from "../../content/site.json";
import solutionsData from "../../content/solutions.json";
import servicesData from "../../content/services.json";
import productsData from "../../content/products.json";
import brandsData from "../../content/brands.json";

const CONTENT_DIR = path.join(process.cwd(), "content");

export type IconName = string;
export type Feature = { icon: IconName; title: string; text: string };

export type Solution = {
  slug: string;
  name: string;
  short: string;
  headline: string;
  subhead: string;
  tileHeadline: string;
  theme: "dark" | "light";
  hero: string;
  /** CSS object-position for the hero when it is cropped into a fixed frame, e.g. "center 30%" (default: centre). */
  heroFocus?: string;
  gallery: string[];
  intro: string;
  highlights: { value: string; unit: string; label: string }[];
  needs: Feature[];
  system: Feature[];
  compare?: { title: string; columns: string[]; rows: string[][] };
  productGroups: string[];
  faq: { q: string; a: string }[];
};

export type Service = {
  slug: string;
  name: string;
  icon: IconName;
  headline: string;
  subhead: string;
  summary: string;
  hero: string;
  intro: string;
  benefits: Feature[];
  process: { title: string; text: string }[];
  issues?: string[];
  solutions: string[];
};

export type Product = {
  slug: string;
  name: string;
  brand: string;
  image: string;
  specs: { label: string; value: string }[];
};
export type ProductGroup = { id: string; name: string; blurb: string; items: Product[] };

export type Brand = {
  name: string;
  badge?: string;
  category: string;
  text: string;
  featured?: boolean;
  /** Mark on a transparent backdrop, readable on dark pages (public/images/brands/logos/). */
  logo?: { src: string; width: number; height: number };
};

export type Post = {
  slug: string;
  title: string;
  date: string;
  cover: string;
  gallery: string[];
  summary: string;
  /** Markdown body; always Vietnamese (only title and summary are translated). */
  body: string;
  /** True when this language shows a translated title/summary over a Vietnamese body. */
  bodyInVietnamese: boolean;
};
export type Project = Post & { location: string; solution: string; tags: string[] };
export type SiteInfo = typeof site;

/** Translated content for one language: content/<locale>/<file>, falling back to Vietnamese file by file. */
function readTranslation<T>(locale: Locale, file: string, fallback: T): T {
  if (locale === defaultLocale) return fallback;
  const full = path.join(CONTENT_DIR, locale, file);
  return fs.existsSync(full) ? (JSON.parse(fs.readFileSync(full, "utf8")) as T) : fallback;
}

function readCollection<T extends Post>(dir: string): T[] {
  const full = path.join(CONTENT_DIR, dir);
  return fs
    .readdirSync(full)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const { data, content } = matter(fs.readFileSync(path.join(full, file), "utf8"));
      return { ...data, slug: file.replace(/\.md$/, ""), body: content, bodyInVietnamese: false } as T;
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

type Overlay = Record<string, { title?: string; summary?: string; location?: string }>;

/** Vietnamese posts with the translated title, summary (and location) laid over them. */
function localizeCollection<T extends Post>(locale: Locale, posts: T[], file: string): T[] {
  const overlay = readTranslation<Overlay>(locale, file, {});
  if (locale === defaultLocale) return posts;
  return posts.map((p) => {
    const t = overlay[p.slug];
    return t ? { ...p, ...t, bodyInVietnamese: true } : p;
  });
}

function build(locale: Locale) {
  const siteInfo = readTranslation(locale, "site.json", site);
  const solutions = readTranslation(locale, "solutions.json", solutionsData as Solution[]);
  const services = readTranslation(locale, "services.json", servicesData as Service[]);
  const productGroups = readTranslation(locale, "products.json", productsData as ProductGroup[]);
  const brands = readTranslation(locale, "brands.json", brandsData as Brand[]);
  const projects = localizeCollection(locale, readCollection<Project>("projects"), "projects.json");
  const news = localizeCollection(locale, readCollection<Post>("news"), "news.json");

  return {
    siteInfo,
    solutions,
    services,
    productGroups,
    brands,
    projects,
    news,
    getSolution: (slug: string) => solutions.find((s) => s.slug === slug),
    getService: (slug: string) => services.find((s) => s.slug === slug),
    getProject: (slug: string) => projects.find((p) => p.slug === slug),
    getProjectsBySolution: (solution: string) => projects.filter((p) => p.solution === solution),
    getNewsPost: (slug: string) => news.find((p) => p.slug === slug),
  };
}

export type Content = ReturnType<typeof build>;
const cache = new Map<Locale, Content>();

/** Everything the pages show, in one language. Built once per language per server process. */
export function getContent(locale: Locale = defaultLocale): Content {
  let c = cache.get(locale);
  if (!c) cache.set(locale, (c = build(locale)));
  return c;
}

export function renderMarkdown(md: string) {
  return marked.parse(md, { async: false });
}

/** Turns `**bold**` in short copy into emphasised spans without a full markdown pass. */
export function emphasis(text: string) {
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) => (i % 2 ? { strong: part } : { text: part }));
}

const enMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** 24/06/2021 · 24 June 2021 · 2021年6月24日 (from an ISO date, no time zone involved). */
export function formatDate(iso: string, locale: Locale = defaultLocale) {
  const [y, m, d] = iso.split("-");
  if (locale === "en") return `${Number(d)} ${enMonths[Number(m) - 1]} ${y}`;
  if (locale === "zh") return `${y}年${Number(m)}月${Number(d)}日`;
  return `${d}/${m}/${y}`;
}
