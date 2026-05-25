import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { getEntry, type LibraryEntry } from "@/lib/library";
import { SparkResultView } from "@/components/spark-result-view";
import { RawiResultView } from "@/components/rawi-result-view";
import { COUNTRIES, LANGUAGES } from "@/lib/educis";

export const Route = createFileRoute("/library/$id")({
  head: () => ({
    meta: [{ title: "Saved lesson · EDUCIS" }],
  }),
  component: SavedLessonPage,
});

function SavedLessonPage() {
  const { id } = Route.useParams();
  const [entry, setEntry] = useState<LibraryEntry | null | "loading">("loading");

  useEffect(() => {
    setEntry(getEntry(id));
  }, [id]);

  if (entry === "loading")
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center text-muted-foreground">
        Loading…
      </div>
    );

  if (!entry) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-muted-foreground">This saved lesson no longer exists.</p>
        <Link to="/library" className="mt-4 inline-flex items-center gap-1 text-sm text-rawi hover:underline">
          <ArrowLeft className="h-3 w-3" /> Back to Library
        </Link>
      </div>
    );
  }

  return (
    <div className={entry.kind === "spark" ? "mesh-spark min-h-screen" : "mesh-rawi min-h-screen"}>
      <div className="mx-auto max-w-5xl px-4 py-10">
        <Link
          to="/library"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3 w-3" /> Back to Library
        </Link>
        <div className="mt-6">
          {entry.kind === "spark" ? (
            <SparkResultView
              data={entry.result}
              previewUrl={entry.thumbnail}
              rtl={LANGUAGES.find((l) => l.code === entry.language)?.rtl ?? false}
              grade={entry.grade}
              language={entry.language}
              hideSave
            />
          ) : (
            <RawiResultView
              data={entry.result}
              country={
                COUNTRIES.find((c) => c.code === entry.countryCode) ?? {
                  code: entry.countryCode,
                  name: entry.countryName,
                  flag: entry.countryFlag,
                  region: "",
                }
              }
              rtl={LANGUAGES.find((l) => l.code === entry.language)?.rtl ?? false}
              hideSave
            />
          )}
        </div>
      </div>
    </div>
  );
}

// silence unused import warning when notFound not used
void notFound;
