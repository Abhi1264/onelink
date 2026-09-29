"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LinkForm({
  defaultValues,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  defaultValues?: { title: string; url: string };
  submitLabel: string;
  onSubmit: (values: { title: string; url: string }) => Promise<{ error?: string }>;
  onCancel: () => void;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setPending(true);
    const { error = "" } = await onSubmit({ title: String(data.get("title")), url: String(data.get("url")) });
    setPending(false);
    setError(error);
    if (!error && !defaultValues) {
      form.reset();
      (form.elements.namedItem("title") as HTMLInputElement).focus();
    }
  };

  return (
    <form onSubmit={handleSubmit} onKeyDown={(e) => e.key === "Escape" && onCancel()} className="space-y-3">
      <div className="grid gap-2 sm:grid-cols-[2fr_3fr]">
        <Input name="title" aria-label="Title" placeholder="Title" defaultValue={defaultValues?.title} maxLength={100} required autoFocus className="h-10" />
        <Input
          name="url"
          aria-label="URL"
          placeholder="example.com"
          defaultValue={defaultValues?.url}
          inputMode="url"
          autoCapitalize="none"
          spellCheck={false}
          required
          aria-invalid={!!error}
          className="h-10 font-mono text-sm"
        />
      </div>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={pending}>
          {pending && <Loader2 className="animate-spin" />}
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
