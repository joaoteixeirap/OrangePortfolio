import CollectionsIcon from "@mui/icons-material/Collections";

/** Card "Adicione seu primeiro projeto" + dois cards fantasmas (desktop), como no protótipo. */
export function FirstProjectCard({ onAdd }: { onAdd: () => void }) {
  return (
    <>
      <button
        type="button"
        onClick={onAdd}
        className="flex aspect-[3/2] w-full flex-col items-center justify-center gap-4 rounded bg-neutral-70 px-8 text-left transition-colors hover:bg-[#DCE0EB]"
      >
        <CollectionsIcon sx={{ fontSize: 54, color: "#303133" }} aria-hidden />
        <span className="flex flex-col gap-4">
          <span className="text-base text-neutral-110 sm:text-lg">Adicione seu primeiro projeto</span>
          <span className="text-sm text-neutral-110 sm:text-base">
            Compartilhe seu talento com milhares de pessoas
          </span>
        </span>
      </button>
      <div aria-hidden="true" className="hidden aspect-[3/2] rounded bg-[#F7F8FB] sm:block" />
      <div aria-hidden="true" className="hidden aspect-[3/2] rounded bg-[#F7F8FB] lg:block" />
    </>
  );
}

export function NoResults({ query, onClear }: { query: string; onClear: () => void }) {
  return (
    <div className="col-span-full flex flex-col items-start gap-2 rounded bg-neutral-60 py-6 text-neutral-110">
      <p className="text-lg">Nenhum projeto encontrado com a tag “{query.trim()}”.</p>
      <button type="button" onClick={onClear} className="rounded text-info-90 underline underline-offset-2">
        Limpar busca
      </button>
    </div>
  );
}
