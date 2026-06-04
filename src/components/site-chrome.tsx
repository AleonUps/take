import { Link, useLocation } from '@tanstack/react-router';
import { Eye, BookMarked, BookOpen, Camera, Moon, Sun } from 'lucide-react';
import { useLibraryCount } from '@/lib/library';
import { getCurriculumProgress } from '@/lib/curriculum';
import { useTheme } from '@/lib/theme';
import { useState, useEffect } from 'react';

export function SiteNav() {
  const count = useLibraryCount();
  const { isDark, toggle } = useTheme();
  const location = useLocation();
  const [prog, setProg] = useState({ total: 0, completed: 0 });
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setProg(getCurriculumProgress());
    const sync = () => setProg(getCurriculumProgress());
    window.addEventListener('educis-curriculum-update', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('educis-curriculum-update', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="no-print sticky top-0 z-50 w-full transition-all duration-300" style={{
      background: scrolled
        ? isDark ? 'rgba(2, 4, 8, 0.95)' : 'rgba(248, 250, 252, 0.95)'
        : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
    }}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
          <span className="relative grid h-8 w-8 place-items-center rounded-lg transition-all duration-300 group-hover:scale-110"
            style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)' }}>
            <Eye className="h-4 w-4 transition-transform group-hover:rotate-12" style={{ color: 'var(--oracle)' }} />
          </span>
          <span className="text-xl font-black tracking-tight text-gradient-brand" style={{ fontFamily: 'Syne, sans-serif' }}>
            EDUCIS
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {[
            { to: '/oracle', label: '0RACLE', icon: <Eye className="h-3 w-3" />, color: 'var(--oracle)' },
            { to: '/rawi', label: 'RAWI', icon: <BookOpen className="h-3 w-3" />, color: 'var(--rawi)' },
            { to: '/spark', label: 'SPARK', icon: <Camera className="h-3 w-3" />, color: 'var(--spark)' },
          ].map(({ to, label, icon, color }) => (
            <Link key={to} to={to}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200"
              style={{
                color: isActive(to) ? color : 'var(--muted-foreground)',
                background: isActive(to) ? `${color}10` : 'transparent',
                borderBottom: isActive(to) ? `2px solid ${color}` : '2px solid transparent',
              }}>
              <span style={{ color: isActive(to) ? color : 'inherit' }}>{icon}</span>
              {label}
            </Link>
          ))}

          <Link to="/explore" className="rounded-lg px-3 py-1.5 text-sm transition-all"
            style={{ color: isActive('/explore') ? 'var(--foreground)' : 'var(--muted-foreground)' }}>
            Explore
          </Link>

          <Link to="/library" className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-all"
            style={{ color: isActive('/library') ? 'var(--foreground)' : 'var(--muted-foreground)' }}>
            <BookMarked className="h-3.5 w-3.5" />
            Library
            {count > 0 && (
              <span className="rounded-full px-1.5 py-0.5 text-[9px] font-bold"
                style={{ background: 'rgba(212,168,67,0.15)', border: '1px solid rgba(212,168,67,0.3)', color: 'var(--rawi)' }}>
                {count}
              </span>
            )}
          </Link>

          <Link to="/about" className="rounded-lg px-3 py-1.5 text-sm transition-all"
            style={{ color: isActive('/about') ? 'var(--foreground)' : 'var(--muted-foreground)' }}>
            About
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {prog.total > 0 && (
            <div className="hidden md:flex items-center gap-2 rounded-full px-3 py-1"
              style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.12)' }}>
              <div className="h-1.5 w-16 rounded-full overflow-hidden" style={{ background: 'rgba(0,212,255,0.1)' }}>
                <div className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${(prog.completed / prog.total) * 100}%`, background: 'var(--oracle)' }} />
              </div>
              <span className="text-[10px] font-mono" style={{ color: 'rgba(0,212,255,0.5)' }}>
                {prog.completed}/{prog.total}
              </span>
            </div>
          )}

          <div className="relative flex items-center gap-2">
            <span className="hidden sm:block text-[9px] font-mono tracking-widest"
              style={{ color: 'var(--muted-foreground)', opacity: 0.5 }}>
              {isDark ? 'DARK' : 'LIGHT'}
            </span>
            <button onClick={toggle} className="theme-toggle" aria-label="Toggle theme">
              <div className="theme-toggle-thumb">
                {isDark
                  ? <Moon className="h-3 w-3" style={{ color: '#000810' }} />
                  : <Sun className="h-3 w-3" style={{ color: '#000810' }} />
                }
              </div>
            </button>
          </div>

          <Link to="/oracle" className="btn-oracle hidden sm:inline-flex items-center rounded-lg px-4 py-2 text-sm font-semibold">
            Start Here
          </Link>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  const { isDark } = useTheme();

  return (
    <footer className="no-print border-t mt-24"
      style={{
        borderColor: 'var(--border)',
        background: isDark ? 'rgba(6,12,20,0.4)' : 'rgba(241,245,249,0.8)',
      }}>
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-lg"
                style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)' }}>
                <Eye className="h-4 w-4" style={{ color: 'var(--oracle)' }} />
              </div>
              <span className="text-lg font-black text-gradient-brand" style={{ fontFamily: 'Syne, sans-serif' }}>EDUCIS</span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
              Education in your world, your language, your life.
            </p>
            <p className="text-[10px] font-mono" style={{ color: 'var(--muted-foreground)', opacity: 0.4 }}>
              // core_v1.0.0_stable
            </p>
          </div>

          <div>
            <p className="mb-4 font-mono text-[10px] tracking-[0.2em] font-bold" style={{ color: 'var(--oracle)' }}>
              // PIPELINE
            </p>
            <ul className="space-y-2.5 text-sm" style={{ color: 'var(--muted-foreground)' }}>
              <li><Link to="/oracle" className="flex items-center gap-2 transition-colors hover:text-white" style={{ color: 'inherit' }}><span className="h-1 w-1 rounded-full" style={{ background: 'var(--oracle)' }} />0RACLE Engine</Link></li>
              <li><Link to="/rawi" className="flex items-center gap-2 transition-colors hover:text-white" style={{ color: 'inherit' }}><span className="h-1 w-1 rounded-full" style={{ background: 'var(--rawi)' }} />RAWI Compiler</Link></li>
              <li><Link to="/spark" className="flex items-center gap-2 transition-colors hover:text-white" style={{ color: 'inherit' }}><span className="h-1 w-1 rounded-full" style={{ background: 'var(--spark)' }} />SPARK Gateway</Link></li>
              <li><Link to="/explore" className="transition-colors hover:text-white" style={{ color: 'inherit' }}>Explore</Link></li>
            </ul>
          </div>

          <div>
            <p className="mb-4 font-mono text-[10px] tracking-[0.2em] font-bold" style={{ color: 'var(--oracle)' }}>
              // PROJECT
            </p>
            <ul className="space-y-2.5 text-sm" style={{ color: 'var(--muted-foreground)' }}>
              <li><Link to="/about" className="transition-colors hover:text-white" style={{ color: 'inherit' }}>About Platform</Link></li>
              <li><Link to="/library" className="transition-colors hover:text-white" style={{ color: 'inherit' }}>Your Library</Link></li>
              <li style={{ color: 'var(--muted-foreground)', opacity: 0.6 }}>Built for ELO 2026 — AI & Education</li>
            </ul>
          </div>

          <div>
            <p className="mb-4 font-mono text-[10px] tracking-[0.2em] font-bold" style={{ color: 'var(--oracle)' }}>
              // CORE_DEPENDENCIES
            </p>
            <div className="space-y-2 text-[11px] font-mono" style={{ color: 'var(--muted-foreground)', opacity: 0.6 }}>
              <p>Groq Llama Architecture</p>
              <p>YouTube Data Streams</p>
              <p>TanStack Router Tree</p>
              <p>Supabase Edge Layer</p>
            </div>
            <div className="mt-4 p-3 rounded-lg" style={{ background: isDark ? 'rgba(0,212,255,0.03)' : 'rgba(0,0,0,0.03)', border: '1px solid var(--border)' }}>
              <p className="text-[10px] font-mono" style={{ color: 'var(--muted-foreground)', opacity: 0.5 }}>
                // Be the first to review
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col md:flex-row items-center justify-between pt-8 gap-4"
          style={{ borderTop: '1px solid var(--border)' }}>
          <p className="font-mono text-[10px]" style={{ color: 'var(--muted-foreground)', opacity: 0.5 }}>
            © 2026 EDUCIS • ACCESS LAYER UNLOCKED
          </p>
          <p className="font-mono text-[10px]" style={{ color: 'var(--muted-foreground)', opacity: 0.4 }}>
            0RACLE — RAWI — SPARK · 6 LANGUAGES · 50 COUNTRIES
          </p>
        </div>
      </div>
    </footer>
  );
}
