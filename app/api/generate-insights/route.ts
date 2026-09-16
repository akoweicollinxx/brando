import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { openai } from "@/lib/openai";
import { getProject, getTractionMetrics, getAllUserLeads, getLandingPageByProject, getEmailSequenceByProject } from "@/lib/db";

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { projectId } = await request.json();
    if (!projectId) return NextResponse.json({ error: "projectId required" }, { status: 400 });

    const [project, metrics, leads, page, sequence] = await Promise.all([
      getProject(projectId, userId),
      getTractionMetrics(projectId),
      getAllUserLeads(userId),
      getLandingPageByProject(projectId),
      getEmailSequenceByProject(projectId),
    ]);

    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

    const projectLeads = leads.filter(l => l.project_id === projectId);
    const latest = metrics[metrics.length - 1];

    const context = `
Brand: ${project.brand_name}
Landing page published: ${page?.published ? "yes" : "no"}
Total leads: ${projectLeads.length}
New leads: ${projectLeads.filter(l => l.status === "new").length}
Converted: ${projectLeads.filter(l => l.status === "converted").length}
Email automation active: ${sequence?.active ? "yes" : "no"}
Email sequence exists: ${sequence ? "yes" : "no"}
Latest traffic: ${latest?.traffic ?? 0}
Latest conversion rate: ${latest?.conversion_rate ?? 0}%
    `.trim();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a growth advisor. Analyze the data and give 3-5 short, actionable insights. Return ONLY valid JSON: { \"insights\": [\"...\"] }" },
        { role: "user", content: context },
      ],
      response_format: { type: "json_object" },
      max_tokens: 500,
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    const { insights } = JSON.parse(raw);

    return NextResponse.json({ success: true, insights: insights ?? [] });
  } catch (err) {
    console.error("[generate-insights]", err);
    return NextResponse.json({ error: "Failed to generate insights" }, { status: 500 });
  }
}
