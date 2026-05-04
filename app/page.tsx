"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, ArrowRight, Check } from "lucide-react";

const features = [
  "Logo & Brand Identity",
  "Market & Competitor Analysis",
  "AI Website Generator Prompt",
  "Step-by-Step Launch Plan",
  "Marketing Strategy",
  "Content Ideas",
];

const steps = [
  {
    title: "Enter Your Brand Name",
    desc: "Drop in your idea — one word is all it takes.",
  },
  {
    title: "AI Builds Your Brand",
    desc: "Logos, colors, messaging, competitors, and strategy — instantly.",
  },
  {
    title: "Launch Immediately",
    desc: "Use your website prompt and launch plan to go live today.",
  },
];

export default function Home() {
  return (
    <main className="bg-background text-foreground">
      {/* HERO */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-6 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-white/10 text-xs font-semibold text-gray-600 dark:text-white/70 mb-6"
        >
          <Zap className="w-3.5 h-3.5" />
          AI-powered business launch system
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold leading-tight max-w-4xl text-gray-900 dark:text-white"
        >
          Turn Any Idea Into a
          <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-gray-900 dark:from-white to-gray-400 dark:to-white/40">
            Ready-to-Launch Brand
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-lg text-gray-500 dark:text-white/50 max-w-2xl"
        >
          Create logos, brand identity, market analysis, website copy, and a full
          launch plan — all from just a name. In under 60 seconds.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 flex flex-col sm:flex-row gap-3"
        >
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition shadow-lg"
          >
            Generate Your Brand <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 px-7 py-3.5 border border-gray-200 dark:border-white/10 rounded-2xl font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition"
          >
            See Pricing
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 text-sm text-gray-400 dark:text-white/30"
        >
          Free to start. No credit card required.
        </motion.p>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-24 px-6 bg-gray-50 dark:bg-white/3">
        <div className="max-w-5xl mx-auto text-center">
          <span className="inline-block px-3 py-1 rounded-full bg-gray-200 dark:bg-white/10 text-xs font-semibold text-gray-600 dark:text-white/60 mb-4">
            How It Works
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-gray-900 dark:text-white">
            From idea to brand in 3 steps
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 bg-white dark:bg-card rounded-2xl shadow-sm border border-gray-100 dark:border-white/8 text-left"
              >
                <div className="w-8 h-8 rounded-xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center text-sm font-bold mb-4">
                  {i + 1}
                </div>
                <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">{step.title}</h3>
                <p className="text-gray-500 dark:text-white/50 text-sm">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 px-6 bg-background">
        <div className="max-w-5xl mx-auto text-center">
          <span className="inline-block px-3 py-1 rounded-full bg-gray-100 dark:bg-white/10 text-xs font-semibold text-gray-600 dark:text-white/60 mb-4">
            What You Get
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Everything to launch a real business
          </h2>
          <p className="text-gray-500 dark:text-white/50 mb-12 max-w-xl mx-auto">
            Not just a logo. A complete business launch system built by AI in under a minute.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="flex items-center gap-3 p-5 border border-gray-100 dark:border-white/8 rounded-2xl bg-white dark:bg-card text-left"
              >
                <Check className="w-5 h-5 text-black dark:text-white shrink-0" />
                <span className="font-medium text-gray-800 dark:text-white/80">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* DEMO */}
      <section className="py-24 px-6 bg-gray-50 dark:bg-white/3 text-center">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900 dark:text-white">
            From Idea to Brand
          </h2>
          <p className="text-gray-500 dark:text-white/50 mb-12">
            "Nova Fitness" — watch what Brando builds in 60 seconds
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { label: "Brand Colors & Fonts", sub: "Curated palette + typography" },
              { label: "Competitor Analysis", sub: "3 real competitors + gaps" },
              { label: "Full Launch Plan", sub: "Week-by-week action steps" },
            ].map((item, i) => (
              <div key={i} className="p-8 bg-white dark:bg-card rounded-2xl shadow-sm border border-gray-100 dark:border-white/8">
                <div className="w-12 h-12 bg-black dark:bg-white rounded-2xl mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 dark:text-white">{item.label}</h3>
                <p className="text-sm text-gray-500 dark:text-white/50 mt-1">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING TEASER */}
      <section className="py-24 px-6 text-center bg-background">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Simple Pricing
          </h2>
          <p className="text-gray-500 dark:text-white/50 mb-8">Start free. Upgrade when you need more.</p>
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {[
              { plan: "Free", price: "£0", desc: "2 logo generations" },
              { plan: "Pro", price: "£19/mo", desc: "Unlimited brands" },
              { plan: "Premium", price: "£49/mo", desc: "Advanced everything" },
            ].map((p, i) => (
              <div key={i} className="p-6 border border-gray-200 dark:border-white/8 rounded-2xl bg-white dark:bg-card">
                <p className="text-sm font-semibold text-gray-500 dark:text-white/50">{p.plan}</p>
                <p className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">{p.price}</p>
                <p className="text-sm text-gray-500 dark:text-white/40 mt-1">{p.desc}</p>
              </div>
            ))}
          </div>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 px-6 py-3 border border-gray-200 dark:border-white/10 rounded-2xl text-sm font-medium text-gray-700 dark:text-white/70 hover:bg-gray-50 dark:hover:bg-white/5 transition"
          >
            See full pricing <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* CTA — stays black in both modes, feels intentional */}
      <section className="py-24 px-6 bg-black text-white text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Your brand is one click away.
          </h2>
          <p className="text-gray-400 mb-8">Stop overthinking. Start building.</p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-2xl font-semibold hover:bg-gray-100 transition"
          >
            Generate Your Brand Now <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 px-6 border-t border-gray-100 dark:border-white/8 bg-background">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-black dark:bg-white rounded-md flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white dark:text-black" />
            </div>
            <span className="font-bold text-gray-900 dark:text-white">brando</span>
          </div>
          <div className="flex gap-6 text-sm text-gray-500 dark:text-white/40">
            <Link href="/pricing" className="hover:text-black dark:hover:text-white transition">Pricing</Link>
            <Link href="/dashboard" className="hover:text-black dark:hover:text-white transition">Dashboard</Link>
          </div>
          <p className="text-sm text-gray-400 dark:text-white/30">
            © {new Date().getFullYear()} Brando. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
