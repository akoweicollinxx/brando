"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Loader2, Sparkles, ChevronDown, ChevronUp, ToggleLeft, ToggleRight, Clock } from "lucide-react";
import type { EmailSequence, SequenceEmail } from "@/lib/types";

interface ProjectOption { id: string; brand_name: string }

export default function EmailPage() {
  const [projects,   setProjects]   = useState<ProjectOption[]>([]);
  const [projectId,  setProjectId]  = useState("");
  const [sequence,   setSequence]   = useState<EmailSequence | null>(null);
  const [loading,    setLoading]    = useState(false);
  const [generating, setGenerating] = useState(false);
  const [toggling,   setToggling]   = useState(false);
  const [expanded,   setExpanded]   = useState<number | null>(0);

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
    setSequence(null);
    fetch(`/api/projects/${projectId}`)
      .then(r => r.json())
      .then(async () => {
        // Fetch sequence via generate route — check existence first
        const res = await fetch(`/api/email-sequence?projectId=${projectId}`);
        if (res.ok) {
          const json = await res.json();
          setSequence(json.data ?? null);
        }
      })
      .finally(() => setLoading(false));
  }, [projectId]);

  async function handleGenerate() {
    if (!projectId) return;
    setGenerating(true);
    try {
      const res  = await fetch("/api/generate-email-sequence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId }),
      });
      const json = await res.json();
      if (json.success) setSequence(json.sequence);
    } finally {
      setGenerating(false);
    }
  }

  async function toggleActive() {
    if (!sequence) return;
    setToggling(true);
    const newVal = !sequence.active;
    await fetch(`/api/email-sequence/toggle`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: sequence.id, active: newVal }),
    });
    setSequence(prev => prev ? { ...prev, active: newVal } : null);
    setToggling(false);
  }

  function delayLabel(h: number) {
    if (h === 0) return "Immediately";
    if (h < 24) return `${h}h after signup`;
    return `${h / 24}d after signup`;
  }

  return (
    <div className="min-h-full px-6 py-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Email Automation</h1>
        <p className="text-sm text-gray-500 dark:text-white/40 mt-0.5">Auto-send sequences to leads when they sign up</p>
      </div>

      {/* Project selector */}
      {projects.length > 1 && (
        <div className="mb-6">
          <label className="text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-wider mb-2 block">Brand</label>
          <select
            value={projectId}
            onChange={e => setProjectId(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-sm text-gray-900 dark:text-white focus:outline-none"
          >
            {projects.map(p => <option key={p.id} value={p.id}>{p.brand_name}</option>)}
          </select>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-gray-300 dark:text-white/20" />
        </div>
      )}

      {!loading && !sequence && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-white/8 flex items-center justify-center mb-5">
            <Mail className="w-8 h-8 text-gray-300 dark:text-white/20" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No email sequence yet</h2>
          <p className="text-sm text-gray-500 dark:text-white/40 mb-6 max-w-sm">
            Generate a 5-email welcome sequence that automatically follows up with every new lead.
          </p>
          <button
            onClick={handleGenerate}
            disabled={generating || !projectId}
            className="flex items-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl font-semibold text-sm hover:bg-gray-800 dark:hover:bg-gray-100 transition disabled:opacity-50"
          >
            {generating ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating…</> : <><Sparkles className="w-4 h-4" /> Generate Sequence</>}
          </button>
        </div>
      )}

      {!loading && sequence && (
        <div className="space-y-4">
          {/* Controls */}
          <div className="bg-white dark:bg-[#181818] rounded-2xl border border-gray-100 dark:border-white/8 p-5 flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white text-sm">{sequence.emails.length}-Email Welcome Sequence</p>
              <p className="text-xs text-gray-400 dark:text-white/30 mt-0.5">Sent automatically when a lead signs up</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-white/15 text-xs font-semibold text-gray-700 dark:text-white/70 hover:bg-gray-50 dark:hover:bg-white/5 transition disabled:opacity-50"
              >
                {generating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                Regenerate
              </button>
              <button
                onClick={toggleActive}
                disabled={toggling}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                  sequence.active
                    ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-400/20"
                    : "bg-gray-100 dark:bg-white/8 text-gray-500 dark:text-white/35 border border-gray-200 dark:border-white/10"
                }`}
              >
                {sequence.active ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                {sequence.active ? "Active" : "Paused"}
              </button>
            </div>
          </div>

          {/* Email list */}
          <div className="space-y-3">
            {sequence.emails.map((email, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white dark:bg-[#181818] rounded-2xl border border-gray-100 dark:border-white/8 overflow-hidden"
              >
                <button
                  onClick={() => setExpanded(expanded === i ? null : i)}
                  className="w-full flex items-center gap-4 p-5 text-left hover:bg-gray-50 dark:hover:bg-white/3 transition"
                >
                  <div className="w-8 h-8 rounded-xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center text-sm font-bold shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{email.subject}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Clock className="w-3 h-3 text-gray-300 dark:text-white/20" />
                      <span className="text-xs text-gray-400 dark:text-white/30">{delayLabel(email.delay_hours)}</span>
                    </div>
                  </div>
                  {expanded === i ? <ChevronUp className="w-4 h-4 text-gray-300 dark:text-white/20 shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-300 dark:text-white/20 shrink-0" />}
                </button>
                <AnimatePresence>
                  {expanded === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 border-t border-gray-50 dark:border-white/5 pt-4">
                        <pre className="text-sm text-gray-600 dark:text-white/60 whitespace-pre-wrap font-sans leading-relaxed">{email.body}</pre>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
