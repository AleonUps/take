import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { chatJSON } from "@/lib/ai-gateway.server";

const RawiInput = z.object({
  concept: z.string().min(1).max(300),
  countryCode: z.string().min(2).max(4),
  countryName: z.string().min(2).max(60),
  grade: z.enum(["elementary", "middle", "high"]),
  language: z.string().min(2).max(8),
  languageName: z.string().min(2).max(40),
  includeCulturalHistory: z.boolean().default(true),
  audioFriendly: z.boolean().default(false),
});

export type RawiResult = {
  conceptTitle: string;
  culturalHook: string;
  readingTimeMinutes: number;
  storyLesson: string;
  pullQuote: string;
  examples: Array<{ title: string; explanation: string; localContext: string }>;
  practiceProblems: Array<{ question: string; answer: string; hint: string }>;
  keyConcepts: string[];
  culturalConnection: string;
  genericVersion: string;
};

const gradeText = (g: string) =>
  g === "elementary"
    ? "elementary (ages 6-10) — simple sentences"
    : g === "middle"
      ? "middle school (ages 11-14) — developing concepts"
      : "high school (ages 15-17) — abstract reasoning";

export const rawiGenerate = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => RawiInput.parse(input))
  .handler(async ({ data }): Promise<RawiResult> => {
    const system =
      "You are RAWI — rewrite any lesson using the student's own culture. Every single example, name, place, food, profession, currency, and reference must be genuinely and specifically local to the chosen country. No generic placeholders. Respond ONLY in valid raw JSON.";
    const audio = data.audioFriendly ? " Use short, audio-friendly sentences." : "";
    const culture = data.includeCulturalHistory
      ? " Include a cultural-history connection (a real local tradition, story, place, or historical detail)."
      : "";

    const user = `Concept to teach: "${data.concept}".
Country / cultural world: ${data.countryName} (${data.countryCode}).
Grade level: ${gradeText(data.grade)}.
Output language: ${data.languageName} (ISO: ${data.language}). Every string must be written in ${data.languageName}.${audio}${culture}

Return EXACTLY this JSON:
{
  "conceptTitle": string,
  "culturalHook": string (one evocative italic-ready sentence rooted in ${data.countryName}),
  "readingTimeMinutes": number (1-8),
  "storyLesson": string (4-6 paragraphs separated by \\n\\n, a genuine local narrative with real local names, foods, professions, places),
  "pullQuote": string (one powerful sentence pulled from the story),
  "examples": [
    { "title": string, "explanation": string, "localContext": string }
  ] (3-5 items, all hyper-local to ${data.countryName}),
  "practiceProblems": [
    { "question": string, "answer": string, "hint": string }
  ] (3 items; use local names, currency, and places in the questions),
  "keyConcepts": string[] (4-6 short bullets),
  "culturalConnection": string (2-3 sentences linking the concept to ${data.countryName}'s heritage),
  "genericVersion": string (2 sentences — the generic textbook way the same concept is usually taught)
}`;

    const result = (await chatJSON({
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    })) as RawiResult;

    return result;
  });
