import { notFound } from "next/navigation";
import { getLandingPageBySlug } from "@/lib/db";
import LeadCaptureForm from "./LeadCaptureForm";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const page = await getLandingPageBySlug(params.slug);
  if (!page?.published) return {};
  return {
    title: page.content.brand.name,
    description: page.content.hero.subheadline,
  };
}

export default async function PublicLandingPage({ params }: { params: { slug: string } }) {
  const page = await getLandingPageBySlug(params.slug);
  if (!page?.published) return notFound();

  const { content, project_id } = page;
  const { brand, hero, features, social_proof, testimonials, cta, faq } = content;
  const primary = brand.primary_color || "#000000";
  const accent  = brand.accent_color  || "#6366f1";

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">

      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 py-4 bg-white/90 backdrop-blur border-b border-gray-100">
        <span className="text-lg font-bold tracking-tight" style={{ color: primary }}>{brand.name}</span>
        <a
          href="#cta"
          className="px-4 py-2 rounded-xl text-sm font-semibold text-white transition hover:opacity-90"
          style={{ backgroundColor: primary }}
        >
          {hero.cta_text}
        </a>
      </nav>

      {/* Hero */}
      <section
        className="pt-32 pb-24 px-6 text-center"
        style={{ background: `linear-gradient(135deg, ${primary} 0%, ${accent} 100%)` }}
      >
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
            {hero.headline}
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-xl mx-auto">
            {hero.subheadline}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="#cta"
              className="px-7 py-3.5 rounded-xl bg-white font-bold text-sm hover:opacity-90 transition"
              style={{ color: primary }}
            >
              {hero.cta_text}
            </a>
            {hero.cta_secondary && (
              <a
                href="#features"
                className="px-7 py-3.5 rounded-xl border border-white/40 text-white font-semibold text-sm hover:bg-white/10 transition"
              >
                {hero.cta_secondary}
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Social Proof bar */}
      {social_proof?.length > 0 && (
        <section className="border-y border-gray-100 py-6 px-6 bg-gray-50">
          <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-8">
            {social_proof.map((stat, i) => (
              <p key={i} className="text-sm font-semibold text-gray-600">{stat}</p>
            ))}
          </div>
        </section>
      )}

      {/* Features */}
      {features?.length > 0 && (
        <section id="features" className="py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Everything you need
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {features.map((f, i) => (
                <div key={i} className="p-6 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition">
                  <div className="w-10 h-10 rounded-xl mb-4 flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: accent }}>
                    {i + 1}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {testimonials?.length > 0 && (
        <section className="py-20 px-6 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">What people are saying</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {testimonials.map((t, i) => (
                <div key={i} className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
                  <p className="text-gray-700 text-sm leading-relaxed mb-4 italic">"{t.text}"</p>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {faq?.length > 0 && (
        <section className="py-20 px-6">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently asked questions</h2>
            <div className="space-y-4">
              {faq.map((item, i) => (
                <details key={i} className="group border border-gray-100 rounded-xl overflow-hidden">
                  <summary className="px-6 py-4 font-semibold text-gray-900 cursor-pointer hover:bg-gray-50 transition list-none flex items-center justify-between">
                    {item.question}
                    <span className="text-gray-400 group-open:rotate-45 transition-transform inline-block">+</span>
                  </summary>
                  <div className="px-6 pb-4 text-sm text-gray-500 leading-relaxed">{item.answer}</div>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA + Lead Capture */}
      <section
        id="cta"
        className="py-24 px-6 text-center"
        style={{ background: `linear-gradient(135deg, ${primary} 0%, ${accent} 100%)` }}
      >
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{cta.headline}</h2>
          <p className="text-white/75 mb-10">{cta.subheadline}</p>
          <LeadCaptureForm
            projectId={project_id}
            ctaText={cta.button_text}
            accentColor={primary}
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-100 text-center">
        <p className="text-xs text-gray-400">
          {brand.name} · Powered by{" "}
          <a href="/" className="underline underline-offset-2 hover:text-gray-600">Brando</a>
        </p>
      </footer>
    </div>
  );
}
