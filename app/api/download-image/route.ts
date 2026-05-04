import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url  = searchParams.get("url");
  const name = searchParams.get("name") ?? "download.png";

  if (!url) {
    return NextResponse.json({ error: "url is required" }, { status: 400 });
  }

  const response = await fetch(url);
  if (!response.ok) {
    return NextResponse.json({ error: "Failed to fetch image" }, { status: 502 });
  }

  const blob = await response.arrayBuffer();
  return new NextResponse(blob, {
    headers: {
      "Content-Type": response.headers.get("Content-Type") ?? "image/png",
      "Content-Disposition": `attachment; filename="${name}"`,
    },
  });
}
