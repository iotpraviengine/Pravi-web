import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CircleCheck } from "lucide-react";
import { Icon } from "@/components/Icon";
import { CtaBand, Emphasis, LinkedHeading, LocalNav, ProjectCard, SectionHead } from "@/components/ui";
import { getProjects, getService, getSolution, services } from "@/lib/content";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/dich-vu/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) return {};
  return {
    title: s.name,
    description: s.subhead,
    alternates: { canonical: `/dich-vu/${s.slug}` },
    openGraph: { images: [s.hero] },
  };
}

export default async function ServicePage({ params }: PageProps<"/dich-vu/[slug]">) {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) notFound();

  const relatedSolutions = s.solutions.map(getSolution).filter((x) => x !== undefined);
  const projects = getProjects()
    .filter((p) => s.solutions.includes(p.solution))
    .slice(0, 3);

  return (
    <>
      <LocalNav
        title={s.name}
        links={[
          { href: "#loi-ich", label: "Lợi ích" },
          { href: "#quy-trinh", label: "Quy trình" },
          { href: "#du-an", label: "Dự án" },
        ]}
      />

      <section className="hero" style={{ paddingBottom: "clamp(56px, 8vw, 96px)" }}>
        <div className="container">
          <span className="eyebrow reveal">Dịch vụ</span>
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
            <SectionHead eyebrow="Chúng tôi xử lý" title="Những lỗi thường gặp." />
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
          <SectionHead eyebrow="Quy trình" title="Rõ ràng ở từng bước." />
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
            Áp dụng cho các giải pháp
          </h2>
          <div className="chips reveal" style={{ gap: 10 }}>
            {relatedSolutions.map((sol) => (
              <Link key={sol.slug} href={`/giai-phap/${sol.slug}`} className="filter-chip" style={{ background: "var(--card)" }}>
                {sol.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {projects.length > 0 && (
        <section id="du-an" className="section">
          <div className="container">
            <LinkedHeading eyebrow="Dự án" title="Công trình đã thực hiện" href="/du-an" />
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
