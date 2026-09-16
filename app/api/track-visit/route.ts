import { NextRequest, NextResponse } from "next/server";
import { trackPageVisit } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { projectId, visitorId, referrer } = await request.json();
    if (!projectId || !visitorId) return NextResponse.json({ ok: true }); // silent skip
    await trackPageVisit(projectId, visitorId, referrer || "");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true }); // never fail a tracking call
  }
}
