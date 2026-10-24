"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, Phone, X } from "lucide-react";

type Contact = { zalo: string; messenger: string; hotline: string; hotlineTel: string };

/**
 * Quick-contact buttons. On desktop the three buttons are always shown; below 1024px they fold
 * into one toggle so they don't sit on top of headlines and pictures.
 * Contact details come in as props: this is a client component and must not import the fs-based content loader.
 */
export function FloatingContact({ contact }: { contact: Contact }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, [open]);

  return (
    <div ref={ref} className="float-contact" data-open={open}>
      <div id="fc-items" className="fc-items">
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
      <button
        type="button"
        className="fc-toggle"
        aria-expanded={open}
        aria-controls="fc-items"
        aria-label={open ? "Đóng liên hệ nhanh" : "Liên hệ nhanh: gọi, Zalo, Messenger"}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X size={22} aria-hidden="true" /> : <Phone size={22} aria-hidden="true" />}
      </button>
    </div>
  );
}
