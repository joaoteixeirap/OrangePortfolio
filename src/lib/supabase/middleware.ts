import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/lib/database.types";
import { getSupabaseEnv } from "@/lib/env";

const PUBLIC_PATHS = ["/login", "/registro", "/auth", "/privacidade"];
const GUEST_ONLY_PATHS = ["/login", "/registro"];
export const HOME_PATH = "/meus-projetos";

const matches = (pathname: string, paths: string[]) =>
  paths.some((p) => pathname === p || pathname.startsWith(`${p}/`));

/**
 * Renova a sessão do Supabase a cada request e protege as rotas:
 * - sem sessão em rota privada -> /login?next=<rota>
 * - com sessão em /login ou /registro -> /meus-projetos
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const { url, publishableKey } = getSupabaseEnv();

  const supabase = createServerClient<Database>(url, publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  // Não colocar código entre createServerClient e getUser (recomendação do Supabase).
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname, search } = request.nextUrl;

  const redirectTo = (path: string, params?: Record<string, string>) => {
    const target = request.nextUrl.clone();
    target.pathname = path;
    target.search = "";
    Object.entries(params ?? {}).forEach(([k, v]) => target.searchParams.set(k, v));
    const redirect = NextResponse.redirect(target);
    // Preserva os cookies de sessão renovados.
    response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
    return redirect;
  };

  if (!user && !matches(pathname, PUBLIC_PATHS)) {
    const next = pathname === "/" ? undefined : `${pathname}${search}`;
    return redirectTo("/login", next ? { next } : undefined);
  }

  if (user && (pathname === "/" || matches(pathname, GUEST_ONLY_PATHS))) {
    return redirectTo(HOME_PATH);
  }

  return response;
}
