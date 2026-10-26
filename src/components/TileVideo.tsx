"use client";

import { useEffect, useRef } from "react";

/**
 * A product tile's clip, played once per page load: it starts the first time the tile is properly in
 * view (so nobody misses it while it plays off screen), and when it ends it eases back to its first
 * frame, which is the same shot as the poster. With reduced motion it stays on the poster.
 */
export function TileVideo({ mp4, webm, poster, label }: { mp4: string; webm?: string; poster?: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    video.muted = true; // React does not render the muted attribute; browsers only autoplay muted video

    let played = false;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting || played) return;
        played = true;
        io.disconnect();
        video.play().catch(() => {}); // a refused autoplay simply leaves the poster
      },
      { threshold: 0.6 },
    );
    io.observe(video);

    // the clip ends on a fade to black: fade the element out, rewind to the product shot, fade back in
    const ended = () => {
      video.dataset.resting = "true";
      window.setTimeout(() => {
        video.currentTime = 0;
        delete video.dataset.resting;
      }, 450);
    };
    video.addEventListener("ended", ended);
    return () => {
      io.disconnect();
      video.removeEventListener("ended", ended);
    };
  }, []);

  return (
    <video ref={ref} className="tile-video" poster={poster} muted playsInline preload="auto" aria-label={label}>
      {webm && <source src={webm} type="video/webm" />}
      <source src={mp4} type="video/mp4" />
    </video>
  );
}
