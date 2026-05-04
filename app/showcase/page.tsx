"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Globe, TrendingUp, Star, Sparkles, Search, ArrowUpRight } from "lucide-react";
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

function BrandCard({ brand, index }: { brand: ShowcaseBrand; index: number }) {
  const grade = gradeFromScore(brand.score);
  const isTop = brand.score >= 85;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link href={`/showcase/${brand.slug}`} className="group block bg-white dark:bg-[#181818] rounded-2xl border border-gray-100 dark:border-white/8 hover:border-gray-300 dark:hover:border-white/20 shadow-sm hover:shadow-md transition overflow-hidden">
        {/* Color bar */}
        <div className="h-2 flex">
          {brand.colors.map((hex, i) => (
            <div key={i} className="flex-1" style={{ backgroundColor: hex }} />
          ))}
        </div>

        <div className="p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 dark:text-white text-lg leading-tight truncate">{brand.name}</h3>
              <p className="text-sm text-gray-500 dark:text-white/45 mt-0.5 truncate">{brand.tagline}</p>
            </div>
            <div className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl border shrink-0 ${isTop ? "border-emerald-300 dark:border-emerald-500/40 bg-emerald-50 dark:bg-emerald-500/10" : "border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5"}`}>
              <span className={`text-base font-black ${isTop ? "text-emerald-700 dark:text-emerald-400" : "text-gray-700 dark:text-white/70"}`}>{grade}</span>
            </div>
          </div>

          <p className="text-xs text-gray-500 dark:text-white/40 line-clamp-2 leading-relaxed mb-4">{brand.brand_story}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 bg-gray-100 dark:bg-white/8 text-gray-600 dark:text-white/50 text-xs rounded-full font-medium">{brand.industry}</span>
              <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-white/30">
                <TrendingUp className="w-3 h-3" />
                <span>{brand.score}/100</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-white/30 group-hover:text-gray-600 dark:group-hover:text-white/50 transition">
              <Star className="w-3 h-3" />
              <span>{brand.votes}</span>
              <ArrowUpRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

type SortKey = "votes" | "score" | "recent";

export default function ShowcasePage() {
  const [brands, setBrands] = useState<ShowcaseBrand[]>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("votes");

  useEffect(() => {
    const userBrands: ShowcaseBrand[] = JSON.parse(localStorage.getItem("brando_showcase") || "[]");
    setBrands([...userBrands, ...SEED_BRANDS]);
  }, []);

  const filtered = brands
    .filter((b) => {
      const q = search.toLowerCase();
      return !q || b.name.toLowerCase().includes(q) || b.industry.toLowerCase().includes(q) || b.tagline.toLowerCase().includes(q);
    })
    .sort((a, b) => {
      if (sort === "votes") return b.votes - a.votes;
      if (sort === "score") return b.score - a.score;
      return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
    });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0d0d0d]">
      {/* Hero */}
      <div className="bg-white dark:bg-[#0a0a0a] border-b border-gray-200 dark:border-white/8">
        <div className="max-w-6xl mx-auto px-6 py-16 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-black dark:bg-white flex items-center justify-center">
              <Globe className="w-4 h-4 text-white dark:text-black" />
            </div>
            <span className="text-sm font-semibold text-gray-500 dark:text-white/40 uppercase tracking-wider">Brando Showcase</span>
          </div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-3 tracking-tight">AI-Built Brands</h1>
          <p className="text-lg text-gray-500 dark:text-white/45 max-w-xl mx-auto">
            Discover brands built with Brando. Get inspired, vote for your favourites, or remix any concept.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-xl text-sm font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition"
          >
            <Sparkles className="w-4 h-4" />
            Build Your Brand
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-8">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-white/30" />
            <input
              type="text"
              placeholder="Search brands..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#181818] text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/25 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white/30 transition"
            />
          </div>

          <div className="flex gap-1 p-1 bg-white dark:bg-[#181818] rounded-xl border border-gray-200 dark:border-white/8">
            {(["votes", "score", "recent"] as SortKey[]).map((s) => (
              <button
                key={s}
                onClick={() => setSort(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition ${
                  sort === s ? "bg-black dark:bg-white text-white dark:text-black" : "text-gray-500 dark:text-white/40 hover:text-gray-700 dark:hover:text-white/60"
                }`}
              >
                {s === "votes" ? "Top Voted" : s === "score" ? "Highest Score" : "Most Recent"}
              </button>
            ))}
          </div>

          <p className="text-xs text-gray-400 dark:text-white/30 ml-auto">{filtered.length} brand{filtered.length !== 1 ? "s" : ""}</p>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Globe className="w-10 h-10 text-gray-300 dark:text-white/15 mb-3" />
            <p className="text-gray-500 dark:text-white/40">No brands found. Try a different search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((brand, i) => (
              <BrandCard key={brand.slug} brand={brand} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
