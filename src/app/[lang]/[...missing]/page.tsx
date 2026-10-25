import { notFound } from "next/navigation";

// Any address that is not a page: show the site's own 404 (app/[lang]/not-found.tsx) inside the
// normal layout and in the visitor's language, instead of Next's bare default page.
export default function Missing() {
  notFound();
}
