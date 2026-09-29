"use server";

import { db } from "@/lib/db";
import { links } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { normalizeUrl } from "@/lib/utils/url";
import { headers } from "next/headers";
import { eq, and, max } from "drizzle-orm";
import { revalidatePath } from "next/cache";

type LinkInput = { title?: string; url?: string; isEnabled?: boolean };
type Result = { error?: string };

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");
  return session.user.id;
}

/** Returns the sanitized fields, or an error message string. */
function parse(input: LinkInput): LinkInput | string {
  const data: LinkInput = {};
  if (input.title !== undefined) {
    data.title = input.title.trim().slice(0, 100);
    if (!data.title) return "Add a title.";
  }
  if (input.url !== undefined) {
    const url = normalizeUrl(input.url);
    if (!url) return "Enter a valid web address, like example.com.";
    data.url = url;
  }
  if (input.isEnabled !== undefined) data.isEnabled = !!input.isEnabled;
  return data;
}

export async function createLink(input: { title: string; url: string }): Promise<Result> {
  const userId = await getUserId();
  const data = parse(input);
  if (typeof data === "string") return { error: data };

  const [{ top }] = await db.select({ top: max(links.order) }).from(links).where(eq(links.userId, userId));
  const { title, url } = data as Required<LinkInput>;
  await db.insert(links).values({ title, url, userId, order: (top ?? -1) + 1 });
  revalidatePath("/admin");
  return {};
}

export async function updateLink(linkId: number, input: LinkInput): Promise<Result> {
  const userId = await getUserId();
  const data = parse(input);
  if (typeof data === "string") return { error: data };

  await db.update(links).set(data).where(and(eq(links.id, linkId), eq(links.userId, userId)));
  revalidatePath("/admin");
  return {};
}

export async function deleteLink(linkId: number) {
  const userId = await getUserId();
  await db.delete(links).where(and(eq(links.id, linkId), eq(links.userId, userId)));
  revalidatePath("/admin");
}

export async function reorderLinks(linkIds: number[]) {
  const userId = await getUserId();
  await db.transaction(async (tx) => {
    for (const [order, id] of linkIds.entries()) {
      await tx.update(links).set({ order }).where(and(eq(links.id, id), eq(links.userId, userId)));
    }
  });
  revalidatePath("/admin");
}
