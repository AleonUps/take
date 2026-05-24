import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { chatJSON } from "@/lib/ai-gateway.server";

const SparkInput = z.object({
  imageBase64: z.string().min(50),
  mimeType: z.string().default("image/jpeg"),
  grade: z.enum(["elementary", "middle", "high"]),
  language: z.string().min(2).max(8),
  languageName: z.string().min(2).max(40),
  depth: z.number().min(1).max(3).default(2),
  focusSubjects: z.array(z.string()).optional(),
});

export type SparkResult = {
  objectName: string;
  objectDescription: string;
  detectedMaterials: string[];
  subjects: Array<{
    subject: string;
    lessonTitle: string;
    lesson: string;
    highlight: string;
    didYouKnow: string;
    practiceQuestions: Array<{ question: string; answer: string }>;
  }>;
};

const gradeText = (g: string) =>
  g === "elementary"
    ? "elementary (ages 6-10): use simple sentences, concrete examples, and hands-on framing"
    : g === "middle"
      ? "middle school (ages 11-14): develop concepts, link to real-world phenomena"
      : "high school (ages 15-17): abstract thinking, deeper analysis, technical vocabulary";

const depthText = (d: number) =>
  d <= 1 ? "quick overview (concise)" : d >= 3 ? "deep dive (rich, multi-paragraph)" : "balanced detail";

export const sparkAnalyze = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => SparkInput.parse(input))
  .handler(async ({ data }): Promise<SparkResult> => {
    const focus =
      data.focusSubjects && data.focusSubjects.length
        ? `Limit to these subjects when reasonable: ${data.focusSubjects.join(", ")}. `
        : "";
    const system =
      "You are SPARK — turn any real-world object photo into rich multi-subject school lessons. Respond ONLY in valid raw JSON, no markdown, no commentary.";
    const user = `Analyze the attached image. Identify the most prominent object and generate between 4 and 7 cross-subject lessons about it.

${focus}Target audience: ${gradeText(data.grade)}.
Output language: ${data.languageName} (ISO code: ${data.language}). Every string in the JSON must be written in ${data.languageName}.
Depth: ${depthText(data.depth)}.

Return EXACTLY this JSON shape:
{
  "objectName": string,
  "objectDescription": string (one sentence),
  "detectedMaterials": string[] (3-6 short tags about materials/colors/context),
  "subjects": [
    {
      "subject": string (one of: Mathematics, Chemistry, Biology, Physics, History, Geography, Economics, Ethics, Environmental Science, Social Studies, Media Literacy, Cultural Studies),
      "lessonTitle": string,
      "lesson": string (3-4 paragraphs, separated by \\n\\n),
      "highlight": string (key formula, chemical, date, or fact — short),
      "didYouKnow": string (one surprising fact),
      "practiceQuestions": [
        { "question": string, "answer": string },
        { "question": string, "answer": string }
      ]
    }
  ]
}`;

    const result = (await chatJSON({
      messages: [
        { role: "system", content: system },
        {
          role: "user",
          content: [
            { type: "text", text: user },
            {
              type: "image_url",
              image_url: { url: `data:${data.mimeType};base64,${data.imageBase64}` },
            },
          ],
        },
      ],
    })) as SparkResult;

    return result;
  });
