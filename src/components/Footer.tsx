import Link from "next/link";
import { fmt } from "@/i18n/config";
import { getI18n } from "@/i18n/server";

// Evaluated once per build, outside render, so pages stay fully static.
const year = new Date().getFullYear();

export async function Footer() {
  const { ui, c, href } = await getI18n();
  const { siteInfo, solutions, services, productGroups } = c;
  const { contact, offices, social } = siteInfo;
  const f = ui.footer;

  const columns = [
    { title: f.solutions, links: solutions.map((s) => ({ href: href(`/giai-phap/${s.slug}`), label: s.name })) },
    { title: f.services, links: services.map((s) => ({ href: href(`/dich-vu/${s.slug}`), label: s.name })) },
    { title: f.products, links: productGroups.map((g) => ({ href: href(`/san-pham#${g.id}`), label: g.name })) },
    {
      title: f.about,
      links: [
        { href: href("/gioi-thieu"), label: f.aboutUs },
        { href: href("/du-an"), label: f.projects },
        { href: href("/doi-tac"), label: f.partners },
        { href: href("/tin-tuc"), label: f.news },
      ],
    },
    {
      title: f.contact,
      links: [
        { href: `tel:${contact.hotlineTel}`, label: fmt(f.hotline, { phone: contact.hotline }) },
        { href: `tel:${contact.phoneTel}`, label: fmt(f.phone, { phone: contact.phone }) },
        { href: `mailto:${contact.email}`, label: contact.email },
        { href: href("/lien-he"), label: f.request },
      ],
    },
  ];

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-cols">
          {columns.map((col) => (
            <div className="footer-col" key={col.title}>
              <h3>{col.title}</h3>
              <ul>
                {col.links.map((l) => (
                  <li key={l.href}>
                    {l.href.startsWith("/") ? <Link href={l.href}>{l.label}</Link> : <a href={l.href}>{l.label}</a>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer-note" style={{ borderBottom: 0 }}>
          <strong style={{ color: "var(--text)" }}>{siteInfo.legalName}</strong>
          <br />
          {offices.map((o) => (
            <span key={o.label}>
              {o.label}: {o.address}
              <br />
            </span>
          ))}
          {f.taxCode}: {siteInfo.taxCode} – {siteInfo.taxIssued}
        </div>

        <div className="footer-legal">
          <span>{fmt(f.rights, { year, name: siteInfo.name })}</span>
          <ul aria-label={f.social}>
            {social.map((s) => (
              <li key={s.name}>
                <a href={s.url} target="_blank" rel="noopener noreferrer">
                  {s.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
