import { NextRequest, NextResponse } from "next/server";

type Body = {
  language: string;
  topic: string;
  code: string;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Body;
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { ok: false, error: "Server is missing GEMINI_API_KEY" },
        { status: 500 }
      );
    }

    const system = `You are a strict DSA coach and code analyzer. The user will send code for a programming question.
Evaluate correctness and provide actionable feedback. Also estimate Big-O time complexity of the submitted solution's main routine and a one-line justification.
Respond ONLY in JSON with keys:
{
  "correct": boolean,
  "feedback": string,
  "suggestions": string[],
  "timeComplexity": string, // like "O(n log n)"
  "complexityReason": string
}`;

    const userPrompt = `Topic: ${body.topic}\nLanguage: ${body.language}\n\nCode:\n${body.code}\n\nEvaluate correctness for the intended question. Check syntax and common logic errors. Provide constructive guidance. Estimate time complexity and reason. Return only JSON.`;

    // Gemini API (text-only) via REST. Default to flash to avoid free-tier quota issues.
    const model = process.env.GEMINI_MODEL || "gemini-1.5-flash";
    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=` +
        apiKey,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            { role: "user", parts: [{ text: system }] },
            { role: "user", parts: [{ text: userPrompt }] },
          ],
          generationConfig: { temperature: 0.2, maxOutputTokens: 512 },
        }),
      }
    );

    if (!resp.ok) {
      const text = await resp.text();
      return NextResponse.json(
        { ok: false, error: `Gemini error: ${text}` },
        { status: 500 }
      );
    }

    const data = await resp.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = { correct: false, feedback: text, suggestions: [], timeComplexity: "-", complexityReason: "-" };
    }
    return NextResponse.json({ ok: true, result: parsed });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}


