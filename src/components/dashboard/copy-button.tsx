"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Button variant="outline" onClick={copy} aria-live="polite">
      {copied ? <Check className="text-success" /> : <Copy />}
      {copied ? "Copied" : "Copy link"}
    </Button>
  );
}
