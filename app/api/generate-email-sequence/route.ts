import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { openai } from "@/lib/openai";
import { getProject, createEmailSequence } from "@/lib/db";
import type { SequenceEmail } from "@/lib/types";

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { projectId } = await request.json();
    if (!projectId) return NextResponse.json({ error: "projectId required" }, { status: 400 });

    const project = await getProject(projectId, userId);
    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

    const { brand_name, industry, target_audience, brand_output } = project;
    const kit = brand_output.brand_kit;

    const prompt = `You are an expert email marketer. Write a 5-email welcome sequence for this brand.

Brand: ${brand_name}
Industry: ${industry || "General"}
Audience: ${target_audience || "General"}
Mission: ${kit.mission || ""}
Tone: ${kit.tone_of_voice?.join(", ") || "professional"}

Use [FIRST_NAME] as a placeholder. Write naturally, not salesy.

Return ONLY valid JSON:
[
  { "subject": "...", "body": "...", "delay_hours": 0 },
  { "subject": "...", "body": "...", "delay_hours": 24 },
  { "subject": "...", "body": "...", "delay_hours": 48 },
  { "subject": "...", "body": "...", "delay_hours": 72 },
  { "subject": "...", "body": "...", "delay_hours": 120 }
]

Sequence:
1 (0h): Warm welcome — set expectations
2 (24h): Most valuable insight or tip for their situation
3 (48h): Social proof or founder story
4 (72h): Highlight the core feature/offering
5 (120h): Soft CTA — invite them to take the next step`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "Return ONLY valid JSON array." },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
      max_tokens: 3000,
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(raw);
    // Handle both array and {emails:[...]} shapes
    const emails: SequenceEmail[] = Array.isArray(parsed) ? parsed : (parsed.emails ?? parsed[Object.keys(parsed)[0]] ?? []);

    const sequence = await createEmailSequence(projectId, emails);
    return NextResponse.json({ success: true, sequence });
  } catch (err) {
    console.error("[generate-email-sequence]", err);
    return NextResponse.json({ error: "Failed to generate sequence" }, { status: 500 });
  }
}
