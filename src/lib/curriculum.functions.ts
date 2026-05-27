import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { chatJSON } from "@/lib/ai-gateway.server";

const CurriculumRawiInput = z.object({
  concept: z.string().min(1),
  countryName: z.string().min(2),
  countryCode: z.string().min(2),
  grade: z.enum(["elementary", "middle", "high"]),
  language: z.string().min(2),
  languageName: z.string().min(2),
  career: z.string().min(2),
  learningStyle: z.string().min(2),
  chapterIndex: z.number().min(0).optional(),
});

export type CurriculumLesson = {
  chapterTitle: string;
  chapterIndex: number;
  lessons: Array<{
    title: string;
    explanation: string;
    localExample: string;
    practiceQuestion: string;
    practiceAnswer: string;
  }>;
};

const CurriculumLessonOutput = z.object({
  chapterTitle: z.string(),
  chapterIndex: z.number(),
  lessons: z.array(z.object({
    title: z.string(),
    explanation: z.string(),
    localExample: z.string(),
    practiceQuestion: z.string(),
    practiceAnswer: z.string(),
  })),
});

export const generateCurriculumLesson = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => CurriculumRawiInput.parse(input))
  .handler(async ({ data }) => {
    const system = `You are RAWI's curriculum engine. You build structured, localized course content for a student pursuing a specific career. Every example, name, place, food, profession, currency, and reference must be genuinely and specifically local to the chosen country. Respond ONLY in valid raw JSON.`;

    const gradeText = data.grade === "elementary" ? "elementary (ages 6-10) — simple sentences" : data.grade === "middle" ? "middle school (ages 11-14) — developing concepts" : "high school (ages 15-17) — abstract reasoning";

    const user = `Generate a detailed lesson chapter for:
Subject: "${data.concept}"
Career goal: ${data.career}
Country / cultural world: ${data.countryName} (${data.countryCode})
Grade level: ${gradeText}
Learning style: ${data.learningStyle}
Output language: ${data.languageName} (ISO: ${data.language}). Every string must be written in ${data.languageName}.
${data.chapterIndex !== undefined ? `Chapter index: ${data.chapterIndex}` : ""}

Return EXACTLY this JSON:
{
  "chapterTitle": string (clear chapter title for this subject),
  "chapterIndex": number,
  "lessons": [
    {
      "title": string (lesson title),
      "explanation": string (2-3 paragraphs of clear explanation, separated by \n\n),
      "localExample": string (a vivid, specific example from ${data.countryName} with real names, places, currency — 2-3 sentences),
      "practiceQuestion": string (one practice question using local context),
      "practiceAnswer": string (the answer)
    }
  ] (3-5 lessons per chapter, ordered from foundational to advanced)
}`;

    const raw = await chatJSON({
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    });

    const parsed = CurriculumLessonOutput.safeParse(raw);
    if (!parsed.success) {
      throw new Error(
        `AI returned invalid curriculum data: ${parsed.error.issues.map((i) => i.path.join(".") + " " + i.message).join("; ")}`,
      );
    }
    return parsed.data as CurriculumLesson;
  });
