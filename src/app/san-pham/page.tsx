import type { Metadata } from "next";
import { CtaBand, ProductCard } from "@/components/ui";
import { productGroups } from "@/lib/content";

export const metadata: Metadata = {
  title: "Sản phẩm",
  description:
    "Danh mục sản phẩm tiêu biểu: cabin LED BOE, màn hình trong suốt MUXWAVE, bộ xử lý NovaStar, PixelHue, đèn sân khấu Yellow River, đèn chiếu logo và thiết bị hiệu ứng DJPOWER.",
  alternates: { canonical: "/san-pham" },
};

export default function ProductsPage() {
  return (
    <>
      <section className="hero" style={{ paddingBottom: "clamp(40px, 6vw, 64px)" }}>
        <div className="container">
          <span className="eyebrow reveal">Sản phẩm</span>
          <h1 className="display reveal">Thiết bị chính hãng cho mọi giải pháp.</h1>
          <p className="subhead reveal" data-delay="1">
            Một số sản phẩm tiêu biểu SKV đang phân phối. Mỗi dự án sẽ được tư vấn cấu hình và báo giá riêng.
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

      <CtaBand
        title="Cần thiết bị không có trong danh mục?"
        subhead="SKV phân phối hơn 500 mã sản phẩm từ các thương hiệu hàng đầu. Gửi yêu cầu để nhận tư vấn và báo giá trong ngày."
      />
    </>
  );
}
