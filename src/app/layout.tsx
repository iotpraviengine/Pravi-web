import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { FloatingContact } from "@/components/FloatingContact";
import { siteInfo } from "@/lib/content";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://skv.lighting";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "SKV Lighting – Giải pháp màn hình LED & ánh sáng sân khấu",
    template: "%s – SKV Lighting",
  },
  description: siteInfo.description,
  applicationName: "SKV Lighting",
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "SKV Lighting",
    images: [{ url: "/images/home/hero.webp", width: 2400, height: 1350 }],
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" className={inter.variable}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Chuyển đến nội dung chính
        </a>
        <Nav hotline={siteInfo.contact.hotline} hotlineTel={siteInfo.contact.hotlineTel} />
        <main id="main">{children}</main>
        <Footer />
        <FloatingContact />
      </body>
    </html>
  );
}
