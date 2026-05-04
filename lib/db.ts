import { supabase } from "@/lib/supabase";
import type { BrandOutput, BrandScore, LaunchKit, ShowcaseBrand } from "@/lib/types";

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
