"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ChevronRight, Pause, Play } from "lucide-react";
import { fmt, localize } from "@/i18n/config";
import { useLocalePath, useUi } from "@/i18n/client";

export type RailItem = { slug: string; name: string; line: string; image: string; focus?: string };

const SLIDE_MS = 5000;

/**
 * One solution per view (neighbours peeking in at the sides) that advances on its own (Apple-style gallery):
 * the active dot stretches into a progress bar, the other dots jump to their card, and a
 * pause/play button stops the rotation. It also holds still while off screen, while keyboard
 * focus is inside, and starts paused for visitors who prefer reduced motion. Swiping still works.
 *
 * The row is a loop: a copy of the last slide sits before the first and a copy of the first after
 * the last, so there is always a neighbour on both sides. When the row comes to rest on a copy it
 * jumps, without animation, to the real slide it shows (they look identical, so nothing moves).
 */
export function SolutionRail({ items, title, href }: { items: RailItem[]; title: string; href: string }) {
  const ui = useUi().rail;
  const { locale } = useLocalePath();
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const fill = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const [focusInside, setFocusInside] = useState(false);
  // the copies are added after hydration (the server renders the plain row)
  const [looped, setLooped] = useState(false);
  const elapsed = useRef(0);
  const n = items.length;

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPaused(true);
    setLooped(n > 1);
  }, [n]);

  // only rotate while the row is on screen
  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /** Scroll position that brings the slide at track position `pos` into place. */
  const leftOf = (el: HTMLElement, pos: number) => {
    const card = el.children[pos] as HTMLElement | undefined;
    const inset = parseFloat(getComputedStyle(el).paddingLeft) || 0;
    return card ? card.offsetLeft - inset : 0;
  };
  /** Track position of real slide i (shifted by one once the leading copy is in). */
  const posOf = useCallback((i: number) => (looped ? i + 1 : i), [looped]);

  // once the copies are in, start on the real first slide, before the browser paints
  useLayoutEffect(() => {
    const el = track.current;
    if (looped && el) el.scrollLeft = leftOf(el, 1);
  }, [looped]);

  const scrollToPos = useCallback((pos: number, slide: number) => {
    const el = track.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ left: leftOf(el, pos), behavior: reduce ? "auto" : "smooth" });
    elapsed.current = 0;
    setActive(slide);
  }, []);

  const goTo = useCallback((i: number) => scrollToPos(posOf(i), i), [scrollToPos, posOf]);
  // forward always moves right: from the last slide that is onto the copy of the first
  const next = useCallback(() => scrollToPos(posOf(active) + 1, (active + 1) % n), [scrollToPos, posOf, active, n]);

  // when the row comes to rest: hop off a copy onto its real slide, and keep the dots in step with swipes
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    let t: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      clearTimeout(t);
      t = setTimeout(() => {
        let pos = 0;
        let dist = Infinity;
        for (let p = 0; p < el.children.length; p++) {
          const d = Math.abs(leftOf(el, p) - el.scrollLeft);
          if (d < dist) [dist, pos] = [d, p];
        }
        if (looped && pos === 0) el.scrollLeft = leftOf(el, (pos = n));
        else if (looped && pos === n + 1) el.scrollLeft = leftOf(el, (pos = 1));
        const slide = looped ? pos - 1 : pos;
        setActive((a) => {
          if (a !== slide) elapsed.current = 0;
          return slide;
        });
      }, 120);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      clearTimeout(t);
    };
  }, [looped, n]);

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
        next();
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running, next]);

  const slide = (s: RailItem, i: number, copy?: "before" | "after") => (
    <li
      key={copy ? `${copy}-${s.slug}` : s.slug}
      className={copy ? "rail-item" : "rail-item reveal"}
      data-active={i === active ? "true" : undefined}
      aria-roledescription={copy ? undefined : "slide"}
      aria-label={copy ? undefined : `${i + 1} / ${n}: ${s.name}`}
      aria-hidden={copy ? true : undefined}
      inert={copy ? true : undefined}
    >
      {/* every slide shares one frame; the picture fills it, cropped around its focus, with the caption on a scrim */}
      <Link href={localize(locale, `/giai-phap/${s.slug}`)} className="rail-card">
        <div className="rail-media">
          <Image src={s.image} alt="" fill sizes="(min-width: 734px) 1100px, 92vw" style={{ objectPosition: s.focus }} />
        </div>
        <div className="rail-caption">
          <h3 className="rail-name">{s.name}</h3>
          <p className="rail-line">{s.line}</p>
        </div>
      </Link>
    </li>
  );

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
        {looped && slide(items[n - 1], n - 1, "before")}
        {items.map((s, i) => slide(s, i))}
        {looped && slide(items[0], 0, "after")}
      </ul>

      <div className="rail-nav" role="group" aria-label={ui.controls}>
        <div className="rail-dots">
          {items.map((s, i) => (
            <button
              key={s.slug}
              type="button"
              className="rail-dot"
              aria-current={i === active ? "true" : undefined}
              aria-label={fmt(ui.show, { name: s.name })}
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
          aria-label={paused ? ui.play : ui.pause}
          onClick={() => setPaused((p) => !p)}
        >
          {paused ? <Play size={20} fill="currentColor" aria-hidden="true" /> : <Pause size={20} fill="currentColor" aria-hidden="true" />}
        </button>
      </div>
    </section>
  );
}
