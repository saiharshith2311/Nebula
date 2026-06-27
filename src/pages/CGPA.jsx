import React, { useState, useMemo } from "react";
import Layout from "../components/Layout";

const GRADE_SCALE = {
  max: 10,
  grades: [
    ["S", 10],
    ["A", 9],
    ["B", 8],
    ["C", 7],
    ["D", 6],
    ["E", 5],
    ["F", 0],
  ],
};

export default function CGPA() {
  const [currentCgpa, setCurrentCgpa] = useState("");
  const [earnedCredits, setEarnedCredits] = useState("");
  const [courses, setCourses] = useState([
    { id: 1, courseCode: "", creditHours: "3", grade: "" },
    { id: 2, courseCode: "", creditHours: "3", grade: "" },
    { id: 3, courseCode: "", creditHours: "3", grade: "" },
  ]);

  const getGradePoints = (grade) => {
    const match = GRADE_SCALE.grades.find(([value]) => value === grade);
    return match ? match[1] : 0;
  };

  const results = useMemo(() => {
    let totalCredits = 0;
    let weightedScore = 0;

    courses.forEach((course) => {
      const credits = Number(course.creditHours);
      if (!Number.isFinite(credits) || credits <= 0 || !course.grade) {
        return;
      }
      totalCredits += credits;
      weightedScore += credits * getGradePoints(course.grade);
    });

    const semesterGpa = totalCredits > 0 ? weightedScore / totalCredits : 0;

    const current = Number(currentCgpa);
    const earned = Number(earnedCredits);

    let projectedCgpa = 0;

    if (
      Number.isFinite(current) &&
      Number.isFinite(earned) &&
      current > 0 &&
      earned > 0 &&
      totalCredits > 0
    ) {
      const projected = (current * earned + semesterGpa * totalCredits) / (earned + totalCredits);
      projectedCgpa = Math.min(projected, GRADE_SCALE.max);
    } else if (Number.isFinite(current) && current > 0 && totalCredits === 0) {
      projectedCgpa = Math.min(current, GRADE_SCALE.max);
    } else {
      projectedCgpa = semesterGpa;
    }

    return {
      semesterGpa,
      semesterCredits: totalCredits,
      projectedCgpa,
    };
  }, [courses, currentCgpa, earnedCredits]);

  const handleCourseChange = (id, field, value) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const addCourseRow = () => {
    const nextId = courses.length > 0 ? Math.max(...courses.map((c) => c.id)) + 1 : 1;
    setCourses((prev) => [...prev, { id: nextId, courseCode: "", creditHours: "3", grade: "" }]);
  };

  const removeCourseRow = (id) => {
    setCourses((prev) => {
      const filtered = prev.filter((c) => c.id !== id);
      if (filtered.length === 0) {
        return [{ id: 1, courseCode: "", creditHours: "3", grade: "" }];
      }
      return filtered;
    });
  };

  const handleReset = () => {
    setCurrentCgpa("");
    setEarnedCredits("");
    setCourses([
      { id: 1, courseCode: "", creditHours: "3", grade: "" },
      { id: 2, courseCode: "", creditHours: "3", grade: "" },
      { id: 3, courseCode: "", creditHours: "3", grade: "" },
    ]);
  };

  const hasInput = !!(currentCgpa || earnedCredits || courses.some((c) => c.grade));

  return (
    <Layout>
      <article className="feature-panel is-visible">
        <div className="panel-header" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "16px" }}>
          <div>
            <p className="eyebrow">CGPA calculator</p>
            <h1>"Measure what is measurable, and make measurable what is not so." — Galileo Galilei</h1>
          </div>
          {hasInput && (
            <div className="cgpa-score" aria-live="polite" style={{ alignSelf: "flex-start", marginTop: "8px" }}>
              <span>CGPA</span>
              <strong id="cgpaValue">{results.projectedCgpa.toFixed(2)}</strong>
            </div>
          )}
        </div>

        <div className="cgpa-workspace">
          <div className="calculator-grid" style={{ gridTemplateColumns: "repeat(2, minmax(180px, 1fr))" }}>
            <label>
              Current CGPA
              <input
                id="currentCgpaInput"
                type="number"
                min="0"
                max={GRADE_SCALE.max}
                step="0.01"
                value={currentCgpa}
                onChange={(e) => setCurrentCgpa(e.target.value)}
                placeholder="8.20"
              />
            </label>
            <label>
              Completed credits
              <input
                id="earnedCreditsInput"
                type="number"
                min="0"
                step="1"
                value={earnedCredits}
                onChange={(e) => setEarnedCredits(e.target.value)}
                placeholder="96"
              />
            </label>
          </div>

          <div className="course-calculator" aria-label="Course grade calculator">
            <div className="course-table-head">
              <span>Course</span>
              <span>Credits</span>
              <span>Grade</span>
              <span>Action</span>
            </div>
            <div className="course-rows" id="courseRows">
              {courses.map((course) => (
                <div key={course.id} className="course-row" data-course-id={course.id}>
                  <label>
                    Course
                    <input
                      className="course-code"
                      type="text"
                      placeholder="CS101"
                      value={course.courseCode}
                      onChange={(e) => handleCourseChange(course.id, "courseCode", e.target.value)}
                    />
                  </label>
                  <label>
                    Credits
                    <input
                      className="course-credit"
                      type="number"
                      min="0"
                      max="6"
                      step="1"
                      placeholder="3"
                      value={course.creditHours}
                      onChange={(e) => handleCourseChange(course.id, "creditHours", e.target.value)}
                    />
                  </label>
                  <label>
                    Grade
                    <select
                      className="course-grade"
                      value={course.grade}
                      onChange={(e) => handleCourseChange(course.id, "grade", e.target.value)}
                    >
                      <option value="">--</option>
                      {GRADE_SCALE.grades.map(([grade, val]) => (
                        <option key={grade} value={grade}>
                          {grade} ({val})
                        </option>
                      ))}
                    </select>
                  </label>
                  <button
                    className="remove-course"
                    type="button"
                    onClick={() => removeCourseRow(course.id)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="calculator-actions">
            <button className="ghost-button" id="addCourseRow" type="button" onClick={addCourseRow}>
              Add Course
            </button>
            <button className="ghost-button secondary" id="resetCgpa" type="button" onClick={handleReset}>
              Reset
            </button>
          </div>

          {hasInput && (
            <div className="result-grid" aria-live="polite">
              <div>
                <span>Semester GPA</span>
                <strong id="semesterGpaValue">{results.semesterGpa.toFixed(2)}</strong>
              </div>
              <div>
                <span>Semester credits</span>
                <strong id="semesterCreditsValue">{results.semesterCredits}</strong>
              </div>
              <div>
                <span>Projected CGPA</span>
                <strong id="projectedCgpaValue">{results.projectedCgpa.toFixed(2)}</strong>
              </div>
            </div>
          )}
        </div>
      </article>
    </Layout>
  );
}
