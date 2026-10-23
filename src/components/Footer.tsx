import Link from "next/link";
import { productGroups, services, siteInfo, solutions } from "@/lib/content";

// Evaluated once per build, outside render, so pages stay fully static.
const year = new Date().getFullYear();

export function Footer() {
  const { contact, offices, social } = siteInfo;

  const columns = [
    { title: "Giải pháp", links: solutions.map((s) => ({ href: `/giai-phap/${s.slug}`, label: s.name })) },
    { title: "Dịch vụ", links: services.map((s) => ({ href: `/dich-vu/${s.slug}`, label: s.name })) },
    { title: "Sản phẩm", links: productGroups.map((g) => ({ href: `/san-pham#${g.id}`, label: g.name })) },
    {
      title: "Về SKV Lighting",
      links: [
        { href: "/gioi-thieu", label: "Giới thiệu" },
        { href: "/du-an", label: "Dự án tiêu biểu" },
        { href: "/doi-tac", label: "Đối tác & thương hiệu" },
        { href: "/tin-tuc", label: "Tin tức" },
      ],
    },
    {
      title: "Liên hệ",
      links: [
        { href: `tel:${contact.hotlineTel}`, label: `Hotline ${contact.hotline}` },
        { href: `tel:${contact.phoneTel}`, label: `Điện thoại ${contact.phone}` },
        { href: `mailto:${contact.email}`, label: contact.email },
        { href: "/lien-he", label: "Gửi yêu cầu tư vấn" },
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
          <strong style={{ color: "#f5f5f7" }}>{siteInfo.legalName}</strong>
          <br />
          {offices.map((o) => (
            <span key={o.label}>
              {o.label}: {o.address}
              <br />
            </span>
          ))}
          Mã số thuế: {siteInfo.taxCode} – {siteInfo.taxIssued}
        </div>

        <div className="footer-legal">
          <span>
            Bản quyền © {year} {siteInfo.name}. Bảo lưu mọi quyền.
          </span>
          <ul aria-label="Mạng xã hội">
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
