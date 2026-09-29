import Link from "next/link";
import { Link2 } from "lucide-react";

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="inline-flex items-center gap-2 font-semibold tracking-tight">
      <span className="grid size-7 place-items-center rounded-lg bg-primary text-primary-foreground">
        <Link2 className="size-4" strokeWidth={2.25} />
      </span>
      Onelink
    </Link>
  );
}
