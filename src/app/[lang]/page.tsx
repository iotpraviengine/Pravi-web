import fs from "node:fs";
import path from "node:path";
import Image, { getImageProps } from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { CSSProperties } from "react";
import { AmbientPlay } from "@/components/AmbientPlay";
import { HeroVideo } from "@/components/HeroVideo";
import { LogoMarquee } from "@/components/LogoMarquee";
import { SolutionRail } from "@/components/SolutionRail";
import { CtaBand, ProjectCard } from "@/components/ui";
import { fmt } from "@/i18n/config";
import { getI18n } from "@/i18n/server";

// Background video for the LED panel: drop files into public/videos/ and they are picked up at build time.
const videoFile = (name: string) => (fs.existsSync(path.join(process.cwd(), "public/videos", name)) ? `/videos/${name}` : undefined);
// Stand-in until the video arrives: only the picture on the LED wall (no room around it), so it fills the panel edge to edge.
// Its blurred-out on-screen text sits under the headline's scrim; narrow screens get the clean lower right part
// (below the BOE mark printed on the picture, which would sit under the menu button).
const ledPoster = "/images/home/led-boe-screen.webp";
const ledPosterNarrow = "/images/home/led-boe-screen-portrait.webp";

function LedPoster({ alt }: { alt: string }) {
  const common = { alt, sizes: "100vw", priority: true };
  const { props: { srcSet: wide, ...rest } } = getImageProps({ ...common, src: ledPoster, width: 1196, height: 664 });
  const { props: { srcSet: narrow } } = getImageProps({ ...common, src: ledPosterNarrow, width: 350, height: 564 });
  return (
    <picture>
      <source media="(max-width: 1023px)" srcSet={narrow} />
      <source media="(min-width: 1024px)" srcSet={wide} />
      {/* eslint-disable-next-line jsx-a11y/alt-text -- alt comes from getImageProps via rest */}
      <img {...rest} className="hero-video-media" />
    </picture>
  );
}

// The two product lines below the LED video, side by side, each in its own colour world.
// (words come from the page copy: home.stage / home.effects)
const duo = [
  { key: "stage", href: "/san-pham#den-san-khau", eyebrow: "Moving head · Par · Laser", image: "/images/home/stage-light.webp", tone: "violet" },
  { key: "effects", href: "/san-pham#hieu-ung", eyebrow: "DJPOWER · SKV", image: "/images/home/effects.webp", tone: "ember" },
] as const;

// Ambient light inside the two panels. Values feed CSS custom properties (see "Living stage light" in globals.css).
const beams = [
  { x: 4, from: -24, to: 16, dur: 4.6, delay: 1.2 },
  { x: 37, from: 18, to: -18, dur: 5.4, delay: 3 },
  { x: 70, from: -12, to: 24, dur: 5, delay: 2 },
];
const hazes = [
  { x: 44, dx: 18, dur: 8, delay: 0 },
  { x: 30, dx: -12, dur: 9, delay: 3 },
  { x: 52, dx: 8, dur: 8.5, delay: 5.5 },
  { x: 38, dx: 22, dur: 9.5, delay: 7 },
];
const vars = (o: Record<string, number>) => Object.fromEntries(Object.entries(o).map(([k, v]) => [`--${k}`, v])) as CSSProperties;

// Hand-picked: projects whose cover photo is a clean, finished shot.
const featuredProjects = [
  "skv-thi-cong-man-hinh-led-co-lon-p2-5-indoor-tai-hoc-vien-chinh-sach",
  "skv-thi-cong-100m2-man-hinh-led-p2-indoor-tai-trung-tam-van-hoa-tinh-ninh-binh",
  "skv-thi-cong-man-hinh-led-p3-91-indoor-tai-nha-thi-dau-huyen-thanh-tri",
];

export default async function HomePage() {
  const { t, c, href } = await getI18n();
  const h = t.home;
  const { siteInfo, solutions, brands } = c;
  const mp4 = videoFile("led-hero.mp4");
  const projects = featuredProjects.map((slug) => c.getProject(slug)).filter((p) => p !== undefined);

  return (
    <>
      {/* LED: full-screen video (or poster photo until the video is supplied) */}
      <section className="hero-video" aria-labelledby="hero-title">
        {/* The whole picture links to the LED products; the copy sits above it and lets clicks through except on the call button. */}
        <Link href={href("/san-pham#man-hinh-led")} className="hero-video-link" aria-label={h.heroLink} />
        {mp4 ? (
          <HeroVideo mp4={mp4} webm={videoFile("led-hero.webm")} mobileMp4={videoFile("led-hero-mobile.mp4")} poster={videoFile("led-hero-poster.jpg") ?? ledPoster} />
        ) : (
          <LedPoster alt={h.posterAlt} />
        )}
        <div className="hero-video-copy">
          <h1 id="hero-title" className="hero-video-title">
            <span className="accent">{h.heroAccent}</span>
            {h.heroRest}
          </h1>
          <p className="hero-video-lead">{h.heroLead}</p>
          <a href={`tel:${siteInfo.contact.hotlineTel}`} className="btn btn-primary hero-video-call">
            {fmt(h.call, { phone: siteInfo.contact.hotline })}
          </a>
        </div>
      </section>

      {/* Stage lighting + effects: two columns that together match the LED panel */}
      <section className="duo" data-ambient aria-label={h.duoLabel}>
        {duo.map((d) => (
          <Link key={d.href} href={href(d.href)} className={`duo-panel duo-${d.tone} reveal`}>
            <div className="duo-media">
              <Image src={d.image} alt={h[d.key].alt} fill sizes="(min-width: 734px) 50vw, 50vw" />
            </div>
            <div className="duo-fx" aria-hidden="true">
              {d.tone === "violet"
                ? beams.map((b, i) => <span key={i} style={vars(b)} />)
                : [
                    <span key="glow" className="glow" />,
                    ...hazes.map((h, i) => <span key={i} className="haze" style={vars(h)} />),
                  ]}
            </div>
            <div className="duo-copy">
              <span className="duo-eyebrow">{d.eyebrow}</span>
              <h2 className="duo-title">{h[d.key].title}</h2>
              <p className="duo-line">{h[d.key].line}</p>
            </div>
          </Link>
        ))}
      </section>
      <AmbientPlay />

      {/* Solutions: one horizontal, swipeable row */}
      <SolutionRail
        title={h.solutions}
        href={href("/giai-phap")}
        items={solutions.map((s) => ({ slug: s.slug, name: s.short, line: s.tileHeadline, image: s.hero, focus: s.heroFocus }))}
      />

      {/* Projects */}
      <section className="section theme-alt" aria-labelledby="projects-title">
        <div className="container">
          <h2 id="projects-title" className="headline reveal" style={{ marginBottom: "clamp(28px, 4vw, 48px)" }}>
            <Link href={href("/du-an")} className="title-link">
              {h.projects}
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
          <h2 id="brands-title" className="headline reveal" style={{ marginBottom: "clamp(28px, 4vw, 48px)" }}>
            <Link href={href("/doi-tac")} className="title-link">
              {h.brands}
              <ChevronRight size={36} strokeWidth={2} aria-hidden="true" />
            </Link>
          </h2>
        </div>
        <LogoMarquee brands={brands} label={h.brandsLabel} />
      </section>

      <CtaBand />
    </>
  );
}
