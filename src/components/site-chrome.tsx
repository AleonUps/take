import { Link } from "@tanstack/react-router";
import { Sparkles, BookMarked } from "lucide-react";
import { useLibraryCount } from "@/lib/library";

export function SiteNav() {
  const count = useLibraryCount();
  return (
    <header className="no-print sticky top-0 z-50 w-full">
      <div className="glass border-b border-border">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="relative">
              <Sparkles className="h-5 w-5 text-spark transition-transform group-hover:rotate-12" />
            </span>
            <span className="text-xl font-bold tracking-tight text-gradient-brand">EDUCIS</span>
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            <Link to="/" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Platform
            </Link>
            <Link to="/spark" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              SPARK
            </Link>
            <Link to="/rawi" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              RAWI
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
            to="/spark"
            className="border-gradient-brand inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium text-foreground transition-transform hover:scale-[1.03]"
          >
            Launch App
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
              <Sparkles className="h-5 w-5 text-spark" />
              <span className="text-lg font-bold text-gradient-brand">EDUCIS</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Education in your world, your language, your life.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">Platform</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/spark" className="hover:text-foreground">SPARK</Link></li>
              <li><Link to="/rawi" className="hover:text-foreground">RAWI</Link></li>
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
              Lovable AI · Google Gemini · TanStack Start
            </p>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row">
          <span>© {new Date().getFullYear()} EDUCIS. Free forever.</span>
          <span>6 languages · 50 countries · 12 subjects</span>
        </div>
      </div>
    </footer>
  );
}
