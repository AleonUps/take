import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import {
  Upload,
  Camera,
  X,
  Sparkles,
  RefreshCw,
  ChevronDown,
  Eye,
  BookOpen,
} from "lucide-react";
import { sparkAnalyze, type SparkResult } from "@/lib/spark.functions";
import { LANGUAGES, GRADES, SUBJECTS } from "@/lib/educis";
import { SparkResultView } from "@/components/spark-result-view";
import { getCurriculum } from "@/lib/curriculum";

export const Route = createFileRoute("/spark")({
  head: () => ({
    meta: [
      { title: "SPARK — Point at anything, learn everything · EDUCIS" },
      {
        name: "description",
        content:
          "Upload a photo of anything and SPARK generates lessons across chemistry, biology, history, math, economics and more.",
      },
      { property: "og:title", content: "SPARK · EDUCIS" },
      { property: "og:description", content: "One photo. Lessons in every subject. In your language." },
    ],
  }),
  component: SparkPage,
});

function SparkPage() {
  const sparkFn = useServerFn(sparkAnalyze);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>("image/jpeg");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [thumbnailDataUrl, setThumbnailDataUrl] = useState<string | null>(null);
  const [grade, setGrade] = useState<"elementary" | "middle" | "high">("middle");
  const [lang, setLang] = useState<string>("en");
  const [depth, setDepth] = useState<number>(2);
  const [focus, setFocus] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const langInfo = LANGUAGES.find((l) => l.code === lang)!;

  // Load curriculum context from oracle
  const [careerContext, setCareerContext] = useState<string | null>(null);
  const [curriculumSubjects, setCurriculumSubjects] = useState<string[]>([]);

  useEffect(() => {
    const curriculum = getCurriculum();
    if (curriculum) {
      setCareerContext(curriculum.career);
      setCurriculumSubjects(curriculum.curriculum.map((c) => c.subject));
      // Pre-select focus subjects from curriculum
      if (curriculum.curriculum.length > 0) {
        setFocus(curriculum.curriculum.slice(0, 3).map((c) => c.subject));
      }
      // Use curriculum language/grade if set
      const langMatch = LANGUAGES.find((l) => l.code === curriculum.language);
      if (langMatch) setLang(curriculum.language);
      setGrade(curriculum.grade as typeof grade);
    }
  }, []);

  const mutation = useMutation<SparkResult>({
    mutationFn: async () => {
      if (!imageBase64) throw new Error("Upload a photo first.");
      return (await sparkFn({
        data: {
          imageBase64,
          mimeType,
          grade,
          language: lang,
          languageName: langInfo.name,
          depth,
          focusSubjects: focus.length ? focus : undefined,
        },
      })) as SparkResult;
    },
  });

  const handleFile = (file: File) => {
    if (file.size > 8 * 1024 * 1024) {
      alert("Please use an image under 8MB.");
      return;
    }
    setMimeType(file.type || "image/jpeg");
    setPreviewUrl(URL.createObjectURL(file));
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const base64 = dataUrl.split(",")[1] ?? "";
      setImageBase64(base64);
      setThumbnailDataUrl(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const reset = () => {
    setImageBase64(null);
    setPreviewUrl(null);
    setThumbnailDataUrl(null);
    mutation.reset();
  };

  return (
    <div className="mesh-spark min-h-screen" data-tool="spark">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 lg:grid-cols-[340px_1fr]">
        {/* Left panel */}
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="glass rounded-2xl p-5">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <Sparkles className="h-4 w-4 text-spark" /> SPARK
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Point at anything, learn everything.
            </p>

            {/* Career context banner */}
            {careerContext && (
              <div className="mt-3 rounded-lg border border-oracle/30 bg-oracle/10 p-3">
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-oracle mb-1">
                  <Eye className="h-3 w-3" /> From 0RACLE
                </div>
                <p className="text-xs text-foreground/80">
                  Training for <strong className="text-oracle">{careerContext}</strong> — lessons connect to your curriculum
                </p>
              </div>
            )}

            {/* Upload */}
            <label
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const f = e.dataTransfer.files?.[0];
                if (f) handleFile(f);
              }}
              className="mt-5 block cursor-pointer rounded-xl border-2 border-dashed border-spark/40 bg-spark/5 p-5 text-center transition-all hover:border-spark hover:bg-spark/10 hover:shadow-[0_0_30px_rgba(124,58,237,0.25)]"
            >
              {previewUrl ? (
                <div className="relative">
                  <img src={previewUrl} alt="preview" className="mx-auto max-h-44 rounded-lg" />
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); reset(); }}
                    className="absolute -right-2 -top-2 grid h-7 w-7 place-items-center rounded-full bg-surface-2 text-foreground hover:bg-spark"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <div>
                  <Upload className="mx-auto h-7 w-7 text-spark" />
                  <p className="mt-2 text-sm font-medium">Drag & drop or click to upload</p>
                  <p className="mt-1 text-xs text-muted-foreground">PNG, JPG up to 8MB</p>
                </div>
              )}
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
            </label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <button onClick={() => fileRef.current?.click()} className="rounded-md border border-border bg-surface-2 px-3 py-2 text-xs hover:bg-surface-2/70">
                Choose file
              </button>
              <label className="rounded-md border border-border bg-surface-2 px-3 py-2 text-center text-xs hover:bg-surface-2/70 cursor-pointer">
                <Camera className="mr-1 inline h-3 w-3" /> Camera
                <input type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
              </label>
            </div>
          </div>

          {/* Settings */}
          <div className="glass space-y-4 rounded-2xl p-5">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Grade level</p>
              <div className="space-y-1.5">
                {GRADES.map((g) => (
                  <button key={g.id} onClick={() => setGrade(g.id as typeof grade)} className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition-all ${grade === g.id ? "border-spark bg-spark/10 shadow-[0_0_20px_rgba(124,58,237,0.2)]" : "border-border bg-surface-2/40 hover:border-spark/40"}`}>
                    <div className="font-medium">{g.label}</div>
                    <div className="text-xs text-muted-foreground">{g.ages} — {g.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Language</p>
              <div className="grid grid-cols-3 gap-1.5">
                {LANGUAGES.map((l) => (
                  <button key={l.code} onClick={() => setLang(l.code)} className={`rounded-md border px-2 py-1.5 text-xs transition-all ${lang === l.code ? "border-spark bg-spark/10" : "border-border bg-surface-2/40 hover:border-spark/40"}`} title={l.name}>
                    <span className="mr-1">{l.flag}</span>{l.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Depth</p>
              <input type="range" min={1} max={3} value={depth} onChange={(e) => setDepth(Number(e.target.value))} className="w-full accent-spark" />
              <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
                <span>Quick Overview</span>
                <span>Deep Dive</span>
              </div>
            </div>

            <details className="group">
              <summary className="flex cursor-pointer items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Focus subjects {curriculumSubjects.length > 0 && <span className="text-oracle normal-case">({curriculumSubjects.length} from curriculum)</span>}
                <ChevronDown className="h-3.5 w-3.5 transition-transform group-open:rotate-180" />
              </summary>
              <div className="mt-2 grid grid-cols-2 gap-1">
                {SUBJECTS.map((s) => {
                  const active = focus.includes(s.name);
                  const fromCurriculum = curriculumSubjects.includes(s.name);
                  return (
                    <button
                      key={s.name}
                      onClick={() => setFocus((prev) => prev.includes(s.name) ? prev.filter((x) => x !== s.name) : [...prev, s.name])}
                      className={`rounded-md border px-2 py-1 text-[11px] transition-all ${active ? "border-spark bg-spark/10" : fromCurriculum ? "border-oracle/40 bg-oracle/5" : "border-border bg-surface-2/40"}`}
                    >
                      {s.name} {fromCurriculum && <span className="text-oracle">★</span>}
                    </button>
                  );
                })}
              </div>
            </details>
          </div>

          <button
            disabled={!imageBase64 || mutation.isPending}
            onClick={() => mutation.mutate()}
            className="btn-spark w-full rounded-xl px-4 py-3.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
          >
            {mutation.isPending ? "SPARKING…" : "✦ SPARK It"}
          </button>

          {/* Examples */}
          <div className="glass rounded-2xl p-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Try an example</p>
            <div className="grid grid-cols-4 gap-2">
              {EXAMPLES.map((ex) => (
                <button
                  key={ex.label}
                  onClick={async () => {
                    const r = await fetch(ex.url);
                    const blob = await r.blob();
                    const file = new File([blob], `${ex.label}.jpg`, { type: blob.type || "image/jpeg" });
                    handleFile(file);
                  }}
                  title={ex.label}
                  className="aspect-square overflow-hidden rounded-md border border-border bg-surface-2 hover:border-spark/60"
                >
                  <img src={ex.url} alt={ex.label} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Right results */}
        <section>
          {!mutation.isPending && !mutation.data && !mutation.isError && (
            <div className="glass grid min-h-[60vh] place-items-center rounded-2xl p-12 text-center">
              <div>
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-spark/15">
                  <Sparkles className="h-7 w-7 text-spark" />
                </div>
                <h3 className="mt-5 text-2xl font-semibold">Upload a photo to begin</h3>
                <p className="mt-2 max-w-md text-muted-foreground">
                  SPARK will identify the object and create lessons across multiple subjects in your language and grade level.
                  {careerContext && <span className="block mt-2 text-oracle">Connected to your curriculum for <strong>{careerContext}</strong></span>}
                </p>
              </div>
            </div>
          )}

          {mutation.isPending && <LoadingState previewUrl={previewUrl} />}

          {mutation.isError && (
            <div className="glass rounded-2xl border border-destructive/40 p-8">
              <h3 className="text-lg font-semibold text-destructive">Something went wrong</h3>
              <p className="mt-2 text-sm text-muted-foreground">{(mutation.error as Error).message}</p>
              <button onClick={() => mutation.mutate()} className="mt-4 inline-flex items-center gap-1 rounded-md border border-border bg-surface-2 px-3 py-1.5 text-sm hover:bg-surface-2/70">
                <RefreshCw className="h-3.5 w-3.5" /> Retry
              </button>
            </div>
          )}

          {mutation.data && (
            <SparkResultView
              data={mutation.data}
              previewUrl={thumbnailDataUrl ?? previewUrl}
              rtl={langInfo.rtl}
              grade={grade}
              language={lang}
              onReset={reset}
            />
          )}
        </section>
      </div>
    </div>
  );
}

function LoadingState({ previewUrl }: { previewUrl: string | null }) {
  const messages = ["Reading the chemistry…", "Tracing the history…", "Calculating the math…", "Finding the connections…", "Mapping the geography…", "Listening to the story…"];
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % messages.length), 1400);
    return () => clearInterval(t);
  }, [messages.length]);
  return (
    <div className="glass relative overflow-hidden rounded-2xl p-10 text-center min-h-[60vh] grid place-items-center">
      <div>
        <div className="relative mx-auto h-56 w-56 overflow-hidden rounded-xl border border-spark/30">
          {previewUrl && <img src={previewUrl} alt="" className="h-full w-full object-cover" />}
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-b from-spark to-transparent animate-scan" />
          <div className="absolute inset-0 bg-spark/5" />
        </div>
        <p className="mt-6 text-lg font-medium text-gradient-spark">{messages[idx]}</p>
        <div className="mx-auto mt-4 h-1 w-64 overflow-hidden rounded-full bg-surface-2">
          <div className="h-full w-1/3 animate-pulse-glow bg-gradient-to-r from-spark to-rawi" />
        </div>
      </div>
    </div>
  );
}

const EXAMPLES = [
  { label: "Coffee", url: "https://images.unsplash.com/photo-1497515114629-f71d768fd07c?w=400" },
  { label: "Medicine", url: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400" },
  { label: "Leaf", url: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=400" },
  { label: "Receipt", url: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400" },
  { label: "News", url: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400" },
  { label: "Circuit", url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400" },
  { label: "Fruit", url: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400" },
  { label: "Coin", url: "https://images.unsplash.com/photo-1518544866330-95a2bec01dab?w=400" },
];
