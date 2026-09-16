// ─── Existing brand generation types ───────────────────────────────────────

export interface BrandColor {
  name: string;
  hex: string;
  usage: string;
}

export interface BrandFont {
  name: string;
  type: "primary" | "secondary" | "accent";
  usage: string;
}

export interface BrandKit {
  colors: BrandColor[];
  fonts: BrandFont[];
  tone_of_voice: string[];
  taglines: string[];
  brand_story: string;
  mission: string;
  values: string[];
}

export interface Competitor {
  name: string;
  description: string;
  weakness: string;
}

export interface MarketAnalysis {
  competitors: Competitor[];
  market_gap: string;
  pricing_strategy: string;
  positioning: string;
  target_market_size: string;
}

export interface LaunchPlan {
  week_1: string[];
  week_2_4: string[];
  month_2_3: string[];
  content_ideas: string[];
  marketing_channels: string[];
}

export interface BrandOutput {
  brand_kit: BrandKit;
  market_analysis: MarketAnalysis;
  website_prompt: string;
  launch_plan: LaunchPlan;
}

export interface GenerateBrandRequest {
  brand_name: string;
  industry: string;
  target_audience: string;
}

export interface GenerateLogoRequest {
  brand_name: string;
  industry: string;
  style?: string;
}

// ─── Brand Score ────────────────────────────────────────────────────────────

export interface ScoreDimension {
  score: number;
  reason: string;
}

export interface BrandScore {
  scores: {
    memorability: ScoreDimension;
    differentiation: ScoreDimension;
    pricing_power: ScoreDimension;
    virality: ScoreDimension;
    trustworthiness: ScoreDimension;
  };
  overall: number;
  grade: string;
  summary: string;
  improvements: { title: string; description: string }[];
}

// ─── Launch Kit ─────────────────────────────────────────────────────────────

export interface LaunchKit {
  landing_page: {
    hero_headline: string;
    hero_subheadline: string;
    cta_primary: string;
    cta_secondary: string;
    features: { title: string; description: string }[];
    social_proof: string[];
    email_capture_headline: string;
  };
  social_assets: {
    instagram_bio: string;
    twitter_bio: string;
    linkedin_bio: string;
    profile_slogan: string;
    banner_text: string;
  };
  posts: {
    platform: string;
    hook: string;
    body: string;
    cta: string;
  }[];
  outreach: {
    cold_email: string;
    dm_template: string;
    icp_description: string;
    lead_types: string[];
  };
  email_funnel: {
    lead_magnet_headline: string;
    optin_copy: string;
    emails: { subject: string; preview: string; body: string }[];
  };
}

// ─── Landing Pages ───────────────────────────────────────────────────────────

export interface LandingPageContent {
  brand: { name: string; primary_color: string; accent_color: string };
  hero: { headline: string; subheadline: string; cta_text: string; cta_secondary?: string };
  features: { title: string; description: string }[];
  social_proof: string[];
  testimonials: { name: string; role: string; text: string }[];
  cta: { headline: string; subheadline: string; button_text: string };
  faq: { question: string; answer: string }[];
}

export interface LandingPage {
  id: string;
  project_id: string;
  slug: string;
  content: LandingPageContent;
  published: boolean;
  custom_domain: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Leads / CRM ─────────────────────────────────────────────────────────────

export type LeadStatus = "new" | "contacted" | "qualified" | "converted" | "lost";

export interface Lead {
  id: string;
  project_id: string;
  name: string | null;
  email: string;
  phone: string | null;
  source: string;
  status: LeadStatus;
  notes: string | null;
  created_at: string;
}

// ─── Email Automation ────────────────────────────────────────────────────────

export interface SequenceEmail {
  subject: string;
  body: string;
  delay_hours: number;
}

export interface EmailSequence {
  id: string;
  project_id: string;
  emails: SequenceEmail[];
  active: boolean;
  created_at: string;
}

// ─── Content Posts ────────────────────────────────────────────────────────────

export type PostStatus = "draft" | "scheduled" | "posted";

export interface ContentPost {
  id: string;
  project_id: string;
  platform: string;
  content: string;
  scheduled_at: string | null;
  status: PostStatus;
  created_at: string;
}

// ─── Traction ─────────────────────────────────────────────────────────────────

export interface TractionMetric {
  id: string;
  project_id: string;
  traffic: number;
  leads: number;
  conversion_rate: number;
  followers: number;
  revenue: number;
  created_at: string;
}

// ─── Showcase ────────────────────────────────────────────────────────────────

export interface ShowcaseBrand {
  slug: string;
  name: string;
  tagline: string;
  industry: string;
  score: number;
  colors: string[];
  votes: number;
  brand_story: string;
  mission: string;
  published_at: string;
  brand_output?: BrandOutput;
}
