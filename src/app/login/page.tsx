import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth, googleEnabled } from "@/lib/auth";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage() {
  if (await auth.api.getSession({ headers: await headers() })) redirect("/admin");
  return <LoginForm googleEnabled={googleEnabled} />;
}
