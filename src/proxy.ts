import { NextResponse, type NextRequest } from "next/server";
import legacy from "../content/legacy-redirects.json";
import { defaultLocale, isLocale } from "@/i18n/config";

// Old WordPress URLs (skv.lighting/<slug>/) → their new home.
const map = legacy as Record<string, string>;
// First path segments that are pages of the new site.
const routes = new Set(["", "giai-phap", "dich-vu", "san-pham", "du-an", "tin-tuc", "doi-tac", "gioi-thieu", "lien-he"]);

/**
 * Languages live in app/[lang]. Vietnamese keeps the plain URLs: /du-an is served by /vi/du-an behind
 * the scenes, and anyone typing /vi/... is sent to the plain URL. /en/... and /zh/... pass straight through.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/")[1] ?? "";

  if (first === defaultLocale) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(defaultLocale.length + 1) || "/";
    return NextResponse.redirect(url, 308);
  }
  if (isLocale(first)) return NextResponse.next();

  if (!routes.has(first)) {
    const slug = decodeURIComponent(pathname).replace(/^\/+|\/+$/g, "").split("/").pop() ?? "";
    const target = map[slug];
    if (target) return NextResponse.redirect(new URL(target, request.url), 308);
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Pages only: not Next internals, the API, static files (anything with a dot) or metadata routes.
  matcher: ["/((?!_next|api|images|videos|sitemap|robots|icon|apple-icon|favicon|.*\\..*).*)"],
};
