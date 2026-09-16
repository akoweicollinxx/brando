"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp, Users, Globe, DollarSign, Loader2, Sparkles,
  ArrowUpRight, BarChart2, Lightbulb, CheckSquare, Square,
} from "lucide-react";

interface Metric { label: string; value: string | number; icon: React.ElementType; color: string }
interface ProjectOption { id: string; brand_name: string }

export default function TractionPage() {
  const [projects,   setProjects]   = useState<ProjectOption[]>([]);
  const [projectId,  setProjectId]  = useState("");
  const [leads,      setLeads]      = useState(0);
  const [visits,     setVisits]     = useState(0);
  const [insights,   setInsights]   = useState<string[]>([]);
  const [actions,    setActions]    = useState<string[]>([]);
  const [done,       setDone]       = useState<Set<number>>(new Set());
  const [loadingIns, setLoadingIns] = useState(false);
  const [loadingAct, setLoadingAct] = useState(false);

  useEffect(() => {
    fetch("/api/projects")
      .then(r => r.json())
      .then(json => {
        const list = (json.data ?? []).map((p: any) => ({ id: p.id, brand_name: p.brand_name }));
        setProjects(list);
        if (list.length > 0) setProjectId(list[0].id);
      });
    fetch("/api/leads")
      .then(r => r.json())
      .then(json => setLeads((json.data ?? []).length));
  }, []);

  useEffect(() => {
    if (!projectId) return;
    setInsights([]);
    setActions([]);
    // Fetch next actions
    setLoadingAct(true);
    fetch(`/api/next-actions?projectId=${projectId}`)
      .then(r => r.json())
      .then(json => setActions(json.tasks ?? []))
      .finally(() => setLoadingAct(false));
  }, [projectId]);

  async function generateInsights() {
    if (!projectId) return;
    setLoadingIns(true);
    const res  = await fetch("/api/generate-insights", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId }),
    });
    const json = await res.json();
    setInsights(json.insights ?? []);
    setLoadingIns(false);
  }

  function toggleDone(i: number) {
    setDone(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  }

  const metrics: Metric[] = [
    { label: "Total Leads",    value: leads,    icon: Users,      color: "text-blue-500" },
    { label: "Page Visits",    value: visits,   icon: Globe,      color: "text-purple-500" },
    { label: "Conversion",     value: leads && visits ? `${((leads / visits) * 100).toFixed(1)}%` : "—", icon: TrendingUp, color: "text-emerald-500" },
    { label: "Revenue",        value: "$0",     icon: DollarSign, color: "text-yellow-500" },
  ];

  return (
    <div className="min-h-full px-6 py-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Traction</h1>
          <p className="text-sm text-gray-500 dark:text-white/40 mt-0.5">Business performance at a glance</p>
        </div>
        {projects.length > 1 && (
          <select
            value={projectId}
            onChange={e => setProjectId(e.target.value)}
            className="px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-sm text-gray-900 dark:text-white focus:outline-none"
          >
            {projects.map(p => <option key={p.id} value={p.id}>{p.brand_name}</option>)}
          </select>
        )}
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white dark:bg-[#181818] rounded-2xl border border-gray-100 dark:border-white/8 p-5"
          >
            <m.icon className={`w-5 h-5 ${m.color} mb-3`} />
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{m.value}</p>
            <p className="text-xs text-gray-400 dark:text-white/30 mt-0.5">{m.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {/* AI Insights */}
        <div className="bg-white dark:bg-[#181818] rounded-2xl border border-gray-100 dark:border-white/8 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-yellow-400" />
              <h2 className="font-semibold text-gray-900 dark:text-white text-sm">AI Insights</h2>
            </div>
            <button
              onClick={generateInsights}
              disabled={loadingIns}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black dark:bg-white text-white dark:text-black text-xs font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition disabled:opacity-50"
            >
              {loadingIns ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
              Analyze
            </button>
          </div>
          {insights.length === 0 && !loadingIns && (
            <p className="text-sm text-gray-400 dark:text-white/30 text-center py-6">Click Analyze to get AI recommendations based on your traction data.</p>
          )}
          {loadingIns && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-gray-300 dark:text-white/20" />
            </div>
          )}
          {insights.length > 0 && (
            <ul className="space-y-2.5">
              {insights.map((ins, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 shrink-0 mt-1.5" />
                  <p className="text-gray-700 dark:text-white/65">{ins}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Today's Actions */}
        <div className="bg-white dark:bg-[#181818] rounded-2xl border border-gray-100 dark:border-white/8 p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 className="w-4 h-4 text-blue-400" />
            <h2 className="font-semibold text-gray-900 dark:text-white text-sm">Today's Actions</h2>
          </div>
          {loadingAct && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-gray-300 dark:text-white/20" />
            </div>
          )}
          {!loadingAct && actions.length === 0 && (
            <p className="text-sm text-gray-400 dark:text-white/30 text-center py-6">No actions right now. Keep building!</p>
          )}
          {!loadingAct && actions.length > 0 && (
            <ul className="space-y-2.5">
              {actions.map((task, i) => (
                <li key={i}>
                  <button
                    onClick={() => toggleDone(i)}
                    className="flex items-start gap-3 w-full text-left group"
                  >
                    {done.has(i)
                      ? <CheckSquare className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      : <Square className="w-4 h-4 text-gray-300 dark:text-white/20 shrink-0 mt-0.5 group-hover:text-gray-500 dark:group-hover:text-white/40 transition" />}
                    <span className={`text-sm transition ${done.has(i) ? "line-through text-gray-400 dark:text-white/25" : "text-gray-700 dark:text-white/65"}`}>
                      {task}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          {!loadingAct && done.size > 0 && (
            <p className="text-xs text-emerald-500 mt-4 text-center font-medium">
              {done.size}/{actions.length} completed 🎉
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
