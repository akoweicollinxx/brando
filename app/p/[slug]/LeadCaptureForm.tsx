"use client";

import { useState } from "react";
import { Loader2, Check } from "lucide-react";

interface Props {
  projectId: string;
  ctaText?: string;
  accentColor: string;
}

export default function LeadCaptureForm({ projectId, ctaText = "Get Early Access", accentColor }: Props) {
  const [name, setName]       = useState("");
  const [email, setEmail]     = useState("");
  const [phone, setPhone]     = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone]       = useState(false);
  const [error, setError]     = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/capture-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, name: name.trim(), email: email.trim(), phone: phone.trim() }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed");
      setDone(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-3 py-8">
        <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
          <Check className="w-6 h-6 text-white" />
        </div>
        <p className="text-xl font-bold text-white">You're in!</p>
        <p className="text-white/70 text-sm">We'll be in touch shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 w-full max-w-sm mx-auto">
      <input
        type="text"
        placeholder="Your name"
        value={name}
        onChange={e => setName(e.target.value)}
        className="w-full px-4 py-3 rounded-xl bg-white/15 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 text-sm"
      />
      <input
        type="email"
        placeholder="Email address *"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        className="w-full px-4 py-3 rounded-xl bg-white/15 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 text-sm"
      />
      <input
        type="tel"
        placeholder="Phone (optional)"
        value={phone}
        onChange={e => setPhone(e.target.value)}
        className="w-full px-4 py-3 rounded-xl bg-white/15 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 text-sm"
      />
      {error && <p className="text-red-300 text-xs">{error}</p>}
      <button
        type="submit"
        disabled={loading || !email.trim()}
        className="w-full py-3.5 px-6 rounded-xl bg-white font-bold text-sm transition hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
        style={{ color: accentColor }}
      >
        {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</> : ctaText}
      </button>
    </form>
  );
}
