import React, { useState, useEffect, useMemo } from "react";
import Layout from "../components/Layout";

const DEFAULT_REVIEWS = [
  {
    course: "Econometrics-1",
    course_id: "HS5708",
    professor: "Sabuj Kumar Mandal",
    review: "Professor is very unpredictable and affects grades pretty often.",
  },
  {
    course: "Fundamentals of Operations Research",
    course_id: "MS3510",
    professor: "Srinivasan G",
    review: "Overall it is a usual SAB course, but you have to put more effort into practicing theoretical problems to get a good score in exams. Strict attendance.",
  },
  {
    course: "Literature and Values",
    course_id: "HS4210",
    professor: "Swarnlata",
    review: "Interesting for those who enjoy philosophy, with lots of discussions and presentations requiring strong writing skills. Grading is tough; answers must be 150-200 words with clear grammar.",
  },
  {
    course: "Principles of Economics",
    course_id: "",
    professor: "Subash Kumar Sahu",
    review: "Quizzes are MCQs; endsem is descriptive with short answers and fill-in-the-blanks. Grading seems manageable, and good grades are possible.",
  },
  {
    course: "War and Peace in West Asia",
    course_id: "",
    professor: "Tabraz",
    review: "Attend class and take notes; getting S, A, or B is manageable.",
  },
  {
    course: "Climate Economics",
    course_id: "HS5760",
    professor: "Santosh Kumar Sahu",
    review: "Endsem is 60 marks, attempt any 6 out of 10 questions. Easy if you study slides. Overall an easy SAB course; submit assignments on time for a safe B grade.",
  },
  {
    course: "Technology and Sustainable Development",
    course_id: "HS5060",
    professor: "Krishna Malakar",
    review: "Good course. Midsem, endsem, and presentation. Easy grading.",
  },
  {
    course: "Fostering Enriching Relationships",
    course_id: "GN6109",
    professor: "",
    review: "Sometimes boring, but you can still get an S. Grading depends on the TA.",
  },
  {
    course: "Flow of Performance",
    course_id: "GN61200",
    professor: "Prasana",
    review: "You need to attend every class. S is possible; worst case A.",
  },
  {
    course: "Leadership Lessons from IKS",
    course_id: "GN5008",
    professor: "",
    review: "Very chill course. Easy S.",
  },
  {
    course: "Principles of Economics",
    course_id: "HS3002A",
    professor: "Krishna Malakar",
    review: "Chill course. Slides are enough to score well; quizzes are easy, endsem needs a day of prep, and grading is lenient though teaching is basic.",
  },
];

export default function Electives() {
  const [reviews, setReviews] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form states
  const [courseName, setCourseName] = useState("");
  const [courseId, setCourseId] = useState("");
  const [professor, setProfessor] = useState("");
  const [description, setDescription] = useState("");

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

  return (
    <Layout>
      <article className="feature-panel is-visible">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Elective reviews</p>
            <h1>Find courses by workload, grading, and teaching style.</h1>
          </div>
          <button className="ghost-button" type="button" onClick={() => setIsModalOpen(true)}>
            Add Review
          </button>
        </div>

        <div className="review-layout">
          <aside className="filters" aria-label="Elective filters">
            <label>
              Course name or ID
              <input
                id="courseSearch"
                type="search"
                value={searchQuery}
                onChange={handleSearch}
                list="courseSuggestions"
                placeholder="Search HS5708, economics..."
                autoComplete="off"
              />
            </label>
            <datalist id="courseSuggestions">
              {suggestions.map((item, idx) => (
                <option key={idx} value={item} />
              ))}
            </datalist>
            <p className="result-count" aria-live="polite">
              {loading ? "Loading reviews..." : `${filteredReviews.length} course${filteredReviews.length === 1 ? "" : "s"} found`}
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
