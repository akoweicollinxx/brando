import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { openai } from "@/lib/openai";
import { getProject, createContentPosts } from "@/lib/db";

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { projectId, platforms = ["Twitter/X", "LinkedIn", "Instagram"] } = await request.json();
    if (!projectId) return NextResponse.json({ error: "projectId required" }, { status: 400 });

    const project = await getProject(projectId, userId);
    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

    const { brand_name, industry, brand_output } = project;
    const kit = brand_output.brand_kit;

    const prompt = `Generate social media posts for "${brand_name}" (${industry || "General"}).
Mission: ${kit.mission || ""}
Tone: ${kit.tone_of_voice?.join(", ") || "professional"}
Platforms: ${platforms.join(", ")}

Write 2 posts per platform. Each post must be platform-appropriate in length and style.

Return ONLY valid JSON:
{
  "posts": [
    { "platform": "Twitter/X", "content": "..." },
    { "platform": "Twitter/X", "content": "..." },
    { "platform": "LinkedIn", "content": "..." },
    { "platform": "LinkedIn", "content": "..." },
    { "platform": "Instagram", "content": "..." },
    { "platform": "Instagram", "content": "..." }
  ]
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "Return ONLY valid JSON." },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.9,
      max_tokens: 2000,
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    const { posts } = JSON.parse(raw);
    const saved = await createContentPosts(projectId, posts ?? []);

    return NextResponse.json({ success: true, posts: saved });
  } catch (err) {
    console.error("[generate-posts]", err);
    return NextResponse.json({ error: "Failed to generate posts" }, { status: 500 });
  }
}
