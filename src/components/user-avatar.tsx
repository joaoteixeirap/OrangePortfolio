import Avatar from "@mui/material/Avatar";
import { fullName, initials, type Author } from "@/lib/projects";
import { brand } from "@/theme/theme";

type UserAvatarProps = {
  person: Pick<Author, "nome" | "sobrenome" | "avatar_url">;
  size: number;
  /** Quando o nome já aparece ao lado, a imagem é decorativa. */
  decorative?: boolean;
};

/** Foto da pessoa ou, sem foto, as iniciais em fundo laranja. */
export default function UserAvatar({ person, size, decorative = false }: UserAvatarProps) {
  const name = fullName(person);
  return (
    <Avatar
      src={person.avatar_url ?? undefined}
      alt={decorative ? "" : `Foto de ${name}`}
      aria-hidden={decorative && !person.avatar_url ? true : undefined}
      slotProps={{ img: { referrerPolicy: "no-referrer", loading: "lazy" } }}
      sx={{
        width: size,
        height: size,
        fontSize: size * 0.4,
        fontWeight: 500,
        bgcolor: brand.secondary70,
        color: brand.principal100,
      }}
    >
      {initials(person)}
    </Avatar>
  );
}
