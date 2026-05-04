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
