import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  const handleFeedbackClick = (e) => {
    e.preventDefault();
    navigator.clipboard.writeText("harshith231163@gmail.com")
      .then(() => {
        addToast("Email copied! Mail your suggestions to the copied email.", "success");
      })
      .catch((err) => {
        console.error("Clipboard copy failed:", err);
      });
  };

  const getSubLabel = () => {
    switch (location.pathname) {
      case "/electives":
        return "Elective Reviews";
      case "/cgpa":
        return "CGPA Calculator";
      case "/placements":
        return "Placements & Internships";
      case "/departments":
        return "Department Resources";
      case "/events":
        return "Event Tracker";
      default:
        return "Main page";
    }
  };

  const isToolPage = location.pathname !== "/";

  // Redirect to home if user is not logged in (unless mock bypass is active)
  React.useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  if (!user) {
    return null; // Don't render layout if not authenticated
  }

  return (
    <div className={`app-shell ${isToolPage ? "tool-page" : ""}`}>
      <header className="topbar">
        <Link className="brand" to="/" aria-label="Harbour main page">
          <span className="brand-mark" aria-hidden="true">H</span>
          <span>
            <strong>Harbour</strong>
            <small>{getSubLabel()}</small>
          </span>
        </Link>

        {isToolPage && (
          <nav className="topnav" aria-label="Tool navigation">
            <Link className={location.pathname === "/electives" ? "is-current" : ""} to="/electives">
              Electives
            </Link>
            <Link className={location.pathname === "/cgpa" ? "is-current" : ""} to="/cgpa">
              CGPA
            </Link>
            <Link className={location.pathname === "/placements" ? "is-current" : ""} to="/placements">
              Placements & Internships
            </Link>
            <Link className={location.pathname === "/departments" ? "is-current" : ""} to="/departments">
              Department Resources
            </Link>
            <Link className={location.pathname === "/events" ? "is-current" : ""} to="/events">
              Events
            </Link>
          </nav>
        )}

        <div id="userMenu" style={{ display: "flex", alignItems: "center", gap: "14px", marginLeft: "auto" }}>
          <img
            id="userAvatar"
            src={user.user_metadata?.avatar_url || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"}
            alt="User avatar"
            style={{ width: "32px", height: "32px", borderRadius: "50%", border: "1px solid var(--line)" }}
          />
          <span
            id="userName"
            style={{ fontWeight: 800, fontSize: "0.9rem", color: "var(--body)", display: "inline-flex", whiteSpace: "nowrap" }}
          >
            {user.user_metadata?.full_name || "Student"}
          </span>
          <button
            id="signOutBtn"
            className="ghost-button secondary compact"
            type="button"
            onClick={logout}
            style={{ minHeight: "32px", padding: "0 12px", fontSize: "0.82rem", borderRadius: "6px", cursor: "pointer" }}
          >
            Sign Out
          </button>
        </div>
      </header>

      <main className={isToolPage ? "tool-page-main" : ""}>{children}</main>
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
    </div>
  );
}
