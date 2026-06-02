import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Upload, Camera, X, Sparkles, RefreshCw, ChevronDown, Eye } from "lucide-react";
import { sparkAnalyze, type SparkResult } from "@/lib/spark.functions";
import { LANGUAGES, GRADES, SUBJECTS } from "@/lib/educis";
import { SparkResultView } from "@/components/spark-result-view";
import { getCurriculum } from "@/lib/curriculum";

export const Route = createFileRoute("/spark")({
  head: () => ({
    meta: [
      { title: "SPARK — Point at anything, learn everything · EDUCIS" },
      { name: "description", content: "Upload a photo of anything and SPARK generates lessons across multiple subjects." },
    ],
  }),
  component: SparkPage,
});

function SparkPage() {
  const sparkFn = useServerFn(sparkAnalyze);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState("image/jpeg");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [thumbnailDataUrl, setThumbnailDataUrl] = useState<string | null>(null);
  const [grade, setGrade] = useState<"elementary" | "middle" | "high">("middle");
  const [lang, setLang] = useState("en");
  const [depth, setDepth] = useState(2);
  const [focus, setFocus] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const langInfo = LANGUAGES.find((l) => l.code === lang)!;
  const [careerContext, setCareerContext] = useState<string | null>(null);
  const [curriculumSubjects, setCurriculumSubjects] = useState<string[]>([]);

  useEffect(() => {
    const c = getCurriculum();
    if (c) {
      setCareerContext(c.career);
      setCurriculumSubjects(c.curriculum.map((s) => s.subject));
      if (c.curriculum.length > 0) setFocus(c.curriculum.slice(0, 3).map((s) => s.subject));
      const lm = LANGUAGES.find((l) => l.code === c.language);
      if (lm) setLang(c.language);
      setGrade(c.grade as typeof grade);
    }
  }, []);

  const mutation = useMutation<SparkResult>({
    mutationFn: async () => {
      if (!imageBase64) throw new Error("Upload a photo first.");
      return (await sparkFn({ data: { imageBase64, mimeType, grade, language: lang, languageName: langInfo.name, depth, focusSubjects: focus.length ? focus : undefined } })) as SparkResult;
    },
  });

  const handleFile = (file: File) => {
    if (file.size > 8 * 1024 * 1024) { alert("Please use an image under 8MB."); return; }
    setMimeType(file.type || "image/jpeg");
    setPreviewUrl(URL.createObjectURL(file));
    const r = new FileReader();
    r.onload = () => { const d = r.result as string; setImageBase64(d.split(",")[1] ?? ""); setThumbnailDataUrl(d); };
    r.readAsDataURL(file);
  };

  const reset = () => { setImageBase64(null); setPreviewUrl(null); setThumbnailDataUrl(null); mutation.reset(); };

  return (
    <div className="relative min-h-screen" style={{ background: "var(--background)" }} data-tool="spark">
      <div className="pointer-events-none absolute inset-0 tech-grid" />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-0 top-0 h-96 w-96" style={{ background: "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)" }} />
        <div className="absolute left-0 bottom-0 h-64 w-64" style={{ background: "radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 70%)" }} />
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-6 px-4 py-10 lg:grid-cols-[360px_1fr]">

        {/* PANEL */}
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">

          {/* Header */}
          <div className="hud-card hud-card-spark rounded-xl p-6" style={{ background: "rgba(6,12,20,0.9)", border: "1px solid rgba(139,92,246,0.15)" }}>
            <div className="flex items-center gap-3 mb-1">
              <div className="grid h-10 w-10 place-items-center rounded-lg" style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.25)" }}>
                <Sparkles className="h-5 w-5" style={{ color: "var(--spark)" }} />
              </div>
              <div>
                <h2 className="text-lg font-bold" style={{ color: "var(--spark)", fontFamily: "var(--font-display)" }}>SPARK</h2>
                <p className="text-xs" style={{ color: "rgba(208,228,240,0.3)", fontFamily: "var(--font-mono)" }}>// point_at_anything</p>
              </div>
            </div>

            {careerContext && (
              <div className="mt-4 rounded-lg p-3" style={{ background: "rgba(0,212,255,0.05)", border: "1px solid rgba(0,212,255,0.12)" }}>
                <div className="flex items-center gap-1.5 mb-1">
                  <Eye className="h-3 w-3" style={{ color: "var(--oracle)" }} />
                  <span className="text-xs" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.1em", color: "rgba(0,212,255,0.5)" }}>FROM::0RACLE</span>
                </div>
                <p className="text-xs" style={{ color: "rgba(208,228,240,0.55)" }}>Training for <strong style={{ color: "var(--oracle)" }}>{careerContext}</strong></p>
              </div>
            )}

            {/* Upload */}
            <label onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); }}
              className="mt-5 block cursor-pointer rounded-xl p-5 text-center transition-all"
              style={{ border: "2px dashed rgba(139,92,246,0.25)", background: "rgba(139,92,246,0.03)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.5)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 0 30px rgba(139,92,246,0.15)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.25)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
            >
              {previewUrl ? (
                <div className="relative">
                  <img src={previewUrl} alt="preview" className="mx-auto max-h-40 rounded-lg" />
                  <button type="button" onClick={(e) => { e.preventDefault(); reset(); }}
                    className="absolute -right-2 -top-2 grid h-7 w-7 place-items-center rounded-full transition-all"
                    style={{ background: "rgba(20,20,40,0.9)", border: "1px solid rgba(139,92,246,0.3)", color: "rgba(208,228,240,0.6)" }}>
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <div>
                  <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-xl" style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)" }}>
                    <Upload className="h-5 w-5" style={{ color: "var(--spark)" }} />
                  </div>
                  <p className="text-sm font-medium" style={{ color: "rgba(208,228,240,0.6)" }}>Drag & drop or click</p>
                  <p className="mt-1 text-xs" style={{ color: "rgba(208,228,240,0.25)", fontFamily: "var(--font-mono)" }}>PNG, JPG // max 8MB</p>
                </div>
              )}
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
            </label>

            <div className="mt-2 grid grid-cols-2 gap-2">
              <button onClick={() => fileRef.current?.click()} className="rounded-lg py-2 text-xs transition-all" style={{ background: "rgba(139,92,246,0.06)", border: "1px solid rgba(139,92,246,0.15)", color: "rgba(208,228,240,0.5)" }}>
                Choose file
              </button>
              <label className="cursor-pointer rounded-lg py-2 text-center text-xs transition-all" style={{ background: "rgba(139,92,246,0.06)", border: "1px solid rgba(139,92,246,0.15)", color: "rgba(208,228,240,0.5)" }}>
                <Camera className="mr-1 inline h-3 w-3" /> Camera
                <input type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
              </label>
            </div>
          </div>

          {/* Settings */}
          <div className="rounded-xl p-5 space-y-5" style={{ background: "rgba(6,12,20,0.8)", border: "1px solid rgba(139,92,246,0.08)" }}>
            <div>
              <p className="mb-2 text-xs" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.12em", color: "rgba(139,92,246,0.5)" }}>GRADE_LEVEL</p>
              <div className="space-y-1.5">
                {GRADES.map((g) => (
                  <button key={g.id} onClick={() => setGrade(g.id as typeof grade)}
                    className="w-full rounded-lg px-3 py-2 text-left text-sm transition-all"
                    style={grade === g.id ? { background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.3)", color: "var(--spark)" } : { background: "rgba(0,0,0,0.2)", border: "1px solid rgba(139,92,246,0.06)", color: "rgba(208,228,240,0.45)" }}>
                    <div className="font-medium">{g.label}</div>
                    <div className="text-xs opacity-60" style={{ fontFamily: "var(--font-mono)" }}>{g.ages}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.12em", color: "rgba(139,92,246,0.5)" }}>LANGUAGE</p>
              <div className="grid grid-cols-3 gap-1.5">
                {LANGUAGES.map((l) => (
                  <button key={l.code} onClick={() => setLang(l.code)}
                    className="rounded-lg px-2 py-1.5 text-xs transition-all"
                    style={lang === l.code ? { background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.3)", color: "var(--spark)" } : { background: "rgba(0,0,0,0.2)", border: "1px solid rgba(139,92,246,0.06)", color: "rgba(208,228,240,0.4)" }}>
                    <span className="mr-1">{l.flag}</span>{l.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <p className="text-xs" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.12em", color: "rgba(139,92,246,0.5)" }}>DEPTH</p>
                <p className="text-xs" style={{ fontFamily: "var(--font-mono)", color: "rgba(139,92,246,0.4)" }}>{["QUICK", "BALANCED", "DEEP"][depth - 1]}</p>
              </div>
              <input type="range" min={1} max={3} value={depth} onChange={(e) => setDepth(Number(e.target.value))} className="w-full" style={{ accentColor: "var(--spark)" }} />
            </div>

            <details className="group">
              <summary className="flex cursor-pointer items-center justify-between text-xs" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.12em", color: "rgba(139,92,246,0.5)" }}>
                FOCUS_SUBJECTS {curriculumSubjects.length > 0 && <span style={{ color: "rgba(0,212,255,0.5)" }}>+{curriculumSubjects.length}_CURRICULUM</span>}
                <ChevronDown className="h-3.5 w-3.5 transition-transform group-open:rotate-180" />
              </summary>
              <div className="mt-2 grid grid-cols-2 gap-1">
                {SUBJECTS.map((s) => {
                  const active = focus.includes(s.name);
                  const fromC = curriculumSubjects.includes(s.name);
                  return (
                    <button key={s.name} onClick={() => setFocus((p) => p.includes(s.name) ? p.filter((x) => x !== s.name) : [...p, s.name])}
                      className="rounded-lg px-2 py-1 text-[11px] transition-all"
                      style={active ? { background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.3)", color: "var(--spark)" } : fromC ? { background: "rgba(0,212,255,0.05)", border: "1px solid rgba(0,212,255,0.2)", color: "rgba(0,212,255,0.6)" } : { background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.04)", color: "rgba(208,228,240,0.35)" }}>
                      {s.name} {fromC && <span style={{ color: "var(--oracle)" }}>*</span>}
                    </button>
                  );
                })}
              </div>
            </details>
          </div>

          <button disabled={!imageBase64 || mutation.isPending} onClick={() => mutation.mutate()}
            className="btn-spark w-full rounded-xl py-4 text-sm disabled:cursor-not-allowed disabled:opacity-40">
            {mutation.isPending ? "SPARKING..." : "SPARK IT"}
          </button>

          {/* Examples */}
          <div className="rounded-xl p-5" style={{ background: "rgba(6,12,20,0.7)", border: "1px solid rgba(139,92,246,0.06)" }}>
            <p className="mb-3 text-xs" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.12em", color: "rgba(139,92,246,0.4)" }}>SAMPLE_IMAGES</p>
            <div className="grid grid-cols-4 gap-2">
              {EXAMPLES.map((ex) => (
                <button key={ex.label} title={ex.label}
                  onClick={async () => { const r = await fetch(ex.url); const b = await r.blob(); handleFile(new File([b], `${ex.label}.jpg`, { type: b.type || "image/jpeg" })); }}
                  className="aspect-square overflow-hidden rounded-lg transition-all"
                  style={{ border: "1px solid rgba(139,92,246,0.1)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.4)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.1)"; }}>
                  <img src={ex.url} alt={ex.label} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* RESULTS */}
        <section>
          {!mutation.isPending && !mutation.data && !mutation.isError && (
            <div className="relative grid min-h-[70vh] place-items-center overflow-hidden rounded-xl text-center" style={{ background: "rgba(6,12,20,0.8)", border: "1px solid rgba(139,92,246,0.1)" }}>
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute inset-8 rounded-full" style={{ border: "1px solid rgba(139,92,246,0.06)" }} />
                <div className="absolute inset-16 rounded-full" style={{ border: "1px solid rgba(139,92,246,0.08)" }} />
                <div className="absolute inset-24 rounded-full" style={{ border: "1px solid rgba(139,92,246,0.1)" }} />
              </div>
              <div className="relative px-8">
                <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-2xl animate-glow-spark" style={{ background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.25)" }}>
                  <Sparkles className="h-9 w-9" style={{ color: "var(--spark)" }} />
                </div>
                <p className="mb-3 text-xs" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.15em", color: "rgba(139,92,246,0.4)" }}>// AWAITING_INPUT</p>
                <h3 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>Upload a photo to begin</h3>
                <p className="mt-3 max-w-sm text-sm" style={{ color: "rgba(208,228,240,0.35)" }}>
                  SPARK identifies objects and creates lessons across multiple subjects in your language and grade level.
                </p>
                {careerContext && <p className="mt-3 text-sm" style={{ color: "rgba(0,212,255,0.6)", fontFamily: "var(--font-mono)", fontSize: "0.75rem" }}>CURRICULUM::LOADED / {careerContext}</p>}
              </div>
            </div>
          )}
          {mutation.isPending && <LoadingState previewUrl={previewUrl} />}
          {mutation.isError && (
            <div className="rounded-xl p-8" style={{ background: "rgba(255,60,60,0.05)", border: "1px solid rgba(255,60,60,0.15)" }}>
              <h3 className="text-lg font-semibold" style={{ color: "#ff8080", fontFamily: "var(--font-display)" }}>Something went wrong</h3>
              <p className="mt-2 text-sm" style={{ color: "rgba(208,228,240,0.4)", fontFamily: "var(--font-mono)" }}>{(mutation.error as Error).message}</p>
              <button onClick={() => mutation.mutate()} className="mt-4 inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm transition-all" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(208,228,240,0.5)" }}>
                <RefreshCw className="h-3.5 w-3.5" /> RETRY
              </button>
            </div>
          )}
          {mutation.data && (
            <SparkResultView data={mutation.data} previewUrl={thumbnailDataUrl ?? previewUrl} rtl={langInfo.rtl} grade={grade} language={lang} onReset={reset} />
          )}
        </section>
      </div>
    </div>
  );
}

function LoadingState({ previewUrl }: { previewUrl: string | null }) {
  const msgs = ["// reading_chemistry", "// tracing_history", "// calculating_math", "// mapping_geography", "// finding_connections", "// generating_lessons"];
  const [idx, setIdx] = useState(0);
  useEffect(() => { const t = setInterval(() => setIdx((i) => (i + 1) % msgs.length), 1400); return () => clearInterval(t); }, []);
  return (
    <div className="relative grid min-h-[70vh] place-items-center overflow-hidden rounded-xl" style={{ background: "rgba(6,12,20,0.9)", border: "1px solid rgba(139,92,246,0.2)" }}>
      <div>
        <div className="relative mx-auto h-56 w-56 overflow-hidden rounded-xl" style={{ border: "1px solid rgba(139,92,246,0.3)" }}>
          {previewUrl && <img src={previewUrl} alt="" className="h-full w-full object-cover" />}
          <div className="absolute inset-x-0 h-0.5 animate-scan" style={{ background: "linear-gradient(90deg, transparent, var(--spark), transparent)" }} />
          <div className="absolute inset-0" style={{ background: "rgba(139,92,246,0.08)" }} />
          <div className="absolute top-2 left-2 h-5 w-5" style={{ borderTop: "1px solid var(--spark)", borderLeft: "1px solid var(--spark)", opacity: 0.7 }} />
          <div className="absolute bottom-2 right-2 h-5 w-5" style={{ borderBottom: "1px solid var(--spark)", borderRight: "1px solid var(--spark)", opacity: 0.7 }} />
        </div>
        <p className="mt-6 text-center text-sm" style={{ color: "var(--spark)", fontFamily: "var(--font-mono)", letterSpacing: "0.05em" }}>{msgs[idx]}</p>
        <div className="mx-auto mt-4 h-0.5 w-48 overflow-hidden rounded-full" style={{ background: "rgba(139,92,246,0.1)" }}>
          <div className="h-full w-1/3 rounded-full animate-pulse" style={{ background: "linear-gradient(90deg, var(--spark), var(--rawi))" }} />
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
