"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { signIn } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthLayout, FormError, GoogleButton, NETWORK_ERROR } from "./auth-layout";

export function LoginForm({ googleEnabled }: { googleEnabled: boolean }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setPending(true);
    setError("");

    const { error } = await signIn
      .email({ email: String(form.get("email")), password: String(form.get("password")) })
      .catch(() => ({ error: { status: 0, message: NETWORK_ERROR } }));

    if (error) {
      setError(error.status === 401 ? "That email and password don't match." : error.message || "Something went wrong. Try again.");
      setPending(false);
      return;
    }
    router.replace("/admin");
    router.refresh();
  };

  return (
    <AuthLayout
      title="Welcome back"
      description="Sign in to manage your links."
      footer={
        <>
          New to Onelink?{" "}
          <Link href="/signup" className="font-medium text-foreground underline-offset-4 hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormError>{error}</FormError>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" autoComplete="email" required autoFocus className="h-10" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" autoComplete="current-password" required className="h-10" />
        </div>
        <Button type="submit" size="lg" className="w-full" disabled={pending}>
          {pending && <Loader2 className="animate-spin" />}
          Sign in
        </Button>
      </form>
      {googleEnabled && <GoogleButton onError={setError} />}
    </AuthLayout>
  );
}
