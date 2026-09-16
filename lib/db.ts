import { supabase } from "@/lib/supabase";
import type {
  BrandOutput, BrandScore, LaunchKit, ShowcaseBrand,
  LandingPage, LandingPageContent, Lead, LeadStatus,
  EmailSequence, SequenceEmail, ContentPost, PostStatus, TractionMetric,
} from "@/lib/types";

// ─── Brand Projects ──────────────────────────────────────────────────────────

export interface BrandProject {
  id: string;
  user_id: string;
  brand_name: string;
  industry: string | null;
  target_audience: string | null;
  brand_output: BrandOutput;
  brand_score: BrandScore | null;
  launch_kit: LaunchKit | null;
  created_at: string;
  updated_at: string;
}

export async function createProject(
  userId: string,
  brandName: string,
  industry: string,
  targetAudience: string,
  brandOutput: BrandOutput
): Promise<BrandProject> {
  const { data, error } = await supabase
    .from("brand_projects")
    .insert({
      user_id: userId,
      brand_name: brandName,
      industry: industry || null,
      target_audience: targetAudience || null,
      brand_output: brandOutput,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getUserProjects(userId: string): Promise<BrandProject[]> {
  const { data, error } = await supabase
    .from("brand_projects")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getProject(id: string, userId: string): Promise<BrandProject | null> {
  const { data, error } = await supabase
    .from("brand_projects")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .single();

  if (error) return null;
  return data;
}

export async function updateProjectScore(
  id: string,
  userId: string,
  score: BrandScore
): Promise<void> {
  const { error } = await supabase
    .from("brand_projects")
    .update({ brand_score: score, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", userId);

  if (error) throw error;
}

export async function updateProjectLaunchKit(
  id: string,
  userId: string,
  launchKit: LaunchKit
): Promise<void> {
  const { error } = await supabase
    .from("brand_projects")
    .update({ launch_kit: launchKit, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", userId);

  if (error) throw error;
}

export async function deleteProject(id: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from("brand_projects")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) throw error;
}

// ─── Showcase ────────────────────────────────────────────────────────────────

export async function publishToShowcase(
  userId: string,
  brand: Omit<ShowcaseBrand, "votes" | "published_at">
): Promise<ShowcaseBrand> {
  const { data, error } = await supabase
    .from("showcase_brands")
    .upsert(
      {
        ...brand,
        user_id: userId,
        votes: 0,
        published_at: new Date().toISOString(),
      },
      { onConflict: "slug" }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getShowcaseBrands(): Promise<ShowcaseBrand[]> {
  const { data, error } = await supabase
    .from("showcase_brands")
    .select("slug,name,tagline,industry,score,colors,votes,brand_story,mission,published_at")
    .order("votes", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getShowcaseBrand(slug: string): Promise<ShowcaseBrand | null> {
  const { data, error } = await supabase
    .from("showcase_brands")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) return null;
  return data;
}

export async function voteForBrand(userId: string, slug: string): Promise<boolean> {
  // Check for existing vote
  const { data: existing } = await supabase
    .from("showcase_votes")
    .select("id")
    .eq("user_id", userId)
    .eq("brand_slug", slug)
    .single();

  if (existing) return false; // already voted

  await supabase.from("showcase_votes").insert({ user_id: userId, brand_slug: slug });
  await supabase.rpc("increment_votes", { brand_slug: slug });
  return true;
}

// ─── Landing Pages ────────────────────────────────────────────────────────────

export async function createLandingPage(
  projectId: string,
  slug: string,
  content: LandingPageContent
): Promise<LandingPage> {
  const { data, error } = await supabase
    .from("landing_pages")
    .insert({ project_id: projectId, slug, content })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getLandingPageBySlug(slug: string): Promise<LandingPage | null> {
  const { data, error } = await supabase
    .from("landing_pages")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error) return null;
  return data;
}

export async function getLandingPageByProject(projectId: string): Promise<LandingPage | null> {
  const { data, error } = await supabase
    .from("landing_pages")
    .select("*")
    .eq("project_id", projectId)
    .single();
  if (error) return null;
  return data;
}

export async function getLandingPagesByUser(userId: string): Promise<(LandingPage & { brand_name: string })[]> {
  const { data, error } = await supabase
    .from("landing_pages")
    .select("*, brand_projects!inner(brand_name, user_id)")
    .eq("brand_projects.user_id", userId)
    .order("created_at", { ascending: false });
  if (error) return [];
  return (data ?? []).map((row: any) => ({
    ...row,
    brand_name: row.brand_projects?.brand_name ?? "",
  }));
}

export async function updateLandingPage(
  id: string,
  updates: Partial<{ content: LandingPageContent; published: boolean }>
): Promise<void> {
  const { error } = await supabase
    .from("landing_pages")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteLandingPage(id: string): Promise<void> {
  const { error } = await supabase.from("landing_pages").delete().eq("id", id);
  if (error) throw error;
}

// ─── Leads / CRM ──────────────────────────────────────────────────────────────

export async function createLead(
  projectId: string,
  email: string,
  name?: string,
  phone?: string,
  source = "landing_page"
): Promise<Lead> {
  const { data, error } = await supabase
    .from("leads")
    .insert({ project_id: projectId, email, name: name || null, phone: phone || null, source })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getAllUserLeads(userId: string): Promise<(Lead & { brand_name: string })[]> {
  const { data, error } = await supabase
    .from("leads")
    .select("*, brand_projects!inner(brand_name, user_id)")
    .eq("brand_projects.user_id", userId)
    .order("created_at", { ascending: false });
  if (error) return [];
  return (data ?? []).map((row: any) => ({
    ...row,
    brand_name: row.brand_projects?.brand_name ?? "",
  }));
}

export async function getLeadsByProject(projectId: string): Promise<Lead[]> {
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });
  if (error) return [];
  return data ?? [];
}

export async function updateLeadStatus(id: string, status: LeadStatus): Promise<void> {
  const { error } = await supabase.from("leads").update({ status }).eq("id", id);
  if (error) throw error;
}

export async function addLeadNote(id: string, notes: string): Promise<void> {
  const { error } = await supabase.from("leads").update({ notes }).eq("id", id);
  if (error) throw error;
}

export async function deleteLead(id: string): Promise<void> {
  const { error } = await supabase.from("leads").delete().eq("id", id);
  if (error) throw error;
}

// ─── Email Sequences ──────────────────────────────────────────────────────────

export async function createEmailSequence(
  projectId: string,
  emails: SequenceEmail[]
): Promise<EmailSequence> {
  const { data, error } = await supabase
    .from("email_sequences")
    .upsert({ project_id: projectId, emails, active: true }, { onConflict: "project_id" })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getEmailSequenceByProject(projectId: string): Promise<EmailSequence | null> {
  const { data, error } = await supabase
    .from("email_sequences")
    .select("*")
    .eq("project_id", projectId)
    .single();
  if (error) return null;
  return data;
}

export async function updateEmailSequenceActive(id: string, active: boolean): Promise<void> {
  const { error } = await supabase.from("email_sequences").update({ active }).eq("id", id);
  if (error) throw error;
}

// ─── Content Posts ────────────────────────────────────────────────────────────

export async function createContentPosts(
  projectId: string,
  posts: { platform: string; content: string }[]
): Promise<ContentPost[]> {
  const rows = posts.map(p => ({ project_id: projectId, platform: p.platform, content: p.content }));
  const { data, error } = await supabase.from("content_posts").insert(rows).select();
  if (error) throw error;
  return data ?? [];
}

export async function getContentPostsByProject(projectId: string): Promise<ContentPost[]> {
  const { data, error } = await supabase
    .from("content_posts")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });
  if (error) return [];
  return data ?? [];
}

export async function getAllUserContentPosts(userId: string): Promise<(ContentPost & { brand_name: string })[]> {
  const { data, error } = await supabase
    .from("content_posts")
    .select("*, brand_projects!inner(brand_name, user_id)")
    .eq("brand_projects.user_id", userId)
    .order("created_at", { ascending: false });
  if (error) return [];
  return (data ?? []).map((row: any) => ({ ...row, brand_name: row.brand_projects?.brand_name ?? "" }));
}

export async function updateContentPostStatus(id: string, status: PostStatus): Promise<void> {
  const { error } = await supabase.from("content_posts").update({ status }).eq("id", id);
  if (error) throw error;
}

// ─── Page Visits ──────────────────────────────────────────────────────────────

export async function trackPageVisit(
  projectId: string,
  visitorId: string,
  referrer: string
): Promise<void> {
  await supabase.from("page_visits").insert({ project_id: projectId, visitor_id: visitorId, referrer });
}

export async function getVisitStats(
  projectId: string
): Promise<{ total: number; unique: number; referrers: Record<string, number> }> {
  const { data } = await supabase
    .from("page_visits")
    .select("visitor_id, referrer")
    .eq("project_id", projectId);
  const rows = data ?? [];
  const unique = new Set(rows.map((r: any) => r.visitor_id)).size;
  const referrers: Record<string, number> = {};
  rows.forEach((r: any) => {
    const ref = r.referrer || "direct";
    referrers[ref] = (referrers[ref] ?? 0) + 1;
  });
  return { total: rows.length, unique, referrers };
}

// ─── Traction ─────────────────────────────────────────────────────────────────

export async function getTractionMetrics(projectId: string): Promise<TractionMetric[]> {
  const { data, error } = await supabase
    .from("traction_metrics")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: true })
    .limit(30);
  if (error) return [];
  return data ?? [];
}
