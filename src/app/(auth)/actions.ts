"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSiteUrl, safeNextPath } from "@/lib/site-url";
import { fieldErrors, loginSchema, registerSchema, type FieldErrors } from "@/lib/validation";

export type LoginState = {
  status: "idle" | "error";
  message?: string;
  errors?: FieldErrors<"email" | "password">;
};

export type RegisterState = {
  status: "idle" | "error" | "success";
  message?: string;
  needsConfirmation?: boolean;
  errors?: FieldErrors<"nome" | "sobrenome" | "email" | "password">;
};

const text = (formData: FormData, key: string) => {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
};

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: text(formData, "email"),
    password: text(formData, "password"),
  });
  if (!parsed.success) {
    return { status: "error", errors: fieldErrors(parsed.error) };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    if (error.code === "email_not_confirmed") {
      return {
        status: "error",
        message: "Confirme seu e-mail pelo link que enviamos antes de entrar.",
      };
    }
    if (error.code === "invalid_credentials") {
      return { status: "error", message: "E-mail ou senha incorretos." };
    }
    return { status: "error", message: "Ocorreu um erro ao tentar realizar o login." };
  }

  redirect(safeNextPath(text(formData, "next")));
}

export async function register(_prev: RegisterState, formData: FormData): Promise<RegisterState> {
  const parsed = registerSchema.safeParse({
    nome: text(formData, "nome"),
    sobrenome: text(formData, "sobrenome"),
    email: text(formData, "email"),
    password: text(formData, "password"),
  });
  if (!parsed.success) {
    return { status: "error", errors: fieldErrors(parsed.error) };
  }

  const { nome, sobrenome, email, password } = parsed.data;
  const supabase = await createClient();
  const siteUrl = await getSiteUrl();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { nome, sobrenome },
      emailRedirectTo: `${siteUrl}/auth/callback`,
    },
  });

  if (error) {
    if (error.code === "user_already_exists" || error.code === "email_exists") {
      return { status: "error", message: "Este e-mail já está cadastrado. Faça login." };
    }
    if (error.code === "weak_password") {
      return { status: "error", errors: { password: "Escolha uma senha mais forte." } };
    }
    if (error.code === "over_email_send_rate_limit") {
      return {
        status: "error",
        message: "Muitas tentativas de cadastro. Aguarde alguns minutos e tente de novo.",
      };
    }
    return { status: "error", message: "Ocorreu um erro ao tentar realizar o cadastro." };
  }

  // Com confirmação de e-mail ativa, um e-mail já cadastrado volta sem identities.
  if (data.user && data.user.identities?.length === 0) {
    return { status: "error", message: "Este e-mail já está cadastrado. Faça login." };
  }

  return { status: "success", needsConfirmation: !data.session };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
