import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  RefreshCw,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Circle,
  ExternalLink,
  BookOpen,
  Trophy,
} from "lucide-react";
import { rawiGenerate, type RawiResult } from "@/lib/rawi.functions";
import { generateCurriculumLesson, type CurriculumLesson } from "@/lib/curriculum.functions";
import { searchYouTube, type YouTubeResult } from "@/lib/youtube.server";
import { LANGUAGES, GRADES, COUNTRIES } from "@/lib/educis";
import { VoiceInput } from "@/components/voice-input";
import { RawiResultView } from "@/components/rawi-result-view";
import { saveCurriculum, toggleTopicComplete, getCurriculum, type CurriculumSubject } from "@/lib/curriculum";

type RawiSearch = {
  concept?: string;
  grade?: "elementary" | "middle" | "high";
  lang?: string;
  fromObject?: string;
  fromSubject?: string;
  fromOracle?: string;
  career?: string;
  countryCode?: string;
  countryName?: string;
  langName?: string;
  style?: string;
  subjects?: string;
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
    fromOracle: typeof search.fromOracle === "string" ? search.fromOracle : undefined,
    career: typeof search.career === "string" ? search.career : undefined,
    countryCode: typeof search.countryCode === "string" ? search.countryCode : undefined,
    countryName: typeof search.countryName === "string" ? search.countryName : undefined,
    langName: typeof search.langName === "string" ? search.langName : undefined,
    style: typeof search.style === "string" ? search.style : undefined,
    subjects: typeof search.subjects === "string" ? search.subjects : undefined,
  }),
  head: () => ({
    meta: [
      { title: "RAWI -- Your world, your lesson · EDUCIS" },
      { name: "description", content: "RAWI rewrites any concept as a story rooted in your country, your culture, and your language." },
      { property: "og:title", content: "RAWI · EDUCIS" },
      { property: "og:description", content: "50 countries · 6 languages · Real local stories, not generic textbooks." },
    ],
  }),
  component: RawiPage,
});

const PLACEHOLDERS = [
  "photosynthesis...",
  "quadratic equations...",
  "the water cycle...",
  "the French Revolution...",
  "Newton's laws...",
  "supply and demand...",
];

function RawiPage() {
  const search = Route.useSearch();
  const rawiFn = useServerFn(rawiGenerate);
  const curriculumFn = useServerFn(generateCurriculumLesson);
  const ytFn = useServerFn(searchYouTube);

  const [concept, setConcept] = useState(search.concept ?? "");
  const [country, setCountry] = useState<string>(search.countryCode ?? "SA");
  const [grade, setGrade] = useState<"elementary" | "middle" | "high">(search.grade ?? "middle");
  const [lang, setLang] = useState<string>(search.lang ?? "en");
  const [includeHistory, setIncludeHistory] = useState(true);
  const [audio, setAudio] = useState(false);
  const [countryFilter, setCountryFilter] = useState("");
  const [phIdx, setPhIdx] = useState(0);

  const [result, setResult] = useState<RawiResult | null>(null);
  const [adjustedDirection, setAdjustedDirection] = useState<"simpler" | "harder" | null>(null);
  const [curriculumLessons, setCurriculumLessons] = useState<Map<string, CurriculumLesson>>(new Map());
  const [curriculumSubjects, setCurriculumSubjects] = useState<CurriculumSubject[]>([]);
  const [activeSubject, setActiveSubject] = useState<string | null>(null);
  const [videoCache, setVideoCache] = useState<Map<string, YouTubeResult[]>>(new Map());
  const [completedTopics, setCompletedTopics] = useState<Set<string>>(new Set());

  const autoStarted = useRef(false);

  const isOracleMode = search.fromOracle === "true" && !!search.career;
  const oracleCareer = search.career ?? "";
  const oracleSubjects = search.subjects?.split(",").filter(Boolean) ?? [];

  useEffect(() => {
    const t = setInterval(() => setPhIdx((i) => (i + 1) % PLACEHOLDERS.length), 2200);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const saved = getCurriculum();
    if (saved) {
      setCurriculumSubjects(saved.curriculum);
      const completed = new Set<string>();
      saved.curriculum.forEach((s) =>
        s.topics.forEach((t) => { if (t.completed) completed.add(t.id); })
      );
      setCompletedTopics(completed);
    }
  }, []);

  const langInfo = LANGUAGES.find((l) => l.code === lang)!;
  const countryInfo = COUNTRIES.find((c) => c.code === country) ?? COUNTRIES.find((c) => c.code === "SA")!;

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
        setResult({ ...result, storyLesson: data.storyLesson, practiceProblems: data.practiceProblems });
        setAdjustedDirection(opts.adjust);
      } else {
        setResult(data);
        setAdjustedDirection(null);
      }
    },
  });

  const curriculumMutation = useMutation<CurriculumLesson, Error, { subject: string; index: number }>({
    mutationFn: async ({ subject, index }) => {
      return (await curriculumFn({
        data: {
          concept: subject,
          countryName: countryInfo.name,
          countryCode: country,
          grade,
          language: lang,
          languageName: langInfo.name,
          career: oracleCareer || (getCurriculum()?.career ?? ""),
          learningStyle: search.style || (getCurriculum()?.learningStyle ?? "Visual"),
          chapterIndex: index,
        },
      })) as CurriculumLesson;
    },
    onSuccess: (data, variables) => {
      setCurriculumLessons((prev) => new Map(prev).set(variables.subject, data));
    },
  });

  const fetchVideos = async (topic: string) => {
    if (videoCache.has(topic)) return;
    try {
      const res = await ytFn({ data: { query: `${topic} tutorial`, maxResults: 3 } });
      setVideoCache((prev) => new Map(prev).set(topic, res as YouTubeResult[]));
    } catch {
      setVideoCache((prev) => new Map(prev).set(topic, []));
    }
  };

  const handleToggleComplete = (topicId: string) => {
    const saved = getCurriculum();
    if (!saved) return;
    toggleTopicComplete(saved.id, topicId);
    const updated = getCurriculum();
    if (updated) {
      const completed = new Set<string>();
      updated.curriculum.forEach((s) =>
        s.topics.forEach((t) => { if (t.completed) completed.add(t.id); })
      );
      setCompletedTopics(completed);
    }
  };

  useEffect(() => {
    if (isOracleMode && oracleSubjects.length > 0 && !autoStarted.current) {
      autoStarted.current = true;
      const first = oracleSubjects[0];
      setActiveSubject(first);
      curriculumMutation.mutate({ subject: first, index: 0 });
    }
  }, [isOracleMode]);

  const isInitialPending = mutation.isPending && !mutation.variables?.adjust;
  const isAdjusting = mutation.isPending && !!mutation.variables?.adjust;
  const totalTopics = curriculumSubjects.reduce((a, s) => a + s.topics.length, 0);
  const completedCount = completedTopics.size;

  return (
    <div className="mesh-rawi min-h-screen" data-tool="rawi">
      <div className="mx-auto max-w-5xl px-4 py-12">

        {isOracleMode && (
          <div className="mb-6 flex items-center justify-between rounded-xl border border-oracle/40 bg-oracle/10 px-4 py-3 text-sm animate-fade-up">
            <div className="flex items-center gap-3">
              <span className="rounded-full border border-oracle/40 bg-oracle/15 px-2.5 py-0.5 text-xs font-medium text-oracle">
                From 0RACLE
              </span>
              <span className="text-foreground/85">
                Building curriculum for <strong className="text-oracle">{oracleCareer}</strong>
              </span>
            </div>
            <Link to="/oracle" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-3 w-3" /> Back to 0RACLE
            </Link>
          </div>
        )}

        {isOracleMode && totalTopics > 0 && (
          <div className="mb-6 glass rounded-xl p-4 animate-fade-up">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-rawi" />
                <span className="text-sm font-medium">Overall Progress</span>
              </div>
              <span className="text-sm text-rawi font-bold">{completedCount} / {totalTopics} topics</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-surface-2">
              <div
                className="h-full rounded-full bg-gradient-to-r from-rawi to-rawi/60 transition-all duration-500"
                style={{ width: `${totalTopics > 0 ? (completedCount / totalTopics) * 100 : 0}%` }}
              />
            </div>
          </div>
        )}

        {isOracleMode && oracleSubjects.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="h-5 w-5 text-rawi" />
              <h2 className="text-2xl font-bold">Your Curriculum</h2>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {oracleSubjects.map((subj, i) => {
                const lesson = curriculumLessons.get(subj);
                const subjTopics = curriculumSubjects.find((s) => s.subject === subj)?.topics ?? [];
                const subjCompleted = subjTopics.filter((t) => completedTopics.has(t.id)).length;
                return (
                  <button
                    key={subj}
                    onClick={() => {
                      setActiveSubject(subj);
                      if (!curriculumLessons.has(subj)) {
                        curriculumMutation.mutate({ subject: subj, index: i });
                      }
                    }}
                    className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                      activeSubject === subj
                        ? "border-rawi bg-rawi/15 text-rawi shadow-[0_0_18px_rgba(201,168,76,0.25)]"
                        : "border-border bg-surface-2 hover:border-rawi/40"
                    }`}
                  >
                    {subj}
                    {lesson && subjTopics.length > 0 && (
                      <span className="ml-2 text-xs opacity-60">{subjCompleted}/{subjTopics.length}</span>
                    )}
                    {lesson && <CheckCircle2 className="ml-1.5 inline h-3 w-3 text-success" />}
                  </button>
                );
              })}
            </div>

            {activeSubject && curriculumMutation.isPending && (
              <div className="glass rounded-2xl p-10 text-center">
                <div className="mx-auto h-16 w-16 animate-pulse-glow rounded-full bg-gradient-to-br from-rawi to-rawi/40" />
                <p className="mt-6 font-serif text-xl text-rawi italic">Building {activeSubject} for your world...</p>
              </div>
            )}

            {activeSubject && curriculumLessons.has(activeSubject) && !curriculumMutation.isPending && (
              <CurriculumLessonView
                lesson={curriculumLessons.get(activeSubject)!}
                activeSubject={activeSubject}
                countryName={countryInfo.name}
                onFetchVideos={fetchVideos}
                videoCache={videoCache}
                completedTopics={completedTopics}
                onToggleComplete={handleToggleComplete}
              />
            )}
          </div>
        )}

        {!isOracleMode && (
          <>
            <div className="text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-rawi/40 bg-rawi/10 px-3 py-1 text-xs text-rawi">
                <Sparkles className="h-3 w-3" /> RAWI
              </div>
              <h1 className="mt-4 font-serif text-5xl font-semibold md:text-6xl">
                What are you <span className="text-gradient-rawi italic">learning</span> today?
              </h1>
            </div>

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

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Country / cultural world</p>
                  <input value={countryFilter} onChange={(e) => setCountryFilter(e.target.value)} placeholder="Search..." className="rounded-md border border-border bg-surface-2 px-2 py-1 text-xs focus:border-rawi focus:outline-none" />
                </div>
                <div className="max-h-56 overflow-y-auto rounded-xl border border-border bg-surface-2/40 p-3 space-y-3">
                  {Object.entries(regions).map(([region, list]) => (
                    <div key={region}>
                      <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{region}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {list.map((c) => (
                          <button key={c.code} onClick={() => setCountry(c.code)} className={`rounded-md border px-2.5 py-1 text-xs transition-all ${country === c.code ? "border-rawi bg-rawi/15 text-rawi shadow-[0_0_18px_rgba(201,168,76,0.25)]" : "border-border bg-surface-2 hover:border-rawi/40"}`}>
                            <span className="mr-1">{c.flag}</span>{c.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Grade</p>
                <div className="grid gap-2 md:grid-cols-3">
                  {GRADES.map((g) => (
                    <button key={g.id} onClick={() => setGrade(g.id as typeof grade)} className={`rounded-xl border p-3 text-left transition-all ${grade === g.id ? "border-rawi bg-rawi/10 shadow-[0_0_20px_rgba(201,168,76,0.2)]" : "border-border bg-surface-2/40 hover:border-rawi/40"}`}>
                      <div className="text-sm font-semibold">{g.label}</div>
                      <div className="text-xs text-muted-foreground">{g.ages}</div>
                      <div className="mt-1.5 text-[11px] text-muted-foreground italic">"{g.desc}"</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Language</p>
                  <div className="grid grid-cols-3 gap-1.5">
                    {LANGUAGES.map((l) => (
                      <button key={l.code} onClick={() => setLang(l.code)} className={`rounded-md border px-2 py-1.5 text-xs ${lang === l.code ? "border-rawi bg-rawi/10" : "border-border bg-surface-2/40"}`}>
                        <span className="mr-1">{l.flag}</span>{l.name}
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

              <button onClick={() => mutation.mutate(undefined)} disabled={!concept.trim() || mutation.isPending} className="btn-rawi w-full rounded-xl px-4 py-4 text-base font-semibold disabled:cursor-not-allowed disabled:opacity-50">
                {isInitialPending ? "Rewriting for your world..." : "Rewrite for My World"}
              </button>
            </div>

            <div className="mt-10">
              {isInitialPending && <RawiLoading country={countryInfo.name} />}
              {mutation.isError && (
                <div className="glass rounded-2xl border border-destructive/40 p-6">
                  <h3 className="font-semibold text-destructive">Something went wrong</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{(mutation.error as Error).message}</p>
                  <button onClick={() => mutation.mutate(undefined)} className="mt-3 inline-flex items-center gap-1 rounded-md border border-border bg-surface-2 px-3 py-1.5 text-sm">
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
          </>
        )}
      </div>
    </div>
  );
}

function CurriculumLessonView({
  lesson,
  activeSubject,
  countryName,
  onFetchVideos,
  videoCache,
  completedTopics,
  onToggleComplete,
}: {
  lesson: CurriculumLesson;
  activeSubject: string;
  countryName: string;
  onFetchVideos: (topic: string) => void;
  videoCache: Map<string, YouTubeResult[]>;
  completedTopics: Set<string>;
  onToggleComplete: (topicId: string) => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      lesson.lessons.forEach((l) => onFetchVideos(l.title));
    }, 500);
    return () => clearTimeout(timer);
  }, [lesson.lessons.length]);

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="glass border-gradient-brand rounded-2xl p-6">
        <h2 className="text-2xl font-bold">{lesson.chapterTitle}</h2>
        <p className="text-sm text-muted-foreground mt-1">{lesson.lessons.length} lessons · Localized for {countryName}</p>
      </div>

      {lesson.lessons.map((l, i) => {
        const topicId = `${activeSubject}_${l.title.replace(/\s+/g, "_").slice(0, 30)}`;
        const isCompleted = completedTopics.has(topicId);
        const videos = videoCache.get(l.title) ?? [];

        return (
          <div
            key={i}
            className={`glass rounded-2xl p-6 animate-fade-up transition-all ${isCompleted ? "border border-success/30 bg-success/5" : ""}`}
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-xl font-semibold">{l.title}</h3>
              <button
                onClick={() => onToggleComplete(topicId)}
                className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs transition-all hover:border-success/40"
              >
                {isCompleted ? (
                  <><CheckCircle2 className="h-4 w-4 text-success" /><span className="text-success">Done</span></>
                ) : (
                  <><Circle className="h-4 w-4 text-muted-foreground" /><span className="text-muted-foreground">Mark done</span></>
                )}
              </button>
            </div>

            <div className="text-sm text-foreground/85 leading-relaxed whitespace-pre-wrap">{l.explanation}</div>

            <div className="mt-4 rounded-lg border border-rawi/20 bg-rawi/5 p-4">
              <p className="text-xs uppercase tracking-widest text-rawi mb-2">In {countryName}</p>
              <p className="text-sm italic text-foreground/90">{l.localExample}</p>
            </div>

            <details className="mt-4 rounded-lg border border-border bg-surface-2/40 p-3">
              <summary className="cursor-pointer text-sm font-medium">Practice: {l.practiceQuestion}</summary>
              <p className="mt-2 text-sm text-muted-foreground">{l.practiceAnswer}</p>
            </details>

            {videos.length > 0 && (
              <div className="mt-5">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3">Related Videos</p>
                <div className="space-y-2">
                  {videos.map((v) => (
                    <a key={v.id} href={v.url} target="_blank" rel="noopener noreferrer"
                      className="flex gap-3 rounded-xl bg-surface-2/40 p-3 hover:bg-surface-2/70 transition-colors border border-border hover:border-rawi/30">
                      <div className="relative h-16 w-28 flex-shrink-0 overflow-hidden rounded-lg">
                        <img src={v.thumbnail} alt={v.title} className="h-full w-full object-cover" />
                        <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1.5 py-0.5 text-[9px] text-white">{v.duration}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium line-clamp-2 leading-relaxed">{v.title}</p>
                        <p className="mt-1 text-[10px] text-muted-foreground">{v.channelTitle}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-5 rounded-xl border border-border bg-surface-2/20 p-4">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3">Free Resources</p>
              <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                <a href={`https://www.khanacademy.org/search?page_search_query=${encodeURIComponent(l.title)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg border border-border bg-surface-2/60 px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:border-rawi/40 transition-all">
                  <ExternalLink className="h-3 w-3" /> Khan Academy
                </a>
                <a href={`https://ocw.mit.edu/search/?q=${encodeURIComponent(l.title)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg border border-border bg-surface-2/60 px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:border-rawi/40 transition-all">
                  <ExternalLink className="h-3 w-3" /> MIT OCW
                </a>
                <a href={`https://www.coursera.org/search?query=${encodeURIComponent(l.title)}&productType=Course&price=Free`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg border border-border bg-surface-2/60 px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:border-rawi/40 transition-all">
                  <ExternalLink className="h-3 w-3" /> Coursera Free
                </a>
                <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(l.title)}+lesson`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg border border-border bg-surface-2/60 px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:border-rawi/40 transition-all">
                  <ExternalLink className="h-3 w-3" /> YouTube
                </a>
                <a href={`https://www.freecodecamp.org/news/search/?query=${encodeURIComponent(l.title)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg border border-border bg-surface-2/60 px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:border-rawi/40 transition-all">
                  <ExternalLink className="h-3 w-3" /> freeCodeCamp
                </a>
                <a href={`https://scholar.google.com/scholar?q=${encodeURIComponent(l.title)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg border border-border bg-surface-2/60 px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:border-rawi/40 transition-all">
                  <ExternalLink className="h-3 w-3" /> Google Scholar
                </a>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function RawiLoading({ country }: { country: string }) {
  const msgs = useMemo(
    () => [
      `Walking through the markets of ${country}...`,
      `Listening to elders in ${country}...`,
      `Weaving the lesson into ${country}'s world...`,
      `Choosing the right local names...`,
      `Rewriting in your voice...`,
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
