import { useMemo, useState } from "react";
import {
  Printer,
  Share2,
  ChevronDown,
  BookmarkPlus,
  BookmarkCheck,
  ArrowDownCircle,
  ArrowUpCircle,
  Loader2,
} from "lucide-react";
import type { RawiResult } from "@/lib/rawi.functions";
import { saveToLibrary } from "@/lib/library";

type Country = { code: string; name: string; flag: string; region: string };

function Divider() {
  return (
    <div className="no-print my-8 flex items-center gap-3 text-rawi/60">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-rawi/40 to-transparent" />
      <span className="text-sm">✦</span>
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-rawi/40 to-transparent" />
    </div>
  );
}

function PullQuote({ text }: { text: string }) {
  return (
    <blockquote className="my-8 rounded-2xl border border-rawi/30 bg-rawi/5 px-8 py-7 text-center">
      <div className="flex items-center justify-center gap-3 text-rawi/80">
        <span className="h-px w-12 bg-rawi/50" />
        <span className="text-sm">✦</span>
        <span className="h-px w-12 bg-rawi/50" />
      </div>
      <p className="mt-4 font-serif text-2xl italic leading-snug text-foreground md:text-3xl">
        "{text}"
      </p>
      <div className="mt-4 flex items-center justify-center gap-3 text-rawi/80">
        <span className="h-px w-12 bg-rawi/50" />
        <span className="text-sm">✦</span>
        <span className="h-px w-12 bg-rawi/50" />
      </div>
    </blockquote>
  );
}

function extractLocalTerms(data: RawiResult): string[] {
  const text = [
    data.culturalHook,
    data.culturalConnection,
    ...data.examples.map((e) => `${e.title} ${e.localContext}`),
  ].join(" ");
  const matches = text.match(/\b[A-Z][a-zA-Zà-ÿ'’-]{2,}(?:\s+[A-Z][a-zA-Zà-ÿ'’-]{2,}){0,2}\b/g) ?? [];
  const stop = new Set([
    "The", "This", "That", "These", "Those", "When", "Where", "While", "After", "Before",
    "Every", "Their", "Then", "Some", "Many", "From", "With", "Without", "And", "But",
    "Also", "About", "Across", "Around", "Each", "Today", "Yesterday", "Tomorrow",
  ]);
  return Array.from(new Set(matches.filter((m) => !stop.has(m) && m.length > 2)));
}

function decoratedParagraph(
  text: string,
  terms: string[],
  countryName: string,
  isFirstOfArticle: boolean,
) {
  const escaped = terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const re = escaped.length ? new RegExp(`(${escaped.join("|")})`, "g") : null;

  // bold first sentence
  const sentenceMatch = text.match(/^([^.!?…]+[.!?…])(\s*)([\s\S]*)$/);
  const first = sentenceMatch ? sentenceMatch[1] : text;
  const rest = sentenceMatch ? sentenceMatch[3] : "";

  const renderChunk = (chunk: string, keyPrefix: string) => {
    if (!re) return <span key={keyPrefix}>{chunk}</span>;
    const parts = chunk.split(re);
    return parts.map((p, i) =>
      terms.includes(p) ? (
        <span
          key={`${keyPrefix}-${i}`}
          title={`Local reference — ${countryName}`}
          className="cursor-help border-b border-rawi/60 text-foreground decoration-rawi"
        >
          {p}
        </span>
      ) : (
        <span key={`${keyPrefix}-${i}`}>{p}</span>
      ),
    );
  };

  return (
    <p className="mb-6 font-serif text-lg leading-relaxed text-foreground/90">
      {isFirstOfArticle && first ? (
        <>
          <span
            className="float-left mr-3 mt-1 font-serif text-6xl font-bold leading-none text-rawi"
            style={{ lineHeight: "0.85" }}
          >
            {first.charAt(0)}
          </span>
          <strong className="font-semibold text-foreground">{first.slice(1)}</strong>
        </>
      ) : (
        <strong className="font-semibold text-foreground">{first}</strong>
      )}
      {rest && " "}
      {rest && renderChunk(rest, "r")}
    </p>
  );
}

export function RawiResultView({
  data,
  country,
  rtl,
  showComparison: showComparisonProp,
  onToggleComparison,
  onAdjustDifficulty,
  adjusting,
  adjustedDirection,
  hideSave,
}: {
  data: RawiResult;
  country: Country;
  rtl: boolean;
  showComparison?: boolean;
  onToggleComparison?: () => void;
  onAdjustDifficulty?: (dir: "simpler" | "harder") => void;
  adjusting?: boolean;
  adjustedDirection?: "simpler" | "harder" | null;
  hideSave?: boolean;
}) {
  const [localOpen, setLocalOpen] = useState(false);
  const showComparison = showComparisonProp ?? localOpen;
  const toggleComparison = onToggleComparison ?? (() => setLocalOpen((s) => !s));
  const [saved, setSaved] = useState(false);

  const terms = useMemo(() => extractLocalTerms(data), [data]);

  const paragraphs = useMemo(() => data.storyLesson.split(/\n\n+/), [data.storyLesson]);
  const pullIndex = Math.max(1, Math.floor(paragraphs.length / 2));

  const handleSave = () => {
    if (saved) return;
    saveToLibrary({
      kind: "rawi",
      concept: data.conceptTitle,
      countryCode: country.code,
      countryFlag: country.flag,
      countryName: country.name,
      grade: "middle", // overridden at call site if needed
      language: rtl ? "ar" : "en",
      languageName: rtl ? "العربية" : "English",
      result: data,
    });
    setSaved(true);
  };

  return (
    <article dir={rtl ? "rtl" : "ltr"} className="space-y-2">
      {/* Header */}
      <header className="glass border-gradient-brand rounded-2xl p-8 animate-fade-up">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1 rounded-full border border-rawi/30 bg-rawi/10 px-2 py-0.5 text-rawi">
            {country.flag} {country.name}
          </span>
          <div className="flex items-center gap-2">
            {adjustedDirection && (
              <span className="inline-flex items-center gap-1 rounded-full border border-rawi/40 bg-rawi/10 px-2 py-0.5 text-rawi">
                Adjusted {adjustedDirection === "simpler" ? "↓" : "↑"}
              </span>
            )}
            <span>{data.readingTimeMinutes} min read</span>
          </div>
        </div>
        <h1 className="mt-3 font-serif text-4xl font-semibold md:text-5xl">{data.conceptTitle}</h1>
        <p className="mt-4 font-serif text-lg italic text-rawi">"{data.culturalHook}"</p>
        <div className="no-print mt-5 flex flex-wrap gap-2">
          {!hideSave && (
            <button
              onClick={handleSave}
              disabled={saved}
              className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs transition-all ${
                saved
                  ? "border-rawi/60 bg-rawi/15 text-rawi"
                  : "border-border bg-surface-2 hover:bg-surface-2/70"
              }`}
            >
              {saved ? <BookmarkCheck className="h-3 w-3" /> : <BookmarkPlus className="h-3 w-3" />}
              {saved ? "Saved" : "Save to Library"}
            </button>
          )}
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface-2 px-3 py-1.5 text-xs hover:bg-surface-2/70"
          >
            <Printer className="h-3 w-3" /> Print
          </button>
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
            }}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface-2 px-3 py-1.5 text-xs hover:bg-surface-2/70"
          >
            <Share2 className="h-3 w-3" /> Share
          </button>
        </div>
      </header>

      {/* Story */}
      <section className="glass relative rounded-2xl p-8 md:p-10">
        {adjusting && (
          <div className="absolute inset-0 z-10 grid place-items-center rounded-2xl bg-background/60 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-sm text-rawi">
              <Loader2 className="h-4 w-4 animate-spin" /> Rewriting…
            </div>
          </div>
        )}
        <div className={`transition-opacity duration-500 ${adjusting ? "opacity-30" : "opacity-100"}`}>
          {paragraphs.map((p, i) => (
            <div key={i} className="animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
              {decoratedParagraph(p, terms, country.name, i === 0)}
              {i === pullIndex && data.pullQuote && <PullQuote text={data.pullQuote} />}
            </div>
          ))}
        </div>

        {onAdjustDifficulty && (
          <div className="no-print mt-6 flex flex-wrap items-center gap-2 border-t border-border/60 pt-5">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">
              Adjust difficulty:
            </span>
            <button
              onClick={() => onAdjustDifficulty("simpler")}
              disabled={adjusting}
              className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs transition-all disabled:opacity-50 ${
                adjustedDirection === "simpler"
                  ? "border-rawi bg-rawi/15 text-rawi shadow-[0_0_18px_rgba(201,168,76,0.3)]"
                  : "border-border bg-surface-2 hover:border-rawi/50"
              }`}
            >
              <ArrowDownCircle className="h-3 w-3" /> Make it simpler
            </button>
            <button
              onClick={() => onAdjustDifficulty("harder")}
              disabled={adjusting}
              className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs transition-all disabled:opacity-50 ${
                adjustedDirection === "harder"
                  ? "border-rawi bg-rawi/15 text-rawi shadow-[0_0_18px_rgba(201,168,76,0.3)]"
                  : "border-border bg-surface-2 hover:border-rawi/50"
              }`}
            >
              <ArrowUpCircle className="h-3 w-3" /> Make it harder
            </button>
          </div>
        )}
      </section>

      <Divider />

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

      <Divider />

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

      <Divider />

      {/* Practice */}
      <section>
        <h2 className="text-2xl font-semibold">Practice problems</h2>
        <div className={`mt-4 space-y-3 transition-opacity duration-500 ${adjusting ? "opacity-30" : "opacity-100"}`}>
          {data.practiceProblems.map((p, i) => (
            <details key={i} className="glass group rounded-xl p-5">
              <summary className="cursor-pointer text-base font-medium">
                <span className="mr-2 text-rawi">Problem {i + 1}.</span>
                {p.question}
              </summary>
              <div className="mt-3 space-y-2 text-sm">
                <p className="text-muted-foreground">
                  <span className="font-semibold">Hint:</span> {p.hint}
                </p>
                <p>
                  <span className="font-semibold text-rawi">Answer:</span> {p.answer}
                </p>
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Comparison */}
      <section className="no-print pt-4">
        <button
          onClick={toggleComparison}
          className="flex w-full items-center justify-between glass rounded-xl px-5 py-4 text-left"
        >
          <span className="text-sm font-medium">Compare: textbook version vs. RAWI version</span>
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
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-rawi">
                RAWI in {country.name}
              </p>
              <p className="font-serif text-sm italic text-foreground/90">"{data.culturalHook}"</p>
            </div>
          </div>
        )}
      </section>
    </article>
  );
}
