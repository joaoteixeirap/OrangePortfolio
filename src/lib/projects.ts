import type { Profile, ProjectRow } from "@/lib/database.types";
import { COVERS_BUCKET } from "@/lib/env";

export type Author = Pick<Profile, "id" | "nome" | "sobrenome" | "avatar_url">;
export type Project = ProjectRow & { author: Author };

/** Colunas buscadas para exibir um projeto com a pessoa autora. */
export const PROJECT_SELECT =
  "id, user_id, title, description, link, tags, cover_url, created_at, updated_at, author:profiles!projects_user_id_fkey(id, nome, sobrenome, avatar_url)" as const;

export const MAX_TAGS = 8;
export const MAX_TAG_LENGTH = 24;
export const MAX_COVER_BYTES = 5 * 1024 * 1024;
export const ACCEPTED_COVER_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

export function fullName(person: Pick<Profile, "nome" | "sobrenome"> | null | undefined) {
  if (!person) return "";
  return [person.nome, person.sobrenome].filter(Boolean).join(" ").trim();
}

export function initials(person: Pick<Profile, "nome" | "sobrenome"> | null | undefined) {
  const parts = fullName(person).split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const first = parts[0][0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1][0] ?? "") : "";
  return (first + last).toUpperCase();
}

const monthYear = new Intl.DateTimeFormat("pt-BR", {
  month: "2-digit",
  year: "2-digit",
  timeZone: "America/Sao_Paulo",
});
const longDate = new Intl.DateTimeFormat("pt-BR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "America/Sao_Paulo",
});

/** "12/23", como no protótipo. */
export function formatMonthYear(iso: string) {
  return monthYear.format(new Date(iso));
}

/** "5 de dezembro de 2023", usado como texto acessível da data curta. */
export function formatLongDate(iso: string) {
  return longDate.format(new Date(iso));
}

export function normalizeTag(tag: string) {
  return tag.replace(/^#/, "").replace(/\s+/g, " ").trim().slice(0, MAX_TAG_LENGTH);
}

/** Remove vazias e duplicadas (sem diferenciar maiúsculas) e limita a quantidade. */
export function normalizeTags(tags: string[]) {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const raw of tags) {
    const tag = normalizeTag(raw);
    const key = tag.toLocaleLowerCase("pt-BR");
    if (!tag || seen.has(key)) continue;
    seen.add(key);
    result.push(tag);
    if (result.length === MAX_TAGS) break;
  }
  return result;
}

const fold = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLocaleLowerCase("pt-BR")
    .trim();

/**
 * Filtra por tags. Aceita várias tags separadas por vírgula ou espaço;
 * o projeto precisa ter todas (cada termo casa com o início ou parte de uma tag).
 * Ignora acentos e maiúsculas.
 */
export function filterByTags<T extends Pick<ProjectRow, "tags">>(projects: T[], query: string) {
  const terms = query.split(/[,\s]+/).map(fold).filter(Boolean);
  if (terms.length === 0) return projects;
  return projects.filter((project) => {
    const tags = project.tags.map(fold);
    return terms.every((term) => tags.some((tag) => tag.includes(term)));
  });
}

/** URL pública de um arquivo do bucket de capas. */
export function coverPublicUrl(supabaseUrl: string, path: string) {
  return `${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/public/${COVERS_BUCKET}/${path}`;
}

/** Caminho no bucket a partir da URL pública, ou null se a URL não for do bucket. */
export function coverPathFromUrl(supabaseUrl: string, url: string | null | undefined) {
  if (!url) return null;
  const prefix = coverPublicUrl(supabaseUrl, "");
  if (!url.startsWith(prefix)) return null;
  const path = decodeURIComponent(url.slice(prefix.length).split("?")[0]);
  return path && !path.includes("..") ? path : null;
}
