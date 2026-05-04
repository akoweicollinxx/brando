import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import { auth } from "@clerk/nextjs/server";

function logoPrompt(brand_name: string, industry: string): string {
  return `Create a professional, modern brand logo for a company called "${brand_name}"${industry ? ` in the ${industry} industry` : ""}. The logo must include: a unique, memorable icon or symbol that represents the brand, and the brand name "${brand_name}" in clean, bold typography below or beside the icon. Design requirements: flat 2D vector style, minimal and modern, strong visual identity. Background: pure solid white — absolutely no shadows, no gradients, no textures, no decorative elements outside the logo mark. The logo must be perfectly centered on a white square canvas with generous padding around it.`;
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { brand_name, industry } = await request.json();

    if (!brand_name?.trim()) {
      return NextResponse.json({ error: "brand_name is required" }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 });
    }

    const response = await openai.images.generate({
      model: "gpt-image-1",
      prompt: logoPrompt(brand_name, industry ?? ""),
      n: 1,
      size: "1024x1024",
      quality: "high",
      background: "opaque",
    });

    const b64 = response.data?.[0]?.b64_json;
    if (!b64) return NextResponse.json({ error: "No image generated" }, { status: 500 });

    const dataUrl = `data:image/png;base64,${b64}`;
    return NextResponse.json({ success: true, url: dataUrl });
  } catch (err) {
    console.error("[generate-logo]", err);
    return NextResponse.json({ error: "Failed to generate logo" }, { status: 500 });
  }
}
