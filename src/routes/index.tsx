import { createFileRoute, Link } from '@tanstack/react-router';
import { Eye, Sparkles, Camera, BookOpen, ArrowRight, Languages, Globe2 } from 'lucide-react';
import { CountUp } from '@/components/count-up';
import { LANGUAGES } from '@/lib/educis';
import { useTheme } from '@/lib/theme';

export const Route = createFileRoute('/')( {
  component: LandingPage,
});

function LandingPage() {
  const { isDark } = useTheme();

  return (
    <div className="relative overflow-hidden min-h-screen selection:bg-cyan-500/30 selection:text-white"
      style={{ background: 'var(--background)' }}>

      {/* HERO */}
      <section className="relative min-h-screen overflow-hidden flex items-center justify-center py-20">
        <div className="pointer-events-none absolute inset-0 tech-grid opacity-40" />

        {/* Ambient glows */}
        {isDark && (
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-[-10%] h-[700px] w-[800px] -translate-x-1/2 rounded-full blur-[140px] animate-pulse"
              style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.12) 0%, transparent 75%)', animationDuration: '8s' }} />
            <div className="absolute -right-20 top-1/4 h-[500px] w-[500px] rounded-full blur-[120px]"
              style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)' }} />
            <div className="absolute -left-20 bottom-1/4 h-[400px] w-[400px] rounded-full blur-[100px]"
              style={{ background: 'radial-gradient(circle, rgba(212,168,67,0.06) 0%, transparent 70%)' }} />
          </div>
        )}

        <Particles />

        <div className="relative mx-auto max-w-7xl px-6 w-full z-10 text-center">
          {/* Badge */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[10px] uppercase font-mono tracking-[0.2em] transition-all duration-300"
              style={{
                borderColor: 'rgba(0,212,255,0.2)',
                background: isDark ? 'rgba(6,12,20,0.6)' : 'rgba(241,245,249,0.8)',
                color: 'var(--oracle)',
              }}>
              <span className="h-1.5 w-1.5 animate-ping rounded-full" style={{ background: 'var(--oracle)' }} />
              SYS::ELO-2026 / AI-EDUCATION / ACTIVE
            </div>
          </div>

          {/* Headline */}
          <div className="mt-10">
            <h1 className="mx-auto max-w-5xl text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-7xl md:text-8xl"
              style={{ fontFamily: 'Syne, sans-serif' }}>
              <span style={{ color: 'var(--foreground)' }}>Know yourself.</span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-teal-300 bg-clip-text text-transparent italic font-normal tracking-wide pr-2">
                Learn your way.
              </span>
            </h1>
          </div>

          <p className="mx-auto mt-8 max-w-2xl text-base md:text-lg font-normal leading-relaxed"
            style={{ color: 'var(--muted-foreground)' }}>
            <span className="font-mono text-xs mr-1" style={{ color: 'var(--oracle)' }}>[0RACLE]</span>
            discovers who you are.
            <span className="font-mono text-xs mx-1" style={{ color: 'var(--rawi)' }}>[RAWI]</span>
            builds your curriculum.
            <span className="font-mono text-xs mx-1" style={{ color: 'var(--spark)' }}>[SPARK]</span>
            connects it to the world.
          </p>

          {/* Pipeline tracker */}
          <div className="mt-14 flex justify-center">
            <div className="glass relative flex flex-col md:flex-row items-stretch gap-0 rounded-2xl overflow-hidden p-1 shadow-2xl">
              <PipeStep icon={<Eye className="h-4 w-4" />} name="0RACLE" sub="Know yourself" color="var(--oracle)" />
              <PipeConnector from="var(--oracle)" to="var(--rawi)" />
              <PipeStep icon={<BookOpen className="h-4 w-4" />} name="RAWI" sub="Your curriculum" color="var(--rawi)" />
              <PipeConnector from="var(--rawi)" to="var(--spark)" />
              <PipeStep icon={<Camera className="h-4 w-4" />} name="SPARK" sub="See the world" color="var(--spark)" />
              <div className="flex items-center justify-center px-1 py-2 md:py-0">
                <div className="h-px w-8 hidden md:block" style={{ background: 'linear-gradient(90deg, rgba(139,92,246,0.4), transparent)' }} />
                <ArrowRight className="h-3.5 w-3.5 rotate-90 md:rotate-0" style={{ color: 'var(--muted-foreground)', opacity: 0.3 }} />
              </div>
              <div className="flex items-center justify-center gap-2 px-6 py-4 border-t md:border-t-0 md:border-l"
                style={{ borderColor: 'var(--border)' }}>
                <Globe2 className="h-4 w-4" style={{ color: 'var(--muted-foreground)', opacity: 0.5 }} />
                <span className="text-[10px] font-black tracking-widest font-mono" style={{ color: 'var(--muted-foreground)', opacity: 0.5 }}>WORLD</span>
              </div>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/oracle"
              className="relative group overflow-hidden w-full sm:w-auto rounded-xl p-[1px] transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,212,255,0.3)]">
              <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-sky-400 rounded-xl" />
              <div className="relative px-8 py-3.5 rounded-[11px] text-sm font-semibold tracking-wide flex items-center justify-center gap-2 transition duration-300 group-hover:bg-transparent"
                style={{ background: isDark ? 'rgb(2,10,30)' : 'rgb(248,250,252)', color: 'var(--foreground)' }}>
                <Eye className="h-4 w-4 transition group-hover:text-black" style={{ color: 'var(--oracle)' }} />
                Start with 0RACLE
              </div>
            </Link>

            <Link to="/spark"
              className="relative group overflow-hidden w-full sm:w-auto rounded-xl p-[1px] transition-all duration-300 hover:shadow-[0_0_30px_rgba(139,92,246,0.25)]">
              <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-violet-500 opacity-60 group-hover:opacity-100 transition" />
              <div className="relative px-8 py-3.5 rounded-[11px] text-sm font-semibold tracking-wide flex items-center justify-center gap-2 transition duration-300 group-hover:text-white"
                style={{ background: isDark ? 'rgb(2,10,30)' : 'rgb(248,250,252)', color: 'var(--muted-foreground)' }}>
                <Sparkles className="h-4 w-4" style={{ color: 'var(--spark)' }} /> Try SPARK
              </div>
            </Link>

            <Link to="/rawi"
              className="relative group overflow-hidden w-full sm:w-auto rounded-xl p-[1px] transition-all duration-300 hover:shadow-[0_0_30px_rgba(212,168,67,0.25)]">
              <span className="absolute inset-0 bg-gradient-to-r from-amber-500 to-yellow-600 opacity-60 group-hover:opacity-100 transition" />
              <div className="relative px-8 py-3.5 rounded-[11px] text-sm font-semibold tracking-wide flex items-center justify-center gap-2 transition duration-300 group-hover:text-white"
                style={{ background: isDark ? 'rgb(2,10,30)' : 'rgb(248,250,252)', color: 'var(--muted-foreground)' }}>
                <BookOpen className="h-4 w-4" style={{ color: 'var(--rawi)' }} /> Try RAWI
              </div>
            </Link>
          </div>

          <p className="mt-8 text-[10px] tracking-[0.15em] font-mono" style={{ color: 'var(--muted-foreground)', opacity: 0.4 }}>
            6 LANGUAGES · 50 COUNTRIES · EVERY SUBJECT · FREE FOREVER
          </p>
        </div>
      </section>

      {/* STATS */}
      <section className="relative border-y py-20" style={{ borderColor: 'var(--border)', background: isDark ? 'rgba(6,12,20,0.4)' : 'rgba(241,245,249,0.6)' }}>
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-center mb-10 font-mono text-[10px] tracking-[0.25em]" style={{ color: 'var(--muted-foreground)', opacity: 0.5 }}>
            // DATASET_METRICS
          </p>
          <div className="grid gap-px rounded-2xl overflow-hidden border md:grid-cols-3"
            style={{ background: 'var(--border)', borderColor: 'var(--border)' }}>
            <StatCard n={758000000} label="adults who cannot read or write today" source="UNESCO Report" color="var(--oracle)" bg={isDark ? '#020408' : '#f8fafc'} />
            <StatCard n={1} suffix=" in 20" label="AI interfaces running in localized non-English nodes" color="var(--rawi)" bg={isDark ? '#020408' : '#f8fafc'} />
            <StatCard n={68} suffix="%" label="students who disengage when localized contexts are omitted" color="var(--spark)" bg={isDark ? '#020408' : '#f8fafc'} />
          </div>
        </div>
      </section>

      {/* THREE TOOLS */}
      <section className="py-28 relative">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-4 text-center">
            <span className="font-mono text-[10px] tracking-[0.25em]" style={{ color: 'var(--oracle)', opacity: 0.6 }}>// CORE_ARCHITECTURE</span>
          </div>
          <h2 className="text-center text-4xl font-extrabold tracking-tight md:text-5xl" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--foreground)' }}>
            Three tools.{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">One core flow.</span>
          </h2>
          <p className="mt-4 text-center max-w-xl mx-auto text-sm" style={{ color: 'var(--muted-foreground)' }}>
            0RACLE constructs user identities. RAWI engineers structured streams. SPARK anchors spatial learning maps.
          </p>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            <ToolCard
              to="/oracle"
              icon={<Eye className="h-7 w-7" />}
              name="0RACLE"
              eyeMotif
              sub="Identity alignment engine"
              color="oracle"
              cssColor="var(--oracle)"
              features={[
                '15-exchange structured interview',
                'Deep cognitive profile maps',
                'Curriculum specification build',
                'Direct native export to RAWI',
              ]}
            />
            <ToolCard
              to="/rawi"
              icon={<BookOpen className="h-7 w-7" />}
              name="RAWI"
              bookMotif
              sub="Curriculum execution stream"
              color="rawi"
              cssColor="var(--rawi)"
              features={[
                'Full cultural localization matrices',
                'Curated visual content per topic',
                'Open-access validation paths',
                'Granular telemetry tracking',
              ]}
            />
            <ToolCard
              to="/spark"
              icon={<Camera className="h-7 w-7" />}
              name="SPARK"
              cameraMotif
              sub="Spatial reality translation node"
              color="spark"
              cssColor="var(--spark)"
              features={[
                'Optical cross-subject compilation',
                'Real-world environment binding',
                'Regional contextual definitions',
                'Bidirectional pipeline validation',
              ]}
            />
          </div>
        </div>
      </section>

      {/* LANGUAGE SLIDER */}
      <section className="py-24 border-y" style={{ borderColor: 'var(--border)', background: isDark ? 'rgba(6,12,20,0.2)' : 'rgba(241,245,249,0.4)' }}>
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-3 text-center">
            <span className="font-mono text-[10px] tracking-[0.25em]" style={{ color: 'var(--rawi)', opacity: 0.7 }}>// PACKET_LOCALIZATION</span>
          </div>
          <h2 className="text-center text-3xl font-bold md:text-4xl" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--foreground)' }}>
            Real fluency in <span style={{ color: 'var(--rawi)' }}>six global vectors</span>
          </h2>
          <p className="mt-3 text-center text-sm" style={{ color: 'var(--muted-foreground)' }}>
            Full layout shifting system built for Arabic and Urdu.
          </p>
          <div className="mt-12 flex gap-4 overflow-x-auto pb-6 scrollbar-hide snap-x">
            {LANGUAGES.map((l) => (
              <div key={l.code} className="glass scan-on-hover snap-center min-w-[280px] flex-shrink-0 rounded-xl p-6 shadow-lg transition-all duration-300 hover:-translate-y-1"
                style={{ border: '1px solid var(--border)' }}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl filter drop-shadow-md">{l.flag}</span>
                  <Languages className="h-4 w-4" style={{ color: 'var(--muted-foreground)', opacity: 0.4 }} />
                </div>
                <p className="text-sm font-bold" style={{ color: 'var(--foreground)', fontFamily: 'Syne, sans-serif' }}>{l.name}</p>
                <div className="mt-3 rounded-lg p-3 text-xs border h-16 flex items-center"
                  dir={l.rtl ? 'rtl' : 'ltr'}
                  style={{ background: isDark ? 'rgba(0,0,0,0.4)' : 'rgba(15,23,42,0.04)', borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}>
                  {sample(l.code)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ACTIVATION BANNER */}
      <section className="relative py-32 overflow-hidden border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="pointer-events-none absolute inset-0 tech-grid opacity-20" />
        {isDark && (
          <div className="pointer-events-none absolute inset-0"
            style={{ background: 'radial-gradient(circle at 50% 50%, rgba(0,212,255,0.05) 0%, transparent 60%)' }} />
        )}
        <div className="relative mx-auto max-w-3xl px-6 text-center z-10">
          <p className="mb-4 font-mono text-[10px] tracking-[0.3em]" style={{ color: 'var(--oracle)' }}>// PIPELINE_ACTIVATION_SEQUENCE</p>
          <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--foreground)' }}>
            Initialize in 10 seconds.
          </h2>
          <p className="mt-4 text-sm max-w-md mx-auto leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
            Zero configurations required. Fully open-access system designed to optimize personal learning maps.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/oracle"
              className="relative group overflow-hidden w-full sm:w-auto rounded-xl p-[1px] transition duration-300 hover:shadow-[0_0_35px_rgba(0,212,255,0.35)]">
              <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-sky-400 rounded-xl" />
              <div className="relative px-9 py-4 rounded-[11px] text-base font-semibold tracking-wide flex items-center justify-center gap-2 transition duration-300 group-hover:bg-transparent"
                style={{ background: isDark ? 'rgb(2,10,30)' : 'rgb(248,250,252)', color: 'var(--foreground)' }}>
                <Eye className="h-5 w-5 group-hover:text-black transition" style={{ color: 'var(--oracle)' }} /> Start with 0RACLE
              </div>
            </Link>
            <Link to="/spark"
              className="relative group overflow-hidden w-full sm:w-auto rounded-xl p-[1px] transition duration-300 hover:shadow-[0_0_35px_rgba(139,92,246,0.3)]">
              <span className="absolute inset-0 bg-gradient-to-r from-purple-500 to-violet-500 opacity-70 group-hover:opacity-100 transition" />
              <div className="relative px-9 py-4 rounded-[11px] text-base font-semibold tracking-wide flex items-center justify-center gap-2 transition duration-300 group-hover:text-white"
                style={{ background: isDark ? 'rgb(2,10,30)' : 'rgb(248,250,252)', color: 'var(--muted-foreground)' }}>
                <Sparkles className="h-5 w-5" style={{ color: 'var(--spark)' }} /> Try SPARK
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function PipeConnector({ from, to }: { from: string; to: string }) {
  return (
    <div className="flex items-center justify-center px-1 py-2 md:py-0">
      <div className="h-px w-12 hidden md:block" style={{ background: `linear-gradient(90deg, ${from}60, ${to}60)` }} />
      <ArrowRight className="h-3.5 w-3.5 rotate-90 md:rotate-0" style={{ color: 'var(--muted-foreground)', opacity: 0.4 }} />
    </div>
  );
}

function PipeStep({ icon, name, sub, color }: { icon: React.ReactNode; name: string; sub: string; color: string }) {
  return (
    <div className="flex items-center gap-4 px-6 py-4 transition-all duration-300 rounded-xl group"
      style={{ cursor: 'default' }}
      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)') }
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
      <div className="p-2.5 rounded-lg transition duration-300 group-hover:scale-110"
        style={{ color, background: `${color}10`, border: `1px solid ${color}20` }}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-extrabold tracking-wide" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--foreground)' }}>{name}</p>
        <p className="text-[10px] font-mono tracking-wide" style={{ color: `${color}cc` }}>{sub}</p>
      </div>
    </div>
  );
}

function StatCard({ n, suffix, label, source, color, bg }: {
  n: number; suffix?: string; label: string; source?: string; color: string; bg: string;
}) {
  return (
    <div className="p-10 transition duration-300" style={{ background: bg }}>
      <div className="text-4xl font-black md:text-5xl tracking-tight font-mono" style={{ color }}>
        <CountUp end={n} suffix={suffix ?? ''} />
      </div>
      <p className="mt-4 text-xs font-medium leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>{label}</p>
      {source && <p className="mt-2 text-[10px] font-mono uppercase tracking-wider" style={{ color: 'var(--muted-foreground)', opacity: 0.5 }}>// Ref: {source}</p>}
    </div>
  );
}

function ToolCard({ to, icon, name, sub, cssColor, features, eyeMotif, bookMotif, cameraMotif }: {
  to: string; icon: React.ReactNode; name: string; sub: string;
  color: string; cssColor: string; features: string[];
  eyeMotif?: boolean; bookMotif?: boolean; cameraMotif?: boolean;
}) {
  return (
    <Link to={to as string}
      className="hud-card scan-on-hover glass relative group block rounded-2xl p-8 transition-all duration-500 hover:-translate-y-2 overflow-hidden"
      style={{ boxShadow: `inset 0 0 40px ${cssColor}03` }}>
      {/* Hover radial */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{ background: `radial-gradient(circle at 10% 10%, ${cssColor}0c, transparent 50%)` }} />

      {/* Motif background */}
      {eyeMotif && (
        <div className="absolute -bottom-6 -right-6 h-32 w-32 opacity-[0.04] transition-all duration-500 group-hover:opacity-[0.08]">
          <Eye className="h-full w-full" style={{ color: cssColor }} />
        </div>
      )}
      {bookMotif && (
        <div className="absolute -bottom-6 -right-6 h-32 w-32 opacity-[0.04] transition-all duration-500 group-hover:opacity-[0.08]">
          <BookOpen className="h-full w-full" style={{ color: cssColor }} />
        </div>
      )}
      {cameraMotif && (
        <div className="absolute -bottom-6 -right-6 h-32 w-32 opacity-[0.04] transition-all duration-500 group-hover:opacity-[0.08]">
          <Camera className="h-full w-full" style={{ color: cssColor }} />
        </div>
      )}

      <div className="flex items-center gap-4 mb-6 relative z-10">
        <div className="grid h-12 w-12 place-items-center rounded-xl transition duration-500 group-hover:scale-110 border"
          style={{ background: `${cssColor}10`, borderColor: `${cssColor}25`, boxShadow: `0 0 20px ${cssColor}10` }}>
          <span style={{ color: cssColor }}>{icon}</span>
        </div>
        <div>
          <h3 className="text-lg font-bold tracking-wide" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--foreground)' }}>{name}</h3>
          <p className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>{sub}</p>
        </div>
      </div>

      <ul className="space-y-3 mb-8 relative z-10">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-3 text-xs font-medium leading-normal transition"
            style={{ color: 'var(--muted-foreground)' }}>
            <span className="mt-2 h-1 w-2 flex-shrink-0 rounded-full transition-all duration-300 group-hover:w-3"
              style={{ background: cssColor }} />
            {f}
          </li>
        ))}
      </ul>

      <div className="inline-flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase font-mono border-b border-transparent group-hover:border-current transition duration-300 relative z-10"
        style={{ color: cssColor }}>
        INITIALIZE MODULE <ArrowRight className="h-3 w-3 transition duration-300 group-hover:translate-x-1" />
      </div>
    </Link>
  );
}

function Particles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden mix-blend-screen">
      {Array.from({ length: 45 }).map((_, i) => (
        <span key={i} className="absolute rounded-full animate-pulse"
          style={{
            left: `${(i * 53 + 7) % 100}%`,
            top: `${(i * 37 + 11) % 100}%`,
            width: i % 4 === 0 ? '2.5px' : '1.5px',
            height: i % 4 === 0 ? '2.5px' : '1.5px',
            background: i % 3 === 0 ? 'rgba(0,212,255,0.7)' : i % 3 === 1 ? 'rgba(212,168,67,0.6)' : 'rgba(139,92,246,0.6)',
            opacity: 0.35 + (i % 3) * 0.15,
            animationDelay: `${(i * 0.4) % 4}s`,
            animationDuration: `${4 + (i % 4)}s`,
          }}
        />
      ))}
    </div>
  );
}

function sample(code: string) {
  const s: Record<string, string> = {
    en: 'Discover photosynthesis through the palm trees you already know.',
    ar: 'اكتشف عملية البناء الضوئي من خلال نخيل تعرفه.',
    fr: 'Découvre la photosynthèse à travers les arbres de ta région.',
    ur: 'اپنے قریب موجود پودوں سے فوٹو سنتھیسس سیکھیں۔',
    es: 'Descubre la fotosíntesis con las plantas de tu región.',
    sw: 'Gundua usanisinuru kupitia mimea unayoijua.',
  };
  return s[code] ?? s.en;
}
