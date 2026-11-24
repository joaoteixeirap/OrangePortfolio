"use server";

import { revalidatePath } from "next/cache";
import { COVERS_BUCKET, getSupabaseEnv } from "@/lib/env";
import { coverPathFromUrl } from "@/lib/projects";
import { createClient } from "@/lib/supabase/server";
import {
  fieldErrors,
  projectInputSchema,
  type FieldErrors,
  type ProjectInput,
} from "@/lib/validation";

export type ProjectActionResult =
  | { ok: true }
  | {
      ok: false;
      message: string;
      errors?: FieldErrors<"title" | "tags" | "link" | "description" | "coverUrl">;
    };

const GENERIC = {
  create: "Ocorreu um erro ao tentar adicionar o projeto.",
  update: "Ocorreu um erro ao tentar editar o projeto.",
  delete: "Ocorreu um erro ao tentar excluir o projeto.",
};

async function getContext() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return { supabase, user: data.user };
}

/** A capa precisa estar no bucket, dentro da pasta da própria pessoa. */
function isOwnCover(coverUrl: string | null, userId: string) {
  if (coverUrl === null) return true;
  const path = coverPathFromUrl(getSupabaseEnv().url, coverUrl);
  return path !== null && path.startsWith(`${userId}/`);
}

async function removeCover(
  supabase: Awaited<ReturnType<typeof createClient>>,
  coverUrl: string | null,
  userId: string,
) {
  const path = coverPathFromUrl(getSupabaseEnv().url, coverUrl);
  if (path && path.startsWith(`${userId}/`)) {
    // Falha ao apagar a imagem antiga não deve desfazer a operação principal.
    await supabase.storage.from(COVERS_BUCKET).remove([path]);
  }
}

function revalidate() {
  revalidatePath("/meus-projetos");
  revalidatePath("/descobrir");
}

export async function createProject(input: ProjectInput): Promise<ProjectActionResult> {
  const { supabase, user } = await getContext();
  if (!user) return { ok: false, message: "Sua sessão expirou. Entre novamente." };

  const parsed = projectInputSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: "Revise os campos destacados.", errors: fieldErrors(parsed.error) };
  }
  const data = parsed.data;
  if (!data.coverUrl) {
    return {
      ok: false,
      message: "Selecione uma imagem de capa.",
      errors: { coverUrl: "Selecione uma imagem de capa" },
    };
  }
  if (!isOwnCover(data.coverUrl, user.id)) {
    return { ok: false, message: GENERIC.create };
  }

  const { error } = await supabase.from("projects").insert({
    user_id: user.id,
    title: data.title,
    tags: data.tags,
    link: data.link,
    description: data.description,
    cover_url: data.coverUrl,
  });
  if (error) {
    console.error("createProject", error);
    return { ok: false, message: GENERIC.create };
  }

  revalidate();
  return { ok: true };
}

export async function updateProject(id: string, input: ProjectInput): Promise<ProjectActionResult> {
  const { supabase, user } = await getContext();
  if (!user) return { ok: false, message: "Sua sessão expirou. Entre novamente." };

  const parsed = projectInputSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: "Revise os campos destacados.", errors: fieldErrors(parsed.error) };
  }
  const data = parsed.data;

  const { data: current, error: findError } = await supabase
    .from("projects")
    .select("id, cover_url")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();
  if (findError || !current) {
    return { ok: false, message: "Projeto não encontrado." };
  }
  if (data.coverUrl !== current.cover_url && !isOwnCover(data.coverUrl, user.id)) {
    return { ok: false, message: GENERIC.update };
  }

  const { error } = await supabase
    .from("projects")
    .update({
      title: data.title,
      tags: data.tags,
      link: data.link,
      description: data.description,
      cover_url: data.coverUrl,
    })
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) {
    console.error("updateProject", error);
    return { ok: false, message: GENERIC.update };
  }

  if (current.cover_url && current.cover_url !== data.coverUrl) {
    await removeCover(supabase, current.cover_url, user.id);
  }

  revalidate();
  return { ok: true };
}

export async function deleteProject(id: string): Promise<ProjectActionResult> {
  const { supabase, user } = await getContext();
  if (!user) return { ok: false, message: "Sua sessão expirou. Entre novamente." };

  const { data: deleted, error } = await supabase
    .from("projects")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)
    .select("cover_url")
    .maybeSingle();
  if (error || !deleted) {
    if (error) console.error("deleteProject", error);
    return { ok: false, message: GENERIC.delete };
  }

  await removeCover(supabase, deleted.cover_url, user.id);

  revalidate();
  return { ok: true };
}

/** Apaga uma capa enviada que não chegou a ser salva (ex.: erro ao salvar o projeto). */
export async function discardUploadedCover(coverUrl: string) {
  const { supabase, user } = await getContext();
  if (!user) return;
  const { count } = await supabase
    .from("projects")
    .select("id", { count: "exact", head: true })
    .eq("cover_url", coverUrl);
  if (count) return; // ainda é usada por algum projeto
  await removeCover(supabase, coverUrl, user.id);
}
