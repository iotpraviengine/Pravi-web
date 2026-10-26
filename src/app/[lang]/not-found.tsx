import Link from "next/link";
import { MoreLink } from "@/components/ui";
import { getI18n } from "@/i18n/server";

export default async function NotFound() {
  const { ui, t, href } = await getI18n();
  const l = t.notFound;
  return (
    <section className="hero section" style={{ minHeight: "60vh" }}>
      <div className="container">
        <h1 className="display">{l.headline}</h1>
        <p className="subhead">{l.subhead}</p>
        <div className="actions">
          <Link href={href("/")} className="btn btn-primary">
            {l.home}
          </Link>
          <Link href={href("/lien-he")} className="btn btn-secondary">
            {l.contact}
          </Link>
        </div>
        <div className="tile-links" style={{ marginTop: 40 }}>
          <MoreLink href={href("/giai-phap")}>{ui.nav.items.solutions}</MoreLink>
          <MoreLink href={href("/san-pham")}>{ui.nav.items.products}</MoreLink>
          <MoreLink href={href("/du-an")}>{ui.nav.items.projects}</MoreLink>
          <MoreLink href={href("/tin-tuc")}>{ui.nav.items.news}</MoreLink>
        </div>
      </div>
    </section>
  );
}
