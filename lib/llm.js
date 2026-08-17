const SYSTEM_PROMPT = `You are Nebula, a campus chat assistant for IIT Madras students.

Talk like ChatGPT: natural, warm, concise. Chat with the student; do not write a report.

Tone
- Greetings like "hey" or "hi": a short hello and what you can help with (electives, Drive folders, placements, events, CGPA).
- Real questions: short paragraphs or a few bullets, like a helpful senior.
- Never output chain-of-thought or lines like "The user says" / "According to instructions".

Grounding — this is strict
- For academic answers, use ONLY the portal notes in the user message.
- You may name a course, professor, rating, Drive link, or event only if it appears in those notes.
- If the notes do not contain the answer, say you do not have that on the portal yet. Do not guess, do not use general IIT knowledge, do not invent course IDs or folders.
- Rank options and mention tradeoffs only among courses that are actually in the notes.`;

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
const DEFAULT_GROQ_MODEL = "openai/gpt-oss-120b";

function geminiUrl(model, key) {
  return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`;
}

function toGeminiContents(history, userPrompt) {
  const contents = [];
  for (const msg of history || []) {
    if (!msg?.content) continue;
    const role = msg.role === "assistant" ? "model" : "user";
    contents.push({ role, parts: [{ text: String(msg.content).slice(0, 4000) }] });
  }
  contents.push({ role: "user", parts: [{ text: userPrompt }] });
  return contents;
}

function chatMessages(history, userPrompt) {
  return [
    { role: "system", content: SYSTEM_PROMPT },
    ...(history || [])
      .filter((m) => m?.content && (m.role === "user" || m.role === "assistant"))
      .slice(-8)
      .map((m) => ({ role: m.role, content: String(m.content).slice(0, 4000) })),
    { role: "user", content: userPrompt },
  ];
}

function stripReasoningLeak(text) {
  let out = String(text || "")
    .replace(/<think>[\s\S]*?<\/think>/gi, "")
    .trim();

  const leak = out.search(
    /\n+(The user says|Student question:|According to instructions|The retrieved sources|We should respond|No matching rows)/i
  );
  if (leak > 0) out = out.slice(0, leak).trim();

  return out;
}

function extractMessageText(data) {
  const message = data?.choices?.[0]?.message || {};
  return stripReasoningLeak(typeof message.content === "string" ? message.content : "");
}

async function callOpenAICompatible({ url, apiKey, model, history, userPrompt, groq }) {
  const body = {
    model,
    temperature: 0.2,
    max_tokens: 900,
    messages: chatMessages(history, userPrompt),
  };
  if (groq) {
    body.include_reasoning = false;
    body.reasoning_effort = "low";
  }

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error?.message || `LLM request failed (${res.status})`);
  }
  const text = extractMessageText(data);
  if (!text) throw new Error("The language model returned an empty answer.");
  return text;
}

async function callGemini({ apiKey, model, history, userPrompt }) {
  const res = await fetch(geminiUrl(model, apiKey), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: toGeminiContents(history, userPrompt),
      generationConfig: { temperature: 0.2, maxOutputTokens: 900 },
    }),
  });
  const data = await res.json();
  if (!res.ok) {
    const message = data?.error?.message || `Gemini request failed (${res.status})`;
    throw new Error(message);
  }
  const text = stripReasoningLeak(
    data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") || ""
  );
  if (!text) throw new Error("Gemini returned an empty answer.");
  return text;
}

export async function generateAdvisorReply({ env, history, userPrompt }) {
  const groqKey = env.GROQ_API_KEY;
  const geminiKey = env.GEMINI_API_KEY;
  const openaiKey = env.OPENAI_API_KEY;

  if (groqKey) {
    const model = env.LLM_MODEL || env.GROQ_MODEL || DEFAULT_GROQ_MODEL;
    return callOpenAICompatible({
      url: GROQ_URL,
      apiKey: groqKey,
      model,
      history,
      userPrompt,
      groq: true,
    });
  }
  if (geminiKey) {
    const model = env.LLM_MODEL || env.GEMINI_MODEL || "gemini-2.0-flash";
    return callGemini({ apiKey: geminiKey, model, history, userPrompt });
  }
  if (openaiKey) {
    const model = env.LLM_MODEL || env.OPENAI_MODEL || "gpt-4o-mini";
    return callOpenAICompatible({
      url: OPENAI_URL,
      apiKey: openaiKey,
      model,
      history,
      userPrompt,
    });
  }
  const err = new Error("MISSING_LLM_KEY");
  err.code = "MISSING_LLM_KEY";
  throw err;
}
