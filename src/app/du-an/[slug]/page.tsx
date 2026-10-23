import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, Layers, MapPin } from "lucide-react";
import { Breadcrumb, CtaBand, ProjectCard } from "@/components/ui";
import { formatDate, getProject, getProjects, getProjectsBySolution, getSolution, renderMarkdown } from "@/lib/content";

export function generateStaticParams() {
  return getProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/du-an/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.summary,
    alternates: { canonical: `/du-an/${p.slug}` },
    openGraph: { type: "article", images: [p.cover] },
  };
}

export default async function ProjectPage({ params }: PageProps<"/du-an/[slug]">) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();

  const solution = getSolution(p.solution);
  const related = getProjectsBySolution(p.solution)
    .filter((x) => x.slug !== p.slug)
    .slice(0, 3);
  const gallery = p.gallery.filter((src) => src !== p.cover);

  return (
    <>
      <article>
        <header className="article-head">
          <div className="container-narrow">
            <Breadcrumb items={[{ href: "/", label: "Trang chủ" }, { href: "/du-an", label: "Dự án" }, { label: p.title }]} />
            <h1 className="headline">{p.title}</h1>
            <div className="article-meta">
              {p.location && (
                <span>
                  <MapPin size={16} aria-hidden="true" /> {p.location}
                </span>
              )}
              <span>
                <CalendarDays size={16} aria-hidden="true" /> <time dateTime={p.date}>{formatDate(p.date)}</time>
              </span>
              {solution && (
                <span>
                  <Layers size={16} aria-hidden="true" /> <Link href={`/giai-phap/${solution.slug}`}>{solution.name}</Link>
                </span>
              )}
            </div>
            {p.tags.length > 0 && (
              <div className="chips">
                {p.tags.map((t) => (
                  <span className="chip" key={t}>
                    {t}
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
          <div className="container-narrow prose" dangerouslySetInnerHTML={{ __html: renderMarkdown(p.body) }} />
        </div>

        {gallery.length > 0 && (
          <section className="section-sm" aria-label="Hình ảnh thi công">
            <div className="container">
              <div className="gallery">
                {gallery.map((src, i) => (
                  <figure key={src} className="reveal">
                    <Image src={src} alt={`${p.title} – hình ảnh ${i + 2}`} fill sizes="(min-width: 734px) 50vw, 100vw" />
                  </figure>
                ))}
              </div>
            </div>
          </section>
        )}
      </article>

      <CtaBand title="Bạn có dự án tương tự?" />

      {related.length > 0 && (
        <section className="section">
          <div className="container">
            <h2 className="title reveal" style={{ marginBottom: 28 }}>
              Dự án liên quan
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
