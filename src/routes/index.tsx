import { createFileRoute, Link } from "@tanstack/react-router";
import { Eye, Sparkles, Camera, BookOpen, ArrowRight, Languages, Globe2 } from "lucide-react";
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
    <div className="relative overflow-hidden" style={{ background: "var(--background)" }}>

      {/* HERO */}
      <section className="relative min-h-screen overflow-hidden">
        <div className="pointer-events-none absolute inset-0 tech-grid opacity-100" />
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 -top-32 h-[600px] w-[600px] -translate-x-1/2 rounded-full" style={{ background: "radial-gradient(circle, rgba(0,212,255,0.1) 0%, transparent 70%)" }} />
          <div className="absolute -right-32 top-1/3 h-96 w-96 rounded-full" style={{ background: "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)" }} />
          <div className="absolute -left-16 bottom-1/4 h-64 w-64 rounded-full" style={{ background: "radial-gradient(circle, rgba(212,168,67,0.06) 0%, transparent 70%)" }} />
        </div>
        <Particles />

        <div className="relative mx-auto max-w-7xl px-6 pt-36 pb-28">
          {/* Badge */}
          <div className="flex justify-center animate-fade-up">
            <div className="inline-flex items-center gap-2 rounded-sm border px-4 py-1.5 text-xs" style={{ borderColor: "rgba(0,212,255,0.25)", background: "rgba(0,212,255,0.06)", color: "var(--oracle)", fontFamily: "var(--font-mono)", letterSpacing: "0.12em" }}>
              <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: "var(--oracle)" }} />
              SYS::ELO-2026 / AI-EDUCATION / ACTIVE
            </div>
          </div>

          {/* Hero headline */}
          <div className="mt-12 text-center animate-fade-up" style={{ animationDelay: "80ms" }}>
            <h1 className="mx-auto max-w-5xl text-6xl font-bold leading-[1.02] tracking-tight md:text-8xl" style={{ fontFamily: "var(--font-display)" }}>
              <span style={{ color: "var(--foreground)" }}>Know yourself.</span>
              <br />
              <span className="text-gradient-oracle italic">Learn your way.</span>
            </h1>
          </div>

          <p className="mx-auto mt-7 max-w-xl text-center text-lg animate-fade-up" style={{ animationDelay: "160ms", color: "rgba(208,228,240,0.5)" }}>
            0RACLE discovers who you are. RAWI builds your curriculum. SPARK connects it to the world around you.
          </p>

          {/* Pipeline */}
          <div className="mt-14 flex justify-center animate-fade-up" style={{ animationDelay: "240ms" }}>
            <div className="hud-card relative flex items-stretch gap-0 rounded-xl overflow-hidden" style={{ border: "1px solid rgba(0,212,255,0.12)", background: "rgba(6,12,20,0.8)" }}>
              <PipeStep icon={<Eye className="h-5 w-5" />} name="0RACLE" sub="Know yourself" color="var(--oracle)" />
              <div className="flex items-center px-2">
                <div className="h-px w-8" style={{ background: "linear-gradient(90deg, var(--oracle), var(--rawi))" }} />
                <ArrowRight className="h-3 w-3 mx-1" style={{ color: "rgba(208,228,240,0.2)" }} />
              </div>
              <PipeStep icon={<BookOpen className="h-5 w-5" />} name="RAWI" sub="Your curriculum" color="var(--rawi)" />
              <div className="flex items-center px-2">
                <div className="h-px w-8" style={{ background: "linear-gradient(90deg, var(--rawi), var(--spark))" }} />
                <ArrowRight className="h-3 w-3 mx-1" style={{ color: "rgba(208,228,240,0.2)" }} />
              </div>
              <PipeStep icon={<Camera className="h-5 w-5" />} name="SPARK" sub="See the world" color="var(--spark)" />
              <div className="flex items-center px-2">
                <div className="h-px w-6" style={{ background: "linear-gradient(90deg, var(--spark), transparent)" }} />
                <ArrowRight className="h-3 w-3 mx-1" style={{ color: "rgba(208,228,240,0.15)" }} />
              </div>
              <div className="flex items-center gap-2 px-5 py-4">
                <Globe2 className="h-4 w-4" style={{ color: "rgba(208,228,240,0.25)" }} />
                <span className="text-xs font-medium" style={{ color: "rgba(208,228,240,0.25)", fontFamily: "var(--font-mono)" }}>WORLD</span>
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center animate-fade-up" style={{ animationDelay: "320ms" }}>
            <Link to="/oracle" className="btn-oracle inline-flex items-center gap-2 rounded-lg px-8 py-3.5 text-sm">
              <Eye className="h-4 w-4" /> Start with 0RACLE
            </Link>
            <Link to="/spark" className="btn-spark inline-flex items-center gap-2 rounded-lg px-8 py-3.5 text-sm">
              <Sparkles className="h-4 w-4" /> Try SPARK
            </Link>
            <Link to="/rawi" className="btn-rawi inline-flex items-center gap-2 rounded-lg px-8 py-3.5 text-sm">
              <BookOpen className="h-4 w-4" /> Try RAWI
            </Link>
          </div>

          <p className="mt-6 text-center text-xs animate-fade-up" style={{ animationDelay: "400ms", color: "rgba(208,228,240,0.25)", fontFamily: "var(--font-mono)", letterSpacing: "0.1em" }}>
            6 LANGUAGES · 50 COUNTRIES · EVERY SUBJECT · FREE FOREVER
          </p>
        </div>
      </section>

      {/* STATS */}
      <section style={{ borderTop: "1px solid rgba(0,212,255,0.06)", borderBottom: "1px solid rgba(0,212,255,0.06)", background: "rgba(6,12,20,0.6)" }} className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-center mb-12" style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", letterSpacing: "0.2em", color: "rgba(0,212,255,0.4)" }}>
            // THE_EDUCATION_GAP
          </p>
          <div className="grid gap-px md:grid-cols-3" style={{ background: "rgba(0,212,255,0.06)" }}>
            <StatCard n={758000000} label="adults who cannot read or write today" source="UNESCO 2024" color="oracle" />
            <StatCard n={1} suffix=" in 20" label="AI education tools that work in non-English languages" color="rawi" />
            <StatCard n={68} suffix="%" label="students who disengage when curriculum ignores their culture" color="spark" />
          </div>
        </div>
      </section>

      {/* THREE TOOLS */}
      <section className="py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-4 text-center">
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", letterSpacing: "0.2em", color: "rgba(0,212,255,0.4)" }}>// SYSTEM_OVERVIEW</span>
          </div>
          <h2 className="text-center text-4xl font-bold md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Three tools.{" "}
            <span className="text-gradient-oracle">One pipeline.</span>
          </h2>
          <p className="mt-4 text-center" style={{ color: "rgba(208,228,240,0.4)" }}>
            0RACLE discovers you. RAWI localizes everything. SPARK connects the world.
          </p>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            <ToolCard
              to="/oracle"
              icon={<Eye className="h-7 w-7" />}
              name="0RACLE"
              sub="Know yourself, find your path"
              color="oracle"
              cssColor="var(--oracle)"
              features={["15-exchange deep conversation", "Personal identity report", "Custom curriculum path", "Seamless handoff to RAWI"]}
            />
            <ToolCard
              to="/rawi"
              icon={<BookOpen className="h-7 w-7" />}
              name="RAWI"
              sub="Your world, your lesson"
              color="rawi"
              cssColor="var(--rawi)"
              features={["Culturally localized courses", "Real YouTube videos per lesson", "Free courses from top platforms", "Track progress at your pace"]}
            />
            <ToolCard
              to="/spark"
              icon={<Camera className="h-7 w-7" />}
              name="SPARK"
              sub="Point at anything, learn everything"
              color="spark"
              cssColor="var(--spark)"
              features={["Photo to multi-subject lessons", "Connects to your curriculum", "Local examples from your country", "Cross-tool pipeline with RAWI"]}
            />
          </div>
        </div>
      </section>

      {/* LANGUAGES */}
      <section style={{ borderTop: "1px solid rgba(0,212,255,0.06)", borderBottom: "1px solid rgba(0,212,255,0.06)" }} className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-4 text-center">
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", letterSpacing: "0.2em", color: "rgba(0,212,255,0.4)" }}>// LANGUAGE_SUPPORT</span>
          </div>
          <h2 className="text-center text-4xl font-bold md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Real fluency in{" "}
            <span className="text-gradient-brand">six languages</span>
          </h2>
          <p className="mt-4 text-center" style={{ color: "rgba(208,228,240,0.4)" }}>Including full RTL support for Arabic and Urdu.</p>
          <div className="mt-12 flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {LANGUAGES.map((l, i) => (
              <div key={l.code} className="hud-card min-w-[200px] flex-shrink-0 rounded-xl p-5 animate-fade-up" style={{ animationDelay: `${i * 80}ms`, background: "rgba(6,12,20,0.8)", border: "1px solid rgba(0,212,255,0.08)" }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl">{l.flag}</span>
                  <Languages className="h-3.5 w-3.5" style={{ color: "rgba(0,212,255,0.3)" }} />
                </div>
                <p className="text-sm font-semibold" style={{ color: "var(--foreground)", fontFamily: "var(--font-display)" }}>{l.name}</p>
                <div className="mt-3 rounded-md p-3 text-xs" style={{ background: "rgba(0,0,0,0.3)", color: "rgba(208,228,240,0.35)", border: "1px solid rgba(0,212,255,0.05)" }} dir={l.rtl ? "rtl" : "ltr"}>
                  {sample(l.code)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-4 text-center">
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", letterSpacing: "0.2em", color: "rgba(0,212,255,0.4)" }}>// USER_FEEDBACK</span>
          </div>
          <h2 className="text-center text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }}>What learners say</h2>
          <div className="mt-10 grid gap-px md:grid-cols-3" style={{ background: "rgba(0,212,255,0.06)" }}>
            <div className="flex flex-col items-center justify-center p-12 text-center" style={{ background: "var(--background)" }}>
              <div className="mb-4 text-4xl font-bold text-gradient-oracle" style={{ fontFamily: "var(--font-mono)" }}>?</div>
              <p className="text-sm" style={{ color: "rgba(208,228,240,0.4)" }}>Be the first to review</p>
              <p className="mt-2 text-xs" style={{ color: "rgba(208,228,240,0.2)", fontFamily: "var(--font-mono)" }}>// awaiting_input</p>
            </div>
            <div className="flex flex-col items-center justify-center p-12 text-center" style={{ background: "var(--background)" }}>
              <div className="mb-4 text-4xl font-bold text-gradient-rawi" style={{ fontFamily: "var(--font-mono)" }}>?</div>
              <p className="text-sm" style={{ color: "rgba(208,228,240,0.4)" }}>Be the first to review</p>
              <p className="mt-2 text-xs" style={{ color: "rgba(208,228,240,0.2)", fontFamily: "var(--font-mono)" }}>// awaiting_input</p>
            </div>
            <div className="flex flex-col items-center justify-center p-12 text-center" style={{ background: "var(--background)" }}>
              <div className="mb-4 text-4xl font-bold text-gradient-spark" style={{ fontFamily: "var(--font-mono)" }}>?</div>
              <p className="text-sm" style={{ color: "rgba(208,228,240,0.4)" }}>Be the first to review</p>
              <p className="mt-2 text-xs" style={{ color: "rgba(208,228,240,0.2)", fontFamily: "var(--font-mono)" }}>// awaiting_input</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-28 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 tech-grid opacity-50" />
        <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(0,212,255,0.06) 0%, transparent 70%)" }} />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <p className="mb-4" style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", letterSpacing: "0.2em", color: "rgba(0,212,255,0.4)" }}>// INITIATE_SEQUENCE</p>
          <h2 className="text-5xl font-bold md:text-6xl" style={{ fontFamily: "var(--font-display)", color: "var(--foreground)" }}>
            Start in 10 seconds.
          </h2>
          <p className="mt-4" style={{ color: "rgba(208,228,240,0.4)" }}>No signup. No paywall. Just learning that fits your life.</p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link to="/oracle" className="btn-oracle inline-flex items-center gap-2 rounded-lg px-9 py-4 text-base">
              <Eye className="h-5 w-5" /> Start with 0RACLE
            </Link>
            <Link to="/spark" className="btn-spark inline-flex items-center gap-2 rounded-lg px-9 py-4 text-base">
              <Sparkles className="h-5 w-5" /> Try SPARK
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid rgba(0,212,255,0.08)", background: "rgba(2,4,8,0.95)" }} className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-10 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Eye className="h-4 w-4" style={{ color: "var(--oracle)" }} />
                <span className="font-bold text-sm" style={{ fontFamily: "var(--font-display)", color: "var(--foreground)" }}>EDUCIS</span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(208,228,240,0.35)" }}>
                Education in your world, your language, your life.
              </p>
              <p className="mt-4 text-xs" style={{ color: "rgba(208,228,240,0.2)", fontFamily: "var(--font-mono)" }}>v1.0 · free forever · no account needed</p>
            </div>
            <div>
              <p className="mb-4 text-xs" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.15em", color: "rgba(0,212,255,0.4)" }}>PIPELINE</p>
              <div className="space-y-2.5">
                {[["0RACLE", "/oracle", "oracle"], ["RAWI", "/rawi", "rawi"], ["SPARK", "/spark", "spark"]].map(([name, path, c]) => (
                  <Link key={name} to={path as any} className="flex items-center gap-2 text-sm transition-all hover:opacity-100" style={{ color: "rgba(208,228,240,0.4)", opacity: 0.8 }}>
                    <span className="h-1 w-1 rounded-full" style={{ background: `var(--${c})` }} />
                    {name}
                  </Link>
                ))}
                <Link to="/explore" className="block text-sm" style={{ color: "rgba(208,228,240,0.3)" }}>Explore</Link>
                <Link to="/library" className="block text-sm" style={{ color: "rgba(208,228,240,0.3)" }}>Library</Link>
              </div>
            </div>
            <div>
              <p className="mb-4 text-xs" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.15em", color: "rgba(0,212,255,0.4)" }}>PROJECT</p>
              <div className="space-y-2.5">
                <Link to="/about" className="block text-sm" style={{ color: "rgba(208,228,240,0.4)" }}>About</Link>
                <p className="text-sm" style={{ color: "rgba(208,228,240,0.3)" }}>Built for ELO 2026</p>
                <p className="text-sm" style={{ color: "rgba(208,228,240,0.3)" }}>AI & Education</p>
                <p className="text-sm" style={{ color: "rgba(208,228,240,0.3)" }}>50 countries · 6 languages</p>
              </div>
            </div>
            <div>
              <p className="mb-4 text-xs" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.15em", color: "rgba(0,212,255,0.4)" }}>POWERED_BY</p>
              <div className="space-y-2.5">
                <p className="text-sm" style={{ color: "rgba(208,228,240,0.3)" }}>Groq AI</p>
                <p className="text-sm" style={{ color: "rgba(208,228,240,0.3)" }}>YouTube Data API</p>
                <p className="text-sm" style={{ color: "rgba(208,228,240,0.3)" }}>TanStack Start</p>
                <p className="text-sm" style={{ color: "rgba(208,228,240,0.3)" }}>Cloudflare Workers</p>
                <p className="text-sm" style={{ color: "rgba(208,228,240,0.3)" }}>React · TypeScript</p>
              </div>
            </div>
          </div>
          <div className="mt-12 flex items-center justify-between pt-8" style={{ borderTop: "1px solid rgba(0,212,255,0.06)" }}>
            <p className="text-xs" style={{ color: "rgba(208,228,240,0.2)", fontFamily: "var(--font-mono)" }}>2026 EDUCIS · free forever</p>
            <p className="text-xs" style={{ color: "rgba(208,228,240,0.2)", fontFamily: "var(--font-mono)" }}>0RACLE — RAWI — SPARK · 6 lang · 50 countries</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function PipeStep({ icon, name, sub, color }: { icon: React.ReactNode; name: string; sub: string; color: string }) {
  return (
    <div className="flex items-center gap-3 px-5 py-4" style={{ borderRight: "1px solid rgba(0,212,255,0.08)" }}>
      <span style={{ color }}>{icon}</span>
      <div>
        <p className="text-sm font-bold" style={{ color, fontFamily: "var(--font-display)" }}>{name}</p>
        <p className="text-[10px]" style={{ color: "rgba(208,228,240,0.3)", fontFamily: "var(--font-mono)" }}>{sub}</p>
      </div>
    </div>
  );
}

function StatCard({ n, suffix, label, source, color }: { n: number; suffix?: string; label: string; source?: string; color: string }) {
  const c = color === "oracle" ? "var(--oracle)" : color === "rawi" ? "var(--rawi)" : "var(--spark)";
  return (
    <div className="p-10" style={{ background: "var(--background)" }}>
      <div className="text-5xl font-bold md:text-6xl" style={{ color: c, fontFamily: "var(--font-mono)" }}>
        <CountUp end={n} suffix={suffix ?? ""} />
      </div>
      <p className="mt-4 text-sm" style={{ color: "rgba(208,228,240,0.6)" }}>{label}</p>
      {source && <p className="mt-2 text-xs" style={{ color: "rgba(208,228,240,0.25)", fontFamily: "var(--font-mono)" }}>{source}</p>}
    </div>
  );
}

function ToolCard({ to, icon, name, sub, color, cssColor, features }: { to: string; icon: React.ReactNode; name: string; sub: string; color: string; cssColor: string; features: string[] }) {
  return (
    <Link to={to as any} className={`hud-card hud-card-${color} block rounded-xl p-8 transition-all hover:scale-[1.02]`} style={{ background: "rgba(6,12,20,0.9)", border: `1px solid ${cssColor}18`, boxShadow: `inset 0 0 60px ${cssColor}06` }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="grid h-12 w-12 place-items-center rounded-lg" style={{ background: `${cssColor}15`, border: `1px solid ${cssColor}25` }}>
          <span style={{ color: cssColor }}>{icon}</span>
        </div>
        <div>
          <h3 className="text-xl font-bold" style={{ color: cssColor, fontFamily: "var(--font-display)" }}>{name}</h3>
          <p className="text-xs" style={{ color: "rgba(208,228,240,0.35)" }}>{sub}</p>
        </div>
      </div>
      <ul className="space-y-2.5 mb-6">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-sm" style={{ color: "rgba(208,228,240,0.65)" }}>
            <span className="mt-2 h-1 w-3 flex-shrink-0" style={{ background: cssColor, opacity: 0.6 }} />
            {f}
          </li>
        ))}
      </ul>
      <div className="inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: cssColor, fontFamily: "var(--font-mono)", fontSize: "0.75rem", letterSpacing: "0.05em" }}>
        TRY {name} <ArrowRight className="h-3.5 w-3.5" />
      </div>
    </Link>
  );
}

function Particles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 40 }).map((_, i) => (
        <span key={i} className="absolute rounded-full animate-pulse-glow" style={{
          left: `${(i * 53 + 7) % 100}%`,
          top: `${(i * 37 + 11) % 100}%`,
          width: i % 4 === 0 ? "2px" : "1px",
          height: i % 4 === 0 ? "2px" : "1px",
          background: i % 3 === 0 ? "rgba(0,212,255,0.6)" : i % 3 === 1 ? "rgba(212,168,67,0.5)" : "rgba(139,92,246,0.5)",
          animationDelay: `${(i * 0.4) % 4}s`,
          animationDuration: `${3 + (i % 3)}s`,
        }} />
      ))}
    </div>
  );
}

function sample(code: string) {
  const s: Record<string, string> = {
    en: "Discover photosynthesis through palm trees you already know.",
    ar: "اكتشف عملية البناء الضوئي من خلال نخيل تعرفه.",
    fr: "Decouvre la photosynthese a travers les arbres de ta region.",
    ur: "اپنے قریب موجود پودوں سے فوٹو سنتھیسس سیکھیں۔",
    es: "Descubre la fotosintesis con las plantas de tu region.",
    sw: "Gundua usanisinuru kupitia mimea unayoijua.",
  };
  return s[code] ?? s.en;
}
