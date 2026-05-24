import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, Camera, Globe, Languages, BookOpen, ArrowRight } from "lucide-react";
import { CountUp } from "@/components/count-up";
import { SUBJECTS, LANGUAGES } from "@/lib/educis";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EDUCIS — Education in your world, your language" },
      {
        name: "description",
        content:
          "EDUCIS rewrites every lesson for your world — and finds lessons in every object around you. SPARK + RAWI, free for everyone.",
      },
      { property: "og:title", content: "EDUCIS — AI education in your culture" },
      { property: "og:description", content: "6 languages · 50 countries · 12 subjects · Free forever." },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="relative overflow-hidden">
      {/* Hero */}
      <section className="relative min-h-[90vh] overflow-hidden">
        <div className="absolute inset-0 mesh-spark opacity-80" />
        <FloatingParticles />
        <div className="relative mx-auto max-w-7xl px-6 pt-24 pb-32 text-center">
          <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-border bg-surface-1/60 px-4 py-1.5 text-xs text-muted-foreground backdrop-blur">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-spark" />
            Built for ELO 2026 — AI & Education
          </div>
          <h1
            className="mx-auto mt-8 max-w-5xl text-balance text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl animate-fade-up"
            style={{ animationDelay: "60ms" }}
          >
            Education has been speaking the{" "}
            <span className="text-gradient-brand italic">wrong language.</span>
          </h1>
          <p
            className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground animate-fade-up"
            style={{ animationDelay: "160ms" }}
          >
            EDUCIS rewrites every lesson for your world — and finds lessons in every object
            around you.
          </p>
          <div
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row animate-fade-up"
            style={{ animationDelay: "260ms" }}
          >
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
          <p
            className="mt-8 text-sm text-muted-foreground animate-fade-up"
            style={{ animationDelay: "360ms" }}
          >
            6 languages · 50 countries · Every subject · Free forever
          </p>

          {/* drifting lesson cards */}
          <div className="pointer-events-none absolute inset-0 -z-10">
            <DriftCard className="left-[6%] top-[28%]" delay="0s">
              <span className="text-xs text-muted-foreground">EN</span>
              <p className="mt-1 text-sm">Photosynthesis is how plants make food from sunlight.</p>
            </DriftCard>
            <DriftCard className="right-[8%] top-[20%]" delay="1.5s">
              <span className="text-xs text-muted-foreground">العربية</span>
              <p className="mt-1 text-sm text-right" dir="rtl">عملية البناء الضوئي في نخيل الأحساء…</p>
            </DriftCard>
            <DriftCard className="left-[12%] bottom-[12%]" delay="3s">
              <span className="text-xs text-muted-foreground">FR</span>
              <p className="mt-1 text-sm">La cellule, briques de la vie au Sénégal…</p>
            </DriftCard>
            <DriftCard className="right-[14%] bottom-[18%]" delay="4.5s">
              <span className="text-xs text-muted-foreground">اردو</span>
              <p className="mt-1 text-sm text-right" dir="rtl">پنجاب کے کھیتوں میں ریاضی…</p>
            </DriftCard>
          </div>
        </div>
      </section>

      {/* Crisis stats */}
      <section className="border-y border-border bg-surface-1/40 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-center text-sm font-medium uppercase tracking-widest text-muted-foreground">
            The education gap
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <StatCard
              number={758000000}
              label="adults who cannot read or write today"
              source="UNESCO 2024"
            />
            <StatCard number={1} suffix=" in 20" label="AI education tools that work in non-English languages" />
            <StatCard number={68} suffix="%" label="students who disengage when curriculum ignores their culture" />
          </div>
        </div>
      </section>

      {/* Split demo */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* SPARK */}
            <div className="glass relative overflow-hidden rounded-2xl p-8 mesh-spark card-hover">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-spark/20">
                  <Sparkles className="h-5 w-5 text-spark" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">SPARK</h3>
                  <p className="text-xs text-muted-foreground">Point at anything, learn everything</p>
                </div>
              </div>
              <p className="mt-4 text-muted-foreground">
                One photo of a coffee cup becomes lessons across every subject.
              </p>
              <div className="mt-6 grid grid-cols-3 gap-2">
                {["Chemistry", "Economics", "History", "Geography", "Biology", "Ethics"].map((s) => (
                  <div
                    key={s}
                    className="rounded-md border border-border bg-surface-2/60 px-2 py-2 text-center text-xs"
                  >
                    {s}
                  </div>
                ))}
              </div>
              <Link
                to="/spark"
                className="mt-6 inline-flex items-center gap-1 text-sm text-spark hover:underline"
              >
                Try SPARK <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* RAWI */}
            <div className="glass relative overflow-hidden rounded-2xl p-8 mesh-rawi card-hover">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-rawi/20">
                  <BookOpen className="h-5 w-5 text-rawi" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">RAWI</h3>
                  <p className="text-xs text-muted-foreground">Your world, your lesson</p>
                </div>
              </div>
              <p className="mt-4 text-muted-foreground">
                "Photosynthesis" becomes a story about a yam farmer in Oyo State, Nigeria.
              </p>
              <div className="mt-6 rounded-lg border border-rawi/20 bg-surface-2/60 p-4">
                <p className="font-serif italic text-rawi">
                  "Adaeze stepped between the yam mounds at dawn, watching the broad leaves drink
                  the first light…"
                </p>
              </div>
              <Link
                to="/rawi"
                className="mt-6 inline-flex items-center gap-1 text-sm text-rawi hover:underline"
              >
                Try RAWI <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-surface-1/40 border-y border-border">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-center text-3xl font-bold md:text-4xl">How it works</h2>
          <div className="mt-14 space-y-12">
            <FlowRow
              accent="spark"
              icon={<Camera className="h-4 w-4" />}
              title="SPARK"
              steps={[
                "Upload photo",
                "AI reads image",
                "Multi-subject lessons",
                "Practice questions",
                "Share or print",
              ]}
            />
            <FlowRow
              accent="rawi"
              icon={<Globe className="h-4 w-4" />}
              title="RAWI"
              steps={[
                "Enter concept",
                "Choose your world",
                "AI rewrites culturally",
                "Story + examples + problems",
                "In your language",
              ]}
            />
          </div>
        </div>
      </section>

      {/* Subjects */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-center text-3xl font-bold md:text-4xl">Twelve subjects. One spark.</h2>
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {SUBJECTS.map((s, i) => (
              <div
                key={s.name}
                className="glass card-hover relative overflow-hidden rounded-xl p-5 animate-fade-up"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div
                  className="absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-20 blur-2xl"
                  style={{ background: s.color }}
                />
                <div
                  className="grid h-9 w-9 place-items-center rounded-lg"
                  style={{ background: `${s.color}22`, color: s.color }}
                >
                  <Sparkles className="h-4 w-4" />
                </div>
                <p className="mt-3 text-sm font-medium">{s.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Languages */}
      <section className="py-24 bg-surface-1/40 border-y border-border">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-center text-3xl font-bold md:text-4xl">
            Real fluency in <span className="text-gradient-brand">six languages</span>
          </h2>
          <p className="mt-3 text-center text-muted-foreground">
            Including full RTL support for Arabic and Urdu.
          </p>
          <div className="mt-12 flex gap-6 overflow-x-auto pb-4">
            {LANGUAGES.map((l) => (
              <div
                key={l.code}
                className="glass min-w-[220px] flex-shrink-0 rounded-2xl p-4 card-hover"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{l.flag}</span>
                  <Languages className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="mt-2 text-sm font-medium">{l.name}</p>
                <div
                  className="mt-3 rounded-md border border-border bg-surface-2 p-3 text-xs text-muted-foreground"
                  dir={l.rtl ? "rtl" : "ltr"}
                >
                  {sampleByLang(l.code)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-center text-3xl font-bold md:text-4xl">From students like you</h2>
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="glass card-hover rounded-2xl p-6 animate-fade-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-spark to-rawi text-sm font-semibold text-white">
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {t.name} <span className="ml-1">{t.flag}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">{t.subject}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-foreground/90">"{t.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-4xl font-bold md:text-5xl">Start in 10 seconds.</h2>
          <p className="mt-4 text-muted-foreground">
            No signup. No paywall. Just learning that fits your life.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/spark" className="btn-spark inline-flex items-center gap-2 rounded-xl px-7 py-3.5 font-semibold">
              <Sparkles className="h-4 w-4" /> Try SPARK
            </Link>
            <Link to="/rawi" className="btn-rawi inline-flex items-center gap-2 rounded-xl px-7 py-3.5 font-semibold">
              ✦ Try RAWI
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

function FlowRow({
  accent,
  icon,
  title,
  steps,
}: {
  accent: "spark" | "rawi";
  icon: React.ReactNode;
  title: string;
  steps: string[];
}) {
  const color = accent === "spark" ? "text-spark" : "text-rawi";
  const bg = accent === "spark" ? "bg-spark/15" : "bg-rawi/15";
  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <span className={`grid h-7 w-7 place-items-center rounded-md ${bg} ${color}`}>{icon}</span>
        <h3 className={`text-lg font-semibold ${color}`}>{title}</h3>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
        {steps.map((s, i) => (
          <div key={i} className="glass rounded-xl p-4 text-sm">
            <div className="text-xs text-muted-foreground">Step {i + 1}</div>
            <div className="mt-1 font-medium">{s}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DriftCard({ children, className = "", delay = "0s" }: { children: React.ReactNode; className?: string; delay?: string }) {
  return (
    <div
      className={`glass animate-float absolute hidden w-56 rounded-xl p-3 shadow-2xl lg:block ${className}`}
      style={{ animationDelay: delay }}
    >
      {children}
    </div>
  );
}

function FloatingParticles() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10">
      {Array.from({ length: 20 }).map((_, i) => (
        <span
          key={i}
          className="absolute h-1 w-1 rounded-full bg-spark/40 animate-pulse-glow"
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

const testimonials = [
  { initials: "AM", name: "Amira", flag: "🇸🇦", subject: "Chemistry · SPARK", quote: "It explained electrolysis using the salt from our food. I finally understood." },
  { initials: "CO", name: "Chinedu", flag: "🇳🇬", subject: "Biology · RAWI", quote: "The lesson was about my grandfather's cassava farm. School never felt so close." },
  { initials: "FR", name: "Fatima", flag: "🇵🇰", subject: "Math · RAWI", quote: "Quadratic equations using my mother's tailoring shop measurements. Brilliant." },
  { initials: "LU", name: "Lucía", flag: "🇲🇽", subject: "History · SPARK", quote: "Pointed at a coin and learned 300 years of trade. Wild." },
  { initials: "JA", name: "Jamal", flag: "🇹🇿", subject: "Physics · RAWI", quote: "Newton's laws using a dala-dala bus in Dar. Way more memorable than the textbook." },
  { initials: "RA", name: "Rania", flag: "🇲🇦", subject: "Economics · SPARK", quote: "From a tea glass to the spice trade. My teacher asked where I learned that." },
];
