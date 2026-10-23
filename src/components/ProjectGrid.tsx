"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export type ProjectItem = {
  slug: string;
  title: string;
  cover: string;
  location: string;
  year: string;
  solution: string;
  solutionShort: string;
  tags: string[];
};

export function ProjectGrid({ projects, filters }: { projects: ProjectItem[]; filters: { slug: string; label: string }[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const active = params.get("giai-phap") ?? "";
  const shown = active ? projects.filter((p) => p.solution === active) : projects;

  const select = (slug: string) => {
    const q = slug ? `?giai-phap=${slug}` : "";
    router.replace(pathname + q, { scroll: false });
  };

  return (
    <>
      <div className="filters" role="group" aria-label="Lọc dự án theo giải pháp">
        <button type="button" className="filter-chip" aria-pressed={!active} onClick={() => select("")}>
          Tất cả ({projects.length})
        </button>
        {filters.map((f) => {
          const count = projects.filter((p) => p.solution === f.slug).length;
          if (!count) return null;
          return (
            <button key={f.slug} type="button" className="filter-chip" aria-pressed={active === f.slug} onClick={() => select(f.slug)}>
              {f.label} ({count})
            </button>
          );
        })}
      </div>

      <p className="sr-only" aria-live="polite">
        Đang hiển thị {shown.length} dự án
      </p>

      <div className="grid grid-3">
        {shown.map((p) => (
          <Link key={p.slug} href={`/du-an/${p.slug}`} className="media-card">
            <div className="media">
              <Image src={p.cover} alt="" fill sizes="(min-width: 1000px) 380px, (min-width: 640px) 50vw, 100vw" />
            </div>
            <h3>{p.title}</h3>
            <p className="meta">
              {p.location} · {p.year}
            </p>
            <div className="chips">
              <span className="chip">{p.solutionShort}</span>
              {p.tags.map((t) => (
                <span className="chip" key={t}>
                  {t}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
