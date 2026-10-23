import type { Metadata } from "next";
import Image from "next/image";
import { Eye, Gem, Target } from "lucide-react";
import { CtaBand, SectionHead } from "@/components/ui";
import { siteInfo } from "@/lib/content";

export const metadata: Metadata = {
  title: "Về SKV Lighting",
  description:
    "SKV Lighting – Công ty CP Phát triển Đầu tư TM&DV Hồ Gia: đơn vị cung ứng, tư vấn và thi công màn hình LED, đèn sân khấu, thiết bị hiệu ứng chính hãng từ năm 2018.",
  alternates: { canonical: "/gioi-thieu" },
};

const milestones = [
  { year: "2018", text: "Chính thức thành lập Công ty CP Phát triển Đầu tư TM&DV Hồ Gia – thương hiệu SKV Lighting." },
  { year: "2019 – 2020", text: "Phát triển mạnh mẽ từ doanh nghiệp nhỏ và vừa, mở rộng sang thi công màn hình LED trọn gói." },
  { year: "2023 – 2024", text: "Triển khai hàng loạt dự án cho học viện, cơ quan nhà nước, bến xe, nhà thi đấu; tham gia PLASE Show, NPSE Show." },
  { year: "2025", text: "Tham dự triển lãm ISLE 2025, cập nhật công nghệ LED COB và Micro LED mới nhất." },
  { year: "2026", text: "Trở thành nhà phân phối độc quyền BOE MLED và nhà phân phối chính hãng NovaStar tại Việt Nam." },
];

export default function AboutPage() {
  return (
    <>
      <section className="hero" style={{ paddingBottom: "clamp(56px, 8vw, 96px)" }}>
        <div className="container">
          <span className="eyebrow reveal">Về SKV Lighting</span>
          <h1 className="display reveal">Tinh hoa Sân Khấu Việt.</h1>
          <p className="subhead reveal" data-delay="1">
            S – K – V là Sân Khấu Việt: cung ứng thiết bị sân khấu chất lượng với chi phí hợp lý, lưu giữ bản sắc văn hóa Việt trong từng
            công trình.
          </p>
          <div className="hero-media framed reveal" data-delay="2">
            <Image src="/images/home/team.webp" alt="Đội ngũ SKV Lighting tại triển lãm NPSE Show 2026" fill priority sizes="(min-width: 1260px) 1180px, 94vw" />
          </div>
        </div>
      </section>

      <section className="section theme-alt">
        <div className="container">
          <p className="lead reveal" style={{ maxWidth: 980 }}>
            Bén duyên với lĩnh vực thiết bị sân khấu, năm 2018 chúng tôi thành lập <strong>{siteInfo.legalName}</strong>. Từ những khởi
            đầu khiêm tốn, SKV Lighting đã trở thành <strong>nhà cung ứng, tư vấn và thi công</strong> màn hình LED, đèn sân khấu và thiết
            bị hiệu ứng chính hãng – với phương châm <strong>Uy tín – Cam kết – Tận tâm</strong>.
          </p>
          <div className="stats" style={{ marginTop: "clamp(48px, 7vw, 88px)" }}>
            {siteInfo.stats.map((s, i) => (
              <div key={s.label} className="reveal" data-delay={String(i)}>
                <div className="stat-value">{s.value}</div>
                <p className="stat-label">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead title="Điều dẫn lối chúng tôi." />
          <div className="grid grid-3">
            <div className="card reveal">
              <span className="card-icon">
                <Eye size={34} strokeWidth={1.6} aria-hidden="true" />
              </span>
              <h3>Tầm nhìn</h3>
              <p>Trở thành đơn vị uy tín hàng đầu trong cung ứng màn hình LED, đèn sân khấu và thiết bị hiệu ứng chính hãng, tiên phong đưa công nghệ mới về Việt Nam.</p>
            </div>
            <div className="card reveal" data-delay="1">
              <span className="card-icon">
                <Target size={34} strokeWidth={1.6} aria-hidden="true" />
              </span>
              <h3>Sứ mệnh</h3>
              <p>Phục vụ khách hàng bằng sản phẩm chất lượng, có tính thẩm mỹ cao; gắn kết khách hàng và doanh nghiệp bằng dịch vụ tận tâm, chu đáo và thân thiện.</p>
            </div>
            <div className="card reveal" data-delay="2">
              <span className="card-icon">
                <Gem size={34} strokeWidth={1.6} aria-hidden="true" />
              </span>
              <h3>Giá trị cốt lõi</h3>
              <p>Văn hóa doanh nghiệp là nền tảng, giá trị nhân sự là nòng cốt. Không chỉ chất lượng sản phẩm, SKV tự hào là nhà tư vấn và cung cấp giải pháp kỹ thuật xuất sắc.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section theme-dark">
        <div className="container-narrow">
          <SectionHead eyebrow="Hành trình" title="Từng bước vững chắc." />
          <ol style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {milestones.map((m) => (
              <li key={m.year} className="reveal" style={{ display: "grid", gridTemplateColumns: "minmax(110px, 160px) 1fr", gap: 24, padding: "24px 0", borderTop: "1px solid var(--line)" }}>
                <span className="stat-value" style={{ fontSize: "clamp(22px, 2.6vw, 32px)" }}>
                  {m.year}
                </span>
                <p style={{ fontSize: 19, color: "var(--text-2)" }}>{m.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="container grid grid-2" style={{ alignItems: "center", gap: "clamp(32px, 5vw, 64px)" }}>
          <div className="reveal">
            <span className="eyebrow">Đội ngũ</span>
            <h2 className="headline">Con người tạo nên khác biệt.</h2>
            <p className="muted" style={{ marginTop: 16, fontSize: 19 }}>
              Đội ngũ kỹ thuật viên nhiều năm kinh nghiệm lắp đặt, vận hành và bảo trì – năng động, sáng tạo và dốc hết đam mê để mang lại
              giá trị tốt nhất cho khách hàng.
            </p>
            <p className="muted" style={{ marginTop: 16, fontSize: 19 }}>
              Bạn muốn gia nhập SKV? Gửi CV về <a href={`mailto:${siteInfo.contact.email}`}>{siteInfo.contact.email}</a>.
            </p>
          </div>
          <div className="reveal" data-delay="1" style={{ position: "relative", aspectRatio: "3 / 2", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
            <Image src="/images/home/stage.webp" alt="Sân khấu triển lãm NPSE Show 2026" fill sizes="(min-width: 640px) 50vw, 100vw" />
          </div>
        </div>
      </section>

      <section className="section-sm theme-alt">
        <div className="container small muted">
          <h2 className="title" style={{ color: "var(--text)", marginBottom: 16 }}>
            Thông tin doanh nghiệp
          </h2>
          <p>
            <strong style={{ color: "var(--text)" }}>{siteInfo.legalName}</strong> ({siteInfo.shortLegalName})
          </p>
          <p>
            Mã số thuế: {siteInfo.taxCode} – {siteInfo.taxIssued}
          </p>
          {siteInfo.offices.map((o) => (
            <p key={o.label}>
              {o.label}: {o.address}
            </p>
          ))}
        </div>
      </section>

      <CtaBand alt={false} />
    </>
  );
}
