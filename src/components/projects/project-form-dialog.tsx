"use client";

import { useEffect, useId, useRef, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import CollectionsIcon from "@mui/icons-material/Collections";
import {
  createProject,
  discardUploadedCover,
  updateProject,
  type ProjectActionResult,
} from "@/app/(app)/meus-projetos/actions";
import ProjectCover from "@/components/projects/project-cover";
import { CoverError, uploadCover, validateCoverFile } from "@/lib/cover-upload";
import { MAX_TAGS, normalizeTags, type Author, type Project } from "@/lib/projects";
import type { FieldErrors } from "@/lib/validation";
import { brand } from "@/theme/theme";

type Field = "title" | "tags" | "link" | "description" | "coverUrl";

type ProjectFormDialogProps = {
  open: boolean;
  project: Project | null; // null = adicionar
  author: Author;
  tagSuggestions: string[];
  onClose: () => void;
  onSaved: (mode: "create" | "edit") => void;
  onError: (message: string) => void;
  onPreview: (draft: Project) => void;
};

export default function ProjectFormDialog(props: ProjectFormDialogProps) {
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("md"));
  // Remonta o formulário a cada abertura para começar com os valores certos.
  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      maxWidth="lg"
      fullWidth
      scroll="body"
      aria-labelledby="form-projeto-titulo"
      slotProps={{ paper: { sx: { maxWidth: 890, m: { xs: 2, sm: 4 }, width: { xs: "calc(100% - 32px)", sm: "100%" } } } }}
    >
      {props.open && <ProjectForm {...props} mobile={mobile} />}
    </Dialog>
  );
}

function ProjectForm({
  project,
  author,
  tagSuggestions,
  onClose,
  onSaved,
  onError,
  onPreview,
  mobile,
}: ProjectFormDialogProps & { mobile: boolean }) {
  const mode = project ? "edit" : "create";
  const uid = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(project?.title ?? "");
  const [tags, setTags] = useState<string[]>(project?.tags ?? []);
  const [tagInput, setTagInput] = useState("");
  const [link, setLink] = useState(project?.link ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(project?.cover_url ?? null);
  const [errors, setErrors] = useState<FieldErrors<Field>>({});
  const [saving, setSaving] = useState(false);
  const [dragging, setDragging] = useState(false);

  // Libera a URL blob: da prévia local.
  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function pickFile(selected: File | undefined) {
    if (!selected) return;
    try {
      validateCoverFile(selected);
    } catch (err) {
      setErrors((e) => ({ ...e, coverUrl: err instanceof CoverError ? err.message : "Imagem inválida" }));
      return;
    }
    setErrors(({ coverUrl: _ignored, ...rest }) => rest);
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
  }

  function commitTagInput(): string[] {
    const pending = tagInput.split(",").map((t) => t.trim()).filter(Boolean);
    if (pending.length === 0) return tags;
    const next = normalizeTags([...tags, ...pending]);
    setTags(next);
    setTagInput("");
    return next;
  }

  function draft(finalTags = tags): Project {
    const now = new Date().toISOString();
    return {
      id: project?.id ?? "rascunho",
      user_id: author.id,
      title: title.trim() || "Sem título",
      tags: finalTags,
      link: link.trim() ? (/^https?:\/\//i.test(link.trim()) ? link.trim() : `https://${link.trim()}`) : null,
      description: description.trim(),
      cover_url: previewUrl,
      created_at: project?.created_at ?? now,
      updated_at: now,
      author,
    };
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const finalTags = commitTagInput();

    const localErrors: FieldErrors<Field> = {};
    if (!title.trim()) localErrors.title = "Informe o título";
    if (!previewUrl) localErrors.coverUrl = "Selecione uma imagem de capa";
    if (Object.keys(localErrors).length) {
      setErrors(localErrors);
      return;
    }

    setSaving(true);
    let uploadedUrl: string | null = null;
    try {
      let coverUrl = project?.cover_url ?? null;
      if (file) {
        uploadedUrl = await uploadCover(file, author.id);
        coverUrl = uploadedUrl;
      }

      const input = { title, tags: finalTags, link, description, coverUrl };
      const result: ProjectActionResult = project
        ? await updateProject(project.id, input)
        : await createProject(input);

      if (!result.ok) {
        if (uploadedUrl) await discardUploadedCover(uploadedUrl);
        setErrors(result.errors ?? {});
        onError(result.message);
        return;
      }
      onSaved(mode);
    } catch (err) {
      if (uploadedUrl) await discardUploadedCover(uploadedUrl).catch(() => undefined);
      onError(
        err instanceof CoverError
          ? err.message
          : mode === "create"
            ? "Ocorreu um erro ao tentar adicionar o projeto."
            : "Ocorreu um erro ao tentar editar o projeto.",
      );
    } finally {
      setSaving(false);
    }
  }

  const coverErrorId = `${uid}-capa-erro`;

  const uploadArea = (
    <div className="flex flex-col gap-4">
      <p id={`${uid}-capa-label`} className="text-base text-neutral-110">
        Selecione o conteúdo que você deseja fazer upload
      </p>
      <input
        ref={fileInputRef}
        id={`${uid}-capa`}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={(e) => {
          pickFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          pickFile(e.dataTransfer.files?.[0]);
        }}
        aria-labelledby={`${uid}-capa-label ${uid}-capa-acao`}
        aria-describedby={errors.coverUrl ? coverErrorId : undefined}
        className={`group relative w-full overflow-hidden rounded text-left outline-offset-2 transition ${
          errors.coverUrl ? "ring-2 ring-error-100" : ""
        } ${dragging ? "ring-2 ring-info-90" : ""}`}
      >
        {previewUrl ? (
          <>
            <ProjectCover src={previewUrl} alt="Prévia da capa" sizes="(min-width: 900px) 420px, 90vw" />
            <span
              id={`${uid}-capa-acao`}
              className="absolute inset-x-0 bottom-0 bg-black/60 py-2 text-center text-sm text-white opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100"
            >
              Trocar imagem
            </span>
          </>
        ) : (
          <span className="flex aspect-[3/2] w-full flex-col items-center justify-center gap-4 bg-neutral-70 px-8 transition-colors group-hover:bg-[#DCE0EB] md:aspect-[608/475]">
            <CollectionsIcon sx={{ fontSize: 46, color: brand.neutral120 }} aria-hidden />
            <span id={`${uid}-capa-acao`} className="text-sm text-neutral-110 sm:text-base">
              Compartilhe seu talento com milhares de pessoas
              <span className="mt-1 block text-xs text-neutral-110">JPG, PNG ou WebP. Clique ou arraste aqui.</span>
            </span>
          </span>
        )}
      </button>
      {errors.coverUrl && (
        <p id={coverErrorId} className="-mt-2 text-xs text-error-100" role="alert">
          {errors.coverUrl}
        </p>
      )}
    </div>
  );

  const fields = (
    <div className="flex flex-col gap-4 md:gap-5">
      <TextField
        label="Título"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        error={Boolean(errors.title)}
        helperText={errors.title}
        slotProps={{ htmlInput: { maxLength: 100 } }}
        fullWidth
      />
      <Autocomplete
        multiple
        freeSolo
        options={tagSuggestions.filter((t) => !tags.includes(t))}
        value={tags}
        onChange={(_, value) => setTags(normalizeTags(value))}
        inputValue={tagInput}
        onInputChange={(_, value, reason) => {
          if (reason === "reset") return;
          if (value.includes(",")) {
            const parts = value.split(",");
            const rest = parts.pop() ?? "";
            setTags((t) => normalizeTags([...t, ...parts]));
            setTagInput(rest.trimStart());
          } else {
            setTagInput(value);
          }
        }}
        onBlur={() => commitTagInput()}
        getOptionDisabled={() => tags.length >= MAX_TAGS}
        renderValue={(value, getItemProps) =>
          value.map((option, index) => {
            const { key, ...itemProps } = getItemProps({ index });
            return <Chip key={key} label={option} size="small" {...itemProps} />;
          })
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label="Tags"
            error={Boolean(errors.tags)}
            helperText={errors.tags ?? (tags.length ? undefined : "Separe com vírgula ou Enter, ex.: UX, Web")}
          />
        )}
      />
      <TextField
        label="Link"
        value={link}
        onChange={(e) => setLink(e.target.value)}
        error={Boolean(errors.link)}
        helperText={errors.link}
        slotProps={{ htmlInput: { inputMode: "url", autoComplete: "url", maxLength: 500 } }}
        fullWidth
      />
      <TextField
        label="Descrição"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        multiline
        minRows={mobile ? 3 : 5}
        maxRows={12}
        error={Boolean(errors.description)}
        helperText={errors.description}
        slotProps={{ htmlInput: { maxLength: 2000 } }}
        fullWidth
      />
    </div>
  );

  return (
    <form onSubmit={handleSubmit} noValidate className="px-6 py-6 md:px-[30px] md:py-[30px]">
      <h2 id="form-projeto-titulo" className="mb-6 text-2xl text-neutral-110">
        {mode === "create" ? "Adicionar projeto" : "Editar projeto"}
      </h2>

      {/* Desktop: upload à esquerda, campos à direita. Mobile: campos primeiro (como no Figma). */}
      <div className="grid gap-6 md:grid-cols-2 md:gap-6">
        <div className="order-2 md:order-1 md:-mt-11">{uploadArea}</div>
        <div className="order-1 md:order-2">{fields}</div>
      </div>

      <button
        type="button"
        onClick={() => onPreview(draft(commitTagInput()))}
        className="mt-4 rounded text-base text-neutral-110 underline-offset-2 hover:underline"
      >
        Visualizar publicação
      </button>

      <div className="mt-4 flex gap-4">
        <Button type="submit" variant="contained" size="large" disabled={saving} sx={{ minWidth: 104 }}>
          {saving ? <CircularProgress size={22} color="inherit" aria-label="Salvando" /> : "Salvar"}
        </Button>
        <Button variant="neutral" size="large" onClick={onClose} disabled={saving}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
