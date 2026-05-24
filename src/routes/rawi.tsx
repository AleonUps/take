import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Printer,
  Share2,
  RefreshCw,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { rawiGenerate, type RawiResult } from "@/lib/rawi.functions";
import { LANGUAGES, GRADES, COUNTRIES } from "@/lib/educis";

type RawiSearch = { concept?: string };

export const Route = createFileRoute("/rawi")({
  validateSearch: (search: Record<string, unknown>): RawiSearch => ({
    concept: typeof search.concept === "string" ? search.concept : undefined,
  }),
  head: () => ({
    meta: [
      { title: "RAWI — Your world, your lesson · EDUCIS" },
      {
        name: "description",
        content:
          "RAWI rewrites any concept as a story rooted in your country, your culture, and your language.",
      },
      { property: "og:title", content: "RAWI · EDUCIS" },
      { property: "og:description", content: "50 countries · 6 languages · Real local stories, not generic textbooks." },
    ],
  }),
  component: RawiPage,
});

const PLACEHOLDERS = [
  "photosynthesis…",
  "quadratic equations…",
  "the water cycle…",
  "the French Revolution…",
  "Newton's laws…",
  "supply and demand…",
];

function RawiPage() {
  const search = Route.useSearch();
  const rawiFn = useServerFn(rawiGenerate);

  const [concept, setConcept] = useState(search.concept ?? "");
  const [country, setCountry] = useState<string>("NG");
  const [grade, setGrade] = useState<"elementary" | "middle" | "high">("middle");
  const [lang, setLang] = useState<string>("en");
  const [includeHistory, setIncludeHistory] = useState(true);
  const [audio, setAudio] = useState(false);
  const [countryFilter, setCountryFilter] = useState("");
  const [phIdx, setPhIdx] = useState(0);
  const [showComparison, setShowComparison] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setPhIdx((i) => (i + 1) % PLACEHOLDERS.length), 2200);
    return () => clearInterval(t);
  }, []);

  const langInfo = LANGUAGES.find((l) => l.code === lang)!;
  const countryInfo = COUNTRIES.find((c) => c.code === country)!;

  const regions = useMemo(() => {
    const filtered = COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(countryFilter.toLowerCase()) ||
        c.region.toLowerCase().includes(countryFilter.toLowerCase()),
    );
    const grouped: Record<string, typeof COUNTRIES> = {};
    for (const c of filtered) (grouped[c.region] ??= []).push(c);
    return grouped;
  }, [countryFilter]);

  const mutation = useMutation<RawiResult>({
    mutationFn: async () => {
      if (!concept.trim()) throw new Error("Enter a concept to learn.");
      return (await rawiFn({
        data: {
          concept: concept.trim(),
          countryCode: country,
          countryName: countryInfo.name,
          grade,
          language: lang,
          languageName: langInfo.name,
          includeCulturalHistory: includeHistory,
          audioFriendly: audio,
        },
      })) as RawiResult;
    },
  });

  return (
    <div className="mesh-rawi min-h-screen" data-tool="rawi">
      <div className="mx-auto max-w-5xl px-4 py-12">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-rawi/40 bg-rawi/10 px-3 py-1 text-xs text-rawi">
            <Sparkles className="h-3 w-3" /> RAWI
          </div>
          <h1 className="mt-4 font-serif text-5xl font-semibold md:text-6xl">
            What are you <span className="text-gradient-rawi italic">learning</span> today?
          </h1>
        </div>

        {/* Input */}
        <div className="glass mt-10 rounded-2xl p-6 space-y-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              placeholder={PLACEHOLDERS[phIdx]}
              className="w-full rounded-xl border border-border bg-surface-2 py-4 pl-12 pr-4 text-lg focus:border-rawi focus:outline-none focus:ring-2 focus:ring-rawi/30"
            />
          </div>

          {/* Country */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Country / cultural world
              </p>
              <input
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                placeholder="Search…"
                className="rounded-md border border-border bg-surface-2 px-2 py-1 text-xs focus:border-rawi focus:outline-none"
              />
            </div>
            <div className="max-h-56 overflow-y-auto rounded-xl border border-border bg-surface-2/40 p-3 space-y-3">
              {Object.entries(regions).map(([region, list]) => (
                <div key={region}>
                  <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    {region}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {list.map((c) => (
                      <button
                        key={c.code}
                        onClick={() => setCountry(c.code)}
                        className={`rounded-md border px-2.5 py-1 text-xs transition-all ${
                          country === c.code
                            ? "border-rawi bg-rawi/15 text-rawi shadow-[0_0_18px_rgba(201,168,76,0.25)]"
                            : "border-border bg-surface-2 hover:border-rawi/40"
                        }`}
                      >
                        <span className="mr-1">{c.flag}</span>
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Grade cards */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Grade</p>
            <div className="grid gap-2 md:grid-cols-3">
              {GRADES.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setGrade(g.id as typeof grade)}
                  className={`rounded-xl border p-3 text-left transition-all ${
                    grade === g.id
                      ? "border-rawi bg-rawi/10 shadow-[0_0_20px_rgba(201,168,76,0.2)]"
                      : "border-border bg-surface-2/40 hover:border-rawi/40"
                  }`}
                >
                  <div className="text-sm font-semibold">{g.label}</div>
                  <div className="text-xs text-muted-foreground">{g.ages}</div>
                  <div className="mt-1.5 text-[11px] text-muted-foreground italic">"{g.desc}"</div>
                </button>
              ))}
            </div>
          </div>

          {/* Language + toggles */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Language</p>
              <div className="grid grid-cols-3 gap-1.5">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setLang(l.code)}
                    className={`rounded-md border px-2 py-1.5 text-xs ${
                      lang === l.code ? "border-rawi bg-rawi/10" : "border-border bg-surface-2/40"
                    }`}
                  >
                    <span className="mr-1">{l.flag}</span>
                    {l.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="flex cursor-pointer items-center justify-between rounded-lg border border-border bg-surface-2/40 px-3 py-2.5 text-sm">
                <span>Include cultural history connection</span>
                <input type="checkbox" checked={includeHistory} onChange={(e) => setIncludeHistory(e.target.checked)} className="accent-rawi" />
              </label>
              <label className="flex cursor-pointer items-center justify-between rounded-lg border border-border bg-surface-2/40 px-3 py-2.5 text-sm">
                <span>Audio-friendly version</span>
                <input type="checkbox" checked={audio} onChange={(e) => setAudio(e.target.checked)} className="accent-rawi" />
              </label>
            </div>
          </div>

          <button
            onClick={() => mutation.mutate()}
            disabled={!concept.trim() || mutation.isPending}
            className="btn-rawi w-full rounded-xl px-4 py-4 text-base font-semibold disabled:cursor-not-allowed disabled:opacity-50"
          >
            {mutation.isPending ? "Rewriting for your world…" : "✦ Rewrite for My World"}
          </button>
        </div>

        {/* Results */}
        <div className="mt-10">
          {mutation.isPending && <RawiLoading country={countryInfo.name} />}
          {mutation.isError && (
            <div className="glass rounded-2xl border border-destructive/40 p-6">
              <h3 className="font-semibold text-destructive">Something went wrong</h3>
              <p className="mt-2 text-sm text-muted-foreground">{(mutation.error as Error).message}</p>
              <button
                onClick={() => mutation.mutate()}
                className="mt-3 inline-flex items-center gap-1 rounded-md border border-border bg-surface-2 px-3 py-1.5 text-sm"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Retry
              </button>
            </div>
          )}
          {mutation.data && (
            <RawiResultView
              data={mutation.data}
              country={countryInfo}
              rtl={langInfo.rtl}
              showComparison={showComparison}
              onToggleComparison={() => setShowComparison((s) => !s)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function RawiLoading({ country }: { country: string }) {
  const msgs = useMemo(
    () => [
      `Walking through the markets of ${country}…`,
      `Listening to elders in ${country}…`,
      `Weaving the lesson into ${country}'s world…`,
      `Choosing the right local names…`,
      `Rewriting in your voice…`,
    ],
    [country],
  );
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % msgs.length), 1500);
    return () => clearInterval(t);
  }, [msgs.length]);
  return (
    <div className="glass rounded-2xl p-10 text-center">
      <div className="mx-auto h-16 w-16 animate-pulse-glow rounded-full bg-gradient-to-br from-rawi to-rawi/40" />
      <p className="mt-6 font-serif text-xl text-rawi italic">{msgs[i]}</p>
      <div className="mx-auto mt-6 h-1 w-64 overflow-hidden rounded-full bg-surface-2">
        <div className="h-full w-1/2 animate-pulse-glow bg-gradient-to-r from-rawi to-rawi/30" />
      </div>
    </div>
  );
}

function RawiResultView({
  data,
  country,
  rtl,
  showComparison,
  onToggleComparison,
}: {
  data: RawiResult;
  country: { name: string; flag: string };
  rtl: boolean;
  showComparison: boolean;
  onToggleComparison: () => void;
}) {
  return (
    <article dir={rtl ? "rtl" : "ltr"} className="space-y-8">
      {/* Header */}
      <header className="glass border-gradient-brand rounded-2xl p-8 animate-fade-up">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1 rounded-full border border-rawi/30 bg-rawi/10 px-2 py-0.5 text-rawi">
            {country.flag} {country.name}
          </span>
          <span>{data.readingTimeMinutes} min read</span>
        </div>
        <h1 className="mt-3 font-serif text-4xl font-semibold md:text-5xl">{data.conceptTitle}</h1>
        <p className="mt-4 font-serif text-lg italic text-rawi">"{data.culturalHook}"</p>
        <div className="no-print mt-5 flex flex-wrap gap-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface-2 px-3 py-1.5 text-xs hover:bg-surface-2/70"
          >
            <Printer className="h-3 w-3" /> Print
          </button>
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert("Link copied!");
            }}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface-2 px-3 py-1.5 text-xs hover:bg-surface-2/70"
          >
            <Share2 className="h-3 w-3" /> Share
          </button>
        </div>
      </header>

      {/* Story */}
      <section className="glass rounded-2xl p-8 space-y-5">
        {data.storyLesson.split(/\n\n+/).map((p, i) => {
          const isPullQuoteHere = i === Math.floor(data.storyLesson.split(/\n\n+/).length / 2);
          return (
            <div key={i} className="animate-fade-up" style={{ animationDelay: `${i * 100}ms` }}>
              <p className="font-serif text-lg leading-relaxed text-foreground/90">{p}</p>
              {isPullQuoteHere && data.pullQuote && (
                <blockquote className="my-6 border-l-4 border-rawi pl-5 font-serif text-2xl italic text-rawi">
                  "{data.pullQuote}"
                </blockquote>
              )}
            </div>
          );
        })}
      </section>

      {/* Examples */}
      <section>
        <h2 className="text-2xl font-semibold">In your world</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {data.examples.map((ex, i) => (
            <div
              key={i}
              className="glass card-hover relative overflow-hidden rounded-xl p-5 animate-fade-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="absolute right-3 top-3 text-2xl opacity-60">{country.flag}</div>
              <h3 className="text-base font-semibold text-rawi">{ex.title}</h3>
              <p className="mt-2 text-sm text-foreground/85">{ex.explanation}</p>
              <p className="mt-3 rounded-md bg-surface-2/60 px-3 py-2 text-xs text-muted-foreground italic">
                {ex.localContext}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Key concepts + cultural connection */}
      <section className="grid gap-4 md:grid-cols-2">
        <div className="glass rounded-2xl p-6">
          <h3 className="text-lg font-semibold">Key concepts</h3>
          <ul className="mt-3 space-y-2">
            {data.keyConcepts.map((k, i) => (
              <li key={i} className="flex gap-2 text-sm">
                <span className="text-rawi">—</span>
                <span>{k}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="glass rounded-2xl border-l-4 border-rawi p-6">
          <h3 className="text-lg font-semibold text-rawi">Cultural connection</h3>
          <p className="mt-3 text-sm leading-relaxed text-foreground/85">{data.culturalConnection}</p>
        </div>
      </section>

      {/* Practice */}
      <section>
        <h2 className="text-2xl font-semibold">Practice problems</h2>
        <div className="mt-4 space-y-3">
          {data.practiceProblems.map((p, i) => (
            <details key={i} className="glass group rounded-xl p-5">
              <summary className="cursor-pointer text-base font-medium">
                <span className="mr-2 text-rawi">Problem {i + 1}.</span>
                {p.question}
              </summary>
              <div className="mt-3 space-y-2 text-sm">
                <p className="text-muted-foreground"><span className="font-semibold">Hint:</span> {p.hint}</p>
                <p><span className="font-semibold text-rawi">Answer:</span> {p.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Comparison */}
      <section className="no-print">
        <button
          onClick={onToggleComparison}
          className="flex w-full items-center justify-between glass rounded-xl px-5 py-4 text-left"
        >
          <span className="text-sm font-medium">
            Compare: textbook version vs. RAWI version
          </span>
          <ChevronDown className={`h-4 w-4 transition-transform ${showComparison ? "rotate-180" : ""}`} />
        </button>
        {showComparison && (
          <div className="mt-3 grid gap-3 md:grid-cols-2 animate-fade-up">
            <div className="glass rounded-xl p-5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Generic textbook
              </p>
              <p className="text-sm text-foreground/80">{data.genericVersion}</p>
            </div>
            <div className="glass rounded-xl border border-rawi/40 p-5">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-rawi">RAWI in {country.name}</p>
              <p className="font-serif text-sm italic text-foreground/90">"{data.culturalHook}"</p>
            </div>
          </div>
        )}
      </section>
    </article>
  );
}
