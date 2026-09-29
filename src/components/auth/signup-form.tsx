"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { signUp } from "@/lib/auth/client";
import { isUsernameTaken } from "@/app/actions/username";
import { usernameError } from "@/lib/username";
import { getProfileHost } from "@/lib/utils/url";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthLayout, FormError, GoogleButton, NETWORK_ERROR } from "./auth-layout";

export function SignUpForm({ googleEnabled, defaultUsername }: { googleEnabled: boolean; defaultUsername: string }) {
  const router = useRouter();
  const [username, setUsername] = useState(defaultUsername);
  const [usernameMessage, setUsernameMessage] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const validateUsername = async () => {
    const message = usernameError(username) ?? ((await isUsernameTaken(username)) ? "That username is taken." : "");
    setUsernameMessage(message);
    return !message;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setPending(true);
    setError("");

    if (!(await validateUsername())) {
      setPending(false);
      return;
    }

    const { error } = await signUp
      .email({ name: username, email: String(form.get("email")), password: String(form.get("password")) })
      .catch(() => ({ error: { code: undefined, message: NETWORK_ERROR } }));

    if (error) {
      setError(
        error.code === "USER_ALREADY_EXISTS"
          ? "An account with this email already exists. Sign in instead."
          : error.message || "Couldn't create your account. Try again.",
      );
      setPending(false);
      return;
    }
    router.replace("/admin");
    router.refresh();
  };

  return (
    <AuthLayout
      title="Create your page"
      description="Pick a username. It becomes your link."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-foreground underline-offset-4 hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormError>{error}</FormError>
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            name="username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value.toLowerCase().trim());
              setUsernameMessage("");
            }}
            onBlur={() => username && validateUsername()}
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            required
            autoFocus={!defaultUsername}
            aria-invalid={!!usernameMessage}
            aria-describedby="username-hint"
            className="h-10"
          />
          <p id="username-hint" className={`text-xs ${usernameMessage ? "text-destructive" : "text-muted-foreground"}`}>
            {usernameMessage || (
              <span className="font-mono">{getProfileHost(username || "yourname")}</span>
            )}
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" autoComplete="email" required autoFocus={!!defaultUsername} className="h-10" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
            aria-describedby="password-hint"
            className="h-10"
          />
          <p id="password-hint" className="text-xs text-muted-foreground">
            At least 8 characters.
          </p>
        </div>
        <Button type="submit" size="lg" className="w-full" disabled={pending}>
          {pending && <Loader2 className="animate-spin" />}
          Create account
        </Button>
      </form>
      {googleEnabled && <GoogleButton onError={setError} />}
    </AuthLayout>
  );
}
