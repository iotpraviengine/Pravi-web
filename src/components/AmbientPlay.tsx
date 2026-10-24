"use client";

import { useEffect } from "react";

/**
 * Marks `[data-ambient]` sections with data-playing="true" while they are on screen, so their
 * looping light effects only run when someone can see them (and stop costing CPU otherwise).
 */
export function AmbientPlay() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-ambient]");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => (el.dataset.playing = "true"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => ((e.target as HTMLElement).dataset.playing = String(e.isIntersecting))),
      { threshold: 0.15 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
