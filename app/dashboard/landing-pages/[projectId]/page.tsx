"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe, Loader2, Sparkles, Copy, Check, Eye, EyeOff,
  ExternalLink, RefreshCw, ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import type { LandingPage, LandingPageContent } from "@/lib/types";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-[#181818] rounded-2xl border border-gray-100 dark:border-white/8 p-5">
      <p className="text-xs font-semibold text-gray-400 dark:text-white/30 uppercase tracking-wider mb-3">{title}</p>
      {children}
    </div>
  );
}

export default function LandingPageBuilder() {
  const { projectId } = useParams<{ projectId: string }>();

  const [page,       setPage]       = useState<LandingPage | null>(null);
  const [loading,    setLoading]    = useState(true);
  const [generating, setGenerating] = useState(false);
  const [saving,     setSaving]     = useState(false);
  const [copied,     setCopied]     = useState(false);
  const [error,      setError]      = useState<string | null>(null);

  const publicUrl = page ? `${typeof window !== "undefined" ? window.location.origin : ""}/p/${page.slug}` : "";

  useEffect(() => {
    fetch(`/api/landing-pages`)
      .then(r => r.json())
      .then(json => {
        const found = json.data?.find((p: any) => p.project_id === projectId);
        setPage(found ?? null);
      })
      .catch(() => setError("Failed to load"))
      .finally(() => setLoading(false));
  }, [projectId]);

  async function handleGenerate() {
    setGenerating(true);
    setError(null);
    try {
      const res  = await fetch("/api/generate-landing-page", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setPage(json.landing_page);
    } catch (e: any) {
      setError(e.message || "Generation failed");
    } finally {
      setGenerating(false);
    }
  }

  async function handleTogglePublish() {
    if (!page) return;
    setSaving(true);
    const newVal = !page.published;
    try {
      await fetch(`/api/landing-pages/${page.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: newVal }),
      });
      setPage(prev => prev ? { ...prev, published: newVal } : prev);
    } finally {
      setSaving(false);
    }
  }

  async function copyUrl() {
    await navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-full">
        <Loader2 className="w-8 h-8 animate-spin text-gray-300 dark:text-white/20" />
      </div>
    );
  }

  return (
    <div className="min-h-full px-6 py-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link href="/dashboard/landing-pages" className="p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/8 transition">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Landing Page Builder</h1>
          <p className="text-sm text-gray-500 dark:text-white/40 mt-0.5">AI-generated, ready to publish</p>
        </div>
        {page && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-gray-200 dark:border-white/15 text-gray-700 dark:text-white/70 hover:bg-gray-50 dark:hover:bg-white/5 text-sm font-medium transition disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${generating ? "animate-spin" : ""}`} />
              Regenerate
            </button>
            <button
              onClick={handleTogglePublish}
              disabled={saving}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition disabled:opacity-50 ${
                page.published
                  ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-400/20 hover:bg-emerald-100"
                  : "bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100"
              }`}
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : page.published ? <><Eye className="w-3.5 h-3.5" /> Published</> : <><EyeOff className="w-3.5 h-3.5" /> Publish</>}
            </button>
          </div>
        )}
      </div>

      {/* No page yet */}
      {!page && !generating && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-white/8 flex items-center justify-center mb-5">
            <Globe className="w-8 h-8 text-gray-300 dark:text-white/20" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No landing page yet</h2>
          <p className="text-sm text-gray-500 dark:text-white/40 mb-6 max-w-sm">
            Generate a complete, branded landing page from your brand kit in seconds.
          </p>
          {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
          <button
            onClick={handleGenerate}
            className="flex items-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl font-semibold text-sm hover:bg-gray-800 dark:hover:bg-gray-100 transition"
          >
            <Sparkles className="w-4 h-4" /> Generate Landing Page
          </button>
        </div>
      )}

      {/* Generating skeleton */}
      {generating && (
        <div className="space-y-4">
          {[1,2,3].map(i => (
            <div key={i} className="bg-white dark:bg-[#181818] rounded-2xl border border-gray-100 dark:border-white/8 p-5 animate-pulse">
              <div className="h-3 bg-gray-100 dark:bg-white/8 rounded w-1/4 mb-3" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-100 dark:bg-white/8 rounded w-3/4" />
                <div className="h-4 bg-gray-100 dark:bg-white/8 rounded w-1/2" />
              </div>
            </div>
          ))}
          <p className="text-center text-sm text-gray-400 dark:text-white/30 pt-2">
            <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
            Writing your landing page…
          </p>
        </div>
      )}

      {/* Page content preview */}
      {page && !generating && (
        <AnimatePresence mode="wait">
          <motion.div
            key={page.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* URL bar */}
            {page.published && (
              <div className="bg-emerald-50 dark:bg-emerald-500/8 border border-emerald-200 dark:border-emerald-400/20 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
                <p className="flex-1 text-sm text-emerald-700 dark:text-emerald-400 font-mono truncate">{publicUrl}</p>
                <button onClick={copyUrl} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-xs font-semibold hover:bg-emerald-600 transition shrink-0">
                  {copied ? <><Check className="w-3 h-3" /> Copied!</> : <><Copy className="w-3 h-3" /> Copy URL</>}
                </button>
                <a href={publicUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-500/10 transition">
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            )}

            {/* Hero */}
            <Section title="Hero">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{page.content.hero.headline}</h2>
              <p className="text-sm text-gray-500 dark:text-white/45 mb-3">{page.content.hero.subheadline}</p>
              <div className="flex gap-2">
                <span className="px-3 py-1 rounded-lg text-xs font-semibold text-white" style={{ backgroundColor: page.content.brand.primary_color }}>{page.content.hero.cta_text}</span>
                {page.content.hero.cta_secondary && <span className="px-3 py-1 rounded-lg text-xs font-semibold border border-gray-200 dark:border-white/15 text-gray-600 dark:text-white/60">{page.content.hero.cta_secondary}</span>}
              </div>
            </Section>

            {/* Features */}
            <Section title={`Features (${page.content.features?.length ?? 0})`}>
              <div className="space-y-2">
                {page.content.features?.map((f, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-5 h-5 rounded-md flex items-center justify-center text-white text-[10px] font-bold shrink-0 mt-0.5" style={{ backgroundColor: page.content.brand.accent_color }}>{i+1}</div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{f.title}</p>
                      <p className="text-xs text-gray-400 dark:text-white/35">{f.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            {/* Social Proof + Testimonials */}
            <div className="grid md:grid-cols-2 gap-4">
              <Section title="Social Proof">
                <div className="space-y-1">
                  {page.content.social_proof?.map((s, i) => (
                    <p key={i} className="text-sm text-gray-600 dark:text-white/60">✓ {s}</p>
                  ))}
                </div>
              </Section>
              <Section title={`Testimonials (${page.content.testimonials?.length ?? 0})`}>
                <div className="space-y-2">
                  {page.content.testimonials?.map((t, i) => (
                    <div key={i} className="text-xs">
                      <p className="text-gray-600 dark:text-white/55 italic">"{t.text}"</p>
                      <p className="text-gray-400 dark:text-white/30 mt-0.5">— {t.name}, {t.role}</p>
                    </div>
                  ))}
                </div>
              </Section>
            </div>

            {/* CTA */}
            <Section title="Call to Action">
              <p className="font-bold text-gray-900 dark:text-white">{page.content.cta?.headline}</p>
              <p className="text-sm text-gray-500 dark:text-white/45">{page.content.cta?.subheadline}</p>
            </Section>

            {/* FAQ */}
            <Section title={`FAQ (${page.content.faq?.length ?? 0} questions)`}>
              <div className="space-y-2">
                {page.content.faq?.map((f, i) => (
                  <div key={i}>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{f.question}</p>
                    <p className="text-xs text-gray-400 dark:text-white/35">{f.answer}</p>
                  </div>
                ))}
              </div>
            </Section>

            {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
