import { createFileRoute, Link } from "@tanstack/react-router";
import { Eye, Sparkles, Camera, BookOpen, ArrowRight, Globe, Languages, TrendingUp, Users, Brain } from "lucide-react";
import { CountUp } from "@/components/count-up";
import { LANGUAGES } from "@/lib/educis";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EDUCIS — Know yourself, learn your way" },
      { name: "description", content: "0RACLE learns who you are. RAWI builds your curriculum. SPARK connects everything to the real world." },
      { property: "og:title", content: "EDUCIS — AI education pipeline for your world" },
      { property: "og:description", content: "0RACLE → RAWI → SPARK · 6 languages · 50 countries · Free forever." },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="relative overflow-hidden bg-[#080810]">

      {/* HERO */}
      <section className="relative min-h-screen overflow-hidden">
        {/* Grid overlay */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        {/* Radial glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-oracle/10 blur-[120px]" />
          <div className="absolute right-1/4 top-1/3 h-96 w-96 rounded-full bg-rawi/8 blur-[120px]" />
          <div className="absolute bottom-1/4 left-1/2 h-64 w-64 rounded-full bg-spark/8 blur-[100px]" />
        </div>
        <FloatingParticles />

        <div className="relative mx-auto max-w-7xl px-6 pt-32 pb-24">
          {/* Badge */}
          <div className="flex justify-center">
            <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-oracle/30 bg-oracle/10 px-4 py-1.5 text-xs text-oracle backdrop-blur">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-oracle" />
              Built for ELO 2026 — AI & Education
            </div>
          </div>

          {/* Hero text */}
          <h1 className="mx-auto mt-10 max-w-5xl text-center text-6xl font-bold leading-[1.05] tracking-tight md:text-8xl animate-fade-up" style={{ animationDelay: "60ms" }}>
            Know yourself.{" "}
            <br />
            <span className="bg-gradient-to-r from-oracle via-cyan-300 to-rawi bg-clip-text text-transparent italic">
              Learn your way.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-center text-lg text-white/50 animate-fade-up" style={{ animationDelay: "160ms" }}>
            0RACLE discovers who you are. RAWI builds your curriculum. SPARK connects it to the world around you.
          </p>

          {/* Pipeline diagram */}
          <div className="mt-14 flex justify-center animate-fade-up" style={{ animationDelay: "260ms" }}>
            <div className="relative flex items-center gap-0">
              {/* Left HUD decorations */}
              <div className="mr-6 hidden md:flex flex-col gap-2 opacity-40">
                <div className="h-px w-16 bg-gradient-to-r from-transparent to-oracle" />
                <div className="h-px w-10 bg-gradient-to-r from-transparent to-oracle/60" />
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-oracle/40" />
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-2 backdrop-blur">
                <PipelineStep icon={<Eye className="h-5 w-5" />} label="0RACLE" desc="Know yourself" color="text-oracle" bg="bg-oracle/15" border="border-oracle/30" />
                <div className="flex items-center gap-1">
                  <div className="h-px w-4 bg-gradient-to-r from-oracle/60 to-rawi/60" />
                  <ArrowRight className="h-3 w-3 text-white/30" />
                </div>
                <PipelineStep icon={<BookOpen className="h-5 w-5" />} label="RAWI" desc="Your curriculum" color="text-rawi" bg="bg-rawi/15" border="border-rawi/30" />
                <div className="flex items-center gap-1">
                  <div className="h-px w-4 bg-gradient-to-r from-rawi/60 to-spark/60" />
                  <ArrowRight className="h-3 w-3 text-white/30" />
                </div>
                <PipelineStep icon={<Camera className="h-5 w-5" />} label="SPARK" desc="See the world" color="text-spark" bg="bg-spark/15" border="border-spark/30" />
                <div className="flex items-center gap-1">
                  <div className="h-px w-4 bg-gradient-to-r from-spark/60 to-transparent" />
                  <ArrowRight className="h-3 w-3 text-white/30" />
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                  <Globe className="h-5 w-5 text-white/40" />
                  <div>
                    <p className="text-xs font-bold text-white/60">WORLD</p>
                    <p className="text-[10px] text-white/30">Connected</p>
                  </div>
                </div>
              </div>

              {/* Right HUD decorations */}
              <div className="ml-6 hidden md:flex flex-col gap-2 items-end opacity-40">
                <div className="h-px w-16 bg-gradient-to-l from-transparent to-spark" />
                <div className="h-px w-10 bg-gradient-to-l from-transparent to-spark/60" />
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-spark/40" />
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row animate-fade-up" style={{ animationDelay: "360ms" }}>
            <Link to="/oracle" className="group relative inline-flex items-center gap-2 rounded-xl bg-oracle px-7 py-3.5 text-base font-semibold text-black transition-all hover:bg-oracle/90 hover:shadow-[0_0_40px_rgba(6,182,212,0.4)]">
              <Eye className="h-4 w-4" /> Start with 0RACLE
            </Link>
            <Link to="/spark" className="inline-flex items-center gap-2 rounded-xl border border-spark/40 bg-spark/10 px-7 py-3.5 text-base font-semibold text-spark transition-all hover:bg-spark/20 hover:border-spark/60 hover:shadow-[0_0_30px_rgba(124,58,237,0.3)]">
              <Sparkles className="h-4 w-4" /> Try SPARK
            </Link>
            <Link to="/rawi" className="inline-flex items-center gap-2 rounded-xl border border-rawi/40 bg-rawi/10 px-7 py-3.5 text-base font-semibold text-rawi transition-all hover:bg-rawi/20 hover:border-rawi/60 hover:shadow-[0_0_30px_rgba(201,168,76,0.3)]">
              <BookOpen className="h-4 w-4" /> Try RAWI
            </Link>
          </div>

          <p className="mt-6 text-center text-sm text-white/30 animate-fade-up" style={{ animationDelay: "460ms" }}>
            8 languages · 50 countries · Every subject · Free forever
          </p>
        </div>
      </section>

      {/* STATS */}
      <section className="relative border-y border-white/5 py-24">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-oracle/3 to-transparent" />
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-center text-[11px] font-semibold uppercase tracking-[4px] text-white/30">The Education Gap</p>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <StatCard number={758000000} label="adults who cannot read or write today" source="UNESCO 2024" color="oracle" />
            <StatCard number={1} suffix=" in 20" label="AI education tools that work in non-English languages" color="rawi" />
            <StatCard number={68} suffix="%" label="students who disengage when curriculum ignores their culture" color="spark" />
          </div>
        </div>
      </section>

      {/* THREE TOOLS */}
      <section className="py-28">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-center text-4xl font-bold text-white md:text-5xl">
            Three tools.{" "}
            <span className="bg-gradient-to-r from-oracle to-rawi bg-clip-text text-transparent">One pipeline.</span>
          </h2>
          <p className="mt-4 text-center text-white/40">0RACLE discovers you. RAWI localizes everything. SPARK connects the world.</p>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {/* 0RACLE card */}
            <div className="group relative overflow-hidden rounded-2xl border border-oracle/20 bg-gradient-to-b from-oracle/10 to-oracle/5 p-8 transition-all hover:border-oracle/40 hover:shadow-[0_0_60px_rgba(6,182,212,0.15)]">
              <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-oracle/10 blur-2xl" />
              {/* HUD corners */}
              <div className="absolute top-3 left-3 h-4 w-4 border-t border-l border-oracle/40" />
              <div className="absolute top-3 right-3 h-4 w-4 border-t border-r border-oracle/40" />
              <div className="absolute bottom-3 left-3 h-4 w-4 border-b border-l border-oracle/40" />
              <div className="absolute bottom-3 right-3 h-4 w-4 border-b border-r border-oracle/40" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-5">
                  <div className="grid h-12 w-12 place-items-center rounded-xl border border-oracle/30 bg-oracle/15">
                    <Eye className="h-6 w-6 text-oracle" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-oracle">0RACLE</h3>
                    <p className="text-xs text-white/40">Know yourself, find your path</p>
                  </div>
                </div>
                <ul className="space-y-2.5">
                  {["15-exchange deep conversation", "Personal identity report", "Custom curriculum path", "Seamless handoff to RAWI"].map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-white/70">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-oracle/60" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/oracle" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-oracle hover:gap-2.5 transition-all">
                  Try 0RACLE <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* RAWI card */}
            <div className="group relative overflow-hidden rounded-2xl border border-rawi/20 bg-gradient-to-b from-rawi/10 to-rawi/5 p-8 transition-all hover:border-rawi/40 hover:shadow-[0_0_60px_rgba(201,168,76,0.15)]">
              <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-rawi/10 blur-2xl" />
              <div className="absolute top-3 left-3 h-4 w-4 border-t border-l border-rawi/40" />
              <div className="absolute top-3 right-3 h-4 w-4 border-t border-r border-rawi/40" />
              <div className="absolute bottom-3 left-3 h-4 w-4 border-b border-l border-rawi/40" />
              <div className="absolute bottom-3 right-3 h-4 w-4 border-b border-r border-rawi/40" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-5">
                  <div className="grid h-12 w-12 place-items-center rounded-xl border border-rawi/30 bg-rawi/15">
                    <BookOpen className="h-6 w-6 text-rawi" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-rawi">RAWI</h3>
                    <p className="text-xs text-white/40">Your world, your lesson</p>
                  </div>
                </div>
                <ul className="space-y-2.5">
                  {["Culturally localized courses", "Real YouTube videos per lesson", "Free courses from top platforms", "Track progress at your pace"].map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-white/70">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-rawi/60" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/rawi" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-rawi hover:gap-2.5 transition-all">
                  Try RAWI <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* SPARK card */}
            <div className="group relative overflow-hidden rounded-2xl border border-spark/20 bg-gradient-to-b from-spark/10 to-spark/5 p-8 transition-all hover:border-spark/40 hover:shadow-[0_0_60px_rgba(124,58,237,0.15)]">
              <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-spark/10 blur-2xl" />
              <div className="absolute top-3 left-3 h-4 w-4 border-t border-l border-spark/40" />
              <div className="absolute top-3 right-3 h-4 w-4 border-t border-r border-spark/40" />
              <div className="absolute bottom-3 left-3 h-4 w-4 border-b border-l border-spark/40" />
              <div className="absolute bottom-3 right-3 h-4 w-4 border-b border-r border-spark/40" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-5">
                  <div className="grid h-12 w-12 place-items-center rounded-xl border border-spark/30 bg-spark/15">
                    <Camera className="h-6 w-6 text-spark" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-spark">SPARK</h3>
                    <p className="text-xs text-white/40">Point at anything, learn everything</p>
                  </div>
                </div>
                <ul className="space-y-2.5">
                  {["Photo to multi-subject lessons", "Connects to your curriculum", "Local examples from your country", "Cross-tool pipeline with RAWI"].map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-white/70">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-spark/60" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/spark" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-spark hover:gap-2.5 transition-all">
                  Try SPARK <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WORLD MAP / LANGUAGES */}
      <section className="relative border-y border-white/5 py-24 overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-oracle/5 blur-[80px]" />
        </div>
        <div className="relative mx-auto max-w-7xl px-6">
          <h2 className="text-center text-4xl font-bold text-white md:text-5xl">
            Real fluency in{" "}
            <span className="bg-gradient-to-r from-oracle to-cyan-300 bg-clip-text text-transparent">six languages</span>
          </h2>
          <p className="mt-4 text-center text-white/40">Including full RTL support for Arabic and Urdu.</p>
          <div className="mt-12 flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {LANGUAGES.map((l) => (
              <div key={l.code} className="min-w-[220px] flex-shrink-0 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur transition-all hover:border-oracle/30 hover:bg-oracle/5">
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{l.flag}</span>
                  <Languages className="h-4 w-4 text-white/20" />
                </div>
                <p className="mt-3 text-sm font-semibold text-white">{l.name}</p>
                <div className="mt-3 rounded-lg border border-white/5 bg-white/5 p-3 text-xs text-white/40" dir={l.rtl ? "rtl" : "ltr"}>
                  {sampleByLang(l.code)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-center text-3xl font-bold text-white">What learners are saying</h2>
          <p className="mt-3 text-center text-white/40">Real students, real results.</p>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {REVIEWS.map((r, i) => (
              <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition-all hover:border-white/20">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <span key={j} className="text-rawi text-sm">★</span>
                  ))}
                </div>
                <p className="text-sm text-white/70 leading-relaxed italic">"{r.text}"</p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-oracle/40 to-rawi/40 text-xs font-bold text-white">
                    {r.name[0]}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">{r.name}</p>
                    <p className="text-[10px] text-white/40">{r.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-28 overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 top-0 h-64 w-64 rounded-full bg-oracle/10 blur-[80px]" />
          <div className="absolute right-1/4 bottom-0 h-64 w-64 rounded-full bg-rawi/10 blur-[80px]" />
        </div>
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-5xl font-bold text-white md:text-6xl">Start in 10 seconds.</h2>
          <p className="mt-4 text-white/40">No signup. No paywall. Just learning that fits your life.</p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/oracle" className="inline-flex items-center gap-2 rounded-xl bg-oracle px-8 py-4 text-base font-semibold text-black transition-all hover:bg-oracle/90 hover:shadow-[0_0_40px_rgba(6,182,212,0.4)]">
              <Eye className="h-5 w-5" /> Start with 0RACLE
            </Link>
            <Link to="/spark" className="inline-flex items-center gap-2 rounded-xl border border-spark/40 bg-spark/10 px-8 py-4 text-base font-semibold text-spark transition-all hover:bg-spark/20 hover:shadow-[0_0_30px_rgba(124,58,237,0.3)]">
              <Sparkles className="h-5 w-5" /> Try SPARK
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-white/2 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-10 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-oracle" />
                <span className="font-bold text-white">EDUCIS</span>
              </div>
              <p className="mt-3 text-sm text-white/40 leading-relaxed">
                Education in your world, your language, your life.
              </p>
              <p className="mt-4 text-xs text-white/20">Free forever · No account needed</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">Pipeline</p>
              <div className="space-y-2">
                <Link to="/oracle" className="block text-sm text-white/60 hover:text-oracle transition-colors">0RACLE</Link>
                <Link to="/rawi" className="block text-sm text-white/60 hover:text-rawi transition-colors">RAWI</Link>
                <Link to="/spark" className="block text-sm text-white/60 hover:text-spark transition-colors">SPARK</Link>
                <Link to="/explore" className="block text-sm text-white/60 hover:text-white transition-colors">Explore</Link>
                <Link to="/library" className="block text-sm text-white/60 hover:text-white transition-colors">Library</Link>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">Project</p>
              <div className="space-y-2">
                <Link to="/about" className="block text-sm text-white/60 hover:text-white transition-colors">About</Link>
                <p className="text-sm text-white/60">Built for ELO 2026 — AI & Education</p>
                <p className="text-sm text-white/60">50 countries · 6 languages</p>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">Powered by</p>
              <div className="space-y-2">
                <p className="text-sm text-white/60">Groq AI · YouTube Data API</p>
                <p className="text-sm text-white/60">TanStack Start · Cloudflare</p>
                <p className="text-sm text-white/60">React · TypeScript · Tailwind</p>
              </div>
            </div>
          </div>
          <div className="mt-12 flex items-center justify-between border-t border-white/5 pt-8">
            <p className="text-xs text-white/20">2026 EDUCIS. Free forever.</p>
            <p className="text-xs text-white/20">0RACLE — RAWI — SPARK · 6 languages · 50 countries</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function PipelineStep({ icon, label, desc, color, bg, border }: { icon: React.ReactNode; label: string; desc: string; color: string; bg: string; border: string }) {
  return (
    <div className={`flex items-center gap-2.5 rounded-xl ${bg} ${border} border px-4 py-3`}>
      <span className={color}>{icon}</span>
      <div>
        <p className={`text-sm font-bold ${color}`}>{label}</p>
        <p className="text-[10px] text-white/30">{desc}</p>
      </div>
    </div>
  );
}

function StatCard({ number, suffix, label, source, color }: { number: number; suffix?: string; label: string; source?: string; color: string }) {
  const colorMap: Record<string, string> = {
    oracle: "from-oracle to-cyan-300",
    rawi: "from-rawi to-yellow-300",
    spark: "from-spark to-purple-400",
  };
  const borderMap: Record<string, string> = {
    oracle: "border-oracle/20 hover:border-oracle/40 hover:shadow-[0_0_40px_rgba(6,182,212,0.1)]",
    rawi: "border-rawi/20 hover:border-rawi/40 hover:shadow-[0_0_40px_rgba(201,168,76,0.1)]",
    spark: "border-spark/20 hover:border-spark/40 hover:shadow-[0_0_40px_rgba(124,58,237,0.1)]",
  };
  return (
    <div className={`rounded-2xl border ${borderMap[color]} bg-white/3 p-8 backdrop-blur transition-all`}>
      <div className={`text-5xl font-bold tracking-tight bg-gradient-to-r ${colorMap[color]} bg-clip-text text-transparent md:text-6xl`}>
        <CountUp end={number} suffix={suffix ?? ""} />
      </div>
      <p className="mt-4 text-sm text-white/60">{label}</p>
      {source && <p className="mt-2 text-xs text-white/30">{source}</p>}
    </div>
  );
}

function FloatingParticles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 30 }).map((_, i) => (
        <span
          key={i}
          className="absolute rounded-full animate-pulse"
          style={{
            left: `${(i * 53) % 100}%`,
            top: `${(i * 37) % 100}%`,
            width: i % 3 === 0 ? "2px" : "1px",
            height: i % 3 === 0 ? "2px" : "1px",
            backgroundColor: i % 3 === 0 ? "rgba(6,182,212,0.5)" : i % 3 === 1 ? "rgba(201,168,76,0.4)" : "rgba(124,58,237,0.4)",
            animationDelay: `${i * 0.3}s`,
            animationDuration: `${3 + (i % 4)}s`,
          }}
        />
      ))}
    </div>
  );
}

function sampleByLang(code: string): string {
  const samples: Record<string, string> = {
    en: "Discover photosynthesis through palm trees you already know.",
    ar: "اكتشف عملية البناء الضوئي من خلال نخيل تعرفه.",
    fr: "Decouvre la photosynthese a travers les arbres de ta region.",
    ur: "اپنے قریب موجود پودوں سے فوٹو سنتھیسس سیکھیں۔",
    es: "Descubre la fotosintesis con las plantas de tu region.",
    sw: "Gundua usanisinuru kupitia mimea unayoijua.",
  };
  return samples[code] ?? samples.en;
}

const REVIEWS = [
  {
    text: "I never understood chemistry until RAWI explained it through examples from my city in Nigeria. It finally clicked.",
    name: "Amara O.",
    role: "Secondary student, Lagos"
  },
  {
    text: "The SPARK feature is insane. I pointed my phone at a leaf and got lessons in biology, chemistry, and even economics.",
    name: "Yusuf K.",
    role: "University student, Karachi"
  },
  {
    text: "0RACLE asked me the right questions and built me a curriculum I actually want to follow. First time I felt seen by an app.",
    name: "Fatima A.",
    role: "Self-learner, Riyadh"
  },
];
