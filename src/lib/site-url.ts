import "server-only";
import { headers } from "next/headers";

/** URL base do site: NEXT_PUBLIC_SITE_URL ou o host da requisição atual. */
export async function getSiteUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, "");

  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

/** Aceita só caminhos internos ("/x"), nunca "//host" ou URLs absolutas. */
export function safeNextPath(next: string | null | undefined, fallback = "/meus-projetos") {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) {
    return fallback;
  }
  return next;
}
