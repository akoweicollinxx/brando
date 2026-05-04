import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { openai, BRAND_SYSTEM_PROMPT, buildBrandUserPrompt } from "@/lib/openai";
import { createProject } from "@/lib/db";
import type { GenerateBrandRequest, BrandOutput } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body: GenerateBrandRequest = await request.json();
    const { brand_name, industry, target_audience } = body;

    if (!brand_name?.trim()) {
      return NextResponse.json({ error: "brand_name is required" }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: BRAND_SYSTEM_PROMPT },
        { role: "user", content: buildBrandUserPrompt(brand_name, industry, target_audience) },
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
      max_tokens: 4000,
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) return NextResponse.json({ error: "No response from AI" }, { status: 500 });

    const output: BrandOutput = JSON.parse(raw);

    // Persist to Supabase if the user is signed in
    let projectId: string | null = null;
    try {
      const { userId } = await auth();
      if (userId && process.env.NEXT_PUBLIC_SUPABASE_URL) {
        const project = await createProject(userId, brand_name, industry, target_audience, output);
        projectId = project.id;
      }
    } catch (dbErr) {
      console.warn("[generate-brand] DB save failed (non-fatal):", dbErr);
    }

    return NextResponse.json({ success: true, data: output, project_id: projectId });
  } catch (err) {
    console.error("[generate-brand]", err);
    return NextResponse.json({ error: "Failed to generate brand" }, { status: 500 });
  }
}
