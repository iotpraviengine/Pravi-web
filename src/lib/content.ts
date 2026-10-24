import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

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

export type Brand = { name: string; badge?: string; category: string; text: string; featured?: boolean };

export type Post = {
  slug: string;
  title: string;
  date: string;
  cover: string;
  gallery: string[];
  summary: string;
  body: string;
};
export type Project = Post & { location: string; solution: string; tags: string[] };

export const siteInfo = site;
export const solutions = solutionsData as Solution[];
export const services = servicesData as Service[];
export const productGroups = productsData as ProductGroup[];
export const brands = brandsData as Brand[];

export const getSolution = (slug: string) => solutions.find((s) => s.slug === slug);
export const getService = (slug: string) => services.find((s) => s.slug === slug);

function readCollection<T extends Post>(dir: string): T[] {
  const full = path.join(CONTENT_DIR, dir);
  return fs
    .readdirSync(full)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const { data, content } = matter(fs.readFileSync(path.join(full, file), "utf8"));
      return { ...data, slug: file.replace(/\.md$/, ""), body: content } as T;
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

let projectCache: Project[] | undefined;
let newsCache: Post[] | undefined;

export function getProjects() {
  return (projectCache ??= readCollection<Project>("projects"));
}
export function getProject(slug: string) {
  return getProjects().find((p) => p.slug === slug);
}
export function getProjectsBySolution(solution: string) {
  return getProjects().filter((p) => p.solution === solution);
}

export function getNews() {
  return (newsCache ??= readCollection<Post>("news"));
}
export function getNewsPost(slug: string) {
  return getNews().find((p) => p.slug === slug);
}

export function renderMarkdown(md: string) {
  return marked.parse(md, { async: false });
}

/** Turns `**bold**` in short copy into emphasised spans without a full markdown pass. */
export function emphasis(text: string) {
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) => (i % 2 ? { strong: part } : { text: part }));
}

export function formatDate(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}
