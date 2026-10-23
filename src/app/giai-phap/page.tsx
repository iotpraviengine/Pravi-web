import type { Metadata } from "next";
import Image from "next/image";
import { CtaBand, MoreLink } from "@/components/ui";
import { solutions } from "@/lib/content";

export const metadata: Metadata = {
  title: "Giải pháp",
  description:
    "Giải pháp màn hình LED, đèn sân khấu và hiệu ứng cho hội trường, phòng họp, sân khấu sự kiện, bar – karaoke, tiệc cưới, trường học, công trình công cộng, quảng cáo ngoài trời và nhà xưởng.",
  alternates: { canonical: "/giai-phap" },
};

export default function SolutionsPage() {
  return (
    <>
      <section className="hero" style={{ paddingBottom: "clamp(40px, 6vw, 72px)" }}>
        <div className="container">
          <span className="eyebrow reveal">Giải pháp</span>
          <h1 className="display reveal">Mỗi không gian. Một giải pháp riêng.</h1>
          <p className="subhead reveal" data-delay="1">
            SKV không chỉ bán thiết bị. Chúng tôi lắng nghe mục tiêu của bạn, khảo sát không gian và thiết kế một hệ thống hiển thị –
            ánh sáng vừa vặn với nhu cầu và ngân sách.
          </p>
        </div>
      </section>

      <div className="tile-grid" style={{ paddingTop: 0 }}>
        {solutions.map((s, i) => {
          const dark = i % 4 === 0 || i % 4 === 3;
          return (
            <article key={s.slug} className={`tile ${dark ? "theme-dark" : "theme-alt"}`}>
              <div className="tile-copy reveal">
                <span className="eyebrow">{s.name}</span>
                <h2 className="title">{s.tileHeadline}</h2>
                <p className="muted" style={{ marginTop: 10, maxWidth: 520, marginInline: "auto" }}>
                  {s.subhead}
                </p>
                <div className="tile-links">
                  <MoreLink href={`/giai-phap/${s.slug}`}>Tìm hiểu thêm</MoreLink>
                  <MoreLink href={`/lien-he?giai-phap=${s.slug}`}>Nhận tư vấn</MoreLink>
                </div>
              </div>
              <div className="tile-media reveal" data-delay="1">
                <Image src={s.hero} alt={s.name} fill sizes="(min-width: 834px) 46vw, 92vw" priority={i < 2} />
              </div>
            </article>
          );
        })}
      </div>

      <CtaBand
        title="Chưa chắc giải pháp nào phù hợp?"
        subhead="Mô tả không gian và nhu cầu của bạn – chúng tôi sẽ đề xuất phương án tối ưu, hoàn toàn miễn phí."
        alt={false}
      />
    </>
  );
}
