"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Lock, Zap, Rocket, ArrowRight, Sparkles } from "lucide-react";

const FREE_FEATURES = [
  "Unlimited brand generations",
  "Full brand kit — colors, fonts, tone, story, values",
  "AI logo generation",
  "Full market analysis & competitor research",
  "AI website brief & builder prompt",
  "Complete week-by-week launch plan",
  "My Brands — save & manage projects",
  "Showcase — publish to the community",
];

const PREMIUM_EXTRAS = [
  "Launch Mode — full go-to-market kit",
  "Landing page copy generator",
  "Social media kit (bios, posts, captions)",
  "Launch post & ad copy templates",
  "Lead outreach scripts (20 leads)",
  "5-part email funnel",
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-[#0d0d0d] text-gray-900 dark:text-white">

      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 py-4 bg-white/80 dark:bg-[#0d0d0d]/80 backdrop-blur border-b border-gray-100 dark:border-white/8">
        <Link href="/" className="text-lg font-bold tracking-tight flex items-center gap-2">
          <div className="w-7 h-7 bg-black dark:bg-white rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-white dark:text-black" />
          </div>
          brando
        </Link>
        <Link
          href="/dashboard"
          className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-xl text-sm font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition"
        >
          Open Dashboard
        </Link>
      </nav>

      <div className="pt-28 pb-24 px-6 max-w-4xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-xl mx-auto mb-14"
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-white/10 text-xs font-semibold text-gray-600 dark:text-white/60 mb-4">
            Simple, transparent pricing
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Build your brand.<br />Launch your idea.
          </h1>
          <p className="text-lg text-gray-500 dark:text-white/45">
            Start free. Unlock the full go-to-market system with one payment — no subscription, ever.
          </p>
        </motion.div>

        {/* Plans */}
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">

          {/* Free */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white dark:bg-[#181818] rounded-2xl border border-gray-200 dark:border-white/8 p-8 flex flex-col"
          >
            <div className="mb-6">
              <p className="text-xs font-semibold text-gray-500 dark:text-white/40 uppercase tracking-wider mb-2">Free</p>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-bold">$0</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-white/45">All core features, no credit card needed.</p>
            </div>

            <Link
              href="/sign-up"
              className="block text-center py-3 px-6 rounded-xl font-semibold text-sm mb-8 bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-white/15 transition"
            >
              Get started free
            </Link>

            <ul className="space-y-2.5 flex-1">
              {FREE_FEATURES.map(f => (
                <li key={f} className="flex items-start gap-2.5 text-sm">
                  <Check className="w-4 h-4 mt-0.5 shrink-0 text-gray-400 dark:text-white/40" />
                  <span className="text-gray-700 dark:text-white/65">{f}</span>
                </li>
              ))}
              <li className="flex items-start gap-2.5 text-sm opacity-40 pt-1">
                <Lock className="w-4 h-4 mt-0.5 shrink-0 text-gray-400" />
                <span className="text-gray-600 dark:text-white/60 line-through">Launch Mode</span>
              </li>
            </ul>
          </motion.div>

          {/* Premium */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative bg-black text-white rounded-2xl p-8 flex flex-col shadow-2xl"
          >
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <span className="px-4 py-1.5 bg-white text-black text-xs font-bold rounded-full shadow whitespace-nowrap">
                One-time · No subscription
              </span>
            </div>

            <div className="mb-6 mt-3">
              <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Premium</p>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-bold">$14.99</span>
                <span className="text-sm text-white/50">one-time</span>
              </div>
              <p className="text-sm text-white/55">Everything in Free + Launch Mode. Pay once, keep forever.</p>
            </div>

            <Link
              href="/dashboard/billing"
              className="flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold text-sm mb-8 bg-white text-black hover:bg-gray-100 transition"
            >
              <Sparkles className="w-4 h-4" />
              Get Premium — $14.99
              <ArrowRight className="w-4 h-4" />
            </Link>

            <ul className="space-y-2.5 flex-1">
              <li className="text-xs font-semibold text-white/40 uppercase tracking-wider pb-1">Everything in Free, plus:</li>
              {PREMIUM_EXTRAS.map(f => (
                <li key={f} className="flex items-start gap-2.5 text-sm">
                  <Check className="w-4 h-4 mt-0.5 shrink-0 text-white" />
                  <span className="text-white/85">{f}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* FAQ note */}
        <div className="max-w-2xl mx-auto mt-16 text-center space-y-3">
          <div className="flex items-center justify-center gap-6 text-sm text-gray-400 dark:text-white/30">
            <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5" /> No subscription</span>
            <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5" /> Instant access</span>
            <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5" /> Secure checkout</span>
          </div>
          <p className="text-xs text-gray-300 dark:text-white/20">
            Questions?{" "}
            <a href="mailto:hello@brando.ai" className="text-gray-500 dark:text-white/35 underline underline-offset-2">
              hello@brando.ai
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
