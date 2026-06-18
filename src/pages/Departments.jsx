import React from "react";
import Layout from "../components/Layout";

const DEPARTMENTS_DATA = [
  {
    category: "Aerospace",
    title: "Aerospace Engineering Drive",
    links: [
      { text: "Open Course & Placements Drive", url: "https://drive.google.com/drive/folders/1X9-h5PiDaVL14SUWf4z5uP4dph05j3Rt" }
    ]
  },
  {
    category: "Biotechnology",
    title: "Biotech & Biosciences Drive",
    links: [
      { text: "Open Biotech Academic Drive", url: "https://drive.google.com/folderview?id=1_bS2WpgeFRYFLOA7ErUccq7mR__jJp6i" }
    ]
  },
  {
    category: "Chemical",
    title: "Chemical Engineering Drive",
    links: [
      { text: "Open CH Academic Drive", url: "https://drive.google.com/drive/folders/1JxLrk-8g0IFqJSSrCyw_eGhHZashHrmV" },
      { text: "View CH Electives Sheet", url: "https://docs.google.com/spreadsheets/d/1QbBlRX8bfRjlJWq71QKAKX_jsNOHMfJyOJMW_QICbxw/edit?usp=drivesdk" }
    ]
  },
  {
    category: "Civil",
    title: "Civil Engineering Drive",
    links: [
      { text: "Open Civil Academic Drive", url: "https://drive.google.com/drive/u/1/folders/1BpH187QdGFyarf173CnKwEw-uiJlTkZi" }
    ]
  },
  {
    category: "Computer Science",
    title: "CSE Semester Papers & Notes",
    links: [
      { text: "Open CSE Previous Papers", url: "https://drive.google.com/drive/folders/14ySGuB8Tq-yYExVX8oLGkvZRUrMgDJWt" }
    ]
  },
  {
    category: "Electrical",
    title: "Electrical Engineering Drive",
    links: [
      { text: "Open Electrical 2023 Drive", url: "https://drive.google.com/drive/folders/1Us7SI2eLxUbF-zPi9fgX1I3q3wjR3Vcg" }
    ]
  },
  {
    category: "Design",
    title: "Engineering Design Drive",
    links: [
      { text: "Open Design ED23 Drive", url: "https://drive.google.com/drive/folders/1FWbDKzhUNTEO0KoC2z9ui4RDULVeVnLM?usp=drive_link" }
    ]
  },
  {
    category: "Mechanical",
    title: "Mechanical Engineering Drive",
    links: [
      { text: "Open Mechanical Core Drive", url: "https://drive.google.com/drive/folders/178uIbQvjF35hEMZZCUyBVFxIhXQ7UzDJ" },
      { text: "Open Mechanical 2024 Drive", url: "https://drive.google.com/drive/folders/1Us7SI2eLxUbF-zPi9fgX1I3q3wjR3Vcg" }
    ]
  },
  {
    category: "Metallurgy",
    title: "MME Academic Drive",
    links: [
      { text: "Open Metallurgy Drive", url: "https://drive.google.com/drive/folders/1TEYRCZJOoyi2SFP0kWobEe1S-gTGY4YS?usp=sharing" }
    ]
  },
  {
    category: "Naval Architecture",
    title: "Naval Arch & Ocean Engineering",
    links: [
      { text: "Open Naval Academic Drive", url: "https://drive.google.com/drive/folders/1uOsW1wfX_8NU2W7X0jDUqF8Ix4twJKgO?usp=sharing" },
      { text: "View NAOE Linktree Portal", url: "https://linktr.ee/naoe_iitm" }
    ]
  }
];

export default function Departments() {
  return (
    <Layout>
      <article className="feature-panel is-visible">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Academic Semesters</p>
            <h1>Curated study materials, slides, and files sorted by department.</h1>
          </div>
        </div>

        <div className="resource-grid" id="departmentGrid" style={{ display: "grid", gap: "20px", padding: "28px" }}>
          {DEPARTMENTS_DATA.map((dept, index) => (
            <article key={index} className="resource-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "170px" }}>
              <div>
                <span style={{ display: "block", marginBottom: "12px", color: "var(--maroon)", fontSize: "0.78rem", fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {dept.category}
                </span>
                <strong style={{ display: "block", marginBottom: "8px", fontSize: "1.15rem", color: "var(--ink)" }}>
                  {dept.title}
                </strong>
              </div>
              
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "16px" }}>
                {dept.links.map((link, lIdx) => (
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
          ))}
        </div>
      </article>
    </Layout>
  );
}
