import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { openai } from "@/lib/openai";
import { updateProjectScore } from "@/lib/db";
import type { BrandScore, BrandOutput } from "@/lib/types";

const SYSTEM_PROMPT = `You are a senior brand strategist and venture advisor who evaluates startup brands.
Score the brand across 5 dimensions, each out of 10. Be honest and specific.
Return ONLY valid JSON — no markdown, no extra text.`;

function buildPrompt(brand_name: string, industry: string, outputs: Partial<BrandOutput>): string {
  return `Evaluate this brand:

Brand Name: "${brand_name}"
Industry: "${industry || "not specified"}"
Mission: "${outputs?.brand_kit?.mission || ""}"
Tagline: "${outputs?.brand_kit?.taglines?.[0] || ""}"
Tone: ${JSON.stringify(outputs?.brand_kit?.tone_of_voice || [])}
Market Gap: "${outputs?.market_analysis?.market_gap || ""}"
Positioning: "${outputs?.market_analysis?.positioning || ""}"

Score across 5 dimensions and return this exact JSON:
{
  "scores": {
    "memorability": { "score": 8, "reason": "One specific reason why" },
    "differentiation": { "score": 7, "reason": "One specific reason why" },
    "pricing_power": { "score": 6, "reason": "One specific reason why" },
    "virality": { "score": 7, "reason": "One specific reason why" },
    "trustworthiness": { "score": 9, "reason": "One specific reason why" }
  },
  "overall": 74,
  "grade": "B+",
  "summary": "One punchy sentence summarising the brand's biggest strength and biggest risk.",
  "improvements": [
    { "title": "Short action title", "description": "Specific, actionable improvement" },
    { "title": "Short action title", "description": "Specific, actionable improvement" },
    { "title": "Short action title", "description": "Specific, actionable improvement" }
  ]
}

Grade scale: A+ (90-100), A (85-89), B+ (80-84), B (75-79), C+ (70-74), C (60-69), D (<60).
Overall = average of all 5 scores × 10.`;
}

export async function POST(request: NextRequest) {
  try {
    const { brand_name, industry, outputs, project_id } = await request.json();

    if (!brand_name?.trim()) {
      return NextResponse.json({ error: "brand_name is required" }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildPrompt(brand_name, industry, outputs) },
      ],
      response_format: { type: "json_object" },
      temperature: 0.4,
      max_tokens: 1000,
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) return NextResponse.json({ error: "No response from AI" }, { status: 500 });

    const score: BrandScore = JSON.parse(raw);

    try {
      const { userId } = await auth();
      if (userId && project_id && process.env.NEXT_PUBLIC_SUPABASE_URL) {
        await updateProjectScore(project_id, userId, score);
      }
    } catch (dbErr) {
      console.warn("[brand-score] DB save failed (non-fatal):", dbErr);
    }

    return NextResponse.json({ success: true, data: score });
  } catch (err) {
    console.error("[brand-score]", err);
    return NextResponse.json({ error: "Failed to score brand" }, { status: 500 });
  }
}
