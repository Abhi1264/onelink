import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-4 text-center">
      <p className="font-mono text-sm text-muted-foreground">404</p>
      <h1 className="mt-3 text-2xl font-semibold">This page doesn’t exist</h1>
      <p className="mt-2 max-w-sm text-muted-foreground">The username may have changed, or the link has a typo. It might also be available to claim.</p>
      <div className="mt-8 flex gap-2">
        <Link href="/" className={buttonVariants({ variant: "outline" })}>
          Go home
        </Link>
        <Link href="/signup" className={buttonVariants()}>
          Claim a username
        </Link>
      </div>
    </main>
  );
}
