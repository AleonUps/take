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
      const result = await chatFn({ data: { messages: updated, exchangeCount: exchangeCount + 1 } });
      return result as string;
    },
    onSuccess: (assistantMsg, userMsg) => {
      setMessages((prev) => [...prev, { role: "user", content: userMsg }, { role: "assistant", content: assistantMsg }]);
      setExchangeCount((c) => c + 1);
      if (assistantMsg.includes("[PROFILE_READY]")) setProfileReady(true);
    },
    onError: (err) => setError(err.message),
  });

  const startMutation = useMutation({
    mutationFn: async () => {
      const result = await chatFn({ data: { messages: [], exchangeCount: 0 } });
      return result as string;
    },
    onSuccess: (assistantMsg) => {
      setMessages([{ role: "assistant", content: assistantMsg }]);
      setExchangeCount(1);
    },
    onError: (err) => setError(err.message),
  });

  const profileMutation = useMutation({
    mutationFn: async () => {
      const summary = messages.map((m) => `${m.role}: ${m.content}`).join("\n");
      const result = await profileFn({ data: { conversationSummary: summary } });
      return result as OracleProfileResult;
    },
    onSuccess: (data) => { setProfile(data); setStage("report"); },
    onError: (err) => setError(err.message),
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
    const mappedCurriculum = profile.curriculum.map((c) => ({
      subject: c.subject,
      color: c.color,
      topics: c.topics.map((t) => ({
        id: `${c.subject}_${t.replace(/\s+/g, "_").slice(0, 30)}`,
        title: t,
        completed: false,
      })),
    }));
    saveOracleProfile({ ...profile, curriculum: mappedCurriculum });
    saveCurriculum({
      id: `oracle_${crypto.randomUUID()}`,
      career: profile.career,
      learningStyle: profile.learningStyle,
      country: profile.country,
      countryCode: profile.countryCode,
      language: profile.language,
      grade: profile.grade,
      knowledgeLevel: profile.knowledgeLevel,
      strengths: profile.strengths,
      gaps: profile.gaps,
      curriculum: mappedCurriculum,
      createdAt: Date.now(),
    });
    navigate({
      to: "/rawi",
      search: {
        career: profile.career,
        countryCode: profile.countryCode,
        countryName: profile.country,
        lang: profile.language,
        langName: profile.languageName,
        grade: profile.grade,
        style: profile.learningStyle,
        fromOracle: "true",
        subjects: profile.curriculum.map((c) => c.subject).join(","),
      },
    });
  };

  const progress = Math.min(100, Math.round((exchangeCount / 15) * 100));

  if (stage === "conversation") {
    return (
      <div className="relative min-h-screen bg-[#080810] overflow-hidden">
        {/* Oracle identity bg */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
          <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-oracle/8 blur-[100px]" />
          <div className="absolute left-1/4 bottom-1/4 h-64 w-64 rounded-full bg-oracle/5 blur-[80px]" />
        </div>

        <div className="relative mx-auto max-w-3xl px-4 py-8">
          {!messages.length ? (
            <div className="flex min-h-[90vh] flex-col items-center justify-center">
              <div className="w-full max-w-lg text-center">
                {/* Oracle icon with HUD ring */}
                <div className="relative mx-auto mb-8 h-28 w-28">
                  <div className="absolute inset-0 rounded-full border border-oracle/20 animate-ping" style={{ animationDuration: "3s" }} />
                  <div className="absolute inset-2 rounded-full border border-oracle/30" />
                  <div className="absolute inset-0 grid place-items-center rounded-full bg-gradient-to-b from-oracle/20 to-oracle/5 border border-oracle/40">
                    <Eye className="h-12 w-12 text-oracle" />
                  </div>
                  {/* HUD corners */}
                  <div className="absolute -top-1 -left-1 h-5 w-5 border-t-2 border-l-2 border-oracle/60" />
                  <div className="absolute -top-1 -right-1 h-5 w-5 border-t-2 border-r-2 border-oracle/60" />
                  <div className="absolute -bottom-1 -left-1 h-5 w-5 border-b-2 border-l-2 border-oracle/60" />
                  <div className="absolute -bottom-1 -right-1 h-5 w-5 border-b-2 border-r-2 border-oracle/60" />
                </div>

                <h1 className="text-5xl font-bold text-white md:text-6xl">
                  Meet{" "}
                  <span className="bg-gradient-to-r from-oracle to-cyan-300 bg-clip-text text-transparent italic">
                    0RACLE
                  </span>
                </h1>
                <p className="mt-4 text-lg text-white/50 leading-relaxed">
                  I want to understand you — your dreams, your struggles, your world.
                  Then I'll build your complete learning path.
                </p>

                {/* Pipeline preview */}
                <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                  <div className="flex items-center justify-center gap-3 text-sm text-white/40">
                    <div className="flex items-center gap-2 text-oracle">
                      <Eye className="h-4 w-4" />
                      <span className="font-semibold text-oracle">0RACLE</span>
                    </div>
                    <ArrowRight className="h-3 w-3" />
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      <span>RAWI</span>
                    </div>
                    <ArrowRight className="h-3 w-3" />
                    <div className="flex items-center gap-2">
                      <Camera className="h-4 w-4" />
                      <span>SPARK</span>
                    </div>
                  </div>
                  <p className="mt-2 text-center text-xs text-white/30">Your complete learning pipeline</p>
                </div>

                <button
                  onClick={() => startMutation.mutate()}
                  disabled={startMutation.isPending}
                  className="mt-8 inline-flex items-center gap-2 rounded-xl bg-oracle px-10 py-4 text-base font-bold text-black transition-all hover:bg-oracle/90 hover:shadow-[0_0_40px_rgba(6,182,212,0.5)] disabled:opacity-50"
                >
                  {startMutation.isPending ? (
                    <><Loader2 className="h-5 w-5 animate-spin" /> Starting...</>
                  ) : (
                    <><Eye className="h-5 w-5" /> Begin Conversation</>
                  )}
                </button>
                {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
              </div>
            </div>
          ) : (
            <div className="flex min-h-[90vh] flex-col">
              {/* Progress HUD */}
              <div className="rounded-xl border border-oracle/20 bg-oracle/5 p-3 mb-4 backdrop-blur">
                <div className="flex items-center justify-between text-xs mb-2">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-oracle animate-pulse" />
                    <span className="text-oracle font-medium">0RACLE ACTIVE</span>
                  </div>
                  <span className="text-white/40">
                    {profileReady ? "Profile ready — reveal identity" : `Exchange ${exchangeCount} / 15 · ${progress}%`}
                  </span>
                </div>
                <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-oracle to-cyan-300 transition-all duration-700"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-4 py-4">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-up`} style={{ animationDelay: `${i * 20}ms` }}>
                    {msg.role === "assistant" && (
                      <div className="mr-2 mt-1 grid h-7 w-7 flex-shrink-0 place-items-center rounded-full border border-oracle/30 bg-oracle/10">
                        <Eye className="h-3.5 w-3.5 text-oracle" />
                      </div>
                    )}
                    <div className={`max-w-[80%] px-5 py-3 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-oracle/20 text-white border border-oracle/30 rounded-br-sm"
                        : "bg-white/5 text-white/85 border border-white/10 rounded-bl-sm"
                    }`}>
                      {msg.content.replace("[PROFILE_READY]", "")}
                    </div>
                  </div>
                ))}
                {chatMutation.isPending && (
                  <div className="flex justify-start">
                    <div className="mr-2 mt-1 grid h-7 w-7 flex-shrink-0 place-items-center rounded-full border border-oracle/30 bg-oracle/10">
                      <Eye className="h-3.5 w-3.5 text-oracle animate-pulse" />
                    </div>
                    <div className="rounded-2xl rounded-bl-sm border border-white/10 bg-white/5 px-5 py-3">
                      <div className="flex gap-1.5">
                        {[0, 1, 2].map((j) => (
                          <span key={j} className="h-1.5 w-1.5 rounded-full bg-oracle/60 animate-bounce" style={{ animationDelay: `${j * 150}ms` }} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t border-white/10 pt-4">
                {error && <p className="mb-2 text-sm text-red-400">{error}</p>}
                {profileReady ? (
                  <button
                    onClick={() => profileMutation.mutate()}
                    disabled={profileMutation.isPending}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-oracle py-4 text-base font-bold text-black transition-all hover:bg-oracle/90 hover:shadow-[0_0_40px_rgba(6,182,212,0.4)] disabled:opacity-50"
                  >
                    {profileMutation.isPending ? (
                      <><Loader2 className="h-5 w-5 animate-spin" /> Generating your identity...</>
                    ) : (
                      <><Sparkles className="h-5 w-5" /> Reveal My Identity</>
                    )}
                  </button>
                ) : (
                  <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-3">
                    <input
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Tell me more..."
                      disabled={chatMutation.isPending}
                      className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/30 backdrop-blur focus:border-oracle/50 focus:outline-none focus:ring-2 focus:ring-oracle/20 disabled:opacity-50"
                    />
                    <button
                      type="submit"
                      disabled={chatMutation.isPending || !input.trim()}
                      className="rounded-xl bg-oracle px-5 py-3 text-black transition-all hover:bg-oracle/90 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] disabled:opacity-40"
                    >
                      <Send className="h-5 w-5" />
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
      <div className="relative min-h-screen bg-[#080810] overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
          <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-oracle/8 blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-4xl px-4 py-12">
          {/* Report header */}
          <div className="mb-8 text-center animate-fade-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-oracle/30 bg-oracle/10 px-4 py-1.5 text-xs text-oracle mb-4">
              <Eye className="h-3 w-3" /> 0RACLE IDENTITY REPORT
            </div>
            <h1 className="text-4xl font-bold text-white">Your Learning DNA</h1>
          </div>

          {/* Career — big reveal */}
          <div className="relative overflow-hidden rounded-2xl border border-oracle/30 bg-gradient-to-b from-oracle/15 to-oracle/5 p-8 mb-6 animate-fade-up">
            <div className="absolute top-3 left-3 h-4 w-4 border-t border-l border-oracle/50" />
            <div className="absolute top-3 right-3 h-4 w-4 border-t border-r border-oracle/50" />
            <div className="absolute bottom-3 left-3 h-4 w-4 border-b border-l border-oracle/50" />
            <div className="absolute bottom-3 right-3 h-4 w-4 border-b border-r border-oracle/50" />
            <p className="text-xs uppercase tracking-widest text-oracle/60 mb-2">Dream Career</p>
            <TypewriterText text={profile.career} className="text-3xl font-bold text-white" speed={40} />
          </div>

          {/* Stats row */}
          <div className="grid gap-4 md:grid-cols-3 mb-6 animate-fade-up" style={{ animationDelay: "100ms" }}>
            {[
              { label: "Learning Style", value: profile.learningStyle, color: "text-oracle" },
              { label: "Knowledge Level", value: profile.knowledgeLevel, color: "text-white" },
              { label: "Country", value: profile.country, color: "text-white" },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-widest text-white/30 mb-1">{item.label}</p>
                <p className={`text-lg font-semibold ${item.color}`}>{item.value}</p>
              </div>
            ))}
          </div>

          {/* Strengths */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 mb-4 animate-fade-up" style={{ animationDelay: "200ms" }}>
            <p className="text-xs uppercase tracking-widest text-white/30 mb-3">Your Strengths</p>
            <div className="flex flex-wrap gap-2">
              {profile.strengths.map((s, i) => (
                <span key={i} className="rounded-full border border-oracle/30 bg-oracle/10 px-3 py-1 text-sm text-oracle">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Gaps */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 mb-4 animate-fade-up" style={{ animationDelay: "300ms" }}>
            <p className="text-xs uppercase tracking-widest text-white/30 mb-3">Knowledge Gaps</p>
            <div className="flex flex-wrap gap-2">
              {profile.gaps.map((g, i) => (
                <span key={i} className="rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-sm text-red-400">
                  {g}
                </span>
              ))}
            </div>
          </div>

          {/* Curriculum */}
          <div className="animate-fade-up" style={{ animationDelay: "400ms" }}>
            <p className="text-xs uppercase tracking-widest text-white/30 mb-4">Your Curriculum Path</p>
            <div className="space-y-3">
              {profile.curriculum.map((subj, i) => (
                <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-4" style={{ borderLeft: `3px solid ${subj.color}` }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-sm" style={{ color: subj.color }}>{subj.subject}</span>
                    <span className="text-xs text-white/30">{subj.topics.length} topics</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {subj.topics.map((t, j) => (
                      <span key={j} className="text-xs rounded-md bg-white/5 px-2 py-0.5 text-white/40 border border-white/5">{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Handoff CTA */}
          <div className="mt-10 text-center animate-fade-up" style={{ animationDelay: "600ms" }}>
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="grid h-10 w-10 place-items-center rounded-lg border border-oracle/30 bg-oracle/15">
                <Eye className="h-4 w-4 text-oracle" />
              </div>
              <ArrowRight className="h-5 w-5 text-white/20" />
              <div className="grid h-10 w-10 place-items-center rounded-lg border border-rawi/30 bg-rawi/15">
                <BookOpen className="h-4 w-4 text-rawi" />
              </div>
              <ArrowRight className="h-5 w-5 text-white/20" />
              <div className="grid h-10 w-10 place-items-center rounded-lg border border-spark/30 bg-spark/15">
                <Camera className="h-4 w-4 text-spark" />
              </div>
            </div>
            <button
              onClick={handleBuildCurriculum}
              className="inline-flex items-center gap-3 rounded-xl bg-rawi px-10 py-4 text-lg font-bold text-black transition-all hover:bg-rawi/90 hover:shadow-[0_0_40px_rgba(201,168,76,0.4)]"
            >
              <Sparkles className="h-5 w-5" /> Build My Full Curriculum
            </button>
            <p className="mt-3 text-sm text-white/30">Opens RAWI with your full curriculum pre-loaded</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

function TypewriterText({ text, className = "", speed = 30 }: { text: string; className?: string; speed?: number }) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    setDisplayed("");
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) { setDisplayed(text.slice(0, i + 1)); i++; }
      else clearInterval(timer);
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);
  return <span className={className}>{displayed}<span className="animate-pulse opacity-60">|</span></span>;
}
