import { useEffect, useRef, useState } from "react";
import { Mic, MicOff } from "lucide-react";

const LANG_MAP: Record<string, string> = {
  en: "en-US",
  ar: "ar-SA",
  fr: "fr-FR",
  ur: "ur-PK",
  es: "es-ES",
  sw: "sw-TZ",
};

type SR = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: ((e: unknown) => void) | null;
  onend: (() => void) | null;
};

export function VoiceInput({
  language,
  onTranscript,
}: {
  language: string;
  onTranscript: (text: string) => void;
}) {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const recogRef = useRef<SR | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const w = window as unknown as {
      SpeechRecognition?: new () => SR;
      webkitSpeechRecognition?: new () => SR;
    };
    const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (Ctor) setSupported(true);
  }, []);

  const start = () => {
    const w = window as unknown as {
      SpeechRecognition?: new () => SR;
      webkitSpeechRecognition?: new () => SR;
    };
    const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!Ctor) return;
    const r = new Ctor();
    r.lang = LANG_MAP[language] ?? "en-US";
    r.continuous = false;
    r.interimResults = true;
    r.onresult = (e) => {
      let text = "";
      for (let i = 0; i < e.results.length; i++) {
        text += e.results[i][0].transcript;
      }
      onTranscript(text);
    };
    r.onerror = () => setListening(false);
    r.onend = () => setListening(false);
    recogRef.current = r;
    setListening(true);
    r.start();
  };

  const stop = () => {
    recogRef.current?.stop();
    setListening(false);
  };

  if (!supported) return null;

  return (
    <button
      type="button"
      onClick={listening ? stop : start}
      title={listening ? "Listening…" : "Speak your topic"}
      aria-label={listening ? "Stop listening" : "Speak your topic"}
      className={`relative grid h-12 w-12 place-items-center rounded-xl border transition-all md:h-11 md:w-11 ${
        listening
          ? "border-red-500/60 bg-red-500/10 text-red-400"
          : "border-border bg-surface-2 text-muted-foreground hover:border-rawi/50 hover:text-rawi"
      }`}
    >
      {listening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
      {listening && (
        <>
          <span className="pointer-events-none absolute inset-0 rounded-xl ring-2 ring-red-500/60 animate-ping" />
          <span
            className="pointer-events-none absolute inset-0 rounded-xl ring-2 ring-red-500/40 animate-ping"
            style={{ animationDelay: "300ms" }}
          />
        </>
      )}
    </button>
  );
}
