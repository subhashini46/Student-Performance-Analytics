import { AlertCircle, BarChart3, BookOpenCheck, GraduationCap, LineChart, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function AuthPage({ mode }) {
  const isSignup = mode === "signup";
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isSignup) {
        await signUp(form);
      } else {
        await signIn({ email: form.email, password: form.password });
      }
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  return (
    <main className="auth-page">
      <section className="auth-visual" aria-label="Student analytics preview">
        <div className="auth-brand">
          <span className="brand-icon">
            <GraduationCap size={28} />
          </span>
          <div>
            <strong>Student Performance Analytics</strong>
            <span>Academic risk monitor</span>
          </div>
        </div>

        <div className="preview-panel">
          <div className="preview-row">
            <div>
              <span>GPA</span>
              <strong>8.42</strong>
            </div>
            <div>
              <span>Risk</span>
              <strong className="good-text">Low</strong>
            </div>
            <div>
              <span>Trend</span>
              <strong>+7</strong>
            </div>
          </div>

          <div className="mini-chart" aria-hidden="true">
            <span style={{ height: "48%" }} />
            <span style={{ height: "62%" }} />
            <span style={{ height: "54%" }} />
            <span style={{ height: "78%" }} />
            <span style={{ height: "88%" }} />
          </div>

          <div className="preview-insights">
            <p>
              <ShieldCheck size={16} />
              Protected student workspace
            </p>
            <p>
              <LineChart size={16} />
              Subject trend analysis
            </p>
            <p>
              <BookOpenCheck size={16} />
              Study recommendations
            </p>
          </div>
        </div>
      </section>

      <section className="auth-card" aria-label={isSignup ? "Create account" : "Sign in"}>
        <div className="auth-heading">
          <span className="auth-heading-icon">
            <BarChart3 size={22} />
          </span>
          <h1>{isSignup ? "Create your account" : "Sign in to your account"}</h1>
          <p>{isSignup ? "Start a protected student analytics workspace." : "Continue tracking academic progress."}</p>
        </div>

        {error && (
          <div className="form-alert" role="alert">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          {isSignup && (
            <label>
              Full name
              <input
                type="text"
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                autoComplete="name"
                placeholder="Aarav Sharma"
                required
              />
            </label>
          )}

          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
              autoComplete="email"
              placeholder="student@example.com"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(event) => updateField("password", event.target.value)}
              autoComplete={isSignup ? "new-password" : "current-password"}
              placeholder="Minimum 6 characters"
              minLength={6}
              required
            />
          </label>

          <button className="primary-action" type="submit" disabled={loading}>
            {loading ? "Please wait..." : isSignup ? "Sign up" : "Sign in"}
          </button>
        </form>

        <p className="auth-switch">
          {isSignup ? "Already have an account?" : "New to the project?"}
          <Link to={isSignup ? "/signin" : "/signup"}>
            {isSignup ? " Sign in" : " Sign up"}
          </Link>
        </p>
      </section>
    </main>
  );
}
