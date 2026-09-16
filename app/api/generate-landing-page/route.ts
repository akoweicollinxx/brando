import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { openai } from "@/lib/openai";
import { getProject, createLandingPage, updateLandingPage, getLandingPageByProject } from "@/lib/db";
import type { LandingPageContent } from "@/lib/types";

function buildPrompt(brandName: string, industry: string, audience: string, kit: any): string {
  return `You are a world-class landing page copywriter. Generate a complete, high-converting landing page for this brand.

Brand Name: ${brandName}
Industry: ${industry || "General"}
Target Audience: ${audience || "General"}
Tagline: ${kit.taglines?.[0] || ""}
Mission: ${kit.mission || ""}
Brand Story: ${kit.brand_story || ""}
Values: ${kit.values?.join(", ") || ""}
Primary Color: ${kit.colors?.[0]?.hex || "#000000"}
Accent Color: ${kit.colors?.[2]?.hex || "#6366f1"}

Return ONLY valid JSON matching this exact structure:
{
  "brand": { "name": "${brandName}", "primary_color": "${kit.colors?.[0]?.hex || "#000000"}", "accent_color": "${kit.colors?.[2]?.hex || "#6366f1"}" },
  "hero": {
    "headline": "Compelling headline (max 10 words)",
    "subheadline": "Supporting sentence explaining the value proposition (max 20 words)",
    "cta_text": "Primary CTA button text",
    "cta_secondary": "Secondary CTA text"
  },
  "features": [
    { "title": "Feature 1", "description": "One sentence description" },
    { "title": "Feature 2", "description": "One sentence description" },
    { "title": "Feature 3", "description": "One sentence description" }
  ],
  "social_proof": ["Stat or social proof #1", "Stat or social proof #2", "Stat or social proof #3"],
  "testimonials": [
    { "name": "Full Name", "role": "Job Title, Company", "text": "Compelling testimonial quote" },
    { "name": "Full Name", "role": "Job Title, Company", "text": "Compelling testimonial quote" }
  ],
  "cta": {
    "headline": "Closing CTA headline",
    "subheadline": "Supporting sentence",
    "button_text": "CTA button text"
  },
  "faq": [
    { "question": "Common question?", "answer": "Clear answer." },
    { "question": "Common question?", "answer": "Clear answer." },
    { "question": "Common question?", "answer": "Clear answer." }
  ]
}`;
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { projectId } = await request.json();
    if (!projectId) return NextResponse.json({ error: "projectId is required" }, { status: 400 });

    const project = await getProject(projectId, userId);
    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

    const { brand_name, industry, target_audience, brand_output } = project;
    const kit = brand_output.brand_kit;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a landing page copywriter. Return ONLY valid JSON." },
        { role: "user", content: buildPrompt(brand_name, industry ?? "", target_audience ?? "", kit) },
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
      max_tokens: 2000,
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) return NextResponse.json({ error: "No response from AI" }, { status: 500 });

    const content: LandingPageContent = JSON.parse(raw);
    const slug = `${brand_name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now().toString(36)}`;

    // Upsert — update if exists, create if not
    const existing = await getLandingPageByProject(projectId);
    let page;
    if (existing) {
      await updateLandingPage(existing.id, { content });
      page = { ...existing, content };
    } else {
      page = await createLandingPage(projectId, slug, content);
    }

    return NextResponse.json({ success: true, landing_page: page });
  } catch (err) {
    console.error("[generate-landing-page]", err);
    return NextResponse.json({ error: "Failed to generate landing page" }, { status: 500 });
  }
}
