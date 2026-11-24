"use client";

import { useEffect } from "react";
import Button from "@mui/material/Button";

export default function AppError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center gap-6 py-28 text-center">
      <h1 className="text-2xl text-neutral-120">Ocorreu um erro ao carregar esta página</h1>
      <p className="text-neutral-110">Verifique sua conexão e tente novamente.</p>
      <Button variant="contained" onClick={reset}>
        Tentar novamente
      </Button>
    </div>
  );
}
