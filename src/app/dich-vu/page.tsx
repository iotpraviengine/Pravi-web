import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CtaBand } from "@/components/ui";
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
          <h1 className="display reveal">Đồng hành trọn vòng đời hệ thống.</h1>
        </div>
      </section>

      <div className="tile-grid" style={{ paddingTop: 0 }}>
        {services.map((s, i) => (
          <Link key={s.slug} href={`/dich-vu/${s.slug}`} className="tile tile-link theme-alt">
            <div className="tile-copy reveal">
              <h2 className="title">{s.name}</h2>
              <p className="muted" style={{ marginTop: 8 }}>
                {s.summary}
              </p>
            </div>
            <div className="tile-media reveal" data-delay="1">
              <Image src={s.hero} alt="" fill sizes="(min-width: 834px) 46vw, 92vw" priority={i < 2} />
            </div>
          </Link>
        ))}
      </div>

      <CtaBand alt={false} />
    </>
  );
}
