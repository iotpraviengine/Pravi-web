"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const KEYFRAMES: Keyframe[] = [
  { opacity: 0, transform: "translateY(40px)", filter: "blur(8px)" },
  { opacity: 1, transform: "translateY(0)", filter: "blur(0px)" },
];
const TIMING: KeyframeAnimationOptions = { duration: 750, easing: "cubic-bezier(0.16, 1, 0.3, 1)", fill: "both" };
const STAGGER_MS = 70;

/**
 * Reveals `.reveal` elements once, as they scroll into view: rise + fade + un-blur over a fixed
 * duration (not tied to scroll speed), staggered when several enter together.
 *
 * Uses the Web Animations API instead of toggling classes, so it never changes React-managed
 * attributes (no hydration mismatch). Elements already on screen are left alone, content stays
 * visible if script fails, and nothing moves for visitors who prefer reduced motion.
 */
export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;

    const pending = new Map<Element, Animation>();
    const io = new IntersectionObserver(
      (entries) => {
        entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top || a.boundingClientRect.left - b.boundingClientRect.left)
          .forEach((entry, i) => {
            const anim = pending.get(entry.target);
            if (!anim) return;
            anim.effect?.updateTiming({ delay: i * STAGGER_MS });
            anim.play();
            // hand the element back to its own CSS (hover/press transforms) once it has arrived
            anim.finished.then(() => anim.cancel()).catch(() => {});
            pending.delete(entry.target);
            io.unobserve(entry.target);
          });
      },
      // threshold 0: a card only peeking in from the side of a row must still be revealed
      { rootMargin: "0px 0px -8% 0px", threshold: 0 },
    );

    const fold = window.innerHeight * 0.92;
    document.querySelectorAll(".reveal").forEach((el) => {
      if (el.getBoundingClientRect().top < fold) return; // already seen: never hide what is on screen
      const anim = el.animate(KEYFRAMES, TIMING);
      anim.pause(); // parked on the first frame (hidden) until it scrolls in
      pending.set(el, anim);
      io.observe(el);
    });

    return () => {
      io.disconnect();
      pending.forEach((anim) => anim.cancel());
    };
  }, [pathname]);

  return null;
}
