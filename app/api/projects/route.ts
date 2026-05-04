import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getUserProjects } from "@/lib/db";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const projects = await getUserProjects(userId);
    return NextResponse.json({ success: true, data: projects });
  } catch (err) {
    console.error("[projects GET]", err);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}
