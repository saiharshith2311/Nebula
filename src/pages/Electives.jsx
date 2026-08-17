import React, { useState, useEffect, useMemo } from "react";
import Layout from "../components/Layout";
import { DEFAULT_REVIEWS } from "../../lib/data/reviews.js";

export default function Electives() {
  const [reviews, setReviews] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchFocused, setSearchFocused] = useState(false);

  // Form states
  const [courseName, setCourseName] = useState("");
  const [courseId, setCourseId] = useState("");
  const [professor, setProfessor] = useState("");
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState(5);

  const isMockMode = !!localStorage.getItem("mockSession");

  const loadReviews = async () => {
    setLoading(true);
    if (isMockMode) {
      const stored = sessionStorage.getItem("mockReviews");
      if (stored) {
        setReviews(JSON.parse(stored));
      } else {
        setReviews(DEFAULT_REVIEWS);
        sessionStorage.setItem("mockReviews", JSON.stringify(DEFAULT_REVIEWS));
      }
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/reviews");
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (err) {
      console.error("Failed to load reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Precomputed search index matching exactly what app-v2.js had
  const filteredReviews = useMemo(() => {
    const normQuery = searchQuery.toLowerCase().trim();
    if (!normQuery) return reviews;

    const compactQuery = normQuery.replace(/[^a-z0-9]/g, "");
    const terms = normQuery.match(/[a-z0-9]+/g) || [];

    return reviews.filter((review) => {
      const searchableValues = [review.course, review.course_id, review.professor].filter(Boolean);
      const searchableText = searchableValues.join(" ").toLowerCase();
      const compactText = searchableValues.join("").toLowerCase().replace(/[^a-z0-9]/g, "");

      return (
        terms.every((term) => searchableText.includes(term)) ||
        (compactQuery.length > 0 && compactText.includes(compactQuery))
      );
    });
  }, [reviews, searchQuery]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      course: courseName,
      course_id: courseId || null,
      professor: professor || null,
      review: description,
      rating: rating ? Number(rating) : null,
    };

    if (isMockMode) {
      const updated = [payload, ...reviews];
      setReviews(updated);
      sessionStorage.setItem("mockReviews", JSON.stringify(updated));
      setIsModalOpen(false);
      resetForm();
      return;
    }

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        resetForm();
        loadReviews();
      } else {
        alert("Failed to submit review.");
      }
    } catch (err) {
      console.error("Error submitting review:", err);
    }
  };

  const resetForm = () => {
    setCourseName("");
    setCourseId("");
    setProfessor("");
    setDescription("");
    setRating(5);
  };

  // Extract unique course titles/codes for search autocomplete datalist
  const suggestions = useMemo(() => {
    const set = new Set();
    reviews.forEach((r) => {
      if (r.course) {
        set.add(r.course_id ? `${r.course} (${r.course_id})` : r.course);
      }
    });
    return Array.from(set);
  }, [reviews]);

  const filteredSuggestions = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return [];
    return suggestions.filter(item => item.toLowerCase().includes(q)).slice(0, 5);
  }, [suggestions, searchQuery]);

  return (
    <Layout>
      <article className="feature-panel is-visible">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Elective reviews</p>
            <h1>"An investment in knowledge pays the best interest." — Benjamin Franklin</h1>
          </div>
          <button className="ghost-button" type="button" onClick={() => setIsModalOpen(true)}>
            Add Review
          </button>
        </div>

        <div className="review-layout">
          <aside className="filters" aria-label="Elective filters">
            <div className="search-suggestions-container">
              <label>
                Course name or ID
                <input
                  id="courseSearch"
                  type="search"
                  value={searchQuery}
                  onChange={handleSearch}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => {
                    // Delay slightly to allow click handlers on suggestions to fire
                    setTimeout(() => setSearchFocused(false), 200);
                  }}
                  placeholder="Search HS5708, economics..."
                  autoComplete="off"
                />
              </label>
              {searchFocused && filteredSuggestions.length > 0 && (
                <div className="search-suggestions-dropdown">
                  {filteredSuggestions.map((item, idx) => (
                    <div
                      key={idx}
                      className="suggestion-item"
                      onClick={() => {
                        setSearchQuery(item);
                        setSearchFocused(false);
                      }}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <p className="result-count" aria-live="polite">
              {loading ? "Loading reviews..." : `${filteredReviews.length} review${filteredReviews.length === 1 ? "" : "s"} found`}
            </p>
          </aside>

          <div className="review-list" id="reviewList">
            {filteredReviews.length === 0 && !loading ? (
              <p className="empty-state">No matching elective found.</p>
            ) : (
              filteredReviews.map((rev, index) => (
                <article key={rev.id || index} className="review-card">
                  <div className="review-body">
                    <h3>{rev.course}</h3>
                    <div className="review-meta">
                      <span className={!rev.course_id ? "is-muted" : ""}>
                        <strong>Course ID: </strong>
                        {rev.course_id || "Not provided"}
                      </span>
                      <span className={!rev.professor ? "is-muted" : ""}>
                        <strong>Professor: </strong>
                        {rev.professor || "Not provided"}
                      </span>
                      {rev.rating && (
                        <span>
                          <strong>Rating:</strong>
                          <span style={{ color: "var(--gold)", letterSpacing: "2px", display: "inline-flex", alignItems: "center" }}>
                            {"★".repeat(rev.rating)}{"☆".repeat(5 - rev.rating)}
                          </span>
                          <span>({rev.rating}/5)</span>
                        </span>
                      )}
                    </div>
                    <p>{rev.review}</p>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </article>

      {/* Add Review Modal */}
      {isModalOpen && (
        <div className="modal-overlay is-active" onClick={() => setIsModalOpen(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <header className="modal-header">
              <h2>Add Elective Review</h2>
              <button className="modal-close" type="button" aria-label="Close modal" onClick={() => setIsModalOpen(false)}>
                ×
              </button>
            </header>
            <main className="modal-body">
              <form id="reviewForm" onSubmit={handleSubmit}>
                <label>
                  Course Name
                  <input
                    type="text"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    placeholder="e.g. Econometrics-1"
                    required
                  />
                </label>
                <label>
                  Course ID (Optional)
                  <input
                    type="text"
                    value={courseId}
                    onChange={(e) => setCourseId(e.target.value)}
                    placeholder="e.g. HS5708"
                  />
                </label>
                 <label>
                  Professor Name (Optional)
                  <input
                    type="text"
                    value={professor}
                    onChange={(e) => setProfessor(e.target.value)}
                    placeholder="e.g. Sabuj Kumar Mandal"
                  />
                </label>
                <label>
                  Course Rating
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    required
                  >
                    <option value="5">★★★★★ (5/5)</option>
                    <option value="4">★★★★☆ (4/5)</option>
                    <option value="3">★★★☆☆ (3/5)</option>
                    <option value="2">★★☆☆☆ (2/5)</option>
                    <option value="1">★☆☆☆☆ (1/5)</option>
                  </select>
                </label>
                <label>
                  Review Description
                  <textarea
                    rows="4"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Write your review here..."
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
              </form>
            </main>
            <footer className="modal-footer">
              <button className="ghost-button secondary" type="button" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
              <button className="primary-button" form="reviewForm" type="submit">
                Submit Review
              </button>
            </footer>
          </div>
        </div>
      )}
    </Layout>
  );
}
