"use client";

import { Rocket, Lock } from "lucide-react";

export default function LaunchPage() {
  return (
    <div className="min-h-full px-6 py-8 max-w-4xl mx-auto flex items-center justify-center" style={{ minHeight: "70vh" }}>
      <div className="text-center max-w-sm">
        <div className="w-14 h-14 rounded-2xl bg-black dark:bg-white flex items-center justify-center mx-auto mb-5">
          <Rocket className="w-6 h-6 text-white dark:text-black" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 dark:bg-white/8 text-xs font-semibold text-gray-500 dark:text-white/45 mb-4">
          <Lock className="w-3 h-3" /> Coming Soon
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Launch Mode</h1>
        <p className="text-gray-500 dark:text-white/45 text-sm leading-relaxed">
          Your full go-to-market kit — landing page copy, social posts, outreach templates, and email funnel — is on the way. We&apos;re putting the finishing touches on it.
        </p>
        <a
          href="/dashboard"
          className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-xl text-sm font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition"
        >
          Back to Dashboard
        </a>
      </div>
    </div>
  );
}
