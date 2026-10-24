import Image from "next/image";
import type { Brand } from "@/lib/content";

type WithLogo = Brand & { logo: NonNullable<Brand["logo"]> };

/**
 * Partner logos, in their own colours, gliding sideways in an endless loop (pure CSS: the list is rendered twice and the
 * track slides by exactly one copy). Wide wordmarks are drawn shorter than compact marks so every
 * logo carries about the same visual weight. Hovering holds it still; it rests off screen
 * (via AmbientPlay) and, for visitors who prefer reduced motion, becomes a still, wrapped row.
 */
export function LogoMarquee({ brands, label }: { brands: Brand[]; label: string }) {
  const items = brands.filter((b): b is WithLogo => Boolean(b.logo));
  const copy = (hidden: boolean) =>
    items.map((b) => {
      const aspect = b.logo.width / b.logo.height;
      return (
        <li key={`${hidden ? "b" : "a"}-${b.name}`} className="marquee-item" aria-hidden={hidden || undefined}>
          <Image
            src={b.logo.src}
            alt={hidden ? "" : b.name}
            width={b.logo.width}
            height={b.logo.height}
            unoptimized // served as prepared: crisp edges, no re-encode at a smaller width
            loading="eager" // they slide into view; lazy loading would make them pop in
            style={{ height: `calc(var(--logo-h) * ${(1 / Math.pow(aspect, 0.35)).toFixed(3)})` }}
          />
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
