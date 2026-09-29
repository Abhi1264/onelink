import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { ArrowUpRight } from "lucide-react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { links as linksTable } from "@/lib/db/schema";
import { getProfileHost, getProfileUrl } from "@/lib/utils/url";
import { buttonVariants } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { CopyButton } from "@/components/dashboard/copy-button";
import { SignOutButton } from "@/components/dashboard/sign-out-button";
import { CreateLinkForm } from "@/components/dashboard/create-link-form";
import { LinkList } from "@/components/dashboard/link-list";

export const metadata: Metadata = { title: "Dashboard" };

export default async function AdminPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const { name } = session.user;
  const links = await db.select().from(linksTable).where(eq(linksTable.userId, session.user.id)).orderBy(linksTable.order);
  const liveCount = links.filter((l) => l.isEnabled).length;
  const totalClicks = links.reduce((sum, l) => sum + l.clicks, 0);
  const top = links.reduce<(typeof links)[number] | undefined>((best, l) => (l.clicks > (best?.clicks ?? 0) ? l : best), undefined);
  const profileUrl = getProfileUrl(name);

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4 sm:px-6">
          <Logo href="/admin" />
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-10 px-4 py-8 sm:px-6 sm:py-12">
        <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="text-sm text-muted-foreground">Your page</p>
            <h1 className="mt-1 truncate font-mono text-xl font-medium sm:text-2xl">{getProfileHost(name)}</h1>
          </div>
          <div className="flex gap-2">
            <CopyButton value={profileUrl} />
            <a href={profileUrl} target="_blank" rel="noopener noreferrer" className={buttonVariants({ variant: "outline" })}>
              Open
              <ArrowUpRight />
            </a>
          </div>
        </section>

        <section className="grid grid-cols-2 rounded-xl border bg-card sm:grid-cols-3 sm:divide-x">
          <Stat label="Live links" value={`${liveCount}`} hint={`of ${links.length}`} />
          <Stat label="Total clicks" value={totalClicks.toLocaleString()} className="border-l sm:border-l-0" />
          <Stat
            label="Top link"
            value={top?.title ?? "—"}
            hint={top ? `${top.clicks.toLocaleString()} clicks` : "No clicks yet"}
            className="col-span-2 border-t sm:col-span-1 sm:border-t-0"
            truncate
          />
        </section>

        <section className="space-y-4">
          <div className="flex items-baseline justify-between">
            <h2 className="text-lg font-semibold">Links</h2>
            {links.length > 1 && <p className="text-sm text-muted-foreground">Drag to reorder</p>}
          </div>
          <CreateLinkForm />
          <LinkList links={links} />
        </section>
      </main>
    </div>
  );
}

function Stat({
  label,
  value,
  hint,
  className = "",
  truncate,
}: {
  label: string;
  value: string;
  hint?: string;
  className?: string;
  truncate?: boolean;
}) {
  return (
    <div className={`min-w-0 p-4 sm:p-5 ${className}`}>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className={`mt-1.5 text-2xl font-semibold tabular-nums ${truncate ? "truncate text-base leading-8" : ""}`}>{value}</p>
      {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
