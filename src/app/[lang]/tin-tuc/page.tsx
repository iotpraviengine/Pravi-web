import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { NewsCard } from "@/components/ui";
import { alternates, getI18n } from "@/i18n/server";
import { formatDate } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, t } = await getI18n();
  return { title: t.news.title, description: t.news.description, alternates: alternates(locale, "/tin-tuc") };
}

export default async function NewsPage() {
  const { locale, t, c, href } = await getI18n();
  const [first, ...rest] = c.news;

  return (
    <>
      <section className="hero" style={{ paddingBottom: "clamp(32px, 5vw, 56px)" }}>
        <div className="container">
          <span className="eyebrow reveal">{t.news.eyebrow}</span>
          <h1 className="display reveal">{t.news.headline}</h1>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          {first && (
            <Link href={href(`/tin-tuc/${first.slug}`)} className="media-card reveal" style={{ marginBottom: "clamp(40px, 6vw, 72px)" }}>
              <div className="grid grid-2" style={{ alignItems: "center" }}>
                <div className="media" style={{ aspectRatio: "16 / 10" }}>
                  <Image src={first.cover} alt="" fill priority sizes="(min-width: 640px) 50vw, 100vw" />
                </div>
                <div>
                  <p className="meta">
                    <time dateTime={first.date}>{formatDate(first.date, locale)}</time>
                  </p>
                  <h2 className="title" style={{ marginTop: 8, color: "var(--text)" }}>
                    {first.title}
                  </h2>
                  <p className="muted" style={{ marginTop: 12 }}>
                    {first.summary}
                  </p>
                </div>
              </div>
            </Link>
          )}

          <div className="grid grid-3" style={{ rowGap: 48 }}>
            {rest.map((n, i) => (
              <div key={n.slug} className="reveal" data-delay={String(i % 3)}>
                <NewsCard post={n} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
