import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Mail, MapPin, Phone, Plus } from "lucide-react";
import { emphasis, formatDate, type Post, type Product, type Project } from "@/lib/content";
import { fmt } from "@/i18n/config";
import { getI18n } from "@/i18n/server";
import { LedNumber } from "./LedNumber";

// Server components: the ones that need words or links read the current language themselves.

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
  title,
  subhead,
  center,
  as: Tag = "h2",
}: {
  title: string;
  subhead?: string;
  center?: boolean;
  as?: "h1" | "h2";
}) {
  return (
    <div className={`section-head reveal${center ? " center" : ""}`}>
      <Tag className="headline">{title}</Tag>
      {subhead && <p className="subhead">{subhead}</p>}
    </div>
  );
}

/** Hrefs are language-free paths; they are localised here. */
export async function Breadcrumb({ items }: { items: { href?: string; label: string }[] }) {
  const { ui, href } = await getI18n();
  return (
    <nav aria-label={ui.common.breadcrumb}>
      <ol className="breadcrumb">
        {items.map((it) => (
          <li key={it.label}>{it.href ? <Link href={href(it.href)}>{it.label}</Link> : <span aria-current="page">{it.label}</span>}</li>
        ))}
      </ol>
    </nav>
  );
}

export async function LocalNav({ title, links, dark }: { title: string; links: { href: string; label: string }[]; dark?: boolean }) {
  const { ui } = await getI18n();
  return (
    <div className={`localnav${dark ? " theme-dark" : ""}`}>
      <div className="container localnav-inner">
        <span className="localnav-title">{title}</span>
        <nav className="localnav-menu" aria-label={fmt(ui.common.sectionsOf, { title })}>
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

export async function ProjectCard({ project, priority }: { project: Project; priority?: boolean }) {
  const { c, href } = await getI18n();
  const solution = c.getSolution(project.solution);
  return (
    <Link href={href(`/du-an/${project.slug}`)} className="media-card">
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

export async function NewsCard({ post }: { post: Post }) {
  const { locale, href } = await getI18n();
  return (
    <Link href={href(`/tin-tuc/${post.slug}`)} className="media-card">
      <div className="media" style={{ aspectRatio: "16 / 10" }}>
        <Image src={post.cover} alt="" fill sizes="(min-width: 1000px) 380px, (min-width: 640px) 50vw, 100vw" />
      </div>
      <p className="meta" style={{ marginTop: 16 }}>
        <time dateTime={post.date}>{formatDate(post.date, locale)}</time>
      </p>
      <h3 style={{ marginTop: 4 }}>{post.title}</h3>
    </Link>
  );
}

export async function ProductCard({ product }: { product: Product }) {
  const { ui, href } = await getI18n();
  return (
    <Link
      href={href(`/lien-he?san-pham=${encodeURIComponent(product.name)}`)}
      className="product-card"
      aria-label={fmt(ui.common.productQuote, { name: product.name })}
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

/** Closing call to action: the hotline as an LED wall. Always dark, like a panel that is switched off. */
export async function CtaBand({ title }: { title?: string }) {
  const { ui, t, c, href } = await getI18n();
  const { contact } = c.siteInfo;
  return (
    <section className="cta-band theme-dark">
      <div className="container cta-head reveal">
        <h2 className="headline">{title ?? t.cta.default}</h2>
        <Link href={href("/lien-he")} className="btn btn-primary">
          {ui.nav.cta}
        </Link>
      </div>
      <LedNumber text={contact.hotline} href={`tel:${contact.hotlineTel}`} label={fmt(ui.common.call, { phone: contact.hotline })} />
      <div className="container cta-contacts">
        <a href={`mailto:${contact.email}`}>
          <Mail size={18} aria-hidden="true" /> {contact.email}
        </a>
        <a href={contact.zalo} target="_blank" rel="noopener noreferrer">
          <Phone size={18} aria-hidden="true" /> Zalo
        </a>
        <span>
          <MapPin size={18} aria-hidden="true" /> {ui.common.regions}
        </span>
      </div>
    </section>
  );
}

/** Section heading whose title is the link to the full list (replaces separate "see more" links). Href is a language-free path. */
export async function LinkedHeading({ href: path, title }: { href: string; title: string }) {
  const { href } = await getI18n();
  return (
    <div className="section-head reveal">
      <h2 className="headline">
        <Link href={href(path)} className="title-link">
          {title}
          <ChevronRight size={36} strokeWidth={2} aria-hidden="true" />
        </Link>
      </h2>
    </div>
  );
}
