"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronRight, Pause, Play } from "lucide-react";

export type RailItem = { slug: string; name: string; line: string; image: string; focus?: string };

const SLIDE_MS = 5000;

/**
 * One solution per view (neighbours peeking in at the sides) that advances on its own (Apple-style gallery):
 * the active dot stretches into a progress bar, the other dots jump to their card, and a
 * pause/play button stops the rotation. It also holds still while off screen, while keyboard
 * focus is inside, and starts paused for visitors who prefer reduced motion. Swiping still works.
 */
export function SolutionRail({ items, title, href }: { items: RailItem[]; title: string; href: string }) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const fill = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const [focusInside, setFocusInside] = useState(false);
  const elapsed = useRef(0);
  const programmatic = useRef(0); // timestamp until which scroll events come from our own scrollTo

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPaused(true);
  }, []);

  // only rotate while the row is on screen
  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const goTo = useCallback((i: number) => {
    const el = track.current;
    const card = el?.children[i] as HTMLElement | undefined;
    if (!el || !card) return;
    const inset = parseFloat(getComputedStyle(el).paddingLeft) || 0;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    programmatic.current = performance.now() + 900;
    el.scrollTo({ left: card.offsetLeft - inset, behavior: reduce ? "auto" : "smooth" });
    elapsed.current = 0;
    setActive(i);
  }, []);

  // keep the dots in step when the visitor swipes or scrolls the row by hand
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    let t: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      if (performance.now() < programmatic.current) return;
      clearTimeout(t);
      t = setTimeout(() => {
        const inset = parseFloat(getComputedStyle(el).paddingLeft) || 0;
        const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
        let best = 0;
        let dist = Infinity;
        [...el.children].forEach((c, i) => {
          const d = Math.abs((c as HTMLElement).offsetLeft - inset - el.scrollLeft);
          if (d < dist) [dist, best] = [d, i];
        });
        elapsed.current = 0;
        setActive(atEnd ? el.children.length - 1 : best);
      }, 120);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      clearTimeout(t);
    };
  }, []);

  // the timer: drives the progress bar directly (no re-render per frame) and advances when full
  const running = !paused && inView && !focusInside;
  useEffect(() => {
    if (fill.current) fill.current.style.transform = `scaleX(${elapsed.current / SLIDE_MS})`;
    if (!running) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      elapsed.current += now - last;
      last = now;
      if (fill.current) fill.current.style.transform = `scaleX(${Math.min(elapsed.current / SLIDE_MS, 1)})`;
      if (elapsed.current >= SLIDE_MS) {
        goTo((active + 1) % items.length);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running, active, items.length, goTo]);

  return (
    <section
      ref={section}
      className="rail section"
      aria-labelledby="solutions-title"
      aria-roledescription="carousel"
      // pause for keyboard focus only (a mouse click on a dot should keep the rotation going)
      onFocus={(e) => (e.target as HTMLElement).matches(":focus-visible") && setFocusInside(true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node | null) && setFocusInside(false)}
    >
      <div className="container rail-head reveal">
        <h2 id="solutions-title" className="headline">
          <Link href={href} className="title-link">
            {title}
            <ChevronRight size={36} strokeWidth={2} aria-hidden="true" />
          </Link>
        </h2>
      </div>

      <ul ref={track} className="rail-track" aria-label={title}>
        {items.map((s, i) => (
          <li
            key={s.slug}
            className="rail-item reveal"
            data-active={i === active ? "true" : undefined}
            aria-roledescription="slide"
            aria-label={`${i + 1} / ${items.length}: ${s.name}`}
          >
            {/* every slide shares one frame; the picture fills it, cropped around its focus, with the caption on a scrim */}
            <Link href={`/giai-phap/${s.slug}`} className="rail-card">
              <div className="rail-media">
                <Image src={s.image} alt="" fill sizes="(min-width: 734px) 1100px, 92vw" style={{ objectPosition: s.focus }} />
              </div>
              <div className="rail-caption">
                <h3 className="rail-name">{s.name}</h3>
                <p className="rail-line">{s.line}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <div className="rail-nav" role="group" aria-label="Điều khiển băng chuyền giải pháp">
        <div className="rail-dots">
          {items.map((s, i) => (
            <button
              key={s.slug}
              type="button"
              className="rail-dot"
              aria-current={i === active ? "true" : undefined}
              aria-label={`Xem ${s.name}`}
              onClick={() => goTo(i)}
            >
              {i === active && <span ref={fill} className="rail-dot-fill" />}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="rail-play"
          aria-pressed={paused}
          aria-label={paused ? "Tiếp tục tự trượt" : "Tạm dừng tự trượt"}
          onClick={() => setPaused((p) => !p)}
        >
          {paused ? <Play size={20} fill="currentColor" aria-hidden="true" /> : <Pause size={20} fill="currentColor" aria-hidden="true" />}
        </button>
      </div>
    </section>
  );
}
