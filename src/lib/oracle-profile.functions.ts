import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { chatJSON } from "@/lib/ai-gateway.server";

const ProfileGenInput = z.object({
  conversationSummary: z.string().min(50),
});

export type OracleProfileResult = {
  career: string;
  careerCategory: string;
  learningStyle: string;
  country: string;
  countryCode: string;
  language: string;
  languageName: string;
  grade: string;
  knowledgeLevel: string;
  strengths: string[];
  gaps: string[];
  curriculum: Array<{
    subject: string;
    color: string;
    topics: string[];
  }>;
};

const OracleProfileOutput = z.object({
  career: z.string(),
  careerCategory: z.string(),
  learningStyle: z.string(),
  country: z.string(),
  countryCode: z.string(),
  language: z.string(),
  languageName: z.string(),
  grade: z.enum(["elementary", "middle", "high"]),
  knowledgeLevel: z.string(),
  strengths: z.array(z.string()),
  gaps: z.array(z.string()),
  curriculum: z.array(z.object({
    subject: z.string(),
    color: z.string(),
    topics: z.array(z.string()),
  })),
});

export const generateProfile = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ProfileGenInput.parse(input))
  .handler(async ({ data }) => {
    const system = "You are 0RACLE's analysis engine. Given a conversation summary, produce a precise, structured educational profile. Respond ONLY in valid raw JSON.";
    const user = `Analyze this conversation and generate a complete educational profile:

${data.conversationSummary}

Return EXACTLY this JSON:
{
  "career": string (their dream career, be specific — not just "engineer" but "biomedical engineer designing prosthetics"),
  "careerCategory": string (broad category: Medicine, Engineering, Arts, Business, Science, Law, Education, Technology, Agriculture, Social Work),
  "learningStyle": string (one of: Visual, Reading/Writing, Hands-on, Auditory, Project-based),
  "country": string (full country name),
  "countryCode": string (2-letter ISO code),
  "language": string (ISO code for their preferred learning language),
  "languageName": string (language name in that language),
  "grade": "elementary" | "middle" | "high" (approximate level),
  "knowledgeLevel": string (1-2 sentences describing where they are),
  "strengths": string[] (3-5 specific strengths relevant to their career path),
  "gaps": string[] (3-6 specific knowledge gaps they need to fill),
  "curriculum": [
    {
      "subject": string (subject area name),
      "color": string (hex color for that subject, e.g. "#f59e0b"),
      "topics": string[] (4-8 specific topics they need to learn in order, from foundational to advanced)
    }
  ] (6-10 subjects, ordered by importance to their career goal. Include both core subjects and specialized ones relevant to their career)
}`;

    const raw = await chatJSON({
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    });

    const parsed = OracleProfileOutput.safeParse(raw);
    if (!parsed.success) {
      throw new Error(
        `AI returned invalid profile: ${parsed.error.issues.map((i) => i.path.join(".") + " " + i.message).join("; ")}`,
      );
    }
    return parsed.data as OracleProfileResult;
  });
