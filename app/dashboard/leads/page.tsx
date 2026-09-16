"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Search, Loader2, ChevronDown, MessageSquare, Trash2, Check } from "lucide-react";
import type { Lead, LeadStatus } from "@/lib/types";

const STATUS_COLORS: Record<LeadStatus, string> = {
  new:       "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-400/20",
  contacted: "bg-yellow-50 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-400/20",
  qualified: "bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-400/20",
  converted: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-400/20",
  lost:      "bg-gray-100 dark:bg-white/8 text-gray-500 dark:text-white/35 border-gray-200 dark:border-white/10",
};
const ALL_STATUSES: LeadStatus[] = ["new", "contacted", "qualified", "converted", "lost"];

type LeadRow = Lead & { brand_name: string };

export default function LeadsPage() {
  const [leads,       setLeads]       = useState<LeadRow[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [search,      setSearch]      = useState("");
  const [filterStatus, setFilterStatus] = useState<LeadStatus | "all">("all");
  const [noteModal,   setNoteModal]   = useState<{ id: string; notes: string } | null>(null);
  const [noteSaving,  setNoteSaving]  = useState(false);

  useEffect(() => {
    fetch("/api/leads")
      .then(r => r.json())
      .then(json => setLeads(json.data ?? []))
      .finally(() => setLoading(false));
  }, []);

  async function changeStatus(id: string, status: LeadStatus) {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
    await fetch("/api/leads/update-status", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
  }

  async function saveNote() {
    if (!noteModal) return;
    setNoteSaving(true);
    await fetch("/api/leads/add-note", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: noteModal.id, notes: noteModal.notes }),
    });
    setLeads(prev => prev.map(l => l.id === noteModal.id ? { ...l, notes: noteModal.notes } : l));
    setNoteSaving(false);
    setNoteModal(null);
  }

  function timeAgo(iso: string) {
    const d = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
    return d === 0 ? "Today" : d === 1 ? "Yesterday" : `${d}d ago`;
  }

  const filtered = leads.filter(l => {
    const matchSearch = !search || l.email.includes(search.toLowerCase()) || l.name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || l.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const counts = ALL_STATUSES.reduce((acc, s) => ({ ...acc, [s]: leads.filter(l => l.status === s).length }), {} as Record<LeadStatus, number>);

  return (
    <div className="min-h-full px-6 py-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Leads</h1>
        <p className="text-sm text-gray-500 dark:text-white/40 mt-0.5">Everyone who signed up across your landing pages</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {ALL_STATUSES.map(s => (
          <button
            key={s}
            onClick={() => setFilterStatus(prev => prev === s ? "all" : s)}
            className={`rounded-xl border p-3 text-left transition ${
              filterStatus === s
                ? STATUS_COLORS[s]
                : "bg-white dark:bg-[#181818] border-gray-100 dark:border-white/8 hover:bg-gray-50 dark:hover:bg-white/5"
            }`}
          >
            <p className="text-xl font-bold text-gray-900 dark:text-white">{counts[s] ?? 0}</p>
            <p className="text-xs text-gray-400 dark:text-white/35 capitalize mt-0.5">{s}</p>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 dark:text-white/20" />
        <input
          type="text"
          placeholder="Search by name or email…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white/30"
        />
      </div>

      {loading && (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-gray-300 dark:text-white/20" />
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-white/8 flex items-center justify-center mb-4">
            <Users className="w-7 h-7 text-gray-300 dark:text-white/20" />
          </div>
          <p className="text-gray-500 dark:text-white/40 font-medium">
            {leads.length === 0 ? "No leads yet" : "No leads match your filter"}
          </p>
          <p className="text-sm text-gray-400 dark:text-white/25 mt-1">
            {leads.length === 0 ? "Publish a landing page to start capturing leads." : "Try adjusting your search or filter."}
          </p>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="bg-white dark:bg-[#181818] rounded-2xl border border-gray-100 dark:border-white/8 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/8">
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 dark:text-white/30 uppercase tracking-wider">Name / Email</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 dark:text-white/30 uppercase tracking-wider hidden md:table-cell">Brand</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 dark:text-white/30 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 dark:text-white/30 uppercase tracking-wider hidden lg:table-cell">Date</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400 dark:text-white/30 uppercase tracking-wider">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-white/5">
              {filtered.map((lead, i) => (
                <motion.tr
                  key={lead.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="hover:bg-gray-50 dark:hover:bg-white/3 transition"
                >
                  <td className="px-5 py-4">
                    <p className="font-medium text-gray-900 dark:text-white text-sm">{lead.name || "—"}</p>
                    <p className="text-xs text-gray-400 dark:text-white/35">{lead.email}</p>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <p className="text-sm text-gray-600 dark:text-white/55 truncate max-w-[120px]">{lead.brand_name}</p>
                  </td>
                  <td className="px-5 py-4">
                    <div className="relative inline-block">
                      <select
                        value={lead.status}
                        onChange={e => changeStatus(lead.id, e.target.value as LeadStatus)}
                        className={`appearance-none text-xs font-semibold px-2.5 py-1 rounded-full border cursor-pointer pr-6 ${STATUS_COLORS[lead.status]} bg-transparent focus:outline-none`}
                      >
                        {ALL_STATUSES.map(s => (
                          <option key={s} value={s} className="bg-white dark:bg-[#111] text-gray-900 dark:text-white">{s}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none" />
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <p className="text-xs text-gray-400 dark:text-white/30">{timeAgo(lead.created_at)}</p>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => setNoteModal({ id: lead.id, notes: lead.notes ?? "" })}
                      className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg transition ${
                        lead.notes
                          ? "bg-gray-100 dark:bg-white/8 text-gray-600 dark:text-white/60 hover:bg-gray-200 dark:hover:bg-white/12"
                          : "text-gray-300 dark:text-white/20 hover:bg-gray-100 dark:hover:bg-white/8 hover:text-gray-600 dark:hover:text-white/50"
                      }`}
                    >
                      <MessageSquare className="w-3 h-3" />
                      {lead.notes ? "View" : "Add note"}
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Note modal */}
      {noteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setNoteModal(null)}>
          <div className="bg-white dark:bg-[#181818] rounded-2xl border border-gray-100 dark:border-white/8 p-6 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Notes</h3>
            <textarea
              value={noteModal.notes}
              onChange={e => setNoteModal(prev => prev ? { ...prev, notes: e.target.value } : null)}
              rows={5}
              placeholder="Add notes about this lead…"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/25 focus:outline-none resize-none"
            />
            <div className="flex gap-3 mt-4">
              <button onClick={() => setNoteModal(null)} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-white/15 text-sm font-semibold text-gray-700 dark:text-white/70 hover:bg-gray-50 dark:hover:bg-white/5 transition">
                Cancel
              </button>
              <button onClick={saveNote} disabled={noteSaving} className="flex-1 py-2.5 rounded-xl bg-black dark:bg-white text-white dark:text-black text-sm font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition disabled:opacity-50 flex items-center justify-center gap-2">
                {noteSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Check className="w-4 h-4" /> Save</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
