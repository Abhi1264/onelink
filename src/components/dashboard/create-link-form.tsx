"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { createLink } from "@/app/actions/links";
import { LinkForm } from "./link-form";

export function CreateLinkForm() {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-dashed text-sm font-medium text-muted-foreground transition-colors hover:border-foreground/30 hover:bg-card hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
      >
        <Plus className="size-4" />
        Add link
      </button>
    );
  }

  return (
    <div className="rounded-xl border bg-card p-4">
      <LinkForm submitLabel="Add link" onSubmit={createLink} onCancel={() => setOpen(false)} />
    </div>
  );
}
