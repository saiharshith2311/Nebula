import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const DEFAULT_DEPARTMENTS = [
  {
    category: "Aerospace",
    title: "Aerospace Engineering Drive",
    description: "[Open Course & Placements Drive](https://drive.google.com/drive/folders/1X9-h5PiDaVL14SUWf4z5uP4dph05j3Rt)"
  },
  {
    category: "Biotechnology",
    title: "Biotech & Biosciences Drive",
    description: "[Open Biotech Academic Drive](https://drive.google.com/folderview?id=1_bS2WpgeFRYFLOA7ErUccq7mR__jJp6i)"
  },
  {
    category: "Chemical",
    title: "Chemical Engineering Drive",
    description: "[Open CH Academic Drive](https://drive.google.com/drive/folders/1JxLrk-8g0IFqJSSrCyw_eGhHZashHrmV)\n\n[View CH Electives Sheet](https://docs.google.com/spreadsheets/d/1QbBlRX8bfRjlJWq71QKAKX_jsNOHMfJyOJMW_QICbxw/edit?usp=drivesdk)"
  },
  {
    category: "Civil",
    title: "Civil Engineering Drive",
    description: "[Open Civil Academic Drive](https://drive.google.com/drive/u/1/folders/1BpH187QdGFyarf173CnKwEw-uiJlTkZi)"
  },
  {
    category: "Computational Engineering and Mechanics (CEM)",
    title: "Computational Engineering Resources",
    description: "Welcome to the CEM resources hub. Click 'Upload Resource' to share materials, drives, or slides."
  },
  {
    category: "Computer Science",
    title: "CSE Semester Papers & Notes",
    description: "[Open CSE Previous Papers](https://drive.google.com/drive/folders/14ySGuB8Tq-yYExVX8oLGkvZRUrMgDJWt)"
  },
  {
    category: "Data Science and Artificial Intelligence",
    title: "Data Science & AI Resources",
    description: "Welcome to the DSAI resources hub. Click 'Upload Resource' to share materials, drives, or slides."
  },
  {
    category: "Electrical",
    title: "Electrical Engineering Drive",
    description: "[Open Electrical 2023 Drive](https://drive.google.com/drive/folders/1Us7SI2eLxUbF-zPi9fgX1I3q3wjR3Vcg)"
  },
  {
    category: "Engineering Design",
    title: "Engineering Design Drive",
    description: "[Open Design ED23 Drive](https://drive.google.com/drive/folders/1FWbDKzhUNTEO0KoC2z9ui4RDULVeVnLM?usp=drive_link)"
  },
  {
    category: "Instrumentation and Biomedical Engineering (iBME)",
    title: "Instrumentation & Biomedical Resources",
    description: "Welcome to the iBME resources hub. Click 'Upload Resource' to share materials, drives, or slides."
  },
  {
    category: "Mechanical",
    title: "Mechanical Engineering Drive",
    description: "[Open Mechanical Core Drive](https://drive.google.com/drive/folders/178uIbQvjF35hEMZZCUyBVFxIhXQ7UzDJ)\n\n[Open Mechanical 2024 Drive](https://drive.google.com/drive/folders/1Us7SI2eLxUbF-zPi9fgX1I3q3wjR3Vcg)"
  },
  {
    category: "Metallurgy",
    title: "MME Academic Drive",
    description: "[Open Metallurgy Drive](https://drive.google.com/drive/folders/1TEYRCZJOoyi2SFP0kWobEe1S-gTGY4YS?usp=sharing)"
  },
  {
    category: "Naval Architecture",
    title: "Naval Arch & Ocean Engineering",
    description: "[Open Naval Academic Drive](https://drive.google.com/drive/folders/1uOsW1wfX_8NU2W7X0jDUqF8Ix4twJKgO?usp=sharing)\n\n[View NAOE Linktree Portal](https://linktr.ee/naoe_iitm)"
  }
];

const PREDEFINED_DEPARTMENTS = [
  "Aerospace",
  "Biotechnology",
  "Chemical",
  "Civil",
  "Computational Engineering and Mechanics (CEM)",
  "Computer Science",
  "Data Science and Artificial Intelligence",
  "Electrical",
  "Engineering Design",
  "Instrumentation and Biomedical Engineering (iBME)",
  "Mechanical",
  "Metallurgy",
  "Naval Architecture"
];

// Fallback session key changed to avoid loading stale browser caches
const FALLBACK_STORAGE_KEY = "harbourDepartmentsFallback_v7";

// Helper to parse all markdown links [Link Text](url) and clean description
const parseLinksAndDescription = (text) => {
  const mdLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const links = [];
  let match;
  while ((match = mdLinkRegex.exec(text || "")) !== null) {
    links.push({ text: match[1], url: match[2] });
  }
  const cleanDescription = (text || "").replace(/\[([^\]]+)\]\(([^)]+)\)/g, "").trim();
  return { links, cleanDescription };
};

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { addToast } = useToast();

  // Form states
  const [category, setCategory] = useState("Aerospace");
  const [customCategory, setCustomCategory] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [resourceLink, setResourceLink] = useState("");

  const isMockMode = !!localStorage.getItem("mockSession");

  const loadDepartments = async () => {
    setLoading(true);
    if (isMockMode) {
      const stored = sessionStorage.getItem("mockDepartments");
      if (stored) {
        const parsed = JSON.parse(stored).map(d => ({
          ...d,
          category: (d.category === "Design" || d.category === "design") ? "Engineering Design" : d.category
        }));
        setDepartments(parsed);
      } else {
        setDepartments(DEFAULT_DEPARTMENTS);
        sessionStorage.setItem("mockDepartments", JSON.stringify(DEFAULT_DEPARTMENTS));
      }
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/departments");
      if (res.ok) {
        let data = await res.json();
        if (data.error) {
          throw new Error(data.error);
        }
        
        // Auto-seed backend table if empty
        if (data.length === 0) {
          console.log("Seeding departments database...");
          for (const item of DEFAULT_DEPARTMENTS) {
            await fetch("/api/departments", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(item),
            });
          }
          const refetch = await fetch("/api/departments");
          data = await refetch.json();
        }
        const normalized = data.map(d => ({
          ...d,
          category: (d.category === "Design" || d.category === "design") ? "Engineering Design" : d.category
        }));
        setDepartments(normalized);
      } else {
        throw new Error(`Server returned status ${res.status}`);
      }
    } catch (err) {
      console.warn("Failed to load departments from API. Falling back to local storage:", err);
      // Fallback local storage logic using the updated versioned key
      const stored = sessionStorage.getItem(FALLBACK_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored).map(d => ({
          ...d,
          category: (d.category === "Design" || d.category === "design") ? "Engineering Design" : d.category
        }));
        setDepartments(parsed);
      } else {
        setDepartments(DEFAULT_DEPARTMENTS);
        sessionStorage.setItem(FALLBACK_STORAGE_KEY, JSON.stringify(DEFAULT_DEPARTMENTS));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  // Group departments by category
  const groupedDepartments = React.useMemo(() => {
    const groups = {};
    departments.forEach((dept) => {
      const cat = dept.category || "Other";
      if (!groups[cat]) {
        groups[cat] = [];
      }
      groups[cat].push(dept);
    });
    return groups;
  }, [departments]);

  const resetForm = () => {
    setCategory("Aerospace");
    setCustomCategory("");
    setTitle("");
    setDescription("");
    setResourceLink("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalCategory = category === "Other" ? (customCategory.trim() || "Other") : category;
    
    const finalDesc = description.trim()
      ? `${description.trim()}\n\n[Open Resource](${resourceLink.trim()})`
      : `[Open Resource](${resourceLink.trim()})`;

    const submitPayload = async (payload) => {
      if (isMockMode) {
        const updated = [payload, ...departments];
        setDepartments(updated);
        sessionStorage.setItem("mockDepartments", JSON.stringify(updated));
        addToast("Resource uploaded successfully (Mock Mode)!", "success");
        setIsModalOpen(false);
        resetForm();
        return;
      }

      try {
        const res = await fetch("/api/departments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (res.ok && !data.error) {
          addToast("Department resource uploaded successfully!", "success");
          setIsModalOpen(false);
          resetForm();
          loadDepartments();
        } else {
          throw new Error(data.error || "Server error");
        }
      } catch (err) {
        console.warn("API upload failed, using fallback storage:", err);
        // Fallback save using versioned storage key
        const stored = sessionStorage.getItem(FALLBACK_STORAGE_KEY) || JSON.stringify(DEFAULT_DEPARTMENTS);
        const currentList = JSON.parse(stored);
        const updated = [payload, ...currentList];
        setDepartments(updated);
        sessionStorage.setItem(FALLBACK_STORAGE_KEY, JSON.stringify(updated));
        addToast("Uploaded to local session storage (Database table not set up yet)", "warning");
        setIsModalOpen(false);
        resetForm();
      }
    };

    const payload = {
      category: finalCategory,
      title: title.trim(),
      description: finalDesc,
    };

    await submitPayload(payload);
  };

  return (
    <Layout>
      <article className="feature-panel is-visible">
        {selectedCategory === null ? (
          /* =========================================================
             VIEW 1: DEPARTMENTS GRID (MAIN DIRECTORY)
             ========================================================= */
          <>
            <div className="panel-header">
              <div>
                <p className="eyebrow">Academic Semesters</p>
                <h1>Curated study materials, slides, and files sorted by department.</h1>
              </div>
              <div>
                <button className="ghost-button" onClick={() => setIsModalOpen(true)} type="button">
                  Upload Resource
                </button>
              </div>
            </div>

            {loading ? (
              <div style={{ display: "grid", placeItems: "center", minHeight: "200px" }}>
                <p style={{ color: "var(--muted)" }}>Loading department resources...</p>
              </div>
            ) : (
              <div className="resource-grid" id="departmentGrid" style={{ display: "grid", gap: "24px", padding: "28px" }}>
                {Object.entries(groupedDepartments)
                  .sort(([a], [b]) => a.localeCompare(b))
                  .map(([catName, items], index) => (
                  <article 
                    key={index} 
                    className="resource-card" 
                    onClick={() => setSelectedCategory(catName)}
                    style={{ 
                      display: "flex", 
                      flexDirection: "column", 
                      height: "auto", 
                      minHeight: "150px", 
                      padding: "24px",
                      cursor: "pointer",
                      justifyContent: "space-between"
                    }}
                  >
                    <div>
                      <span style={{ display: "block", marginBottom: "8px", color: "var(--maroon)", fontSize: "0.8rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        Department
                      </span>
                      <strong style={{ display: "block", marginBottom: "4px", fontSize: "1.35rem", color: "var(--ink)" }}>
                        {catName}
                      </strong>
                    </div>

                    <div style={{ marginTop: "16px", display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                      <span className="inline-link" style={{ fontSize: "0.84rem" }}>
                        View Resources →
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        ) : (
          /* =========================================================
             VIEW 2: SPECIFIC DEPARTMENT RESOURCES (SINGLE VIEW)
             ========================================================= */
          <>
            <div className="panel-header">
              <div>
                <button 
                  className="ghost-button" 
                  onClick={() => setSelectedCategory(null)}
                  style={{ 
                    marginBottom: "14px", 
                    display: "inline-flex", 
                    alignItems: "center",
                    minHeight: "34px",
                    padding: "0 12px",
                    fontSize: "0.82rem",
                    borderRadius: "6px"
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: "6px" }}>
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                  Back to Departments
                </button>
                <p className="eyebrow">{selectedCategory} Department</p>
                <h1>Study materials and curated drives for {selectedCategory} Engineering.</h1>
              </div>
              <div>
                <button className="ghost-button" onClick={() => setIsModalOpen(true)} type="button">
                  Upload Resource
                </button>
              </div>
            </div>

            <div className="resource-detail-stack" style={{ display: "grid", gap: "20px", padding: "28px", maxWidth: "800px", margin: "0 auto" }}>
              {groupedDepartments[selectedCategory] && groupedDepartments[selectedCategory].length > 0 ? (
                groupedDepartments[selectedCategory].map((item, itemIdx) => {
                  const { links, cleanDescription } = parseLinksAndDescription(item.description);
                  return (
                    <article 
                      key={item.id || itemIdx} 
                      className="resource-card" 
                      style={{ 
                        display: "flex", 
                        flexDirection: "column", 
                        padding: "24px", 
                        minHeight: "auto",
                        width: "100%",
                        boxShadow: "var(--soft-shadow)"
                      }}
                    >
                      <strong style={{ display: "block", marginBottom: "8px", fontSize: "1.25rem", color: "var(--ink)" }}>
                        {item.title}
                      </strong>
                      {cleanDescription && (
                        <p style={{ margin: "4px 0 16px 0", fontSize: "0.95rem", color: "var(--body)", lineHeight: "1.6" }}>
                          {cleanDescription}
                        </p>
                      )}
                      
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "12px", justifyContent: "center" }}>
                        {links.map((link, lIdx) => (
                          <a
                            key={lIdx}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="resource-link-btn"
                            style={{ margin: 0 }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: "6px", display: "inline-block", verticalAlign: "text-bottom" }}>
                              {link.url.includes("drive.google.com") || link.url.includes("folderview") ? (
                                <path d="M22 19H2L12 2l10 17z" />
                              ) : link.url.includes("spreadsheets") ? (
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                              ) : (
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                              )}
                            </svg>
                            {link.text}
                          </a>
                        ))}
                      </div>
                    </article>
                  );
                })
              ) : (
                <div style={{ textAlign: "center", padding: "40px", color: "var(--muted)" }}>
                  <p>No resources available for this department yet.</p>
                </div>
              )}
            </div>
          </>
        )}
      </article>

      {/* Upload Resource Modal */}
      {isModalOpen && (
        <div className="modal-overlay is-active" onClick={() => { setIsModalOpen(false); resetForm(); }}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <header className="modal-header">
              <h2>Upload Department Resource</h2>
              <button className="modal-close" type="button" aria-label="Close modal" onClick={() => { setIsModalOpen(false); resetForm(); }}>
                ×
              </button>
            </header>
            <main className="modal-body">
              <form id="deptResourceForm" onSubmit={handleSubmit}>
                <label>
                  Department / Branch
                  <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                    {PREDEFINED_DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                    <option value="Other">Other (Type custom department)</option>
                  </select>
                </label>

                {category === "Other" && (
                  <label>
                    Custom Department Name
                    <input
                      type="text"
                      value={customCategory}
                      placeholder="e.g. Humanities"
                      onChange={(e) => setCustomCategory(e.target.value)}
                      required
                    />
                  </label>
                )}

                <label>
                  Resource Title
                  <input
                    type="text"
                    value={title}
                    placeholder="e.g. Engineering Mechanics Syllabus & Slides"
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
                    placeholder="Add extra notes or details about the resource..."
                    style={{
                      width: "100%",
                      borderRadius: "8px",
                      background: "#ffffff",
                      border: "1px solid rgba(0, 0, 0, 0.08)",
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
              <button className="ghost-button secondary" type="button" onClick={() => { setIsModalOpen(false); resetForm(); }}>
                Cancel
              </button>
              <button className="primary-button" form="deptResourceForm" type="submit">
                Upload Resource
              </button>
            </footer>
          </div>
        </div>
      )}
    </Layout>
  );
}
