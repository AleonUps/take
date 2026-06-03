import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Eye, Send, Loader2, ArrowRight, Sparkles, BookOpen, Camera, Zap, X, AlertTriangle, ChevronRight } from 'lucide-react';
import { saveOracleProfile, saveCurriculum } from '@/lib/curriculum';
import { useTheme } from '@/lib/theme';

export const Route = createFileRoute('/oracle')({
  component: OraclePage,
});

// ── Types ──────────────────────────────────────────────────────────────────
type Stage = 'conversation' | 'report' | 'mcq';
type ChatMessage = { role: 'user' | 'assistant'; content: string };
type MBTIDimension = 'EI' | 'NS' | 'TF' | 'JP';

interface MCQOption { id: string; label: string; desc: string; dimension: MBTIDimension; pole: 'A' | 'B' }
interface MCQQuestion { id: MBTIDimension; prompt: string; options: [MCQOption, MCQOption] }

const MCQ_QUESTIONS: MCQQuestion[] = [
  {
    id: 'EI',
    prompt: 'Choose the scenario that matches your energy mapping when building a project:',
    options: [
      { id: 'E', label: 'Leading a high-energy team coordination workspace', desc: 'Collaboration, discussion, group dynamics, shared momentum', dimension: 'EI', pole: 'A' },
      { id: 'I', label: 'Building a complex, solo digital sandbox project', desc: 'Deep focus, individual exploration, quiet flow state', dimension: 'EI', pole: 'B' },
    ],
  },
  {
    id: 'NS',
    prompt: 'Which learning approach charges up your neural circuits?',
    options: [
      { id: 'N', label: 'Inventing a completely new concept from scratch', desc: 'Abstract thinking, future possibilities, big-picture systems', dimension: 'NS', pole: 'A' },
      { id: 'S', label: 'Mastering an existing proven method step-by-step', desc: 'Concrete facts, tested techniques, practical real-world results', dimension: 'NS', pole: 'B' },
    ],
  },
  {
    id: 'TF',
    prompt: 'When making a tough decision in your team project:',
    options: [
      { id: 'T', label: 'I analyze the data and pick the most logical path', desc: 'Objective criteria, systematic thinking, results-first focus', dimension: 'TF', pole: 'A' },
      { id: 'F', label: 'I consider how everyone will feel about the outcome', desc: 'Emotional impact, team harmony, values-based choice', dimension: 'TF', pole: 'B' },
    ],
  },
  {
    id: 'JP',
    prompt: 'Your ideal project workflow when starting something new:',
    options: [
      { id: 'J', label: 'Detailed roadmap, timeline, and clear milestones', desc: 'Structured, organized, systematic execution plan', dimension: 'JP', pole: 'A' },
      { id: 'P', label: 'Jump in and adapt — figure it out as you go', desc: 'Flexible, spontaneous, discovery-driven momentum', dimension: 'JP', pole: 'B' },
    ],
  },
];

const MBTI_PROFILES: Record<string, { career: string; style: string; strengths: string[]; gaps: string[] }> = {
  ENTJ: { career: 'Strategic Business Leader', style: 'Project-based', strengths: ['Systems thinking', 'Leadership', 'Strategic planning'], gaps: ['Emotional intelligence', 'Patience', 'Detail work'] },
  INTJ: { career: 'Research Scientist / Systems Architect', style: 'Reading/Writing', strengths: ['Deep analysis', 'Abstract reasoning', 'Independent research'], gaps: ['Collaboration', 'Communication', 'Practical application'] },
  ENTP: { career: 'Innovation Entrepreneur', style: 'Project-based', strengths: ['Creative problem solving', 'Debate', 'Adaptability'], gaps: ['Follow-through', 'Routine tasks', 'Emotional sensitivity'] },
  INTP: { career: 'Computer Scientist / Mathematician', style: 'Reading/Writing', strengths: ['Logical reasoning', 'Pattern recognition', 'Complex analysis'], gaps: ['Social skills', 'Practical execution', 'Deadlines'] },
  ENTF: { career: 'Social Entrepreneur', style: 'Auditory', strengths: ['Inspiring others', 'Visionary thinking', 'Communication'], gaps: ['Detail orientation', 'Conflict resolution', 'Data analysis'] },
  ENFJ: { career: 'Education Leader / Counselor', style: 'Auditory', strengths: ['Empathy', 'Communication', 'Team building'], gaps: ['Objectivity', 'Self-care', 'Saying no'] },
  INFJ: { career: 'Psychologist / Writer', style: 'Reading/Writing', strengths: ['Insight', 'Creative thinking', 'Deep empathy'], gaps: ['Perfectionism', 'Boundaries', 'Practicality'] },
  ENFP: { career: 'Creative Director / Activist', style: 'Project-based', strengths: ['Creativity', 'People skills', 'Enthusiasm'], gaps: ['Focus', 'Routine', 'Follow-through'] },
  INFP: { career: 'Writer / Artist / Therapist', style: 'Visual', strengths: ['Creativity', 'Empathy', 'Values-driven work'], gaps: ['Productivity', 'Conflict avoidance', 'Practicality'] },
  ESTJ: { career: 'Operations Manager / Judge', style: 'Hands-on', strengths: ['Organization', 'Reliability', 'Leadership'], gaps: ['Flexibility', 'Creativity', 'Emotional sensitivity'] },
  ISTJ: { career: 'Accountant / Engineer / Doctor', style: 'Reading/Writing', strengths: ['Reliability', 'Precision', 'Duty'], gaps: ['Adaptability', 'Innovation', 'Social networking'] },
  ESFJ: { career: 'Nurse / Teacher / Community Leader', style: 'Auditory', strengths: ['Care for others', 'Organization', 'Loyalty'], gaps: ['Objectivity', 'Boundaries', 'Handling criticism'] },
  ISFJ: { career: 'Healthcare Worker / Social Worker', style: 'Hands-on', strengths: ['Attention to detail', 'Caring', 'Dependability'], gaps: ['Assertiveness', 'Change management', 'Self-promotion'] },
  ESTP: { career: 'Entrepreneur / Athlete / Surgeon', style: 'Hands-on', strengths: ['Action-oriented', 'Adaptability', 'Risk-taking'], gaps: ['Long-term planning', 'Patience', 'Sensitivity'] },
  ISTP: { career: 'Mechanical Engineer / Pilot', style: 'Hands-on', strengths: ['Problem solving', 'Efficiency', 'Technical skills'], gaps: ['Communication', 'Long-term vision', 'Collaboration'] },
  ESFP: { career: 'Performer / Events Manager / Designer', style: 'Visual', strengths: ['Energy', 'Creativity', 'People skills'], gaps: ['Planning', 'Focus', 'Following rules'] },
  ISFP: { career: 'Artist / Designer / Chef', style: 'Visual', strengths: ['Creativity', 'Flexibility', 'Sensitivity'], gaps: ['Assertiveness', 'Planning', 'Long-term focus'] },
};

// ── Main Component ──────────────────────────────────────────────────────────
function OraclePage() {
  const { isDark } = useTheme();
  const [stage, setStage] = useState<Stage>('conversation');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [exchangeCount, setExchangeCount] = useState(0);
  const [profileReady, setProfileReady] = useState(false);
  const [profile, setProfile] = useState<ReturnType<typeof buildProfileFromMBTI> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isBuildingProfile, setIsBuildingProfile] = useState(false);

  // MCQ state
  const [showMcqWarning, setShowMcqWarning] = useState(false);
  const [mcqMode, setMcqMode] = useState(false);
  const [mcqStep, setMcqStep] = useState(0);
  const [mcqAnswers, setMcqAnswers] = useState<Record<MBTIDimension, string>>({} as Record<MBTIDimension, string>);
  const [mcqComplete, setMcqComplete] = useState(false);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [terminalProgress, setTerminalProgress] = useState(0);
  const [terminalLog, setTerminalLog] = useState<string[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
  useEffect(() => {
    if (!isLoading && stage === 'conversation' && messages.length > 0) inputRef.current?.focus();
  }, [isLoading, stage, messages.length]);

  // ── Terminal loading animation ──────────────────────────────────────────
  const runTerminalAnimation = useCallback(async () => {
    const logs = [
      'SYS_INIT // LOADING_IDENTITY_MATRIX...',
      'VECTOR_ANALYSIS // SCANNING_RESPONSE_PATTERNS...',
      'COGNITIVE_MAP // BUILDING_PROFILE_STRUCTURE...',
      'PERSONALITY_ENGINE // CROSS_REFERENCING_MBTI_NODES...',
      'CURRICULUM_BUILDER // MAPPING_CAREER_PATHWAYS...',
      'SYS_STATUS // RESOLVING_AMBIGUITY_PATHWAYS... SUCCESS',
    ];

    setTerminalProgress(0);
    setTerminalLog([]);

    for (let i = 0; i < logs.length; i++) {
      await new Promise(r => setTimeout(r, 400));
      setTerminalLog(prev => [...prev, logs[i]]);
      setTerminalProgress(Math.round(((i + 1) / logs.length) * 100));
    }
  }, []);

  // ── Chat with AI (via Supabase Edge Function) ──────────────────────────
  const sendMessage = async (userMsg: string) => {
    if (!userMsg.trim() || isLoading) return;
    setIsLoading(true);
    setError(null);
    const updated = [...messages, { role: 'user' as const, content: userMsg }];

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      let reply: string;

      if (supabaseUrl && supabaseKey) {
        const res = await fetch(`${supabaseUrl}/functions/v1/oracle-chat`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${supabaseKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: updated, exchangeCount: exchangeCount + 1 }),
        });
        const data = await res.json();
        reply = data.reply ?? data.message ?? JSON.stringify(data);
      } else {
        // Demo mode: simulate AI response
        reply = getDemoResponse(exchangeCount + 1);
      }

      const newMessages = [...updated, { role: 'assistant' as const, content: reply }];
      setMessages(newMessages);
      setExchangeCount(c => c + 1);
      if (reply.includes('[PROFILE_READY]') || exchangeCount >= 14) setProfileReady(true);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const startConversation = async () => {
    setIsLoading(true);
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      let reply: string;

      if (supabaseUrl && supabaseKey) {
        const res = await fetch(`${supabaseUrl}/functions/v1/oracle-chat`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${supabaseKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: [], exchangeCount: 0 }),
        });
        const data = await res.json();
        reply = data.reply ?? data.message ?? JSON.stringify(data);
      } else {
        reply = "Hello! I'm 0RACLE. I'm here to understand you — your dreams, your learning style, and where you want to go. Let's start with something simple: what country do you live in, and what's one thing you've always wanted to learn or become?";
      }

      setMessages([{ role: 'assistant', content: reply }]);
      setExchangeCount(1);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const generateProfileFromConversation = async () => {
    setIsBuildingProfile(true);
    await runTerminalAnimation();

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      const summary = messages.map(m => `${m.role}: ${m.content}`).join('\n');

      let profileData: ReturnType<typeof buildProfileFromMBTI>;

      if (supabaseUrl && supabaseKey) {
        const res = await fetch(`${supabaseUrl}/functions/v1/oracle-profile`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${supabaseKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ conversationSummary: summary }),
        });
        profileData = await res.json();
      } else {
        profileData = buildProfileFromMBTI('INTJ', 'SA', 'en');
      }

      setProfile(profileData);
      setStage('report');
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIsBuildingProfile(false);
    }
  };

  // ── MCQ Handlers ─────────────────────────────────────────────────────────
  const confirmMcq = () => {
    setShowMcqWarning(false);
    setMcqMode(true);
    setStage('mcq');
    setMcqStep(0);
    setMcqAnswers({} as Record<MBTIDimension, string>);
    setMcqComplete(false);
    setSelectedCard(null);
  };

  const selectMcqOption = async (option: MCQOption) => {
    setSelectedCard(option.id);
    await new Promise(r => setTimeout(r, 350));

    const newAnswers = { ...mcqAnswers, [option.dimension]: option.id };
    setMcqAnswers(newAnswers);

    if (mcqStep < MCQ_QUESTIONS.length - 1) {
      setSelectedCard(null);
      setMcqStep(s => s + 1);
    } else {
      // All answered
      setMcqComplete(true);
      await processMcqAnswers(newAnswers);
    }
  };

  const processMcqAnswers = async (answers: Record<MBTIDimension, string>) => {
    setIsBuildingProfile(true);
    await runTerminalAnimation();

    const code = (answers.EI || 'I') + (answers.NS || 'N') + (answers.TF || 'T') + (answers.JP || 'J');
    const profileData = buildProfileFromMBTI(code, 'SA', 'en');
    setProfile(profileData);
    setStage('report');
    setIsBuildingProfile(false);
  };

  const handleBuildCurriculum = () => {
    if (!profile) return;
    const mapped = profile.curriculum.map(c => ({
      subject: c.subject, color: c.color,
      topics: c.topics.map(t => ({
        id: `${c.subject}_${t.replace(/\s+/g, '_').slice(0, 30)}`,
        title: t, completed: false,
      })),
    }));
    saveOracleProfile({ ...profile, curriculum: mapped });
    saveCurriculum({
      id: `oracle_${crypto.randomUUID()}`,
      career: profile.career, learningStyle: profile.learningStyle,
      country: profile.country, countryCode: profile.countryCode,
      language: profile.language, grade: profile.grade,
      knowledgeLevel: profile.knowledgeLevel,
      strengths: profile.strengths, gaps: profile.gaps,
      curriculum: mapped, createdAt: Date.now(),
    });
    navigate({
      to: '/rawi',
      search: {
        career: profile.career, countryCode: profile.countryCode,
        countryName: profile.country, lang: profile.language,
        langName: profile.languageName, grade: profile.grade,
        style: profile.learningStyle, fromOracle: 'true',
        subjects: profile.curriculum.map(c => c.subject).join(','),
      },
    });
  };

  const pct = Math.min(100, Math.round((exchangeCount / 15) * 100));
  const mcqPct = mcqStep < MCQ_QUESTIONS.length ? Math.round((mcqStep / MCQ_QUESTIONS.length) * 100) : 100;

  // ── Terminal loading screen ───────────────────────────────────────────────
  if (isBuildingProfile) {
    return <TerminalLoadingScreen progress={terminalProgress} logs={terminalLog} isDark={isDark} />;
  }

  // ── MCQ stage ─────────────────────────────────────────────────────────────
  if (stage === 'mcq' && !isBuildingProfile) {
    const currentQ = MCQ_QUESTIONS[mcqStep];
    return (
      <div className="relative min-h-screen" style={{ background: 'var(--background)' }} data-tool="oracle">
        <div className="pointer-events-none absolute inset-0 tech-grid" />
        {isDark && (
          <div className="pointer-events-none absolute inset-0"
            style={{ background: 'radial-gradient(circle at 50% 20%, rgba(0,212,255,0.06) 0%, transparent 60%)' }} />
        )}

        <div className="relative mx-auto max-w-3xl px-4 py-12">
          {/* Header */}
          <div className="mb-8 text-center animate-fade-up">
            <p className="mb-2 text-xs font-mono tracking-[0.2em]" style={{ color: 'rgba(0,212,255,0.5)' }}>
              // FAST_TRACK_MCQ_ENGINE
            </p>
            <h1 className="text-3xl font-bold" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--foreground)' }}>
              Psychometric Diagnostic
            </h1>
          </div>

          {/* COGNITIVE_ALIGNMENT progress */}
          <div className="mb-8 rounded-xl p-4 animate-fade-up"
            style={{ background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.1)' }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono tracking-widest" style={{ color: 'var(--oracle)' }}>
                COGNITIVE_ALIGNMENT
              </span>
              <span className="text-xs font-mono font-bold" style={{ color: 'var(--oracle)' }}>
                {mcqPct}%
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: 'rgba(0,212,255,0.1)' }}>
              <div className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${mcqPct}%`,
                  background: 'linear-gradient(90deg, var(--oracle), var(--oracle-light))',
                  boxShadow: '0 0 10px rgba(0,212,255,0.4)',
                }} />
            </div>
            <div className="mt-2 flex justify-between">
              {MCQ_QUESTIONS.map((q, i) => (
                <div key={q.id} className="flex flex-col items-center gap-1">
                  <div className="h-1.5 w-1.5 rounded-full transition-all duration-300"
                    style={{
                      background: i < mcqStep ? 'var(--oracle)' : i === mcqStep ? 'var(--oracle)' : 'rgba(0,212,255,0.2)',
                      boxShadow: i <= mcqStep ? '0 0 6px rgba(0,212,255,0.5)' : 'none',
                    }} />
                  <span className="text-[8px] font-mono" style={{ color: 'rgba(0,212,255,0.4)' }}>{q.id}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Question */}
          <div className="mb-6 animate-fade-up" style={{ animationDelay: '50ms' }}>
            <p className="text-xs font-mono mb-3" style={{ color: 'rgba(0,212,255,0.4)' }}>
              QUESTION_{mcqStep + 1}/{MCQ_QUESTIONS.length}
            </p>
            <h2 className="text-xl font-semibold leading-relaxed" style={{ color: 'var(--foreground)', fontFamily: 'Syne, sans-serif' }}>
              {currentQ.prompt}
            </h2>
          </div>

          {/* Choice cards */}
          <div className="grid gap-4 md:grid-cols-2 animate-fade-up" style={{ animationDelay: '100ms' }}>
            {currentQ.options.map((opt, idx) => (
              <button
                key={opt.id}
                onClick={() => selectMcqOption(opt)}
                className={`mcq-card text-left ${selectedCard === opt.id ? 'selected' : ''}`}
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 h-8 w-8 rounded-lg grid place-items-center text-xs font-black font-mono"
                    style={{
                      background: selectedCard === opt.id ? 'rgba(0,212,255,0.2)' : 'rgba(0,212,255,0.06)',
                      border: `1px solid ${selectedCard === opt.id ? 'var(--oracle)' : 'rgba(0,212,255,0.15)'}`,
                      color: 'var(--oracle)',
                    }}>
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold leading-snug mb-2" style={{ color: 'var(--foreground)' }}>
                      {opt.label}
                    </p>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                      {opt.desc}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 flex-shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition"
                    style={{ color: 'var(--oracle)' }} />
                </div>

                {/* Bottom MBTI label */}
                <div className="mt-3 pt-3 border-t flex items-center justify-between"
                  style={{ borderColor: 'rgba(0,212,255,0.06)' }}>
                  <span className="text-[9px] font-mono tracking-widest" style={{ color: 'rgba(0,212,255,0.3)' }}>
                    VECTOR_{opt.id}
                  </span>
                  <ArrowRight className="h-3 w-3" style={{ color: 'rgba(0,212,255,0.3)' }} />
                </div>
              </button>
            ))}
          </div>

          {/* Skip / Back to conversation */}
          <div className="mt-8 text-center animate-fade-up" style={{ animationDelay: '200ms' }}>
            <button
              onClick={() => { setStage('conversation'); setMcqMode(false); }}
              className="text-xs font-mono transition-all"
              style={{ color: 'var(--muted-foreground)', opacity: 0.5 }}
            >
              ← ABORT_MCQ // Return to deep conversation mode
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Report stage ──────────────────────────────────────────────────────────
  if (stage === 'report' && profile) {
    return (
      <div className="relative min-h-screen" style={{ background: 'var(--background)' }} data-tool="oracle">
        <div className="pointer-events-none absolute inset-0 tech-grid" />
        {isDark && (
          <div className="pointer-events-none absolute inset-0"
            style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(0,212,255,0.06) 0%, transparent 60%)' }} />
        )}

        <div className="relative mx-auto max-w-4xl px-4 py-14">
          <div className="mb-8 text-center animate-fade-up">
            <p className="mb-3 text-xs font-mono tracking-[0.2em]" style={{ color: 'rgba(0,212,255,0.5)' }}>
              // IDENTITY_REPORT_GENERATED
            </p>
            <h1 className="text-4xl font-bold" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--foreground)' }}>
              Your Learning DNA
            </h1>
          </div>

          {/* Career reveal */}
          <div className="hud-card hud-card-oracle mb-5 rounded-xl p-8 animate-fade-up"
            style={{ background: isDark ? 'rgba(0,212,255,0.05)' : 'rgba(2,132,199,0.04)', border: '1px solid rgba(0,212,255,0.15)' }}>
            <p className="mb-2 text-xs font-mono tracking-[0.15em]" style={{ color: 'rgba(0,212,255,0.5)' }}>DREAM_CAREER</p>
            <TypewriterText text={profile.career} className="text-3xl font-bold"
              style={{ fontFamily: 'Syne, sans-serif', color: 'var(--foreground)' }} speed={35} />
          </div>

          {/* Stats grid */}
          <div className="grid gap-px md:grid-cols-3 mb-5 animate-fade-up rounded-xl overflow-hidden"
            style={{ animationDelay: '100ms', background: 'var(--border)' }}>
            {[
              { l: 'LEARNING_STYLE', v: profile.learningStyle, c: 'var(--oracle)' },
              { l: 'KNOWLEDGE_LEVEL', v: profile.knowledgeLevel, c: 'var(--foreground)' },
              { l: 'COUNTRY', v: profile.country, c: 'var(--foreground)' },
            ].map(item => (
              <div key={item.l} className="p-5" style={{ background: 'var(--background)' }}>
                <p className="mb-1 text-xs font-mono tracking-[0.12em]" style={{ color: 'rgba(0,212,255,0.4)' }}>{item.l}</p>
                <p className="text-base font-semibold" style={{ color: item.c, fontFamily: 'Syne, sans-serif' }}>{item.v}</p>
              </div>
            ))}
          </div>

          {/* Strengths */}
          <div className="mb-4 rounded-xl p-5 animate-fade-up"
            style={{ animationDelay: '200ms', background: isDark ? 'rgba(6,12,20,0.8)' : 'rgba(241,245,249,0.8)', border: '1px solid rgba(0,212,255,0.08)' }}>
            <p className="mb-3 text-xs font-mono tracking-[0.12em]" style={{ color: 'rgba(0,212,255,0.4)' }}>STRENGTHS</p>
            <div className="flex flex-wrap gap-2">
              {profile.strengths.map((s, i) => (
                <span key={i} className="rounded-sm px-3 py-1 text-sm"
                  style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)', color: 'var(--oracle)' }}>
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Gaps */}
          <div className="mb-4 rounded-xl p-5 animate-fade-up"
            style={{ animationDelay: '300ms', background: isDark ? 'rgba(6,12,20,0.8)' : 'rgba(241,245,249,0.8)', border: '1px solid rgba(255,80,80,0.08)' }}>
            <p className="mb-3 text-xs font-mono tracking-[0.12em]" style={{ color: 'rgba(255,100,100,0.5)' }}>KNOWLEDGE_GAPS</p>
            <div className="flex flex-wrap gap-2">
              {profile.gaps.map((g, i) => (
                <span key={i} className="rounded-sm px-3 py-1 text-sm"
                  style={{ background: 'rgba(255,80,80,0.06)', border: '1px solid rgba(255,80,80,0.2)', color: 'rgba(255,120,120,0.8)' }}>
                  {g}
                </span>
              ))}
            </div>
          </div>

          {/* Curriculum path */}
          <div className="mb-8 animate-fade-up" style={{ animationDelay: '400ms' }}>
            <p className="mb-4 text-xs font-mono tracking-[0.12em]" style={{ color: 'rgba(0,212,255,0.4)' }}>CURRICULUM_PATH</p>
            <div className="space-y-2">
              {profile.curriculum.map((s, i) => (
                <div key={i} className="rounded-lg p-4 scan-on-hover"
                  style={{ background: isDark ? 'rgba(6,12,20,0.8)' : 'rgba(241,245,249,0.8)', border: '1px solid rgba(0,212,255,0.06)', borderLeft: `2px solid ${s.color}` }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold" style={{ color: s.color, fontFamily: 'Syne, sans-serif' }}>{s.subject}</span>
                    <span className="text-xs font-mono" style={{ color: 'var(--muted-foreground)', opacity: 0.4 }}>{s.topics.length}_TOPICS</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {s.topics.map((t, j) => (
                      <span key={j} className="rounded-sm px-2 py-0.5 text-xs"
                        style={{ background: isDark ? 'rgba(0,0,0,0.4)' : 'rgba(15,23,42,0.06)', color: 'var(--muted-foreground)', border: '1px solid var(--border)' }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center animate-fade-up" style={{ animationDelay: '600ms' }}>
            <div className="flex items-center justify-center gap-4 mb-6">
              {[
                { icon: <Eye className="h-4 w-4" />, color: 'var(--oracle)', borderColor: 'rgba(0,212,255,0.3)', bg: 'rgba(0,212,255,0.08)' },
                { icon: <BookOpen className="h-4 w-4" />, color: 'var(--rawi)', borderColor: 'rgba(212,168,67,0.3)', bg: 'rgba(212,168,67,0.08)' },
                { icon: <Camera className="h-4 w-4" />, color: 'var(--spark)', borderColor: 'rgba(139,92,246,0.3)', bg: 'rgba(139,92,246,0.08)' },
              ].map((item, i) => (
                <>
                  <div key={i} className="grid h-10 w-10 place-items-center rounded-lg"
                    style={{ border: `1px solid ${item.borderColor}`, background: item.bg }}>
                    <span style={{ color: item.color }}>{item.icon}</span>
                  </div>
                  {i < 2 && (
                    <>
                      <div className="h-px w-8" style={{ background: `linear-gradient(90deg, ${i === 0 ? 'var(--oracle)' : 'var(--rawi)'}, ${i === 0 ? 'var(--rawi)' : 'var(--spark)'})` }} />
                      <ArrowRight className="h-4 w-4" style={{ color: 'var(--muted-foreground)', opacity: 0.2 }} />
                    </>
                  )}
                </>
              ))}
            </div>
            <button onClick={handleBuildCurriculum} className="btn-rawi inline-flex items-center gap-2 rounded-lg px-10 py-4 text-sm">
              <Sparkles className="h-4 w-4" /> BUILD MY FULL CURRICULUM
            </button>
            <p className="mt-3 text-xs font-mono" style={{ color: 'var(--muted-foreground)', opacity: 0.3 }}>
              // opens RAWI with curriculum pre-loaded
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Conversation stage ────────────────────────────────────────────────────
  return (
    <div className="relative min-h-screen" style={{ background: 'var(--background)' }} data-tool="oracle">
      <div className="pointer-events-none absolute inset-0 tech-grid" />
      {isDark && (
        <div className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(circle at 50% 10%, rgba(0,212,255,0.08) 0%, transparent 60%)' }} />
      )}

      {/* MCQ WARNING MODAL */}
      {showMcqWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}>
          <div className="modal-glass hud-card hud-card-oracle rounded-2xl p-8 max-w-md w-full animate-fade-up">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 grid h-10 w-10 place-items-center rounded-xl"
                style={{ background: 'rgba(255,100,0,0.1)', border: '1px solid rgba(255,100,0,0.3)' }}>
                <AlertTriangle className="h-5 w-5" style={{ color: '#ff6400' }} />
              </div>
              <div>
                <p className="text-xs font-mono mb-1" style={{ color: 'rgba(255,100,0,0.7)' }}>
                  PIPELINE_DEGRADATION_DETECTED
                </p>
                <h3 className="text-lg font-bold" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--foreground)' }}>
                  WARNING
                </h3>
              </div>
              <button onClick={() => setShowMcqWarning(false)} className="ml-auto p-1.5 rounded-lg transition-all hover:bg-white/5">
                <X className="h-4 w-4" style={{ color: 'var(--muted-foreground)' }} />
              </button>
            </div>

            <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--muted-foreground)' }}>
              You are switching to <strong style={{ color: 'var(--oracle)' }}>Fast-Track MCQ mode</strong>.
              This reduces profiling accuracy by bypassing 0RACLE&apos;s deep conversational tracking for the sake of rapid usage.
              <br /><br />
              <span style={{ color: 'rgba(255,100,0,0.7)', fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem' }}>
                // accuracy_reduction: ~40% · speed_gain: 10x · depth_lost: HIGH
              </span>
              <br /><br />
              Proceed anyway?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowMcqWarning(false)}
                className="flex-1 rounded-xl py-3 text-sm font-semibold transition-all"
                style={{ background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.06)', border: '1px solid var(--border)', color: 'var(--foreground)' }}>
                [ABORT]
              </button>
              <button
                onClick={confirmMcq}
                className="flex-1 rounded-xl py-3 text-sm font-semibold transition-all"
                style={{ background: 'rgba(255,100,0,0.1)', border: '1px solid rgba(255,100,0,0.3)', color: '#ff9650' }}>
                [CONFIRM / SACRIFICE ACCURACY]
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="relative mx-auto max-w-3xl px-4 py-10">
        {!messages.length ? (
          /* Intro screen */
          <div className="flex min-h-[88vh] flex-col items-center justify-center">
            {/* FAST-TRACK button — top right */}
            <div className="absolute top-6 right-6">
              <button
                onClick={() => setShowMcqWarning(true)}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold font-mono tracking-wider transition-all duration-300"
                style={{
                  background: 'rgba(255,180,0,0.08)',
                  border: '1px solid rgba(255,180,0,0.25)',
                  color: '#ffb400',
                  boxShadow: '0 0 20px rgba(255,180,0,0.1)',
                }}>
                <Zap className="h-3.5 w-3.5" />
                FAST-TRACK MCQ
              </button>
            </div>

            <div className="w-full max-w-md text-center">
              {/* Oracle eye icon */}
              <div className="relative mx-auto mb-10 h-32 w-32">
                <div className="animate-ping-slow absolute inset-0 rounded-full" style={{ background: 'rgba(0,212,255,0.06)' }} />
                <div className="absolute inset-4 rounded-full" style={{ border: '1px solid rgba(0,212,255,0.15)' }} />
                <div className="absolute inset-0 grid place-items-center rounded-full animate-glow-oracle"
                  style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(0,212,255,0.05))', border: '1px solid rgba(0,212,255,0.3)' }}>
                  <Eye className="h-14 w-14" style={{ color: 'var(--oracle)' }} />
                </div>
                {/* Corner brackets */}
                {['-top-1 -left-1 border-t border-l', '-top-1 -right-1 border-t border-r', '-bottom-1 -left-1 border-b border-l', '-bottom-1 -right-1 border-b border-r'].map((cls, i) => (
                  <div key={i} className={`absolute ${cls} h-6 w-6`} style={{ borderColor: 'var(--oracle)', opacity: 0.7 }} />
                ))}
              </div>

              <p className="mb-3 text-xs font-mono tracking-[0.2em]" style={{ color: 'rgba(0,212,255,0.5)' }}>
                // IDENTITY_SYSTEM
              </p>
              <h1 className="text-5xl font-bold md:text-6xl" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--foreground)' }}>
                Meet <span className="text-gradient-oracle italic">0RACLE</span>
              </h1>
              <p className="mt-5 text-base leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                I want to understand you — your dreams, your struggles, your world. Then I'll build your complete learning path.
              </p>

              <div className="mt-8 rounded-xl p-5" style={{ background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.1)' }}>
                <div className="flex items-center justify-center gap-4 text-sm">
                  {['0RACLE', 'RAWI', 'SPARK'].map((label, i) => (
                    <>
                      <span key={label} className="font-mono text-xs" style={{ color: i === 0 ? 'var(--oracle)' : i === 1 ? 'var(--rawi)' : 'var(--spark)' }}>
                        {label}
                      </span>
                      {i < 2 && <ArrowRight key={`arrow-${i}`} className="h-3 w-3" style={{ color: 'var(--muted-foreground)', opacity: 0.2 }} />}
                    </>
                  ))}
                </div>
                <p className="mt-2 text-center text-xs font-mono" style={{ color: 'var(--muted-foreground)', opacity: 0.3 }}>
                  // your_complete_pipeline
                </p>
              </div>

              <button
                onClick={startConversation}
                disabled={isLoading}
                className="btn-oracle mt-8 inline-flex items-center gap-2 rounded-lg px-10 py-4 text-sm disabled:opacity-50">
                {isLoading
                  ? <><Loader2 className="h-4 w-4 animate-spin" /> INITIALIZING...</>
                  : <><Eye className="h-4 w-4" /> BEGIN CONVERSATION</>
                }
              </button>

              {error && <p className="mt-4 text-sm font-mono" style={{ color: '#ff6b6b' }}>ERR: {error}</p>}
            </div>
          </div>
        ) : (
          /* Active conversation */
          <div className="flex min-h-[88vh] flex-col">
            {/* FAST-TRACK button in active chat */}
            <div className="flex items-center justify-between mb-4">
              <div className="rounded-lg p-3 flex-1 mr-3"
                style={{ background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.1)' }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: 'var(--oracle)' }} />
                    <span className="text-xs font-mono tracking-[0.1em]" style={{ color: 'var(--oracle)' }}>0RACLE::ACTIVE</span>
                  </div>
                  <span className="text-xs font-mono" style={{ color: 'var(--muted-foreground)', opacity: 0.4 }}>
                    {profileReady ? 'PROFILE::READY' : `EXCHANGE_${exchangeCount}/15 · ${pct}%`}
                  </span>
                </div>
                <div className="h-0.5 w-full rounded-full overflow-hidden" style={{ background: 'rgba(0,212,255,0.1)' }}>
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, background: 'linear-gradient(90deg, var(--oracle), var(--oracle-light))' }} />
                </div>
              </div>

              <button
                onClick={() => setShowMcqWarning(true)}
                className="flex-shrink-0 inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold font-mono transition-all"
                style={{ background: 'rgba(255,180,0,0.08)', border: '1px solid rgba(255,180,0,0.2)', color: '#ffb400' }}>
                <Zap className="h-3 w-3" /> MCQ
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 space-y-4 overflow-y-auto py-4">
              {messages.map((m, i) => (
                <div key={i}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-up`}
                  style={{ animationDelay: `${i * 20}ms` }}>
                  {m.role === 'assistant' && (
                    <div className="mr-2.5 mt-1 grid h-7 w-7 flex-shrink-0 place-items-center rounded-full"
                      style={{ border: '1px solid rgba(0,212,255,0.3)', background: 'rgba(0,212,255,0.08)' }}>
                      <Eye className="h-3.5 w-3.5" style={{ color: 'var(--oracle)' }} />
                    </div>
                  )}
                  <div className={`max-w-[78%] rounded-xl px-5 py-3 text-sm leading-relaxed ${m.role === 'user' ? 'rounded-br-sm' : 'rounded-bl-sm'}`}
                    style={m.role === 'user'
                      ? { background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)', color: 'var(--foreground)' }
                      : { background: isDark ? 'rgba(6,12,20,0.9)' : 'rgba(241,245,249,0.9)', border: '1px solid rgba(0,212,255,0.08)', color: 'var(--muted-foreground)' }
                    }>
                    {m.content.replace('[PROFILE_READY]', '')}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="mr-2.5 mt-1 grid h-7 w-7 flex-shrink-0 place-items-center rounded-full"
                    style={{ border: '1px solid rgba(0,212,255,0.3)', background: 'rgba(0,212,255,0.08)' }}>
                    <Eye className="h-3.5 w-3.5 animate-pulse" style={{ color: 'var(--oracle)' }} />
                  </div>
                  <div className="rounded-xl rounded-bl-sm px-5 py-3"
                    style={{ background: isDark ? 'rgba(6,12,20,0.9)' : 'rgba(241,245,249,0.9)', border: '1px solid rgba(0,212,255,0.08)' }}>
                    <div className="flex gap-1.5 items-center">
                      {[0, 1, 2].map(j => (
                        <span key={j} className="h-1.5 w-1.5 rounded-full animate-bounce"
                          style={{ background: 'var(--oracle)', animationDelay: `${j * 150}ms`, opacity: 0.7 }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="pt-4" style={{ borderTop: '1px solid rgba(0,212,255,0.08)' }}>
              {error && <p className="mb-2 text-xs font-mono" style={{ color: '#ff6b6b' }}>ERR: {error}</p>}
              {profileReady ? (
                <button
                  onClick={generateProfileFromConversation}
                  className="btn-oracle w-full inline-flex items-center justify-center gap-2 rounded-lg py-4 text-sm disabled:opacity-50">
                  <Sparkles className="h-4 w-4" /> REVEAL MY IDENTITY
                </button>
              ) : (
                <form onSubmit={e => { e.preventDefault(); sendMessage(input); setInput(''); }} className="flex gap-3">
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Tell me more..."
                    disabled={isLoading}
                    className="flex-1 rounded-lg px-4 py-3 text-sm outline-none transition-all disabled:opacity-50"
                    style={{
                      background: 'rgba(0,212,255,0.04)',
                      border: '1px solid rgba(0,212,255,0.12)',
                      color: 'var(--foreground)',
                    }}
                  />
                  <button type="submit" disabled={isLoading || !input.trim()} className="btn-oracle rounded-lg px-5 py-3 disabled:opacity-40">
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Terminal Loading Screen ───────────────────────────────────────────────────
function TerminalLoadingScreen({ progress, logs, isDark }: { progress: number; logs: string[]; isDark: boolean }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: isDark ? '#020408' : '#f8fafc' }}>
      <div className="pointer-events-none absolute inset-0 tech-grid opacity-30" />

      <div className="relative w-full max-w-xl px-6">
        {/* Counter */}
        <div className="text-center mb-8">
          <div className="text-7xl font-black font-mono" style={{ color: 'var(--oracle)' }}>
            {String(progress).padStart(3, '0')}
            <span className="text-3xl opacity-40">%</span>
          </div>
          <div className="h-1 w-full rounded-full overflow-hidden mt-4" style={{ background: 'rgba(0,212,255,0.1)' }}>
            <div className="h-full rounded-full transition-all duration-300"
              style={{ width: `${progress}%`, background: 'linear-gradient(90deg, var(--oracle), var(--oracle-light))', boxShadow: '0 0 15px rgba(0,212,255,0.5)' }} />
          </div>
        </div>

        {/* Terminal log */}
        <div className="rounded-xl p-6 terminal-loader"
          style={{ background: isDark ? 'rgba(0,0,0,0.6)' : 'rgba(15,23,42,0.04)', border: '1px solid rgba(0,212,255,0.1)' }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="h-3 w-3 rounded-full" style={{ background: '#ff5f57' }} />
            <div className="h-3 w-3 rounded-full" style={{ background: '#febc2e' }} />
            <div className="h-3 w-3 rounded-full" style={{ background: '#28c840' }} />
            <span className="ml-2 text-[10px] tracking-widest" style={{ color: 'var(--muted-foreground)', opacity: 0.4 }}>
              0RACLE::IDENTITY_ENGINE_v2.0
            </span>
          </div>
          <div className="space-y-1 min-h-[120px]">
            {logs.map((log, i) => (
              <div key={i} className="flex items-center gap-2 animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
                <span style={{ color: 'rgba(0,212,255,0.4)' }}>$</span>
                <span style={{ color: i === logs.length - 1 ? 'var(--oracle)' : 'rgba(0,212,255,0.6)' }}>
                  {log}
                </span>
                {i === logs.length - 1 && progress < 100 && (
                  <span className="animate-terminal-blink" style={{ color: 'var(--oracle)' }}>█</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── TypewriterText ────────────────────────────────────────────────────────────
function TypewriterText({ text, className = '', style = {}, speed = 30 }: {
  text: string; className?: string; style?: React.CSSProperties; speed?: number;
}) {
  const [d, setD] = useState('');
  useEffect(() => {
    setD('');
    let i = 0;
    const t = setInterval(() => {
      if (i < text.length) { setD(text.slice(0, i + 1)); i++; } else clearInterval(t);
    }, speed);
    return () => clearInterval(t);
  }, [text, speed]);
  return (
    <span className={className} style={style}>
      {d}<span style={{ opacity: 0.5 }}>_</span>
    </span>
  );
}

// ── Demo AI response for when no Supabase configured ─────────────────────────
function getDemoResponse(count: number): string {
  const responses = [
    "Great! I can already sense your curiosity. Now, tell me — what's your dream career? Don't worry about being practical — just tell me what excites you most when you imagine your future.",
    "Interesting! And how do you usually learn best? Do you prefer watching videos, reading, hands-on projects, or talking things through with others?",
    "That's really helpful. What subject in school do you feel most confident in, and which one gives you the most trouble?",
    "I'm building a picture now. What country do you live in? And what language do you speak at home?",
    "Almost there. What grade are you in, and what's one thing happening in your life — a challenge or opportunity — that you'd love your education to help you with?",
    "I have everything I need to build your complete learning profile. [PROFILE_READY] Your responses have been very insightful — I can see a clear path forming for you.",
  ];
  return responses[Math.min(count - 1, responses.length - 1)];
}

// ── Build profile from MBTI code ──────────────────────────────────────────────
function buildProfileFromMBTI(code: string, countryCode: string, language: string) {
  const p = MBTI_PROFILES[code] ?? MBTI_PROFILES['INTJ'];
  const CURRICULUM_MAP: Record<string, Array<{ subject: string; color: string; topics: string[] }>> = {
    'Science': [
      { subject: 'Biology', color: '#00ff88', topics: ['Cell Biology', 'Genetics', 'Ecosystems', 'Evolution', 'Human Anatomy'] },
      { subject: 'Chemistry', color: '#8b5cf6', topics: ['Atomic Structure', 'Chemical Bonding', 'Reactions', 'Organic Chemistry'] },
    ],
    'Tech': [
      { subject: 'Mathematics', color: '#00d4ff', topics: ['Algebra', 'Calculus', 'Statistics', 'Linear Algebra', 'Discrete Math'] },
      { subject: 'Physics', color: '#fbbf24', topics: ['Mechanics', 'Thermodynamics', 'Electromagnetism', 'Quantum Basics'] },
    ],
    'Arts': [
      { subject: 'Cultural Studies', color: '#f43f5e', topics: ['Art History', 'World Cultures', 'Philosophy', 'Ethics', 'Communication'] },
      { subject: 'Media Literacy', color: '#a78bfa', topics: ['Digital Media', 'Critical Analysis', 'Content Creation', 'Storytelling'] },
    ],
    'Social': [
      { subject: 'Social Studies', color: '#fb923c', topics: ['Sociology', 'Psychology', 'Political Science', 'History', 'Economics'] },
      { subject: 'Ethics', color: '#e879f9', topics: ['Moral Philosophy', 'Applied Ethics', 'Human Rights', 'Justice Systems'] },
    ],
  };

  const isScience = ['INTJ', 'INTP', 'ESTJ', 'ISTJ', 'ISTP'].includes(code);
  const isTech = ['ENTJ', 'ENTP', 'ESTP'].includes(code);
  const isArts = ['INFP', 'ISFP', 'ESFP', 'ENFP'].includes(code);
  const domain = isScience ? 'Science' : isTech ? 'Tech' : isArts ? 'Arts' : 'Social';

  return {
    career: p.career,
    careerCategory: domain,
    learningStyle: p.style,
    country: countryCode === 'SA' ? 'Saudi Arabia' : 'Your Country',
    countryCode,
    language,
    languageName: 'English',
    grade: 'high',
    knowledgeLevel: 'Intermediate with strong conceptual foundations',
    strengths: p.strengths,
    gaps: p.gaps,
    curriculum: CURRICULUM_MAP[domain] ?? CURRICULUM_MAP['Social'],
  };
}
