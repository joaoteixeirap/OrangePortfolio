"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import { register, type RegisterState } from "@/app/(auth)/actions";
import AuthLayout from "@/components/auth/auth-layout";
import PasswordField from "@/components/auth/password-field";
import { NoticeAlert, type NoticeMessage } from "@/components/feedback/notice";

const empty = { nome: "", sobrenome: "", email: "", password: "" };

export default function RegisterForm() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState<RegisterState, FormData>(register, {
    status: "idle",
  });
  const [values, setValues] = useState(empty);
  const [notice, setNotice] = useState<NoticeMessage | null>(null);

  useEffect(() => {
    if (state.status === "success") {
      setNotice({
        severity: "success",
        text: "Cadastro feito com sucesso",
        detail: state.needsConfirmation
          ? "Enviamos um link de confirmação para o seu e-mail."
          : undefined,
      });
      if (state.needsConfirmation) {
        setValues(empty);
      } else {
        const timer = setTimeout(() => router.push("/meus-projetos"), 1500);
        return () => clearTimeout(timer);
      }
    } else if (state.status === "error" && state.message) {
      setNotice({ severity: "error", text: state.message });
    } else if (state.status === "error") {
      setNotice({ severity: "error", text: "Ocorreu um erro ao tentar realizar o cadastro" });
    }
  }, [state, router]);

  const field = (name: keyof typeof empty) => ({
    name,
    value: values[name],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      setValues((v) => ({ ...v, [name]: e.target.value })),
    error: Boolean(state.errors?.[name]),
    helperText: state.errors?.[name],
    required: name === "nome" || name === "sobrenome", // asterisco só onde o Figma mostra
    slotProps: { htmlInput: { "aria-required": true } },
    fullWidth: true,
  });

  return (
    <AuthLayout
      illustration="cadastro"
      notice={notice && <NoticeAlert notice={notice} onClose={() => setNotice(null)} />}
    >
      <h1 className="text-center text-2xl text-principal-90 sm:text-4xl xl:text-5xl">
        Cadastre-se
      </h1>

      <form action={formAction} noValidate className="mt-10 flex flex-col gap-4 sm:mt-12">
        <div className="flex flex-col gap-4 sm:flex-row">
          <TextField label="Nome" autoComplete="given-name" {...field("nome")} />
          <TextField label="Sobrenome" autoComplete="family-name" {...field("sobrenome")} />
        </div>
        <TextField label="Email address" type="email" autoComplete="email" {...field("email")} />
        <PasswordField label="Password" autoComplete="new-password" {...field("password")} />

        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          disabled={pending}
          sx={{ mt: 0.5, height: 42 }}
        >
          {pending ? (
            <CircularProgress size={22} color="inherit" aria-label="Cadastrando" />
          ) : (
            "Cadastrar"
          )}
        </Button>

        <p className="text-base text-neutral-100">
          Já tem conta?{" "}
          <Link href="/login" className="text-neutral-110 underline-offset-2 hover:underline">
            Entrar
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
