import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useState, useRef, useEffect, useCallback } from "react";
import { Eye, Send, Loader2, ArrowRight, Sparkles, BookOpen, Camera } from "lucide-react";
import { oracleChat } from "@/lib/oracle.functions";
import { generateProfile, type OracleProfileResult } from "@/lib/oracle-profile.functions";
import { saveOracleProfile, saveCurriculum } from "@/lib/curriculum";

type Stage = "conversation" | "report";
type ChatMessage = { role: "user" | "assistant"; content: string };

export const Route = createFileRoute("/oracle")({
  head: () => ({
    meta: [
      { title: "0RACLE — Know yourself, find your path · EDUCIS" },
      { name: "description", content: "0RACLE learns who you are and builds your complete learning path." },
    ],
  }),
  component: OraclePage,
});

function OraclePage() {
  const [stage, setStage] = useState<Stage>("conversation");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [exchangeCount, setExchangeCount] = useState(0);
  const [profileReady, setProfileReady] = useState(false);
  const [profile, setProfile] = useState<OracleProfileResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatFn = useServerFn(oracleChat);
  const profileFn = useServerFn(generateProfile);
  const navigate = useNavigate();

  const chatMutation = useMutation({
    mutationFn: async (userMsg: string) => {
      const updated = [...messages, { role: "user" as const, content: userMsg }];
      return (await chatFn({ data: { messages: updated, exchangeCount: exchangeCount + 1 } })) as string;
    },
    onSuccess: (reply, userMsg) => {
      setMessages((p) => [...p, { role: "user", content: userMsg }, { role: "assistant", content: reply }]);
      setExchangeCount((c) => c + 1);
      if (reply.includes("[PROFILE_READY]")) setProfileReady(true);
    },
    onError: (e) => setError((e as Error).message),
  });

  const startMutation = useMutation({
    mutationFn: async () => (await chatFn({ data: { messages: [], exchangeCount: 0 } })) as string,
    onSuccess: (reply) => { setMessages([{ role: "assistant", content: reply }]); setExchangeCount(1); },
    onError: (e) => setError((e as Error).message),
  });

  const profileMutation = useMutation({
    mutationFn: async () => {
      const summary = messages.map((m) => `${m.role}: ${m.content}`).join("\n");
      return (await profileFn({ data: { conversationSummary: summary } })) as OracleProfileResult;
    },
    onSuccess: (data) => { setProfile(data); setStage("report"); },
    onError: (e) => setError((e as Error).message),
  });

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);
  useEffect(() => {
    if (!chatMutation.isPending && stage === "conversation" && messages.length > 0) inputRef.current?.focus();
  }, [chatMutation.isPending, stage, messages.length]);

  const handleSend = useCallback(() => {
    if (!input.trim() || chatMutation.isPending) return;
    chatMutation.mutate(input.trim());
    setInput("");
  }, [input, chatMutation]);

  const handleBuildCurriculum = () => {
    if (!profile) return;
    const mapped = profile.curriculum.map((c) => ({
      subject: c.subject, color: c.color,
      topics: c.topics.map((t) => ({ id: `${c.subject}_${t.replace(/\s+/g, "_").slice(0, 30)}`, title: t, completed: false })),
    }));
    saveOracleProfile({ ...profile, curriculum: mapped });
    saveCurriculum({ id: `oracle_${crypto.randomUUID()}`, career: profile.career, learningStyle: profile.learningStyle, country: profile.country, countryCode: profile.countryCode, language: profile.language, grade: profile.grade, knowledgeLevel: profile.knowledgeLevel, strengths: profile.strengths, gaps: profile.gaps, curriculum: mapped, createdAt: Date.now() });
    navigate({ to: "/rawi", search: { career: profile.career, countryCode: profile.countryCode, countryName: profile.country, lang: profile.language, langName: profile.languageName, grade: profile.grade, style: profile.learningStyle, fromOracle: "true", subjects: profile.curriculum.map((c) => c.subject).join(",") } });
  };

  const pct = Math.min(100, Math.round((exchangeCount / 15) * 100));

  if (stage === "conversation") {
    return (
      <div className="relative min-h-screen" style={{ background: "var(--background)" }} data-tool="oracle">
        <div className="pointer-events-none absolute inset-0 tech-grid" />
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2" style={{ background: "radial-gradient(circle, rgba(0,212,255,0.08) 0%, transparent 70%)" }} />
        </div>

        <div className="relative mx-auto max-w-3xl px-4 py-10">
          {!messages.length ? (
            <div className="flex min-h-[88vh] flex-col items-center justify-center">
              <div className="w-full max-w-md text-center">
                {/* Oracle icon */}
                <div className="relative mx-auto mb-10 h-32 w-32">
                  <div className="animate-ping-slow absolute inset-0 rounded-full" style={{ background: "rgba(0,212,255,0.08)" }} />
                  <div className="absolute inset-4 rounded-full" style={{ border: "1px solid rgba(0,212,255,0.2)" }} />
                  <div className="absolute inset-0 grid place-items-center rounded-full animate-glow-oracle" style={{ background: "linear-gradient(135deg, rgba(0,212,255,0.15), rgba(0,212,255,0.05))", border: "1px solid rgba(0,212,255,0.3)" }}>
                    <Eye className="h-14 w-14" style={{ color: "var(--oracle)" }} />
                  </div>
                  <div className="absolute -top-1 -left-1 h-6 w-6" style={{ borderTop: "1px solid var(--oracle)", borderLeft: "1px solid var(--oracle)", opacity: 0.7 }} />
                  <div className="absolute -top-1 -right-1 h-6 w-6" style={{ borderTop: "1px solid var(--oracle)", borderRight: "1px solid var(--oracle)", opacity: 0.7 }} />
                  <div className="absolute -bottom-1 -left-1 h-6 w-6" style={{ borderBottom: "1px solid var(--oracle)", borderLeft: "1px solid var(--oracle)", opacity: 0.7 }} />
                  <div className="absolute -bottom-1 -right-1 h-6 w-6" style={{ borderBottom: "1px solid var(--oracle)", borderRight: "1px solid var(--oracle)", opacity: 0.7 }} />
                </div>

                <p className="mb-3 text-xs" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.2em", color: "rgba(0,212,255,0.5)" }}>// IDENTITY_SYSTEM</p>
                <h1 className="text-5xl font-bold md:text-6xl" style={{ fontFamily: "var(--font-display)" }}>
                  Meet <span className="text-gradient-oracle italic">0RACLE</span>
                </h1>
                <p className="mt-5 text-base leading-relaxed" style={{ color: "rgba(208,228,240,0.5)" }}>
                  I want to understand you — your dreams, your struggles, your world. Then I'll build your complete learning path.
                </p>

                <div className="mt-8 rounded-xl p-5" style={{ background: "rgba(0,212,255,0.04)", border: "1px solid rgba(0,212,255,0.1)" }}>
                  <div className="flex items-center justify-center gap-4 text-sm">
                    <span style={{ color: "var(--oracle)", fontFamily: "var(--font-mono)", fontSize: "0.75rem" }}>0RACLE</span>
                    <ArrowRight className="h-3 w-3" style={{ color: "rgba(208,228,240,0.2)" }} />
                    <span style={{ color: "var(--rawi)", fontFamily: "var(--font-mono)", fontSize: "0.75rem" }}>RAWI</span>
                    <ArrowRight className="h-3 w-3" style={{ color: "rgba(208,228,240,0.2)" }} />
                    <span style={{ color: "var(--spark)", fontFamily: "var(--font-mono)", fontSize: "0.75rem" }}>SPARK</span>
                  </div>
                  <p className="mt-2 text-center text-xs" style={{ color: "rgba(208,228,240,0.2)", fontFamily: "var(--font-mono)" }}>// your_complete_pipeline</p>
                </div>

                <button
                  onClick={() => startMutation.mutate()}
                  disabled={startMutation.isPending}
                  className="btn-oracle mt-8 inline-flex items-center gap-2 rounded-lg px-10 py-4 text-sm disabled:opacity-50"
                >
                  {startMutation.isPending ? <><Loader2 className="h-4 w-4 animate-spin" /> INITIALIZING...</> : <><Eye className="h-4 w-4" /> BEGIN CONVERSATION</>}
                </button>
                {error && <p className="mt-4 text-sm" style={{ color: "#ff6b6b", fontFamily: "var(--font-mono)" }}>ERR: {error}</p>}
              </div>
            </div>
          ) : (
            <div className="flex min-h-[88vh] flex-col">
              {/* HUD progress */}
              <div className="mb-4 rounded-lg p-3" style={{ background: "rgba(0,212,255,0.04)", border: "1px solid rgba(0,212,255,0.1)" }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: "var(--oracle)" }} />
                    <span className="text-xs" style={{ color: "var(--oracle)", fontFamily: "var(--font-mono)", letterSpacing: "0.1em" }}>0RACLE::ACTIVE</span>
                  </div>
                  <span className="text-xs" style={{ color: "rgba(208,228,240,0.35)", fontFamily: "var(--font-mono)" }}>
                    {profileReady ? "PROFILE::READY" : `EXCHANGE_${exchangeCount}/15 · ${pct}%`}
                  </span>
                </div>
                <div className="h-0.5 w-full rounded-full overflow-hidden" style={{ background: "rgba(0,212,255,0.1)" }}>
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: "linear-gradient(90deg, var(--oracle), var(--oracle-light))" }} />
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 space-y-4 overflow-y-auto py-4">
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} animate-fade-up`} style={{ animationDelay: `${i * 20}ms` }}>
                    {m.role === "assistant" && (
                      <div className="mr-2.5 mt-1 grid h-7 w-7 flex-shrink-0 place-items-center rounded-full" style={{ border: "1px solid rgba(0,212,255,0.3)", background: "rgba(0,212,255,0.08)" }}>
                        <Eye className="h-3.5 w-3.5" style={{ color: "var(--oracle)" }} />
                      </div>
                    )}
                    <div className={`max-w-[78%] rounded-xl px-5 py-3 text-sm leading-relaxed ${m.role === "user" ? "rounded-br-sm" : "rounded-bl-sm"}`} style={m.role === "user" ? { background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.2)", color: "var(--foreground)" } : { background: "rgba(6,12,20,0.9)", border: "1px solid rgba(0,212,255,0.08)", color: "rgba(208,228,240,0.8)" }}>
                      {m.content.replace("[PROFILE_READY]", "")}
                    </div>
                  </div>
                ))}
                {chatMutation.isPending && (
                  <div className="flex justify-start">
                    <div className="mr-2.5 mt-1 grid h-7 w-7 flex-shrink-0 place-items-center rounded-full" style={{ border: "1px solid rgba(0,212,255,0.3)", background: "rgba(0,212,255,0.08)" }}>
                      <Eye className="h-3.5 w-3.5 animate-pulse" style={{ color: "var(--oracle)" }} />
                    </div>
                    <div className="rounded-xl rounded-bl-sm px-5 py-3" style={{ background: "rgba(6,12,20,0.9)", border: "1px solid rgba(0,212,255,0.08)" }}>
                      <div className="flex gap-1.5 items-center">
                        {[0,1,2].map((j) => <span key={j} className="h-1.5 w-1.5 rounded-full animate-bounce" style={{ background: "var(--oracle)", animationDelay: `${j * 150}ms`, opacity: 0.7 }} />)}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="pt-4" style={{ borderTop: "1px solid rgba(0,212,255,0.08)" }}>
                {error && <p className="mb-2 text-xs" style={{ color: "#ff6b6b", fontFamily: "var(--font-mono)" }}>ERR: {error}</p>}
                {profileReady ? (
                  <button onClick={() => profileMutation.mutate()} disabled={profileMutation.isPending}
                    className="btn-oracle w-full inline-flex items-center justify-center gap-2 rounded-lg py-4 text-sm disabled:opacity-50">
                    {profileMutation.isPending ? <><Loader2 className="h-4 w-4 animate-spin" /> GENERATING IDENTITY...</> : <><Sparkles className="h-4 w-4" /> REVEAL MY IDENTITY</>}
                  </button>
                ) : (
                  <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-3">
                    <input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)}
                      placeholder="Tell me more..." disabled={chatMutation.isPending}
                      className="flex-1 rounded-lg px-4 py-3 text-sm outline-none transition-all disabled:opacity-50"
                      style={{ background: "rgba(0,212,255,0.04)", border: "1px solid rgba(0,212,255,0.12)", color: "var(--foreground)", fontFamily: "var(--font-sans)" }}
                      onFocus={(e) => { e.target.style.borderColor = "rgba(0,212,255,0.35)"; e.target.style.boxShadow = "0 0 20px rgba(0,212,255,0.1)"; }}
                      onBlur={(e) => { e.target.style.borderColor = "rgba(0,212,255,0.12)"; e.target.style.boxShadow = "none"; }}
                    />
                    <button type="submit" disabled={chatMutation.isPending || !input.trim()}
                      className="btn-oracle rounded-lg px-5 py-3 disabled:opacity-40">
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

  if (stage === "report" && profile) {
    return (
      <div className="relative min-h-screen" style={{ background: "var(--background)" }} data-tool="oracle">
        <div className="pointer-events-none absolute inset-0 tech-grid" />
        <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(0,212,255,0.06) 0%, transparent 60%)" }} />

        <div className="relative mx-auto max-w-4xl px-4 py-14">
          <div className="mb-8 text-center animate-fade-up">
            <p className="mb-3 text-xs" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.2em", color: "rgba(0,212,255,0.5)" }}>// IDENTITY_REPORT_GENERATED</p>
            <h1 className="text-4xl font-bold" style={{ fontFamily: "var(--font-display)" }}>Your Learning DNA</h1>
          </div>

          {/* Career reveal */}
          <div className="hud-card mb-5 rounded-xl p-8 animate-fade-up" style={{ background: "rgba(0,212,255,0.05)", border: "1px solid rgba(0,212,255,0.15)" }}>
            <p className="mb-2 text-xs" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.15em", color: "rgba(0,212,255,0.5)" }}>DREAM_CAREER</p>
            <TypewriterText text={profile.career} className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--foreground)" }} speed={40} />
          </div>

          {/* Stats */}
          <div className="grid gap-px md:grid-cols-3 mb-5 animate-fade-up" style={{ animationDelay: "100ms", background: "rgba(0,212,255,0.06)" }}>
            {[{ l: "LEARNING_STYLE", v: profile.learningStyle, c: "var(--oracle)" }, { l: "KNOWLEDGE_LEVEL", v: profile.knowledgeLevel, c: "var(--foreground)" }, { l: "COUNTRY", v: profile.country, c: "var(--foreground)" }].map((item) => (
              <div key={item.l} className="p-5" style={{ background: "var(--background)" }}>
                <p className="mb-1 text-xs" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.12em", color: "rgba(0,212,255,0.4)" }}>{item.l}</p>
                <p className="text-base font-semibold" style={{ color: item.c, fontFamily: "var(--font-display)" }}>{item.v}</p>
              </div>
            ))}
          </div>

          {/* Strengths */}
          <div className="mb-4 rounded-xl p-5 animate-fade-up" style={{ animationDelay: "200ms", background: "rgba(6,12,20,0.8)", border: "1px solid rgba(0,212,255,0.08)" }}>
            <p className="mb-3 text-xs" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.12em", color: "rgba(0,212,255,0.4)" }}>STRENGTHS</p>
            <div className="flex flex-wrap gap-2">
              {profile.strengths.map((s, i) => (
                <span key={i} className="rounded-sm px-3 py-1 text-sm" style={{ background: "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.2)", color: "var(--oracle)" }}>{s}</span>
              ))}
            </div>
          </div>

          {/* Gaps */}
          <div className="mb-4 rounded-xl p-5 animate-fade-up" style={{ animationDelay: "300ms", background: "rgba(6,12,20,0.8)", border: "1px solid rgba(0,212,255,0.08)" }}>
            <p className="mb-3 text-xs" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.12em", color: "rgba(255,100,100,0.5)" }}>KNOWLEDGE_GAPS</p>
            <div className="flex flex-wrap gap-2">
              {profile.gaps.map((g, i) => (
                <span key={i} className="rounded-sm px-3 py-1 text-sm" style={{ background: "rgba(255,80,80,0.06)", border: "1px solid rgba(255,80,80,0.2)", color: "rgba(255,120,120,0.8)" }}>{g}</span>
              ))}
            </div>
          </div>

          {/* Curriculum */}
          <div className="mb-8 animate-fade-up" style={{ animationDelay: "400ms" }}>
            <p className="mb-4 text-xs" style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.12em", color: "rgba(0,212,255,0.4)" }}>CURRICULUM_PATH</p>
            <div className="space-y-2">
              {profile.curriculum.map((s, i) => (
                <div key={i} className="rounded-lg p-4" style={{ background: "rgba(6,12,20,0.8)", border: "1px solid rgba(0,212,255,0.06)", borderLeft: `2px solid ${s.color}` }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold" style={{ color: s.color, fontFamily: "var(--font-display)" }}>{s.subject}</span>
                    <span className="text-xs" style={{ color: "rgba(208,228,240,0.25)", fontFamily: "var(--font-mono)" }}>{s.topics.length}_TOPICS</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {s.topics.map((t, j) => (
                      <span key={j} className="rounded-sm px-2 py-0.5 text-xs" style={{ background: "rgba(0,0,0,0.4)", color: "rgba(208,228,240,0.35)", border: "1px solid rgba(255,255,255,0.04)" }}>{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center animate-fade-up" style={{ animationDelay: "600ms" }}>
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="grid h-10 w-10 place-items-center rounded-lg" style={{ border: "1px solid rgba(0,212,255,0.3)", background: "rgba(0,212,255,0.08)" }}>
                <Eye className="h-4 w-4" style={{ color: "var(--oracle)" }} />
              </div>
              <div className="h-px w-8" style={{ background: "linear-gradient(90deg, var(--oracle), var(--rawi))" }} />
              <ArrowRight className="h-4 w-4" style={{ color: "rgba(208,228,240,0.2)" }} />
              <div className="grid h-10 w-10 place-items-center rounded-lg" style={{ border: "1px solid rgba(212,168,67,0.3)", background: "rgba(212,168,67,0.08)" }}>
                <BookOpen className="h-4 w-4" style={{ color: "var(--rawi)" }} />
              </div>
              <div className="h-px w-8" style={{ background: "linear-gradient(90deg, var(--rawi), var(--spark))" }} />
              <ArrowRight className="h-4 w-4" style={{ color: "rgba(208,228,240,0.2)" }} />
              <div className="grid h-10 w-10 place-items-center rounded-lg" style={{ border: "1px solid rgba(139,92,246,0.3)", background: "rgba(139,92,246,0.08)" }}>
                <Camera className="h-4 w-4" style={{ color: "var(--spark)" }} />
              </div>
            </div>
            <button onClick={handleBuildCurriculum} className="btn-rawi inline-flex items-center gap-2 rounded-lg px-10 py-4 text-sm">
              <Sparkles className="h-4 w-4" /> BUILD MY FULL CURRICULUM
            </button>
            <p className="mt-3 text-xs" style={{ color: "rgba(208,228,240,0.25)", fontFamily: "var(--font-mono)" }}>// opens RAWI with curriculum pre-loaded</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

function TypewriterText({ text, className = "", style = {}, speed = 30 }: { text: string; className?: string; style?: React.CSSProperties; speed?: number }) {
  const [d, setD] = useState("");
  useEffect(() => {
    setD("");
    let i = 0;
    const t = setInterval(() => {
      if (i < text.length) { setD(text.slice(0, i + 1)); i++; } else clearInterval(t);
    }, speed);
    return () => clearInterval(t);
  }, [text, speed]);
  return <span className={className} style={style}>{d}<span style={{ opacity: 0.5 }}>_</span></span>;
}
