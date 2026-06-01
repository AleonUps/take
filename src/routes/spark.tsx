import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Upload, Camera, X, Sparkles, RefreshCw, ChevronDown, Eye, BookOpen } from "lucide-react";
import { sparkAnalyze, type SparkResult } from "@/lib/spark.functions";
import { LANGUAGES, GRADES, SUBJECTS } from "@/lib/educis";
import { SparkResultView } from "@/components/spark-result-view";
import { getCurriculum } from "@/lib/curriculum";

export const Route = createFileRoute("/spark")({
  head: () => ({
    meta: [
      { title: "SPARK — Point at anything, learn everything · EDUCIS" },
      { name: "description", content: "Upload a photo of anything and SPARK generates lessons across multiple subjects." },
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
  const [careerContext, setCareerContext] = useState<string | null>(null);
  const [curriculumSubjects, setCurriculumSubjects] = useState<string[]>([]);

  useEffect(() => {
    const curriculum = getCurriculum();
    if (curriculum) {
      setCareerContext(curriculum.career);
      setCurriculumSubjects(curriculum.curriculum.map((c) => c.subject));
      if (curriculum.curriculum.length > 0) setFocus(curriculum.curriculum.slice(0, 3).map((c) => c.subject));
      const langMatch = LANGUAGES.find((l) => l.code === curriculum.language);
      if (langMatch) setLang(curriculum.language);
      setGrade(curriculum.grade as typeof grade);
    }
  }, []);

  const mutation = useMutation<SparkResult>({
    mutationFn: async () => {
      if (!imageBase64) throw new Error("Upload a photo first.");
      return (await sparkFn({
        data: { imageBase64, mimeType, grade, language: lang, languageName: langInfo.name, depth, focusSubjects: focus.length ? focus : undefined },
      })) as SparkResult;
    },
  });

  const handleFile = (file: File) => {
    if (file.size > 8 * 1024 * 1024) { alert("Please use an image under 8MB."); return; }
    setMimeType(file.type || "image/jpeg");
    setPreviewUrl(URL.createObjectURL(file));
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setImageBase64(dataUrl.split(",")[1] ?? "");
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
    <div className="relative min-h-screen bg-[#080810] overflow-hidden">
      {/* SPARK identity background — orange/purple energy */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(124,58,237,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(124,58,237,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-spark/8 blur-[120px]" />
        <div className="absolute left-0 bottom-0 h-64 w-64 rounded-full bg-spark/5 blur-[100px]" />
        <div className="absolute left-1/2 top-1/2 h-48 w-48 rounded-full bg-rawi/5 blur-[80px]" />
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-6 px-4 py-10 lg:grid-cols-[360px_1fr]">

        {/* LEFT PANEL */}
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">

          {/* Header card */}
          <div className="relative overflow-hidden rounded-2xl border border-spark/20 bg-gradient-to-b from-spark/10 to-spark/5 p-6">
            <div className="absolute top-2 left-2 h-3 w-3 border-t border-l border-spark/50" />
            <div className="absolute top-2 right-2 h-3 w-3 border-t border-r border-spark/50" />
            <div className="flex items-center gap-3 mb-2">
              <div className="grid h-10 w-10 place-items-center rounded-xl border border-spark/30 bg-spark/15">
                <Sparkles className="h-5 w-5 text-spark" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-spark">SPARK</h2>
                <p className="text-xs text-white/40">Point at anything, learn everything</p>
              </div>
            </div>

            {careerContext && (
              <div className="mt-3 rounded-lg border border-oracle/20 bg-oracle/8 p-3">
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-oracle mb-1">
                  <Eye className="h-3 w-3" /> From 0RACLE
                </div>
                <p className="text-xs text-white/60">
                  Training for <strong className="text-oracle">{careerContext}</strong>
                </p>
              </div>
            )}

            {/* Upload zone */}
            <label
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); }}
              className="mt-4 block cursor-pointer rounded-xl border-2 border-dashed border-spark/30 bg-spark/5 p-5 text-center transition-all hover:border-spark/60 hover:bg-spark/10 hover:shadow-[0_0_30px_rgba(124,58,237,0.2)]"
            >
              {previewUrl ? (
                <div className="relative">
                  <img src={previewUrl} alt="preview" className="mx-auto max-h-40 rounded-lg" />
                  <button type="button" onClick={(e) => { e.preventDefault(); reset(); }}
                    className="absolute -right-2 -top-2 grid h-7 w-7 place-items-center rounded-full bg-white/10 border border-white/20 text-white hover:bg-spark/40 transition-all">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <div>
                  <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-xl border border-spark/30 bg-spark/15">
                    <Upload className="h-6 w-6 text-spark" />
                  </div>
                  <p className="text-sm font-medium text-white/70">Drag & drop or click</p>
                  <p className="mt-1 text-xs text-white/30">PNG, JPG up to 8MB</p>
                </div>
              )}
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
            </label>

            <div className="mt-2 grid grid-cols-2 gap-2">
              <button onClick={() => fileRef.current?.click()} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/60 hover:bg-white/10 transition-all">
                Choose file
              </button>
              <label className="cursor-pointer rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-center text-xs text-white/60 hover:bg-white/10 transition-all">
                <Camera className="mr-1 inline h-3 w-3" /> Camera
                <input type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
              </label>
            </div>
          </div>

          {/* Settings */}
          <div className="rounded-2xl border border-white/10 bg-white/3 p-5 space-y-5">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-white/30">Grade level</p>
              <div className="space-y-1.5">
                {GRADES.map((g) => (
                  <button key={g.id} onClick={() => setGrade(g.id as typeof grade)}
                    className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition-all ${grade === g.id ? "border-spark/40 bg-spark/10 text-spark" : "border-white/10 bg-white/5 text-white/60 hover:border-spark/20"}`}>
                    <div className="font-medium">{g.label}</div>
                    <div className="text-xs opacity-60">{g.ages}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-white/30">Language</p>
              <div className="grid grid-cols-3 gap-1.5">
                {LANGUAGES.map((l) => (
                  <button key={l.code} onClick={() => setLang(l.code)}
                    className={`rounded-lg border px-2 py-1.5 text-xs transition-all ${lang === l.code ? "border-spark/40 bg-spark/10 text-spark" : "border-white/10 bg-white/5 text-white/50 hover:border-spark/20"}`}>
                    <span className="mr-1">{l.flag}</span>{l.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-white/30">Depth</p>
              <input type="range" min={1} max={3} value={depth} onChange={(e) => setDepth(Number(e.target.value))} className="w-full accent-spark" />
              <div className="mt-1 flex justify-between text-[10px] text-white/30">
                <span>Quick</span><span>Deep Dive</span>
              </div>
            </div>

            <details className="group">
              <summary className="flex cursor-pointer items-center justify-between text-xs font-semibold uppercase tracking-widest text-white/30">
                Focus subjects
                {curriculumSubjects.length > 0 && <span className="text-oracle normal-case text-[10px]">({curriculumSubjects.length} from curriculum)</span>}
                <ChevronDown className="h-3.5 w-3.5 transition-transform group-open:rotate-180" />
              </summary>
              <div className="mt-2 grid grid-cols-2 gap-1">
                {SUBJECTS.map((s) => {
                  const active = focus.includes(s.name);
                  const fromCurriculum = curriculumSubjects.includes(s.name);
                  return (
                    <button key={s.name}
                      onClick={() => setFocus((prev) => prev.includes(s.name) ? prev.filter((x) => x !== s.name) : [...prev, s.name])}
                      className={`rounded-lg border px-2 py-1 text-[11px] transition-all ${active ? "border-spark/40 bg-spark/10 text-spark" : fromCurriculum ? "border-oracle/30 bg-oracle/8 text-oracle/80" : "border-white/10 bg-white/5 text-white/40"}`}>
                      {s.name} {fromCurriculum && <span className="text-oracle">★</span>}
                    </button>
                  );
                })}
              </div>
            </details>
          </div>

          {/* SPARK button */}
          <button
            disabled={!imageBase64 || mutation.isPending}
            onClick={() => mutation.mutate()}
            className="w-full rounded-xl bg-spark py-4 text-sm font-bold text-white transition-all hover:bg-spark/90 hover:shadow-[0_0_40px_rgba(124,58,237,0.4)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {mutation.isPending ? "SPARKING..." : "SPARK It"}
          </button>

          {/* Examples */}
          <div className="rounded-2xl border border-white/10 bg-white/3 p-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/30">Try an example</p>
            <div className="grid grid-cols-4 gap-2">
              {EXAMPLES.map((ex) => (
                <button key={ex.label}
                  onClick={async () => {
                    const r = await fetch(ex.url);
                    const blob = await r.blob();
                    handleFile(new File([blob], `${ex.label}.jpg`, { type: blob.type || "image/jpeg" }));
                  }}
                  title={ex.label}
                  className="aspect-square overflow-hidden rounded-lg border border-white/10 hover:border-spark/40 transition-all">
                  <img src={ex.url} alt={ex.label} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* RIGHT — Results */}
        <section>
          {!mutation.isPending && !mutation.data && !mutation.isError && (
            <div className="relative grid min-h-[70vh] place-items-center overflow-hidden rounded-2xl border border-white/10 bg-white/3 p-12 text-center">
              {/* Decorative rings */}
              <div className="pointer-events-none absolute inset-0 grid place-items-center">
                <div className="h-64 w-64 rounded-full border border-spark/10" />
              </div>
              <div className="pointer-events-none absolute inset-0 grid place-items-center">
                <div className="h-48 w-48 rounded-full border border-spark/15" />
              </div>
              <div className="relative">
                <div className="mx-auto grid h-20 w-20 place-items-center rounded-2xl border border-spark/30 bg-gradient-to-b from-spark/20 to-spark/5">
                  <Sparkles className="h-9 w-9 text-spark" />
                </div>
                <h3 className="mt-6 text-2xl font-bold text-white">Upload a photo to begin</h3>
                <p className="mt-3 max-w-md text-white/40">
                  SPARK identifies objects and creates lessons across multiple subjects in your language and grade level.
                </p>
                {careerContext && (
                  <p className="mt-3 text-sm text-oracle">
                    Connected to your curriculum for <strong>{careerContext}</strong>
                  </p>
                )}
              </div>
            </div>
          )}

          {mutation.isPending && <LoadingState previewUrl={previewUrl} />}

          {mutation.isError && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8">
              <h3 className="text-lg font-semibold text-red-400">Something went wrong</h3>
              <p className="mt-2 text-sm text-white/40">{(mutation.error as Error).message}</p>
              <button onClick={() => mutation.mutate()} className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/60 hover:bg-white/10 transition-all">
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
  const messages = ["Reading the chemistry...", "Tracing the history...", "Calculating the math...", "Finding the connections...", "Mapping the geography...", "Listening to the story..."];
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % messages.length), 1400);
    return () => clearInterval(t);
  }, [messages.length]);
  return (
    <div className="relative grid min-h-[70vh] place-items-center overflow-hidden rounded-2xl border border-spark/20 bg-gradient-to-b from-spark/10 to-spark/5 p-10 text-center">
      <div>
        <div className="relative mx-auto h-56 w-56 overflow-hidden rounded-xl border border-spark/30">
          {previewUrl && <img src={previewUrl} alt="" className="h-full w-full object-cover" />}
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-b from-spark to-transparent animate-scan" />
          <div className="absolute inset-0 bg-spark/5" />
          {/* Scan line */}
          <div className="absolute inset-x-0 h-0.5 bg-spark/60 animate-[scan_2s_linear_infinite]" style={{ top: "50%" }} />
        </div>
        <p className="mt-6 text-lg font-semibold text-spark">{messages[idx]}</p>
        <div className="mx-auto mt-4 h-1 w-64 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-1/3 animate-pulse bg-gradient-to-r from-spark to-rawi rounded-full" />
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
