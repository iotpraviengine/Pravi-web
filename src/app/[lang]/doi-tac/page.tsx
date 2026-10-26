import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CtaBand, SectionHead } from "@/components/ui";
import { alternates, getI18n } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, t } = await getI18n();
  return { title: t.partners.title, description: t.partners.description, alternates: alternates(locale, "/doi-tac") };
}

export default async function PartnersPage() {
  const { t, c, href } = await getI18n();
  const l = t.partners;
  const featured = c.brands.filter((b) => b.featured);
  const others = c.brands.filter((b) => !b.featured);

  return (
    <>
      <section className="hero theme-dark" style={{ paddingBottom: "clamp(56px, 8vw, 96px)" }}>
        <div className="container">
          <h1 className="display reveal">{l.headline}</h1>
          <p className="subhead reveal" data-delay="1">
            {l.subhead}
          </p>
          <div className="hero-media framed reveal" data-delay="2">
            <Image src="/images/home/microled.webp" alt={l.heroAlt} fill priority sizes="(min-width: 1260px) 1180px, 94vw" />
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
                <h2 className="title" style={{ marginTop: 20 }}>
                  {b.category}
                </h2>
                <p>{b.text}</p>
              </article>
            ))}
          </div>
          <p className="small muted reveal" style={{ marginTop: 16 }}>
            {l.certNote}
          </p>
        </div>
      </section>

      <section className="section theme-alt">
        <div className="container">
          <SectionHead title={l.ecosystem} />
          <div className="grid grid-3">
            {others.map((b, i) => (
              <article key={b.name} className="card reveal" data-delay={String(i % 3)}>
                <p className="wordmark" style={{ fontSize: "var(--step-lead)", fontWeight: 700 }}>
                  {b.name}
                </p>
                <p className="small muted" style={{ marginTop: 4, fontWeight: 600 }}>{b.category}</p>
                <p>{b.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container grid grid-2" style={{ alignItems: "center", gap: "clamp(32px, 5vw, 64px)" }}>
          <div className="reveal" style={{ position: "relative", aspectRatio: "3 / 2", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
            <Image src="/images/home/booth.webp" alt={l.boothAlt} fill sizes="(min-width: 640px) 50vw, 100vw" />
          </div>
          <div className="reveal" data-delay="1">
            <h2 className="headline">
              <Link href={href("/tin-tuc")} className="title-link">
                {l.eventsTitle}
              </Link>
            </h2>
            <p style={{ marginTop: 16 }}>
              PLASE Show · NPSE Show · ISLE · InfoComm Asia
            </p>
          </div>
        </div>
      </section>

      <CtaBand title={l.cta} />
    </>
  );
}
