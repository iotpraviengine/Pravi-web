import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CtaBand } from "@/components/ui";
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
          <h1 className="display reveal">Giải pháp cho mọi không gian.</h1>
        </div>
      </section>

      <div className="tile-grid" style={{ paddingTop: 0 }}>
        {solutions.map((s, i) => (
          <Link key={s.slug} href={`/giai-phap/${s.slug}`} className="tile tile-link theme-alt">
            <div className="tile-copy reveal">
              <span className="eyebrow">{s.name}</span>
              <h2 className="title">{s.tileHeadline}</h2>
            </div>
            <div className="tile-media reveal" data-delay="1">
              <Image src={s.hero} alt="" fill sizes="(min-width: 834px) 46vw, 92vw" priority={i < 2} />
            </div>
          </Link>
        ))}
      </div>

      <CtaBand title="Chưa chắc giải pháp nào phù hợp?" alt={false} />
    </>
  );
}
