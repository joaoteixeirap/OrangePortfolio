import Image from "next/image";
import CollectionsIcon from "@mui/icons-material/Collections";

type ProjectCoverProps = {
  src: string | null;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
};

/** Capa 3:2. URLs blob: (prévia local do upload) não passam pelo otimizador. */
export default function ProjectCover({ src, alt, sizes, priority, className }: ProjectCoverProps) {
  return (
    <div className={`relative aspect-[3/2] w-full overflow-hidden bg-neutral-70 ${className ?? ""}`}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          unoptimized={src.startsWith("blob:")}
          className="object-cover"
        />
      ) : (
        <div className="flex h-full items-center justify-center text-neutral-110" role="img" aria-label={alt}>
          <CollectionsIcon sx={{ fontSize: 56 }} />
        </div>
      )}
    </div>
  );
}
