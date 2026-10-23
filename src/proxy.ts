import { NextResponse, type NextRequest } from "next/server";
import legacy from "../content/legacy-redirects.json";

// Permanently redirects URLs from the old WordPress site (skv.lighting/<slug>/) to their new home.
const map = legacy as Record<string, string>;

export function proxy(request: NextRequest) {
  const slug = decodeURIComponent(request.nextUrl.pathname).replace(/^\/+|\/+$/g, "").split("/").pop() ?? "";
  const target = map[slug];
  if (!target) return NextResponse.next();
  return NextResponse.redirect(new URL(target, request.url), 308);
}

export const config = {
  // Only paths that are not routes of the new site, static files or Next internals.
  matcher: [
    "/((?!_next|api|images|giai-phap|dich-vu|san-pham|du-an|tin-tuc|doi-tac|gioi-thieu|lien-he|icon|apple-icon|sitemap|robots|favicon)[^.]+)",
  ],
};
