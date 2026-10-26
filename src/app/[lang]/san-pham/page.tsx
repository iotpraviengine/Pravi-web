import type { Metadata } from "next";
import Image from "next/image";
import { CtaBand, ProductCard } from "@/components/ui";
import { alternates, getI18n } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, t } = await getI18n();
  return { title: t.products.title, description: t.products.description, alternates: alternates(locale, "/san-pham") };
}

// Banner photos for the three main product lines (same images as the home page showcase).
const banners: Record<string, { src: string; contain?: boolean; ratio?: string }> = {
  "man-hinh-led": { src: "/images/home/led-cob-banner.webp", ratio: "1903 / 590" },
  "den-san-khau": { src: "/images/home/stage-light.webp" },
  "hieu-ung": { src: "/images/home/effects.webp", contain: true },
};

export default async function ProductsPage() {
  const { t, c } = await getI18n();
  const l = t.products;
  return (
    <>
      <section className="hero" style={{ paddingBottom: "clamp(40px, 6vw, 64px)" }}>
        <div className="container">
          <h1 className="display reveal">{l.headline}</h1>
          <p className="subhead reveal muted" data-delay="1">
            {l.subhead}
          </p>
        </div>
      </section>

      <nav className="subnav-chips" aria-label={l.categories}>
        <ul className="container">
          {c.productGroups.map((g) => (
            <li key={g.id}>
              <a href={`#${g.id}`}>{g.name}</a>
            </li>
          ))}
        </ul>
      </nav>

      {c.productGroups.map((g, gi) => (
        <section key={g.id} id={g.id} className={`section${gi % 2 === 0 ? " theme-alt" : ""}`} style={{ scrollMarginTop: 110 }}>
          <div className="container">
            <div className="section-head reveal">
              <h2 className="headline">{g.name}</h2>
              <p className="subhead">{g.blurb}</p>
            </div>
            {banners[g.id] && (
              <div
                className={`group-banner reveal${banners[g.id].contain ? " contain" : ""}`}
                style={banners[g.id].ratio ? { aspectRatio: banners[g.id].ratio } : undefined}
              >
                <Image src={banners[g.id].src} alt="" fill sizes="(min-width: 1260px) 1180px, 94vw" />
              </div>
            )}
            <div className="grid grid-4 products">
              {g.items.map((p, i) => (
                <div key={p.slug} className="reveal" data-delay={String(i % 4)} style={{ display: "grid" }}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      <CtaBand title={l.cta} />
    </>
  );
}
