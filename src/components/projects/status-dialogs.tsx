"use client";

import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import CheckCircle from "@mui/icons-material/CheckCircle";
import { brand } from "@/theme/theme";

const paperSx = { bgcolor: brand.neutral60, width: "100%", maxWidth: 440, m: 2 } as const;

/** "Projeto adicionado/Edição concluída/Projeto deletado com sucesso!" */
export function SuccessDialog({
  open,
  message,
  onClose,
}: {
  open: boolean;
  message: string;
  onClose: () => void;
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="sucesso-titulo"
      slotProps={{ paper: { sx: paperSx } }}
    >
      <div className="flex flex-col items-center gap-6 px-8 py-10 text-center sm:px-12">
        <h2 id="sucesso-titulo" className="text-2xl text-neutral-110 sm:text-[1.75rem] sm:leading-snug">
          {message}
        </h2>
        <CheckCircle sx={{ fontSize: 56, color: brand.success110 }} aria-hidden />
        <Button variant="contained" size="large" onClick={onClose} autoFocus sx={{ px: 4 }}>
          Voltar para projetos
        </Button>
      </div>
    </Dialog>
  );
}

/** "Deseja Excluir?" */
export function DeleteConfirmDialog({
  open,
  pending,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  pending: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Dialog
      open={open}
      onClose={pending ? undefined : onCancel}
      aria-labelledby="excluir-titulo"
      aria-describedby="excluir-descricao"
      slotProps={{ paper: { sx: { ...paperSx, maxWidth: 520 } } }}
    >
      <div className="flex flex-col gap-6 px-8 py-10 sm:px-12">
        <h2 id="excluir-titulo" className="text-2xl text-neutral-110 sm:text-[1.75rem]">
          Deseja Excluir?
        </h2>
        <p id="excluir-descricao" className="text-base text-neutral-120 sm:text-lg">
          Se você prosseguir irá excluir o projeto do seu portfólio
        </p>
        <div className="flex gap-4">
          <Button variant="contained" size="large" onClick={onConfirm} disabled={pending} sx={{ minWidth: 112 }}>
            {pending ? <CircularProgress size={22} color="inherit" aria-label="Excluindo" /> : "Excluir"}
          </Button>
          <Button variant="neutral" size="large" onClick={onCancel} disabled={pending} autoFocus>
            Cancelar
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
