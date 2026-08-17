import { DEFAULT_REVIEWS } from "./data/reviews.js";
import { DEFAULT_DEPARTMENTS } from "./data/departments.js";
import { DEFAULT_PLACEMENTS } from "./data/placements.js";
import { DEFAULT_EVENTS } from "./data/events.js";
import { buildDocuments, retrieve, formatContext, tryLocalCgpa } from "./retrieve.js";
import { generateAdvisorReply } from "./llm.js";

async function readTable(supabase, table, fallback) {
  if (!supabase) return fallback;
  try {
    const { data, error } = await supabase.from(table).select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return data?.length ? data : fallback;
  } catch {
    return fallback;
  }
}

export async function loadCorpus(supabase) {
  const [reviews, departments, placements, events] = await Promise.all([
    readTable(supabase, "reviews", DEFAULT_REVIEWS),
    readTable(supabase, "departments", DEFAULT_DEPARTMENTS),
    readTable(supabase, "placements", DEFAULT_PLACEMENTS),
    readTable(supabase, "events", DEFAULT_EVENTS),
  ]);
  return { reviews, departments, placements, events };
}

function isChitchat(question) {
  return /^(hi|hey|hello|yo|sup|hiya|thanks|thank you|ok|okay|cool|bye|good morning|good evening|good afternoon|how are you|what's up|whats up)[\s!.,?]*$/i.test(
    question
  );
}

export async function handleChat({ message, history = [], supabase, env }) {
  const question = String(message || "").trim().slice(0, 800);
  if (!question) {
    return { error: "Ask a question about electives, departments, placements, events, or CGPA.", status: 400 };
  }

  const safeHistory = Array.isArray(history) ? history.slice(-8) : [];
  const chitchat = isChitchat(question);

  let retrieved = [];
  let userPrompt = question;

  if (!chitchat) {
    const corpus = await loadCorpus(supabase);
    const docs = buildDocuments(corpus);
    retrieved = retrieve(question, docs);
    const cgpa = tryLocalCgpa(question);
    userPrompt = [
      question,
      cgpa
        ? `CGPA already calculated from this question (use these numbers): ${JSON.stringify(cgpa)}`
        : null,
      `Portal notes you can use:\n${formatContext(retrieved)}`,
    ]
      .filter(Boolean)
      .join("\n\n");
  }

  try {
    const answer = await generateAdvisorReply({ env, history: safeHistory, userPrompt });
    return {
      status: 200,
      answer,
      sources: chitchat
        ? []
        : retrieved.slice(0, 6).map((row) => ({
            type: row.doc.type,
            title: row.doc.title,
          })),
    };
  } catch (err) {
    if (err.code === "MISSING_LLM_KEY") {
      return {
        status: 503,
        error:
          "Add GROQ_API_KEY to your .env file to enable the advisor. Free key (no card): https://console.groq.com/keys",
      };
    }
    return { status: 502, error: err.message || "The language model failed to answer." };
  }
}
