"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Loader2,
  Copy,
  Check,
  Monitor,
  Camera,
  AtSign,
  Briefcase,
  Mail,
  Users,
  MessageSquare,
  FileText,
  Share2,
} from "lucide-react";
import type { BrandOutput, LaunchKit } from "@/lib/types";

const LOADING_MESSAGES = [
  "Writing your landing page copy...",
  "Crafting social bios...",
  "Generating 10 social posts...",
  "Building outreach templates...",
  "Writing email funnel...",
  "Identifying 20 lead types...",
  "Finalising your launch kit...",
];

function useLoadingMessage(active: boolean) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (!active) { setIndex(0); return; }
    const id = setInterval(() => setIndex((i) => (i + 1) % LOADING_MESSAGES.length), 2000);
    return () => clearInterval(id);
  }, [active]);
  return LOADING_MESSAGES[index];
}

function CopyButton({ text, size = "sm" }: { text: string; size?: "sm" | "xs" }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={copy}
      className={`flex items-center gap-1.5 font-medium rounded-lg bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 transition shrink-0 ${size === "xs" ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-xs"}`}
    >
      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

const TABS = [
  { id: "landing", label: "Landing Page", icon: Monitor },
  { id: "social", label: "Social Kit", icon: Share2 },
  { id: "posts", label: "Launch Posts", icon: AtSign },
  { id: "outreach", label: "Lead Outreach", icon: Users },
  { id: "email", label: "Email Funnel", icon: Mail },
] as const;

type TabId = typeof TABS[number]["id"];

function PlatformBadge({ platform }: { platform: string }) {
  const map: Record<string, string> = {
    Instagram: "bg-pink-100 dark:bg-pink-500/15 text-pink-700 dark:text-pink-400",
    "Twitter/X": "bg-sky-100 dark:bg-sky-500/15 text-sky-700 dark:text-sky-400",
    LinkedIn: "bg-blue-100 dark:bg-blue-500/15 text-blue-700 dark:text-blue-400",
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${map[platform] || "bg-gray-100 dark:bg-white/8 text-gray-600 dark:text-white/50"}`}>
      {platform}
    </span>
  );
}

export default function LaunchPage() {
  const router = useRouter();
  const { has, isLoaded } = useAuth();

  const [brandName, setBrandName] = useState("");
  const [industry, setIndustry] = useState("");
  const [brandOutput, setBrandOutput] = useState<BrandOutput | null>(null);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [kit, setKit] = useState<LaunchKit | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("landing");
  const [error, setError] = useState<string | null>(null);
  const loadingMessage = useLoadingMessage(isLoading);

  // Plan gate — redirect free users to billing
  useEffect(() => {
    if (!isLoaded) return;
    if (!has?.({ plan: "premium" })) {
      router.replace("/dashboard/billing");
    }
  }, [isLoaded, has, router]);

  useEffect(() => {
    const name = sessionStorage.getItem("brando_brand_name");
    const ind  = sessionStorage.getItem("brando_industry");
    const out  = sessionStorage.getItem("brando_output");
    const pid  = sessionStorage.getItem("brando_project_id");
    if (name) setBrandName(name);
    if (ind)  setIndustry(ind);
    if (pid)  setProjectId(pid);
    if (out) {
      try { setBrandOutput(JSON.parse(out)); } catch { /* ignore */ }
    }
  }, []);

  // Show nothing while auth check resolves
  if (!isLoaded || !has?.({ plan: "premium" })) return null;

  async function handleGenerate() {
    if (!brandName.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/launch-mode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brand_name: brandName, industry, brand_data: brandOutput, project_id: projectId }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Generation failed");
      setKit(json.data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  const cardClass = "bg-white dark:bg-[#181818] rounded-2xl border border-gray-100 dark:border-white/8 shadow-sm";
  const labelClass = "text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-wider";
  const fieldClass = "px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/8";

  return (
    <div className="min-h-full px-8 py-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-black dark:bg-white flex items-center justify-center">
            <Zap className="w-4 h-4 text-white dark:text-black" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Launch Mode</h1>
        </div>
        <p className="text-gray-500 dark:text-white/45 ml-10">
          Complete go-to-market kit — landing page copy, social posts, outreach templates, and email funnel.
        </p>
      </div>

      {/* Generate card */}
      {!kit && (
        <div className={`${cardClass} p-6 mb-8`}>
          {brandName ? (
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">{brandName}</p>
                {industry && <p className="text-sm text-gray-500 dark:text-white/40 mt-0.5">{industry}</p>}
                {!brandOutput && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">No brand kit data — generating from name only.</p>
                )}
              </div>
              <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="flex items-center gap-2.5 px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl font-semibold text-sm hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-50 transition shrink-0"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <AnimatePresence mode="wait">
                      <motion.span key={loadingMessage} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.3 }}>
                        {loadingMessage}
                      </motion.span>
                    </AnimatePresence>
                  </>
                ) : (
                  <><Zap className="w-4 h-4" /> Generate Launch Kit</>
                )}
              </button>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500 dark:text-white/45 mb-3">Go to the Brand Generator first, then click <strong className="text-gray-900 dark:text-white">Launch Mode</strong>.</p>
              <a href="/dashboard" className="text-sm font-medium text-black dark:text-white underline underline-offset-2">Back to Dashboard</a>
            </div>
          )}
          {error && <p className="mt-3 text-sm text-red-500 dark:text-red-400">{error}</p>}
        </div>
      )}

      {/* Loading overlay */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-gray-400 dark:text-white/30" />
          <AnimatePresence mode="wait">
            <motion.p key={loadingMessage} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm text-gray-500 dark:text-white/45">
              {loadingMessage}
            </motion.p>
          </AnimatePresence>
        </div>
      )}

      {/* Kit output */}
      <AnimatePresence>
        {kit && !isLoading && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            {/* Banner */}
            <div className="bg-black text-white rounded-2xl p-5 mb-6 flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-4 h-4" />
                  <span className="text-xs font-medium text-white/60 uppercase tracking-wider">Launch Kit Ready</span>
                </div>
                <p className="font-bold">{brandName}</p>
              </div>
              <button
                onClick={() => { setKit(null); }}
                className="px-3 py-1.5 text-xs font-medium border border-white/20 hover:border-white/40 text-white/70 hover:text-white rounded-xl transition"
              >
                Regenerate
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 p-1 bg-gray-100 dark:bg-white/5 rounded-2xl mb-6 overflow-x-auto">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition flex-1 justify-center ${
                    activeTab === id
                      ? "bg-white dark:bg-[#181818] text-gray-900 dark:text-white shadow-sm"
                      : "text-gray-500 dark:text-white/40 hover:text-gray-700 dark:hover:text-white/70"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  {label}
                </button>
              ))}
            </div>

            {/* Tab panels */}
            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>

                {/* Landing Page */}
                {activeTab === "landing" && (
                  <div className={`${cardClass} p-6 space-y-5`}>
                    <div className="flex items-center gap-2 mb-1">
                      <Monitor className="w-4 h-4 text-gray-400 dark:text-white/30" />
                      <span className="font-semibold text-gray-900 dark:text-white">Landing Page Copy</span>
                    </div>

                    {[
                      { label: "Hero Headline", value: kit.landing_page.hero_headline },
                      { label: "Hero Subheadline", value: kit.landing_page.hero_subheadline },
                      { label: "Primary CTA", value: kit.landing_page.cta_primary },
                      { label: "Secondary CTA", value: kit.landing_page.cta_secondary },
                      { label: "Email Capture Headline", value: kit.landing_page.email_capture_headline },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <p className={`${labelClass} mb-2`}>{label}</p>
                        <div className={`${fieldClass} flex items-center justify-between gap-4`}>
                          <p className="text-sm text-gray-800 dark:text-white/80 font-medium">{value}</p>
                          <CopyButton text={value} />
                        </div>
                      </div>
                    ))}

                    <div>
                      <p className={`${labelClass} mb-3`}>Features (4)</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {kit.landing_page.features.map((f) => (
                          <div key={f.title} className={`${fieldClass}`}>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white mb-0.5">{f.title}</p>
                            <p className="text-xs text-gray-500 dark:text-white/45">{f.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className={`${labelClass} mb-3`}>Social Proof</p>
                      <div className="space-y-2">
                        {kit.landing_page.social_proof.map((s, i) => (
                          <div key={i} className={`${fieldClass} flex items-center justify-between gap-4`}>
                            <p className="text-sm text-gray-700 dark:text-white/70 italic">"{s}"</p>
                            <CopyButton text={s} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Social Kit */}
                {activeTab === "social" && (
                  <div className={`${cardClass} p-6 space-y-5`}>
                    <div className="flex items-center gap-2 mb-1">
                      <Share2 className="w-4 h-4 text-gray-400 dark:text-white/30" />
                      <span className="font-semibold text-gray-900 dark:text-white">Social Media Assets</span>
                    </div>

                    {[
                      { label: "Profile Slogan", value: kit.social_assets.profile_slogan, icon: Zap },
                      { label: "Banner Text", value: kit.social_assets.banner_text, icon: FileText },
                      { label: "Instagram Bio", value: kit.social_assets.instagram_bio, icon: Camera },
                      { label: "Twitter / X Bio", value: kit.social_assets.twitter_bio, icon: AtSign },
                      { label: "LinkedIn Description", value: kit.social_assets.linkedin_bio, icon: Briefcase },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <p className={`${labelClass} mb-2`}>{label}</p>
                        <div className={`${fieldClass} flex items-start justify-between gap-4`}>
                          <p className="text-sm text-gray-800 dark:text-white/80 leading-relaxed">{value}</p>
                          <CopyButton text={value} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Launch Posts */}
                {activeTab === "posts" && (
                  <div className="space-y-4">
                    {kit.posts.map((post, i) => (
                      <div key={i} className={`${cardClass} p-5`}>
                        <div className="flex items-center justify-between mb-3">
                          <PlatformBadge platform={post.platform} />
                          <CopyButton text={`${post.hook}\n\n${post.body}\n\n${post.cta}`} size="xs" />
                        </div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white mb-1">{post.hook}</p>
                        <p className="text-sm text-gray-600 dark:text-white/60 leading-relaxed mb-2">{post.body}</p>
                        <p className="text-xs text-gray-400 dark:text-white/35 font-medium">{post.cta}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Lead Outreach */}
                {activeTab === "outreach" && (
                  <div className="space-y-5">
                    <div className={`${cardClass} p-6`}>
                      <div className="flex items-center gap-2 mb-4">
                        <Users className="w-4 h-4 text-gray-400 dark:text-white/30" />
                        <span className="font-semibold text-gray-900 dark:text-white">Ideal Customer Profile</span>
                      </div>
                      <div className={`${fieldClass}`}>
                        <p className="text-sm text-gray-700 dark:text-white/70 leading-relaxed">{kit.outreach.icp_description}</p>
                      </div>
                    </div>

                    <div className={`${cardClass} p-6`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400 dark:text-white/30" />
                          <span className="font-semibold text-gray-900 dark:text-white">Cold Email Template</span>
                        </div>
                        <CopyButton text={kit.outreach.cold_email} />
                      </div>
                      <pre className="text-sm text-gray-700 dark:text-white/70 leading-relaxed whitespace-pre-wrap bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/8 px-4 py-3 font-sans">{kit.outreach.cold_email}</pre>
                    </div>

                    <div className={`${cardClass} p-6`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-gray-400 dark:text-white/30" />
                          <span className="font-semibold text-gray-900 dark:text-white">DM Template</span>
                        </div>
                        <CopyButton text={kit.outreach.dm_template} />
                      </div>
                      <div className={`${fieldClass}`}>
                        <p className="text-sm text-gray-700 dark:text-white/70 leading-relaxed">{kit.outreach.dm_template}</p>
                      </div>
                    </div>

                    <div className={`${cardClass} p-6`}>
                      <div className="flex items-center gap-2 mb-4">
                        <Users className="w-4 h-4 text-gray-400 dark:text-white/30" />
                        <span className="font-semibold text-gray-900 dark:text-white">20 Lead Types</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {kit.outreach.lead_types.map((lead, i) => (
                          <div key={i} className="flex items-start gap-2.5 px-3 py-2 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/8">
                            <span className="text-xs font-mono text-gray-400 dark:text-white/25 mt-0.5 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                            <span className="text-sm text-gray-700 dark:text-white/65">{lead}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Email Funnel */}
                {activeTab === "email" && (
                  <div className="space-y-5">
                    <div className={`${cardClass} p-6`}>
                      <div className="flex items-center gap-2 mb-4">
                        <Zap className="w-4 h-4 text-gray-400 dark:text-white/30" />
                        <span className="font-semibold text-gray-900 dark:text-white">Lead Magnet</span>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className={`${labelClass} mb-2`}>Headline</p>
                          <div className={`${fieldClass} flex items-center justify-between gap-4`}>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">{kit.email_funnel.lead_magnet_headline}</p>
                            <CopyButton text={kit.email_funnel.lead_magnet_headline} />
                          </div>
                        </div>
                        <div>
                          <p className={`${labelClass} mb-2`}>Opt-in Copy</p>
                          <div className={`${fieldClass} flex items-start justify-between gap-4`}>
                            <p className="text-sm text-gray-700 dark:text-white/70">{kit.email_funnel.optin_copy}</p>
                            <CopyButton text={kit.email_funnel.optin_copy} />
                          </div>
                        </div>
                      </div>
                    </div>

                    {kit.email_funnel.emails.map((email, i) => (
                      <div key={i} className={`${cardClass} p-6`}>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-black dark:bg-white text-white dark:text-black text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                            <span className="font-semibold text-gray-900 dark:text-white">
                              {i === 0 ? "Welcome Email" : i === 1 ? "Nurture Email" : "Conversion Email"}
                            </span>
                          </div>
                          <CopyButton text={`Subject: ${email.subject}\nPreview: ${email.preview}\n\n${email.body}`} />
                        </div>
                        <div className="space-y-3">
                          <div>
                            <p className={`${labelClass} mb-1.5`}>Subject Line</p>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">{email.subject}</p>
                          </div>
                          <div>
                            <p className={`${labelClass} mb-1.5`}>Preview Text</p>
                            <p className="text-xs text-gray-500 dark:text-white/40">{email.preview}</p>
                          </div>
                          <div>
                            <p className={`${labelClass} mb-2`}>Body</p>
                            <div className="px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/8">
                              <p className="text-sm text-gray-700 dark:text-white/70 leading-relaxed whitespace-pre-line">{email.body}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
