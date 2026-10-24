"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Phone, X } from "lucide-react";

export const navItems = [
  { href: "/giai-phap", label: "Giải pháp" },
  { href: "/dich-vu", label: "Dịch vụ" },
  { href: "/san-pham", label: "Sản phẩm" },
  { href: "/du-an", label: "Dự án" },
  { href: "/doi-tac", label: "Đối tác" },
  { href: "/tin-tuc", label: "Tin tức" },
  { href: "/gioi-thieu", label: "Về SKV" },
];

export function Nav({ hotline, hotlineTel }: { hotline: string; hotlineTel: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [menuPath, setMenuPath] = useState(pathname);

  // Close the menu whenever the route changes.
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  // Home: the bar floats transparent over the LED picture, then turns solid once the visitor scrolls past it.
  const overlay = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    if (!overlay) return;
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.55);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [overlay]);

  const isCurrent = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      <header className={`globalnav${overlay ? " is-overlay" : ""}`} data-solid={overlay && (scrolled || open) ? "true" : undefined}>
        <nav className="container globalnav-inner" aria-label="Điều hướng chính">
          <Link href="/" className="brand" aria-label="SKV Lighting – Trang chủ">
            <Image src="/images/brand/skv-logo.png" alt="" width={30} height={30} priority />
            <span>SKV Lighting</span>
          </Link>
  
          <ul className="nav-links">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} aria-current={isCurrent(item.href) ? "page" : undefined}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
  
          <Link href="/lien-he" className="btn btn-primary btn-sm nav-cta">
            Liên hệ tư vấn
          </Link>
  
          <button
            type="button"
            className="nav-toggle"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Đóng menu" : "Mở menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>
      </header>

      {/* Outside <header>: its backdrop-filter would otherwise become the containing block of this fixed panel. */}
      {open && (
        <div id="mobile-menu" className="mobile-menu">
          <ul>
            {navItems.map((item, i) => (
              <li key={item.href} style={{ "--i": i } as React.CSSProperties}>
                <Link href={item.href} aria-current={isCurrent(item.href) ? "page" : undefined}>
                  {item.label}
                </Link>
              </li>
            ))}
            <li style={{ "--i": navItems.length } as React.CSSProperties}>
              <Link href="/lien-he">Liên hệ</Link>
            </li>
          </ul>
          <div className="mobile-menu-foot">
            <a href={`tel:${hotlineTel}`}>
              <Phone size={16} aria-hidden="true" /> Hotline {hotline}
            </a>
            <Link href="/lien-he" className="btn btn-primary">
              Nhận tư vấn miễn phí
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
