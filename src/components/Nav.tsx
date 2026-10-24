"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Globe, Menu, Phone, X } from "lucide-react";
import { htmlLang, localeNames, localeShort, localize, locales, type Locale } from "@/i18n/config";
import { useLocalePath } from "@/i18n/client";
import { ui as dictionaries } from "@/i18n/ui";
import { ThemeToggle } from "./ThemeToggle";

const navPaths = [
  { path: "/giai-phap", key: "solutions" },
  { path: "/dich-vu", key: "services" },
  { path: "/san-pham", key: "products" },
  { path: "/du-an", key: "projects" },
  { path: "/doi-tac", key: "partners" },
  { path: "/tin-tuc", key: "news" },
  { path: "/gioi-thieu", key: "about" },
] as const;

/** Globe button with the three languages; each link opens the same page in that language. */
function LanguageSwitch({ locale, path }: { locale: Locale; path: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const ui = dictionaries[locale];

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
    <div ref={ref} className="lang-switch">
      <button
        type="button"
        className="lang-toggle"
        aria-expanded={open}
        aria-controls="lang-menu"
        aria-label={`${ui.language.choose} (${localeNames[locale]})`}
        onClick={() => setOpen((v) => !v)}
      >
        <Globe size={17} aria-hidden="true" />
        <span>{localeShort[locale]}</span>
      </button>
      {open && (
        <ul id="lang-menu" className="lang-menu">
          {locales.map((l) => (
            <li key={l}>
              {/* a full page load: the other language has its own <html lang> and root layout */}
              <a href={localize(l, path)} hrefLang={htmlLang[l]} lang={htmlLang[l]} aria-current={l === locale ? "true" : undefined}>
                {localeNames[l]}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function Nav({ hotline, hotlineTel }: { hotline: string; hotlineTel: string }) {
  const { locale, path } = useLocalePath();
  const ui = dictionaries[locale];
  const href = (p: string) => localize(locale, p);
  const [open, setOpen] = useState(false);
  const [menuPath, setMenuPath] = useState(path);

  // Close the menu whenever the route changes.
  if (menuPath !== path) {
    setMenuPath(path);
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
  const overlay = path === "/";
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    if (!overlay) return;
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.55);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [overlay]);

  const isCurrent = (p: string) => path === p || path.startsWith(p + "/");

  return (
    <>
      <header className={`globalnav${overlay ? " is-overlay" : ""}`} data-solid={overlay && (scrolled || open) ? "true" : undefined}>
        <nav className="container globalnav-inner" aria-label={ui.nav.main}>
          <Link href={href("/")} className="brand" aria-label={ui.nav.home}>
            <Image src="/images/brand/skv-logo.png" alt="" width={30} height={30} priority />
            <span>SKV Lighting</span>
          </Link>

          <ul className="nav-links">
            {navPaths.map((item) => (
              <li key={item.path}>
                <Link href={href(item.path)} aria-current={isCurrent(item.path) ? "page" : undefined}>
                  {ui.nav.items[item.key]}
                </Link>
              </li>
            ))}
          </ul>

          <div className="nav-actions">
            <LanguageSwitch locale={locale} path={path} />
            <ThemeToggle />
            <Link href={href("/lien-he")} className="btn btn-primary btn-sm nav-cta">
              {ui.nav.cta}
            </Link>
          </div>

          <button
            type="button"
            className="nav-toggle"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? ui.nav.closeMenu : ui.nav.openMenu}
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
            {navPaths.map((item, i) => (
              <li key={item.path} style={{ "--i": i } as React.CSSProperties}>
                <Link href={href(item.path)} aria-current={isCurrent(item.path) ? "page" : undefined}>
                  {ui.nav.items[item.key]}
                </Link>
              </li>
            ))}
            <li style={{ "--i": navPaths.length } as React.CSSProperties}>
              <Link href={href("/lien-he")}>{ui.nav.contact}</Link>
            </li>
          </ul>
          <div className="mobile-menu-foot">
            <a href={`tel:${hotlineTel}`}>
              <Phone size={16} aria-hidden="true" /> {ui.nav.hotline} {hotline}
            </a>
            <Link href={href("/lien-he")} className="btn btn-primary">
              {ui.nav.freeConsult}
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
