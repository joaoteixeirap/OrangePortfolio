"use client";

import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import ProjectCover from "@/components/projects/project-cover";
import ProjectMeta from "@/components/projects/project-meta";
import TagChips from "@/components/projects/tag-chips";
import UserAvatar from "@/components/user-avatar";
import { formatLongDate, formatMonthYear, fullName, type Project } from "@/lib/projects";

type ProjectViewDialogProps = {
  project: Project | null;
  open: boolean;
  onClose: () => void;
  onTagClick?: (tag: string) => void;
};

const VIEW_SIZES = "(min-width: 1024px) 880px, 100vw";

function Author({ project }: { project: Project }) {
  return (
    <div className="flex items-center gap-3">
      <UserAvatar person={project.author} size={40} decorative />
      <div className="flex flex-col">
        <span className="text-base font-medium text-neutral-120">{fullName(project.author)}</span>
        <time dateTime={project.created_at} title={formatLongDate(project.created_at)} className="text-base text-neutral-110">
          <span className="sr-only">{formatLongDate(project.created_at)}</span>
          <span aria-hidden="true">{formatMonthYear(project.created_at)}</span>
        </time>
      </div>
    </div>
  );
}

/** Modal "Visualização de portfólio" (desktop) / tela de pré-visualização (mobile). */
export default function ProjectViewDialog({ project, open, onClose, onTagClick }: ProjectViewDialogProps) {
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("md"));
  const titleId = "projeto-titulo";

  const handleTag = onTagClick
    ? (tag: string) => {
        onClose();
        onTagClick(tag);
      }
    : undefined;

  return (
    <Dialog
      open={open && project !== null}
      onClose={onClose}
      fullScreen={mobile}
      maxWidth="lg"
      fullWidth
      aria-labelledby={titleId}
    >
      {project && (
        <div className="relative px-6 pb-12 pt-16 md:px-[10%] md:pb-16 md:pt-14">
          <IconButton
            aria-label="Fechar"
            onClick={onClose}
            sx={{ position: "absolute", top: { xs: 12, md: 16 }, right: { xs: 12, md: 16 } }}
          >
            <CloseIcon />
          </IconButton>

          {/* Desktop: autor | título | tags na mesma linha */}
          <div className="hidden grid-cols-[1fr_auto_1fr] items-center gap-6 md:grid">
            <Author project={project} />
            <h2 id={mobile ? undefined : titleId} className="text-center text-2xl text-neutral-120 lg:text-[2rem]">
              {project.title}
            </h2>
            <TagChips tags={project.tags} onTagClick={handleTag} className="justify-end" />
          </div>

          {/* Mobile: título no topo */}
          <h2 id={mobile ? titleId : undefined} className="text-center text-2xl text-neutral-120 md:hidden">
            {project.title}
          </h2>

          <ProjectCover
            src={project.cover_url}
            alt={`Capa do projeto ${project.title}`}
            sizes={VIEW_SIZES}
            className="mt-8 md:mt-14"
          />

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 md:hidden">
            <ProjectMeta author={project.author} createdAt={project.created_at} />
            <TagChips tags={project.tags} onTagClick={handleTag} />
          </div>

          {project.description && (
            <p className="mt-6 whitespace-pre-line text-base leading-relaxed text-neutral-130 md:mt-14 md:text-lg">
              {project.description}
            </p>
          )}

          {project.link && (
            <div className="mt-8 text-base md:text-lg">
              <p className="text-neutral-130">Download</p>
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="break-all text-info-90 underline-offset-2 hover:underline"
              >
                {project.link}
                <span className="sr-only"> (abre em nova aba)</span>
              </a>
            </div>
          )}
        </div>
      )}
    </Dialog>
  );
}
