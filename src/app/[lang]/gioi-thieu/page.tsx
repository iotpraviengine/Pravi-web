import type { Metadata } from "next";
import Image from "next/image";
import { Eye, Gem, Target } from "lucide-react";
import { CtaBand, Emphasis, SectionHead } from "@/components/ui";
import { fmt } from "@/i18n/config";
import { alternates, getI18n } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, t } = await getI18n();
  return { title: t.about.title, description: t.about.description, alternates: alternates(locale, "/gioi-thieu") };
}

export default async function AboutPage() {
  const { t, c } = await getI18n();
  const l = t.about;
  const { siteInfo } = c;
  const values = [
    { ...l.vision, icon: Eye },
    { ...l.mission, icon: Target },
    { ...l.core, icon: Gem },
  ];

  return (
    <>
      <section className="hero" style={{ paddingBottom: "clamp(56px, 8vw, 96px)" }}>
        <div className="container">
          <span className="eyebrow reveal">{l.eyebrow}</span>
          <h1 className="display reveal">{l.headline}</h1>
          <p className="subhead reveal" data-delay="1">
            {l.subhead}
          </p>
          <div className="hero-media framed reveal" data-delay="2">
            <Image src="/images/home/team.webp" alt={l.teamAlt} fill priority sizes="(min-width: 1260px) 1180px, 94vw" />
          </div>
        </div>
      </section>

      <section className="section theme-alt">
        <div className="container">
          <p className="lead reveal" style={{ maxWidth: 980 }}>
            <Emphasis text={fmt(l.story, { legalName: siteInfo.legalName })} />
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
          <SectionHead title={l.valuesTitle} />
          <div className="grid grid-3">
            {values.map((v, i) => (
              <div key={v.title} className="card reveal" data-delay={i ? String(i) : undefined}>
                <span className="card-icon">
                  <v.icon size={34} strokeWidth={1.6} aria-hidden="true" />
                </span>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section theme-dark">
        <div className="container-narrow">
          <SectionHead eyebrow={l.journeyEyebrow} title={l.journeyTitle} />
          <ol style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {l.milestones.map((m) => (
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
            <span className="eyebrow">{l.teamEyebrow}</span>
            <h2 className="headline">{l.teamTitle}</h2>
            <p className="muted" style={{ marginTop: 16, fontSize: 19 }}>
              {l.teamText}
            </p>
            <p className="muted" style={{ marginTop: 16, fontSize: 19 }}>
              {l.join} <a href={`mailto:${siteInfo.contact.email}`}>{siteInfo.contact.email}</a>.
            </p>
          </div>
          <div className="reveal" data-delay="1" style={{ position: "relative", aspectRatio: "3 / 2", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
            <Image src="/images/home/stage.webp" alt={l.stageAlt} fill sizes="(min-width: 640px) 50vw, 100vw" />
          </div>
        </div>
      </section>

      <CtaBand alt={false} />
    </>
  );
}
