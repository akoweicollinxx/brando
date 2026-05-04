import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { voteForBrand } from "@/lib/db";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { slug } = await params;
  try {
    const voted = await voteForBrand(userId, slug);
    if (!voted) return NextResponse.json({ error: "Already voted" }, { status: 409 });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[showcase vote]", err);
    return NextResponse.json({ error: "Failed to vote" }, { status: 500 });
  }
}
