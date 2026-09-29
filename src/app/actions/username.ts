"use server";

import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function isUsernameTaken(name: string) {
  const [found] = await db.select({ id: user.id }).from(user).where(eq(user.name, name)).limit(1);
  return !!found;
}
