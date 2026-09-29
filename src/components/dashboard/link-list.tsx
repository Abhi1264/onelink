"use client";

import { useState } from "react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Link2 } from "lucide-react";
import type { Link } from "@/lib/db/schema";
import { reorderLinks } from "@/app/actions/links";
import { SortableLink } from "./sortable-link";

export function LinkList({ links }: { links: Link[] }) {
  const [items, setItems] = useState(links);
  const [synced, setSynced] = useState(links);
  if (links !== synced) {
    setSynced(links);
    setItems(links);
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = async ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    const previous = items;
    const next = arrayMove(items, items.findIndex((l) => l.id === active.id), items.findIndex((l) => l.id === over.id));
    setItems(next);
    try {
      await reorderLinks(next.map((l) => l.id));
    } catch {
      setItems(previous);
    }
  };

  if (items.length === 0) {
    return (
      <div className="rounded-xl border bg-card px-6 py-12 text-center">
        <span className="mx-auto grid size-10 place-items-center rounded-full bg-muted text-muted-foreground">
          <Link2 className="size-5" />
        </span>
        <p className="mt-4 font-medium">No links yet</p>
        <p className="mt-1 text-sm text-muted-foreground">Add your first link and it shows up on your page right away.</p>
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <ul className="divide-y rounded-xl border bg-card">
          {items.map((link) => (
            <SortableLink key={link.id} link={link} />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}
