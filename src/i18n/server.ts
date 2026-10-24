import { lang } from "next/root-params";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import { copy } from "./copy";
import { htmlLang, isLocale, localize, locales, type Locale } from "./config";
import { ui } from "./ui";

/** The language of the current request (the [lang] root segment). */
export async function getLocale(): Promise<Locale> {
  const value = await lang();
  if (!isLocale(value)) notFound();
  return value;
}

/** Everything a server component needs for the current language. */
export async function getI18n() {
  const locale = await getLocale();
  return {
    locale,
    ui: ui[locale],
    t: copy[locale],
    c: getContent(locale),
    href: (path: string) => localize(locale, path),
  };
}

/** Canonical URL for this language plus hreflang links to the same page in every language. */
export function alternates(locale: Locale, path: string): Metadata["alternates"] {
  return {
    canonical: localize(locale, path),
    languages: {
      ...Object.fromEntries(locales.map((l) => [htmlLang[l], localize(l, path)])),
      "x-default": path,
    },
  };
}
