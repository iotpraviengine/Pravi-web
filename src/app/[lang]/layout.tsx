import type { Metadata, Viewport } from "next";
import { Familjen_Grotesk } from "next/font/google";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { FloatingContact } from "@/components/FloatingContact";
import { ScrollReveal } from "@/components/ScrollReveal";
import { themeScript } from "@/components/ThemeToggle";
import { htmlLang, locales } from "@/i18n/config";
import { alternates, getI18n } from "@/i18n/server";
import "../globals.css";

// A compact, warm grotesk with Vietnamese glyphs, served from the site itself so every device sees the same face.
const face = Familjen_Grotesk({
  variable: "--font-face",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://skv.lighting";

// Every language is prerendered (Cache Components needs at least one value per root param).
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  const { locale, t, c } = await getI18n();
  return {
    metadataBase: new URL(siteUrl),
    title: { default: t.meta.title, template: "%s – SKV Lighting" },
    description: c.siteInfo.description,
    applicationName: "SKV Lighting",
    openGraph: {
      type: "website",
      locale: { vi: "vi_VN", en: "en_US", zh: "zh_CN" }[locale],
      siteName: "SKV Lighting",
      images: [{ url: "/images/home/hero.webp", width: 2400, height: 1350 }],
    },
    alternates: alternates(locale, "/"),
  };
}

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
  const { locale, ui, c } = await getI18n();
  const { siteInfo } = c;
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteInfo.name,
    legalName: siteInfo.legalName,
    url: siteUrl,
    logo: `${siteUrl}/images/brand/skv-logo.png`,
    email: siteInfo.contact.email,
    telephone: "+84" + siteInfo.contact.hotlineTel.slice(1),
    taxID: siteInfo.taxCode,
    address: siteInfo.offices.map((o) => ({ "@type": "PostalAddress", streetAddress: o.address, addressCountry: "VN" })),
    sameAs: siteInfo.social.map((s) => s.url),
  };

  return (
    // the theme script sets data-theme on <html> before React hydrates
    <html lang={htmlLang[locale]} className={face.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      </head>
      <body>
        <a className="skip-link" href="#main">
          {ui.skip}
        </a>
        <Nav hotline={siteInfo.contact.hotline} hotlineTel={siteInfo.contact.hotlineTel} />
        <main id="main">{children}</main>
        <Footer />
        <FloatingContact contact={siteInfo.contact} />
        <ScrollReveal />
      </body>
    </html>
  );
}
