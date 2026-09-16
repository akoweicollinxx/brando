"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Sparkles, Loader2, Check, Calendar, ArrowUpRight } from "lucide-react";
import type { ContentPost, PostStatus } from "@/lib/types";

const PLATFORM_COLORS: Record<string, string> = {
  "Twitter/X": "bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-400/20",
  "LinkedIn":  "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-400/20",
  "Instagram": "bg-pink-50 dark:bg-pink-500/10 text-pink-700 dark:text-pink-400 border-pink-200 dark:border-pink-400/20",
  "TikTok":    "bg-gray-100 dark:bg-white/8 text-gray-700 dark:text-white/60 border-gray-200 dark:border-white/10",
};

type PostRow = ContentPost & { brand_name: string };

export default function ContentPage() {
  const [projects,   setProjects]   = useState<{ id: string; brand_name: string }[]>([]);
  const [projectId,  setProjectId]  = useState("");
  const [posts,      setPosts]      = useState<PostRow[]>([]);
  const [loading,    setLoading]    = useState(false);
  const [generating, setGenerating] = useState(false);
  const [filter,     setFilter]     = useState<PostStatus | "all">("all");

  useEffect(() => {
    fetch("/api/projects")
      .then(r => r.json())
      .then(json => {
        const list = (json.data ?? []).map((p: any) => ({ id: p.id, brand_name: p.brand_name }));
        setProjects(list);
        if (list.length > 0) setProjectId(list[0].id);
      });
  }, []);

  useEffect(() => {
    if (!projectId) return;
    setLoading(true);
    fetch(`/api/content-posts?projectId=${projectId}`)
      .then(r => r.json())
      .then(json => setPosts(json.data ?? []))
      .finally(() => setLoading(false));
  }, [projectId]);

  async function handleGenerate() {
    if (!projectId) return;
    setGenerating(true);
    const res  = await fetch("/api/generate-posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId }),
    });
    const json = await res.json();
    if (json.posts) setPosts(prev => [...json.posts, ...prev]);
    setGenerating(false);
  }

  async function markPosted(id: string) {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, status: "posted" as PostStatus } : p));
    await fetch("/api/content-posts/status", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: "posted" }),
    });
  }

  const filtered = posts.filter(p => filter === "all" || p.status === filter);

  return (
    <div className="min-h-full px-6 py-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Content</h1>
          <p className="text-sm text-gray-500 dark:text-white/40 mt-0.5">AI-generated social media posts for your brands</p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={generating || !projectId}
          className="flex items-center gap-2 px-4 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-xl text-sm font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition disabled:opacity-50"
        >
          {generating ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating…</> : <><Sparkles className="w-4 h-4" /> Generate Posts</>}
        </button>
      </div>

      {/* Project + filter row */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        {projects.length > 1 && (
          <select
            value={projectId}
            onChange={e => setProjectId(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-sm text-gray-900 dark:text-white focus:outline-none"
          >
            {projects.map(p => <option key={p.id} value={p.id}>{p.brand_name}</option>)}
          </select>
        )}
        {(["all", "draft", "scheduled", "posted"] as const).map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition capitalize ${
              filter === s
                ? "bg-black dark:bg-white text-white dark:text-black border-transparent"
                : "bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/50 hover:bg-gray-50 dark:hover:bg-white/8"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading && <div className="flex items-center justify-center py-24"><Loader2 className="w-8 h-8 animate-spin text-gray-300 dark:text-white/20" /></div>}

      {!loading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-white/8 flex items-center justify-center mb-4">
            <FileText className="w-7 h-7 text-gray-300 dark:text-white/20" />
          </div>
          <p className="text-gray-500 dark:text-white/40 font-medium">No posts yet</p>
          <p className="text-sm text-gray-400 dark:text-white/25 mt-1">Generate posts to fill your content calendar.</p>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="grid gap-4">
          {filtered.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="bg-white dark:bg-[#181818] rounded-2xl border border-gray-100 dark:border-white/8 p-5"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${PLATFORM_COLORS[post.platform] ?? PLATFORM_COLORS["TikTok"]}`}>
                    {post.platform}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    post.status === "posted" ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10"
                    : post.status === "scheduled" ? "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-500/10"
                    : "text-gray-500 dark:text-white/35 bg-gray-100 dark:bg-white/8"
                  }`}>
                    {post.status}
                  </span>
                </div>
                {post.status !== "posted" && (
                  <button
                    onClick={() => markPosted(post.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-500/15 transition border border-emerald-200 dark:border-emerald-400/20 shrink-0"
                  >
                    <Check className="w-3 h-3" /> Mark Posted
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-700 dark:text-white/70 leading-relaxed whitespace-pre-wrap">{post.content}</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
