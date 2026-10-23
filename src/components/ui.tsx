import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Mail, MapPin, Phone, Plus } from "lucide-react";
import { emphasis, formatDate, getSolution, siteInfo, type Post, type Product, type Project } from "@/lib/content";

/** Renders copy where `**phrase**` marks the emphasised words (Apple "copy block" style). */
export function Emphasis({ text }: { text: string }) {
  return (
    <>
      {emphasis(text).map((p, i) => ("strong" in p ? <strong key={i}>{p.strong}</strong> : <span key={i}>{p.text}</span>))}
    </>
  );
}

export function MoreLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="link-more">
      {children}
      <ChevronRight size={18} strokeWidth={2} aria-hidden="true" />
    </Link>
  );
}

export function SectionHead({
  eyebrow,
  title,
  subhead,
  center,
  as: Tag = "h2",
}: {
  eyebrow?: string;
  title: string;
  subhead?: string;
  center?: boolean;
  as?: "h1" | "h2";
}) {
  return (
    <div className={`section-head reveal${center ? " center" : ""}`}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <Tag className="headline">{title}</Tag>
      {subhead && <p className="subhead">{subhead}</p>}
    </div>
  );
}

export function Breadcrumb({ items }: { items: { href?: string; label: string }[] }) {
  return (
    <nav aria-label="Đường dẫn">
      <ol className="breadcrumb">
        {items.map((it) => (
          <li key={it.label}>{it.href ? <Link href={it.href}>{it.label}</Link> : <span aria-current="page">{it.label}</span>}</li>
        ))}
      </ol>
    </nav>
  );
}

export function LocalNav({ title, links, dark }: { title: string; links: { href: string; label: string }[]; dark?: boolean }) {
  return (
    <div className={`localnav${dark ? " theme-dark" : ""}`}>
      <div className="container localnav-inner">
        <span className="localnav-title">{title}</span>
        <nav className="localnav-menu" aria-label={`Mục trong trang ${title}`}>
          {links.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}

export function ProjectCard({ project, priority }: { project: Project; priority?: boolean }) {
  const solution = getSolution(project.solution);
  return (
    <Link href={`/du-an/${project.slug}`} className="media-card">
      <div className="media">
        <Image src={project.cover} alt="" fill sizes="(min-width: 1000px) 380px, (min-width: 640px) 50vw, 100vw" priority={priority} />
      </div>
      <h3>{project.title}</h3>
      <p className="meta">
        {project.location || solution?.name} · {project.date.slice(0, 4)}
      </p>
      {(project.tags.length > 0 || solution) && (
        <div className="chips">
          {solution && <span className="chip">{solution.short}</span>}
          {project.tags.map((t) => (
            <span className="chip" key={t}>
              {t}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}

export function NewsCard({ post }: { post: Post }) {
  return (
    <Link href={`/tin-tuc/${post.slug}`} className="media-card">
      <div className="media" style={{ aspectRatio: "16 / 10" }}>
        <Image src={post.cover} alt="" fill sizes="(min-width: 1000px) 380px, (min-width: 640px) 50vw, 100vw" />
      </div>
      <p className="meta" style={{ marginTop: 16 }}>
        <time dateTime={post.date}>{formatDate(post.date)}</time>
      </p>
      <h3 style={{ marginTop: 4 }}>{post.title}</h3>
    </Link>
  );
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/lien-he?san-pham=${encodeURIComponent(product.name)}`}
      className="product-card"
      aria-label={`${product.name} – yêu cầu thông tin và báo giá`}
    >
      <div className="media">
        <Image src={product.image} alt="" fill sizes="(min-width: 1000px) 280px, (min-width: 640px) 45vw, 90vw" />
      </div>
      <div className="body">
        <span className="brand-name">{product.brand}</span>
        <h3>{product.name}</h3>
        {product.specs.length > 0 && (
          <dl>
            {product.specs.slice(0, 3).map((s) => (
              <div key={s.label}>
                <dt>{s.label}</dt>
                <dd>{s.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </Link>
  );
}

export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="faq">
      {items.map((it) => (
        <details key={it.q}>
          <summary>
            {it.q}
            <Plus size={22} aria-hidden="true" />
          </summary>
          <p>{it.a}</p>
        </details>
      ))}
    </div>
  );
}

export function CtaBand({ title = "Bắt đầu dự án của bạn.", alt = true }: { title?: string; alt?: boolean }) {
  const { contact } = siteInfo;
  return (
    <section className={`section cta-band${alt ? " theme-alt" : ""}`}>
      <div className="container reveal">
        <h2 className="headline">{title}</h2>
        <p className="cta-phone">
          <a href={`tel:${contact.hotlineTel}`}>{contact.hotline}</a>
        </p>
        <div className="cta-contacts small muted">
          <a href={`mailto:${contact.email}`}>
            <Mail size={16} aria-hidden="true" /> {contact.email}
          </a>
          <a href={contact.zalo} target="_blank" rel="noopener noreferrer">
            <Phone size={16} aria-hidden="true" /> Zalo
          </a>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <MapPin size={16} aria-hidden="true" /> Hà Nội · Hưng Yên · Toàn quốc
          </span>
        </div>
      </div>
    </section>
  );
}

/** Section heading whose title is the link to the full list (replaces separate "see more" links). */
export function LinkedHeading({ href, title, eyebrow }: { href: string; title: string; eyebrow?: string }) {
  return (
    <div className="section-head reveal">
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2 className="headline">
        <Link href={href} className="title-link">
          {title}
          <ChevronRight size={36} strokeWidth={2} aria-hidden="true" />
        </Link>
      </h2>
    </div>
  );
}
