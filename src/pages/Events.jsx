import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";

const DEFAULT_EVENTS = [
  {
    category: "Academic",
    title: "Course registration window",
    description: "Placeholder item for registration, add/drop, exam, and fee deadline tracking.",
  },
  {
    category: "Career",
    title: "Placement preparation sprint",
    description: "Dummy schedule block for resume reviews, mock interviews, and test practice.",
  },
  {
    category: "Campus Life",
    title: "Club meetups and seminars",
    description: "Use this space for department talks, workshops, fests, and society events.",
  },
];

function FormatDescription({ text }) {
  if (!text) return null;

  const mdLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const paragraphs = text.split("\n\n");

  return (
    <div className="description-container">
      {paragraphs.map((para, pIdx) => {
        let lastIndex = 0;
        let match;
        const parts = [];

        // Reset regex state
        mdLinkRegex.lastIndex = 0;

        while ((match = mdLinkRegex.exec(para)) !== null) {
          if (match.index > lastIndex) {
            parts.push(para.substring(lastIndex, match.index));
          }

          const linkText = match[1];
          const linkUrl = match[2];
          const isAttachment =
            linkText.startsWith("Download") ||
            linkText.includes("Drive") ||
            linkText.includes("Folder") ||
            linkText.includes("File:") ||
            linkUrl.includes("drive.google.com");

          const isImage = linkUrl.match(/\.(jpeg|jpg|gif|png|webp|svg)/i);

          if (isImage) {
            parts.push(
              <div key={match.index} style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
                <img
                  src={linkUrl}
                  alt={linkText}
                  style={{
                    width: "100%",
                    maxHeight: "140px",
                    objectFit: "cover",
                    borderRadius: "12px",
                    border: "1px solid var(--line)"
                  }}
                />
                <a
                  href={linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="resource-link-btn"
                  style={{ display: "inline-flex", alignSelf: "flex-start" }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: "6px", display: "inline-block", verticalAlign: "text-bottom" }}>
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  View Flyer
                </a>
              </div>
            );
          } else {
            parts.push(
              <a
                key={match.index}
                href={linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={isAttachment ? "resource-link-btn" : "inline-link"}
              >
                {isAttachment && (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ marginRight: "6px", display: "inline-block", verticalAlign: "text-bottom" }}
                  >
                    {linkUrl.includes("drive.google.com") ? (
                      <path d="M22 19H2L12 2l10 17z" />
                    ) : (
                      <>
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </>
                    )}
                  </svg>
                )}
                {linkText}
              </a>
            );
          }

          lastIndex = mdLinkRegex.lastIndex;
        }

        if (lastIndex < para.length) {
          parts.push(para.substring(lastIndex));
        }

        return <p key={pIdx}>{parts.length > 0 ? parts : para}</p>;
      })}
    </div>
  );
}

export default function Events() {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form states
  const [category, setCategory] = useState("Academic");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const isMockMode = !!localStorage.getItem("mockSession");

  const loadEvents = async () => {
    setLoading(true);
    if (isMockMode) {
      const stored = sessionStorage.getItem("mockEvents");
      if (stored) {
        setEvents(JSON.parse(stored));
      } else {
        setEvents(DEFAULT_EVENTS);
        sessionStorage.setItem("mockEvents", JSON.stringify(DEFAULT_EVENTS));
      }
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/events");
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      }
    } catch (err) {
      console.error("Failed to load events:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submitPayload = async (payload) => {
      if (isMockMode) {
        const updated = [payload, ...events];
        setEvents(updated);
        sessionStorage.setItem("mockEvents", JSON.stringify(updated));
        setIsModalOpen(false);
        resetForm();
        return;
      }

      try {
        const res = await fetch("/api/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          setIsModalOpen(false);
          resetForm();
          loadEvents();
        } else {
          alert("Submission failed.");
        }
      } catch (err) {
        console.error("Submission error:", err);
      }
    };

    const payload = {
      category,
      title,
      description,
    };

    if (selectedFile) {
      if (isMockMode) {
        payload.description += `\n\n[Attached File: ${selectedFile.name} - Saved Locally]`;
        await submitPayload(payload);
      } else {
        const reader = new FileReader();
        reader.onload = async (event) => {
          payload.file_name = selectedFile.name;
          payload.file_data = event.target.result;
          await submitPayload(payload);
        };
        reader.readAsDataURL(selectedFile);
      }
    } else {
      await submitPayload(payload);
    }
  };

  const resetForm = () => {
    setCategory("Academic");
    setTitle("");
    setDescription("");
    setSelectedFile(null);
  };

  return (
    <Layout>
      <article className="feature-panel is-visible">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Event tracker</p>
            <h1>Track academic deadlines, campus events, and club activities.</h1>
          </div>
          <button className="ghost-button" onClick={() => setIsModalOpen(true)} type="button">
            Add Event
          </button>
        </div>

        <div className="event-grid" id="eventGrid">
          {loading ? (
            <p style={{ gridColumn: "1/-1", textAlign: "center", color: "var(--body)" }}>Loading events...</p>
          ) : events.length === 0 ? (
            <p style={{ gridColumn: "1/-1", textAlign: "center", color: "var(--body)" }}>No events found.</p>
          ) : (
            events.map((evt, index) => (
              <article key={evt.id || index} className="event-card">
                <span>{evt.category}</span>
                <strong>{evt.title}</strong>
                <FormatDescription text={evt.description} />
              </article>
            ))
          )}
        </div>
      </article>

      {/* Add Event Modal */}
      {isModalOpen && (
        <div className="modal-overlay is-active" onClick={() => setIsModalOpen(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <header className="modal-header">
              <h2>Add Campus Event</h2>
              <button className="modal-close" type="button" aria-label="Close modal" onClick={() => setIsModalOpen(false)}>
                ×
              </button>
            </header>
            <main className="modal-body">
              <form id="eventForm" onSubmit={handleSubmit}>
                <label>
                  Event Category
                  <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                    <option value="Academic">Academic</option>
                    <option value="Career">Career</option>
                    <option value="Campus Life">Campus Life</option>
                  </select>
                </label>
                <label>
                  Event Title
                  <input
                    type="text"
                    value={title}
                    placeholder="e.g. Resume Verification Deadline"
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </label>
                <label>
                  Description / Notes
                  <textarea
                    rows="3"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add some details..."
                    required
                    style={{
                      width: "100%",
                      borderRadius: "8px",
                      background: "rgba(8, 9, 8, 0.72)",
                      border: "1px solid rgba(244, 240, 232, 0.13)",
                      color: "var(--ink)",
                      padding: "10px",
                      fontFamily: "inherit",
                      resize: "vertical",
                    }}
                  />
                </label>
                <label>
                  Event Flyer / Image (Optional)
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                    style={{
                      padding: "8px",
                      background: "rgba(8, 9, 8, 0.72)",
                      border: "1px solid rgba(244, 240, 232, 0.13)",
                      borderRadius: "8px",
                      color: "var(--body)",
                      cursor: "pointer",
                    }}
                  />
                </label>
              </form>
            </main>
            <footer className="modal-footer">
              <button className="ghost-button secondary" type="button" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
              <button className="primary-button" form="eventForm" type="submit">
                Publish Event
              </button>
            </footer>
          </div>
        </div>
      )}
    </Layout>
  );
}
