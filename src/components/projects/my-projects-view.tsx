"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Button from "@mui/material/Button";
import { deleteProject } from "@/app/(app)/meus-projetos/actions";
import { NoticeSnackbar, type NoticeMessage } from "@/components/feedback/notice";
import { FirstProjectCard, NoResults } from "@/components/projects/empty-states";
import ProjectCard from "@/components/projects/project-card";
import ProjectFormDialog from "@/components/projects/project-form-dialog";
import ProjectViewDialog from "@/components/projects/project-view-dialog";
import { DeleteConfirmDialog, SuccessDialog } from "@/components/projects/status-dialogs";
import TagSearch from "@/components/projects/tag-search";
import UserAvatar from "@/components/user-avatar";
import type { Profile } from "@/lib/database.types";
import { filterByTags, fullName, type Project } from "@/lib/projects";

type MyProjectsViewProps = {
  profile: Profile;
  projects: Project[];
  tagSuggestions: string[];
};

type DialogState =
  | { kind: "none" }
  | { kind: "form"; project: Project | null }
  | { kind: "delete"; project: Project }
  | { kind: "success"; message: string };

const SUCCESS = {
  create: "Projeto adicionado com sucesso!",
  edit: "Edição concluída com sucesso!",
  delete: "Projeto deletado com sucesso!",
};

export default function MyProjectsView({ profile, projects, tagSuggestions }: MyProjectsViewProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [dialog, setDialog] = useState<DialogState>({ kind: "none" });
  const [viewing, setViewing] = useState<Project | null>(null);
  const [notice, setNotice] = useState<NoticeMessage | null>(null);
  const [deleting, startDelete] = useTransition();

  const filtered = useMemo(() => filterByTags(projects, query), [projects, query]);
  const author = {
    id: profile.id,
    nome: profile.nome,
    sobrenome: profile.sobrenome,
    avatar_url: profile.avatar_url,
  };
  const openAdd = () => setDialog({ kind: "form", project: null });
  const showError = (text: string) => setNotice({ severity: "error", text });

  function confirmDelete(project: Project) {
    startDelete(async () => {
      const result = await deleteProject(project.id);
      if (result.ok) {
        setDialog({ kind: "success", message: SUCCESS.delete });
        router.refresh();
      } else {
        setDialog({ kind: "none" });
        showError(result.message);
      }
    });
  }

  return (
    <div className="animate-fade-in-up">
      {/* Perfil */}
      <section
        aria-labelledby="perfil-nome"
        className="flex flex-col items-center gap-4 pt-14 sm:flex-row sm:justify-center sm:gap-10 sm:pt-20 lg:pt-28"
      >
        <UserAvatar person={author} size={122} decorative />
        <div className="flex flex-col items-start gap-2 sm:gap-4">
          <div>
            <h1 id="perfil-nome" className="text-2xl text-neutral-120">
              {fullName(author)}
            </h1>
            <p className="mt-1 text-base text-neutral-100 sm:mt-4">{profile.pais}</p>
          </div>
          <Button variant="neutral" size="large" onClick={openAdd} sx={{ px: 3, height: 42 }}>
            Adicionar projeto
          </Button>
        </div>
      </section>

      {/* Lista */}
      <section aria-labelledby="meus-projetos-titulo" className="mt-14 sm:mt-16">
        <h2 id="meus-projetos-titulo" className="mb-4 text-xl font-medium text-neutral-100">
          Meus projetos
        </h2>
        <TagSearch
          id="busca-meus-projetos"
          value={query}
          onChange={setQuery}
          resultCount={filtered.length}
          total={projects.length}
        />

        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {projects.length === 0 ? (
            <FirstProjectCard onAdd={openAdd} />
          ) : filtered.length === 0 ? (
            <NoResults query={query} onClear={() => setQuery("")} />
          ) : (
            filtered.map((project, i) => (
              <ProjectCard
                key={project.id}
                project={project}
                priority={i < 3}
                onOpen={setViewing}
                onEdit={(p) => setDialog({ kind: "form", project: p })}
                onDelete={(p) => setDialog({ kind: "delete", project: p })}
                onTagClick={setQuery}
              />
            ))
          )}
        </div>
      </section>

      <ProjectFormDialog
        open={dialog.kind === "form"}
        project={dialog.kind === "form" ? dialog.project : null}
        author={author}
        tagSuggestions={tagSuggestions}
        onClose={() => setDialog({ kind: "none" })}
        onSaved={(mode) => {
          setDialog({ kind: "success", message: SUCCESS[mode] });
          router.refresh();
        }}
        onError={showError}
        onPreview={setViewing}
      />

      <ProjectViewDialog
        project={viewing}
        open={viewing !== null}
        onClose={() => setViewing(null)}
        onTagClick={dialog.kind === "none" ? setQuery : undefined}
      />

      <DeleteConfirmDialog
        open={dialog.kind === "delete"}
        pending={deleting}
        onCancel={() => setDialog({ kind: "none" })}
        onConfirm={() => dialog.kind === "delete" && confirmDelete(dialog.project)}
      />

      <SuccessDialog
        open={dialog.kind === "success"}
        message={dialog.kind === "success" ? dialog.message : ""}
        onClose={() => setDialog({ kind: "none" })}
      />

      <NoticeSnackbar notice={notice} onClose={() => setNotice(null)} />
    </div>
  );
}
