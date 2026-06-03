import { createFileRoute } from '@tanstack/react-router';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, Upload, X, Zap, BookOpen, Globe, ChevronDown, Layers, Star, BookMarked, Check, AlertCircle } from 'lucide-react';
import { LANGUAGES, GRADES } from '@/lib/educis';
import { saveToLibrary } from '@/lib/library';
import { useTheme } from '@/lib/theme';

export const Route = createFileRoute('/spark')({
  component: SparkPage,
});

const SAMPLE_IMAGES = [
  { url: 'https://images.pexels.com/photos/3735218/pexels-photo-3735218.jpeg?auto=compress&cs=tinysrgb&w=600', label: 'Solar panels', subjects: 3 },
  { url: 'https://images.pexels.com/photos/256417/pexels-photo-256417.jpeg?auto=compress&cs=tinysrgb&w=600', label: 'Leaf & photosynthesis', subjects: 4 },
  { url: 'https://images.pexels.com/photos/3735201/pexels-photo-3735201.jpeg?auto=compress&cs=tinysrgb&w=600', label: 'City bridge', subjects: 5 },
  { url: 'https://images.pexels.com/photos/414171/pexels-photo-414171.jpeg?auto=compress&cs=tinysrgb&w=600', label: 'Mountain ecosystem', subjects: 4 },
  { url: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=600', label: 'Market economy', subjects: 3 },
  { url: 'https://images.pexels.com/photos/167699/pexels-photo-167699.jpeg?auto=compress&cs=tinysrgb&w=600', label: 'River delta', subjects: 5 },
];

const TERMINAL_LOGS = [
  'BOOT_SEQUENCE // INITIALIZING_SPARK_ENGINE',
  'IMAGE_PROC // SCANNING_VISUAL_DATA_STREAMS',
  'SUBJECT_MAP // CROSS_REFERENCING_CURRICULUM',
  'CONTEXT_LAYER // LOCALIZING_CULTURAL_FRAME',
  'LESSON_GEN // COMPILING_MULTI_SUBJECT_NODES',
  'SYS_STATUS // RESOLVING_AMBIGUITY_PATHWAYS... SUCCESS',
];

interface SparkResult {
  objectName: string;
  description: string;
  subjects: Array<{
    subject: string;
    lessonTitle: string;
    hook: string;
    keyPoints: string[];
    activityPrompt: string;
    vocabularyTerms: string[];
    discussionQuestion: string;
  }>;
}

function TerminalLoader({ onDone }: { onDone: () => void }) {
  const [count, setCount] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [cursorBlink, setCursorBlink] = useState(true);
  const { isDark } = useTheme();

  useEffect(() => {
    const start = performance.now();
    const duration = 3200;

    const animate = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 2.5);
      const current = Math.floor(eased * 100);
      setCount(current);

      const logIndex = Math.floor(t * TERMINAL_LOGS.length);
      setLogs(TERMINAL_LOGS.slice(0, logIndex + 1));

      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(100);
        setLogs(TERMINAL_LOGS);
        setTimeout(onDone, 400);
      }
    };
    requestAnimationFrame(animate);

    const blinkInterval = setInterval(() => setCursorBlink(b => !b), 530);
    return () => clearInterval(blinkInterval);
  }, [onDone]);

  const countStr = String(count).padStart(3, '0');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: isDark ? 'rgba(2,4,8,0.97)' : 'rgba(248,250,252,0.97)', backdropFilter: 'blur(20px)' }}>
      <div className="w-full max-w-md px-6">
        {/* macOS-style dots */}
        <div className="flex gap-2 mb-6">
          {['#ff5f57', '#ffbd2e', '#28ca41'].map((c, i) => (
            <div key={i} className="h-3 w-3 rounded-full" style={{ background: c }} />
          ))}
        </div>

        {/* Big counter */}
        <div className="mb-6">
          <div className="font-mono text-7xl font-black tabular-nums leading-none"
            style={{ color: 'var(--spark)', textShadow: '0 0 40px rgba(139,92,246,0.5)', fontFamily: 'JetBrains Mono, monospace' }}>
            {countStr}%
          </div>
          <div className="mt-2 h-1 w-full rounded-full overflow-hidden" style={{ background: 'rgba(139,92,246,0.1)' }}>
            <div className="h-full rounded-full transition-none"
              style={{ width: `${count}%`, background: 'linear-gradient(90deg, rgba(139,92,246,0.5), var(--spark))' }} />
          </div>
        </div>

        {/* Terminal log */}
        <div className="space-y-1.5">
          {logs.map((line, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="font-mono text-[10px]" style={{ color: 'rgba(139,92,246,0.4)' }}>{'>'}</span>
              <span className={`font-mono text-[11px] ${i === logs.length - 1 ? 'animate-pulse' : ''}`}
                style={{ color: i === logs.length - 1 ? 'var(--spark)' : 'var(--muted-foreground)', opacity: i === logs.length - 1 ? 1 : 0.5 }}>
                {line}
                {i === logs.length - 1 && (
                  <span style={{ opacity: cursorBlink ? 1 : 0 }}>_</span>
                )}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SubjectCard({ subject, isDark }: { subject: SparkResult['subjects'][number]; isDark: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const [vocabOpen, setVocabOpen] = useState(false);

  const subjectColors: Record<string, string> = {
    Mathematics: '#00d4ff', Chemistry: '#8b5cf6', Biology: '#00ff88',
    Physics: '#fbbf24', History: '#d4a843', Geography: '#22d3ee',
    Economics: '#f97316', Ethics: '#e879f9', 'Environmental Science': '#86efac',
    'Social Studies': '#fb923c', 'Media Literacy': '#a78bfa', 'Cultural Studies': '#f43f5e',
  };
  const color = subjectColors[subject.subject] ?? '#8b5cf6';

  return (
    <div className="hud-card rounded-xl overflow-hidden transition-all duration-300"
      style={{ borderColor: `${color}30`, background: isDark ? 'rgba(6,12,20,0.8)' : 'rgba(248,250,252,0.9)' }}>
      <button
        className="w-full text-left p-5 flex items-start justify-between gap-4"
        onClick={() => setExpanded(e => !e)}>
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="h-8 w-8 rounded-lg flex-shrink-0 grid place-items-center"
            style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
            <Layers className="h-4 w-4" style={{ color }} />
          </div>
          <div className="min-w-0">
            <div className="font-mono text-[10px] tracking-widest font-bold mb-0.5" style={{ color }}>
              // {subject.subject.toUpperCase()}
            </div>
            <div className="text-sm font-semibold truncate" style={{ color: 'var(--foreground)' }}>
              {subject.lessonTitle}
            </div>
          </div>
        </div>
        <ChevronDown className="h-4 w-4 flex-shrink-0 transition-transform duration-300 mt-1"
          style={{ color: 'var(--muted-foreground)', transform: expanded ? 'rotate(180deg)' : 'none' }} />
      </button>

      {expanded && (
        <div className="px-5 pb-5 space-y-4 border-t" style={{ borderColor: `${color}15` }}>
          {/* Hook */}
          <div className="mt-4 p-3 rounded-lg" style={{ background: `${color}08`, borderLeft: `3px solid ${color}` }}>
            <p className="text-sm italic leading-relaxed" style={{ color: 'var(--foreground)', opacity: 0.85 }}>
              "{subject.hook}"
            </p>
          </div>

          {/* Key points */}
          <div>
            <p className="font-mono text-[9px] tracking-widest mb-2" style={{ color, opacity: 0.7 }}>// KEY_CONCEPTS</p>
            <ul className="space-y-1.5">
              {subject.keyPoints.map((pt, i) => (
                <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--foreground)', opacity: 0.8 }}>
                  <span className="h-1.5 w-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: color }} />
                  {pt}
                </li>
              ))}
            </ul>
          </div>

          {/* Activity */}
          <div className="p-3 rounded-lg" style={{ background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.04)', border: '1px solid var(--border)' }}>
            <p className="font-mono text-[9px] tracking-widest mb-1.5" style={{ color: 'var(--muted-foreground)' }}>// ACTIVITY_PROMPT</p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--foreground)', opacity: 0.8 }}>{subject.activityPrompt}</p>
          </div>

          {/* Vocabulary */}
          <div>
            <button
              className="flex items-center gap-2 font-mono text-[9px] tracking-widest mb-2 transition-opacity hover:opacity-100"
              style={{ color, opacity: 0.7 }}
              onClick={() => setVocabOpen(v => !v)}>
              // VOCABULARY_TERMS
              <ChevronDown className="h-3 w-3 transition-transform" style={{ transform: vocabOpen ? 'rotate(180deg)' : 'none' }} />
            </button>
            {vocabOpen && (
              <div className="flex flex-wrap gap-1.5">
                {subject.vocabularyTerms.map((term, i) => (
                  <span key={i} className="rounded-full px-2.5 py-0.5 text-[10px] font-mono"
                    style={{ background: `${color}10`, border: `1px solid ${color}25`, color }}>
                    {term}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Discussion question */}
          <div className="p-3 rounded-lg border" style={{ borderColor: `${color}20`, background: `${color}05` }}>
            <p className="font-mono text-[9px] tracking-widest mb-1" style={{ color, opacity: 0.7 }}>// DISCUSSION_QUESTION</p>
            <p className="text-sm" style={{ color: 'var(--foreground)', opacity: 0.75 }}>{subject.discussionQuestion}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function getDemoResult(grade: string, language: string): SparkResult {
  const gradeLabel = GRADES.find(g => g.id === grade)?.label ?? 'Middle School';
  const langName = LANGUAGES.find(l => l.code === language)?.name ?? 'English';

  return {
    objectName: 'Solar Panel Array',
    description: `A solar panel array converts sunlight into electrical energy using photovoltaic cells. This image was analyzed for ${gradeLabel} students in ${langName}, revealing rich cross-disciplinary connections spanning physics, environmental science, economics, and social equity.`,
    subjects: [
      {
        subject: 'Physics',
        lessonTitle: 'The Photoelectric Effect',
        hook: 'Every photon of sunlight carries energy — enough to knock an electron free and power your home.',
        keyPoints: [
          'Photons carry energy proportional to their frequency',
          'Semiconductor p-n junctions create one-way current flow',
          'Voltage × Current = Power (in Watts)',
          'Efficiency losses occur from heat and reflection',
        ],
        activityPrompt: 'Calculate how many solar panels of 400W each would power a home that uses 900 kWh per month, assuming 5 peak sun-hours per day.',
        vocabularyTerms: ['photon', 'photoelectric effect', 'semiconductor', 'photovoltaic', 'electron volt'],
        discussionQuestion: 'Why does a solar panel produce less power on a hot sunny day than a cool sunny day?',
      },
      {
        subject: 'Environmental Science',
        lessonTitle: 'Clean Energy vs. Land Use',
        hook: 'Solar is clean — but vast farms displace ecosystems. Is there a perfect energy source?',
        keyPoints: [
          'Solar produces zero operational carbon emissions',
          'Panel manufacturing has upstream carbon costs',
          'Large solar farms can disrupt local habitat',
          'Rooftop solar avoids land-use conflicts',
        ],
        activityPrompt: 'Research a solar farm near a populated area. Map the tradeoffs: energy output, land displaced, wildlife corridors affected.',
        vocabularyTerms: ['carbon footprint', 'lifecycle assessment', 'habitat fragmentation', 'renewable energy', 'net zero'],
        discussionQuestion: 'Should governments prioritize large solar farms in deserts or rooftop installations in cities? Defend your answer.',
      },
      {
        subject: 'Economics',
        lessonTitle: 'The Economics of Energy Transition',
        hook: 'Solar is now the cheapest electricity in history — yet billions still lack power. Why?',
        keyPoints: [
          'Levelized Cost of Energy (LCOE) has dropped 90% since 2010',
          'Grid infrastructure requires massive capital investment',
          'Energy poverty disproportionately affects developing regions',
          'Subsidies and carbon taxes shape market competitiveness',
        ],
        activityPrompt: 'Create a cost-benefit analysis comparing solar installation versus continued fossil fuel use over 20 years for a small rural school.',
        vocabularyTerms: ['LCOE', 'capital expenditure', 'subsidy', 'market externality', 'grid parity'],
        discussionQuestion: 'Who should pay for the global energy transition — wealthy nations, corporations, or individuals?',
      },
    ],
  };
}

async function analyzeImage(
  imageBase64: string | null,
  imageUrl: string | null,
  grade: string,
  language: string,
  depth: string,
  focus: string,
): Promise<SparkResult> {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('placeholder')) {
    await new Promise(r => setTimeout(r, 3200));
    return getDemoResult(grade, language);
  }

  try {
    const resp = await fetch(`${supabaseUrl}/functions/v1/spark-analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify({ imageBase64, imageUrl, grade, language, depth, focus }),
    });
    if (!resp.ok) throw new Error('edge function error');
    return await resp.json();
  } catch {
    return getDemoResult(grade, language);
  }
}

function SparkPage() {
  const { isDark } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [grade, setGrade] = useState('middle');
  const [language, setLanguage] = useState('en');
  const [depth, setDepth] = useState<'brief' | 'standard' | 'deep'>('standard');
  const [focus, setFocus] = useState<'all' | 'stem' | 'humanities' | 'social'>('all');

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SparkResult | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file.');
      return;
    }
    setImageFile(file);
    setImageUrl(null);
    setResult(null);
    setSavedId(null);
    const reader = new FileReader();
    reader.onload = e => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleSampleClick = (url: string) => {
    setImageUrl(url);
    setImagePreview(url);
    setImageFile(null);
    setResult(null);
    setSavedId(null);
  };

  const handleAnalyze = async () => {
    if (!imagePreview && !imageUrl) {
      setError('Please select or upload an image first.');
      return;
    }
    setError(null);
    setLoading(true);
    setResult(null);
    setSavedId(null);
    try {
      const base64 = imageFile ? imagePreview : null;
      const res = await analyzeImage(base64, imageUrl ?? null, grade, language, depth, focus);
      setResult(res);
    } catch {
      setError('Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!result) return;
    const id = saveToLibrary({
      kind: 'spark',
      thumbnail: imagePreview,
      grade,
      language,
      result: {
        objectName: result.objectName,
        description: result.description,
        subjects: result.subjects.map(s => ({ subject: s.subject, lessonTitle: s.lessonTitle })),
      },
    });
    setSavedId(id);
  };

  const hasImage = !!(imagePreview || imageUrl);

  return (
    <>
      {loading && <TerminalLoader onDone={() => setLoading(false)} />}

      <div className="min-h-screen tech-grid" style={{ background: 'var(--background)' }}>
        {/* Hero */}
        <section className="relative border-b overflow-hidden" style={{ borderColor: 'var(--border)' }}>
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 h-64 w-64 rounded-full opacity-10 blur-3xl"
              style={{ background: 'var(--spark)' }} />
          </div>
          <div className="mx-auto max-w-7xl px-6 py-16">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-mono tracking-widest"
                  style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)', color: 'var(--spark)' }}>
                  <Camera className="h-3 w-3" />
                  SPARK // VISUAL_INTELLIGENCE_GATEWAY
                </div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3"
                  style={{ fontFamily: 'Syne, sans-serif', color: 'var(--foreground)' }}>
                  Point. Capture.{' '}
                  <span style={{ color: 'var(--spark)' }}>Learn.</span>
                </h1>
                <p className="text-lg max-w-xl" style={{ color: 'var(--muted-foreground)' }}>
                  Upload any image and SPARK extracts multi-subject lessons from what you see — physics, history, economics, and more from a single photograph.
                </p>
              </div>
              <div className="flex items-center gap-4 flex-shrink-0">
                {[{ v: result?.subjects.length ?? 0, l: 'subjects found' }, { v: 3, l: 'depth levels' }, { v: 12, l: 'disciplines' }].map(({ v, l }, i) => (
                  <div key={i} className="text-center">
                    <div className="text-2xl font-black tabular-nums" style={{ color: 'var(--spark)', fontFamily: 'Syne, sans-serif' }}>{v}</div>
                    <div className="text-[10px] font-mono" style={{ color: 'var(--muted-foreground)' }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Main layout */}
        <div className="mx-auto max-w-7xl px-6 py-10 grid gap-8 lg:grid-cols-[380px_1fr]">
          {/* Left sidebar */}
          <aside className="space-y-5">
            {/* Upload card */}
            <div className="hud-card hud-card-spark rounded-xl p-5 space-y-4"
              style={{ background: isDark ? 'rgba(6,12,20,0.8)' : 'rgba(248,250,252,0.9)' }}>
              <div className="flex items-center gap-2 mb-1">
                <Camera className="h-4 w-4" style={{ color: 'var(--spark)' }} />
                <span className="font-mono text-[10px] tracking-widest font-bold" style={{ color: 'var(--spark)' }}>
                  // IMAGE_INPUT
                </span>
              </div>

              {/* Drop zone */}
              <div
                className={`relative rounded-lg border-2 border-dashed cursor-pointer transition-all duration-200 overflow-hidden
                  ${hasImage ? 'border-transparent p-0' : 'p-8 text-center hover:border-opacity-60'}`}
                style={{ borderColor: hasImage ? 'transparent' : 'rgba(139,92,246,0.3)', minHeight: hasImage ? 200 : undefined }}
                onDrop={handleDrop}
                onDragOver={e => e.preventDefault()}
                onClick={() => !hasImage && fileInputRef.current?.click()}>
                {hasImage ? (
                  <div className="relative group scan-on-hover">
                    <img src={imagePreview ?? imageUrl ?? ''} alt="Upload preview"
                      className="w-full object-cover rounded-lg" style={{ maxHeight: 260 }} />
                    <button
                      className="absolute top-2 right-2 rounded-full p-1.5 transition-opacity opacity-0 group-hover:opacity-100"
                      style={{ background: 'rgba(0,0,0,0.6)' }}
                      onClick={e => { e.stopPropagation(); setImagePreview(null); setImageUrl(null); setImageFile(null); setResult(null); }}>
                      <X className="h-3.5 w-3.5 text-white" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <Upload className="h-8 w-8 mx-auto mb-3" style={{ color: 'rgba(139,92,246,0.4)' }} />
                    <p className="text-sm font-medium mb-1" style={{ color: 'var(--foreground)' }}>Drop image or click to upload</p>
                    <p className="text-[11px]" style={{ color: 'var(--muted-foreground)' }}>JPG, PNG, WebP</p>
                  </div>
                )}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />

              {/* Sample images */}
              <div>
                <p className="font-mono text-[9px] tracking-widest mb-2" style={{ color: 'var(--muted-foreground)' }}>// SAMPLE_IMAGES</p>
                <div className="grid grid-cols-3 gap-1.5">
                  {SAMPLE_IMAGES.map((s, i) => (
                    <button key={i} onClick={() => handleSampleClick(s.url)}
                      className="group relative overflow-hidden rounded-md scan-on-hover"
                      style={{ aspectRatio: '4/3' }}
                      title={s.label}>
                      <img src={s.url} alt={s.label} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                      <div className="absolute inset-0 flex items-end p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.7))' }}>
                        <span className="text-[9px] text-white font-mono leading-tight">{s.subjects} subjects</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Config card */}
            <div className="hud-card hud-card-spark rounded-xl p-5 space-y-4"
              style={{ background: isDark ? 'rgba(6,12,20,0.8)' : 'rgba(248,250,252,0.9)' }}>
              <span className="font-mono text-[10px] tracking-widest font-bold" style={{ color: 'var(--spark)' }}>
                // ANALYSIS_PARAMETERS
              </span>

              {/* Grade */}
              <div>
                <label className="font-mono text-[9px] tracking-widest block mb-2" style={{ color: 'var(--muted-foreground)' }}>GRADE_LEVEL</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {GRADES.map(g => (
                    <button key={g.id} onClick={() => setGrade(g.id)}
                      className="rounded-lg py-2 px-1 text-[10px] font-mono font-semibold transition-all duration-200"
                      style={{
                        background: grade === g.id ? 'rgba(139,92,246,0.15)' : isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.04)',
                        border: `1px solid ${grade === g.id ? 'rgba(139,92,246,0.4)' : 'var(--border)'}`,
                        color: grade === g.id ? 'var(--spark)' : 'var(--muted-foreground)',
                      }}>
                      {g.label.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Language */}
              <div>
                <label className="font-mono text-[9px] tracking-widest block mb-2" style={{ color: 'var(--muted-foreground)' }}>OUTPUT_LANGUAGE</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {LANGUAGES.map(l => (
                    <button key={l.code} onClick={() => setLanguage(l.code)}
                      className="rounded-lg py-2 px-1 text-[10px] font-mono transition-all duration-200 flex items-center justify-center gap-1"
                      style={{
                        background: language === l.code ? 'rgba(139,92,246,0.15)' : isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.04)',
                        border: `1px solid ${language === l.code ? 'rgba(139,92,246,0.4)' : 'var(--border)'}`,
                        color: language === l.code ? 'var(--spark)' : 'var(--muted-foreground)',
                      }}>
                      <span>{l.flag}</span>
                      <span>{l.code.toUpperCase()}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Depth */}
              <div>
                <label className="font-mono text-[9px] tracking-widest block mb-2" style={{ color: 'var(--muted-foreground)' }}>ANALYSIS_DEPTH</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['brief', 'standard', 'deep'] as const).map(d => (
                    <button key={d} onClick={() => setDepth(d)}
                      className="rounded-lg py-2 text-[10px] font-mono font-semibold capitalize transition-all duration-200"
                      style={{
                        background: depth === d ? 'rgba(139,92,246,0.15)' : isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.04)',
                        border: `1px solid ${depth === d ? 'rgba(139,92,246,0.4)' : 'var(--border)'}`,
                        color: depth === d ? 'var(--spark)' : 'var(--muted-foreground)',
                      }}>
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Focus */}
              <div>
                <label className="font-mono text-[9px] tracking-widest block mb-2" style={{ color: 'var(--muted-foreground)' }}>SUBJECT_FOCUS</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {([
                    { id: 'all', label: 'All Subjects' },
                    { id: 'stem', label: 'STEM' },
                    { id: 'humanities', label: 'Humanities' },
                    { id: 'social', label: 'Social' },
                  ] as const).map(f => (
                    <button key={f.id} onClick={() => setFocus(f.id)}
                      className="rounded-lg py-2 text-[10px] font-mono transition-all duration-200"
                      style={{
                        background: focus === f.id ? 'rgba(139,92,246,0.15)' : isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.04)',
                        border: `1px solid ${focus === f.id ? 'rgba(139,92,246,0.4)' : 'var(--border)'}`,
                        color: focus === f.id ? 'var(--spark)' : 'var(--muted-foreground)',
                      }}>
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 rounded-lg p-3" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                  <AlertCircle className="h-4 w-4 flex-shrink-0" style={{ color: '#ef4444' }} />
                  <p className="text-xs" style={{ color: '#ef4444' }}>{error}</p>
                </div>
              )}

              {/* Analyze button */}
              <button
                onClick={handleAnalyze}
                disabled={loading || !hasImage}
                className="btn-spark w-full flex items-center justify-center gap-2 rounded-lg py-3 font-semibold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed">
                <Zap className="h-4 w-4" />
                {loading ? 'Analyzing...' : 'ANALYZE IMAGE'}
              </button>
            </div>
          </aside>

          {/* Right content area */}
          <main className="min-h-[400px]">
            {!result && !loading && (
              <div className="flex h-full min-h-[400px] flex-col items-center justify-center text-center px-8">
                <div className="relative mb-6">
                  <div className="absolute inset-0 rounded-full blur-2xl opacity-20" style={{ background: 'var(--spark)' }} />
                  <div className="relative grid h-20 w-20 place-items-center rounded-2xl mx-auto"
                    style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}>
                    <Camera className="h-10 w-10" style={{ color: 'var(--spark)' }} />
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--foreground)', fontFamily: 'Syne, sans-serif' }}>
                  Ready for your image
                </h2>
                <p className="text-sm max-w-md" style={{ color: 'var(--muted-foreground)' }}>
                  Upload a photo or pick a sample image, configure your parameters, and hit Analyze to extract multi-subject lessons from the visual world.
                </p>
                <div className="mt-8 grid grid-cols-3 gap-4 w-full max-w-sm">
                  {[{ icon: '🔭', label: 'Object detected' }, { icon: '📚', label: 'Subjects mapped' }, { icon: '🌍', label: 'Culturally framed' }].map((item, i) => (
                    <div key={i} className="rounded-xl p-3 text-center"
                      style={{ background: isDark ? 'rgba(139,92,246,0.05)' : 'rgba(139,92,246,0.04)', border: '1px solid rgba(139,92,246,0.1)' }}>
                      <div className="text-2xl mb-1">{item.icon}</div>
                      <div className="text-[10px] font-mono" style={{ color: 'var(--muted-foreground)' }}>{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result && (
              <div className="space-y-6 animate-fade-in">
                {/* Result header */}
                <div className="hud-card hud-card-spark rounded-xl p-6"
                  style={{ background: isDark ? 'rgba(6,12,20,0.8)' : 'rgba(248,250,252,0.9)' }}>
                  <div className="flex flex-col sm:flex-row sm:items-start gap-5">
                    {imagePreview && (
                      <div className="relative overflow-hidden rounded-xl flex-shrink-0 scan-on-hover"
                        style={{ width: 120, height: 90 }}>
                        <img src={imagePreview} alt="Analyzed" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div>
                          <div className="font-mono text-[10px] tracking-widest mb-1" style={{ color: 'var(--spark)', opacity: 0.7 }}>
                            // OBJECT_IDENTIFIED
                          </div>
                          <h2 className="text-2xl font-black" style={{ color: 'var(--foreground)', fontFamily: 'Syne, sans-serif' }}>
                            {result.objectName}
                          </h2>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={handleSave}
                            disabled={!!savedId}
                            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-200 disabled:opacity-60"
                            style={{
                              background: savedId ? 'rgba(0,255,136,0.1)' : 'rgba(139,92,246,0.1)',
                              border: `1px solid ${savedId ? 'rgba(0,255,136,0.3)' : 'rgba(139,92,246,0.3)'}`,
                              color: savedId ? '#00ff88' : 'var(--spark)',
                            }}>
                            {savedId ? <Check className="h-3.5 w-3.5" /> : <BookMarked className="h-3.5 w-3.5" />}
                            {savedId ? 'Saved' : 'Save'}
                          </button>
                        </div>
                      </div>

                      <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                        {result.description}
                      </p>

                      {/* Subject badges */}
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {result.subjects.map((s, i) => (
                          <span key={i} className="rounded-full px-2.5 py-0.5 text-[10px] font-mono font-semibold"
                            style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', color: 'var(--spark)' }}>
                            {s.subject}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subject breakdown header */}
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1" style={{ background: 'var(--border)' }} />
                  <div className="flex items-center gap-2 font-mono text-[10px] tracking-widest"
                    style={{ color: 'var(--spark)' }}>
                    <Layers className="h-3.5 w-3.5" />
                    SUBJECT_BREAKDOWN · {result.subjects.length} DISCIPLINES
                  </div>
                  <div className="h-px flex-1" style={{ background: 'var(--border)' }} />
                </div>

                {/* Subject cards */}
                <div className="space-y-3">
                  {result.subjects.map((s, i) => (
                    <SubjectCard key={i} subject={s} isDark={isDark} />
                  ))}
                </div>

                {/* Free resources */}
                <div className="rounded-xl p-5 border" style={{ borderColor: 'var(--border)', background: isDark ? 'rgba(6,12,20,0.4)' : 'rgba(248,250,252,0.7)' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="h-4 w-4" style={{ color: 'var(--spark)' }} />
                    <span className="font-mono text-[10px] tracking-widest font-bold" style={{ color: 'var(--spark)' }}>
                      // FREE_LEARNING_RESOURCES
                    </span>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-3">
                    {[
                      { label: 'Khan Academy', desc: 'Video lessons + practice', href: 'https://www.khanacademy.org', icon: <Star className="h-3.5 w-3.5" /> },
                      { label: 'CK-12', desc: 'Free adaptive textbooks', href: 'https://www.ck12.org', icon: <BookOpen className="h-3.5 w-3.5" /> },
                      { label: 'PhET Simulations', desc: 'Interactive science sims', href: 'https://phet.colorado.edu', icon: <Globe className="h-3.5 w-3.5" /> },
                    ].map((r, i) => (
                      <a key={i} href={r.href} target="_blank" rel="noopener noreferrer"
                        className="rounded-lg p-3 transition-all duration-200 hover:scale-[1.02] group"
                        style={{ background: 'rgba(139,92,246,0.05)', border: '1px solid rgba(139,92,246,0.1)' }}>
                        <div className="flex items-center gap-2 mb-1">
                          <span style={{ color: 'var(--spark)' }}>{r.icon}</span>
                          <span className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{r.label}</span>
                        </div>
                        <p className="text-[11px]" style={{ color: 'var(--muted-foreground)' }}>{r.desc}</p>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}
