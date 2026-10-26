import type { Metadata } from "next";
import { Suspense } from "react";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { fmt } from "@/i18n/config";
import { alternates, getI18n } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, t, c } = await getI18n();
  const { contact } = c.siteInfo;
  return {
    title: t.contact.title,
    description: fmt(t.contact.description, { hotline: contact.hotline, email: contact.email }),
    alternates: alternates(locale, "/lien-he"),
  };
}

export default async function ContactPage() {
  const { ui, t, c } = await getI18n();
  const l = t.contact;
  const { contact, offices } = c.siteInfo;
  const topics = [
    ...c.solutions.map((s) => ({ value: s.slug, label: fmt(ui.form.topicSolution, { name: s.name }) })),
    ...c.services.map((s) => ({ value: s.slug, label: fmt(ui.form.topicService, { name: s.name }) })),
  ];

  return (
    <>
      <section className="hero" style={{ paddingBottom: "clamp(40px, 6vw, 64px)" }}>
        <div className="container">
          <h1 className="display reveal">{l.headline}</h1>
          <p className="subhead reveal" data-delay="1">
            {l.subhead}
          </p>
        </div>
      </section>

      <section className="section theme-alt">
        <div className="container grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))", gap: "clamp(32px, 5vw, 64px)", alignItems: "start" }}>
          <div className="card" style={{ gridColumn: "span 1", padding: "clamp(24px, 4vw, 48px)" }}>
            <h2 className="title" style={{ marginBottom: 24 }}>
              {l.formTitle}
            </h2>
            <Suspense fallback={<p className="muted">{ui.form.loading}</p>}>
              <ContactForm topics={topics} hotline={contact.hotline} />
            </Suspense>
          </div>

          <div>
            <h2 className="title" style={{ marginBottom: 24 }}>
              {l.infoTitle}
            </h2>
            <ul className="contact-list">
              <li>
                <Phone size={22} aria-hidden="true" />
                <div>
                  <p className="label">Hotline / Zalo</p>
                  <p>
                    <a href={`tel:${contact.hotlineTel}`} style={{ fontSize: "var(--step-lead)", fontWeight: 600 }}>
                      {contact.hotline}
                    </a>
                    {" · "}
                    <a href={`tel:${contact.hotline2Tel}`}>{contact.hotline2}</a>
                  </p>
                  <p className="small muted">
                    {l.landline} <a href={`tel:${contact.phoneTel}`}>{contact.phone}</a>
                  </p>
                </div>
              </li>
              <li>
                <Mail size={22} aria-hidden="true" />
                <div>
                  <p className="label">Email</p>
                  <a href={`mailto:${contact.email}`}>{contact.email}</a>
                </div>
              </li>
              <li>
                <MessageCircle size={22} aria-hidden="true" />
                <div>
                  <p className="label">{l.chat}</p>
                  <a href={contact.zalo} target="_blank" rel="noopener noreferrer">
                    Zalo
                  </a>
                  {" · "}
                  <a href={contact.messenger} target="_blank" rel="noopener noreferrer">
                    Messenger
                  </a>
                </div>
              </li>
              <li>
                <Clock size={22} aria-hidden="true" />
                <div>
                  <p className="label">{l.support}</p>
                  <p>{contact.hours}</p>
                </div>
              </li>
              {offices.map((o) => (
                <li key={o.label}>
                  <MapPin size={22} aria-hidden="true" />
                  <div>
                    <p className="label">{o.label}</p>
                    <p>{o.address}</p>
                    <a href={o.map} target="_blank" rel="noopener noreferrer" className="small">
                      {ui.common.viewMap}
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
