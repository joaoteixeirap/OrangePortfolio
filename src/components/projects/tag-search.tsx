"use client";

import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import CloseIcon from "@mui/icons-material/Close";

type TagSearchProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  resultCount: number;
  total: number;
  /** Largura máxima do campo (Meus projetos é mais estreito que Descobrir no Figma). */
  maxWidth?: number;
};

/** Campo "Buscar tags" do protótipo, com contagem anunciada para leitores de tela. */
export default function TagSearch({ id, value, onChange, resultCount, total, maxWidth = 722 }: TagSearchProps) {
  const hasQuery = value.trim().length > 0;
  return (
    <div className="w-full" style={{ maxWidth }}>
      <TextField
        id={id}
        label="Buscar tags"
        type="search"
        fullWidth
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape" && hasQuery) {
            e.preventDefault();
            onChange("");
          }
        }}
        autoComplete="off"
        slotProps={{
          htmlInput: { "aria-describedby": `${id}-status` },
          input: {
            endAdornment: hasQuery ? (
              <InputAdornment position="end">
                <IconButton aria-label="Limpar busca" onClick={() => onChange("")} edge="end">
                  <CloseIcon />
                </IconButton>
              </InputAdornment>
            ) : undefined,
          },
        }}
        sx={{
          // remove o "x" nativo do input type=search (já há o botão Limpar)
          "& input::-webkit-search-cancel-button": { display: "none" },
        }}
      />
      <p id={`${id}-status`} className="sr-only" aria-live="polite">
        {hasQuery
          ? `${resultCount} de ${total} projetos com as tags buscadas`
          : `${total} projetos`}
      </p>
    </div>
  );
}
