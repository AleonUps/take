import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { chatJSON } from "@/lib/ai-gateway.server";

const OracleConversationInput = z.object({
  messages: z.array(z.object({
    role: z.enum(["user", "assistant"]),
    content: z.string(),
  })),
  exchangeCount: z.number().min(0).max(20),
});

export const oracleChat = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => OracleConversationInput.parse(input))
  .handler(async ({ data }) => {
    const system = `You are 0RACLE — a warm, curious, genuinely interested conversationalist who wants to deeply understand this person's educational journey. You are NOT a form. You are NOT a quiz. You are having a real conversation like a mentor who genuinely cares.

Your goal: over multiple exchanges, naturally discover:
- Their background and where they're from (country, city)
- What language they're most comfortable learning in
- Their dream career or profession (dig deep — not just "doctor" but what KIND of doctor, what draws them)
- How they learn best (visual, reading, hands-on, listening, doing projects)
- What they already know and where they struggle
- Their current education level (approximate grade/age)
- Their life goals beyond just career
- What excites them and what bores them about learning
- Any personal circumstances that affect their learning (work, family, access)

Rules:
- Ask ONE main question per message, naturally woven into the conversation
- Reference what they've already said to show you're listening
- Be warm, encouraging, occasionally playful
- Never make it feel like an interrogation
- If they give a short answer, gently ask for more detail with genuine curiosity
- After about exchange 12-15, start wrapping up naturally by reflecting on what you've learned
- On the FINAL exchange (when you feel you have enough), include the exact text "[PROFILE_READY]" at the very end of your message
- Keep each response to 2-3 short paragraphs max
- Write in simple, clear English unless they're using another language`;

    const result = await chatJSON({
      model: "google/gemini-3-flash-preview",
      messages: [
        { role: "system", content: system },
        ...data.messages.map(m => ({ role: m.role as "user" | "assistant", content: m.content })),
      ],
      response_format: undefined,
    });

    // chatJSON returns parsed JSON but we want raw text here
    // So we need to call the gateway directly for text responses
    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": process.env.LOVABLE_API_KEY!,
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: system },
          ...data.messages.map(m => ({ role: m.role, content: m.content })),
        ],
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      if (res.status === 429) throw new Error("Rate limit reached. Please try again in a moment.");
      if (res.status === 402) throw new Error("AI credits exhausted.");
      throw new Error(`AI gateway error ${res.status}: ${text.slice(0, 200)}`);
    }

    const d = await res.json() as { choices: Array<{ message: { content: string } }> };
    return d.choices?.[0]?.message?.content ?? "";
  });
