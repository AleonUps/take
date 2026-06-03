import { createFileRoute, Link } from '@tanstack/react-router';
import { BookMarked, Camera, BookOpen, Trash2, Clock, Search, X, Filter } from 'lucide-react';
import { useLibrary, useLibraryActions } from '@/lib/library';
import { useTheme } from '@/lib/theme';
import { useState } from 'react';
import type { LibraryEntry } from '@/lib/library';

export const Route = createFileRoute('/library')({
  component: LibraryPage,
});

function EntryCard({ entry, onDelete, isDark }: { entry: LibraryEntry; onDelete: (id: string) => void; isDark: boolean }) {
  const isRawi = entry.kind === 'rawi';
  const color = isRawi ? 'var(--rawi)' : 'var(--spark)';
  const colorRaw = isRawi ? '#d4a843' : '#8b5cf6';
  const ago = Math.round((Date.now() - entry.savedAt) / 60000);
  const agoLabel = ago < 60 ? `${ago}m ago` : ago < 1440 ? `${Math.round(ago / 60)}h ago` : `${Math.round(ago / 1440)}d ago`;

  return (
    <div className="hud-card rounded-xl overflow-hidden group transition-all duration-300 hover:-translate-y-0.5"
      style={{ background: isDark ? 'rgba(6,12,20,0.8)' : 'rgba(248,250,252,0.9)', borderColor: `${colorRaw}30` }}>
      <Link to={`/library/${entry.id}`} className="block">
        {/* Thumbnail / header */}
        {!isRawi && (entry as any).thumbnail ? (
          <div className="relative overflow-hidden scan-on-hover" style={{ height: 140 }}>
            <img src={(entry as any).thumbnail} alt="Lesson thumbnail"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(transparent 50%, rgba(0,0,0,0.6))' }} />
            <div className="absolute bottom-2 left-3">
              <span className="rounded-full px-2 py-0.5 text-[9px] font-mono font-bold"
                style={{ background: 'rgba(139,92,246,0.8)', color: 'white' }}>SPARK</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center" style={{ height: 80, background: isRawi ? 'rgba(212,168,67,0.06)' : 'rgba(139,92,246,0.06)' }}>
            {isRawi
              ? <BookOpen className="h-8 w-8 opacity-30" style={{ color }} />
              : <Camera className="h-8 w-8 opacity-30" style={{ color }} />}
          </div>
        )}

        <div className="p-4">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="rounded-full px-2 py-0.5 text-[9px] font-mono font-bold"
              style={{ background: `${colorRaw}15`, border: `1px solid ${colorRaw}30`, color }}>
              {isRawi ? 'RAWI' : 'SPARK'}
            </span>
            <span className="text-[10px] font-mono flex items-center gap-1" style={{ color: 'var(--muted-foreground)' }}>
              <Clock className="h-3 w-3" />{agoLabel}
            </span>
          </div>

          <h3 className="font-bold text-sm mb-1 line-clamp-1" style={{ color: 'var(--foreground)', fontFamily: 'Syne, sans-serif' }}>
            {isRawi
              ? (entry as any).result?.conceptTitle ?? (entry as any).concept
              : (entry as any).result?.objectName ?? 'Image Analysis'}
          </h3>

          <p className="text-[11px] line-clamp-2" style={{ color: 'var(--muted-foreground)' }}>
            {isRawi
              ? (entry as any).result?.culturalHook ?? `${(entry as any).countryFlag} ${(entry as any).countryName} · ${(entry as any).languageName}`
              : (entry as any).result?.subjects?.map((s: any) => s.subject).join(', ')}
          </p>

          <div className="mt-3 flex items-center gap-2 flex-wrap">
            <span className="text-[9px] font-mono rounded px-1.5 py-0.5"
              style={{ background: 'var(--border)', color: 'var(--muted-foreground)' }}>
              {(entry as any).grade?.toUpperCase() ?? 'MIDDLE'}
            </span>
            <span className="text-[9px] font-mono rounded px-1.5 py-0.5"
              style={{ background: 'var(--border)', color: 'var(--muted-foreground)' }}>
              {(entry as any).language?.toUpperCase() ?? 'EN'}
            </span>
          </div>
        </div>
      </Link>

      {/* Delete */}
      <div className="px-4 pb-4">
        <button
          onClick={e => { e.preventDefault(); onDelete(entry.id); }}
          className="w-full flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-[10px] font-mono transition-all duration-200 opacity-0 group-hover:opacity-100"
          style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', color: '#ef4444' }}>
          <Trash2 className="h-3 w-3" />
          Remove
        </button>
      </div>
    </div>
  );
}

function LibraryPage() {
  const { isDark } = useTheme();
  const entries = useLibrary();
  const { remove } = useLibraryActions();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'rawi' | 'spark'>('all');

  const filtered = entries.filter(e => {
    const matchKind = filter === 'all' || e.kind === filter;
    const q = search.toLowerCase();
    const matchSearch = !q || JSON.stringify(e).toLowerCase().includes(q);
    return matchKind && matchSearch;
  });

  return (
    <div className="min-h-screen tech-grid" style={{ background: 'var(--background)' }}>
      {/* Hero */}
      <section className="border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-mono tracking-widest"
                style={{ background: 'rgba(212,168,67,0.08)', border: '1px solid rgba(212,168,67,0.2)', color: 'var(--rawi)' }}>
                <BookMarked className="h-3 w-3" />
                LIBRARY // SAVED_LESSONS
              </div>
              <h1 className="text-3xl font-black" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--foreground)' }}>
                Your Learning Library
              </h1>
              <p className="mt-1 text-sm" style={{ color: 'var(--muted-foreground)' }}>
                {entries.length} lesson{entries.length !== 1 ? 's' : ''} saved
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: 'var(--muted-foreground)' }} />
                <input
                  type="text"
                  placeholder="Search library..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="rounded-lg pl-8 pr-8 py-2 text-sm outline-none transition-all"
                  style={{
                    background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
                    border: '1px solid var(--border)',
                    color: 'var(--foreground)',
                    width: 200,
                  }}
                />
                {search && (
                  <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2">
                    <X className="h-3.5 w-3.5" style={{ color: 'var(--muted-foreground)' }} />
                  </button>
                )}
              </div>
              {/* Filter pills */}
              <div className="flex items-center gap-1 rounded-lg p-1" style={{ background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)', border: '1px solid var(--border)' }}>
                {([
                  { id: 'all', label: 'All' },
                  { id: 'rawi', label: 'RAWI' },
                  { id: 'spark', label: 'SPARK' },
                ] as const).map(f => (
                  <button key={f.id} onClick={() => setFilter(f.id)}
                    className="rounded-md px-3 py-1 text-xs font-mono transition-all duration-200"
                    style={{
                      background: filter === f.id ? (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)') : 'transparent',
                      color: filter === f.id ? 'var(--foreground)' : 'var(--muted-foreground)',
                    }}>
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-10">
        {entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="grid h-16 w-16 place-items-center rounded-2xl mb-5"
              style={{ background: 'rgba(212,168,67,0.08)', border: '1px solid rgba(212,168,67,0.2)' }}>
              <BookMarked className="h-8 w-8" style={{ color: 'var(--rawi)' }} />
            </div>
            <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--foreground)', fontFamily: 'Syne, sans-serif' }}>
              Library is empty
            </h2>
            <p className="text-sm max-w-sm mb-6" style={{ color: 'var(--muted-foreground)' }}>
              Save lessons from RAWI or SPARK and they'll appear here for quick access.
            </p>
            <div className="flex gap-3">
              <Link to="/rawi" className="btn-rawi inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold">
                <BookOpen className="h-4 w-4" /> Open RAWI
              </Link>
              <Link to="/spark" className="btn-spark inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold">
                <Camera className="h-4 w-4" /> Open SPARK
              </Link>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Filter className="h-8 w-8 mb-3" style={{ color: 'var(--muted-foreground)' }} />
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>No lessons match your filter.</p>
            <button onClick={() => { setSearch(''); setFilter('all'); }}
              className="mt-3 text-xs font-mono underline" style={{ color: 'var(--oracle)' }}>
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map(entry => (
              <EntryCard key={entry.id} entry={entry} onDelete={remove} isDark={isDark} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
