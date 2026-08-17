import React, { useEffect, useRef, useState } from "react";

const SUGGESTIONS = [
  "Easy SAB electives with lite attendance",
  "How is Principles of Economics across professors?",
  "CSE previous papers and notes",
  "Coding and aptitude prep for internships",
  "CGPA 8.2 with 96 credits if I get A, B and S",
];

function renderAnswer(text) {
  const blocks = String(text || "").split("\n");
  return blocks.map((line, idx) => {
    const html = line
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\[([^\]]+)\]\((https?:[^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/(https?:\/\/[^\s)]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    if (!line.trim()) return <div key={idx} style={{ height: "8px" }} />;
    return <p key={idx} dangerouslySetInnerHTML={{ __html: html }} />;
  });
}

export default function CampusChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState(() => {
    try {
      const stored = sessionStorage.getItem("nebulaChat");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const listRef = useRef(null);

  useEffect(() => {
    sessionStorage.setItem("nebulaChat", JSON.stringify(messages.slice(-20)));
  }, [messages]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, busy, open]);

  const send = async (text) => {
    const question = (text || input).trim();
    if (!question || busy) return;

    const nextMessages = [...messages, { role: "user", content: question }];
    setMessages(nextMessages);
    setInput("");
    setBusy(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: question,
          history: nextMessages.slice(0, -1).slice(-8).map(({ role, content }) => ({ role, content })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.error || "Could not answer that." },
        ]);
        return;
      }
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.answer, sources: data.sources || [] },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Network error. Is the backend running?" },
      ]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="campus-chat">
      {open && (
        <section className="campus-chat-panel" aria-label="Nebula advisor">
          <header className="campus-chat-header">
            <div>
              <strong>Nebula Advisor</strong>
              <small>Answers from electives, drives, placements, events, CGPA</small>
            </div>
            <button type="button" className="campus-chat-close" onClick={() => setOpen(false)} aria-label="Close chat">
              ×
            </button>
          </header>

          <div className="campus-chat-thread" ref={listRef}>
            {messages.length === 0 && (
              <div className="campus-chat-empty">
                <p>Ask in plain language. I retrieve from this site, then recommend — I will not invent courses or Drive links.</p>
                <div className="campus-chat-suggestions">
                  {SUGGESTIONS.map((item) => (
                    <button key={item} type="button" onClick={() => send(item)}>
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, idx) => (
              <article key={idx} className={`campus-chat-bubble campus-chat-${msg.role}`}>
                {msg.role === "assistant" ? renderAnswer(msg.content) : <p>{msg.content}</p>}
                {msg.sources?.length > 0 && (
                  <ul className="campus-chat-sources">
                    {msg.sources.map((src, sIdx) => (
                      <li key={sIdx}>
                        {src.type}: {src.title}
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
            {busy && <p className="campus-chat-pending">Looking through Nebula…</p>}
          </div>

          <form
            className="campus-chat-form"
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about an elective, Drive, or CGPA…"
              disabled={busy}
              maxLength={800}
            />
            <button className="primary-button compact" type="submit" disabled={busy || !input.trim()}>
              Send
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        className="campus-chat-toggle"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {open ? "Close advisor" : "Ask Nebula"}
      </button>
    </div>
  );
}
