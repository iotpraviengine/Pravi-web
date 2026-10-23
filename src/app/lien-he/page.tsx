import type { Metadata } from "next";
import { Suspense } from "react";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { services, siteInfo, solutions } from "@/lib/content";

export const metadata: Metadata = {
  title: "Liên hệ tư vấn",
  description: `Liên hệ SKV Lighting để được khảo sát, tư vấn và báo giá miễn phí. Hotline ${siteInfo.contact.hotline} – ${siteInfo.contact.email}.`,
  alternates: { canonical: "/lien-he" },
};

export default function ContactPage() {
  const { contact, offices } = siteInfo;
  const topics = [
    ...solutions.map((s) => ({ value: s.slug, label: `Giải pháp: ${s.name}` })),
    ...services.map((s) => ({ value: s.slug, label: `Dịch vụ: ${s.name}` })),
  ];

  return (
    <>
      <section className="hero" style={{ paddingBottom: "clamp(40px, 6vw, 64px)" }}>
        <div className="container">
          <span className="eyebrow reveal">Liên hệ</span>
          <h1 className="display reveal">Hãy cùng bắt đầu.</h1>
          <p className="subhead reveal" data-delay="1">
            Gửi nhu cầu của bạn – kỹ thuật viên SKV sẽ liên hệ để khảo sát, tư vấn cấu hình và báo giá miễn phí.
          </p>
        </div>
      </section>

      <section className="section theme-alt">
        <div className="container grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))", gap: "clamp(32px, 5vw, 64px)", alignItems: "start" }}>
          <div className="card" style={{ gridColumn: "span 1", padding: "clamp(24px, 4vw, 48px)" }}>
            <h2 className="title" style={{ marginBottom: 24 }}>
              Yêu cầu tư vấn
            </h2>
            <Suspense fallback={<p className="muted">Đang tải biểu mẫu…</p>}>
              <ContactForm topics={topics} hotline={contact.hotline} />
            </Suspense>
          </div>

          <div>
            <h2 className="title" style={{ marginBottom: 24 }}>
              Thông tin liên hệ
            </h2>
            <ul className="contact-list">
              <li>
                <Phone size={22} aria-hidden="true" />
                <div>
                  <p className="label">Hotline / Zalo</p>
                  <p>
                    <a href={`tel:${contact.hotlineTel}`} style={{ fontSize: 21, fontWeight: 600 }}>
                      {contact.hotline}
                    </a>
                    {" · "}
                    <a href={`tel:${contact.hotline2Tel}`}>{contact.hotline2}</a>
                  </p>
                  <p className="small muted">
                    Điện thoại bàn: <a href={`tel:${contact.phoneTel}`}>{contact.phone}</a>
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
                  <p className="label">Chat trực tuyến</p>
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
                  <p className="label">Hỗ trợ</p>
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
                      Xem bản đồ
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
