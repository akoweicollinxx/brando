"use client";

import { useAuth, useClerk, useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Check, Zap, Rocket, Lock, Sparkles, ArrowRight, CreditCard } from "lucide-react";
import Link from "next/link";

const FREE_FEATURES = [
  "Unlimited brand generations",
  "Full brand kit — colors, fonts, tone, story, values",
  "AI logo generation",
  "Full market analysis & competitor research",
  "AI website brief",
  "Complete launch plan",
  "My Brands — save & manage projects",
  "Showcase — publish to community",
];

const PREMIUM_EXTRAS = [
  "Launch Mode — full go-to-market kit",
  "Landing page copy generator",
  "Social media kit (bios, posts, captions)",
  "Launch post templates",
  "Lead outreach scripts",
  "Email funnel (5-part sequence)",
];

export default function BillingPage() {
  const { has, isLoaded } = useAuth();
  const { user } = useUser();
  const clerk = useClerk();

  const isPremium = isLoaded ? (has?.({ plan: "premium" }) ?? false) : false;

  function handleUpgrade() {
    // Clerk Billing: opens the hosted checkout for the 'premium' plan
    (clerk as any).openCheckout?.({ plan: "premium" });
  }

  return (
    <div className="min-h-full px-6 py-8 max-w-3xl mx-auto">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Billing</h1>
        <p className="text-gray-500 dark:text-white/45 mt-1 text-sm">
          Manage your Brando plan.
        </p>
      </div>

      {/* Current plan banner */}
      <div className={`rounded-2xl p-5 mb-6 flex items-center gap-4 ${
        isPremium
          ? "bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-400/20"
          : "bg-white dark:bg-[#181818] border border-gray-100 dark:border-white/8"
      }`}>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
          isPremium ? "bg-emerald-500" : "bg-gray-100 dark:bg-white/10"
        }`}>
          {isPremium
            ? <Rocket className="w-5 h-5 text-white" />
            : <Zap className="w-5 h-5 text-gray-500 dark:text-white/50" />
          }
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 dark:text-white text-sm">
            {isPremium ? "Premium Plan" : "Free Plan"}
          </p>
          <p className="text-xs text-gray-500 dark:text-white/40 mt-0.5">
            {isPremium
              ? "You have full access to all Brando features including Launch Mode."
              : "Upgrade to unlock Launch Mode and the full go-to-market kit."}
          </p>
        </div>
        {isPremium && (
          <span className="shrink-0 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-400/30">
            Active
          </span>
        )}
      </div>

      {/* Plans comparison */}
      <div className="grid md:grid-cols-2 gap-5">

        {/* Free */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className={`bg-white dark:bg-[#181818] rounded-2xl border p-6 flex flex-col ${
            !isPremium
              ? "border-black dark:border-white ring-2 ring-black dark:ring-white"
              : "border-gray-100 dark:border-white/8"
          }`}
        >
          <div className="mb-5">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-wider">Free</p>
              {!isPremium && (
                <span className="px-2 py-0.5 rounded-full bg-black dark:bg-white text-white dark:text-black text-xs font-bold">
                  Current
                </span>
              )}
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">$0</span>
            </div>
            <p className="text-xs text-gray-400 dark:text-white/35 mt-1.5">All core features, forever free.</p>
          </div>

          <ul className="space-y-2 flex-1">
            {FREE_FEATURES.map(f => (
              <li key={f} className="flex items-start gap-2 text-sm">
                <Check className="w-3.5 h-3.5 text-gray-400 dark:text-white/30 mt-0.5 shrink-0" />
                <span className="text-gray-600 dark:text-white/60">{f}</span>
              </li>
            ))}
            <li className="flex items-start gap-2 text-sm opacity-40">
              <Lock className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
              <span className="text-gray-600 dark:text-white/60 line-through">Launch Mode</span>
            </li>
          </ul>
        </motion.div>

        {/* Premium */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`rounded-2xl p-6 flex flex-col relative overflow-hidden ${
            isPremium
              ? "bg-white dark:bg-[#181818] border border-emerald-200 dark:border-emerald-400/20"
              : "bg-black text-white"
          }`}
        >
          {!isPremium && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="px-3 py-1 bg-white text-black text-xs font-bold rounded-full shadow-md whitespace-nowrap">
                One-time · No subscription
              </span>
            </div>
          )}

          <div className="mb-5 mt-3">
            <div className="flex items-center justify-between mb-1">
              <p className={`text-xs font-semibold uppercase tracking-wider ${isPremium ? "text-emerald-500" : "text-white/50"}`}>
                Premium
              </p>
              {isPremium && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-400/30">
                  Active
                </span>
              )}
            </div>
            <div className="flex items-baseline gap-1">
              <span className={`text-3xl font-bold ${isPremium ? "text-gray-900 dark:text-white" : "text-white"}`}>
                $14.99
              </span>
              <span className={`text-sm ${isPremium ? "text-gray-400 dark:text-white/35" : "text-white/50"}`}>
                one-time
              </span>
            </div>
            <p className={`text-xs mt-1.5 ${isPremium ? "text-gray-400 dark:text-white/35" : "text-white/50"}`}>
              Everything in Free, plus Launch Mode.
            </p>
          </div>

          <ul className="space-y-2 flex-1 mb-6">
            <li className={`text-xs font-semibold uppercase tracking-wider mb-1 ${isPremium ? "text-gray-400 dark:text-white/30" : "text-white/40"}`}>
              Everything in Free, plus:
            </li>
            {PREMIUM_EXTRAS.map(f => (
              <li key={f} className="flex items-start gap-2 text-sm">
                <Check className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${isPremium ? "text-emerald-500" : "text-white"}`} />
                <span className={isPremium ? "text-gray-700 dark:text-white/70" : "text-white/85"}>{f}</span>
              </li>
            ))}
          </ul>

          {!isPremium && (
            <button
              onClick={handleUpgrade}
              className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-white text-black font-bold text-sm hover:bg-gray-100 transition"
            >
              <Sparkles className="w-4 h-4" />
              Upgrade — $14.99
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {isPremium && (
            <div className="flex items-center gap-2 py-3 px-4 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-400/20">
              <Check className="w-4 h-4 text-emerald-500 shrink-0" />
              <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">You're on Premium</span>
            </div>
          )}
        </motion.div>
      </div>

      {/* Go to launch mode (premium only) */}
      {isPremium && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-6 bg-white dark:bg-[#181818] rounded-2xl border border-gray-100 dark:border-white/8 p-5 flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-black dark:bg-white flex items-center justify-center">
              <Rocket className="w-4.5 h-4.5 text-white dark:text-black" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white text-sm">Launch Mode is unlocked</p>
              <p className="text-xs text-gray-400 dark:text-white/35">Get your full go-to-market kit for any brand.</p>
            </div>
          </div>
          <Link
            href="/dashboard/launch"
            className="flex items-center gap-1.5 px-4 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-xl text-sm font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition shrink-0"
          >
            Open Launch Mode <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>
      )}

      {/* Billing managed by Clerk */}
      <p className="text-center text-xs text-gray-300 dark:text-white/20 mt-8">
        Payments are securely processed by Clerk Billing. All purchases are final.
        Need help?{" "}
        <a href="mailto:support@brando.ai" className="underline underline-offset-2 text-gray-400 dark:text-white/30">
          Contact support
        </a>
      </p>
    </div>
  );
}
