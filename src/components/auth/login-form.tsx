"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import { login, type LoginState } from "@/app/(auth)/actions";
import AuthLayout from "@/components/auth/auth-layout";
import GoogleButton from "@/components/auth/google-button";
import PasswordField from "@/components/auth/password-field";
import { NoticeAlert, type NoticeMessage } from "@/components/feedback/notice";

const callbackErrors: Record<string, string> = {
  auth: "Ocorreu um erro ao tentar realizar o login.",
  confirmacao: "Link de confirmação inválido ou expirado. Faça login ou cadastre-se de novo.",
};

export default function LoginForm({ next, error }: { next?: string; error?: string }) {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(login, {
    status: "idle",
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notice, setNotice] = useState<NoticeMessage | null>(
    error && callbackErrors[error] ? { severity: "error", text: callbackErrors[error] } : null,
  );

  useEffect(() => {
    if (state.status === "error" && state.message) {
      setNotice({ severity: "error", text: state.message });
    }
  }, [state]);

  return (
    <AuthLayout
      illustration="login"
      notice={notice && <NoticeAlert notice={notice} onClose={() => setNotice(null)} />}
    >
      <h1 className="text-center text-2xl text-principal-90 sm:text-4xl lg:-mx-10 lg:whitespace-nowrap xl:text-5xl">
        Entre no Orange Portfólio
      </h1>

      <div className="mt-8 flex justify-center sm:mt-10">
        <GoogleButton next={next} onError={(text) => setNotice({ severity: "error", text })} />
      </div>

      <form action={formAction} noValidate className="mt-10 flex flex-col gap-4 sm:mt-12">
        <h2 className="mb-2 text-base text-neutral-110 sm:text-2xl">Faça login com email</h2>
        {next && <input type="hidden" name="next" value={next} />}

        <TextField
          label="Email address"
          name="email"
          type="email"
          autoComplete="email"
          fullWidth
          slotProps={{ htmlInput: { "aria-required": true } }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={Boolean(state.errors?.email)}
          helperText={state.errors?.email}
        />
        <PasswordField
          label="Password"
          name="password"
          autoComplete="current-password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={Boolean(state.errors?.password)}
          helperText={state.errors?.password}
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          disabled={pending}
          sx={{ mt: 0.5, height: 42 }}
        >
          {pending ? <CircularProgress size={22} color="inherit" aria-label="Entrando" /> : "Entrar"}
        </Button>

        <Link
          href="/registro"
          className="self-start text-base text-neutral-100 hover:text-neutral-110 hover:underline"
        >
          Cadastre-se
        </Link>
      </form>
    </AuthLayout>
  );
}
