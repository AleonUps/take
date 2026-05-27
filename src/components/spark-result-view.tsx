import { Link } from "@tanstack/react-router";
import { Printer, Share2, RefreshCw, ArrowRight, BookmarkPlus, BookmarkCheck, Lightbulb } from "lucide-react";
import { useState } from "react";
import type { SparkResult } from "@/lib/spark.functions";
import { subjectColor } from "@/lib/educis";
import { saveToLibrary } from "@/lib/library";

function boldFirstSentence(text: string) {
  const match = text.match(/^([^.!?]+[.!?])(\s*)([\s\S]*)$/);
  if (!match) return { first: text, rest: "" };
  return { first: match[1], rest: match[3] };
}

function highlightKeyTerms(text: string, terms: string[], color: string) {
  if (!terms.length) return <>{text}</>;
  const used = new Set<string>();
  const sorted = [...new Set(terms.map((t) => t.trim()).filter((t) => t.length > 2))].sort(
    (a, b) => b.length - a.length,
  );
  const escaped = sorted.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  if (!escaped.length) return <>{text}</>;
  const re = new RegExp(`\\b(${escaped.join("|")})\\b`, "i");
  const parts: Array<string | { term: string }> = [];
  let remaining = text;
  let safety = 0;
  while (remaining && safety++ < 200) {
    const m = remaining.match(re);
    if (!m || m.index === undefined) {
      parts.push(remaining);
      break;
    }
    if (m.index > 0) parts.push(remaining.slice(0, m.index));
    const matched = m[0];
    const lc = matched.toLowerCase();
    if (used.has(lc)) {
      parts.push(matched);
    } else {
      used.add(lc);
      parts.push({ term: matched });
    }
    remaining = remaining.slice(m.index + matched.length);
  }
  return (
    <>
      {parts.map((p, i) =>
        typeof p === "string" ? (
          <span key={i}>{p}</span>
        ) : (
          <strong
            key={i}
            className="font-semibold"
            style={{ background: `${color}22`, color, padding: "0 3px", borderRadius: 3 }}
          >
            {p.term}
          </strong>
        ),
      )}
    </>
  );
}

export function SparkResultView({
  data,
  previewUrl,
  rtl,
  grade,
  language,
  onReset,
  hideSave,
}: {
  data: SparkResult;
  previewUrl: string | null;
  rtl: boolean;
  grade: "elementary" | "middle" | "high";
  language: string;
  onReset?: () => void;
  hideSave?: boolean;
}) {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (saved) return;
    saveToLibrary({
      kind: "spark",
      thumbnail: previewUrl ?? "",
      grade,
      language,
      result: data,
    });
    setSaved(true);
  };

  return (
    <div dir={rtl ? "rtl" : "ltr"} className="space-y-5">
      {/* Identification card */}
      <div className="glass border-gradient-brand rounded-2xl p-6 animate-fade-up">
        <div className="flex items-start gap-4">
          {previewUrl && (
            <img src={previewUrl} alt="" className="h-24 w-24 rounded-lg object-cover" />
          )}
          <div className="flex-1">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Detected</p>
            <h2 className="mt-1 text-3xl font-bold">{data.objectName}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{data.objectDescription}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {data.detectedMaterials.map((m) => (
                <span
                  key={m}
                  className="rounded-full border border-spark/30 bg-spark/10 px-2.5 py-0.5 text-xs text-spark"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Subject masonry */}
      <div className="columns-1 gap-5 md:columns-2 space-y-5">
        {data.subjects.map((s, i) => {
          const color = subjectColor(s.subject);
          const terms = [
            ...(s.highlight ? s.highlight.split(/[\s,;:()=]+/) : []),
            ...(s.didYouKnow ? s.didYouKnow.split(/[\s,;:()]+/).filter((w) => /^[A-Z]/.test(w)) : []),
          ];
          return (
            <article
              key={i}
              className="glass card-hover break-inside-avoid rounded-2xl p-6 animate-fade-up"
              style={{ animationDelay: `${i * 80}ms`, borderTop: `2px solid ${color}` }}
            >
              <div className="flex items-center justify-between">
                <span
                  className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                  style={{ background: `${color}22`, color }}
                >
                  {s.subject}
                </span>
              </div>
              <h3 className="mt-3 text-xl font-semibold leading-snug">{s.lessonTitle}</h3>
              <div className="mt-3 space-y-3 text-foreground/85">
                {s.lesson.split(/\n\n+/).map((p, j) => {
                  const { first, rest } = boldFirstSentence(p);
                  return (
                    <p key={j} className="text-sm leading-relaxed">
                      <strong className="font-semibold text-foreground">{first}</strong>
                      {rest && " "}
                      {rest && highlightKeyTerms(rest, terms, color)}
                    </p>
                  );
                })}
              </div>

              {s.highlight && (
                <div
                  className="mt-4 rounded-xl border p-4"
                  style={{
                    borderColor: `${color}66`,
                    background: `linear-gradient(135deg, ${color}1a, ${color}05)`,
                    boxShadow: `inset 0 0 0 1px ${color}22`,
                  }}
                >
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest" style={{ color }}>
                    <span>✦</span> Key
                  </div>
                  <p className="mt-1.5 font-mono text-sm" style={{ color }}>
                    {s.highlight}
                  </p>
                </div>
              )}

              {s.didYouKnow && (
                <div
                  className="mt-3 rounded-lg bg-surface-2/80 p-4 text-sm shadow-inner"
                  style={{ borderTop: `2px solid ${color}` }}
                >
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    <Lightbulb className="h-3 w-3" style={{ color }} />
                    Did you know?
                  </div>
                  <p className="mt-1.5 text-foreground/90 italic">{s.didYouKnow}</p>
                </div>
              )}

              <div className="mt-4 space-y-2">
                {s.practiceQuestions.map((q, k) => (
                  <details key={k} className="group rounded-lg border border-border bg-surface-2/40 p-3">
                    <summary className="cursor-pointer text-sm font-medium">
                      Q{k + 1}. {q.question}
                    </summary>
                    <p className="mt-2 text-sm text-muted-foreground">{q.answer}</p>
                  </details>
                ))}
              </div>

              <div className="mt-5 border-t border-border/60 pt-4">
                <Link
                  to="/rawi"
                  search={
                    {
                      concept: s.lessonTitle,
                      grade,
                      lang: language,
                      fromObject: data.objectName,
                      fromSubject: s.subject,
                    } as never
                  }
                  className="inline-flex items-center gap-1.5 rounded-md border border-rawi/40 bg-rawi/5 px-3 py-1.5 text-xs font-medium text-rawi transition-all hover:bg-rawi/15 hover:shadow-[0_0_18px_rgba(201,168,76,0.3)]"
                >
                  ✦ Learn this through my world <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      {/* Footer actions */}
      <div className="no-print flex flex-wrap gap-2 pt-2">
        {!hideSave && (
          <button
            onClick={handleSave}
            disabled={saved}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm transition-all ${
              saved
                ? "border-spark/60 bg-spark/15 text-spark"
                : "border-border bg-surface-2 hover:bg-surface-2/70"
            }`}
          >
            {saved ? <BookmarkCheck className="h-3.5 w-3.5" /> : <BookmarkPlus className="h-3.5 w-3.5" />}
            {saved ? "Saved to Library" : "Save to Library"}
          </button>
        )}
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface-2 px-4 py-2 text-sm hover:bg-surface-2/70"
        >
          <Printer className="h-3.5 w-3.5" /> Print all
        </button>
        <button
          onClick={() => {
            navigator.clipboard.writeText(window.location.origin + "/spark");
          }}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface-2 px-4 py-2 text-sm hover:bg-surface-2/70"
          title="Results are not stored server-side; this copies the SPARK page URL"
        >
          <Share2 className="h-3.5 w-3.5" /> Share
        </button>
        {onReset && (
          <button
            onClick={onReset}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface-2 px-4 py-2 text-sm hover:bg-surface-2/70"
          >
            <RefreshCw className="h-3.5 w-3.5" /> SPARK something else
          </button>
        )}
      </div>
    </div>
  );
}
