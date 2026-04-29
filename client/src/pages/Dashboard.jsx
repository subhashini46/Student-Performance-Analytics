import {
  AlertTriangle,
  BarChart3,
  BookOpenCheck,
  GraduationCap,
  LineChart,
  LogOut,
  Moon,
  Plus,
  Save,
  Sun,
  Target,
  Trash2,
  TrendingUp,
  UserRound
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { apiRequest } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import {
  assessmentFields,
  buildRecommendations,
  clampNumber,
  createSubject,
  formatSigned,
  getAnalytics,
  gradePoint,
  riskClass,
  riskLabel
} from "../data/analytics.js";

const navItems = [
  { key: "overview", label: "Overview", icon: BarChart3 },
  { key: "marks", label: "Marks", icon: BookOpenCheck },
  { key: "insights", label: "Insights", icon: AlertTriangle },
  { key: "profile", label: "Profile", icon: UserRound }
];

export default function Dashboard() {
  const { token, user, logout } = useAuth();
  const [theme, setTheme] = useState(() => localStorage.getItem("student_analytics_theme") || "light");
  const [activeView, setActiveView] = useState("overview");
  const [profile, setProfile] = useState({ termName: "Semester 2", attendance: 88, targetGpa: 8 });
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("student_analytics_theme", theme);
  }, [theme]);

  useEffect(() => {
    async function loadPerformance() {
      setLoading(true);
      setError("");
      try {
        const data = await apiRequest("/performance", { token });
        setProfile(data.profile);
        setSubjects(data.subjects);
        setSelectedSubjectId(data.subjects[0]?.id || "");
      } catch (err) {
        if (err.status === 401) {
          logout();
          return;
        }
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadPerformance();
  }, [token]);

  const analytics = useMemo(() => getAnalytics(profile, subjects), [profile, subjects]);
  const recommendations = useMemo(() => buildRecommendations(profile, analytics), [profile, analytics]);
  const selectedSubject = analytics.subjects.find((subject) => subject.id === selectedSubjectId) || analytics.subjects[0];
  const trendData = selectedSubject
    ? assessmentFields.map((field) => ({
        name: field.label,
        mark: clampNumber(selectedSubject[field.key])
      }))
    : [];
  const subjectChartData = analytics.subjects.map((subject) => ({
    name: subject.name.length > 12 ? `${subject.name.slice(0, 11)}.` : subject.name,
    average: subject.average,
    risk: subject.riskScore
  }));

  function updateProfile(field, value) {
    setProfile((current) => ({
      ...current,
      [field]: field === "termName" ? value : clampNumber(value, field === "targetGpa" ? 0 : 0, field === "targetGpa" ? 10 : 100)
    }));
    setStatus("Unsaved changes");
  }

  function updateSubject(id, field, value) {
    setSubjects((current) =>
      current.map((subject) => {
        if (subject.id !== id) return subject;
        if (field === "name") return { ...subject, name: value };
        if (field === "credit") return { ...subject, credit: clampNumber(value, 1, 6) };
        return { ...subject, [field]: clampNumber(value) };
      })
    );
    setStatus("Unsaved changes");
  }

  function addSubject() {
    const subject = createSubject();
    setSubjects((current) => [...current, subject]);
    setSelectedSubjectId(subject.id);
    setActiveView("marks");
    setStatus("Unsaved changes");
  }

  function removeSubject(id) {
    setSubjects((current) => current.filter((subject) => subject.id !== id));
    setStatus("Unsaved changes");
  }

  async function savePerformance() {
    setSaving(true);
    setError("");
    try {
      const data = await apiRequest("/performance", {
        method: "PUT",
        token,
        body: { profile, subjects }
      });
      setProfile(data.profile);
      setSubjects(data.subjects);
      setStatus("Saved");
      window.setTimeout(() => setStatus(""), 1400);
    } catch (err) {
      if (err.status === 401) {
        logout();
        return;
      }
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  function handleLogout() {
    logout();
  }

  if (loading) {
    return (
      <main className="loading-screen">
        <GraduationCap size={34} />
        <p>Loading dashboard...</p>
      </main>
    );
  }

  return (
    <div className="dashboard-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="brand-icon">
            <GraduationCap size={26} />
          </span>
          <div>
            <strong>Student Analytics</strong>
            <span>{profile.termName}</span>
          </div>
        </div>

        <nav className="sidebar-nav" aria-label="Dashboard views">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                className={activeView === item.key ? "active" : ""}
                type="button"
                onClick={() => setActiveView(item.key)}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button className="ghost-button" type="button" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
            {theme === "dark" ? "Light" : "Dark"}
          </button>
          <button className="ghost-button danger" type="button" onClick={handleLogout}>
            <LogOut size={17} />
            Logout
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="topbar">
          <div>
            <span className="eyebrow">Academic risk monitor</span>
            <h1>{user?.name || "Student"}</h1>
          </div>
          <div className="topbar-actions">
            {status && <span className="save-status">{status}</span>}
            <button className="secondary-action" type="button" onClick={addSubject}>
              <Plus size={18} />
              Subject
            </button>
            <button className="primary-action compact" type="button" onClick={savePerformance} disabled={saving}>
              <Save size={18} />
              {saving ? "Saving" : "Save"}
            </button>
          </div>
        </header>

        {error && (
          <div className="form-alert dashboard-alert" role="alert">
            <AlertTriangle size={18} />
            {error}
          </div>
        )}

        {activeView === "overview" && (
          <section className="view-stack">
            <div className="metric-grid">
              <MetricCard label="GPA" value={analytics.gpa.toFixed(2)} detail={`Target ${profile.targetGpa.toFixed(1)}`} tone="blue" />
              <MetricCard label="Average" value={`${analytics.average}%`} detail={`${analytics.subjects.length} subjects tracked`} tone="teal" />
              <MetricCard label="Weak subject" value={analytics.weak?.name || "-"} detail={analytics.weak ? `${analytics.weak.average}% average` : "No data"} tone="amber" />
              <MetricCard label="Risk" value={riskLabel(analytics.globalRisk)} detail={`${analytics.globalRisk}% signal`} tone="rose" />
            </div>

            <div className="chart-grid">
              <section className="panel">
                <div className="panel-heading">
                  <div>
                    <h2>Performance Trend</h2>
                    <p>{selectedSubject?.name || "No subject selected"}</p>
                  </div>
                  <select value={selectedSubject?.id || ""} onChange={(event) => setSelectedSubjectId(event.target.value)}>
                    {analytics.subjects.map((subject) => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="chart-box">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={trendData} margin={{ top: 16, right: 20, left: -18, bottom: 4 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" />
                      <XAxis dataKey="name" stroke="var(--muted)" fontSize={12} />
                      <YAxis stroke="var(--muted)" fontSize={12} domain={[0, 100]} />
                      <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 8 }} />
                      <Line type="monotone" dataKey="mark" stroke="var(--blue)" strokeWidth={3} dot={{ r: 5 }} />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
              </section>

              <section className="panel">
                <div className="panel-heading">
                  <div>
                    <h2>Subject Strength</h2>
                    <p>Average marks and risk signal</p>
                  </div>
                </div>
                <div className="chart-box">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={subjectChartData} margin={{ top: 16, right: 18, left: -20, bottom: 4 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" />
                      <XAxis dataKey="name" stroke="var(--muted)" fontSize={12} />
                      <YAxis stroke="var(--muted)" fontSize={12} domain={[0, 100]} />
                      <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: 8 }} />
                      <Bar dataKey="average" fill="var(--teal)" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="risk" fill="var(--rose)" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </section>
            </div>
          </section>
        )}

        {activeView === "marks" && (
          <section className="panel">
            <div className="panel-heading">
              <div>
                <h2>Marks Tracking</h2>
                <p>Edit marks, credits, and subject names.</p>
              </div>
              <button className="secondary-action" type="button" onClick={addSubject}>
                <Plus size={18} />
                Add Subject
              </button>
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Test 1</th>
                    <th>Test 2</th>
                    <th>Midterm</th>
                    <th>Final</th>
                    <th>Credit</th>
                    <th>Average</th>
                    <th>Grade Point</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.subjects.map((subject) => (
                    <tr key={subject.id}>
                      <td>
                        <input value={subject.name} onChange={(event) => updateSubject(subject.id, "name", event.target.value)} />
                      </td>
                      {assessmentFields.map((field) => (
                        <td key={field.key}>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={subject[field.key]}
                            onChange={(event) => updateSubject(subject.id, field.key, event.target.value)}
                          />
                        </td>
                      ))}
                      <td>
                        <input
                          type="number"
                          min="1"
                          max="6"
                          value={subject.credit}
                          onChange={(event) => updateSubject(subject.id, "credit", event.target.value)}
                        />
                      </td>
                      <td className="strong-cell">{subject.average}%</td>
                      <td>{gradePoint(subject.average)}</td>
                      <td>
                        <button className="icon-only danger" type="button" onClick={() => removeSubject(subject.id)} aria-label={`Remove ${subject.name}`}>
                          <Trash2 size={17} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeView === "insights" && (
          <section className="insights-grid">
            <div className="panel">
              <div className="panel-heading">
                <div>
                  <h2>Risk Prediction</h2>
                  <p>Current probability signal from scores and attendance.</p>
                </div>
                <span className={`risk-badge ${riskClass(analytics.globalRisk)}`}>{riskLabel(analytics.globalRisk)}</span>
              </div>
              <div className="risk-meter" aria-hidden="true">
                <span style={{ width: `${analytics.globalRisk}%` }} />
              </div>
              <div className="risk-list">
                {(analytics.riskySubjects.length ? analytics.riskySubjects : analytics.subjects.slice(0, 3)).map((subject) => (
                  <article className={`risk-item ${riskClass(subject.riskScore)}`} key={subject.id}>
                    <strong>{subject.name}</strong>
                    <p>
                      {riskLabel(subject.riskScore)} risk, {subject.average}% average, {formatSigned(subject.trend)} trend.
                    </p>
                  </article>
                ))}
              </div>
            </div>

            <div className="panel">
              <div className="panel-heading">
                <div>
                  <h2>Study Recommendations</h2>
                  <p>Generated from weak subjects and score movement.</p>
                </div>
                <Target size={22} />
              </div>
              <div className="recommendation-list">
                {recommendations.map((item) => (
                  <article className={`recommendation-item ${item.priority}`} key={item.title}>
                    <strong>{item.title}</strong>
                    <p>{item.copy}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {activeView === "profile" && (
          <section className="profile-grid">
            <div className="panel">
              <div className="panel-heading">
                <div>
                  <h2>Academic Profile</h2>
                  <p>Set the term, attendance, and GPA target.</p>
                </div>
                <UserRound size={22} />
              </div>
              <div className="profile-form">
                <label>
                  Term
                  <input value={profile.termName} onChange={(event) => updateProfile("termName", event.target.value)} />
                </label>
                <label>
                  Attendance %
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={profile.attendance}
                    onChange={(event) => updateProfile("attendance", event.target.value)}
                  />
                </label>
                <label>
                  Target GPA
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    value={profile.targetGpa}
                    onChange={(event) => updateProfile("targetGpa", event.target.value)}
                  />
                </label>
              </div>
            </div>

            <div className="panel compact-summary">
              <TrendingUp size={24} />
              <h2>{analytics.averageTrend > 4 ? "Improving" : analytics.averageTrend < -4 ? "Dropping" : "Stable"}</h2>
              <p>{formatSigned(analytics.averageTrend)} point average movement from Test 1 to Final.</p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function MetricCard({ label, value, detail, tone }) {
  return (
    <article className={`metric-card ${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <p>{detail}</p>
    </article>
  );
}
