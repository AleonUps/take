import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SUBJECT_COLORS: Record<string, string> = {
  Mathematics: "#00d4ff",
  Chemistry: "#8b5cf6",
  Biology: "#00ff88",
  Physics: "#fbbf24",
  History: "#d4a843",
  Geography: "#22d3ee",
  Economics: "#f97316",
  Ethics: "#e879f9",
  "Environmental Science": "#86efac",
  "Social Studies": "#fb923c",
  "Media Literacy": "#a78bfa",
  "Cultural Studies": "#f43f5e",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { conversationSummary } = await req.json();

    const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!apiKey) throw new Error("ANTHROPIC_API_KEY not set");

    const prompt = `Based on this conversation between 0RACLE (an AI) and a student, extract a structured learning profile.\n\nCONVERSATION:\n${conversationSummary}\n\nRespond ONLY with valid JSON:\n{\n  "career": "specific dream career title (e.g. 'Biomedical Engineer', 'Game Designer', 'Doctor')",\n  "learningStyle": "one of: Visual, Auditory, Hands-on, Reading/Writing, Project-based",\n  "country": "full country name",\n  "countryCode": "2-letter ISO country code",\n  "language": "2-letter language code (en/ar/fr/ur/es/sw)",\n  "languageName": "full language name",\n  "grade": "one of: elementary, middle, high",\n  "knowledgeLevel": "one sentence describing their current knowledge level",\n  "strengths": ["strength 1", "strength 2", "strength 3"],\n  "gaps": ["gap 1", "gap 2", "gap 3"],\n  "curriculum": [\n    {\n      "subject": "one of: Mathematics, Chemistry, Biology, Physics, History, Geography, Economics, Ethics, Environmental Science, Social Studies, Media Literacy, Cultural Studies",\n      "topics": ["topic 1", "topic 2", "topic 3", "topic 4", "topic 5"]\n    }\n  ]\n}\n\nInclude 3-5 subjects in curriculum, most relevant to their career goal. Make topics specific and actionable.`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Anthropic API error: ${err}`);
    }

    const data = await response.json();
    const text = data.content[0].text;

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON in response");
    const profile = JSON.parse(jsonMatch[0]);

    profile.curriculum = profile.curriculum.map((c: { subject: string; topics: string[] }) => ({
      ...c,
      color: SUBJECT_COLORS[c.subject] ?? "#8b5cf6",
    }));

    profile.careerCategory = "General";

    return new Response(JSON.stringify(profile), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
