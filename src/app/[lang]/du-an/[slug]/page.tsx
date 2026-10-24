import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, Layers, MapPin } from "lucide-react";
import { Breadcrumb, CtaBand, ProjectCard } from "@/components/ui";
import { VietnameseBody } from "@/components/VietnameseBody";
import { fmt } from "@/i18n/config";
import { alternates, getI18n } from "@/i18n/server";
import { formatDate, getContent } from "@/lib/content";

// Slugs are the same in every language.
export function generateStaticParams() {
  return getContent().projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/du-an/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const { locale, c } = await getI18n();
  const p = c.getProject(slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.summary,
    alternates: alternates(locale, `/du-an/${p.slug}`),
    openGraph: { type: "article", images: [p.cover] },
  };
}

export default async function ProjectPage({ params }: PageProps<"/[lang]/du-an/[slug]">) {
  const { slug } = await params;
  const { locale, ui, t, c, href } = await getI18n();
  const p = c.getProject(slug);
  if (!p) notFound();

  const solution = c.getSolution(p.solution);
  const related = c
    .getProjectsBySolution(p.solution)
    .filter((x) => x.slug !== p.slug)
    .slice(0, 3);
  const gallery = p.gallery.filter((src) => src !== p.cover);

  return (
    <>
      <article>
        <header className="article-head">
          <div className="container-narrow">
            <Breadcrumb items={[{ href: "/", label: ui.common.home }, { href: "/du-an", label: t.project.crumb }, { label: p.title }]} />
            <h1 className="headline">{p.title}</h1>
            <div className="article-meta">
              {p.location && (
                <span>
                  <MapPin size={16} aria-hidden="true" /> {p.location}
                </span>
              )}
              <span>
                <CalendarDays size={16} aria-hidden="true" /> <time dateTime={p.date}>{formatDate(p.date, locale)}</time>
              </span>
              {solution && (
                <span>
                  <Layers size={16} aria-hidden="true" /> <Link href={href(`/giai-phap/${solution.slug}`)}>{solution.name}</Link>
                </span>
              )}
            </div>
            {p.tags.length > 0 && (
              <div className="chips">
                {p.tags.map((tag) => (
                  <span className="chip" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="container">
            <div className="article-cover">
              <Image src={p.cover} alt={p.title} fill priority sizes="(min-width: 1260px) 1180px, 94vw" />
            </div>
          </div>
        </header>

        <div className="section-sm">
          <VietnameseBody post={p} note={t.vietnameseOnly} />
        </div>

        {gallery.length > 0 && (
          <section className="section-sm" aria-label={t.project.photosLabel}>
            <div className="container">
              <div className="gallery">
                {gallery.map((src, i) => (
                  <figure key={src} className="reveal">
                    <Image src={src} alt={fmt(t.project.photoAlt, { title: p.title, n: i + 2 })} fill sizes="(min-width: 734px) 50vw, 100vw" />
                  </figure>
                ))}
              </div>
            </div>
          </section>
        )}
      </article>

      <CtaBand title={t.project.cta} />

      {related.length > 0 && (
        <section className="section">
          <div className="container">
            <h2 className="title reveal" style={{ marginBottom: 28 }}>
              {t.project.related}
            </h2>
            <div className="grid grid-3">
              {related.map((r) => (
                <div key={r.slug} className="reveal">
                  <ProjectCard project={r} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
