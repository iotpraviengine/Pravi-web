import type { Metadata } from "next";
import { Suspense } from "react";
import { ProjectGrid, type ProjectItem } from "@/components/ProjectGrid";
import { CtaBand, ProjectCard } from "@/components/ui";
import { getProjects, getSolution, siteInfo, solutions } from "@/lib/content";

export const metadata: Metadata = {
  title: "Dự án tiêu biểu",
  description: "Các công trình màn hình LED, đèn sân khấu tiêu biểu do SKV Lighting thi công tại hội trường, phòng họp, trường học, nhà hàng, nhà thi đấu trên toàn quốc.",
  alternates: { canonical: "/du-an" },
};

export default function ProjectsPage() {
  const projects = getProjects();
  const items: ProjectItem[] = projects.map((p) => ({
    slug: p.slug,
    title: p.title,
    cover: p.cover,
    location: p.location || getSolution(p.solution)?.name || "",
    year: p.date.slice(0, 4),
    solution: p.solution,
    solutionShort: getSolution(p.solution)?.short ?? "",
    tags: p.tags,
  }));
  const filters = solutions.map((s) => ({ slug: s.slug, label: s.short }));

  return (
    <>
      <section className="hero" style={{ paddingBottom: "clamp(40px, 6vw, 64px)" }}>
        <div className="container">
          <span className="eyebrow reveal">Dự án</span>
          <h1 className="display reveal">Công trình nói thay lời.</h1>
          <p className="subhead reveal muted" data-delay="1">
            {siteInfo.stats[0].value} {siteInfo.stats[0].label}.
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

      <CtaBand title="Dự án tiếp theo có thể là của bạn." />
    </>
  );
}
