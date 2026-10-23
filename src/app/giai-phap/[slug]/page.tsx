import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/Icon";
import { CtaBand, Emphasis, Faq, LocalNav, MoreLink, ProductCard, ProjectCard, SectionHead } from "@/components/ui";
import { getProjectsBySolution, getSolution, productGroups, solutions } from "@/lib/content";

export function generateStaticParams() {
  return solutions.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/giai-phap/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const s = getSolution(slug);
  if (!s) return {};
  return {
    title: `Giải pháp ${s.name}`,
    description: s.subhead,
    alternates: { canonical: `/giai-phap/${s.slug}` },
    openGraph: { images: [s.hero] },
  };
}

export default async function SolutionPage({ params }: PageProps<"/giai-phap/[slug]">) {
  const { slug } = await params;
  const s = getSolution(slug);
  if (!s) notFound();

  const dark = s.theme === "dark";
  const projects = getProjectsBySolution(s.slug).slice(0, 3);
  const products = s.productGroups
    .flatMap((id) => productGroups.find((g) => g.id === id)?.items.slice(0, 2) ?? [])
    .slice(0, 4);
  const others = solutions.filter((o) => o.slug !== s.slug).slice(0, 3);

  return (
    <>
      <LocalNav
        title={s.short}
        dark={dark}
        links={[
          { href: "#tong-quan", label: "Tổng quan" },
          { href: "#he-thong", label: "Hệ thống" },
          ...(projects.length ? [{ href: "#du-an", label: "Dự án" }] : []),
          { href: "#hoi-dap", label: "Hỏi đáp" },
        ]}
        ctaHref={`/lien-he?giai-phap=${s.slug}`}
      />

      {/* Hero */}
      <section id="tong-quan" className={`hero${dark ? " theme-dark" : ""}`} style={{ paddingBottom: "clamp(56px, 8vw, 96px)" }}>
        <div className="container">
          <span className="eyebrow reveal">{s.name}</span>
          <h1 className="display reveal">{s.headline}</h1>
          <p className="subhead reveal" data-delay="1">
            {s.subhead}
          </p>
          <div className="actions center reveal" data-delay="2">
            <Link href={`/lien-he?giai-phap=${s.slug}`} className="btn btn-primary">
              Nhận tư vấn miễn phí
            </Link>
            {projects.length > 0 && (
              <a href="#du-an" className="btn btn-secondary">
                Xem dự án thực tế
              </a>
            )}
          </div>
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
          <SectionHead eyebrow="Ứng dụng" title="Được thiết kế cho cách bạn sử dụng." />
          <div className="grid grid-3">
            {s.needs.map((n, i) => (
              <div key={n.title} className="card reveal" data-delay={String(i)}>
                <span className="card-icon">
                  <Icon name={n.icon} size={34} />
                </span>
                <h3>{n.title}</h3>
                <p>{n.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* System */}
      <section id="he-thong" className={`section${dark ? " theme-dark" : ""}`}>
        <div className="container">
          <SectionHead eyebrow="Hệ thống" title="Mọi thành phần. Hoạt động như một." subhead="SKV cung cấp, lắp đặt và đồng bộ toàn bộ hệ thống – bạn chỉ cần một đầu mối." />
          <div className="grid grid-4">
            {s.system.map((f, i) => (
              <div key={f.title} className="feature reveal" data-delay={String(i)}>
                <span className="card-icon">
                  <Icon name={f.icon} size={34} />
                </span>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </div>
            ))}
          </div>
          {s.gallery.length > 0 && (
            <div className="gallery" style={{ marginTop: "clamp(48px, 6vw, 72px)" }}>
              {s.gallery.map((src, i) => (
                <figure key={src} className="reveal" data-delay={String(i)}>
                  <Image src={src} alt={`${s.name} – hình ảnh thực tế ${i + 1}`} fill sizes="(min-width: 734px) 50vw, 100vw" />
                </figure>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Compare */}
      {s.compare && (
        <section className="section theme-alt">
          <div className="container-narrow" style={{ maxWidth: 1000 }}>
            <SectionHead title={s.compare.title} center />
            <div className="table-wrap reveal">
              <table className="compare">
                <thead>
                  <tr>
                    <th scope="col">Tiêu chí</th>
                    {s.compare.columns.map((c) => (
                      <th scope="col" key={c}>
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {s.compare.rows.map(([label, ...cells]) => (
                    <tr key={label}>
                      <th scope="row">{label}</th>
                      {cells.map((c, i) => (
                        <td key={i} data-label={s.compare!.columns[i]}>
                          {c}
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
            <div className="section-head reveal" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "end", gap: 16 }}>
              <div>
                <span className="eyebrow">Thiết bị gợi ý</span>
                <h2 className="headline">Chính hãng, sẵn kho.</h2>
              </div>
              <MoreLink href={`/san-pham#${s.productGroups[0]}`}>Xem danh mục sản phẩm</MoreLink>
            </div>
            <div className="grid grid-4">
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
            <div className="section-head reveal" style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "end", gap: 16 }}>
              <div>
                <span className="eyebrow">Dự án thực tế</span>
                <h2 className="headline">Đã triển khai bởi SKV.</h2>
              </div>
              <MoreLink href={`/du-an?giai-phap=${s.slug}`}>Xem thêm dự án</MoreLink>
            </div>
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
        <div className="container-narrow">
          <SectionHead title="Câu hỏi thường gặp" />
          <div className="reveal">
            <Faq items={s.faq} />
          </div>
        </div>
      </section>

      <CtaBand title={`Sẵn sàng cho ${s.short.toLowerCase()} của bạn?`} alt={false} />

      {/* Other solutions */}
      <section className="section-sm theme-alt">
        <div className="container">
          <h2 className="title reveal" style={{ marginBottom: 28 }}>
            Giải pháp khác
          </h2>
          <div className="grid grid-3">
            {others.map((o) => (
              <Link key={o.slug} href={`/giai-phap/${o.slug}`} className="media-card reveal">
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
