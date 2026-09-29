"use client";

import { ArrowUpRight } from "lucide-react";
import type { Link } from "@/lib/db/schema";
import { getHostname } from "@/lib/utils/url";

export function ProfileLink({ link }: { link: Link }) {
  const track = () => navigator.sendBeacon("/api/track-click", new Blob([JSON.stringify({ linkId: link.id })], { type: "application/json" }));

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={track}
      className="group flex min-h-14 items-center gap-3 rounded-2xl border bg-card px-5 py-3 shadow-xs transition-[transform,box-shadow,border-color] duration-150 hover:-translate-y-px hover:border-foreground/20 hover:shadow-md focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none active:translate-y-0"
    >
      <span className="min-w-0 flex-1">
        <span className="block truncate font-medium">{link.title}</span>
        <span className="block truncate text-xs text-muted-foreground">{getHostname(link.url)}</span>
      </span>
      <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" />
    </a>
  );
}
