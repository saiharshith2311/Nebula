import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";

export default function Home() {
  const { user, loginWithGoogle, loading } = useAuth();
  const [reviewCount, setReviewCount] = useState(11); // Fallback seed count
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch("/api/reviews");
        if (res.ok) {
          const reviews = await res.json();
          if (reviews && reviews.length > 0) {
            setReviewCount(reviews.length);
          }
        }
      } catch (err) {
        console.error("Failed to load review stats:", err);
      }
    }
    loadStats();
  }, []);

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
          <a className="brand brand-on-home" href="#home" aria-label="Campus Compass home">
            <span className="brand-mark" aria-hidden="true">CC</span>
            <span>
              <strong>Campus Compass</strong>
              <small>University student portal</small>
            </span>
          </a>

          <div className="auth-actions" aria-label="Student portal access">
            <button className="primary-button compact" type="button" onClick={handleLoginClick}>
              Student Log In
            </button>
          </div>
        </header>

        <div className="home-layout">
          <div className="home-copy">
            <p className="eyebrow">Academic services desk</p>
            <h1 id="homeTitle">Simplifying your campus planning.</h1>
            <p className="intro">
              Access elective reviews, CGPA planning, placement resources, and event tracking from a university-friendly dashboard.
            </p>

            <div className="home-actions">
              <button className="primary-button" type="button" onClick={handleLoginClick}>
                Student Log In
              </button>
            </div>
          </div>

          <aside className="auth-cover" aria-label="Dummy sign in panel">
            <div className="auth-card">
              <div>
                <p className="eyebrow">Secure Campus Access</p>
                <h2 id="authTitle">IIT Madras Student Portal</h2>
                <p id="authHint">Authorized access via Google accounts.</p>
              </div>

              {authError && (
                <p id="authError" style={{ color: "var(--maroon)", fontSize: "0.85rem", fontWeight: 800, marginTop: "5px" }}>
                  {authError}
                </p>
              )}

              <div style={{ marginTop: "10px" }}>
                <button
                  className="primary-button full"
                  type="button"
                  id="googleSignInBtn"
                  onClick={handleLoginClick}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "12px",
                    fontWeight: 900,
                    background: "#ffffff",
                    color: "#1e1e1e",
                    border: "1px solid #dadce0",
                    width: "100%",
                  }}
                >
                  <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Sign in with Google
                </button>
              </div>
            </div>

            <div className="campus-notes" aria-label="Portal highlights">
              <div>
                <strong>{reviewCount}</strong>
                <span>Elective reviews</span>
              </div>
              <div>
                <strong>4</strong>
                <span>Student tools</span>
              </div>
            </div>
          </aside>
        </div>
      </section>
    );
  }

  // 2. RENDER LOGGED-IN PORTAL DASHBOARD
  return (
    <Layout>
      <section className="main-menu" id="toolHome" aria-labelledby="mainMenuTitle">
        <div className="main-menu-copy">
          <p className="eyebrow">Main page</p>
          <h1 id="mainMenuTitle">Select a campus tool</h1>
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
