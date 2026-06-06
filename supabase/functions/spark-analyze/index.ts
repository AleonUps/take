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
    const { imageBase64, imageUrl, grade, language, depth, focus } = await req.json();

    const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!apiKey) throw new Error("ANTHROPIC_API_KEY not set");

    const gradeLabels: Record<string, string> = {
      elementary: "elementary school (ages 6-10)",
      middle: "middle school (ages 11-14)",
      high: "high school (ages 15-17)",
    };
    const gradeLabel = gradeLabels[grade] ?? "middle school";

    const depthInstructions: Record<string, string> = {
      brief: "2-3 key points per subject, short activity",
      standard: "4 key points per subject, detailed activity",
      deep: "5-6 key points per subject, multi-step activity and extended vocabulary",
    };
    const depthInstruction = depthInstructions[depth] ?? depthInstructions.standard;

    const focusMap: Record<string, string> = {
      all: "any subject across STEM and humanities",
      stem: "STEM subjects only (Physics, Chemistry, Biology, Mathematics, Environmental Science)",
      humanities: "humanities only (History, Cultural Studies, Ethics, Media Literacy, Geography)",
      social: "social sciences (Economics, Social Studies, Ethics, Cultural Studies)",
    };
    const focusInstruction = focusMap[focus] ?? focusMap.all;

    const subjectCount = depth === "deep" ? "5-6" : depth === "brief" ? "2-3" : "3-4";

    const imageContent = imageBase64
      ? [{ type: "image", source: { type: "base64", media_type: "image/jpeg", data: imageBase64.replace(/^data:image\/\w+;base64,/, "") } }]
      : [{ type: "image", source: { type: "url", url: imageUrl } }];

    const prompt = `You are SPARK, an educational AI that extracts multi-subject lessons from images.\n\nAnalyze this image and identify ${subjectCount} subjects to teach from it. Focus on: ${focusInstruction}.\nTarget audience: ${gradeLabel} students.\nLanguage for output: ${language === "ar" ? "Arabic" : language === "fr" ? "French" : language === "ur" ? "Urdu" : language === "es" ? "Spanish" : language === "sw" ? "Swahili" : "English"}.\nDepth: ${depthInstruction}.\n\nRespond ONLY with valid JSON in this exact structure:\n{\n  "objectName": "short name of main subject/object in the image",\n  "description": "2-3 sentence description of the image and its educational potential, adapted for ${gradeLabel}",\n  "subjects": [\n    {\n      "subject": "one of: Mathematics, Chemistry, Biology, Physics, History, Geography, Economics, Ethics, Environmental Science, Social Studies, Media Literacy, Cultural Studies",\n      "lessonTitle": "engaging lesson title",\n      "hook": "one compelling opening sentence that makes students curious",\n      "keyPoints": ["point 1", "point 2", "point 3", "point 4"],\n      "activityPrompt": "a hands-on activity students can do",\n      "vocabularyTerms": ["term1", "term2", "term3", "term4", "term5"],\n      "discussionQuestion": "a thought-provoking discussion question"\n    }\n  ]\n}`;

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
        messages: [
          {
            role: "user",
            content: [
              ...imageContent,
              { type: "text", text: prompt },
            ],
          },
        ],
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
    const result = JSON.parse(jsonMatch[0]);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
