import type { Metadata } from "next";
import Image from "next/image";
import { Icon } from "@/components/Icon";
import { CtaBand, MoreLink } from "@/components/ui";
import { services } from "@/lib/content";

export const metadata: Metadata = {
  title: "Dịch vụ",
  description: "Lắp đặt màn hình LED, lắp đặt đèn sân khấu, cho thuê màn hình LED, sửa chữa và bảo trì màn hình LED trên toàn quốc.",
  alternates: { canonical: "/dich-vu" },
};

export default function ServicesPage() {
  return (
    <>
      <section className="hero" style={{ paddingBottom: "clamp(40px, 6vw, 72px)" }}>
        <div className="container">
          <span className="eyebrow reveal">Dịch vụ</span>
          <h1 className="display reveal">Đồng hành trọn vòng đời hệ thống.</h1>
          <p className="subhead reveal" data-delay="1">
            Thi công, cho thuê, sửa chữa và bảo trì – với đội ngũ kỹ thuật nhiều năm kinh nghiệm, sẵn sàng hỗ trợ 24/7.
          </p>
        </div>
      </section>

      <div className="tile-grid" style={{ paddingTop: 0 }}>
        {services.map((s, i) => {
          const dark = i % 4 === 0 || i % 4 === 3;
          return (
            <article key={s.slug} className={`tile ${dark ? "theme-dark" : "theme-alt"}`}>
              <div className="tile-copy reveal">
                <span className="card-icon" style={{ display: "inline-block", marginBottom: 8 }}>
                  <Icon name={s.icon} size={36} />
                </span>
                <h2 className="title">{s.name}</h2>
                <p className="muted" style={{ marginTop: 10, maxWidth: 520, marginInline: "auto" }}>
                  {s.subhead}
                </p>
                <div className="tile-links">
                  <MoreLink href={`/dich-vu/${s.slug}`}>Tìm hiểu thêm</MoreLink>
                  <MoreLink href={`/lien-he?dich-vu=${s.slug}`}>Yêu cầu báo giá</MoreLink>
                </div>
              </div>
              <div className="tile-media reveal" data-delay="1">
                <Image src={s.hero} alt={s.name} fill sizes="(min-width: 834px) 46vw, 92vw" priority={i < 2} />
              </div>
            </article>
          );
        })}
      </div>

      <CtaBand alt={false} />
    </>
  );
}
