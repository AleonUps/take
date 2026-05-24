import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, BookOpen, Globe2, Languages, Infinity as InfinityIcon, QrCode } from "lucide-react";
import { CountUp } from "@/components/count-up";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — EDUCIS" },
      { name: "description", content: "We built EDUCIS because education forgot where most of the world lives." },
      { property: "og:title", content: "About EDUCIS" },
      { property: "og:description", content: "The story behind SPARK and RAWI — built for ELO 2026." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      {/* Hero */}
      <section className="text-center">
        <h1 className="text-balance text-4xl font-bold leading-tight md:text-6xl">
          We built EDUCIS because education{" "}
          <span className="text-gradient-brand">forgot where most of the world lives.</span>
        </h1>
      </section>

      {/* Problem panels */}
      <section className="mt-20">
        <h2 className="text-2xl font-semibold">The problem</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            { t: "The textbook gap", b: "\"Johnny buys 5 apples\" — a student in Riyadh wonders who Johnny is and why apples cost dollars." },
            { t: "The hardware gap", b: "Most AI tutors need fast WiFi and the latest phone. A student in rural Kenya is locked out by default." },
            { t: "The history gap", b: "Curricula often teach history from a single perspective. Four billion students see themselves erased from the page." },
          ].map((x) => (
            <div key={x.t} className="glass rounded-2xl p-6">
              <h3 className="font-semibold">{x.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{x.b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tools */}
      <section className="mt-20 grid gap-6 md:grid-cols-2">
        <div className="glass mesh-spark rounded-2xl p-8">
          <Sparkles className="h-6 w-6 text-spark" />
          <h3 className="mt-3 text-2xl font-semibold">SPARK</h3>
          <p className="mt-2 text-sm text-muted-foreground">Point at anything, learn everything.</p>
          <ul className="mt-4 space-y-2 text-sm text-foreground/85">
            <li>— Vision AI identifies any object you photograph</li>
            <li>— Generates 4–7 lessons across subjects in one pass</li>
            <li>— Adapts to grade level and language</li>
            <li>— Practice questions and "go deeper" links</li>
          </ul>
        </div>
        <div className="glass mesh-rawi rounded-2xl p-8">
          <BookOpen className="h-6 w-6 text-rawi" />
          <h3 className="mt-3 font-serif text-2xl font-semibold">RAWI</h3>
          <p className="mt-2 text-sm text-muted-foreground">Your world, your lesson.</p>
          <ul className="mt-4 space-y-2 text-sm text-foreground/85">
            <li>— Any concept, rewritten for your country</li>
            <li>— Real local names, foods, places, currency</li>
            <li>— Cultural and historical connections</li>
            <li>— 50 countries · 6 languages · Full RTL</li>
          </ul>
        </div>
      </section>

      {/* Impact */}
      <section className="mt-20">
        <h2 className="text-2xl font-semibold">Impact</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { n: 50, l: "Countries", I: Globe2 },
            { n: 6, l: "Languages", I: Languages },
            { n: 12, l: "Subjects", I: Sparkles },
            { n: 0, l: "Cost", suffix: " ∞", I: InfinityIcon },
          ].map((s) => (
            <div key={s.l} className="glass rounded-2xl p-6 text-center">
              <s.I className="mx-auto h-5 w-5 text-rawi" />
              <div className="mt-3 text-4xl font-bold text-gradient-brand">
                {s.n === 0 ? "Free" : <CountUp end={s.n} suffix={s.suffix ?? ""} />}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="mt-20">
        <h2 className="text-2xl font-semibold">Team</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass card-hover rounded-2xl p-6 text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-spark to-rawi text-lg font-semibold text-white">
                TM{i + 1}
              </div>
              <p className="mt-3 font-semibold">Team Member {i + 1}</p>
              <p className="text-xs text-muted-foreground">Role title</p>
              <p className="mt-2 text-xs text-muted-foreground">Short bio placeholder.</p>
            </div>
          ))}
        </div>
      </section>

      {/* Community */}
      <section className="mt-20">
        <h2 className="text-2xl font-semibold">Community testing</h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass rounded-xl p-3">
              <div className="aspect-[4/3] rounded-lg bg-gradient-to-br from-spark/20 to-rawi/20 grid place-items-center text-xs text-muted-foreground">
                Workshop Photo {i + 1}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Caption placeholder.</p>
            </div>
          ))}
        </div>
      </section>

      {/* QR */}
      <section className="mt-20">
        <div className="glass mx-auto max-w-xl rounded-2xl p-10 text-center border-gradient-brand">
          <div className="mx-auto grid h-40 w-40 place-items-center rounded-xl border border-border bg-surface-2">
            <QrCode className="h-24 w-24 text-foreground" />
          </div>
          <p className="mt-4 text-lg font-semibold">Scan to try EDUCIS live</p>
          <p className="mt-1 text-xs text-muted-foreground">educis.lovable.app</p>
        </div>
      </section>
    </div>
  );
}
