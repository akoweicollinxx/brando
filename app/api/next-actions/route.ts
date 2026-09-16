import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getAllUserLeads, getLandingPagesByUser, getEmailSequenceByProject, getAllUserContentPosts } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("projectId");

  const [leads, pages, posts] = await Promise.all([
    getAllUserLeads(userId),
    getLandingPagesByUser(userId),
    getAllUserContentPosts(userId),
  ]);

  const tasks: string[] = [];

  // Landing page not published
  const unpublished = pages.filter(p => !p.published);
  if (unpublished.length > 0) tasks.push(`Publish your landing page for "${unpublished[0].brand_name}"`);

  // No landing page at all
  if (pages.length === 0) tasks.push("Generate and publish your first landing page");

  // Leads with no follow-up
  const newLeads = leads.filter(l => l.status === "new");
  if (newLeads.length >= 3) tasks.push(`Follow up with ${newLeads.length} new leads`);
  else if (newLeads.length > 0) tasks.push(`Contact ${newLeads.length} new lead${newLeads.length > 1 ? "s" : ""}`);

  // Email sequence
  if (projectId) {
    const seq = await getEmailSequenceByProject(projectId);
    if (!seq) tasks.push("Generate your email automation sequence");
    else if (!seq.active) tasks.push("Enable your email automation sequence");
  }

  // Content
  const draftPosts = posts.filter(p => p.status === "draft");
  if (draftPosts.length > 0) tasks.push(`Post ${draftPosts.length} drafted social media post${draftPosts.length > 1 ? "s" : ""}`);
  else tasks.push("Generate new social media content");

  // Growth nudges
  if (leads.length === 0) tasks.push("Share your landing page link to get your first leads");
  if (leads.filter(l => l.status === "converted").length === 0 && leads.length > 0) {
    tasks.push("Follow up with qualified leads to close your first sale");
  }

  return NextResponse.json({ success: true, tasks: tasks.slice(0, 5) });
}
