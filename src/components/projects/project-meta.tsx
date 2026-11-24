import UserAvatar from "@/components/user-avatar";
import { formatLongDate, formatMonthYear, fullName, type Author } from "@/lib/projects";

/** "avatar  Camila Soares • 12/23" (linha abaixo do card). */
export default function ProjectMeta({ author, createdAt }: { author: Author; createdAt: string }) {
  return (
    <div className="flex min-w-0 items-center gap-2 text-base text-neutral-110">
      <UserAvatar person={author} size={24} decorative />
      <span className="truncate">{fullName(author)}</span>
      <span aria-hidden="true">•</span>
      <time dateTime={createdAt} title={formatLongDate(createdAt)} className="shrink-0">
        <span className="sr-only">{formatLongDate(createdAt)}</span>
        <span aria-hidden="true">{formatMonthYear(createdAt)}</span>
      </time>
    </div>
  );
}
