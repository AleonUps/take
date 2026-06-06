import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const {
      concept,
      countryCode,
      countryName,
      grade,
      language,
      languageName,
      includeCulturalHistory,
      audioFriendly,
    } = await req.json();

    const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!apiKey) throw new Error("ANTHROPIC_API_KEY not set");

    const gradeLabels: Record<string, string> = {
      elementary: "elementary school students (ages 6-10, simple language, concrete examples)",
      middle: "middle school students (ages 11-14, engaging narrative, relatable examples)",
      high: "high school students (ages 15-17, analytical depth, career connections)",
    };
    const gradeLabel = gradeLabels[grade] ?? gradeLabels.middle;

    const outputLanguage = language === "ar" ? "Arabic" : language === "fr" ? "French" :
      language === "ur" ? "Urdu" : language === "es" ? "Spanish" :
      language === "sw" ? "Swahili" : "English";

    const culturalNote = includeCulturalHistory
      ? `Include a cultural history hook connecting ${concept} to ${countryName}'s history or traditions.`
      : "";

    const audioNote = audioFriendly
      ? "Write in a conversational, audio-friendly style with short sentences suitable for text-to-speech."
      : "";

    const prompt = `You are RAWI, an educational AI that rewrites lessons to feel local and relevant.\n\nCreate a lesson about "${concept}" specifically for ${gradeLabel} in ${countryName}.\nOutput language: ${outputLanguage}.\n${culturalNote}\n${audioNote}\n\nMake every example, name, and context feel authentically from ${countryName}. Never use generic Western examples when local ones exist.\n\nRespond ONLY with valid JSON:\n{\n  "conceptTitle": "localized title for the concept",\n  "culturalHook": "one sentence connecting ${concept} to something specific in ${countryName}'s culture, history, or daily life",\n  "readingTime": "X min read",\n  "storyLesson": [\n    "paragraph 1: engaging opening set in ${countryName}",\n    "paragraph 2: core concept explanation with local context",\n    "paragraph 3: deeper exploration",\n    "paragraph 4: real-world application in ${countryName}"\n  ],\n  "pullQuote": "one memorable sentence about the concept, culturally resonant",\n  "examples": [\n    {\n      "title": "example name",\n      "explanation": "clear explanation",\n      "localContext": "how this appears specifically in ${countryName}"\n    },\n    {\n      "title": "example name",\n      "explanation": "clear explanation",\n      "localContext": "how this appears specifically in ${countryName}"\n    }\n  ],\n  "practiceProblems": [\n    {\n      "question": "problem using local context from ${countryName}",\n      "hint": "helpful hint",\n      "answer": "clear answer"\n    },\n    {\n      "question": "another problem",\n      "hint": "hint",\n      "answer": "answer"\n    }\n  ],\n  "keyConcepts": ["term1", "term2", "term3", "term4"],\n  "culturalConnection": "one sentence about ${countryName}'s unique relationship with ${concept}"\n}`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 2048,
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
    const lesson = JSON.parse(jsonMatch[0]);

    return new Response(JSON.stringify(lesson), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
