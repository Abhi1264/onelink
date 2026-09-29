import type { Metadata } from "next";
import { cache } from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { user, links } from "@/lib/db/schema";
import { ProfileLink } from "@/components/profile/profile-link";
import { ThemeToggle } from "@/components/theme-toggle";

interface PageProps {
  params: Promise<{ domain: string }>;
}

const getProfile = cache(async (username: string) => {
  const [found] = await db.select().from(user).where(eq(user.name, username)).limit(1);
  if (!found) return null;
  const userLinks = await db
    .select()
    .from(links)
    .where(and(eq(links.userId, found.id), eq(links.isEnabled, true)))
    .orderBy(links.order);
  return { user: found, links: userLinks };
});

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const profile = await getProfile((await params).domain);
  if (!profile) return { title: "Page not found" };

  const { name, image } = profile.user;
  const images = image ? [image] : [];
  return {
    title: `@${name}`,
    description: `All of @${name}'s links in one place.`,
    openGraph: { title: `@${name}`, images },
    twitter: { card: "summary", title: `@${name}`, images },
  };
}

export default async function ProfilePage({ params }: PageProps) {
  const profile = await getProfile((await params).domain);
  if (!profile) notFound();
  const { user: owner, links: profileLinks } = profile;

  return (
    <div className="flex min-h-dvh flex-col">
      <div className="flex justify-end p-3">
        <ThemeToggle />
      </div>

      <main className="mx-auto w-full max-w-md flex-1 px-5 pt-4 pb-16">
        <header className="flex flex-col items-center text-center">
          {owner.image ? (
            <Image src={owner.image} alt="" width={88} height={88} priority className="size-22 rounded-full object-cover ring-1 ring-border" />
          ) : (
            <span className="grid size-22 place-items-center rounded-full bg-primary text-3xl font-semibold text-primary-foreground" aria-hidden>
              {owner.name.charAt(0).toUpperCase()}
            </span>
          )}
          <h1 className="mt-4 text-xl font-semibold">@{owner.name}</h1>
        </header>

        {profileLinks.length > 0 ? (
          <ul className="mt-8 space-y-3">
            {profileLinks.map((link) => (
              <li key={link.id}>
                <ProfileLink link={link} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-10 text-center text-sm text-muted-foreground">Nothing here yet. Check back soon.</p>
        )}
      </main>

      <footer className="pb-8 text-center">
        <a
          href={process.env.NEXT_PUBLIC_APP_URL || "/"}
          className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Made with Onelink
        </a>
      </footer>
    </div>
  );
}
