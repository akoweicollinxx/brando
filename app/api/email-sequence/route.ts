import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getEmailSequenceByProject } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("projectId");
  if (!projectId) return NextResponse.json({ error: "projectId required" }, { status: 400 });
  const data = await getEmailSequenceByProject(projectId);
  return NextResponse.json({ success: true, data });
}
