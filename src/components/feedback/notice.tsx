"use client";

import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline";
import ErrorOutline from "@mui/icons-material/ErrorOutline";
import { brand } from "@/theme/theme";

export type NoticeMessage = { severity: "success" | "error"; text: string; detail?: string };

const colors = {
  success: brand.success120,
  error: brand.error100,
} as const;

/** Alerta preenchido do style guide ("Cadastro feito com sucesso" / "Ocorreu um erro..."). */
export function NoticeAlert({ notice, onClose }: { notice: NoticeMessage; onClose?: () => void }) {
  return (
    <Alert
      variant="filled"
      severity={notice.severity}
      onClose={onClose}
      iconMapping={{
        success: <CheckCircleOutline fontSize="inherit" />,
        error: <ErrorOutline fontSize="inherit" />,
      }}
      sx={{
        bgcolor: colors[notice.severity],
        color: "#fff",
        fontSize: "1rem",
        alignItems: "center",
        minWidth: { sm: 320 },
        boxShadow: 2,
      }}
    >
      {notice.text}
      {notice.detail && (
        <span style={{ display: "block", fontSize: "0.875rem", opacity: 0.92 }}>
          {notice.detail}
        </span>
      )}
    </Alert>
  );
}

/** Snackbar no topo da tela para mensagens das telas logadas. */
export function NoticeSnackbar({
  notice,
  onClose,
}: {
  notice: NoticeMessage | null;
  onClose: () => void;
}) {
  return (
    <Snackbar
      open={notice !== null}
      autoHideDuration={6000}
      onClose={(_, reason) => reason !== "clickaway" && onClose()}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      sx={{ top: { xs: 80, sm: 88 } }}
    >
      {notice ? <NoticeAlert notice={notice} onClose={onClose} /> : undefined}
    </Snackbar>
  );
}
