import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { openai } from "@/lib/openai";
import { updateProjectLaunchKit } from "@/lib/db";
import type { LaunchKit, BrandOutput } from "@/lib/types";

const SYSTEM_PROMPT = `You are a world-class startup launch strategist, copywriter, and growth marketer.
Generate a complete business launch kit that is specific, actionable, and immediately usable.
Return ONLY valid JSON — no markdown, no code blocks, no extra text.`;

function buildPrompt(brand_name: string, industry: string, brandData: Partial<BrandOutput>): string {
  return `Create a complete launch kit for:
Brand: "${brand_name}"
Industry: "${industry || "not specified"}"
Mission: "${brandData?.brand_kit?.mission || ""}"
Taglines: ${JSON.stringify(brandData?.brand_kit?.taglines || [])}
Tone: ${JSON.stringify(brandData?.brand_kit?.tone_of_voice || [])}
Target market: "${brandData?.market_analysis?.target_market_size || ""}"
Positioning: "${brandData?.market_analysis?.positioning || ""}"

Return this exact JSON structure with real, specific, ready-to-use content:
{
  "landing_page": {
    "hero_headline": "Bold, specific headline under 10 words",
    "hero_subheadline": "Supporting sentence under 20 words",
    "cta_primary": "Action-focused CTA button text",
    "cta_secondary": "Secondary CTA text",
    "features": [
      { "title": "Feature name", "description": "One sentence benefit" },
      { "title": "Feature name", "description": "One sentence benefit" },
      { "title": "Feature name", "description": "One sentence benefit" },
      { "title": "Feature name", "description": "One sentence benefit" }
    ],
    "social_proof": [
      "Short testimonial or stat 1",
      "Short testimonial or stat 2",
      "Short testimonial or stat 3"
    ],
    "email_capture_headline": "Compelling opt-in headline"
  },
  "social_assets": {
    "instagram_bio": "Instagram bio under 150 chars with emoji",
    "twitter_bio": "Twitter/X bio under 160 chars",
    "linkedin_bio": "LinkedIn company description, 2-3 sentences, professional tone",
    "profile_slogan": "5-7 word punchy profile slogan",
    "banner_text": "Short banner/cover text (under 60 chars)"
  },
  "posts": [
    { "platform": "Instagram", "hook": "Attention-grabbing first line", "body": "2-3 sentences of value", "cta": "Call to action" },
    { "platform": "Instagram", "hook": "Attention-grabbing first line", "body": "2-3 sentences of value", "cta": "Call to action" },
    { "platform": "Twitter/X", "hook": "Tweet hook", "body": "Tweet body", "cta": "CTA or hashtags" },
    { "platform": "Twitter/X", "hook": "Tweet hook", "body": "Tweet body", "cta": "CTA or hashtags" },
    { "platform": "LinkedIn", "hook": "Professional hook", "body": "Value-driven insight", "cta": "Engagement CTA" },
    { "platform": "LinkedIn", "hook": "Professional hook", "body": "Value-driven insight", "cta": "Engagement CTA" },
    { "platform": "Instagram", "hook": "Story-driven hook", "body": "Behind the scenes or educational", "cta": "Save or share CTA" },
    { "platform": "Twitter/X", "hook": "Controversial or bold take", "body": "Support the take", "cta": "Engagement question" },
    { "platform": "LinkedIn", "hook": "Data or insight hook", "body": "Industry insight post", "cta": "Comment or connect" },
    { "platform": "Instagram", "hook": "Problem-focused hook", "body": "Solution reveal", "cta": "Link in bio CTA" }
  ],
  "outreach": {
    "cold_email": "Full cold email template with subject line, personalised opening, value prop, CTA. Use [NAME] and [COMPANY] as placeholders.",
    "dm_template": "Short, warm DM template for Instagram or LinkedIn. Under 100 words. Conversational tone.",
    "icp_description": "2-3 sentence description of the ideal customer profile",
    "lead_types": [
      "Specific lead type 1",
      "Specific lead type 2",
      "Specific lead type 3",
      "Specific lead type 4",
      "Specific lead type 5",
      "Specific lead type 6",
      "Specific lead type 7",
      "Specific lead type 8",
      "Specific lead type 9",
      "Specific lead type 10",
      "Specific lead type 11",
      "Specific lead type 12",
      "Specific lead type 13",
      "Specific lead type 14",
      "Specific lead type 15",
      "Specific lead type 16",
      "Specific lead type 17",
      "Specific lead type 18",
      "Specific lead type 19",
      "Specific lead type 20"
    ]
  },
  "email_funnel": {
    "lead_magnet_headline": "Compelling lead magnet title",
    "optin_copy": "2 sentences of opt-in persuasion copy",
    "emails": [
      {
        "subject": "Welcome email subject line",
        "preview": "Preview text under 90 chars",
        "body": "Full welcome email body, 150-200 words, warm and value-focused"
      },
      {
        "subject": "Value email subject line",
        "preview": "Preview text",
        "body": "Full nurture email, 150-200 words, educational content"
      },
      {
        "subject": "Conversion email subject line",
        "preview": "Preview text",
        "body": "Full conversion email, 150-200 words, soft sell with CTA"
      }
    ]
  }
}`;
}

export async function POST(request: NextRequest) {
  try {
    const { brand_name, industry, brand_data, project_id } = await request.json();

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
        { role: "user", content: buildPrompt(brand_name, industry, brand_data) },
      ],
      response_format: { type: "json_object" },
      temperature: 0.75,
      max_tokens: 4000,
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) return NextResponse.json({ error: "No response from AI" }, { status: 500 });

    const kit: LaunchKit = JSON.parse(raw);

    try {
      const { userId } = await auth();
      if (userId && project_id && process.env.NEXT_PUBLIC_SUPABASE_URL) {
        await updateProjectLaunchKit(project_id, userId, kit);
      }
    } catch (dbErr) {
      console.warn("[launch-mode] DB save failed (non-fatal):", dbErr);
    }

    return NextResponse.json({ success: true, data: kit });
  } catch (err) {
    console.error("[launch-mode]", err);
    return NextResponse.json({ error: "Failed to generate launch kit" }, { status: 500 });
  }
}
