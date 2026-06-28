import React, { useState, useEffect, useMemo } from "react";
import Layout from "../components/Layout";

const DEFAULT_PLACEMENTS = [
  {
    category: "Non Core",
    title: "Verbal",
    description: "Reading comprehension, grammar, and vocabulary exercises.\n\n[Open Verbal Prep Folder](https://drive.google.com/drive/folders/1ewAZ3ZvjIdS0rd8ZYZFvoRRWPdrJDmq6?usp=drive_link)"
  },
  {
    category: "Non Core",
    title: "Puzzles",
    description: "Common placement puzzles, brain teasers, and interview riddles.\n\n[Open Puzzles Prep Folder](https://drive.google.com/drive/folders/1OhMuO4mEYYqbomTkLduA3ZZm9YfJEe4N?usp=drive_link)"
  },
  {
    category: "Non Core",
    title: "Product Management",
    description: "Case studies, product design, root cause analysis, and metrics questions.\n\n[Open Product Management Prep Folder](https://drive.google.com/drive/folders/1D0gKrNvPDyKW5a21lIn849w4EaCsjfBQ?usp=drive_link)"
  },
  {
    category: "Non Core",
    title: "Logic Reasoning",
    description: "Data interpretation and logical reasoning practice papers.\n\n[Open Logic Reasoning Prep Folder](https://drive.google.com/drive/folders/1vu7UKNR25QTrHdAQE2Erj41C1b_DtDAk?usp=drive_link)"
  },
  {
    category: "Non Core",
    title: "HR",
    description: "Sample HR questions, self-introduction templates, and behavioural preparation.\n\n[Open HR Prep Folder](https://drive.google.com/drive/folders/1GJQcyQgi_BhLCOIo5jQKLF9LHv65j1ra?usp=drive_link)"
  },
  {
    category: "Non Core",
    title: "Guesstimates",
    description: "Structured framework notes and common guesstimate problems for consult rounds.\n\n[Open Guesstimates Prep Folder](https://drive.google.com/drive/folders/1U6UsogEZAHXZocDYJmZYQCdQf0mSouRd?usp=drive_link)"
  },
  {
    category: "Non Core",
    title: "Finance",
    description: "Basic accounting, corporate finance notes, and quant trading questions.\n\n[Open Finance Prep Folder](https://drive.google.com/drive/folders/1yQvQ-pW8oaDLuvo3yI6x-rizo3OVJsUE?usp=drive_link)"
  },
  {
    category: "Non Core",
    title: "Consult",
    description: "Case interview booklets, frameworks (profitability, market entry), and transcript logs.\n\n[Open Consult Prep Folder](https://drive.google.com/drive/folders/1qmvWfNelF_6nXPpKJwbyhBvw0dkDucyx?usp=drive_link)"
  },
  {
    category: "Non Core",
    title: "Coding",
    description: "Data Structures & Algorithms sheets, interview bits, and contest archives.\n\n[Open Coding Prep Folder](https://drive.google.com/drive/folders/1gWVVMc6j5VzE8dLkCTl_3ithIytSYvf5?usp=drive_link)"
  },
  {
    category: "Non Core",
    title: "Aptitude",
    description: "Topic-wise practice sets for quantitative aptitude and logic.\n\n[Open Aptitude Prep Folder](https://drive.google.com/drive/folders/1gzDWHFTCveEBmK4NPoEFSRZ5hc840QoX?usp=drive_link)"
  },
  {
    category: "Non Core",
    title: "Analytics",
    description: "SQL query sets, machine learning prep, probability, and statistics sets.\n\n[Open Analytics Prep Folder](https://drive.google.com/drive/folders/1vcb1PwAd6wg6dinnblxnB4E1jQT6zW8f?usp=drive_link)"
  }
];

export default function Placements() {
  const [placements, setPlacements] = useState([]);
  const [activeTab, setActiveTab] = useState("Non Core");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form states
  const [category, setCategory] = useState("Non Core");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [resourceLink, setResourceLink] = useState("");

  const isMockMode = !!localStorage.getItem("mockSession");

  const loadPlacements = async () => {
    setLoading(true);
    if (isMockMode) {
      const stored = sessionStorage.getItem("mockPlacements");
      if (stored) {
        setPlacements(JSON.parse(stored));
      } else {
        setPlacements(DEFAULT_PLACEMENTS);
        sessionStorage.setItem("mockPlacements", JSON.stringify(DEFAULT_PLACEMENTS));
      }
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/placements");
      if (res.ok) {
        let data = await res.json();
        
        // Auto-seed backend table if empty
        if (data.length === 0) {
          console.log("Seeding placements database...");
          for (const item of DEFAULT_PLACEMENTS) {
            await fetch("/api/placements", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(item),
            });
          }
          const refetch = await fetch("/api/placements");
          data = await refetch.json();
        }
        setPlacements(data);
      }
    } catch (err) {
      console.error("Failed to load placements:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlacements();
  }, []);

  // Filter list based on tab
  const filteredPlacements = useMemo(() => {
    const filtered = placements.filter((res) => {
      // Hide Drive Navigator card if present
      if ((res.title || "").trim() === "Drive Navigator (All Departments)") {
        return false;
      }
      const cat = (res.category || "").trim().toLowerCase();
      if (activeTab === "Non Core") {
        return cat === "non core" || cat === "featured resource" || !cat || ["aptitude", "coding", "interviews"].includes(cat);
      } else {
        return cat === "core";
      }
    });

    // Sort featured resources to the top
    return [...filtered].sort((a, b) => {
      const aFeatured = a.category === "Featured Resource" || (a.description || "").includes("Featured:");
      const bFeatured = b.category === "Featured Resource" || (b.description || "").includes("Featured:");
      if (aFeatured && !bFeatured) return -1;
      if (!aFeatured && bFeatured) return 1;
      return 0;
    });
  }, [placements, activeTab]);

  // Helper to extract first markdown link from description text
  const parseCardLink = (text) => {
    const mdLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/;
    const match = mdLinkRegex.exec(text || "");
    return match ? match[2] : null;
  };

  const handleCardClick = (desc) => {
    const link = parseCardLink(desc);
    if (link) {
      window.open(link, "_blank");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalDesc = description.trim()
      ? `${description.trim()}\n\n[Open Resource](${resourceLink.trim()})`
      : `[Open Resource](${resourceLink.trim()})`;
    
    const submitPayload = async (payload) => {
      if (isMockMode) {
        const updated = [payload, ...placements];
        setPlacements(updated);
        sessionStorage.setItem("mockPlacements", JSON.stringify(updated));
        setIsModalOpen(false);
        resetForm();
        return;
      }

      try {
        const res = await fetch("/api/placements", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          setIsModalOpen(false);
          resetForm();
          loadPlacements();
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
      description: finalDesc,
    };

    await submitPayload(payload);
  };

  const resetForm = () => {
    setCategory("Non Core");
    setTitle("");
    setDescription("");
    setResourceLink("");
  };

  return (
    <Layout>
      <article className="feature-panel is-visible">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Placements & Internships</p>
            <h1>"The only way to do great work is to love what you do." — Steve Jobs</h1>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "14px" }}>
            <div className="segment-control">
              <button
                className={`segment-btn ${activeTab === "Non Core" ? "active" : ""}`}
                onClick={() => setActiveTab("Non Core")}
                type="button"
              >
                Non Core
              </button>
              <button
                className={`segment-btn ${activeTab === "Core" ? "active" : ""}`}
                onClick={() => setActiveTab("Core")}
                type="button"
              >
                Core
              </button>
            </div>
            <button className="ghost-button" onClick={() => setIsModalOpen(true)} type="button">
              Upload Resource
            </button>
          </div>
        </div>

        <div className="resource-grid" id="resourceGrid">
          {filteredPlacements.length === 0 && !loading ? (
            <div className="empty-tab-state">
              {activeTab === "Core" ? (
                <>
                  <h3>Core Resources Coming Soon!</h3>
                  <p>We are currently curating premium preparation materials for Core Engineering branches. Check back shortly!</p>
                </>
              ) : (
                <>
                  <h3>No Non-Core Resources</h3>
                  <p>Click 'Upload Resource' above to add a new preparation sheet or folder.</p>
                </>
              )}
            </div>
          ) : (
            filteredPlacements.map((res, index) => {
              const link = parseCardLink(res.description);
              const isFeatured = res.category === "Featured Resource" || (res.description || "").includes("Featured:");
              
              return (
                <article
                  key={res.id || index}
                  className={`resource-card ${isFeatured ? "is-featured" : ""}`}
                  style={link ? { cursor: "pointer" } : {}}
                  onClick={() => handleCardClick(res.description)}
                >
                  <span>{res.category || "Resource"}</span>
                  <strong>{res.title}</strong>
                  {link && (
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="resource-link-btn"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: "6px", display: "inline-block", verticalAlign: "text-bottom" }}>
                        <path d="M22 19H2L12 2l10 17z" />
                      </svg>
                      Open Drive Folder
                    </a>
                  )}
                </article>
              );
            })
          )}
        </div>
      </article>

      {/* Upload Resource Modal */}
      {isModalOpen && (
        <div className="modal-overlay is-active" onClick={() => setIsModalOpen(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <header className="modal-header">
              <h2>Upload Placement & Internship Resource</h2>
              <button className="modal-close" type="button" aria-label="Close modal" onClick={() => setIsModalOpen(false)}>
                ×
              </button>
            </header>
            <main className="modal-body">
              <form id="resourceForm" onSubmit={handleSubmit}>
                <label>
                  Resource Category
                  <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                    <option value="Non Core">Non Core</option>
                    <option value="Core">Core</option>
                  </select>
                </label>
                <label>
                  Resource Title
                  <input
                    type="text"
                    value={title}
                    placeholder="e.g. SDE Interview Practice"
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </label>
                <label>
                  Resource Link (e.g. Google Drive, Website URL)
                  <input
                    type="url"
                    value={resourceLink}
                    placeholder="https://drive.google.com/..."
                    onChange={(e) => setResourceLink(e.target.value)}
                    required
                  />
                </label>
                <label>
                  Short Description (Optional)
                  <textarea
                    rows="3"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add preparation notes or details about the resource..."
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
              </form>
            </main>
            <footer className="modal-footer">
              <button className="ghost-button secondary" type="button" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
              <button className="primary-button" form="resourceForm" type="submit">
                Upload Resource
              </button>
            </footer>
          </div>
        </div>
      )}
    </Layout>
  );
}
