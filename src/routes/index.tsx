import { createFileRoute, Link } from "@tanstack/react-router";
import { Eye, Sparkles, Camera, Globe, Languages, BookOpen, ArrowRight } from "lucide-react";
import { CountUp } from "@/components/count-up";
import { SUBJECTS, LANGUAGES } from "@/lib/educis";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EDUCIS — Know yourself, learn your way" },
      {
        name: "description",
        content:
          "0RACLE learns who you are. RAWI builds your curriculum. SPARK connects everything to the real world. Education in your culture, your language.",
      },
      { property: "og:title", content: "EDUCIS — AI education pipeline for your world" },
      { property: "og:description", content: "0RACLE → RAWI → SPARK · 6 languages · 50 countries · Free forever." },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="relative overflow-hidden">
      {/* Hero */}
      <section className="relative min-h-[90vh] overflow-hidden">
        <div className="absolute inset-0 mesh-oracle opacity-80" />
        <FloatingParticles />
        <div className="relative mx-auto max-w-7xl px-6 pt-24 pb-32 text-center">
          <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-oracle/30 bg-oracle/10 px-4 py-1.5 text-xs text-oracle backdrop-blur">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-oracle" />
            Built for ELO 2026 — AI & Education
          </div>
          <h1
            className="mx-auto mt-8 max-w-5xl text-balance text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl animate-fade-up"
            style={{ animationDelay: "60ms" }}
          >
            Know yourself. Learn{" "}
            <span className="text-gradient-oracle italic">your way.</span>
          </h1>
          <p
            className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground animate-fade-up"
            style={{ animationDelay: "160ms" }}
          >
            0RACLE discovers who you are. RAWI builds your curriculum. SPARK connects it to the world around you.
          </p>

          {/* Pipeline Flow */}
          <div
            className="mt-12 flex flex-col items-center justify-center gap-4 animate-fade-up"
            style={{ animationDelay: "260ms" }}
          >
            <div className="flex items-center gap-3 glass rounded-2xl p-6">
              <PipelineStep icon={<Eye className="h-5 w-5" />} label="0RACLE" desc="Know yourself" accent="oracle" />
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
              <PipelineStep icon={<BookOpen className="h-5 w-5" />} label="RAWI" desc="Your curriculum" accent="rawi" />
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
              <PipelineStep icon={<Camera className="h-5 w-5" />} label="SPARK" desc="See the world" accent="spark" />
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row animate-fade-up" style={{ animationDelay: "360ms" }}>
            <Link
              to="/oracle"
              className="btn-oracle inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-base font-semibold"
            >
              <Eye className="h-4 w-4" /> Start with 0RACLE
            </Link>
            <Link
              to="/spark"
              className="btn-spark inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-base font-semibold"
            >
              <Sparkles className="h-4 w-4" /> Try SPARK
            </Link>
            <Link
              to="/rawi"
              className="btn-rawi inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-base font-semibold"
            >
              <span className="font-serif italic">✦</span> Try RAWI
            </Link>
          </div>
          <p className="mt-8 text-sm text-muted-foreground animate-fade-up" style={{ animationDelay: "460ms" }}>
            6 languages · 50 countries · Every subject · Free forever
          </p>
        </div>
      </section>

      {/* Crisis stats */}
      <section className="border-y border-border bg-surface-1/40 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-center text-sm font-medium uppercase tracking-widest text-muted-foreground">
            The education gap
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <StatCard number={758000000} label="adults who cannot read or write today" source="UNESCO 2024" />
            <StatCard number={1} suffix=" in 20" label="AI education tools that work in non-English languages" />
            <StatCard number={68} suffix="%" label="students who disengage when curriculum ignores their culture" />
          </div>
        </div>
      </section>

      {/* Pipeline breakdown */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-center text-3xl font-bold md:text-4xl">
            Three tools. <span className="text-gradient-oracle">One pipeline.</span>
          </h2>
          <p className="mt-3 text-center text-muted-foreground">0RACLE discovers you. RAWI localizes everything. SPARK connects the world.</p>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            <ToolCard
              icon={<Eye className="h-6 w-6" />}
              name="0RACLE"
              desc="Know yourself, find your path"
              accent="oracle"
              features={["15-exchange deep conversation", "Personal identity report", "Custom curriculum path", "Seamless handoff to RAWI"]}
              link="/oracle"
            />
            <ToolCard
              icon={<BookOpen className="h-6 w-6" />}
              name="RAWI"
              desc="Your world, your lesson"
              accent="rawi"
              features={["Culturally localized courses", "Real YouTube videos per lesson", "Free courses from top platforms", "Track progress at your pace"]}
              link="/rawi"
            />
            <ToolCard
              icon={<Camera className="h-6 w-6" />}
              name="SPARK"
              desc="Point at anything, learn everything"
              accent="spark"
              features={["Photo → multi-subject lessons", "Connects to your curriculum", "Local examples from your country", "Cross-tool pipeline with RAWI"]}
              link="/spark"
            />
          </div>
        </div>
      </section>

      {/* Languages */}
      <section className="py-24 bg-surface-1/40 border-y border-border">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-center text-3xl font-bold md:text-4xl">
            Real fluency in <span className="text-gradient-brand">six languages</span>
          </h2>
          <p className="mt-3 text-center text-muted-foreground">Including full RTL support for Arabic and Urdu.</p>
          <div className="mt-12 flex gap-6 overflow-x-auto pb-4">
            {LANGUAGES.map((l) => (
              <div key={l.code} className="glass min-w-[220px] flex-shrink-0 rounded-2xl p-4 card-hover">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{l.flag}</span>
                  <Languages className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="mt-2 text-sm font-medium">{l.name}</p>
                <div className="mt-3 rounded-md border border-border bg-surface-2 p-3 text-xs text-muted-foreground" dir={l.rtl ? "rtl" : "ltr"}>
                  {sampleByLang(l.code)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-4xl font-bold md:text-5xl">Start in 10 seconds.</h2>
          <p className="mt-4 text-muted-foreground">No signup. No paywall. Just learning that fits your life.</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/oracle" className="btn-oracle inline-flex items-center gap-2 rounded-xl px-7 py-3.5 font-semibold">
              <Eye className="h-4 w-4" /> Start with 0RACLE
            </Link>
            <Link to="/spark" className="btn-spark inline-flex items-center gap-2 rounded-xl px-7 py-3.5 font-semibold">
              <Sparkles className="h-4 w-4" /> Try SPARK
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({ number, suffix, label, source }: { number: number; suffix?: string; label: string; source?: string }) {
  return (
    <div className="glass card-hover rounded-2xl p-8">
      <div className="text-5xl font-bold tracking-tight text-gradient-brand md:text-6xl">
        <CountUp end={number} suffix={suffix ?? ""} />
      </div>
      <p className="mt-4 text-sm text-foreground/80">{label}</p>
      {source && <p className="mt-2 text-xs text-muted-foreground">{source}</p>}
    </div>
  );
}

function PipelineStep({ icon, label, desc, accent }: { icon: React.ReactNode; label: string; desc: string; accent: string }) {
  const colorMap: Record<string, string> = { oracle: "text-oracle", rawi: "text-rawi", spark: "text-spark" };
  const bgMap: Record<string, string> = { oracle: "bg-oracle/15", rawi: "bg-rawi/15", spark: "bg-spark/15" };
  const borderMap: Record<string, string> = { oracle: "border-oracle/30", rawi: "border-rawi/30", spark: "border-spark/30" };
  return (
    <div className={`flex items-center gap-3 rounded-xl ${bgMap[accent]} ${borderMap[accent]} border px-5 py-3`}>
      <span className={colorMap[accent]}>{icon}</span>
      <div className="text-left">
        <p className={`text-sm font-bold ${colorMap[accent]}`}>{label}</p>
        <p className="text-[10px] text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}

function ToolCard({ icon, name, desc, accent, features, link }: { icon: React.ReactNode; name: string; desc: string; accent: string; features: string[]; link: string }) {
  const colorMap: Record<string, string> = { oracle: "text-oracle", rawi: "text-rawi", spark: "text-spark" };
  const bgMap: Record<string, string> = { oracle: "bg-oracle/15", rawi: "bg-rawi/15", spark: "bg-spark/15" };
  const borderMap: Record<string, string> = { oracle: "border-oracle/30", rawi: "border-rawi/30", spark: "border-spark/30" };
  const meshMap: Record<string, string> = { oracle: "mesh-oracle", rawi: "mesh-rawi", spark: "mesh-spark" };
  return (
    <Link to={link} className={`glass ${meshMap[accent]} card-hover rounded-2xl p-8`}>
      <div className="flex items-center gap-3">
        <div className={`grid h-10 w-10 place-items-center rounded-lg ${bgMap[accent]} ${borderMap[accent]} border ${colorMap[accent]}`}>
          {icon}
        </div>
        <div>
          <h3 className={`text-xl font-semibold ${colorMap[accent]}`}>{name}</h3>
          <p className="text-xs text-muted-foreground">{desc}</p>
        </div>
      </div>
      <ul className="mt-5 space-y-2">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-foreground/80">
            <span className={`mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0 ${bgMap[accent]}`} />
            {f}
          </li>
        ))}
      </ul>
      <div className={`mt-5 inline-flex items-center gap-1 text-sm ${colorMap[accent]} hover:underline`}>
        Try {name} <ArrowRight className="h-3.5 w-3.5" />
      </div>
    </Link>
  );
}

function FloatingParticles() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10">
      {Array.from({ length: 20 }).map((_, i) => (
        <span
          key={i}
          className="absolute h-1 w-1 rounded-full bg-oracle/40 animate-pulse-glow"
          style={{
            left: `${(i * 53) % 100}%`,
            top: `${(i * 37) % 100}%`,
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
    fr: "Découvre la photosynthèse à travers les arbres de ta région.",
    ur: "اپنے قریب موجود پودوں سے فوٹو سنتھیسس سیکھیں۔",
    es: "Descubre la fotosíntesis con las plantas de tu región.",
    sw: "Gundua usanisinuru kupitia mimea unayoijua.",
  };
  return samples[code] ?? samples.en;
}
