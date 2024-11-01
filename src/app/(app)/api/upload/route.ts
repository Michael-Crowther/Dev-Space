import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { put } from "@vercel/blob";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get("filename");
  const userId = searchParams.get("userId");

  if (!filename || !request.body) {
    throw new Error("File is required to upload");
  }

  if (!userId) {
    throw new Error("User ID is required to upload profile image");
  }

  const blob = await put(filename, request.body, {
    access: "public",
  });

  await db
    .update(users)
    .set({ profileImageUrl: blob.url })
    .where(eq(users.id, userId));

  return NextResponse.json(blob);
}
