import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { updateEmailSequenceActive } from "@/lib/db";

export async function PATCH(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, active } = await request.json();
  await updateEmailSequenceActive(id, active);
  return NextResponse.json({ success: true });
}
