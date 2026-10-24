// Languages of the site. Vietnamese keeps the plain URLs (/giai-phap/...); the others live under a prefix (/en/..., /zh/...).
// Safe to import from client components.

export const locales = ["vi", "en", "zh"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "vi";

export const isLocale = (value: string): value is Locale => (locales as readonly string[]).includes(value);

/** Value for <html lang> and hreflang. */
export const htmlLang: Record<Locale, string> = { vi: "vi", en: "en", zh: "zh-CN" };
/** How each language names itself, for the language switch. */
export const localeNames: Record<Locale, string> = { vi: "Tiếng Việt", en: "English", zh: "简体中文" };
export const localeShort: Record<Locale, string> = { vi: "VI", en: "EN", zh: "中文" };

/** The URL of an internal path in a given language ("/giai-phap" → "/en/giai-phap"). Other links pass through. */
export function localize(locale: Locale, path: string): string {
  if (!path.startsWith("/") || locale === defaultLocale) return path;
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

/**
 * Splits a pathname into its language and the language-free path ("/en/du-an" → en, "/du-an").
 * Also accepts "/vi/...": that is how Vietnamese pages look on the server, behind the proxy rewrite.
 */
export function splitLocale(pathname: string): { locale: Locale; path: string } {
  const first = pathname.split("/")[1] ?? "";
  if (isLocale(first)) return { locale: first, path: pathname.slice(first.length + 1) || "/" };
  return { locale: defaultLocale, path: pathname || "/" };
}

/** Fills {name} placeholders. */
export const fmt = (template: string, values: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (_, k: string) => String(values[k] ?? `{${k}}`));
