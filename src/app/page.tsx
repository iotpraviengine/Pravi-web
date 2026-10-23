import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { CtaBand, ProjectCard } from "@/components/ui";
import { brands, getProjects, solutions } from "@/lib/content";

// The three product lines, in the order they appear. Each panel links to its group on /san-pham.
const showcase = [
  {
    href: "/san-pham#man-hinh-led",
    eyebrow: "BOE MLED · NovaStar",
    title: "Màn hình LED",
    line: "Sắc nét đến từng điểm ảnh.",
    image: "/images/home/led.webp",
    alt: "Màn hình LED BOE MLED lắp đặt trong không gian trưng bày",
    // keep the ceiling visible so the headline sits above the screen, not on it
    position: "center top",
  },
  {
    href: "/san-pham#den-san-khau",
    eyebrow: "Moving head · Par · Laser",
    title: "Đèn sân khấu",
    line: "Ánh sáng làm nên khoảnh khắc.",
    image: "/images/home/stage-light.webp",
    alt: "Hệ thống đèn moving head chiếu tia trên sân khấu biểu diễn",
  },
  {
    href: "/san-pham#hieu-ung",
    eyebrow: "DJPOWER · SKV",
    title: "Thiết bị hiệu ứng",
    line: "Khói, lửa, CO2 – cảm xúc bùng nổ.",
    image: "/images/home/effects.webp",
    alt: "Máy tạo khói DJPOWER DSK-2000",
    contain: true,
  },
];

// Hand-picked: projects whose cover photo is a clean, finished shot.
const featuredProjects = [
  "skv-thi-cong-man-hinh-led-co-lon-p2-5-indoor-tai-hoc-vien-chinh-sach",
  "skv-thi-cong-100m2-man-hinh-led-p2-indoor-tai-trung-tam-van-hoa-tinh-ninh-binh",
  "skv-thi-cong-man-hinh-led-p3-91-indoor-tai-nha-thi-dau-huyen-thanh-tri",
];

export default function HomePage() {
  const projects = featuredProjects.map((slug) => getProjects().find((p) => p.slug === slug)).filter((p) => p !== undefined);

  return (
    <>
      <h1 className="sr-only">SKV Lighting – màn hình LED, đèn sân khấu và thiết bị hiệu ứng</h1>

      {showcase.map((s, i) => (
        <Link key={s.href} href={s.href} className={`showcase${s.contain ? " contain" : ""}`}>
          <div className="showcase-media">
            <Image src={s.image} alt={s.alt} fill priority={i === 0} sizes="100vw" style={s.position ? { objectPosition: s.position } : undefined} />
          </div>
          <span className="showcase-eyebrow">{s.eyebrow}</span>
          <h2 className="showcase-title">{s.title}</h2>
          <p className="showcase-line">{s.line}</p>
        </Link>
      ))}

      {/* Solutions */}
      <section className="section" aria-labelledby="solutions-title">
        <div className="container">
          <h2 id="solutions-title" className="headline reveal" style={{ marginBottom: "clamp(28px, 4vw, 48px)" }}>
            <Link href="/giai-phap" className="title-link">
              Giải pháp cho mọi không gian
              <ChevronRight size={36} strokeWidth={2} aria-hidden="true" />
            </Link>
          </h2>
          <div className="solution-grid">
            {solutions.map((s, i) => (
              <Link key={s.slug} href={`/giai-phap/${s.slug}`} className="solution-tile reveal" data-delay={String(i % 3)}>
                <Image src={s.hero} alt="" fill sizes="(min-width: 834px) 33vw, 50vw" />
                <span>{s.short}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="section theme-alt" aria-labelledby="projects-title">
        <div className="container">
          <h2 id="projects-title" className="headline reveal" style={{ marginBottom: "clamp(28px, 4vw, 48px)" }}>
            <Link href="/du-an" className="title-link">
              Dự án tiêu biểu
              <ChevronRight size={36} strokeWidth={2} aria-hidden="true" />
            </Link>
          </h2>
          <div className="grid grid-3">
            {projects.map((p, i) => (
              <div key={p.slug} className="reveal" data-delay={String(i)}>
                <ProjectCard project={p} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="section" aria-labelledby="brands-title">
        <div className="container">
          <h2 id="brands-title" className="headline center reveal" style={{ marginBottom: "clamp(28px, 4vw, 48px)" }}>
            <Link href="/doi-tac" className="title-link">
              Chính hãng từ những thương hiệu dẫn đầu
            </Link>
          </h2>
          <div className="brand-grid reveal">
            {brands.map((b) => (
              <div key={b.name} className="brand-cell">
                {b.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
