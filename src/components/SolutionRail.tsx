"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type RailItem = { slug: string; name: string; line: string; image: string };

/**
 * Horizontal, snap-scrolling row of solutions. Swipe on touch, arrow buttons on desktop;
 * without script it is still a plain scrollable row of links.
 */
export function SolutionRail({ items, title, href }: { items: RailItem[]; title: string; href: string }) {
  const track = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const update = () => {
      setAtStart(el.scrollLeft <= 4);
      setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const step = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector("li");
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    const by = card ? (card.getBoundingClientRect().width + gap) * (el.clientWidth > 900 ? 2 : 1) : el.clientWidth * 0.8;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * by, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <section className="rail section" aria-labelledby="solutions-title">
      <div className="container rail-head reveal">
        <h2 id="solutions-title" className="headline">
          <Link href={href} className="title-link">
            {title}
            <ChevronRight size={36} strokeWidth={2} aria-hidden="true" />
          </Link>
        </h2>
        <div className="rail-controls">
          <button type="button" className="rail-btn" onClick={() => step(-1)} disabled={atStart} aria-label="Giải pháp trước">
            <ChevronLeft size={22} aria-hidden="true" />
          </button>
          <button type="button" className="rail-btn" onClick={() => step(1)} disabled={atEnd} aria-label="Giải pháp tiếp theo">
            <ChevronRight size={22} aria-hidden="true" />
          </button>
        </div>
      </div>

      <ul ref={track} className="rail-track" aria-label={title}>
        {items.map((s) => (
          <li key={s.slug} className="rail-item reveal">
            <Link href={`/giai-phap/${s.slug}`} className="rail-card">
              <div className="rail-media">
                <Image src={s.image} alt="" fill sizes="(min-width: 1000px) 400px, 78vw" />
              </div>
              <h3 className="rail-name">{s.name}</h3>
              <p className="rail-line">{s.line}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
