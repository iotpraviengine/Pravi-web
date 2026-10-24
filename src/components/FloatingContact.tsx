"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, Phone, X } from "lucide-react";
import { fmt } from "@/i18n/config";
import { useUi } from "@/i18n/client";

type Contact = { zalo: string; messenger: string; hotline: string; hotlineTel: string };

/**
 * Quick-contact buttons folded into one toggle. With a mouse, hovering opens Zalo / Messenger / Call
 * and leaving closes them (after a short grace period); on touch, a tap toggles; keyboard focus opens.
 * Contact details come in as props: this is a client component and must not import the fs-based content loader.
 */
const CLOSE_DELAY_MS = 220;
export function FloatingContact({ contact }: { contact: Contact }) {
  const ui = useUi().quickContact;
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const openNow = () => {
    clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const closeSoon = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), CLOSE_DELAY_MS);
  };
  useEffect(() => () => clearTimeout(closeTimer.current), []);

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
    <div
      ref={ref}
      className="float-contact"
      data-open={open}
      onPointerEnter={(e) => e.pointerType === "mouse" && openNow()}
      onPointerLeave={(e) => e.pointerType === "mouse" && closeSoon()}
      onFocus={openNow}
      onBlur={(e) => !ref.current?.contains(e.relatedTarget as Node | null) && closeSoon()}
    >
      <div id="fc-items" className="fc-items">
        <a className="fc-zalo" href={contact.zalo} target="_blank" rel="noopener noreferrer" aria-label={ui.zalo}>
          Zalo
          <span className="fc-label" aria-hidden="true">
            {ui.zalo}
          </span>
        </a>
        <a className="fc-messenger" href={contact.messenger} target="_blank" rel="noopener noreferrer" aria-label={ui.messenger}>
          <MessageCircle size={22} aria-hidden="true" />
          <span className="fc-label" aria-hidden="true">
            Messenger
          </span>
        </a>
        <a className="fc-phone" href={`tel:${contact.hotlineTel}`} aria-label={fmt(ui.call, { phone: contact.hotline })}>
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
        aria-label={open ? ui.close : ui.open}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X size={22} aria-hidden="true" /> : <Phone size={22} aria-hidden="true" />}
      </button>
    </div>
  );
}
