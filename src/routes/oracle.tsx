import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useState, useRef, useEffect, useCallback } from "react";
import { Eye, Send, Loader2, ArrowRight, Sparkles, BookOpen, Camera, CheckCircle2 } from "lucide-react";
import { oracleChat } from "@/lib/oracle.functions";
import { generateProfile, type OracleProfileResult } from "@/lib/oracle-profile.functions";
import { saveOracleProfile, saveCurriculum, type CurriculumSubject } from "@/lib/curriculum";

type Stage = "conversation" | "report" | "handoff";
type ChatMessage = { role: "user" | "assistant"; content: string };

export const Route = createFileRoute("/oracle")({
  head: () => ({
    meta: [
      { title: "0RACLE — Know yourself, find your path · EDUCIS" },
      { name: "description", content: "0RACLE learns who you are and builds your complete learning path — personalized, localized, and real." },
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
      const newMessages: ChatMessage[] = [
        ...messages,
        { role: "user", content: userMsg },
        { role: "assistant", content: assistantMsg },
      ];
      setMessages(newMessages);
      setExchangeCount((c) => c + 1);
      if (assistantMsg.includes("[PROFILE_READY]")) {
        setProfileReady(true);
      }
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
    onSuccess: (data) => {
      setProfile(data);
      setStage("report");
    },
    onError: (err) => setError(err.message),
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!chatMutation.isPending && stage === "conversation" && messages.length > 0) {
      inputRef.current?.focus();
    }
  }, [chatMutation.isPending, stage, messages.length]);

  const handleSend = useCallback(() => {
    if (!input.trim() || chatMutation.isPending) return;
    chatMutation.mutate(input.trim());
    setInput("");
  }, [input, chatMutation]);

  const handleBuildCurriculum = () => {
    if (!profile) return;
    saveOracleProfile({
      career: profile.career,
      learningStyle: profile.learningStyle,
      country: profile.country,
      countryCode: profile.countryCode,
      language: profile.language,
      languageName: profile.languageName,
      grade: profile.grade,
      knowledgeLevel: profile.knowledgeLevel,
      strengths: profile.strengths,
      gaps: profile.gaps,
      curriculum: profile.curriculum.map((c) => ({
        subject: c.subject,
        color: c.color,
        topics: c.topics.map((t) => ({
          id: `${c.subject}_${t.replace(/\s+/g, "_").slice(0, 30)}`,
          title: t,
          completed: false,
        })),
      })),
    });
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
      curriculum: profile.curriculum.map((c) => ({
        subject: c.subject,
        color: c.color,
        topics: c.topics.map((t) => ({
          id: `${c.subject}_${t.replace(/\s+/g, "_").slice(0, 30)}`,
          title: t,
          completed: false,
        })),
      })),
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

  if (stage === "conversation") {
    return (
      <div className="mesh-oracle min-h-screen" data-tool="oracle">
        <div className="mx-auto max-w-3xl px-4 py-8">
          {!messages.length ? (
            <div className="flex min-h-[80vh] flex-col items-center justify-center animate-fade-up">
              <div className="max-w-xl text-center">
                <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-2xl bg-oracle/15 border border-oracle/30">
                  <Eye className="h-10 w-10 text-oracle" />
                </div>
                <h1 className="text-4xl font-bold md:text-5xl">
                  Meet <span className="text-gradient-oracle italic">0RACLE</span>
                </h1>
                <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                  I want to understand you — your dreams, your struggles, your world.
                  Then I'll build your complete learning path.
                </p>
                <div className="mt-8 glass rounded-2xl p-5 border-oracle/20">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="flex gap-1">
                      {[Sparkles, BookOpen, Camera].map((Icon, i) => (
                        <div key={i} className="grid h-8 w-8 place-items-center rounded-lg bg-oracle/10">
                          <Icon className="h-4 w-4 text-oracle" />
                        </div>
                      ))}
                    </div>
                    <span>0RACLE → RAWI → SPARK — your full pipeline</span>
                  </div>
                </div>
                <button
                  onClick={() => startMutation.mutate()}
                  disabled={startMutation.isPending}
                  className="btn-oracle mt-8 inline-flex items-center gap-2 rounded-xl px-8 py-4 text-base font-semibold"
                >
                  {startMutation.isPending ? (
                    <><Loader2 className="h-5 w-5 animate-spin" /> Starting...</>
                  ) : (
                    <><Eye className="h-5 w-5" /> Begin Conversation</>
                  )}
                </button>
                {error && (
                  <p className="mt-4 text-sm text-destructive">{error}</p>
                )}
              </div>
            </div>
          ) : (
            <div className="flex min-h-[80vh] flex-col">
              <div className="glass rounded-xl p-3 mb-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Exchange {exchangeCount} of ~15</span>
                  <span>{profileReady ? "Profile ready!" : `${Math.min(100, Math.round((exchangeCount / 15) * 100))}%`}</span>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-oracle to-oracle-light transition-all duration-500"
                    style={{ width: `${Math.min(100, (exchangeCount / 15) * 100)}%` }}
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 py-4">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-up`}
                    style={{ animationDelay: `${i * 30}ms` }}
                  >
                    <div
                      className={`max-w-[85%] md:max-w-[70%] px-5 py-3 rounded-2xl ${
                        msg.role === "user"
                          ? "bg-oracle/20 text-foreground rounded-br-sm border border-oracle/30"
                          : "bg-surface-2 text-foreground/90 rounded-bl-sm border border-border"
                      }`}
                    >
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">
                        {msg.content.replace("[PROFILE_READY]", "")}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="border-t border-border pt-4">
                {error && (
                  <p className="mb-2 text-sm text-destructive">{error}</p>
                )}
                {profileReady ? (
                  <button
                    onClick={() => profileMutation.mutate()}
                    disabled={profileMutation.isPending}
                    className="btn-oracle w-full inline-flex items-center justify-center gap-2 rounded-xl py-4 text-base font-semibold"
                  >
                    {profileMutation.isPending ? (
                      <><Loader2 className="h-5 w-5 animate-spin" /> Generating your identity...</>
                    ) : (
                      <><Sparkles className="h-5 w-5" /> Reveal My Identity</>
                    )}
                  </button>
                ) : (
                  <form
                    onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                    className="flex gap-3"
                  >
                    <input
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Tell me more..."
                      disabled={chatMutation.isPending}
                      className="flex-1 bg-surface-2 border border-border text-foreground placeholder-muted-foreground px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-oracle/50 focus:border-oracle disabled:opacity-50"
                    />
                    <button
                      type="submit"
                      disabled={chatMutation.isPending || !input.trim()}
                      className="btn-oracle inline-flex items-center gap-2 rounded-xl px-6 py-3 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {chatMutation.isPending ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Send className="h-5 w-5" />
                      )}
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
      <div className="mesh-oracle min-h-screen" data-tool="oracle">
        <div className="mx-auto max-w-4xl px-4 py-12">
          <div className="glass-strong border-gradient-oracle rounded-3xl p-8 md:p-10 animate-fade-up">
            <div className="flex items-center gap-3 mb-6">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-oracle/15 border border-oracle/30">
                <Eye className="h-6 w-6 text-oracle" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">0RACLE Identity Report</p>
                <h1 className="text-2xl font-bold text-gradient-oracle">Your Learning DNA</h1>
              </div>
            </div>

            <div className="glass rounded-2xl p-6 mb-4 border-l-4 border-oracle">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Dream Career</p>
              <TypewriterText text={profile.career} className="text-2xl font-bold text-foreground" speed={40} />
            </div>

            <div className="grid gap-4 md:grid-cols-3 mb-4">
              <div className="glass rounded-xl p-4">
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Learning Style</p>
                <p className="text-lg font-semibold text-oracle">{profile.learningStyle}</p>
              </div>
              <div className="glass rounded-xl p-4">
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Knowledge Level</p>
                <p className="text-sm text-foreground">{profile.knowledgeLevel}</p>
              </div>
              <div className="glass rounded-xl p-4">
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Country</p>
                <p className="text-lg font-semibold text-foreground">{profile.country}</p>
              </div>
            </div>

            <div className="glass rounded-2xl p-5 mb-4">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Your Strengths</p>
              <div className="flex flex-wrap gap-2">
                {profile.strengths.map((s, i) => (
                  <span
                    key={i}
                    className="rounded-full border border-oracle/30 bg-oracle/10 px-3 py-1 text-sm text-oracle animate-fade-up"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="glass rounded-2xl p-5 mb-4">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Knowledge Gaps</p>
              <div className="flex flex-wrap gap-2">
                {profile.gaps.map((g, i) => (
                  <span
                    key={i}
                    className="rounded-full border border-destructive/30 bg-destructive/10 px-3 py-1 text-sm text-destructive animate-fade-up"
                    style={{ animationDelay: `${i * 100 + 300}ms` }}
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Your Curriculum Path</p>
              <div className="space-y-3">
                {profile.curriculum.map((subj, i) => (
                  <div
                    key={i}
                    className="glass rounded-xl p-4 animate-fade-up"
                    style={{ animationDelay: `${i * 120 + 600}ms`, borderLeft: `3px solid ${subj.color}` }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-sm" style={{ color: subj.color }}>{subj.subject}</span>
                      <span className="text-xs text-muted-foreground">{subj.topics.length} topics</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {subj.topics.map((t, j) => (
                        <span key={j} className="text-xs bg-surface-2 rounded-md px-2 py-0.5 text-muted-foreground">{t}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 text-center animate-fade-up" style={{ animationDelay: "800ms" }}>
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-oracle/15 border border-oracle/30">
                <Eye className="h-4 w-4 text-oracle" />
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-rawi/15 border border-rawi/30">
                <BookOpen className="h-4 w-4 text-rawi" />
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-spark/15 border border-spark/30">
                <Camera className="h-4 w-4 text-spark" />
              </div>
            </div>
            <button
              onClick={handleBuildCurriculum}
              className="btn-rawi inline-flex items-center gap-3 rounded-xl px-10 py-4 text-lg font-semibold"
            >
              <Sparkles className="h-5 w-5" /> Build My Full Curriculum
            </button>
            <p className="mt-3 text-sm text-muted-foreground">Opens RAWI with your full curriculum pre-loaded</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

function TypewriterText({
  text,
  className = "",
  speed = 30,
}: {
  text: string;
  className?: string;
  speed?: number;
}) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    setDisplayed("");
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);
  return (
    <span className={className}>
      {displayed}
      <span className="animate-pulse">|</span>
    </span>
  );
}
