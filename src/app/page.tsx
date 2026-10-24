import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { HeroVideo } from "@/components/HeroVideo";
import { CtaBand, ProjectCard } from "@/components/ui";
import { brands, getProjects, solutions } from "@/lib/content";

// Background video for the LED panel: drop files into public/videos/ and they are picked up at build time.
const videoFile = (name: string) => (fs.existsSync(path.join(process.cwd(), "public/videos", name)) ? `/videos/${name}` : undefined);
const ledPoster = "/images/home/led-boe-poster.webp";

// The two product lines below the LED video, side by side, each in its own colour world.
const duo = [
  {
    href: "/san-pham#den-san-khau",
    eyebrow: "Moving head · Par · Laser",
    title: "Đèn sân khấu",
    line: "Ánh sáng làm nên khoảnh khắc.",
    image: "/images/home/stage-light.webp",
    alt: "Hệ thống đèn moving head chiếu tia trên sân khấu biểu diễn",
    tone: "violet",
  },
  {
    href: "/san-pham#hieu-ung",
    eyebrow: "DJPOWER · SKV",
    title: "Thiết bị hiệu ứng",
    line: "Khói, lửa, CO2 – bùng nổ cảm xúc.",
    image: "/images/home/effects.webp",
    alt: "Máy tạo khói DJPOWER DSK-2000",
    tone: "ember",
  },
];

// Hand-picked: projects whose cover photo is a clean, finished shot.
const featuredProjects = [
  "skv-thi-cong-man-hinh-led-co-lon-p2-5-indoor-tai-hoc-vien-chinh-sach",
  "skv-thi-cong-100m2-man-hinh-led-p2-indoor-tai-trung-tam-van-hoa-tinh-ninh-binh",
  "skv-thi-cong-man-hinh-led-p3-91-indoor-tai-nha-thi-dau-huyen-thanh-tri",
];

export default function HomePage() {
  const mp4 = videoFile("led-hero.mp4");
  const projects = featuredProjects.map((slug) => getProjects().find((p) => p.slug === slug)).filter((p) => p !== undefined);

  return (
    <>
      <h1 className="sr-only">SKV Lighting – màn hình LED, đèn sân khấu và thiết bị hiệu ứng</h1>

      {/* LED: full-screen video (or poster photo until the video is supplied) */}
      <Link href="/san-pham#man-hinh-led" className="hero-video" aria-label="Màn hình LED – xem sản phẩm">
        {mp4 ? (
          <HeroVideo mp4={mp4} webm={videoFile("led-hero.webm")} mobileMp4={videoFile("led-hero-mobile.mp4")} poster={ledPoster} />
        ) : (
          <Image src={ledPoster} alt="Màn hình LED BOE MLED hiển thị phong cảnh rừng núi" fill priority sizes="100vw" className="hero-video-media" />
        )}
        <div className="hero-video-copy">
          <span className="hero-video-eyebrow">Màn hình LED · BOE MLED · NovaStar</span>
          <h2 className="hero-video-title">
            <span className="accent">Sống động</span> đến từng điểm ảnh.
          </h2>
        </div>
      </Link>

      {/* Stage lighting + effects: two columns that together match the LED panel */}
      <section className="duo" aria-label="Đèn sân khấu và thiết bị hiệu ứng">
        {duo.map((d) => (
          <Link key={d.href} href={d.href} className={`duo-panel duo-${d.tone}`}>
            <div className="duo-media">
              <Image src={d.image} alt={d.alt} fill sizes="(min-width: 734px) 50vw, 50vw" />
            </div>
            <div className="duo-copy">
              <span className="duo-eyebrow">{d.eyebrow}</span>
              <h2 className="duo-title">{d.title}</h2>
              <p className="duo-line">{d.line}</p>
            </div>
          </Link>
        ))}
      </section>

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
