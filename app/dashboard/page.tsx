"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  ImageIcon,
  Loader2,
  Zap,
  Target,
  Globe,
  Rocket,
  TrendingUp,
  Lightbulb,
  Palette,
  Star,
  BarChart2,
  ArrowRight,
  Share2,
  Monitor,
  Users,
  X,
  Lock,
  ExternalLink,
  MousePointerClick,
  Paintbrush,
  SendHorizonal,
} from "lucide-react";
import type { BrandOutput, BrandScore } from "@/lib/types";

// ─── Loading messages ────────────────────────────────────────────────────────

const BRAND_MSGS = [
  "Analyzing your market...",
  "Crafting brand identity...",
  "Researching competitors...",
  "Writing your brand story...",
  "Building your launch plan...",
  "Generating website prompt...",
  "Finalising brand kit...",
];

const SCORE_MSGS = [
  "Evaluating brand strength...",
  "Scoring differentiation...",
  "Measuring trust signals...",
  "Calculating virality...",
  "Finalising grade...",
];

function useTickingMessage(active: boolean, msgs: string[]) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!active) { setI(0); return; }
    const id = setInterval(() => setI((n) => (n + 1) % msgs.length), 2200);
    return () => clearInterval(id);
  }, [active, msgs]);
  return msgs[i];
}

// ─── Shared UI primitives ─────────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 transition shrink-0"
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

function ScoreBar({ label, score, reason }: { label: string; score: number; reason: string }) {
  const color = score >= 8 ? "bg-emerald-500" : score >= 6 ? "bg-yellow-400" : "bg-red-400";
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700 dark:text-white/70 capitalize">{label.replace("_", " ")}</span>
        <span className="text-sm font-bold text-gray-900 dark:text-white">{score}<span className="text-gray-400 dark:text-white/30 font-normal">/10</span></span>
      </div>
      <div className="h-1.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(score / 10) * 100}%` }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
      <p className="text-xs text-gray-400 dark:text-white/30">{reason}</p>
    </div>
  );
}

function downloadImage(url: string, name: string) {
  const a = Object.assign(document.createElement("a"), { href: url, download: name });
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// ─── Tab definitions ──────────────────────────────────────────────────────────

const TABS = [
  { id: "overview",  label: "Overview",    icon: Palette   },
  { id: "market",    label: "Market",      icon: TrendingUp },
  { id: "plan",      label: "Launch Plan", icon: Rocket    },
  { id: "website",   label: "Website",     icon: Monitor   },
  { id: "logos",     label: "Logos",       icon: ImageIcon },
] as const;

type TabId = typeof TABS[number]["id"];

// ─── Main page ────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const router = useRouter();
  const { has, isLoaded } = useAuth();
  const isPremium = isLoaded ? (has?.({ plan: "premium" }) ?? false) : false;

  // Form state
  const [brandName, setBrandName] = useState("");
  const [industry,  setIndustry]  = useState("");
  const [audience,  setAudience]  = useState("");

  // Generation
  const [isGenerating, setIsGenerating] = useState(false);
  const [output,       setOutput]       = useState<BrandOutput | null>(null);
  const [projectId,    setProjectId]    = useState<string | null>(null);
  const [error,        setError]        = useState<string | null>(null);

  // Score
  const [score,     setScore]     = useState<BrandScore | null>(null);
  const [isScoring, setIsScoring] = useState(false);

  // Logo
  const [logoUrl,      setLogoUrl]      = useState<string | null>(null);
  const [isGenLogo,    setIsGenLogo]    = useState(false);

  // UI
  const [activeTab,     setActiveTab]     = useState<TabId>("overview");
  const [published,     setPublished]     = useState(false);
  const [showWebModal,  setShowWebModal]  = useState(false);
  const [webCopied,     setWebCopied]     = useState(false);

  const outputRef = useRef<HTMLDivElement>(null);

  const brandMsg = useTickingMessage(isGenerating, BRAND_MSGS);
  const scoreMsg = useTickingMessage(isScoring, SCORE_MSGS);

  // Load project from sessionStorage when remixing from Showcase / Projects
  useEffect(() => {
    const savedName   = sessionStorage.getItem("brando_brand_name");
    const savedInd    = sessionStorage.getItem("brando_industry");
    const savedOutput = sessionStorage.getItem("brando_output");
    if (savedName && savedOutput) {
      setBrandName(savedName);
      setIndustry(savedInd ?? "");
      try { setOutput(JSON.parse(savedOutput)); } catch { /* ignore */ }
      sessionStorage.removeItem("brando_brand_name");
      sessionStorage.removeItem("brando_industry");
      sessionStorage.removeItem("brando_output");
    }
  }, []);

  async function handleGenerate() {
    if (!brandName.trim()) return;
    setIsGenerating(true);
    setError(null);
    setOutput(null);
    setProjectId(null);
    setScore(null);
    setLogoUrl(null);
    setPublished(false);
    setActiveTab("overview");
    try {
      const res  = await fetch("/api/generate-brand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brand_name: brandName, industry, target_audience: audience }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Generation failed");
      setOutput(json.data);
      if (json.project_id) setProjectId(json.project_id);
      setTimeout(() => outputRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleScore() {
    if (!output) return;
    setIsScoring(true);
    try {
      const res  = await fetch("/api/brand-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brand_name: brandName, industry, outputs: output, project_id: projectId }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setScore(json.data);
    } catch (e) { console.error(e); }
    finally { setIsScoring(false); }
  }

  async function handleGenLogo() {
    if (!brandName.trim()) return;
    setIsGenLogo(true);
    setLogoUrl(null);
    try {
      const res  = await fetch("/api/generate-logo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brand_name: brandName, industry }),
      });
      const json = await res.json();
      if (json.url) setLogoUrl(json.url);
    } catch (e) { console.error("Logo generation failed:", e); }
    finally { setIsGenLogo(false); }
  }

  function handleLaunch() {
    if (!output) return;
    if (!isPremium) {
      router.push("/dashboard/billing");
      return;
    }
    sessionStorage.setItem("brando_brand_name", brandName);
    sessionStorage.setItem("brando_industry", industry);
    sessionStorage.setItem("brando_output", JSON.stringify(output));
    if (projectId) sessionStorage.setItem("brando_project_id", projectId);
    router.push("/dashboard/launch");
  }

  function handlePublish() {
    if (!output) return;
    const entry = {
      slug: brandName.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now(),
      name: brandName,
      tagline: output.brand_kit.taglines[0] || "",
      industry: industry || "General",
      score: score?.overall || 0,
      colors: output.brand_kit.colors.slice(0, 3).map(c => c.hex),
      votes: 0,
      brand_story: output.brand_kit.brand_story || "",
      mission: output.brand_kit.mission || "",
      published_at: new Date().toISOString(),
      brand_output: output,
    };
    const existing = JSON.parse(localStorage.getItem("brando_showcase") || "[]");
    localStorage.setItem("brando_showcase", JSON.stringify([entry, ...existing]));
    setPublished(true);
  }

  function handleReset() {
    setOutput(null); setBrandName(""); setIndustry(""); setAudience("");
    setScore(null); setLogoUrl(null); setProjectId(null); setPublished(false);
  }

  async function handleCopyWebPrompt() {
    if (!output) return;
    await navigator.clipboard.writeText(output.website_prompt);
    setWebCopied(true);
    setTimeout(() => setWebCopied(false), 2200);
  }

  const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white/30 focus:border-transparent transition text-sm";

  return (
    <div className="min-h-full px-6 py-8 max-w-4xl mx-auto">

      {/* ── Page header ── */}
      {!output && (
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Generate a Brand Kit</h1>
          <p className="text-gray-500 dark:text-white/45 mt-1 text-sm">
            Enter a brand name and Brando builds your entire launch kit — identity, market analysis, launch plan, and more.
          </p>
        </div>
      )}

      {/* ── Generator form ── */}
      <div className={`bg-white dark:bg-[#181818] rounded-2xl border border-gray-100 dark:border-white/8 shadow-sm p-6 ${output ? "mb-6" : "mb-8"}`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          <div className="md:col-span-3">
            <label className="block text-xs font-semibold text-gray-500 dark:text-white/45 uppercase tracking-wider mb-2">
              Brand Name <span className="text-red-400 normal-case font-normal">*</span>
            </label>
            <input
              type="text"
              value={brandName}
              onChange={e => setBrandName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleGenerate()}
              placeholder="e.g. Nova Fitness, Bloom Finance, Spark AI"
              className={`${inputClass} text-base`}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-white/45 uppercase tracking-wider mb-2">Industry</label>
            <input type="text" value={industry} onChange={e => setIndustry(e.target.value)} placeholder="e.g. HealthTech, FinTech" className={inputClass} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-gray-500 dark:text-white/45 uppercase tracking-wider mb-2">Target Audience</label>
            <input type="text" value={audience} onChange={e => setAudience(e.target.value)} placeholder="e.g. busy professionals aged 25–40" className={inputClass} />
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating || !brandName.trim()}
          className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 bg-black dark:bg-white text-white dark:text-black rounded-xl font-semibold text-sm hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <AnimatePresence mode="wait">
                <motion.span key={brandMsg} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.25 }}>
                  {brandMsg}
                </motion.span>
              </AnimatePresence>
            </>
          ) : (
            <><Sparkles className="w-4 h-4" /> Generate Brand Kit</>
          )}
        </button>

        {error && <p className="mt-3 text-sm text-red-500 dark:text-red-400 text-center">{error}</p>}
      </div>

      {/* ── Output ── */}
      <AnimatePresence>
        {output && !isGenerating && (
          <motion.div ref={outputRef} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>

            {/* Brand banner */}
            <div className="bg-black text-white rounded-2xl p-5 mb-4">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                {/* Color dots */}
                <div className="flex gap-1.5 pt-1 shrink-0">
                  {output.brand_kit.colors.slice(0, 4).map(c => (
                    <div key={c.hex} className="w-5 h-5 rounded-full border border-white/20" style={{ backgroundColor: c.hex }} title={c.hex} />
                  ))}
                </div>

                {/* Brand info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl font-bold">{brandName}</h2>
                    {score && (
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-black border ${
                        score.overall >= 85
                          ? "bg-emerald-500/20 border-emerald-400/50 text-emerald-300"
                          : "bg-white/10 border-white/20 text-white/80"
                      }`}>
                        {score.grade} · {score.overall}/100
                      </span>
                    )}
                  </div>
                  {output.brand_kit.taglines[0] && (
                    <p className="text-white/60 text-sm mt-0.5 italic">"{output.brand_kit.taglines[0]}"</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
                  {/* Score */}
                  <button
                    onClick={handleScore}
                    disabled={isScoring || !!score}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-white/20 hover:border-white/40 hover:bg-white/10 text-white/80 hover:text-white text-xs font-medium transition disabled:opacity-50"
                  >
                    {isScoring ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <AnimatePresence mode="wait">
                          <motion.span key={scoreMsg} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            {scoreMsg}
                          </motion.span>
                        </AnimatePresence>
                      </>
                    ) : score ? (
                      <><BarChart2 className="w-3.5 h-3.5 text-emerald-400" /> Scored</>
                    ) : (
                      <><Star className="w-3.5 h-3.5" /> Score Brand</>
                    )}
                  </button>

                  {/* Launch Mode */}
                  <button
                    onClick={handleLaunch}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-white text-black rounded-xl text-xs font-semibold hover:bg-gray-100 transition"
                  >
                    <Rocket className="w-3.5 h-3.5" />
                    Launch Mode
                    {isPremium ? <ArrowRight className="w-3 h-3" /> : <Lock className="w-3 h-3 opacity-50" />}
                  </button>

                  {/* Publish */}
                  <button
                    onClick={handlePublish}
                    disabled={published}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-white/20 hover:border-white/40 hover:bg-white/10 text-white/80 hover:text-white text-xs font-medium transition disabled:opacity-50"
                  >
                    {published ? <><Check className="w-3.5 h-3.5 text-emerald-400" /> Published</> : <><Share2 className="w-3.5 h-3.5" /> Showcase</>}
                  </button>

                  {/* Reset */}
                  <button onClick={handleReset} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-white/40 hover:text-white/70 text-xs transition">
                    <RefreshCw className="w-3.5 h-3.5" /> New
                  </button>
                </div>
              </div>
            </div>

            {/* Tab bar */}
            <div className="flex gap-1 p-1 bg-gray-100 dark:bg-white/5 rounded-2xl mb-5 overflow-x-auto">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition flex-1 justify-center ${
                    activeTab === id
                      ? "bg-white dark:bg-[#181818] text-gray-900 dark:text-white shadow-sm"
                      : "text-gray-500 dark:text-white/40 hover:text-gray-700 dark:hover:text-white/60"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  {label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}>

                {/* ── OVERVIEW ── */}
                {activeTab === "overview" && (
                  <div className="space-y-5">
                    {/* Brand Score (inline when scored) */}
                    {score && (
                      <div className="bg-white dark:bg-[#181818] rounded-2xl border border-gray-100 dark:border-white/8 p-6">
                        <div className="flex items-center gap-2 mb-5">
                          <BarChart2 className="w-4 h-4 text-gray-400 dark:text-white/30" />
                          <span className="font-semibold text-gray-900 dark:text-white">Brand Score</span>
                        </div>
                        <div className="flex items-start gap-5 mb-5">
                          {/* Grade */}
                          <div className={`flex flex-col items-center justify-center w-20 h-20 rounded-2xl border-2 shrink-0 ${
                            score.overall >= 85
                              ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-500/10"
                              : "border-gray-200 dark:border-white/15 bg-gray-50 dark:bg-white/5"
                          }`}>
                            <span className={`text-3xl font-black ${score.overall >= 85 ? "text-emerald-600 dark:text-emerald-400" : "text-gray-800 dark:text-white"}`}>{score.grade}</span>
                            <span className="text-xs text-gray-400 dark:text-white/35">{score.overall}/100</span>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-700 dark:text-white/65 leading-relaxed mb-3">{score.summary}</p>
                            <div className="flex flex-wrap gap-2">
                              {score.improvements.map(imp => (
                                <div key={imp.title} className="px-3 py-2 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/8 min-w-0">
                                  <p className="text-xs font-semibold text-gray-800 dark:text-white/80">{imp.title}</p>
                                  <p className="text-xs text-gray-500 dark:text-white/40 mt-0.5">{imp.description}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {Object.entries(score.scores).map(([key, val]) => (
                            <ScoreBar key={key} label={key} score={val.score} reason={val.reason} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Colors */}
                    <div className="bg-white dark:bg-[#181818] rounded-2xl border border-gray-100 dark:border-white/8 p-6">
                      <p className="text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-wider mb-4">Color Palette</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {output.brand_kit.colors.map(c => (
                          <div key={c.hex} className="group">
                            <div className="w-full h-16 rounded-xl mb-2 border border-gray-100 dark:border-white/8 transition-transform group-hover:scale-105" style={{ backgroundColor: c.hex }} />
                            <p className="text-xs font-semibold text-gray-800 dark:text-white/80">{c.name}</p>
                            <p className="text-xs font-mono text-gray-400 dark:text-white/35">{c.hex}</p>
                            <p className="text-xs text-gray-400 dark:text-white/25 mt-0.5">{c.usage}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Typography + Tone */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="bg-white dark:bg-[#181818] rounded-2xl border border-gray-100 dark:border-white/8 p-5">
                        <p className="text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-wider mb-3">Typography</p>
                        <div className="space-y-2">
                          {output.brand_kit.fonts.map(f => (
                            <div key={f.name} className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-white/5 rounded-xl">
                              <span className="text-sm font-semibold text-gray-900 dark:text-white">{f.name}</span>
                              <span className="text-xs px-1.5 py-0.5 bg-black dark:bg-white text-white dark:text-black rounded-full capitalize">{f.type}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="bg-white dark:bg-[#181818] rounded-2xl border border-gray-100 dark:border-white/8 p-5">
                        <p className="text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-wider mb-3">Tone of Voice</p>
                        <div className="flex flex-wrap gap-2">
                          {output.brand_kit.tone_of_voice.map(t => (
                            <span key={t} className="px-3 py-1.5 bg-gray-100 dark:bg-white/8 rounded-full text-sm text-gray-700 dark:text-white/65 font-medium">{t}</span>
                          ))}
                        </div>
                        {output.brand_kit.values?.length > 0 && (
                          <>
                            <p className="text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-wider mb-2 mt-4">Core Values</p>
                            <div className="flex flex-wrap gap-2">
                              {output.brand_kit.values.map(v => (
                                <span key={v} className="px-3 py-1 border border-gray-200 dark:border-white/10 rounded-full text-xs text-gray-600 dark:text-white/55">{v}</span>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Taglines */}
                    <div className="bg-white dark:bg-[#181818] rounded-2xl border border-gray-100 dark:border-white/8 p-5">
                      <p className="text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-wider mb-3">Taglines</p>
                      <div className="space-y-2">
                        {output.brand_kit.taglines.map((t, i) => (
                          <div key={i} className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl">
                            <span className="text-sm text-gray-800 dark:text-white/80 font-medium">"{t}"</span>
                            <CopyButton text={t} />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Mission + Story */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {output.brand_kit.mission && (
                        <div className="bg-white dark:bg-[#181818] rounded-2xl border border-gray-100 dark:border-white/8 p-5">
                          <p className="text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-wider mb-2">Mission</p>
                          <p className="text-sm text-gray-700 dark:text-white/65 leading-relaxed">{output.brand_kit.mission}</p>
                        </div>
                      )}
                      {output.brand_kit.brand_story && (
                        <div className="bg-white dark:bg-[#181818] rounded-2xl border border-gray-100 dark:border-white/8 p-5">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <p className="text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-wider">Brand Story</p>
                            <CopyButton text={output.brand_kit.brand_story} />
                          </div>
                          <p className="text-sm text-gray-700 dark:text-white/65 leading-relaxed">{output.brand_kit.brand_story}</p>
                        </div>
                      )}
                    </div>

                    {/* CTA nudge to next steps */}
                    {!score && (
                      <div className="bg-gray-50 dark:bg-white/3 border border-dashed border-gray-200 dark:border-white/10 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-800 dark:text-white/80">What's next?</p>
                          <p className="text-xs text-gray-500 dark:text-white/40 mt-0.5">Score your brand to see where it stands, or jump straight into Launch Mode for go-to-market copy.</p>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <button onClick={handleScore} disabled={isScoring} className="flex items-center gap-1.5 px-3.5 py-2 bg-black dark:bg-white text-white dark:text-black rounded-xl text-xs font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition disabled:opacity-50">
                            <Star className="w-3.5 h-3.5" /> Score Brand
                          </button>
                          <button onClick={handleLaunch} className="flex items-center gap-1.5 px-3.5 py-2 border border-gray-200 dark:border-white/15 text-gray-700 dark:text-white/70 rounded-xl text-xs font-semibold hover:border-gray-400 dark:hover:border-white/30 transition">
                            <Rocket className="w-3.5 h-3.5" /> Launch Mode
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ── MARKET ── */}
                {activeTab === "market" && (
                  <div className="space-y-5">
                    <div className="bg-white dark:bg-[#181818] rounded-2xl border border-gray-100 dark:border-white/8 p-6">
                      <p className="text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-wider mb-4">Competitors</p>
                      <div className="space-y-3">
                        {output.market_analysis.competitors.map(c => (
                          <div key={c.name} className="px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/8">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-lg bg-black dark:bg-white text-white dark:text-black flex items-center justify-center text-xs font-bold shrink-0">{c.name.charAt(0)}</div>
                              <div>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">{c.name}</p>
                                <p className="text-xs text-gray-500 dark:text-white/45 mt-0.5">{c.description}</p>
                                <div className="flex items-start gap-1.5 mt-1.5">
                                  <span className="text-xs px-2 py-0.5 bg-orange-100 dark:bg-orange-500/15 text-orange-700 dark:text-orange-400 rounded-full font-medium shrink-0">Gap</span>
                                  <span className="text-xs text-gray-600 dark:text-white/50">{c.weakness}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { label: "Market Gap",       value: output.market_analysis.market_gap,          icon: Target     },
                        { label: "Positioning",      value: output.market_analysis.positioning,          icon: Zap        },
                        { label: "Pricing Strategy", value: output.market_analysis.pricing_strategy,     icon: TrendingUp },
                        { label: "Market Size",      value: output.market_analysis.target_market_size,   icon: Users      },
                      ].map(({ label, value, icon: Icon }) => (
                        <div key={label} className="bg-white dark:bg-[#181818] rounded-2xl border border-gray-100 dark:border-white/8 p-5">
                          <div className="flex items-center gap-2 mb-2">
                            <Icon className="w-3.5 h-3.5 text-gray-400 dark:text-white/30" />
                            <p className="text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-wider">{label}</p>
                          </div>
                          <p className="text-sm text-gray-800 dark:text-white/75 leading-relaxed">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── LAUNCH PLAN ── */}
                {activeTab === "plan" && (
                  <div className="space-y-4">
                    {[
                      { label: "Week 1 — Foundation",   items: output.launch_plan.week_1,     color: "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-500/20"   },
                      { label: "Weeks 2–4 — Momentum",  items: output.launch_plan.week_2_4,   color: "bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-100 dark:border-purple-500/20" },
                      { label: "Months 2–3 — Scale",    items: output.launch_plan.month_2_3,  color: "bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-100 dark:border-green-500/20"  },
                    ].map(({ label, items, color }) => (
                      <div key={label} className="bg-white dark:bg-[#181818] rounded-2xl border border-gray-100 dark:border-white/8 p-5">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${color} mb-3`}>{label}</span>
                        <ul className="space-y-2">
                          {items.map((item, i) => (
                            <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700 dark:text-white/65">
                              <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-white/25 mt-2 shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}

                    {output.launch_plan.marketing_channels?.length > 0 && (
                      <div className="bg-white dark:bg-[#181818] rounded-2xl border border-gray-100 dark:border-white/8 p-5">
                        <p className="text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-wider mb-3">Marketing Channels</p>
                        <div className="flex flex-wrap gap-2">
                          {output.launch_plan.marketing_channels.map((c, i) => (
                            <span key={i} className="px-3 py-1.5 bg-black dark:bg-white text-white dark:text-black rounded-full text-xs font-medium">{c}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {output.launch_plan.content_ideas?.length > 0 && (
                      <div className="bg-white dark:bg-[#181818] rounded-2xl border border-gray-100 dark:border-white/8 p-5">
                        <p className="text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-wider mb-3">Content Ideas</p>
                        <div className="space-y-2">
                          {output.launch_plan.content_ideas.map((idea, i) => (
                            <div key={i} className="flex items-start gap-2.5 px-3 py-2 bg-gray-50 dark:bg-white/5 rounded-xl">
                              <Lightbulb className="w-3.5 h-3.5 text-yellow-500 mt-0.5 shrink-0" />
                              <span className="text-sm text-gray-700 dark:text-white/65">{idea}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Launch Mode nudge */}
                    <div className="bg-black text-white rounded-2xl p-5 flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold text-sm">Need the full go-to-market kit?</p>
                        <p className="text-white/50 text-xs mt-0.5">Launch Mode generates landing page copy, social posts, outreach templates, and email sequences.</p>
                      </div>
                      <button onClick={handleLaunch} className="flex items-center gap-2 px-4 py-2.5 bg-white text-black rounded-xl text-sm font-semibold hover:bg-gray-100 transition shrink-0">
                        <Rocket className="w-4 h-4" /> Launch Mode
                      </button>
                    </div>
                  </div>
                )}

                {/* ── WEBSITE ── */}
                {activeTab === "website" && (
                  <div className="space-y-4">
                    {/* Hero card */}
                    <div className="bg-white dark:bg-[#181818] rounded-2xl border border-gray-100 dark:border-white/8 p-8 text-center">
                      <div className="w-14 h-14 rounded-2xl bg-black dark:bg-white flex items-center justify-center mx-auto mb-5">
                        <Globe className="w-7 h-7 text-white dark:text-black" />
                      </div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Your website brief is ready</h2>
                      <p className="text-sm text-gray-500 dark:text-white/45 max-w-sm mx-auto mb-6">
                        Brando has written a complete website brief for <span className="font-semibold text-gray-900 dark:text-white">{brandName}</span>. Copy it and paste it into any AI website builder to launch your site in minutes.
                      </p>
                      <button
                        onClick={() => setShowWebModal(true)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl font-semibold text-sm hover:bg-gray-800 dark:hover:bg-gray-100 transition"
                      >
                        <Rocket className="w-4 h-4" /> Build My Website
                      </button>
                    </div>

                    {/* Brief preview (collapsed) */}
                    <div className="bg-white dark:bg-[#181818] rounded-2xl border border-gray-100 dark:border-white/8 p-5">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-wider">Brief preview</span>
                        <CopyButton text={output.website_prompt} />
                      </div>
                      <p className="text-sm text-gray-600 dark:text-white/50 line-clamp-4 leading-relaxed font-mono">
                        {output.website_prompt}
                      </p>
                    </div>
                  </div>
                )}

                {/* ── LOGOS ── */}
                {activeTab === "logos" && (
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="bg-white dark:bg-[#181818] rounded-2xl border border-gray-100 dark:border-white/8 p-5 flex items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <ImageIcon className="w-4 h-4 text-gray-400 dark:text-white/30" />
                          <span className="font-semibold text-gray-900 dark:text-white">AI Logo</span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-white/40">Generate a clean logo on a plain white background.</p>
                      </div>
                      <button
                        onClick={handleGenLogo}
                        disabled={isGenLogo}
                        className="flex items-center gap-2 px-4 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-xl text-sm font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-50 transition shrink-0"
                      >
                        {isGenLogo
                          ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating…</>
                          : <><Sparkles className="w-3.5 h-3.5" /> Generate Logo</>}
                      </button>
                    </div>

                    {/* Empty state */}
                    {!logoUrl && !isGenLogo && (
                      <div className="flex flex-col items-center justify-center py-16 rounded-2xl bg-gray-50 dark:bg-white/3 border border-dashed border-gray-200 dark:border-white/10">
                        <ImageIcon className="w-9 h-9 text-gray-200 dark:text-white/15 mb-3" />
                        <p className="text-sm text-gray-500 dark:text-white/35 font-medium">No logo yet</p>
                        <p className="text-xs text-gray-300 dark:text-white/20 mt-0.5">Click Generate Logo to create your brand logo</p>
                      </div>
                    )}

                    {/* Logo card */}
                    {(isGenLogo || logoUrl) && (
                      <div className="bg-white dark:bg-[#181818] rounded-2xl border border-gray-100 dark:border-white/8 overflow-hidden max-w-sm mx-auto w-full">
                        <div className="relative aspect-square bg-white">
                          {isGenLogo && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                              <Loader2 className="w-7 h-7 animate-spin text-gray-300 dark:text-white/20" />
                              <p className="text-xs text-gray-400 dark:text-white/30">Creating logo…</p>
                            </div>
                          )}
                          {logoUrl && (
                            <>
                              <img src={logoUrl} alt={`${brandName} logo`} className="w-full h-full object-contain p-6" />
                              <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition flex items-end justify-center pb-3 opacity-0 hover:opacity-100">
                                <button onClick={() => downloadImage(logoUrl, `${brandName}-logo.png`)} className="px-3 py-1.5 bg-white text-black text-xs font-semibold rounded-lg shadow">
                                  Download
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                        <div className="px-4 py-3 border-t border-gray-100 dark:border-white/8">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">Logo</p>
                          <p className="text-xs text-gray-400 dark:text-white/35">Plain white background</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state when no output and not generating */}
      {!output && !isGenerating && (
        <div className="mt-4">
          <p className="text-xs font-semibold text-gray-400 dark:text-white/25 uppercase tracking-wider mb-4">What you'll get</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { icon: Palette,    label: "Brand Identity",    desc: "Colors, fonts, tone, taglines, story" },
              { icon: TrendingUp, label: "Market Analysis",   desc: "Competitors, gaps, pricing, positioning" },
              { icon: Rocket,     label: "Launch Plan",       desc: "Week-by-week go-to-market roadmap"    },
              { icon: Monitor,    label: "Website Prompt",    desc: "Ready to paste into any AI builder"   },
              { icon: ImageIcon,  label: "Logo Concepts",     desc: "AI-generated logo ideas with DALL·E 3"},
              { icon: BarChart2,  label: "Brand Score",       desc: "A–F grade with actionable improvements"},
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="bg-white dark:bg-[#181818] rounded-2xl border border-gray-100 dark:border-white/8 p-4">
                <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/8 flex items-center justify-center mb-3">
                  <Icon className="w-4 h-4 text-gray-500 dark:text-white/40" />
                </div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{label}</p>
                <p className="text-xs text-gray-400 dark:text-white/35 mt-0.5 leading-snug">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Website Modal ── */}
      <AnimatePresence>
        {showWebModal && output && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowWebModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />

            {/* Panel */}
            <motion.div
              key="modal"
              initial={{ opacity: 0, y: 32, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 340, damping: 30 }}
              className="fixed inset-x-4 top-[5vh] bottom-[5vh] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl z-50 flex flex-col bg-white dark:bg-[#111] rounded-2xl shadow-2xl border border-gray-100 dark:border-white/10 overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-white/8 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-black dark:bg-white flex items-center justify-center">
                    <Globe className="w-4.5 h-4.5 text-white dark:text-black" />
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900 dark:text-white text-base">Your Website Is Ready</h2>
                    <p className="text-xs text-gray-400 dark:text-white/35">Brando prepared everything — now launch it.</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowWebModal(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/8 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable body */}
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

                {/* Brand summary */}
                <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-white/4 border border-gray-100 dark:border-white/8">
                  <div className="flex gap-1.5 shrink-0">
                    {output.brand_kit.colors.slice(0, 3).map(c => (
                      <span key={c.hex} className="w-5 h-5 rounded-full border border-black/10" style={{ backgroundColor: c.hex }} />
                    ))}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{brandName}</p>
                    {output.brand_kit.taglines[0] && (
                      <p className="text-xs text-gray-400 dark:text-white/35 truncate italic">"{output.brand_kit.taglines[0]}"</p>
                    )}
                  </div>
                  {score && (
                    <span className="ml-auto shrink-0 px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-400/30">
                      {score.grade}
                    </span>
                  )}
                </div>

                {/* Website brief */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-wider">Website Brief</span>
                    <button
                      onClick={handleCopyWebPrompt}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 transition"
                    >
                      {webCopied ? <><Check className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy Brief</>}
                    </button>
                  </div>
                  <div className="relative rounded-xl bg-gray-50 dark:bg-white/4 border border-gray-100 dark:border-white/8 p-4 max-h-52 overflow-y-auto">
                    <p className="text-sm text-gray-600 dark:text-white/55 font-mono leading-relaxed whitespace-pre-wrap">
                      {output.website_prompt}
                    </p>
                  </div>
                </div>

                {/* Next steps */}
                <div>
                  <span className="text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-wider">Next Steps</span>
                  <div className="mt-2 space-y-2">
                    {[
                      { icon: ExternalLink,      step: "1", label: "Open Hostinger Website Builder", sub: "Click the button below to open the builder" },
                      { icon: Copy,              step: "2", label: "Paste your brief",               sub: "Paste the copied text into the AI prompt field" },
                      { icon: Paintbrush,        step: "3", label: "Customize your design",          sub: "Adjust colors, fonts, and images to match your brand" },
                      { icon: SendHorizonal,     step: "4", label: "Publish",                        sub: "Go live and start driving traffic to your brand" },
                    ].map(({ icon: Icon, step, label, sub }) => (
                      <div key={step} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-white/4 border border-gray-100 dark:border-white/8">
                        <div className="w-6 h-6 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                          {step}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">{label}</p>
                          <p className="text-xs text-gray-400 dark:text-white/35">{sub}</p>
                        </div>
                        <Icon className="w-4 h-4 text-gray-300 dark:text-white/20 shrink-0 mt-0.5" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer CTAs */}
              <div className="px-6 py-4 border-t border-gray-100 dark:border-white/8 shrink-0 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleCopyWebPrompt}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gray-200 dark:border-white/15 text-gray-700 dark:text-white/70 hover:bg-gray-50 dark:hover:bg-white/5 text-sm font-semibold transition"
                >
                  {webCopied ? <><Check className="w-4 h-4 text-emerald-500" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Brief</>}
                </button>
                <a
                  href="https://www.hostinger.com/website-builder"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-black dark:bg-white text-white dark:text-black text-sm font-bold hover:bg-gray-800 dark:hover:bg-gray-100 transition"
                >
                  <MousePointerClick className="w-4 h-4" /> Open Website Builder <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
