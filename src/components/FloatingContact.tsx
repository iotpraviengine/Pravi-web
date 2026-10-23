import { MessageCircle, Phone } from "lucide-react";
import { siteInfo } from "@/lib/content";

export function FloatingContact() {
  const { contact } = siteInfo;
  return (
    <div className="float-contact" aria-label="Liên hệ nhanh">
      <a className="fc-zalo" href={contact.zalo} target="_blank" rel="noopener noreferrer" aria-label="Chat Zalo">
        Zalo
        <span className="fc-label" aria-hidden="true">
          Chat Zalo
        </span>
      </a>
      <a className="fc-messenger" href={contact.messenger} target="_blank" rel="noopener noreferrer" aria-label="Nhắn tin Messenger">
        <MessageCircle size={22} aria-hidden="true" />
        <span className="fc-label" aria-hidden="true">
          Messenger
        </span>
      </a>
      <a className="fc-phone" href={`tel:${contact.hotlineTel}`} aria-label={`Gọi hotline ${contact.hotline}`}>
        <Phone size={22} aria-hidden="true" />
        <span className="fc-label" aria-hidden="true">
          {contact.hotline}
        </span>
      </a>
    </div>
  );
}
