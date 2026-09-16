import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { addLeadNote } from "@/lib/db";

export async function PATCH(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, notes } = await request.json();
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await addLeadNote(id, notes ?? "");
  return NextResponse.json({ success: true });
}
