import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, BookMarked, X, ArrowRight, ImageIcon } from "lucide-react";
import { useLibrary, deleteFromLibrary, type SparkEntry, type RawiEntry } from "@/lib/library";
import { GRADES } from "@/lib/educis";

export const Route = createFileRoute("/library")({
  head: () => ({
    meta: [
      { title: "Library — Your saved lessons · EDUCIS" },
      { name: "description", content: "Every SPARK and RAWI lesson you've saved, in one place." },
      { property: "og:title", content: "EDUCIS · Library" },
    ],
  }),
  component: LibraryPage,
});

function LibraryPage() {
  const items = useLibrary();
  const [tab, setTab] = useState<"spark" | "rawi">("spark");
  const sparkItems = items.filter((i): i is SparkEntry => i.kind === "spark");
  const rawiItems = items.filter((i): i is RawiEntry => i.kind === "rawi");

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <header className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-rawi/40 bg-rawi/10 px-3 py-1 text-xs text-rawi">
            <BookMarked className="h-3 w-3" /> Library
          </div>
          <h1 className="mt-4 font-serif text-4xl font-semibold md:text-5xl">
            Your saved <span className="text-gradient-brand italic">lessons</span>
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {items.length} saved · stored locally on this device
          </p>
        </header>

        <div className="mt-8 flex justify-center gap-2">
          <button
            onClick={() => setTab("spark")}
            className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
              tab === "spark"
                ? "border-spark bg-spark/10 text-spark"
                : "border-border bg-surface-2/40 text-muted-foreground hover:border-spark/40"
            }`}
          >
            <Sparkles className="mr-1.5 inline h-3.5 w-3.5" />
            SPARK saves ({sparkItems.length})
          </button>
          <button
            onClick={() => setTab("rawi")}
            className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
              tab === "rawi"
                ? "border-rawi bg-rawi/10 text-rawi"
                : "border-border bg-surface-2/40 text-muted-foreground hover:border-rawi/40"
            }`}
          >
            <BookMarked className="mr-1.5 inline h-3.5 w-3.5" />
            RAWI saves ({rawiItems.length})
          </button>
        </div>

        <div className="mt-10">
          {tab === "spark" ? <SparkGrid items={sparkItems} /> : <RawiGrid items={rawiItems} />}
        </div>
      </div>
    </div>
  );
}

function SparkGrid({ items }: { items: SparkEntry[] }) {
  if (items.length === 0)
    return (
      <EmptyState
        message="Nothing sparked yet."
        ctaHref="/spark"
        ctaLabel="Upload your first photo"
      />
    );
  return (
    <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
      {items.map((it) => (
        <article
          key={it.id}
          className="glass card-hover group relative overflow-hidden rounded-2xl animate-fade-up"
        >
          <button
            onClick={() => deleteFromLibrary(it.id)}
            className="absolute right-2 top-2 z-10 grid h-7 w-7 place-items-center rounded-full bg-surface-2/80 text-foreground/70 opacity-0 transition hover:bg-destructive hover:text-white group-hover:opacity-100"
            aria-label="Delete"
          >
            <X className="h-3.5 w-3.5" />
          </button>
          <Link
            to="/library/$id"
            params={{ id: it.id }}
            className="block"
          >
            <div className="relative h-44 w-full overflow-hidden bg-surface-2">
              {it.thumbnail ? (
                <img src={it.thumbnail} alt={it.result.objectName} className="h-full w-full object-cover" />
              ) : (
                <div className="grid h-full place-items-center text-muted-foreground">
                  <ImageIcon className="h-8 w-8" />
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background/90 to-transparent" />
              <span className="absolute right-3 bottom-3 rounded-full border border-spark/40 bg-spark/15 px-2 py-0.5 text-xs text-spark">
                {it.result.subjects.length} subjects
              </span>
            </div>
            <div className="p-4">
              <h3 className="truncate text-base font-semibold">{it.result.objectName}</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                {new Date(it.savedAt).toLocaleDateString()} · {it.grade}
              </p>
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
}

function RawiGrid({ items }: { items: RawiEntry[] }) {
  if (items.length === 0)
    return (
      <EmptyState
        message="No lessons saved yet."
        ctaHref="/rawi"
        ctaLabel="Generate your first lesson"
      />
    );
  return (
    <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
      {items.map((it) => {
        const gradeLabel = GRADES.find((g) => g.id === it.grade)?.label ?? it.grade;
        return (
          <article
            key={it.id}
            className="glass card-hover group relative rounded-2xl p-5 animate-fade-up"
          >
            <button
              onClick={() => deleteFromLibrary(it.id)}
              className="absolute right-2 top-2 z-10 grid h-7 w-7 place-items-center rounded-full bg-surface-2/80 text-foreground/70 opacity-0 transition hover:bg-destructive hover:text-white group-hover:opacity-100"
              aria-label="Delete"
            >
              <X className="h-3.5 w-3.5" />
            </button>
            <Link to="/library/$id" params={{ id: it.id }} className="block">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="text-lg">{it.countryFlag}</span>
                <span>{it.countryName}</span>
                <span className="ml-auto rounded-full border border-rawi/30 bg-rawi/10 px-2 py-0.5 text-[10px] text-rawi">
                  {gradeLabel}
                </span>
              </div>
              <h3 className="mt-3 font-serif text-lg font-semibold leading-snug">
                {it.result.conceptTitle}
              </h3>
              <p className="mt-2 line-clamp-3 font-serif text-sm italic text-rawi/90">
                "{it.result.culturalHook}"
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs text-rawi">
                Open lesson <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          </article>
        );
      })}
    </div>
  );
}

function EmptyState({
  message,
  ctaHref,
  ctaLabel,
}: {
  message: string;
  ctaHref: "/spark" | "/rawi";
  ctaLabel: string;
}) {
  const navigate = useNavigate();
  return (
    <div className="glass mx-auto max-w-md rounded-2xl p-10 text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-surface-2">
        <BookMarked className="h-6 w-6 text-muted-foreground" />
      </div>
      <p className="mt-5 text-base text-muted-foreground">{message}</p>
      <button
        onClick={() => navigate({ to: ctaHref })}
        className="mt-5 inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface-2 px-4 py-2 text-sm hover:bg-surface-2/70"
      >
        {ctaLabel} <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
