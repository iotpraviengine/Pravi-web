import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { NewsCard } from "@/components/ui";
import { formatDate, getNews } from "@/lib/content";

export const metadata: Metadata = {
  title: "Tin tức",
  description: "Tin tức, sự kiện và hoạt động mới nhất của SKV Lighting.",
  alternates: { canonical: "/tin-tuc" },
};

export default function NewsPage() {
  const [first, ...rest] = getNews();

  return (
    <>
      <section className="hero" style={{ paddingBottom: "clamp(32px, 5vw, 56px)" }}>
        <div className="container">
          <span className="eyebrow reveal">Tin tức</span>
          <h1 className="display reveal">Có gì mới tại SKV.</h1>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          {first && (
            <Link href={`/tin-tuc/${first.slug}`} className="media-card reveal" style={{ marginBottom: "clamp(40px, 6vw, 72px)" }}>
              <div className="grid grid-2" style={{ alignItems: "center" }}>
                <div className="media" style={{ aspectRatio: "16 / 10" }}>
                  <Image src={first.cover} alt="" fill priority sizes="(min-width: 640px) 50vw, 100vw" />
                </div>
                <div>
                  <p className="meta">
                    <time dateTime={first.date}>{formatDate(first.date)}</time>
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
