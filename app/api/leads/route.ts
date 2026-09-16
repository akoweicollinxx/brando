import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getAllUserLeads } from "@/lib/db";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const leads = await getAllUserLeads(userId);
  return NextResponse.json({ success: true, data: leads });
}
