import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, BookOpen } from "lucide-react";
import { COUNTRIES, SUBJECTS } from "@/lib/educis";

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: [
      { title: "Explore — Sample SPARK & RAWI sessions · EDUCIS" },
      { name: "description", content: "Browse curated examples of EDUCIS across subjects and countries." },
      { property: "og:title", content: "Explore EDUCIS examples" },
      { property: "og:description", content: "See SPARK and RAWI in action across 50 countries." },
    ],
  }),
  component: ExplorePage,
});

const SPARK_EXAMPLES = [
  { object: "Coffee cup", subjects: ["Chemistry", "Economics", "History", "Geography", "Biology", "Ethics"] },
  { object: "Medicine bottle", subjects: ["Chemistry", "Biology", "Ethics", "Economics", "Media Literacy"] },
  { object: "Wheat field", subjects: ["Biology", "History", "Economics", "Geography", "Chemistry", "Environmental Science", "Cultural Studies"] },
  { object: "Circuit board", subjects: ["Physics", "Chemistry", "Economics", "Ethics", "Media Literacy"] },
];

const RAWI_EXAMPLES = [
  { concept: "Photosynthesis", country: "Saudi Arabia", flag: "🇸🇦", hook: "Under the date palms of Al-Ahsa, sunlight becomes sugar." },
  { concept: "Quadratic equations", country: "Nigeria", flag: "🇳🇬", hook: "Adaeze counts yam mounds in a perfect square." },
  { concept: "Water cycle", country: "Bangladesh", flag: "🇧🇩", hook: "The monsoon writes its name on the Padma every year." },
  { concept: "French Revolution", country: "Mexico", flag: "🇲🇽", hook: "Long before the Zócalo crowds, Paris learned the price of bread." },
];

function ExplorePage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="text-4xl font-bold md:text-5xl">Explore EDUCIS</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Curated examples showing the platform across subjects, languages, and countries.
      </p>

      {/* SPARK */}
      <section className="mt-14">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-spark" />
          <h2 className="text-2xl font-semibold">SPARK gallery</h2>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {SPARK_EXAMPLES.map((ex) => (
            <Link
              key={ex.object}
              to="/spark"
              className="glass card-hover rounded-2xl p-6 mesh-spark"
            >
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Object</p>
              <h3 className="text-xl font-semibold">{ex.object}</h3>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {ex.subjects.map((s) => (
                  <span key={s} className="rounded-full border border-spark/30 bg-spark/10 px-2 py-0.5 text-xs text-spark">
                    {s}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* RAWI */}
      <section className="mt-14">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-rawi" />
          <h2 className="text-2xl font-semibold">RAWI gallery</h2>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {RAWI_EXAMPLES.map((ex) => (
            <Link
              key={ex.concept + ex.country}
              to="/rawi"
              search={{ concept: ex.concept } as never}
              className="glass card-hover rounded-2xl p-6 mesh-rawi"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-muted-foreground">{ex.concept}</span>
                <span className="text-xs">{ex.flag} {ex.country}</span>
              </div>
              <p className="mt-3 font-serif text-lg italic text-rawi">"{ex.hook}"</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Subject map */}
      <section className="mt-14">
        <h2 className="text-2xl font-semibold">Subject map</h2>
        <p className="text-sm text-muted-foreground">Pick a subject — see what real-world objects light it up.</p>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {SUBJECTS.map((s) => (
            <Link
              key={s.name}
              to="/spark"
              className="glass card-hover rounded-xl p-4 text-sm"
              style={{ borderTop: `2px solid ${s.color}` }}
            >
              <p className="font-medium">{s.name}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Country map */}
      <section className="mt-14">
        <h2 className="text-2xl font-semibold">Country map</h2>
        <p className="text-sm text-muted-foreground">Pick a country — see lessons rewritten for that world.</p>
        <div className="mt-6 flex flex-wrap gap-1.5">
          {COUNTRIES.map((c) => (
            <Link
              key={c.code}
              to="/rawi"
              className="rounded-md border border-border bg-surface-2/50 px-2.5 py-1 text-xs hover:border-rawi/50 hover:bg-rawi/10"
            >
              <span className="mr-1">{c.flag}</span>
              {c.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
