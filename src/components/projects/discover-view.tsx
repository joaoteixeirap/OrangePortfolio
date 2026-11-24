"use client";

import { useMemo, useState } from "react";
import { NoResults } from "@/components/projects/empty-states";
import ProjectCard from "@/components/projects/project-card";
import ProjectViewDialog from "@/components/projects/project-view-dialog";
import TagSearch from "@/components/projects/tag-search";
import { filterByTags, type Project } from "@/lib/projects";

export default function DiscoverView({ projects }: { projects: Project[] }) {
  const [query, setQuery] = useState("");
  const [viewing, setViewing] = useState<Project | null>(null);
  const filtered = useMemo(() => filterByTags(projects, query), [projects, query]);

  return (
    <div className="animate-fade-in-up">
      <h1 className="mx-auto max-w-[760px] pt-14 text-center text-2xl leading-tight text-principal-90 sm:pt-20 sm:text-4xl lg:pt-28 lg:text-[2.125rem] lg:leading-[1.2] xl:text-[2.5rem]">
        Junte-se à comunidade de inovação, inspiração e descobertas, transformando experiências em
        conexões inesquecíveis
      </h1>

      <section aria-label="Projetos da comunidade" className="mt-14 sm:mt-20 lg:mt-28">
        <TagSearch
          id="busca-descobrir"
          value={query}
          onChange={setQuery}
          resultCount={filtered.length}
          total={projects.length}
        />

        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {projects.length === 0 ? (
            <p className="col-span-full text-lg text-neutral-110">
              Ainda não há projetos publicados. Que tal ser a primeira pessoa?
            </p>
          ) : filtered.length === 0 ? (
            <NoResults query={query} onClear={() => setQuery("")} />
          ) : (
            filtered.map((project, i) => (
              <ProjectCard
                key={project.id}
                project={project}
                priority={i < 3}
                onOpen={setViewing}
                onTagClick={setQuery}
              />
            ))
          )}
        </div>
      </section>

      <ProjectViewDialog
        project={viewing}
        open={viewing !== null}
        onClose={() => setViewing(null)}
        onTagClick={setQuery}
      />
    </div>
  );
}
