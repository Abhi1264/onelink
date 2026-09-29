import { NextRequest, NextResponse } from "next/server";
import { eq, and, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { links } from "@/lib/db/schema";

export async function POST(req: NextRequest) {
  const { linkId } = await req.json().catch(() => ({}));
  if (!Number.isInteger(linkId)) {
    return NextResponse.json({ error: "Invalid link ID" }, { status: 400 });
  }

  await db
    .update(links)
    .set({ clicks: sql`${links.clicks} + 1` })
    .where(and(eq(links.id, linkId), eq(links.isEnabled, true)));

  return new NextResponse(null, { status: 204 });
}
