export const assessmentFields = [
  { key: "test1", label: "Test 1", weight: 0.15 },
  { key: "test2", label: "Test 2", weight: 0.15 },
  { key: "midterm", label: "Midterm", weight: 0.3 },
  { key: "final", label: "Final", weight: 0.4 }
];

export function createSubject() {
  return {
    id: `subject-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name: "New Subject",
    credit: 3,
    test1: 0,
    test2: 0,
    midterm: 0,
    final: 0
  };
}

export function clampNumber(value, min = 0, max = 100) {
  const next = Number(value);
  if (Number.isNaN(next)) {
    return min;
  }
  return Math.min(max, Math.max(min, next));
}

export function subjectAverage(subject) {
  return Math.round(
    assessmentFields.reduce((sum, item) => {
      return sum + clampNumber(subject[item.key]) * item.weight;
    }, 0)
  );
}

export function gradePoint(mark) {
  if (mark >= 90) return 10;
  if (mark >= 80) return 9;
  if (mark >= 70) return 8;
  if (mark >= 60) return 7;
  if (mark >= 50) return 6;
  if (mark >= 40) return 5;
  return 0;
}

export function subjectRisk(subject, attendance) {
  const average = subjectAverage(subject);
  const recentDrop = Math.max(0, clampNumber(subject.midterm) - clampNumber(subject.final));
  const lowAttendance = Math.max(0, 78 - clampNumber(attendance));
  const lowAverage = Math.max(0, 56 - average) * 1.5;
  const finalPressure = Math.max(0, 45 - clampNumber(subject.final)) * 1.2;

  return Math.round(Math.min(100, lowAverage + finalPressure + recentDrop * 1.1 + lowAttendance * 1.25));
}

export function riskLabel(score) {
  if (score >= 70) return "High";
  if (score >= 40) return "Medium";
  return "Low";
}

export function riskClass(score) {
  return riskLabel(score).toLowerCase();
}

export function formatSigned(value) {
  const rounded = Math.round(value);
  return rounded > 0 ? `+${rounded}` : String(rounded);
}

export function getAnalytics(profile, subjects) {
  const enriched = subjects.map((subject) => {
    const average = subjectAverage(subject);
    return {
      ...subject,
      average,
      trend: clampNumber(subject.final) - clampNumber(subject.test1),
      riskScore: subjectRisk(subject, profile.attendance)
    };
  });

  const totalCredits = enriched.reduce((sum, subject) => sum + clampNumber(subject.credit, 1, 6), 0);
  const weightedPoints = enriched.reduce((sum, subject) => {
    return sum + gradePoint(subject.average) * clampNumber(subject.credit, 1, 6);
  }, 0);
  const average = enriched.length
    ? Math.round(enriched.reduce((sum, subject) => sum + subject.average, 0) / enriched.length)
    : 0;
  const gpa = totalCredits ? weightedPoints / totalCredits : 0;
  const best = [...enriched].sort((a, b) => b.average - a.average)[0];
  const weak = [...enriched].sort((a, b) => a.average - b.average)[0];
  const riskySubjects = enriched
    .filter((subject) => subject.riskScore >= 40 || subject.average < 50)
    .sort((a, b) => b.riskScore - a.riskScore);
  const averageTrend = enriched.length
    ? enriched.reduce((sum, subject) => sum + subject.trend, 0) / enriched.length
    : 0;
  const targetGap = Math.max(0, clampNumber(profile.targetGpa, 0, 10) - gpa);
  const globalRisk = Math.round(
    Math.min(100, Math.max(0, (100 - average) * 0.75 + (100 - profile.attendance) * 0.3 + targetGap * 8))
  );

  return {
    subjects: enriched,
    average,
    gpa,
    best,
    weak,
    riskySubjects,
    averageTrend,
    globalRisk
  };
}

export function buildRecommendations(profile, analytics) {
  if (!analytics.subjects.length) {
    return [
      {
        title: "Add subjects",
        copy: "Create subjects and enter recent marks to generate study recommendations.",
        priority: "medium"
      }
    ];
  }

  const weakSubjects = [...analytics.subjects].sort((a, b) => a.average - b.average).slice(0, 2);
  const fallingSubjects = analytics.subjects
    .filter((subject) => subject.trend < -5)
    .sort((a, b) => a.trend - b.trend);

  const recommendations = weakSubjects.map((subject) => ({
    title: `Repair ${subject.name}`,
    copy: `Focus on the last two assessment mistakes. Target ${Math.min(100, subject.average + 12)}% in the next test.`,
    priority: subject.average < 50 ? "high" : "medium"
  }));

  if (fallingSubjects[0]) {
    recommendations.push({
      title: `Stop the drop in ${fallingSubjects[0].name}`,
      copy: `The score trend is ${formatSigned(fallingSubjects[0].trend)} points. Revise the final-test units first.`,
      priority: "high"
    });
  }

  if (profile.attendance < 82) {
    recommendations.push({
      title: "Raise attendance",
      copy: `Attendance is ${profile.attendance}%. Moving toward 85% lowers the risk signal across every subject.`,
      priority: "medium"
    });
  }

  if (analytics.best) {
    recommendations.push({
      title: `Reuse the ${analytics.best.name} routine`,
      copy: `Apply the revision pattern from the strongest subject to ${weakSubjects[0]?.name || "the weakest subject"}.`,
      priority: "low"
    });
  }

  return recommendations.slice(0, 5);
}
