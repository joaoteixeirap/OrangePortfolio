import Chip from "@mui/material/Chip";

type TagChipsProps = {
  tags: string[];
  max?: number;
  size?: "small" | "medium";
  onTagClick?: (tag: string) => void;
  className?: string;
};

/** Tags como chips "Default" do style guide. Clicáveis quando há onTagClick. */
export default function TagChips({ tags, max, size = "medium", onTagClick, className }: TagChipsProps) {
  if (tags.length === 0) return null;
  const visible = max ? tags.slice(0, max) : tags;
  const hidden = tags.length - visible.length;

  return (
    <ul className={`flex flex-wrap items-center gap-2 ${className ?? ""}`} aria-label="Tags">
      {visible.map((tag) => (
        <li key={tag}>
          <Chip
            label={tag}
            size={size}
            onClick={onTagClick ? () => onTagClick(tag) : undefined}
            aria-label={onTagClick ? `Filtrar pela tag ${tag}` : undefined}
          />
        </li>
      ))}
      {hidden > 0 && (
        <li>
          <Chip
            label={`+${hidden}`}
            size={size}
            title={tags.slice(visible.length).join(", ")}
            aria-label={`Mais ${hidden} tags: ${tags.slice(visible.length).join(", ")}`}
          />
        </li>
      )}
    </ul>
  );
}
