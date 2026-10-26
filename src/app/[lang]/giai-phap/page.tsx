import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CtaBand } from "@/components/ui";
import { alternates, getI18n } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, t } = await getI18n();
  return { title: t.solutions.title, description: t.solutions.description, alternates: alternates(locale, "/giai-phap") };
}

export default async function SolutionsPage() {
  const { t, c, href } = await getI18n();
  return (
    <>
      <section className="hero" style={{ paddingBottom: "clamp(40px, 6vw, 72px)" }}>
        <div className="container">
          <h1 className="display reveal">{t.solutions.headline}</h1>
        </div>
      </section>

      <div className="tile-grid" style={{ paddingTop: 0 }}>
        {c.solutions.map((s, i) => (
          <Link key={s.slug} href={href(`/giai-phap/${s.slug}`)} className="tile tile-link theme-alt">
            <div className="tile-copy reveal">
              <h2 className="title">{s.name}</h2>
              <p className="subhead" style={{ marginTop: 8 }}>
                {s.tileHeadline}
              </p>
            </div>
            <div className="tile-media reveal" data-delay="1">
              <Image src={s.hero} alt="" fill sizes="(min-width: 834px) 46vw, 92vw" priority={i < 2} />
            </div>
          </Link>
        ))}
      </div>

      <CtaBand title={t.solutions.cta} />
    </>
  );
}
