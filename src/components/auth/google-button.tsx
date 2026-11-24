"use client";

import { useState } from "react";
import Image from "next/image";
import ButtonBase from "@mui/material/ButtonBase";
import CircularProgress from "@mui/material/CircularProgress";
import { createClient } from "@/lib/supabase/client";

type GoogleButtonProps = {
  next?: string;
  onError: (message: string) => void;
};

/** Botão "Entrar com Google" do style guide (branco, sombra leve). */
export default function GoogleButton({ next, onError }: GoogleButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    const supabase = createClient();
    const callback = new URL("/auth/callback", window.location.origin);
    if (next) callback.searchParams.set("next", next);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: callback.toString() },
    });
    if (error) {
      setLoading(false);
      onError("Ocorreu um erro ao tentar entrar com o Google.");
    }
    // Sem erro, o navegador é redirecionado para o Google.
  }

  return (
    <ButtonBase
      onClick={handleClick}
      disabled={loading}
      className="flex h-[42px] items-center gap-3 rounded bg-white pl-2 pr-4 text-[15px] font-medium text-[#757575]"
      sx={{
        boxShadow: "0 1px 1px rgba(0,0,0,0.14), 0 0 1px rgba(0,0,0,0.08), 0 2px 3px rgba(0,0,0,0.1)",
        letterSpacing: "0.2px",
        "&:hover": { boxShadow: "0 0 0 2px rgba(66,133,244,0.35)" },
        "&:active": { backgroundColor: "#EEEEEE" },
        "&.Mui-focusVisible": { outline: "3px solid #315FCE", outlineOffset: 2 },
        "&.Mui-disabled": { color: "#9E9E9E" },
      }}
    >
      <span className="flex h-6 w-6 items-center justify-center">
        {loading ? (
          <CircularProgress size={18} aria-label="Conectando ao Google" />
        ) : (
          <Image src="/icon_google.svg" width={20} height={20} alt="" />
        )}
      </span>
      <span className="pl-4">Entrar com Google</span>
    </ButtonBase>
  );
}
