import { createFileRoute, Link } from '@tanstack/react-router';
import { Eye, BookOpen, Camera, Globe, Zap, Heart, Code2, Target, ArrowRight } from 'lucide-react';
import { useTheme } from '@/lib/theme';

export const Route = createFileRoute('/about')( {
  component: AboutPage,
});

const PRINCIPLES = [
  { icon: <Globe className="h-5 w-5" />, title: 'Context-First', desc: 'Every lesson starts with where you are — your country, culture, and lived experience.' },
  { icon: <Heart className="h-5 w-5" />, title: 'Inclusive by Design', desc: '6 languages, 50 countries, 3 grade levels. Built for the global majority, not just the privileged few.' },
  { icon: <Target className="h-5 w-5" />, title: 'Adaptive Profiling', desc: 'RACLE maps your cognitive style before delivering curriculum. No two paths are the same.' },
  { icon: <Zap className="h-5 w-5" />, title: 'Visual Intelligence', desc: 'SPARK turns any photograph into a multi-subject classroom. The world is the textbook.' },
  { icon: <Code2 className="h-5 w-5" />, title: 'Open Infrastructure', desc: 'Built on Groq, Supabase, and open web standards. Fast, affordable, and auditable.' },
  { icon: <Eye className="h-5 w-5" />, title: 'Transparent AI', desc: 'Every AI response shows its sources and reasoning. No black boxes in education.' },
];

const PIPELINE = [
  {
    id: '01', label: '0RACLE', icon: <Eye className="h-6 w-6" />, color: 'var(--oracle)',
    colorRaw: '#00d4ff',
    desc: 'The entry point. A conversational AI engine that profiles your personality type using MBTI-derived psychometrics, then generates a personalized subject curriculum aligned with your cognitive and social preferences.',
    features: ['Deep conversational profiling', 'MBTI 16-type mapping', 'Personalized curriculum builder', 'Fast-Track MCQ mode'],
  },
  {
    id: '02', label: 'RAWI', icon: <BookOpen className="h-6 w-6" />, color: 'var(--rawi)',
    colorRaw: '#d4a843',
    desc: 'The lesson compiler. Input any concept and RAWI generates a culturally-situated story-lesson in your language, complete with local hooks, real-world examples from your country, and practice problems.',
    features: ['50-country cultural framing', '6-language output', 'Story-based pedagogy', 'Practice problem generation'],
  },
  {
    id: '03', label: 'SPARK', icon: <Camera className="h-6 w-6" />, color: 'var(--spark)',
    colorRaw: '#8b5cf6',
    desc: 'The visual gateway. Upload any photograph and SPARK uses computer vision + LLM reasoning to identify objects and extract multi-subject lessons — physics, economics, history, and more from a single image.',
    features: ['Multi-subject extraction', 'Image-to-lesson pipeline', 'Vocabulary + discussion prompts', 'Activity generator'],
  },
];

function AboutPage() {
  const { isDark } = useTheme();

  return (
    <div className="min-h-screen tech-grid" style={{ background: 'var(--background)' }}>
      {/* Hero */}
      <section className="relative border-b overflow-hidden" style={{ borderColor: 'var(--border)' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 h-96 w-96 rounded-full opacity-5 blur-3xl" style={{ background: 'var(--oracle)' }} />
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full opacity-5 blur-3xl" style={{ background: 'var(--rawi)' }} />
        </div>
        <div className="mx-auto max-w-7xl px-6 py-20 relative">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-mono tracking-widest"
              style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)', color: 'var(--oracle)' }}>
              <Eye className="h-3 w-3" />
              ABOUT // PLATFORM_OVERVIEW
            </div>
            <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight"
              style={{ fontFamily: 'Syne, sans-serif', color: 'var(--foreground)' }}>
              Education in your{' '}
              <span style={{ color: 'var(--oracle)' }}>world</span>,
              your <span style={{ color: 'var(--rawi)' }}>language</span>,
              your <span style={{ color: 'var(--spark)' }}>life</span>.
            </h1>
            <p className="text-xl leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
              EDUCIS is an AI-powered adaptive learning platform built for the world's underserved learners. We believe great education shouldn't require an elite school — just curiosity and a phone.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="font-mono text-[10px] tracking-widest mb-4" style={{ color: 'var(--oracle)' }}>// MISSION_STATEMENT</p>
            <h2 className="text-3xl font-black mb-5" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--foreground)' }}>
              The problem we're solving
            </h2>
            <div className="space-y-4 text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
              <p>
                300 million school-age children around the world lack access to quality education. Not because they lack intelligence — but because their textbooks use foreign examples, their lessons ignore local culture, and nobody has ever told them how they learn best.
              </p>
              <p>
                EDUCIS flips this. We start with the learner's context: their country, language, grade, and personality. Then we build the curriculum around them — not the other way around.
              </p>
              <p>
                Built for ELO 2026 · AI & Education track.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { v: '50+', l: 'Countries supported' },
              { v: '6', l: 'Languages' },
              { v: '12', l: 'Subject disciplines' },
              { v: '3', l: 'Learning pipelines' },
            ].map(({ v, l }, i) => (
              <div key={i} className="hud-card rounded-xl p-6 text-center"
                style={{ background: isDark ? 'rgba(6,12,20,0.8)' : 'rgba(248,250,252,0.9)' }}>
                <div className="text-4xl font-black mb-1" style={{ color: 'var(--oracle)', fontFamily: 'Syne, sans-serif' }}>{v}</div>
                <div className="text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pipeline */}
      <section className="border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="text-center mb-12">
            <p className="font-mono text-[10px] tracking-widest mb-3" style={{ color: 'var(--oracle)' }}>// CORE_PIPELINE</p>
            <h2 className="text-3xl font-black" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--foreground)' }}>
              Three engines, one mission
            </h2>
          </div>
          <div className="space-y-6">
            {PIPELINE.map((p) => (
              <div key={p.id} className="hud-card rounded-2xl p-8"
                style={{ background: isDark ? 'rgba(6,12,20,0.8)' : 'rgba(248,250,252,0.9)', borderColor: `${p.colorRaw}30` }}>
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <div className="grid h-14 w-14 place-items-center rounded-xl"
                      style={{ background: `${p.colorRaw}10`, border: `1px solid ${p.colorRaw}25` }}>
                      <span style={{ color: p.color }}>{p.icon}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className="font-mono text-[10px] tracking-widest opacity-50" style={{ color: p.color }}>{p.id}</span>
                      <h3 className="text-xl font-black" style={{ fontFamily: 'Syne, sans-serif', color: p.color }}>{p.label}</h3>
                    </div>
                    <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--muted-foreground)' }}>{p.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {p.features.map((f, fi) => (
                        <span key={fi} className="rounded-full px-2.5 py-0.5 text-[10px] font-mono"
                          style={{ background: `${p.colorRaw}08`, border: `1px solid ${p.colorRaw}20`, color: p.color }}>
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="text-center mb-12">
            <p className="font-mono text-[10px] tracking-widest mb-3" style={{ color: 'var(--oracle)' }}>// DESIGN_PRINCIPLES</p>
            <h2 className="text-3xl font-black" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--foreground)' }}>
              What we stand for
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {PRINCIPLES.map((p, i) => (
              <div key={i} className="hud-card rounded-xl p-5"
                style={{ background: isDark ? 'rgba(6,12,20,0.6)' : 'rgba(248,250,252,0.8)' }}>
                <div className="mb-3 grid h-9 w-9 place-items-center rounded-lg"
                  style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.15)' }}>
                  <span style={{ color: 'var(--oracle)' }}>{p.icon}</span>
                </div>
                <h3 className="font-bold text-base mb-1.5" style={{ color: 'var(--foreground)' }}>{p.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech stack */}
      <section className="border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="mx-auto max-w-7xl px-6 py-16">
          <p className="font-mono text-[10px] tracking-widest mb-6" style={{ color: 'var(--oracle)' }}>// CORE_DEPENDENCIES</p>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Groq Llama', desc: 'Ultra-fast LLM inference powering all AI generation', color: '#00d4ff' },
              { name: 'Supabase', desc: 'Edge functions + PostgreSQL for scalable backend', color: '#3ecf8e' },
              { name: 'TanStack Router', desc: 'Type-safe client-side routing with code splitting', color: '#ef4444' },
              { name: 'React + Vite', desc: 'Fast, modern frontend architecture', color: '#61dafb' },
            ].map((t, i) => (
              <div key={i} className="rounded-xl p-5"
                style={{ background: isDark ? 'rgba(6,12,20,0.6)' : 'rgba(248,250,252,0.8)', border: '1px solid var(--border)' }}>
                <div className="h-1 w-8 rounded-full mb-3" style={{ background: t.color }} />
                <div className="font-bold text-sm mb-1" style={{ color: 'var(--foreground)' }}>{t.name}</div>
                <div className="text-[11px]" style={{ color: 'var(--muted-foreground)' }}>{t.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="mx-auto max-w-7xl px-6 py-16 text-center">
          <h2 className="text-3xl font-black mb-3" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--foreground)' }}>
            Start learning your way
          </h2>
          <p className="text-sm max-w-md mx-auto mb-8" style={{ color: 'var(--muted-foreground)' }}>
            Begin with 0RACLE to discover your learning profile, or jump straight into RAWI or SPARK.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/oracle" className="btn-oracle inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold">
              <Eye className="h-4 w-4" /> 0RACLE Engine
            </Link>
            <Link to="/rawi" className="btn-rawi inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold">
              <BookOpen className="h-4 w-4" /> RAWI Compiler
            </Link>
            <Link to="/spark" className="btn-spark inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold">
              <Camera className="h-4 w-4" /> SPARK Gateway
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
