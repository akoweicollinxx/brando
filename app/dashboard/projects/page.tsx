"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FolderOpen,
  Trash2,
  Zap,
  BarChart2,
  Loader2,
  ArrowRight,
  Star,
} from "lucide-react";
import type { BrandProject } from "@/lib/db";

function gradeColor(grade: string) {
  if (grade.startsWith("A")) return "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-300 dark:border-emerald-500/30";
  if (grade.startsWith("B")) return "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border-blue-300 dark:border-blue-500/30";
  return "text-gray-600 dark:text-white/50 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10";
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<BrandProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setProjects(json.data);
        else setError(json.error);
      })
      .catch(() => setError("Failed to load projects"))
      .finally(() => setIsLoading(false));
  }, []);

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      await fetch(`/api/projects/${id}`, { method: "DELETE" });
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch {
      /* ignore */
    } finally {
      setDeletingId(null);
    }
  }

  function openProject(project: BrandProject) {
    sessionStorage.setItem("brando_brand_name", project.brand_name);
    sessionStorage.setItem("brando_industry", project.industry ?? "");
    sessionStorage.setItem("brando_output", JSON.stringify(project.brand_output));
    router.push("/dashboard");
  }

  return (
    <div className="min-h-full px-8 py-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <FolderOpen className="w-5 h-5 text-gray-400 dark:text-white/30" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Projects</h1>
        </div>
        <p className="text-gray-500 dark:text-white/45 ml-7">All your saved brand kits, synced from Supabase.</p>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-gray-300 dark:text-white/20" />
        </div>
      )}

      {error && !isLoading && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-sm text-red-500 dark:text-red-400 mb-2">{error}</p>
          <p className="text-xs text-gray-400 dark:text-white/30">Check that your Supabase environment variables are set.</p>
        </div>
      )}

      {!isLoading && !error && projects.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-white/8 flex items-center justify-center mb-4">
            <FolderOpen className="w-7 h-7 text-gray-300 dark:text-white/20" />
          </div>
          <p className="text-gray-500 dark:text-white/45 mb-1 font-medium">No projects yet</p>
          <p className="text-sm text-gray-400 dark:text-white/30 mb-4">Generate your first brand kit to see it here.</p>
          <a
            href="/dashboard"
            className="flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-xl text-sm font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition"
          >
            <Zap className="w-4 h-4" /> Generate Brand Kit
          </a>
        </div>
      )}

      <AnimatePresence>
        {!isLoading && projects.length > 0 && (
          <div className="space-y-3">
            {projects.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ delay: i * 0.04 }}
                className="bg-white dark:bg-[#181818] rounded-2xl border border-gray-100 dark:border-white/8 shadow-sm p-5 flex items-center gap-5"
              >
                {/* Color swatch */}
                <div className="flex gap-1 shrink-0">
                  {project.brand_output.brand_kit.colors.slice(0, 3).map((c) => (
                    <div key={c.hex} className="w-4 h-10 rounded-md" style={{ backgroundColor: c.hex }} />
                  ))}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-bold text-gray-900 dark:text-white truncate">{project.brand_name}</p>
                    {project.brand_score && (
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${gradeColor(project.brand_score.grade)}`}>
                        {project.brand_score.grade}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-white/30">
                    {project.industry && <span>{project.industry}</span>}
                    {project.brand_output.brand_kit.taglines[0] && (
                      <span className="truncate italic">"{project.brand_output.brand_kit.taglines[0]}"</span>
                    )}
                    <span className="shrink-0">{timeAgo(project.created_at)}</span>
                  </div>
                </div>

                {/* Feature badges */}
                <div className="hidden md:flex items-center gap-2 shrink-0">
                  {project.brand_score && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-white/8 text-xs text-gray-500 dark:text-white/40">
                      <BarChart2 className="w-3 h-3" />
                      {project.brand_score.overall}/100
                    </div>
                  )}
                  {project.launch_kit && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-white/8 text-xs text-gray-500 dark:text-white/40">
                      <Star className="w-3 h-3" />
                      Launch Kit
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => openProject(project)}
                    className="flex items-center gap-1.5 px-3 py-2 bg-black dark:bg-white text-white dark:text-black rounded-xl text-xs font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition"
                  >
                    Open <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    disabled={deletingId === project.id}
                    className="p-2 rounded-xl text-gray-400 dark:text-white/25 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition disabled:opacity-50"
                  >
                    {deletingId === project.id
                      ? <Loader2 className="w-4 h-4 animate-spin" />
                      : <Trash2 className="w-4 h-4" />}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
