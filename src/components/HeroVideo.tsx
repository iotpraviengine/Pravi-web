"use client";

import { useEffect, useRef } from "react";

type Props = {
  mp4: string;
  webm?: string;
  mobileMp4?: string;
  poster: string;
};

/**
 * Muted, looping background video. Plays only while it is on screen (decoding a video nobody sees
 * costs scroll smoothness and battery) and stays on its poster for visitors who prefer reduced motion.
 */
export function HeroVideo({ mp4, webm, mobileMp4, poster }: Props) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = true;
    const apply = () => {
      if (mq.matches || !visible) video.pause();
      else void video.play().catch(() => {});
    };
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        apply();
      },
      { threshold: 0.05 },
    );
    io.observe(video);
    mq.addEventListener("change", apply);
    apply();
    return () => {
      io.disconnect();
      mq.removeEventListener("change", apply);
    };
  }, []);

  return (
    <video ref={ref} className="hero-video-media" autoPlay muted loop playsInline preload="auto" poster={poster} aria-hidden="true">
      {mobileMp4 && <source src={mobileMp4} type="video/mp4" media="(max-width: 733px)" />}
      {webm && <source src={webm} type="video/webm" />}
      <source src={mp4} type="video/mp4" />
    </video>
  );
}
