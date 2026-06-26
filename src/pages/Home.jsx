import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";
import { useToast } from "../context/ToastContext";

export default function Home() {
  const { user, loginWithGoogle, loading } = useAuth();
  const { addToast } = useToast();

  const handleFeedbackClick = (e) => {
    e.preventDefault();
    navigator.clipboard.writeText("hitman26457@gmail.com")
      .then(() => {
        addToast("Email copied! Mail your suggestions to the copied email.", "success");
      })
      .catch((err) => {
        console.error("Clipboard copy failed:", err);
      });
  };
  const [authError, setAuthError] = useState("");

  const handleLoginClick = async () => {
    try {
      setAuthError("");
      await loginWithGoogle();
    } catch (err) {
      setAuthError(err.message || "OAuth Redirect Failed");
    }
  };

  if (loading) {
    return (
      <div style={{ display: "grid", placeItems: "center", minHeight: "100vh", color: "var(--body)" }}>
        <p>Loading application session...</p>
      </div>
    );
  }

  // 1. RENDER LANDING PAGE IF NOT LOGGED IN
  if (!user) {
    return (
      <section className="home-screen" id="home" aria-labelledby="homeTitle">
        <header className="home-nav" aria-label="Authentication options">
          <a className="brand brand-on-home" href="#home" aria-label="Harbour home">
            <span className="brand-mark" aria-hidden="true">H</span>
            <span>
              <strong>Harbour</strong>
            </span>
          </a>

          <div className="auth-actions" aria-label="Student portal access">
            <button className="primary-button compact" type="button" onClick={handleLoginClick}>
              Student Log In
            </button>
          </div>
        </header>

        <main className="app-shell" style={{ paddingTop: "0px" }}>
          <section className="main-menu" id="toolHome" aria-labelledby="homeTitle" style={{ minHeight: "auto", paddingTop: "20px" }}>
            <div className="main-menu-copy">
              <h1 id="homeTitle">Simplifying your student life.</h1>
              <p className="intro" style={{ marginBottom: "24px", fontStyle: "italic" }}>
                "We are what we repeatedly do. Excellence, then, is not an act, but a habit." — Aristotle
              </p>
              {authError && (
                <p style={{ color: "var(--maroon)", fontSize: "0.9rem", fontWeight: 800, marginBottom: "20px" }}>
                  {authError}
                </p>
              )}
            </div>

            <section className="tool-grid" aria-label="Student portal options">
              <div className="tool-card" onClick={handleLoginClick} style={{ cursor: "pointer" }}>
                <span className="tool-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" role="img">
                    <path d="M5 4.5h9a3 3 0 0 1 3 3v12H8a3 3 0 0 0-3 3v-18Z" />
                    <path d="M17 7.5h2a2 2 0 0 1 2 2v10H8" />
                    <path d="M8 8h5M8 12h6" />
                  </svg>
                </span>
                <span>
                  <strong>Elective Reviews</strong>
                  <small>Course ratings, workload notes, faculty feedback</small>
                </span>
              </div>

              <div className="tool-card" onClick={handleLoginClick} style={{ cursor: "pointer" }}>
                <span className="tool-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" role="img">
                    <path d="M4 5h16v14H4z" />
                    <path d="M8 9h.01M12 9h.01M16 9h.01M8 13h.01M12 13h.01M16 13h.01M8 17h8" />
                  </svg>
                </span>
                <span>
                  <strong>CGPA Calculator</strong>
                  <small>Semester credits, SGPA inputs, projected CGPA</small>
                </span>
              </div>

              <div className="tool-card" onClick={handleLoginClick} style={{ cursor: "pointer" }}>
                <span className="tool-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" role="img">
                    <path d="M10 6h4a2 2 0 0 1 2 2v1H8V8a2 2 0 0 1 2-2Z" />
                    <path d="M4 9h16v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9Z" />
                    <path d="M9 14h6" />
                  </svg>
                </span>
                <span>
                  <strong>Placement Resources</strong>
                  <small>Company prep, aptitude sets, interview archives</small>
                </span>
              </div>

              <div className="tool-card" onClick={handleLoginClick} style={{ cursor: "pointer" }}>
                <span className="tool-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" role="img">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  </svg>
                </span>
                <span>
                  <strong>Department Resources</strong>
                  <small>Branch-specific core materials, drive folders</small>
                </span>
              </div>

              <div className="tool-card" onClick={handleLoginClick} style={{ cursor: "pointer" }}>
                <span className="tool-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" role="img">
                    <path d="M7 3v3M17 3v3M4 8h16" />
                    <path d="M6 5h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" />
                    <path d="M8 12h3M8 16h6" />
                  </svg>
                </span>
                <span>
                  <strong>Event Tracker</strong>
                  <small>Academic dates, clubs, deadlines, reminders</small>
                </span>
              </div>
            </section>
          </section>
        </main>
        <footer style={{ marginTop: "40px", padding: "16px 0", textAlign: "center", borderTop: "1px solid var(--line)" }}>
          <a 
            href="#" 
            onClick={handleFeedbackClick}
            style={{ fontSize: "0.82rem", color: "var(--muted)", textDecoration: "none", fontWeight: "600", transition: "color 150ms" }}
            onMouseEnter={(e) => e.target.style.color = "var(--ink)"}
            onMouseLeave={(e) => e.target.style.color = "var(--muted)"}
          >
            Share your feedback and suggestions
          </a>
        </footer>
      </section>
    );
  }

  // 2. RENDER LOGGED-IN PORTAL DASHBOARD
  return (
    <Layout>
      <section className="main-menu" id="toolHome" aria-labelledby="mainMenuTitle">
        <div className="main-menu-copy">
          <p className="eyebrow">Welcome, {user?.user_metadata?.full_name?.split(" ")[0] || "Student"}</p>
          <h1 id="mainMenuTitle">Making student life easier.</h1>
          <p className="intro" style={{ marginBottom: "28px", fontStyle: "italic", fontSize: "0.95rem", color: "var(--muted)" }}>
            "Details make perfection, and perfection is not a detail." — Leonardo da Vinci
          </p>
        </div>

        <section className="tool-grid" aria-label="Student portal options">
          <Link className="tool-card" to="/electives">
            <span className="tool-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" role="img">
                <path d="M5 4.5h9a3 3 0 0 1 3 3v12H8a3 3 0 0 0-3 3v-18Z" />
                <path d="M17 7.5h2a2 2 0 0 1 2 2v10H8" />
                <path d="M8 8h5M8 12h6" />
              </svg>
            </span>
            <span>
              <strong>Elective Reviews</strong>
              <small>Course ratings, workload notes, faculty feedback</small>
            </span>
          </Link>

          <Link className="tool-card" to="/cgpa">
            <span className="tool-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" role="img">
                <path d="M4 5h16v14H4z" />
                <path d="M8 9h.01M12 9h.01M16 9h.01M8 13h.01M12 13h.01M16 13h.01M8 17h8" />
              </svg>
            </span>
            <span>
              <strong>CGPA Calculator</strong>
              <small>Semester credits, SGPA inputs, projected CGPA</small>
            </span>
          </Link>

          <Link className="tool-card" to="/placements">
            <span className="tool-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" role="img">
                <path d="M10 6h4a2 2 0 0 1 2 2v1H8V8a2 2 0 0 1 2-2Z" />
                <path d="M4 9h16v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9Z" />
                <path d="M9 14h6" />
              </svg>
            </span>
            <span>
              <strong>Placement Resources</strong>
              <small>Company prep, aptitude sets, interview archives</small>
            </span>
          </Link>

          <Link className="tool-card" to="/departments">
            <span className="tool-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" role="img">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            </span>
            <span>
              <strong>Department Resources</strong>
              <small>Branch-specific core materials, drive folders</small>
            </span>
          </Link>

          <Link className="tool-card" to="/events">
            <span className="tool-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" role="img">
                <path d="M7 3v3M17 3v3M4 8h16" />
                <path d="M6 5h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" />
                <path d="M8 12h3M8 16h6" />
              </svg>
            </span>
            <span>
              <strong>Event Tracker</strong>
              <small>Academic dates, clubs, deadlines, reminders</small>
            </span>
          </Link>
        </section>
      </section>
    </Layout>
  );
}
