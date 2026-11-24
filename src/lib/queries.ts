import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PROJECT_SELECT, type Project } from "@/lib/projects";
import type { Profile } from "@/lib/database.types";

export type SessionUser = { id: string; email: string };

/** Usuário logado (validado no servidor do Supabase). Redireciona se não houver. */
export const requireUser = cache(async (): Promise<SessionUser> => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) redirect("/login");
  return { id: data.user.id, email: data.user.email ?? "" };
});

export const getMyProfile = cache(async (): Promise<Profile> => {
  const user = await requireUser();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();
  if (error) throw new Error(`Erro ao carregar o perfil: ${error.message}`);
  // Contas criadas antes do trigger existir não têm perfil: usa um perfil vazio.
  return (
    data ?? {
      id: user.id,
      nome: user.email.split("@")[0] ?? "",
      sobrenome: "",
      pais: "Brasil",
      avatar_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  );
});

export async function getMyProjects(): Promise<Project[]> {
  const user = await requireUser();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select(PROJECT_SELECT)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  if (error) throw new Error(`Erro ao carregar os projetos: ${error.message}`);
  return data;
}

export async function getDiscoverProjects(limit = 120): Promise<Project[]> {
  await requireUser();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select(PROJECT_SELECT)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(`Erro ao carregar os projetos: ${error.message}`);
  return data;
}

/** Tags mais usadas na comunidade (sugestões do campo Tags). */
export async function getPopularTags(max = 30): Promise<string[]> {
  await requireUser();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("tags")
    .order("created_at", { ascending: false })
    .limit(500);
  if (error) return [];
  const counts = new Map<string, number>();
  for (const row of data) {
    for (const tag of row.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "pt-BR"))
    .slice(0, max)
    .map(([tag]) => tag);
}
