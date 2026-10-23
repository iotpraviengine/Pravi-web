import type { Metadata } from "next";
import Image from "next/image";
import { CtaBand, ProductCard } from "@/components/ui";
import { productGroups } from "@/lib/content";

export const metadata: Metadata = {
  title: "Sản phẩm",
  description:
    "Danh mục sản phẩm tiêu biểu: cabin LED BOE, màn hình trong suốt MUXWAVE, bộ xử lý NovaStar, PixelHue, đèn sân khấu Yellow River, đèn chiếu logo và thiết bị hiệu ứng DJPOWER.",
  alternates: { canonical: "/san-pham" },
};

// Banner photos for the three main product lines (same images as the home page showcase).
const banners: Record<string, { src: string; contain?: boolean }> = {
  "man-hinh-led": { src: "/images/home/led-boe.webp" },
  "den-san-khau": { src: "/images/home/stage-light.webp" },
  "hieu-ung": { src: "/images/home/effects.webp", contain: true },
};

export default function ProductsPage() {
  return (
    <>
      <section className="hero" style={{ paddingBottom: "clamp(40px, 6vw, 64px)" }}>
        <div className="container">
          <span className="eyebrow reveal">Sản phẩm</span>
          <h1 className="display reveal">Thiết bị chính hãng cho mọi giải pháp.</h1>
          <p className="subhead reveal muted" data-delay="1">
            Chạm vào sản phẩm để nhận thông tin và báo giá.
          </p>
        </div>
      </section>

      <nav className="subnav-chips" aria-label="Danh mục sản phẩm">
        <ul className="container">
          {productGroups.map((g) => (
            <li key={g.id}>
              <a href={`#${g.id}`}>{g.name}</a>
            </li>
          ))}
        </ul>
      </nav>

      {productGroups.map((g, gi) => (
        <section key={g.id} id={g.id} className={`section${gi % 2 === 0 ? " theme-alt" : ""}`} style={{ scrollMarginTop: 110 }}>
          <div className="container">
            <div className="section-head reveal">
              <h2 className="headline">{g.name}</h2>
              <p className="subhead">{g.blurb}</p>
            </div>
            {banners[g.id] && (
              <div className={`group-banner reveal${banners[g.id].contain ? " contain" : ""}`}>
                <Image src={banners[g.id].src} alt="" fill sizes="(min-width: 1260px) 1180px, 94vw" />
              </div>
            )}
            <div className="grid grid-4">
              {g.items.map((p, i) => (
                <div key={p.slug} className="reveal" data-delay={String(i % 4)} style={{ display: "grid" }}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      <CtaBand title="Hơn 500 mã sản phẩm khác." />
    </>
  );
}
