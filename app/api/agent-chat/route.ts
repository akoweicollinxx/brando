import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ error: "Multi-agent team coming in Phase 2" }, { status: 501 });
}
