import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { updateLeadStatus } from "@/lib/db";
import type { LeadStatus } from "@/lib/types";

export async function PATCH(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, status } = await request.json();
  if (!id || !status) return NextResponse.json({ error: "id and status required" }, { status: 400 });
  await updateLeadStatus(id, status as LeadStatus);
  return NextResponse.json({ success: true });
}
