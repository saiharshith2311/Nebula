import { CGPA_FORMULA_TEXT, calculateCgpa } from "./data/cgpa.js";

const STOP = new Set([
  "the", "a", "an", "and", "or", "for", "to", "of", "in", "on", "is", "it",
  "me", "my", "i", "we", "you", "with", "what", "how", "any", "some", "this",
  "that", "from", "can", "please", "give", "tell", "about", "need",
]);

function tokenize(text) {
  return (String(text || "").toLowerCase().match(/[a-z0-9]+/g) || []).filter(
    (t) => t.length > 1 && !STOP.has(t)
  );
}

function inferSignals(review) {
  const t = String(review || "").toLowerCase();
  const signals = [];
  if (/\b(peace|chill|easy sab|lite course|easy s|easy grade|manageable)\b/.test(t) || /\bsab\b/.test(t)) {
    signals.push("easier-grading");
  }
  if (/\b(tough|harsh|strict grading|not very easy|scoring is quite tough|hard work)\b/.test(t)) {
    signals.push("harder-grading");
  }
  if (/\b(no attendance|lite attendance|attendance is not|75% rule is not very strict)\b/.test(t)) {
    signals.push("lite-attendance");
  }
  if (/\b(strict attendance|attend every|attendance is fully strict|attendance is strict|punctuality)\b/.test(t)) {
    signals.push("strict-attendance");
  }
  if (/\b(essay|descriptive|write-up|term paper|book review)\b/.test(t)) {
    signals.push("writing-heavy");
  }
  if (/\b(mcq|objective quiz|online exam)\b/.test(t)) {
    signals.push("quiz-or-mcq");
  }
  if (/\b(french|german|korean|japanese|chinese|sanskrit|language)\b/.test(t)) {
    signals.push("language-course");
  }
  return signals;
}

function markdownLinks(text) {
  const links = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match;
  while ((match = re.exec(text || "")) !== null) {
    links.push({ label: match[1], url: match[2] });
  }
  return links;
}

export function buildDocuments(corpus) {
  const docs = [];

  for (const r of corpus.reviews || []) {
    const signals = inferSignals(r.review);
    docs.push({
      type: "review",
      title: r.course_id ? `${r.course} (${r.course_id})` : r.course,
      text: [
        `Elective review`,
        `Course: ${r.course}`,
        `Course ID: ${r.course_id || "not provided"}`,
        `Professor: ${r.professor || "not provided"}`,
        r.rating ? `Rating: ${r.rating}/5` : null,
        signals.length ? `Inferred from review text: ${signals.join(", ")}` : null,
        `Student review: ${r.review}`,
      ]
        .filter(Boolean)
        .join("\n"),
      meta: { course: r.course, course_id: r.course_id, professor: r.professor, rating: r.rating },
    });
  }

  for (const d of corpus.departments || []) {
    const links = markdownLinks(d.description);
    docs.push({
      type: "department",
      title: `${d.category}: ${d.title}`,
      text: [
        `Department resource`,
        `Branch: ${d.category}`,
        `Title: ${d.title}`,
        `Notes: ${(d.description || "").replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")}`,
        links.length ? `Links: ${links.map((l) => `${l.label} -> ${l.url}`).join(" | ")}` : null,
      ]
        .filter(Boolean)
        .join("\n"),
      meta: { category: d.category, links },
    });
  }

  for (const p of corpus.placements || []) {
    const links = markdownLinks(p.description);
    docs.push({
      type: "placement",
      title: `${p.category}: ${p.title}`,
      text: [
        `Placement / internship prep resource`,
        `Track: ${p.category}`,
        `Title: ${p.title}`,
        `Notes: ${(p.description || "").replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")}`,
        links.length ? `Links: ${links.map((l) => `${l.label} -> ${l.url}`).join(" | ")}` : null,
      ]
        .filter(Boolean)
        .join("\n"),
      meta: { category: p.category, links },
    });
  }

  for (const e of corpus.events || []) {
    docs.push({
      type: "event",
      title: `${e.category}: ${e.title}`,
      text: [
        `Campus event`,
        `Category: ${e.category}`,
        `Title: ${e.title}`,
        `Details: ${e.description}`,
      ].join("\n"),
      meta: { category: e.category },
    });
  }

  docs.push({
    type: "cgpa",
    title: "CGPA calculator formula",
    text: CGPA_FORMULA_TEXT,
    meta: {},
  });

  return docs;
}

function detectIntents(query) {
  const q = query.toLowerCase();
  return {
    reviews:
      /elective|course|professor|faculty|sab|attendance|hs\d|grading|review|easy|tough|peace/.test(q),
    departments:
      /department|drive|notes|paper|syllabus|cse|mechanical|electrical|civil|aerospace|chemical|biotech|metallurgy|naval|branch/.test(
        q
      ),
    placements:
      /placement|intern|coding|aptitude|consult|hr|puzzle|finance|guesstimate|analytics|interview|sde/.test(
        q
      ),
    events: /event|deadline|fest|club|registration|workshop|seminar/.test(q),
    cgpa: /cgpa|sgpa|gpa|credit|grade|project/.test(q),
  };
}

function scoreDocument(tokens, compactQuery, doc, intents) {
  const hay = doc.text.toLowerCase();
  const compactHay = hay.replace(/[^a-z0-9]/g, "");
  let score = 0;

  for (const t of tokens) {
    if (hay.includes(t)) score += t.length >= 5 ? 2.5 : 1.4;
    if (compactHay.includes(t)) score += 0.4;
  }

  if (doc.meta?.course_id && compactQuery.includes(String(doc.meta.course_id).toLowerCase().replace(/[^a-z0-9]/g, ""))) {
    score += 12;
  }

  if (score === 0) return 0;

  const typeBoost = {
    review: intents.reviews ? 3 : 0,
    department: intents.departments ? 3 : 0,
    placement: intents.placements ? 3 : 0,
    event: intents.events ? 3 : 0,
    cgpa: intents.cgpa ? 8 : 0,
  };
  score += typeBoost[doc.type] || 0;

  return score;
}

export function retrieve(query, docs, limits = { review: 8, department: 4, placement: 4, event: 3, cgpa: 1 }) {
  const tokens = tokenize(query);
  const compactQuery = String(query || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  const intents = detectIntents(query);

  let ranked = docs
    .map((doc) => ({ doc, score: scoreDocument(tokens, compactQuery, doc, intents) }))
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score);

  if (intents.cgpa && !intents.reviews) {
    ranked = ranked.filter((row) => row.doc.type !== "review" || row.score >= 6);
  }

  const picked = [];
  const used = new Set();
  const counts = { review: 0, department: 0, placement: 0, event: 0, cgpa: 0 };

  for (const row of ranked) {
    const type = row.doc.type;
    if (counts[type] >= (limits[type] || 3)) continue;
    picked.push(row);
    used.add(row.doc);
    counts[type] += 1;
  }

  // Always keep the CGPA formula when the question is about grades.
  if (intents.cgpa) {
    const formula = docs.find((d) => d.type === "cgpa");
    if (formula && !used.has(formula)) picked.push({ doc: formula, score: 1 });
  }

  return picked.slice(0, 16);
}

export function tryLocalCgpa(query) {
  const current = query.match(/cgpa\s*(?:is|=|of)?\s*(\d+(?:\.\d+)?)/i);
  const credits = query.match(/(\d+)\s*credits/i);
  const gradeMatches = [...query.matchAll(/\b([SABCDEF])\b/g)].map((m) => m[1]);

  if (!current && gradeMatches.length === 0) return null;

  const courses = gradeMatches.map((grade) => ({ creditHours: 3, grade }));
  return {
    ...calculateCgpa({
      currentCgpa: current ? current[1] : "",
      earnedCredits: credits ? credits[1] : "",
      courses,
    }),
    assumedCreditHoursPerCourse: 3,
    gradesUsed: gradeMatches,
    note: "Each mentioned grade was treated as 3 credits unless the student specified otherwise.",
  };
}

export function formatContext(retrieved) {
  if (!retrieved.length) {
    return "No matching rows were found in Nebula's reviews, departments, placements, or events.";
  }
  return retrieved
    .map((row, i) => `SOURCE ${i + 1} [${row.doc.type}] ${row.doc.title}\n${row.doc.text}`)
    .join("\n\n---\n\n");
}
