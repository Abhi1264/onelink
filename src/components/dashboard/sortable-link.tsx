"use client";

import { useOptimistic, useState, useTransition } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Loader2, Pencil, Trash2 } from "lucide-react";
import type { Link } from "@/lib/db/schema";
import { deleteLink, updateLink } from "@/app/actions/links";
import { getHostname } from "@/lib/utils/url";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { LinkForm } from "./link-form";

export function SortableLink({ link }: { link: Link }) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({ id: link.id });
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [enabled, setEnabled] = useOptimistic(link.isEnabled);
  const [, startTransition] = useTransition();

  const toggle = () =>
    startTransition(async () => {
      setEnabled(!enabled);
      await updateLink(link.id, { isEnabled: !enabled });
    });

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className={`relative bg-card first:rounded-t-xl last:rounded-b-xl ${isDragging ? "z-10 shadow-lg ring-1 ring-border" : ""}`}
    >
      {editing ? (
        <div className="p-4">
          <LinkForm
            defaultValues={link}
            submitLabel="Save"
            onCancel={() => setEditing(false)}
            onSubmit={async (values) => {
              const result = await updateLink(link.id, values);
              if (!result.error) setEditing(false);
              return result;
            }}
          />
        </div>
      ) : (
        <div className="flex items-center gap-1 py-3 pr-3 pl-1 sm:gap-2">
          <button
            ref={setActivatorNodeRef}
            {...attributes}
            {...listeners}
            aria-label={`Reorder ${link.title}`}
            className="grid h-10 w-8 shrink-0 cursor-grab touch-none place-items-center rounded-md text-muted-foreground/60 hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none active:cursor-grabbing"
          >
            <GripVertical className="size-4" />
          </button>

          <div className={`min-w-0 flex-1 transition-opacity ${enabled ? "" : "opacity-50"}`}>
            <p className="truncate text-sm font-medium">{link.title}</p>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block truncate font-mono text-xs text-muted-foreground hover:text-foreground hover:underline"
            >
              {getHostname(link.url)}
            </a>
          </div>

          <span className="hidden shrink-0 text-xs text-muted-foreground tabular-nums sm:block" title="Clicks">
            {link.clicks.toLocaleString()} {link.clicks === 1 ? "click" : "clicks"}
          </span>

          <button
            role="switch"
            aria-checked={enabled}
            aria-label={enabled ? `Hide ${link.title}` : `Show ${link.title}`}
            onClick={toggle}
            className="relative mx-1 inline-flex h-5 w-9 shrink-0 items-center rounded-full bg-input transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none aria-checked:bg-success"
          >
            <span className={`size-4 rounded-full bg-white shadow-sm transition-transform ${enabled ? "translate-x-4.5" : "translate-x-0.5"}`} />
          </button>

          <Button variant="ghost" size="icon-sm" aria-label={`Edit ${link.title}`} onClick={() => setEditing(true)} className="text-muted-foreground">
            <Pencil />
          </Button>

          <AlertDialog>
            <AlertDialogTrigger
              render={<Button variant="ghost" size="icon-sm" aria-label={`Delete ${link.title}`} className="text-muted-foreground hover:text-destructive" />}
            >
              <Trash2 />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete “{link.title}”?</AlertDialogTitle>
                <AlertDialogDescription>
                  It’ll be removed from your page along with its {link.clicks.toLocaleString()} recorded clicks. This can’t be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  disabled={deleting}
                  onClick={async () => {
                    setDeleting(true);
                    await deleteLink(link.id);
                  }}
                >
                  {deleting && <Loader2 className="animate-spin" />}
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </li>
  );
}
