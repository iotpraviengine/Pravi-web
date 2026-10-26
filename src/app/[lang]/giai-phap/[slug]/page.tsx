import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaBand, Emphasis, Faq, LinkedHeading, LocalNav, ProductCard, ProjectCard, SectionHead } from "@/components/ui";
import { fmt } from "@/i18n/config";
import { alternates, getI18n } from "@/i18n/server";
import { getContent } from "@/lib/content";

// Slugs are the same in every language.
export function generateStaticParams() {
  return getContent().solutions.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/giai-phap/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const { locale, t, c } = await getI18n();
  const s = c.getSolution(slug);
  if (!s) return {};
  return {
    title: fmt(t.solution.metaTitle, { name: s.name }),
    description: s.subhead,
    alternates: alternates(locale, `/giai-phap/${s.slug}`),
    openGraph: { images: [s.hero] },
  };
}

export default async function SolutionPage({ params }: PageProps<"/[lang]/giai-phap/[slug]">) {
  const { slug } = await params;
  const { t, c, href } = await getI18n();
  const s = c.getSolution(slug);
  if (!s) notFound();
  const l = t.solution;

  const dark = s.theme === "dark";
  const projects = c.getProjectsBySolution(s.slug).slice(0, 3);
  const products = s.productGroups
    .flatMap((id) => c.productGroups.find((g) => g.id === id)?.items.slice(0, 2) ?? [])
    .slice(0, 3); // one full row of three
  const others = c.solutions.filter((o) => o.slug !== s.slug).slice(0, 3);

  return (
    <>
      <LocalNav
        title={s.short}
        dark={dark}
        links={[
          { href: "#tong-quan", label: l.nav.overview },
          { href: "#he-thong", label: l.nav.system },
          ...(projects.length ? [{ href: "#du-an", label: l.nav.projects }] : []),
          { href: "#hoi-dap", label: l.nav.faq },
        ]}
      />

      {/* Hero */}
      <section id="tong-quan" className={`hero${dark ? " theme-dark" : ""}`} style={{ paddingBottom: "clamp(56px, 8vw, 96px)" }}>
        <div className="container">
          <h1 className="display reveal">{s.headline}</h1>
          <p className="subhead reveal" data-delay="1">
            {s.subhead}
          </p>
        </div>
        <div className="container">
          <div className="hero-media framed reveal" data-delay="2">
            <Image src={s.hero} alt={s.name} fill priority sizes="(min-width: 1260px) 1180px, 94vw" />
          </div>
        </div>
      </section>

      {/* Intro + highlights */}
      <section className="section">
        <div className="container">
          <p className="lead reveal" style={{ maxWidth: 980 }}>
            <Emphasis text={s.intro} />
          </p>
          <div className="stats stats-3" style={{ marginTop: "clamp(48px, 7vw, 88px)" }}>
            {s.highlights.map((h, i) => (
              <div key={h.label} className="reveal" data-delay={String(i)}>
                <div className="stat-value">
                  {h.value}
                  {h.unit && <span className="stat-unit">{h.unit}</span>}
                </div>
                <p className="stat-label">{h.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Needs */}
      <section className="section theme-alt">
        <div className="container">
          <SectionHead title={l.needsTitle} />
          <ul className="points points-3">
            {s.needs.map((n, i) => (
              <li key={n.title} className="reveal" data-delay={String(i)}>
                <h3>{n.title}</h3>
                <p>{n.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* System */}
      <section id="he-thong" className={`section${dark ? " theme-dark" : ""}`}>
        <div className="container">
          <SectionHead title={l.systemTitle} />
          <ul className="points">
            {s.system.map((f, i) => (
              <li key={f.title} className="reveal" data-delay={String(i % 2)}>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </li>
            ))}
          </ul>
          {s.gallery.length > 0 && (
            <div className="gallery" style={{ marginTop: "clamp(48px, 6vw, 72px)" }}>
              {s.gallery.map((src, i) => (
                <figure key={src} className="reveal" data-delay={String(i)}>
                  <Image src={src} alt={fmt(l.galleryAlt, { name: s.name, n: i + 1 })} fill sizes="(min-width: 734px) 50vw, 100vw" />
                </figure>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Compare */}
      {s.compare && (
        <section className="section theme-alt">
          <div className="container">
            <SectionHead title={s.compare.title} center />
            <div className="table-wrap reveal">
              <table className="compare">
                <thead>
                  <tr>
                    <th scope="col">{l.criteria}</th>
                    {s.compare.columns.map((col) => (
                      <th scope="col" key={col}>
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {s.compare.rows.map(([label, ...cells]) => (
                    <tr key={label}>
                      <th scope="row">{label}</th>
                      {cells.map((cell, i) => (
                        <td key={i} data-label={s.compare!.columns[i]}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Products */}
      {products.length > 0 && (
        <section className={`section${s.compare ? "" : " theme-alt"}`}>
          <div className="container">
            <LinkedHeading title={l.productsTitle} href={`/san-pham#${s.productGroups[0]}`} />
            <div className="grid grid-4 products">
              {products.map((p, i) => (
                <div key={p.slug} className="reveal" data-delay={String(i)} style={{ display: "grid" }}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section id="du-an" className="section">
          <div className="container">
            <LinkedHeading title={l.projectsTitle} href={`/du-an?giai-phap=${s.slug}`} />
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

      {/* FAQ */}
      <section id="hoi-dap" className="section theme-alt">
        {/* heading on the left, questions on the right: the section uses the whole width */}
        <div className="container split">
          <SectionHead title={l.faq} />
          <div className="reveal">
            <Faq items={s.faq} />
          </div>
        </div>
      </section>

      <CtaBand title={fmt(l.cta, { name: s.short.toLowerCase() })} />

      {/* Other solutions */}
      <section className="section-sm theme-alt">
        <div className="container">
          <h2 className="title reveal" style={{ marginBottom: 28 }}>
            {l.others}
          </h2>
          <div className="grid grid-3">
            {others.map((o) => (
              <Link key={o.slug} href={href(`/giai-phap/${o.slug}`)} className="media-card reveal">
                <div className="media" style={{ aspectRatio: "16 / 10" }}>
                  <Image src={o.hero} alt="" fill sizes="(min-width: 1000px) 380px, 100vw" />
                </div>
                <h3>{o.name}</h3>
                <p className="meta">{o.tileHeadline}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
