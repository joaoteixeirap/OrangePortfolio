import { z } from "zod";
import { MAX_TAGS, normalizeTags } from "@/lib/projects";

export const FIELD_ERROR = "Informe corretamente o campo";

/** Aceita "github.com/x" e completa com https://. Vazio vira null. */
export function normalizeLink(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return null;
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

const linkSchema = z
  .string()
  .max(500, "Link muito longo")
  .transform(normalizeLink)
  .refine((value) => {
    if (value === null) return true;
    try {
      const url = new URL(value);
      return (url.protocol === "https:" || url.protocol === "http:") && url.hostname.includes(".");
    } catch {
      return false;
    }
  }, "Informe um link válido, por exemplo https://github.com/voce/projeto");

export const projectInputSchema = z.object({
  title: z.string().trim().min(1, "Informe o título").max(100, "Use até 100 caracteres"),
  tags: z
    .array(z.string())
    .transform(normalizeTags)
    .refine((tags) => tags.length <= MAX_TAGS, `Use até ${MAX_TAGS} tags`),
  link: linkSchema,
  description: z.string().trim().max(2000, "Use até 2000 caracteres"),
  coverUrl: z.string().url().nullable(),
});

export type ProjectInput = z.input<typeof projectInputSchema>;
export type ProjectData = z.output<typeof projectInputSchema>;

export const loginSchema = z.object({
  email: z.string().trim().email(FIELD_ERROR),
  password: z.string().min(1, FIELD_ERROR),
});

export const registerSchema = z.object({
  nome: z.string().trim().min(1, FIELD_ERROR).max(50, "Use até 50 caracteres"),
  sobrenome: z.string().trim().min(1, FIELD_ERROR).max(50, "Use até 50 caracteres"),
  email: z.string().trim().email(FIELD_ERROR),
  password: z.string().min(6, "A senha precisa ter pelo menos 6 caracteres").max(72),
});

export type FieldErrors<K extends string> = Partial<Record<K, string>>;

export function fieldErrors<K extends string>(error: z.ZodError): FieldErrors<K> {
  const result: FieldErrors<K> = {};
  for (const issue of error.issues) {
    const key = issue.path[0] as K | undefined;
    if (key && !result[key]) result[key] = issue.message;
  }
  return result;
}
