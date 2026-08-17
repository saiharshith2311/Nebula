export const GRADE_SCALE = {
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

export function getGradePoints(grade) {
  const match = GRADE_SCALE.grades.find(([value]) => value === grade);
  return match ? match[1] : 0;
}

export function calculateCgpa({ currentCgpa, earnedCredits, courses = [] }) {
  let totalCredits = 0;
  let weightedScore = 0;

  courses.forEach((course) => {
    const credits = Number(course.creditHours ?? course.credits);
    const grade = course.grade;
    if (!Number.isFinite(credits) || credits <= 0 || !grade) return;
    totalCredits += credits;
    weightedScore += credits * getGradePoints(String(grade).toUpperCase());
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
    projectedCgpa = Math.min(
      (current * earned + semesterGpa * totalCredits) / (earned + totalCredits),
      GRADE_SCALE.max
    );
  } else if (Number.isFinite(current) && current > 0 && totalCredits === 0) {
    projectedCgpa = Math.min(current, GRADE_SCALE.max);
  } else {
    projectedCgpa = semesterGpa;
  }

  return {
    semesterGpa: Number(semesterGpa.toFixed(2)),
    semesterCredits: totalCredits,
    projectedCgpa: Number(projectedCgpa.toFixed(2)),
  };
}

export const CGPA_FORMULA_TEXT = `IIT Madras 10-point scale used on Nebula: S=10, A=9, B=8, C=7, D=6, E=5, F=0.
Semester GPA = sum(credits × grade points) / semester credits.
Projected CGPA = (current CGPA × completed credits + semester GPA × semester credits) / (completed + semester credits).`;
