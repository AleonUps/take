import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SYSTEM_PROMPT = `You are 0RACLE, an empathetic AI that discovers a student's identity, learning style, dreams, and background through conversation.\n\nYour goal: through 8-12 exchanges, uncover:\n- Their country/region and language\n- Their dream career or area of passion\n- Their learning style (visual, auditory, hands-on, reading/writing, project-based)\n- Their grade level and current subjects\n- Their strengths and knowledge gaps\n- Personal challenges or life context that should shape their education\n\nRules:\n- Ask ONE focused question at a time \u2014 never multiple questions\n- Be warm, curious, and encouraging\n- Adapt your tone to their age and culture\n- After exchange 12+ or when you have enough data, end your message with exactly: [PROFILE_READY]\n- Keep responses under 100 words\n- Do not be generic \u2014 reference what they've told you\n\nStart with: ask their country and one dream or passion.`;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { messages, exchangeCount } = await req.json();

    const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!apiKey) throw new Error("ANTHROPIC_API_KEY not set");

    const anthropicMessages = messages.map((m: { role: string; content: string }) => ({
      role: m.role === "user" ? "user" : "assistant",
      content: m.content.replace("[PROFILE_READY]", ""),
    }));

    if (anthropicMessages.length === 0) {
      anthropicMessages.push({
        role: "user",
        content: "Start the conversation",
      });
    }

    const shouldFinish = exchangeCount >= 12;
    const systemWithFinish = shouldFinish
      ? SYSTEM_PROMPT + "\n\nYou now have enough information. Give a brief warm summary of what you've learned and end with [PROFILE_READY]."
      : SYSTEM_PROMPT;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 300,
        system: systemWithFinish,
        messages: anthropicMessages,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Anthropic API error: ${err}`);
    }

    const data = await response.json();
    const reply = data.content[0].text;

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
