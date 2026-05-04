"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Star,
  Globe,
  Zap,
  TrendingUp,
  RefreshCw,
  Copy,
  Check,
} from "lucide-react";
import type { ShowcaseBrand } from "@/lib/types";

const SEED_BRANDS: ShowcaseBrand[] = [
  {
    slug: "nova-fitness",
    name: "Nova Fitness",
    tagline: "Train smarter. Live harder.",
    industry: "HealthTech",
    score: 87,
    colors: ["#0D0D0D", "#F5F5F5", "#FF4D4D"],
    votes: 142,
    brand_story: "Nova Fitness was born out of a simple frustration: fitness apps that track everything but understand nothing. We built an AI coach that adapts to your life, not the other way around.",
    mission: "Make elite-level fitness coaching accessible to every body.",
    published_at: "2026-04-10T10:00:00Z",
  },
  {
    slug: "bloom-finance",
    name: "Bloom Finance",
    tagline: "Money that grows with you.",
    industry: "FinTech",
    score: 91,
    colors: ["#1A1A2E", "#16213E", "#0F3460"],
    votes: 218,
    brand_story: "Most people know they should invest but feel paralysed by complexity. Bloom replaces the jargon with clarity — giving first-time investors a confident first step.",
    mission: "Democratise wealth-building for the next generation.",
    published_at: "2026-04-08T09:00:00Z",
  },
  {
    slug: "spark-ai",
    name: "Spark AI",
    tagline: "Ideas into products, overnight.",
    industry: "AI / Productivity",
    score: 83,
    colors: ["#FF6B35", "#F7C59F", "#1A1A1A"],
    votes: 97,
    brand_story: "Spark AI started as an internal tool used by a team of 2 to ship 12 products in a year. When people started asking how, we turned the tool into a product.",
    mission: "Compress the gap between idea and launch.",
    published_at: "2026-04-12T14:00:00Z",
  },
  {
    slug: "verdant",
    name: "Verdant",
    tagline: "Sustainable supply chains, simplified.",
    industry: "CleanTech",
    score: 79,
    colors: ["#2D6A4F", "#52B788", "#B7E4C7"],
    votes: 64,
    brand_story: "Enterprise sustainability goals are real, but the tools to measure and act are scattered. Verdant connects the dots — one dashboard, full visibility.",
    mission: "Make net-zero a practical business outcome, not a PR exercise.",
    published_at: "2026-04-14T11:00:00Z",
  },
  {
    slug: "luma-health",
    name: "Luma Health",
    tagline: "Mental clarity through better sleep.",
    industry: "WellnessTech",
    score: 85,
    colors: ["#7B2FBE", "#9D4EDD", "#E0AAFF"],
    votes: 155,
    brand_story: "Sleep is the most powerful performance drug that no one is selling. Luma Health tracks your patterns, cuts through the noise, and tells you exactly what to change.",
    mission: "Restore deep sleep to the world's most overworked people.",
    published_at: "2026-04-07T08:00:00Z",
  },
  {
    slug: "patchwork",
    name: "Patchwork",
    tagline: "The freelance layer for modern teams.",
    industry: "Future of Work",
    score: 77,
    colors: ["#FF9F1C", "#FFBF69", "#CBF3F0"],
    votes: 41,
    brand_story: "Companies need flexible talent. Freelancers need reliable work. Patchwork creates the infrastructure layer that makes both sides finally work together.",
    mission: "Build the operating system for the flexible workforce.",
    published_at: "2026-04-15T16:00:00Z",
  },
];

function gradeFromScore(score: number) {
  if (score >= 90) return "A+";
  if (score >= 85) return "A";
  if (score >= 80) return "B+";
  if (score >= 75) return "B";
  if (score >= 70) return "C+";
  if (score >= 60) return "C";
  return "D";
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 transition shrink-0"
    >
      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

export default function ShowcaseDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const [brand, setBrand] = useState<ShowcaseBrand | null>(null);
  const [votes, setVotes] = useState(0);
  const [voted, setVoted] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const userBrands: ShowcaseBrand[] = JSON.parse(localStorage.getItem("brando_showcase") || "[]");
    const all = [...userBrands, ...SEED_BRANDS];
    const found = all.find((b) => b.slug === slug);
    if (found) {
      setBrand(found);
      setVotes(found.votes);
    } else {
      setNotFound(true);
    }
    const votedSlugs: string[] = JSON.parse(localStorage.getItem("brando_votes") || "[]");
    setVoted(votedSlugs.includes(slug));
  }, [slug]);

  function handleVote() {
    if (voted) return;
    setVotes((v) => v + 1);
    setVoted(true);
    const votedSlugs: string[] = JSON.parse(localStorage.getItem("brando_votes") || "[]");
    localStorage.setItem("brando_votes", JSON.stringify([...votedSlugs, slug]));
  }

  function handleRemix() {
    if (!brand) return;
    sessionStorage.setItem("brando_brand_name", brand.name);
    sessionStorage.setItem("brando_industry", brand.industry);
    if (brand.brand_output) {
      sessionStorage.setItem("brando_output", JSON.stringify(brand.brand_output));
    }
    router.push("/dashboard");
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0d0d0d] flex flex-col items-center justify-center gap-4">
        <Globe className="w-10 h-10 text-gray-300 dark:text-white/15" />
        <p className="text-gray-500 dark:text-white/45">Brand not found.</p>
        <Link href="/showcase" className="text-sm font-medium text-black dark:text-white underline underline-offset-2">Back to Showcase</Link>
      </div>
    );
  }

  if (!brand) return null;

  const grade = gradeFromScore(brand.score);
  const isTop = brand.score >= 85;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0d0d0d]">
      {/* Color bar */}
      <div className="h-1.5 flex">
        {brand.colors.map((hex, i) => (
          <div key={i} className="flex-1" style={{ backgroundColor: hex }} />
        ))}
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Back */}
        <Link href="/showcase" className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-white/40 hover:text-gray-900 dark:hover:text-white transition mb-8">
          <ArrowLeft className="w-4 h-4" />
          Showcase
        </Link>

        {/* Hero card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-[#181818] rounded-2xl border border-gray-100 dark:border-white/8 shadow-sm p-8 mb-6"
        >
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-gray-400 dark:text-white/30 uppercase tracking-wider">{brand.industry}</span>
              </div>
              <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">{brand.name}</h1>
              <p className="text-gray-500 dark:text-white/50 mt-1 text-lg italic">{brand.tagline}</p>
            </div>
            <div className={`flex flex-col items-center justify-center w-20 h-20 rounded-2xl border-2 shrink-0 ${isTop ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-500/10" : "border-gray-200 dark:border-white/15 bg-gray-50 dark:bg-white/5"}`}>
              <span className={`text-3xl font-black ${isTop ? "text-emerald-600 dark:text-emerald-400" : "text-gray-800 dark:text-white"}`}>{grade}</span>
              <span className={`text-xs font-semibold ${isTop ? "text-emerald-500" : "text-gray-400 dark:text-white/40"}`}>{brand.score}/100</span>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100 dark:border-white/8">
            <p className="text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-wider mb-2">Brand Story</p>
            <p className="text-sm text-gray-700 dark:text-white/65 leading-relaxed">{brand.brand_story}</p>
          </div>

          {brand.mission && (
            <div className="mt-4">
              <p className="text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-wider mb-2">Mission</p>
              <p className="text-sm text-gray-700 dark:text-white/65 leading-relaxed">{brand.mission}</p>
            </div>
          )}

          {/* Color palette */}
          <div className="mt-5">
            <p className="text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-wider mb-2">Brand Colors</p>
            <div className="flex gap-2">
              {brand.colors.map((hex, i) => (
                <div key={i} className="group flex flex-col items-center gap-1">
                  <div className="w-10 h-10 rounded-xl border border-gray-100 dark:border-white/8" style={{ backgroundColor: hex }} />
                  <span className="text-xs font-mono text-gray-400 dark:text-white/30 opacity-0 group-hover:opacity-100 transition">{hex}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Stats + actions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6"
        >
          <div className="bg-white dark:bg-[#181818] rounded-2xl border border-gray-100 dark:border-white/8 p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-black dark:bg-white flex items-center justify-center shrink-0">
              <TrendingUp className="w-4 h-4 text-white dark:text-black" />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900 dark:text-white">{brand.score}</p>
              <p className="text-xs text-gray-400 dark:text-white/35">Brand Score</p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#181818] rounded-2xl border border-gray-100 dark:border-white/8 p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-black dark:bg-white flex items-center justify-center shrink-0">
              <Star className="w-4 h-4 text-white dark:text-black" />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900 dark:text-white">{votes}</p>
              <p className="text-xs text-gray-400 dark:text-white/35">Community Votes</p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#181818] rounded-2xl border border-gray-100 dark:border-white/8 p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-black dark:bg-white flex items-center justify-center shrink-0">
              <Globe className="w-4 h-4 text-white dark:text-black" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">{brand.industry}</p>
              <p className="text-xs text-gray-400 dark:text-white/35">Industry</p>
            </div>
          </div>
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex flex-wrap gap-3 mb-8"
        >
          <button
            onClick={handleVote}
            disabled={voted}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition ${
              voted
                ? "bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 cursor-default"
                : "bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100"
            }`}
          >
            <Star className={`w-4 h-4 ${voted ? "fill-current" : ""}`} />
            {voted ? "Voted!" : "Upvote Brand"}
          </button>

          <button
            onClick={handleRemix}
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold border border-gray-200 dark:border-white/15 text-gray-700 dark:text-white/70 hover:text-gray-900 dark:hover:text-white hover:border-gray-400 dark:hover:border-white/30 transition"
          >
            <RefreshCw className="w-4 h-4" />
            Remix This Brand
          </button>

          <CopyButton text={`${brand.name} — ${brand.tagline}\n\n${brand.brand_story}`} />
        </motion.div>

        {/* Brand kit preview (if available) */}
        {brand.brand_output && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-[#181818] rounded-2xl border border-gray-100 dark:border-white/8 shadow-sm p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-black dark:bg-white flex items-center justify-center">
                <Zap className="w-4 h-4 text-white dark:text-black" />
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">Brand Kit Preview</span>
            </div>

            {brand.brand_output.brand_kit.taglines?.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-wider mb-2">Taglines</p>
                <div className="space-y-1.5">
                  {brand.brand_output.brand_kit.taglines.map((t, i) => (
                    <p key={i} className="text-sm text-gray-700 dark:text-white/65 italic">"{t}"</p>
                  ))}
                </div>
              </div>
            )}

            {brand.brand_output.brand_kit.tone_of_voice?.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-wider mb-2">Tone of Voice</p>
                <div className="flex flex-wrap gap-2">
                  {brand.brand_output.brand_kit.tone_of_voice.map((t) => (
                    <span key={t} className="px-3 py-1.5 bg-gray-100 dark:bg-white/8 rounded-full text-xs text-gray-700 dark:text-white/60 font-medium">{t}</span>
                  ))}
                </div>
              </div>
            )}

            {brand.brand_output.market_analysis?.positioning && (
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-wider mb-2">Positioning</p>
                <p className="text-sm text-gray-700 dark:text-white/65">{brand.brand_output.market_analysis.positioning}</p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
