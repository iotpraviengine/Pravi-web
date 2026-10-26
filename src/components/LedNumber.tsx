"use client";

import { useEffect, useRef } from "react";

/**
 * The hotline drawn as an LED wall: a full-width grid of pixels where the number's pixels light up
 * in a scan from left to right when the section comes into view, and the pointer acts as a lamp
 * passing over the panel. The real number stays in the link (for screen readers and without script).
 */
export function LedNumber({ text, href, label }: { text: string; href: string; label: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boxRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const box = boxRef.current;
    const ctx = canvas?.getContext("2d");
    if (!wrap || !canvas || !box || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let pitch = 10;
    let cols = 0;
    let rows = 0;
    let mask = new Uint8Array(0);
    let scan = reduce ? Number.POSITIVE_INFINITY : -1; // column the reveal has reached; -1 = not started
    let lamp = { x: -1e4, y: -1e4, on: 0, target: 0 };
    let frame = 0;
    let last = 0;
    let disposed = false;

    function layout() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = wrap!.clientWidth;
      pitch = w < 640 ? 6 : w < 1000 ? 8 : 10;
      cols = Math.ceil(w / pitch);

      // the number fills the content column (the link box), not the full bleed
      const wr = wrap!.getBoundingClientRect();
      const br = box!.getBoundingClientRect();
      const left = Math.round((br.left - wr.left) / pitch);
      const boxCols = Math.floor(br.width / pitch);

      // phones: two lines, so each digit keeps enough pixels to read
      const words = text.split(" ");
      const lines = w < 640 && words.length > 1 ? [words[0], words.slice(1).join(" ")] : [text];

      const family = getComputedStyle(document.body).fontFamily;
      const off = document.createElement("canvas").getContext("2d", { willReadFrequently: true })!;
      off.font = `700 100px ${family}`;
      const widest = Math.max(...lines.map((l) => off.measureText(l).width));
      const size = (100 * boxCols) / widest;
      off.font = `700 ${size}px ${family}`;
      const m = off.measureText("0");
      const cap = Math.ceil(m.actualBoundingBoxAscent);
      const gap = Math.max(2, Math.round(cap * 0.22));
      const pad = w < 640 ? 3 : 4;
      const textRows = lines.length * cap + (lines.length - 1) * gap;
      rows = textRows + pad * 2;

      off.canvas.width = cols;
      off.canvas.height = rows;
      off.font = `700 ${size}px ${family}`;
      off.textBaseline = "alphabetic";
      off.fillStyle = "#fff";
      lines.forEach((l, i) => off.fillText(l, left, pad + cap + i * (cap + gap)));
      const data = off.getImageData(0, 0, cols, rows).data;
      mask = new Uint8Array(cols * rows);
      for (let i = 0; i < mask.length; i++) mask[i] = data[i * 4 + 3] > 110 ? 1 : 0;

      canvas!.width = Math.round(w * dpr);
      canvas!.height = Math.round(rows * pitch * dpr);
      canvas!.style.height = `${rows * pitch}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      wrap!.dataset.ready = "true";
    }

    function draw() {
      const w = cols * pitch;
      ctx!.clearRect(0, 0, w, rows * pitch);
      const dot = Math.max(2, Math.round(pitch * 0.7));
      const inset = (pitch - dot) / 2;
      const radius = pitch * (pitch < 8 ? 14 : 16);
      for (let r = 0; r < rows; r++) {
        const cy = r * pitch + pitch / 2;
        for (let c = 0; c < cols; c++) {
          const cx = c * pitch + pitch / 2;
          let s = 0;
          if (lamp.on > 0.01) {
            const d = Math.hypot(cx - lamp.x, cy - lamp.y);
            if (d < radius) s = (1 - d / radius) ** 2 * lamp.on;
          }
          if (mask[r * cols + c]) {
            const behind = scan - c; // how long ago the scan passed this column
            if (behind < 0) {
              ctx!.fillStyle = `rgba(255,255,255,${0.07 + s * 0.5})`;
            } else {
              const head = behind < 6 ? 1 - behind / 6 : 0; // bright leading edge of the scan
              const mix = Math.min(1, head + s * 0.8); // towards white-hot
              const g = Math.round(64 + mix * 150); // brand red #f44025, heating towards white
              const b = Math.round(37 + mix * 140);
              ctx!.fillStyle = `rgb(${Math.round(244 + mix * 11)},${g},${b})`;
            }
          } else {
            ctx!.fillStyle = `rgba(255,255,255,${0.07 + s * 0.4})`;
          }
          ctx!.fillRect(c * pitch + inset, r * pitch + inset, dot, dot);
        }
      }
    }

    function tick(now: number) {
      frame = 0;
      const dt = Math.min(64, now - (last || now));
      last = now;
      let busy = false;
      if (scan >= 0 && scan < cols + 8) {
        scan += dt * (cols / 900); // the sweep takes about 0.9s whatever the width
        busy = true;
      } else if (scan >= 0) {
        scan = Number.POSITIVE_INFINITY; // done: stays lit even if the panel later gets wider
      }
      lamp.on += (lamp.target - lamp.on) * Math.min(1, dt / 120);
      if (Math.abs(lamp.target - lamp.on) > 0.01) busy = true;
      draw();
      if (busy) request();
      else last = 0;
    }

    function request() {
      if (!frame && !disposed) frame = requestAnimationFrame(tick);
    }

    const start = () => {
      layout();
      draw();
    };
    document.fonts.ready.then(() => !disposed && start());
    start();

    const ro = new ResizeObserver(() => {
      layout();
      draw();
    });
    ro.observe(wrap);

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && scan === -1) {
          scan = 0;
          request();
        }
      },
      { threshold: 0.4 },
    );
    if (!reduce) io.observe(wrap);

    const move = (e: PointerEvent) => {
      if (reduce) return;
      const r = wrap.getBoundingClientRect();
      lamp.x = e.clientX - r.left;
      lamp.y = e.clientY - r.top;
      lamp.target = 1;
      request();
    };
    const leave = () => {
      lamp.target = 0;
      request();
    };
    wrap.addEventListener("pointermove", move);
    wrap.addEventListener("pointerleave", leave);
    wrap.addEventListener("pointercancel", leave);

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
      wrap.removeEventListener("pointermove", move);
      wrap.removeEventListener("pointerleave", leave);
      wrap.removeEventListener("pointercancel", leave);
    };
  }, [text]);

  return (
    <div ref={wrapRef} className="led-wall">
      <canvas ref={canvasRef} className="led-canvas" aria-hidden="true" />
      <div className="container">
        <a ref={boxRef} href={href} className="led-number" aria-label={label}>
          <span className="led-fallback">{text}</span>
        </a>
      </div>
    </div>
  );
}
