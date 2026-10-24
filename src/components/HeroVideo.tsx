"use client";

import { useEffect, useRef } from "react";

type Props = {
  mp4: string;
  webm?: string;
  mobileMp4?: string;
  poster: string;
};

/** Muted, looping background video. Pauses (poster stays) for visitors who prefer reduced motion. */
export function HeroVideo({ mp4, webm, mobileMp4, poster }: Props) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      if (mq.matches) video.pause();
      else void video.play().catch(() => {});
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return (
    <video ref={ref} className="hero-video-media" autoPlay muted loop playsInline preload="metadata" poster={poster} aria-hidden="true">
      {mobileMp4 && <source src={mobileMp4} type="video/mp4" media="(max-width: 733px)" />}
      {webm && <source src={webm} type="video/webm" />}
      <source src={mp4} type="video/mp4" />
    </video>
  );
}
