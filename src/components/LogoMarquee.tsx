import Image from "next/image";
import type { Brand } from "@/lib/content";

type WithLogo = Brand & { logo: NonNullable<Brand["logo"]> };

/**
 * Partner logos, in their own colours, gliding sideways in an endless loop (pure CSS: the list is rendered twice and the
 * track slides by exactly one copy). Wide wordmarks are drawn shorter than compact marks so every
 * logo carries about the same visual weight. It keeps moving under the pointer; it rests off screen
 * (via AmbientPlay) and, for visitors who prefer reduced motion, becomes a still, wrapped row.
 */
export function LogoMarquee({ brands, label }: { brands: Brand[]; label: string }) {
  const items = brands.filter((b): b is WithLogo => Boolean(b.logo));
  const copy = (hidden: boolean) =>
    items.map((b) => {
      const aspect = b.logo.width / b.logo.height;
      const style = { height: `calc(var(--logo-h) * ${(1 / Math.pow(aspect, 0.35)).toFixed(3)})` };
      // one version per background: black ink lightened for dark pages, kept black for light ones.
      // CSS hides the other, and a hidden lazy image is never fetched (the lazy-load margin is far
      // wider than one logo, so the visible ones are in before they slide into view).
      const variants = [
        { src: b.logo.src, className: "logo-on-dark" },
        { src: b.logo.src.replace(/\.png$/, "-light.png"), className: "logo-on-light" },
      ];
      return (
        <li key={`${hidden ? "b" : "a"}-${b.name}`} className="marquee-item" aria-hidden={hidden || undefined}>
          {variants.map((v) => (
            <Image
              key={v.className}
              src={v.src}
              alt={hidden ? "" : b.name}
              width={b.logo.width}
              height={b.logo.height}
              unoptimized // served as prepared: crisp edges, no re-encode at a smaller width
              className={v.className}
              style={style}
            />
          ))}
        </li>
      );
    });

  return (
    <div className="marquee" data-ambient>
      <ul className="marquee-track" aria-label={label} style={{ "--marquee-dur": `${items.length * 4}s` } as React.CSSProperties}>
        {copy(false)}
        {copy(true)}
      </ul>
    </div>
  );
}
