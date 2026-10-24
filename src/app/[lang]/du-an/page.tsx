import type { Metadata } from "next";
import { Suspense } from "react";
import { ProjectGrid, type ProjectItem } from "@/components/ProjectGrid";
import { CtaBand, ProjectCard } from "@/components/ui";
import { alternates, getI18n } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, t } = await getI18n();
  return { title: t.projects.title, description: t.projects.description, alternates: alternates(locale, "/du-an") };
}

export default async function ProjectsPage() {
  const { t, c } = await getI18n();
  const l = t.projects;
  const projects = c.projects;
  const items: ProjectItem[] = projects.map((p) => ({
    slug: p.slug,
    title: p.title,
    cover: p.cover,
    location: p.location || c.getSolution(p.solution)?.name || "",
    year: p.date.slice(0, 4),
    solution: p.solution,
    solutionShort: c.getSolution(p.solution)?.short ?? "",
    tags: p.tags,
  }));
  const filters = c.solutions.map((s) => ({ slug: s.slug, label: s.short }));
  const stat = c.siteInfo.stats[0];

  return (
    <>
      <section className="hero" style={{ paddingBottom: "clamp(40px, 6vw, 64px)" }}>
        <div className="container">
          <span className="eyebrow reveal">{l.eyebrow}</span>
          <h1 className="display reveal">{l.headline}</h1>
          <p className="subhead reveal muted" data-delay="1">
            {stat.value} {stat.label}.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          {/* The filter reads ?giai-phap= on the client; the fallback is the full, unfiltered list. */}
          <Suspense
            fallback={
              <div className="grid grid-3">
                {projects.map((p) => (
                  <ProjectCard key={p.slug} project={p} />
                ))}
              </div>
            }
          >
            <ProjectGrid projects={items} filters={filters} />
          </Suspense>
        </div>
      </section>

      <CtaBand title={l.cta} />
    </>
  );
}
