import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth, googleEnabled } from "@/lib/auth";
import { SignUpForm } from "@/components/auth/signup-form";

export const metadata: Metadata = { title: "Create account" };

export default async function SignUpPage({ searchParams }: { searchParams: Promise<{ username?: string }> }) {
  if (await auth.api.getSession({ headers: await headers() })) redirect("/admin");
  const { username = "" } = await searchParams;
  return <SignUpForm googleEnabled={googleEnabled} defaultUsername={username.toLowerCase().trim()} />;
}
