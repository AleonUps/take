import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { Globe, BookOpen, Camera, Eye, ArrowRight, Zap, Star } from 'lucide-react';
import { useTheme } from '@/lib/theme';
import { SUBJECTS } from '@/lib/educis';

export const Route = createFileRoute('/explore')( {
  component: ExplorePage,
});

const FEATURED = [
  {
    title: 'Photosynthesis Through a Swahili Lens',
    excerpt: 'How Kenyan farmers have understood light-to-energy conversion for centuries — and what modern biology says.',
    subject: 'Biology',
    country: 'KE', flag: '🇰🇪', countryName: 'Kenya', language: 'Kiswahili',
    grade: 'middle', tool: 'rawi',
    image: 'https://images.pexels.com/photos/256417/pexels-photo-256417.jpeg?auto=compress&cs=tinysrgb&w=600',
    color: '#00ff88',
  },
  {
    title: 'Bridge Engineering: Physics in the City',
    excerpt: 'From suspension forces to load distribution — SPARK dissects city infrastructure for high schoolers.',
    subject: 'Physics',
    country: 'BR', flag: '🇧🇷', countryName: 'Brazil', language: 'Español',
    grade: 'high', tool: 'spark',
    image: 'https://images.pexels.com/photos/3735201/pexels-photo-3735201.jpeg?auto=compress&cs=tinysrgb&w=600',
    color: '#fbbf24',
  },
  {
    title: 'Market Economics in the Cairo Souk',
    excerpt: 'Supply, demand, and price signals — explained through the world\'s oldest continuous marketplace.',
    subject: 'Economics',
    country: 'EG', flag: '🇪🇬', countryName: 'Egypt', language: 'Arabic',
    grade: 'high', tool: 'rawi',
    image: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=600',
    color: '#f97316',
  },
  {
    title: 'River Delta Ecosystems',
    excerpt: 'A geography & environmental science deep-dive into alluvial fans, biodiversity, and flood risk.',
    subject: 'Geography',
    country: 'BD', flag: '🇧🇩', countryName: 'Bangladesh', language: 'English',
    grade: 'middle', tool: 'spark',
    image: 'https://images.pexels.com/photos/167699/pexels-photo-167699.jpeg?auto=compress&cs=tinysrgb&w=600',
    color: '#22d3ee',
  },
  {
    title: 'Renewable Energy & Social Justice',
    excerpt: 'Solar panels from a social lens — who benefits, who is left behind, and what policy should do.',
    subject: 'Social Studies',
    country: 'NG', flag: '🇳🇬', countryName: 'Nigeria', language: 'English',
    grade: 'high', tool: 'spark',
    image: 'https://images.pexels.com/photos/3735218/pexels-photo-3735218.jpeg?auto=compress&cs=tinysrgb&w=600',
    color: '#fb923c',
  },
  {
    title: 'Monsoon Math: Statistics in South Asia',
    excerpt: 'Probability distributions, rainfall data, and climate modeling — taught with real Indian monsoon records.',
    subject: 'Mathematics',
    country: 'IN', flag: '🇮🇳', countryName: 'India', language: 'English',
    grade: 'high', tool: 'rawi',
    image: 'https://images.pexels.com/photos/414171/pexels-photo-414171.jpeg?auto=compress&cs=tinysrgb&w=600',
    color: '#00d4ff',
  },
];

const TOOLS = [
  { to: '/oracle', label: '0RACLE', icon: <Eye className="h-5 w-5" />, color: 'var(--oracle)', desc: 'AI personality profiling that builds your personalized curriculum' },
  { to: '/rawi', label: 'RAWI', icon: <BookOpen className="h-5 w-5" />, color: 'var(--rawi)', desc: 'Type any concept, get a culturally-grounded story-lesson in your language' },
  { to: '/spark', label: 'SPARK', icon: <Camera className="h-5 w-5" />, color: 'var(--spark)', desc: 'Upload any photo and extract multi-subject lessons from the real world' },
];

function ExplorePage() {
  const { isDark } = useTheme();
  const [activeSubject, setActiveSubject] = useState<string | null>(null);

  const filtered = activeSubject
    ? FEATURED.filter(f => f.subject === activeSubject)
    : FEATURED;

  return (
    <div className="min-h-screen tech-grid" style={{ background: 'var(--background)' }}>
      {/* Hero */}
      <section className="relative border-b overflow-hidden" style={{ borderColor: 'var(--border)' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 h-80 w-80 rounded-full opacity-5 blur-3xl"
            style={{ background: 'var(--oracle)' }} />
          <div className="absolute bottom-0 right-1/4 h-80 w-80 rounded-full opacity-5 blur-3xl"
            style={{ background: 'var(--rawi)' }} />
        </div>
        <div className="mx-auto max-w-7xl px-6 py-16 text-center relative">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-mono tracking-widest"
            style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)', color: 'var(--oracle)' }}>
            <Globe className="h-3 w-3" />
            EXPLORE // CURATED_LESSON_GALLERY
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--foreground)' }}>
            Education in <span style={{ color: 'var(--oracle)' }}>Every</span> Context
          </h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--muted-foreground)' }}>
            Browse curated examples of EDUCIS lessons built from real-world contexts — culture, country, and subject intertwined.
          </p>
        </div>
      </section>

      {/* Pipeline cards */}
      <section className="border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="mx-auto max-w-7xl px-6 py-10">
          <p className="font-mono text-[10px] tracking-widest mb-5" style={{ color: 'var(--oracle)' }}>// AVAILABLE_TOOLS</p>
          <div className="grid gap-4 sm:grid-cols-3">
            {TOOLS.map(tool => (
              <Link key={tool.to} to={tool.to}
                className="hud-card group rounded-xl p-5 transition-all duration-300 hover:-translate-y-0.5"
                style={{ background: isDark ? 'rgba(6,12,20,0.8)' : 'rgba(248,250,252,0.9)' }}>
                <div className="mb-3 flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-lg"
                    style={{ background: `color-mix(in srgb, ${tool.color} 10%, transparent)`, border: `1px solid color-mix(in srgb, ${tool.color} 25%, transparent)` }}>
                    <span style={{ color: tool.color }}>{tool.icon}</span>
                  </div>
                  <span className="font-black text-lg" style={{ fontFamily: 'Syne, sans-serif', color: tool.color }}>{tool.label}</span>
                </div>
                <p className="text-sm mb-3" style={{ color: 'var(--muted-foreground)' }}>{tool.desc}</p>
                <div className="flex items-center gap-1 text-xs font-mono transition-colors" style={{ color: tool.color }}>
                  Launch <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured lessons */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        {/* Subject filter */}
        <div className="flex items-center gap-3 mb-8 flex-wrap">
          <span className="font-mono text-[10px] tracking-widest" style={{ color: 'var(--oracle)' }}>// FILTER_BY</span>
          <button
            onClick={() => setActiveSubject(null)}
            className="rounded-full px-3 py-1 text-[10px] font-mono transition-all"
            style={{
              background: !activeSubject ? 'rgba(0,212,255,0.15)' : 'transparent',
              border: `1px solid ${!activeSubject ? 'rgba(0,212,255,0.4)' : 'var(--border)'}`,
              color: !activeSubject ? 'var(--oracle)' : 'var(--muted-foreground)',
            }}>
            All
          </button>
          {Array.from(new Set(FEATURED.map(f => f.subject))).map(sub => (
            <button key={sub} onClick={() => setActiveSubject(activeSubject === sub ? null : sub)}
              className="rounded-full px-3 py-1 text-[10px] font-mono transition-all"
              style={{
                background: activeSubject === sub ? 'rgba(0,212,255,0.15)' : 'transparent',
                border: `1px solid ${activeSubject === sub ? 'rgba(0,212,255,0.4)' : 'var(--border)'}`,
                color: activeSubject === sub ? 'var(--oracle)' : 'var(--muted-foreground)',
              }}>
              {sub}
            </button>
          ))}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item, i) => (
            <Link key={i} to={item.tool === 'rawi' ? '/rawi' : '/spark'}
              className="hud-card group rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 block"
              style={{ background: isDark ? 'rgba(6,12,20,0.8)' : 'rgba(248,250,252,0.9)', borderColor: `${item.color}30` }}>
              <div className="relative overflow-hidden scan-on-hover" style={{ height: 160 }}>
                <img src={item.image} alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(transparent 40%, rgba(0,0,0,0.7))' }} />
                <div className="absolute top-2 right-2 flex gap-1.5">
                  <span className="rounded-full px-2 py-0.5 text-[9px] font-mono font-bold"
                    style={{ background: `${item.color}cc`, color: '#000' }}>
                    {item.subject}
                  </span>
                  <span className="rounded-full px-2 py-0.5 text-[9px] font-mono font-bold"
                    style={{ background: item.tool === 'rawi' ? 'rgba(212,168,67,0.9)' : 'rgba(139,92,246,0.9)', color: 'white' }}>
                    {item.tool.toUpperCase()}
                  </span>
                </div>
                <div className="absolute bottom-2 left-3 text-xs text-white font-mono">
                  {item.flag} {item.countryName}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-sm mb-1.5 line-clamp-2 group-hover:text-opacity-90"
                  style={{ color: 'var(--foreground)', fontFamily: 'Syne, sans-serif' }}>
                  {item.title}
                </h3>
                <p className="text-[12px] line-clamp-2 mb-3" style={{ color: 'var(--muted-foreground)' }}>
                  {item.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono rounded px-1.5 py-0.5"
                    style={{ background: 'var(--border)', color: 'var(--muted-foreground)' }}>
                    {item.grade.toUpperCase()} · {item.language.toUpperCase()}
                  </span>
                  <span className="text-[10px] font-mono flex items-center gap-1 transition-colors group-hover:opacity-100 opacity-60"
                    style={{ color: item.tool === 'rawi' ? 'var(--rawi)' : 'var(--spark)' }}>
                    Try this <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* All subjects */}
        <div className="mt-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1" style={{ background: 'var(--border)' }} />
            <span className="font-mono text-[10px] tracking-widest" style={{ color: 'var(--oracle)' }}>// ALL_DISCIPLINES</span>
            <div className="h-px flex-1" style={{ background: 'var(--border)' }} />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {SUBJECTS.map((sub, i) => (
              <div key={i} className="hud-card rounded-xl p-4 transition-all duration-300 hover:-translate-y-0.5"
                style={{ background: isDark ? 'rgba(6,12,20,0.6)' : 'rgba(248,250,252,0.8)', borderColor: `${sub.color}20` }}>
                <div className="h-1 w-8 rounded-full mb-3" style={{ background: sub.color }} />
                <div className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{sub.name}</div>
                <div className="mt-1 text-[10px] font-mono" style={{ color: 'var(--muted-foreground)' }}>
                  {sub.icon}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-2xl p-10 text-center"
          style={{ background: isDark ? 'rgba(0,212,255,0.04)' : 'rgba(0,212,255,0.03)', border: '1px solid rgba(0,212,255,0.1)' }}>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-mono"
            style={{ background: 'rgba(0,212,255,0.1)', color: 'var(--oracle)' }}>
            <Zap className="h-3 w-3" />
            START YOUR JOURNEY
          </div>
          <h2 className="text-3xl font-black mb-3" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--foreground)' }}>
            Ready to learn in context?
          </h2>
          <p className="text-sm max-w-md mx-auto mb-6" style={{ color: 'var(--muted-foreground)' }}>
            Begin with 0RACLE to map your personality and get a personalized curriculum built for you.
          </p>
          <Link to="/oracle" className="btn-oracle inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold">
            <Eye className="h-4 w-4" /> Start with 0RACLE
          </Link>
        </div>
      </section>
    </div>
  );
}
