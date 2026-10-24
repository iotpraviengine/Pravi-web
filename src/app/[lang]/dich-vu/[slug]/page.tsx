import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CircleCheck } from "lucide-react";
import { Icon } from "@/components/Icon";
import { CtaBand, Emphasis, LinkedHeading, LocalNav, ProjectCard, SectionHead } from "@/components/ui";
import { alternates, getI18n } from "@/i18n/server";
import { getContent } from "@/lib/content";

// Slugs are the same in every language.
export function generateStaticParams() {
  return getContent().services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/dich-vu/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const { locale, c } = await getI18n();
  const s = c.getService(slug);
  if (!s) return {};
  return {
    title: s.name,
    description: s.subhead,
    alternates: alternates(locale, `/dich-vu/${s.slug}`),
    openGraph: { images: [s.hero] },
  };
}

export default async function ServicePage({ params }: PageProps<"/[lang]/dich-vu/[slug]">) {
  const { slug } = await params;
  const { t, c, href } = await getI18n();
  const s = c.getService(slug);
  if (!s) notFound();
  const l = t.service;

  const relatedSolutions = s.solutions.map(c.getSolution).filter((x) => x !== undefined);
  const projects = c.projects.filter((p) => s.solutions.includes(p.solution)).slice(0, 3);

  return (
    <>
      <LocalNav
        title={s.name}
        links={[
          { href: "#loi-ich", label: l.nav.benefits },
          { href: "#quy-trinh", label: l.nav.process },
          { href: "#du-an", label: l.nav.projects },
        ]}
      />

      <section className="hero" style={{ paddingBottom: "clamp(56px, 8vw, 96px)" }}>
        <div className="container">
          <span className="eyebrow reveal">{l.eyebrow}</span>
          <h1 className="display reveal">{s.headline}</h1>
          <p className="subhead reveal" data-delay="1">
            {s.subhead}
          </p>
          <div className="hero-media framed reveal" data-delay="2">
            <Image src={s.hero} alt={s.name} fill priority sizes="(min-width: 1260px) 1180px, 94vw" />
          </div>
        </div>
      </section>

      <section id="loi-ich" className="section theme-alt">
        <div className="container">
          <p className="lead reveal" style={{ maxWidth: 980, marginBottom: "clamp(40px, 6vw, 72px)" }}>
            <Emphasis text={s.intro} />
          </p>
          <div className="grid grid-3">
            {s.benefits.map((b, i) => (
              <div key={b.title} className="card reveal" data-delay={String(i)}>
                <span className="card-icon">
                  <Icon name={b.icon} size={34} />
                </span>
                <h3>{b.title}</h3>
                <p>{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {s.issues && (
        <section className="section theme-dark">
          <div className="container">
            <SectionHead eyebrow={l.issuesEyebrow} title={l.issuesTitle} />
            <ul className="grid grid-3" style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {s.issues.map((issue, i) => (
                <li key={issue} className="card reveal" data-delay={String(i % 3)} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <CircleCheck size={24} style={{ color: "var(--link)", flex: "none", marginTop: 2 }} aria-hidden="true" />
                  <span style={{ fontSize: 19, fontWeight: 600 }}>{issue}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section id="quy-trinh" className="section">
        <div className="container">
          <SectionHead eyebrow={l.processEyebrow} title={l.processTitle} />
          <ol className="steps">
            {s.process.map((step, i) => (
              <li key={step.title} className="reveal" data-delay={String(i % 3)}>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section-sm theme-alt">
        <div className="container">
          <h2 className="title reveal" style={{ marginBottom: 24 }}>
            {l.appliesTo}
          </h2>
          <div className="chips reveal" style={{ gap: 10 }}>
            {relatedSolutions.map((sol) => (
              <Link key={sol.slug} href={href(`/giai-phap/${sol.slug}`)} className="filter-chip" style={{ background: "var(--card)" }}>
                {sol.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {projects.length > 0 && (
        <section id="du-an" className="section">
          <div className="container">
            <LinkedHeading eyebrow={l.projectsEyebrow} title={l.projectsTitle} href="/du-an" />
            <div className="grid grid-3">
              {projects.map((p, i) => (
                <div key={p.slug} className="reveal" data-delay={String(i)}>
                  <ProjectCard project={p} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBand />
    </>
  );
}
