"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Globe, Plus, Eye, EyeOff, ExternalLink, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

interface PageRow {
  id: string;
  project_id: string;
  brand_name: string;
  slug: string;
  published: boolean;
  created_at: string;
}

export default function LandingPagesIndex() {
  const [pages,   setPages]   = useState<PageRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/landing-pages")
      .then(r => r.json())
      .then(json => setPages(json.data ?? []))
      .finally(() => setLoading(false));
  }, []);

  function timeAgo(iso: string) {
    const d = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
    return d === 0 ? "Today" : d === 1 ? "Yesterday" : `${d}d ago`;
  }

  return (
    <div className="min-h-full px-6 py-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Landing Pages</h1>
          <p className="text-sm text-gray-500 dark:text-white/40 mt-0.5">AI-generated pages, one per project</p>
        </div>
        <Link
          href="/dashboard/projects"
          className="flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-xl text-sm font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition"
        >
          <Plus className="w-4 h-4" /> New Page
        </Link>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-gray-300 dark:text-white/20" />
        </div>
      )}

      {!loading && pages.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-white/8 flex items-center justify-center mb-5">
            <Globe className="w-8 h-8 text-gray-300 dark:text-white/20" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No landing pages yet</h2>
          <p className="text-sm text-gray-500 dark:text-white/40 mb-6 max-w-sm">
            Open a brand project and generate its landing page.
          </p>
          <Link
            href="/dashboard/projects"
            className="flex items-center gap-2 px-5 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-xl text-sm font-semibold transition hover:bg-gray-800 dark:hover:bg-gray-100"
          >
            Go to Projects <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {!loading && pages.length > 0 && (
        <div className="space-y-3">
          {pages.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-white dark:bg-[#181818] rounded-2xl border border-gray-100 dark:border-white/8 p-5 flex items-center gap-5"
            >
              <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/8 flex items-center justify-center shrink-0">
                <Globe className="w-5 h-5 text-gray-400 dark:text-white/30" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 dark:text-white truncate">{p.brand_name}</p>
                <p className="text-xs text-gray-400 dark:text-white/30 font-mono truncate">/p/{p.slug}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                  p.published
                    ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-400/20"
                    : "bg-gray-100 dark:bg-white/8 text-gray-500 dark:text-white/35"
                }`}>
                  {p.published ? <><Eye className="w-3 h-3" /> Live</> : <><EyeOff className="w-3 h-3" /> Draft</>}
                </span>
                <span className="text-xs text-gray-400 dark:text-white/30 hidden sm:inline">{timeAgo(p.created_at)}</span>
                {p.published && (
                  <a
                    href={`/p/${p.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/8 transition"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                <Link
                  href={`/dashboard/landing-pages/${p.project_id}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-black dark:bg-white text-white dark:text-black rounded-xl text-xs font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition"
                >
                  Edit <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
