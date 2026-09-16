import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { updateContentPostStatus } from "@/lib/db";
import type { PostStatus } from "@/lib/types";

export async function PATCH(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, status } = await request.json();
  await updateContentPostStatus(id, status as PostStatus);
  return NextResponse.json({ success: true });
}
