import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, BookMarked, Camera, BookOpen, Trash2, Clock, Layers } from 'lucide-react';
import { getEntry, deleteFromLibrary } from '@/lib/library';
import { useTheme } from '@/lib/theme';

export const Route = createFileRoute('/library/$id')({
  component: LibraryEntryPage,
});

function LibraryEntryPage() {
  const { isDark } = useTheme();
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const entry = getEntry(id);

  if (!entry) {
    return (
      <div className="min-h-screen flex items-center justify-center tech-grid" style={{ background: 'var(--background)' }}>
        <div className="text-center">
          <BookMarked className="h-12 w-12 mx-auto mb-4 opacity-30" style={{ color: 'var(--rawi)' }} />
          <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>Entry not found</h2>
          <p className="text-sm mb-4" style={{ color: 'var(--muted-foreground)' }}>This lesson may have been deleted.</p>
          <Link to="/library" className="btn-rawi inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold">
            <ArrowLeft className="h-4 w-4" /> Back to Library
          </Link>
        </div>
      </div>
    );
  }

  const handleDelete = () => {
    deleteFromLibrary(id);
    navigate({ to: '/library' });
  };

  const isRawi = entry.kind === 'rawi';
  const color = isRawi ? 'var(--rawi)' : 'var(--spark)';
  const colorRaw = isRawi ? '#d4a843' : '#8b5cf6';
  const ago = Math.round((Date.now() - entry.savedAt) / 60000);
  const agoLabel = ago < 60 ? `${ago}m ago` : ago < 1440 ? `${Math.round(ago / 60)}h ago` : `${Math.round(ago / 1440)}d ago`;

  return (
    <div className="min-h-screen tech-grid" style={{ background: 'var(--background)' }}>
      <div className="mx-auto max-w-4xl px-6 py-10">
        {/* Nav */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/library"
            className="inline-flex items-center gap-2 text-sm font-mono transition-colors hover:opacity-80"
            style={{ color: 'var(--muted-foreground)' }}>
            <ArrowLeft className="h-4 w-4" /> LIBRARY
          </Link>
          <button onClick={handleDelete}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-mono transition-all duration-200"
            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', color: '#ef4444' }}>
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </button>
        </div>

        {/* Header */}
        <div className="hud-card rounded-2xl p-6 mb-6"
          style={{ background: isDark ? 'rgba(6,12,20,0.8)' : 'rgba(248,250,252,0.9)', borderColor: `${colorRaw}30` }}>
          <div className="flex flex-col sm:flex-row sm:items-start gap-5">
            {!isRawi && (entry as any).thumbnail && (
              <div className="relative overflow-hidden rounded-xl flex-shrink-0 scan-on-hover" style={{ width: 160, height: 120 }}>
                <img src={(entry as any).thumbnail} alt="Lesson" className="w-full h-full object-cover" />
              </div>
            )}
            {isRawi && (
              <div className="grid h-16 w-16 place-items-center rounded-xl flex-shrink-0"
                style={{ background: `${colorRaw}10`, border: `1px solid ${colorRaw}25` }}>
                <BookOpen className="h-8 w-8" style={{ color }} />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="rounded-full px-2.5 py-0.5 text-[10px] font-mono font-bold"
                  style={{ background: `${colorRaw}15`, border: `1px solid ${colorRaw}30`, color }}>
                  {isRawi ? 'RAWI' : 'SPARK'}
                </span>
                <span className="text-[10px] font-mono flex items-center gap-1" style={{ color: 'var(--muted-foreground)' }}>
                  <Clock className="h-3 w-3" />{agoLabel}
                </span>
                <span className="text-[9px] font-mono rounded px-1.5 py-0.5"
                  style={{ background: 'var(--border)', color: 'var(--muted-foreground)' }}>
                  {(entry as any).grade?.toUpperCase()}
                </span>
                <span className="text-[9px] font-mono rounded px-1.5 py-0.5"
                  style={{ background: 'var(--border)', color: 'var(--muted-foreground)' }}>
                  {(entry as any).language?.toUpperCase()}
                </span>
              </div>

              <h1 className="text-2xl font-black mb-2" style={{ color: 'var(--foreground)', fontFamily: 'Syne, sans-serif' }}>
                {isRawi
                  ? (entry as any).result?.conceptTitle ?? (entry as any).concept
                  : (entry as any).result?.objectName ?? 'Image Analysis'}
              </h1>

              {isRawi && (
                <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  {(entry as any).countryFlag} {(entry as any).countryName} · {(entry as any).languageName}
                </p>
              )}

              {!isRawi && (entry as any).result?.description && (
                <p className="text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                  {(entry as any).result.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Subjects list */}
        {(entry as any).result?.subjects && (
          <div className="space-y-3">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1" style={{ background: 'var(--border)' }} />
              <div className="flex items-center gap-2 font-mono text-[10px] tracking-widest" style={{ color }}>
                <Layers className="h-3.5 w-3.5" />
                {isRawi ? 'LESSON_CONTENT' : `SUBJECT_BREAKDOWN · ${(entry as any).result.subjects.length} DISCIPLINES`}
              </div>
              <div className="h-px flex-1" style={{ background: 'var(--border)' }} />
            </div>

            {(entry as any).result.subjects.map((s: any, i: number) => (
              <div key={i} className="hud-card rounded-xl p-5"
                style={{ background: isDark ? 'rgba(6,12,20,0.8)' : 'rgba(248,250,252,0.9)', borderColor: `${colorRaw}20` }}>
                <div className="font-mono text-[10px] tracking-widest mb-1" style={{ color, opacity: 0.7 }}>
                  // {(s.subject || 'SUBJECT').toUpperCase()}
                </div>
                <h3 className="font-bold text-base" style={{ color: 'var(--foreground)' }}>
                  {s.lessonTitle}
                </h3>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="mt-8 flex gap-3">
          <Link to={isRawi ? '/rawi' : '/spark'}
            className={isRawi ? 'btn-rawi' : 'btn-spark'}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, borderRadius: 8, padding: '8px 16px', fontSize: 14, fontWeight: 600 }}>
            {isRawi ? <BookOpen className="h-4 w-4" /> : <Camera className="h-4 w-4" />}
            Open {isRawi ? 'RAWI' : 'SPARK'}
          </Link>
          <Link to="/library"
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all"
            style={{ background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', border: '1px solid var(--border)', color: 'var(--foreground)' }}>
            <BookMarked className="h-4 w-4" /> All Saved
          </Link>
        </div>
      </div>
    </div>
  );
}
