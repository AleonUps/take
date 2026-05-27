import { Link } from "@tanstack/react-router";
import { Sparkles, BookMarked, Eye, BookOpen, Camera } from "lucide-react";
import { useLibraryCount } from "@/lib/library";
import { getCurriculumProgress } from "@/lib/curriculum";
import { useState, useEffect } from "react";

export function SiteNav() {
  const count = useLibraryCount();
  const [prog, setProg] = useState({ total: 0, completed: 0 });
  useEffect(() => {
    setProg(getCurriculumProgress());
    const sync = () => setProg(getCurriculumProgress());
    window.addEventListener("educis-curriculum-update", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("educis-curriculum-update", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return (
    <header className="no-print sticky top-0 z-50 w-full">
      <div className="glass border-b border-border">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="relative">
              <Eye className="h-5 w-5 text-oracle transition-transform group-hover:rotate-12" />
            </span>
            <span className="text-xl font-bold tracking-tight text-gradient-brand">EDUCIS</span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link to="/oracle" className="inline-flex items-center gap-1.5 text-sm text-oracle font-medium transition-colors hover:text-oracle-light">
              <Eye className="h-3.5 w-3.5" /> 0RACLE
            </Link>
            <Link to="/rawi" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
              <BookOpen className="h-3.5 w-3.5" /> RAWI
            </Link>
            <Link to="/spark" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
              <Camera className="h-3.5 w-3.5" /> SPARK
            </Link>
            <Link to="/explore" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Explore
            </Link>
            <Link
              to="/library"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <BookMarked className="h-3.5 w-3.5" />
              Library
              {count > 0 && (
                <span className="rounded-full border border-rawi/40 bg-rawi/10 px-1.5 py-0.5 text-[10px] font-semibold text-rawi">
                  {count}
                </span>
              )}
            </Link>
            <Link to="/about" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              About
            </Link>
          </nav>
          <Link
            to="/oracle"
            className="btn-oracle inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium transition-transform hover:scale-[1.03]"
          >
            Start Here
          </Link>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="no-print border-t border-border bg-surface-1/40 mt-24">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-oracle" />
              <span className="text-lg font-bold text-gradient-brand">EDUCIS</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Education in your world, your language, your life.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">Pipeline</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/oracle" className="hover:text-oracle">0RACLE</Link></li>
              <li><Link to="/rawi" className="hover:text-rawi">RAWI</Link></li>
              <li><Link to="/spark" className="hover:text-spark">SPARK</Link></li>
              <li><Link to="/explore" className="hover:text-foreground">Explore</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">Project</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-foreground">About</Link></li>
              <li><span>Built for ELO 2026 — AI & Education</span></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">Powered by</h4>
            <p className="mt-3 text-sm text-muted-foreground">
              Lovable AI · Google Gemini · YouTube · TanStack Start
            </p>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row">
          <span>© {new Date().getFullYear()} EDUCIS. Free forever.</span>
          <span>0RACLE → RAWI → SPARK · 6 languages · 50 countries</span>
        </div>
      </div>
    </footer>
  );
}
