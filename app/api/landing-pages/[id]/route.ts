import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { updateLandingPage, deleteLandingPage } from "@/lib/db";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  await updateLandingPage(params.id, body);
  return NextResponse.json({ success: true });
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await deleteLandingPage(params.id);
  return NextResponse.json({ success: true });
}
