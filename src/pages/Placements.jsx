import React, { useState, useEffect, useMemo } from "react";
import Layout from "../components/Layout";
import { DEFAULT_PLACEMENTS } from "../../lib/data/placements.js";

export default function Placements() {
  const [placements, setPlacements] = useState([]);
  const [activeTab, setActiveTab] = useState("Non Core");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form states
  const [category, setCategory] = useState("Non Core");
  const [title, setTitle] = useState("");
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

    const finalDesc = `[Open Resource](${resourceLink.trim()})`;
    
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
