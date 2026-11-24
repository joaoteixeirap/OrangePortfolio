import { createClient } from "@/lib/supabase/client";
import { COVERS_BUCKET } from "@/lib/env";
import { ACCEPTED_COVER_TYPES, MAX_COVER_BYTES } from "@/lib/projects";

const MAX_INPUT_BYTES = 20 * 1024 * 1024;
const MAX_DIMENSION = 1920;
const EXT: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

export class CoverError extends Error {}

export function validateCoverFile(file: File) {
  if (!(ACCEPTED_COVER_TYPES as readonly string[]).includes(file.type)) {
    throw new CoverError("Use uma imagem JPG, PNG ou WebP.");
  }
  if (file.size > MAX_INPUT_BYTES) {
    throw new CoverError("A imagem é muito grande. Use um arquivo de até 20 MB.");
  }
}

/**
 * Reduz imagens grandes para no máximo 1920px e converte para WebP,
 * para caber no limite do bucket (5 MB) e carregar rápido.
 */
async function optimize(file: File): Promise<Blob> {
  if (file.size <= 1.5 * 1024 * 1024) {
    const bitmap = await createImageBitmap(file).catch(() => null);
    const fits = bitmap ? Math.max(bitmap.width, bitmap.height) <= MAX_DIMENSION : true;
    bitmap?.close();
    if (fits) return file;
  }

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", 0.86),
  );
  return blob ?? file;
}

/** Envia a capa para project-covers/<userId>/<uuid>.<ext> e devolve a URL pública. */
export async function uploadCover(file: File, userId: string): Promise<string> {
  validateCoverFile(file);
  const blob = await optimize(file);
  if (blob.size > MAX_COVER_BYTES) {
    throw new CoverError("Não foi possível reduzir a imagem para 5 MB. Escolha outra imagem.");
  }

  const type = blob.type || file.type;
  const path = `${userId}/${crypto.randomUUID()}.${EXT[type] ?? "jpg"}`;
  const supabase = createClient();
  const { error } = await supabase.storage.from(COVERS_BUCKET).upload(path, blob, {
    contentType: type,
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) {
    throw new CoverError("Ocorreu um erro ao enviar a imagem. Tente novamente.");
  }
  return supabase.storage.from(COVERS_BUCKET).getPublicUrl(path).data.publicUrl;
}
