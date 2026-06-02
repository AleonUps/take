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
    <div className="relative overflow-hidden min-h-screen selection:bg-cyan-500/30 selection:text-white" style={{ background: "var(--background)" }}>

      {/* HERO SECTION */}
      <section className="relative min-h-screen overflow-hidden flex items-center justify-center py-20">
        {/* Deep Tech Grid Layout Background */}
        <div className="pointer-events-none absolute inset-0 tech-grid opacity-30" />
        
        {/* Dynamic High-End Ambient Mesh Glows */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-[-10%] h-[700px] w-[800px] -translate-x-1/2 rounded-full blur-[140px] animate-pulse" style={{ background: "radial-gradient(circle, rgba(0,212,255,0.15) 0%, transparent 75%)", animationDuration: "8s" }} />
          <div className="absolute -right-20 top-1/4 h-[500px] w-[500px] rounded-full blur-[120px]" style={{ background: "radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)" }} />
          <div className="absolute -left-20 bottom-1/4 h-[400px] w-[400px] rounded-full blur-[100px]" style={{ background: "radial-gradient(circle, rgba(212,168,67,0.08) 0%, transparent 70%)" }} />
        </div>
        
        <Particles />

        <div className="relative mx-auto max-w-7xl px-6 w-full z-10 text-center">
          {/* Cyber Badge Header */}
          <div className="flex justify-center mix-blend-screen">
            <div className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[10px] uppercase font-mono tracking-[0.2em] shadow-[0_0_20px_rgba(0,212,255,0.1)] transition-all duration-300 hover:border-cyan-400/40" style={{ borderColor: "rgba(0,212,255,0.2)", background: "rgba(6,12,20,0.6)", color: "var(--oracle)" }}>
              <span className="h-1.5 w-1.5 animate-ping rounded-full" style={{ background: "var(--oracle)" }} />
              SYS::ELO-2026 / AI-EDUCATION / ACTIVE
            </div>
          </div>

          {/* Premium Typographic Hero Headline */}
          <div className="mt-10">
            <h1 className="mx-auto max-w-5xl text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-7xl md:text-8xl" style={{ fontFamily: "var(--font-display)" }}>
              <span className="text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.15)]">Know yourself.</span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-teal-300 bg-clip-text text-transparent italic font-normal tracking-wide pr-2">
                Learn your way.
              </span>
            </h1>
          </div>

          <p className="mx-auto mt-8 max-w-2xl text-base md:text-lg font-normal leading-relaxed tracking-wide text-slate-400/90">
            <span className="text-cyan-400 font-medium font-mono text-xs mr-1">[0RACLE]</span> discovers who you are. 
            <span className="text-amber-400 font-medium font-mono text-xs mx-1">[RAWI]</span> builds your curriculum. 
            <span className="text-purple-400 font-medium font-mono text-xs mx-1">[SPARK]</span> connects it to the world.
          </p>

          {/* Connected Glassmorphism Pipeline Tracker */}
          <div className="mt-14 flex justify-center">
            <div className="glass relative flex flex-col md:flex-row items-stretch gap-0 rounded-2xl overflow-hidden p-1 border border-white/[0.04] shadow-[0_24px_60px_-15px_rgba(0,0,0,0.8)] backdrop-blur-xl">
              <PipeStep icon={<Eye className="h-4 w-4" />} name="0RACLE" sub="Know yourself" color="var(--oracle)" />
              
              <div className="flex items-center justify-center px-1 py-2 md:py-0">
                <div className="h-px w-12 hidden md:block" style={{ background: "linear-gradient(90deg, rgba(0,212,255,0.4), rgba(212,168,67,0.4))" }} />
                <ArrowRight className="h-3.5 w-3.5 text-slate-600 rotate-90 md:rotate-0" />
              </div>
              
              <PipeStep icon={<BookOpen className="h-4 w-4" />} name="RAWI" sub="Your curriculum" color="var(--rawi)" />
              
              <div className="flex items-center justify-center px-1 py-2 md:py-0">
                <div className="h-px w-12 hidden md:block" style={{ background: "linear-gradient(90deg, rgba(212,168,67,0.4), rgba(139,92,246,0.4))" }} />
                <ArrowRight className="h-3.5 w-3.5 text-slate-600 rotate-90 md:rotate-0" />
              </div>
              
              <PipeStep icon={<Camera className="h-4 w-4" />} name="SPARK" sub="See the world" color="var(--spark)" />
              
              <div className="flex items-center justify-center px-1 py-2 md:py-0">
                <div className="h-px w-8 hidden md:block" style={{ background: "linear-gradient(90deg, rgba(139,92,246,0.4), transparent)" }} />
                <ArrowRight className="h-3.5 w-3.5 text-slate-700/50 rotate-90 md:rotate-0" />
              </div>
              
              <div className="flex items-center justify-center gap-2 px-6 py-4 bg-white/[0.01] border-t md:border-t-0 md:border-l border-white/[0.03]">
                <Globe2 className="h-4 w-4 text-slate-500" />
                <span className="text-[10px] font-bold tracking-widest text-slate-500 font-mono">WORLD</span>
              </div>
            </div>
          </div>

          {/* Premium Cyber Activation Buttons */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/oracle" className="relative group overflow-hidden w-full sm:w-auto rounded-xl p-[1px] transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,212,255,0.3)]">
              <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-sky-400 rounded-xl" />
              <div className="relative px-8 py-3.5 bg-slate-950 rounded-[11px] text-sm font-semibold text-white tracking-wide flex items-center justify-center gap-2 transition duration-300 group-hover:bg-transparent">
                <Eye className="h-4 w-4 text-cyan-400 group-hover:text-black transition" /> Start with 0RACLE
              </div>
            </Link>

            <Link to="/spark" className="relative group overflow-hidden w-full sm:w-auto rounded-xl p-[1px] transition-all duration-300 hover:shadow-[0_0_30px_rgba(139,92,246,0.25)]">
              <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-500 opacity-60 group-hover:opacity-100 transition" />
              <div className="relative px-8 py-3.5 bg-slate-950 rounded-[11px] text-sm font-semibold text-slate-300 tracking-wide flex items-center justify-center gap-2 transition duration-300 group-hover:text-white">
                <Sparkles className="h-4 w-4 text-purple-400" /> Try SPARK
              </div>
            </Link>

            <Link to="/rawi" className="relative group overflow-hidden w-full sm:w-auto rounded-xl p-[1px] transition-all duration-300 hover:shadow-[0_0_30px_rgba(212,168,67,0.25)]">
              <span className="absolute inset-0 bg-gradient-to-r from-amber-500 to-yellow-600 opacity-60 group-hover:opacity-100 transition" />
              <div className="relative px-8 py-3.5 bg-slate-950 rounded-[11px] text-sm font-semibold text-slate-300 tracking-wide flex items-center justify-center gap-2 transition duration-300 group-hover:text-white">
                <BookOpen className="h-4 w-4 text-amber-400" /> Try RAWI
              </div>
            </Link>
          </div>

          {/* Footer Subtext Meta */}
          <p className="mt-8 text-[10px] tracking-[0.15em] font-mono text-slate-600">
            6 LANGUAGES · 50 COUNTRIES · EVERY SUBJECT · FREE FOREVER
          </p>
        </div>
      </section>

      {/* STATS AREA */}
      <section className="relative border-y border-white/[0.04] bg-slate-950/40 backdrop-blur-sm py-20">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-center mb-10 font-mono text-[10px] tracking-[0.25em] text-slate-600">
            // DATASET_METRICS
          </p>
          <div className="grid gap-px bg-white/[0.03] rounded-2xl overflow-hidden border border-white/[0.04] md:grid-cols-3 shadow-2xl">
            <StatCard n={758000000} label="adults who cannot read or write today" source="UNESCO Report" color="oracle" />
            <StatCard n={1} suffix=" in 20" label="AI interfaces running in localized non-English nodes" color="rawi" />
            <StatCard n={68} suffix="%" label="students who disengage when localized contexts are omitted" color="spark" />
          </div>
        </div>
      </section>

      {/* THREE MODULE OVERVIEW CARDS */}
      <section className="py-28 relative">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-4 text-center">
            <span className="font-mono text-[10px] tracking-[0.25em] text-cyan-500/60">// CORE_ARCHITECTURE</span>
          </div>
          <h2 className="text-center text-4xl font-extrabold text-white tracking-tight md:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Three tools. <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">One core flow.</span>
          </h2>
          <p className="mt-4 text-center max-w-xl mx-auto text-sm text-slate-400">
            0RACLE constructs user identities. RAWI engineers structured streams. SPARK anchors spatial learning maps.
          </p>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            <ToolCard
              to="/oracle"
              icon={<Eye className="h-6 w-6" />}
              name="0RACLE"
              sub="Identity alignment engine"
              color="oracle"
              cssColor="var(--oracle)"
              features={["15-exchange structured interview", "Deep user cognitive profile maps", "Curriculum specification build", "Direct native export to RAWI"]}
            />
            <ToolCard
              to="/rawi"
              icon={<BookOpen className="h-6 w-6" />}
              name="RAWI"
              sub="Curriculum execution stream"
              color="rawi"
              cssColor="var(--rawi)"
              features={["Full cultural localization matrices", "Curated visual content per topic", "Open-access validation paths", "Granular telemetry telemetry tracking"]}
            />
            <ToolCard
              to="/spark"
              icon={<Camera className="h-6 w-6" />}
              name="SPARK"
              sub="Spatial reality translation node"
              color="spark"
              cssColor="var(--spark)"
              features={["Optical cross-subject compilation", "Real-world environment binding", "Regional contextual definitions", "Bidirectional pipeline validation"]}
            />
          </div>
        </div>
      </section>

      {/* NATIVE LANGUAGE TRANSLATION SCROLL SLIDER */}
      <section className="py-24 border-y border-white/[0.03] bg-slate-950/20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-3 text-center">
            <span className="font-mono text-[10px] tracking-[0.25em] text-amber-500/70">// PACKET_LOCALIZATION</span>
          </div>
          <h2 className="text-center text-3xl font-bold text-white md:text-4xl" style={{ fontFamily: "var(--font-display)" }}>
            Real fluency in <span className="text-amber-400">six global vectors</span>
          </h2>
          <p className="mt-3 text-center text-sm text-slate-500">Full layout shifting layout system built for Arabic and Urdu.</p>
          
          <div className="mt-12 flex gap-4 overflow-x-auto pb-6 scrollbar-hide snap-x">
            {LANGUAGES.map((l, i) => (
              <div key={l.code} className="glass snap-center min-w-[280px] flex-shrink-0 rounded-xl p-6 border border-white/[0.03] shadow-lg hover:border-white/[0.08] transition duration-300">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl filter drop-shadow-md">{l.flag}</span>
                  <Languages className="h-4 w-4 text-slate-600" />
                </div>
                <p className="text-sm font-bold text-slate-200" style={{ fontFamily: "var(--font-display)" }}>{l.name}</p>
                <div className="mt-3 rounded-lg p-3 text-xs bg-black/40 border border-white/[0.02] text-slate-400 font-medium leading-relaxed shadow-inner h-16 flex items-center" dir={l.rtl ? "rtl" : "ltr"}>
                  {sample(l.code)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SYSTEM METRICS FEEDBACK GRID */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-4 text-center">
            <span className="font-mono text-[10px] tracking-[0.25em] text-purple-400">// NODE_METRICS</span>
          </div>
          <h2 className="text-center text-3xl font-bold text-white tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Telemetry Verification</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {["oracle", "rawi", "spark"].map((type) => (
              <div key={type} className="glass rounded-xl flex flex-col items-center justify-center p-10 text-center border border-white/[0.03] transition group hover:border-white/[0.08]">
                <div className={`mb-3 text-xs font-mono tracking-widest uppercase opacity-40 group-hover:opacity-80 transition duration-300 ${type === 'oracle' ? 'text-cyan-400' : type === 'rawi' ? 'text-amber-400' : 'text-purple-400'}`}>
                  ● Node_{type}
                </div>
                <p className="text-xs text-slate-500 font-mono tracking-wide">// awaiting_user_reviews</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL INITIATE FLOW BANNER */}
      <section className="relative py-32 overflow-hidden border-t border-white/[0.03]">
        <div className="pointer-events-none absolute inset-0 tech-grid opacity-20" />
        <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(circle at 50% 50%, rgba(0,212,255,0.06) 0%, transparent 60%)" }} />
        <div className="relative mx-auto max-w-3xl px-6 text-center z-10">
          <p className="mb-4 font-mono text-[10px] tracking-[0.3em] text-cyan-400">// PIPELINE_ACTIVATION_SEQUENCE</p>
          <h2 className="text-4xl font-extrabold text-white tracking-tight sm:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Initialize in 10 seconds.
          </h2>
          <p className="mt-4 text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
            Zero configurations required. Fully open-access system designed to optimize personal engineering maps.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/oracle" className="relative group overflow-hidden w-full sm:w-auto rounded-xl p-[1px] transition duration-300 hover:shadow-[0_0_35px_rgba(0,212,255,0.35)]">
              <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-sky-400 rounded-xl" />
              <div className="relative px-9 py-4 bg-slate-950 rounded-[11px] text-base font-semibold text-white tracking-wide flex items-center justify-center gap-2 transition duration-300 group-hover:bg-transparent">
                <Eye className="h-5 w-5 text-cyan-400 group-hover:text-black transition" /> Start with 0RACLE
              </div>
            </Link>
            <Link to="/spark" className="relative group overflow-hidden w-full sm:w-auto rounded-xl p-[1px] transition duration-300 hover:shadow-[0_0_35px_rgba(139,92,246,0.3)]">
              <span className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-70 group-hover:opacity-100 transition" />
              <div className="relative px-9 py-4 bg-slate-950 rounded-[11px] text-base font-semibold text-slate-200 tracking-wide flex items-center justify-center gap-2 transition duration-300 group-hover:text-white">
                <Sparkles className="h-5 w-5 text-purple-400" /> Try SPARK
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* SYSTEM ARCHITECTURE FOOTER */}
      <footer className="relative border-t border-white/[0.04] bg-slate-950/80 backdrop-blur-md py-16 text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="font-extrabold tracking-widest text-white font-display">EDUCIS</span>
              </div>
              <p className="leading-relaxed text-slate-400/70">
                Immersive localized tracking architecture maps across fifty separate global regions.
              </p>
              <p className="text-[10px] font-mono">// core_v1.0.0_stable</p>
            </div>
            
            <div>
              <p className="mb-4 font-mono text-[10px] tracking-[0.2em] text-cyan-400 font-bold">PIPELINE</p>
              <div className="space-y-3 font-medium">
                {[["0RACLE Engine", "/oracle", "oracle"], ["RAWI Compiler", "/rawi", "rawi"], ["SPARK Gateway", "/spark", "spark"]].map(([name, path, c]) => (
                  <Link key={name} to={path as any} className="flex items-center gap-2 transition hover:text-white">
                    <span className="h-1 w-1 rounded-full" style={{ background: `var(--${c})` }} />
                    {name}
                  </Link>
                ))}
                <div className="pt-2 flex gap-4 text-[11px] text-slate-600">
                  <Link to="/explore" className="hover:text-slate-400">Explore</Link>
                  <Link to="/library" className="hover:text-slate-400">Library</Link>
                </div>
              </div>
            </div>

            <div>
              <p className="mb-4 font-mono text-[10px] tracking-[0.2em] text-cyan-400 font-bold">SPECIFICATIONS</p>
              <div className="space-y-2.5 text-slate-400/80">
                <Link to="/about" className="block hover:text-white transition">Platform About Documentation</Link>
                <p>// Deployment Mode: ELO 2026</p>
                <p>// Integration Node: AI Education Pipeline</p>
              </div>
            </div>

            <div>
              <p className="mb-4 font-mono text-[10px] tracking-[0.2em] text-cyan-400 font-bold">CORE_DEPENDENCIES</p>
              <div className="space-y-2 font-mono text-[11px] text-slate-600">
                <p>⚡ Groq Llama Architecture</p>
                <p>⚡ YouTube Data Streams</p>
                <p>⚡ TanStack Router Tree</p>
                <p>⚡ Cloudflare Edge Layer</p>
              </div>
            </div>
          </div>
          
          <div className="mt-12 flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/[0.03] font-mono text-[10px] text-slate-600 gap-4">
            <p>© 2026 EDUCIS • ACCESS LAYER UNLOCKED</p>
            <p>0RACLE — RAWI — SPARK · DISTRIBUTED LEARNING SYSTEM</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function PipeStep({ icon, name, sub, color }: { icon: React.ReactNode; name: string; sub: string; color: string }) {
  return (
    <div className="flex items-center gap-4 px-6 py-4 transition-all duration-300 hover:bg-white/[0.02] rounded-xl group">
      <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04] transition duration-300 group-hover:scale-110 shadow-md" style={{ color }}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-extrabold tracking-wide text-white group-hover:text-white/90 transition" style={{ fontFamily: "var(--font-display)" }}>{name}</p>
        <p className="text-[10px] font-mono tracking-wide text-slate-500" style={{ color: `${color}cc` }}>{sub}</p>
      </div>
    </div>
  );
}

function StatCard({ n, suffix, label, source, color }: { n: number; suffix?: string; label: string; source?: string; color: string }) {
  const c = color === "oracle" ? "var(--oracle)" : color === "rawi" ? "var(--rawi)" : "var(--spark)";
  return (
    <div className="p-10 transition duration-300 hover:bg-white/[0.01]" style={{ background: "var(--background)" }}>
      <div className="text-4xl font-black md:text-5xl tracking-tight font-mono" style={{ color: c }}>
        <CountUp end={n} suffix={suffix ?? ""} />
      </div>
      <p className="mt-4 text-xs font-medium leading-relaxed text-slate-400">{label}</p>
      {source && <p className="mt-2 text-[10px] font-mono text-slate-600 uppercase tracking-wider">// Ref: {source}</p>}
    </div>
  );
}

function ToolCard({ to, icon, name, sub, color, cssColor, features }: { to: string; icon: React.ReactNode; name: string; sub: string; color: string; cssColor: string; features: string[] }) {
  return (
    <Link to={to as any} className={`glass relative group block rounded-2xl p-8 transition-all duration-500 hover:-translate-y-1.5 border border-white/[0.03] shadow-xl overflow-hidden`} style={{ boxShadow: `inset 0 0 40px ${cssColor}03` }}>
      {/* Background radial highlight triggered on card hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" style={{ background: `radial-gradient(circle at 10% 10%, ${cssColor}0b, transparent 50%)` }} />
      
      <div className="flex items-center gap-4 mb-6 relative z-10">
        <div className="grid h-12 w-12 place-items-center rounded-xl transition duration-500 group-hover:scale-110 border" style={{ background: `${cssColor}10`, borderColor: `${cssColor}25`, boxShadow: `0 0 20px ${cssColor}10` }}>
          <span style={{ color: cssColor }}>{icon}</span>
        </div>
        <div>
          <h3 className="text-lg font-bold text-white tracking-wide" style={{ fontFamily: "var(--font-display)" }}>{name}</h3>
          <p className="text-xs text-slate-500 font-medium">{sub}</p>
        </div>
      </div>
      
      <ul className="space-y-3 mb-8 relative z-10">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-3 text-xs font-medium text-slate-400 leading-normal group-hover:text-slate-300 transition">
            <span className="mt-2 h-1 w-2 flex-shrink-0 rounded-full transition-all duration-300 group-hover:w-3" style={{ background: cssColor }} />
            {f}
          </li>
        ))}
      </ul>
      
      <div className="inline-flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase font-mono border-b border-transparent group-hover:border-current transition duration-300" style={{ color: cssColor }}>
        INITIALIZE MODULE <ArrowRight className="h-3 w-3 transition duration-300 group-hover:translate-x-1" />
      </div>
    </Link>
  );
}

function Particles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden mix-blend-screen">
      {Array.from({ length: 40 }).map((_, i) => (
        <span key={i} className="absolute rounded-full opacity-40 animate-pulse" style={{
          left: `${(i * 53 + 7) % 100}%`,
          top: `${(i * 37 + 11) % 100}%`,
          width: i % 4 === 0 ? "2.5px" : "1.5px",
          height: i % 4 === 0 ? "2.5px" : "1.5px",
          background: i % 3 === 0 ? "rgba(0,212,255,0.7)" : i % 3 === 1 ? "rgba(212,168,67,0.6)" : "rgba(139,92,246,0.6)",
          animationDelay: `${(i * 0.4) % 4}s`,
          animationDuration: `${4 + (i % 4)}s`,
        }} />
      ))}
    </div>
  );
}

function sample(code: string) {
  const s: Record<string, string> = {
    en: "Discover photosynthesis through palm trees you already know.",
    ar: "اكتشف عملية البناء الضوئي من خلال نخيل تعرفه.",
    fr: "Découvre la photosynthèse à travers les arbres de ta région.",
    ur: "اپنے قریب موجود پودوں سے فوٹو سنتھیسس سیکھیں۔",
    es: "Descubre la fotosíntesis con las plantas de tu región.",
    sw: "Gundua usanisinuru kupitia mimea unayoijua.",
  };
  return s[code] ?? s.en;
}
