import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useRegisterMutation } from "../api/auth.jsx";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [register, { isLoading }] = useRegisterMutation();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.username.trim() || !form.password) {
      setError("Username and password are required.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await register({
        username: form.username.trim(),
        password: form.password,
        confirmedPassword: form.confirm,
      }).unwrap();

      setSuccess(true);
      setTimeout(() => navigate("/login"), 900);
    } catch (err) {
      const data = err?.data;
      const message =
        data?.message ||
        (typeof data === "object" && data ? Object.values(data).flat().join(" ") : null) ||
        "Registration failed.";
      setError(message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <span className="logo-mark" aria-hidden="true" />
          Tasks
        </div>
        <h1 className="auth-title">Create an account</h1>
        <p className="auth-subtitle">Set up your workspace to start tracking work.</p>

        {error && <div className="auth-message auth-error">{error}</div>}
        {success && (
          <div className="auth-message auth-success">Account created. Taking you to log in…</div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Username</label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="username"
              autoComplete="username"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="At least 6 characters"
              autoComplete="new-password"
            />
          </div>
          <div className="form-group">
            <label>Confirm password</label>
            <input
              type="password"
              name="confirm"
              value={form.confirm}
              onChange={handleChange}
              placeholder="Re-enter your password"
              autoComplete="new-password"
            />
          </div>
          <button type="submit" className="auth-submit" disabled={isLoading}>
            {isLoading ? "Creating…" : "Create account"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}
