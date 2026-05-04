import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getShowcaseBrands, publishToShowcase } from "@/lib/db";
import type { ShowcaseBrand } from "@/lib/types";

export async function GET() {
  try {
    const brands = await getShowcaseBrands();
    return NextResponse.json({ success: true, data: brands });
  } catch (err) {
    console.error("[showcase GET]", err);
    return NextResponse.json({ error: "Failed to fetch showcase" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body: Omit<ShowcaseBrand, "votes" | "published_at"> = await request.json();
    const brand = await publishToShowcase(userId, body);
    return NextResponse.json({ success: true, data: brand });
  } catch (err) {
    console.error("[showcase POST]", err);
    return NextResponse.json({ error: "Failed to publish brand" }, { status: 500 });
  }
}
