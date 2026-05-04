import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const BRAND_SYSTEM_PROMPT = `You are a world-class brand strategist, startup advisor, and business consultant.
Your job is to generate a complete, actionable brand and business launch kit.
Return ONLY valid JSON — no markdown fences, no explanations, no extra text.
Every output must be specific, startup-ready, and immediately usable.`;

export function buildBrandUserPrompt(
  brand_name: string,
  industry: string,
  target_audience: string
): string {
  return `Create a complete brand launch kit for:
- Brand Name: "${brand_name}"
- Industry: "${industry || "not specified"}"
- Target Audience: "${target_audience || "not specified"}"

Return this exact JSON structure with real, specific values:
{
  "brand_kit": {
    "colors": [
      {"name": "Primary", "hex": "#XXXXXX", "usage": "Main CTAs, hero sections, key UI elements"},
      {"name": "Secondary", "hex": "#XXXXXX", "usage": "Backgrounds, supporting sections"},
      {"name": "Accent", "hex": "#XXXXXX", "usage": "Highlights, badges, interactive elements"},
      {"name": "Neutral", "hex": "#XXXXXX", "usage": "Text, borders, subtle backgrounds"}
    ],
    "fonts": [
      {"name": "Google Font Name", "type": "primary", "usage": "Headlines, hero text, brand name"},
      {"name": "Google Font Name", "type": "secondary", "usage": "Body text, descriptions, UI copy"},
      {"name": "Google Font Name", "type": "accent", "usage": "accent, highlights, buttons"}
    ],
    "tone_of_voice": ["trait1", "trait2", "trait3", "trait4"],
    "taglines": ["Short punchy tagline", "Alternative tagline", "Third option"],
    "brand_story": "Compelling 2-3 sentence brand story that emotionally connects with the audience.",
    "mission": "One clear, powerful mission statement.",
    "values": ["Core Value 1", "Core Value 2", "Core Value 3", "Core Value 4"]
  },
  "market_analysis": {
    "competitors": [
      {"name": "Real Competitor Name", "description": "What they do and their market position", "weakness": "Their specific exploitable weakness"},
      {"name": "Real Competitor Name", "description": "What they do and their market position", "weakness": "Their specific exploitable weakness"},
      {"name": "Real Competitor Name", "description": "What they do and their market position", "weakness": "Their specific exploitable weakness"}
    ],
    "market_gap": "The specific unmet need or gap this brand can own",
    "pricing_strategy": "Recommended pricing model with specific price points and rationale",
    "positioning": "Precise positioning statement vs competitors",
    "target_market_size": "Estimated addressable market size with context"
  },
  "website_prompt": "Full, detailed AI website builder prompt (500+ words) that covers: hero section, value props, features, social proof, pricing, CTA, and overall design direction. Ready to paste into any AI website builder.",
  "launch_plan": {
    "week_1": ["Specific action with detail", "Specific action with detail", "Specific action with detail", "Specific action with detail"],
    "week_2_4": ["Specific action with detail", "Specific action with detail", "Specific action with detail", "Specific action with detail"],
    "month_2_3": ["Specific action with detail", "Specific action with detail", "Specific action with detail", "Specific action with detail"],
    "content_ideas": ["Content idea with format and hook", "Content idea with format and hook", "Content idea with format and hook", "Content idea with format and hook", "Content idea with format and hook"],
    "marketing_channels": ["Channel + specific strategy for this brand", "Channel + specific strategy", "Channel + specific strategy"]
  }
}`;
}
