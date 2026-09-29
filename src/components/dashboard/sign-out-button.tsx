"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { signOut } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      className="text-muted-foreground"
      aria-label="Sign out"
      onClick={async () => {
        await signOut();
        router.replace("/login");
      }}
    >
      <LogOut />
      <span className="hidden sm:inline">Sign out</span>
    </Button>
  );
}
