"use client";

import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import EditIcon from "@mui/icons-material/Edit";
import ProjectCover from "@/components/projects/project-cover";
import ProjectMeta from "@/components/projects/project-meta";
import TagChips from "@/components/projects/tag-chips";
import type { Project } from "@/lib/projects";
import { brand } from "@/theme/theme";

type ProjectCardProps = {
  project: Project;
  onOpen: (project: Project) => void;
  onEdit?: (project: Project) => void;
  onDelete?: (project: Project) => void;
  onTagClick?: (tag: string) => void;
  priority?: boolean;
};

const CARD_SIZES = "(min-width: 1024px) 31vw, (min-width: 640px) 48vw, 92vw";

export default function ProjectCard({
  project,
  onOpen,
  onEdit,
  onDelete,
  onTagClick,
  priority,
}: ProjectCardProps) {
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const editable = Boolean(onEdit && onDelete);
  const menuId = `menu-projeto-${project.id}`;

  return (
    <article className="flex min-w-0 flex-col gap-2" aria-label={project.title}>
      <div className="group relative overflow-hidden rounded">
        <button
          type="button"
          onClick={() => onOpen(project)}
          className="block w-full cursor-pointer rounded text-left"
          aria-label={`Ver detalhes do projeto ${project.title}`}
        >
          <ProjectCover
            src={project.cover_url}
            alt=""
            sizes={CARD_SIZES}
            priority={priority}
            className="transition-transform duration-300 group-hover:scale-[1.02]"
          />
          {/* Título aparece ao passar o mouse/focar, sem mudar o layout do protótipo */}
          <span className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-black/75 to-transparent px-4 pb-3 pt-10 text-lg font-medium text-white opacity-0 transition duration-200 group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:translate-y-0 group-hover:opacity-100">
            {project.title}
          </span>
        </button>

        {editable && (
          <>
            <IconButton
              aria-label={`Opções do projeto ${project.title}`}
              aria-controls={menuAnchor ? menuId : undefined}
              aria-haspopup="true"
              aria-expanded={menuAnchor ? "true" : undefined}
              onClick={(e) => setMenuAnchor(e.currentTarget)}
              size="small"
              sx={{
                position: "absolute",
                top: 12,
                right: 12,
                width: 28,
                height: 28,
                bgcolor: brand.secondary70,
                color: brand.neutral120,
                boxShadow: 1,
                "&:hover": { bgcolor: brand.secondary60 },
              }}
            >
              <EditIcon sx={{ fontSize: 18 }} />
            </IconButton>
            <Menu
              id={menuId}
              anchorEl={menuAnchor}
              open={Boolean(menuAnchor)}
              onClose={() => setMenuAnchor(null)}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              slotProps={{
                paper: { sx: { mt: 0.5, minWidth: 208, bgcolor: brand.neutral60 } },
              }}
            >
              <MenuItem
                onClick={() => {
                  setMenuAnchor(null);
                  onEdit?.(project);
                }}
              >
                Editar
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setMenuAnchor(null);
                  onDelete?.(project);
                }}
              >
                Excluir
              </MenuItem>
            </Menu>
          </>
        )}
      </div>

      <div className="flex items-center justify-between gap-3">
        <ProjectMeta author={project.author} createdAt={project.created_at} />
        <TagChips tags={project.tags} max={2} onTagClick={onTagClick} className="shrink-0 justify-end" />
      </div>
    </article>
  );
}
