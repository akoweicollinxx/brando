import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getLandingPagesByUser } from "@/lib/db";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const pages = await getLandingPagesByUser(userId);
  return NextResponse.json({ success: true, data: pages });
}
