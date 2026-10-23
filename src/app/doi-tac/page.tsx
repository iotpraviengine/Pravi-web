import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CtaBand, SectionHead } from "@/components/ui";
import { brands } from "@/lib/content";

export const metadata: Metadata = {
  title: "Đối tác & thương hiệu",
  description:
    "SKV Lighting là nhà phân phối độc quyền BOE MLED, nhà phân phối chính hãng NovaStar tại Việt Nam và đối tác của PixelHue, Ledman, MUXWAVE, GLOSHINE, Yellow River, DJPOWER.",
  alternates: { canonical: "/doi-tac" },
};

export default function PartnersPage() {
  const featured = brands.filter((b) => b.featured);
  const others = brands.filter((b) => !b.featured);

  return (
    <>
      <section className="hero theme-dark" style={{ paddingBottom: "clamp(56px, 8vw, 96px)" }}>
        <div className="container">
          <span className="eyebrow reveal">Đối tác & thương hiệu</span>
          <h1 className="display reveal">Chính hãng. Từ gốc.</h1>
          <p className="subhead reveal" data-delay="1" style={{ color: "var(--text-2)" }}>
            Hợp tác trực tiếp với các tập đoàn hiển thị và ánh sáng hàng đầu thế giới.
          </p>
          <div className="hero-media framed reveal" data-delay="2">
            <Image
              src="/images/home/microled.webp"
              alt="Màn hình BOE COB P0.9 HDR Micro LED tại triển lãm InfoComm Asia 2026"
              fill
              priority
              sizes="(min-width: 1260px) 1180px, 94vw"
            />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid grid-2">
            {featured.map((b, i) => (
              <article key={b.name} className="card brand-card reveal" data-delay={String(i)} style={{ padding: "clamp(32px, 4vw, 48px)" }}>
                <p className="wordmark">{b.name}</p>
                <span className="badge">{b.badge}</span>
                <h2 className="title" style={{ fontSize: "clamp(22px, 2.4vw, 28px)", marginTop: 20 }}>
                  {b.category}
                </h2>
                <p>{b.text}</p>
              </article>
            ))}
          </div>
          <p className="small muted reveal" style={{ marginTop: 16 }}>
            Chứng nhận ủy quyền phân phối có thời hạn theo từng năm. Liên hệ SKV để được cung cấp bản sao chứng nhận cho hồ sơ dự án.
          </p>
        </div>
      </section>

      <section className="section theme-alt">
        <div className="container">
          <SectionHead title="Hệ sinh thái thương hiệu." />
          <div className="grid grid-3">
            {others.map((b, i) => (
              <article key={b.name} className="card reveal" data-delay={String(i % 3)}>
                <p className="wordmark" style={{ fontSize: 24, fontWeight: 700 }}>
                  {b.name}
                </p>
                <p style={{ marginTop: 4, color: "var(--link)", fontSize: 14, fontWeight: 600 }}>{b.category}</p>
                <p>{b.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container grid grid-2" style={{ alignItems: "center", gap: "clamp(32px, 5vw, 64px)" }}>
          <div className="reveal" style={{ position: "relative", aspectRatio: "3 / 2", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
            <Image src="/images/home/booth.webp" alt="Gian hàng SKV Lighting tại triển lãm NPSE Show 2026" fill sizes="(min-width: 640px) 50vw, 100vw" />
          </div>
          <div className="reveal" data-delay="1">
            <span className="eyebrow">Triển lãm & sự kiện</span>
            <h2 className="headline">
              <Link href="/tin-tuc" className="title-link">
                Luôn cập nhật công nghệ mới nhất.
              </Link>
            </h2>
            <p className="muted" style={{ marginTop: 16, fontSize: 19 }}>
              PLASE Show · NPSE Show · ISLE · InfoComm Asia
            </p>
          </div>
        </div>
      </section>

      <CtaBand title="Hợp tác cùng SKV." />
    </>
  );
}
