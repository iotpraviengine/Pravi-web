import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CalendarDays } from "lucide-react";
import { Breadcrumb, CtaBand, NewsCard } from "@/components/ui";
import { formatDate, getNews, getNewsPost, renderMarkdown } from "@/lib/content";

export function generateStaticParams() {
  return getNews().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/tin-tuc/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getNewsPost(slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.summary,
    alternates: { canonical: `/tin-tuc/${p.slug}` },
    openGraph: { type: "article", images: [p.cover], publishedTime: p.date },
  };
}

export default async function NewsPostPage({ params }: PageProps<"/tin-tuc/[slug]">) {
  const { slug } = await params;
  const p = getNewsPost(slug);
  if (!p) notFound();

  const more = getNews()
    .filter((x) => x.slug !== p.slug)
    .slice(0, 3);
  const gallery = p.gallery.filter((src) => src !== p.cover);

  return (
    <>
      <article>
        <header className="article-head">
          <div className="container-narrow">
            <Breadcrumb items={[{ href: "/", label: "Trang chủ" }, { href: "/tin-tuc", label: "Tin tức" }, { label: p.title }]} />
            <h1 className="headline">{p.title}</h1>
            <div className="article-meta">
              <span>
                <CalendarDays size={16} aria-hidden="true" /> <time dateTime={p.date}>{formatDate(p.date)}</time>
              </span>
            </div>
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
          <section className="section-sm" style={{ paddingTop: 0 }} aria-label="Hình ảnh">
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

      <section className="section theme-alt">
        <div className="container">
          <h2 className="title reveal" style={{ marginBottom: 28 }}>
            Tin tức khác
          </h2>
          <div className="grid grid-3">
            {more.map((n) => (
              <div key={n.slug} className="reveal">
                <NewsCard post={n} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand alt={false} />
    </>
  );
}
