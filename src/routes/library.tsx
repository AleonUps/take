import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Sparkles,
  BookOpen,
  Trash2,
  ArrowRight,
  Upload,
  Search,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { COUNTRIES } from "@/lib/educis";

export const Route = createFileRoute("/library")({
  head: () => ({
    meta: [
      { title: "Library — Your saved lessons · EDUCIS" },
      {
        name: "description",
        content: "Access your saved SPARK and RAWI lessons anytime.",
      },
    ],
  }),
  component: LibraryPage,
});

type SparkSave = {
  id: number;
  objectName: string;
  objectDescription: string;
  subjectCount: number;
  thumbnail: string | null;
  result: unknown;
  grade: string;
  language: string;
  savedAt: string;
};

type RawiSave = {
  id: number;
  concept: string;
  country: { code: string; name: string; flag: string };
  grade: string;
  culturalHook: string;
  result: unknown;
  savedAt: string;
};

function LibraryPage() {
  const [sparkSaves, setSparkSaves] = useState<SparkSave[]>([]);
  const [rawiSaves, setRawiSaves] = useState<RawiSave[]>([]);

  const loadLibrary = () => {
    const saved = JSON.parse(localStorage.getItem("educis_library") || "{}");
    setSparkSaves(saved.spark || []);
    setRawiSaves(saved.rawi || []);
  };

  useEffect(() => {
    loadLibrary();
    window.addEventListener("library-updated", loadLibrary);
    return () => window.removeEventListener("library-updated", loadLibrary);
  }, []);

  const deleteSpark = (id: number) => {
    const saved = JSON.parse(localStorage.getItem("educis_library") || "{}");
    saved.spark = (saved.spark || []).filter((s: SparkSave) => s.id !== id);
    localStorage.setItem("educis_library", JSON.stringify(saved));
    loadLibrary();
    window.dispatchEvent(new Event("library-updated"));
  };

  const deleteRawi = (id: number) => {
    const saved = JSON.parse(localStorage.getItem("educis_library") || "{}");
    saved.rawi = (saved.rawi || []).filter((r: RawiSave) => r.id !== id);
    localStorage.setItem("educis_library", JSON.stringify(saved));
    loadLibrary();
    window.dispatchEvent(new Event("library-updated"));
  };

  const getGradeLabel = (grade: string) => {
    switch (grade) {
      case "elementary":
        return "Elementary";
      case "middle":
        return "Middle School";
      case "high":
        return "High School";
      default:
        return grade;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-12">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-spark/40 bg-spark/10 px-3 py-1 text-xs text-spark">
            <BookOpen className="h-3 w-3" /> Library
          </div>
          <h1 className="mt-4 font-serif text-5xl font-semibold md:text-6xl">
            Your saved <span className="text-gradient-brand italic">lessons</span>
          </h1>
          <p className="mt-4 text-muted-foreground">
            Access your SPARK discoveries and RAWI lessons anytime
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="spark" className="mt-10">
          <TabsList className="grid w-full grid-cols-2 glass rounded-xl p-1">
            <TabsTrigger
              value="spark"
              className="rounded-lg data-[state=active]:bg-spark/20 data-[state=active]:text-spark"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              SPARK ({sparkSaves.length})
            </TabsTrigger>
            <TabsTrigger
              value="rawi"
              className="rounded-lg data-[state=active]:bg-rawi/20 data-[state=active]:text-rawi"
            >
              <Search className="mr-2 h-4 w-4" />
              RAWI ({rawiSaves.length})
            </TabsTrigger>
          </TabsList>

          {/* SPARK Saves */}
          <TabsContent value="spark" className="mt-6">
            {sparkSaves.length === 0 ? (
              <div className="glass rounded-2xl p-12 text-center">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-spark/15">
                  <Upload className="h-7 w-7 text-spark" />
                </div>
                <h3 className="mt-5 text-xl font-semibold">Nothing sparked yet</h3>
                <p className="mt-2 text-muted-foreground">
                  Upload your first photo to discover lessons across subjects
                </p>
                <Link
                  to="/spark"
                  className="btn-spark mt-6 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold"
                >
                  Upload your first photo
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {sparkSaves.map((save) => (
                  <div
                    key={save.id}
                    className="glass card-hover rounded-2xl overflow-hidden animate-fade-up"
                  >
                    {save.thumbnail && (
                      <div className="aspect-video w-full overflow-hidden bg-surface-2">
                        <img
                          src={save.thumbnail}
                          alt={save.objectName}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{save.objectName}</h3>
                          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                            {save.objectDescription}
                          </p>
                        </div>
                        <button
                          onClick={() => deleteSpark(save.id)}
                          className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <span className="rounded-full bg-spark/10 px-2 py-0.5 text-xs text-spark">
                          {save.subjectCount} subjects
                        </span>
                        <span className="rounded-full bg-surface-2 px-2 py-0.5 text-xs text-muted-foreground">
                          {getGradeLabel(save.grade)}
                        </span>
                      </div>
                      <p className="mt-2 text-[10px] text-muted-foreground">
                        Saved {new Date(save.savedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* RAWI Saves */}
          <TabsContent value="rawi" className="mt-6">
            {rawiSaves.length === 0 ? (
              <div className="glass rounded-2xl p-12 text-center">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-rawi/15">
                  <BookOpen className="h-7 w-7 text-rawi" />
                </div>
                <h3 className="mt-5 text-xl font-semibold">No lessons saved yet</h3>
                <p className="mt-2 text-muted-foreground">
                  Generate your first culturally-rooted lesson
                </p>
                <Link
                  to="/rawi"
                  className="btn-rawi mt-6 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold"
                >
                  Generate your first lesson
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {rawiSaves.map((save) => {
                  const countryInfo = COUNTRIES.find((c) => c.code === save.country.code) || save.country;
                  return (
                    <div
                      key={save.id}
                      className="glass card-hover rounded-2xl p-5 animate-fade-up"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{countryInfo.flag}</span>
                            <span className="rounded-full bg-rawi/10 px-2 py-0.5 text-xs text-rawi">
                              {getGradeLabel(save.grade)}
                            </span>
                          </div>
                          <h3 className="mt-3 font-semibold">{save.concept}</h3>
                          <p className="mt-2 font-serif text-sm italic text-rawi line-clamp-2">
                            "{save.culturalHook}"
                          </p>
                        </div>
                        <button
                          onClick={() => deleteRawi(save.id)}
                          className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <p className="text-[10px] text-muted-foreground">
                          Saved {new Date(save.savedAt).toLocaleDateString()}
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {countryInfo.name}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
