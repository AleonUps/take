import { createFileRoute, Link } from '@tanstack/react-router';
import { useState, useEffect, useMemo, useRef } from 'react';
import { Search, Sparkles, ArrowLeft, BookOpen, Trophy, CheckCircle2, Circle, ExternalLink } from 'lucide-react';
import { LANGUAGES, GRADES, COUNTRIES } from '@/lib/educis';
import { useTheme } from '@/lib/theme';
import { getCurriculum, toggleTopicComplete } from '@/lib/curriculum';

type RawiSearch = {
  concept?: string;
  grade?: 'elementary' | 'middle' | 'high';
  lang?: string;
  fromOracle?: string;
  career?: string;
  countryCode?: string;
  countryName?: string;
  langName?: string;
  style?: string;
  subjects?: string;
};

export const Route = createFileRoute('/rawi')({
  validateSearch: (search: Record<string, unknown>): RawiSearch => ({
    concept: typeof search.concept === 'string' ? search.concept : undefined,
    grade: search.grade === 'elementary' || search.grade === 'middle' || search.grade === 'high' ? search.grade : undefined,
    lang: typeof search.lang === 'string' ? search.lang : undefined,
    fromOracle: typeof search.fromOracle === 'string' ? search.fromOracle : undefined,
    career: typeof search.career === 'string' ? search.career : undefined,
    countryCode: typeof search.countryCode === 'string' ? search.countryCode : undefined,
    countryName: typeof search.countryName === 'string' ? search.countryName : undefined,
    langName: typeof search.langName === 'string' ? search.langName : undefined,
    style: typeof search.style === 'string' ? search.style : undefined,
    subjects: typeof search.subjects === 'string' ? search.subjects : undefined,
  }),
  component: RawiPage,
});

const PLACEHOLDERS = [
  'photosynthesis...', 'quadratic equations...', 'the water cycle...',
  'the French Revolution...', "Newton's laws...", 'supply and demand...',
];

function RawiPage() {
  const search = Route.useSearch();
  const { isDark } = useTheme();

  const [concept, setConcept] = useState(search.concept ?? '');
  const [country, setCountry] = useState(search.countryCode ?? 'SA');
  const [grade, setGrade] = useState<'elementary' | 'middle' | 'high'>(search.grade ?? 'middle');
  const [lang, setLang] = useState(search.lang ?? 'en');
  const [includeHistory, setIncludeHistory] = useState(true);
  const [audio, setAudio] = useState(false);
  const [countryFilter, setCountryFilter] = useState('');
  const [phIdx, setPhIdx] = useState(0);

  const [result, setResult] = useState<RawiLesson | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completedTopics, setCompletedTopics] = useState<Set<string>>(new Set());
  const [curriculumSubjects, setCurriculumSubjects] = useState<string[]>([]);
  const [totalTopics, setTotalTopics] = useState(0);
  const autoStarted = useRef(false);

  const isOracleMode = search.fromOracle === 'true' && !!search.career;
  const oracleCareer = search.career ?? '';
  const oracleSubjects = search.subjects?.split(',').filter(Boolean) ?? [];

  useEffect(() => {
    const t = setInterval(() => setPhIdx(i => (i + 1) % PLACEHOLDERS.length), 2200);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const saved = getCurriculum();
    if (saved) {
      setCurriculumSubjects(saved.curriculum.map(s => s.subject));
      const completed = new Set<string>();
      let total = 0;
      saved.curriculum.forEach(s => s.topics.forEach(t => { total++; if (t.completed) completed.add(t.id); }));
      setCompletedTopics(completed);
      setTotalTopics(total);
    }
  }, []);

  const langInfo = LANGUAGES.find(l => l.code === lang)!;
  const countryInfo = COUNTRIES.find(c => c.code === country) ?? COUNTRIES[0];

  const regions = useMemo(() => {
    const filtered = COUNTRIES.filter(c =>
      c.name.toLowerCase().includes(countryFilter.toLowerCase()) ||
      c.region.toLowerCase().includes(countryFilter.toLowerCase())
    );
    const grouped: Record<string, typeof COUNTRIES> = {};
    for (const c of filtered) (grouped[c.region] ??= []).push(c);
    return grouped;
  }, [countryFilter]);

  const generateLesson = async () => {
    if (!concept.trim()) return;
    setIsLoading(true);
    setError(null);

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (supabaseUrl && supabaseKey) {
        const res = await fetch(`${supabaseUrl}/functions/v1/rawi-generate`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${supabaseKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ concept: concept.trim(), countryCode: country, countryName: countryInfo.name, grade, language: lang, languageName: langInfo.name, includeCulturalHistory: includeHistory, audioFriendly: audio }),
        });
        const data = await res.json();
        setResult(data);
      } else {
        setResult(generateDemoLesson(concept.trim(), countryInfo.name));
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleComplete = (topicId: string) => {
    const saved = getCurriculum();
    if (!saved) return;
    toggleTopicComplete(saved.id, topicId);
    setCompletedTopics(prev => {
      const next = new Set(prev);
      if (next.has(topicId)) next.delete(topicId); else next.add(topicId);
      return next;
    });
  };

  const completedCount = completedTopics.size;

  return (
    <div className="mesh-rawi min-h-screen relative" data-tool="rawi">
      <div className="pointer-events-none absolute inset-0 tech-grid opacity-30" />

      <div className="relative mx-auto max-w-5xl px-4 py-12">

        {/* Oracle mode banner */}
        {isOracleMode && (
          <div className="mb-6 flex items-center justify-between rounded-xl px-4 py-3 text-sm animate-fade-up"
            style={{ border: '1px solid rgba(0,212,255,0.3)', background: 'rgba(0,212,255,0.06)' }}>
            <div className="flex items-center gap-3">
              <span className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                style={{ border: '1px solid rgba(0,212,255,0.3)', background: 'rgba(0,212,255,0.1)', color: 'var(--oracle)' }}>
                From 0RACLE
              </span>
              <span style={{ color: 'var(--foreground)', opacity: 0.8 }}>
                Building curriculum for <strong style={{ color: 'var(--oracle)' }}>{oracleCareer}</strong>
              </span>
            </div>
            <Link to="/oracle" className="inline-flex items-center gap-1 text-xs" style={{ color: 'var(--muted-foreground)' }}>
              <ArrowLeft className="h-3 w-3" /> Back
            </Link>
          </div>
        )}

        {/* Progress bar (Oracle mode) */}
        {isOracleMode && totalTopics > 0 && (
          <div className="mb-6 glass rounded-xl p-4 animate-fade-up">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4" style={{ color: 'var(--rawi)' }} />
                <span className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Overall Progress</span>
              </div>
              <span className="text-sm font-bold" style={{ color: 'var(--rawi)' }}>{completedCount} / {totalTopics}</span>
            </div>
            <div className="h-2 w-full rounded-full overflow-hidden" style={{ background: 'var(--surface-2)' }}>
              <div className="h-full rounded-full transition-all duration-500"
                style={{ width: `${totalTopics > 0 ? (completedCount / totalTopics) * 100 : 0}%`, background: 'linear-gradient(90deg, var(--rawi), rgba(212,168,67,0.6))' }} />
            </div>
          </div>
        )}

        {/* Oracle mode curriculum tabs */}
        {isOracleMode && oracleSubjects.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="h-5 w-5" style={{ color: 'var(--rawi)' }} />
              <h2 className="text-2xl font-bold" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--foreground)' }}>
                Your Curriculum
              </h2>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {oracleSubjects.map(subj => {
                const subjTopics = getCurriculum()?.curriculum.find(s => s.subject === subj)?.topics ?? [];
                const subjCompleted = subjTopics.filter(t => completedTopics.has(t.id)).length;
                return (
                  <button key={subj}
                    onClick={() => { setConcept(subj); }}
                    className="rounded-lg px-4 py-2 text-sm font-medium transition-all"
                    style={{ border: '1px solid var(--border)', background: 'var(--surface-2)', color: 'var(--foreground)' }}>
                    {subj}
                    {subjTopics.length > 0 && (
                      <span className="ml-2 text-xs" style={{ color: 'var(--muted-foreground)' }}>
                        {subjCompleted}/{subjTopics.length}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Manual mode UI */}
        {!isOracleMode && (
          <>
            <div className="text-center animate-fade-up">
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs mb-4"
                style={{ border: '1px solid rgba(212,168,67,0.3)', background: 'rgba(212,168,67,0.08)', color: 'var(--rawi)' }}>
                <Sparkles className="h-3 w-3" /> RAWI
              </div>
              <h1 className="text-5xl font-semibold md:text-6xl" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--foreground)' }}>
                What are you{' '}
                <span className="italic text-gradient-rawi">learning</span>{' '}
                today?
              </h1>
            </div>

            <div className="glass mt-10 rounded-2xl p-6 space-y-6 animate-fade-up" style={{ animationDelay: '100ms' }}>
              {/* Search */}
              <div className="flex items-stretch gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }} />
                  <input
                    value={concept}
                    onChange={e => setConcept(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && generateLesson()}
                    placeholder={PLACEHOLDERS[phIdx]}
                    className="w-full rounded-xl py-4 pl-12 pr-4 text-lg outline-none transition-all"
                    style={{
                      border: '1px solid var(--border)',
                      background: 'var(--surface-2)',
                      color: 'var(--foreground)',
                    }}
                    onFocus={e => e.currentTarget.style.borderColor = 'var(--rawi)'}
                    onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}
                  />
                </div>
              </div>

              {/* Country grid */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>
                    Country / Cultural World
                  </p>
                  <input
                    value={countryFilter}
                    onChange={e => setCountryFilter(e.target.value)}
                    placeholder="Search..."
                    className="rounded-md px-2 py-1 text-xs outline-none"
                    style={{ border: '1px solid var(--border)', background: 'var(--surface-2)', color: 'var(--foreground)' }}
                    onFocus={e => e.currentTarget.style.borderColor = 'var(--rawi)'}
                    onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}
                  />
                </div>
                <div className="max-h-56 overflow-y-auto rounded-xl p-3 space-y-3"
                  style={{ border: '1px solid var(--border)', background: 'rgba(0,0,0,0.15)' }}>
                  {Object.entries(regions).map(([region, list]) => (
                    <div key={region}>
                      <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--muted-foreground)' }}>
                        {region}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {list.map(c => (
                          <button key={c.code}
                            onClick={() => setCountry(c.code)}
                            className="rounded-md px-2.5 py-1 text-xs transition-all"
                            style={country === c.code
                              ? { border: '1px solid var(--rawi)', background: 'rgba(212,168,67,0.12)', color: 'var(--rawi)', boxShadow: '0 0 12px rgba(212,168,67,0.2)' }
                              : { border: '1px solid var(--border)', background: 'var(--surface-2)', color: 'var(--foreground)' }
                            }>
                            <span className="mr-1">{c.flag}</span>{c.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Grade */}
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>Grade</p>
                <div className="grid gap-2 md:grid-cols-3">
                  {GRADES.map(g => (
                    <button key={g.id}
                      onClick={() => setGrade(g.id as typeof grade)}
                      className="rounded-xl p-3 text-left transition-all"
                      style={grade === g.id
                        ? { border: '1px solid var(--rawi)', background: 'rgba(212,168,67,0.08)', boxShadow: '0 0 18px rgba(212,168,67,0.2)' }
                        : { border: '1px solid var(--border)', background: 'rgba(0,0,0,0.2)', color: 'var(--foreground)' }
                      }>
                      <div className="text-sm font-semibold" style={{ color: grade === g.id ? 'var(--rawi)' : 'var(--foreground)' }}>{g.label}</div>
                      <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{g.ages}</div>
                      <div className="mt-1 text-[11px] italic" style={{ color: 'var(--muted-foreground)', opacity: 0.7 }}>"{g.desc}"</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Language + toggles */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>Language</p>
                  <div className="grid grid-cols-3 gap-1.5">
                    {LANGUAGES.map(l => (
                      <button key={l.code}
                        onClick={() => setLang(l.code)}
                        className="rounded-md px-2 py-1.5 text-xs transition-all"
                        style={lang === l.code
                          ? { border: '1px solid var(--rawi)', background: 'rgba(212,168,67,0.08)', color: 'var(--rawi)' }
                          : { border: '1px solid var(--border)', background: 'var(--surface-2)', color: 'var(--foreground)' }
                        }>
                        <span className="mr-1">{l.flag}</span>{l.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 text-sm"
                    style={{ border: '1px solid var(--border)', background: 'var(--surface-2)', color: 'var(--foreground)' }}>
                    <span>Include cultural history</span>
                    <input type="checkbox" checked={includeHistory} onChange={e => setIncludeHistory(e.target.checked)}
                      style={{ accentColor: 'var(--rawi)' }} />
                  </label>
                  <label className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 text-sm"
                    style={{ border: '1px solid var(--border)', background: 'var(--surface-2)', color: 'var(--foreground)' }}>
                    <span>Audio-friendly version</span>
                    <input type="checkbox" checked={audio} onChange={e => setAudio(e.target.checked)}
                      style={{ accentColor: 'var(--rawi)' }} />
                  </label>
                </div>
              </div>

              <button
                onClick={generateLesson}
                disabled={!concept.trim() || isLoading}
                className="btn-rawi w-full rounded-xl px-4 py-4 text-base font-semibold disabled:opacity-50">
                {isLoading ? 'Rewriting for your world...' : 'Rewrite for My World'}
              </button>
            </div>

            {/* Result / Loading */}
            <div className="mt-10">
              {isLoading && <RawiLoading country={countryInfo.name} isDark={isDark} />}
              {error && (
                <div className="glass rounded-2xl p-6" style={{ border: '1px solid rgba(255,80,80,0.3)' }}>
                  <p className="font-semibold" style={{ color: '#ff6b6b' }}>Something went wrong</p>
                  <p className="mt-2 text-sm" style={{ color: 'var(--muted-foreground)' }}>{error}</p>
                </div>
              )}
              {result && !isLoading && (
                <RawiResultDisplay data={result} country={countryInfo} rtl={langInfo.rtl} isDark={isDark} onToggle={handleToggleComplete} completedTopics={completedTopics} />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

interface RawiLesson {
  conceptTitle: string;
  culturalHook: string;
  readingTime: string;
  storyLesson: string[];
  pullQuote: string;
  examples: Array<{ title: string; explanation: string; localContext: string }>;
  practiceProblems: Array<{ question: string; hint: string; answer: string }>;
  keyConcepts: string[];
  culturalConnection: string;
}

function RawiResultDisplay({ data, country, rtl, isDark, onToggle, completedTopics }: {
  data: RawiLesson;
  country: { name: string; flag: string };
  rtl: boolean;
  isDark: boolean;
  onToggle: (id: string) => void;
  completedTopics: Set<string>;
}) {
  return (
    <div className="hud-card hud-card-rawi glass rounded-2xl p-8 animate-fade-up" dir={rtl ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">{country.flag}</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded"
              style={{ background: 'rgba(212,168,67,0.1)', border: '1px solid rgba(212,168,67,0.25)', color: 'var(--rawi)' }}>
              {country.name}
            </span>
            <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{data.readingTime}</span>
          </div>
          <h2 className="text-3xl font-bold" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--foreground)' }}>
            {data.conceptTitle}
          </h2>
        </div>
      </div>

      {/* Cultural hook */}
      <div className="mb-6 rounded-xl p-5" style={{ background: 'rgba(212,168,67,0.06)', border: '1px solid rgba(212,168,67,0.2)' }}>
        <p className="text-xs font-mono mb-2" style={{ color: 'rgba(212,168,67,0.5)' }}>CULTURAL_HOOK</p>
        <p className="text-base italic leading-relaxed" style={{ color: 'var(--foreground)', fontFamily: 'Syne, sans-serif' }}>
          "{data.culturalHook}"
        </p>
      </div>

      {/* Story */}
      <div className="mb-6 space-y-4">
        {data.storyLesson.map((para, i) => (
          <p key={i} className="text-sm leading-loose" style={{ color: 'var(--muted-foreground)' }}>
            {para}
          </p>
        ))}
      </div>

      {/* Pull quote */}
      <blockquote className="my-6 pl-4 py-2" style={{ borderLeft: '3px solid var(--rawi)' }}>
        <p className="text-lg italic" style={{ color: 'var(--rawi)', fontFamily: 'Syne, sans-serif' }}>"{data.pullQuote}"</p>
      </blockquote>

      {/* Examples */}
      {data.examples.length > 0 && (
        <div className="mb-6">
          <p className="text-xs font-mono mb-3 tracking-widest" style={{ color: 'rgba(212,168,67,0.5)' }}>LOCAL_EXAMPLES</p>
          <div className="grid gap-4 md:grid-cols-2">
            {data.examples.map((ex, i) => (
              <div key={i} className="rounded-xl p-4" style={{ background: isDark ? 'rgba(6,12,20,0.6)' : 'rgba(241,245,249,0.6)', border: '1px solid var(--border)' }}>
                <p className="text-sm font-semibold mb-2" style={{ color: 'var(--rawi)', fontFamily: 'Syne, sans-serif' }}>{ex.title}</p>
                <p className="text-xs leading-relaxed mb-2" style={{ color: 'var(--muted-foreground)' }}>{ex.explanation}</p>
                <p className="text-xs italic" style={{ color: 'var(--rawi)', opacity: 0.7 }}>{ex.localContext}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Practice */}
      {data.practiceProblems.length > 0 && (
        <div>
          <p className="text-xs font-mono mb-3 tracking-widest" style={{ color: 'rgba(212,168,67,0.5)' }}>PRACTICE_NODES</p>
          <div className="space-y-3">
            {data.practiceProblems.map((p, i) => {
              const id = `rawi_${data.conceptTitle}_${i}`;
              const done = completedTopics.has(id);
              return (
                <details key={i} className="rounded-xl" style={{ border: '1px solid var(--border)', background: isDark ? 'rgba(6,12,20,0.4)' : 'rgba(241,245,249,0.4)' }}>
                  <summary className="flex items-center justify-between cursor-pointer p-4 text-sm font-medium" style={{ color: 'var(--foreground)' }}>
                    <span>{p.question}</span>
                    <button onClick={e => { e.preventDefault(); onToggle(id); }} className="ml-2 flex-shrink-0">
                      {done
                        ? <CheckCircle2 className="h-4 w-4" style={{ color: 'var(--success)' }} />
                        : <Circle className="h-4 w-4" style={{ color: 'var(--muted-foreground)' }} />
                      }
                    </button>
                  </summary>
                  <div className="px-4 pb-4">
                    <p className="text-xs mb-2" style={{ color: 'var(--muted-foreground)', fontStyle: 'italic' }}>Hint: {p.hint}</p>
                    <p className="text-sm" style={{ color: 'var(--foreground)' }}>{p.answer}</p>
                  </div>
                </details>
              );
            })}
          </div>
        </div>
      )}

      {/* Free resources */}
      <div className="mt-6 pt-6" style={{ borderTop: '1px solid var(--border)' }}>
        <p className="text-xs font-mono mb-3 tracking-widest" style={{ color: 'rgba(212,168,67,0.5)' }}>FREE_RESOURCES</p>
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'Khan Academy', href: `https://www.khanacademy.org/search?page_search_query=${encodeURIComponent(data.conceptTitle)}` },
            { label: 'MIT OCW', href: `https://ocw.mit.edu/search/?q=${encodeURIComponent(data.conceptTitle)}` },
            { label: 'YouTube', href: `https://www.youtube.com/results?search_query=${encodeURIComponent(data.conceptTitle)}+tutorial` },
          ].map(r => (
            <a key={r.label} href={r.href} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs transition-all hover:-translate-y-0.5"
              style={{ border: '1px solid var(--border)', background: 'var(--surface-2)', color: 'var(--muted-foreground)' }}>
              <ExternalLink className="h-3 w-3" />{r.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

function RawiLoading({ country, isDark }: { country: string; isDark: boolean }) {
  const msgs = useMemo(() => [
    `Walking through the markets of ${country}...`,
    `Listening to elders in ${country}...`,
    `Weaving the lesson into ${country}'s world...`,
    `Choosing the right local names...`,
    `Rewriting in your voice...`,
  ], [country]);
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI(x => (x + 1) % msgs.length), 1500);
    return () => clearInterval(t);
  }, [msgs.length]);

  return (
    <div className="glass rounded-2xl p-10 text-center">
      <div className="mx-auto h-16 w-16 rounded-full animate-pulse"
        style={{ background: 'linear-gradient(135deg, var(--rawi), rgba(212,168,67,0.4))', boxShadow: '0 0 30px rgba(212,168,67,0.3)' }} />
      <p className="mt-6 text-xl italic" style={{ color: 'var(--rawi)', fontFamily: 'Syne, sans-serif' }}>{msgs[i]}</p>
      <div className="mx-auto mt-6 h-1 w-64 rounded-full overflow-hidden" style={{ background: 'var(--surface-2)' }}>
        <div className="h-full w-1/2 rounded-full animate-pulse"
          style={{ background: 'linear-gradient(90deg, var(--rawi), rgba(212,168,67,0.4))' }} />
      </div>
    </div>
  );
}

function generateDemoLesson(concept: string, country: string): RawiLesson {
  return {
    conceptTitle: concept.charAt(0).toUpperCase() + concept.slice(1),
    culturalHook: `In ${country}, this concept is woven into everyday life in ways you'll recognize immediately.`,
    readingTime: '8 min read',
    storyLesson: [
      `Imagine you're at a local market in ${country}. The vendor carefully arranges colorful produce — this is ${concept} in action.`,
      `Every transaction, every negotiation, every decision at that market reflects the core principles of ${concept} that we'll explore together.`,
      `By the end of this lesson, you'll see ${concept} not as a textbook topic, but as something alive in your community every single day.`,
    ],
    pullQuote: `"${concept} isn't something that happens elsewhere — it's the rhythm of your own street."`,
    examples: [
      { title: 'Local Market Example', explanation: `How ${concept} appears in everyday ${country} commerce and culture.`, localContext: `This is something you might see at any local gathering in ${country}.` },
      { title: 'Community Application', explanation: `Real-world application of ${concept} in ${country}'s social fabric.`, localContext: `Families in ${country} use this principle constantly without realizing it.` },
    ],
    practiceProblems: [
      { question: `How does ${concept} relate to a situation you've seen in ${country}?`, hint: 'Think about markets, schools, or community events.', answer: `Connect the principles of ${concept} to a specific example from ${country}'s daily life.` },
    ],
    keyConcepts: [concept, 'Local Context', 'Cultural Connection', 'Real Application'],
    culturalConnection: `${country} has a rich tradition that directly reflects the principles of ${concept}.`,
  };
}
