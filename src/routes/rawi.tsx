import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import { rawiGenerate, type RawiResult } from "@/lib/rawi.functions";
import { LANGUAGES, GRADES, COUNTRIES } from "@/lib/educis";
import { VoiceInput } from "@/components/voice-input";
import { RawiResultView } from "@/components/rawi-result-view";

type RawiSearch = {
  concept?: string;
  grade?: "elementary" | "middle" | "high";
  lang?: string;
  fromObject?: string;
  fromSubject?: string;
};

export const Route = createFileRoute("/rawi")({
  validateSearch: (search: Record<string, unknown>): RawiSearch => ({
    concept: typeof search.concept === "string" ? search.concept : undefined,
    grade:
      search.grade === "elementary" || search.grade === "middle" || search.grade === "high"
        ? search.grade
        : undefined,
    lang: typeof search.lang === "string" ? search.lang : undefined,
    fromObject: typeof search.fromObject === "string" ? search.fromObject : undefined,
    fromSubject: typeof search.fromSubject === "string" ? search.fromSubject : undefined,
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
  const [grade, setGrade] = useState<"elementary" | "middle" | "high">(search.grade ?? "middle");
  const [lang, setLang] = useState<string>(search.lang ?? "en");
  const [includeHistory, setIncludeHistory] = useState(true);
  const [audio, setAudio] = useState(false);
  const [countryFilter, setCountryFilter] = useState("");
  const [phIdx, setPhIdx] = useState(0);

  const [result, setResult] = useState<RawiResult | null>(null);
  const [adjustedDirection, setAdjustedDirection] = useState<"simpler" | "harder" | null>(null);

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

  const mutation = useMutation<RawiResult, Error, { adjust?: "simpler" | "harder" } | undefined>({
    mutationFn: async (opts) => {
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
          difficultyAdjust: opts?.adjust,
        },
      })) as RawiResult;
    },
    onSuccess: (data, opts) => {
      if (opts?.adjust && result) {
        // Merge only story + practice
        setResult({
          ...result,
          storyLesson: data.storyLesson,
          practiceProblems: data.practiceProblems,
        });
        setAdjustedDirection(opts.adjust);
      } else {
        setResult(data);
        setAdjustedDirection(null);
      }
    },
  });

  const isInitialPending = mutation.isPending && !mutation.variables?.adjust;
  const isAdjusting = mutation.isPending && !!mutation.variables?.adjust;

  return (
    <div className="mesh-rawi min-h-screen" data-tool="rawi">
      <div className="mx-auto max-w-5xl px-4 py-12">
        {/* SPARK pipeline banner */}
        {search.fromObject && (
          <div className="mb-6 flex items-center justify-between rounded-xl border border-spark/40 bg-spark/10 px-4 py-3 text-sm animate-fade-up">
            <div className="flex items-center gap-3">
              <span className="rounded-full border border-spark/40 bg-spark/15 px-2.5 py-0.5 text-xs font-medium text-spark">
                ✦ From SPARK
              </span>
              <span className="text-foreground/85">
                <strong className="text-spark">{search.fromObject}</strong>
                {search.fromSubject && (
                  <>
                    {" → "}
                    <span className="text-foreground">{search.fromSubject}</span>
                  </>
                )}
              </span>
            </div>
            <Link
              to="/spark"
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-3 w-3" /> Back to SPARK
            </Link>
          </div>
        )}

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
          <div className="flex items-stretch gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                value={concept}
                onChange={(e) => setConcept(e.target.value)}
                placeholder={PLACEHOLDERS[phIdx]}
                className="w-full rounded-xl border border-border bg-surface-2 py-4 pl-12 pr-4 text-lg focus:border-rawi focus:outline-none focus:ring-2 focus:ring-rawi/30"
              />
            </div>
            <VoiceInput language={lang} onTranscript={setConcept} />
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
            onClick={() => mutation.mutate(undefined)}
            disabled={!concept.trim() || mutation.isPending}
            className="btn-rawi w-full rounded-xl px-4 py-4 text-base font-semibold disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isInitialPending ? "Rewriting for your world…" : "✦ Rewrite for My World"}
          </button>
        </div>

        {/* Results */}
        <div className="mt-10">
          {isInitialPending && <RawiLoading country={countryInfo.name} />}
          {mutation.isError && (
            <div className="glass rounded-2xl border border-destructive/40 p-6">
              <h3 className="font-semibold text-destructive">Something went wrong</h3>
              <p className="mt-2 text-sm text-muted-foreground">{(mutation.error as Error).message}</p>
              <button
                onClick={() => mutation.mutate(undefined)}
                className="mt-3 inline-flex items-center gap-1 rounded-md border border-border bg-surface-2 px-3 py-1.5 text-sm"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Retry
              </button>
            </div>
          )}
          {result && !isInitialPending && (
            <RawiResultView
              data={result}
              country={countryInfo}
              rtl={langInfo.rtl}
              onAdjustDifficulty={(dir) => mutation.mutate({ adjust: dir })}
              adjusting={isAdjusting}
              adjustedDirection={adjustedDirection}
              saveMeta={{ grade, language: lang, languageName: langInfo.name }}
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
